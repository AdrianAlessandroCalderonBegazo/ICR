import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="inner-page section-padding">
      <div className="container">
        <span className="eyebrow blue">ERROR 404</span>
        <h1>No encontramos esta página.</h1>
        <p className="lead">
          La página que buscas no existe o fue movida. Puedes volver al inicio o
          revisar nuestras soluciones energéticas.
        </p>
        <div className="d-flex flex-wrap gap-3 mt-4">
          <Link className="btn icr-btn-dark" to="/">
            Volver al inicio
          </Link>
          <Link className="btn icr-btn-primary" to="/soluciones">
            Ver soluciones <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
