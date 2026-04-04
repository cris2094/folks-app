"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  MoreHorizontal,
  Mic,
  ArrowRight,
  Phone,
} from "lucide-react";

interface Message {
  id: string;
  type: "bot" | "user";
  text: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "bot",
    text: "\u00A1Buenos dias, Do\u00F1a Carmen! \uD83D\uDE0A\n\n\u00BFC\u00F3mo amaneci\u00F3 hoy?\nEstoy aqu\u00ED para ayudarle con la administraci\u00F3n.",
  },
];

const quickActions = [
  { label: "\u00BFTengo paquetes?", icon: ArrowRight },
  { label: "Hablar con Seguridad", icon: Phone },
];

const botResponses: Record<string, string> = {
  "\u00BFTengo paquetes?": "\u00A1S\u00ED, Carmen! \u2705",
  "Hablar con Seguridad":
    "Conectandote con la porteria... \uD83D\uDCDE\n\nCarlos (Seguridad) esta disponible ahora.",
};

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
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-300 overflow-hidden">
      {/* Placeholder for user photo */}
      <div className="h-full w-full rounded-full bg-gradient-to-br from-amber-200 to-amber-400" />
    </div>
  );
}

export default function FolkyPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(true);
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
    setShowQuickActions(false);

    // Simulate bot response
    setTimeout(() => {
      const response =
        botResponses[text.trim()] ??
        "Entendido! Dejame revisar eso por ti. Un momento por favor...";
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
        <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100">
          <MoreHorizontal className="h-5 w-5 text-gray-400" />
        </button>
      </header>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        {/* Timestamp */}
        <p className="mb-5 text-center text-[12px] text-gray-400">
          Hoy, 10:42 AM
        </p>

        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.type === "bot" ? (
                <div className="flex items-start gap-2.5">
                  <BotAvatar />
                  <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-gray-100 px-4 py-3">
                    <p className="text-[14px] leading-relaxed text-gray-800 whitespace-pre-line">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-end justify-end gap-2">
                  <div className="max-w-[75%] rounded-2xl rounded-tr-md bg-amber-500 px-4 py-3">
                    <p className="text-[14px] leading-relaxed text-white">
                      {msg.text}
                    </p>
                  </div>
                  <UserAvatar />
                </div>
              )}
            </div>
          ))}

          {/* Quick action buttons - show only initially */}
          {showQuickActions && (
            <div className="flex flex-col gap-2 pl-12">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.label)}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-[14px] font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <span>{action.label}</span>
                  <action.icon className="h-4 w-4 text-amber-500" />
                </button>
              ))}
            </div>
          )}
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
              placeholder="Escriba un mensaje..."
              className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={() => handleSend(input)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm transition-colors hover:bg-amber-600 active:scale-95"
          >
            <Mic className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-3 pt-1 text-center">
        <p className="text-[10px] font-medium tracking-widest text-gray-300">
          <span className="mr-1">{"\u2726"}</span>
          POTENCIADO POR FOLKS
        </p>
      </div>
    </div>
  );
}
