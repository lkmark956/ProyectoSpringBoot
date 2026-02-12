package com.example.ProyectoSpringBoot.controller.api;

import com.example.ProyectoSpringBoot.service.AuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller para Panel de Auditoría (Admin)
 * Expone el historial de cambios usando Hibernate Envers
 */
@RestController
@RequestMapping("/api/auditoria")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class AuditoriaRestController {

    private final AuditoriaService auditoriaService;

    /**
     * GET /api/auditoria/suscripciones - Historial de cambios en suscripciones
     * Muestra quién cambió de plan, cuándo, estados anteriores, etc.
     */
    @GetMapping("/suscripciones")
    public ResponseEntity<List<Map<String, Object>>> getHistorialSuscripciones() {
        return ResponseEntity.ok(auditoriaService.getHistorialSuscripciones());
    }

    /**
     * GET /api/auditoria/usuarios - Historial de cambios en usuarios
     */
    @GetMapping("/usuarios")
    public ResponseEntity<List<Map<String, Object>>> getHistorialUsuarios() {
        return ResponseEntity.ok(auditoriaService.getHistorialUsuarios());
    }

    /**
     * GET /api/auditoria/{entidad}/{id} - Revisiones de una entidad específica
     * Ejemplo: /api/auditoria/suscripcion/1
     */
    @GetMapping("/{entidad}/{id}")
    public ResponseEntity<List<Map<String, Object>>> getRevisionesEntidad(
            @PathVariable String entidad,
            @PathVariable Long id) {
        return ResponseEntity.ok(auditoriaService.getRevisionesEntidad(entidad, id));
    }

    /**
     * GET /api/auditoria/estadisticas - Estadísticas generales
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<Map<String, Object>> getEstadisticas() {
        return ResponseEntity.ok(auditoriaService.getEstadisticas());
    }
}
