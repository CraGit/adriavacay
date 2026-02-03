"use client";
import React, { useContext, useEffect, useRef } from "react";
import { ConsentContext } from "@/providers/consent-provider";

export default function CookieBanner() {
  const { consent, acceptAll, declineAll } = useContext(ConsentContext);
  const acceptRef = useRef(null);
  // ensure hooks are always called in the same order
  useEffect(() => {
    // focus the accept button for keyboard users when the banner appears
    try {
      if (consent === null) acceptRef.current?.focus();
    } catch (e) {}

    function onKey(e) {
      if (e.key === "Escape") {
        declineAll();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [declineAll, consent]);

  // don't render if user already made a choice
  if (consent !== null) return null;

  return (
    <div className="fixed left-4 right-4 bottom-6 md:left-12 md:right-12 md:bottom-8 z-50">
      <div className="mx-auto w-full max-w-3xl">
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-desc"
          className="bg-primary text-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex-1">
            <h3 id="cookie-banner-title" className="text-xl md:text-2xl font-semibold">
              We use cookies to improve your experience
            </h3>
            <p id="cookie-banner-desc" className="mt-2 text-sm md:text-base opacity-90">
              We and selected partners use cookies to personalize content, measure performance and deliver a better
              experience. Click "Accept" to proceed.
            </p>
          </div>

          <div className="flex w-full md:w-auto justify-end items-center gap-4 mt-4 md:mt-0">
            <button
              onClick={declineAll}
              className="text-white underline opacity-90 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
              aria-label="Decline cookies"
            >
              Decline
            </button>

            <button
              ref={acceptRef}
              onClick={acceptAll}
              className="bg-white text-primary rounded-lg px-4 py-3 shadow-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
              aria-label="Accept cookies"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
