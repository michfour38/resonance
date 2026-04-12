import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Stripe billing is disabled in this build. Use Paystack flow instead.",
    },
    { status: 501 }
  );
}