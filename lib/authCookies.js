export function setAuthCookies(session) {
  if (!session?.access_token) {
    return;
  }

  const maxAge = session.expires_in ?? 3600;
  const accessToken = encodeURIComponent(session.access_token);
  const refreshToken = session.refresh_token
    ? encodeURIComponent(session.refresh_token)
    : "";
  const secureFlag =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";

  document.cookie = `sb-access-token=${accessToken}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secureFlag}`;

  if (refreshToken) {
    document.cookie = `sb-refresh-token=${refreshToken}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secureFlag}`;
  }
}

export function clearAuthCookies() {
  document.cookie = "sb-access-token=; Path=/; Max-Age=0; SameSite=Lax";
  document.cookie = "sb-refresh-token=; Path=/; Max-Age=0; SameSite=Lax";
}
