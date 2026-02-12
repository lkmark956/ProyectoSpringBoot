# Plataforma SaaS

Sistema de gestión de suscripciones con facturación automática e impuestos por país.

## Tecnologías

- **Backend:** Spring Boot 3.2, Spring Data JPA, Hibernate Envers
- **Frontend:** React 18, Vite, Tailwind CSS
- **Base de datos:** H2 (desarrollo) / MySQL (producción)

## Funcionalidades

### Semana 1
- Entidades JPA con auditoría (@Audited)
- Herencia de entidades (MetodoPago → TarjetaCredito, PayPal, Transferencia)
- Relaciones @OneToMany, @ManyToOne, @OneToOne
- DTOs para entrada/salida (no expone entidades directamente)

### Semana 2
- **Renovación automática** de suscripciones (@Scheduled diario)
- **Cálculo de impuestos** según país del usuario (IVA España 21%, México 16%, etc.)
- **Filtrado de facturas** por fecha y monto
- **Vista de Facturación** con tabla de facturas e impuestos
- **Panel de Auditoría** (Admin) - historial de cambios con Envers

## Diagrama E-R

```
Usuario (1) -----> (1) Perfil
   |
   | 1:N
   v
Suscripcion (N) <----- (1) Plan
   |                       - BASIC
   | 1:N                   - PREMIUM
   v                       - ENTERPRISE
Factura

MetodoPago (Herencia SINGLE_TABLE)
   |-- TarjetaCredito
   |-- PayPal
   |-- Transferencia
```

## API Endpoints

### Facturas
- `GET /api/facturas` - Todas las facturas
- `GET /api/facturas/filtrar/fecha?inicio=&fin=` - Por rango de fechas
- `GET /api/facturas/filtrar/monto?min=&max=` - Por rango de monto
- `GET /api/facturas/impuestos` - Tabla de IVA por país

### Auditoría
- `GET /api/auditoria/suscripciones` - Historial de cambios
- `GET /api/auditoria/usuarios` - Historial de usuarios

## Instalación

### Backend
```bash
.\mvnw.cmd spring-boot:run
```
http://localhost:8080

### Frontend
```bash
cd frontend
npm install
npm run dev
```
http://localhost:5173

## Perfiles de BD

Editar `spring.profiles.active` en `application.properties`:
- `dev`: H2 en memoria (por defecto)
- `mysql`: MySQL localhost:3306

