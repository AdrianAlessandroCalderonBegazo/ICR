-- Migrado desde src/content/projects/*.json (las mismas fichas que gestionaba Decap CMS).
INSERT INTO proyectos (slug, sector, lugar, titulo, descripcion, metricas, placeholder, publicado, orden) VALUES
(
    'mineria-moquegua',
    'mineria',
    'Moquegua',
    'Planta fotovoltaica para operación minera',
    'Sistema de gran escala para reducir el consumo de diésel en generación de respaldo, con monitoreo remoto integrado a la operación 24/7.',
    '[{"value": "2.4 MW", "label": "Capacidad"}, {"value": "−38%", "label": "Diésel"}, {"value": "2024", "label": "Año"}]'::jsonb,
    true,
    true,
    1
),
(
    'industria-arequipa',
    'industria',
    'Arequipa',
    'Planta industrial con techo solar',
    'Autoconsumo diurno para línea de producción, con retorno de inversión proyectado en menos de 5 años.',
    '[{"value": "480 kWp", "label": "Capacidad"}, {"value": "4.6 años", "label": "Payback"}, {"value": "2023", "label": "Año"}]'::jsonb,
    true,
    true,
    2
),
(
    'hogar-arequipa',
    'hogar',
    'Arequipa',
    'Vivienda con recibo de luz a cero',
    'Sistema residencial dimensionado a partir del consumo real de 12 meses de recibos.',
    '[{"value": "6.2 kWp", "label": "Capacidad"}, {"value": "100%", "label": "Cobertura"}, {"value": "2025", "label": "Año"}]'::jsonb,
    true,
    true,
    3
),
(
    'municipio-moquegua',
    'municipio',
    'Moquegua',
    'Alumbrado público con respaldo solar',
    'Reducción del gasto municipal en energía y cámaras IP integradas al mismo dashboard de monitoreo.',
    '[{"value": "310 kWp", "label": "Capacidad"}, {"value": "−45%", "label": "Gasto eléctrico"}, {"value": "2024", "label": "Año"}]'::jsonb,
    true,
    true,
    4
),
(
    'agro-tacna',
    'agro',
    'Tacna',
    'Bombeo y riego con energía solar',
    'Sistema para bombeo de agua de riego, reduciendo la dependencia de generadores diésel en campo.',
    '[{"value": "150 kWp", "label": "Capacidad"}, {"value": "−60%", "label": "Diésel"}, {"value": "2023", "label": "Año"}]'::jsonb,
    true,
    true,
    5
),
(
    'retail-arequipa',
    'retail',
    'Arequipa',
    'Tienda con autoconsumo diurno',
    'Cobertura del pico de consumo en horario comercial, con cámaras IP integradas al mismo panel de control.',
    '[{"value": "85 kWp", "label": "Capacidad"}, {"value": "3.9 años", "label": "Payback"}, {"value": "2025", "label": "Año"}]'::jsonb,
    true,
    true,
    6
);

-- Portada: usa los valores por defecto de la columna, así que basta un INSERT
-- vacío. Se deja explícito para que quede claro que es intencional (fila
-- única) y no un olvido.
INSERT INTO portada DEFAULT VALUES;

-- Chatbot: preguntas frecuentes de ejemplo — edítalas o reemplázalas desde el panel.
INSERT INTO chatbot_items (pregunta, respuesta_markdown, orden) VALUES
(
    '¿Qué servicios ofrecen?',
    E'Diseñamos, instalamos y respaldamos **soluciones de energía solar** para hogares, empresas e instituciones:\n\n- Energía solar fotovoltaica\n- Respaldo energético (baterías y generadores)\n- Infraestructura eléctrica\n\nMira el detalle en [Soluciones](/soluciones).',
    1
),
(
    '¿Cuánto cuesta un sistema solar?',
    'El precio depende del consumo, la ubicación y el tipo de instalación. Usa nuestra **calculadora de ahorro** para una estimación rápida, o solicita una asesoría gratuita y un ingeniero evalúa tu caso.',
    2
),
(
    '¿En qué zonas trabajan?',
    'Atendemos Arequipa, Moquegua, Tacna y el resto del sur del Perú.',
    3
);

-- Banner de ejemplo, vigente en una ventana amplia para que se vea en demo/desarrollo.
INSERT INTO banners (titulo, mensaje, enlace_texto, enlace_url, fecha_inicio, fecha_fin, activo) VALUES
(
    'Promoción de temporada',
    'Cotiza tu sistema solar este mes y obtén una evaluación técnica sin costo.',
    'Solicitar asesoría',
    '/solicitar-asesoria',
    '2026-01-01',
    '2026-12-31',
    true
);
