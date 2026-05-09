async function postAuthSession(path, session) {
  if (typeof window === "undefined") {
    return;
  }

  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: session ? JSON.stringify(session) : undefined,
  });

  if (!response.ok) {
    const fallbackMessage = `Unable to update auth session (${response.status})`;

    try {
      const body = await response.json();
      throw new Error(body?.error || fallbackMessage);
    } catch {
      throw new Error(fallbackMessage);
    }
  }
}

export function setAuthCookies(session) {
  return postAuthSession("/api/auth/session", session);
}

export function clearAuthCookies() {
  return postAuthSession("/api/auth/logout");
}
