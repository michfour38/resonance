"use client";

import { Playfair_Display } from "next/font/google";
import { useEffect, useRef, useState, useTransition } from "react";
import { upsertEntryLead } from "./actions";

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

  function handleContinue() {
    if (isContinuing) return;

    const params = new URLSearchParams();

    if (firstName) params.set("name", firstName);
    if (leadEmail) params.set("email", leadEmail);
    if (source) params.set("source", source);

    const query = params.toString();

    setIsContinuing(true);
    window.location.href = query ? `/oremea/begin?${query}` : "/oremea/begin";
  }

  const heading = firstName
    ? `${firstName}, your place is ready.`
    : "Your place is ready.";

  return (
    <main className="relative min-h-screen text-white">
      <div className="pointer-events-none fixed left-1/2 top-6 z-20 -translate-x-1/2 text-center md:top-8">
        <img
          src="/images/oremea-logo-wht.png"
          alt="Oremea"
          className="h-20 w-auto md:h-24"
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-end justify-center px-6 pb-14 pt-28 md:pb-16 md:pt-32">
        <div
          className="w-full"
          style={{
            width: "min(calc(100vh * 1024 / 1820), 92vw)",
            maxWidth: "620px",
          }}
        >
          <div className="rounded-[32px] border border-white/10 bg-black/22 p-6 backdrop-blur-[2px] md:p-8">
            <h1
              className={`${playfair.className} text-3xl font-semibold leading-[1.02] tracking-tight text-white md:text-5xl`}
            >
              {heading}
            </h1>

            <p className="mt-5 max-w-[34rem] text-base leading-8 text-zinc-200">
              You’ve taken the first step. Continue into Resonance to begin the
              guided entry experience.
            </p>

            {leadEmail ? (
              <p className="mt-4 text-sm leading-7 text-white/60">
                Continuing as <span className="text-white/78">{leadEmail}</span>
              </p>
            ) : null}

            <div className="mt-8">
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

            {isSavingLead ? (
              <p className="mt-4 text-sm text-white/45">Saving your entry…</p>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}