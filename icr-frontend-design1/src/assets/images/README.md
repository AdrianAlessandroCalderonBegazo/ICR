# Imágenes del proyecto

Todas las imágenes propias de Inversiones ICR (logo, fondos, productos, equipo)
van aquí, dentro de `src/assets/images/`, para que Vite las procese, optimice
y les asigne un hash de caché al hacer build.

## Estructura

```text
src/assets/images/
├── logo/          Logo oficial y variantes (isotipo, horizontal, monocromo)
├── backgrounds/   Fotos grandes de fondo (hero, secciones "market")
├── products/      Fotos de productos / soluciones (cards)
├── team/          Fotos de equipo / nosotros
└── icons/         Iconos propios que no vienen de bootstrap-icons
```

## Cómo referenciarlas en el código (rutas)

Impórtalas como cualquier módulo de JS — Vite resuelve la ruta, la optimiza
y en producción le agrega un hash (`icr-logo.a1b2c3.svg`):

```jsx
import logo from "../assets/images/logo/icr-logo.svg";

<img src={logo} alt="Inversiones ICR" className="brand-mark" />
```

Ejemplo real ya aplicado en `src/components/Navbar.jsx` y `Footer.jsx`.

Desde CSS (relativo al archivo `.css` que lo usa, en este caso `src/styles.css`):

```css
background: url("./assets/images/backgrounds/hero.jpg") center/cover;
```

> Alternativa: si alguna imagen NO necesita optimización de Vite (por ejemplo
> un PDF descargable o un favicon), colócala en `public/` en la raíz del
> proyecto (`icr-frontend-design1/public/`) y referencíala con una ruta
> absoluta desde el root, p. ej. `/brochure.pdf`. Los archivos de `public/`
> se copian tal cual, sin procesar ni cachear con hash.

## Tamaños recomendados (para no tener que "arreglar" el tamaño en CSS)

| Uso                                | Formato          | Tamaño sugerido                  |
|-------------------------------------|------------------|-----------------------------------|
| Logo navbar/footer (`logo/`)        | SVG (ideal) o PNG con fondo transparente | si es PNG: 256×256 px |
| Favicon                             | PNG/ICO          | 512×512 px (se reduce automáticamente) |
| Fondo hero (`backgrounds/`)         | JPG/WebP         | 2200×1300 px aprox., calidad 80-85 |
| Fondo de panel (mercado industrial/residencial) | JPG/WebP | 1500×1000 px aprox. |
| Card de producto/solución (`products/`) | JPG/WebP     | 800×600 px (se muestra a 245px de alto vía `object-fit: cover`, no hace falta recortarla a mano) |
| Foto de equipo (`team/`)            | JPG/WebP         | 600×600 px |

Reglas generales:

- Usa **SVG** siempre que puedas para el logo e íconos: no pixela y pesa
  menos que un PNG.
- Para fotos, prefiere **WebP** o **JPG optimizado** (no subas el archivo
  "pesado" tal como sale de la cámara).
- **No es necesario recortar la imagen al tamaño exacto del contenedor**: el
  CSS ya usa `object-fit: cover` / `contain` en `.solution-card img` y
  `.brand-mark`, así que basta con subir una imagen con la proporción
  aproximada y dejar que el CSS la encuadre. Si el tamaño final se ve mal,
  ajusta `width` / `height` / `object-fit` en `src/styles.css`, no el
  archivo de imagen.

## Logo actual

`logo/icr-logo.svg` es un **placeholder** (isotipo genérico con los colores
de marca) para dejar el cableado funcionando de punta a punta. Reemplázalo
por el logo oficial real cuando lo tengan, manteniendo el mismo nombre de
archivo (o actualiza el `import` en `Navbar.jsx` / `Footer.jsx` si cambias
el nombre).
