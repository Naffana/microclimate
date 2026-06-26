// app/api/info/info_refresh.tsx
"use client";

import { useEffect, useState } from "react";
import type { event } from "../../lib/definitions";
import Table from "@/app/ui/table/table";

type Props = {
  id_type: number;
  type: string;
  source: number;
  dateFrom?: string;
  dateTo?: string;
  min: number;
  max: number;
};

export function TableClient({id_type, type, source, dateFrom, dateTo, min, max }: Props) {
  const [rows, setRows] = useState<event[]>([]);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        params.set("ID_Type", String(id_type));
        params.set("source", String(source));
        if (dateFrom) params.set("dateFrom", dateFrom);
        if (dateTo) params.set("dateTo", dateTo);

        const res = await fetch(`/api/info?${params.toString()}`, {
          cache: "no-store",
        });
        
        if (!res.ok) {
          console.error("ошибка запроса к данным таблицы", res.status);
          return;
        }

        const json = (await res.json()) as event[];

        if (!cancelled) {
          setRows(json);
        }
      } catch (e) {
        console.error("Ошибка обновления данных", e);
      }
    };

    fetchData();
    const id = setInterval(fetchData, 600_000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [id_type, source, dateFrom, dateTo]);

  return (
    <Table
      rows={rows}
      type={type}
      source={source}
      min={min}
      max={max}
    />
  );
}