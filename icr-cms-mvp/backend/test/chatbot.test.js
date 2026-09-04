process.env.PGDATABASE = process.env.PGDATABASE || "icr_cms_test";

const { test, before } = require("node:test");
const assert = require("node:assert/strict");
const { resetTestDatabase } = require("./db-setup");

before(async () => {
  await resetTestDatabase();
});

const chatbot = require("../src/services/chatbotService");

test("listPublic devuelve las 3 preguntas sembradas, activas", async () => {
  const items = await chatbot.listPublic();
  assert.equal(items.length, 3);
  assert.equal(items[0].pregunta, "¿Qué servicios ofrecen?");
});

test("listPublic no incluye items inactivos", async () => {
  const creado = await chatbot.create({ pregunta: "Oculta", respuesta_markdown: "x", activo: false });
  const publicos = await chatbot.listPublic();
  assert.equal(publicos.some((i) => i.item_id === creado.item_id), false);
  const admin = await chatbot.listAdmin();
  assert.equal(admin.some((i) => i.item_id === creado.item_id), true);
  await chatbot.remove(creado.item_id);
});

test("create rechaza pregunta o respuesta vacías", async () => {
  await assert.rejects(
    () => chatbot.create({ pregunta: "", respuesta_markdown: "x" }),
    (err) => err.code === "SCHEMA_INVALID"
  );
  await assert.rejects(
    () => chatbot.create({ pregunta: "x", respuesta_markdown: "" }),
    (err) => err.code === "SCHEMA_INVALID"
  );
});

test("update contra un id inexistente falla con CHATBOT_ITEM_NOT_FOUND", async () => {
  await assert.rejects(
    () => chatbot.update("00000000-0000-0000-0000-000000000000", { pregunta: "x" }),
    (err) => err.code === "CHATBOT_ITEM_NOT_FOUND"
  );
});

test("remove borra el item; una segunda vez falla con CHATBOT_ITEM_NOT_FOUND", async () => {
  const creado = await chatbot.create({ pregunta: "Para borrar", respuesta_markdown: "x" });
  await chatbot.remove(creado.item_id);
  await assert.rejects(
    () => chatbot.remove(creado.item_id),
    (err) => err.code === "CHATBOT_ITEM_NOT_FOUND"
  );
});
