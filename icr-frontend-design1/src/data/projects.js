// Fichas de portafolio por sector.
//
// Son PLANTILLAS de ejemplo heredadas del demo: la estructura (sector,
// capacidad, métrica de ahorro, año) está lista, pero el nombre del cliente,
// la ubicación y las cifras deben reemplazarse con proyectos reales antes de
// publicar. Mientras `placeholder` sea true, la ficha se marca como ejemplo.

export const SECTORS = [
  { id: "all", label: "Todos" },
  { id: "mineria", label: "Minería" },
  { id: "industria", label: "Industria" },
  { id: "hogar", label: "Hogares" },
  { id: "municipio", label: "Municipios" },
  { id: "agro", label: "Agroindustria" },
  { id: "retail", label: "Retail" }
];

export const PROJECTS = [
  {
    id: "mineria-moquegua",
    sector: "mineria",
    sectorLabel: "Minería",
    place: "Moquegua",
    title: "Planta fotovoltaica para operación minera",
    text: "Sistema de gran escala para reducir el consumo de diésel en generación de respaldo, con monitoreo remoto integrado a la operación 24/7.",
    metrics: [["2.4 MW", "Capacidad"], ["−38%", "Diésel"], ["2024", "Año"]],
    placeholder: true
  },
  {
    id: "industria-arequipa",
    sector: "industria",
    sectorLabel: "Industria",
    place: "Arequipa",
    title: "Planta industrial con techo solar",
    text: "Autoconsumo diurno para línea de producción, con retorno de inversión proyectado en menos de 5 años.",
    metrics: [["480 kWp", "Capacidad"], ["4.6 años", "Payback"], ["2023", "Año"]],
    placeholder: true
  },
  {
    id: "hogar-arequipa",
    sector: "hogar",
    sectorLabel: "Hogar",
    place: "Arequipa",
    title: "Vivienda con recibo de luz a cero",
    text: "Sistema residencial dimensionado a partir del consumo real de 12 meses de recibos.",
    metrics: [["6.2 kWp", "Capacidad"], ["100%", "Cobertura"], ["2025", "Año"]],
    placeholder: true
  },
  {
    id: "municipio-moquegua",
    sector: "municipio",
    sectorLabel: "Municipio",
    place: "Moquegua",
    title: "Alumbrado público con respaldo solar",
    text: "Reducción del gasto municipal en energía y cámaras IP integradas al mismo dashboard de monitoreo.",
    metrics: [["310 kWp", "Capacidad"], ["−45%", "Gasto eléctrico"], ["2024", "Año"]],
    placeholder: true
  },
  {
    id: "agro-tacna",
    sector: "agro",
    sectorLabel: "Agroindustria",
    place: "Tacna",
    title: "Bombeo y riego con energía solar",
    text: "Sistema para bombeo de agua de riego, reduciendo la dependencia de generadores diésel en campo.",
    metrics: [["150 kWp", "Capacidad"], ["−60%", "Diésel"], ["2023", "Año"]],
    placeholder: true
  },
  {
    id: "retail-arequipa",
    sector: "retail",
    sectorLabel: "Retail",
    place: "Arequipa",
    title: "Tienda con autoconsumo diurno",
    text: "Cobertura del pico de consumo en horario comercial, con cámaras IP integradas al mismo panel de control.",
    metrics: [["85 kWp", "Capacidad"], ["3.9 años", "Payback"], ["2025", "Año"]],
    placeholder: true
  }
];
