// pages/api/debug.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const test = {
        PROJECT_ID: process.env.PROJECT_ID,
        GOOGLE_CLOUD_CLIENT_EMAIL: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        GOOGLE_CLOUD_PRIVATE_KEY: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.substring(0, 10) + '...',
      }
    return NextResponse.json({HELLO: "HELLO WORLD", DEBUG: test})
    
}
