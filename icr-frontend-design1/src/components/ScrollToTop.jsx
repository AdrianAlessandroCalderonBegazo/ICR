import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Al navegar entre páginas el router conserva la posición del scroll:
// esto devuelve la vista al inicio en cada cambio de ruta.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
