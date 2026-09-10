process.env.PGDATABASE = process.env.PGDATABASE || "icr_cms_test";

const { test, before } = require("node:test");
const assert = require("node:assert/strict");
const { resetTestDatabase } = require("./db-setup");

before(async () => {
  await resetTestDatabase();
});

const productos = require("../src/services/productosService");

test("listPublic devuelve las 6 fichas migradas, todas publicadas", async () => {
  const items = await productos.listPublic();
  assert.equal(items.length, 6);
  assert.ok(items.every((p) => p.caracteristicas.length >= 1));
});

test("listPublic respeta el orden por grupo y orden", async () => {
  const items = await productos.listPublic();
  const solar = items.filter((p) => p.grupo === "energia-solar");
  assert.equal(solar[0].titulo, "Kit Solar Residencial 3kW");
  assert.equal(solar[1].titulo, "Kit Solar Comercial 10kW");
});

test("listAdmin incluye todo, incluso lo no publicado", async () => {
  await productos.create({
    grupo: "infraestructura",
    titulo: "Test oculto",
    descripcion: "No debe aparecer en listPublic.",
    caracteristicas: ["Punto 1"],
    publicado: false,
  });
  const publicos = await productos.listPublic();
  const admin = await productos.listAdmin();
  assert.equal(publicos.some((p) => p.titulo === "Test oculto"), false);
  assert.equal(admin.some((p) => p.titulo === "Test oculto"), true);
});

test("create rechaza un grupo fuera de la lista válida", async () => {
  await assert.rejects(
    () => productos.create({
      grupo: "no-existe", titulo: "x", descripcion: "x", caracteristicas: ["x"],
    }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});

test("create rechaza caracteristicas vacías", async () => {
  await assert.rejects(
    () => productos.create({ grupo: "energia-solar", titulo: "x", descripcion: "x", caracteristicas: [] }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});

test("update cambia solo los campos enviados y actualiza updated_at", async () => {
  const creado = await productos.create({
    grupo: "energia-solar", titulo: "Original", descripcion: "x", caracteristicas: ["x"],
  });
  await new Promise((r) => setTimeout(r, 10));
  const actualizado = await productos.update(creado.producto_id, { titulo: "Editado" });
  assert.equal(actualizado.titulo, "Editado");
  assert.equal(actualizado.descripcion, "x");
  assert.ok(new Date(actualizado.updated_at) > new Date(creado.updated_at));
});

test("update contra un id inexistente falla con PRODUCT_NOT_FOUND", async () => {
  await assert.rejects(
    () => productos.update("00000000-0000-0000-0000-000000000000", { titulo: "x" }),
    (err) => err.code === "PRODUCT_NOT_FOUND"
  );
});

test("remove borra la ficha; una segunda vez falla con PRODUCT_NOT_FOUND", async () => {
  const creado = await productos.create({
    grupo: "respaldo-energetico", titulo: "Para borrar", descripcion: "x", caracteristicas: ["x"],
  });
  await productos.remove(creado.producto_id);
  await assert.rejects(
    () => productos.remove(creado.producto_id),
    (err) => err.code === "PRODUCT_NOT_FOUND"
  );
});
