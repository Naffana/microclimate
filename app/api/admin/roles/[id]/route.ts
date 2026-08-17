// app/api/admin/source/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  sqlUpdateRole,
  sqlDeleteRole,
  sqlSelectRoles,
} from "../../../../lib/edit/roles";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const numId = Number(id);
  const body = await req.json();
  await sqlUpdateRole(numId, body);
  const rows = await sqlSelectRoles();
  const updated = rows.find((r) => r.id === numId);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  await sqlDeleteRole(Number(id));
  return NextResponse.json({ ok: true });
}