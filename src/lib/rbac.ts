/**
 * Role-based authorization utilities
 */

export type UserRole = 'admin' | 'manager' | 'operator' | 'viewer'

interface Permission {
  viewDashboard: boolean
  managePlatforms: boolean
  viewAnalytics: boolean
  manageOrders: boolean
  viewEmployees: boolean
  manageEmployees: boolean
  viewReports: boolean
  manageSettings: boolean
  syncOrders: boolean
  viewNotifications: boolean
}

const ROLE_PERMISSIONS: Record<UserRole, Permission> = {
  admin: {
    viewDashboard: true,
    managePlatforms: true,
    viewAnalytics: true,
    manageOrders: true,
    viewEmployees: true,
    manageEmployees: true,
    viewReports: true,
    manageSettings: true,
    syncOrders: true,
    viewNotifications: true
  },
  manager: {
    viewDashboard: true,
    managePlatforms: true,
    viewAnalytics: true,
    manageOrders: true,
    viewEmployees: true,
    manageEmployees: false,
    viewReports: true,
    manageSettings: false,
    syncOrders: true,
    viewNotifications: true
  },
  operator: {
    viewDashboard: true,
    managePlatforms: false,
    viewAnalytics: true,
    manageOrders: true,
    viewEmployees: false,
    manageEmployees: false,
    viewReports: false,
    manageSettings: false,
    syncOrders: false,
    viewNotifications: true
  },
  viewer: {
    viewDashboard: true,
    managePlatforms: false,
    viewAnalytics: true,
    manageOrders: false,
    viewEmployees: false,
    manageEmployees: false,
    viewReports: false,
    manageSettings: false,
    syncOrders: false,
    viewNotifications: false
  }
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  manager: 'Gerente',
  operator: 'Operario',
  viewer: 'Visualizador'
}

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  admin: 'Control total del sistema, gestión de usuarios y configuración',
  manager: 'Gestión de operaciones, analítica y coordinación',
  operator: 'Gestión de órdenes y atención al cliente',
  viewer: 'Visualización de dashboards y reportes'
}

/**
 * Verifica si un rol tiene un permiso específico
 */
export function hasPermission(role: UserRole, permission: keyof Permission): boolean {
  return ROLE_PERMISSIONS[role][permission]
}

/**
 * Verifica si un rol tiene múltiples permisos (AND logic)
 */
export function hasAllPermissions(role: UserRole, permissions: Array<keyof Permission>): boolean {
  return permissions.every((perm) => hasPermission(role, perm))
}

/**
 * Verifica si un rol tiene al menos uno de los permisos (OR logic)
 */
export function hasAnyPermission(role: UserRole, permissions: Array<keyof Permission>): boolean {
  return permissions.some((perm) => hasPermission(role, perm))
}

/**
 * Obtiene los permisos de un rol
 */
export function getRolePermissions(role: UserRole): Permission {
  return ROLE_PERMISSIONS[role]
}

/**
 * Obtiene el label en español de un rol
 */
export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role]
}

/**
 * Obtiene la descripción de un rol
 */
export function getRoleDescription(role: UserRole): string {
  return ROLE_DESCRIPTIONS[role]
}

/**
 * Obtiene todos los roles disponibles
 */
export function getAllRoles(): UserRole[] {
  return ['admin', 'manager', 'operator', 'viewer']
}

/**
 * Obtiene los roles que un admin puede asignar (no puede asignar admin a otros)
 */
export function getAssignableRoles(currentRole: UserRole): UserRole[] {
  if (currentRole === 'admin') {
    return ['manager', 'operator', 'viewer']
  }
  return []
}

/**
 * Verifica si un rol puede ver una plataforma específica
 */
export function canViewPlatform(role: UserRole, platform: string): boolean {
  if (!hasPermission(role, 'viewDashboard')) return false

  // En el futuro, podría haber lógica más compleja
  // por ejemplo, algunos roles solo ven ciertas plataformas
  return true
}

/**
 * Obtiene las plataformas visibles para un rol
 */
export function getVisiblePlatforms(role: UserRole): string[] {
  if (!hasPermission(role, 'viewDashboard')) return []

  // Por defecto, todos pueden ver todas las plataformas
  // Personalizar según necesidades del negocio
  return ['UBEREATS', 'GLOVO', 'DELIVEROO', 'JUSTEAT']
}

/**
 * Verifica si un rol puede acceder a un módulo
 */
export function canAccessModule(role: UserRole, module: 'dashboard' | 'orders' | 'analytics' | 'employees' | 'settings'): boolean {
  switch (module) {
    case 'dashboard':
      return hasPermission(role, 'viewDashboard')
    case 'orders':
      return hasPermission(role, 'manageOrders')
    case 'analytics':
      return hasPermission(role, 'viewAnalytics')
    case 'employees':
      return hasPermission(role, 'viewEmployees')
    case 'settings':
      return hasPermission(role, 'manageSettings')
    default:
      return false
  }
}

/**
 * Obtiene los módulos accesibles para un rol
 */
export function getAccessibleModules(role: UserRole): Array<'dashboard' | 'orders' | 'analytics' | 'employees' | 'settings'> {
  const modules: Array<'dashboard' | 'orders' | 'analytics' | 'employees' | 'settings'> = []

  if (hasPermission(role, 'viewDashboard')) modules.push('dashboard')
  if (hasPermission(role, 'manageOrders')) modules.push('orders')
  if (hasPermission(role, 'viewAnalytics')) modules.push('analytics')
  if (hasPermission(role, 'viewEmployees')) modules.push('employees')
  if (hasPermission(role, 'manageSettings')) modules.push('settings')

  return modules
}
