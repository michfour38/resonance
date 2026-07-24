import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  RecognitionType,
  getRecognitionQuestions,
} from "../../../../src/lib/recognition/recognition.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const firstName =
      typeof body?.firstName === "string"
        ? body.firstName.trim()
        : "";

    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const entryType: RecognitionType = "neutral";

    const source =
      typeof body?.source === "string"
        ? body.source.trim()
        : "recognition-page";

    const answers = Array.isArray(body?.answers)
      ? body.answers
      : [];

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    const questions = getRecognitionQuestions(entryType);

    const lead = await prisma.entry_leads.upsert({
      where: {
        email,
      },
      update: {
        first_name: firstName || undefined,
        source,
        intro_started_at: new Date(),
        last_seen_panel_key: "recognition",
        last_seen_panel_at: new Date(),
      },
      create: {
        email,
        first_name: firstName || null,
        source,
        intro_started_at: new Date(),
        last_seen_panel_key: "recognition",
        last_seen_panel_at: new Date(),
      },
      select: {
        id: true,
        email: true,
        first_name: true,
      },
    });

    let session = await prisma.entry_mirror_sessions.findFirst({
      where: {
        lead_id: lead.id,
        entry_type: entryType,
        mirror_generated_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        lead_id: true,
        entry_type: true,
        status: true,
        created_at: true,
      },
    });

    if (!session) {
      session = await prisma.entry_mirror_sessions.create({
        data: {
          lead_id: lead.id,
          entry_type: entryType,
          status: "in_progress",
        },
        select: {
          id: true,
          lead_id: true,
          entry_type: true,
          status: true,
          created_at: true,
        },
      });
    }

    for (const item of answers) {
      if (!item || typeof item !== "object") {
        continue;
      }

      const value = item as {
        questionKey?: unknown;
        response?: unknown;
      };

      const questionKey =
        typeof value.questionKey === "string"
          ? value.questionKey.trim()
          : "";

      const response =
        typeof value.response === "string"
          ? value.response.trim()
          : "";

      if (!questionKey || !response) {
        continue;
      }

      const question = questions.find(
        (q) => q.key === questionKey
      );

      if (!question) {
        continue;
      }

      const responseOrder =
        questions.findIndex(
          (q) => q.key === questionKey
        ) + 1;

      await prisma.entry_mirror_responses.upsert({
        where: {
          session_id_question_key: {
            session_id: session.id,
            question_key: questionKey,
          },
        },
        update: {
          response,
        },
        create: {
          session_id: session.id,
          question_key: questionKey,
          question_text: question.text,
          response,
          response_order: responseOrder,
        },
      });
    }

    return NextResponse.json({
      lead,
      session: {
        id: session.id,
        leadId: session.lead_id,
        entryType: session.entry_type,
        status: session.status,
        createdAt: session.created_at.toISOString(),
      },
    });
  } catch (error) {
    console.error(
      "Recognition progress route failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Recognition progress route failed",
      },
      {
        status: 500,
      }
    );
  }
}