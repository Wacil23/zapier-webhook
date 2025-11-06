import { NextResponse } from "next/server";

// stockage minimal en mémoire (en prod → DB, Redis, etc.)
let tokenCache: {
  access_token: string;
  expiry: number;
  refresh_token: string;
} | null = null;

export async function POST() {
  if (tokenCache && Date.now() < tokenCache.expiry) {
    return NextResponse.json({ access_token: tokenCache.access_token });
  }

  // sinon : rafraîchir avec refresh_token stocké
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

  const data = await r.json();
  tokenCache = {
    access_token: data.access_token,
    expiry: Date.now() + data.expires_in * 1000,
    refresh_token: data.refresh_token ?? process.env.DASH_REFRESH_TOKEN!,
  };

  return NextResponse.json({ access_token: tokenCache.access_token });
}
