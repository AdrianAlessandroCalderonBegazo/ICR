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

## Colecciones

- **Proyectos** — el portafolio de obras (sector, lugar, métricas). Es la
  única colección heredada de la primera versión (Decap).
- **Portada** — los textos editables del hero de la home (eyebrow, título,
  descripción, textos y enlaces de los dos botones). Fila única: siempre
  existe exactamente una portada, el panel solo permite editarla.
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
icr-cms-mvp/
├── backend/          Express + PostgreSQL (pg), JWT, capa de servicios
│   ├── src/
│   ├── scripts/      seed-admin.js — crea el primer usuario ADMIN
│   └── test/         node --test contra Postgres real
├── admin/             Panel HTML/JS + Tailwind (sin build step en runtime)
├── db/
│   ├── schema.sql
│   └── seed.sql       Los 6 proyectos migrados desde el CMS anterior
└── docker-compose.yml Postgres + backend, propio (no comparte con el almacén)
```

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

El panel queda en `http://localhost:4100/` y la API pública en
`http://localhost:4100/api/proyectos`.

**El sitio web** (`icr-frontend-design1`) necesita que este backend esté
corriendo para mostrar `/proyectos`, la portada, el chatbot y los banners —
apunta ahí por defecto en desarrollo (`src/config/cms.js`). Sin este
backend arriba, cada pieza cae a su comportamiento por defecto: el
portafolio muestra el aviso de "no se pudo cargar", la portada usa sus
textos de respaldo embebidos, y el chatbot y el banner simplemente no se
muestran — el resto del sitio funciona igual.

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
| GET/POST | `/api/admin/chatbot`       | `chatbot.list` / `.create` |
| PUT/DELETE | `/api/admin/chatbot/:id`  | `chatbot.update` / `.delete` |
| GET/POST | `/api/admin/banners`       | `banners.list` / `.create` |
| PUT/DELETE | `/api/admin/banners/:id`  | `banners.update` / `.delete` |

El rol `EDITOR` tiene todos los permisos anteriores salvo los de usuarios;
`ADMIN` tiene acceso total (`*`).

### Tests

```bash
cd backend
npm run test   # crea/recrea icr_cms_test — nunca toca icr_cms
```

## Producción (VPS)

```bash
cp .env.example .env   # completar DB_PASSWORD, JWT_SECRET, CMS_DOMAIN, SITE_DOMAIN
docker compose up -d --build
ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed:admin   # una vez, o vía `docker compose exec backend`
```

`docker-compose.yml` asume una red externa `traefik_public` ya creada por
el mismo Traefik que sirve `icr-almacen-mvp` (o el sitio principal) — ver
ese proyecto para el setup de Traefik si todavía no existe en el VPS.

En el sitio (`icr-frontend-design1`), definir en su `.env` de build:
```
VITE_CMS_API_URL=https://cms.inversionesicr.com/api
VITE_CMS_ADMIN_URL=https://cms.inversionesicr.com/
```

Postgres de este módulo es un contenedor y un volumen propios, separados
de `icr-almacen-mvp` — un incidente o una migración en un sistema no debe
poder afectar al otro.
