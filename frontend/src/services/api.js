import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// API de Autenticación
export const authApi = {
  login: async (email, password) => (await api.post('/auth/login', { email, password })).data,
  register: async (usuario) => (await api.post('/auth/register', usuario)).data,
};

export const usuariosApi = {
  getAll: async () => (await api.get('/usuarios')).data,
  getById: async (id) => (await api.get(`/usuarios/${id}`)).data,
  create: async (usuario) => (await api.post('/usuarios', usuario)).data,
  update: async (id, usuario) => (await api.put(`/usuarios/${id}`, usuario)).data,
  delete: async (id) => await api.delete(`/usuarios/${id}`),
};

export const planesApi = {
  getAll: async () => (await api.get('/planes')).data,
  getActivos: async () => (await api.get('/planes/activos')).data,
  getById: async (id) => (await api.get(`/planes/${id}`)).data,
  create: async (plan) => (await api.post('/planes', plan)).data,
  update: async (id, plan) => (await api.put(`/planes/${id}`, plan)).data,
  delete: async (id) => await api.delete(`/planes/${id}`),
};

export const suscripcionesApi = {
  getAll: async () => (await api.get('/suscripciones')).data,
  getById: async (id) => (await api.get(`/suscripciones/${id}`)).data,
  getByUsuario: async (usuarioId) => (await api.get(`/suscripciones/usuario/${usuarioId}`)).data,
  getByEstado: async (estado) => (await api.get(`/suscripciones/estado/${estado}`)).data,
  create: async (suscripcion) => (await api.post('/suscripciones', suscripcion)).data,
  update: async (id, suscripcion) => (await api.put(`/suscripciones/${id}`, suscripcion)).data,
  cancelar: async (id) => (await api.put(`/suscripciones/${id}/cancelar`)).data,
  activar: async (id) => (await api.put(`/suscripciones/${id}/activar`)).data,
  delete: async (id) => await api.delete(`/suscripciones/${id}`),
};

export const facturasApi = {
  getAll: async () => (await api.get('/facturas')).data,
  getById: async (id) => (await api.get(`/facturas/${id}`)).data,
  getByUsuario: async (usuarioId) => (await api.get(`/facturas/usuario/${usuarioId}`)).data,
  getByEstado: async (estado) => (await api.get(`/facturas/estado/${estado}`)).data,
  filtrarPorFecha: async (inicio, fin) => (await api.get(`/facturas/filtrar/fecha?inicio=${inicio}&fin=${fin}`)).data,
  filtrarPorMonto: async (min, max) => (await api.get(`/facturas/filtrar/monto?min=${min}&max=${max}`)).data,
  getVencidas: async () => (await api.get('/facturas/vencidas')).data,
  marcarPagada: async (id) => (await api.put(`/facturas/${id}/pagar`)).data,
  cambiarEstado: async (id, estado) => (await api.put(`/facturas/${id}/estado/${estado}`)).data,
  getImpuestos: async () => (await api.get('/facturas/impuestos')).data,
  delete: async (id) => await api.delete(`/facturas/${id}`),
};

export const auditoriaApi = {
  getHistorialSuscripciones: async () => (await api.get('/auditoria/suscripciones')).data,
  getHistorialUsuarios: async () => (await api.get('/auditoria/usuarios')).data,
  getRevisionesEntidad: async (entidad, id) => (await api.get(`/auditoria/${entidad}/${id}`)).data,
};

export default api;
