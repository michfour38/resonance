import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

const ALLOWED_SCOPES = ["private", "shared", "pause", "system"] as const

export async function POST(request: Request) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const cycleId = body.cycleId
    const scope = body.scope
    const content = typeof body.content === "string" ? body.content.trim() : ""

    if (!cycleId || !scope || !content) {
      return NextResponse.json(
        { error: "Missing cycleId, scope, or content" },
        { status: 400 },
      )
    }

    if (!ALLOWED_SCOPES.includes(scope as any)) {
      return NextResponse.json({ error: "Invalid scope" }, { status: 400 })
    }

    const cycle = await prisma.harmonize_cycles.findUnique({
      where: { id: cycleId },
      include: {
        systems: {
          include: {
            participants: true,
          },
        },
      },
    })

    if (!cycle) {
      return NextResponse.json({ error: "Cycle not found" }, { status: 404 })
    }

    const participant = cycle.systems.participants.find(
      (p) => p.profile_id === userId && p.active,
    )

    if (!participant) {
      return NextResponse.json(
        { error: "You are not a participant in this cycle" },
        { status: 403 },
      )
    }

    const entry = await prisma.harmonize_entries.create({
      data: {
        cycle_id: cycleId,
        participant_id: participant.id,
        scope,
        content,
      },
    })

    return NextResponse.json({
      success: true,
      entry,
    })
  } catch (error) {
    console.error("POST /api/harmonize/entry failed:", error)

    return NextResponse.json(
      { success: false, error: "Failed to save Harmonize entry" },
      { status: 500 },
    )
  }
}