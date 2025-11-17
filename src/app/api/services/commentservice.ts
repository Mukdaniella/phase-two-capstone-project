import { prisma } from "../../lib/prisma";

export const getCommentsByPost = (postId: string) => {
  return prisma.comment.findMany({
    where: { postId },
    include: { author: true, replies: true },
    orderBy: { createdAt: "asc" },
  });
};

export const createComment = (data: { postId: string; authorId: string; content: string; parentId?: string }) => {
  return prisma.comment.create({
    data: {
      postId: data.postId,
      authorId: data.authorId,
      content: data.content,
      parentId: data.parentId || null,
    },
  });
};
