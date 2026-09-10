// Comportamiento compartido de layout (navbar) y de entrada de contenido
// (.reveal), presente en todas las páginas. Sin bundler: módulo ES nativo
// cargado con <script type="module">.
import { initReveal } from "./reveal.js";

export function initNavbar() {
  const toggler = document.querySelector(".navbar-toggler");
  const collapse = document.getElementById("icrNav");
  if (!toggler || !collapse) return;

  toggler.addEventListener("click", () => {
    const isOpen = collapse.classList.toggle("show");
    toggler.setAttribute("aria-expanded", String(isOpen));
  });

  collapse.querySelectorAll(".nav-link, .btn").forEach((link) => {
    link.addEventListener("click", () => {
      collapse.classList.remove("show");
      toggler.setAttribute("aria-expanded", "false");
    });
  });
}

initNavbar();
initReveal();
