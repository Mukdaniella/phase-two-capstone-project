import { NextRequest, NextResponse } from "next/server";
import { posts } from "../route";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const post = posts.find(p => p.id === params.id);
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const index = posts.findIndex(p => p.id === params.id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  posts[index] = { ...posts[index], ...body, updatedAt: new Date().toISOString() };
  return NextResponse.json(posts[index]);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const index = posts.findIndex(p => p.id === params.id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  posts[index].status = "deleted"; // soft delete
  return NextResponse.json({ message: "Post deleted" });
}
