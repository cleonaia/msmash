'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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
}) {
  try {
    // Verificar que el email sea único
    const existing = await prisma.employee.findUnique({
      where: { email: data.email }
    })

    if (existing) {
      throw new Error(`El empleado con email ${data.email} ya existe`)
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        permissions: data.permissions ? JSON.stringify(data.permissions) : null
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
  }>
) {
  try {
    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        ...data,
        permissions: data.permissions ? JSON.stringify(data.permissions) : undefined
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
      permissions: emp.permissions ? JSON.parse(emp.permissions) : {}
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

    return {
      ...employee,
      permissions: employee.permissions ? JSON.parse(employee.permissions) : {}
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
    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        permissions: JSON.stringify(permissions)
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
