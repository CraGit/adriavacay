import { NextIntlClientProvider } from "next-intl";

import { getMessages } from "next-intl/server";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchProvider from "@/providers/search-provider";
import ContactBar from "@/components/ContactBar";

export default async function LangLayout({ children, params }) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <SearchProvider>
        <Navbar navClass="navbar-white" />
        {children}
        <Footer />
        <ContactBar />
      </SearchProvider>
    </NextIntlClientProvider>
  );
}
