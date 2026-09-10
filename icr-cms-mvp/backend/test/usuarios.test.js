process.env.PGDATABASE = process.env.PGDATABASE || "icr_cms_test";

const { test, before } = require("node:test");
const assert = require("node:assert/strict");
const { resetTestDatabase } = require("./db-setup");

before(async () => {
  await resetTestDatabase();
});

const usuarios = require("../src/services/usuariosService");

test("create crea un usuario y nunca devuelve password_hash", async () => {
  const u = await usuarios.create({
    nombre_completo: "Admin de prueba",
    email: "admin@test.icr",
    password: "contraseña-larga",
    rol_codigo: "ADMIN",
  });
  assert.equal(u.email, "admin@test.icr");
  assert.equal(u.password_hash, undefined);
});

test("create rechaza un email duplicado", async () => {
  await assert.rejects(
    () => usuarios.create({
      nombre_completo: "Otro", email: "admin@test.icr", password: "contraseña-larga", rol_codigo: "EDITOR",
    }),
    (err) => err.code === "USER_EMAIL_TAKEN"
  );
});

test("create rechaza una contraseña corta", async () => {
  await assert.rejects(
    () => usuarios.create({
      nombre_completo: "x", email: "corta@test.icr", password: "123", rol_codigo: "EDITOR",
    }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});

test("create rechaza un rol inválido", async () => {
  await assert.rejects(
    () => usuarios.create({
      nombre_completo: "x", email: "rol@test.icr", password: "contraseña-larga", rol_codigo: "SUPERUSER",
    }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});

test("listAdmin lista usuarios sin password_hash", async () => {
  const lista = await usuarios.listAdmin();
  assert.ok(lista.length >= 1);
  assert.ok(lista.every((u) => u.password_hash === undefined));
});

test("setActivo no permite que un usuario se desactive a sí mismo", async () => {
  const u = await usuarios.create({
    nombre_completo: "Editor A", email: "editorA@test.icr", password: "contraseña-larga", rol_codigo: "EDITOR",
  });
  await assert.rejects(
    () => usuarios.setActivo(u.usuario_id, false, { actorId: u.usuario_id }),
    (err) => err.code === "USER_CANNOT_DEACTIVATE_SELF"
  );
});

test("setActivo no permite desactivar al único ADMIN activo", async () => {
  const admins = (await usuarios.listAdmin()).filter((u) => u.rol_codigo === "ADMIN");
  assert.equal(admins.length, 1);
  await assert.rejects(
    () => usuarios.setActivo(admins[0].usuario_id, false, { actorId: "otro-id" }),
    (err) => err.code === "USER_LAST_ADMIN"
  );
});

test("setActivo permite desactivar un EDITOR desde otra cuenta", async () => {
  const u = await usuarios.create({
    nombre_completo: "Editor B", email: "editorB@test.icr", password: "contraseña-larga", rol_codigo: "EDITOR",
  });
  const actualizado = await usuarios.setActivo(u.usuario_id, false, { actorId: "otro-id" });
  assert.equal(actualizado.activo, false);
});

test("setActivo permite desactivar un ADMIN si hay otro ADMIN activo", async () => {
  const admins = (await usuarios.listAdmin()).filter((u) => u.rol_codigo === "ADMIN");
  const segundoAdmin = await usuarios.create({
    nombre_completo: "Admin B", email: "adminB@test.icr", password: "contraseña-larga", rol_codigo: "ADMIN",
  });
  const actualizado = await usuarios.setActivo(admins[0].usuario_id, false, { actorId: segundoAdmin.usuario_id });
  assert.equal(actualizado.activo, false);
});

test("setPassword rechaza una contraseña corta", async () => {
  const u = await usuarios.create({
    nombre_completo: "x", email: "pwtest@test.icr", password: "contraseña-larga", rol_codigo: "EDITOR",
  });
  await assert.rejects(
    () => usuarios.setPassword(u.usuario_id, "corta"),
    (err) => err.code === "SCHEMA_INVALID"
  );
});

test("setPassword contra un id inexistente falla con USER_NOT_FOUND", async () => {
  await assert.rejects(
    () => usuarios.setPassword("00000000-0000-0000-0000-000000000000", "contraseña-larga"),
    (err) => err.code === "USER_NOT_FOUND"
  );
});
