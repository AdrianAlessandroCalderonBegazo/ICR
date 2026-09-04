// Tests de integración contra una base Postgres real (no mocks): las
// restricciones de esquema (sector, forma de metricas) viven en parte en la
// base y en parte en el servicio, y eso es justamente lo que un mock no
// puede validar. Requiere Postgres accesible con las credenciales PG* de
// siempre; ver README para correrlos.
process.env.PGDATABASE = process.env.PGDATABASE || "icr_cms_test";

const { test, before } = require("node:test");
const assert = require("node:assert/strict");
const { resetTestDatabase } = require("./db-setup");

before(async () => {
  await resetTestDatabase();
});

const proyectos = require("../src/services/projectsService");

test("listPublic devuelve las 6 fichas migradas, todas publicadas", async () => {
  const items = await proyectos.listPublic();
  assert.equal(items.length, 6);
  assert.ok(items.every((p) => p.metricas.length >= 1));
});

test("listPublic respeta el orden definido (columna orden)", async () => {
  const items = await proyectos.listPublic();
  assert.equal(items[0].slug, "mineria-moquegua");
  assert.equal(items[1].slug, "industria-arequipa");
});

test("listAdmin incluye todo, incluso lo no publicado", async () => {
  await proyectos.create({
    slug: "test-oculto",
    sector: "hogar",
    lugar: "Prueba",
    titulo: "Ficha oculta de prueba",
    descripcion: "No debe aparecer en listPublic.",
    metricas: [{ value: "1 kWp", label: "Prueba" }],
    publicado: false,
  });
  const publicos = await proyectos.listPublic();
  const admin = await proyectos.listAdmin();
  assert.equal(publicos.some((p) => p.slug === "test-oculto"), false);
  assert.equal(admin.some((p) => p.slug === "test-oculto"), true);
  await proyectos.remove("test-oculto");
});

test("create rechaza un sector fuera de la lista válida", async () => {
  await assert.rejects(
    () => proyectos.create({
      slug: "test-sector-invalido",
      sector: "no-existe",
      lugar: "Prueba",
      titulo: "x",
      descripcion: "x",
      metricas: [{ value: "1", label: "x" }],
    }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});

test("create rechaza slug duplicado", async () => {
  await assert.rejects(
    () => proyectos.create({
      slug: "mineria-moquegua",
      sector: "mineria",
      lugar: "x",
      titulo: "x",
      descripcion: "x",
      metricas: [{ value: "1", label: "x" }],
    }),
    (err) => err.code === "PROJECT_SLUG_TAKEN"
  );
});

test("create rechaza metricas vacías o con más de 4 elementos", async () => {
  const base = { slug: "test-metricas", sector: "hogar", lugar: "x", titulo: "x", descripcion: "x" };
  await assert.rejects(() => proyectos.create({ ...base, metricas: [] }), (err) => err.code === "SCHEMA_INVALID");
  await assert.rejects(
    () => proyectos.create({ ...base, metricas: Array(5).fill({ value: "1", label: "x" }) }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});

test("update cambia solo los campos enviados y actualiza updated_at", async () => {
  const antes = await proyectos.findBySlug("retail-arequipa");
  await new Promise((r) => setTimeout(r, 10));
  const despues = await proyectos.update("retail-arequipa", { titulo: "Tienda con autoconsumo diurno (editado)" });
  assert.equal(despues.titulo, "Tienda con autoconsumo diurno (editado)");
  assert.equal(despues.lugar, "Arequipa");
  assert.ok(new Date(despues.updated_at) > new Date(antes.updated_at));
});

test("update contra un slug inexistente falla con PROJECT_NOT_FOUND", async () => {
  await assert.rejects(
    () => proyectos.update("no-existe-este-slug", { titulo: "x" }),
    (err) => err.code === "PROJECT_NOT_FOUND"
  );
});

test("remove borra la ficha; una segunda vez falla con PROJECT_NOT_FOUND", async () => {
  await proyectos.create({
    slug: "test-para-borrar",
    sector: "retail",
    lugar: "x",
    titulo: "x",
    descripcion: "x",
    metricas: [{ value: "1", label: "x" }],
  });
  await proyectos.remove("test-para-borrar");
  await assert.rejects(
    () => proyectos.remove("test-para-borrar"),
    (err) => err.code === "PROJECT_NOT_FOUND"
  );
});
