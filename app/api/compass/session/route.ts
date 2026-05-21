import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
  getActiveCompassSession,
  saveCompassSession,
} from "@/src/lib/compass/session/session-persistence";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { session: null },
        { status: 401 },
      );
    }

    const session = await getActiveCompassSession(userId);

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("GET /api/compass/session failed:", error);

    return NextResponse.json(
      {
        success: false,
        session: null,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const session = await saveCompassSession({
      userId,
      phase: body.phase,
      selectedArea: body.selectedArea,
      areaResponses: body.areaResponses,
      recursiveLayers: body.recursiveLayers,
      resistanceMap: body.resistanceMap,
      discussionMessages: body.discussionMessages,
      proposedStep: body.proposedStep,
      finalStep: body.finalStep,
    });

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("POST /api/compass/session failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to save Compass session",
      },
      { status: 500 },
    );
  }
}