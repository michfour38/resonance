import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await prisma.profiles.findUnique({
    where: { id: userId },
    select: { onboarding_done: true },
  });

  if (profile?.onboarding_done) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <span className="text-2xl font-semibold tracking-tight text-[#2D4A3E]">
            Resonance
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}