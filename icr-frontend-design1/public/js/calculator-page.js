import {
  BILL_MAX,
  BILL_MIN,
  REGIONS,
  SEGMENTS,
  VIDA_UTIL_ANIOS,
  estimate,
  formatSoles
} from "./config.js";
import { initReveal } from "./reveal.js";

function initCalculatorPage() {
  const root = document.getElementById("calculator-page");
  if (!root) return;

  const billInput = root.querySelector("#bill");
  const billOut = root.querySelector("#bill-out");
  const coverageInput = root.querySelector("#coverage");
  const coverageOut = root.querySelector("#coverage-out");
  const segmentSelect = root.querySelector("#segment");
  const regionSelect = root.querySelector("#region");

  SEGMENTS.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.label;
    segmentSelect.appendChild(opt);
  });
  REGIONS.forEach((r) => {
    const opt = document.createElement("option");
    opt.value = r.id;
    opt.textContent = r.label;
    regionSelect.appendChild(opt);
  });

  root.querySelector("#vida-util").textContent = VIDA_UTIL_ANIOS;

  const trackStyle = (input, min, max) => {
    const value = Number(input.value);
    input.style.setProperty("--range-progress", `${((value - min) / (max - min)) * 100}%`);
  };

  function render() {
    const segment = SEGMENTS.find((s) => s.id === segmentSelect.value);
    const region = REGIONS.find((r) => r.id === regionSelect.value);
    const result = estimate({
      bill: Number(billInput.value),
      coverage: Number(coverageInput.value) / 100,
      pricePerKwp: segment.pricePerKwp,
      regionFactor: region.factor
    });

    billOut.textContent = formatSoles(Number(billInput.value));
    coverageOut.textContent = `${coverageInput.value}%`;
    trackStyle(billInput, BILL_MIN, BILL_MAX);
    trackStyle(coverageInput, 30, 100);

    root.querySelector("#out-kwp").textContent = `${result.kwp.toFixed(1)} kWp`;
    root.querySelector("#out-inversion").textContent = formatSoles(result.inversion);
    root.querySelector("#out-ahorro-mensual").textContent = formatSoles(result.ahorroMensual);
    root.querySelector("#out-payback").textContent = Number.isFinite(result.payback)
      ? `${result.payback.toFixed(1)} años`
      : "—";
    root.querySelector("#out-co2").textContent = `${result.co2Anual.toFixed(1)} t`;
    root.querySelector("#out-ahorro-vida-util").textContent = formatSoles(result.ahorroVidaUtil);
  }

  [billInput, coverageInput, segmentSelect, regionSelect].forEach((el) => {
    el.addEventListener("input", render);
  });

  render();
  initReveal();
}

initCalculatorPage();
