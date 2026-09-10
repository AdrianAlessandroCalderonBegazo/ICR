import { CMS_API_URL } from "./config.js";
import { initReveal } from "./reveal.js";

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function productCard(p) {
  return `
    <div class="col-md-6">
      <article class="product-card reveal h-100">
        <h3>${escapeHtml(p.titulo)}</h3>
        <p>${escapeHtml(p.descripcion)}</p>
        <ul class="check-list">
          ${p.caracteristicas.map((c) => `<li><i class="bi bi-check2"></i>${escapeHtml(c)}</li>`).join("")}
        </ul>
        <a class="btn icr-btn-outline" href="/solicitar-asesoria">Solicitar cotización <i class="bi bi-arrow-right"></i></a>
      </article>
    </div>
  `;
}

async function initSolucionesPage() {
  const root = document.getElementById("soluciones-page");
  if (!root) return;

  const loadingEl = root.querySelector(".productos-loading");
  const errorEl = root.querySelector(".productos-error");
  const sections = root.querySelectorAll("[data-grupo-section]");

  try {
    const res = await fetch(`${CMS_API_URL}/productos`);
    const json = await res.json();
    if (!res.ok || json.status !== "success") {
      throw new Error(json?.error?.message || "No se pudo cargar el catálogo");
    }
    const productos = json.data;

    sections.forEach((section) => {
      const grupo = section.dataset.grupoSection;
      const enGrupo = productos.filter((p) => p.grupo === grupo);
      if (enGrupo.length === 0) return;
      section.querySelector("[data-grupo-list]").innerHTML = enGrupo.map(productCard).join("");
      section.hidden = false;
    });

    loadingEl.hidden = true;
    initReveal();
  } catch {
    loadingEl.hidden = true;
    errorEl.hidden = false;
  }
}

initSolucionesPage();
