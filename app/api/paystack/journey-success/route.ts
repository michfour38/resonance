import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in?payment=success", request.url));
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

    return NextResponse.redirect(new URL("/journey?payment=success", request.url));
  } catch (error) {
    console.error("Journey success route failed:", error);
    return NextResponse.redirect(new URL("/journey/unlock?payment=error", request.url));
  }
}