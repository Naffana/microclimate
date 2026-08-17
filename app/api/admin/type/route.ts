// app/api/admin/source/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  sqlSelectTypes,
  sqlInsertType,
} from "../../../lib/edit/type";

export async function GET() {
  const rows = await sqlSelectTypes();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await sqlInsertType(body);
  // можно вернуть созданную строку, например перечитать из базы
  const rows = await sqlSelectTypes();
  const last = rows[rows.length - 1];
  return NextResponse.json(last);
}