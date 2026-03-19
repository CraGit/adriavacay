import { NextIntlClientProvider } from "next-intl";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import NuqsWrapper from "@/components/NuqsWrapper";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchProvider from "@/providers/search-provider";
import ContactBar from "@/components/ContactBar";
import { createClient } from "@/prismicio";

export default async function LangLayout({ children, params: { locale } }) {
  const messages = await getMessages();

  unstable_setRequestLocale(locale);

  const client = createClient();
  const destinations = await client
    .getAllByType("destination", { lang: locale, fetchOptions: { cache: "no-store" } })
    .catch(() => []);

  return (
      <NextIntlClientProvider messages={messages}>
        <NuqsWrapper>
          <SearchProvider>
            <Navbar navClass="navbar-white" destinations={destinations} />
            {children}
            <Footer />
            <ContactBar />
          </SearchProvider>
        </NuqsWrapper>
      </NextIntlClientProvider>
  );
}
