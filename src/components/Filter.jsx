"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

const Filter = () => {
  const [type, setType] = useQueryState("type", {
    defaultValue: "All",
  });

  const t = useTranslations("search");

  return (
    <div className="relative mb-8 flex items-center justify-center gap-2">
      <button
        onClick={() => setType("All")}
        className={cn(
          "border-2 p-2 rounded-md w-24 text-sm",
          type === "All" && "border-green-600"
        )}
      >
        {t("all")}
      </button>
      <button
        onClick={() => setType("Villa")}
        className={cn(
          "border-2 p-2 rounded-md w-24 text-sm",
          type === "Villa" && "border-green-600"
        )}
      >
        {t("villas")}
      </button>
      <button
        onClick={() => setType("Cottage")}
        className={cn(
          "border-2 p-2 rounded-md w-24 text-sm",
          type === "Cottage" && "border-green-600"
        )}
      >
        {t("cottages")}
      </button>
    </div>
  );
};

export default Filter;
