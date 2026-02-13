import { useState, useEffect } from 'react';
import { usuariosApi, suscripcionesApi, facturasApi, planesApi } from '../services/api';

const AdminPage = () => {
  const [tab, setTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [u, s, f, p] = await Promise.all([
        usuariosApi.getAll(),
        suscripcionesApi.getAll(),
        facturasApi.getAll(),
        planesApi.getAll()
      ]);
      setUsuarios(u);
      setSuscripciones(s);
      setFacturas(f);
      setPlanes(p);
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarUsuario = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await usuariosApi.delete(id);
      setMensaje({ tipo: 'ok', texto: 'Usuario eliminado' });
      cargarDatos();
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al eliminar' });
    }
  };

  const handleMarcarPagada = async (id) => {
    try {
      await facturasApi.marcarPagada(id);
      setMensaje({ tipo: 'ok', texto: 'Factura marcada como pagada' });
      cargarDatos();
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al actualizar' });
    }
  };

  const handleCancelarSuscripcion = async (id) => {
    try {
      await suscripcionesApi.cancelar(id);
      setMensaje({ tipo: 'ok', texto: 'Suscripción cancelada' });
      cargarDatos();
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error al cancelar' });
    }
  };

  const formatPrecio = (p) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);
  const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-ES') : '-';

  const estadoColor = (e) => {
    const colores = {
      ACTIVA: 'bg-green-100 text-green-700',
      CANCELADA: 'bg-gray-100 text-gray-600',
      MOROSA: 'bg-red-100 text-red-700',
      PAGADA: 'bg-green-100 text-green-700',
      PENDIENTE: 'bg-yellow-100 text-yellow-700',
      VENCIDA: 'bg-red-100 text-red-700'
    };
    return colores[e] || 'bg-gray-100 text-gray-600';
  };

  // Stats
  const stats = {
    usuarios: usuarios.length,
    susActivas: suscripciones.filter(s => s.estado === 'ACTIVA').length,
    facturasTotal: facturas.reduce((acc, f) => acc + (f.total || 0), 0),
    facturasPendientes: facturas.filter(f => f.estado === 'PENDIENTE').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-lg font-semibold text-gray-900 mb-6">Panel de Administración</h1>

      {mensaje.texto && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          mensaje.tipo === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
        }`}>
          {mensaje.texto}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-500">Usuarios</p>
          <p className="text-2xl font-bold text-gray-900">{stats.usuarios}</p>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-500">Suscripciones activas</p>
          <p className="text-2xl font-bold text-gray-900">{stats.susActivas}</p>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-500">Ingresos totales</p>
          <p className="text-2xl font-bold text-gray-900">{formatPrecio(stats.facturasTotal)}</p>
        </div>
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
          <p className="text-sm text-gray-500">Facturas pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.facturasPendientes}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {[
          { id: 'usuarios', label: 'Usuarios' },
          { id: 'suscripciones', label: 'Suscripciones' },
          { id: 'facturas', label: 'Facturas' },
          { id: 'planes', label: 'Planes' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === t.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido tabs */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {tab === 'usuarios' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">País</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{u.id}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{u.nombre} {u.apellidos}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-gray-600">{u.pais || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEliminarUsuario(u.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'suscripciones' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Usuario</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Inicio</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suscripciones.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{s.id}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{s.usuarioNombre || `Usuario #${s.usuarioId}`}</td>
                  <td className="px-4 py-3 text-gray-600">{s.planNombre}</td>
                  <td className="px-4 py-3 text-gray-900">{formatPrecio(s.precioActual)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatFecha(s.fechaInicio)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColor(s.estado)}`}>
                      {s.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {s.estado === 'ACTIVA' && (
                      <button
                        onClick={() => handleCancelarSuscripcion(s.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'facturas' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Nº Factura</th>
                <th className="px-4 py-3 font-medium">Usuario</th>
                <th className="px-4 py-3 font-medium">Concepto</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Emisión</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {facturas.map(f => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">{f.numeroFactura}</td>
                  <td className="px-4 py-3 text-gray-600">{f.usuarioNombre || `Usuario #${f.usuarioId}`}</td>
                  <td className="px-4 py-3 text-gray-600">{f.concepto}</td>
                  <td className="px-4 py-3 text-gray-900">{formatPrecio(f.total)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatFecha(f.fechaEmision)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColor(f.estado)}`}>
                      {f.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {f.estado === 'PENDIENTE' && (
                      <button
                        onClick={() => handleMarcarPagada(f.id)}
                        className="text-green-600 hover:text-green-700 text-sm"
                      >
                        Marcar pagada
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'planes' && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Precio/mes</th>
                <th className="px-4 py-3 font-medium">Usuarios</th>
                <th className="px-4 py-3 font-medium">Almacenamiento</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {planes.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{p.id}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{p.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{p.tipoPlan}</td>
                  <td className="px-4 py-3 text-gray-900">{formatPrecio(p.precioMensual)}</td>
                  <td className="px-4 py-3 text-gray-600">{p.maxUsuarios || '∞'}</td>
                  <td className="px-4 py-3 text-gray-600">{p.almacenamientoGb} GB</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {p.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        {tab === 'usuarios' && `${usuarios.length} usuarios`}
        {tab === 'suscripciones' && `${suscripciones.length} suscripciones`}
        {tab === 'facturas' && `${facturas.length} facturas`}
        {tab === 'planes' && `${planes.length} planes`}
      </p>
    </div>
  );
};

export default AdminPage;
