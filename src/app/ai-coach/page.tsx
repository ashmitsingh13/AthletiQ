"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Mic, Send } from "lucide-react";

export default function AICoachPage() {
  const [messages, setMessages] = useState([
    { from: "ai", text: "👋 Hello Athlete! How can I help you with your training today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "✅ Got it! I’ll prepare a plan for you." },
      ]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12 flex flex-col">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge className="animate-pulse">🤖 AI Chat & Talk</Badge>
        <h1 className="text-4xl md:text-5xl font-bold font-[Neucha]">
          Talk With Your AI Coach
        </h1>
        <p className="text-muted-foreground">
          Ask training questions, get workout advice, or chat in real-time.
        </p>
      </div>

      {/* Chat Box */}
      <div className="flex-1 mt-10 max-w-3xl mx-auto w-full flex flex-col border rounded-2xl bg-card shadow-sm">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: msg.from === "user" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`max-w-[80%] px-4 py-2 rounded-xl ${
                msg.from === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "mr-auto bg-secondary/40 text-foreground"
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t flex items-center gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={sendMessage}
            className="p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90"
          >
            <Send className="h-5 w-5" />
          </button>
          <button
            className="p-3 bg-secondary text-foreground rounded-xl hover:opacity-80"
            onClick={() => alert("🎤 Voice mode coming soon!")}
          >
            <Mic className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
