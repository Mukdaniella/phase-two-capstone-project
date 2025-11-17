import { prisma } from "../../lib/prisma";

export const getUserById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: { posts: true, followers: true, following: true },
  });
};

export const createUser = (data: { name: string; username: string; email: string; passwordHash: string }) => {
  return prisma.user.create({ data });
};

export const getAllUsers = () => {
  return prisma.user.findMany();
};
