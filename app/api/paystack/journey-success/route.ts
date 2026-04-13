import { NextResponse } from "next/server";

const APP_URL = "https://resonance-production-8b50.up.railway.app";

export async function GET() {
  return NextResponse.redirect(`${APP_URL}/journey?payment=success`);
}