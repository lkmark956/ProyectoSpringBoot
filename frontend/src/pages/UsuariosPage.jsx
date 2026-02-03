import { useState, useEffect } from 'react'
import api from '../services/api'

/**
 * Página de Usuarios - Lista y gestión básica
 */
function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.usuarios.getAll()
        setUsuarios(data)
      } catch (err) {
        setError('Error al cargar usuarios. ¿Backend activo?')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Cargando usuarios...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">👥 Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">Usuarios registrados en la plataforma</p>
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
              <th className="px-6 py-4 text-left">Nombre</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Teléfono</th>
              <th className="px-6 py-4 text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  <div className="text-5xl mb-4">👥</div>
                  <p className="text-xl">No hay usuarios registrados</p>
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-600">{usuario.id}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {usuario.nombre} {usuario.apellido}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{usuario.email}</td>
                  <td className="px-6 py-4 text-gray-600">{usuario.telefono || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      usuario.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {usuario.activo ? '✓ Activo' : '✗ Inactivo'}
                    </span>
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

export default UsuariosPage
