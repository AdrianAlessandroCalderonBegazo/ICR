import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SECTORS } from "../data/projects";
import { PROJECTS } from "../data/loadProjects";
import useReveal from "../hooks/useReveal";

const SECTOR_LABELS = Object.fromEntries(SECTORS.map((s) => [s.id, s.label]));

export default function Projects() {
  const [sector, setSector] = useState("all");

  const visible = useMemo(
    () => (sector === "all" ? PROJECTS : PROJECTS.filter((p) => p.sector === sector)),
    [sector]
  );
  const hasPlaceholders = visible.some((p) => p.placeholder);

  useReveal([sector]);

  return (
    <section className="inner-page section-padding">
      <div className="container">
        <span className="eyebrow blue">PORTAFOLIO</span>
        <h1>Proyectos reales, medidos y auditados.</h1>
        <p className="lead">
          Desde plantas de varios megavatios hasta hogares que llevan su recibo
          de luz a cero. Cada instalación queda monitoreada desde nuestro centro
          de operaciones.
        </p>

        {hasPlaceholders && (
          <div className="editor-note" role="note">
            <strong>Nota para el equipo ICR:</strong> las fichas marcadas como
            ejemplo son plantillas por sector. Edítalas desde{" "}
            <a href="/admin/" target="_blank" rel="noopener noreferrer">
              /admin
            </a>{" "}
            (o en <code>src/content/projects/</code>) con cliente, ubicación y
            capacidad real, y quita el campo <code>placeholder</code> de cada
            ficha ya publicable.
          </div>
        )}

        <div className="filters" role="group" aria-label="Filtrar proyectos por sector">
          {SECTORS.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`filter-chip ${sector === item.id ? "active" : ""}`}
              aria-pressed={sector === item.id}
              onClick={() => setSector(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="row g-4 mt-2">
          {visible.map((project) => (
            <div className="col-md-6 col-lg-4" key={project.id}>
              <article className="project-card reveal h-100">
                <div className="project-cover">
                  <span className="project-tag">
                    {SECTOR_LABELS[project.sector] ?? project.sector} · {project.place}
                  </span>
                </div>
                <div className="project-body">
                  <h3>{project.title}</h3>
                  {project.placeholder && (
                    <span className="project-placeholder">
                      Ejemplo — reemplazar con proyecto real
                    </span>
                  )}
                  <p>{project.text}</p>
                  <div className="project-metrics">
                    {project.metrics.map(({ value, label }) => (
                      <div key={label}>
                        <span className="v">{value}</span>
                        <span className="l">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        <div className="cta-section mt-5 rounded-4 px-4 px-lg-5">
          <div className="cta-inner">
            <div className="cta-icon"><i className="bi bi-lightning-charge-fill"></i></div>
            <div>
              <span className="eyebrow">ENERGÍA CONFIABLE</span>
              <h2>¿Tu proyecto podría estar aquí?</h2>
              <p>Evaluamos tu consumo real y preparamos una propuesta técnica a tu medida.</p>
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
