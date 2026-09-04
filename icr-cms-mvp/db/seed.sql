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
