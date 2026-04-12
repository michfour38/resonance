"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-stone-800">Sign in</h1>
        <p className="mt-1 text-sm text-stone-500">
          Continue into Resonance
        </p>
      </div>

      <div className="flex justify-center">
        <SignIn
          routing="path"
          path="/login"
          signUpUrl="/register"
          forceRedirectUrl="/dashboard"
        />
      </div>

      <p className="mt-4 text-center text-sm text-stone-500">
        No account?{" "}
        <Link href="/register" className="font-medium text-[#2D4A3E] hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}