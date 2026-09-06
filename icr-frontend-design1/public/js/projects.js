import { CMS_API_URL, CMS_ADMIN_URL, SECTORS } from "./config.js";
import { initReveal } from "./reveal.js";

const SECTOR_LABELS = Object.fromEntries(SECTORS.map((s) => [s.id, s.label]));

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function initProjectsPage() {
  const root = document.getElementById("projects-page");
  if (!root) return;

  const filtersEl = root.querySelector(".filters");
  const listEl = root.querySelector(".project-list");
  const loadingEl = root.querySelector(".projects-loading");
  const errorEl = root.querySelector(".projects-error");
  const noteEl = root.querySelector(".projects-editor-note");
  noteEl.querySelector("a").href = CMS_ADMIN_URL;

  SECTORS.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `filter-chip ${item.id === "all" ? "active" : ""}`;
    btn.setAttribute("aria-pressed", item.id === "all" ? "true" : "false");
    btn.textContent = item.label;
    btn.dataset.sector = item.id;
    btn.addEventListener("click", () => {
      filtersEl.querySelectorAll(".filter-chip").forEach((c) => {
        c.classList.toggle("active", c === btn);
        c.setAttribute("aria-pressed", c === btn ? "true" : "false");
      });
      render(btn.dataset.sector);
    });
    filtersEl.appendChild(btn);
  });

  let projects = [];

  function render(sector) {
    const visible = sector === "all" ? projects : projects.filter((p) => p.sector === sector);
    noteEl.hidden = !visible.some((p) => p.placeholder);

    listEl.innerHTML = visible.map((project) => `
      <div class="col-md-6 col-lg-4">
        <article class="project-card reveal h-100">
          <div class="project-cover">
            <span class="project-tag">${escapeHtml(SECTOR_LABELS[project.sector] ?? project.sector)} · ${escapeHtml(project.lugar)}</span>
          </div>
          <div class="project-body">
            <h3>${escapeHtml(project.titulo)}</h3>
            ${project.placeholder ? '<span class="project-placeholder">Ejemplo — reemplazar con proyecto real</span>' : ""}
            <p>${escapeHtml(project.descripcion)}</p>
            <div class="project-metrics">
              ${project.metricas.map(({ value, label }) => `
                <div>
                  <span class="v">${escapeHtml(value)}</span>
                  <span class="l">${escapeHtml(label)}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </article>
      </div>
    `).join("");

    initReveal();
  }

  try {
    const res = await fetch(`${CMS_API_URL}/proyectos`);
    const json = await res.json();
    if (!res.ok || json.status !== "success") {
      throw new Error(json?.error?.message || "No se pudo cargar el portafolio");
    }
    projects = json.data;
    loadingEl.hidden = true;
    render("all");
  } catch {
    loadingEl.hidden = true;
    errorEl.hidden = false;
  }
}

initProjectsPage();
