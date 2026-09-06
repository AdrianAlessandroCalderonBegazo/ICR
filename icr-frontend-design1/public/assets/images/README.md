# Imágenes del proyecto

Todas las imágenes propias de Inversiones ICR (logo, fondos, productos, equipo)
van aquí, dentro de `public/assets/images/`. El sitio es HTML/JS puro sin
bundler ni paso de build: los archivos se sirven tal cual, sin optimización,
conversión ni hash de caché automático — súbelos ya en el formato y peso
final que quieres que reciba el navegador.

## Estructura

```text
public/assets/images/
├── logo/          Logo oficial y variantes (isotipo, horizontal, monocromo)
├── backgrounds/   Fotos grandes de fondo (hero, secciones "market")
├── products/      Fotos de productos / soluciones (cards)
├── team/          Fotos de equipo / nosotros
└── icons/         Iconos propios que no vienen de bootstrap-icons
└── solutions/     Fotos usadas en las tarjetas de "Soluciones" de Inicio
```

## Cómo referenciarlas en el código (rutas)

Ruta absoluta directa, igual en HTML y en CSS — sin `import`, porque no hay
paso de build que resuelva módulos:

```html
<img src="/assets/images/logo/logoICR.png" alt="Inversiones ICR" class="brand-mark" />
```

Desde CSS (relativo al archivo `.css`, en este caso `public/assets/css/styles.css`):

```css
background: url("../images/backgrounds/hero.jpg") center/cover;
```

## Tamaños recomendados (para no tener que "arreglar" el tamaño en CSS)

| Uso                                | Formato          | Tamaño sugerido                  |
|-------------------------------------|------------------|-----------------------------------|
| Logo navbar/footer (`logo/`)        | SVG (ideal) o PNG con fondo transparente | si es PNG: 256×256 px |
| Favicon                             | PNG/ICO          | 512×512 px (se reduce automáticamente) |
| Fondo hero (`backgrounds/`)         | JPG/WebP         | 2200×1300 px aprox., calidad 80-85 |
| Fondo de panel (mercado industrial/residencial) | JPG/WebP | 1500×1000 px aprox. |
| Card de producto/solución (`products/`, `solutions/`) | JPG/WebP | 800×600 px (se muestra a 245px de alto vía `object-fit: cover`, no hace falta recortarla a mano) |
| Foto de equipo (`team/`)            | JPG/WebP         | 600×600 px |

Reglas generales:

- Usa **SVG** siempre que puedas para el logo e íconos: no pixela y pesa
  menos que un PNG.
- Para fotos, prefiere **WebP** o **JPG optimizado** — como no hay paso de
  build que las comprima, sube directamente el archivo ya optimizado (no el
  original "pesado" tal como sale de la cámara).
- **No es necesario recortar la imagen al tamaño exacto del contenedor**: el
  CSS ya usa `object-fit: cover` / `contain` en `.solution-card img` y
  `.brand-mark`, así que basta con subir una imagen con la proporción
  aproximada y dejar que el CSS la encuadre. Si el tamaño final se ve mal,
  ajusta `width` / `height` / `object-fit` en `styles.css`, no el archivo
  de imagen.
