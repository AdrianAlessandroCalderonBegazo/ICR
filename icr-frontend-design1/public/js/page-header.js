import { CMS_API_URL } from "./config.js";

// Trae el eyebrow/título/texto del encabezado de la página actual (Soluciones,
// Nosotros, Proyectos o Calculadora) desde el panel y actualiza el DOM ya
// renderizado. Si el backend no responde, se deja el texto de respaldo que
// ya está escrito en el HTML — la página nunca depende de que el CMS esté
// arriba (mismo patrón que portada.js/logo.js).
async function loadPageHeader() {
  const section = document.querySelector(".page-header[data-page]");
  if (!section) return;
  const page = section.dataset.page;

  let data;
  try {
    const res = await fetch(`${CMS_API_URL}/encabezados`);
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
  setText("page-header-eyebrow", data[`${page}_eyebrow`]);
  setText("page-header-titulo", data[`${page}_titulo`]);
  setText("page-header-texto", data[`${page}_texto`]);
}

loadPageHeader();
