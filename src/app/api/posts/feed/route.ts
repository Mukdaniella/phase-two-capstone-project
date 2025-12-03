import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findMany({
      where: { 
        author: {
          followers: {
            some: {
              followerId: token.id as string
            }
          }
        }
      },
      include: {
        author: {
          select: { id: true, name: true, username: true }
        },
        Likes: {
          select: { userId: true }
        },
        _count: {
          select: { 
            Likes: true,
            comments: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' }
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
  }
}