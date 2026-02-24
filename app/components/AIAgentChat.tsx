"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLangStore } from "../lib/langStore";

function IconChat({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

const WELCOME_KEY = "__welcome__";

type Message = { role: "user" | "assistant"; content: string };

export default function AIAgentChat() {
  const lang = useLangStore((s) => s.lang);
  const t = useLangStore((s) => s.t);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME_KEY },
  ]);
  const [input, setInput] = useState("");

  useEffect(() => setMounted(true), []);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const reply = useLangStore.getState().t("aiAgentReply");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      { role: "assistant", content: reply },
    ]);
  }, [input]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-md border border-gray-500 bg-gradient-to-r from-gray-600 to-gray-700 text-brand-gold text-xs font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-white hover:border-brand-gold transition duration-300"
        aria-label={t("openAIChat")}
      >
        <IconChat className="w-4 h-4 shrink-0" />
        {t("aiAgent")}
        <span aria-hidden>→</span>
      </button>

      {mounted && isOpen && createPortal(
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-agent-title"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg h-[85vh] flex flex-col border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between px-6 py-4 border-b border-gray-100 bg-brand-stone">
              <h2
                id="ai-agent-title"
                className="font-serif text-xl font-bold text-brand-black"
              >
                {t("aiAgent")}
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-brand-black hover:bg-white transition"
                aria-label={t("closeChat")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-brand-black text-white"
                        : "bg-brand-stone text-brand-black border border-gray-200"
                    }`}
                  >
                    {msg.content === WELCOME_KEY ? t("aiAgentWelcome") : msg.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="shrink-0 p-4 border-t border-gray-100 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("writeMessage")}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-brand-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="px-5 py-3 bg-brand-gold text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:opacity-90 transition"
              >
                {t("send")}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
