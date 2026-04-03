"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { sendMessage } from "../actions/send-message";
import type { TicketMessageItem } from "../queries/get-ticket-detail";

interface TicketChatProps {
  ticketId: string;
  messages: TicketMessageItem[];
  currentResidentId: string;
  disabled?: boolean;
}

export function TicketChat({
  ticketId,
  messages: initialMessages,
  currentResidentId,
  disabled = false,
}: TicketChatProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || sending || disabled) return;

    setSending(true);
    const fd = new FormData();
    fd.set("ticket_id", ticketId);
    fd.set("message", trimmed);

    // Optimistic update
    const optimistic: TicketMessageItem = {
      id: `temp-${Date.now()}`,
      sender_id: currentResidentId,
      message: trimmed,
      attachments: [],
      created_at: new Date().toISOString(),
      sender: { id: currentResidentId, full_name: "Tu", role: "residente" },
    };
    setMessages((prev) => [...prev, optimistic]);
    setText("");

    const result = await sendMessage(fd);
    if (result.error) {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setText(trimmed);
    }
    setSending(false);
  }

  function formatTime(date: string) {
    return new Date(date).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex flex-col">
      {/* Messages */}
      <div className="space-y-3 px-4 py-3">
        {messages.map((msg) => {
          const isOwn = msg.sender_id === currentResidentId;
          const senderName =
            Array.isArray(msg.sender) ? msg.sender[0]?.full_name : msg.sender?.full_name;
          const senderRole =
            Array.isArray(msg.sender) ? msg.sender[0]?.role : msg.sender?.role;
          const isAdmin =
            senderRole === "admin" || senderRole === "super_admin";

          return (
            <div
              key={msg.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  isOwn
                    ? "rounded-br-md bg-amber-500 text-white"
                    : "rounded-bl-md bg-gray-100 text-gray-900"
                }`}
              >
                {!isOwn && (
                  <p
                    className={`mb-0.5 text-[10px] font-semibold ${
                      isAdmin ? "text-amber-600" : "text-gray-500"
                    }`}
                  >
                    {senderName}
                    {isAdmin && " (Admin)"}
                  </p>
                )}
                <p className="text-sm leading-relaxed">{msg.message}</p>
                <p
                  className={`mt-1 text-right text-[10px] ${
                    isOwn ? "text-white/70" : "text-gray-400"
                  }`}
                >
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      {!disabled && (
        <div className="border-t bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Escribe un mensaje..."
              className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!text.trim() || sending}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-sm transition-colors hover:bg-amber-600 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
