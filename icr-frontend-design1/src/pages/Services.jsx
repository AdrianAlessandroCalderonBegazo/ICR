import { Link } from "react-router-dom";

const challenges = [
  {
    key: "solar",
    icon: "bi-sun",
    title: "Energía Solar",
    challenge: "Facturas de luz cada vez más altas y dependencia total de la red eléctrica.",
    products: [
      {
        name: "Kit Solar Residencial 3kW",
        text: "Pensado para hogares con consumo mensual moderado que buscan reducir su recibo de luz.",
        specs: [
          "Paneles monocristalinos de alta eficiencia",
          "Inversor con monitoreo remoto vía app",
          "Instalación y garantía incluida (10 años)"
        ]
      },
      {
        name: "Kit Solar Comercial 10kW",
        text: "Diseñado para negocios y locales comerciales con mayor consumo energético.",
        specs: [
          "Escalable según la demanda del negocio",
          "Retorno de inversión estimado en 3 a 5 años",
          "Mantenimiento preventivo incluido"
        ]
      }
    ]
  },
  {
    key: "respaldo",
    icon: "bi-battery-charging",
    title: "Respaldo Energético",
    challenge: "Cortes de luz que detienen operaciones, dañan equipos o generan pérdidas.",
    products: [
      {
        name: "Sistema de Baterías de Respaldo",
        text: "Entrega continuidad automática ante cortes de luz, sin interrupciones perceptibles.",
        specs: [
          "Activación automática en milisegundos",
          "Compatible con sistemas solares existentes",
          "Autonomía configurable según tu carga"
        ]
      },
      {
        name: "Grupo Electrógeno Industrial",
        text: "Respaldo robusto para instalaciones críticas que no pueden detenerse.",
        specs: [
          "Arranque automático ante corte de red",
          "Funciona con diésel o gas",
          "Panel de transferencia automática (ATS)"
        ]
      }
    ]
  },
  {
    key: "infraestructura",
    icon: "bi-lightning-charge",
    title: "Infraestructura Energética",
    challenge: "Instalaciones eléctricas antiguas, inseguras o que no soportan el crecimiento del proyecto.",
    products: [
      {
        name: "Diseño e Instalación de Subestaciones",
        text: "Infraestructura eléctrica a medida para proyectos industriales y comerciales.",
        specs: [
          "Ingeniería certificada de principio a fin",
          "Cumplimiento de la normativa eléctrica vigente",
          "Supervisión técnica durante toda la obra"
        ]
      },
      {
        name: "Modernización de Tableros Eléctricos",
        text: "Actualiza instalaciones antiguas a estándares de seguridad y eficiencia actuales.",
        specs: [
          "Diagnóstico eléctrico previo incluido",
          "Reducción de riesgos eléctricos",
          "Mejora en la eficiencia energética"
        ]
      }
    ]
  }
];

export default function Services() {
  return (
    <section className="inner-page section-padding">
      <div className="container">
        <span className="eyebrow blue">SOLUCIONES</span>
        <h1>Soluciones energéticas para cada desafío.</h1>
        <p className="lead">
          Cada producto responde a un problema concreto: facturas de luz altas,
          cortes que detienen tu operación o infraestructura eléctrica que ya no
          da abasto. Elige el desafío que más se parece al tuyo.
        </p>

        {challenges.map((group) => (
          <div className="challenge-group mt-5 pt-4" key={group.key}>
            <div className="section-heading">
              <span className="eyebrow blue">
                <i className={`bi ${group.icon} me-2`}></i>DESAFÍO
              </span>
              <h2>{group.title}</h2>
              <p>{group.challenge}</p>
            </div>

            <div className="row g-4 mt-2">
              {group.products.map((product) => (
                <div className="col-md-6" key={product.name}>
                  <article className="product-card h-100">
                    <h3>{product.name}</h3>
                    <p>{product.text}</p>
                    <ul className="check-list">
                      {product.specs.map((spec) => (
                        <li key={spec}>
                          <i className="bi bi-check2"></i>
                          {spec}
                        </li>
                      ))}
                    </ul>
                    <Link className="btn icr-btn-outline" to="/solicitar-asesoria">
                      Solicitar cotización <i className="bi bi-arrow-right"></i>
                    </Link>
                  </article>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="cta-section mt-5 rounded-4 px-4 px-lg-5">
          <div className="cta-inner">
            <div className="cta-icon"><i className="bi bi-lightning-charge-fill"></i></div>
            <div>
              <span className="eyebrow">ENERGÍA CONFIABLE</span>
              <h2>¿No sabes cuál solución necesitas?</h2>
              <p>Cuéntanos tu caso y te ayudamos a encontrar la mejor opción.</p>
            </div>
            <Link className="btn icr-btn-primary ms-lg-auto" to="/solicitar-asesoria">
              Solicitar asesoría <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
