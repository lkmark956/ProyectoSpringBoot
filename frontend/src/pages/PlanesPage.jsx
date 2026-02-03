import { useState, useEffect } from 'react'
import api from '../services/api'

/**
 * Página de Planes - CRUD completo
 * Valida que Plan (Basic, Premium, Enterprise) se guarda correctamente
 */
function PlanesPage() {
  const [planes, setPlanes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState(null)

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    tipoPlan: 'BASIC',
    precioMensual: '',
    descripcion: '',
    maxUsuarios: '',
    almacenamientoGb: '',
    soportePrioritario: false,
    activo: true,
  })

  // Cargar planes
  const fetchPlanes = async () => {
    try {
      setLoading(true)
      const data = await api.planes.getAll()
      setPlanes(data)
      setError(null)
    } catch (err) {
      setError('Error al cargar los planes. ¿Está el backend corriendo en puerto 8080?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlanes()
  }, [])

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Abrir formulario para nuevo plan
  const handleNew = () => {
    setEditingPlan(null)
    setFormData({
      nombre: '',
      tipoPlan: 'BASIC',
      precioMensual: '',
      descripcion: '',
      maxUsuarios: '',
      almacenamientoGb: '',
      soportePrioritario: false,
      activo: true,
    })
    setShowForm(true)
  }

  // Abrir formulario para editar
  const handleEdit = (plan) => {
    setEditingPlan(plan)
    setFormData({
      nombre: plan.nombre,
      tipoPlan: plan.tipoPlan,
      precioMensual: plan.precioMensual,
      descripcion: plan.descripcion || '',
      maxUsuarios: plan.maxUsuarios || '',
      almacenamientoGb: plan.almacenamientoGb || '',
      soportePrioritario: plan.soportePrioritario || false,
      activo: plan.activo !== false,
    })
    setShowForm(true)
  }

  // Guardar plan (crear o actualizar)
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const planData = {
        ...formData,
        precioMensual: parseFloat(formData.precioMensual),
        maxUsuarios: parseInt(formData.maxUsuarios) || null,
        almacenamientoGb: parseInt(formData.almacenamientoGb) || null,
      }

      if (editingPlan) {
        await api.planes.update(editingPlan.id, planData)
        setMensaje(`✅ Plan "${planData.nombre}" actualizado correctamente`)
      } else {
        await api.planes.create(planData)
        setMensaje(`✅ Plan "${planData.nombre}" (${planData.tipoPlan}) creado correctamente`)
      }

      setShowForm(false)
      fetchPlanes()
      setTimeout(() => setMensaje(null), 4000)
    } catch (err) {
      setMensaje(`❌ Error: ${err.message}`)
    }
  }

  // Eliminar plan
  const handleDelete = async (plan) => {
    if (!confirm(`¿Eliminar el plan "${plan.nombre}"?`)) return
    
    try {
      await api.planes.delete(plan.id)
      setMensaje(`🗑️ Plan "${plan.nombre}" eliminado`)
      fetchPlanes()
      setTimeout(() => setMensaje(null), 4000)
    } catch (err) {
      setMensaje(`❌ Error al eliminar: ${err.message}`)
    }
  }

  // Badge de tipo de plan
  const TipoBadge = ({ tipo }) => {
    const colors = {
      BASIC: 'bg-gray-500',
      PREMIUM: 'bg-primary-500',
      ENTERPRISE: 'bg-secondary-500',
    }
    return (
      <span className={`${colors[tipo]} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
        {tipo}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-500">Cargando planes...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📋 Gestión de Planes</h1>
          <p className="text-gray-600 mt-1">Administra los planes de suscripción</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
        >
          ➕ Nuevo Plan
        </button>
      </div>

      {/* Mensaje */}
      {mensaje && (
        <div className={`p-4 rounded-lg mb-6 ${mensaje.includes('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {mensaje}
        </div>
      )}

      {/* Error de conexión */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <p className="text-red-700 font-semibold">{error}</p>
          <p className="text-red-600 text-sm mt-1">
            Ejecuta: <code className="bg-red-200 px-2 py-1 rounded">mvnw spring-boot:run</code> en el backend
          </p>
        </div>
      )}

      {/* Formulario Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">
              {editingPlan ? '✏️ Editar Plan' : '➕ Nuevo Plan'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nombre del Plan *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="Ej: Plan Profesional"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tipo de Plan *
                  </label>
                  <select
                    name="tipoPlan"
                    value={formData.tipoPlan}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  >
                    <option value="BASIC">🥉 BASIC</option>
                    <option value="PREMIUM">🥈 PREMIUM</option>
                    <option value="ENTERPRISE">🥇 ENTERPRISE</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Precio Mensual (€) *
                  </label>
                  <input
                    type="number"
                    name="precioMensual"
                    value={formData.precioMensual}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="29.99"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Almacenamiento (GB)
                  </label>
                  <input
                    type="number"
                    name="almacenamientoGb"
                    value={formData.almacenamientoGb}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Máx. Usuarios
                  </label>
                  <input
                    type="number"
                    name="maxUsuarios"
                    value={formData.maxUsuarios}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                  placeholder="Describe las características del plan..."
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="soportePrioritario"
                    checked={formData.soportePrioritario}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-500 rounded"
                  />
                  <span className="text-gray-700">Soporte Prioritario 24/7</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary-500 rounded"
                  />
                  <span className="text-gray-700">Plan Activo</span>
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-2 rounded-full font-semibold shadow-lg"
                >
                  💾 Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de Planes */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-secondary-500 to-secondary-700 text-white">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Nombre</th>
              <th className="px-6 py-4 text-left">Tipo</th>
              <th className="px-6 py-4 text-left">Precio</th>
              <th className="px-6 py-4 text-left">Almacenamiento</th>
              <th className="px-6 py-4 text-left">Usuarios</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {planes.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <div className="text-5xl mb-4">📋</div>
                  <p className="text-xl">No hay planes disponibles</p>
                  <button
                    onClick={handleNew}
                    className="mt-4 text-primary-500 hover:text-primary-600 font-semibold"
                  >
                    ➕ Crear el primer plan
                  </button>
                </td>
              </tr>
            ) : (
              planes.map((plan) => (
                <tr key={plan.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-600">{plan.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{plan.nombre}</td>
                  <td className="px-6 py-4">
                    <TipoBadge tipo={plan.tipoPlan} />
                  </td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    {plan.precioMensual?.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {plan.almacenamientoGb ? `${plan.almacenamientoGb} GB` : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {plan.maxUsuarios || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(plan)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PlanesPage
