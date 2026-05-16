import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateEntryMirror } from "../../../../src/lib/mirror/entry-mirror.service";
import { sendRecognitionEmail } from "../../../../src/lib/email/send-recognition-email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = body?.sessionId;
    const regenerate = Boolean(body?.regenerate);

    if (!sessionId || typeof sessionId !== "string") {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const output = await generateEntryMirror({
      sessionId,
      regenerate,
    });

    if (!output) {
      return NextResponse.json(
        { error: "Entry Mirror could not be generated" },
        { status: 500 }
      );
    }

    const session = await prisma.entry_mirror_sessions.findUnique({
      where: { id: sessionId },
      select: {
        entry_leads: {
          select: {
            email: true,
            first_name: true,
          },
        },
      },
    });

    const email = session?.entry_leads?.email;
    const firstName = session?.entry_leads?.first_name ?? undefined;

    if (email) {
      await sendRecognitionEmail({
  to: email,
  firstName,
  mirrorOutput: output.output,
  sessionId,
});
    }

    return NextResponse.json({ output });
  } catch (error) {
    console.error("Entry Mirror generate route failed:", error);

    return NextResponse.json(
      { error: "Entry Mirror generate route failed" },
      { status: 500 }
    );
  }
}