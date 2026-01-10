import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // Delete both session cookies
  cookieStore.delete("session");
  cookieStore.delete("admin_session");

  return NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
  );
}
