package com.example.ProyectoSpringBoot.service;

import com.example.ProyectoSpringBoot.entity.Factura;
import com.example.ProyectoSpringBoot.entity.Suscripcion;
import com.example.ProyectoSpringBoot.enums.EstadoFactura;
import com.example.ProyectoSpringBoot.enums.EstadoSuscripcion;
import com.example.ProyectoSpringBoot.repository.FacturaRepository;
import com.example.ProyectoSpringBoot.repository.SuscripcionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;


@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class RenovacionService {

    private final SuscripcionRepository suscripcionRepository;
    private final FacturaRepository facturaRepository;

    // Contador para números de factura únicos
    private final AtomicLong contadorFactura = new AtomicLong(System.currentTimeMillis());

    // Mapa de impuestos por país (porcentaje IVA/VAT)
    private static final Map<String, BigDecimal> IMPUESTOS_POR_PAIS = Map.ofEntries(
            Map.entry("España", new BigDecimal("21.00")),
            Map.entry("ESPAÑA", new BigDecimal("21.00")),
            Map.entry("Mexico", new BigDecimal("16.00")),
            Map.entry("México", new BigDecimal("16.00")),
            Map.entry("Argentina", new BigDecimal("21.00")),
            Map.entry("Colombia", new BigDecimal("19.00")),
            Map.entry("Chile", new BigDecimal("19.00")),
            Map.entry("Peru", new BigDecimal("18.00")),
            Map.entry("Perú", new BigDecimal("18.00")),
            Map.entry("USA", new BigDecimal("0.00")),      // Sin IVA federal
            Map.entry("Estados Unidos", new BigDecimal("0.00")),
            Map.entry("UK", new BigDecimal("20.00")),
            Map.entry("Reino Unido", new BigDecimal("20.00")),
            Map.entry("Alemania", new BigDecimal("19.00")),
            Map.entry("Francia", new BigDecimal("20.00")),
            Map.entry("Italia", new BigDecimal("22.00")),
            Map.entry("Portugal", new BigDecimal("23.00"))
    );

    private static final BigDecimal IMPUESTO_DEFAULT = new BigDecimal("21.00"); // IVA España por defecto

    //Tarea programada: ejecuta cada día a las 00:05 y procesa todas las suscripciones que deben renovarse 
    @Scheduled(cron = "0 5 0 * * *") // A las 00:05 cada día
    public void procesarRenovacionesDiarias() {
        log.info("=== Iniciando proceso de renovación automática ===");
        LocalDate hoy = LocalDate.now();

        // 1. Obtener suscripciones para renovar
        List<Suscripcion> paraRenovar = suscripcionRepository.findSuscripcionesParaRenovar(hoy);
        log.info("Suscripciones a procesar: {}", paraRenovar.size());

        int renovadas = 0, fallidas = 0;

        for (Suscripcion suscripcion : paraRenovar) {
            try {
                if (procesarRenovacion(suscripcion)) {
                    renovadas++;
                } else {
                    fallidas++;
                }
            } catch (Exception e) {
                log.error("Error procesando suscripción {}: {}", suscripcion.getId(), e.getMessage());
                fallidas++;
            }
        }

        // 2. Marcar morosas (suscripciones con cobro vencido sin renovar)
        int morosas = marcarSuscripcionesMorosas();

        log.info("=== Proceso completado: {} renovadas, {} fallidas, {} marcadas morosas ===",
                renovadas, fallidas, morosas);
    }

    /**
     * Procesa la renovación de una suscripción individual
     * @return true si se renovó correctamente
     */
    public boolean procesarRenovacion(Suscripcion suscripcion) {
        if (!suscripcion.estaActiva() || !suscripcion.getRenovacionAutomatica()) {
            return false;
        }

        // Simular proceso de cobro (siempre exitoso en desarrollo)
        boolean cobroExitoso = simularCobro(suscripcion);

        if (cobroExitoso) {
            // Generar factura
            Factura factura = generarFactura(suscripcion);
            facturaRepository.save(factura);

            // Actualizar fecha próximo cobro (+1 mes)
            suscripcion.setFechaProximoCobro(suscripcion.getFechaProximoCobro().plusMonths(1));
            suscripcionRepository.save(suscripcion);

            log.info("Suscripción {} renovada. Factura: {}", suscripcion.getId(), factura.getNumeroFactura());
            return true;
        } else {
            log.warn("Cobro fallido para suscripción {}", suscripcion.getId());
            return false;
        }
    }

    /**
     * Simula el proceso de cobro al método de pago
     * En producción conectaría con pasarela de pago real
     */
    private boolean simularCobro(Suscripcion suscripcion) {
        // Simulación: 95% de éxito (para demostrar manejo de fallos)
        return Math.random() > 0.05;
    }

    /**
     * Genera una factura para la suscripción
     */
    public Factura generarFactura(Suscripcion suscripcion) {
        BigDecimal subtotal = suscripcion.getPrecioActual() != null
                ? suscripcion.getPrecioActual()
                : suscripcion.getPlan().getPrecioMensual();

        // Obtener impuesto según país del usuario
        String pais = obtenerPaisUsuario(suscripcion);
        BigDecimal porcentajeImpuesto = calcularImpuestosPorPais(pais);

        // Calcular montos
        BigDecimal montoImpuestos = subtotal.multiply(porcentajeImpuesto)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(montoImpuestos);

        String numeroFactura = generarNumeroFactura();

        return Factura.builder()
                .numeroFactura(numeroFactura)
                .suscripcion(suscripcion)
                .fechaEmision(LocalDate.now())
                .fechaVencimiento(LocalDate.now().plusDays(30))
                .subtotal(subtotal)
                .porcentajeImpuestos(porcentajeImpuesto)
                .montoImpuestos(montoImpuestos)
                .total(total)
                .estado(EstadoFactura.PAGADA)
                .fechaPago(LocalDateTime.now())
                .concepto("Suscripción " + suscripcion.getPlan().getNombre() + " - " +
                        suscripcion.getFechaProximoCobro().getMonth().name())
                .esProrrateo(false)
                .build();
    }

    /**
     * Obtiene el país del usuario de la suscripción
     */
    private String obtenerPaisUsuario(Suscripcion suscripcion) {
        if (suscripcion.getUsuario() != null &&
            suscripcion.getUsuario().getPerfil() != null &&
            suscripcion.getUsuario().getPerfil().getPais() != null) {
            return suscripcion.getUsuario().getPerfil().getPais();
        }
        return "España"; // Default
    }

    /**
     * Calcula el porcentaje de impuestos según el país
     */
    public BigDecimal calcularImpuestosPorPais(String pais) {
        if (pais == null || pais.isBlank()) {
            return IMPUESTO_DEFAULT;
        }
        return IMPUESTOS_POR_PAIS.getOrDefault(pais.trim(), IMPUESTO_DEFAULT);
    }

    /**
     * Genera un número único de factura
     */
    private String generarNumeroFactura() {
        String fecha = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
        long secuencial = contadorFactura.incrementAndGet() % 100000;
        return String.format("FAC-%s-%05d", fecha, secuencial);
    }

    /**
     * Marca como morosas las suscripciones con pagos vencidos
     */
    public int marcarSuscripcionesMorosas() {
        LocalDate hoy = LocalDate.now();
        List<Suscripcion> morosas = suscripcionRepository.findMorosas(hoy.minusDays(7)); // 7 días de gracia

        for (Suscripcion s : morosas) {
            s.setEstado(EstadoSuscripcion.MOROSA);
            suscripcionRepository.save(s);
            log.warn("Suscripción {} marcada como MOROSA", s.getId());
        }
        return morosas.size();
    }

    /**
     * Método manual para forzar renovación (útil para testing/admin)
     */
    public void forzarRenovacion(Long suscripcionId) {
        suscripcionRepository.findById(suscripcionId).ifPresent(s -> {
            procesarRenovacion(s);
        });
    }

    /**
     * Obtiene el mapa de impuestos por país
     */
    public Map<String, BigDecimal> obtenerTablasImpuestos() {
        return IMPUESTOS_POR_PAIS;
    }
}
