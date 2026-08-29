import { useState } from "react";
import { Link } from "react-router-dom";

const PROPERTY_TYPES = ["Residencial", "Comercial", "Otro"];
const BILL_RANGES = [
  "Menos de S/ 100",
  "S/ 100 - S/ 300",
  "S/ 300 - S/ 600",
  "Más de S/ 600"
];

const STEPS = ["Tu propiedad", "Tus datos"];

export default function RequestQuote() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    propertyType: "",
    monthlyBill: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const step1Complete = form.propertyType && form.monthlyBill;
  const step2Complete = form.firstName && form.lastName && form.email && form.phone;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (step2Complete) setStep(3);
  };

  if (step === 3) {
    return (
      <section className="inner-page section-padding">
        <div className="container">
          <div className="quote-thanks">
            <div className="quote-thanks-icon"><i className="bi bi-check2"></i></div>
            <span className="eyebrow blue">SOLICITUD ENVIADA</span>
            <h1>¡Gracias, {form.firstName}!</h1>
            <p className="lead">
              Tu solicitud de cotización ya fue registrada. Nuestro equipo revisará
              tu información y en un plazo de <strong>1 a 2 días</strong> te
              contactaremos al {form.phone} o al correo {form.email} con más
              información sobre la solución energética ideal para ti.
            </p>
            <div className="quote-thanks-actions">
              <Link className="btn icr-btn-dark" to="/">
                Volver al inicio
              </Link>
              <Link className="btn icr-btn-primary" to="/soluciones">
                Seguir explorando nuestras soluciones <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="inner-page section-padding">
      <div className="container">
        <div className="quote-page">
          <span className="eyebrow blue">SOLICITAR ASESORÍA</span>
          <h1>Cotiza tu solución energética.</h1>
          <p className="lead">
            Cuéntanos un poco sobre tu propiedad y tus datos de contacto. Con esta
            información preparamos una recomendación y cotización a tu medida.
          </p>

          <div className="quote-steps">
            {STEPS.map((label, index) => {
              const num = index + 1;
              const status = num === step ? "active" : num < step ? "done" : "";
              return (
                <div className={`quote-step ${status}`} key={label}>
                  <span className="quote-step-num">
                    {num < step ? <i className="bi bi-check2"></i> : num}
                  </span>
                  {label}
                </div>
              );
            })}
          </div>

          {step === 1 && (
            <form
              className="contact-form"
              onSubmit={(event) => {
                event.preventDefault();
                if (step1Complete) setStep(2);
              }}
            >
              <label>Tipo de propiedad</label>
              <div className="choice-group">
                {PROPERTY_TYPES.map((type) => (
                  <button
                    type="button"
                    key={type}
                    className={`choice-chip ${form.propertyType === type ? "active" : ""}`}
                    onClick={() => updateField("propertyType", type)}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <label>¿Cuánto pagas mensualmente en luz aproximadamente?</label>
              <div className="choice-group">
                {BILL_RANGES.map((range) => (
                  <button
                    type="button"
                    key={range}
                    className={`choice-chip ${form.monthlyBill === range ? "active" : ""}`}
                    onClick={() => updateField("monthlyBill", range)}
                  >
                    {range}
                  </button>
                ))}
              </div>

              <div className="quote-actions">
                <span></span>
                <button className="btn icr-btn-primary" type="submit" disabled={!step1Complete}>
                  Siguiente <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label>Nombre</label>
                  <input
                    className="form-control"
                    placeholder="Tu nombre"
                    value={form.firstName}
                    onChange={(event) => updateField("firstName", event.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label>Apellido</label>
                  <input
                    className="form-control"
                    placeholder="Tu apellido"
                    value={form.lastName}
                    onChange={(event) => updateField("lastName", event.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="correo@ejemplo.com"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label>Número de teléfono</label>
                  <input
                    className="form-control"
                    placeholder="+51 ..."
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                  />
                </div>
              </div>

              <div className="quote-actions">
                <button className="btn icr-btn-outline" type="button" onClick={() => setStep(1)}>
                  <i className="bi bi-arrow-left"></i> Atrás
                </button>
                <button className="btn icr-btn-primary" type="submit" disabled={!step2Complete}>
                  Enviar cotización <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
