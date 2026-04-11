import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  getCircleMembership,
  getCirclePosts,
  getCirclePrompts,
  createCirclePost,
} from "../circles.service";
import PostComposer from "./post-composer";
import ReplyComposer from "./reply-composer";
import WitnessButton from "./witness-button";

export const dynamic = "force-dynamic";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function wasWitnessedRecently(value: string | null): boolean {
  if (!value) return false;

  const witnessedAt = new Date(value).getTime();
  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000;

  return now - witnessedAt < tenMinutes;
}

async function submitPostAction(formData: FormData) {
  "use server";

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const circleId = String(formData.get("circleId"));
  const content = String(formData.get("content") ?? "").trim();
  const parentId = formData.get("parentId")
    ? String(formData.get("parentId"))
    : null;
  const promptId = formData.get("promptId")
    ? String(formData.get("promptId"))
    : null;

  if (!content) return;

  await createCirclePost({
    circleId,
    profileId: userId,
    content,
    parentId,
    promptId,
  });

  revalidatePath(`/circles/${circleId}`);
}

async function toggleWitnessAction(formData: FormData) {
  "use server";

  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const postId = String(formData.get("postId"));

  const existing = await prisma.post_witnesses.findUnique({
    where: {
      post_id_user_id: {
        post_id: postId,
        user_id: userId,
      },
    },
  });

  if (existing) {
    await prisma.post_witnesses.delete({
      where: {
        post_id_user_id: {
          post_id: postId,
          user_id: userId,
        },
      },
    });
  } else {
    await prisma.post_witnesses.create({
      data: {
        post_id: postId,
        user_id: userId,
      },
    });
  }

  const post = await prisma.circle_posts.findUnique({
    where: { id: postId },
    select: { circle_id: true },
  });

  if (!post) return;

  revalidatePath(`/circles/${post.circle_id}`);
}

export default async function CirclePage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const circleId = params.id;

  const membership = await getCircleMembership(circleId, userId);
  if (!membership) redirect("/home");

  const [circle, prompts, posts] = await Promise.all([
    prisma.circles.findUnique({
      where: { id: circleId },
      select: { name: true },
    }),
    getCirclePrompts(circleId),
    getCirclePosts(circleId, userId),
  ]);

  if (!circle) redirect("/home");

  const topLevel = posts.filter((p) => !p.isReply);
  const replies = posts.filter((p) => p.isReply);
  const reflectionCount = topLevel.length;

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{circle.name}</h1>
          <p className="text-sm text-zinc-500">
            This is your space to reflect and engage honestly.
          </p>
          <p className="text-xs text-zinc-400">
            {reflectionCount === 1
              ? "1 reflection shared"
              : `${reflectionCount} reflections shared`}
          </p>
        </div>

        {prompts.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 p-5">
            <p className="text-sm text-zinc-500">
              No prompts are available for this circle yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {prompts.map((prompt, index) => {
              const promptTopLevel = topLevel.filter(
                (post) => post.promptId === prompt.id
              );
              const promptReplies = replies.filter(
                (reply) => reply.promptId === prompt.id
              );

              const userHasAnsweredPrompt = promptTopLevel.some(
                (post) => post.authorId === userId
              );

              return (
                <section
                  key={prompt.id}
                  className="rounded-2xl border border-zinc-200 p-5 space-y-4"
                >
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wide text-zinc-400">
                      Prompt {index + 1}
                    </p>
                    <p className="text-sm font-medium text-zinc-800">
                      {prompt.content}
                    </p>
                  </div>

                  {!userHasAnsweredPrompt ? (
                    <div className="space-y-4">
                      <PostComposer
                        circleId={circleId}
                        promptId={prompt.id}
                        action={submitPostAction}
                      />
                      <p className="text-sm text-zinc-400">
                        The thread will open once you’ve shared your own
                        reflection.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {promptTopLevel.length === 0 ? (
                        <p className="text-sm text-zinc-400">
                          No reflections yet for this prompt.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {promptTopLevel.map((post) => {
                            const postReplies = promptReplies.filter(
                              (reply) => reply.parentId === post.id
                            );

                            return (
                              <div
                                key={post.id}
                                className="border rounded-2xl p-4 space-y-4"
                              >
                                <div className="space-y-3">
                                  <div className="text-xs text-zinc-500">
                                    {post.authorDisplayName} ·{" "}
                                    {formatDate(post.createdAt)}
                                  </div>

                                  <p className="text-sm whitespace-pre-wrap">
                                    {post.content}
                                  </p>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    {post.authorId === userId &&
                                      post.witnessCount > 0 && (
                                        <div className="px-3 py-1 rounded-full border border-zinc-200 text-xs text-zinc-500">
                                          {post.witnessCount === 1 &&
                                          wasWitnessedRecently(
                                            post.latestWitnessedAt
                                          )
                                            ? "Someone just witnessed your experience"
                                            : post.witnessCount === 1
                                            ? "Witnessed by 1 person"
                                            : post.witnessCount <= 3
                                            ? "A few people have witnessed this"
                                            : "This reflection is being held"}
                                        </div>
                                      )}

                                    {!post.witnessedByMe && (
                                      <div className="px-3 py-1 rounded-full border border-zinc-200">
                                        <WitnessButton
                                          postId={post.id}
                                          action={toggleWitnessAction}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  <ReplyComposer
                                    circleId={circleId}
                                    parentId={post.id}
                                    promptId={prompt.id}
                                    action={submitPostAction}
                                  />
                                </div>

                                {postReplies.length > 0 && (
                                  <div className="space-y-2 pl-4 border-l border-zinc-100">
                                    {postReplies.map((reply) => (
                                      <div
                                        key={reply.id}
                                        className="space-y-1 rounded-xl bg-zinc-50 px-3 py-2"
                                      >
                                        <div className="text-xs text-zinc-400">
                                          {reply.authorDisplayName} ·{" "}
                                          {formatDate(reply.createdAt)}
                                        </div>
                                        <p className="text-xs text-zinc-600 whitespace-pre-wrap">
                                          {reply.content}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}