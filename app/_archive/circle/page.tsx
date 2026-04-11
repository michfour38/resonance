export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ReportPostForm } from "@/components/moderation/ReportPostForm";

type Props = {
  searchParams?: {
    reported?: string;
    alreadyReported?: string;
    rateLimited?: string;
    cannotReportSelf?: string;
  };
};

export default async function CirclePage({ searchParams }: Props) {
  const posts = await prisma.circlePost.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          displayName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-lg font-semibold">Circle Feed</h1>

      {searchParams?.reported === "1" && (
        <div className="text-sm border rounded p-3">
          Report submitted.
        </div>
      )}

      {searchParams?.alreadyReported === "1" && (
        <div className="text-sm border rounded p-3">
          You have already reported this post.
        </div>
      )}

      {searchParams?.rateLimited === "1" && (
        <div className="text-sm border rounded p-3">
          Please wait before submitting another report.
        </div>
      )}

      {searchParams?.cannotReportSelf === "1" && (
        <div className="text-sm border rounded p-3">
          You cannot report your own post.
        </div>
      )}

      {posts.map((post) => (
        <div key={post.id} className="border rounded-md p-4 space-y-2">
          <div className="font-medium">
            {post.user.displayName ?? "User"}
          </div>

          <div className="text-sm text-muted-foreground">
            {post.content}
          </div>

          <ReportPostForm
            reportedUserId={post.user.id}
            reportedPostId={post.id}
          />
        </div>
      ))}
    </div>
  );
}