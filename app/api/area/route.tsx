// app/api/area-info/route.ts
import { NextResponse } from "next/server";
import { fetchAreaInfo } from "@/app/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get("dateFrom") ?? undefined;
  const dateTo = searchParams.get("dateTo") ?? undefined;

  const data = await fetchAreaInfo(dateFrom, dateTo);
  return NextResponse.json(data);
}