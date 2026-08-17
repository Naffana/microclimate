// app/api/admin/source/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  sqlSelectDevice,
  sqlInsertDevice,
} from "../../../lib/edit/device";

export async function GET() {
  const rows = await sqlSelectDevice();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await sqlInsertDevice(body);
  // можно вернуть созданную строку, например перечитать из базы
  const rows = await sqlSelectDevice();
  const last = rows[rows.length - 1];
  return NextResponse.json(last);
}