import { useState, useEffect } from 'react';
import { Users, CreditCard, FileText, History, Settings, Trash2, Edit, Plus, Eye, RefreshCw } from 'lucide-react';
import { usuariosApi, planesApi, facturasApi, auditoriaApi } from '../services/api';
import api from '../services/api';

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [auditoria, setAuditoria] = useState({ suscripciones: [], usuarios: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [usuariosData, planesData, facturasData, suscripcionesData] = await Promise.all([
        usuariosApi.getAll(),
        planesApi.getAll(),
        facturasApi.getAll(),
        api.get('/api/suscripciones').then(r => r.data)
      ]);
      setUsuarios(usuariosData);
      setPlanes(planesData);
      setFacturas(facturasData);
      setSuscripciones(suscripcionesData);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const cargarAuditoria = async () => {
    try {
      const [sus, usr] = await Promise.all([
        auditoriaApi.getHistorialSuscripciones(),
        auditoriaApi.getHistorialUsuarios()
      ]);
      setAuditoria({ suscripciones: sus, usuarios: usr });
    } catch (err) {
      console.error('Error al cargar auditoría:', err);
    }
  };

  const eliminarUsuario = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await usuariosApi.delete(id);
      setUsuarios(usuarios.filter(u => u.id !== id));
    } catch (err) {
      alert('Error al eliminar usuario');
    }
  };

  const eliminarFactura = async (id) => {
    if (!confirm('¿Eliminar esta factura?')) return;
    try {
      await facturasApi.delete(id);
      setFacturas(facturas.filter(f => f.id !== id));
    } catch (err) {
      alert('Error al eliminar factura');
    }
  };

  const tabs = [
    { id: 'usuarios', label: 'Usuarios', icon: Users, count: usuarios.length },
    { id: 'suscripciones', label: 'Suscripciones', icon: CreditCard, count: suscripciones.length },
    { id: 'facturas', label: 'Facturas', icon: FileText, count: facturas.length },
    { id: 'planes', label: 'Planes', icon: Settings, count: planes.length },
    { id: 'auditoria', label: 'Auditoría', icon: History }
  ];

  const estadoColor = {
    ACTIVA: 'bg-green-100 text-green-800',
    CANCELADA: 'bg-red-100 text-red-800',
    MOROSA: 'bg-yellow-100 text-yellow-800',
    PAGADA: 'bg-green-100 text-green-800',
    PENDIENTE: 'bg-yellow-100 text-yellow-800'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <button
            onClick={cargarDatos}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" /> Actualizar
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'auditoria') cargarAuditoria();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-500' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          
          {/* USUARIOS */}
          {activeTab === 'usuarios' && (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">País</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Verificado</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Activo</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {usuarios.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{u.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {u.perfil?.nombre} {u.perfil?.apellidos}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-sm">{u.perfil?.pais || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${u.emailVerificado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.emailVerificado ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${u.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.activo ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => eliminarUsuario(u.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* SUSCRIPCIONES */}
          {activeTab === 'suscripciones' && (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inicio</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Renovación</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {suscripciones.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{s.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{s.usuarioNombre}</td>
                    <td className="px-4 py-3 text-sm text-blue-600">{s.planNombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{s.fechaInicio}</td>
                    <td className="px-4 py-3 text-sm text-right">{s.precioActual?.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColor[s.estado]}`}>
                        {s.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${s.renovacionAutomatica ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {s.renovacionAutomatica ? 'Auto' : 'Manual'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* FACTURAS */}
          {activeTab === 'facturas' && (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">IVA</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {facturas.map(f => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-blue-600">{f.numeroFactura}</td>
                    <td className="px-4 py-3 text-sm">{f.usuarioNombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{f.concepto}</td>
                    <td className="px-4 py-3 text-sm">{f.fechaEmision}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold">{f.total?.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-center text-sm">{f.porcentajeImpuestos}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColor[f.estado]}`}>
                        {f.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => eliminarFactura(f.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* PLANES */}
          {activeTab === 'planes' && (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Precio/mes</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Almacenamiento</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Max Usuarios</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Soporte</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Activo</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {planes.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{p.id}</td>
                    <td className="px-4 py-3 text-sm font-medium">{p.nombre}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{p.tipoPlan}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-blue-600">{p.precioMensual?.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right">{p.almacenamientoGb} GB</td>
                    <td className="px-4 py-3 text-sm text-right">{p.maxUsuarios}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${p.soportePrioritario ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {p.soportePrioritario ? 'Prioritario' : 'Estándar'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${p.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.activo ? 'Sí' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* AUDITORÍA */}
          {activeTab === 'auditoria' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Historial Suscripciones */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Historial de Suscripciones</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {auditoria.suscripciones.length === 0 ? (
                      <p className="text-gray-500 text-sm">Sin historial de auditoría</p>
                    ) : (
                      auditoria.suscripciones.slice(0, 20).map((item, idx) => (
                        <div key={idx} className="bg-gray-50 rounded p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">ID: {item.id}</span>
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                                item.revisionType === 'ADD' ? 'bg-green-100 text-green-700' :
                                item.revisionType === 'MOD' ? 'bg-blue-100 text-blue-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {item.revisionType}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">Rev. {item.revision}</span>
                          </div>
                          {item.estado && <p className="text-sm mt-1">Estado: {item.estado}</p>}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Historial Usuarios */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Historial de Usuarios</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {auditoria.usuarios.length === 0 ? (
                      <p className="text-gray-500 text-sm">Sin historial de auditoría</p>
                    ) : (
                      auditoria.usuarios.slice(0, 20).map((item, idx) => (
                        <div key={idx} className="bg-gray-50 rounded p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-medium">{item.email || `ID: ${item.id}`}</span>
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                                item.revisionType === 'ADD' ? 'bg-green-100 text-green-700' :
                                item.revisionType === 'MOD' ? 'bg-blue-100 text-blue-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {item.revisionType}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">Rev. {item.revision}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resumen de Impuestos */}
        {activeTab === 'facturas' && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Resumen de Impuestos por País</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(
                facturas.reduce((acc, f) => {
                  const pais = f.concepto?.split(' - ')[1] || 'Otros';
                  if (!acc[pais]) acc[pais] = { total: 0, impuestos: 0 };
                  acc[pais].total += f.total || 0;
                  acc[pais].impuestos += f.montoImpuestos || 0;
                  return acc;
                }, {})
              ).map(([pais, data]) => (
                <div key={pais} className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{pais}</p>
                  <p className="text-2xl font-bold text-blue-600">{data.total.toFixed(2)} €</p>
                  <p className="text-sm text-gray-500">Impuestos: {data.impuestos.toFixed(2)} €</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
