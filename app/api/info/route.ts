// app/api/info/route.ts
import { NextResponse } from "next/server";
import { fetchInfo } from "@/app/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const typeStr = searchParams.get("ID_Type");
  const sourceStr = searchParams.get("source");
  const dateFrom = searchParams.get("dateFrom") ?? undefined;
  const dateTo = searchParams.get("dateTo") ?? undefined;

  if (!typeStr || !sourceStr) {
    return NextResponse.json(
      { error: "Тип измерения и источник не получены" },
      { status: 400 }
    );
  }

  const source = Number(sourceStr);
  if (Number.isNaN(source)) {
    return NextResponse.json(
      { error: "источник не число" },
      { status: 400 }
    );
  }

const type = Number(typeStr);
  if (Number.isNaN(type)) {
    return NextResponse.json(
      { error: "тип не число" },
      { status: 400 }
    );
  }

  const rows = await fetchInfo(type, source, dateFrom, dateTo);
  
  
  return NextResponse.json(rows);
}