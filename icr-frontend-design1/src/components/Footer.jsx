import { Link } from "react-router-dom";
import { WHATSAPP_URL } from "../config/contact";
import logo from "../assets/images/logo/logoICR.png";

export default function Footer() {
  return (
    <footer className="icr-footer">
      <div className="container py-5">
        <div className="row g-5">
          <div className="col-lg-4">
            <div className="icr-brand footer-brand mb-3">
              <img src={logo} alt="Inversiones ICR" className="brand-mark" />
            </div>
            <p className="footer-copy">
              Energía confiable, soluciones inteligentes.
            </p>
            <div className="socials">
              <a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
              <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
              <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h6>Soluciones</h6>
            <Link to="/soluciones">Energía Solar</Link>
            <Link to="/soluciones">Respaldo Energético</Link>
            <Link to="/soluciones">Infraestructura</Link>
            <Link to="/soluciones">Kits solares</Link>
          </div>

          <div className="col-6 col-lg-2">
            <h6>Empresa</h6>
            <Link to="/nosotros">Nosotros</Link>
            <Link to="/nosotros">Proyectos</Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Trabaja con nosotros</a>
          </div>

          <div className="col-lg-4">
            <h6>Contacto</h6>
            <p><i className="bi bi-telephone"></i> +51 999 123 456</p>
            <p><i className="bi bi-envelope"></i> contacto@inversionesicr.com</p>
            <p><i className="bi bi-geo-alt"></i> Arequipa, Perú</p>
            <a className="btn icr-btn-outline mt-2" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Contáctanos <i className="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>

        <hr />
        <div className="footer-bottom">
          <span>© 2026 Inversiones ICR. Todos los derechos reservados.</span>
          <span>Energía confiable, soluciones inteligentes.</span>
        </div>
      </div>
    </footer>
  );
}
