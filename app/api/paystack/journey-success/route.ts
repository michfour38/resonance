import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const APP_URL = "https://resonance-production-8b50.up.railway.app";

export async function GET(_request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.redirect(`${APP_URL}/sign-in?payment=success`);
    }

    try {
      await prisma.cohort_members.updateMany({
        where: {
          user_id: userId,
          status: {
            in: ["enrolled", "active"],
          },
        },
        data: {
          status: "active",
          activated_at: new Date(),
        },
      });
    } catch (dbError) {
      console.error("Journey success DB update failed:", dbError);
    }

    return NextResponse.redirect(`${APP_URL}/journey?payment=success`);
  } catch (error) {
    console.error("Journey success route failed:", error);
    return NextResponse.redirect(`${APP_URL}/journey/unlock?payment=error`);
  }
}