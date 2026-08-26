/**
 * Stay date formatting for emails and APIs.
 * Always uses Europe/Zagreb so calendar days match Adriatic property local time
 * and never show a time component or UTC off-by-one.
 */

export const PROPERTY_TIMEZONE = "Europe/Zagreb";

/**
 * Human-readable date only, e.g. "11 Aug 2027".
 * Accepts a Date (instant → Zagreb calendar day) or a `yyyy-MM-dd` string
 * already representing a Zagreb calendar day.
 */
export function formatStayDate(date) {
  if (!date) return "";

  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date)) {
    const [y, m, d] = date.slice(0, 10).split("-").map(Number);
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "UTC",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(Date.UTC(y, m - 1, d)));
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: PROPERTY_TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date instanceof Date ? date : new Date(date));
}

/**
 * Machine date yyyy-MM-dd in Europe/Zagreb (for MyRent / ISO fields).
 */
export function formatStayDateISO(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: PROPERTY_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  return `${year}-${month}-${day}`;
}
