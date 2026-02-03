-- =====================================================
-- BASE DE DATOS INICIAL - PLATAFORMA SaaS
-- =====================================================
-- Este script crea los datos iniciales para la aplicación
-- Incluye: Planes, Usuario demo, Perfil y Suscripción de ejemplo
-- =====================================================

-- =====================================================
-- PLANES DE SUSCRIPCIÓN
-- =====================================================
-- Los planes definen los diferentes niveles de servicio

INSERT INTO planes (nombre, tipo_plan, precio_mensual, descripcion, caracteristicas, max_usuarios, almacenamiento_gb, soporte_prioritario, activo, orden_visualizacion, fecha_creacion, fecha_modificacion)
SELECT 'Plan Básico', 'BASIC', 9.99, 
       'Plan ideal para empezar. Incluye las funcionalidades básicas de la plataforma.',
       '• Hasta 3 usuarios\n• 5 GB de almacenamiento\n• Soporte por email\n• Acceso a funciones básicas\n• Actualizaciones incluidas',
       3, 5, false, true, 1, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM planes WHERE tipo_plan = 'BASIC');

INSERT INTO planes (nombre, tipo_plan, precio_mensual, descripcion, caracteristicas, max_usuarios, almacenamiento_gb, soporte_prioritario, activo, orden_visualizacion, fecha_creacion, fecha_modificacion)
SELECT 'Plan Premium', 'PREMIUM', 29.99, 
       'Plan avanzado con más capacidad y funcionalidades premium.',
       '• Hasta 10 usuarios\n• 50 GB de almacenamiento\n• Soporte prioritario 24/7\n• Todas las funciones\n• Informes avanzados\n• Integraciones API\n• Sin publicidad',
       10, 50, true, true, 2, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM planes WHERE tipo_plan = 'PREMIUM');

INSERT INTO planes (nombre, tipo_plan, precio_mensual, descripcion, caracteristicas, max_usuarios, almacenamiento_gb, soporte_prioritario, activo, orden_visualizacion, fecha_creacion, fecha_modificacion)
SELECT 'Plan Empresarial', 'ENTERPRISE', 99.99, 
       'Plan completo para empresas con necesidades avanzadas y personalización.',
       '• Usuarios ilimitados\n• Almacenamiento ilimitado\n• Soporte dedicado 24/7\n• Todas las funciones premium\n• Personalización completa\n• API sin límites\n• SLA garantizado 99.9%\n• Gestor de cuenta dedicado\n• Formación incluida',
       NULL, NULL, true, true, 3, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM planes WHERE tipo_plan = 'ENTERPRISE');

-- =====================================================
-- USUARIO DE DEMOSTRACIÓN
-- =====================================================
-- Contraseña: Demo123456! (encriptada con BCrypt)
-- Este usuario sirve para pruebas del sistema

INSERT INTO usuarios (email, password, activo, email_verificado, fecha_creacion, fecha_modificacion)
SELECT 'demo@saasplatform.com', 
       '$2a$10$N9qo8uLOickgx2ZMRZoMye.IpE4.ZFLuBDlCIAaVQJL3HLjKa3Yxa', -- Demo123456!
       true, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'demo@saasplatform.com');

-- =====================================================
-- PERFIL DEL USUARIO DEMO
-- =====================================================

INSERT INTO perfiles (nombre, apellidos, telefono, direccion, ciudad, codigo_postal, pais, nif_cif, empresa, usuario_id, fecha_creacion, fecha_modificacion)
SELECT 'Usuario', 'Demostración', '+34 612 345 678', 
       'Calle Principal 123, Piso 4B', 'Madrid', '28001', 'España',
       '12345678Z', 'Demo Company S.L.',
       (SELECT id FROM usuarios WHERE email = 'demo@saasplatform.com'),
       NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM perfiles WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'demo@saasplatform.com')
);

-- =====================================================
-- SUSCRIPCIÓN DE EJEMPLO
-- =====================================================
-- El usuario demo tiene una suscripción activa al plan Premium

INSERT INTO suscripciones (fecha_inicio, fecha_fin, fecha_proximo_cobro, estado, renovacion_automatica, precio_actual, usuario_id, plan_id, fecha_creacion, fecha_modificacion, creado_por, modificado_por)
SELECT 
    CURDATE() - INTERVAL 15 DAY,  -- Empezó hace 15 días
    NULL,                          -- Sin fecha fin (renovación automática)
    CURDATE() + INTERVAL 15 DAY,  -- Próximo cobro en 15 días
    'ACTIVA',
    true,
    29.99,
    (SELECT id FROM usuarios WHERE email = 'demo@saasplatform.com'),
    (SELECT id FROM planes WHERE tipo_plan = 'PREMIUM'),
    NOW(), NOW(), 'SYSTEM', 'SYSTEM'
WHERE NOT EXISTS (
    SELECT 1 FROM suscripciones 
    WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'demo@saasplatform.com')
    AND estado = 'ACTIVA'
);

-- =====================================================
-- FACTURA DE EJEMPLO
-- =====================================================
-- Factura generada al inicio de la suscripción (ya pagada)

INSERT INTO facturas (numero_factura, fecha_emision, fecha_vencimiento, fecha_pago, subtotal, porcentaje_impuestos, monto_impuestos, total, estado, concepto, es_prorrateo, notas, suscripcion_id, fecha_creacion, fecha_modificacion)
SELECT 
    CONCAT('FAC-', DATE_FORMAT(CURDATE() - INTERVAL 15 DAY, '%Y%m%d'), '-0001'),
    CURDATE() - INTERVAL 15 DAY,
    CURDATE() - INTERVAL 5 DAY,
    NOW() - INTERVAL 15 DAY,
    24.79,  -- Subtotal sin IVA
    21.00,  -- 21% IVA España
    5.20,   -- Monto IVA
    29.99,  -- Total con IVA
    'PAGADA',
    'Suscripción mensual - Plan Premium (Febrero 2026)',
    false,
    'Factura generada automáticamente al activar la suscripción.',
    (SELECT id FROM suscripciones 
     WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'demo@saasplatform.com') 
     AND estado = 'ACTIVA' LIMIT 1),
    NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM facturas WHERE numero_factura LIKE 'FAC-%-0001'
);

-- =====================================================
-- USUARIO ADICIONAL DE PRUEBA
-- =====================================================
-- Usuario con plan básico para probar cambios de plan

INSERT INTO usuarios (email, password, activo, email_verificado, fecha_creacion, fecha_modificacion)
SELECT 'test@saasplatform.com', 
       '$2a$10$N9qo8uLOickgx2ZMRZoMye.IpE4.ZFLuBDlCIAaVQJL3HLjKa3Yxa', -- Demo123456!
       true, true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'test@saasplatform.com');

INSERT INTO perfiles (nombre, apellidos, telefono, direccion, ciudad, codigo_postal, pais, usuario_id, fecha_creacion, fecha_modificacion)
SELECT 'Test', 'User', '+34 698 765 432', 
       'Avenida Secundaria 456', 'Barcelona', '08001', 'España',
       (SELECT id FROM usuarios WHERE email = 'test@saasplatform.com'),
       NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM perfiles WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'test@saasplatform.com')
);

INSERT INTO suscripciones (fecha_inicio, fecha_fin, fecha_proximo_cobro, estado, renovacion_automatica, precio_actual, usuario_id, plan_id, fecha_creacion, fecha_modificacion, creado_por, modificado_por)
SELECT 
    CURDATE() - INTERVAL 20 DAY,
    NULL,
    CURDATE() + INTERVAL 10 DAY,
    'ACTIVA',
    true,
    9.99,
    (SELECT id FROM usuarios WHERE email = 'test@saasplatform.com'),
    (SELECT id FROM planes WHERE tipo_plan = 'BASIC'),
    NOW(), NOW(), 'SYSTEM', 'SYSTEM'
WHERE NOT EXISTS (
    SELECT 1 FROM suscripciones 
    WHERE usuario_id = (SELECT id FROM usuarios WHERE email = 'test@saasplatform.com')
    AND estado = 'ACTIVA'
);

-- =====================================================
-- RESUMEN DE DATOS CREADOS
-- =====================================================
-- Planes: 3 (Basic: 9.99€, Premium: 29.99€, Enterprise: 99.99€)
-- Usuarios: 2 (demo@saasplatform.com, test@saasplatform.com)
-- Contraseña para ambos: Demo123456!
-- Suscripciones: 2 (Premium y Basic respectivamente)
-- Facturas: 1 (del usuario demo, ya pagada)
-- =====================================================
