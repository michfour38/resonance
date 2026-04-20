"use client";

import { Playfair_Display } from "next/font/google";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  getEntryResumeState,
  syncEntryAccessWindow,
  updateEntryLeadPathway,
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
  children?: React.ReactNode;
  className?: string;
};

function PanelShell({ title, body, children, className = "" }: PanelProps) {
  return (
    <section
      className={`flex h-screen w-screen shrink-0 items-end justify-center px-6 text-white ${className}`}
    >
      <div
        className="relative z-10 w-full"
        style={{
          width: "min(calc(100vh * 1024 / 1820), 92vw)",
          maxWidth: "620px",
        }}
      >
        {title ? (
          <h1 className="mt-3 text-3xl font-semibold leading-[0.98] tracking-tight text-white md:text-5xl">
            {title}
          </h1>
        ) : null}

        {body ? (
          <p className="mt-4 max-w-[34rem] text-base leading-8 text-zinc-200">
            {body}
          </p>
        ) : null}

        <div className="mt-2">{children}</div>
      </div>
    </section>
  );
}

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
    </span>
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
      className={`group relative h-[290px] w-full min-w-0 overflow-hidden rounded-[30px] border transition duration-300 ${
        selected
          ? "border-[#C8A96A] shadow-[0_0_28px_rgba(200,169,106,0.28)]"
          : "border-white/18 opacity-80 hover:opacity-100"
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

      <div className="relative z-10 flex h-full flex-col items-center p-5 text-center md:p-6">
        <h2
          className={`${playfair.className} text-center text-[1.95rem] leading-none tracking-tight text-white md:text-[2.2rem]`}
          style={{ textShadow: "0 0 14px rgba(0,0,0,0.22)" }}
        >
          {title}
        </h2>

        <div className="mb-4 mt-auto flex flex-col items-center leading-[1.2]">
          {words.map((word, i) => (
            <span
              key={i}
              className="text-[1rem] text-white/92 md:text-[1.06rem]"
            >
              {word}
            </span>
          ))}
        </div>

        <span className="text-center text-[0.74rem] uppercase tracking-[0.24em] text-[#f1dfb4]/88">
          Select
        </span>
      </div>
    </button>
  );
}

export default function OremeaBeginPage() {
  const [index, setIndex] = useState(0);
  const [selectedPath, setSelectedPath] = useState<PathOption>(null);
  const [reflection, setReflection] = useState("");
  const [leadEmail, setLeadEmail] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(false);
  const [accessResolved, setAccessResolved] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  const [isSavingPathway, startSavingPathway] = useTransition();
  const pathwaySavedRef = useRef<PathOption>(null);

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

        // Critical stabilization fix:
        // if payment success is present but access cannot be resolved immediately,
        // stay on /oremea/begin instead of bouncing back into the pay loop.
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
    const text = reflection.trim();

    if (!text) {
      return selectedPath === "relate"
        ? "Something in the way you relate may become clearer as you begin."
        : "Something in you may become clearer as you begin.";
    }

    const isShallow = text.length < 60;

    if (isShallow) {
      return selectedPath === "relate"
        ? "There’s something here worth staying with. As you continue, patterns in how you relate will begin to emerge more clearly."
        : "There’s something here worth staying with. As you continue, what’s true for you will begin to take clearer shape.";
    }

    return selectedPath === "relate"
      ? "Something in the way you relate is already becoming clearer. There is a pattern here worth staying with, not because it is obvious, but because it may reveal how you move toward, away from, or within connection."
      : "Something in you is already becoming clearer. There is a thread here worth staying with, not because it is loud, but because it feels true enough to return to.";
  }, [reflection, selectedPath]);

  const canMoveForward = (() => {
    if (index === 4) return selectedPath !== null;
    if (index === 6) return reflection.trim().length > 0;
    return index < 7;
  })();

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

  function handleEnterResonance() {
    if (!selectedPath || isEntering || !hasAccess) return;

    setIsEntering(true);

    const prewaveParams = new URLSearchParams();
    prewaveParams.set("pathway", selectedPath);
    if (leadEmail) prewaveParams.set("email", leadEmail);

    const query = prewaveParams.toString();
    window.location.href = query ? `/prewave?${query}` : "/prewave";
  }

  const panels = [
    <PanelShell
      key="p1"
      className="pb-12 pt-36 md:pb-14 md:pt-40"
      title="Return to what is already within you."
      body="A guided experience for self-reflection and relational growth."
    />,

    <PanelShell
      key="p2"
      className="pb-12 pt-36 md:pb-14 md:pt-40"
      title="Resonance is where it begins."
      body="A guided daily experience that helps you notice what is repeating, what is shifting, and what is trying to emerge in the way you live, relate, and reflect."
    />,

    <PanelShell
      key="p3"
      className="pb-12 pt-36 md:pb-14 md:pt-40"
      title="Not advice. Not noise. Not another feed."
      body="Resonance does not tell you who you are. It helps you discover what becomes visible when your reflections are held with structure, continuity, and care."
    />,

    <PanelShell
      key="p4"
      className="pb-12 pt-36 md:pb-14 md:pt-40"
      title="The Mirror listens across time."
      body="As your journey unfolds, the Mirror begins to reflect patterns, tensions, and emerging truths that are easy to miss from inside your own life."
    >
      <p className="text-sm italic leading-7 text-zinc-300">
        Some reflections remain free. Deeper insight unlocks as the journey
        evolves.
      </p>
    </PanelShell>,

    <PanelShell key="p5" className="pb-10 pt-20 md:pb-12 md:pt-20">
      <div className="grid grid-cols-2 gap-4">
        <PathCard
          title="Discover"
          words={["Innerstand", "yourself", "deeper"]}
          imageUrl="/images/discover-bg.png"
          selected={selectedPath === "discover"}
          onClick={() => handlePathSelect("discover")}
        />

        <PathCard
          title="Relate"
          words={["Relational", "innerstanding,", "deeper"]}
          imageUrl="/images/relate-bg.png"
          selected={selectedPath === "relate"}
          onClick={() => handlePathSelect("relate")}
        />
      </div>
    </PanelShell>,

    <PanelShell
      key="p6"
      className="pb-12 pt-36 md:pb-14 md:pt-40"
      title={panel6Title}
    >
      <div className="space-y-4 text-lg leading-8 text-zinc-200">
        {panel6Lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </PanelShell>,

    <PanelShell
      key="p7"
      className="pb-12 pt-36 md:pb-14 md:pt-40"
      title="Begin with what feels true."
      body={panel7Body}
    >
      <textarea
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        rows={6}
        className="w-full resize-none rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-[#c8a96a]/30"
        placeholder="Write what feels true..."
      />
    </PanelShell>,

    <PanelShell
      key="p8"
      className="pb-12 pt-36 md:pb-14 md:pt-40"
      title="What I’m already hearing"
    >
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

  if (!accessResolved) {
    return (
      <main className="relative h-screen overflow-hidden">

        <div className="pointer-events-none fixed left-1/2 top-4 z-20 -translate-x-1/2 text-center md:top-5">
          <div
            className="flex flex-col items-center"
            style={{
              width: "min(calc(100vh * 1024 / 1820), 92vw)",
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

        <div className="flex h-screen items-center justify-center text-white">
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm text-white/70">
              <LoadingDots />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative h-screen overflow-hidden">
      <div className="pointer-events-none fixed left-1/2 top-4 z-20 -translate-x-1/2 text-center md:top-5">
        <div
          className="flex flex-col items-center"
          style={{
            width: "min(calc(100vh * 1024 / 1820), 92vw)",
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
        className="flex h-screen transition-transform duration-700 ease-out"
        style={{
          width: `${panels.length * 100}vw`,
          transform: `translateX(-${index * 100}vw)`,
        }}
      >
        {panels}
      </div>

      {index > 0 && (
        <button
          onClick={() => setIndex((v) => Math.max(0, v - 1))}
          className="fixed left-1/2 top-1/2 z-20 -translate-y-1/2"
          style={{ transform: "translate(calc(-50% - 330px), -50%)" }}
          aria-label="Previous"
        >
          <span className="text-3xl text-white/60 transition hover:text-white md:text-4xl">
            ←
          </span>
        </button>
      )}

      {index < panels.length - 1 && (
        <button
          onClick={() => {
            if (!canMoveForward || isEntering) return;
            setIndex((v) => Math.min(panels.length - 1, v + 1));
          }}
          className="fixed left-1/2 top-1/2 z-20 -translate-y-1/2"
          style={{ transform: "translate(calc(-50% + 330px), -50%)" }}
          aria-label="Next"
        >
          <span
            className={`text-3xl transition md:text-4xl ${
              canMoveForward && !isEntering
                ? "text-white/60 hover:text-white"
                : "text-white/20"
            }`}
          >
            →
          </span>
        </button>
      )}

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
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