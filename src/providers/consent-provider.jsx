"use client";
import React, { createContext, useCallback, useEffect, useState } from "react";

const COOKIE_NAME = "site_consent";

function readConsentFromCookie() {
  try {
    const match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
    if (!match) return null;
    const raw = decodeURIComponent(match[1]);
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function writeConsentToCookie(obj) {
  try {
    const val = encodeURIComponent(JSON.stringify(obj));
    // 1 year
    const maxAge = 60 * 60 * 24 * 365;
    // include Secure; it will be ignored on http
    document.cookie = `${COOKIE_NAME}=${val}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
  } catch (e) {
    // ignore
  }
}

export const ConsentContext = createContext({
  consent: null,
  setConsent: () => {},
  acceptAll: () => {},
  declineAll: () => {},
});

export default function ConsentProvider({ children }) {
  const [consent, setConsentState] = useState(null);

  useEffect(() => {
    const c = readConsentFromCookie();
    setConsentState(c);
  }, []);

  const setConsent = useCallback((obj) => {
    setConsentState(obj);
    writeConsentToCookie(obj);
    // persist server-side so server renders can read cookie
    fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    }).catch(() => {});
    // dispatch event so other parts can react if needed
    try {
      window.dispatchEvent(new CustomEvent("consent:changed", { detail: obj }));
    } catch (e) {}
  }, []);

  const acceptAll = useCallback(() => setConsent({ analytics: true }), [setConsent]);
  const declineAll = useCallback(() => setConsent({ analytics: false }), [setConsent]);

  return (
    <ConsentContext.Provider value={{ consent, setConsent, acceptAll, declineAll }}>
      {children}
    </ConsentContext.Provider>
  );
}
