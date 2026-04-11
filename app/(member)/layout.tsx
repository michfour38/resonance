import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return <div className="min-h-screen text-white">{children}</div>;
}