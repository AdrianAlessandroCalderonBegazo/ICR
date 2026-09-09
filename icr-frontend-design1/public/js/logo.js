import { CMS_API_URL } from "./config.js";

// El logo (navbar + footer) es editable desde el panel de administración
// (colección Portada). Si no se subió ninguno, o el CMS no responde, se
// deja el logo por defecto que ya está en cada .html — el sitio nunca
// depende de que el CMS esté arriba para mostrar su marca.
async function loadLogo() {
  try {
    const res = await fetch(`${CMS_API_URL}/portada`);
    const json = await res.json();
    if (!res.ok || json.status !== "success" || !json.data.logo_url) return;
    document.querySelectorAll(".brand-mark").forEach((img) => {
      img.src = json.data.logo_url;
    });
  } catch {
    // Se queda con el logo por defecto embebido en el HTML.
  }
}

loadLogo();
