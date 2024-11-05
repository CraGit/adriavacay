"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default function PartialDiv({ children, className }) {
  const [partHidden, setPartHidden] = useState(true);

  const togglePart = () => {
    setPartHidden(!partHidden);
  };

  const t = useTranslations("accommodation-single");

  return (
    <>
      <div
        className={`${partHidden ? "line-clamp-5" : ""} ${className} relative`}
        style={{
          maskImage: partHidden
            ? "linear-gradient(to bottom, black 60%, transparent 100%)"
            : "none",
          WebkitMaskImage: partHidden
            ? "linear-gradient(to bottom, black 60%, transparent 100%)"
            : "none",
        }}
      >
        {children}
      </div>
      <button
        onClick={togglePart}
        className="text-primary-1 text-green-600 underline decoration-dotted mt-2"
      >
        {partHidden ? t("show-more") : t("hide")}
      </button>
    </>
  );
}
