import { NextRequest, NextResponse } from "next/server";
import * as bookmarkService from "../services/bookmarkservice";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const bookmarks = await bookmarkService.getBookmarksByUser(userId);
  return NextResponse.json(bookmarks);
}

export async function POST(req: NextRequest) {
  const { userId, postId } = await req.json();
  const bookmark = await bookmarkService.bookmarkPost(userId, postId);
  return NextResponse.json(bookmark);
}

export async function DELETE(req: NextRequest) {
  const { userId, postId } = await req.json();
  const removed = await bookmarkService.removeBookmark(userId, postId);
  return NextResponse.json(removed);
}
