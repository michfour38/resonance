import Link from "next/link";
import { notFound } from "next/navigation";
import {
  approveReportAction,
  markReviewedAction,
  removePostAction,
  parseDecisionNote,
  decisionReasonLabel,
  APPROVE_REASONS,
  REVIEW_REASONS,
  REMOVE_REASONS,
} from "../actions";
import {
  getModerationReportDetail,
  type ModerationIntelligence,
  type RiskTier,
} from "../moderation.service";

export const dynamic = "force-dynamic";

type DetailPageProps = {
  params: { reportId: string };
  searchParams?: { status?: string };
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function PriorityBadge({ tier }: { tier: RiskTier }) {
  if (tier === "LOW") return null;

  const styles =
    tier === "HIGH"
      ? "border border-red-100 bg-red-50 text-red-600"
      : "border border-amber-100 bg-amber-50 text-amber-600";

  const label = tier === "HIGH" ? "High priority" : "Needs review";

  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${styles}`}
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
    <div className="mt-3 space-y-2 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          Moderation signal
        </span>
        <span className="text-xs text-zinc-400">· {confidenceLabel}</span>
      </div>
      <p className="leading-snug text-zinc-600">{intelligence.reasoning}</p>
      {intelligence.patternNote && (
        <p className="rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs leading-snug text-amber-700">
          {intelligence.patternNote}
        </p>
      )}
      <p className="text-xs text-zinc-400">
        Risk score: {intelligence.riskScore} ·{" "}
        {intelligence.riskTier.toLowerCase()} priority
      </p>
    </div>
  );
}

function DecisionDisplay({ notes }: { notes: string | null }) {
  const { reason, freeText } = parseDecisionNote(notes);
  if (!reason) return null;

  return (
    <div className="space-y-1 text-sm">
      <div className="text-zinc-600">
        <span className="font-medium text-zinc-800">Decision: </span>
        {decisionReasonLabel(reason)}
      </div>
      {freeText && (
        <div className="text-zinc-600">
          <span className="font-medium text-zinc-800">Note: </span>
          {freeText}
        </div>
      )}
    </div>
  );
}

function approveLabel(r: (typeof APPROVE_REASONS)[number]): string {
  switch (r) {
    case "NO_VIOLATION":
      return "No violation";
    case "CONTEXT_MISSING":
      return "Context missing";
  }
}

function reviewLabel(r: (typeof REVIEW_REASONS)[number]): string {
  switch (r) {
    case "INCONCLUSIVE":
      return "Inconclusive";
    case "NEEDS_MORE_CONTEXT":
      return "Needs more context";
  }
}

function removeLabel(r: (typeof REMOVE_REASONS)[number]): string {
  switch (r) {
    case "SPAM":
      return "Spam";
    case "HARASSMENT":
      return "Harassment";
    case "HATE":
      return "Hate";
    case "SAFETY":
      return "Safety concern";
    case "OTHER":
      return "Other";
  }
}

export default async function ModerationReportDetailPage({
  params,
  searchParams,
}: DetailPageProps) {
  const item = await getModerationReportDetail(params.reportId);

  if (!item) {
    notFound();
  }

  const returnStatus = searchParams?.status ?? "PENDING";
  const isPending = item.status === "PENDING";
  const isActioned =
    item.status === "REVIEWED" || item.status === "ACTION_TAKEN";

  const { reason: parsedReason } = parseDecisionNote(item.notes);
  const hasStructuredDecision = isActioned && parsedReason !== null;
  const showRawNotes = item.notes && !parsedReason;

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Link
          href={`/admin/moderation?status=${returnStatus}`}
          className="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-800"
        >
          ← Back to queue
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-2xl font-semibold">Report detail</h1>
          {isPending && item.intelligence && (
            <PriorityBadge tier={item.intelligence.riskTier} />
          )}
        </div>

        <div className="space-y-4 rounded-2xl border p-6">
          <div className="text-sm text-zinc-500">
            {item.actor.label} · {formatDate(item.createdAt)}
          </div>

          <div className="text-sm">
            <strong>{item.severity ?? "UNKNOWN"}</strong> · Risk {item.riskScore}
          </div>

          {item.reason && (
            <div className="text-sm text-zinc-600">
              <span className="font-medium text-zinc-800">Reason: </span>
              {item.reasonSummary}
            </div>
          )}

          <div className="whitespace-pre-wrap rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm leading-relaxed text-zinc-800">
            {item.content || (
              <span className="italic text-zinc-400">No content</span>
            )}
          </div>

          {isPending && item.intelligence && (
            <ModerationSignalPanel intelligence={item.intelligence} />
          )}

          {hasStructuredDecision && <DecisionDisplay notes={item.notes} />}

          {showRawNotes && (
            <div className="text-sm text-zinc-600">
              <span className="font-medium text-zinc-800">Notes: </span>
              {item.notes}
            </div>
          )}

          {item.reviewer && (
            <div className="text-sm text-zinc-500">
              Reviewed by {item.reviewer.label}
              {item.reviewedAt ? ` · ${formatDate(item.reviewedAt)}` : ""}
            </div>
          )}

          {item.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>

        {isPending && (
          <div className="mt-6 space-y-4">
            <div className="space-y-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Decision reason
              </p>

              <select
                name="decisionReason"
                id="decision-reason-select"
                form="approve-form"
                defaultValue=""
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800"
              >
                <option value="" disabled>
                  Select a reason…
                </option>
                <optgroup label="Approve">
                  {APPROVE_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {approveLabel(r)}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Mark reviewed">
                  {REVIEW_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {reviewLabel(r)}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Remove">
                  {REMOVE_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {removeLabel(r)}
                    </option>
                  ))}
                </optgroup>
              </select>

              <textarea
                name="decisionFreeText"
                id="decision-freetext"
                form="approve-form"
                placeholder="Optional note…"
                rows={2}
                className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400"
              />

              <p className="text-xs text-zinc-400">
                Reason applies to whichever action you press below.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <form id="approve-form" action={approveReportAction}>
                <input type="hidden" name="reportId" value={item.reportId} />
                <input
                  type="hidden"
                  name="redirectStatus"
                  value={returnStatus}
                />
                <button className="rounded-xl bg-green-600 px-4 py-2 text-sm text-white">
                  Approve
                </button>
              </form>

              <form id="review-form" action={markReviewedAction}>
                <input type="hidden" name="reportId" value={item.reportId} />
                <input
                  type="hidden"
                  name="redirectStatus"
                  value={returnStatus}
                />
                <input
                  type="hidden"
                  name="decisionReason"
                  id="review-reason-hidden"
                  value=""
                />
                <input
                  type="hidden"
                  name="decisionFreeText"
                  id="review-freetext-hidden"
                  value=""
                />
                <button className="rounded-xl bg-yellow-500 px-4 py-2 text-sm text-white">
                  Mark Reviewed
                </button>
              </form>

              <form id="remove-form" action={removePostAction}>
                <input type="hidden" name="reportId" value={item.reportId} />
                <input type="hidden" name="postId" value={item.postId} />
                <input
                  type="hidden"
                  name="redirectStatus"
                  value={returnStatus}
                />
                <input
                  type="hidden"
                  name="decisionReason"
                  id="remove-reason-hidden"
                  value=""
                />
                <input
                  type="hidden"
                  name="decisionFreeText"
                  id="remove-freetext-hidden"
                  value=""
                />
                <button className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white">
                  Remove post
                </button>
              </form>
            </div>

            <script
              dangerouslySetInnerHTML={{
                __html: `(function(){
  function sync(){
    var sel=document.getElementById('decision-reason-select');
    var txt=document.getElementById('decision-freetext');
    if(!sel||!txt)return;
    ['review','remove'].forEach(function(p){
      var r=document.getElementById(p+'-reason-hidden');
      var f=document.getElementById(p+'-freetext-hidden');
      if(r)r.value=sel.value;
      if(f)f.value=txt.value;
    });
  }
  document.addEventListener('change',sync);
  document.addEventListener('input',sync);
  ['review-form','remove-form'].forEach(function(id){
    var form=document.getElementById(id);
    if(form)form.addEventListener('submit',function(){sync();});
  });
})();`,
              }}
            />
          </div>
        )}

        {!isPending && (
          <p className="mt-6 text-sm text-zinc-400">
            This report has been {item.status.toLowerCase().replace("_", " ")}.
            No further actions are available.
          </p>
        )}
      </div>
    </main>
  );
}