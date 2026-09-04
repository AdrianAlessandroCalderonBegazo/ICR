process.env.PGDATABASE = process.env.PGDATABASE || "icr_cms_test";

const { test, before } = require("node:test");
const assert = require("node:assert/strict");
const { resetTestDatabase } = require("./db-setup");

before(async () => {
  await resetTestDatabase();
});

const portada = require("../src/services/portadaService");

test("get devuelve la fila sembrada con los valores por defecto", async () => {
  const p = await portada.get();
  assert.equal(p.eyebrow, "INVERSIONES ICR");
  assert.equal(p.titulo_destacado, "inteligentes.");
});

test("update cambia solo los campos enviados", async () => {
  const antes = await portada.get();
  await new Promise((r) => setTimeout(r, 10));
  const despues = await portada.update({ eyebrow: "ICR ENERGÍA" });
  assert.equal(despues.eyebrow, "ICR ENERGÍA");
  assert.equal(despues.titulo_linea1, antes.titulo_linea1);
  assert.ok(new Date(despues.updated_at) > new Date(antes.updated_at));
});

test("update sigue devolviendo la misma fila (no crea una segunda portada)", async () => {
  const antes = await portada.get();
  await portada.update({ descripcion: "Otra descripción de prueba." });
  const despues = await portada.get();
  assert.equal(despues.portada_id, antes.portada_id);
});

test("update rechaza un campo vacío", async () => {
  await assert.rejects(
    () => portada.update({ eyebrow: "   " }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});
