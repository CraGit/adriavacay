import { NextResponse } from "next/server";

import { fetchMyRentFreeProperties } from "@/lib/myrent";

/**
 * GET /api/myrent/free?from=yyyy-MM-dd&to=yyyy-MM-dd&guests=n
 * Proxies MyRent POST /user/free for dated accommodation search.
 */
export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const guests = searchParams.get("guests");

  if (!from || !to || !/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return NextResponse.json(
      { error: "from and to are required as yyyy-MM-dd" },
      { status: 400 }
    );
  }

  if (from > to) {
    return NextResponse.json(
      { error: "from must be on or before to" },
      { status: 400 }
    );
  }

  try {
    const properties = await fetchMyRentFreeProperties({
      from,
      to,
      guests: guests ? Number(guests) : undefined,
    });
    return NextResponse.json({ from, to, properties });
  } catch (error) {
    console.error("[api/myrent/free]", error);
    return NextResponse.json(
      { error: error.message || "MyRent free search failed" },
      { status: 502 }
    );
  }
}
