1. Comprar/obtener la licencia web de Gotham (p. ej. en
   https://www.typography.com/fonts/gotham/overview o vía Adobe Fonts si
   la organización ya tiene una suscripción).
2. Exportar/descargar los archivos en formato **WOFF2** (y WOFF como
   respaldo) para los pesos que se usan en el sitio.
3. Colocarlos en esta carpeta (`src/assets/fonts/`) con exactamente estos
   nombres, que es lo que `styles.css` ya espera:

```text
src/assets/fonts/
├── Gotham-Book.woff2     (peso 400 - texto normal)
├── Gotham-Book.woff
├── Gotham-Medium.woff2   (peso 500)
├── Gotham-Medium.woff
├── Gotham-Bold.woff2     (peso 700 - títulos)
├── Gotham-Bold.woff
├── Gotham-Black.woff2    (peso 900 - hero / titulares grandes)
└── Gotham-Black.woff
```

Si usan otros nombres de archivo, solo hay que actualizar las rutas dentro
de los bloques `@font-face` al inicio de `src/styles.css`.

## Mientras no tengan la licencia

No hace falta hacer nada: si estos archivos no existen, el navegador
simplemente ignora el `@font-face` y usa el resto del stack
(`Inter, system-ui, ...`), así que el sitio no se rompe.