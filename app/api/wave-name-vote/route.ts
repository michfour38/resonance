import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { saveWaveNameVote } from "@/src/lib/wave/wave-name-vote.service";

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const url = new URL(request.url);
  const cohortId = String(url.searchParams.get("cohortId") ?? "");
  const waveName = String(url.searchParams.get("waveName") ?? "");

  if (!cohortId || !waveName) {
    return NextResponse.redirect(new URL("/journey", request.url));
  }

  await saveWaveNameVote(userId, cohortId, waveName);

  return NextResponse.redirect(new URL("/journey", request.url));
}