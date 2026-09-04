const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const proyectos = require("./services/projectsService");
const portada = require("./services/portadaService");
const chatbot = require("./services/chatbotService");
const banners = require("./services/bannersService");
const { AppError } = require("./errors");
const { login, requireAuth, requirePermission } = require("./auth");

// Máximo 10 intentos de login por IP cada 15 minutos, para frenar fuerza bruta
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: "error", data: null, error: { code: "RATE_LIMITED", message: "Demasiados intentos de inicio de sesión. Intenta de nuevo en unos minutos." } },
});

// Envuelve cada handler para capturar errores AppError y devolver el envelope estándar de respuesta
function handle(fn) {
  return async (req, res) => {
    const requestId = req.body?.request_id || req.query?.request_id || null;
    try {
      const data = await fn(req);
      res.json({ request_id: requestId, status: "success", data, error: null });
    } catch (err) {
      if (err instanceof AppError) {
        res.status(err.status).json({
          request_id: requestId,
          status: "error",
          data: null,
          error: { code: err.code, message: err.message, details: err.details },
        });
      } else {
        console.error(err);
        res.status(500).json({
          request_id: requestId,
          status: "error",
          data: null,
          error: { code: "INTERNAL_ERROR", message: "Error interno del servidor" },
        });
      }
    }
  };
}

// -------- Autenticación --------

router.post(
  "/auth/login",
  loginLimiter,
  handle(async (req) => login(req.body?.email, req.body?.password))
);

router.get(
  "/auth/me",
  requireAuth,
  handle(async (req) => req.user)
);

// -------- Pública: consumida por el sitio web --------

router.get(
  "/proyectos",
  handle(async () => proyectos.listPublic())
);

router.get(
  "/portada",
  handle(async () => portada.get())
);

router.get(
  "/chatbot",
  handle(async () => chatbot.listPublic())
);

router.get(
  "/banners/activos",
  handle(async () => banners.listActivos())
);

// A partir de aquí, todo requiere sesión válida (Authorization: Bearer <token>)
router.use(requireAuth);

// -------- Panel de administración --------

router.get(
  "/admin/proyectos",
  requirePermission("proyectos.list"),
  handle(async () => proyectos.listAdmin())
);

router.post(
  "/admin/proyectos",
  requirePermission("proyectos.create"),
  handle(async (req) => proyectos.create(req.body))
);

router.put(
  "/admin/proyectos/:slug",
  requirePermission("proyectos.update"),
  handle(async (req) => proyectos.update(req.params.slug, req.body))
);

router.delete(
  "/admin/proyectos/:slug",
  requirePermission("proyectos.delete"),
  handle(async (req) => {
    await proyectos.remove(req.params.slug);
    return { deleted: true };
  })
);

router.put(
  "/admin/portada",
  requirePermission("portada.update"),
  handle(async (req) => portada.update(req.body))
);

router.get(
  "/admin/chatbot",
  requirePermission("chatbot.list"),
  handle(async () => chatbot.listAdmin())
);

router.post(
  "/admin/chatbot",
  requirePermission("chatbot.create"),
  handle(async (req) => chatbot.create(req.body))
);

router.put(
  "/admin/chatbot/:id",
  requirePermission("chatbot.update"),
  handle(async (req) => chatbot.update(req.params.id, req.body))
);

router.delete(
  "/admin/chatbot/:id",
  requirePermission("chatbot.delete"),
  handle(async (req) => {
    await chatbot.remove(req.params.id);
    return { deleted: true };
  })
);

router.get(
  "/admin/banners",
  requirePermission("banners.list"),
  handle(async () => banners.listAdmin())
);

router.post(
  "/admin/banners",
  requirePermission("banners.create"),
  handle(async (req) => banners.create(req.body))
);

router.put(
  "/admin/banners/:id",
  requirePermission("banners.update"),
  handle(async (req) => banners.update(req.params.id, req.body))
);

router.delete(
  "/admin/banners/:id",
  requirePermission("banners.delete"),
  handle(async (req) => {
    await banners.remove(req.params.id);
    return { deleted: true };
  })
);

module.exports = router;
