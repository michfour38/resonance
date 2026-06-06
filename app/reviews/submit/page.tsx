"use client";

import { useState } from "react";
import Link from "next/link";

const products = [
  "Resonance",
  "Compass",
  "Harmonize",
  "The Current",

  // Hidden/future entry products
  // "Recognition",
];

const experienceWords = [
  "Clarity",
  "Recognition",
  "Relief",
  "Direction",
  "Ownership",
  "Pattern awareness",
  "Boundaries",
  "Stillness",
  "Connection",
  "Courage",
  "Truth",
  "Perspective",
];

export default function ReviewSubmitPage() {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function toggleWord(word: string) {
    setSelectedWords((current) =>
      current.includes(word)
        ? current.filter((item) => item !== word)
        : [...current, word]
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const reviewData = {
      product: form.get("product"),
      reflection: form.get("reflection"),
      experienceWords: selectedWords,
      otherExperienceWords: form.get("otherExperienceWords"),
      displayPreference: form.get("displayPreference"),
      displayName: form.get("displayName"),
      role: form.get("role"),
      experiencePersistence: form.get("experiencePersistence"),
      contactIfFeatured: form.get("contactIfFeatured") === "yes",
      consent: form.get("consent") === "on",

      // Built now, wired later
      status: "pending",
      isVisibleOnMainReviews: false,
      submittedAt: new Date().toISOString(),
      reviewSource: "organic",
      completionState: "completed",
      productVersion: "v1",
    };

    const existing = JSON.parse(
      localStorage.getItem("oremeaReviewSubmissions") || "[]"
    );

    localStorage.setItem(
      "oremeaReviewSubmissions",
      JSON.stringify([reviewData, ...existing])
    );

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#0f0f0d] px-6 py-20 text-[#eaeaea]">
        <section className="mx-auto max-w-2xl rounded-3xl border border-[#c6a96b]/20 bg-[#181713] p-8">
          <p className="text-sm uppercase tracking-[0.28em] text-[#c6a96b]">
            Reflection received
          </p>

          <h1 className="mt-4 text-3xl font-light">
            Thank you for sharing your experience.
          </h1>

          <p className="mt-5 leading-7 text-[#bfbfbf]">
            Your reflection has been saved for review. It will not appear
            publicly unless approved.
          </p>

          <Link
            href="/reviews"
            className="mt-8 inline-flex rounded-full bg-[#c6a96b] px-6 py-3 text-sm font-medium text-[#0f0f0d]"
          >
            Return to reviews
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f0d] px-6 py-16 text-[#eaeaea]">
      <section className="mx-auto max-w-3xl">
        <Link
          href="/reviews"
          className="text-sm uppercase tracking-[0.28em] text-[#c6a96b]/80 hover:text-[#c6a96b]"
        >
          Oremea Reviews
        </Link>

        <h1 className="mt-10 text-4xl font-light">Share a reflection</h1>

        <p className="mt-5 leading-7 text-[#bfbfbf]">
          Oremea grows through lived experience. Share only what you are
          comfortable having reviewed for possible public display.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <label className="block">
            <span className="text-sm uppercase tracking-[0.22em] text-[#c6a96b]">
              Product
            </span>

            <select
              name="product"
              required
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[#151512] p-4 text-[#eaeaea]"
            >
              <option value="">Choose product</option>
              {products.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm uppercase tracking-[0.22em] text-[#c6a96b]">
              What did Oremea help you see more clearly?
            </span>

            <textarea
              name="reflection"
              required
              rows={7}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[#151512] p-4 text-[#eaeaea]"
              placeholder="Write your reflection here..."
            />
          </label>

          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[#c6a96b]">
              What words best describe your experience?
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {experienceWords.map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => toggleWord(word)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    selectedWords.includes(word)
                      ? "border-[#c6a96b] bg-[#c6a96b]/15 text-[#eaeaea]"
                      : "border-white/10 bg-white/[0.03] text-[#bfbfbf]"
                  }`}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm uppercase tracking-[0.22em] text-[#c6a96b]">
              Other words
            </span>

            <input
              name="otherExperienceWords"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[#151512] p-4 text-[#eaeaea]"
              placeholder="Add any word or phrase that describes your experience"
            />
          </label>

          <fieldset className="space-y-3">
            <legend className="text-sm uppercase tracking-[0.22em] text-[#c6a96b]">
              How may we display this?
            </legend>

            {["Anonymous", "Initial only", "First name only"].map((option) => (
              <label key={option} className="flex gap-3 text-[#bfbfbf]">
                <input type="radio" name="displayPreference" value={option} required />
                {option}
              </label>
            ))}
          </fieldset>

          <label className="block">
            <span className="text-sm uppercase tracking-[0.22em] text-[#c6a96b]">
              Display name or initial
            </span>

            <input
              name="displayName"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[#151512] p-4 text-[#eaeaea]"
              placeholder="Example: Anonymous, M., or Michelle"
            />
          </label>

          <label className="block">
            <span className="text-sm uppercase tracking-[0.22em] text-[#c6a96b]">
              Optional context
            </span>

            <input
              name="role"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-[#151512] p-4 text-[#eaeaea]"
              placeholder="Example: Parent, Partner, Entrepreneur, Student"
            />
          </label>

          <fieldset className="space-y-3">
            <legend className="text-sm uppercase tracking-[0.22em] text-[#c6a96b]">
              Has this experience remained with you since completing this product?
            </legend>

            {[
              ["yes", "Yes"],
              ["partly", "Partly"],
              ["no", "No"],
              ["too_early", "Too early to say"],
            ].map(([value, label]) => (
              <label key={value} className="flex gap-3 text-[#bfbfbf]">
                <input type="radio" name="experiencePersistence" value={value} required />
                {label}
              </label>
            ))}
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm uppercase tracking-[0.22em] text-[#c6a96b]">
              May Oremea contact you if your reflection is ever featured elsewhere?
            </legend>

            <label className="flex gap-3 text-[#bfbfbf]">
              <input type="radio" name="contactIfFeatured" value="yes" required />
              Yes
            </label>

            <label className="flex gap-3 text-[#bfbfbf]">
              <input type="radio" name="contactIfFeatured" value="no" required />
              No
            </label>
          </fieldset>

          <label className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-[#bfbfbf]">
            <input type="checkbox" name="consent" required />
            <span>
              I give Oremea permission to review this reflection for possible
              public display. I understand some words may be obscured to protect
              community standards, while the review is otherwise displayed as
              submitted.
            </span>
          </label>

          <button
            type="submit"
            className="rounded-full bg-[#c6a96b] px-7 py-3 text-sm font-medium text-[#0f0f0d]"
          >
            Submit reflection
          </button>
        </form>
      </section>
    </main>
  );
}