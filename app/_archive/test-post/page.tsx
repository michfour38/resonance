"use client";

import { useState } from "react";

export default function TestPostPage() {
  const [content, setContent] = useState(
    "You are stupid and I hate you. Click here for free money."
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  async function runPostTest() {
    try {
      setLoading(true);
      setResult("");

      const response = await fetch("/api/circle-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      const data = await response.json();

      setResult(
        JSON.stringify(
          {
            status: response.status,
            ok: response.ok,
            body: data,
          },
          null,
          2
        )
      );
    } catch (error) {
      setResult(
        JSON.stringify(
          {
            ok: false,
            error: error instanceof Error ? error.message : "Unknown error",
          },
          null,
          2
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-zinc-900">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Test Post</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Use this page to send a custom post to <code>/api/circle-post</code>.
        </p>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-medium text-zinc-800"
          >
            Post content
          </label>

          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={8}
            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-zinc-500"
            placeholder="Type the test post content here..."
          />

          <button
            type="button"
            onClick={runPostTest}
            disabled={loading}
            className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {loading ? "Running..." : "Run POST Test"}
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
          <h2 className="text-lg font-semibold text-zinc-900">Result</h2>

          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm text-zinc-800">
            {result || "No result yet."}
          </pre>
        </div>
      </div>
    </main>
  );
}