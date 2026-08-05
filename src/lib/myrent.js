/**
 * MyRent channel manager — SERVER-ONLY module.
 * Contains API fetching and reservation write APIs. Do not import from client components.
 * Client-safe utility functions live in @/lib/myrent-utils.
 */

import { myRentToDayRecord } from "./myrent-utils";

const MYRENT_API_BASE = "https://api.my-rent.net";
const MYRENT_AUTH_URL = "https://auth.my-rent.net/auth/generate";

/** @type {{ token: string, expiresAt: number } | null} */
let cachedToken = null;

function getBaseHeaders() {
  return {
    accept: "application/json",
    "content-type": "application/json",
    user_guid: process.env.MYRENT_USER_GUID,
    b2b_guid: process.env.MYRENT_B2B_GUID,
  };
}

/**
 * Generate (and cache ~45min) MyRent API token for write operations.
 */
export async function getMyRentToken() {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }

  const userGuid = process.env.MYRENT_USER_GUID;
  const authHeader = process.env.MYRENT_API_AUTH;
  const userId = process.env.MYRENT_USER_ID;
  const publicKey = process.env.MYRENT_API_PUBLIC_KEY;
  const authKey = process.env.MYRENT_API_AUTH_KEY;

  if (!userGuid || !userId || !publicKey || !authKey) {
    throw new Error(
      "MyRent auth is not configured. Set MYRENT_USER_GUID, MYRENT_USER_ID, MYRENT_API_PUBLIC_KEY, MYRENT_API_AUTH_KEY."
    );
  }

  const headers = {
    "content-type": "application/json",
    user_guid: userGuid,
  };
  if (authHeader) {
    headers.Authorization = authHeader;
  }

  const res = await fetch(MYRENT_AUTH_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      user_id: Number(userId) || userId,
      public_key: publicKey,
      auth_key: authKey,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`MyRent auth failed ${res.status}: ${text}`);
  }

  const data = await res.json();
  const token = data.token || data.Token || data.access_token;
  if (!token) {
    throw new Error("MyRent auth response did not include a token");
  }

  cachedToken = {
    token,
    expiresAt: now + 45 * 60 * 1000,
  };
  return token;
}

async function getWriteHeaders() {
  const token = await getMyRentToken();
  return {
    ...getBaseHeaders(),
    token,
  };
}

function assertPositiveIntId(myRentId) {
  const id = Number(myRentId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid myRentId: ${myRentId}`);
  }
  return id;
}

/**
 * Fetch per-day prices and availability for a property from the MyRent API.
 * Returns a day-keyed record or throws on API/network error.
 */
export async function fetchMyRentDays(myRentId) {
  const id = assertPositiveIntId(myRentId);

  const res = await fetch(`${MYRENT_API_BASE}/user/prices/${id}`, {
    headers: getBaseHeaders(),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`MyRent API error ${res.status} for property ${id}`);
  }

  const rawDays = await res.json();
  return myRentToDayRecord(rawDays);
}

/**
 * Extract rent guid from various MyRent create-response shapes.
 */
function extractRentGuid(data) {
  if (!data || typeof data !== "object") return null;
  return (
    data.rent_guid ||
    data.rentGuid ||
    data.guid ||
    data.id_hash ||
    data.rent_id ||
    data.rentId ||
    data.id ||
    null
  );
}

/**
 * Create an unpaid reservation hold in MyRent.
 *
 * @param {object} input
 * @returns {Promise<{ rentGuid: string, erpId: string, raw: unknown }>}
 */
export async function createRent(input) {
  const objectId = assertPositiveIntId(input.objectId);
  const userId = Number(process.env.MYRENT_USER_ID);
  if (!Number.isInteger(userId) || userId <= 0) {
    throw new Error("MYRENT_USER_ID must be a positive integer");
  }

  const erpId = input.erpId || `av-${crypto.randomUUID()}`;
  const body = {
    object_id: objectId,
    user_id: userId,
    from_date: input.fromDate,
    until_date: input.untilDate,
    erp_id: erpId,
    adults: input.adults ?? 1,
    children: input.children ?? 0,
    price: input.price,
    in_advance: input.inAdvance,
    in_advance_paid: input.inAdvancePaid ?? "N",
    paid: input.paid ?? "N",
    exchange: "1",
    currency_id: process.env.MYRENT_CURRENCY_ID || "2",
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    contact_tel: input.contactTel || "",
    note: input.note || "Source: AdriaVacay website",
    language_id: input.languageId || "1",
  };

  if (process.env.MYRENT_RENT_SOURCE_ID) {
    body.rent_source_id = process.env.MYRENT_RENT_SOURCE_ID;
  }
  if (process.env.MYRENT_PAYMENT_METHOD_ID) {
    body.payment_method_id = process.env.MYRENT_PAYMENT_METHOD_ID;
  }
  if (input.checkIn) body.check_in = input.checkIn;
  if (input.checkOut) body.check_out = input.checkOut;

  const res = await fetch(`${MYRENT_API_BASE}/user/rent_add`, {
    method: "POST",
    headers: await getWriteHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const raw = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `MyRent rent_add failed ${res.status}: ${JSON.stringify(raw)}`
    );
  }

  const rentGuid = extractRentGuid(raw);
  if (!rentGuid) {
    throw new Error(
      `MyRent rent_add succeeded but no rent_guid in response: ${JSON.stringify(raw)}`
    );
  }

  return { rentGuid: String(rentGuid), erpId, raw };
}

/**
 * Update a reservation (e.g. mark advance/total paid after Stripe).
 */
export async function updateRent(input) {
  const objectId = assertPositiveIntId(input.objectId);
  if (!input.rentGuid) {
    throw new Error("rentGuid is required");
  }

  const body = {
    rent_guid: input.rentGuid,
    object_id: String(objectId),
  };

  if (input.price != null) body.price = String(input.price);
  if (input.inAdvance != null) body.in_advance = String(input.inAdvance);
  if (input.contactName) body.contact_name = input.contactName;
  if (input.contactEmail) body.contact_email = input.contactEmail;
  if (input.contactTel) body.contact_tel = input.contactTel;
  if (input.fromDate) body.from_date = input.fromDate;
  if (input.untilDate) body.until_date = input.untilDate;
  // Paid flags — may be accepted even if not fully documented on rent_save
  if (input.inAdvancePaid) body.in_advance_paid = input.inAdvancePaid;
  if (input.paid) body.paid = input.paid;
  if (input.note) body.note = input.note;

  const res = await fetch(`${MYRENT_API_BASE}/user/rent_save`, {
    method: "POST",
    headers: await getWriteHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const raw = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `MyRent rent_save failed ${res.status}: ${JSON.stringify(raw)}`
    );
  }
  return raw;
}

/**
 * Delete a reservation (abandoned Stripe Checkout).
 */
export async function deleteRent(rentGuid) {
  if (!rentGuid) {
    throw new Error("rentGuid is required");
  }

  const res = await fetch(
    `${MYRENT_API_BASE}/user/rent_del/${encodeURIComponent(rentGuid)}`,
    {
      method: "DELETE",
      headers: await getWriteHeaders(),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`MyRent rent_del failed ${res.status}: ${text}`);
  }

  return true;
}
