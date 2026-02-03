package com.example.ProyectoSpringBoot.repository;

import com.example.ProyectoSpringBoot.entity.Perfil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Repositorio de Perfil
@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Long> {

    // Por usuario
    Optional<Perfil> findByUsuarioId(Long usuarioId);

    // Por ubicación
    List<Perfil> findByPais(String pais);
    List<Perfil> findByCiudad(String ciudad);

    // Búsqueda parcial por nombre
    List<Perfil> findByNombreContainingIgnoreCase(String nombre);

    // Perfiles corporativos (con empresa)
    @Query("SELECT p FROM Perfil p WHERE p.empresa IS NOT NULL AND p.empresa <> ''")
    List<Perfil> findPerfilesCorporativos();

    // Conteo por país
    long countByPais(String pais);

    // Lista de países únicos
    @Query("SELECT DISTINCT p.pais FROM Perfil p WHERE p.pais IS NOT NULL ORDER BY p.pais")
    List<String> findPaisesUnicos();
}
