import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function middleware(request) {
  const rawToken = request.cookies.get("sb-access-token")?.value;
  const accessToken = rawToken ? decodeURIComponent(rawToken) : null;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/admin-dashboard")) {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("email_user", userData.user.id)
      .order("role", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (profileError || !profile?.role) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin-dashboard/:path*"],
};
