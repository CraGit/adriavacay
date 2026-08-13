/**
 * MyRent channel manager — SERVER-ONLY module.
 * Contains API fetching and reservation write APIs. Do not import from client components.
 * Client-safe utility functions live in @/lib/myrent-utils.
 *
 * Write routes require a token from auth.my-rent.net (≈1h lifetime), sent as the `token` header.
 * Tokens are cached in-memory with a safety buffer and retried once on 401.
 */

import { myRentToDayRecord } from "./myrent-utils";

const MYRENT_API_BASE = "https://api.my-rent.net";
const MYRENT_AUTH_URL = "https://auth.my-rent.net/auth/generate";

/** Cache under the 1h token lifetime (refresh at 45 minutes). */
const TOKEN_TTL_MS = 45 * 60 * 1000;

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

function invalidateMyRentToken() {
  cachedToken = null;
}

/**
 * Generate (and cache ~45min) MyRent API token for write operations.
 * Auth generate requires user_guid + Authorization headers (see MyRent docs).
 */
export async function getMyRentToken({ force = false } = {}) {
  const now = Date.now();
  if (!force && cachedToken && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }

  const userGuid = process.env.MYRENT_USER_GUID;
  const authHeader = process.env.MYRENT_API_AUTH;
  const userId = process.env.MYRENT_USER_ID;
  const publicKey = process.env.MYRENT_API_PUBLIC_KEY;
  const authKey = process.env.MYRENT_API_AUTH_KEY;

  if (!userGuid || !userId || !publicKey || !authKey || !authHeader) {
    throw new Error(
      "MyRent auth is not configured. Set MYRENT_USER_GUID, MYRENT_USER_ID, MYRENT_API_PUBLIC_KEY, MYRENT_API_AUTH_KEY, and MYRENT_API_AUTH (Authorization value for auth/generate)."
    );
  }

  const headers = {
    "content-type": "application/json",
    accept: "application/json",
    user_guid: userGuid,
    Authorization: authHeader,
  };

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
    throw new Error(
      `MyRent auth failed ${res.status}: ${text || "(empty response)"}. Check MYRENT_USER_GUID, MYRENT_API_AUTH, MYRENT_USER_ID, MYRENT_API_PUBLIC_KEY, and MYRENT_API_AUTH_KEY.`
    );
  }

  const data = await res.json();
  const token = data.token || data.Token || data.access_token;
  if (!token) {
    throw new Error("MyRent auth response did not include a token");
  }

  cachedToken = {
    token,
    expiresAt: now + TOKEN_TTL_MS,
  };
  return token;
}

async function getWriteHeaders({ forceToken = false } = {}) {
  const token = await getMyRentToken({ force: forceToken });
  return {
    ...getBaseHeaders(),
    token,
  };
}

/**
 * Run a MyRent write request; on 401 invalidate token and retry once with a fresh token.
 * @param {(headers: Record<string, string>) => Promise<Response>} requestFn
 */
async function withWriteAuth(requestFn) {
  let res = await requestFn(await getWriteHeaders());
  if (res.status === 401) {
    invalidateMyRentToken();
    res = await requestFn(await getWriteHeaders({ forceToken: true }));
  }
  return res;
}

function assertPositiveIntId(myRentId) {
  const id = Number(myRentId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid myRentId: ${myRentId}`);
  }
  return id;
}

/**
 * Resolve MyRent payment_method_id for stripe vs bank, with fallbacks.
 * @param {"stripe" | "bank" | "bank_transfer" | string | undefined} paymentMethod
 */
export function resolveMyRentPaymentMethodId(paymentMethod) {
  const isBank =
    paymentMethod === "bank" || paymentMethod === "bank_transfer";
  if (isBank) {
    return (
      process.env.MYRENT_PAYMENT_METHOD_ID_BANK ||
      process.env.MYRENT_PAYMENT_METHOD_ID ||
      null
    );
  }
  if (paymentMethod === "stripe") {
    return (
      process.env.MYRENT_PAYMENT_METHOD_ID_STRIPE ||
      process.env.MYRENT_PAYMENT_METHOD_ID ||
      null
    );
  }
  return process.env.MYRENT_PAYMENT_METHOD_ID || null;
}

/**
 * Fetch per-day prices and availability for a property from the MyRent API.
 * Returns a day-keyed record or throws on API/network error.
 */
export async function fetchMyRentDays(myRentId) {
  const id = assertPositiveIntId(myRentId);

  const res = await fetch(`${MYRENT_API_BASE}/user/prices/${id}`, {
    headers: getBaseHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`MyRent API error ${res.status} for property ${id}`);
  }

  const rawDays = await res.json();
  return myRentToDayRecord(rawDays);
}

/**
 * Extract rent guid from various MyRent create-response shapes.
 * e.g. { rent_guid } or { status: "ok", data: { rent_guid, rent_id } }
 */
function extractRentGuid(data) {
  if (!data || typeof data !== "object") return null;

  const candidates = [data];
  if (data.data && typeof data.data === "object") {
    candidates.push(data.data);
  }

  for (const node of candidates) {
    const guid =
      node.rent_guid ||
      node.rentGuid ||
      node.guid ||
      node.id_hash ||
      node.rent_id ||
      node.rentId ||
      node.id;
    if (guid != null && String(guid).length > 0) {
      return String(guid);
    }
  }

  return null;
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

  const paymentMethodId =
    input.paymentMethodId ||
    resolveMyRentPaymentMethodId(input.paymentMethod);
  if (paymentMethodId) {
    body.payment_method_id = paymentMethodId;
  }

  if (input.checkIn) body.check_in = input.checkIn;
  if (input.checkOut) body.check_out = input.checkOut;

  const res = await withWriteAuth((headers) =>
    fetch(`${MYRENT_API_BASE}/user/rent_add`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    })
  );

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
  if (input.inAdvancePaid) body.in_advance_paid = input.inAdvancePaid;
  if (input.paid) body.paid = input.paid;
  if (input.note) body.note = input.note;

  const res = await withWriteAuth((headers) =>
    fetch(`${MYRENT_API_BASE}/user/rent_save`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    })
  );

  const raw = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `MyRent rent_save failed ${res.status}: ${JSON.stringify(raw)}`
    );
  }
  return raw;
}

/**
 * After successful Stripe Checkout: mark advance paid; mark fully paid only at 100%.
 *
 * @param {{
 *   rentGuid: string,
 *   objectId: string | number,
 *   percent: string | number,
 *   amountDue?: string | number,
 *   total?: string | number,
 *   sessionId?: string,
 *   erpId?: string,
 * }} input
 */
export async function markMyRentStripePayment(input) {
  const percent = Number(input.percent);
  const isFull = percent === 100;
  const amountDue = input.amountDue ?? "";
  const total = input.total ?? "";
  const note = [
    `Stripe: EUR ${amountDue}/${total} (${isFull ? "100% full" : `${percent}% partial`})`,
    input.sessionId ? `session=${input.sessionId}` : null,
    input.erpId ? `erp=${input.erpId}` : null,
  ]
    .filter(Boolean)
    .join(". ");

  return updateRent({
    rentGuid: input.rentGuid,
    objectId: input.objectId,
    inAdvancePaid: "Y",
    paid: isFull ? "Y" : "N",
    note,
  });
}

/**
 * Delete a reservation (abandoned Stripe Checkout).
 */
export async function deleteRent(rentGuid) {
  if (!rentGuid) {
    throw new Error("rentGuid is required");
  }

  const res = await withWriteAuth((headers) =>
    fetch(
      `${MYRENT_API_BASE}/user/rent_del/${encodeURIComponent(rentGuid)}`,
      {
        method: "DELETE",
        headers,
        cache: "no-store",
      }
    )
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`MyRent rent_del failed ${res.status}: ${text}`);
  }

  return true;
}
