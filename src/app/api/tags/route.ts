import { NextRequest, NextResponse } from "next/server";
import * as tagService from "../services/tagservice";

export async function GET() {
  const tags = await tagService.getAllTags();
  return NextResponse.json(tags);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const tag = await tagService.createTag(body.name, body.slug);
  return NextResponse.json(tag);
}
