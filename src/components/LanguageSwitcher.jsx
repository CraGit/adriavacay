"use client";

import { cn } from "@/lib/utils";
import { routing, Link, usePathname } from "@/i18n/routing";
import { useLocale } from "next-intl";

const localeLabels = {
  "en-us": "EN",
  de: "DE",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-3">
      <span aria-hidden>🌐</span>
      <ul className="flex flex-wrap gap-3">
        {routing.locales.map((cur) => (
          <li key={cur}>
            <Link
              href={pathname}
              locale={cur}
              className={cn(locale === cur && "font-semibold")}
            >
              {localeLabels[cur]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
