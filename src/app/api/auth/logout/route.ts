import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  // Clear server-side cookie store
  cookieStore.delete("authToken");
  cookieStore.delete("refreshToken");

  // Also instruct the browser to clear them via Set-Cookie headers
  const response = NextResponse.redirect(
    new URL(
      "/signin",
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    )
  );

  response.cookies.delete("authToken");
  response.cookies.delete("refreshToken");

  return response;
}
