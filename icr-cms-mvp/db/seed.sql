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

-- Productos: migrados desde el HTML estático de /soluciones.
INSERT INTO productos (grupo, titulo, descripcion, caracteristicas, orden) VALUES
(
    'energia-solar', 'Kit Solar Residencial 3kW',
    'Pensado para hogares con consumo mensual moderado que buscan reducir su recibo de luz.',
    '["Paneles monocristalinos de alta eficiencia", "Inversor con monitoreo remoto vía app", "Instalación y garantía incluida (10 años)"]'::jsonb,
    1
),
(
    'energia-solar', 'Kit Solar Comercial 10kW',
    'Diseñado para negocios y locales comerciales con mayor consumo energético.',
    '["Escalable según la demanda del negocio", "Retorno de inversión estimado en 3 a 5 años", "Mantenimiento preventivo incluido"]'::jsonb,
    2
),
(
    'respaldo-energetico', 'Sistema de Baterías de Respaldo',
    'Entrega continuidad automática ante cortes de luz, sin interrupciones perceptibles.',
    '["Activación automática en milisegundos", "Compatible con sistemas solares existentes", "Autonomía configurable según tu carga"]'::jsonb,
    1
),
(
    'respaldo-energetico', 'Grupo Electrógeno Industrial',
    'Respaldo robusto para instalaciones críticas que no pueden detenerse.',
    '["Arranque automático ante corte de red", "Funciona con diésel o gas", "Panel de transferencia automática (ATS)"]'::jsonb,
    2
),
(
    'infraestructura', 'Diseño e Instalación de Subestaciones',
    'Infraestructura eléctrica a medida para proyectos industriales y comerciales.',
    '["Ingeniería certificada de principio a fin", "Cumplimiento de la normativa eléctrica vigente", "Supervisión técnica durante toda la obra"]'::jsonb,
    1
),
(
    'infraestructura', 'Modernización de Tableros Eléctricos',
    'Actualiza instalaciones antiguas a estándares de seguridad y eficiencia actuales.',
    '["Diagnóstico eléctrico previo incluido", "Reducción de riesgos eléctricos", "Mejora en la eficiencia energética"]'::jsonb,
    2
);

-- Nosotros: usa los valores del HTML estático que reemplaza; fila única (singleton).
INSERT INTO nosotros (historia_p1, historia_p2, historia_p3, mision, vision, trayectoria) VALUES
(
    'Inversiones ICR nació en Arequipa en 2016, impulsada por un grupo de ingenieros eléctricos que veía de cerca un mismo problema una y otra vez: familias y negocios pagando cada vez más por una energía cada vez menos confiable. Empezamos instalando sistemas solares pequeños para hogares y comercios locales, resolviendo cada proyecto con el mismo cuidado técnico, sin importar el tamaño.',
    'Con el tiempo, ese mismo enfoque nos permitió crecer hacia proyectos industriales y de infraestructura energética de mayor escala, siempre manteniendo la base que nos formó: entender primero la necesidad energética real del cliente, y recién después diseñar la solución técnica adecuada — nunca al revés.',
    'Hoy seguimos siendo una empresa de ingenieros: diseñamos, instalamos y respaldamos cada sistema que entregamos, combinando tecnología de alto desempeño con un servicio cercano y honesto.',
    'Diseñar, implementar y respaldar soluciones energéticas utilizando tecnología de alta calidad y conocimiento técnico especializado.',
    'Convertirnos en una empresa referente a nivel nacional en soluciones energéticas inteligentes, reconocida por nuestra capacidad técnica, innovación y compromiso.',
    '[
      {"anio": "2016", "titulo": "Fundación", "descripcion": "Inversiones ICR nace en Arequipa con un pequeño equipo de ingenieros eléctricos."},
      {"anio": "2019", "titulo": "Primeros proyectos industriales", "descripcion": "Ampliamos de instalaciones residenciales a proyectos de mayor escala para empresas."},
      {"anio": "2022", "titulo": "Expansión regional", "descripcion": "Llevamos nuestras soluciones de energía solar y respaldo energético a nuevas regiones del país."},
      {"anio": "2026", "titulo": "Hoy", "descripcion": "Seguimos creciendo junto a familias, negocios e instituciones que confían en nosotros."}
    ]'::jsonb
);

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
