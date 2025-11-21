import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const data: any = {};
  if (body.title) data.title = body.title;
  if (body.content) data.content = body.content;
  if (body.coverImageUrl) data.coverImageUrl = body.coverImageUrl;
  if ("isPublished" in body) {
    data.isPublished = body.isPublished;
    data.publishedAt = body.isPublished ? new Date() : null;
  }

  const updated = await prisma.post.update({ where: { id: params.id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  // Soft delete by marking unpublished
  const post = await prisma.post.update({
    where: { id: params.id },
    data: { isPublished: false },
  });
  return NextResponse.json({ ok: true, post });
}
