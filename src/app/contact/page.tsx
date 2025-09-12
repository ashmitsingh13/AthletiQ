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
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-[#0a0f2c] dark:via-[#111c44] dark:to-[#1c2541] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-10 items-center">
        
        {/* Contact Info Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Email Card */}
          <div className="bg-white dark:bg-[#181c2f] rounded-2xl shadow-lg border border-blue-200 dark:border-blue-900 p-6 flex flex-col items-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-600 dark:text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.75a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-.75m0 0v10.5a2.25 2.25 0 002.25 2.25h14.25a2.25 2.25 0 002.25-2.25V6.75" />
              </svg>
            </span>
            <h3 className="font-bold text-lg mb-1 text-blue-700 dark:text-blue-300">Email Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Our friendly team is here to help.</p>
            <a href="mailto:neurospartans@gmail.com" className="text-blue-500 font-medium">neurospartans@gmail.com</a>
          </div>

          {/* Location Card */}
          <div className="bg-white dark:bg-[#181c2f] rounded-2xl shadow-lg border border-blue-200 dark:border-blue-900 p-6 flex flex-col items-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-600 dark:text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75v16.5m-9-16.5v16.5M3.75 7.5h16.5m-16.5 9h16.5" />
              </svg>
            </span>
            <h3 className="font-bold text-lg mb-1 text-blue-700 dark:text-blue-300">Visit Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Come say hello</p>
            <span className="text-blue-500 font-medium text-center">Bareilly, Uttar Pradesh, India</span>
          </div>

          {/* Call Card */}
          <div className="bg-white dark:bg-[#181c2f] rounded-2xl shadow-lg border border-blue-200 dark:border-blue-900 p-6 flex flex-col items-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-600 dark:text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25v7.5A2.25 2.25 0 004.5 18h15a2.25 2.25 0 002.25-2.25v-7.5m-19.5 0A2.25 2.25 0 014.5 6h15a2.25 2.25 0 012.25 2.25m-19.5 0v.75a.75.75 0 00.75.75h18a.75.75 0 00.75-.75v-.75m-19.5 0v7.5A2.25 2.25 0 004.5 18h15a2.25 2.25 0 002.25-2.25v-7.5" />
              </svg>
            </span>
            <h3 className="font-bold text-lg mb-1 text-blue-700 dark:text-blue-300">Call Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Mon-Fri</p>
            <a href="tel:+917820XXXXXX" className="text-blue-500 font-medium">+91 7820XXXXXX</a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full max-w-md bg-white dark:bg-[#181c2f] p-8 rounded-3xl shadow-2xl border border-blue-200 dark:border-blue-900 mx-auto">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-3xl font-bold mb-2 text-blue-700 dark:text-blue-300">Contact Us</h1>
            <p className="text-base text-gray-600 dark:text-gray-400 text-center">We&apos;d love to hear from you! Fill out the form below and our team will get back to you soon.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-700 dark:text-blue-300">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50 dark:bg-[#232a45] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-blue-700 dark:text-blue-300">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50 dark:bg-[#232a45] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-blue-700 dark:text-blue-300">Message</label>
              <textarea
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-blue-200 dark:border-blue-800 rounded-xl bg-blue-50 dark:bg-[#232a45] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>
          </form>

          {status === "success" && (
            <p className="text-green-600 dark:text-green-400 text-sm mt-4 text-center">
              ✅ Message sent successfully!
            </p>
          )}
          {status === "error" && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-4 text-center">
              ❌ Something went wrong. Please try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
