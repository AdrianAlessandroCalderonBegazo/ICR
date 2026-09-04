import { useEffect, useState } from "react";
import { CMS_API_URL } from "../config/cms";

const DISMISS_KEY = "icr_banner_cerrado";

export default function useActiveBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${CMS_API_URL}/banners/activos`);
        const json = await res.json();
        if (cancelled || !res.ok || json.status !== "success" || json.data.length === 0) return;

        const primero = json.data[0];
        // Se recuerda por sesión de navegador, no para siempre: es una
        // promoción vigente, no un aviso que deba desaparecer permanentemente
        // la primera vez que alguien lo cierra.
        if (sessionStorage.getItem(DISMISS_KEY) === primero.banner_id) return;
        setBanner(primero);
      } catch {
        // Sin banner si el CMS no responde — no es contenido crítico del sitio.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const dismiss = () => {
    if (banner) sessionStorage.setItem(DISMISS_KEY, banner.banner_id);
    setBanner(null);
  };

  return { banner, dismiss };
}
