// URL del backend del panel de contenido (icr-cms-mvp). Configurable por
// variable de entorno de Vite para no hardcodear el dominio de producción
// en el código — ver icr-cms-mvp/README.md para el despliegue.
//
// El valor por defecto asume el backend corriendo en local con
// `npm run dev` dentro de icr-cms-mvp/backend (puerto 4100, ver PORT en
// icr-cms-mvp/backend/src/index.js).
export const CMS_API_URL = import.meta.env.VITE_CMS_API_URL || "http://localhost:4100/api";

// URL pública del panel de administración, para el aviso que se muestra en
// /proyectos mientras haya fichas de ejemplo.
export const CMS_ADMIN_URL = import.meta.env.VITE_CMS_ADMIN_URL || "http://localhost:4100/";
