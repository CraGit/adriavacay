import { cn } from "@/lib/utils";
import { PrismicNextLink } from "@prismicio/next";

const localeLabels = {
  "en-us": "EN",
  hr: "HR",
};

export const LanguageSwitcher = ({ activeLocale }) => (
  <div className="flex flex-wrap gap-3">
    <span aria-hidden>🌐</span>
    <ul className="flex flex-wrap gap-3">
      <li>
        <PrismicNextLink
          href="/"
          className={cn(activeLocale === "en-us" && "font-semibold")}
        >
          EN
        </PrismicNextLink>
      </li>
      <li>
        <PrismicNextLink
          href="/hr"
          className={cn(activeLocale === "hr" && "font-semibold")}
        >
          HR
        </PrismicNextLink>
      </li>
    </ul>
  </div>
);
