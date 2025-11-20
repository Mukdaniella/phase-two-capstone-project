import { NextRequest, NextResponse } from "next/server";
import * as authService from "../../services/authservice";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const { user, token } = await authService.login(email, password);

    return NextResponse.json(
      { message: "Login successful", user, token },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 401 }
    );
  }
}