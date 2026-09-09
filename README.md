# ICR

Repositorio del sitio web y el panel de contenido de **Inversiones ICR**.

## Colores de marca

```text
Azul principal   #00004C
Turquesa         #00B7C2
Azul oscuro      #000073
Verde menta      #00FFC2
```

## Proyectos

* [`icr-frontend-design1/`](icr-frontend-design1/README.md) — el sitio
  público (HTML/JS puro, sin bundler, sin servidor propio).
* [`icr-cms-mvp/`](icr-cms-mvp/README.md) — el backend del panel de
  contenido (Node + Express + PostgreSQL); también sirve el sitio de
  `icr-frontend-design1` — un solo proceso para todo, no dos por separado.

Ver el README de cada proyecto para cómo correrlo en local y desplegarlo
(en la práctica, un único comando dentro de `icr-cms-mvp/backend`).
