# ICR — Sitio web (icr-frontend-design1)

Sitio público de **Inversiones ICR**. HTML/JS puro, sin bundler ni framework
de frontend — mismo stack que [ICR-LOGISTICA](https://github.com/andreTYS/ICR-LOGISTICA)
(`icr-almacen-mvp`) y que `icr-cms-mvp` de este mismo repo: un servidor
Express sirviendo un directorio estático como único proceso, sin paso de
build en runtime.

## 🛠️ Tecnologías

* HTML5 + JavaScript (módulos ES nativos, `<script type="module">`)
* Express (solo para servir `public/` como estático — `server/`)
* Bootstrap 5 + Bootstrap Icons (vendorizados como CSS estático, sin npm en runtime)
* CSS3 (hoja de estilos propia, escrita a mano — no hay Tailwind ni preprocesador)
* `marked` + `DOMPurify` (vendorizados como módulos ESM, para el chatbot)

## 📁 Estructura

```text
icr-frontend-design1/
├── server/                 Express: sirve public/ como estático
│   ├── package.json
│   ├── index.js
│   └── Dockerfile
├── docker-compose.yml
└── public/                 El sitio en sí — cada página es un .html real
    ├── index.html            Inicio
    ├── nosotros.html         Historia, misión, visión y trayectoria
    ├── soluciones.html       Productos agrupados por desafío
    ├── proyectos.html        Portafolio filtrable por sector (dinámico, vía CMS)
    ├── calculadora.html      Simulador de ahorro solar
    ├── solicitar-asesoria.html  Formulario de cotización en dos pasos
    ├── 404.html              Página no encontrada
    ├── js/                  Módulos ES nativos (uno por página + compartidos)
    └── assets/
        ├── css/styles.css     Hoja de estilos del sitio
        ├── fonts/             Gotham (self-hosted)
        ├── images/            Logo y fotos propias
        └── vendor/            Bootstrap, Bootstrap Icons, marked, DOMPurify
```

No hay `src/`, no hay paso de `build`, no hay variables de entorno de
bundler: lo que está en `public/` es exactamente lo que se sirve.

## 🚀 Ejecutar el proyecto

```bash
cd icr-frontend-design1/server
npm install
npm run dev     # o "npm start" — puerto 5173 por defecto (ver PORT)
```

El sitio queda en `http://localhost:5173/`. Las URLs son limpias
(`/nosotros`, `/soluciones`, ...): el servidor resuelve `/nosotros` al
archivo `public/nosotros.html` automáticamente.

Para editar contenido estático (textos, imágenes, estructura de una
página), edita directamente el `.html` correspondiente en `public/` — no
hace falta recompilar nada.

## 🗂️ Panel de contenido (CMS)

El portafolio de `/proyectos`, la portada de la home, las preguntas del
chatbot y los banners de promoción no viven en este código: los sirve
`icr-cms-mvp/`, un backend propio (Node + Express + PostgreSQL) con su
propio panel de administración — ver
[`../icr-cms-mvp/README.md`](../icr-cms-mvp/README.md) para levantarlo en
local y para el detalle de cada colección. Sin ese backend corriendo, cada
pieza cae a su comportamiento por defecto ("no se pudo cargar el
portafolio" en `/proyectos`, textos de respaldo en la portada, chatbot y
banner simplemente ausentes); el resto del sitio sigue funcionando igual.

La URL de ese backend está en `public/js/config.js` (`CMS_API_URL`,
`CMS_ADMIN_URL`) — edítala ahí antes de desplegar a producción.

## ⚙️ Contenido pendiente de reemplazar

Antes de publicar, revisar:

* Las fichas del portafolio marcadas como ejemplo (`placeholder`) en el
  panel de `icr-cms-mvp` son plantillas por sector, no proyectos reales.
* `public/js/config.js` — tarifa, horas sol pico y precios por kWp del
  simulador son valores de referencia sin validar contra cifras
  comerciales de ICR; también los datos de contacto (RUC, dirección,
  teléfono, WhatsApp).

## 🐳 Producción (VPS)

```bash
docker compose up -d --build
```

`docker-compose.yml` asume una red externa `traefik_public` ya creada por
el mismo Traefik que sirve `icr-almacen-mvp` e `icr-cms-mvp` — ver esos
proyectos para el setup de Traefik si todavía no existe en el VPS. Este
servicio no tiene base de datos propia: es un servidor estático puro.
