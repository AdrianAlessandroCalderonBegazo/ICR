import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// /admin (SIN slash final) necesita redirigir de verdad a /admin/, no solo
// servir el mismo contenido ahí mismo. Si se sirve sin redirigir, el
// navegador se queda con "/admin" en la barra de direcciones, y toda
// petición relativa que haga el panel de contenido (como la de config.yml)
// se resuelve mal: el navegador trata "admin" como si fuera un archivo, no
// una carpeta, y la petición termina yendo a la raíz del sitio en vez de a
// /admin/config.yml. Ahí Decap CMS recibe el HTML de la app en lugar del
// YAML y falla con "config must have required property X" en todas las
// claves a la vez — así se manifestó este bug la primera vez.
//
// Pasa tanto en `npm run dev` como en `npm run preview` (build de
// producción): en dev, además, /admin/ (con slash) tampoco resuelve solo,
// porque el fallback de SPA de Vite le gana la carrera a la carpeta
// pública y muestra la página 404 del sitio en su lugar; en preview esa
// segunda parte ya funciona sola.
//
// Esto NO cubre el servidor real de producción en el VPS (nginx, Apache,
// Caddy...) — ver la sección "Producción" de CMS.md para la regla
// equivalente que hay que agregar ahí.
function adminIndexFallback() {
  return {
    name: 'admin-index-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/admin') {
          res.statusCode = 301;
          res.setHeader('Location', '/admin/');
          res.end();
          return;
        }
        if (req.url === '/admin/') {
          req.url = '/admin/index.html';
        }
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/admin') {
          res.statusCode = 301;
          res.setHeader('Location', '/admin/');
          res.end();
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), adminIndexFallback()],
});
