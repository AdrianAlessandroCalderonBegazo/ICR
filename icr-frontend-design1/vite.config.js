import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El servidor de dev de Vite sirve /admin/index.html correctamente por su
// nombre completo, pero para la URL sin archivo (/admin o /admin/) su propio
// fallback de SPA gana la carrera y devuelve el index.html de la app React
// en su lugar — ahí el router muestra la página 404. Este middleware, al
// registrarse directo en configureServer (no en una función devuelta), corre
// antes que el fallback interno de Vite y reescribe la URL primero. Solo
// afecta al dev server: en el build de producción /admin/ ya funciona bien
// porque ahí no hay SPA fallback de por medio, solo archivos estáticos.
function adminIndexFallback() {
  return {
    name: 'admin-index-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/admin' || req.url === '/admin/') {
          req.url = '/admin/index.html';
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), adminIndexFallback()],
});
