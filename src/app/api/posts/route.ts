import { NextRequest, NextResponse } from "next/server";
import * as postService from "../services/postservice";

export async function GET(req: NextRequest) {
  const posts = await postService.getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const post = await postService.createPost(body);
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...data } = body;
  const post = await postService.updatePost(id, data);
  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  const deleted = await postService.deletePost(id);
  return NextResponse.json(deleted);
}
