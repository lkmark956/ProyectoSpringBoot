const API_BASE_URL = '/api'

/**
 * Servicio para comunicación con la API REST de Spring Boot
 */
const api = {
  // ===== PLANES =====
  planes: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/planes`)
      if (!res.ok) throw new Error('Error al obtener planes')
      return res.json()
    },
    
    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/planes/${id}`)
      if (!res.ok) throw new Error('Plan no encontrado')
      return res.json()
    },
    
    create: async (plan) => {
      const res = await fetch(`${API_BASE_URL}/planes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan),
      })
      if (!res.ok) throw new Error('Error al crear plan')
      return res.json()
    },
    
    update: async (id, plan) => {
      const res = await fetch(`${API_BASE_URL}/planes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plan),
      })
      if (!res.ok) throw new Error('Error al actualizar plan')
      return res.json()
    },
    
    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/planes/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Error al eliminar plan')
      return true
    },
  },

  // ===== USUARIOS =====
  usuarios: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/usuarios`)
      if (!res.ok) throw new Error('Error al obtener usuarios')
      return res.json()
    },
    
    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/usuarios/${id}`)
      if (!res.ok) throw new Error('Usuario no encontrado')
      return res.json()
    },
    
    create: async (usuario) => {
      const res = await fetch(`${API_BASE_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      })
      if (!res.ok) throw new Error('Error al crear usuario')
      return res.json()
    },
    
    update: async (id, usuario) => {
      const res = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      })
      if (!res.ok) throw new Error('Error al actualizar usuario')
      return res.json()
    },
    
    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Error al eliminar usuario')
      return true
    },
  },

  // ===== SUSCRIPCIONES =====
  suscripciones: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/suscripciones`)
      if (!res.ok) throw new Error('Error al obtener suscripciones')
      return res.json()
    },
    
    getById: async (id) => {
      const res = await fetch(`${API_BASE_URL}/suscripciones/${id}`)
      if (!res.ok) throw new Error('Suscripción no encontrada')
      return res.json()
    },
    
    create: async (suscripcion) => {
      const res = await fetch(`${API_BASE_URL}/suscripciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suscripcion),
      })
      if (!res.ok) throw new Error('Error al crear suscripción')
      return res.json()
    },
    
    cambiarEstado: async (id, estado) => {
      const res = await fetch(`${API_BASE_URL}/suscripciones/${id}/estado/${estado}`, {
        method: 'PATCH',
      })
      if (!res.ok) throw new Error('Error al cambiar estado')
      return res.json()
    },
    
    delete: async (id) => {
      const res = await fetch(`${API_BASE_URL}/suscripciones/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Error al eliminar suscripción')
      return true
    },
  },

  // ===== FACTURAS =====
  facturas: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/facturas`)
      if (!res.ok) throw new Error('Error al obtener facturas')
      return res.json()
    },
    
    marcarPagada: async (id) => {
      const res = await fetch(`${API_BASE_URL}/facturas/${id}/pagar`, {
        method: 'PATCH',
      })
      if (!res.ok) throw new Error('Error al marcar como pagada')
      return res.json()
    },
  },
}

export default api
