import { useEffect } from "react";

// Revela los elementos .reveal al entrar en el viewport, con un pequeño
// escalonado entre hermanos del mismo contenedor.
// Respeta prefers-reduced-motion: si está activo, muestra todo de inmediato.
export default function useReveal(deps = []) {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll(".reveal:not(.in-view)"));
    if (items.length === 0) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in-view"));
      return undefined;
    }

    const groups = new Map();
    items.forEach((el) => {
      const parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(el);
    });
    groups.forEach((list) => {
      list.forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
