import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const data: any = {};
  if (body.title) data.title = body.title;
  if (body.content) data.content = body.content;
  if (body.coverImageUrl) data.coverImageUrl = body.coverImageUrl;
  if ("isPublished" in body) {
    data.isPublished = body.isPublished;
    data.publishedAt = body.isPublished ? new Date() : null;
  }

  const updated = await prisma.post.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('Deleting post with ID:', id);
    
    await prisma.$transaction([
      prisma.comment.deleteMany({ where: { postId: id } }),
      prisma.like.deleteMany({ where: { postId: id } }),
      prisma.bookmark.deleteMany({ where: { postId: id } }),
      prisma.postTag.deleteMany({ where: { postId: id } }),
      prisma.post.delete({ where: { id } })
    ]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete post' }, { status: 500 });
  }
}
