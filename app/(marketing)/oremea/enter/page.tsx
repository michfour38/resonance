"use client";

import { Playfair_Display } from "next/font/google";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState, useTransition } from "react";
import { getEntryResumeState, upsertEntryLead } from "./actions";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const RESONANCE_PAYSTACK_URL = "https://paystack.shop/pay/194owb7fjf";
const MIRROR_PAYSTACK_URL = "https://paystack.shop/pay/wx9avyp3-t";

type Plan = "resonance" | "mirror";

function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.2s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.1s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
    </span>
  );
}

export default function OremeaEnterPage() {
  const { user } = useUser();
  const [firstName, setFirstName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [source, setSource] = useState("ghl");
  const [isContinuing, setIsContinuing] = useState(false);

  const [isSavingLead, startSavingLead] = useTransition();
  const leadUpsertedRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const name = params.get("name")?.trim() || "";
    const email = params.get("email")?.trim().toLowerCase() || "";
    const incomingSource = params.get("source")?.trim() || "ghl";

    setFirstName(name);
    setLeadEmail(email);
    setSource(incomingSource);

    if (!email || leadUpsertedRef.current) return;

    leadUpsertedRef.current = true;

    startSavingLead(async () => {
      await upsertEntryLead({
        email,
        firstName: name || undefined,
        source: incomingSource,
      });
    });
  }, []);

  function buildPaystackHref(plan: Plan) {
    const params = new URLSearchParams();

    if (firstName) params.set("name", firstName);
    if (leadEmail) params.set("email", leadEmail);
    if (source) params.set("source", source);
    params.set("plan", plan);

    const baseUrl =
      plan === "mirror" ? MIRROR_PAYSTACK_URL : RESONANCE_PAYSTACK_URL;

    const query = params.toString();
    return query ? `${baseUrl}?${query}` : baseUrl;
  }

  function buildReturnToSelf() {
    const params = new URLSearchParams();

    if (firstName) params.set("name", firstName);
    if (leadEmail) params.set("email", leadEmail);
    if (source) params.set("source", source);

    const query = params.toString();
    return query ? `/oremea/enter?${query}` : "/oremea/enter";
  }

  async function handleResume() {
    if (isContinuing) return;

    setIsContinuing(true);

    const signedInEmail =
      user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ||
      user?.emailAddresses?.[0]?.emailAddress?.trim().toLowerCase() ||
      "";

    const effectiveEmail = leadEmail || signedInEmail;

    if (effectiveEmail) {
      await upsertEntryLead({
        email: effectiveEmail,
        firstName: firstName || undefined,
        source: source || undefined,
      });
    }

    const resume = await getEntryResumeState({
      email: effectiveEmail || undefined,
    });

    if (resume.destination === "journey") {
      window.location.href = "/journey";
      return;
    }

    if (resume.destination === "begin") {
      window.location.href = "/oremea/begin";
      return;
    }

    setIsContinuing(false);
  }

  const returnToSelf = buildReturnToSelf();
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(returnToSelf)}`;
  const signUpHref = `/sign-up?redirect_url=${encodeURIComponent(returnToSelf)}`;

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
<div className="relative z-20 mx-auto flex max-w-6xl justify-end px-6 pt-5">
  <SignedOut>
    <a
      href={signInHref}
      className="rounded-xl border border-white/15 px-4 py-2 text-xs text-white/75 transition hover:bg-white/5 hover:text-white"
    >
      Sign in
    </a>
  </SignedOut>

  <SignedIn>
    <button
      type="button"
      onClick={handleResume}
      disabled={isContinuing}
      className="rounded-xl border border-white/15 px-4 py-2 text-xs text-white/75 transition hover:bg-white/5 hover:text-white disabled:text-white/35"
    >
      {isContinuing ? <LoadingDots /> : "Continue"}
    </button>
  </SignedIn>
</div>
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{ backgroundImage: "url(/images/mobile/bg-entry.webp)" }}
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
          style={{ backgroundImage: "url(/images/desktop/bg-entry.webp)" }}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 md:py-14">
        <header className="mx-auto max-w-3xl text-center">
          <img
            src="/images/oremea-logo-wht.png"
            alt="Oremea"
            className="mx-auto h-16 w-auto md:h-24"
          />

          <p className="mt-8 text-sm uppercase tracking-[0.32em] text-[#f1dfb4]/80 md:text-base">
            Resonance by Oremea
          </p>

          <h1
            className={`${playfair.className} mt-4 text-4xl font-semibold leading-[1.02] tracking-tight md:text-6xl`}
          >
            See what keeps repeating — one day at a time.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-200 md:text-lg">
            Resonance is a structured reflection system designed to help your patterns become visible over time.

You respond to prompts, sit with guiding questions, and begin to notice what repeats, what shifts, and what becomes clearer — not by being told, but by seeing it within your own responses.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400">
            Resonance is not therapy, coaching, or diagnosis. It does not
            provide medical or psychological advice. It is a structured
            reflection system for pattern awareness.
          </p>
        </header>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-black/35 p-6 backdrop-blur-[2px] md:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-[#f1dfb4]/70">
              Option 1
            </p>

            <h2 className={`${playfair.className} mt-3 text-3xl text-white`}>
              Resonance
            </h2>

            <p className="mt-3 text-base leading-7 text-zinc-200">
              Reflect at your own pace. Let clarity build over time.
            </p>

            <ul className="mt-6 space-y-3 text-sm leading-7 text-zinc-300">
              <li>• A structured journey that unfolds over time</li>
              <li>• Daily reflection prompts (continue at your own pace)</li>
              <li>• Two guiding questions at the end of each day</li>
              <li>• Structured awareness process</li>
              <li>• One extended Mirror reflection at the end</li>
            </ul>

            <p className="mt-6 text-sm italic leading-7 text-zinc-400">
              You respond. Patterns begin to form across your answers.
            </p>

            <a
              href={buildPaystackHref("resonance")}
              className="mt-7 inline-flex w-full items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] transition hover:bg-[#c8a96a]/10"
            >
              Start with Resonance
            </a>
          </div>

          <div className="rounded-[2rem] border border-[#c8a96a]/35 bg-[#c8a96a]/10 p-6 backdrop-blur-[2px] md:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-[#f1dfb4]/80">
              Option 2
            </p>

            <h2 className={`${playfair.className} mt-3 text-3xl text-white`}>
              Resonance + Mirror
            </h2>

            <p className="mt-3 text-base leading-7 text-zinc-100">
              See your patterns as they begin to form.
            </p>

            <ul className="mt-6 space-y-3 text-sm leading-7 text-zinc-200">
              <li>• Everything in Resonance</li>
              <li>• Full Mirror reflections throughout the journey</li>
              <li>• Pattern synthesis across your responses</li>
              <li>• Two guiding questions included within each daily Mirror reflection</li>
              <li>• Deeper awareness as your journey unfolds</li>
            </ul>

            <p className="mt-6 text-sm italic leading-7 text-zinc-300">
              The system reflects with you.
            </p>

            <a
              href={buildPaystackHref("mirror")}
              className="mt-7 inline-flex w-full items-center justify-center rounded-xl border border-[#c8a96a]/70 bg-[#c8a96a]/10 px-5 py-3 text-sm text-[#f1dfb4] transition hover:bg-[#c8a96a]/20"
            >
              Start with Mirror
            </a>
          </div>
        </section>

        <p className="mx-auto mt-7 max-w-2xl text-center text-sm leading-7 text-zinc-300">
          No hidden steps. No forced upgrades. You choose your depth from the
          start.
        </p>

        <section className="mx-auto mt-10 max-w-3xl space-y-4">
          <details className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <summary className="cursor-pointer text-sm text-zinc-100">
              How it works
            </summary>
            <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-400">
<p>
  <span className="text-zinc-200">Layer 1:</span> Prompts create
  reflection. You respond to structured prompts that surface moments,
  reactions, and patterns you may not usually stay with.
</p>
<p>
  <span className="text-zinc-200">Layer 2:</span> Questions create
  depth. At the end of each day, guiding questions help you stay
  with what you noticed and see it more clearly.
</p>
<p>
  <span className="text-zinc-200">Layer 3:</span> Mirror reveals
  patterns. Across your responses, Mirror reflects what repeats,
  what shifts, and what may be forming beneath the surface.
</p>
            </div>
          </details>

          <details className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <summary className="cursor-pointer text-sm text-zinc-100">
              What Mirror adds
            </summary>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              Resonance helps you stay with what you have already noticed in your relationships.
Mirror helps you see what is forming across the process.
Instead of individual reflections, Mirror looks across your responses over time — identifying patterns, repeated dynamics, and subtle shifts that are difficult to see from within a single moment.
Each Mirror reflection includes guiding questions, helping you continue the process with greater clarity.
            </p>
          </details>

          <details className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <summary className="cursor-pointer text-sm text-zinc-100">
              What this is not
            </summary>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              Resonance is not therapy, coaching, diagnosis, medical advice, or
              crisis support. It is a self-led reflection system designed for
              pattern awareness.
            </p>
          </details>
        </section>

        <footer className="mt-8 text-center text-xs leading-6 text-white/40">
          <a href="/terms" className="hover:text-white/60">Terms</a>
          <span className="mx-2">·</span>
          <a href="/privacy" className="hover:text-white/60">Privacy</a>
          <span className="mx-2">·</span>
          <a href="/disclaimer" className="hover:text-white/60">Disclaimer</a>
          <span className="mx-2">·</span>
          <a href="/refunds" className="hover:text-white/60">Refunds</a>
          <span className="mx-2">·</span>
          <a href="/conduct" className="hover:text-white/60">Conduct</a>
        </footer>
      </div>
    </main>
  );
}