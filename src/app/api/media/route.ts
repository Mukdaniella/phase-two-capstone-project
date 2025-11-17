import { NextRequest, NextResponse } from "next/server";
import * as mediaService from "../services/mediaservice";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const media = await mediaService.getUserMedia(userId);
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  const { userId, url, type } = await req.json();
  const media = await mediaService.uploadMedia(userId, url, type);
  return NextResponse.json(media);
}
