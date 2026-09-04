process.env.PGDATABASE = process.env.PGDATABASE || "icr_cms_test";

const { test, before } = require("node:test");
const assert = require("node:assert/strict");
const { resetTestDatabase } = require("./db-setup");

before(async () => {
  await resetTestDatabase();
});

const banners = require("../src/services/bannersService");

function hoyMasDias(dias) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

test("listActivos incluye el banner sembrado (vigente todo 2026)", async () => {
  const activos = await banners.listActivos();
  assert.equal(activos.some((b) => b.titulo === "Promoción de temporada"), true);
});

test("listActivos excluye un banner ya vencido", async () => {
  const vencido = await banners.create({
    titulo: "Vencido", mensaje: "x",
    fecha_inicio: hoyMasDias(-30), fecha_fin: hoyMasDias(-1),
  });
  const activos = await banners.listActivos();
  assert.equal(activos.some((b) => b.banner_id === vencido.banner_id), false);
});

test("listActivos excluye un banner que todavía no empieza", async () => {
  const futuro = await banners.create({
    titulo: "Futuro", mensaje: "x",
    fecha_inicio: hoyMasDias(10), fecha_fin: hoyMasDias(20),
  });
  const activos = await banners.listActivos();
  assert.equal(activos.some((b) => b.banner_id === futuro.banner_id), false);
});

test("listActivos excluye un banner vigente pero marcado inactivo", async () => {
  const inactivo = await banners.create({
    titulo: "Inactivo", mensaje: "x",
    fecha_inicio: hoyMasDias(-1), fecha_fin: hoyMasDias(1), activo: false,
  });
  const activos = await banners.listActivos();
  assert.equal(activos.some((b) => b.banner_id === inactivo.banner_id), false);
});

test("create rechaza fecha_fin anterior a fecha_inicio", async () => {
  await assert.rejects(
    () => banners.create({ titulo: "x", mensaje: "x", fecha_inicio: "2026-06-01", fecha_fin: "2026-05-01" }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});

test("create rechaza una fecha con formato inválido", async () => {
  await assert.rejects(
    () => banners.create({ titulo: "x", mensaje: "x", fecha_inicio: "01/06/2026", fecha_fin: "2026-06-30" }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});

test("update valida el nuevo rango de fechas contra el existente", async () => {
  const b = await banners.create({ titulo: "x", mensaje: "x", fecha_inicio: "2026-06-01", fecha_fin: "2026-06-30" });
  await assert.rejects(
    () => banners.update(b.banner_id, { fecha_fin: "2026-05-01" }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});

test("remove borra el banner; una segunda vez falla con BANNER_NOT_FOUND", async () => {
  const b = await banners.create({ titulo: "Para borrar", mensaje: "x", fecha_inicio: "2026-01-01", fecha_fin: "2026-01-02" });
  await banners.remove(b.banner_id);
  await assert.rejects(
    () => banners.remove(b.banner_id),
    (err) => err.code === "BANNER_NOT_FOUND"
  );
});
