import { auth } from "@clerk/nextjs/server";
import { saveWaveNameVote } from "@/src/lib/wave/wave-name-vote.service";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function redirectHtml(path: string) {
  const safePath =
    path.startsWith("/") && !path.startsWith("//") ? path : "/prewave";

  const escaped = escapeHtml(safePath);

  return new Response(
    `<!doctype html>
<html>
  <head>
    <meta http-equiv="refresh" content="0;url=${escaped}">
    <script>window.location.replace(${JSON.stringify(safePath)});</script>
    <title>Redirecting…</title>
  </head>
  <body>
    Redirecting…
  </body>
</html>`,
    {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    }
  );
}

export async function GET(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return redirectHtml("/sign-in");
  }

  const url = new URL(request.url);
  const cohortId = String(url.searchParams.get("cohortId") ?? "");
  const waveName = String(url.searchParams.get("waveName") ?? "").trim();
  const returnTo = String(url.searchParams.get("returnTo") ?? "/prewave");

  if (!cohortId || !waveName) {
    return redirectHtml("/prewave");
  }

  await saveWaveNameVote(userId, cohortId, waveName);

  return redirectHtml(returnTo);
}