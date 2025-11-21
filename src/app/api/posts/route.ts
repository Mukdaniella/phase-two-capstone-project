import { NextResponse } from "next/server";
import { createPost } from "../services/postservice";

export async function POST(req: Request) {
  try {
    const { title, content, slug, coverImageUrl, authorId, isPublished, tagIds } = await req.json();

    if (!title || !content || !slug || !authorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const post = await createPost({ title, content, slug, coverImageUrl, authorId, isPublished, tagIds });

    return NextResponse.json(post, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
