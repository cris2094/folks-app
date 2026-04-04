"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Sparkles, X, Send, Mic } from "lucide-react";

// ---------------------------------------------------------------------------
// Contextual greetings & quick actions per route
// ---------------------------------------------------------------------------

interface ContextConfig {
  greeting: string;
  actions: string[];
}

const ROUTE_CONTEXT: Record<string, ContextConfig> = {
  "/finanzas": {
    greeting: "Necesitas ayuda con tus pagos?",
    actions: ["Ver mi saldo", "Descargar recibo"],
  },
  "/pqr": {
    greeting: "Quieres reportar una incidencia?",
    actions: ["Crear PQR", "Ver mis PQR"],
  },
  "/zonas": {
    greeting: "Te ayudo a reservar una zona?",
    actions: ["Reservar BBQ", "Ver disponibilidad"],
  },
  "/paquetes": {
    greeting: "Tienes un paquete por recoger?",
    actions: ["Mis paquetes", "Historial"],
  },
  "/comunicados": {
    greeting: "Quieres ver las novedades del conjunto?",
    actions: ["Ultimos comunicados"],
  },
  "/mantenimiento": {
    greeting: "Necesitas reportar un dano?",
    actions: ["Reportar dano", "Ver tareas"],
  },
};

const DEFAULT_CONTEXT: ContextConfig = {
  greeting: "Hola! En que te puedo ayudar?",
  actions: ["Cuanto debo?", "Tengo paquetes?", "Reportar problema"],
};

function getContextForPath(pathname: string): ContextConfig {
  for (const [route, config] of Object.entries(ROUTE_CONTEXT)) {
    if (pathname.startsWith(route)) return config;
  }
  return DEFAULT_CONTEXT;
}

const transport = new DefaultChatTransport({
  api: "/api/ai/chat",
});

function getTimeString(): string {
  return new Date().toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Extract plain text from a UIMessage's parts array */
function getMessageText(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text)
    .join("");
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FolkyContextual() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status } = useChat({
    id: "folky-contextual",
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Don't render on /folky -- it has its own full chat
  if (pathname === "/folky") return null;

  const context = getContextForPath(pathname);
  const hasUserMessages = messages.some((m) => m.role === "user");

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function handleOpen() {
    setIsOpen(true);
  }

  function handleSend(text: string) {
    if (!text.trim()) return;
    setInput("");
    sendMessage({ text: text.trim() });
  }

  // ------- Floating button (closed state) -------
  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 shadow-lg shadow-amber-500/30 transition-transform duration-200 active:scale-95"
        aria-label="Abrir asistente Folky"
      >
        <Sparkles className="h-6 w-6 text-white" strokeWidth={1.5} />
      </button>
    );
  }

  // ------- Expanded mini-chat -------
  return (
    <div className="fixed bottom-20 right-4 z-40 flex w-[320px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-amber-500 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <Sparkles className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Folky</p>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
              <span className="text-[10px] text-white/80">En linea</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setIsOpen(false);
              router.push("/folky");
            }}
            className="flex h-7 items-center rounded-full px-2 text-[10px] font-medium text-white/80 transition-colors hover:bg-white/20"
          >
            Expandir
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex max-h-[300px] min-h-[200px] flex-col gap-3 overflow-y-auto px-3 py-3"
      >
        {/* Welcome message */}
        {!hasUserMessages && (
          <div className="flex flex-col items-start">
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-gray-100 px-3 py-2 text-[13px] leading-relaxed text-gray-800">
              {context.greeting}
            </div>
            <span className="mt-0.5 text-[10px] text-gray-400">
              {getTimeString()}
            </span>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                msg.role === "assistant"
                  ? "rounded-tl-md bg-gray-100 text-gray-800"
                  : "rounded-tr-md bg-amber-500 text-white"
              }`}
            >
              {getMessageText(msg.parts)}
            </div>
            <span className="mt-0.5 text-[10px] text-gray-400">
              {getTimeString()}
            </span>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-start">
            <div className="rounded-2xl rounded-tl-md bg-gray-100 px-3 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {status === "error" && (
          <div className="flex flex-col items-start">
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-red-50 px-3 py-2 text-[13px] leading-relaxed text-red-700">
              Folky esta en modo demo.
            </div>
          </div>
        )}

        {/* Quick actions -- only show if no user messages yet */}
        {!hasUserMessages && (
          <div className="flex flex-wrap gap-1.5">
            {context.actions.map((action) => (
              <button
                key={action}
                onClick={() => handleSend(action)}
                className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[12px] font-medium text-amber-700 transition-colors hover:bg-amber-100 active:bg-amber-200"
              >
                {action}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-3 py-2">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend(input);
            }}
            disabled={isLoading}
            placeholder="Escribe un mensaje..."
            className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-[13px] outline-none placeholder:text-gray-400 focus:border-amber-300"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isLoading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white transition-all hover:bg-amber-600 active:scale-95 disabled:opacity-50"
            aria-label="Enviar"
          >
            {input.trim() ? (
              <Send className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-2 pt-0.5 text-center">
        <p className="flex items-center justify-center gap-1 text-[9px] font-medium tracking-widest text-gray-300">
          <svg
            className="h-2 w-2"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
