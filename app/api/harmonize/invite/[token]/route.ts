import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Invite token endpoint not implemented yet.",
    },
    { status: 501 },
  )
}