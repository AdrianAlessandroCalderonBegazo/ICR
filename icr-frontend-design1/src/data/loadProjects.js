// Carga las fichas de portafolio desde src/content/projects/*.json en tiempo
// de build. Ese es el contenido que edita el CMS (public/admin) — cada
// archivo es una ficha; agregar o borrar uno agrega o quita una tarjeta sin
// tocar código.
const modules = import.meta.glob("../content/projects/*.json", { eager: true });

export const PROJECTS = Object.keys(modules)
  .sort()
  .map((path) => modules[path].default ?? modules[path]);
