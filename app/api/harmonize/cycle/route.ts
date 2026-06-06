import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const systemId = body.systemId

    if (!systemId) {
      return NextResponse.json({ error: "Missing systemId" }, { status: 400 })
    }

    const participant = await prisma.harmonize_participants.findFirst({
      where: {
        system_id: systemId,
        profile_id: userId,
        active: true,
      },
    })

    if (!participant) {
      return NextResponse.json(
        { error: "You are not a participant in this system" },
        { status: 403 },
      )
    }

    const cycle = await prisma.harmonize_cycles.create({
      data: {
        system_id: systemId,
        status: "active",
        title: "First Harmonize Cycle",
      },
    })

    return NextResponse.json({
      success: true,
      cycle,
    })
  } catch (error) {
    console.error("POST /api/harmonize/cycle failed:", error)

    return NextResponse.json(
      { success: false, error: "Failed to create Harmonize cycle" },
      { status: 500 },
    )
  }
}