// Comportamiento compartido de layout (navbar), presente en todas las
// páginas. Sin bundler: módulo ES nativo cargado con <script type="module">.
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
