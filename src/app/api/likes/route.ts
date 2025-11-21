import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "../../lib/prisma";

export async function POST(req: Request) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await req.json();

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: (token.id || token.sub) as string
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      return NextResponse.json({ liked: false });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId: (token.id || token.sub) as string
        }
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}