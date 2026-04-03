"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, MoreVertical, Mic, ArrowRight, Phone } from "lucide-react";

interface Message {
  id: string;
  type: "bot" | "user";
  text: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "bot",
    text: "Buenos dias, Dona Carmen! \u{1F60A}\n\nComo amanecio hoy? Estoy aqui para ayudarle con la administracion.",
  },
];

const quickActions = [
  { label: "Tengo paquetes?", icon: ArrowRight },
  { label: "Hablar con Seguridad", icon: Phone },
];

const botResponses: Record<string, string> = {
  "Tengo paquetes?":
    "Si, Carmen! \u2705\n\nTienes 1 paquete pendiente por recoger:\n\n\u{1F4E6} Servientrega - Caja Mediana\nRecibido hoy a las 10:30 AM por Carlos (Seguridad).\n\nQuieres que te genere el codigo de recogida?",
  "Hablar con Seguridad":
    "Conectandote con la porteria... \u{1F4DE}\n\nCarlos (Seguridad) esta disponible ahora. Puedes llamar al ext. 101 o quieres que le envie un mensaje?",
};

export default function FolkyPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSend(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const response =
        botResponses[text.trim()] ??
        "Entendido! Dejame revisar eso por ti. Un momento por favor... \u23F3";
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        text: response,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  }

  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col bg-white">
      {/* Header */}
      <header className="flex items-center gap-3 border-b px-4 py-3">
        <Link
          href="/home"
          className="flex items-center gap-1 text-sm font-medium text-amber-600"
        >
          <ChevronLeft className="h-4 w-4" />
          Inicio
        </Link>
        <div className="flex flex-1 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
            <svg
              className="h-4 w-4 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Asistente Irawa
            </p>
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span className="text-[11px] text-green-600">En linea</span>
            </div>
          </div>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
          <MoreVertical className="h-4 w-4 text-gray-500" />
        </button>
      </header>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.type === "bot" ? (
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500 mt-0.5">
                  <svg
                    className="h-3.5 w-3.5 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div className="rounded-2xl rounded-tl-md bg-gray-100 px-3.5 py-2.5">
                  <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
                    {msg.text}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-amber-500 px-3.5 py-2.5">
                  <p className="text-sm leading-relaxed text-white">
                    {msg.text}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Quick action buttons - show only after first bot message */}
        {messages.length === 1 && (
          <div className="flex flex-col gap-2 pl-9">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleSend(action.label)}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                <span>{action.label}</span>
                <action.icon className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend(input);
              }}
              placeholder="Escriba un mensaje..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={() => handleSend(input)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm transition-colors hover:bg-amber-600"
          >
            <Mic className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-2 pt-1 text-center">
        <p className="text-[10px] font-medium tracking-wider text-gray-400">
          <span className="mr-1">\u2726</span>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
