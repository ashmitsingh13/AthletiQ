"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      // Remove unused '_' variable
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-card p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Contact Us</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              name="message"
              rows={4}
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
        </form>

        {status === "success" && (
          <p className="text-green-600 text-sm mt-4 text-center">
            ✅ Message sent successfully!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-sm mt-4 text-center">
            ❌ Something went wrong. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
