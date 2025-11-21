import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await prisma.post.findUnique({
      where: { 
        slug: slug,
        isPublished: true 
      },
      include: {
        author: {
          select: { id: true, name: true, username: true }
        },
        Likes: {
          select: { userId: true }
        },
        _count: {
          select: { Likes: true }
        }
      }
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}