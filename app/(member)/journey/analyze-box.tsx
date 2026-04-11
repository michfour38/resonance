"use client";

import { useState } from "react";
import AnalyzeForm from "./analyze-form";
import {
  requestAnalysisPublicAction,
  withdrawAnalysisPublicRequestAction,
} from "./actions";

type Status = "private" | "requested_public" | "public";

interface AnalyzeBoxProps {
  completionId: string;
  analysisId?: string | null;
  existingAnalysis?: string | null;
  status?: Status | null;
}

export default function AnalyzeBox({
  completionId,
  analysisId,
  existingAnalysis,
  status,
}: AnalyzeBoxProps) {
  const [open, setOpen] = useState(false);

  const hasAnalysis = Boolean(
    existingAnalysis && existingAnalysis.trim().length > 0
  );
  const currentStatus: Status | null = hasAnalysis ? status ?? "private" : null;

  return (
    <div className="space-y-2">
      {!open ? (
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-zinc-500 hover:text-zinc-300 transition"
          >
            Analyze
          </button>

          {/* 🔑 subtle meaning layer */}
          {!hasAnalysis && (
            <span className="text-[11px] text-zinc-600">
              Understand more deeply
            </span>
          )}

          {hasAnalysis && currentStatus === "private" && (
            <>
              <span className="text-zinc-600">Private</span>
              {analysisId && (
                <form action={requestAnalysisPublicAction}>
                  <input type="hidden" name="analysisId" value={analysisId} />
                  <button
                    type="submit"
                    className="text-zinc-500 hover:text-zinc-300 transition"
                  >
                    Request visibility
                  </button>
                </form>
              )}
            </>
          )}

          {hasAnalysis && currentStatus === "requested_public" && (
            <>
              <span className="text-amber-300">Pending</span>
              {analysisId && (
                <form action={withdrawAnalysisPublicRequestAction}>
                  <input type="hidden" name="analysisId" value={analysisId} />
                  <button
                    type="submit"
                    className="text-zinc-500 hover:text-zinc-300 transition"
                  >
                    Withdraw
                  </button>
                </form>
              )}
            </>
          )}

          {hasAnalysis && currentStatus === "public" && (
            <span className="text-amber-300">Visible</span>
          )}
        </div>
      ) : (
        <AnalyzeForm
          completionId={completionId}
          existingContent={existingAnalysis ?? null}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}