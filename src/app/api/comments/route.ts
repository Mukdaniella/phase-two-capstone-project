import { NextRequest, NextResponse } from "next/server";
import * as commentService from "../services/commentservice";

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId");
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });
  const comments = await commentService.getCommentsByPost(postId);
  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const comment = await commentService.createComment(body);
  return NextResponse.json(comment);
}
