import { NextRequest, NextResponse } from "next/server";
import * as followService from "../services/followservice";

export async function POST(req: NextRequest) {
  const { followerId, followingId } = await req.json();
  const follow = await followService.followUser(followerId, followingId);
  return NextResponse.json(follow);
}

export async function DELETE(req: NextRequest) {
  const { followerId, followingId } = await req.json();
  const unfollow = await followService.unfollowUser(followerId, followingId);
  return NextResponse.json(unfollow);
}
