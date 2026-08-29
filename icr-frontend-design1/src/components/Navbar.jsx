import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg icr-navbar fixed-top">
      <div className="container">
        <Link className="navbar-brand icr-brand" to="/">
          <span className="brand-mark"><i className="bi bi-lightning-charge-fill"></i></span>
          <span>
            <strong>ICR</strong>
            <small>INVERSIONES ICR</small>
          </span>
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
              <NavLink className="nav-link" to="/contacto">Contacto</NavLink>
            </li>
          </ul>
          <Link className="btn icr-btn-primary" to="/contacto">
            Solicitar asesoría <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </nav>
  );
}
