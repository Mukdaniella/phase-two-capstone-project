import { NextRequest, NextResponse } from "next/server";
import * as likeService from "../services/likeservice";

export async function POST(req: NextRequest) {
  const { postId, userId, count } = await req.json();
  const like = await likeService.likePost(postId, userId, count);
  return NextResponse.json(like);
}
