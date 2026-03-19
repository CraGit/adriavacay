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
    <div className="relative mb-8 flex items-center justify-center gap-2 overflow-x-auto flex-nowrap">
      <button
        onClick={() => setType("All")}
        className={cn(
          "border-2 px-4 py-2 rounded-md min-w-[110px] text-sm whitespace-nowrap",
          type === "All" && "border-green-600"
        )}
      >
        {t("all")}
      </button>
      <button
        onClick={() => setType("Villa")}
        className={cn(
          "border-2 px-4 py-2 rounded-md min-w-[110px] text-sm whitespace-nowrap",
          type === "Villa" && "border-green-600"
        )}
      >
        {t("villas")}
      </button>
      <button
        onClick={() => setType("Cottage")}
        className={cn(
          "border-2 px-4 py-2 rounded-md min-w-[110px] text-sm whitespace-nowrap",
          type === "Cottage" && "border-green-600"
        )}
      >
        {t("cottages")}
      </button>
      <button
        onClick={() => setType("Apartment")}
        className={cn(
          "border-2 px-4 py-2 rounded-md min-w-[110px] text-sm whitespace-nowrap",
          type === "Apartment" && "border-green-600"
        )}
      >
        {t("apartments")}
      </button>
    </div>
  );
};

export default Filter;
