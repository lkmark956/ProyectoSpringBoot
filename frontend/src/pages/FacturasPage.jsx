import { useState, useEffect } from 'react';
import { FileText, Filter, Calendar, DollarSign, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react';
import { facturasApi } from '../services/api';

function FacturasPage() {
  const [facturas, setFacturas] = useState([]);
  const [impuestos, setImpuestos] = useState({});
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    tipo: 'todas', // todas, fecha, monto, estado
    fechaInicio: '',
    fechaFin: '',
    montoMin: '',
    montoMax: '',
    estado: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [facturasData, impuestosData] = await Promise.all([
        facturasApi.getAll(),
        facturasApi.getImpuestos()
      ]);
      setFacturas(facturasData);
      setImpuestos(impuestosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = async () => {
    try {
      setLoading(true);
      let resultado;

      switch (filtros.tipo) {
        case 'fecha':
          if (filtros.fechaInicio && filtros.fechaFin) {
            resultado = await facturasApi.filtrarPorFecha(filtros.fechaInicio, filtros.fechaFin);
          }
          break;
        case 'monto':
          if (filtros.montoMin && filtros.montoMax) {
            resultado = await facturasApi.filtrarPorMonto(filtros.montoMin, filtros.montoMax);
          }
          break;
        case 'estado':
          if (filtros.estado) {
            resultado = await facturasApi.getByEstado(filtros.estado);
          }
          break;
        case 'vencidas':
          resultado = await facturasApi.getVencidas();
          break;
        default:
          resultado = await facturasApi.getAll();
      }

      if (resultado) setFacturas(resultado);
    } catch (error) {
      console.error('Error aplicando filtros:', error);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      tipo: 'todas',
      fechaInicio: '',
      fechaFin: '',
      montoMin: '',
      montoMax: '',
      estado: ''
    });
    cargarDatos();
  };

  const marcarComoPagada = async (id) => {
    try {
      await facturasApi.marcarPagada(id);
      cargarDatos();
    } catch (error) {
      console.error('Error marcando factura:', error);
    }
  };

  const getEstadoBadge = (estado) => {
    const estilos = {
      PAGADA: 'bg-green-100 text-green-700',
      PENDIENTE: 'bg-yellow-100 text-yellow-700',
      VENCIDA: 'bg-red-100 text-red-700',
      CANCELADA: 'bg-gray-100 text-gray-700'
    };
    const iconos = {
      PAGADA: <CheckCircle className="w-3 h-3" />,
      PENDIENTE: <Clock className="w-3 h-3" />,
      VENCIDA: <AlertTriangle className="w-3 h-3" />,
      CANCELADA: <X className="w-3 h-3" />
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estilos[estado] || 'bg-gray-100'}`}>
        {iconos[estado]} {estado}
      </span>
    );
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(valor || 0);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  // Calcular totales
  const totales = facturas.reduce((acc, f) => ({
    subtotal: acc.subtotal + (parseFloat(f.subtotal) || 0),
    impuestos: acc.impuestos + (parseFloat(f.montoImpuestos) || 0),
    total: acc.total + (parseFloat(f.total) || 0)
  }), { subtotal: 0, impuestos: 0, total: 0 });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#0081C8] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Facturación</span>
            </div>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0081C8] text-white rounded-lg hover:bg-[#006ba8] transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Panel de Filtros */}
        {mostrarFiltros && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Filtrar Facturas</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Tipo de filtro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por</label>
                <select
                  value={filtros.tipo}
                  onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0081C8]"
                >
                  <option value="todas">Todas</option>
                  <option value="fecha">Rango de fechas</option>
                  <option value="monto">Rango de monto</option>
                  <option value="estado">Estado</option>
                  <option value="vencidas">Solo vencidas</option>
                </select>
              </div>

              {/* Filtros de fecha */}
              {filtros.tipo === 'fecha' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                    <input
                      type="date"
                      value={filtros.fechaInicio}
                      onChange={(e) => setFiltros({ ...filtros, fechaInicio: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0081C8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                    <input
                      type="date"
                      value={filtros.fechaFin}
                      onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0081C8]"
                    />
                  </div>
                </>
              )}

              {/* Filtros de monto */}
              {filtros.tipo === 'monto' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monto mínimo</label>
                    <input
                      type="number"
                      value={filtros.montoMin}
                      onChange={(e) => setFiltros({ ...filtros, montoMin: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0081C8]"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monto máximo</label>
                    <input
                      type="number"
                      value={filtros.montoMax}
                      onChange={(e) => setFiltros({ ...filtros, montoMax: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0081C8]"
                      placeholder="1000"
                    />
                  </div>
                </>
              )}

              {/* Filtro de estado */}
              {filtros.tipo === 'estado' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={filtros.estado}
                    onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0081C8]"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="PAGADA">Pagada</option>
                    <option value="VENCIDA">Vencida</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>
              )}

              {/* Botones */}
              <div className="flex items-end gap-2">
                <button
                  onClick={aplicarFiltros}
                  className="px-4 py-2 bg-[#0081C8] text-white rounded-lg hover:bg-[#006ba8]"
                >
                  Aplicar
                </button>
                <button
                  onClick={limpiarFiltros}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resumen de totales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="text-xl font-bold">{formatearMoneda(totales.subtotal)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Impuestos</p>
                <p className="text-xl font-bold">{formatearMoneda(totales.impuestos)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold text-green-600">{formatearMoneda(totales.total)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de impuestos por país */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Impuestos por País (IVA/VAT)</h3>
          </div>
          <div className="p-4 overflow-x-auto">
            <div className="flex flex-wrap gap-2">
              {Object.entries(impuestos).map(([pais, porcentaje]) => (
                <span key={pais} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                  {pais}: <strong>{porcentaje}%</strong>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla de Facturas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Listado de Facturas ({facturas.length})</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">Cargando facturas...</div>
          ) : facturas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No hay facturas para mostrar</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nº Factura</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emisión</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">IVA %</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Impuestos</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {facturas.map((factura) => (
                    <tr key={factura.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm">{factura.numeroFactura}</td>
                      <td className="px-4 py-3 text-sm">{factura.usuarioNombre || '-'}</td>
                      <td className="px-4 py-3 text-sm max-w-xs truncate">{factura.concepto}</td>
                      <td className="px-4 py-3 text-sm">{formatearFecha(factura.fechaEmision)}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatearMoneda(factura.subtotal)}</td>
                      <td className="px-4 py-3 text-sm text-right">{factura.porcentajeImpuestos}%</td>
                      <td className="px-4 py-3 text-sm text-right">{formatearMoneda(factura.montoImpuestos)}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">{formatearMoneda(factura.total)}</td>
                      <td className="px-4 py-3 text-center">{getEstadoBadge(factura.estado)}</td>
                      <td className="px-4 py-3 text-center">
                        {factura.estado === 'PENDIENTE' && (
                          <button
                            onClick={() => marcarComoPagada(factura.id)}
                            className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            Marcar Pagada
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default FacturasPage;
