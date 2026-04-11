import { requireAdminPage } from "@/lib/auth/require-admin";
import { getModerationQueue } from "@/domains/moderation/moderation.queries";

type Props = {
  searchParams?: {
    status?: string;
  };
};

export default async function ModerationPage({ searchParams }: Props) {
  await requireAdminPage();

  const items = await getModerationQueue();

  const filter = searchParams?.status ?? "pending";

  const filteredItems = items.filter((item) => {
    if (filter === "pending") return item.pendingReports > 0;
    if (filter === "reviewed") return item.reviewedReports > 0;
    if (filter === "action_taken") return item.actionTakenReports > 0;
    if (filter === "dismissed") return item.dismissedReports > 0;
    return true;
  });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Moderation Queue</h1>
        <p className="text-sm text-muted-foreground">
          Reported posts awaiting review
        </p>
      </div>

      <div className="flex gap-2 text-xs">
        <a href="/moderation" className="px-2 py-1 border rounded">
          Pending
        </a>
        <a href="/moderation?status=reviewed" className="px-2 py-1 border rounded">
          Reviewed
        </a>
        <a href="/moderation?status=action_taken" className="px-2 py-1 border rounded">
          Action taken
        </a>
        <a href="/moderation?status=dismissed" className="px-2 py-1 border rounded">
          Dismissed
        </a>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No reported posts in this view.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const urgencyClass =
              item.pendingReports >= 10
                ? "border-red-300 bg-red-50"
                : item.pendingReports >= 5
                ? "border-amber-300 bg-amber-50"
                : "border rounded-md";

            return (
              <div
                key={item.postId}
                className={`rounded-md p-4 flex items-center justify-between gap-4 ${urgencyClass}`}
              >
                <div>
                  <div className="flex items-center gap-2">
  <div className="font-medium">{item.author.label}</div>

  {item.pendingReports >= 10 && (
    <span className="text-[10px] px-2 py-0.5 rounded bg-red-200 text-red-800">
      HIGH
    </span>
  )}

  {item.pendingReports >= 5 && item.pendingReports < 10 && (
    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-800">
      MEDIUM
    </span>
  )}
</div>
                  <div className="text-sm text-muted-foreground">
                    {item.contentPreview}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="font-semibold text-red-700">
  {item.pendingReports} pending
</span>{" "}
• {item.reviewedReports} reviewed •{" "}
                    {item.actionTakenReports} action • {item.dismissedReports} dismissed
                  </div>
                </div>

                <a
                  href={`/moderation/posts/${item.postId}`}
                  className="text-sm px-3 py-2 rounded border hover:bg-muted"
                >
                  Review
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}