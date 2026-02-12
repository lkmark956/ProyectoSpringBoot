import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, Calendar, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { usuariosApi, planesApi } from '../services/api';
import api from '../services/api';

export default function MiPerfilPage({ userData }) {
  const [usuario, setUsuario] = useState(null);
  const [suscripcion, setSuscripcion] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [userData]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [usuarioData, planesData, suscripcionesData] = await Promise.all([
        usuariosApi.getById(userData.id),
        planesApi.getActivos(),
        api.get(`/api/suscripciones/usuario/${userData.id}`).then(r => r.data)
      ]);
      setUsuario(usuarioData);
      setPlanes(planesData);
      setSuscripcion(suscripcionesData.find(s => s.estado === 'ACTIVA') || suscripcionesData[0] || null);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRenovacion = async () => {
    if (!suscripcion) return;
    try {
      const updated = await api.put(`/api/suscripciones/${suscripcion.id}`, {
        ...suscripcion,
        renovacionAutomatica: !suscripcion.renovacionAutomatica
      }).then(r => r.data);
      setSuscripcion(updated);
    } catch (err) {
      console.error('Error al actualizar:', err);
    }
  };

  const cancelarSuscripcion = async () => {
    if (!suscripcion || !confirm('¿Estás seguro de cancelar tu suscripción?')) return;
    try {
      const updated = await api.put(`/api/suscripciones/${suscripcion.id}/cancelar`).then(r => r.data);
      setSuscripcion(updated);
    } catch (err) {
      console.error('Error al cancelar:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const estadoColor = {
    ACTIVA: 'bg-green-100 text-green-800',
    CANCELADA: 'bg-red-100 text-red-800',
    MOROSA: 'bg-yellow-100 text-yellow-800',
    PENDIENTE: 'bg-blue-100 text-blue-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Información Personal */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Información Personal
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{usuario?.perfil?.nombre} {usuario?.perfil?.apellidos}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{usuario?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">{usuario?.perfil?.telefono || 'No especificado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-medium">
                    {usuario?.perfil?.ciudad && usuario?.perfil?.pais 
                      ? `${usuario.perfil.ciudad}, ${usuario.perfil.pais}`
                      : 'No especificado'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Suscripción Actual */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Mi Suscripción
            </h2>
            {suscripcion ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Plan</span>
                  <span className="font-bold text-blue-600">{suscripcion.planNombre}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Estado</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColor[suscripcion.estado]}`}>
                    {suscripcion.estado}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Precio</span>
                  <span className="font-medium">{suscripcion.precioActual?.toFixed(2)} €/mes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Inicio</span>
                  <span className="font-medium">{suscripcion.fechaInicio}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Renovación auto.</span>
                  <button
                    onClick={toggleRenovacion}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                      suscripcion.renovacionAutomatica 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {suscripcion.renovacionAutomatica ? (
                      <><CheckCircle className="w-3 h-3" /> Activa</>
                    ) : (
                      <><XCircle className="w-3 h-3" /> Desactivada</>
                    )}
                  </button>
                </div>
                
                {suscripcion.estado === 'ACTIVA' && (
                  <button
                    onClick={cancelarSuscripcion}
                    className="w-full mt-4 py-2 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium"
                  >
                    Cancelar Suscripción
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">No tienes una suscripción activa</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Ver Planes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Planes Disponibles */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Planes Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planes.map(plan => (
              <div 
                key={plan.id} 
                className={`bg-white rounded-lg shadow p-5 border-2 ${
                  suscripcion?.planId === plan.id ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <h3 className="font-bold text-lg">{plan.nombre}</h3>
                <p className="text-2xl font-bold text-blue-600 my-2">
                  {plan.precioMensual?.toFixed(2)} €<span className="text-sm text-gray-500">/mes</span>
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {plan.almacenamientoGb} GB almacenamiento</li>
                  <li>• Hasta {plan.maxUsuarios} usuarios</li>
                  {plan.soportePrioritario && <li>• Soporte prioritario</li>}
                </ul>
                {suscripcion?.planId === plan.id ? (
                  <div className="mt-4 py-2 text-center bg-blue-50 text-blue-600 rounded text-sm font-medium">
                    Plan Actual
                  </div>
                ) : (
                  <button className="mt-4 w-full py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium">
                    Cambiar a este plan
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
