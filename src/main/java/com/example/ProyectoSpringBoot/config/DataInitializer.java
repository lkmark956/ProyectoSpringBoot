package com.example.ProyectoSpringBoot.config;

import com.example.ProyectoSpringBoot.entity.*;
import com.example.ProyectoSpringBoot.enums.*;
import com.example.ProyectoSpringBoot.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            PlanRepository planRepository,
            UsuarioRepository usuarioRepository,
            SuscripcionRepository suscripcionRepository,
            FacturaRepository facturaRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            System.out.println("=== Verificando datos de prueba ===");
            
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

            // ========== USUARIOS Y FACTURAS DE PRUEBA ==========
            // Crear datos de prueba si no hay facturas (para demostrar impuestos por país)
            if (facturaRepository.count() == 0) {
                System.out.println("Creando datos de prueba completos...");
                
                // Obtener planes existentes
                Plan basic = planRepository.findAll().stream()
                        .filter(p -> p.getTipoPlan() == TipoPlan.BASIC).findFirst().orElse(null);
                Plan premium = planRepository.findAll().stream()
                        .filter(p -> p.getTipoPlan() == TipoPlan.PREMIUM).findFirst().orElse(null);
                Plan enterprise = planRepository.findAll().stream()
                        .filter(p -> p.getTipoPlan() == TipoPlan.ENTERPRISE).findFirst().orElse(null);

                if (basic == null || premium == null || enterprise == null) {
                    System.out.println("⚠ No se encontraron todos los planes");
                    return;
                }

                // ========== USUARIOS CON DIFERENTES PAÍSES ==========
                
                // Usuario España (IVA 21%)
                Usuario userEspana = usuarioRepository.findByEmail("carlos@ejemplo.es").orElseGet(() -> {
                    Usuario u = Usuario.builder()
                            .email("carlos@ejemplo.es")
                            .password(passwordEncoder.encode("password123"))
                            .activo(true)
                            .emailVerificado(true)
                            .build();
                    Perfil p = Perfil.builder()
                            .nombre("Carlos")
                            .apellidos("García López")
                            .pais("España")
                            .ciudad("Madrid")
                            .telefono("+34612345678")
                            .usuario(u)
                            .build();
                    u.setPerfil(p);
                    return usuarioRepository.save(u);
                });

                // Usuario México (IVA 16%)
                Usuario userMexico = usuarioRepository.findByEmail("maria@ejemplo.mx").orElseGet(() -> {
                    Usuario u = Usuario.builder()
                            .email("maria@ejemplo.mx")
                            .password(passwordEncoder.encode("password123"))
                            .activo(true)
                            .emailVerificado(true)
                            .build();
                    Perfil p = Perfil.builder()
                            .nombre("María")
                            .apellidos("Hernández Ruiz")
                            .pais("México")
                            .ciudad("Ciudad de México")
                            .telefono("+5255123456")
                            .usuario(u)
                            .build();
                    u.setPerfil(p);
                    return usuarioRepository.save(u);
                });

                // Usuario Colombia (IVA 19%)
                Usuario userColombia = usuarioRepository.findByEmail("juan@ejemplo.co").orElseGet(() -> {
                    Usuario u = Usuario.builder()
                            .email("juan@ejemplo.co")
                            .password(passwordEncoder.encode("password123"))
                            .activo(true)
                            .emailVerificado(false)
                            .build();
                    Perfil p = Perfil.builder()
                            .nombre("Juan")
                            .apellidos("Rodríguez Pérez")
                            .pais("Colombia")
                            .ciudad("Bogotá")
                            .telefono("+571234567")
                            .usuario(u)
                            .build();
                    u.setPerfil(p);
                    return usuarioRepository.save(u);
                });

                // Usuario USA (sin IVA federal)
                Usuario userUSA = usuarioRepository.findByEmail("john@example.com").orElseGet(() -> {
                    Usuario u = Usuario.builder()
                            .email("john@example.com")
                            .password(passwordEncoder.encode("password123"))
                            .activo(true)
                            .emailVerificado(true)
                            .build();
                    Perfil p = Perfil.builder()
                            .nombre("John")
                            .apellidos("Smith")
                            .pais("USA")
                            .ciudad("New York")
                            .telefono("+12125551234")
                            .usuario(u)
                            .build();
                    u.setPerfil(p);
                    return usuarioRepository.save(u);
                });

                System.out.println("✓ 4 usuarios verificados/creados");

                // ========== SUSCRIPCIONES ==========
                LocalDate hoy = LocalDate.now();

                Suscripcion susEspana = Suscripcion.builder()
                        .usuario(userEspana)
                        .plan(premium)
                        .fechaInicio(hoy.minusMonths(3))
                        .fechaProximoCobro(hoy.plusDays(15))
                        .estado(EstadoSuscripcion.ACTIVA)
                        .renovacionAutomatica(true)
                        .precioActual(premium.getPrecioMensual())
                        .build();
                suscripcionRepository.save(susEspana);

                Suscripcion susMexico = Suscripcion.builder()
                        .usuario(userMexico)
                        .plan(basic)
                        .fechaInicio(hoy.minusMonths(1))
                        .fechaProximoCobro(hoy.plusDays(5))
                        .estado(EstadoSuscripcion.ACTIVA)
                        .renovacionAutomatica(true)
                        .precioActual(basic.getPrecioMensual())
                        .build();
                suscripcionRepository.save(susMexico);

                Suscripcion susColombia = Suscripcion.builder()
                        .usuario(userColombia)
                        .plan(enterprise)
                        .fechaInicio(hoy.minusMonths(6))
                        .fechaProximoCobro(hoy.minusDays(10))
                        .estado(EstadoSuscripcion.MOROSA)
                        .renovacionAutomatica(true)
                        .precioActual(enterprise.getPrecioMensual())
                        .build();
                suscripcionRepository.save(susColombia);

                Suscripcion susUSA = Suscripcion.builder()
                        .usuario(userUSA)
                        .plan(premium)
                        .fechaInicio(hoy.minusMonths(4))
                        .fechaFin(hoy.minusDays(5))
                        .fechaProximoCobro(hoy.minusDays(5))
                        .estado(EstadoSuscripcion.CANCELADA)
                        .renovacionAutomatica(false)
                        .precioActual(premium.getPrecioMensual())
                        .fechaCancelacion(LocalDateTime.now().minusDays(5))
                        .motivoCancelacion("Cambio a competidor")
                        .build();
                suscripcionRepository.save(susUSA);

                System.out.println("✓ 4 suscripciones creadas");

                // ========== FACTURAS CON IMPUESTOS POR PAÍS ==========
                List<Object[]> datosFact = List.of(
                        new Object[]{susEspana, "FAC-202601-00001", hoy.minusMonths(2), new BigDecimal("21.00"), EstadoFactura.PAGADA, "España"},
                        new Object[]{susEspana, "FAC-202601-00002", hoy.minusMonths(1), new BigDecimal("21.00"), EstadoFactura.PAGADA, "España"},
                        new Object[]{susEspana, "FAC-202602-00001", hoy, new BigDecimal("21.00"), EstadoFactura.PENDIENTE, "España"},
                        new Object[]{susMexico, "FAC-202602-00002", hoy.minusWeeks(2), new BigDecimal("16.00"), EstadoFactura.PAGADA, "México"},
                        new Object[]{susColombia, "FAC-202601-00003", hoy.minusMonths(2), new BigDecimal("19.00"), EstadoFactura.PAGADA, "Colombia"},
                        new Object[]{susColombia, "FAC-202601-00004", hoy.minusMonths(1), new BigDecimal("19.00"), EstadoFactura.PAGADA, "Colombia"},
                        new Object[]{susColombia, "FAC-202602-00003", hoy.minusDays(10), new BigDecimal("19.00"), EstadoFactura.PENDIENTE, "Colombia"},
                        new Object[]{susUSA, "FAC-202601-00005", hoy.minusMonths(3), new BigDecimal("0.00"), EstadoFactura.PAGADA, "USA"},
                        new Object[]{susUSA, "FAC-202601-00006", hoy.minusMonths(2), new BigDecimal("0.00"), EstadoFactura.PAGADA, "USA"}
                );

                for (Object[] d : datosFact) {
                    Suscripcion sus = (Suscripcion) d[0];
                    String numFact = (String) d[1];
                    LocalDate fechaEmision = (LocalDate) d[2];
                    BigDecimal iva = (BigDecimal) d[3];
                    EstadoFactura estado = (EstadoFactura) d[4];
                    String pais = (String) d[5];

                    BigDecimal subtotal = sus.getPrecioActual();
                    BigDecimal montoIva = subtotal.multiply(iva).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
                    BigDecimal total = subtotal.add(montoIva);

                    Factura factura = Factura.builder()
                            .numeroFactura(numFact)
                            .suscripcion(sus)
                            .fechaEmision(fechaEmision)
                            .fechaVencimiento(fechaEmision.plusDays(30))
                            .subtotal(subtotal)
                            .porcentajeImpuestos(iva)
                            .montoImpuestos(montoIva)
                            .total(total)
                            .estado(estado)
                            .concepto("Suscripción " + sus.getPlan().getNombre() + " - " + pais)
                            .esProrrateo(false)
                            .build();

                    if (estado == EstadoFactura.PAGADA) {
                        factura.setFechaPago(fechaEmision.atTime(10, 0).plusDays(1));
                    }

                    facturaRepository.save(factura);
                }

                System.out.println("✓ 9 facturas creadas con impuestos por país");
            }
            
            System.out.println("=== Datos de prueba verificados ===");
        };
    }
}
