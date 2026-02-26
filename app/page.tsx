"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [saved, setSaved] = useState(false);

  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const p = localStorage.getItem("app_password") || "";
    if (p) {
      setPassword(p);
      setSaved(true);
    }
  }, []);

  function savePassword() {
    localStorage.setItem("app_password", password);
    setSaved(true);
    setReply("");
  }

  function clearPassword() {
    localStorage.removeItem("app_password");
    setPassword("");
    setSaved(false);
    setReply("");
  }

  async function send() {
    setLoading(true);
    setReply("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-password": password,
        },
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

      <div style={{ marginBottom: 16, padding: 12, border: "1px solid #444" }}>
        <div style={{ fontSize: 14, marginBottom: 8 }}>
          このアプリは合言葉が必要です
        </div>

        <input
          type="password"
          value={password}
          placeholder="合言葉（パスワード）"
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, fontSize: 16 }}
        />

        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <button
            onClick={savePassword}
            disabled={password.trim().length === 0}
            style={{ padding: "8px 12px", fontSize: 14, cursor: "pointer" }}
          >
            {saved ? "更新" : "保存"}
          </button>
          <button
            onClick={clearPassword}
            style={{ padding: "8px 12px", fontSize: 14, cursor: "pointer" }}
          >
            クリア
          </button>
        </div>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="ここにメッセージを入力"
        rows={5}
        style={{ width: "100%", padding: 12, fontSize: 16 }}
      />

      <button
        onClick={send}
        disabled={loading || message.trim().length === 0 || password.trim().length === 0}
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