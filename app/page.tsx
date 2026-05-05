"use client";

import { useState } from "react";
import Link from "next/link";

const products = [
  {
    name: "Resonance",
    href: "/oremea/enter?source=oremea_home",
    active: true,
    short:
      "A guided 10-week self-reflection journey for people who want to understand their relational patterns with more honesty, structure, and depth.",
    full: [
      "Resonance is a structured self-reflection journey designed to help you see your relational patterns clearly, without distortion or external influence.",
      "Over ten weeks, you move through guided prompts that surface how you think, respond, avoid, attach, and interpret others.",
      "The system does not guide you with advice. It reflects what is already present in your responses so you can recognize patterns on your own.",
      "As you progress, your awareness becomes sharper. You begin to see inconsistencies, loops, and clarity points across your own thinking.",
      "This creates a shift from reacting in relationships to observing and choosing with intention.",
      "Resonance is not about becoming someone else. It is about seeing yourself accurately enough to move differently."
    ]
  },
  {
    name: "Harmonize",
    active: false,
    short:
      "A relational clarity layer for couples or two people who want to understand the pattern between them.",
    full: [
      "Harmonize is designed for two people who want to understand the pattern between them without collapsing into blame.",
      "Instead of focusing on who is right, the system maps interaction patterns that repeat between both individuals.",
      "It allows each person to see how they contribute to the dynamic without being positioned as the problem.",
      "This creates space for awareness without escalation.",
      "Over time, the focus shifts from conflict to recognition.",
      "Harmonize is not about fixing each other. It is about understanding the shared system you are both inside."
    ]
  },
  {
    name: "The Compass",
    active: false,
    short:
      "A decision layer that turns awareness into one clear next step.",
    full: [
      "The Compass converts awareness into action.",
      "After recognizing patterns, most people remain stuck in analysis. The Compass removes that friction.",
      "It reduces complexity into a single executable next step.",
      "Instead of overwhelming options, it narrows direction based on your current state.",
      "It does not tell you what to do broadly. It gives you what to do next.",
      "Clarity becomes movement, not just understanding."
    ]
  },
  {
    name: "The Current",
    active: false,
    short:
      "A future space to meet others who have moved through the work.",
    full: [
      "The Current is where people meet after completing the work within themselves.",
      "It is not a typical social or dating space.",
      "Entry is based on shared depth, not surface traits.",
      "Interactions are grounded in awareness rather than projection.",
      "This creates a different kind of connection environment.",
      "The Current is not about finding someone quickly. It is about meeting people differently."
    ]
  }
];

export default function Home() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#090806] text-white">
      <section className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
        
        {/* HEADER */}
        <div className="max-w-3xl">
          <img
            src="/oremea-logo.png"
            alt="Oremea"
            className="h-8 w-auto opacity-90"
          />

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-7xl">
            Return to what is already within you.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300">
            Oremea is a house of reflective products for pattern awareness,
            relational clarity, and self-led recognition.
          </p>
        </div>

        {/* PRODUCTS */}
        <div className="mt-16 flex flex-col gap-4">
          {products.map((product) => {
            const isOpen = open === product.name;

            return (
              <div
                key={product.name}
                className={`rounded-[2rem] border p-6 transition ${
                  product.active
                    ? "border-[#c8a96a]/35 bg-[#15120c]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {/* HEADER */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl">
                    {product.name === "Resonance" ? (
                      <>
                        Reso
                        <span className="italic text-[#c8a96a]">nance</span>
                      </>
                    ) : (
                      product.name
                    )}
                  </h2>

                  <button
                    onClick={() =>
                      setOpen(isOpen ? null : product.name)
                    }
                    className="text-sm text-zinc-400 hover:text-white"
                  >
                    {isOpen ? "Close" : "Learn more"}
                  </button>
                </div>

                {/* SHORT */}
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  {product.short}
                </p>

                {/* EXPANDED */}
                {isOpen && (
                  <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-300">
                    {product.full.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}

                    {/* ACTION */}
                    {product.active ? (
                      <Link
                        href={product.href!}
                        className="inline-block mt-4 text-[#c8a96a] hover:opacity-80"
                      >
                        Enter Reso
                        <span className="italic">nance</span> →
                      </Link>
                    ) : (
                      <p className="mt-4 text-zinc-500">
                        Coming soon
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}