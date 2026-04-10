'use client'

import { useState, useEffect } from 'react'
import {
  addEmployeeWorkLog,
  createEmployee,
  deactivateEmployee,
  getAllEmployees,
  getEmployeeStats,
  removeEmployeeWorkLog,
  setEmployeeAccessCredentials,
  updateEmployee,
  verifyEmployeeAccess
} from '@/actions/employees'

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
  startDate: Date
  salary?: number
  access?: {
    username?: string
    code?: string
  }
  workLogs?: Array<{
    id: string
    date: string
    hours: number
    note?: string
  }>
}

interface EmployeeStats {
  total: number
  active: number
  inactive: number
  byRole: Record<string, number>
}

const ROLES = [
  { value: 'OWNER', label: 'Propietario' },
  { value: 'MANAGER', label: 'Gerente' },
  { value: 'CASHIER', label: 'Cajero' },
  { value: 'CHEF', label: 'Chef' },
  { value: 'STAFF', label: 'Personal' },
  { value: 'VIEWER', label: 'Visor (Solo lectura)' }
]

export function EmployeeManager() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [stats, setStats] = useState<EmployeeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form states
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState<'create' | 'edit'>('create')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showAccessModal, setShowAccessModal] = useState(false)
  const [accessEmployee, setAccessEmployee] = useState<Employee | null>(null)
  const [accessData, setAccessData] = useState({ username: '', code: '', password: '' })
  const [workLogData, setWorkLogData] = useState({
    date: new Date().toISOString().slice(0, 10),
    hours: '8',
    note: ''
  })
  const [verifier, setVerifier] = useState({ username: '', password: '', code: '', result: '' })

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'STAFF',
    salary: '0',
    loginUsername: '',
    accessCode: '',
    password: ''
  })

  // Load employees
  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const [employeesData, statsData] = await Promise.all([
        getAllEmployees(),
        getEmployeeStats()
      ])
      setEmployees(employeesData)
      setStats(statsData as any)
      setError(null)
      return employeesData as Employee[]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees')
      return [] as Employee[]
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreateForm = () => {
    setFormType('create')
    setSelectedEmployee(null)
    setFormData({ firstName: '', lastName: '', email: '', role: 'STAFF', salary: '0', loginUsername: '', accessCode: '', password: '' })
    setShowForm(true)
  }

  const handleOpenEditForm = (employee: Employee) => {
    setFormType('edit')
    setSelectedEmployee(employee)
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      role: employee.role,
      salary: employee.salary?.toString() || '0',
      loginUsername: employee.access?.username || '',
      accessCode: employee.access?.code || '',
      password: ''
    })
    setShowForm(true)
  }

  const handleOpenAccessModal = (employee: Employee) => {
    setAccessEmployee(employee)
    setAccessData({
      username: employee.access?.username || '',
      code: employee.access?.code || '',
      password: ''
    })
    setWorkLogData({
      date: new Date().toISOString().slice(0, 10),
      hours: '8',
      note: ''
    })
    setShowAccessModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      setError(null)

      if (formType === 'create') {
        await createEmployee({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role as any,
          salary: parseInt(formData.salary),
          startDate: new Date(),
          loginUsername: formData.loginUsername,
          accessCode: formData.accessCode,
          password: formData.password
        })
        setSuccess('Employee created successfully!')
      } else if (selectedEmployee) {
        await updateEmployee(selectedEmployee.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role as any,
          salary: parseInt(formData.salary),
          loginUsername: formData.loginUsername,
          accessCode: formData.accessCode,
          password: formData.password
        })
        setSuccess('Employee updated successfully!')
      }

      setShowForm(false)
      loadEmployees()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save employee')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeactivate = async (employee: Employee) => {
    if (!confirm(`Desactivar a ${employee.firstName} ${employee.lastName}?`)) return

    try {
      await deactivateEmployee(employee.id)
      setSuccess('Employee deactivated')
      loadEmployees()
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate employee')
    }
  }

  const handleSaveAccess = async () => {
    if (!accessEmployee) return
    if (!accessData.username.trim() || !accessData.code.trim()) {
      setError('Username y codigo son obligatorios para el acceso')
      return
    }

    try {
      setSubmitting(true)
      await setEmployeeAccessCredentials(accessEmployee.id, {
        username: accessData.username,
        code: accessData.code,
        password: accessData.password
      })
      setSuccess('Credenciales del trabajador guardadas')
      await loadEmployees()
      setShowAccessModal(false)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudieron guardar credenciales')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddWorkLog = async () => {
    if (!accessEmployee) return

    try {
      setSubmitting(true)
      await addEmployeeWorkLog(accessEmployee.id, {
        date: workLogData.date,
        hours: Number(workLogData.hours),
        note: workLogData.note
      })
      setWorkLogData((prev) => ({ ...prev, note: '' }))
      setSuccess('Jornada registrada')
      const latestEmployees = await loadEmployees()
      const refreshed = latestEmployees.find((item) => item.id === accessEmployee.id)
      if (refreshed) {
        setAccessEmployee(refreshed)
      }
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar jornada')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteWorkLog = async (workLogId: string) => {
    if (!accessEmployee) return

    try {
      setSubmitting(true)
      await removeEmployeeWorkLog(accessEmployee.id, workLogId)
      setSuccess('Jornada eliminada')
      const latestEmployees = await loadEmployees()
      const refreshed = latestEmployees.find((item) => item.id === accessEmployee.id)
      if (refreshed) {
        setAccessEmployee(refreshed)
      }
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar jornada')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVerifyAccess = async () => {
    try {
      setSubmitting(true)
      const result = await verifyEmployeeAccess({
        username: verifier.username,
        password: verifier.password,
        code: verifier.code
      })

      if (result.success && result.employee) {
        setVerifier((prev) => ({
          ...prev,
          result: `Acceso valido: ${result.employee.name} (${result.employee.role})`
        }))
      } else {
        setVerifier((prev) => ({ ...prev, result: 'Acceso invalido' }))
      }
    } catch {
      setVerifier((prev) => ({ ...prev, result: 'Error validando acceso' }))
    } finally {
      setSubmitting(false)
    }
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      OWNER: 'bg-red-100 text-red-800',
      MANAGER: 'bg-blue-100 text-blue-800',
      CASHIER: 'bg-green-100 text-green-800',
      CHEF: 'bg-yellow-100 text-yellow-800',
      STAFF: 'bg-gray-100 text-gray-800',
      VIEWER: 'bg-purple-100 text-purple-800'
    }
    return colors[role] || colors.STAFF
  }

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Empleados</h2>
          <p className="text-gray-600 text-sm mt-1">Total: {employees.length}</p>
        </div>
        <button
          onClick={handleOpenCreateForm}
          className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800"
        >
          + Nuevo Empleado
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900">Verificador rapido de login trabajador</h3>
        <p className="mt-1 text-xs text-gray-600">Comprueba usuario + contrasena + codigo antes de entregar credenciales.</p>
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-4">
          <input
            type="text"
            value={verifier.username}
            onChange={(e) => setVerifier({ ...verifier, username: e.target.value })}
            placeholder="Usuario"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={verifier.password}
            onChange={(e) => setVerifier({ ...verifier, password: e.target.value })}
            placeholder="Contrasena"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={verifier.code}
            onChange={(e) => setVerifier({ ...verifier, code: e.target.value })}
            placeholder="Codigo acceso"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            onClick={handleVerifyAccess}
            disabled={submitting}
            className="rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            Verificar
          </button>
        </div>
        {verifier.result && <p className="mt-2 text-xs text-gray-700">{verifier.result}</p>}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {ROLES.map((role) => (
            <div key={role.value} className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <p className="text-xs font-medium text-gray-600">{role.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.byRole[role.value] || 0}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal/Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">
              {formType === 'create' ? 'Nuevo Empleado' : 'Editar Empleado'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Apellido</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  {ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Salario Mensual</label>
                <div className="flex items-center mt-1">
                  <span className="text-gray-600">€</span>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="flex-1 ml-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-700">Acceso trabajador</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Usuario login</label>
                    <input
                      type="text"
                      value={formData.loginUsername}
                      onChange={(e) => setFormData({ ...formData, loginUsername: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="ej: juan.caja"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Codigo de acceso</label>
                    <input
                      type="text"
                      value={formData.accessCode}
                      onChange={(e) => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="ej: MSM-1024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contrasena</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder={formType === 'edit' ? 'Dejar vacio para mantener actual' : 'Contrasena inicial'}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50"
                >
                  {submitting ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Salario</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Inicio</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Acceso</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}>
                      {employee.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    €{employee.salary?.toLocaleString('es-ES') || '0'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(employee.startDate).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      employee.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {employee.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {employee.access?.username ? (
                      <div>
                        <p className="font-medium text-gray-900">{employee.access.username}</p>
                        <p className="text-xs text-gray-500">Codigo: {employee.access.code || '-'}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Sin acceso configurado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleOpenEditForm(employee)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleOpenAccessModal(employee)}
                      className="text-amber-600 hover:text-amber-800 font-medium"
                    >
                      Acceso/Horas
                    </button>
                    {employee.isActive && (
                      <button
                        onClick={() => handleDeactivate(employee)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Desactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employees.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-gray-600">No employees yet. Create one to get started!</p>
          </div>
        )}
      </div>

      {showAccessModal && accessEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <h3 className="text-lg font-bold text-gray-900">Acceso y jornadas · {accessEmployee.firstName} {accessEmployee.lastName}</h3>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                type="text"
                value={accessData.username}
                onChange={(e) => setAccessData({ ...accessData, username: e.target.value })}
                placeholder="Usuario login"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="password"
                value={accessData.password}
                onChange={(e) => setAccessData({ ...accessData, password: e.target.value })}
                placeholder="Nueva contrasena (opcional)"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={accessData.code}
                onChange={(e) => setAccessData({ ...accessData, code: e.target.value.toUpperCase() })}
                placeholder="Codigo acceso"
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <button
              onClick={handleSaveAccess}
              disabled={submitting}
              className="mt-3 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              Guardar credenciales
            </button>

            <div className="mt-6 rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-900">Registrar jornada</h4>
              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-4">
                <input
                  type="date"
                  value={workLogData.date}
                  onChange={(e) => setWorkLogData({ ...workLogData, date: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={workLogData.hours}
                  onChange={(e) => setWorkLogData({ ...workLogData, hours: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Horas"
                />
                <input
                  type="text"
                  value={workLogData.note}
                  onChange={(e) => setWorkLogData({ ...workLogData, note: e.target.value })}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm md:col-span-2"
                  placeholder="Nota (turno noche, extra, etc.)"
                />
              </div>

              <button
                onClick={handleAddWorkLog}
                disabled={submitting}
                className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Anadir jornada
              </button>

              <div className="mt-4 max-h-56 overflow-y-auto">
                {(accessEmployee.workLogs || []).length === 0 ? (
                  <p className="text-sm text-gray-500">Sin jornadas registradas.</p>
                ) : (
                  <div className="space-y-2">
                    {(accessEmployee.workLogs || []).map((log) => (
                      <div key={log.id} className="flex items-center justify-between rounded border border-gray-200 px-3 py-2 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{new Date(log.date).toLocaleDateString('es-ES')} · {log.hours}h</p>
                          {log.note ? <p className="text-xs text-gray-500">{log.note}</p> : null}
                        </div>
                        <button
                          onClick={() => handleDeleteWorkLog(log.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAccessModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
