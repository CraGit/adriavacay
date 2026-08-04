import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import NuqsWrapper from "@/components/NuqsWrapper";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchProvider from "@/providers/search-provider";
import ContactBar from "@/components/ContactBar";
import { createClient } from "@/prismicio";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LangLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  const client = createClient();
  const destinations = await client
    .getAllByType("destination", {
      lang: locale,
      fetchOptions: { cache: "no-store" },
    })
    .catch(() => []);
  const services = await client
    .getAllByType("service_single", {
      lang: locale,
      fetchOptions: { cache: "no-store" },
    })
    .catch(() => []);

  return (
    <NextIntlClientProvider messages={messages}>
      <NuqsWrapper>
        <SearchProvider>
          <Navbar
            navClass="navbar-white"
            destinations={destinations}
            services={services}
          />
          {children}
          <Footer />
          <ContactBar />
        </SearchProvider>
      </NuqsWrapper>
    </NextIntlClientProvider>
  );
}
