import { CMS_API_URL } from "./config.js";

// Trae la portada (hero) editable desde el panel de administración del CMS
// y actualiza el DOM ya renderizado. Si el backend no responde, se deja el
// texto de respaldo que ya está escrito en index.html — la home nunca
// depende de que el CMS esté arriba.
async function loadPortada() {
  let data;
  try {
    const res = await fetch(`${CMS_API_URL}/portada`);
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
  const setLink = (id, href) => {
    const el = document.getElementById(id);
    if (el && href) el.setAttribute("href", href);
  };

  setText("portada-eyebrow", data.eyebrow);
  setText("portada-linea1", data.titulo_linea1);
  setText("portada-linea2", data.titulo_linea2);
  setText("portada-destacado", data.titulo_destacado);
  setText("portada-descripcion", data.descripcion);
  setText("cta-primario-texto", data.cta_primario_texto);
  setLink("cta-primario", data.cta_primario_link);
  setText("cta-secundario-texto", data.cta_secundario_texto);
  setLink("cta-secundario", data.cta_secundario_link);
}

loadPortada();
