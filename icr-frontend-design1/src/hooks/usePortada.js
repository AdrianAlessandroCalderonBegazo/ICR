import { useEffect, useState } from "react";
import { CMS_API_URL } from "../config/cms";

// Valores de respaldo: si el backend del CMS no responde, Inicio se sigue
// viendo bien en vez de romperse — son el mismo texto que tenía el hero
// antes de moverlo al panel de administración.
const FALLBACK = {
  eyebrow: "INVERSIONES ICR",
  titulo_linea1: "Energía confiable.",
  titulo_linea2: "Soluciones",
  titulo_destacado: "inteligentes.",
  descripcion:
    "Diseñamos e implementamos soluciones energéticas que combinan ingeniería, tecnología y equipos confiables para garantizar eficiencia y continuidad operativa.",
  cta_primario_texto: "Conoce nuestras soluciones",
  cta_primario_link: "/soluciones",
  cta_secundario_texto: "Solicitar asesoría",
  cta_secundario_link: "/solicitar-asesoria",
};

export default function usePortada() {
  const [portada, setPortada] = useState(FALLBACK);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${CMS_API_URL}/portada`);
        const json = await res.json();
        if (!cancelled && res.ok && json.status === "success") {
          setPortada(json.data);
        }
      } catch {
        // Se queda con FALLBACK — Inicio nunca depende de que el CMS esté arriba.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return portada;
}
