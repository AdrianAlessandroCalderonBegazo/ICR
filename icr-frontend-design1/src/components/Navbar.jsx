import { Link, NavLink } from "react-router-dom";
import logo from "../assets/images/logo/icr-logo.svg";
import { WHATSAPP_URL } from "../config/contact";
import logo from "../assets/images/logo/logoICR.png";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg icr-navbar fixed-top">
      <div className="container">
        <Link className="navbar-brand icr-brand" to="/">
          <img src={logo} alt="Inversiones ICR" className="brand-mark" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#icrNav"
          aria-controls="icrNav"
          aria-expanded="false"
          aria-label="Abrir navegación"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="icrNav">
          <ul className="navbar-nav mx-auto gap-lg-4">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/nosotros">Nosotros</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/soluciones">Soluciones</NavLink>
            </li>
            <li className="nav-item">
              <a className="nav-link" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                Contacto
              </a>
            </li>
          </ul>
          <Link className="btn icr-btn-primary" to="/solicitar-asesoria">
            Solicitar asesoría <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </nav>
  );
}
