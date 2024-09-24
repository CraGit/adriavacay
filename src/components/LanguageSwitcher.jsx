import { cn } from "@/lib/utils";
import { PrismicNextLink } from "@prismicio/next";
import { routing } from "@/i18n/routing";
import { useLocale } from "next-intl";

const localeLabels = {
  "en-us": "EN",
  hr: "HR",
};

export default function LanguageSwitcher() {
  const locale = useLocale();

  return (
    <div className="flex flex-wrap gap-3">
      <span aria-hidden>🌐</span>
      <ul className="flex flex-wrap gap-3">
        {routing.locales.map((cur) => (
          <li key={cur}>
            <PrismicNextLink
              href={`/${cur}`}
              className={cn(locale === cur && "font-semibold")}
            >
              {localeLabels[cur]}
            </PrismicNextLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
