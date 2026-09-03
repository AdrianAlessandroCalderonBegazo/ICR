import { WHATSAPP_URL } from "../config/contact";

export default function FloatingWhatsApp() {
  return (
    <a
      className="whatsapp-fab"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chatear por WhatsApp"
    >
      <i className="bi bi-whatsapp" aria-hidden="true"></i>
    </a>
  );
}
