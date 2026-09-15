process.env.PGDATABASE = process.env.PGDATABASE || "icr_cms_test";

const { test, before } = require("node:test");
const assert = require("node:assert/strict");
const { resetTestDatabase } = require("./db-setup");

before(async () => {
  await resetTestDatabase();
});

const encabezados = require("../src/services/encabezadosService");

test("get devuelve la fila sembrada con los valores por defecto", async () => {
  const e = await encabezados.get();
  assert.equal(e.soluciones_eyebrow, "SOLUCIONES");
  assert.equal(e.nosotros_titulo, "Ingeniería, tecnología y experiencia.");
});

test("update cambia solo los campos enviados", async () => {
  const antes = await encabezados.get();
  await new Promise((r) => setTimeout(r, 10));
  const despues = await encabezados.update({ soluciones_titulo: "Título editado" });
  assert.equal(despues.soluciones_titulo, "Título editado");
  assert.equal(despues.nosotros_titulo, antes.nosotros_titulo);
  assert.ok(new Date(despues.updated_at) > new Date(antes.updated_at));
});

test("update sigue devolviendo la misma fila (no crea una segunda)", async () => {
  const antes = await encabezados.get();
  await encabezados.update({ proyectos_texto: "Otro texto de prueba." });
  const despues = await encabezados.get();
  assert.equal(despues.encabezado_id, antes.encabezado_id);
});

test("update rechaza un campo vacío", async () => {
  await assert.rejects(
    () => encabezados.update({ calculadora_eyebrow: "   " }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});
