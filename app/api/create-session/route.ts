import { NextRequest, NextResponse } from "next/server";
import { adminAuth as auth } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();

  try {
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn,
    });

    const response = NextResponse.json({ status: "success" });
    response.cookies.set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
