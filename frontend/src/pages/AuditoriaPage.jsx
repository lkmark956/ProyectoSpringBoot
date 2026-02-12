import { useState, useEffect } from 'react';
import { History, Users, CreditCard, RefreshCw, AlertCircle, CheckCircle, Edit, Trash2, Plus } from 'lucide-react';
import { auditoriaApi } from '../services/api';

function AuditoriaPage() {
  const [historialSuscripciones, setHistorialSuscripciones] = useState([]);
  const [historialUsuarios, setHistorialUsuarios] = useState([]);
  const [tabActiva, setTabActiva] = useState('suscripciones');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const [suscripciones, usuarios] = await Promise.all([
        auditoriaApi.getHistorialSuscripciones(),
        auditoriaApi.getHistorialUsuarios()
      ]);
      setHistorialSuscripciones(suscripciones);
      setHistorialUsuarios(usuarios);
    } catch (err) {
      console.error('Error cargando auditoría:', err);
      setError('Error al cargar los datos de auditoría');
    } finally {
      setLoading(false);
    }
  };

  const getOperacionBadge = (operacion) => {
    const estilos = {
      'CREACIÓN': 'bg-green-100 text-green-700',
      'MODIFICACIÓN': 'bg-blue-100 text-blue-700',
      'ELIMINACIÓN': 'bg-red-100 text-red-700'
    };
    const iconos = {
      'CREACIÓN': <Plus className="w-3 h-3" />,
      'MODIFICACIÓN': <Edit className="w-3 h-3" />,
      'ELIMINACIÓN': <Trash2 className="w-3 h-3" />
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estilos[operacion] || 'bg-gray-100'}`}>
        {iconos[operacion]} {operacion}
      </span>
    );
  };

  const getEstadoBadge = (estado) => {
    if (!estado) return '-';
    const estilos = {
      'ACTIVA': 'bg-green-100 text-green-700',
      'CANCELADA': 'bg-gray-100 text-gray-700',
      'MOROSA': 'bg-red-100 text-red-700',
      'SUSPENDIDA': 'bg-yellow-100 text-yellow-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${estilos[estado] || 'bg-gray-100'}`}>
        {estado}
      </span>
    );
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearMoneda = (valor) => {
    if (!valor) return '-';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(valor);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <History className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Panel de Auditoría</span>
                <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Admin</span>
              </div>
            </div>
            <button
              onClick={cargarDatos}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cambios en Suscripciones</p>
                <p className="text-2xl font-bold">{historialSuscripciones.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cambios en Usuarios</p>
                <p className="text-2xl font-bold">{historialUsuarios.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mb-6">
          <button
            onClick={() => setTabActiva('suscripciones')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tabActiva === 'suscripciones'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CreditCard className="w-4 h-4 inline mr-2" />
            Suscripciones
          </button>
          <button
            onClick={() => setTabActiva('usuarios')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tabActiva === 'usuarios'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Usuarios
          </button>
        </div>

        {/* Contenido de la tab */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
              Cargando historial de auditoría...
            </div>
          ) : tabActiva === 'suscripciones' ? (
            /* Tabla de Suscripciones */
            historialSuscripciones.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay registros de auditoría para suscripciones
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operación</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Auto-Renovar</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modificado por</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {historialSuscripciones.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono">{item.id}</td>
                        <td className="px-4 py-3">{getOperacionBadge(item.tipoOperacion)}</td>
                        <td className="px-4 py-3 text-sm">{item.usuarioEmail || '-'}</td>
                        <td className="px-4 py-3 text-sm font-medium">{item.planNombre || '-'}</td>
                        <td className="px-4 py-3">{getEstadoBadge(item.estado)}</td>
                        <td className="px-4 py-3 text-sm text-right">{formatearMoneda(item.precioActual)}</td>
                        <td className="px-4 py-3 text-center">
                          {item.renovacionAutomatica ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.modificadoPor || 'Sistema'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatearFecha(item.fechaModificacion)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            /* Tabla de Usuarios */
            historialUsuarios.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay registros de auditoría para usuarios
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operación</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Activo</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Email Verificado</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creación</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última Modificación</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último Acceso</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {historialUsuarios.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono">{item.id}</td>
                        <td className="px-4 py-3">{getOperacionBadge(item.tipoOperacion)}</td>
                        <td className="px-4 py-3 text-sm">{item.email}</td>
                        <td className="px-4 py-3 text-center">
                          {item.activo ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                          ) : (
                            <span className="text-red-600">No</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.emailVerificado ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatearFecha(item.fechaCreacion)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatearFecha(item.fechaModificacion)}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatearFecha(item.ultimoAcceso)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

        {/* Info sobre Envers */}
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">Sobre la Auditoría</h4>
          <p className="text-sm text-purple-700">
            Este panel utiliza <strong>Hibernate Envers</strong> para rastrear automáticamente todos los cambios
            en las entidades auditadas (Usuario, Suscripción, Factura). Cada modificación queda registrada
            con el usuario que la realizó y la fecha exacta del cambio.
          </p>
        </div>
      </main>
    </div>
  );
}

export default AuditoriaPage;
