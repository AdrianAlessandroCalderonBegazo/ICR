import { useEffect, useState } from "react";
import { CMS_API_URL } from "../config/cms";

// Trae el portafolio de proyectos desde el backend del CMS (icr-cms-mvp) en
// tiempo de ejecución, no en el build — así una edición en el panel de
// administración se refleja en el sitio sin necesidad de un nuevo deploy.
export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${CMS_API_URL}/proyectos`);
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || json.status !== "success") {
          throw new Error(json?.error?.message || "No se pudo cargar el portafolio");
        }
        setProjects(json.data);
        setStatus("ready");
      } catch (err) {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { projects, status };
}
