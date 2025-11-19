import { NextRequest, NextResponse } from "next/server";

// temporary in-memory storage
let posts: any[] = [];

export async function GET(req: NextRequest) {
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const { title, content, status, slug, image } = await req.json();
  const newPost = {
    id: Date.now().toString(),
    title,
    content,
    slug,
    status: status || "draft",
    image: image || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  posts.push(newPost);
  return NextResponse.json(newPost);
}

// helper for PUT & DELETE
export { posts };
