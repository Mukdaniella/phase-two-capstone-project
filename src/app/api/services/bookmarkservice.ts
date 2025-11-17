import { prisma } from "../../lib/prisma";

export const bookmarkPost = (userId: string, postId: string) => {
  return prisma.bookmark.create({
    data: { userId, postId },
  });
};

export const removeBookmark = (userId: string, postId: string) => {
  return prisma.bookmark.delete({
    where: { userId_postId: { userId, postId } },
  });
};

export const getBookmarksByUser = (userId: string) => {
  return prisma.bookmark.findMany({
    where: { userId },
    include: { post: true },
  });
};
