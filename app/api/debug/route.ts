// pages/api/debug.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const test = {
    PROJECT_GOOGLE: JSON.parse(
      JSON.stringify(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
    ),
  };
  return NextResponse.json({ HELLO: "HELLO WORLD", DEBUG: test });
}
