const express = require("express");
const path = require("path");

const app = express();
const publicDir = path.join(__dirname, "..", "public");

// Sirve el sitio como HTML/JS puro, sin build step: cada página es un
// archivo .html real en public/. `extensions: ["html"]` deja que las URLs
// limpias (/nosotros) resuelvan al archivo con extensión (nosotros.html)
// sin necesitar un router del lado del cliente.
app.use(express.static(publicDir, { extensions: ["html"] }));

// Cualquier ruta que no exista como archivo cae en la página 404 del sitio,
// con el layout completo (navbar, footer, widgets) en vez de un error plano.
app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, "404.html"));
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`Sitio de Inversiones ICR escuchando en puerto ${PORT}`);
});
