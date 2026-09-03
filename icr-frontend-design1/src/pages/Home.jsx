import { Link } from "react-router-dom";
import solarImg from "../assets/images/solutions/energiasolar.jpg";
import respaldoImg from "../assets/images/solutions/respaldo.jpg";
import infraImg from "../assets/images/solutions/infraestructura.jpeg";

const solutions = [
  {
    icon: "bi-sun",
    title: "Energía Solar",
    text: "Sistemas solares fotovoltaicos diseñados para diferentes escalas y aplicaciones.",
    image: solarImg,
  },
  {
    icon: "bi-battery-charging",
    title: "Respaldo Energético",
    text: "Soluciones de respaldo y almacenamiento orientadas a garantizar continuidad.",
    image: respaldoImg,
  },
  {
    icon: "bi-lightning-charge",
    title: "Infraestructura Energética",
    text: "Ingeniería y ejecución de infraestructura eléctrica con tecnología confiable.",
    image: infraImg,
  }
];

const strengths = [
  ["01", "Ingeniería", "Diseño y análisis especializado para cada necesidad energética.", "bi-rulers"],
  ["02", "Tecnología", "Componentes y sistemas de alto desempeño.", "bi-cpu"],
  ["03", "Confiabilidad", "Soluciones diseñadas para reducir riesgos y garantizar continuidad.", "bi-shield-check"],
  ["04", "Respaldo", "Acompañamiento técnico antes, durante y después de cada proyecto.", "bi-headset"]
];

export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-grid"></div>
        <div className="container position-relative">
          <div className="row align-items-center min-vh-100 py-5">
            <div className="col-lg-6 hero-content">
              <span className="eyebrow">INVERSIONES ICR</span>
              <h1>
                Energía confiable.<br />
                Soluciones <span>inteligentes.</span>
              </h1>
              <div className="hero-line"></div>
              <p>
                Diseñamos e implementamos soluciones energéticas que combinan
                ingeniería, tecnología y equipos confiables para garantizar
                eficiencia y continuidad operativa.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link className="btn icr-btn-primary btn-lg" to="/soluciones">
                  Conoce nuestras soluciones <i className="bi bi-arrow-right"></i>
                </Link>
                <Link className="btn icr-btn-light btn-lg" to="/solicitar-asesoria">
                  Solicitar asesoría <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="section-heading text-center mx-auto">
            <span className="eyebrow blue">MÁS QUE ENERGÍA.</span>
            <h2>Ingeniería.</h2>
            <p>
              Analizamos, diseñamos e implementamos soluciones energéticas
              adaptadas a las necesidades reales de cada proyecto.
            </p>
          </div>

          <div className="row g-0 strengths-row mt-5">
            {strengths.map(([number, title, text, icon]) => (
              <div className="col-md-6 col-lg-3" key={title}>
                <article className="strength-card">
                  <i className={`bi ${icon}`}></i>
                  <span>{number}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="solutions-section section-padding">
        <div className="container">
          <div className="section-heading text-center mx-auto">
            <span className="eyebrow blue">SOLUCIONES ENERGÉTICAS</span>
            <h2>Para cada desafío.</h2>
            <p>
              La solución comienza entendiendo la necesidad. Los productos y
              componentes son parte de una solución diseñada para cada proyecto.
            </p>
          </div>

          <div className="row g-4 mt-4">
            {solutions.map((item) => (
              <div className="col-lg-4" key={item.title}>
                <article className="solution-card">
                  <img src={item.image} alt={item.title} />
                  <div className="solution-body">
                    <div className="solution-icon"><i className={`bi ${item.icon}`}></i></div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <Link to="/soluciones">Ver solución <i className="bi bi-arrow-right"></i></Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="market-section">
        <div className="market-panel industrial">
          <div className="market-content">
            <span className="eyebrow">PARA EMPRESAS E INSTITUCIONES</span>
            <h2>Energía para proyectos que no pueden detenerse.</h2>
            <p>
              Diseñamos soluciones que protegen la continuidad de sus operaciones
              y potencian su productividad.
            </p>
            <ul>
              <li>Continuidad operativa</li>
              <li>Reducción de costos</li>
              <li>Respaldo ante fallas</li>
              <li>Eficiencia energética</li>
              <li>Retorno de inversión</li>
            </ul>
            <Link className="btn icr-btn-primary" to="/solicitar-asesoria">
              Hablemos de tu proyecto <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>

        <div className="market-panel residential">
          <div className="market-content">
            <span className="eyebrow blue">PARA HOGARES Y NEGOCIOS</span>
            <h2>Tecnología energética para tu hogar.</h2>
            <p>
              Soluciones solares y energéticas diseñadas para mejorar tu eficiencia,
              reducir costos y darte mayor independencia energética.
            </p>
            <Link className="btn icr-btn-dark" to="/soluciones">
              Conoce nuestras soluciones <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-section section-padding">
        <div className="container">
          <div className="section-heading text-center mx-auto mb-5">
            <span className="eyebrow blue">¿POR QUÉ ELEGIR ICR?</span>
            <h2>Ingeniería + tecnología + experiencia.</h2>
          </div>

          <div className="row g-0 stats-row">
            {[
              ["01", "Ingeniería", "Experiencia técnica"],
              ["02", "Tecnología", "Componentes confiables"],
              ["03", "Experiencia", "Proyectos adaptados"],
              ["04", "Compromiso", "Calidad y respaldo"]
            ].map(([num, title, text]) => (
              <div className="col-6 col-lg-3" key={title}>
                <div className="stat-card">
                  <strong>{num}</strong>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <div>
              <span className="eyebrow">ENERGÍA CONFIABLE</span>
              <h2>¿Tu proyecto necesita energía confiable?</h2>
              <p>Conversemos sobre la solución energética que necesita tu empresa.</p>
            </div>
            <Link className="btn icr-btn-primary ms-lg-auto" to="/solicitar-asesoria">
              Solicitar asesoría <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
