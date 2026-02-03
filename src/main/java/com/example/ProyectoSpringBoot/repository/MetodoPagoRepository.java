package com.example.ProyectoSpringBoot.repository;

import com.example.ProyectoSpringBoot.entity.MetodoPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Repositorio de MetodoPago (clase base de herencia)
@Repository
public interface MetodoPagoRepository extends JpaRepository<MetodoPago, Long> {

    // Por usuario
    List<MetodoPago> findByUsuarioId(Long usuarioId);
    List<MetodoPago> findByUsuarioIdAndActivoTrue(Long usuarioId);

    // Método predeterminado
    Optional<MetodoPago> findByUsuarioIdAndEsPredeterminadoTrue(Long usuarioId);

    // Por tipo (usando herencia)
    @Query("SELECT m FROM MetodoPago m WHERE TYPE(m) = :tipo AND m.usuario.id = :usuarioId")
    List<MetodoPago> findByTipoAndUsuarioId(@Param("tipo") Class<? extends MetodoPago> tipo, 
                                             @Param("usuarioId") Long usuarioId);

    // Conteo
    long countByUsuarioIdAndActivoTrue(Long usuarioId);

    // Por tipo específico
    @Query("SELECT m FROM TarjetaCredito m WHERE m.usuario.id = :usuarioId AND m.activo = true")
    List<MetodoPago> findTarjetasByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT m FROM PayPal m WHERE m.usuario.id = :usuarioId AND m.activo = true")
    List<MetodoPago> findPayPalsByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT m FROM Transferencia m WHERE m.usuario.id = :usuarioId AND m.activo = true")
    List<MetodoPago> findTransferenciasByUsuarioId(@Param("usuarioId") Long usuarioId);
}
