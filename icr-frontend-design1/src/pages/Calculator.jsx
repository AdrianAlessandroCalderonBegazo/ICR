import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BILL_MAX,
  BILL_MIN,
  BILL_STEP,
  REGIONS,
  SEGMENTS,
  VIDA_UTIL_ANIOS,
  estimate,
  formatSoles
} from "../config/calculator";
import useReveal from "../hooks/useReveal";

export default function Calculator() {
  const [bill, setBill] = useState(350);
  const [coverage, setCoverage] = useState(90);
  const [segmentId, setSegmentId] = useState(SEGMENTS[0].id);
  const [regionId, setRegionId] = useState(REGIONS[0].id);

  const result = useMemo(() => {
    const segment = SEGMENTS.find((s) => s.id === segmentId);
    const region = REGIONS.find((r) => r.id === regionId);
    return estimate({
      bill,
      coverage: coverage / 100,
      pricePerKwp: segment.pricePerKwp,
      regionFactor: region.factor
    });
  }, [bill, coverage, segmentId, regionId]);

  useReveal();

  // Pinta la parte recorrida del slider sin depender de estilos por navegador.
  const trackStyle = (value, min, max) => ({
    "--range-progress": `${((value - min) / (max - min)) * 100}%`
  });

  return (
    <section className="inner-page section-padding">
      <div className="container">
        <span className="eyebrow blue">SIMULADOR</span>
        <h1>Calcula tu ahorro solar en segundos.</h1>
        <p className="lead">
          Ajusta tu recibo de luz y la cobertura que buscas. Es una estimación
          referencial — la propuesta técnica y comercial real la prepara un
          ingeniero tras evaluar tu consumo.
        </p>

        <div className="calc-grid mt-5">
          <div className="calc-panel">
            <h2>Tu consumo</h2>

            <div className="calc-field">
              <label htmlFor="bill">
                Recibo mensual de luz <span className="out">{formatSoles(bill)}</span>
              </label>
              <input
                type="range"
                id="bill"
                min={BILL_MIN}
                max={BILL_MAX}
                step={BILL_STEP}
                value={bill}
                style={trackStyle(bill, BILL_MIN, BILL_MAX)}
                onChange={(event) => setBill(Number(event.target.value))}
              />
            </div>

            <div className="calc-field">
              <label htmlFor="coverage">
                Cobertura que buscas <span className="out">{coverage}%</span>
              </label>
              <input
                type="range"
                id="coverage"
                min={30}
                max={100}
                step={5}
                value={coverage}
                style={trackStyle(coverage, 30, 100)}
                onChange={(event) => setCoverage(Number(event.target.value))}
              />
            </div>

            <div className="calc-field">
              <label htmlFor="segment">Tipo de instalación</label>
              <select
                id="segment"
                className="form-select"
                value={segmentId}
                onChange={(event) => setSegmentId(event.target.value)}
              >
                {SEGMENTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="calc-field">
              <label htmlFor="region">Región</label>
              <select
                id="region"
                className="form-select"
                value={regionId}
                onChange={(event) => setRegionId(event.target.value)}
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="calc-result">
            <h2>Tu estimado</h2>
            <div className="calc-cards" aria-live="polite">
              <div className="calc-card reveal">
                <span className="v">{result.kwp.toFixed(1)} kWp</span>
                <span className="l">Tamaño del sistema</span>
              </div>
              <div className="calc-card reveal">
                <span className="v">{formatSoles(result.inversion)}</span>
                <span className="l">Inversión estimada</span>
              </div>
              <div className="calc-card reveal">
                <span className="v">{formatSoles(result.ahorroMensual)}</span>
                <span className="l">Ahorro mensual estimado</span>
              </div>
              <div className="calc-card reveal">
                <span className="v">
                  {Number.isFinite(result.payback) ? `${result.payback.toFixed(1)} años` : "—"}
                </span>
                <span className="l">Retorno de inversión</span>
              </div>
              <div className="calc-card reveal">
                <span className="v">{result.co2Anual.toFixed(1)} t</span>
                <span className="l">CO₂ evitado / año</span>
              </div>
              <div className="calc-card reveal">
                <span className="v">{formatSoles(result.ahorroVidaUtil)}</span>
                <span className="l">Ahorro en {VIDA_UTIL_ANIOS} años</span>
              </div>
            </div>

            <p className="calc-note">
              Estimación basada en irradiancia promedio del sur del Perú y una
              tarifa eléctrica referencial. No incluye impuestos ni costos de
              conexión. Tu propuesta final puede variar según tu ubicación exacta
              y el consumo real medido.
            </p>

            <Link className="btn icr-btn-primary w-100 justify-content-center" to="/solicitar-asesoria">
              Quiero mi propuesta real <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
