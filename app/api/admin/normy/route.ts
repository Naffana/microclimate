// app/api/admin/source/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  sqlSelectNormy,
  sqlInsertNormy,
} from "../../../lib/edit/normy";

export async function GET() {
  const rows = await sqlSelectNormy();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await sqlInsertNormy(body);
  // можно вернуть созданную строку, например перечитать из базы
  const rows = await sqlSelectNormy();
  const last = rows[rows.length - 1];
  return NextResponse.json(last);
}