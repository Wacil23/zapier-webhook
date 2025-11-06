import { NextResponse } from "next/server";

export async function GET() {
  const redirect = new URL("https://login.dash.app/authorize");
  redirect.searchParams.set("client_id", process.env.DASH_CLIENT_ID!);
  redirect.searchParams.set("redirect_uri", process.env.DASH_REDIRECT_URI!);
  redirect.searchParams.set("response_type", "code");

  // 👇  Ces deux lignes sont indispensables
  redirect.searchParams.set("audience", "https://assetplatform.io");
  redirect.searchParams.set(
    "scope",
    `offline_access subdomain:my-account assets:read assets:write`
  );

  // redirect.searchParams.set("prompt", "consent");
  // redirect.searchParams.set("state", crypto.randomUUID());

  return NextResponse.redirect(redirect.toString());
}
