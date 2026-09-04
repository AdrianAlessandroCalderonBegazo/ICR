import { useEffect, useState } from "react";

const CONSENT_KEY = "icr_cookies_aceptadas";

// Aviso estático, no gestionado desde el CMS: es texto de cumplimiento legal
// que cambia poco, y tenerlo en código (con su propio historial en git) es
// preferible a que quede editable sin control de versiones.
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      // Si localStorage no está disponible, se muestra igual — mejor
      // mostrarlo de más que arriesgarse a nunca informar al visitante.
      setVisible(true);
    }
  }, []);

  const aceptar = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "1");
    } catch {
      // Sin localStorage no se puede recordar la elección; se cierra igual.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Aviso de cookies">
      <p>
        Usamos cookies propias y de terceros para mejorar tu experiencia y
        analizar el uso del sitio. Al continuar navegando, aceptas su uso.
      </p>
      <button type="button" className="btn icr-btn-primary" onClick={aceptar}>
        Aceptar
      </button>
    </div>
  );
}
