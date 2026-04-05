'use client'

import { useState, useEffect } from 'react'
import { getAllEmployees, createEmployee, updateEmployee, deactivateEmployee, getEmployeeStats } from '@/actions/employees'

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  isActive: boolean
  startDate: Date
  salary?: number
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

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'STAFF',
    salary: '0'
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreateForm = () => {
    setFormType('create')
    setSelectedEmployee(null)
    setFormData({ firstName: '', lastName: '', email: '', role: 'STAFF', salary: '0' })
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
      salary: employee.salary?.toString() || '0'
    })
    setShowForm(true)
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
          startDate: new Date()
        })
        setSuccess('Employee created successfully!')
      } else if (selectedEmployee) {
        await updateEmployee(selectedEmployee.id, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role as any,
          salary: parseInt(formData.salary)
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
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleOpenEditForm(employee)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
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
    </div>
  )
}
