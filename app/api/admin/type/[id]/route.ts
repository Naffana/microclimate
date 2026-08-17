// app/api/admin/source/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  sqlUpdateType,
  sqlDeleteType,
  sqlSelectTypes,
} from "../../../../lib/edit/type";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const body = await req.json();
  await sqlUpdateType(id, body);
  const rows = await sqlSelectTypes();
  const updated = rows.find((r) => r.id === id);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) { 
  const { id: idStr } = await params;
  await sqlDeleteType(Number(idStr));
  return NextResponse.json({ ok: true });
}