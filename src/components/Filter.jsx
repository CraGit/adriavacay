"use client";

import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";

const Filter = () => {
  const [type, setType] = useQueryState("type", {
    defaultValue: "All",
  });

  return (
    <div className="relative mb-8 flex items-center justify-center gap-2">
      <button
        onClick={() => setType("All")}
        className={cn(
          "border-2 p-2 rounded-md w-24 text-sm",
          type === "All" && "border-green-600"
        )}
      >
        All
      </button>
      <button
        onClick={() => setType("Villa")}
        className={cn(
          "border-2 p-2 rounded-md w-24 text-sm",
          type === "Villa" && "border-green-600"
        )}
      >
        Villas
      </button>
      <button
        onClick={() => setType("Cottage")}
        className={cn(
          "border-2 p-2 rounded-md w-24 text-sm",
          type === "Cottage" && "border-green-600"
        )}
      >
        Cottages
      </button>
    </div>
  );
};

export default Filter;
