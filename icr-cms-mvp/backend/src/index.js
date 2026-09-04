require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./routes");

const app = express();

// Sin ALLOWED_ORIGIN definido, refleja el origen del request (conveniente en
// desarrollo local, donde el sitio corre en otro puerto). En producción,
// define ALLOWED_ORIGIN con el dominio real del sitio (uno o varios,
// separados por coma) para restringir quién puede leer /api/proyectos.
const allowedOrigins = (process.env.ALLOWED_ORIGIN || "").split(",").map((o) => o.trim()).filter(Boolean);
app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
}));
app.use(express.json());

app.use("/api", routes);

// Sirve el panel de administración estático (admin/) para que el MVP
// funcione con un solo proceso, igual que icr-almacen-mvp.
app.use(express.static(path.join(__dirname, "..", "..", "admin")));

app.get("/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => {
  console.log(`ICR CMS backend escuchando en puerto ${PORT}`);
});
