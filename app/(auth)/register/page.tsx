"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="mb-1 text-lg font-medium text-stone-800">
          Begin your journey
        </h2>
        <p className="text-sm text-stone-500">
          Create your account to get started.
        </p>
      </div>

      <div className="flex justify-center">
        <SignUp
          routing="path"
          path="/register"
          signInUrl="/login"
          forceRedirectUrl="/onboarding/welcome"
        />
      </div>

      <p className="mt-4 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-[#2D4A3E] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}