import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "../../lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
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
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, slug, coverImageUrl, excerpt, isPublished, publishedAt } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    const finalSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug: finalSlug,
        coverImageUrl,
        excerpt,
        isPublished: isPublished || false,
        publishedAt: isPublished ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
        authorId: (token.id || token.sub) as string
      },
      include: {
        author: {
          select: { id: true, name: true, username: true }
        }
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}