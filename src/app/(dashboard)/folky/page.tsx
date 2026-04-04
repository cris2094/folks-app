"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  MoreHorizontal,
  Mic,
  Send,
  ArrowRight,
  Phone,
} from "lucide-react";
import { FadeIn } from "@/components/motion";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const quickActions = [
  { label: "Tengo paquetes?", icon: ArrowRight },
  { label: "Hablar con Seguridad", icon: Phone },
];

const suggestedQuestions = [
  "Cuanto debo?",
  "Tengo paquetes?",
  "Reservar BBQ",
  "Reportar problema",
];

function getTimeString(): string {
  return new Date().toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function BotAvatar() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500">
      <svg
        className="h-4 w-4 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-300">
      <div className="h-full w-full rounded-full bg-gradient-to-br from-amber-200 to-amber-400" />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <BotAvatar />
      <div className="rounded-2xl rounded-tl-md bg-gray-100 px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

// Demo responses when no API key
const DEMO_RESPONSES: Record<string, string> = {
  "¿Cuánto debo?": "Tu saldo pendiente es de $185.000 del mes de abril. Ve a Finanzas para ver el detalle completo. 💰",
  "¿Tengo paquetes?": "¡Sí! Tienes 2 paquetes esperándote en portería. Uno de Amazon y otro de Servientrega. 📦",
  "Reservar BBQ": "El BBQ está disponible este sábado de 10am a 6pm. ¿Quieres que te lleve a la sección de Reservas? 🔥",
  "Reportar problema": "Claro, te llevo a crear una incidencia. ¿Es un problema de mantenimiento, ruido o seguridad? 🔧",
  "Hablar con Seguridad": "Conectándote con portería... Carlos (Seguridad) está disponible ahora. 📞",
};

function getDemoResponse(text: string): string {
  return DEMO_RESPONSES[text] ??
    `Entendido. Déjame ayudarte con "${text}". Te sugiero revisar la sección correspondiente de la app. ¿Necesitas algo más? 😊`;
}

export default function FolkyPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const startTime = useRef(getTimeString());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setShowQuickActions(false);
    setInput("");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      time: getTimeString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: trimmed }].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("API error");

      // Try to read as stream, fallback to text
      const responseText = await res.text();

      // Parse streaming response — extract text content
      let botText = "";
      try {
        // AI SDK stream format has data lines
        const lines = responseText.split("\n").filter(l => l.trim());
        for (const line of lines) {
          if (line.startsWith("0:")) {
            // Text delta format: 0:"text content"
            const content = line.slice(2).trim();
            if (content.startsWith('"') && content.endsWith('"')) {
              botText += JSON.parse(content);
            }
          }
        }
      } catch {
        // If parsing fails, use raw text
        botText = responseText;
      }

      if (!botText) botText = getDemoResponse(trimmed);

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: botText,
        time: getTimeString(),
      }]);
    } catch {
      // Fallback to demo response on any error
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getDemoResponse(trimmed),
        time: getTimeString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const hasUserMessages = messages.length > 0;

  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col bg-white">
      {/* Header */}
      <FadeIn>
        <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <Link
            href="/home"
            className="flex items-center gap-0.5 text-[14px] font-medium text-amber-500"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            Inicio
          </Link>
          <div className="text-center">
            <p className="text-[15px] font-bold text-gray-900">
              Asistente Irawa
            </p>
            <div className="flex items-center justify-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-[11px] font-medium text-green-500">
                En linea
              </span>
            </div>
          </div>
          <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 hover:bg-gray-100">
            <MoreHorizontal className="h-5 w-5 text-gray-400" />
          </button>
        </header>
      </FadeIn>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {/* Suggested questions chips */}
        {showQuickActions && (
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[12px] font-medium text-amber-700 transition-colors hover:bg-amber-100 active:bg-amber-200"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <p className="mb-5 text-center text-[12px] text-gray-400">
          Hoy, {startTime.current}
        </p>

        {/* Welcome message if no messages yet */}
        {!hasUserMessages && !isLoading && (
          <div className="flex items-start gap-2.5">
            <BotAvatar />
            <div className="flex max-w-[80%] flex-col">
              <div className="rounded-2xl rounded-tl-md bg-gray-100 px-4 py-3">
                <p className="whitespace-pre-line text-[14px] leading-relaxed text-gray-800">
                  Buenos dias!{"\n\n"}Como puedo ayudarte hoy?{"\n"}Estoy aqui
                  para lo que necesites.
                </p>
              </div>
              <span className="mt-0.5 pl-1 text-[10px] text-gray-400">
                {startTime.current}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.role === "assistant" ? (
                <div className="flex items-start gap-2.5">
                  <BotAvatar />
                  <div className="flex max-w-[80%] flex-col">
                    <div className="rounded-2xl rounded-tl-md bg-gray-100 px-4 py-3">
                      <p className="whitespace-pre-line text-[14px] leading-relaxed text-gray-800">
                        {msg.content}
                      </p>
                    </div>
                    <span className="mt-0.5 pl-1 text-[10px] text-gray-400">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-end justify-end gap-2">
                  <div className="flex max-w-[75%] flex-col items-end">
                    <div className="rounded-2xl rounded-tr-md bg-amber-500 px-4 py-3">
                      <p className="text-[14px] leading-relaxed text-white">
                        {msg.content}
                      </p>
                    </div>
                    <span className="mt-0.5 pr-1 text-[10px] text-gray-400">
                      {msg.time}
                    </span>
                  </div>
                  <UserAvatar />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && <TypingIndicator />}

          {/* Quick action buttons - show only initially */}
          {showQuickActions && !isLoading && (
            <div className="flex flex-col gap-2 pl-12">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.label)}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100"
                >
                  <span>{action.label}</span>
                  <action.icon className="h-4 w-4 text-amber-500" />
                </button>
              ))}
            </div>
          )}

          {/* Error messages are handled inline as demo responses */}
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex flex-1 items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend(input);
              }}
              disabled={isLoading}
              placeholder="Escriba un mensaje..."
              className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={() => handleSend(input)}
            disabled={isLoading}
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-amber-500 text-white shadow-sm transition-all duration-200 hover:bg-amber-600 active:scale-95 disabled:opacity-50"
          >
            {input.trim() ? (
              <Send className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-3 pt-1 text-center">
        <p className="flex items-center justify-center gap-1 text-[10px] font-medium tracking-widest text-gray-300">
          <svg
            className="h-2.5 w-2.5"
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
