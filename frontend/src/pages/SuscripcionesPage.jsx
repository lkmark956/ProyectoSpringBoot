import { useState, useEffect } from 'react'
import api from '../services/api'

/**
 * Página de Suscripciones - Muestra estados (ACTIVA, CANCELADA, MOROSA)
 */
function SuscripcionesPage() {
  const [suscripciones, setSuscripciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.suscripciones.getAll()
        setSuscripciones(data)
      } catch (err) {
        setError('Error al cargar suscripciones. ¿Backend activo?')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Badge de estado
  const EstadoBadge = ({ estado }) => {
    const colors = {
      ACTIVA: 'bg-green-500',
      CANCELADA: 'bg-red-500',
      MOROSA: 'bg-yellow-500',
      SUSPENDIDA: 'bg-gray-500',
      PRUEBA: 'bg-blue-500',
    }
    return (
      <span className={`${colors[estado] || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
        {estado}
      </span>
    )
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Cargando suscripciones...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📝 Gestión de Suscripciones</h1>
          <p className="text-gray-600 mt-1">Estados: ACTIVA, CANCELADA, MOROSA</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-secondary-500 to-secondary-700 text-white">
            <tr>
              <th className="px-6 py-4 text-left">ID</th>
              <th className="px-6 py-4 text-left">Usuario</th>
              <th className="px-6 py-4 text-left">Plan</th>
              <th className="px-6 py-4 text-left">Fecha Inicio</th>
              <th className="px-6 py-4 text-left">Precio</th>
              <th className="px-6 py-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {suscripciones.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  <div className="text-5xl mb-4">📝</div>
                  <p className="text-xl">No hay suscripciones registradas</p>
                </td>
              </tr>
            ) : (
              suscripciones.map((sub) => (
                <tr key={sub.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-600">{sub.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{sub.usuarioNombre}</td>
                  <td className="px-6 py-4 text-gray-600">{sub.planNombre}</td>
                  <td className="px-6 py-4 text-gray-600">{sub.fechaInicio}</td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    {sub.precioActual?.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 text-center">
                    <EstadoBadge estado={sub.estado} />
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

export default SuscripcionesPage
