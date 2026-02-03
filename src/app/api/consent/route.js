import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const analytics = !!body.analytics;

  // Set cookie server-side so server components/layout can read it
  const maxAge = 60 * 60 * 24 * 365;
  const cookieVal = encodeURIComponent(JSON.stringify({ analytics }));

  const res = NextResponse.json({ success: true, analytics });
  res.headers.set(
    "Set-Cookie",
    `site_consent=${cookieVal}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`
  );
  return res;
}
