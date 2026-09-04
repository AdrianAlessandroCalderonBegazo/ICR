import { useEffect, useState } from "react";
import { CMS_API_URL } from "../config/cms";

export default function useChatbotItems() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${CMS_API_URL}/chatbot`);
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || json.status !== "success") throw new Error("chatbot fetch failed");
        setItems(json.data);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { items, status };
}
