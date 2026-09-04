// Taxonomía de sectores del portafolio.
//
// Se mantiene en código porque es una lista corta y estable, a diferencia
// de las fichas de proyecto (src/content/projects/*.json), que sí cambian
// seguido y por eso viven en el CMS. Si el equipo de contenido necesita
// agregar un sector nuevo, todavía requiere un cambio de código aquí y en
// las opciones de "sector" de public/admin/config.yml.

export const SECTORS = [
  { id: "all", label: "Todos" },
  { id: "mineria", label: "Minería" },
  { id: "industria", label: "Industria" },
  { id: "hogar", label: "Hogares" },
  { id: "municipio", label: "Municipios" },
  { id: "agro", label: "Agroindustria" },
  { id: "retail", label: "Retail" }
];
