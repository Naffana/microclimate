// app/api/admin/source/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  sqlUpdateSource,
  sqlDeleteSource,
  sqlSelectSource,
} from "../../../../lib/edit/source";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const numId = Number(id);
  const body = await req.json();
  await sqlUpdateSource(numId, body);
  const rows = await sqlSelectSource();
  const updated = rows.find((r) => r.id === numId);
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  await sqlDeleteSource(Number(id));
  return NextResponse.json({ ok: true });
}
