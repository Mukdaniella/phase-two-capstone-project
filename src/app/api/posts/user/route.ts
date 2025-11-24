import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (token.id || token.sub) as string;

    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        _count: {
          select: {
            Likes: true,
            comments: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const published = posts.filter(post => post.isPublished);
    const drafts = posts.filter(post => !post.isPublished);

    return NextResponse.json({ published, drafts });
  } catch (error) {
    console.error("Failed to fetch user posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}