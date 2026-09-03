# Panel de contenido (CMS)

El sitio incluye un panel de edición en **`/admin`** para que alguien del
equipo pueda actualizar el portafolio de proyectos sin tocar código ni pedir
un deploy a un desarrollador. Usa [Decap CMS](https://decapcms.org/) (antes
"Netlify CMS"): un editor que corre en el navegador y guarda los cambios
como commits directos a este repositorio — no hay base de datos ni backend
propio que mantener.

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

## Configuración inicial (una sola vez, la hace quien administre el hosting)

Esto **no puedo hacerlo yo**: requiere iniciar sesión en la cuenta de
Netlify y GitHub del equipo, algo que solo puede hacer una persona con
acceso a esas cuentas.

1. **Desplegar el sitio en [Netlify](https://netlify.com)** conectado a
   este repositorio de GitHub (build command `npm run build`, publish
   directory `icr-frontend-design1/dist`, ya que el proyecto vive en esa
   subcarpeta). Es gratis para un sitio de este tamaño.
2. En el panel del sitio en Netlify: **Site configuration → Identity →
   Enable Identity**.
3. Dentro de Identity, en **Registration**, elegir *Invite only* (para que
   no cualquiera pueda crearse una cuenta de edición).
4. En **Identity → Services → Git Gateway**, hacer clic en *Enable Git
   Gateway*. Esto es lo que le da permiso al panel para escribir en el
   repositorio sin que cada editor necesite su propia cuenta de GitHub ni
   un token personal.
5. En **Identity → Invite users**, invitar al correo de cada persona que va
   a editar contenido. Le llega un correo con un enlace que abre un diálogo
   para crear su contraseña.
6. Entrar a `https://<tu-sitio>.netlify.app/admin/`, iniciar sesión, y ya
   se puede crear, editar y borrar fichas de proyecto desde el navegador.

Cada guardado en el panel crea un commit en la rama `main` y dispara un
build nuevo en Netlify — el sitio público se actualiza solo, en 1-2 minutos.

## Notas técnicas

- `media_folder`/`public_folder` en `config.yml` apuntan a
  `src/assets/images/uploads/` — ahí caen las imágenes que se suban desde
  el panel, si en el futuro se agrega un campo de imagen a alguna colección.
- El script de Netlify Identity está en dos lugares: `index.html` (captura
  el enlace de invitación/recuperación de contraseña, que redirige a la raíz
  del sitio) y `public/admin/index.html` (la lógica del propio panel). Si se
  cambia de proveedor de hosting, ambos hay que revisarlos.
- Mientras no se complete la configuración de Netlify, `/admin` carga pero
  el login no funciona — es esperable, no es un error del código.
