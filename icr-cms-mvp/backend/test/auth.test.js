const { test } = require("node:test");
const assert = require("node:assert/strict");
const { can } = require("../src/auth");

test("ADMIN tiene acceso a cualquier acción (wildcard)", () => {
  assert.equal(can("ADMIN", "proyectos.delete"), true);
  assert.equal(can("ADMIN", "algo.que.no.existe"), true);
});

test("EDITOR puede gestionar proyectos", () => {
  assert.equal(can("EDITOR", "proyectos.list"), true);
  assert.equal(can("EDITOR", "proyectos.create"), true);
  assert.equal(can("EDITOR", "proyectos.update"), true);
  assert.equal(can("EDITOR", "proyectos.delete"), true);
});

test("un rol desconocido no tiene ningún permiso", () => {
  assert.equal(can("ROL_INVENTADO", "proyectos.list"), false);
});
