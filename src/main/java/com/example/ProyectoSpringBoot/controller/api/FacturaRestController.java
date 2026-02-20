package com.example.ProyectoSpringBoot.controller.api;

import com.example.ProyectoSpringBoot.dto.FacturaDTO;
import com.example.ProyectoSpringBoot.enums.EstadoFactura;
import com.example.ProyectoSpringBoot.service.FacturaService;
import com.example.ProyectoSpringBoot.service.RenovacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST Controller para Facturas
 * Endpoints: /api/facturas
 * Incluye filtros por fecha, monto y estado (Semana 2)
 */
@RestController
@RequestMapping("/api/facturas")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class FacturaRestController {

    private final FacturaService facturaService;
    private final RenovacionService renovacionService;

    /**
     * GET /api/facturas - Obtener todas las facturas
     */
    @GetMapping
    public ResponseEntity<List<FacturaDTO>> getAll() {
        return ResponseEntity.ok(facturaService.findAll());
    }

    /**
     * GET /api/facturas/{id} - Obtener factura por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<FacturaDTO> getById(@PathVariable Long id) {
        return facturaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/facturas/usuario/{usuarioId} - Facturas de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<FacturaDTO>> getByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(facturaService.findByUsuarioId(usuarioId));
    }

    /**
     * GET /api/facturas/estado/{estado} - Filtrar por estado
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<FacturaDTO>> getByEstado(@PathVariable EstadoFactura estado) {
        return ResponseEntity.ok(facturaService.findByEstado(estado));
    }

    /**
     * GET /api/facturas/filtrar/fecha - Filtrar por rango de fechas
     * Ejemplo: /api/facturas/filtrar/fecha?inicio=2026-01-01&fin=2026-12-31
     */
    @GetMapping("/filtrar/fecha")
    public ResponseEntity<List<FacturaDTO>> getByFechaRango(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(facturaService.findByFechaEmisionBetween(inicio, fin));
    }

    /**
     * GET /api/facturas/filtrar/monto - Filtrar por rango de monto
     * Ejemplo: /api/facturas/filtrar/monto?min=10&max=100
     */
    @GetMapping("/filtrar/monto")
    public ResponseEntity<List<FacturaDTO>> getByMontoRango(
            @RequestParam BigDecimal min,
            @RequestParam BigDecimal max) {
        return ResponseEntity.ok(facturaService.findByTotalBetween(min, max));
    }

    /**
     * GET /api/facturas/vencidas - Obtener facturas vencidas
     */
    @GetMapping("/vencidas")
    public ResponseEntity<List<FacturaDTO>> getVencidas() {
        return ResponseEntity.ok(facturaService.findVencidas());
    }

    /**
     * PUT /api/facturas/{id}/pagar - Marcar factura como pagada
     */
    @PutMapping("/{id}/pagar")
    public ResponseEntity<FacturaDTO> marcarPagada(@PathVariable Long id) {
        return facturaService.marcarComoPagada(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PUT /api/facturas/{id}/estado/{estado} - Cambiar estado de factura
     */
    @PutMapping("/{id}/estado/{estado}")
    public ResponseEntity<FacturaDTO> cambiarEstado(
            @PathVariable Long id,
            @PathVariable EstadoFactura estado) {
        return facturaService.cambiarEstado(id, estado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/facturas/impuestos - Obtener tabla de impuestos por país
     */
    @GetMapping("/impuestos")
    public ResponseEntity<Map<String, BigDecimal>> getImpuestosPorPais() {
        return ResponseEntity.ok(renovacionService.obtenerTablasImpuestos());
    }

    /**
     * DELETE /api/facturas/{id} - Eliminar factura
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (facturaService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
