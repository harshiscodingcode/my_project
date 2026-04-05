"use client";

import { FormEvent, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export function ChatAssistant({ planId, initialMessages }: { planId: string; initialMessages: ChatMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    const response = await fetch(`/api/plans/${planId}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      setMessages(data.chatHistory);
      setMessage("");
    }
  }

  return (
    <section className="glass-card p-6">
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-secondary">AI follow-up assistant</p>
      <div className="mt-5 space-y-3">
        {messages.map((item, index) => (
          <div key={`${item.createdAt}-${index}`} className={`rounded-2xl p-4 text-sm ${item.role === "assistant" ? "bg-muted" : "bg-primary text-white"}`}>
            <p className="mb-1 text-xs uppercase tracking-[0.2em] opacity-70">{item.role}</p>
            <p className="leading-7">{item.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 md:flex-row">
        <input className="input-base flex-1" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask for pricing, launch tactics, validation ideas..." />
        <button className="btn-primary md:w-40" disabled={loading}>{loading ? "Thinking..." : "Ask AI"}</button>
      </form>
    </section>
  );
}
