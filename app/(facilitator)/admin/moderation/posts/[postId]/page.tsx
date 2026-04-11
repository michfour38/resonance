import { notFound } from "next/navigation";
import { requireAdminPage } from "@/lib/auth/require-admin";
import { getModerationPostDetail } from "@/domains/moderation/moderation.queries";
import {
  reviewReportAction,
  dismissReportAction,
  markActionTakenReportAction,
  removePostAction,
} from "../../actions";

type Props = {
  params: Promise<{ postId: string }>;
};

function fmt(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function ModerationPostDetailPage({ params }: Props) {
  await requireAdminPage();

  const { postId } = await params;
  const post = await getModerationPostDetail(postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <a href="/admin/moderation" className="text-xs text-muted-foreground underline">
          ← Back to queue
        </a>
        <h1 className="text-xl font-semibold mt-2">Review Post</h1>
      </div>

      <div className="border rounded-md p-4 space-y-3">
        <div className="text-sm"><span className="text-muted-foreground">Author:</span> {post.author.label}</div>
        <div className="text-sm"><span className="text-muted-foreground">Circle:</span> {post.circleId}</div>
        <div className="text-sm"><span className="text-muted-foreground">Created:</span> {fmt(post.createdAt)}</div>
        <div className="text-sm"><span className="text-muted-foreground">Updated:</span> {fmt(post.updatedAt)}</div>
        <div className="text-sm"><span className="text-muted-foreground">Deleted:</span> {fmt(post.deletedAt)}</div>
        <div className="text-sm whitespace-pre-wrap border rounded p-3 bg-muted/30">
          {post.content}
        </div>
        <div className="text-xs text-muted-foreground">
          {post.pendingReports} pending • {post.reviewedReports} reviewed • {post.actionTakenReports} action taken • {post.dismissedReports} dismissed
        </div>

        {!post.deletedAt ? (
          <form action={removePostAction}>
            <input type="hidden" name="postId" value={post.postId} />
            <button
              type="submit"
              className="text-sm px-3 py-2 rounded border border-red-200 text-red-700 hover:bg-red-50"
            >
              Remove post
            </button>
          </form>
        ) : (
          <div className="text-sm text-muted-foreground">This post has already been removed.</div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Reports</h2>

        {post.reports.length === 0 ? (
          <div className="text-sm text-muted-foreground">No reports found.</div>
        ) : (
          post.reports.map((report) => (
            <div key={report.id} className="border rounded-md p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium">{report.reason}</div>
                  <div className="text-xs text-muted-foreground">
                    Reporter: {report.reporter.label}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-right">
                  <div>Status: {report.status}</div>
                  <div>Created: {fmt(report.createdAt)}</div>
                  <div>Reviewed: {fmt(report.reviewedAt)}</div>
                  <div>By: {report.reviewedBy?.label ?? "—"}</div>
                </div>
              </div>

              {report.status === "pending" && (
                <div className="flex flex-wrap gap-2">
                  <form action={reviewReportAction}>
                    <input type="hidden" name="reportId" value={report.id} />
                    <button type="submit" className="text-xs px-2 py-1 rounded border hover:bg-muted">
                      Mark reviewed
                    </button>
                  </form>

                  <form action={dismissReportAction}>
                    <input type="hidden" name="reportId" value={report.id} />
                    <button type="submit" className="text-xs px-2 py-1 rounded border hover:bg-muted">
                      Dismiss
                    </button>
                  </form>

                  <form action={markActionTakenReportAction}>
                    <input type="hidden" name="reportId" value={report.id} />
                    <button type="submit" className="text-xs px-2 py-1 rounded border hover:bg-muted">
                      Mark action taken
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}