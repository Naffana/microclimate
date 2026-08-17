// app/api/admin/source/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  sqlSelectRoles,
  sqlInsertRole,
} from "../../../lib/edit/roles";

export async function GET() {
  const rows = await sqlSelectRoles();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await sqlInsertRole(body);
  // можно вернуть созданную строку, например перечитать из базы
  const rows = await sqlSelectRoles();
  const last = rows[rows.length - 1];
  return NextResponse.json(last);
}