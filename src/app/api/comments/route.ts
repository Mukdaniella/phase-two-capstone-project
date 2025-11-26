import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "../../lib/prisma";                                                                                           

export async function POST(req: Request) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, content } = await req.json();

    if (!postId || !content) {
      return NextResponse.json({ error: "Post ID and content required" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: (token.id || token.sub) as string
      },
      include: {
        author: {
          select: { id: true, name: true, username: true }
        }
      }
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Comment creation error:', error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: { id: true, name: true, username: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}