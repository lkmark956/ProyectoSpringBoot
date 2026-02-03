# 🚀 Plataforma SaaS - Sistema de Suscripciones y Facturación

Sistema de gestión de suscripciones desarrollado con Spring Boot que permite a usuarios registrarse, elegir planes y gestionar facturación automática.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Diagrama E-R](#diagrama-e-r)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Usuarios de Prueba](#usuarios-de-prueba)
- [Características Implementadas](#características-implementadas)
- [Roadmap](#roadmap)

## 📖 Descripción

Plataforma SaaS que permite:
- **Registro de usuarios** con perfiles completos
- **Suscripción a planes** (Basic, Premium, Enterprise)
- **Facturación automática** cada 30 días
- **Cambio de plan** con cálculo de prorrateo
- **Múltiples métodos de pago** (Tarjeta, PayPal, Transferencia)
- **Historial de cambios** auditado con Hibernate Envers

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Java | 21 | Lenguaje principal |
| Spring Boot | 3.2.2 | Framework backend |
| Spring Data JPA | 3.2.2 | Persistencia de datos |
| Hibernate Envers | 6.4.x | Auditoría de entidades |
| MySQL | 8.x | Base de datos |
| Thymeleaf | 3.1.x | Motor de plantillas |
| Spring Security | 6.2.x | Seguridad y encriptación |
| Lombok | 1.18.30 | Reducción de boilerplate |
| Maven | 3.9.x | Gestión de dependencias |

## 📁 Estructura del Proyecto

```
src/main/java/com/example/ProyectoSpringBoot/
├── config/
│   ├── JpaAuditingConfig.java      # Configuración de auditoría JPA
│   └── SecurityConfig.java          # Configuración de seguridad
├── entity/
│   ├── Usuario.java                 # Entidad de usuario
│   ├── Perfil.java                  # Perfil del usuario
│   ├── Plan.java                    # Planes de suscripción
│   ├── Suscripcion.java             # Suscripciones (auditada)
│   ├── Factura.java                 # Facturas generadas
│   ├── MetodoPago.java              # Clase base para pagos
│   ├── TarjetaCredito.java          # Pago con tarjeta
│   ├── PayPal.java                  # Pago con PayPal
│   └── Transferencia.java           # Pago por transferencia
├── enums/
│   ├── TipoPlan.java                # BASIC, PREMIUM, ENTERPRISE
│   ├── EstadoSuscripcion.java       # ACTIVA, CANCELADA, MOROSA...
│   ├── EstadoFactura.java           # PENDIENTE, PAGADA, VENCIDA...
│   └── TipoMetodoPago.java          # Tipos de métodos de pago
├── repository/
│   ├── UsuarioRepository.java
│   ├── PerfilRepository.java
│   ├── PlanRepository.java
│   ├── SuscripcionRepository.java
│   ├── FacturaRepository.java
│   └── MetodoPagoRepository.java
├── util/
│   └── EncriptadorAES.java          # Encriptación AES-GCM
└── ProyectoSpringBootApplication.java
```

## 📊 Diagrama E-R

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     USUARIO     │       │      PERFIL     │       │      PLAN       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │──1:1──│ id (PK)         │       │ id (PK)         │
│ email           │       │ nombre          │       │ nombre          │
│ password        │       │ apellidos       │       │ tipo_plan       │
│ fecha_creacion  │       │ telefono        │       │ precio_mensual  │
│ activo          │       │ direccion       │       │ descripcion     │
└────────┬────────┘       │ pais            │       │ activo          │
         │                │ usuario_id (FK) │       └────────┬────────┘
         │                └─────────────────┘                │
         │1:N                                                │N:1
         ▼                                                   │
┌─────────────────┐                                          │
│   SUSCRIPCION   │◄─────────────────────────────────────────┘
├─────────────────┤
│ id (PK)         │       ┌─────────────────┐
│ usuario_id (FK) │       │     FACTURA     │
│ plan_id (FK)    │       ├─────────────────┤
│ fecha_inicio    │──1:N──│ id (PK)         │
│ estado          │       │ suscripcion_id  │
│ fecha_prox_cobro│       │ numero_factura  │
└────────┬────────┘       │ total           │
         │                │ estado          │
         │                └─────────────────┘
         │1:N
         ▼
┌─────────────────┐
│  METODO_PAGO    │  ← HERENCIA SINGLE_TABLE
├─────────────────┤
│ id (PK)         │
│ usuario_id (FK) │
│ tipo_metodo     │  ← Discriminador
│ activo          │
├─────────────────┤
│ TARJETA_CREDITO │  numero_tarjeta (encriptado), cvv (encriptado)
│ PAYPAL          │  email_paypal
│ TRANSFERENCIA   │  iban (encriptado), nombre_banco
└─────────────────┘
```

## ⚙️ Instalación

### Prerrequisitos

1. **Java 21** o superior
2. **MySQL 8.x** instalado y ejecutándose
3. **Maven 3.9.x** (o usar el wrapper incluido)

### Clonar el repositorio

```bash
git clone https://github.com/lkmark956/ProyectoSpringBoot.git
cd ProyectoSpringBoot
```

## 🔧 Configuración

### Base de datos MySQL

1. Asegúrate de que MySQL esté ejecutándose en el puerto 3306
2. Las credenciales por defecto son:
   - Usuario: `root`
   - Contraseña: `root`
3. La base de datos `saas_platform` se creará automáticamente

### Archivo application.properties

```properties
# Conexión MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/saas_platform?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root

# Clave de encriptación (cambiar en producción)
app.encryption.secret-key=SaaSPlatform2026!
```

## 🚀 Ejecución

### Con Maven Wrapper (recomendado)

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

### Con Maven instalado

```bash
mvn spring-boot:run
```

### Compilar JAR

```bash
.\mvnw.cmd clean package -DskipTests
java -jar target/ProyectoSpringBoot-0.0.1-SNAPSHOT.jar
```

## 👤 Usuarios de Prueba

Al iniciar la aplicación se crean automáticamente los siguientes datos:

### Planes disponibles

| Plan | Precio | Características |
|------|--------|-----------------|
| **Basic** | 9.99 €/mes | 3 usuarios, 5 GB, Soporte email |
| **Premium** | 29.99 €/mes | 10 usuarios, 50 GB, Soporte 24/7 |
| **Enterprise** | 99.99 €/mes | Ilimitado, SLA 99.9% |

### Usuarios demo

| Email | Contraseña | Plan |
|-------|------------|------|
| demo@saasplatform.com | Demo123456! | Premium |
| test@saasplatform.com | Demo123456! | Basic |

## ✨ Características Implementadas

### Semana 1 ✅

- [x] **Entidades JPA completas** con relaciones @OneToOne, @OneToMany, @ManyToOne
- [x] **Enums** para estados (EstadoSuscripcion, EstadoFactura, TipoPlan)
- [x] **Auditoría con Hibernate Envers** (@Audited en Usuario, Suscripcion, Factura)
- [x] **Herencia de tablas** (SINGLE_TABLE) para MetodoPago
- [x] **Encriptación AES-GCM** para datos sensibles (tarjetas, IBAN)
- [x] **Repositorios JPA** con queries personalizadas
- [x] **Datos iniciales** (planes, usuarios demo)

### Semana 2 (Pendiente)

- [ ] Lógica de renovación automática de suscripciones
- [ ] Cálculo de impuestos según país del usuario
- [ ] Ciclo de vida de la suscripción (Services)
- [ ] Filtrado de facturas por fecha/monto
- [ ] Controllers y vistas básicas

### Semana 3 (Pendiente)

- [ ] Pruebas unitarias (JUnit 5)
- [ ] Documentación completa
- [ ] Diagrama E-R normalizado
- [ ] Tabla de pruebas realizadas

## 📝 Licencia

Este proyecto es de uso educativo para el curso de Desarrollo de Interfaces.

---

**Desarrollado por:** Marco  
**Fecha:** Febrero 2026  
**Asignatura:** Desarrollo de Interfaces - 2º Trimestre