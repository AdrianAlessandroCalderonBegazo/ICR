// No requiere Postgres: processAndSaveImage() es una función pura sobre el
// sistema de archivos (sharp + fs), sin tocar la base de datos.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { processAndSaveImage, uploadsDir } = require("../src/uploads");

test("processAndSaveImage guarda un archivo real bajo /uploads y devuelve su URL", async () => {
  const buffer = await sharp({
    create: { width: 20, height: 10, channels: 3, background: { r: 0, g: 100, b: 200 } },
  }).png().toBuffer();

  const url = await processAndSaveImage({ buffer, mimetype: "image/png" });

  assert.match(url, /^\/uploads\/[0-9a-f-]+\.png$/);
  const filePath = path.join(uploadsDir, path.basename(url));
  assert.ok(fs.existsSync(filePath), "el archivo debe existir en disco");
  fs.unlinkSync(filePath);
});

test("processAndSaveImage reescala una imagen más grande que el máximo permitido", async () => {
  const buffer = await sharp({
    create: { width: 3000, height: 1000, channels: 3, background: { r: 255, g: 0, b: 0 } },
  }).jpeg().toBuffer();

  const url = await processAndSaveImage({ buffer, mimetype: "image/jpeg" });
  const filePath = path.join(uploadsDir, path.basename(url));
  const metadata = await sharp(filePath).metadata();

  assert.ok(metadata.width <= 1600, `ancho ${metadata.width} debería quedar dentro de 1600px`);
  fs.unlinkSync(filePath);
});

test("processAndSaveImage rechaza un buffer corrupto con INVALID_FILE_TYPE", async () => {
  const buffer = Buffer.from("esto no es una imagen");
  await assert.rejects(
    () => processAndSaveImage({ buffer, mimetype: "image/png" }),
    (err) => err.code === "INVALID_FILE_TYPE"
  );
});
