import { useState, useEffect } from 'react';
import { suscripcionesApi, planesApi } from '../services/api';

const PlanesPage = ({ userData }) => {
  const [suscripcionActiva, setSuscripcionActiva] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => { cargarDatos(); }, [userData]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [subs, plans] = await Promise.all([
        suscripcionesApi.getByUsuario(userData.id),
        planesApi.getActivos()
      ]);
      // Solo mostrar la suscripción activa
      const activa = subs.find(s => s.estado === 'ACTIVA');
      setSuscripcionActiva(activa || null);
      setPlanes(plans);
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al cargar datos' });
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarPlan = async (planId) => {
    setActionLoading(planId);
    setMensaje({ tipo: '', texto: '' });
    try {
      await suscripcionesApi.create({
        usuarioId: userData.id,
        planId,
        fechaInicio: new Date().toISOString().split('T')[0],
        estado: 'ACTIVA',
        renovacionAutomatica: true
      });
      setMensaje({ tipo: 'ok', texto: 'Plan actualizado correctamente' });
      await cargarDatos();
    } catch (err) {
      console.error('Error al cambiar plan:', err);
      setMensaje({ tipo: 'error', texto: 'Error al cambiar de plan' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelar = async () => {
    if (!suscripcionActiva || !confirm('¿Cancelar tu suscripción?')) return;
    setActionLoading('cancel');
    try {
      await suscripcionesApi.cancelar(suscripcionActiva.id);
      setMensaje({ tipo: 'ok', texto: 'Suscripción cancelada' });
      await cargarDatos();
    } catch (err) {
      console.error('Error al cancelar:', err);
      setMensaje({ tipo: 'error', texto: 'Error al cancelar' });
    } finally {
      setActionLoading(null);
    }
  };

  const formatPrecio = (p) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-lg font-semibold text-gray-900 mb-6">Tu plan</h1>

      {mensaje.texto && (
        <div className={`mb-6 p-3 rounded-lg text-sm ${
          mensaje.tipo === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
        }`}>
          {mensaje.texto}
        </div>
      )}

      {/* Plan actual */}
      {suscripcionActiva ? (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Plan actual</p>
              <p className="text-lg font-semibold text-gray-900">{suscripcionActiva.planNombre}</p>
              <p className="text-sm text-gray-500">{formatPrecio(suscripcionActiva.precioActual)}/mes</p>
            </div>
            <button
              onClick={handleCancelar}
              disabled={actionLoading === 'cancel'}
              className="text-sm text-red-600 hover:text-red-700"
            >
              {actionLoading === 'cancel' ? 'Cancelando...' : 'Cancelar'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 border border-gray-100 rounded-lg text-center">
          <p className="text-gray-500 text-sm">No tienes ningún plan activo</p>
        </div>
      )}

      {/* Planes disponibles */}
      <h2 className="text-sm font-medium text-gray-500 mb-4">Planes disponibles</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {planes.map((plan) => {
          const esActual = suscripcionActiva?.planId === plan.id;
          
          return (
            <div
              key={plan.id}
              className={`p-5 rounded-lg border ${
                esActual ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-white'
              }`}
            >
              <h3 className="font-semibold text-gray-900">{plan.nombre}</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">{plan.descripcion}</p>
              
              <p className="text-2xl font-bold text-gray-900 mb-4">
                {formatPrecio(plan.precioMensual)}
                <span className="text-sm font-normal text-gray-400">/mes</span>
              </p>

              <ul className="space-y-2 mb-5 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {plan.maxUsuarios} usuario{plan.maxUsuarios > 1 ? 's' : ''}
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {plan.almacenamientoGb} GB
                </li>
                {plan.soportePrioritario && (
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Soporte prioritario
                  </li>
                )}
              </ul>

              <button
                onClick={() => handleCambiarPlan(plan.id)}
                disabled={esActual || actionLoading === plan.id}
                className={`w-full py-2 rounded-lg text-sm font-medium ${
                  esActual
                    ? 'bg-gray-100 text-gray-400 cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {actionLoading === plan.id
                  ? 'Cambiando...'
                  : esActual
                    ? 'Plan actual'
                    : suscripcionActiva
                      ? 'Cambiar a este plan'
                      : 'Elegir plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanesPage;
