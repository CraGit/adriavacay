"use client";

import { useState } from "react";

export default function NewsletterForm({ heading, subheading, subscribe }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await subscribe(email);
      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      {heading && (
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
          {heading}
        </h2>
      )}
      {subheading && (
        <p className="text-slate-500 dark:text-slate-400 mb-8">{subheading}</p>
      )}

      {status === "success" ? (
        <p className="text-green-600 font-medium text-lg">
          Thank you for subscribing!
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-3 text-sm text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}
