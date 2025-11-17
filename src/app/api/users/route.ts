import { NextRequest, NextResponse } from "next/server";
import * as userService from "../services/userservice";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("id");
  if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });
  const user = await userService.getUserById(userId);
  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const user = await userService.createUser(body);
  return NextResponse.json(user);
}
