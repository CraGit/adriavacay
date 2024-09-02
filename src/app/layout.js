import "./globals.css";
import "@/assets/css/tailwind.css";
import "@/assets/css/materialdesignicons.min.css";
import { League_Spartan } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchProvider from "@/providers/search-provider";
import ContactBar from "@/components/ContactBar";

const league_Spartan = League_Spartan({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-league_Spartan",
});

export const metadata = {
  title: "adriaVacay - your perfect vacation home",
  description:
    "Choose us for your next vacation home. We offer the best vacation homes in Dalmatia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="LTR">
      <body className={`${league_Spartan.className}`}>
        <SearchProvider>
          <Navbar navClass="navbar-white" />
          {children}
          <Footer />
          <ContactBar />
        </SearchProvider>
      </body>
    </html>
  );
}
