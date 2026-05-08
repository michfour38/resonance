"use client";

import { useMemo, useState } from "react";

type EntryType = "female" | "male" | "neutral";

type Question = {
  key: string;
  text: string;
};

const QUESTIONS: Record<EntryType, Question[]> = {
  female: [
    {
      key: "past_connections_common",
      text: "What do your past connections have in common — before things go wrong?",
    },
    {
      key: "early_ignored_signal",
      text: "What did you feel early… that you later ignored?",
    },
    {
      key: "fastest_pull",
      text: "What kind of energy pulls you in fastest?",
    },
    {
      key: "adjusting_point",
      text: "At what point do you start adjusting to keep the connection?",
    },
    {
      key: "protecting_from_feeling",
      text: "What are you trying not to feel?",
    },
  ],
  male: [
    {
      key: "initial_attraction",
      text: "What initially attracts you — looks, energy, attention, ease?",
    },
    {
      key: "interest_shift",
      text: "When do you start losing interest?",
    },
    {
      key: "pressure_point",
      text: "What makes you feel pressured, even if nothing is said?",
    },
    {
      key: "avoided_conversation",
      text: "What do you know you should say… but don’t?",
    },
    {
      key: "pulling_back",
      text: "What are you actually avoiding by not showing up fully?",
    },
  ],
  neutral: [
    {
      key: "beneath_surface",
      text: "What do your past connections have in common — beneath the surface?",
    },
    {
      key: "early_notice",
      text: "What do you notice… but don’t act on?",
    },
    {
      key: "override",
      text: "What do you tend to override early?",
    },
    {
      key: "role_in_connection",
      text: "What role do you tend to take in connection?",
    },
    {
      key: "clarity_vs_connection",
      text: "Where do you prioritise connection over clarity?",
    },
  ],
};

type MirrorOutput = {
  output: {
    output: string;
  };
};

export default function EntryMirrorPage() {
  const [entryType, setEntryType] = useState<EntryType>("neutral");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [mirrorOutput, setMirrorOutput] = useState("");
  const [error, setError] = useState("");

  const questions = useMemo(() => QUESTIONS[entryType], [entryType]);
  const currentQuestion = questions[currentIndex];

  const canContinue =
    firstName.trim().length > 0 &&
    email.trim().includes("@") &&
    answers[currentQuestion.key]?.trim().length >= 8;

  async function handleNext() {
    setError("");

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((value) => value + 1);
      return;
    }

    await submitAndGenerate();
  }

  async function submitAndGenerate() {
    try {
      setIsGenerating(true);
      setError("");

      const formattedAnswers = questions.map((question) => ({
        questionKey: question.key,
        response: answers[question.key] ?? "",
      }));

      const sessionRes = await fetch("/api/entry-mirror/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          email,
          entryType,
          source: "entry-mirror-page",
          answers: formattedAnswers,
        }),
      });

      const sessionData = await sessionRes.json();

      if (!sessionRes.ok || !sessionData?.session?.id) {
        throw new Error(sessionData?.error || "Could not save reflection.");
      }

      const generateRes = await fetch("/api/entry-mirror/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: sessionData.session.id,
        }),
      });

      const generateData = (await generateRes.json()) as MirrorOutput;

      if (!generateRes.ok || !generateData?.output?.output) {
        throw new Error(
          "Your reflection was saved, but the Mirror could not be generated."
        );
      }

      setMirrorOutput(generateData.output.output);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function updateAnswer(value: string) {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.key]: value,
    }));
  }

  if (mirrorOutput) {
    return (
      <main className="min-h-screen bg-[#0A0A0A] px-6 py-12 text-[#EAEAEA]">
        <section className="mx-auto max-w-3xl">
          <p className="mb-16 text-sm tracking-[0.35em] text-[#BFBFBF]">
            BY OREMEA
          </p>

          <h1 className="mb-10 font-serif text-4xl leading-tight md:text-6xl">
            Your Entry Mirror
          </h1>

          <div className="whitespace-pre-wrap rounded-3xl border border-[#2A2418] bg-[#11100D] p-6 font-serif text-2xl leading-relaxed text-[#D8D0C0] md:p-10">
            {mirrorOutput}
          </div>

          <div className="mt-12 rounded-3xl border border-[#3A2F1C] bg-[#14110B] p-6 md:p-8">
            <p className="font-serif text-3xl text-[#EAEAEA]">
              If this felt accurate, you’re not at the surface.
            </p>

            <div className="mt-8 space-y-4 font-serif text-2xl text-[#BFBFBF]">
              <p>Resonance</p>
              <p>Resonance + Mirror</p>
            </div>

            <p className="mt-8 text-sm tracking-[0.25em] text-[#C6A96B]">
              ADD YOUR LIVE LINK HERE
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-12 text-[#EAEAEA]">
      <section className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl flex-col justify-center">
        <p className="mb-14 text-sm tracking-[0.35em] text-[#BFBFBF]">
          BY OREMEA
        </p>

        <div className="mb-12">
          <p className="mb-4 font-serif text-2xl text-[#BFBFBF]">
            Choose your entry reflection
          </p>

          <div className="grid gap-3 md:grid-cols-3">
            {(["female", "male", "neutral"] as EntryType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setEntryType(type);
                  setCurrentIndex(0);
                  setAnswers({});
                  setMirrorOutput("");
                  setError("");
                }}
                className={`rounded-2xl border px-5 py-4 text-left font-serif text-xl capitalize transition ${
                  entryType === type
                    ? "border-[#C6A96B] bg-[#171208] text-[#EAEAEA]"
                    : "border-[#2A2418] bg-[#11100D] text-[#BFBFBF] hover:border-[#A88A4A]"
                }`}
              >
                {type === "female"
                  ? "Women"
                  : type === "male"
                    ? "Men"
                    : "Neutral"}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12 grid gap-4 md:grid-cols-2">
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First name"
            className="rounded-2xl border border-[#2A2418] bg-[#11100D] px-5 py-4 font-serif text-xl text-[#EAEAEA] outline-none placeholder:text-[#777] focus:border-[#C6A96B]"
          />

          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            type="email"
            className="rounded-2xl border border-[#2A2418] bg-[#11100D] px-5 py-4 font-serif text-xl text-[#EAEAEA] outline-none placeholder:text-[#777] focus:border-[#C6A96B]"
          />
        </div>

        <div className="rounded-3xl border border-[#2A2418] bg-[#11100D] p-6 md:p-10">
          <p className="mb-10 text-sm tracking-[0.25em] text-[#C6A96B]">
            QUESTION {currentIndex + 1} / {questions.length}
          </p>

          <h1 className="mb-10 font-serif text-4xl leading-tight md:text-6xl">
            {currentQuestion.text}
          </h1>

          <textarea
            value={answers[currentQuestion.key] ?? ""}
            onChange={(event) => updateAnswer(event.target.value)}
            rows={7}
            placeholder="Write honestly. This is private."
            className="w-full resize-none rounded-2xl border border-[#2A2418] bg-[#0A0A0A] px-5 py-4 font-serif text-2xl leading-relaxed text-[#EAEAEA] outline-none placeholder:text-[#666] focus:border-[#C6A96B]"
          />

          {error ? (
            <p className="mt-6 font-serif text-lg text-red-300">{error}</p>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              disabled={currentIndex === 0 || isGenerating}
              onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
              className="rounded-full border border-[#2A2418] px-6 py-3 font-serif text-lg text-[#BFBFBF] disabled:cursor-not-allowed disabled:opacity-30"
            >
              Back
            </button>

            <button
              type="button"
              disabled={!canContinue || isGenerating}
              onClick={handleNext}
              className="rounded-full bg-[#C6A96B] px-7 py-3 font-serif text-lg text-[#0A0A0A] transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isGenerating
                ? "Listening..."
                : currentIndex === questions.length - 1
                  ? "Generate Mirror"
                  : "Continue"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}