import "./globals.css";
import "@/assets/css/tailwind.css";
import "@/assets/css/materialdesignicons.min.css";
import { League_Spartan } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchProvider from "@/providers/search-provider";
import ContactBar from "@/components/ContactBar";
import Script from "next/script";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const GTM_ID = "GTM-NPW97CCQ";
const league_Spartan = League_Spartan({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="LTR" className="scroll-smooth">
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
      <head>
        <meta themeColor={viewport.themeColor} />
      </head>
      <body className={`${league_Spartan.className}`}>
        {children}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display: none; visibility: hidden;"></iframe>`,
          }}
        />
      </body>
    </html>
  );
}
