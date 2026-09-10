import { CMS_API_URL } from "./config.js";
import { initReveal } from "./reveal.js";

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Trae historia/misión/visión/trayectoria editables desde el panel y
// actualiza el DOM ya renderizado. Si el backend no responde, se deja el
// contenido de respaldo que ya está escrito en nosotros.html — la página
// nunca depende de que el CMS esté arriba (mismo patrón que portada.js).
async function loadNosotros() {
  const row = document.getElementById("trayectoria-row");
  if (!row) return;

  let data;
  try {
    const res = await fetch(`${CMS_API_URL}/nosotros`);
    const json = await res.json();
    if (!res.ok || json.status !== "success") return;
    data = json.data;
  } catch {
    return;
  }

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && value != null) el.textContent = value;
  };
  setText("nosotros-historia-p1", data.historia_p1);
  setText("nosotros-historia-p2", data.historia_p2);
  setText("nosotros-historia-p3", data.historia_p3);
  setText("nosotros-mision", data.mision);
  setText("nosotros-vision", data.vision);

  if (Array.isArray(data.trayectoria) && data.trayectoria.length > 0) {
    row.innerHTML = data.trayectoria.map((hito) => `
      <div class="col-6 col-lg-3 timeline-col">
        <div class="stat-card timeline-item reveal">
          <span class="timeline-dot"></span>
          <strong>${escapeHtml(hito.anio)}</strong>
          <h3>${escapeHtml(hito.titulo)}</h3>
          <p>${escapeHtml(hito.descripcion)}</p>
        </div>
      </div>
    `).join("");
    initReveal();
  }
}

loadNosotros();
