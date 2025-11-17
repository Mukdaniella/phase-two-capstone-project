import { prisma } from "../../lib/prisma";

export const getAllTags = () => {
  return prisma.tag.findMany();
};

export const createTag = (name: string, slug: string) => {
  return prisma.tag.create({ data: { name, slug } });
};
