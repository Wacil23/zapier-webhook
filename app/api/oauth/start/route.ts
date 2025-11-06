import { NextResponse } from "next/server";

export async function GET() {
  const redirect = new URL("https://login.dash.app/oauth/authorize");
  redirect.searchParams.set("client_id", process.env.DASH_CLIENT_ID!);
  redirect.searchParams.set("redirect_uri", process.env.DASH_REDIRECT_URI!);
  redirect.searchParams.set("response_type", "code");
  redirect.searchParams.set("scope", "assets:write assets:read"); // adapte selon doc

  return NextResponse.redirect(redirect.toString());
}
