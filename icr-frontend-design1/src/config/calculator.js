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

// Precio instalado por kWp, en soles. Baja con la escala del proyecto.
export const SEGMENTS = [
  { id: "hogar", label: "Hogar", pricePerKwp: 4200 },
  { id: "empresa", label: "Empresa / retail", pricePerKwp: 3600 },
  { id: "industria", label: "Industria", pricePerKwp: 3100 },
  { id: "mineria", label: "Minería / gran escala", pricePerKwp: 2800 }
];

// Factor de irradiancia relativo a Arequipa.
export const REGIONS = [
  { id: "arequipa", label: "Arequipa", factor: 1.0 },
  { id: "moquegua", label: "Moquegua", factor: 0.97 },
  { id: "tacna", label: "Tacna", factor: 0.95 },
  { id: "otra", label: "Otra región del sur", factor: 0.9 }
];

export const BILL_MIN = 80;
export const BILL_MAX = 5000;
export const BILL_STEP = 10;

/**
 * Dimensiona el sistema y estima ahorro a partir del recibo mensual.
 * @param {{bill:number, coverage:number, pricePerKwp:number, regionFactor:number}} input
 *   bill: recibo mensual en soles; coverage: fracción de 0 a 1.
 */
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
