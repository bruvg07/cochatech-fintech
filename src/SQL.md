-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.acuerdos_pago (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  credito_id uuid NOT NULL,
  cliente_id uuid NOT NULL,
  tipo character varying DEFAULT 'FRACCIONAMIENTO'::character varying,
  monto_deuda numeric NOT NULL,
  descuento_mora numeric DEFAULT 0,
  nuevo_plazo_meses smallint,
  nueva_cuota numeric,
  estado character varying DEFAULT 'ACTIVO'::character varying,
  fecha_inicio date NOT NULL,
  fecha_fin date,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT acuerdos_pago_pkey PRIMARY KEY (id),
  CONSTRAINT acuerdos_pago_credito_id_fkey FOREIGN KEY (credito_id) REFERENCES public.creditos(id),
  CONSTRAINT acuerdos_pago_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id)
);
CREATE TABLE public.alertas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  credito_id uuid NOT NULL,
  cliente_id uuid NOT NULL,
  tipo character varying,
  urgencia character varying DEFAULT 'MEDIA'::character varying,
  mensaje text,
  probabilidad_mora numeric,
  canal_sugerido character varying,
  estado character varying DEFAULT 'NUEVA'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT alertas_pkey PRIMARY KEY (id),
  CONSTRAINT alertas_credito_id_fkey FOREIGN KEY (credito_id) REFERENCES public.creditos(id),
  CONSTRAINT alertas_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id)
);
CREATE TABLE public.casos_cobranza (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  credito_id uuid NOT NULL,
  cliente_id uuid NOT NULL,
  estado character varying DEFAULT 'ABIERTO'::character varying,
  prioridad smallint DEFAULT 3,
  dias_mora smallint DEFAULT 0,
  monto_en_mora numeric DEFAULT 0,
  notas text,
  gestor_nombre character varying,
  fecha_apertura date DEFAULT CURRENT_DATE,
  fecha_cierre date,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT casos_cobranza_pkey PRIMARY KEY (id),
  CONSTRAINT casos_cobranza_credito_id_fkey FOREIGN KEY (credito_id) REFERENCES public.creditos(id),
  CONSTRAINT casos_cobranza_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id)
);
CREATE TABLE public.clientes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre character varying NOT NULL,
  ci character varying NOT NULL UNIQUE,
  telefono character varying,
  email character varying,
  ciudad character varying,
  ingreso_mensual numeric,
  calificacion character DEFAULT 'A'::bpchar CHECK (calificacion = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar, 'D'::bpchar, 'E'::bpchar, 'F'::bpchar])),
  max_dias_mora smallint DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  pass character varying,
  CONSTRAINT clientes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.creditos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL,
  tipo_credito character varying DEFAULT 'CONSUMO'::character varying,
  monto_original numeric NOT NULL,
  saldo_pendiente numeric NOT NULL,
  saldo_mora numeric DEFAULT 0,
  tasa_interes numeric NOT NULL,
  cuota_mensual numeric NOT NULL,
  plazo_meses smallint NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_vencimiento date NOT NULL,
  dias_mora smallint DEFAULT 0,
  estado character varying DEFAULT 'VIGENTE'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT creditos_pkey PRIMARY KEY (id),
  CONSTRAINT creditos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id)
);
CREATE TABLE public.eventos_seguridad (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cliente_id uuid,
  tipo_evento character varying,
  severidad character varying DEFAULT 'INFO'::character varying,
  ip_address character varying,
  dispositivo character varying,
  descripcion text,
  fue_fraude boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT eventos_seguridad_pkey PRIMARY KEY (id),
  CONSTRAINT eventos_seguridad_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id)
);
CREATE TABLE public.notificaciones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL,
  canal character varying NOT NULL,
  asunto character varying,
  mensaje text NOT NULL,
  estado character varying DEFAULT 'ENVIADO'::character varying,
  fue_abierto boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notificaciones_pkey PRIMARY KEY (id),
  CONSTRAINT notificaciones_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id)
);
CREATE TABLE public.pagos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  credito_id uuid NOT NULL,
  cliente_id uuid NOT NULL,
  monto numeric NOT NULL,
  canal character varying DEFAULT 'APP'::character varying,
  estado character varying DEFAULT 'COMPLETADO'::character varying,
  fecha_vencimiento date NOT NULL,
  fecha_pago date NOT NULL DEFAULT CURRENT_DATE,
  dias_atraso smallint DEFAULT 0,
  CONSTRAINT pagos_pkey PRIMARY KEY (id),
  CONSTRAINT pagos_credito_id_fkey FOREIGN KEY (credito_id) REFERENCES public.creditos(id),
  CONSTRAINT pagos_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.clientes(id)
);