package com.example.ProyectoSpringBoot.repository;

import com.example.ProyectoSpringBoot.entity.Factura;
import com.example.ProyectoSpringBoot.enums.EstadoFactura;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

// Repositorio de Factura
@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {

    // Por número de factura
    Optional<Factura> findByNumeroFactura(String numeroFactura);

    // Por estado
    List<Factura> findByEstado(EstadoFactura estado);

    // Por suscripción
    List<Factura> findBySuscripcionId(Long suscripcionId);
    List<Factura> findBySuscripcionIdOrderByFechaEmisionDesc(Long suscripcionId);

    // Por usuario (a través de suscripción)
    @Query("SELECT f FROM Factura f WHERE f.suscripcion.usuario.id = :usuarioId ORDER BY f.fechaEmision DESC")
    List<Factura> findByUsuarioId(@Param("usuarioId") Long usuarioId);

    // Con paginación
    @Query("SELECT f FROM Factura f WHERE f.suscripcion.usuario.id = :usuarioId")
    Page<Factura> findByUsuarioIdPaginado(@Param("usuarioId") Long usuarioId, Pageable pageable);

    // Por fechas
    List<Factura> findByFechaEmision(LocalDate fecha);
    List<Factura> findByFechaEmisionBetween(LocalDate inicio, LocalDate fin);

    // Por monto
    List<Factura> findByTotalBetween(BigDecimal min, BigDecimal max);
    List<Factura> findByTotalGreaterThan(BigDecimal monto);

    // Vencidas
    @Query("SELECT f FROM Factura f WHERE f.estado = 'PENDIENTE' AND f.fechaVencimiento < :fecha")
    List<Factura> findVencidas(@Param("fecha") LocalDate fecha);

    // Prorrateos
    List<Factura> findByEsProrrateoTrue();

    // Conteo y sumas
    long countByEstado(EstadoFactura estado);

    @Query("SELECT COALESCE(SUM(f.total), 0) FROM Factura f WHERE f.estado = 'PENDIENTE'")
    BigDecimal sumTotalPendientes();
    
    // Todas con relaciones cargadas (usuario, perfil, plan)
    @Query("SELECT f FROM Factura f JOIN FETCH f.suscripcion s JOIN FETCH s.usuario u LEFT JOIN FETCH u.perfil JOIN FETCH s.plan")
    List<Factura> findAllConDetalles();
}
