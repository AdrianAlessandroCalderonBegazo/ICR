import { useMemo, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import useChatbotItems from "../hooks/useChatbotItems";

// No es un chatbot con IA: las respuestas son Markdown fijo que se edita
// desde el panel de administración (colección "chatbot_items"). Se muestran
// como accesos rápidos; al elegir uno se renderiza su respuesta.
export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { items, status } = useChatbotItems();

  const selected = useMemo(
    () => items.find((i) => i.item_id === selectedId) || null,
    [items, selectedId]
  );

  const answerHtml = useMemo(() => {
    if (!selected) return "";
    return DOMPurify.sanitize(marked.parse(selected.respuesta_markdown));
  }, [selected]);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);
  const back = () => setSelectedId(null);

  if (status === "ready" && items.length === 0) return null;

  return (
    <>
      <button
        type="button"
        className="chatbot-fab"
        onClick={toggle}
        aria-label={open ? "Cerrar chat" : "Abrir chat de ayuda"}
        aria-expanded={open}
      >
        <i className={`bi ${open ? "bi-x-lg" : "bi-chat-dots-fill"}`} aria-hidden="true"></i>
      </button>

      {open && (
        <div className="chatbot-panel" role="dialog" aria-label="Asistente de Inversiones ICR">
          <div className="chatbot-header">
            <span>Asistente ICR</span>
            <button type="button" className="chatbot-close" onClick={close} aria-label="Cerrar chat">
              <i className="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          </div>

          <div className="chatbot-body">
            {status === "loading" && <p className="chatbot-hint">Cargando…</p>}
            {status === "error" && <p className="chatbot-hint">No se pudo cargar el asistente. Intenta más tarde.</p>}

            {status === "ready" && !selected && (
              <>
                <p className="chatbot-hint">Elige una pregunta:</p>
                <div className="chatbot-questions">
                  {items.map((item) => (
                    <button
                      type="button"
                      key={item.item_id}
                      className="chatbot-question-btn"
                      onClick={() => setSelectedId(item.item_id)}
                    >
                      {item.pregunta}
                    </button>
                  ))}
                </div>
              </>
            )}

            {selected && (
              <div className="chatbot-answer">
                <button type="button" className="chatbot-back-btn" onClick={back}>
                  <i className="bi bi-arrow-left" aria-hidden="true"></i> Volver
                </button>
                <div className="chatbot-answer-content" dangerouslySetInnerHTML={{ __html: answerHtml }} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
