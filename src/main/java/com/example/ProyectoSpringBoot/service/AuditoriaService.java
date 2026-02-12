package com.example.ProyectoSpringBoot.service;

import com.example.ProyectoSpringBoot.entity.Suscripcion;
import com.example.ProyectoSpringBoot.entity.Usuario;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionType;
import org.hibernate.envers.query.AuditEntity;
import org.hibernate.envers.query.AuditQuery;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Servicio de Auditoría - consulta historial de cambios usando Hibernate Envers
 * Panel de Admin para ver quién cambió de plan y cuándo
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AuditoriaService {

    private final EntityManager entityManager;

    /**
     * Obtiene el historial de todas las suscripciones (cambios de plan, estado, etc.)
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getHistorialSuscripciones() {
        try {
            AuditReader reader = AuditReaderFactory.get(entityManager);
            List<Map<String, Object>> resultado = new ArrayList<>();

            // Obtener todas las revisiones de Suscripcion
            AuditQuery query = reader.createQuery()
                    .forRevisionsOfEntity(Suscripcion.class, false, true)
                    .addOrder(AuditEntity.revisionNumber().desc());

            List<Object[]> revisiones = query.getResultList();

            for (Object[] revision : revisiones) {
                Suscripcion suscripcion = (Suscripcion) revision[0];
                Object revisionInfo = revision[1];
                RevisionType tipoRevision = (RevisionType) revision[2];

                Map<String, Object> entry = new LinkedHashMap<>();
                entry.put("id", suscripcion.getId());
                entry.put("entidad", "Suscripcion");
                entry.put("tipoOperacion", getTipoOperacionTexto(tipoRevision));
                entry.put("estado", suscripcion.getEstado() != null ? suscripcion.getEstado().name() : null);
                entry.put("precioActual", suscripcion.getPrecioActual());
                entry.put("renovacionAutomatica", suscripcion.getRenovacionAutomatica());
                entry.put("fechaInicio", suscripcion.getFechaInicio());
                entry.put("fechaProximoCobro", suscripcion.getFechaProximoCobro());
                entry.put("modificadoPor", suscripcion.getModificadoPor());
                entry.put("fechaModificacion", suscripcion.getFechaModificacion());
                
                // Info del plan (si está disponible)
                if (suscripcion.getPlan() != null) {
                    entry.put("planNombre", suscripcion.getPlan().getNombre());
                    entry.put("planId", suscripcion.getPlan().getId());
                }
                
                // Info del usuario
                if (suscripcion.getUsuario() != null) {
                    entry.put("usuarioId", suscripcion.getUsuario().getId());
                    entry.put("usuarioEmail", suscripcion.getUsuario().getEmail());
                }

                resultado.add(entry);
            }

            return resultado;
        } catch (Exception e) {
            log.error("Error obteniendo historial de suscripciones: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Obtiene el historial de todos los usuarios
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getHistorialUsuarios() {
        try {
            AuditReader reader = AuditReaderFactory.get(entityManager);
            List<Map<String, Object>> resultado = new ArrayList<>();

            AuditQuery query = reader.createQuery()
                    .forRevisionsOfEntity(Usuario.class, false, true)
                    .addOrder(AuditEntity.revisionNumber().desc());

            List<Object[]> revisiones = query.getResultList();

            for (Object[] revision : revisiones) {
                Usuario usuario = (Usuario) revision[0];
                RevisionType tipoRevision = (RevisionType) revision[2];

                Map<String, Object> entry = new LinkedHashMap<>();
                entry.put("id", usuario.getId());
                entry.put("entidad", "Usuario");
                entry.put("tipoOperacion", getTipoOperacionTexto(tipoRevision));
                entry.put("email", usuario.getEmail());
                entry.put("activo", usuario.getActivo());
                entry.put("emailVerificado", usuario.getEmailVerificado());
                entry.put("fechaCreacion", usuario.getFechaCreacion());
                entry.put("fechaModificacion", usuario.getFechaModificacion());
                entry.put("ultimoAcceso", usuario.getUltimoAcceso());

                resultado.add(entry);
            }

            return resultado;
        } catch (Exception e) {
            log.error("Error obteniendo historial de usuarios: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Obtiene las revisiones de una entidad específica por ID
     */
    public List<Map<String, Object>> getRevisionesEntidad(String entidad, Long id) {
        try {
            AuditReader reader = AuditReaderFactory.get(entityManager);
            Class<?> entityClass = getEntityClass(entidad);
            
            if (entityClass == null) {
                return Collections.emptyList();
            }

            List<Number> revisions = reader.getRevisions(entityClass, id);
            List<Map<String, Object>> resultado = new ArrayList<>();

            for (Number revNumber : revisions) {
                Object entity = reader.find(entityClass, id, revNumber);
                
                Map<String, Object> entry = new LinkedHashMap<>();
                entry.put("revision", revNumber);
                entry.put("entidad", entidad);
                entry.put("entityId", id);
                
                if (entity instanceof Suscripcion s) {
                    entry.put("estado", s.getEstado());
                    entry.put("precioActual", s.getPrecioActual());
                    entry.put("renovacionAutomatica", s.getRenovacionAutomatica());
                } else if (entity instanceof Usuario u) {
                    entry.put("email", u.getEmail());
                    entry.put("activo", u.getActivo());
                }
                
                resultado.add(entry);
            }

            return resultado;
        } catch (Exception e) {
            log.error("Error obteniendo revisiones de {} {}: {}", entidad, id, e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Estadísticas de auditoría
     */
    public Map<String, Object> getEstadisticas() {
        Map<String, Object> stats = new LinkedHashMap<>();
        
        try {
            stats.put("totalRevisionesSuscripciones", getHistorialSuscripciones().size());
            stats.put("totalRevisionesUsuarios", getHistorialUsuarios().size());
        } catch (Exception e) {
            log.error("Error calculando estadísticas: {}", e.getMessage());
        }
        
        return stats;
    }

    private String getTipoOperacionTexto(RevisionType tipo) {
        return switch (tipo) {
            case ADD -> "CREACIÓN";
            case MOD -> "MODIFICACIÓN";
            case DEL -> "ELIMINACIÓN";
        };
    }

    private Class<?> getEntityClass(String entidad) {
        return switch (entidad.toLowerCase()) {
            case "suscripcion", "suscripciones" -> Suscripcion.class;
            case "usuario", "usuarios" -> Usuario.class;
            default -> null;
        };
    }
}
