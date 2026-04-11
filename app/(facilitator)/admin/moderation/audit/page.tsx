import Link from "next/link";
import {
  getModerationAuditLog,
  type ModerationAuditEntryDTO,
  type ModerationQueueStatus,
} from "../moderation.service";

export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusPill(status: ModerationQueueStatus) {
  const styles: Record<ModerationQueueStatus, string> = {
    ACTION_TAKEN: "bg-red-50 text-red-600 border border-red-100",
    REVIEWED: "bg-zinc-100 text-zinc-600 border border-zinc-200",
    DISMISSED: "bg-zinc-100 text-zinc-500 border border-zinc-200",
    PENDING: "bg-amber-50 text-amber-600 border border-amber-100",
  };

  const labels: Record<ModerationQueueStatus, string> = {
    ACTION_TAKEN: "Removed",
    REVIEWED: "Reviewed",
    DISMISSED: "Dismissed",
    PENDING: "Pending",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function decisionCell(entry: ModerationAuditEntryDTO) {
  if (entry.decisionReasonLabel) {
    return (
      <span className="text-zinc-700">
        {entry.decisionReasonLabel}
        {entry.decisionNote && (
          <span className="text-zinc-400 ml-1">· {entry.decisionNote}</span>
        )}
      </span>
    );
  }

  if (entry.rawNotes) {
    return <span className="text-zinc-400 italic">Legacy note</span>;
  }

  return <span className="text-zinc-300">—</span>;
}

function AuditRow({ entry }: { entry: ModerationAuditEntryDTO }) {
  const detailHref = `/admin/moderation/${entry.reportId}?status=${entry.status}`;

  return (
    <tr className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
      <td className="py-3 px-4 align-top">
        <Link href={detailHref} className="text-sm text-zinc-800 hover:underline">
          {entry.actor.label}
        </Link>
        {entry.postSnippet && (
          <p className="text-xs text-zinc-400 mt-0.5 leading-snug">
            {entry.postSnippet}
          </p>
        )}
        {entry.postDeleted && (
          <span className="text-xs text-zinc-300 mt-0.5 block">Post deleted</span>
        )}
      </td>

      <td className="py-3 px-4 align-top text-sm text-zinc-600 whitespace-nowrap">
        {entry.moderator?.label ?? <span className="text-zinc-300">—</span>}
      </td>

      <td className="py-3 px-4 align-top text-sm">{decisionCell(entry)}</td>

      <td className="py-3 px-4 align-top whitespace-nowrap">
        {statusPill(entry.status)}
      </td>

      <td className="py-3 px-4 align-top text-xs text-zinc-400 whitespace-nowrap">
        {formatDate(entry.reviewedAt)}
      </td>
    </tr>
  );
}

export default async function ModerationAuditPage() {
  const entries = await getModerationAuditLog();

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Moderation audit log</h1>
            <p className="text-sm text-zinc-400 mt-1">
              All actioned reports, newest first. Read-only.
            </p>
          </div>
          <Link
            href="/admin/moderation"
            className="text-sm text-zinc-500 hover:text-zinc-800"
          >
            ← Back to queue
          </Link>
        </div>

        {entries.length === 0 ? (
          <p className="text-sm text-zinc-400">No actioned reports yet.</p>
        ) : (
          <div className="border border-zinc-100 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50">
                  <th className="py-2.5 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    Actor
                  </th>
                  <th className="py-2.5 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    Moderator
                  </th>
                  <th className="py-2.5 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    Decision
                  </th>
                  <th className="py-2.5 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="py-2.5 px-4 text-xs font-medium text-zinc-400 uppercase tracking-wide">
                    When
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <AuditRow key={entry.reportId} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}