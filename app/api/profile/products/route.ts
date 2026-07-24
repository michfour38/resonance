import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { userId } = auth()
    const user = await currentUser()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const email = user?.primaryEmailAddress?.emailAddress || ""

    const [resonanceEntitlement, recognitionLead, compassSession, harmonizeSystems] =
      await Promise.all([
        prisma.oremea_entitlements.findFirst({
  where: {
    user_id: userId,
    product_key: {
      startsWith: "resonance",
    },
    status: "active",
    revoked_at: null,
    OR: [
      { expires_at: null },
      { expires_at: { gt: new Date() } },
    ],
  },
  orderBy: {
    granted_at: "desc",
  },
  select: {
    product_key: true,
    status: true,
    granted_at: true,
    expires_at: true,
  },
}),

        email
          ? prisma.entry_leads.findUnique({
              where: { email },
              select: {
  entry_paid_at: true,
  intro_completed_at: true,
},
            })
          : null,

        prisma.compass_sessions.findFirst({
          where: { user_id: userId },
          orderBy: { updated_at: "desc" },
        }),

        prisma.harmonize_systems.findMany({
          where: {
            participants: {
              some: {
                profile_id: userId,
                active: true,
              },
            },
          },
          orderBy: { created_at: "desc" },
          include: {
            participants: true,
            cycles: {
              orderBy: { started_at: "desc" },
              take: 1,
            },
          },
        }),
      ])

    return NextResponse.json({
      success: true,
      products: {
        recognition: recognitionLead
          ? {
              active: true,
              status: recognitionLead.intro_completed_at
                ? "completed"
                : "in_progress",
            }
          : null,

        resonance: resonanceEntitlement
  ? {
      active: true,
      status: resonanceEntitlement.status,
      entitlement: resonanceEntitlement,
    }
  : null,

        compass: compassSession
          ? {
              active: true,
              status: compassSession.status,
              phase: compassSession.phase,
            }
          : null,

        harmonize: harmonizeSystems[0]
          ? {
              active: true,
              system: harmonizeSystems[0],
            }
          : null,
      },
    })
  } catch (error) {
    console.error("GET /api/profile/products failed:", error)

    return NextResponse.json(
      { success: false, error: "Failed to load profile products" },
      { status: 500 },
    )
  }
}