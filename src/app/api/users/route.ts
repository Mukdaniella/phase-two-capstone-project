import { NextRequest, NextResponse } from "next/server";
import * as userService from "../services/userservice";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("id");
  if (userId) {
    const user = await userService.getUserById(userId);
    return NextResponse.json(user);
  }
  const users = await userService.getAllUsers();
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const user = await userService.createUser(body);
  return NextResponse.json(user);
}
