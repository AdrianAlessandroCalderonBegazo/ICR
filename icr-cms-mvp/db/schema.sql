-- ============================================================
-- ICR CMS — Panel de contenido del sitio web
-- Schema PostgreSQL: 5 tablas
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------- USUARIOS ----------

CREATE TABLE usuarios (
    usuario_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_completo TEXT NOT NULL,
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    rol_codigo      TEXT NOT NULL CHECK (rol_codigo IN ('ADMIN', 'EDITOR')),
    activo          BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- PROYECTOS (portafolio del sitio) ----------

CREATE TABLE proyectos (
    proyecto_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        TEXT NOT NULL UNIQUE,
    sector      TEXT NOT NULL CHECK (sector IN
                  ('mineria', 'industria', 'hogar', 'municipio', 'agro', 'retail')),
    lugar       TEXT NOT NULL,
    titulo      TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    -- Lista de 1 a 4 pares {value, label} (ej: {"value":"2.4 MW","label":"Capacidad"}).
    -- JSONB en vez de tabla aparte: siempre se lee y se edita junto con el
    -- proyecto, nunca se consulta de forma independiente.
    metricas    JSONB NOT NULL DEFAULT '[]',
    -- Placeholder: ficha de ejemplo pendiente de reemplazar con datos reales
    -- (mismo concepto que ya usaba el sitio con Decap CMS).
    placeholder BOOLEAN NOT NULL DEFAULT true,
    -- Publicado: permite ocultar una ficha del sitio sin borrarla. El sitio
    -- público solo lista publicado = true; el panel de admin ve todas.
    publicado   BOOLEAN NOT NULL DEFAULT true,
    orden       INT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT metricas_es_array CHECK (jsonb_typeof(metricas) = 'array'),
    CONSTRAINT metricas_maximo_4 CHECK (jsonb_array_length(metricas) BETWEEN 1 AND 4)
);

CREATE INDEX idx_proyectos_sector ON proyectos (sector);
CREATE INDEX idx_proyectos_publicado_orden ON proyectos (publicado, orden);

-- ---------- PORTADA (hero de Inicio) ----------
-- Tabla singleton: siempre hay una sola fila. El servicio hace upsert sobre
-- esa fila en vez de manejar altas/bajas — no tiene sentido "crear otra
-- portada", el sitio solo tiene una.

CREATE TABLE portada (
    portada_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eyebrow         TEXT NOT NULL DEFAULT 'INVERSIONES ICR',
    titulo_linea1   TEXT NOT NULL DEFAULT 'Energía confiable.',
    titulo_linea2   TEXT NOT NULL DEFAULT 'Soluciones',
    titulo_destacado TEXT NOT NULL DEFAULT 'inteligentes.',
    descripcion     TEXT NOT NULL DEFAULT 'Diseñamos e implementamos soluciones energéticas que combinan ingeniería, tecnología y equipos confiables para garantizar eficiencia y continuidad operativa.',
    cta_primario_texto TEXT NOT NULL DEFAULT 'Conoce nuestras soluciones',
    cta_primario_link  TEXT NOT NULL DEFAULT '/soluciones',
    cta_secundario_texto TEXT NOT NULL DEFAULT 'Solicitar asesoría',
    cta_secundario_link  TEXT NOT NULL DEFAULT '/solicitar-asesoria',
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- CHATBOT (preguntas frecuentes en markdown) ----------
-- No es un chatbot de IA generativa: son respuestas fijas que el editor
-- escribe en Markdown desde el panel. El widget del sitio las muestra como
-- botones de acceso rápido y renderiza la respuesta al hacer clic.

CREATE TABLE chatbot_items (
    item_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pregunta            TEXT NOT NULL,
    respuesta_markdown  TEXT NOT NULL,
    orden               INT NOT NULL DEFAULT 0,
    activo              BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chatbot_activo_orden ON chatbot_items (activo, orden);

-- ---------- BANNERS (promociones superpuestas por fecha) ----------

CREATE TABLE banners (
    banner_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo        TEXT NOT NULL,
    mensaje       TEXT NOT NULL,
    enlace_texto  TEXT,
    enlace_url    TEXT,
    fecha_inicio  DATE NOT NULL,
    fecha_fin     DATE NOT NULL,
    activo        BOOLEAN NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT banner_rango_fechas_valido CHECK (fecha_fin >= fecha_inicio)
);

CREATE INDEX idx_banners_vigencia ON banners (activo, fecha_inicio, fecha_fin);
