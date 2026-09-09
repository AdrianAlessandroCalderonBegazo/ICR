# ICR CMS — Panel de contenido del sitio web

Backend propio con base de datos para gestionar el contenido del sitio de
Inversiones ICR: el portafolio de Proyectos, la portada (hero) de la home,
las preguntas frecuentes del chatbot y los banners de promoción por
vigencia. Reemplaza al CMS externo (Decap) que se usó como primera versión
— mismo stack que [ICR-LOGISTICA](https://github.com/andreTYS/ICR-LOGISTICA)
(`icr-almacen-mvp`), para que el equipo mantenga un solo patrón entre las
herramientas internas de ICR: Node/Express con capa de servicios,
PostgreSQL con SQL directo (sin ORM), JWT + bcrypt, y un panel HTML/JS sin
framework de frontend.

**Este mismo proceso sirve también el sitio público** (`icr-frontend-design1`):
no son dos servidores por separado, sino un único Express que sirve el
sitio en `/`, el panel de administración en `/admin` y la API en `/api` —
un solo proceso, un solo puerto, un solo despliegue. Ver "Estructura" más
abajo.

## Colecciones

- **Proyectos** — el portafolio de obras (sector, lugar, métricas, una foto
  opcional). Es la única colección heredada de la primera versión (Decap).
- **Portada** — los textos editables del hero de la home (eyebrow, título,
  descripción, textos y enlaces de los dos botones) más una imagen de fondo
  opcional. Fila única: siempre existe exactamente una portada, el panel
  solo permite editarla.
- **Chatbot** — preguntas frecuentes que alimentan el widget de chat del
  sitio. Cada ficha tiene una pregunta y una respuesta en **Markdown**
  (se renderiza en el sitio con `marked` + `dompurify`, así que soporta
  listas, negritas y enlaces sin arriesgar HTML sin sanear). No es un
  chatbot con IA generativa: responde únicamente con el contenido que se
  cargue aquí.
- **Banners** — avisos superpuestos de promoción, con rango de vigencia
  (`fecha_inicio`/`fecha_fin`). El sitio solo muestra el banner cuya fecha
  actual cae dentro del rango y que esté marcado como activo; se recuerda
  por sesión de navegador si el visitante ya lo cerró (vuelve a aparecer en
  una sesión nueva mientras siga vigente).

## Estructura

```
ICR/                             (raíz del repo)
├── icr-cms-mvp/
│   ├── backend/          Express + PostgreSQL (pg), JWT, capa de servicios
│   │   ├── src/
│   │   │   └── index.js  Un solo servidor: /api, /uploads, /admin y el sitio
│   │   ├── scripts/      seed-admin.js — crea el primer usuario ADMIN
│   │   └── test/         node --test contra Postgres real
│   ├── admin/             Panel HTML/JS + Tailwind (sin build step en runtime)
│   ├── db/
│   │   ├── schema.sql
│   │   └── seed.sql       Los 6 proyectos migrados desde el CMS anterior
│   └── docker-compose.yml Postgres + backend, propio (no comparte con el almacén)
└── icr-frontend-design1/
    └── public/            El sitio — HTML/JS puro, sin servidor propio;
                            lo sirve icr-cms-mvp/backend/src/index.js
```

`icr-cms-mvp/backend/src/index.js` sirve las cuatro cosas desde el mismo
proceso: `/api/*` (esta API), `/uploads/*` (imágenes subidas), `/admin`
(el panel, este mismo repo) y, para cualquier otra ruta, el sitio público
en `../../icr-frontend-design1/public` — de ahí que `icr-frontend-design1`
ya no tenga su propio servidor ni su propio `docker-compose.yml`.

## Por qué backend propio en vez de Decap CMS

La primera versión de este proyecto usó Decap CMS (edición vía commits de
Git). Se reemplazó por este backend porque:
- Usa exactamente el mismo stack que el resto de herramientas internas de
  ICR (`icr-almacen-mvp`), en vez de introducir una tecnología más para
  mantener.
- El contenido vive en una base de datos real: permite estados (publicado/
  oculto), validación en el servidor y crecer hacia más colecciones sin
  pelear con un formato de archivo.
- El panel de administración es una app propia, con el mismo lenguaje
  visual que el resto de sistemas de ICR.

## Desarrollo local

Requiere PostgreSQL corriendo (local o vía Docker) y Node 20+.

```bash
# 1. Crear la base y cargar el schema + los 6 proyectos migrados
createdb icr_cms
psql -d icr_cms -f db/schema.sql
psql -d icr_cms -f db/seed.sql

# 2. Backend
cd backend
npm install
PGUSER=postgres PGPASSWORD=postgres PGDATABASE=icr_cms \
  ADMIN_EMAIL=tu@correo.com ADMIN_PASSWORD="una-contraseña-real" \
  npm run seed:admin
npm run dev   # puerto 4100 por defecto (ver PORT)
```

Con ese único comando (`npm run dev`) ya queda arriba todo:

- El sitio en `http://localhost:4100/`
- El panel de administración en `http://localhost:4100/admin/`
- La API en `http://localhost:4100/api/proyectos`

No hace falta correr ni instalar nada en `icr-frontend-design1` — no tiene
servidor propio, este proceso sirve directamente su carpeta `public/`. Si
esa carpeta no existe (por ejemplo, un clon parcial del repo), el sitio no
carga pero el panel y la API siguen funcionando igual.

### Endpoints de la API

Públicos (sin autenticación):

| Método | Ruta                 | Devuelve                                   |
|--------|----------------------|---------------------------------------------|
| GET    | `/api/proyectos`     | Proyectos publicados                        |
| GET    | `/api/portada`       | La portada actual                           |
| GET    | `/api/chatbot`       | Preguntas del chatbot activas, en orden     |
| GET    | `/api/banners/activos` | Banners vigentes hoy y activos             |

De administración (requieren `Authorization: Bearer <token>` de `/api/auth/login`):

| Método | Ruta                         | Permiso            |
|--------|------------------------------|---------------------|
| GET/POST | `/api/admin/proyectos`     | `proyectos.list` / `.create` |
| PUT/DELETE | `/api/admin/proyectos/:slug` | `proyectos.update` / `.delete` |
| PUT    | `/api/admin/portada`         | `portada.update`   |
| POST   | `/api/admin/proyectos/:slug/imagen` | `proyectos.update` |
| PUT    | `/api/admin/portada/imagen`  | `portada.update`   |
| GET/POST | `/api/admin/chatbot`       | `chatbot.list` / `.create` |
| PUT/DELETE | `/api/admin/chatbot/:id`  | `chatbot.update` / `.delete` |
| GET/POST | `/api/admin/banners`       | `banners.list` / `.create` |
| PUT/DELETE | `/api/admin/banners/:id`  | `banners.update` / `.delete` |

El rol `EDITOR` tiene todos los permisos anteriores salvo los de usuarios;
`ADMIN` tiene acceso total (`*`).

### Imágenes (proyectos y portada)

Los dos endpoints de imagen reciben `multipart/form-data` con el archivo en
el campo `imagen` (JPEG, PNG o WebP, hasta 5MB), lo reescalan a un máximo de
1600px de lado y lo guardan en `backend/uploads/` (servido en `/uploads/*`).
Devuelven la fila actualizada, con `imagen_url` apuntando a la ruta pública
del archivo (ej. `/uploads/<uuid>.jpg`) — el sitio la usa tal cual, sin
anteponerle ningún dominio: es el mismo proceso, mismo origen.

`backend/uploads/` no se versiona en git; en producción es un volumen Docker
propio (`icr_cms_uploads`, ver `docker-compose.yml`) para que las imágenes
sobrevivan a un rebuild de la imagen del contenedor.

### Tests

```bash
cd backend
npm run test   # crea/recrea icr_cms_test — nunca toca icr_cms
```

## Producción (VPS)

```bash
cd icr-cms-mvp   # el build usa la raíz del repo como contexto, pero el compose sigue viviendo acá
cp .env.example .env   # completar DB_PASSWORD, JWT_SECRET, SITE_DOMAIN
docker compose up -d --build
ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed:admin   # una vez, o vía `docker compose exec backend`
```

`docker-compose.yml` compila con el contexto en la raíz del repo (no en
`icr-cms-mvp/`), porque la imagen necesita copiar tanto este backend como
`icr-frontend-design1/public` — ver el Dockerfile. También asume una red
externa `traefik_public` ya creada por el mismo Traefik que sirve
`icr-almacen-mvp` — ver ese proyecto para el setup de Traefik si todavía
no existe en el VPS.

`icr-frontend-design1` no tiene imagen ni servicio propios: su carpeta
`public/` se copia dentro de esta misma imagen y la sirve este backend
(ver `icr-frontend-design1/README.md`). No hay `CMS_API_URL` ni
`CMS_ADMIN_URL` que configurar para producción — son rutas relativas
(`/api`, `/admin/`), correctas para cualquier dominio sin tocar código.

Postgres de este módulo es un contenedor y un volumen propios, separados
de `icr-almacen-mvp` — un incidente o una migración en un sistema no debe
poder afectar al otro.
