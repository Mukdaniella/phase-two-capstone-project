import { prisma } from "../../lib/prisma";

export const uploadMedia = (userId: string, url: string, type: string) => {
  return prisma.media.create({
    data: { userId, url, type },
  });
};

export const getUserMedia = (userId: string) => {
  return prisma.media.findMany({ where: { userId } });
};
