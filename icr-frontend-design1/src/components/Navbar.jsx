import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { WHATSAPP_URL } from "../config/contact";
import logo from "../assets/images/logo/logoICR.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  // Cerrar el menú móvil al cambiar de página.
  useEffect(() => setOpen(false), [pathname]);

  const close = () => setOpen(false);

  return (
    <nav className="navbar navbar-expand-lg icr-navbar fixed-top">
      <div className="container">
        <Link className="navbar-brand icr-brand" to="/" onClick={close}>
          <img src={logo} alt="Inversiones ICR" className="brand-mark" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-controls="icrNav"
          aria-expanded={open}
          aria-label="Abrir navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`} id="icrNav">
          <ul className="navbar-nav mx-auto gap-lg-4">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" onClick={close}>Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/nosotros" onClick={close}>Nosotros</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/soluciones" onClick={close}>Soluciones</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/proyectos" onClick={close}>Proyectos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/calculadora" onClick={close}>Calculadora</NavLink>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
              >
                Contacto
              </a>
            </li>
          </ul>
          <Link className="btn icr-btn-primary" to="/solicitar-asesoria" onClick={close}>
            Solicitar asesoría <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </nav>
  );
}
