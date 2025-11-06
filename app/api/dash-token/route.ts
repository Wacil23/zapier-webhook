import { NextResponse } from "next/server";

let tokenCache: {
  access_token: string;
  expiry: number;
  refresh_token: string;
} | null = null;

let refreshing = false;

export async function POST() {
  if (tokenCache && Date.now() < tokenCache.expiry) {
    return NextResponse.json({ access_token: tokenCache.access_token });
  }

  if (refreshing) {
    // Attendre pendant qu’un refresh est en cours
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ access_token: tokenCache?.access_token });
  }

  refreshing = true;

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: process.env.DASH_REFRESH_TOKEN!,
    client_id: process.env.DASH_CLIENT_ID!,
    client_secret: process.env.DASH_CLIENT_SECRET!,
  });

  const r = await fetch("https://login.dash.app/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!r.ok) {
    const error = await r.text();
    console.error("Dash token refresh failed:", error);
    refreshing = false;
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 400 }
    );
  }

  const data = await r.json();

  tokenCache = {
    access_token: data.access_token,
    expiry: Date.now() + data.expires_in * 1000,
    refresh_token: data.refresh_token ?? process.env.DASH_REFRESH_TOKEN!,
  };

  refreshing = false;

  if (
    data.refresh_token &&
    data.refresh_token !== process.env.DASH_REFRESH_TOKEN
  ) {
    console.log("⚠️ Nouveau refresh_token reçu:", data.refresh_token);
  }

  return NextResponse.json({ access_token: tokenCache.access_token });
}
