import { auth } from "@clerk/nextjs/server";

export default function WhoAmIPage() {
  const { userId } = auth();

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">Who am I</h1>
      <div className="mt-4 text-sm">Clerk userId: {userId ?? "not signed in"}</div>
    </div>
  );
}