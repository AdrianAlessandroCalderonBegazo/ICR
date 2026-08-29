import { Link } from "react-router-dom";

const values = [
  ["01", "Ingeniería primero", "Cada proyecto parte de un análisis técnico real, no de una plantilla genérica.", "bi-rulers"],
  ["02", "Transparencia", "Cotizaciones claras, sin letra pequeña ni sorpresas en la instalación.", "bi-eye"],
  ["03", "Respaldo real", "Acompañamos el proyecto antes, durante y después de la puesta en marcha.", "bi-shield-check"],
  ["04", "Mejora continua", "Actualizamos nuestros procesos y equipos con la tecnología más confiable del mercado.", "bi-graph-up-arrow"]
];

const milestones = [
  ["2016", "Fundación", "Inversiones ICR nace en Arequipa con un pequeño equipo de ingenieros eléctricos."],
  ["2019", "Primeros proyectos industriales", "Ampliamos de instalaciones residenciales a proyectos de mayor escala para empresas."],
  ["2022", "Expansión regional", "Llevamos nuestras soluciones de energía solar y respaldo energético a nuevas regiones del país."],
  ["2026", "Hoy", "Seguimos creciendo junto a familias, negocios e instituciones que confían en nosotros."]
];

export default function About() {
  return (
    <section className="inner-page section-padding">
      <div className="container">
        <span className="eyebrow blue">NOSOTROS</span>
        <h1>Ingeniería, tecnología y experiencia.</h1>
        <p className="lead">
          Inversiones ICR desarrolla soluciones energéticas eficientes y confiables
          para personas, empresas e instituciones.
        </p>

        <div className="row g-5 mt-2">
          <div className="col-lg-7">
            <h2>Nuestra historia</h2>
            <p>
              Inversiones ICR nació en Arequipa en 2016, impulsada por un grupo de
              ingenieros eléctricos que veía de cerca un mismo problema una y otra
              vez: familias y negocios pagando cada vez más por una energía cada vez
              menos confiable. Empezamos instalando sistemas solares pequeños para
              hogares y comercios locales, resolviendo cada proyecto con el mismo
              cuidado técnico, sin importar el tamaño.
            </p>
            <p>
              Con el tiempo, ese mismo enfoque nos permitió crecer hacia proyectos
              industriales y de infraestructura energética de mayor escala, siempre
              manteniendo la base que nos formó: entender primero la necesidad
              energética real del cliente, y recién después diseñar la solución
              técnica adecuada — nunca al revés.
            </p>
            <p>
              Hoy seguimos siendo una empresa de ingenieros: diseñamos, instalamos y
              respaldamos cada sistema que entregamos, combinando tecnología de alto
              desempeño con un servicio cercano y honesto.
            </p>
          </div>
          <div className="col-lg-5">
            <h2>Nuestra misión</h2>
            <p>
              Diseñar, implementar y respaldar soluciones energéticas utilizando
              tecnología de alta calidad y conocimiento técnico especializado.
            </p>
            <h2 className="mt-4">Nuestra visión</h2>
            <p>
              Convertirnos en una empresa referente a nivel nacional en soluciones
              energéticas inteligentes, reconocida por nuestra capacidad técnica,
              innovación y compromiso.
            </p>
          </div>
        </div>

        <div className="section-heading mt-5 pt-4">
          <span className="eyebrow blue">NUESTRAS BASES</span>
          <h2>Lo que no negociamos.</h2>
        </div>
        <div className="row g-0 strengths-row mt-4">
          {values.map(([number, title, text, icon]) => (
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

        <div className="section-heading mt-5 pt-4">
          <span className="eyebrow blue">NUESTRA TRAYECTORIA</span>
          <h2>Un crecimiento paso a paso.</h2>
        </div>
        <div className="row g-0 stats-row mt-4">
          {milestones.map(([year, title, text]) => (
            <div className="col-6 col-lg-3" key={year}>
              <div className="stat-card">
                <strong>{year}</strong>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="cta-section mt-5 rounded-4 px-4 px-lg-5">
          <div className="cta-inner">
            <div className="cta-icon"><i className="bi bi-lightning-charge-fill"></i></div>
            <div>
              <span className="eyebrow">ENERGÍA CONFIABLE</span>
              <h2>¿Quieres conocer nuestras soluciones?</h2>
              <p>Descubre qué podemos hacer por tu hogar, negocio o empresa.</p>
            </div>
            <Link className="btn icr-btn-primary ms-lg-auto" to="/soluciones">
              Ver soluciones <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
