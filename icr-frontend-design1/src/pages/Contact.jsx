export default function Contact() {
  return (
    <section className="inner-page section-padding">
      <div className="container">
        <div className="row g-5 align-items-start">
          <div className="col-lg-5">
            <span className="eyebrow blue">CONTACTO</span>
            <h1>Hablemos de tu proyecto.</h1>
            <p className="lead">
              Cuéntanos qué necesidad energética tienes y evaluemos una solución
              adecuada para tu proyecto.
            </p>
          </div>
          <div className="col-lg-7">
            <form className="contact-form">
              <div className="row g-3">
                <div className="col-md-6">
                  <label>Nombre</label>
                  <input className="form-control" placeholder="Tu nombre" />
                </div>
                <div className="col-md-6">
                  <label>Empresa</label>
                  <input className="form-control" placeholder="Nombre de empresa" />
                </div>
                <div className="col-md-6">
                  <label>Correo</label>
                  <input type="email" className="form-control" placeholder="correo@empresa.com" />
                </div>
                <div className="col-md-6">
                  <label>Teléfono</label>
                  <input className="form-control" placeholder="+51 ..." />
                </div>
                <div className="col-12">
                  <label>Cuéntanos sobre tu proyecto</label>
                  <textarea className="form-control" rows="6" placeholder="Escribe aquí..."></textarea>
                </div>
                <div className="col-12">
                  <button className="btn icr-btn-primary" type="button">
                    Enviar solicitud <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
