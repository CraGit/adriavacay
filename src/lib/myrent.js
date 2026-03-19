/**
 * MyRent channel manager — SERVER-ONLY module.
 * Contains API fetching and data transformation. Do not import from client components.
 * Client-safe utility functions live in @/lib/myrent-utils.
 */

import { myRentToDayRecord } from "./myrent-utils";

const MYRENT_API_BASE = "https://api.my-rent.net";

function getHeaders() {
  return {
    accept: "application/json",
    user_guid: process.env.MYRENT_USER_GUID,
    b2b_guid: process.env.MYRENT_B2B_GUID,
  };
}

/**
 * Fetch per-day prices and availability for a property from the MyRent API.
 * myRentId must be a positive integer — validated to prevent path traversal / SSRF.
 * Returns a day-keyed record { "YYYY-MM-DD": { price, checkIn, checkOut, minStay, available } }
 * or throws on API/network error.
 */
export async function fetchMyRentDays(myRentId) {
  const id = Number(myRentId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid myRentId: ${myRentId}`);
  }

  const res = await fetch(`${MYRENT_API_BASE}/user/prices/${id}`, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`MyRent API error ${res.status} for property ${id}`);
  }

  const rawDays = await res.json();
  return myRentToDayRecord(rawDays);
}
