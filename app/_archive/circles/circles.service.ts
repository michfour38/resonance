import { prisma } from "@/lib/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CircleMemberRole = "member" | "facilitator";

export interface MemberCircleDTO {
  id: string;
  name: string;
  cohortId: string;
  facilitatorId: string | null;
  createdAt: string;
  role: CircleMemberRole;
  joinedAt: string;
  postCount: number;
}

export interface CirclePromptDTO {
  id: string;
  circleId: string;
  content: string;
  createdAt: string;
}

export interface CirclePostDTO {
  id: string;
  circleId: string;
  content: string;
  createdAt: string;
  updatedAt: string;

  authorId: string;
  authorDisplayName: string;

  parentId: string | null;
  promptId: string | null;

  riskScore: number;
  severity: string | null;

  isReply: boolean;

  witnessCount: number;
  witnessedByMe: boolean;
  latestWitnessedAt: string | null;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getMemberCircles(
  profileId: string
): Promise<MemberCircleDTO[]> {
  const memberships = await prisma.circle_members.findMany({
    where: {
      user_id: profileId,
    },
    orderBy: {
      joined_at: "desc",
    },
    include: {
      circles: {
        include: {
          _count: {
            select: {
              circle_posts: {
                where: {
                  deleted_at: null,
                  parent_id: null,
                },
              },
            },
          },
        },
      },
    },
  });

  return memberships.map((membership) => ({
    id: membership.circles.id,
    name: membership.circles.name,
    cohortId: membership.circles.cohort_id,
    facilitatorId: membership.circles.facilitator_id,
    createdAt: membership.circles.created_at.toISOString(),
    role: membership.role as CircleMemberRole,
    joinedAt: membership.joined_at.toISOString(),
    postCount: membership.circles._count.circle_posts,
  }));
}

export async function getCirclePrompts(
  circleId: string
): Promise<CirclePromptDTO[]> {
  const prompts = await prisma.circle_prompts.findMany({
    where: {
      circle_id: circleId,
    },
    orderBy: {
      created_at: "desc",
    },
    take: 4,
    select: {
      id: true,
      circle_id: true,
      content: true,
      created_at: true,
    },
  });

  return prompts
    .slice()
    .reverse()
    .map((prompt) => ({
      id: prompt.id,
      circleId: prompt.circle_id,
      content: prompt.content,
      createdAt: prompt.created_at.toISOString(),
    }));
}

export async function getCirclePosts(
  circleId: string,
  currentUserId: string
): Promise<CirclePostDTO[]> {
  const posts = await prisma.circle_posts.findMany({
    where: {
      circle_id: circleId,
      deleted_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      profiles: {
        select: {
          id: true,
          display_name: true,
        },
      },
      _count: {
        select: {
          post_witnesses: true,
        },
      },
      post_witnesses: {
        select: {
          id: true,
          user_id: true,
          created_at: true,
        },
        orderBy: {
          created_at: "desc",
        },
      },
    },
  });

  return posts.map((post) => {
    const latestWitness = post.post_witnesses[0] ?? null;
    const witnessedByMe = post.post_witnesses.some(
      (witness) => witness.user_id === currentUserId
    );

    return {
      id: post.id,
      circleId: post.circle_id,
      content: post.content,
      createdAt: post.created_at.toISOString(),
      updatedAt: post.updated_at.toISOString(),

      authorId: post.user_id,
      authorDisplayName: post.profiles.display_name,

      parentId: post.parent_id,
      promptId: post.prompt_id,

      riskScore: post.risk_score,
      severity: post.severity,

      isReply: post.parent_id !== null,

      witnessCount: post._count.post_witnesses,
      witnessedByMe,
      latestWitnessedAt: latestWitness
        ? latestWitness.created_at.toISOString()
        : null,
    };
  });
}

export async function getCircleMembership(
  circleId: string,
  profileId: string
): Promise<{ role: CircleMemberRole; joinedAt: string } | null> {
  const membership = await prisma.circle_members.findUnique({
    where: {
      circle_id_user_id: {
        circle_id: circleId,
        user_id: profileId,
      },
    },
    select: {
      role: true,
      joined_at: true,
    },
  });

  if (!membership) return null;

  return {
    role: membership.role as CircleMemberRole,
    joinedAt: membership.joined_at.toISOString(),
  };
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export interface CreateCirclePostInput {
  circleId: string;
  profileId: string;
  content: string;
  parentId?: string | null;
  promptId?: string | null;
}

export interface CreateCirclePostResult {
  id: string;
}

export async function createCirclePost(
  input: CreateCirclePostInput
): Promise<CreateCirclePostResult> {
  const {
    circleId,
    profileId,
    content,
    parentId = null,
    promptId = null,
  } = input;

  const now = new Date();

  const post = await prisma.circle_posts.create({
    data: {
      circle_id: circleId,
      user_id: profileId,
      content,
      parent_id: parentId,
      prompt_id: promptId,
      created_at: now,
      updated_at: now,
    },
    select: {
      id: true,
    },
  });

  return { id: post.id };
}