"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    setLoading(true);
    setReply("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setReply(`Error: ${data?.error ?? "Unknown error"}`);
      } else {
        setReply(data.text);
      }
    } catch (e: any) {
      setReply(`Error: ${e?.message ?? "Network error"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Chat-like App</h1>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="ここにメッセージを入力"
        rows={5}
        style={{ width: "100%", padding: 12, fontSize: 16 }}
      />

      <button
        onClick={send}
        disabled={loading || message.trim().length === 0}
        style={{
          marginTop: 12,
          padding: "10px 14px",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        {loading ? "送信中..." : "送信"}
      </button>

      <div style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
        <h2 style={{ fontSize: 18 }}>返答</h2>
        <div style={{ padding: 12, border: "1px solid #ccc" }}>
          {reply || "（ここに返答が表示されます）"}
        </div>
      </div>
    </main>
  );
}