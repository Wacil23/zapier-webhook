import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.DASH_CLIENT_ID!,
    client_secret: process.env.DASH_CLIENT_SECRET!,
    code,
    redirect_uri: process.env.DASH_REDIRECT_URI!,
  });

  const r = await fetch("https://login.dash.app/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await r.json();

  // Exemple : log temporaire ou sauvegarde en DB / KV
  console.log("Dash OAuth tokens:", data);

  // Ici tu stockes refresh_token et access_token dans ta DB ou ton .env
  return NextResponse.json(data);
}
