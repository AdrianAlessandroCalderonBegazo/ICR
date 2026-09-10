process.env.PGDATABASE = process.env.PGDATABASE || "icr_cms_test";

const { test, before } = require("node:test");
const assert = require("node:assert/strict");
const { resetTestDatabase } = require("./db-setup");

before(async () => {
  await resetTestDatabase();
});

const nosotros = require("../src/services/nosotrosService");

test("get devuelve la fila sembrada con la trayectoria migrada", async () => {
  const n = await nosotros.get();
  assert.equal(n.trayectoria.length, 4);
  assert.equal(n.trayectoria[0].anio, "2016");
});

test("update cambia solo los campos enviados", async () => {
  const antes = await nosotros.get();
  await new Promise((r) => setTimeout(r, 10));
  const despues = await nosotros.update({ mision: "Nueva misión de prueba." });
  assert.equal(despues.mision, "Nueva misión de prueba.");
  assert.equal(despues.vision, antes.vision);
  assert.ok(new Date(despues.updated_at) > new Date(antes.updated_at));
});

test("update sigue devolviendo la misma fila (no crea una segunda)", async () => {
  const antes = await nosotros.get();
  await nosotros.update({ vision: "Otra visión de prueba." });
  const despues = await nosotros.get();
  assert.equal(despues.nosotros_id, antes.nosotros_id);
});

test("update rechaza un campo de texto vacío", async () => {
  await assert.rejects(
    () => nosotros.update({ mision: "   " }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});

test("update rechaza trayectoria vacía", async () => {
  await assert.rejects(
    () => nosotros.update({ trayectoria: [] }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});

test("update rechaza un hito de trayectoria sin descripcion", async () => {
  await assert.rejects(
    () => nosotros.update({ trayectoria: [{ anio: "2030", titulo: "x", descripcion: "" }] }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});

test("update reemplaza la trayectoria completa cuando se envía", async () => {
  const nueva = [{ anio: "2030", titulo: "Futuro", descripcion: "Hito de prueba." }];
  const despues = await nosotros.update({ trayectoria: nueva });
  assert.equal(despues.trayectoria.length, 1);
  assert.equal(despues.trayectoria[0].titulo, "Futuro");
});
