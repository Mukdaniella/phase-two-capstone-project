import { prisma } from "../../lib/prisma";

export const likePost = async (postId: string, userId: string, count = 1) => {
  return prisma.like.upsert({
    where: { postId_userId: { postId, userId } },
    update: { count: { increment: count } },
    create: { postId, userId, count },
  });
};
