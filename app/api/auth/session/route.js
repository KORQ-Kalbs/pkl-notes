import { NextResponse } from "next/server";

export async function POST(request) {
  const session = await request.json();

  if (!session?.access_token) {
    return NextResponse.json(
      { error: "Missing access token" },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ ok: true });
  const maxAge = session.expires_in ?? 3600;
  const secure = process.env.NODE_ENV === "production";
  const cookieBase = {
    path: "/",
    httpOnly: true,
    secure,
    sameSite: "lax",
  };

  response.cookies.set({
    name: "sb-access-token",
    value: session.access_token,
    maxAge,
    ...cookieBase,
  });

  if (session.refresh_token) {
    response.cookies.set({
      name: "sb-refresh-token",
      value: session.refresh_token,
      maxAge,
      ...cookieBase,
    });
  }

  return response;
}
