package com.example.ProyectoSpringBoot.config;

import com.example.ProyectoSpringBoot.entity.*;
import com.example.ProyectoSpringBoot.enums.*;
import com.example.ProyectoSpringBoot.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            PlanRepository planRepository,
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            System.out.println("=== Inicializando base de datos ===");
            
            // ========== PLANES ==========
            if (planRepository.count() == 0) {
                Plan basic = Plan.builder()
                        .nombre("Plan Básico")
                        .tipoPlan(TipoPlan.BASIC)
                        .precioMensual(new BigDecimal("9.99"))
                        .almacenamientoGb(10)
                        .maxUsuarios(5)
                        .descripcion("Plan básico ideal para empezar")
                        .soportePrioritario(false)
                        .activo(true)
                        .ordenVisualizacion(1)
                        .build();
                planRepository.save(basic);

                Plan premium = Plan.builder()
                        .nombre("Plan Premium")
                        .tipoPlan(TipoPlan.PREMIUM)
                        .precioMensual(new BigDecimal("29.99"))
                        .almacenamientoGb(50)
                        .maxUsuarios(20)
                        .descripcion("Plan premium con más capacidad y soporte prioritario")
                        .soportePrioritario(true)
                        .activo(true)
                        .ordenVisualizacion(2)
                        .build();
                planRepository.save(premium);

                Plan enterprise = Plan.builder()
                        .nombre("Plan Empresarial")
                        .tipoPlan(TipoPlan.ENTERPRISE)
                        .precioMensual(new BigDecimal("99.99"))
                        .almacenamientoGb(200)
                        .maxUsuarios(100)
                        .descripcion("Plan empresarial con capacidad ilimitada y soporte 24/7")
                        .soportePrioritario(true)
                        .activo(true)
                        .ordenVisualizacion(3)
                        .build();
                planRepository.save(enterprise);
                System.out.println("✓ 3 planes creados");
            }

            // ========== USUARIO ADMIN ==========
            if (usuarioRepository.findByEmail("admin@admin.com").isEmpty()) {
                Usuario admin = Usuario.builder()
                        .email("admin@admin.com")
                        .password(passwordEncoder.encode("admin123"))
                        .activo(true)
                        .emailVerificado(true)
                        .build();
                usuarioRepository.save(admin);
                System.out.println("✓ Usuario admin creado (admin@admin.com / admin123)");
            }
            
            System.out.println("=== Inicialización completada ===");
        };
    }
}
