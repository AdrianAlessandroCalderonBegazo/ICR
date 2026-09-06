import { CMS_API_URL } from "./config.js";

const DISMISS_KEY = "icr_banner_cerrado";

// Promoción vigente por rango de fechas, mostrada como overlay. Se recuerda
// por sesión de navegador, no para siempre: es una promoción vigente, no un
// aviso que deba desaparecer permanentemente la primera vez que alguien lo
// cierra.
async function initBanner() {
  const root = document.getElementById("banner-overlay-root");
  if (!root) return;

  let banner;
  try {
    const res = await fetch(`${CMS_API_URL}/banners/activos`);
    const json = await res.json();
    if (!res.ok || json.status !== "success" || json.data.length === 0) return;
    banner = json.data[0];
  } catch {
    return; // sin banner si el CMS no responde — no es contenido crítico del sitio.
  }

  if (sessionStorage.getItem(DISMISS_KEY) === banner.banner_id) return;

  const esInterno = banner.enlace_url?.startsWith("/");

  root.innerHTML = `
    <div class="banner-overlay" role="dialog" aria-label="Promoción">
      <div class="banner-card">
        <button type="button" class="banner-close" aria-label="Cerrar aviso">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
        <span class="eyebrow blue">PROMOCIÓN</span>
        <h2></h2>
        <p></p>
      </div>
    </div>
  `;
  root.querySelector("h2").textContent = banner.titulo;
  root.querySelector("p").textContent = banner.mensaje;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, banner.banner_id);
    root.innerHTML = "";
  };

  if (banner.enlace_texto && banner.enlace_url) {
    const link = document.createElement("a");
    link.className = "btn icr-btn-primary";
    link.href = banner.enlace_url;
    if (!esInterno) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.addEventListener("click", dismiss);
    }
    link.textContent = `${banner.enlace_texto} `;
    const icon = document.createElement("i");
    icon.className = "bi bi-arrow-right";
    link.appendChild(icon);
    root.querySelector(".banner-card").appendChild(link);
  }

  root.querySelector(".banner-close").addEventListener("click", dismiss);
}

initBanner();
