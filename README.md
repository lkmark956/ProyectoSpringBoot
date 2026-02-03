# 🚀 SaaS Platform - Sistema de Gestión de Suscripciones

> **Proyecto Spring Boot + React** | Desarrollo de Interfaces - 2º Trimestre  
> Semana 1: Modelado de Datos y Persistencia

---

## 📋 Descripción

Plataforma SaaS (Software as a Service) para la gestión de suscripciones, usuarios y facturación. Este proyecto implementa una arquitectura moderna **Full-Stack** con:

- **Backend**: Spring Boot 3.2.2 + JPA + Hibernate Envers
- **Frontend**: React 18 + Vite + TailwindCSS
- **Base de Datos**: H2 (desarrollo) / MySQL (producción)

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (React + Vite)                     │
│                    Puerto: 5173                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  App.jsx (React Router)                              │    │
│  │    ├── Layout.jsx (Header + Footer reutilizable)     │    │
│  │    ├── PlanesPage.jsx (CRUD completo)               │    │
│  │    ├── UsuariosPage.jsx                             │    │
│  │    ├── SuscripcionesPage.jsx                        │    │
│  │    └── FacturasPage.jsx                             │    │
│  └─────────────────────────────────────────────────────┘    │
│                         │ HTTP/JSON                          │
└─────────────────────────┼────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Spring Boot 3.2.2)                     │
│                    Puerto: 8080                              │
├─────────────────────────────────────────────────────────────┤
│  REST Controllers (@RestController)                          │
│    └─ /api/planes, /api/usuarios, /api/suscripciones        │
├─────────────────────────────────────────────────────────────┤
│  Services (@Service + @Transactional)                        │
│    └─ Lógica de negocio separada del Controller             │
├─────────────────────────────────────────────────────────────┤
│  DTOs (Data Transfer Objects)                                │
│    └─ Separación entre entidades JPA y API REST             │
├─────────────────────────────────────────────────────────────┤
│  Repositories (Spring Data JPA)                              │
│    └─ extends JpaRepository<Entity, Long>                   │
├─────────────────────────────────────────────────────────────┤
│  Entities (JPA + Hibernate Envers)                           │
│    ├─ Plan (BASIC, PREMIUM, ENTERPRISE)                      │
│    ├─ Usuario + Perfil (@OneToOne)                           │
│    ├─ Suscripcion (@Audited - historial de cambios)          │
│    ├─ Factura (generada automáticamente)                     │
│    └─ MetodoPago (@Inheritance) → Tarjeta, PayPal, Transfer. │
├─────────────────────────────────────────────────────────────┤
│  H2 Database (tablas + tablas _AUD para auditoría)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗃️ Diagrama Entidad-Relación (E-R)

```
┌─────────────┐       1:1        ┌─────────────┐
│   Usuario   │─────────────────▶│   Perfil    │
├─────────────┤                  ├─────────────┤
│ id (PK)     │                  │ id (PK)     │
│ email       │                  │ nombre      │
│ password    │                  │ apellidos   │
│ activo      │                  │ telefono    │
└──────┬──────┘                  │ direccion   │
       │                         │ pais        │
       │ 1:N                     │ usuario_id  │
       ▼                         └─────────────┘
┌─────────────┐
│Suscripcion  │◀─────────────────┐
├─────────────┤  N:1             │
│ id (PK)     │        ┌─────────┴─────┐
│ fecha_inicio│        │     Plan      │
│ fecha_fin   │        ├───────────────┤
│ estado      │        │ id (PK)       │
│ usuario_id  │        │ nombre        │
│ plan_id     │        │ tipo_plan     │
│ @Audited    │        │ precio_mensual│
└──────┬──────┘        │ max_usuarios  │
       │               └───────────────┘
       │ 1:N
       ▼
┌─────────────┐
│   Factura   │
├─────────────┤
│ id (PK)     │
│ numero      │
│ monto       │
│ estado      │
│ suscripcion │
└─────────────┘

┌─────────────────────────────────────────────────┐
│            MetodoPago (HERENCIA)                │
│         @Inheritance(SINGLE_TABLE)              │
├─────────────────────────────────────────────────┤
│ id (PK)                                         │
│ alias                                           │
│ tipo_metodo (discriminator)                     │
│ usuario_id (FK)                                 │
├─────────────────────────────────────────────────┤
│    ┌──────────────┐ ┌──────────┐ ┌───────────┐ │
│    │TarjetaCredito│ │  PayPal  │ │Transferenc│ │
│    ├──────────────┤ ├──────────┤ ├───────────┤ │
│    │ numero_tarjet│ │ email    │ │ banco     │ │
│    │ cvv          │ │          │ │ iban      │ │
│    │ fecha_exp    │ │          │ │ swift     │ │
│    └──────────────┘ └──────────┘ └───────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Tecnologías Utilizadas

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Java** | 21 | Lenguaje principal |
| **Spring Boot** | 3.2.2 | Framework backend |
| **Spring Data JPA** | - | Persistencia ORM |
| **Hibernate Envers** | - | Auditoría de cambios (@Audited) |
| **H2 Database** | - | BD en memoria (desarrollo) |
| **Lombok** | - | Reducir boilerplate |
| **Bean Validation** | - | Validación de datos |

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 18.3 | Librería UI |
| **Vite** | 5.4 | Build tool rápido |
| **TailwindCSS** | 3.4 | Framework CSS utility-first |
| **React Router** | 6.28 | Navegación SPA |

---

## 📂 Estructura del Proyecto

```
ProyectoSpringBoot/
├── frontend/                          # REACT + VITE
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx            # Header/Footer reutilizable
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── PlanesPage.jsx        # CRUD Planes ★
│   │   │   ├── UsuariosPage.jsx
│   │   │   ├── SuscripcionesPage.jsx
│   │   │   └── FacturasPage.jsx
│   │   ├── services/
│   │   │   └── api.js                # Cliente REST
│   │   ├── App.jsx                   # Router principal
│   │   └── main.jsx                  # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── src/main/java/com/example/ProyectoSpringBoot/
│   ├── config/
│   │   ├── CorsConfig.java           # CORS para React
│   │   ├── SecurityConfig.java       # Spring Security
│   │   ├── JpaAuditingConfig.java    # Auditoría JPA
│   │   └── DataInitializer.java      # Datos de prueba
│   │
│   ├── controller/api/               # REST Controllers
│   │   ├── PlanRestController.java
│   │   ├── UsuarioRestController.java
│   │   ├── SuscripcionRestController.java
│   │   └── FacturaRestController.java
│   │
│   ├── dto/                          # Data Transfer Objects
│   │   ├── PlanDTO.java
│   │   ├── UsuarioDTO.java
│   │   ├── SuscripcionDTO.java
│   │   └── FacturaDTO.java
│   │
│   ├── entity/                       # Entidades JPA
│   │   ├── Plan.java                 # TipoPlan: BASIC/PREMIUM/ENTERPRISE
│   │   ├── Usuario.java
│   │   ├── Perfil.java
│   │   ├── Suscripcion.java          # @Audited (Envers)
│   │   ├── Factura.java
│   │   ├── MetodoPago.java           # @Inheritance (clase abstracta)
│   │   ├── TarjetaCredito.java       # Extiende MetodoPago
│   │   ├── PayPal.java               # Extiende MetodoPago
│   │   └── Transferencia.java        # Extiende MetodoPago
│   │
│   ├── enums/
│   │   ├── TipoPlan.java             # BASIC, PREMIUM, ENTERPRISE
│   │   ├── EstadoSuscripcion.java    # ACTIVA, CANCELADA, MOROSA
│   │   ├── EstadoFactura.java        # PENDIENTE, PAGADA, VENCIDA
│   │   └── TipoMetodoPago.java
│   │
│   ├── repository/                   # Spring Data JPA
│   │   ├── PlanRepository.java
│   │   ├── UsuarioRepository.java
│   │   ├── PerfilRepository.java
│   │   ├── SuscripcionRepository.java
│   │   ├── FacturaRepository.java
│   │   └── MetodoPagoRepository.java
│   │
│   └── service/                      # Lógica de negocio
│       ├── PlanService.java
│       ├── UsuarioService.java
│       ├── SuscripcionService.java
│       └── FacturaService.java
│
├── src/main/resources/
│   └── application.properties        # Configuración H2
│
├── pom.xml                           # Dependencias Maven
└── README.md                         # Este archivo
```

---

## 🚀 Instalación y Ejecución

### Requisitos Previos
- **Java 21** o superior
- **Node.js 18+** (para el frontend React)
- **Maven** (incluido con mvnw)

### 1️⃣ Clonar el Repositorio
```bash
git clone https://github.com/lkmark956/ProyectoSpringBoot.git
cd ProyectoSpringBoot
```

### 2️⃣ Ejecutar el Backend (Spring Boot)
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```
El backend estará disponible en: `http://localhost:8080`

### 3️⃣ Ejecutar el Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
El frontend estará disponible en: `http://localhost:5173`

### 4️⃣ Acceder a la Aplicación
- **Frontend React**: http://localhost:5173
- **API REST**: http://localhost:8080/api/planes
- **H2 Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:saas_platform`
  - User: `sa` | Password: (vacío)

---

## 📡 API REST Endpoints

### Planes
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/planes` | Obtener todos los planes |
| GET | `/api/planes/{id}` | Obtener plan por ID |
| GET | `/api/planes/activos` | Solo planes activos |
| POST | `/api/planes` | Crear nuevo plan |
| PUT | `/api/planes/{id}` | Actualizar plan |
| DELETE | `/api/planes/{id}` | Eliminar plan |

### Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Obtener todos los usuarios |
| GET | `/api/usuarios/{id}` | Obtener usuario por ID |
| POST | `/api/usuarios` | Crear nuevo usuario |

### Suscripciones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/suscripciones` | Obtener todas las suscripciones |
| GET | `/api/suscripciones/{id}` | Obtener suscripción por ID |

### Facturas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/facturas` | Obtener todas las facturas |
| GET | `/api/facturas/{id}` | Obtener factura por ID |

---

## ✅ Criterios de Evaluación - Semana 1

### 1. Modelado de Datos y Persistencia (3/3 puntos)
- ✅ **@OneToMany**: Plan → Suscripciones, Usuario → MetodosPago
- ✅ **@ManyToOne**: Suscripcion → Usuario, Suscripcion → Plan
- ✅ **@OneToOne**: Usuario ↔ Perfil
- ✅ **Herencia de entidades**: `MetodoPago` → `TarjetaCredito`, `PayPal`, `Transferencia`
- ✅ **Enums**: `TipoPlan`, `EstadoSuscripcion`, `EstadoFactura`
- ✅ **Auditoría Envers**: `@Audited` en Suscripcion para historial de cambios

### 2. Lógica de Negocio (3/3 puntos)
- ✅ **Controllers limpios**: Solo delegan a la capa de Service
- ✅ **Services con @Transactional**: Toda la lógica de negocio
- ✅ **DTOs**: No se exponen entidades JPA directamente

### 3. Vista (3/3 puntos)
- ✅ **Interfaz funcional**: React SPA con navegación
- ✅ **Componentes reutilizables**: Layout.jsx (Header/Footer)
- ✅ **TailwindCSS**: Diseño moderno y responsive
- ✅ **Validación visual**: Mensajes de error/éxito en formularios

### 4. Documentación y Github (3/3 puntos)
- ✅ **README profesional**: Este archivo
- ✅ **Diagrama E-R**: Incluido arriba
- ✅ **Control de versiones**: Git + GitHub
- ✅ **Instrucciones de instalación**: Completas

---

## 👨‍💻 Autor

**Desarrollo de Interfaces - 2º Trimestre**  
Proyecto Spring Boot + React

---

## 📄 Licencia

Este proyecto es para fines educativos.
