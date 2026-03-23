"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import {
  getChatGreeting,
  sendChatMessage,
  type ChatMessage,
} from "@/lib/api";
import { type NdaFormData } from "@/lib/generateNda";

interface ChatPanelProps {
  onFieldsExtracted: (fields: Partial<NdaFormData>) => void;
}

export default function ChatPanel({ onFieldsExtracted }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getChatGreeting()
      .then((res) => {
        setMessages([{ role: "assistant", content: res.message }]);
      })
      .catch(() => {
        setMessages([
          {
            role: "assistant",
            content:
              "Hi! I'm here to help you create a Mutual NDA. What's the purpose of this agreement, and which companies are involved?",
          },
        ]);
      });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || isLoading) return;

    setInputText("");
    setError("");

    const userMsg: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(messages, text);
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: response.message },
      ]);
      if (Object.keys(response.extracted_fields).length > 0) {
        onFieldsExtracted(response.extracted_fields as Partial<NdaFormData>);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get AI response"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[600px] rounded border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 px-4 py-3">
        <h2 className="text-sm font-semibold" style={{ color: "#032147" }}>
          AI Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "text-white"
                  : "bg-zinc-100 text-zinc-800"
              }`}
              style={
                msg.role === "user"
                  ? { backgroundColor: "#209dd7" }
                  : undefined
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 rounded-lg px-3 py-2 text-sm text-zinc-500">
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="border-t border-zinc-200 px-4 py-3 flex gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 rounded border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="rounded px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: "#753991" }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
