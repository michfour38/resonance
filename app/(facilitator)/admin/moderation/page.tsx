import Link from "next/link";
import {
  approveReportAction,
  markReviewedAction,
  removePostAction,
  APPROVE_REASONS,
  REVIEW_REASONS,
  REMOVE_REASONS,
  parseDecisionNote,
  decisionReasonLabel,
} from "./actions";
import {
  getModerationQueue,
  type EnrichedModerationQueueItemDTO,
  type ModerationIntelligence,
  type RiskTier,
} from "./moderation.service";

export const dynamic = "force-dynamic";

type ModerationStatus = "PENDING" | "REVIEWED" | "ACTION_TAKEN" | "DISMISSED";

type ModerationPageProps = {
  searchParams?: {
    status?: string;
    q?: string;
    severity?: string;
    flagged?: string;
  };
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function normalizeStatus(value: string | undefined): ModerationStatus {
  switch (value) {
    case "REVIEWED":
      return "REVIEWED";
    case "ACTION_TAKEN":
      return "ACTION_TAKEN";
    case "DISMISSED":
      return "DISMISSED";
    default:
      return "PENDING";
  }
}

function getTabHref(
  status: ModerationStatus,
  params: URLSearchParams
): string {
  params.set("status", status);
  return `/admin/moderation?${params.toString()}`;
}

function filterItems(items: any[], params: ModerationPageProps["searchParams"]) {
  let result = items;

  // TEXT SEARCH
  if (params?.q) {
    const q = params.q.toLowerCase();

    result = result.filter((item) => {
      return (
        item.content.toLowerCase().includes(q) ||
        item.actor.label.toLowerCase().includes(q) ||
        (item.reason ?? "").toLowerCase().includes(q)
      );
    });
  }

  // SEVERITY
  if (params?.severity && params.severity !== "ALL") {
    result = result.filter((item) => item.severity === params.severity);
  }

  // FLAGGED ONLY
  if (params?.flagged === "true") {
    result = result.filter((item) => item.riskScore > 0);
  }

  return result;
}

// ─── Intelligence UI components ───────────────────────────────────────────────
// Rendered only for PENDING items. Never shown on reviewed / actionTaken / dismissed.

function PriorityBadge({ tier }: { tier: RiskTier }) {
  if (tier === "LOW") return null;

  const styles =
    tier === "HIGH"
      ? "bg-red-50 text-red-600 border border-red-100"
      : "bg-amber-50 text-amber-600 border border-amber-100";

  const label = tier === "HIGH" ? "High priority" : "Needs review";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  );
}

function ModerationSignalPanel({
  intelligence,
}: {
  intelligence: ModerationIntelligence;
}) {
  const confidenceLabel =
    intelligence.confidence === "HIGH"
      ? "strong signal"
      : intelligence.confidence === "MEDIUM"
        ? "moderate signal"
        : "weak signal";

  return (
    <div className="mt-3 rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-3 text-sm space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
          Moderation signal
        </span>
        <span className="text-xs text-zinc-400">· {confidenceLabel}</span>
      </div>

      {/* Reasoning */}
      <p className="text-zinc-600 leading-snug">{intelligence.reasoning}</p>

      {/* Pattern note — only when there is something meaningful to surface */}
      {intelligence.patternNote && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-snug">
          {intelligence.patternNote}
        </p>
      )}

      {/* Score footnote — transparent but not prominent */}
      <p className="text-xs text-zinc-400">
        Risk score: {intelligence.riskScore} ·{" "}
        {intelligence.riskTier.toLowerCase()} priority
      </p>
    </div>
  );
}

// ─── Inline reason selector ───────────────────────────────────────────────────
// One compact dropdown per pending card. Shared across the card's three action
// forms via a per-card mirror script. No textarea — free text is on the detail page.

function reasonOptionLabel(value: string): string {
  switch (value) {
    case "NO_VIOLATION":       return "No violation";
    case "CONTEXT_MISSING":    return "Context missing";
    case "INCONCLUSIVE":       return "Inconclusive";
    case "NEEDS_MORE_CONTEXT": return "Needs more context";
    case "SPAM":               return "Spam";
    case "HARASSMENT":         return "Harassment";
    case "HATE":               return "Hate";
    case "SAFETY":             return "Safety concern";
    case "OTHER":              return "Other";
    default:                   return value;
  }
}

function InlineReasonSelector({ reportId }: { reportId: string }) {
  // Each card uses reportId-scoped element IDs to avoid collisions across cards.
  const selectId  = `rs-${reportId}`;
  const reviewHid = `rr-${reportId}`;
  const removeHid = `ro-${reportId}`;
  // The select belongs to the approve form (id=`af-${reportId}`).
  // The mirror script copies its value into hidden inputs on the other two forms.
  const approveFormId = `af-${reportId}`;

  return (
    <>
      <div className="mt-3 mb-1">
        <select
          id={selectId}
          name="decisionReason"
          form={approveFormId}
          defaultValue=""
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 w-full sm:w-auto"
        >
          <option value="" disabled>Reason (optional)…</option>
          <optgroup label="Approve">
            {APPROVE_REASONS.map((r) => (
              <option key={r} value={r}>{reasonOptionLabel(r)}</option>
            ))}
          </optgroup>
          <optgroup label="Mark reviewed">
            {REVIEW_REASONS.map((r) => (
              <option key={r} value={r}>{reasonOptionLabel(r)}</option>
            ))}
          </optgroup>
          <optgroup label="Remove">
            {REMOVE_REASONS.map((r) => (
              <option key={r} value={r}>{reasonOptionLabel(r)}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Mirror script — scoped to this card's IDs only */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){
  var sel=document.getElementById(${JSON.stringify(selectId)});
  if(!sel)return;
  function sync(){
    var v=sel.value;
    [${JSON.stringify(reviewHid)},${JSON.stringify(removeHid)}].forEach(function(id){
      var el=document.getElementById(id);
      if(el)el.value=v;
    });
  }
  sel.addEventListener('change',sync);
})();`,
        }}
      />
    </>
  );
}

function getCardStyle(tier: RiskTier | null) {
  if (tier === "HIGH") {
    return "border border-red-200 bg-red-50/40";
  }
  if (tier === "MEDIUM") {
    return "border border-amber-200 bg-amber-50/40";
  }
  return "border";
}

// ─── Decision summary ─────────────────────────────────────────────────────────
// Shown on reviewed / action_taken / dismissed cards when a structured decision
// tag exists in admin_notes. Renders nothing for legacy free-text notes.

function DecisionSummary({ notes }: { notes: string | null }) {
  const { reason } = parseDecisionNote(notes);
  if (!reason) return null;

  return (
    <p className="text-xs text-zinc-400 mt-2">
      Decision: {decisionReasonLabel(reason)}
    </p>
  );
}

export default async function ModerationPage({
  searchParams,
}: ModerationPageProps) {
  const queue = await getModerationQueue();
  const activeStatus = normalizeStatus(searchParams?.status);

  const baseItems = {
    PENDING: queue.pending,
    REVIEWED: queue.reviewed,
    ACTION_TAKEN: queue.actionTaken,
    DISMISSED: queue.dismissed,
  };

  const rawItems = baseItems[activeStatus];
  const items = filterItems(rawItems, searchParams);

  // For the PENDING tab, items are EnrichedModerationQueueItemDTO and carry
  // an `intelligence` field. Other tabs return the base DTO without it.
  // We cast here so the render block can access intelligence safely,
  // gated by the activeStatus === "PENDING" check.
  const pendingItems =
    activeStatus === "PENDING"
      ? (items as EnrichedModerationQueueItemDTO[])
      : null;

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* HEADER */}
        <h1 className="text-3xl font-semibold mb-6">Moderation Queue</h1>

        {/* FILTER BAR */}
        <form className="mb-6 flex flex-wrap gap-3">

          {/* SEARCH */}
          <input
            name="q"
            defaultValue={searchParams?.q ?? ""}
            placeholder="Search content, user, reason..."
            className="rounded-xl border px-4 py-2 text-sm"
          />

          {/* SEVERITY */}
          <select
            name="severity"
            defaultValue={searchParams?.severity ?? "ALL"}
            className="rounded-xl border px-3 py-2 text-sm"
          >
            <option value="ALL">All Severity</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          {/* FLAGGED */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="flagged"
              value="true"
              defaultChecked={searchParams?.flagged === "true"}
            />
            Flagged only
          </label>

          {/* KEEP STATUS */}
          <input type="hidden" name="status" value={activeStatus} />

          <button className="rounded-xl bg-zinc-900 px-4 py-2 text-sm text-white">
            Apply
          </button>
        </form>

        {/* TABS */}
        <div className="mb-6 flex gap-3">
          {(["PENDING", "REVIEWED", "ACTION_TAKEN", "DISMISSED"] as const).map(
            (status) => (
              <Link
                key={status}
                href={getTabHref(status, new URLSearchParams(searchParams as any))}
                className={`px-4 py-2 rounded-xl text-sm ${
                  activeStatus === status
                    ? "bg-black text-white"
                    : "bg-zinc-100"
                }`}
              >
                {status}
              </Link>
            )
          )}
        </div>

        {/* LIST */}
        {items.length === 0 ? (
          <p className="text-sm text-zinc-500">No results found.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.reportId}
                className={`rounded-2xl p-4 ${
                  pendingItems
                    ? getCardStyle(pendingItems[index].intelligence.riskTier)
                    : "border"
                }`}
              >

                {/* Row header: actor, date, and priority badge for pending */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-zinc-500">
                    {item.actor.label} • {formatDate(item.createdAt)}
                  </span>
                  {pendingItems && (
                    <PriorityBadge tier={pendingItems[index].intelligence.riskTier} />
                  )}
                </div>

                <div className="mb-2 text-sm">
                  <strong>{item.severity ?? "UNKNOWN"}</strong> • Risk {item.riskScore}
                </div>

                <p className="text-sm mb-3">{item.content}</p>

                {/* Decision summary — non-pending cards only, when structured tag exists */}
                {!pendingItems && (
                  <DecisionSummary notes={item.notes} />
                )}

                {/* Moderation signal panel — pending only, above action buttons */}
                {pendingItems && (
                  <ModerationSignalPanel
                    intelligence={pendingItems[index].intelligence}
                  />
                )}

                {/* Inline reason selector — pending only, between signal panel and buttons */}
                {pendingItems && (
                  <InlineReasonSelector reportId={item.reportId} />
                )}

                <div className="flex gap-2 flex-wrap mt-3">

                  <Link
                    href={`/admin/moderation/${item.reportId}?status=${activeStatus}`}
                    className="bg-black text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Review
                  </Link>

                  {activeStatus === "PENDING" && (
                    <>
                      {/* Approve — owns the shared select via id=`af-${reportId}` */}
                      <form id={`af-${item.reportId}`} action={approveReportAction}>
                        <input type="hidden" name="reportId" value={item.reportId} />
                        <input type="hidden" name="redirectStatus" value={activeStatus} />
                        <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                          Approve
                        </button>
                      </form>

                      {/* Mark Reviewed — receives mirrored reason via hidden input */}
                      <form action={markReviewedAction}>
                        <input type="hidden" name="reportId" value={item.reportId} />
                        <input type="hidden" name="redirectStatus" value={activeStatus} />
                        <input type="hidden" name="decisionReason" id={`rr-${item.reportId}`} value="" />
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm">
                          Mark Reviewed
                        </button>
                      </form>

                      {/* Remove — receives mirrored reason via hidden input */}
                      <form action={removePostAction}>
                        <input type="hidden" name="reportId" value={item.reportId} />
                        <input type="hidden" name="postId" value={item.postId} />
                        <input type="hidden" name="redirectStatus" value={activeStatus} />
                        <input type="hidden" name="decisionReason" id={`ro-${item.reportId}`} value="" />
                        <button className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
                          Remove
                        </button>
                      </form>
                    </>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}