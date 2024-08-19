import { clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { enGB } from "date-fns/locale";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const df = (date, formatStr = "PP") =>
  format(date, formatStr, { locale: enGB });
