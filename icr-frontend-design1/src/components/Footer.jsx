import { Link } from "react-router-dom";
import logo from "../assets/images/logo/logoICR.png";
import {
  ADDRESS,
  EMAIL,
  PHONE,
  PHONE_TEL,
  RUC,
  SOCIALS,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
  COVERAGE
} from "../config/contact";

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
              <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <h6>Soluciones</h6>
            <Link to="/soluciones">Energía Solar</Link>
            <Link to="/soluciones">Respaldo Energético</Link>
            <Link to="/soluciones">Infraestructura</Link>
            <Link to="/calculadora">Calculadora de ahorro</Link>
          </div>

          <div className="col-6 col-lg-2">
            <h6>Empresa</h6>
            <Link to="/nosotros">Nosotros</Link>
            <Link to="/proyectos">Proyectos</Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Trabaja con nosotros</a>
          </div>

          <div className="col-lg-4">
            <h6>Contacto</h6>
            <p><i className="bi bi-telephone"></i> <a href={`tel:${PHONE_TEL}`}>{PHONE}</a></p>
            <p><i className="bi bi-whatsapp"></i> <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">{WHATSAPP_DISPLAY}</a></p>
            <p><i className="bi bi-envelope"></i> <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
            <p><i className="bi bi-geo-alt"></i> {ADDRESS}</p>
            <a className="btn icr-btn-outline mt-2" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Contáctanos <i className="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>

        <hr />
        <div className="footer-bottom">
          <span>© 2026 Inversiones ICR S.R.L. · RUC {RUC} · Todos los derechos reservados</span>
          <span>{COVERAGE}</span>
        </div>
      </div>
    </footer>
  );
}
