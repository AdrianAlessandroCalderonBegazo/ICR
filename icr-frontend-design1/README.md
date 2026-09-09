# ICR — Sitio web (icr-frontend-design1)

Sitio público de **Inversiones ICR**. HTML/JS puro, sin bundler ni framework
de frontend, sin servidor propio: lo sirve `icr-cms-mvp/backend`, el mismo
proceso que expone el panel de administración y la API — un solo servidor
para todo, no dos por separado.

## 🛠️ Tecnologías

* HTML5 + JavaScript (módulos ES nativos, `<script type="module">`)
* Bootstrap 5 + Bootstrap Icons (vendorizados como CSS estático, sin npm en runtime)
* CSS3 (hoja de estilos propia, escrita a mano — no hay Tailwind ni preprocesador)
* `marked` + `DOMPurify` (vendorizados como módulos ESM, para el chatbot)

## 📁 Estructura

```text
icr-frontend-design1/
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

No hay `src/`, no hay paso de `build`, no hay servidor ni `docker-compose.yml`
propios: esta carpeta es pura salida estática. Quien la sirve es
`icr-cms-mvp/backend/src/index.js`, que la monta como estático en `/` (con
URLs limpias — `/nosotros` resuelve a `nosotros.html`) además de servir su
propia API en `/api` y su panel en `/admin`.

## 🚀 Ejecutar el proyecto

```bash
cd icr-cms-mvp/backend
npm install
npm run dev
```

Con ese único comando queda arriba todo: el sitio en `http://localhost:4100/`,
el panel de administración en `http://localhost:4100/admin/` y la API en
`http://localhost:4100/api` — ver [`../icr-cms-mvp/README.md`](../icr-cms-mvp/README.md)
para el detalle (base de datos, variables de entorno, tests).

Para editar contenido estático (textos, imágenes, estructura de una
página), edita directamente el `.html` correspondiente en `public/` — no
hace falta recompilar ni reiniciar nada.

## 🗂️ Panel de contenido (CMS)

El portafolio de `/proyectos`, la portada de la home, las preguntas del
chatbot y los banners de promoción no viven en este código: los sirve el
mismo backend, con su propio panel de administración en `/admin` — ver
[`../icr-cms-mvp/README.md`](../icr-cms-mvp/README.md) para el detalle de
cada colección. Sin ese backend corriendo, cada pieza cae a su
comportamiento por defecto ("no se pudo cargar el portafolio" en
`/proyectos`, textos de respaldo en la portada, chatbot y banner
simplemente ausentes) — pero como es el mismo proceso que sirve este sitio,
si el sitio está arriba, el CMS también lo está.

Las rutas de la API y del panel están fijas como relativas
(`/api`, `/admin/`) en `public/js/config.js` — no hay nada que configurar
por entorno, funcionan igual en local y en producción bajo cualquier dominio.

## ⚙️ Contenido pendiente de reemplazar

Antes de publicar, revisar:

* Las fichas del portafolio marcadas como ejemplo (`placeholder`) en el
  panel de `icr-cms-mvp` son plantillas por sector, no proyectos reales.
* `public/js/config.js` — tarifa, horas sol pico y precios por kWp del
  simulador son valores de referencia sin validar contra cifras
  comerciales de ICR; también los datos de contacto (RUC, dirección,
  teléfono, WhatsApp).
