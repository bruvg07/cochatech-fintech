-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================
-- CLIENTES
-- =========================
CREATE TABLE public.clientes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid UNIQUE,

    nombre VARCHAR NOT NULL,
    ci VARCHAR NOT NULL UNIQUE,
    telefono VARCHAR,
    email VARCHAR,
    ciudad VARCHAR,

    ingreso_mensual NUMERIC,

    calificacion CHAR DEFAULT 'A'
        CHECK (calificacion IN ('A','B','C','D','E','F')),

    max_dias_mora SMALLINT DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT clientes_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
);

-- =========================
-- CREDITOS
-- =========================
CREATE TABLE public.creditos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    cliente_id uuid NOT NULL,

    tipo_credito VARCHAR DEFAULT 'CONSUMO',

    monto_original NUMERIC NOT NULL,
    saldo_pendiente NUMERIC NOT NULL,
    saldo_mora NUMERIC DEFAULT 0,

    tasa_interes NUMERIC NOT NULL,
    cuota_mensual NUMERIC NOT NULL,

    plazo_meses SMALLINT NOT NULL,

    fecha_inicio DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,

    dias_mora SMALLINT DEFAULT 0,

    estado VARCHAR DEFAULT 'VIGENTE',

    created_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT creditos_cliente_id_fkey
        FOREIGN KEY (cliente_id)
        REFERENCES public.clientes(id)
);

-- =========================
-- PAGOS
-- =========================
CREATE TABLE public.pagos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    credito_id uuid NOT NULL,
    cliente_id uuid NOT NULL,

    monto NUMERIC NOT NULL,

    canal VARCHAR DEFAULT 'APP',
    estado VARCHAR DEFAULT 'COMPLETADO',

    fecha_vencimiento DATE NOT NULL,
    fecha_pago DATE NOT NULL DEFAULT CURRENT_DATE,

    dias_atraso SMALLINT DEFAULT 0,

    CONSTRAINT pagos_credito_id_fkey
        FOREIGN KEY (credito_id)
        REFERENCES public.creditos(id),

    CONSTRAINT pagos_cliente_id_fkey
        FOREIGN KEY (cliente_id)
        REFERENCES public.clientes(id)
);

-- =========================
-- ALERTAS
-- =========================
CREATE TABLE public.alertas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    credito_id uuid NOT NULL,
    cliente_id uuid NOT NULL,

    tipo VARCHAR,

    urgencia VARCHAR DEFAULT 'MEDIA',

    mensaje TEXT,

    probabilidad_mora NUMERIC,

    canal_sugerido VARCHAR,

    estado VARCHAR DEFAULT 'NUEVA',

    created_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT alertas_credito_id_fkey
        FOREIGN KEY (credito_id)
        REFERENCES public.creditos(id),

    CONSTRAINT alertas_cliente_id_fkey
        FOREIGN KEY (cliente_id)
        REFERENCES public.clientes(id)
);

-- =========================
-- ACUERDOS DE PAGO
-- =========================
CREATE TABLE public.acuerdos_pago (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    credito_id uuid NOT NULL,
    cliente_id uuid NOT NULL,

    tipo VARCHAR DEFAULT 'FRACCIONAMIENTO',

    monto_deuda NUMERIC NOT NULL,

    descuento_mora NUMERIC DEFAULT 0,

    nuevo_plazo_meses SMALLINT,

    nueva_cuota NUMERIC,

    estado VARCHAR DEFAULT 'ACTIVO',

    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,

    created_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT acuerdos_pago_credito_id_fkey
        FOREIGN KEY (credito_id)
        REFERENCES public.creditos(id),

    CONSTRAINT acuerdos_pago_cliente_id_fkey
        FOREIGN KEY (cliente_id)
        REFERENCES public.clientes(id)
);

-- =========================
-- CASOS COBRANZA
-- =========================
CREATE TABLE public.casos_cobranza (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    credito_id uuid NOT NULL,
    cliente_id uuid NOT NULL,

    estado VARCHAR DEFAULT 'ABIERTO',

    prioridad SMALLINT DEFAULT 3,

    dias_mora SMALLINT DEFAULT 0,

    monto_en_mora NUMERIC DEFAULT 0,

    notas TEXT,

    gestor_nombre VARCHAR,

    fecha_apertura DATE DEFAULT CURRENT_DATE,
    fecha_cierre DATE,

    created_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT casos_cobranza_credito_id_fkey
        FOREIGN KEY (credito_id)
        REFERENCES public.creditos(id),

    CONSTRAINT casos_cobranza_cliente_id_fkey
        FOREIGN KEY (cliente_id)
        REFERENCES public.clientes(id)
);

-- =========================
-- EVENTOS SEGURIDAD
-- =========================
CREATE TABLE public.eventos_seguridad (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    cliente_id uuid,

    tipo_evento VARCHAR,

    severidad VARCHAR DEFAULT 'INFO',

    ip_address VARCHAR,

    dispositivo VARCHAR,

    descripcion TEXT,

    fue_fraude BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT eventos_seguridad_cliente_id_fkey
        FOREIGN KEY (cliente_id)
        REFERENCES public.clientes(id)
);

-- =========================
-- NOTIFICACIONES
-- =========================
CREATE TABLE public.notificaciones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    cliente_id uuid NOT NULL,

    canal VARCHAR NOT NULL,

    asunto VARCHAR,

    mensaje TEXT NOT NULL,

    estado VARCHAR DEFAULT 'ENVIADO',

    fue_abierto BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT notificaciones_cliente_id_fkey
        FOREIGN KEY (cliente_id)
        REFERENCES public.clientes(id)
);

-- =========================
-- MIGRATIONS
-- =========================
CREATE TABLE public.migrations (
    id SERIAL PRIMARY KEY,
    migration VARCHAR NOT NULL,
    batch INTEGER NOT NULL
);