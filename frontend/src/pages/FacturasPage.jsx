import { useState, useEffect } from 'react'
import api from '../services/api'

/**
 * Página de Facturas - Generadas automáticamente por suscripciones
 */
function FacturasPage() {
  const [facturas, setFacturas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.facturas.getAll()
        setFacturas(data)
      } catch (err) {
        setError('Error al cargar facturas. ¿Backend activo?')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Badge de estado
  const EstadoBadge = ({ estado }) => {
    const colors = {
      PENDIENTE: 'bg-yellow-500',
      PAGADA: 'bg-green-500',
      VENCIDA: 'bg-red-500',
      CANCELADA: 'bg-gray-500',
    }
    return (
      <span className={`${colors[estado] || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
        {estado}
      </span>
    )
  }

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Cargando facturas...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">🧾 Gestión de Facturas</h1>
          <p className="text-gray-600 mt-1">Facturas generadas automáticamente por suscripciones</p>
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
              <th className="px-6 py-4 text-left">Nº Factura</th>
              <th className="px-6 py-4 text-left">Usuario</th>
              <th className="px-6 py-4 text-left">Emisión</th>
              <th className="px-6 py-4 text-left">Vencimiento</th>
              <th className="px-6 py-4 text-left">Total</th>
              <th className="px-6 py-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {facturas.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  <div className="text-5xl mb-4">🧾</div>
                  <p className="text-xl">No hay facturas generadas</p>
                </td>
              </tr>
            ) : (
              facturas.map((factura) => (
                <tr key={factura.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-800">{factura.numeroFactura}</td>
                  <td className="px-6 py-4 text-gray-600">{factura.usuarioNombre}</td>
                  <td className="px-6 py-4 text-gray-600">{factura.fechaEmision}</td>
                  <td className="px-6 py-4 text-gray-600">{factura.fechaVencimiento}</td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    {factura.total?.toFixed(2)} €
                  </td>
                  <td className="px-6 py-4 text-center">
                    <EstadoBadge estado={factura.estado} />
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

export default FacturasPage
