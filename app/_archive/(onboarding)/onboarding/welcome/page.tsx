"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "name" | "pathway" | "confirm";

type PathwayOption = {
  value: "discover" | "relate" | "harmonize";
  label: string;
  description: string;
};

const PATHWAYS: PathwayOption[] = [
  {
    value: "discover",
    label: "Discover",
    description: "Explore who you are through reflection and inquiry.",
  },
  {
    value: "relate",
    label: "Relate",
    description: "Deepen how you connect and communicate with others.",
  },
  {
    value: "harmonize",
    label: "Harmonize",
    description: "Integrate different parts of yourself and your life.",
  },
];

export default function OnboardingWelcomePage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("name");
  const [displayName, setDisplayName] = useState("");
  const [pathway, setPathway] = useState<PathwayOption["value"] | null>(null);
  const [nameError, setNameError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function submitName(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = displayName.trim();

    if (trimmed.length < 2) {
      setNameError("Please enter at least 2 characters.");
      return;
    }

    if (trimmed.length > 60) {
      setNameError("Name must be 60 characters or fewer.");
      return;
    }

    setDisplayName(trimmed);
    setNameError("");
    setStep("pathway");
  }

  function submitPathway(e: React.FormEvent) {
    e.preventDefault();
    if (!pathway) return;
    setStep("confirm");
  }

  async function submitConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!pathway) return;

    setSubmitError("");
    setIsSaving(true);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: displayName.trim(),
          pathway,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save onboarding");
      }

      router.push("/home");
      router.refresh();
    } catch (error) {
      console.error(error);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
      <div className="flex justify-center gap-2 mb-8">
        {(["name", "pathway", "confirm"] as Step[]).map((s, i) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              s === step
                ? "w-6 bg-[#2D4A3E]"
                : i < ["name", "pathway", "confirm"].indexOf(step)
                ? "w-6 bg-[#4A7C6F]"
                : "w-6 bg-stone-200"
            }`}
          />
        ))}
      </div>

      {step === "name" && (
        <form onSubmit={submitName}>
          <h2 className="text-xl font-semibold text-stone-800 mb-1">
            What should we call you?
          </h2>
          <p className="text-sm text-stone-500 mb-6">
            This is how you'll appear to your circle members.
          </p>

          <input
            autoFocus
            type="text"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              setNameError("");
            }}
            placeholder="Your name"
            maxLength={60}
            className="w-full rounded-lg border border-stone-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D4A3E] focus:border-transparent"
          />

          {nameError && (
            <p className="mt-2 text-sm text-red-600">{nameError}</p>
          )}

          <button
            type="submit"
            className="mt-6 w-full bg-[#2D4A3E] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#4A7C6F] transition-colors"
          >
            Continue
          </button>
        </form>
      )}

      {step === "pathway" && (
        <form onSubmit={submitPathway}>
          <h2 className="text-xl font-semibold text-stone-800 mb-1">
            Choose your pathway
          </h2>
          <p className="text-sm text-stone-500 mb-6">
            This shapes the focus of your 10-week journey. You can't change it
            mid-journey.
          </p>

          <div className="space-y-3">
            {PATHWAYS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPathway(p.value)}
                className={`w-full text-left rounded-xl border px-4 py-4 transition-all ${
                  pathway === p.value
                    ? "border-[#2D4A3E] bg-[#2D4A3E]/5 ring-1 ring-[#2D4A3E]"
                    : "border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      pathway === p.value
                        ? "border-[#2D4A3E] bg-[#2D4A3E]"
                        : "border-stone-300"
                    }`}
                  >
                    {pathway === p.value && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800">
                      {p.label}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {p.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setStep("name")}
              className="flex-1 rounded-lg border border-stone-300 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!pathway}
              className="flex-1 bg-[#2D4A3E] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#4A7C6F] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </form>
      )}

      {step === "confirm" && (
        <form onSubmit={submitConfirm}>
          <h2 className="text-xl font-semibold text-stone-800 mb-1">
            Ready to begin?
          </h2>
          <p className="text-sm text-stone-500 mb-6">
            Here's what you've chosen.
          </p>

          <div className="rounded-xl bg-stone-50 border border-stone-200 divide-y divide-stone-200">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-stone-500 uppercase tracking-wide font-medium">
                Name
              </span>
              <span className="text-sm text-stone-800 font-medium">
                {displayName}
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-stone-500 uppercase tracking-wide font-medium">
                Pathway
              </span>
              <span className="text-sm text-stone-800 font-medium capitalize">
                {pathway}
              </span>
            </div>
          </div>

          {submitError && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {submitError}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setStep("pathway")}
              disabled={isSaving}
              className="flex-1 rounded-lg border border-stone-300 py-2.5 text-sm text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-[#2D4A3E] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#4A7C6F] transition-colors disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Start my journey"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}