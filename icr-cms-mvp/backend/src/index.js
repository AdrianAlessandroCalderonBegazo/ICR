require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");
const { uploadsDir } = require("./uploads");

const app = express();

// Sin ALLOWED_ORIGIN definido, refleja el origen del request. Con todo
// (sitio + CMS) en un solo proceso, esto ya casi nunca importa en
// desarrollo (mismo origen); queda por si algo externo consume la API.
const allowedOrigins = (process.env.ALLOWED_ORIGIN || "").split(",").map((o) => o.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
}));
app.use(express.json());

app.use("/api", routes);

// Fotos de proyectos e imagen de portada, subidas desde el panel.
app.use("/uploads", express.static(uploadsDir, { maxAge: "7d" }));

// Panel de administración del CMS, bajo /admin — HTML/JS puro, sin build step.
const adminDir = path.join(__dirname, "..", "..", "admin");
app.use("/admin", express.static(adminDir));

app.get("/health", (req, res) => res.json({ status: "ok" }));

// Sitio público (icr-frontend-design1/public), servido por el mismo proceso
// que el CMS — un solo servidor para todo, sin necesidad de correr ni
// desplegar el sitio y el panel por separado. `extensions: ["html"]` deja
// que las URLs limpias (/nosotros) resuelvan al archivo con extensión
// (nosotros.html) sin un router del lado del cliente.
const siteDir = path.join(__dirname, "..", "..", "..", "icr-frontend-design1", "public");
app.use(express.static(siteDir, { extensions: ["html"] }));

// Cualquier ruta que no exista como archivo cae en la página 404 del sitio,
// con su layout completo (navbar, footer, widgets) en vez de un error plano.
app.use((req, res) => {
  res.status(404).sendFile(path.join(siteDir, "404.html"));
});

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => {
  console.log(`Inversiones ICR (sitio + CMS) escuchando en puerto ${PORT}`);
});
