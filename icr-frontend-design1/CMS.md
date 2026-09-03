# Panel de contenido (CMS)

El sitio incluye un panel de edición en **`/admin`** para que alguien del
equipo pueda actualizar el portafolio de proyectos sin tocar código ni pedir
un deploy a un desarrollador. Usa [Decap CMS](https://decapcms.org/): un
editor que corre en el navegador y trabaja directamente sobre los archivos
de este repositorio — no hay base de datos propia que mantener.

No usa Netlify en ningún punto: ni para hosting, ni para el login del
panel. Localmente corre 100% sin servicios externos; en producción (VPS)
usa GitHub directo como backend.

## Qué gestiona hoy

Solo la colección **Proyectos** (`/proyectos`), que vive en
`src/content/projects/*.json` — un archivo por ficha. Es el contenido que ya
estaba marcado como "placeholder, reemplazar antes de publicar", así que es
el primer candidato natural. La lista de sectores (`src/data/projects.js`)
sigue en código porque es una taxonomía corta y estable; agregar un sector
nuevo todavía requiere un cambio de código ahí y en las opciones de
`public/admin/config.yml`.

Es el punto de partida, no el límite: agregar una colección nueva (por
ejemplo, los textos de Soluciones o los hitos de Nosotros) significa mover
ese contenido a su propia carpeta de JSON y sumar unas pocas líneas al mismo
`config.yml` — mismo patrón que Proyectos.

## Uso en local

Se necesitan **dos terminales** abiertas a la vez, ambas dentro de
`icr-frontend-design1/`:

```bash
# Terminal 1 — el sitio
npm run dev

# Terminal 2 — el servidor local del CMS (puerto 8081)
npm run cms
```

Con los dos corriendo, entra a `http://localhost:5173/admin/`. No pide
login: `config.yml` tiene `local_backend: true`, que hace que Decap CMS
detecte que estás en `localhost` y hable con el servidor de la Terminal 2
en vez del backend real de GitHub.

**Cómo guarda los cambios:** cada "Guardar" en el panel escribe el archivo
JSON correspondiente directo en `src/content/projects/`, igual que si lo
editaras a mano — **no crea un commit por sí solo**. Después de editar,
revisa el cambio como cualquier otro:

```bash
git status
git diff
git add icr-frontend-design1/src/content/projects/
git commit -m "Actualizar portafolio de proyectos"
git push
```

Este comportamiento se probó de punta a punta contra el servidor local:
listar fichas, crear una nueva y borrarla, confirmando que el archivo
aparece con el contenido correcto y que git lo ve como cambio sin confirmar
hasta que se le haga commit explícito.

## Producción (VPS)

`config.yml` ya declara el backend real:

```yaml
backend:
  name: github
  repo: AdrianAlessandroCalderonBegazo/ICR
  branch: main
```

Este backend todavía **no es utilizable tal cual** — el flujo OAuth de
GitHub exige un pequeño servidor intermediario que intercambie el código de
autorización por un token (no se puede hacer solo desde el navegador, por
seguridad: ese intercambio necesita el *client secret* de la app OAuth, que
nunca debe llegar al navegador). Dos caminos, según cuánta gente va a
editar contenido:

**Opción A — un solo editor con acceso SSH al VPS (más simple).**
Seguir usando el mismo mecanismo que en local: correr `decap-server` como
servicio en el VPS (por ejemplo con `pm2` o un `systemd` unit), escuchando
solo en `127.0.0.1`, y entrar al panel mediante un túnel SSH
(`ssh -L 8081:localhost:8081 usuario@vps`) o una VPN. Nunca se expone a
internet, no hace falta OAuth ni la app de GitHub. Es la opción con menos
piezas para mantener.

**Opción B — varias personas editando desde cualquier lugar.**
Requiere:
1. Crear una **OAuth App** en GitHub (Settings → Developer settings →
   OAuth Apps) apuntando al dominio del VPS — esto lo tiene que hacer quien
   administre esa cuenta de GitHub, no es algo que se pueda automatizar.
2. Desplegar un proxy OAuth en el VPS (por ejemplo
   [`decap-cms-github-oauth-provider`](https://github.com/vencax/netlify-cms-github-oauth-provider)
   u otro compatible) con el *client id* y *client secret* de esa app.
3. En `public/admin/config.yml`, agregar `base_url` apuntando a ese proxy.

Mientras no se complete ninguna de las dos, `/admin` en el dominio de
producción carga pero el login no responde — es esperable, no es un error
del código.

## Notas técnicas

- `local_backend: true` en `config.yml` solo se activa cuando el panel se
  abre desde `localhost`/`127.0.0.1`; en cualquier otro dominio Decap CMS
  usa el backend `github` declarado arriba. No hay que quitarlo ni
  condicionarlo por entorno.
- El script `npm run cms` fija `GIT_REPO_DIRECTORY` a la raíz real del
  repositorio (`..` desde `icr-frontend-design1/`), porque el repo tiene el
  sitio dentro de esa subcarpeta y `decap-server` por defecto asume que el
  repo empieza en el directorio desde el que se lo invoca.
- `media_folder`/`public_folder` en `config.yml` apuntan a
  `src/assets/images/uploads/` — ahí caen las imágenes que se suban desde
  el panel, si en el futuro se agrega un campo de imagen a alguna colección.
- `vite.config.js` tiene un middleware pequeño (`adminIndexFallback`) que
  hace que `/admin` y `/admin/` sirvan `public/admin/index.html` en
  `npm run dev`. Sin él, el servidor de desarrollo de Vite le gana la
  carrera a esa ruta con su propio fallback de SPA y termina mostrando la
  página 404 del sitio en vez del panel. Solo afecta al modo desarrollo: en
  el build de producción (`vite build` + servir `dist/`) `/admin/` ya
  funciona directo, sin este middleware, porque ahí no compite con ningún
  fallback de SPA.
