import "./globals.css";
import "@/assets/css/tailwind.css";
import "@mdi/font/css/materialdesignicons.min.css";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchProvider from "@/providers/search-provider";
import ContactBar from "@/components/ContactBar";
import NuqsWrapper from "@/components/NuqsWrapper";
import ConsentProvider from "@/providers/consent-provider";
import CookieBanner from "@/components/CookieBanner";
import ConsentGate from "@/components/ConsentGate";
import { cookies } from "next/headers";

const league_Spartan = localFont({
  src: [
    {
      path: "../../node_modules/@fontsource/league-spartan/files/league-spartan-latin-300-normal.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/league-spartan/files/league-spartan-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/league-spartan/files/league-spartan-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/league-spartan/files/league-spartan-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../node_modules/@fontsource/league-spartan/files/league-spartan-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-league_Spartan",
});

export const viewport = {
  themeColor: "#AC8B16",
};

export const metadata = {
  title: "AdriaVacay -Tailored Stayes, Timeless Memories",
  description:
    "Choose us for your next vacation home. We offer the best vacation homes in Dalmatia.",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const consentCookie = cookieStore.get("site_consent");
  let serverConsent = null;
  try {
    if (consentCookie)
      serverConsent = JSON.parse(decodeURIComponent(consentCookie.value));
  } catch (e) {
    serverConsent = null;
  }
  return (
    <html lang="en" dir="LTR" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <meta themecolor={viewport.themeColor} />
      </head>
      <body className={`${league_Spartan.variable} ${league_Spartan.className}`}>
        <ConsentProvider initialConsent={serverConsent}>
          <NuqsWrapper>
            {children}
            <ConsentGate />
            <CookieBanner />
          </NuqsWrapper>
        </ConsentProvider>
        {serverConsent && serverConsent.analytics ? (
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KK3MTZQ9" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
        ) : null}
      </body>
    </html>
  );
}
