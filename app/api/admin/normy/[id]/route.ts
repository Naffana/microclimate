// app/api/admin/source/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  sqlUpdateNormy,
  sqlDeleteNormy,
  sqlSelectNormy,
} from "../../../../lib/edit/normy";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const body = await req.json();
  await sqlUpdateNormy(id, body);
  const rows = await sqlSelectNormy();
  const updated = rows.find((r) => r.id === id);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id: idStr } = await params;
  await sqlDeleteNormy(Number(idStr));
  return NextResponse.json({ ok: true });
}