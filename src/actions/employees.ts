'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createHash, randomBytes, randomUUID } from 'crypto'

type EmployeeMeta = {
  acl: Record<string, boolean>
  access: {
    username?: string
    code?: string
    passwordHash?: string
    passwordSalt?: string
  }
  workLogs: Array<{
    id: string
    date: string
    hours: number
    note?: string
  }>
}

function hashPassword(password: string, salt: string) {
  return createHash('sha256').update(`${salt}:${password}`).digest('hex')
}

function toEmployeeMeta(rawPermissions: string | null): EmployeeMeta {
  if (!rawPermissions) {
    return { acl: {}, access: {}, workLogs: [] }
  }

  try {
    const parsed = JSON.parse(rawPermissions) as any

    // Legacy format: permissions as flat boolean object
    const hasNested = parsed && typeof parsed === 'object' && ('acl' in parsed || 'access' in parsed || 'workLogs' in parsed)
    if (!hasNested) {
      return {
        acl: parsed && typeof parsed === 'object' ? parsed : {},
        access: {},
        workLogs: []
      }
    }

    return {
      acl: parsed.acl && typeof parsed.acl === 'object' ? parsed.acl : {},
      access: parsed.access && typeof parsed.access === 'object' ? parsed.access : {},
      workLogs: Array.isArray(parsed.workLogs) ? parsed.workLogs : []
    }
  } catch {
    return { acl: {}, access: {}, workLogs: [] }
  }
}

function serializeEmployeeMeta(meta: EmployeeMeta) {
  return JSON.stringify(meta)
}

/**
 * Crea un nuevo empleado
 * @param data - Datos del empleado
 * @returns Empleado creado
 */
export async function createEmployee(data: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: 'OWNER' | 'MANAGER' | 'CASHIER' | 'CHEF' | 'STAFF' | 'VIEWER'
  salary?: number
  startDate: Date
  permissions?: Record<string, boolean>
  loginUsername?: string
  accessCode?: string
  password?: string
}) {
  try {
    const { loginUsername, accessCode, password, permissions, ...employeeData } = data

    // Verificar que el email sea único
    const existing = await prisma.employee.findUnique({
      where: { email: data.email }
    })

    if (existing) {
      throw new Error(`El empleado con email ${data.email} ya existe`)
    }

    const employee = await prisma.employee.create({
      data: {
        ...employeeData,
        permissions: (() => {
          const baseMeta: EmployeeMeta = {
            acl: permissions || {},
            access: {},
            workLogs: []
          }

          if (loginUsername) {
            baseMeta.access.username = loginUsername.trim().toLowerCase()
          }
          if (accessCode) {
            baseMeta.access.code = accessCode.trim().toUpperCase()
          }
          if (password) {
            const salt = randomBytes(8).toString('hex')
            baseMeta.access.passwordSalt = salt
            baseMeta.access.passwordHash = hashPassword(password, salt)
          }

          return serializeEmployeeMeta(baseMeta)
        })()
      }
    })

    revalidatePath('/admin/employees')
    return employee
  } catch (error) {
    console.error('Error creating employee:', error)
    throw error
  }
}

/**
 * Actualiza un empleado
 * @param employeeId - ID del empleado
 * @param data - Datos a actualizar
 * @returns Empleado actualizado
 */
export async function updateEmployee(
  employeeId: string,
  data: Partial<{
    firstName: string
    lastName: string
    email: string
    phone: string
    role: 'OWNER' | 'MANAGER' | 'CASHIER' | 'CHEF' | 'STAFF' | 'VIEWER'
    salary: number
    permissions: Record<string, boolean>
    isActive: boolean
    loginUsername: string
    accessCode: string
    password: string
  }>
) {
  try {
    const {
      loginUsername,
      accessCode,
      password,
      permissions,
      ...employeeData
    } = data

    const current = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { permissions: true }
    })

    if (!current) {
      throw new Error('Empleado no encontrado')
    }

    const meta = toEmployeeMeta(current.permissions)

    if (loginUsername !== undefined) {
      const normalized = loginUsername.trim().toLowerCase()
      if (normalized) meta.access.username = normalized
      else delete meta.access.username
    }

    if (accessCode !== undefined) {
      const normalized = accessCode.trim().toUpperCase()
      if (normalized) meta.access.code = normalized
      else delete meta.access.code
    }

    if (password !== undefined) {
      const normalized = password.trim()
      if (normalized) {
        const salt = randomBytes(8).toString('hex')
        meta.access.passwordSalt = salt
        meta.access.passwordHash = hashPassword(normalized, salt)
      }
    }

    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        ...employeeData,
        permissions: permissions
          ? serializeEmployeeMeta({ ...meta, acl: permissions })
          : serializeEmployeeMeta(meta)
      }
    })

    revalidatePath('/admin/employees')
    return employee
  } catch (error) {
    console.error('Error updating employee:', error)
    throw error
  }
}

/**
 * Obtiene todos los empleados
 * @param isActive - Filtrar solo activos (opcional)
 * @returns Lista de empleados
 */
export async function getAllEmployees(isActive?: boolean) {
  try {
    const employees = await prisma.employee.findMany({
      where: isActive !== undefined ? { isActive } : {},
      include: { user: { select: { email: true } } },
      orderBy: { createdAt: 'desc' }
    })

    return employees.map((emp: any) => ({
      ...emp,
      permissions: toEmployeeMeta(emp.permissions).acl,
      access: toEmployeeMeta(emp.permissions).access,
      workLogs: toEmployeeMeta(emp.permissions).workLogs
    }))
  } catch (error) {
    console.error('Error fetching employees:', error)
    throw error
  }
}

/**
 * Obtiene un empleado por ID
 * @param employeeId - ID del empleado
 * @returns Empleado
 */
export async function getEmployee(employeeId: string) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { user: true }
    })

    if (!employee) {
      throw new Error(`Empleado ${employeeId} no encontrado`)
    }

    const meta = toEmployeeMeta(employee.permissions)

    return {
      ...employee,
      permissions: meta.acl,
      access: meta.access,
      workLogs: meta.workLogs
    }
  } catch (error) {
    console.error('Error fetching employee:', error)
    throw error
  }
}

/**
 * Desactiva un empleado (soft delete)
 * @param employeeId - ID del empleado
 * @returns Empleado desactivado
 */
export async function deactivateEmployee(employeeId: string) {
  try {
    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: { isActive: false }
    })

    revalidatePath('/admin/employees')
    return employee
  } catch (error) {
    console.error('Error deactivating employee:', error)
    throw error
  }
}

/**
 * Actualiza permisos de un empleado
 * @param employeeId - ID del empleado
 * @param permissions - Objeto con permisos
 * @returns Empleado actualizado
 */
export async function updateEmployeePermissions(
  employeeId: string,
  permissions: Record<string, boolean>
) {
  try {
    const current = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { permissions: true }
    })

    if (!current) {
      throw new Error('Empleado no encontrado')
    }

    const meta = toEmployeeMeta(current.permissions)
    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        permissions: serializeEmployeeMeta({
          ...meta,
          acl: permissions
        })
      }
    })

    revalidatePath('/admin/employees')
    return {
      ...employee,
      permissions
    }
  } catch (error) {
    console.error('Error updating permissions:', error)
    throw error
  }
}

export async function setEmployeeAccessCredentials(
  employeeId: string,
  data: { username: string; password?: string; code: string }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { permissions: true }
    })

    if (!employee) throw new Error('Empleado no encontrado')

    const meta = toEmployeeMeta(employee.permissions)
    meta.access.username = data.username.trim().toLowerCase()
    meta.access.code = data.code.trim().toUpperCase()

    if (data.password && data.password.trim()) {
      const salt = randomBytes(8).toString('hex')
      meta.access.passwordSalt = salt
      meta.access.passwordHash = hashPassword(data.password.trim(), salt)
    }

    await prisma.employee.update({
      where: { id: employeeId },
      data: { permissions: serializeEmployeeMeta(meta) }
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error setting employee access credentials:', error)
    throw error
  }
}

export async function addEmployeeWorkLog(
  employeeId: string,
  data: { date: string; hours: number; note?: string }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { permissions: true }
    })

    if (!employee) throw new Error('Empleado no encontrado')

    const meta = toEmployeeMeta(employee.permissions)
    const hours = Number(data.hours)
    if (!Number.isFinite(hours) || hours <= 0) {
      throw new Error('Horas inválidas')
    }

    meta.workLogs = [
      {
        id: randomUUID(),
        date: data.date,
        hours,
        note: data.note?.trim() || undefined
      },
      ...meta.workLogs
    ].slice(0, 365)

    await prisma.employee.update({
      where: { id: employeeId },
      data: { permissions: serializeEmployeeMeta(meta) }
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error adding employee work log:', error)
    throw error
  }
}

export async function removeEmployeeWorkLog(employeeId: string, workLogId: string) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: { permissions: true }
    })

    if (!employee) throw new Error('Empleado no encontrado')

    const meta = toEmployeeMeta(employee.permissions)
    meta.workLogs = meta.workLogs.filter((log) => log.id !== workLogId)

    await prisma.employee.update({
      where: { id: employeeId },
      data: { permissions: serializeEmployeeMeta(meta) }
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Error removing employee work log:', error)
    throw error
  }
}

export async function verifyEmployeeAccess(input: { username: string; password: string; code: string }) {
  try {
    const employees = await prisma.employee.findMany({
      where: { isActive: true }
    })

    const username = input.username.trim().toLowerCase()
    const code = input.code.trim().toUpperCase()

    for (const employee of employees) {
      const meta = toEmployeeMeta(employee.permissions)
      if (!meta.access.username || !meta.access.code || !meta.access.passwordHash || !meta.access.passwordSalt) continue
      if (meta.access.username !== username) continue
      if (meta.access.code !== code) continue

      const providedHash = hashPassword(input.password, meta.access.passwordSalt)
      if (providedHash === meta.access.passwordHash) {
        return {
          success: true,
          employee: {
            id: employee.id,
            name: `${employee.firstName} ${employee.lastName}`,
            role: employee.role
          }
        }
      }
    }

    return { success: false }
  } catch (error) {
    console.error('Error verifying employee access:', error)
    throw error
  }
}

/**
 * Obtiene permisos predefinidos según rol
 * @param role - Rol del empleado
 * @returns Objeto con permisos predeterminados
 */
export async function getDefaultPermissionsByRole(
  role: 'OWNER' | 'MANAGER' | 'CASHIER' | 'CHEF' | 'STAFF' | 'VIEWER'
): Promise<Record<string, boolean>> {
  const basePermissions = {
    // Visualización
    view_dashboard: true,
    view_orders: true,
    view_products: true,
    view_analytics: false,
    view_employees: false,
    view_delivery: false,
    view_settings: false,

    // Órdenes
    create_order: false,
    edit_order: false,
    cancel_order: false,
    complete_order: false,

    // Productos
    create_product: false,
    edit_product: false,
    delete_product: false,

    // Empleados
    manage_employees: false,
    view_payroll: false,

    // Delivery
    manage_delivery: false,
    sync_delivery: false,

    // Configuración
    manage_settings: false,
    manage_integrations: false
  }

  const rolePermissions: Record<
    string,
    Record<string, boolean>
  > = {
    OWNER: {
      ...basePermissions,
      view_dashboard: true,
      view_orders: true,
      view_products: true,
      view_analytics: true,
      view_employees: true,
      view_delivery: true,
      view_settings: true,
      create_order: true,
      edit_order: true,
      cancel_order: true,
      complete_order: true,
      create_product: true,
      edit_product: true,
      delete_product: true,
      manage_employees: true,
      view_payroll: true,
      manage_delivery: true,
      sync_delivery: true,
      manage_settings: true,
      manage_integrations: true
    },
    MANAGER: {
      ...basePermissions,
      view_dashboard: true,
      view_orders: true,
      view_products: true,
      view_analytics: true,
      view_employees: true,
      view_delivery: true,
      create_order: true,
      edit_order: true,
      cancel_order: true,
      complete_order: true,
      create_product: true,
      edit_product: true,
      manage_delivery: true,
      sync_delivery: true
    },
    CASHIER: {
      ...basePermissions,
      view_dashboard: true,
      view_orders: true,
      view_products: true,
      create_order: true,
      edit_order: true,
      complete_order: true
    },
    CHEF: {
      ...basePermissions,
      view_orders: true,
      view_products: true,
      complete_order: true
    },
    STAFF: {
      ...basePermissions,
      view_orders: true,
      view_products: true
    },
    VIEWER: {
      ...basePermissions
    }
  }

  return rolePermissions[role] || basePermissions
}

/**
 * Obtiene estadísticas de empleados
 * @returns Estadísticas
 */
export async function getEmployeeStats() {
  try {
    const total = await prisma.employee.count()
    const active = await prisma.employee.count({ where: { isActive: true } })
    const byRole = await prisma.employee.groupBy({
      by: ['role'],
      _count: true
    })

    return {
      total,
      active,
      inactive: total - active,
      byRole: Object.fromEntries(byRole.map((r: any) => [r.role, r._count]))
    }
  } catch (error) {
    console.error('Error fetching employee stats:', error)
    throw error
  }
}
