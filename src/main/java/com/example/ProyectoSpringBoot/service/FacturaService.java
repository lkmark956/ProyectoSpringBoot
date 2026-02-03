package com.example.ProyectoSpringBoot.service;

import com.example.ProyectoSpringBoot.dto.FacturaDTO;
import com.example.ProyectoSpringBoot.entity.Factura;
import com.example.ProyectoSpringBoot.enums.EstadoFactura;
import com.example.ProyectoSpringBoot.repository.FacturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio para la lógica de negocio de Factura
 * Cumple criterio: "Controllers limpios que solo delegan a la capa de Service"
 */
@Service
@RequiredArgsConstructor
@Transactional
public class FacturaService {

    private final FacturaRepository facturaRepository;

    @Transactional(readOnly = true)
    public List<FacturaDTO> findAll() {
        return facturaRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<FacturaDTO> findById(Long id) {
        return facturaRepository.findById(id).map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public List<FacturaDTO> findByEstado(EstadoFactura estado) {
        return facturaRepository.findByEstado(estado).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Marcar factura como pagada
     */
    public Optional<FacturaDTO> marcarComoPagada(Long id) {
        return facturaRepository.findById(id).map(factura -> {
            factura.setEstado(EstadoFactura.PAGADA);
            factura.setFechaPago(LocalDateTime.now());
            Factura saved = facturaRepository.save(factura);
            return toDTO(saved);
        });
    }

    public boolean delete(Long id) {
        if (facturaRepository.existsById(id)) {
            facturaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // ===== CONVERSIONES Entity <-> DTO =====

    private FacturaDTO toDTO(Factura entity) {
        String usuarioNombre = null;
        Long usuarioId = null;
        
        if (entity.getSuscripcion() != null && entity.getSuscripcion().getUsuario() != null) {
            usuarioId = entity.getSuscripcion().getUsuario().getId();
            if (entity.getSuscripcion().getUsuario().getPerfil() != null) {
                var perfil = entity.getSuscripcion().getUsuario().getPerfil();
                usuarioNombre = perfil.getNombre();
                if (perfil.getApellidos() != null) {
                    usuarioNombre += " " + perfil.getApellidos();
                }
            }
        }
        
        return FacturaDTO.builder()
                .id(entity.getId())
                .numeroFactura(entity.getNumeroFactura())
                .suscripcionId(entity.getSuscripcion() != null ? entity.getSuscripcion().getId() : null)
                .usuarioId(usuarioId)
                .usuarioNombre(usuarioNombre)
                .fechaEmision(entity.getFechaEmision())
                .fechaVencimiento(entity.getFechaVencimiento())
                .subtotal(entity.getSubtotal())
                .porcentajeImpuestos(entity.getPorcentajeImpuestos())
                .montoImpuestos(entity.getMontoImpuestos())
                .total(entity.getTotal())
                .estado(entity.getEstado())
                .fechaPago(entity.getFechaPago())
                .concepto(entity.getConcepto())
                .build();
    }
}
