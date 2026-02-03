package com.example.ProyectoSpringBoot.controller.api;

import com.example.ProyectoSpringBoot.dto.SuscripcionDTO;
import com.example.ProyectoSpringBoot.enums.EstadoSuscripcion;
import com.example.ProyectoSpringBoot.service.SuscripcionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller para Suscripciones
 */
@RestController
@RequestMapping("/api/suscripciones")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SuscripcionRestController {

    private final SuscripcionService suscripcionService;

    @GetMapping
    public ResponseEntity<List<SuscripcionDTO>> getAll() {
        return ResponseEntity.ok(suscripcionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuscripcionDTO> getById(@PathVariable Long id) {
        return suscripcionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<SuscripcionDTO>> getByUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(suscripcionService.findByUsuarioId(usuarioId));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<SuscripcionDTO>> getByEstado(@PathVariable EstadoSuscripcion estado) {
        return ResponseEntity.ok(suscripcionService.findByEstado(estado));
    }

    @PostMapping
    public ResponseEntity<SuscripcionDTO> create(@Valid @RequestBody SuscripcionDTO dto) {
        return suscripcionService.create(dto)
                .map(created -> ResponseEntity.status(HttpStatus.CREATED).body(created))
                .orElse(ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuscripcionDTO> update(@PathVariable Long id, @Valid @RequestBody SuscripcionDTO dto) {
        return suscripcionService.update(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/estado/{estado}")
    public ResponseEntity<SuscripcionDTO> cambiarEstado(@PathVariable Long id, @PathVariable EstadoSuscripcion estado) {
        return suscripcionService.cambiarEstado(id, estado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (suscripcionService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
