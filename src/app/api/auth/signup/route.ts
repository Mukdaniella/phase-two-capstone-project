import { NextRequest, NextResponse } from "next/server";
import * as authService from "../../services/authservice";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, username, email, password } = body;

  
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "All fields (name, username, email, password) are required" },
        { status: 400 }
      );
    }

    const { user, token } = await authService.signup({
      name,
      username,
      email,
      password,
    });

    return NextResponse.json(
      { message: "Signup successful", user, token },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 400 }
    );
  }
}