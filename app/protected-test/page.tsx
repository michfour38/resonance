import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ProtectedTestPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl">Protected Test</h1>
      <p className="mt-4">User ID: {userId}</p>
    </main>
  );
}