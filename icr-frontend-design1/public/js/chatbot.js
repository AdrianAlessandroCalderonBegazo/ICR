import { marked } from "../assets/vendor/marked.esm.js";
import DOMPurify from "../assets/vendor/purify.es.mjs";
import { CMS_API_URL } from "./config.js";

// No es un chatbot con IA: las respuestas son Markdown fijo que se edita
// desde el panel de administración (colección "chatbot_items"). Se muestran
// como accesos rápidos; al elegir uno se renderiza su respuesta.
async function initChatbot() {
  const root = document.getElementById("chatbot-widget-root");
  if (!root) return;

  let items = [];
  try {
    const res = await fetch(`${CMS_API_URL}/chatbot`);
    const json = await res.json();
    if (!res.ok || json.status !== "success") throw new Error("chatbot fetch failed");
    items = json.data;
  } catch {
    return; // sin datos, sin widget — no es contenido crítico del sitio.
  }

  if (items.length === 0) return;

  root.innerHTML = `
    <button type="button" class="chatbot-fab" aria-label="Abrir chat de ayuda" aria-expanded="false">
      <i class="bi bi-chat-dots-fill" aria-hidden="true"></i>
    </button>
    <div class="chatbot-panel" role="dialog" aria-label="Asistente de Inversiones ICR" hidden>
      <div class="chatbot-header">
        <span>Asistente ICR</span>
        <button type="button" class="chatbot-close" aria-label="Cerrar chat">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </div>
      <div class="chatbot-body">
        <p class="chatbot-hint">Elige una pregunta:</p>
        <div class="chatbot-questions"></div>
        <div class="chatbot-answer" hidden>
          <button type="button" class="chatbot-back-btn">
            <i class="bi bi-arrow-left" aria-hidden="true"></i> Volver
          </button>
          <div class="chatbot-answer-content"></div>
        </div>
      </div>
    </div>
  `;

  const fab = root.querySelector(".chatbot-fab");
  const fabIcon = fab.querySelector("i");
  const panel = root.querySelector(".chatbot-panel");
  const closeBtn = root.querySelector(".chatbot-close");
  const hint = root.querySelector(".chatbot-hint");
  const questionsEl = root.querySelector(".chatbot-questions");
  const answerBlock = root.querySelector(".chatbot-answer");
  const answerContent = root.querySelector(".chatbot-answer-content");
  const backBtn = root.querySelector(".chatbot-back-btn");

  items.forEach((item) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chatbot-question-btn";
    btn.textContent = item.pregunta;
    btn.addEventListener("click", () => showAnswer(item));
    questionsEl.appendChild(btn);
  });

  function showAnswer(item) {
    answerContent.innerHTML = DOMPurify.sanitize(marked.parse(item.respuesta_markdown));
    hint.hidden = true;
    questionsEl.hidden = true;
    answerBlock.hidden = false;
  }

  function showQuestions() {
    answerBlock.hidden = true;
    hint.hidden = false;
    questionsEl.hidden = false;
  }

  function setOpen(open) {
    panel.hidden = !open;
    fab.setAttribute("aria-expanded", String(open));
    fab.setAttribute("aria-label", open ? "Cerrar chat" : "Abrir chat de ayuda");
    fabIcon.className = open ? "bi bi-x-lg" : "bi bi-chat-dots-fill";
  }

  fab.addEventListener("click", () => setOpen(panel.hidden));
  closeBtn.addEventListener("click", () => setOpen(false));
  backBtn.addEventListener("click", showQuestions);
}

initChatbot();
