import { prisma } from "../../lib/prisma";

export const getAllPosts = async () => {
  return prisma.post.findMany({
    where: { isPublished: true },
    include: { author: true, tags: { include: { tag: true } }, comments: true, Likes: true },
    orderBy: { publishedAt: "desc" },
  });
};

export const getPostById = async (id: string) => {
  return prisma.post.findUnique({
    where: { id },
    include: { author: true, tags: { include: { tag: true } }, comments: true, Likes: true },
  });
};

export const createPost = async (data: {
  title: string;
  content: string;
  authorId: string;
  tagIds?: string[];
  coverImageUrl?: string;
  isPublished?: boolean;
}) => {
  return prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      coverImageUrl: data.coverImageUrl,
      isPublished: data.isPublished ?? false,
      authorId: data.authorId,
      tags: {
        connect: data.tagIds?.map((tagId) => ({ tagId })) || [],
      },
    },
  });
};

export const updatePost = async (id: string, data: Partial<{ title: string; content: string; isPublished: boolean; coverImageUrl: string; tagIds: string[] }>) => {
  return prisma.post.update({
    where: { id },
    data: {
      ...data,
      tags: data.tagIds ? { set: data.tagIds.map((tagId) => ({ tagId })) } : undefined,
    },
  });
};

export const deletePost = async (id: string) => {
  return prisma.post.delete({ where: { id } });
};
