import { useState, useEffect } from 'react';
import { FileText, Download, CheckCircle, Clock, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { facturasApi } from '../services/api';

export default function MisFacturasPage({ userData }) {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('TODAS');

  useEffect(() => {
    cargarFacturas();
  }, [userData]);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      const data = await facturasApi.getByUsuario(userData.id);
      setFacturas(data);
    } catch (err) {
      console.error('Error al cargar facturas:', err);
    } finally {
      setLoading(false);
    }
  };

  const pagarFactura = async (id) => {
    try {
      await facturasApi.marcarPagada(id);
      cargarFacturas();
    } catch (err) {
      console.error('Error al pagar factura:', err);
    }
  };

  const facturasFiltradas = filtroEstado === 'TODAS' 
    ? facturas 
    : facturas.filter(f => f.estado === filtroEstado);

  const totales = {
    total: facturas.reduce((sum, f) => sum + (f.total || 0), 0),
    pendiente: facturas.filter(f => f.estado === 'PENDIENTE').reduce((sum, f) => sum + (f.total || 0), 0),
    pagado: facturas.filter(f => f.estado === 'PAGADA').reduce((sum, f) => sum + (f.total || 0), 0)
  };

  const estadoIcono = {
    PAGADA: <CheckCircle className="w-4 h-4 text-green-600" />,
    PENDIENTE: <Clock className="w-4 h-4 text-yellow-600" />,
    VENCIDA: <AlertCircle className="w-4 h-4 text-red-600" />
  };

  const estadoColor = {
    PAGADA: 'bg-green-100 text-green-800',
    PENDIENTE: 'bg-yellow-100 text-yellow-800',
    VENCIDA: 'bg-red-100 text-red-800'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mis Facturas</h1>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Facturado</p>
                <p className="text-xl font-bold">{totales.total.toFixed(2)} €</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pendiente de Pago</p>
                <p className="text-xl font-bold text-yellow-600">{totales.pendiente.toFixed(2)} €</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Pagado</p>
                <p className="text-xl font-bold text-green-600">{totales.pagado.toFixed(2)} €</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Filtrar por estado:</span>
            {['TODAS', 'PENDIENTE', 'PAGADA'].map(estado => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filtroEstado === estado
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {estado === 'TODAS' ? 'Todas' : estado.charAt(0) + estado.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Facturas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {facturasFiltradas.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tienes facturas</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Factura</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concepto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">IVA</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {facturasFiltradas.map(factura => (
                  <tr key={factura.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-blue-600">{factura.numeroFactura}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{factura.concepto}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{factura.fechaEmision}</td>
                    <td className="px-4 py-3 text-sm text-right">{factura.subtotal?.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-500">
                      {factura.montoImpuestos?.toFixed(2)} € ({factura.porcentajeImpuestos}%)
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-bold">{factura.total?.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estadoColor[factura.estado]}`}>
                        {estadoIcono[factura.estado]}
                        {factura.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {factura.estado === 'PENDIENTE' && (
                        <button
                          onClick={() => pagarFactura(factura.id)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                        >
                          Pagar
                        </button>
                      )}
                      {factura.estado === 'PAGADA' && (
                        <button className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded hover:bg-gray-200">
                          <Download className="w-3 h-3 inline mr-1" />
                          PDF
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Info de Impuestos */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Los impuestos se calculan según tu país de residencia 
            ({userData?.perfil?.pais || 'No especificado'}). El porcentaje de IVA aplicado 
            varía según la legislación de cada país.
          </p>
        </div>
      </div>
    </div>
  );
}
