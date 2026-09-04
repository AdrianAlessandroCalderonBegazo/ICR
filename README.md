# ICR — Frontend Design 1

Prototipo frontend para la página web de **Inversiones ICR**.

## 🛠️ Tecnologías

* React
* Vite
* Bootstrap 5
* Bootstrap Icons
* CSS3
* JavaScript / JSX

## 🎨 Colores

```text
Azul principal   #00004C
Turquesa         #00B7C2
Azul oscuro      #000073
Verde menta      #00FFC2
```

## 📦 Dependencias

```bash
npm install
```

Principales dependencias:

```text
react
react-dom
react-router-dom
bootstrap
bootstrap-icons
vite
```

## 🚀 Ejecutar el proyecto

Clonar el repositorio:

```bash
git clone <https://github.com/AdrianAlessandroCalderonBegazo/ICR.git>
```

Entrar al proyecto:

```bash
cd icr-frontend-design1
```

Instalar dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

## 📁 Estructura

```text
src/
├── assets/
│   └── images/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── SectionTitle.jsx
│   └── ProductCard.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Services.jsx
│   └── Contact.jsx
├── App.jsx
├── main.jsx
└── styles.css
```

## 📌 Estado

**Frontend / Prototipo visual**

Actualmente se trabaja únicamente la interfaz y experiencia visual. La lógica, funcionalidades, backend e integración de datos serán implementados posteriormente.

## 📄 Páginas

| Ruta | Contenido |
|---|---|
| `/` | Inicio |
| `/nosotros` | Historia, misión, visión y trayectoria |
| `/soluciones` | Productos agrupados por desafío |
| `/proyectos` | Portafolio filtrable por sector |
| `/calculadora` | Simulador de ahorro solar |
| `/solicitar-asesoria` | Formulario de cotización en dos pasos |

## 🗂️ Panel de contenido (CMS)

El portafolio de `/proyectos`, la portada de la home, las preguntas del
chatbot y los banners de promoción no viven en el código del sitio: los
sirve `icr-cms-mvp/`, un backend propio (Node + Express + PostgreSQL) con
su propio panel de administración — ver
[`icr-cms-mvp/README.md`](icr-cms-mvp/README.md) para levantarlo en local
y para el detalle de cada colección. Sin ese backend corriendo, cada pieza
cae a su comportamiento por defecto ("no se pudo cargar el portafolio" en
`/proyectos`, textos de respaldo en la portada, chatbot y banner
simplemente ausentes); el resto del sitio sigue funcionando igual.

## ⚙️ Contenido pendiente de reemplazar

Antes de publicar, revisar:

* Las fichas del portafolio marcadas como ejemplo (`placeholder`) en el
  panel de `icr-cms-mvp` son plantillas por sector, no proyectos reales.
* `src/config/calculator.js` — tarifa, horas sol pico y precios por kWp son
  valores de referencia sin validar contra cifras comerciales de ICR.
* `src/config/contact.js` — confirmar teléfono, WhatsApp, dirección y RUC.
