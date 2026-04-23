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

  function buildBeginHref(emailOverride?: string) {
    const params = new URLSearchParams();

    if (firstName) params.set("name", firstName);
    if (emailOverride || leadEmail) params.set("email", emailOverride || leadEmail);
    if (source) params.set("source", source);

    const query = params.toString();
    return query ? `/oremea/begin?${query}` : "/oremea/begin";
  }

  function buildPrewaveHref(emailOverride?: string) {
    const params = new URLSearchParams();

    if (emailOverride || leadEmail) params.set("email", emailOverride || leadEmail);
    if (source) params.set("source", source);

    const query = params.toString();
    return query ? `/prewave?${query}` : "/prewave";
  }

  function buildReturnToSelf() {
    const params = new URLSearchParams();

    if (firstName) params.set("name", firstName);
    if (leadEmail) params.set("email", leadEmail);
    if (source) params.set("source", source);

    const query = params.toString();
    return query ? `/oremea/enter?${query}` : "/oremea/enter";
  }

  async function handleContinue() {
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

    const params = new URLSearchParams();

    if (firstName) params.set("name", firstName);
    if (effectiveEmail) params.set("email", effectiveEmail);
    if (source) params.set("source", source);

    const query = params.toString();
    const paystackUrl = "https://paystack.shop/pay/hpklna7iux";

    const resume = await getEntryResumeState({
      email: effectiveEmail || undefined,
    });

    if (resume.destination === "begin") {
      window.location.href = buildBeginHref(effectiveEmail);
      return;
    }

    if (resume.destination === "prewave") {
      window.location.href = buildPrewaveHref(effectiveEmail);
      return;
    }

    window.location.href = query ? `${paystackUrl}?${query}` : paystackUrl;
  }

  const heading = firstName
    ? `${firstName}, your place is ready.`
    : "Your place is ready.";

  const returnToSelf = buildReturnToSelf();
  const signInHref = `/sign-in?redirect_url=${encodeURIComponent(returnToSelf)}`;
  const signUpHref = `/sign-up?redirect_url=${encodeURIComponent(returnToSelf)}`;

  return (
    <main className="relative min-h-[100svh] overflow-hidden text-white">
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
          style={{ backgroundImage: "url(/images/mobile/bg-entry.png)" }}
        />
        <div
          className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
          style={{ backgroundImage: "url(/images/desktop/bg-entry.webp)" }}
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="pointer-events-none fixed left-1/2 top-5 z-20 -translate-x-1/2 text-center md:top-8">
        <img
          src="/images/oremea-logo-wht.png"
          alt="Oremea"
          className="h-16 w-auto md:h-24"
        />
      </div>

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-6 pb-10 pt-24 md:pb-16 md:pt-32">
        <div
          className="w-full"
          style={{
            width: "min(calc(100svh * 1024 / 1820), 92vw)",
            maxWidth: "620px",
          }}
        >
          <div className="rounded-[32px] border border-white/10 bg-black/22 p-6 backdrop-blur-[2px] md:p-8">
            <h1
              className={`${playfair.className} text-3xl font-semibold leading-[1.02] tracking-tight text-white md:text-5xl`}
            >
              {heading}
            </h1>

            <p className="mt-4 max-w-[34rem] text-base leading-7 text-zinc-200 md:mt-5 md:leading-8">
              You’ve taken the first step. Continue into Resonance to begin the
              guided entry experience.
            </p>

            {leadEmail ? (
              <p className="mt-4 text-sm leading-7 text-white/60">
                Continuing as <span className="text-white/78">{leadEmail}</span>
              </p>
            ) : null}

            <SignedOut>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={signUpHref}
                  className="inline-flex min-w-[160px] items-center justify-center rounded-xl border border-[#c8a96a]/60 px-5 py-3 text-sm text-[#f1dfb4] transition hover:bg-[#c8a96a]/10"
                >
                  Create account
                </a>

                <a
                  href={signInHref}
                  className="inline-flex min-w-[160px] items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm text-white/80 transition hover:bg-white/5"
                >
                  Sign in
                </a>
              </div>

              <p className="mt-4 text-sm leading-7 text-white/50">
                Create your account or sign in first, then continue into your
                guided beginning.
              </p>
            </SignedOut>

            <SignedIn>
              <div className="mt-7">
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={isContinuing}
                  className={`inline-flex min-w-[140px] items-center justify-center rounded-xl border px-5 py-3 text-sm transition ${
                    !isContinuing
                      ? "border-[#c8a96a]/60 bg-transparent text-[#f1dfb4] hover:bg-[#c8a96a]/10"
                      : "border-white/15 bg-transparent text-white/35"
                  }`}
                >
                  {isContinuing ? <LoadingDots /> : "Continue"}
                </button>
              </div>
            </SignedIn>

            {isSavingLead ? (
              <p className="mt-4 text-sm text-white/45">Saving your entry…</p>
            ) : null}

<div className="mt-6 text-center text-xs leading-6 text-white/40">
  <a href="/terms" className="hover:text-white/60">Terms</a>
  <span className="mx-2">·</span>
  <a href="/privacy" className="hover:text-white/60">Privacy</a>
  <span className="mx-2">·</span>
  <a href="/disclaimer" className="hover:text-white/60">Disclaimer</a>
  <span className="mx-2">·</span>
  <a href="/refunds" className="hover:text-white/60">Refunds</a>
  <span className="mx-2">·</span>
  <a href="/conduct" className="hover:text-white/60">Conduct</a>
</div>

          </div>
        </div>
      </div>
    </main>
  );
}