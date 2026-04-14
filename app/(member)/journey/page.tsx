import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type JourneyPageProps = {
  searchParams?: {
    payment?: string;
  };
};

export default async function JourneyPage({
  searchParams,
}: JourneyPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const paymentSuccess = searchParams?.payment === "success";

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl">Journey Active</h1>

      {paymentSuccess && (
        <p className="mt-4 text-green-400">Payment success confirmed</p>
      )}

      <p className="mt-4">Auth is working on Journey again.</p>
      <p className="mt-2 text-sm text-zinc-400">User ID: {userId}</p>
    </main>
  );
}