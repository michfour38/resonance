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

// ─── Intelligence UI components ───────────────────────────────────────────────

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
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
          Moderation signal
        </span>
        <span className="text-xs text-zinc-400">· {confidenceLabel}</span>
      </div>
      <p className="text-zinc-600 leading-snug">{intelligence.reasoning}</p>
      {intelligence.patternNote && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 leading-snug">
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

// ─── Decision display (reviewed / actioned reports) ───────────────────────────

function DecisionDisplay({ notes }: { notes: string | null }) {
  const { reason, freeText } = parseDecisionNote(notes);
  if (!reason) return null;

  return (
    <div className="text-sm space-y-1">
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

// ─── Reason option labels ─────────────────────────────────────────────────────

function approveLabel(r: (typeof APPROVE_REASONS)[number]): string {
  switch (r) {
    case "NO_VIOLATION":    return "No violation";
    case "CONTEXT_MISSING": return "Context missing";
  }
}

function reviewLabel(r: (typeof REVIEW_REASONS)[number]): string {
  switch (r) {
    case "INCONCLUSIVE":       return "Inconclusive";
    case "NEEDS_MORE_CONTEXT": return "Needs more context";
  }
}

function removeLabel(r: (typeof REMOVE_REASONS)[number]): string {
  switch (r) {
    case "SPAM":       return "Spam";
    case "HARASSMENT": return "Harassment";
    case "HATE":       return "Hate";
    case "SAFETY":     return "Safety concern";
    case "OTHER":      return "Other";
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ModerationReportDetailPage({
  params,
  searchParams,
}: DetailPageProps) {
  const item = await getModerationReportDetail(params.reportId);

  if (!item) {
    notFound();
  }

  const returnStatus = searchParams?.status ?? "PENDING";
  const isPending = item.status === "PENDING" || item.status === "pending";
  const isActioned =
    item.status === "REVIEWED" || item.status === "ACTION_TAKEN";

  // For actioned reports: parse structured decision from notes.
  // Show raw notes only when no structured tag is present (legacy records).
  const { reason: parsedReason } = parseDecisionNote(item.notes);
  const hasStructuredDecision = isActioned && parsedReason !== null;
  const showRawNotes = item.notes && !parsedReason;

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-8">

        {/* BACK LINK */}
        <Link
          href={`/admin/moderation?status=${returnStatus}`}
          className="text-sm text-zinc-500 hover:text-zinc-800 mb-6 inline-block"
        >
          ← Back to queue
        </Link>

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-semibold">Report detail</h1>
          {isPending && item.intelligence && (
            <PriorityBadge tier={item.intelligence.riskTier} />
          )}
        </div>

        {/* REPORT CARD */}
        <div className="border rounded-2xl p-6 space-y-4">

          {/* META */}
          <div className="text-sm text-zinc-500">
            {item.actor.label} · {formatDate(item.createdAt)}
          </div>

          {/* SEVERITY + RISK SCORE */}
          <div className="text-sm">
            <strong>{item.severity ?? "UNKNOWN"}</strong> · Risk {item.riskScore}
          </div>

          {/* REPORT REASON */}
          {item.reason && (
            <div className="text-sm text-zinc-600">
              <span className="font-medium text-zinc-800">Reason: </span>
              {item.reasonSummary}
            </div>
          )}

          {/* CONTENT */}
          <div className="rounded-xl bg-zinc-50 border border-zinc-100 px-4 py-3 text-sm text-zinc-800 leading-relaxed whitespace-pre-wrap">
            {item.content || (
              <span className="text-zinc-400 italic">No content</span>
            )}
          </div>

          {/* MODERATION SIGNAL — pending only */}
          {isPending && item.intelligence && (
            <ModerationSignalPanel intelligence={item.intelligence} />
          )}

          {/* STRUCTURED DECISION — reviewed / actioned reports with a tag */}
          {hasStructuredDecision && (
            <DecisionDisplay notes={item.notes} />
          )}

          {/* LEGACY RAW NOTES — actioned reports without a structured tag */}
          {showRawNotes && (
            <div className="text-sm text-zinc-600">
              <span className="font-medium text-zinc-800">Notes: </span>
              {item.notes}
            </div>
          )}

          {/* REVIEWER */}
          {item.reviewer && (
            <div className="text-sm text-zinc-500">
              Reviewed by {item.reviewer.label}
              {item.reviewedAt ? ` · ${formatDate(item.reviewedAt)}` : ""}
            </div>
          )}

          {/* CATEGORIES */}
          {item.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.categories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* DECISION REASON + ACTIONS — pending only */}
        {isPending && (
          <div className="mt-6 space-y-4">

            {/* Reason selector */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-4 space-y-3">
              <p className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
                Decision reason
              </p>

              {/*
                The select and textarea below use form="approve-form" so they
                belong to the Approve form by default. A small inline script
                mirrors their values into hidden inputs on the other two forms
                before submission, so all three actions receive the reason.
              */}
              <select
                name="decisionReason"
                id="decision-reason-select"
                form="approve-form"
                defaultValue=""
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800"
              >
                <option value="" disabled>Select a reason…</option>
                <optgroup label="Approve">
                  {APPROVE_REASONS.map((r) => (
                    <option key={r} value={r}>{approveLabel(r)}</option>
                  ))}
                </optgroup>
                <optgroup label="Mark reviewed">
                  {REVIEW_REASONS.map((r) => (
                    <option key={r} value={r}>{reviewLabel(r)}</option>
                  ))}
                </optgroup>
                <optgroup label="Remove">
                  {REMOVE_REASONS.map((r) => (
                    <option key={r} value={r}>{removeLabel(r)}</option>
                  ))}
                </optgroup>
              </select>

              <textarea
                name="decisionFreeText"
                id="decision-freetext"
                form="approve-form"
                placeholder="Optional note…"
                rows={2}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 resize-none placeholder:text-zinc-400"
              />

              <p className="text-xs text-zinc-400">
                Reason applies to whichever action you press below.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap">

              {/* Approve — owns the shared select/textarea via id="approve-form" */}
              <form id="approve-form" action={approveReportAction}>
                <input type="hidden" name="reportId" value={item.reportId} />
                <input type="hidden" name="redirectStatus" value={returnStatus} />
                <button className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm">
                  Approve
                </button>
              </form>

              {/* Mark Reviewed */}
              <form id="review-form" action={markReviewedAction}>
                <input type="hidden" name="reportId" value={item.reportId} />
                <input type="hidden" name="redirectStatus" value={returnStatus} />
                <input type="hidden" name="decisionReason" id="review-reason-hidden" value="" />
                <input type="hidden" name="decisionFreeText" id="review-freetext-hidden" value="" />
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-xl text-sm">
                  Mark Reviewed
                </button>
              </form>

              {/* Remove */}
              <form id="remove-form" action={removePostAction}>
                <input type="hidden" name="reportId" value={item.reportId} />
                <input type="hidden" name="postId" value={item.postId} />
                <input type="hidden" name="redirectStatus" value={returnStatus} />
                <input type="hidden" name="decisionReason" id="remove-reason-hidden" value="" />
                <input type="hidden" name="decisionFreeText" id="remove-freetext-hidden" value="" />
                <button className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm">
                  Remove post
                </button>
              </form>

            </div>

            {/*
              Mirror script: copies the shared select/textarea values into the
              hidden inputs on the review and remove forms before any form
              submits. Progressive enhancement — actions still work without JS
              (reason will be empty string, resolveAdminNotes returns null,
              admin_notes is not written, which is acceptable).
            */}
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

        {/* ALREADY ACTIONED */}
        {!isPending && (
          <p className="mt-6 text-sm text-zinc-400">
            This report has been{" "}
            {item.status.toLowerCase().replace("_", " ")}.
            No further actions are available.
          </p>
        )}

      </div>
    </main>
  );
}
