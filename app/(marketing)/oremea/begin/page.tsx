"use client";

import { Playfair_Display } from "next/font/google";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { ReactNode } from "react";
import {
  getEntryResumeState,
  syncEntryAccessWindow,
  updateEntryLeadPathway,
  markIntroCompleted,
} from "../enter/actions";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

type PathOption = "discover" | "relate" | null;

type PanelProps = {
  title?: string;
  body?: string;
  children?: ReactNode;
  className?: string;
};

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
    </span>
  );
}

function PanelShell({ title, body, children, className = "" }: PanelProps) {
  return (
    <section
      className={`flex h-[100svh] w-screen shrink-0 items-center justify-center px-6 pb-16 pt-24 text-white md:px-6 md:pb-20 md:pt-28 ${className}`}
    >
      <div
        className="relative z-10 w-full"
        style={{
          width: "min(calc(100svh * 1024 / 1820), 92vw)",
          maxWidth: "620px",
        }}
      >
        {title ? (
          <h1
            className={`${playfair.className} text-[2.45rem] font-semibold leading-[0.94] tracking-tight text-white md:text-5xl`}
          >
            {title}
          </h1>
        ) : null}

        {body ? (
          <p className="mt-4 max-w-[34rem] text-[1.02rem] leading-8 text-zinc-200 md:text-base md:leading-8">
            {body}
          </p>
        ) : null}

        <div className="mt-4">{children}</div>
      </div>
    </section>
  );
}

type PathCardProps = {
  title: string;
  words: string[];
  imageUrl: string;
  selected: boolean;
  onClick: () => void;
};

function PathCard({
  title,
  words,
  imageUrl,
  selected,
  onClick,
}: PathCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative h-[220px] w-full min-w-0 overflow-hidden rounded-[24px] border transition duration-300 md:h-[290px] md:rounded-[30px] ${
        selected
          ? "border-[#C8A96A] shadow-[0_0_28px_rgba(200,169,106,0.28)]"
          : "border-white/18 opacity-85 hover:opacity-100"
      }`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-[1.01]"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div
        className={`absolute inset-0 ${
          selected
            ? "bg-[radial-gradient(circle_at_center,rgba(200,169,106,0.18)_0%,rgba(0,0,0,0.55)_70%)]"
            : "bg-black/50"
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-black/10 to-black/34" />

      <div className="relative z-10 flex h-full flex-col items-center p-4 text-center md:p-6">
        <h2
          className={`${playfair.className} text-center text-[1.65rem] leading-none tracking-tight text-white md:text-[2.2rem]`}
          style={{ textShadow: "0 0 14px rgba(0,0,0,0.22)" }}
        >
          {title}
        </h2>

        <div className="mb-3 mt-auto flex flex-col items-center leading-[1.15] md:mb-4">
          {words.map((word, i) => (
            <span
              key={i}
              className="text-[0.92rem] text-white/92 md:text-[1.06rem]"
            >
              {word}
            </span>
          ))}
        </div>

        <span className="text-center text-[0.64rem] uppercase tracking-[0.24em] text-[#f1dfb4]/88 md:text-[0.74rem]">
          Select
        </span>
      </div>
    </button>
  );
}

export default function OremeaBeginPage() {
  const [index, setIndex] = useState(0);
  const [selectedPath, setSelectedPath] = useState<PathOption>("discover");
  const [reflection, setReflection] = useState("");
const [savedReflection, setSavedReflection] = useState("");
  const [leadEmail, setLeadEmail] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [accessResolved, setAccessResolved] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  const [, startSavingPathway] = useTransition();
  const pathwaySavedRef = useRef<PathOption>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const email = params.get("email")?.trim().toLowerCase() || "";
    const paymentValue = params.get("payment")?.trim() || "";
    const paymentSuccess = paymentValue.startsWith("success");

    if (email) setLeadEmail(email);

    let cancelled = false;

    function buildEnterHref() {
      const returnParams = new URLSearchParams();
      const name = params.get("name")?.trim() || "";
      const source = params.get("source")?.trim() || "";

      if (name) returnParams.set("name", name);
      if (email) returnParams.set("email", email);
      if (source) returnParams.set("source", source);

      const query = returnParams.toString();
      return query ? `/oremea/enter?${query}` : "/oremea/enter";
    }

    function buildPrewaveHref() {
      const prewaveParams = new URLSearchParams();
      const source = params.get("source")?.trim() || "";

      if (source) prewaveParams.set("source", source);
      if (email) prewaveParams.set("email", email);

      const query = prewaveParams.toString();
      return query ? `/prewave?${query}` : "/prewave";
    }

    function cleanBeginUrl() {
      params.delete("payment");
      const cleaned = params.toString();
      const cleanedUrl = cleaned ? `/oremea/begin?${cleaned}` : "/oremea/begin";
      window.history.replaceState({}, "", cleanedUrl);
    }

    async function resolveAccess() {
      if (paymentSuccess) {
        const access = await syncEntryAccessWindow({
          email: email || undefined,
          paymentSuccess: true,
        });

        if (cancelled) return;

        if (access.hasAccess) {
          setHasAccess(true);
          setAccessResolved(true);
          cleanBeginUrl();
          return;
        }

        setHasAccess(false);
        setAccessResolved(true);
        return;
      }

      const resume = await getEntryResumeState({
        email: email || undefined,
      });

      if (cancelled) return;

      if (resume.destination === "pay") {
        window.location.href = buildEnterHref();
        return;
      }

      if (resume.destination === "prewave") {
        window.location.href = buildPrewaveHref();
        return;
      }

      setHasAccess(true);
      setAccessResolved(true);
    }

    resolveAccess();

    return () => {
      cancelled = true;
    };
  }, []);

  const panel6Title =
    selectedPath === "relate"
      ? "Connection asks for openness."
      : "Depth requires safety.";

  const panel6Lines =
    selectedPath === "relate"
      ? [
          "You’ll be entering a shared Wave.",
          "Others will become part of the journey.",
          "Move honestly, and at your own pace.",
        ]
      : [
          "Keep reflections private.",
          "Open to others only if and when it feels right.",
          "Move at your own pace.",
        ];

  const panel7Body =
    selectedPath === "relate"
      ? "What feels most true in the way you have been relating lately, even if you have not had words for it yet?"
      : "What feels most true about where you are right now, even if you have not had words for it yet?";

  const previewResponse = useMemo(() => {
  const text = savedReflection.trim();

  if (!text) {
    return "Save your reflection first. Then Resonance will reflect back what it is already hearing in your words.";
  }

  const cleanText = text.length > 180 ? `${text.slice(0, 180).trim()}…` : text;

  if (text.length < 25) {
    return `You wrote: “${cleanText}”

Even in a short answer, there is something useful here. Resonance will not force meaning onto it. It will begin by staying close to what you actually gave — the hesitation, the simplicity, or even the uncertainty. Sometimes “I don’t know” is not nothing. It is the first honest place to begin.`;
  }

  if (text.length < 80) {
    return `You wrote: “${cleanText}”

What is already coming through is not a finished answer, but a starting signal. There is something in this reflection that points to where your attention is currently resting. As you continue, Resonance will help you notice whether this becomes a repeating pattern, a protective response, a longing, or something in you beginning to shift.`;
  }

  return `You wrote: “${cleanText}”

What I’m already hearing is that something in this reflection matters enough to be named. There may be a thread here around what you are ready to understand more clearly — not by rushing toward an answer, but by watching what repeats, what softens, and what becomes more honest over time.

This is the beginning point Resonance will carry forward.`;
}, [savedReflection]);

  const canMoveForward = (() => {
    if (index === 4) return selectedPath !== null;
    if (index === 6) return savedReflection.trim().length > 0;
    return index < 7;
  })();

  function goPrev() {
    setIndex((v) => Math.max(0, v - 1));
  }

  function goNext() {
    if (!canMoveForward || isEntering) return;
    setIndex((v) => Math.min(7, v + 1));
  }

  function handlePathSelect(path: Exclude<PathOption, null>) {
    setSelectedPath(path);
    setIndex(5);

    if (!leadEmail) return;
    if (pathwaySavedRef.current === path) return;

    pathwaySavedRef.current = path;

    startSavingPathway(async () => {
      await updateEntryLeadPathway({
        email: leadEmail,
        pathway: path,
      });
    });
  }

function handleSaveBeginReflection() {
  const text = reflection.trim();

  if (!text) return;

  setSavedReflection(text);
  setIndex(7);
}

async function handleEnterResonance() {
  if (!selectedPath || isEntering || !hasAccess) return;

  setIsEntering(true);

  if (leadEmail) {
    await markIntroCompleted({ email: leadEmail });
  }

  const prewaveParams = new URLSearchParams();
  prewaveParams.set("pathway", selectedPath);
  if (leadEmail) prewaveParams.set("email", leadEmail);

  const query = prewaveParams.toString();
  window.location.href = query ? `/prewave?${query}` : "/prewave";
}

  const panels = [
    <PanelShell
      key="p1"
      title="Return to what is already within you."
      body="A guided experience for self-reflection and relational growth."
    />,
    <PanelShell
      key="p2"
      title="Resonance is where it begins."
      body="A guided daily experience that helps you notice what is repeating, what is shifting, and what is trying to emerge in the way you live, relate, and reflect."
    />,
    <PanelShell
      key="p3"
      title="Not advice. Not noise. Not another feed."
      body="Resonance does not tell you who you are. It helps you discover what becomes visible when your reflections are held with structure, continuity, and care."
    />,
    <PanelShell
      key="p4"
      title="The Mirror listens across time."
      body="As your journey unfolds, the Mirror begins to reflect patterns, tensions, and emerging truths that are easy to miss from inside your own life."
    >
      <p className="text-sm italic leading-7 text-zinc-300">
        Some reflections remain free. Deeper insight unlocks as the journey
        evolves.
      </p>
    </PanelShell>,
    <PanelShell key="p5">
      <div className="mx-auto max-w-[320px]">
        <PathCard
          title="Discover"
          words={["Innerstand", "yourself", "deeper"]}
          imageUrl="/images/discover-bg.png"
          selected={selectedPath === "discover"}
          onClick={() => handlePathSelect("discover")}
        />
      </div>
    </PanelShell>,
    <PanelShell key="p6" title={panel6Title}>
      <div className="space-y-3 text-base leading-8 text-zinc-200 md:space-y-4 md:text-lg">
        {panel6Lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </PanelShell>,
    <PanelShell
      key="p7"
      title="Begin with what feels true."
      body={panel7Body}
    >
      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        rows={5}
        className="w-full resize-none rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#c8a96a]/30"
        placeholder="Write what feels true..."
      />
<div className="mt-4 flex justify-end">
  <button
    type="button"
    onClick={handleSaveBeginReflection}
    disabled={!reflection.trim()}
    className={`rounded-xl border px-5 py-3 text-sm transition ${
      savedReflection
        ? "border-[#c8a96a]/60 bg-[#c8a96a]/10 text-[#f1dfb4]"
        : reflection.trim()
          ? "border-[#c8a96a]/60 bg-transparent text-[#f1dfb4] hover:bg-[#c8a96a]/10"
          : "border-white/15 bg-transparent text-white/35"
    }`}
  >
    {savedReflection ? "Reflection saved" : "Save reflection"}
  </button>
</div>
    </PanelShell>,
    <PanelShell key="p8" title="What I’m already hearing">
      <div className="space-y-5">
        <p className="text-base leading-8 text-zinc-200">{previewResponse}</p>

        <button
          type="button"
          onClick={handleEnterResonance}
          disabled={!selectedPath || isEntering || !hasAccess}
          className={`inline-flex min-w-[170px] items-center justify-center rounded-xl border px-5 py-3 text-sm transition ${
            selectedPath && !isEntering && hasAccess
              ? "border-[#c8a96a]/60 bg-transparent text-[#f1dfb4] hover:bg-[#c8a96a]/10"
              : "border-white/15 bg-transparent text-white/35"
          }`}
        >
          {isEntering ? <LoadingDots /> : "Enter Resonance"}
        </button>

        {accessResolved && !hasAccess ? (
          <p className="text-sm leading-7 text-white/60">
            Your payment has returned, but entry access has not attached yet.
            Stay on this page for now — do not repay.
          </p>
        ) : null}
      </div>
    </PanelShell>,
  ];

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
    touchDeltaXRef.current = 0;
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    if (touchStartXRef.current === null) return;
    const currentX = e.touches[0]?.clientX ?? 0;
    touchDeltaXRef.current = currentX - touchStartXRef.current;
  }

  function handleTouchEnd() {
    const delta = touchDeltaXRef.current;

    if (Math.abs(delta) > 50) {
      if (delta < 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
  }

  if (!accessResolved) {
    return (
      <main className="relative h-[100svh] overflow-hidden text-white">
        <div className="fixed inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
            style={{ backgroundImage: "url(/images/mobile/bg-entry.png)" }}
          />
          <div
            className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
            style={{ backgroundImage: "url(/images/desktop/bg-entry.webp)" }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="pointer-events-none fixed left-1/2 top-4 z-20 -translate-x-1/2 text-center md:top-5">
          <div
            className="flex flex-col items-center"
            style={{
              width: "min(calc(100svh * 1024 / 1820), 92vw)",
              maxWidth: "620px",
            }}
          >
            <div className="mb-1.5 flex items-center justify-center gap-4 text-[#C8A96A]">
              <span className="text-xs leading-none md:text-sm">✦</span>
              <span className="text-xs leading-none md:text-sm">✦</span>
              <span className="text-xs leading-none md:text-sm">✦</span>
            </div>

            <h1
              className={`${playfair.className} leading-none tracking-tight`}
              style={{
                fontSize: "clamp(2rem, 4.2vw, 3.9rem)",
                textShadow: "0 0 16px rgba(0,0,0,0.28)",
              }}
            >
              <span className="text-white">Reso</span>
              <span
                className="italic text-[#C8A96A]"
                style={{
                  textShadow: "0 0 8px rgba(200, 169, 106, 0.16)",
                }}
              >
                nance
              </span>
            </h1>

            <p
              className="mt-1.5 uppercase"
              style={{
                fontSize: "clamp(0.52rem, 0.8vw, 0.68rem)",
                letterSpacing: "0.28em",
                color: "rgba(255,255,255,0.62)",
              }}
            >
              by Oremea
            </p>
          </div>
        </div>

        <div className="relative z-10 flex h-[100svh] items-center justify-center px-6">
          <div className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm text-white/70">
            <LoadingDots />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative h-[100svh] overflow-hidden text-white">
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{ backgroundImage: "url(/images/mobile/bg-entry.png)" }}
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
          style={{ backgroundImage: "url(/images/desktop/bg-entry.webp)" }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="pointer-events-none fixed left-1/2 top-4 z-20 -translate-x-1/2 text-center md:top-5">
        <div
          className="flex flex-col items-center"
          style={{
            width: "min(calc(100svh * 1024 / 1820), 92vw)",
            maxWidth: "620px",
          }}
        >
          <div className="mb-1.5 flex items-center justify-center gap-4 text-[#C8A96A]">
            <span className="text-xs leading-none md:text-sm">✦</span>
            <span className="text-xs leading-none md:text-sm">✦</span>
            <span className="text-xs leading-none md:text-sm">✦</span>
          </div>

          <h1
            className={`${playfair.className} leading-none tracking-tight`}
            style={{
              fontSize: "clamp(2rem, 4.2vw, 3.9rem)",
              textShadow: "0 0 16px rgba(0,0,0,0.28)",
            }}
          >
            <span className="text-white">Reso</span>
            <span
              className="italic text-[#C8A96A]"
              style={{
                textShadow: "0 0 8px rgba(200, 169, 106, 0.16)",
              }}
            >
              nance
            </span>
          </h1>

          <p
            className="mt-1.5 uppercase"
            style={{
              fontSize: "clamp(0.52rem, 0.8vw, 0.68rem)",
              letterSpacing: "0.28em",
              color: "rgba(255,255,255,0.62)",
            }}
          >
            by Oremea
          </p>
        </div>
      </div>

      <div
        className="relative z-10 flex h-[100svh] transition-transform duration-500 ease-out"
        style={{
          width: `${panels.length * 100}vw`,
          transform: `translateX(-${index * 100}vw)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {panels}
      </div>

      {index > 0 && (
        <button
          onClick={goPrev}
          className="hidden md:flex fixed left-1/2 top-1/2 z-20 -translate-y-1/2"
          style={{ transform: "translate(calc(-50% - 330px), -50%)" }}
          aria-label="Previous"
        >
          <span className="text-4xl text-white/60 transition hover:text-white">
            ←
          </span>
        </button>
      )}

      {index < panels.length - 1 && (
        <button
          onClick={goNext}
          className="hidden md:flex fixed left-1/2 top-1/2 z-20 -translate-y-1/2"
          style={{ transform: "translate(calc(-50% + 330px), -50%)" }}
          aria-label="Next"
        >
          <span
            className={`text-4xl transition ${
              canMoveForward && !isEntering
                ? "text-white/60 hover:text-white"
                : "text-white/20"
            }`}
          >
            →
          </span>
        </button>
      )}

      <div className="pointer-events-none fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {panels.map((_, i) => (
          <span
            key={i}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === index ? "bg-[#f1dfb4]" : "bg-white/20"
            }`}
          />
        ))}
      </div>
    </main>
  );
}