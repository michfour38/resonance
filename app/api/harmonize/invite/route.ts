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
    const invites = Array.isArray(body.invites) ? body.invites : []

    if (!systemId) {
      return NextResponse.json({ error: "Missing systemId" }, { status: 400 })
    }

    const system = await prisma.harmonize_systems.findFirst({
      where: {
        id: systemId,
        owner_profile_id: userId,
      },
    })

    if (!system) {
      return NextResponse.json(
        { error: "Container not found or access denied" },
        { status: 404 },
      )
    }

    const cleanedInvites = invites
      .map((invite: any) => ({
        email: String(invite.email || "").trim().toLowerCase(),
        relationship_context:
          typeof invite.relationshipContext === "string"
            ? invite.relationshipContext.trim()
            : null,
      }))
      .filter((invite: any) => invite.email && invite.email.includes("@"))

    if (!cleanedInvites.length) {
      return NextResponse.json(
        { error: "No valid invite emails provided" },
        { status: 400 },
      )
    }

    await prisma.harmonize_invites.createMany({
      data: cleanedInvites.map((invite: any) => ({
        system_id: systemId,
        email: invite.email,
        relationship_context: invite.relationship_context || null,
      })),
    })

    return NextResponse.json({
      success: true,
      invites: cleanedInvites,
    })
  } catch (error) {
    console.error("POST /api/harmonize/invite failed:", error)

    return NextResponse.json(
      { success: false, error: "Failed to create invites" },
      { status: 500 },
    )
  }
}