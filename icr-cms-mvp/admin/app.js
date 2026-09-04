const API = "/api";

// -------- Sesión --------
function getToken() { return localStorage.getItem("icr_cms_token"); }
function getUser() { try { return JSON.parse(localStorage.getItem("icr_cms_user")); } catch { return null; } }
function setSession(token, user) {
  localStorage.setItem("icr_cms_token", token);
  localStorage.setItem("icr_cms_user", JSON.stringify(user));
}
function clearSession() {
  localStorage.removeItem("icr_cms_token");
  localStorage.removeItem("icr_cms_user");
}

function showApp() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-shell").classList.remove("hidden");
  const user = getUser();
  document.getElementById("session-user").textContent = user ? `${user.nombre_completo} (${user.rol_codigo})` : "";
}
function showLogin() {
  document.getElementById("app-shell").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
}

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    ...options,
  });
  if (res.status === 401) {
    clearSession();
    showLogin();
    throw new Error("Sesión expirada");
  }
  return res.json();
}

// -------- Toasts --------
function toast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add("toast-out");
    setTimeout(() => el.remove(), 200);
  }, 3500);
}

// -------- Login --------
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const errEl = document.getElementById("login-error");
  const submitBtn = e.target.querySelector("button[type=submit]");
  errEl.classList.add("hidden");
  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: f.get("email"), password: f.get("password") }),
    });
    const json = await res.json();
    if (json.status !== "success") {
      errEl.textContent = json.error?.message || "No se pudo iniciar sesión";
      errEl.classList.remove("hidden");
      return;
    }
    setSession(json.data.token, json.data.user);
    showApp();
    await loadProjects();
  } catch (err) {
    errEl.textContent = "No se pudo conectar con el servidor";
    errEl.classList.remove("hidden");
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  clearSession();
  showLogin();
});

// -------- Tabla de proyectos --------
const SECTOR_LABELS = {
  mineria: "Minería", industria: "Industria", hogar: "Hogares",
  municipio: "Municipios", agro: "Agroindustria", retail: "Retail",
};

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function projectRow(p) {
  const estadoBadges = [
    p.publicado
      ? '<span class="badge badge-ok">Publicado</span>'
      : '<span class="badge badge-muted">Oculto</span>',
    p.placeholder ? '<span class="badge badge-warn">Ejemplo</span>' : "",
  ].join(" ");
  return `<tr data-slug="${escapeHtml(p.slug)}">
    <td class="px-4 py-3 text-slate-400">${p.orden}</td>
    <td class="px-4 py-3 font-semibold text-navy-950">${escapeHtml(p.titulo)}</td>
    <td class="px-4 py-3">${SECTOR_LABELS[p.sector] || p.sector}</td>
    <td class="px-4 py-3">${escapeHtml(p.lugar)}</td>
    <td class="px-4 py-3">${estadoBadges}</td>
    <td class="px-4 py-3 text-right whitespace-nowrap">
      <button class="btn-icon edit-btn" title="Editar" type="button">✎</button>
      <button class="btn-icon danger delete-btn" title="Borrar" type="button">🗑</button>
    </td>
  </tr>`;
}

let projectsCache = [];

async function loadProjects() {
  const json = await api("/admin/proyectos");
  if (json.status !== "success") {
    toast(json.error?.message || "No se pudieron cargar los proyectos", "error");
    return;
  }
  projectsCache = json.data;
  const tbody = document.getElementById("projects-tbody");
  tbody.innerHTML = projectsCache.length
    ? projectsCache.map(projectRow).join("")
    : `<tr><td colspan="6" class="px-4 py-8 text-center text-slate-400 italic">Sin proyectos todavía.</td></tr>`;

  tbody.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const slug = e.target.closest("tr").dataset.slug;
      openModal(projectsCache.find((p) => p.slug === slug));
    });
  });
  tbody.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const slug = e.target.closest("tr").dataset.slug;
      deleteProject(slug);
    });
  });
}

async function deleteProject(slug) {
  const project = projectsCache.find((p) => p.slug === slug);
  if (!confirm(`¿Borrar "${project?.titulo || slug}"? Esta acción no se puede deshacer.`)) return;
  const json = await api(`/admin/proyectos/${encodeURIComponent(slug)}`, { method: "DELETE" });
  if (json.status !== "success") {
    toast(json.error?.message || "No se pudo borrar", "error");
    return;
  }
  toast("Proyecto borrado");
  await loadProjects();
}

// -------- Modal: crear/editar --------
let editingSlug = null;

function metricRow(value = "", label = "") {
  const row = document.createElement("div");
  row.className = "flex gap-2 items-center";
  row.innerHTML = `
    <input class="field metric-value" placeholder="Valor (ej: 2.4 MW)" value="${escapeHtml(value)}" required />
    <input class="field metric-label" placeholder="Etiqueta (ej: Capacidad)" value="${escapeHtml(label)}" required />
    <button type="button" class="btn-icon danger remove-metric-btn" title="Quitar">✕</button>
  `;
  row.querySelector(".remove-metric-btn").addEventListener("click", () => {
    if (document.querySelectorAll("#metrics-rows > div").length > 1) row.remove();
  });
  return row;
}

document.getElementById("add-metric-btn").addEventListener("click", () => {
  const rows = document.getElementById("metrics-rows");
  if (rows.children.length >= 4) return;
  rows.appendChild(metricRow());
});

function openModal(project = null) {
  editingSlug = project ? project.slug : null;
  const form = document.getElementById("project-form");
  form.reset();
  document.getElementById("form-error").classList.add("hidden");
  document.getElementById("modal-title").textContent = project ? "Editar proyecto" : "Nuevo proyecto";

  const slugInput = form.querySelector("[name=slug]");
  slugInput.disabled = Boolean(project);
  slugInput.value = project?.slug || "";
  form.querySelector("[name=sector]").value = project?.sector || "mineria";
  form.querySelector("[name=lugar]").value = project?.lugar || "";
  form.querySelector("[name=titulo]").value = project?.titulo || "";
  form.querySelector("[name=descripcion]").value = project?.descripcion || "";
  form.querySelector("[name=placeholder]").checked = project ? project.placeholder : true;
  form.querySelector("[name=publicado]").checked = project ? project.publicado : true;

  const rows = document.getElementById("metrics-rows");
  rows.innerHTML = "";
  const metrics = project?.metricas?.length ? project.metricas : [{ value: "", label: "" }];
  metrics.forEach((m) => rows.appendChild(metricRow(m.value, m.label)));

  document.getElementById("project-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("project-modal").classList.add("hidden");
  editingSlug = null;
}

document.getElementById("new-project-btn").addEventListener("click", () => openModal());
document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-cancel").addEventListener("click", closeModal);

document.getElementById("project-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const errEl = document.getElementById("form-error");
  const submitBtn = form.querySelector("button[type=submit]");
  errEl.classList.add("hidden");

  const metricas = Array.from(document.querySelectorAll("#metrics-rows > div")).map((row) => ({
    value: row.querySelector(".metric-value").value.trim(),
    label: row.querySelector(".metric-label").value.trim(),
  }));

  const body = {
    sector: form.querySelector("[name=sector]").value,
    lugar: form.querySelector("[name=lugar]").value.trim(),
    titulo: form.querySelector("[name=titulo]").value.trim(),
    descripcion: form.querySelector("[name=descripcion]").value.trim(),
    metricas,
    placeholder: form.querySelector("[name=placeholder]").checked,
    publicado: form.querySelector("[name=publicado]").checked,
  };
  if (!editingSlug) body.slug = form.querySelector("[name=slug]").value.trim();

  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  try {
    const json = editingSlug
      ? await api(`/admin/proyectos/${encodeURIComponent(editingSlug)}`, { method: "PUT", body: JSON.stringify(body) })
      : await api("/admin/proyectos", { method: "POST", body: JSON.stringify(body) });

    if (json.status !== "success") {
      errEl.textContent = json.error?.message || "No se pudo guardar";
      errEl.classList.remove("hidden");
      return;
    }
    toast(editingSlug ? "Proyecto actualizado" : "Proyecto creado");
    closeModal();
    await loadProjects();
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
  }
});

// -------- Arranque --------
(async function init() {
  if (getToken()) {
    showApp();
    try {
      await loadProjects();
    } catch {
      // api() ya maneja el 401 mostrando el login; cualquier otro error queda silencioso al arrancar.
    }
  } else {
    showLogin();
  }
})();

// -------- Navegación por pestañas --------
function showView(name) {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
  document.getElementById(`view-${name}`).classList.add("active");
  document.querySelectorAll(".nav-tab").forEach((t) => t.classList.toggle("active", t.dataset.view === name));

  if (name === "proyectos") loadProjects();
  if (name === "portada") loadPortada();
  if (name === "chatbot") loadChatbotItems();
  if (name === "banners") loadBanners();
}

document.querySelectorAll(".nav-tab").forEach((tab) => {
  tab.addEventListener("click", () => showView(tab.dataset.view));
});

// -------- Portada --------
const PORTADA_CAMPOS = [
  "eyebrow", "titulo_linea1", "titulo_linea2", "titulo_destacado", "descripcion",
  "cta_primario_texto", "cta_primario_link", "cta_secundario_texto", "cta_secundario_link",
];

async function loadPortada() {
  const json = await api("/portada");
  if (json.status !== "success") {
    toast(json.error?.message || "No se pudo cargar la portada", "error");
    return;
  }
  const form = document.getElementById("portada-form");
  PORTADA_CAMPOS.forEach((campo) => {
    form.querySelector(`[name=${campo}]`).value = json.data[campo];
  });
}

document.getElementById("portada-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const errEl = document.getElementById("portada-error");
  const submitBtn = form.querySelector("button[type=submit]");
  errEl.classList.add("hidden");

  const body = {};
  PORTADA_CAMPOS.forEach((campo) => {
    body[campo] = form.querySelector(`[name=${campo}]`).value.trim();
  });

  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  try {
    const json = await api("/admin/portada", { method: "PUT", body: JSON.stringify(body) });
    if (json.status !== "success") {
      errEl.textContent = json.error?.message || "No se pudo guardar";
      errEl.classList.remove("hidden");
      return;
    }
    toast("Portada actualizada");
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
  }
});

// -------- Chatbot --------
let chatbotCache = [];
let editingChatbotId = null;

function chatbotRow(item) {
  const estado = item.activo
    ? '<span class="badge badge-ok">Activo</span>'
    : '<span class="badge badge-muted">Inactivo</span>';
  return `<tr data-id="${item.item_id}">
    <td class="px-4 py-3 text-slate-400">${item.orden}</td>
    <td class="px-4 py-3 font-semibold text-navy-950">${escapeHtml(item.pregunta)}</td>
    <td class="px-4 py-3">${estado}</td>
    <td class="px-4 py-3 text-right whitespace-nowrap">
      <button class="btn-icon edit-chatbot-btn" title="Editar" type="button">✎</button>
      <button class="btn-icon danger delete-chatbot-btn" title="Borrar" type="button">🗑</button>
    </td>
  </tr>`;
}

async function loadChatbotItems() {
  const json = await api("/admin/chatbot");
  if (json.status !== "success") {
    toast(json.error?.message || "No se pudieron cargar las preguntas", "error");
    return;
  }
  chatbotCache = json.data;
  const tbody = document.getElementById("chatbot-tbody");
  tbody.innerHTML = chatbotCache.length
    ? chatbotCache.map(chatbotRow).join("")
    : `<tr><td colspan="4" class="px-4 py-8 text-center text-slate-400 italic">Sin preguntas todavía.</td></tr>`;

  tbody.querySelectorAll(".edit-chatbot-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.closest("tr").dataset.id;
      openChatbotModal(chatbotCache.find((i) => i.item_id === id));
    });
  });
  tbody.querySelectorAll(".delete-chatbot-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => deleteChatbotItem(e.target.closest("tr").dataset.id));
  });
}

async function deleteChatbotItem(id) {
  const item = chatbotCache.find((i) => i.item_id === id);
  if (!confirm(`¿Borrar "${item?.pregunta || id}"? Esta acción no se puede deshacer.`)) return;
  const json = await api(`/admin/chatbot/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (json.status !== "success") {
    toast(json.error?.message || "No se pudo borrar", "error");
    return;
  }
  toast("Pregunta borrada");
  await loadChatbotItems();
}

function openChatbotModal(item = null) {
  editingChatbotId = item ? item.item_id : null;
  const form = document.getElementById("chatbot-form");
  form.reset();
  document.getElementById("chatbot-form-error").classList.add("hidden");
  document.getElementById("chatbot-modal-title").textContent = item ? "Editar pregunta" : "Nueva pregunta";
  form.querySelector("[name=pregunta]").value = item?.pregunta || "";
  form.querySelector("[name=respuesta_markdown]").value = item?.respuesta_markdown || "";
  form.querySelector("[name=orden]").value = item?.orden ?? 0;
  form.querySelector("[name=activo]").checked = item ? item.activo : true;
  document.getElementById("chatbot-modal").classList.remove("hidden");
}

function closeChatbotModal() {
  document.getElementById("chatbot-modal").classList.add("hidden");
  editingChatbotId = null;
}

document.getElementById("new-chatbot-btn").addEventListener("click", () => openChatbotModal());
document.getElementById("chatbot-modal-close").addEventListener("click", closeChatbotModal);
document.getElementById("chatbot-modal-cancel").addEventListener("click", closeChatbotModal);

document.getElementById("chatbot-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const errEl = document.getElementById("chatbot-form-error");
  const submitBtn = form.querySelector("button[type=submit]");
  errEl.classList.add("hidden");

  const body = {
    pregunta: form.querySelector("[name=pregunta]").value.trim(),
    respuesta_markdown: form.querySelector("[name=respuesta_markdown]").value.trim(),
    orden: Number(form.querySelector("[name=orden]").value) || 0,
    activo: form.querySelector("[name=activo]").checked,
  };

  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  try {
    const json = editingChatbotId
      ? await api(`/admin/chatbot/${encodeURIComponent(editingChatbotId)}`, { method: "PUT", body: JSON.stringify(body) })
      : await api("/admin/chatbot", { method: "POST", body: JSON.stringify(body) });

    if (json.status !== "success") {
      errEl.textContent = json.error?.message || "No se pudo guardar";
      errEl.classList.remove("hidden");
      return;
    }
    toast(editingChatbotId ? "Pregunta actualizada" : "Pregunta creada");
    closeChatbotModal();
    await loadChatbotItems();
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
  }
});

// -------- Banners --------
let bannersCache = [];
let editingBannerId = null;

function formatFecha(iso) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function bannerEstado(b) {
  if (!b.activo) return '<span class="badge badge-muted">Inactivo</span>';
  const hoy = new Date().toISOString().slice(0, 10);
  if (hoy < b.fecha_inicio) return '<span class="badge badge-warn">Programado</span>';
  if (hoy > b.fecha_fin) return '<span class="badge badge-muted">Vencido</span>';
  return '<span class="badge badge-ok">Vigente</span>';
}

function bannerRow(b) {
  return `<tr data-id="${b.banner_id}">
    <td class="px-4 py-3 font-semibold text-navy-950">${escapeHtml(b.titulo)}</td>
    <td class="px-4 py-3 text-slate-500">${formatFecha(b.fecha_inicio)} – ${formatFecha(b.fecha_fin)}</td>
    <td class="px-4 py-3">${bannerEstado(b)}</td>
    <td class="px-4 py-3 text-right whitespace-nowrap">
      <button class="btn-icon edit-banner-btn" title="Editar" type="button">✎</button>
      <button class="btn-icon danger delete-banner-btn" title="Borrar" type="button">🗑</button>
    </td>
  </tr>`;
}

async function loadBanners() {
  const json = await api("/admin/banners");
  if (json.status !== "success") {
    toast(json.error?.message || "No se pudieron cargar los banners", "error");
    return;
  }
  bannersCache = json.data;
  const tbody = document.getElementById("banners-tbody");
  tbody.innerHTML = bannersCache.length
    ? bannersCache.map(bannerRow).join("")
    : `<tr><td colspan="4" class="px-4 py-8 text-center text-slate-400 italic">Sin banners todavía.</td></tr>`;

  tbody.querySelectorAll(".edit-banner-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.closest("tr").dataset.id;
      openBannerModal(bannersCache.find((b) => b.banner_id === id));
    });
  });
  tbody.querySelectorAll(".delete-banner-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => deleteBanner(e.target.closest("tr").dataset.id));
  });
}

async function deleteBanner(id) {
  const banner = bannersCache.find((b) => b.banner_id === id);
  if (!confirm(`¿Borrar "${banner?.titulo || id}"? Esta acción no se puede deshacer.`)) return;
  const json = await api(`/admin/banners/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (json.status !== "success") {
    toast(json.error?.message || "No se pudo borrar", "error");
    return;
  }
  toast("Banner borrado");
  await loadBanners();
}

function openBannerModal(banner = null) {
  editingBannerId = banner ? banner.banner_id : null;
  const form = document.getElementById("banner-form");
  form.reset();
  document.getElementById("banner-form-error").classList.add("hidden");
  document.getElementById("banner-modal-title").textContent = banner ? "Editar banner" : "Nuevo banner";
  form.querySelector("[name=titulo]").value = banner?.titulo || "";
  form.querySelector("[name=mensaje]").value = banner?.mensaje || "";
  form.querySelector("[name=enlace_texto]").value = banner?.enlace_texto || "";
  form.querySelector("[name=enlace_url]").value = banner?.enlace_url || "";
  form.querySelector("[name=fecha_inicio]").value = banner?.fecha_inicio || "";
  form.querySelector("[name=fecha_fin]").value = banner?.fecha_fin || "";
  form.querySelector("[name=activo]").checked = banner ? banner.activo : true;
  document.getElementById("banner-modal").classList.remove("hidden");
}

function closeBannerModal() {
  document.getElementById("banner-modal").classList.add("hidden");
  editingBannerId = null;
}

document.getElementById("new-banner-btn").addEventListener("click", () => openBannerModal());
document.getElementById("banner-modal-close").addEventListener("click", closeBannerModal);
document.getElementById("banner-modal-cancel").addEventListener("click", closeBannerModal);

document.getElementById("banner-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const errEl = document.getElementById("banner-form-error");
  const submitBtn = form.querySelector("button[type=submit]");
  errEl.classList.add("hidden");

  const body = {
    titulo: form.querySelector("[name=titulo]").value.trim(),
    mensaje: form.querySelector("[name=mensaje]").value.trim(),
    enlace_texto: form.querySelector("[name=enlace_texto]").value.trim() || null,
    enlace_url: form.querySelector("[name=enlace_url]").value.trim() || null,
    fecha_inicio: form.querySelector("[name=fecha_inicio]").value,
    fecha_fin: form.querySelector("[name=fecha_fin]").value,
    activo: form.querySelector("[name=activo]").checked,
  };

  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  try {
    const json = editingBannerId
      ? await api(`/admin/banners/${encodeURIComponent(editingBannerId)}`, { method: "PUT", body: JSON.stringify(body) })
      : await api("/admin/banners", { method: "POST", body: JSON.stringify(body) });

    if (json.status !== "success") {
      errEl.textContent = json.error?.message || "No se pudo guardar";
      errEl.classList.remove("hidden");
      return;
    }
    toast(editingBannerId ? "Banner actualizado" : "Banner creado");
    closeBannerModal();
    await loadBanners();
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
  }
});
