const categories = [
  { title: "Energía Solar", icon: "bi-sun", text: "Sistemas y componentes para soluciones solares." },
  { title: "Respaldo Energético", icon: "bi-battery-charging", text: "Tecnologías orientadas a continuidad y respaldo." },
  { title: "Infraestructura Energética", icon: "bi-lightning-charge", text: "Componentes y soluciones para infraestructura energética." }
];

export default function Services() {
  return (
    <section className="inner-page section-padding">
      <div className="container">
        <span className="eyebrow blue">SOLUCIONES</span>
        <h1>Soluciones energéticas inteligentes.</h1>
        <p className="lead">
          Aquí presentaremos las categorías de solución y, posteriormente,
          los productos reales de ICR con fotografía y una descripción breve.
        </p>

        <div className="row g-4 mt-4">
          {categories.map((item) => (
            <div className="col-md-4" key={item.title}>
              <article className="simple-service-card">
                <i className={`bi ${item.icon}`}></i>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </article>
            </div>
          ))}
        </div>

        <div className="product-placeholder mt-5">
          <span className="eyebrow blue">CATÁLOGO DE PRODUCTOS</span>
          <h2>Productos de ICR</h2>
          <p>
            En esta sección colocaremos únicamente productos reales del catálogo,
            con imagen, nombre y una descripción corta.
          </p>
        </div>
      </div>
    </section>
  );
}
