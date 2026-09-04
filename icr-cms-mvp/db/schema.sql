-- ============================================================
-- ICR CMS — Panel de contenido del sitio web
-- Schema PostgreSQL: 2 tablas
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
