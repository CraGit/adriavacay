/**
 * Stay date helpers for bookings.
 *
 * Canonical stay day in app state: UTC noon for that calendar day
 * (e.g. 2027-09-12T12:00:00.000Z). Never store local midnight.
 *
 * MyRent / emails use yyyy-MM-dd keys via toStayDateISO (safe across TZs).
 */

export const PROPERTY_TIMEZONE = "Europe/Zagreb";

const ISO_DAY_RE = /^\d{4}-\d{2}-\d{2}/;

function pad2(n) {
  return String(n).padStart(2, "0");
}

/**
 * Human-readable date only, e.g. "11 Aug 2027".
 * Accepts a Date (instant → Zagreb calendar day) or a `yyyy-MM-dd` string
 * already representing a stay calendar day.
 */
export function formatStayDate(date) {
  if (!date) return "";

  if (typeof date === "string" && ISO_DAY_RE.test(date)) {
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
 * Machine date yyyy-MM-dd in Europe/Zagreb (legacy / display for raw instants).
 */
export function formatStayDateISO(date) {
  if (!date) return "";
  if (typeof date === "string" && ISO_DAY_RE.test(date)) {
    return date.slice(0, 10);
  }
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

/**
 * yyyy-MM-dd from a DayPicker cell using the picker's local calendar parts
 * (the day the user clicked).
 */
export function stayDateFromPickerDate(date) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/**
 * UTC Y-M-D from a Date (for UTC-noon stay dates).
 */
function utcDayISO(date) {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
}

/**
 * Date at UTC noon for a calendar day.
 * @param {string | Date} isoOrDate - yyyy-MM-dd or Date
 */
export function stayDateToUtcNoon(isoOrDate) {
  if (!isoOrDate) return null;

  let iso;
  if (typeof isoOrDate === "string" && ISO_DAY_RE.test(isoOrDate)) {
    iso = isoOrDate.slice(0, 10);
  } else if (isoOrDate instanceof Date || typeof isoOrDate === "string") {
    iso = toStayDateISO(isoOrDate);
  } else {
    return null;
  }

  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

/**
 * Safe yyyy-MM-dd for MyRent keys / APIs.
 * - Already ISO day string → as-is
 * - UTC-noon stay Date (hour === 12 UTC) → UTC calendar day
 * - Legacy local midnight / other instants → Europe/Zagreb calendar day
 */
export function toStayDateISO(value) {
  if (!value) return "";
  if (typeof value === "string" && ISO_DAY_RE.test(value)) {
    return value.slice(0, 10);
  }

  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  // Canonical stay dates are stored at UTC noon.
  if (d.getUTCHours() === 12 && d.getUTCMinutes() === 0) {
    return utcDayISO(d);
  }

  return formatStayDateISO(d);
}

/**
 * Add calendar days to a yyyy-MM-dd string (UTC date arithmetic).
 */
export function addStayDaysISO(iso, days) {
  const base = toStayDateISO(iso);
  if (!base) return "";
  const [y, m, d] = base.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + days, 12, 0, 0));
  return utcDayISO(next);
}

/**
 * Nights in [from, to) as yyyy-MM-dd strings.
 */
export function eachStayNightISO(from, to) {
  const fromIso = toStayDateISO(from);
  const toIso = toStayDateISO(to);
  if (!fromIso || !toIso) return [];

  const nights = stayNightsCount(fromIso, toIso);
  if (nights <= 0) return [];

  const result = [];
  for (let i = 0; i < nights; i++) {
    result.push(addStayDaysISO(fromIso, i));
  }
  return result;
}

/**
 * Number of nights between check-in and check-out (checkout exclusive).
 */
export function stayNightsCount(from, to) {
  const fromIso = toStayDateISO(from);
  const toIso = toStayDateISO(to);
  if (!fromIso || !toIso) return 0;

  const [fy, fm, fd] = fromIso.split("-").map(Number);
  const [ty, tm, td] = toIso.split("-").map(Number);
  const fromUtc = Date.UTC(fy, fm - 1, fd);
  const toUtc = Date.UTC(ty, tm - 1, td);
  return Math.round((toUtc - fromUtc) / (24 * 60 * 60 * 1000));
}

/**
 * Calendar days from "today" (property TZ) until check-in ISO day.
 */
export function stayDaysUntilCheckIn(checkIn, today = new Date()) {
  const checkInIso = toStayDateISO(checkIn);
  const todayIso = formatStayDateISO(today);
  if (!checkInIso || !todayIso) return 0;
  return stayNightsCount(todayIso, checkInIso);
}
