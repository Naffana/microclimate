// app/api/admin/source/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  sqlSelectSource,
  sqlInsertSource,
} from "../../../lib/edit/source";

export async function GET() {
  const rows = await sqlSelectSource();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await sqlInsertSource(body);
  // можно вернуть созданную строку, например перечитать из базы
  const rows = await sqlSelectSource();
  const last = rows[rows.length - 1];
  return NextResponse.json(last);
}