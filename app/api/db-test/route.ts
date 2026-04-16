import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const weeks = await prisma.journey_weeks.count();
    const days = await prisma.journey_days.count();
    const prompts = await prisma.day_prompts.count();

    return NextResponse.json({
      ok: true,
      weeks,
      days,
      prompts,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        message: error?.message ?? "Unknown error",
        stack: error?.stack ?? null,
        name: error?.name ?? null,
      },
      { status: 500 }
    );
  }
}