const CONSENT_KEY = "icr_cookies_aceptadas";

// Aviso estático, no gestionado desde el CMS: es texto de cumplimiento legal
// que cambia poco, y tenerlo en código (con su propio historial en git) es
// preferible a que quede editable sin control de versiones.
function initCookieBanner() {
  const root = document.getElementById("cookie-banner-root");
  if (!root) return;

  let accepted = false;
  try {
    accepted = Boolean(localStorage.getItem(CONSENT_KEY));
  } catch {
    // Si localStorage no está disponible, se muestra igual — mejor
    // mostrarlo de más que arriesgarse a nunca informar al visitante.
  }
  if (accepted) return;

  root.innerHTML = `
    <div class="cookie-banner" role="dialog" aria-label="Aviso de cookies">
      <p>
        Usamos cookies propias y de terceros para mejorar tu experiencia y
        analizar el uso del sitio. Al continuar navegando, aceptas su uso.
      </p>
      <button type="button" class="btn icr-btn-primary">Aceptar</button>
    </div>
  `;

  root.querySelector("button").addEventListener("click", () => {
    try {
      localStorage.setItem(CONSENT_KEY, "1");
    } catch {
      // Sin localStorage no se puede recordar la elección; se cierra igual.
    }
    root.innerHTML = "";
  });
}

initCookieBanner();
