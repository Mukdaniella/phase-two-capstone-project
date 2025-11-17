import { prisma } from "../../lib/prisma";

export const followUser = (followerId: string, followingId: string) => {
  return prisma.follow.create({
    data: { followerId, followingId },
  });
};

export const unfollowUser = (followerId: string, followingId: string) => {
  return prisma.follow.delete({
    where: { followerId_followingId: { followerId, followingId } },
  });
};
