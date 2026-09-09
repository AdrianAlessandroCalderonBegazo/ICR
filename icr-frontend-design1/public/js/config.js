// Configuración compartida del sitio. Módulo ES nativo — sin bundler: el
// navegador lo carga tal cual con <script type="module">.

// El sitio y el panel de contenido (icr-cms-mvp) los sirve un mismo proceso
// Express en un solo puerto — no hay dos servidores ni dos orígenes que
// coordinar, así que estas son rutas relativas al propio sitio.
export const CMS_API_URL = "/api";
export const CMS_ADMIN_URL = "/admin/";

// Mismo origen que el sitio: las imágenes subidas desde el panel
// (proyectos.imagen_url, portada.imagen_url) ya llegan como rutas
// relativas ("/uploads/xyz.jpg") que resuelven solas, sin prefijo.
export const CMS_ORIGIN = "";

// Datos de contacto de Inversiones ICR S.R.L.
// Tomados del demo de vista previa — confirmar con el equipo antes de publicar.
export const RUC = "20605309489";
export const ADDRESS = "Calle Pizarro 325 C, Arequipa";
export const EMAIL = "contacto@inversionesicr.com";
export const PHONE = "982 745 584";
export const PHONE_TEL = "982745584";
export const WHATSAPP_URL = "https://wa.me/51983840236?text=Hola%20Inversiones%20ICR%2C%20quisiera%20m%C3%A1s%20informaci%C3%B3n.";
export const WHATSAPP_DISPLAY = "983 840 236";
export const COVERAGE = "Arequipa · Moquegua · Tacna · Sur del Perú";

// Supuestos del simulador de ahorro solar.
//
// IMPORTANTE: son valores de referencia heredados del demo, NO están validados
// con datos comerciales de ICR. El payback que producen es optimista para el
// mercado peruano; el equipo técnico debe ajustar TARIFA, HSP y los precios por
// kWp con cifras reales antes de publicar el simulador.
export const TARIFA = 0.72;        // S/ por kWh — tarifa referencial sur del Perú
export const HSP = 5.8;            // horas sol pico promedio
export const DIAS_MES = 30;
export const KG_CO2_KWH = 0.45;    // factor de emisión referencial de la red peruana
export const VIDA_UTIL_ANIOS = 20;

export const SEGMENTS = [
  { id: "hogar", label: "Hogar", pricePerKwp: 4200 },
  { id: "empresa", label: "Empresa / retail", pricePerKwp: 3600 },
  { id: "industria", label: "Industria", pricePerKwp: 3100 },
  { id: "mineria", label: "Minería / gran escala", pricePerKwp: 2800 }
];

export const REGIONS = [
  { id: "arequipa", label: "Arequipa", factor: 1.0 },
  { id: "moquegua", label: "Moquegua", factor: 0.97 },
  { id: "tacna", label: "Tacna", factor: 0.95 },
  { id: "otra", label: "Otra región del sur", factor: 0.9 }
];

export const BILL_MIN = 80;
export const BILL_MAX = 5000;
export const BILL_STEP = 10;

export function estimate({ bill, coverage, pricePerKwp, regionFactor }) {
  const consumoKwhMes = bill / TARIFA;
  const cubiertoKwhMes = consumoKwhMes * coverage;
  const kwp = cubiertoKwhMes / (HSP * DIAS_MES * regionFactor);

  const inversion = kwp * pricePerKwp;
  const ahorroMensual = cubiertoKwhMes * TARIFA;
  const ahorroAnual = ahorroMensual * 12;
  const payback = ahorroAnual > 0 ? inversion / ahorroAnual : Infinity;
  const co2Anual = (cubiertoKwhMes * 12 * KG_CO2_KWH) / 1000;

  return {
    kwp,
    inversion,
    ahorroMensual,
    payback,
    co2Anual,
    ahorroVidaUtil: ahorroAnual * VIDA_UTIL_ANIOS
  };
}

export function formatSoles(n) {
  if (!Number.isFinite(n)) return "—";
  return "S/ " + Math.round(n).toLocaleString("es-PE");
}

// Taxonomía de sectores del portafolio.
//
// Se mantiene en código porque es una lista corta y estable, a diferencia
// de las fichas de proyecto, que sí cambian seguido y por eso viven en el CMS.
export const SECTORS = [
  { id: "all", label: "Todos" },
  { id: "mineria", label: "Minería" },
  { id: "industria", label: "Industria" },
  { id: "hogar", label: "Hogares" },
  { id: "municipio", label: "Municipios" },
  { id: "agro", label: "Agroindustria" },
  { id: "retail", label: "Retail" }
];
