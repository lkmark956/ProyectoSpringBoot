package com.example.ProyectoSpringBoot.service;

import com.example.ProyectoSpringBoot.dto.SuscripcionDTO;
import com.example.ProyectoSpringBoot.entity.Plan;
import com.example.ProyectoSpringBoot.entity.Suscripcion;
import com.example.ProyectoSpringBoot.entity.Usuario;
import com.example.ProyectoSpringBoot.enums.EstadoSuscripcion;
import com.example.ProyectoSpringBoot.repository.PlanRepository;
import com.example.ProyectoSpringBoot.repository.SuscripcionRepository;
import com.example.ProyectoSpringBoot.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio para la lógica de negocio de Suscripción
 */
@Service
@RequiredArgsConstructor
@Transactional
public class SuscripcionService {

    private final SuscripcionRepository suscripcionRepository;
    private final UsuarioRepository usuarioRepository;
    private final PlanRepository planRepository;

    @Transactional(readOnly = true)
    public List<SuscripcionDTO> findAll() {
        return suscripcionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<SuscripcionDTO> findById(Long id) {
        return suscripcionRepository.findById(id).map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public List<SuscripcionDTO> findByUsuarioId(Long usuarioId) {
        return suscripcionRepository.findByUsuarioId(usuarioId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SuscripcionDTO> findByEstado(EstadoSuscripcion estado) {
        return suscripcionRepository.findByEstado(estado).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<SuscripcionDTO> create(SuscripcionDTO dto) {
        Optional<Usuario> usuario = usuarioRepository.findById(dto.getUsuarioId());
        Optional<Plan> plan = planRepository.findById(dto.getPlanId());

        if (usuario.isEmpty() || plan.isEmpty()) {
            return Optional.empty();
        }

        Suscripcion suscripcion = Suscripcion.builder()
                .usuario(usuario.get())
                .plan(plan.get())
                .fechaInicio(dto.getFechaInicio())
                .fechaFin(dto.getFechaFin())
                .estado(dto.getEstado() != null ? dto.getEstado() : EstadoSuscripcion.ACTIVA)
                .renovacionAutomatica(dto.getRenovacionAutomatica() != null ? dto.getRenovacionAutomatica() : true)
                .precioActual(dto.getPrecioActual() != null ? dto.getPrecioActual() : plan.get().getPrecioMensual())
                .build();

        Suscripcion saved = suscripcionRepository.save(suscripcion);
        return Optional.of(toDTO(saved));
    }

    public Optional<SuscripcionDTO> update(Long id, SuscripcionDTO dto) {
        return suscripcionRepository.findById(id).map(existing -> {
            if (dto.getPlanId() != null) {
                planRepository.findById(dto.getPlanId()).ifPresent(existing::setPlan);
            }
            if (dto.getFechaInicio() != null) existing.setFechaInicio(dto.getFechaInicio());
            if (dto.getFechaFin() != null) existing.setFechaFin(dto.getFechaFin());
            if (dto.getEstado() != null) existing.setEstado(dto.getEstado());
            if (dto.getRenovacionAutomatica() != null) existing.setRenovacionAutomatica(dto.getRenovacionAutomatica());
            if (dto.getPrecioActual() != null) existing.setPrecioActual(dto.getPrecioActual());

            Suscripcion saved = suscripcionRepository.save(existing);
            return toDTO(saved);
        });
    }

    /**
     * Cambiar estado de suscripción (ACTIVA, CANCELADA, MOROSA)
     */
    public Optional<SuscripcionDTO> cambiarEstado(Long id, EstadoSuscripcion nuevoEstado) {
        return suscripcionRepository.findById(id).map(suscripcion -> {
            suscripcion.setEstado(nuevoEstado);
            Suscripcion saved = suscripcionRepository.save(suscripcion);
            return toDTO(saved);
        });
    }

    public boolean delete(Long id) {
        if (suscripcionRepository.existsById(id)) {
            suscripcionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // ===== CONVERSIONES Entity <-> DTO =====

    private SuscripcionDTO toDTO(Suscripcion entity) {
        String usuarioNombre = null;
        
        // Obtener nombre del perfil del usuario
        if (entity.getUsuario() != null && entity.getUsuario().getPerfil() != null) {
            var perfil = entity.getUsuario().getPerfil();
            usuarioNombre = perfil.getNombre();
            if (perfil.getApellidos() != null) {
                usuarioNombre += " " + perfil.getApellidos();
            }
        }
        
        return SuscripcionDTO.builder()
                .id(entity.getId())
                .usuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null)
                .usuarioNombre(usuarioNombre)
                .planId(entity.getPlan() != null ? entity.getPlan().getId() : null)
                .planNombre(entity.getPlan() != null ? entity.getPlan().getNombre() : null)
                .fechaInicio(entity.getFechaInicio())
                .fechaFin(entity.getFechaFin())
                .estado(entity.getEstado())
                .renovacionAutomatica(entity.getRenovacionAutomatica())
                .precioActual(entity.getPrecioActual())
                .build();
    }
}
