"use server";

export async function subscribeNewsletter(formData) {
  const email = formData.get("email");
  if (!email) throw new Error("Missing email");

  const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
  const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
  const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER;

  if (!MAILCHIMP_API_KEY || !MAILCHIMP_AUDIENCE_ID || !MAILCHIMP_SERVER) {
    throw new Error("Mailchimp not configured on the server. Set MAILCHIMP_API_KEY, MAILCHIMP_AUDIENCE_ID and MAILCHIMP_SERVER.");
  }

  const credentials = Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64");

  const res = await fetch(
    `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email, status: "subscribed" }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    if (data.title === "Member Exists") return { ok: true };
    throw new Error(data.detail || "Subscription failed.");
  }

  return { ok: true };
}
