import { readFile } from "fs/promises";
import path from "path";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

async function loadMessages(locale) {
  const filePath = path.join(process.cwd(), "messages", `${locale}.json`);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
