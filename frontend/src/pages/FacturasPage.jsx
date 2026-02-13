import { useState, useEffect, useCallback } from 'react';
import { facturasApi } from '../services/api';

const FacturasPage = ({ userData }) => {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');

  const cargarFacturas = useCallback(async () => {
    if (!userData?.id) return;
    setLoading(true);
    try {
      const data = await facturasApi.getByUsuario(userData.id);
      setFacturas(data);
    } catch (err) {
      console.error('Error al cargar facturas:', err);
    } finally {
      setLoading(false);
    }
  }, [userData?.id]);

  useEffect(() => {
    cargarFacturas();
  }, [cargarFacturas]);

  const formatPrecio = (p) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(p);
  const formatFecha = (f) => f ? new Date(f).toLocaleDateString('es-ES') : '-';

  const filtradas = filtro === 'todas' 
    ? facturas 
    : facturas.filter(f => f.estado === filtro);

  const estadoColor = (e) => {
    switch (e) {
      case 'PAGADA': return 'bg-green-100 text-green-700';
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-700';
      case 'VENCIDA': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Facturas</h1>
        
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todas">Todas</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="PAGADA">Pagadas</option>
          <option value="VENCIDA">Vencidas</option>
        </select>
      </div>

      {filtradas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
          <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-gray-500 text-sm">No hay facturas</p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500">
                <th className="px-4 py-3 font-medium">Factura</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtradas.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900 font-medium">{f.numeroFactura}</td>
                  <td className="px-4 py-3 text-gray-600">{formatFecha(f.fechaEmision)}</td>
                  <td className="px-4 py-3 text-gray-900">{formatPrecio(f.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoColor(f.estado)}`}>
                      {f.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtradas.length > 0 && (
        <p className="text-xs text-gray-400 mt-4 text-center">{filtradas.length} factura{filtradas.length !== 1 ? 's' : ''}</p>
      )}
    </div>
  );
};

export default FacturasPage;
