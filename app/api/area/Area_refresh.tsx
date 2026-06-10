// app/ui/Area_refresh.tsx
"use client";

import { useEffect, useState } from "react";
import { Area_map } from "../../ui/area-map";
import type { SourceCharts } from "../../lib/data";

type Props = {
  initialData: SourceCharts[];
  start: Date;
  end: Date;
  dateFrom?: string;
  dateTo?: string;
};

export function AreaMapClient({ initialData, start, end, dateFrom, dateTo }: Props) {
  const [sources, setSources] = useState<SourceCharts[]>(initialData);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (dateFrom) params.set("dateFrom", dateFrom);
        if (dateTo) params.set("dateTo", dateTo);

        const res = await fetch(`/api/area?${params.toString()}`, {
          cache: "no-store",
        });
        if (!res.ok) return;

        const json = (await res.json()) as SourceCharts[];
        if (!cancelled) {
          setSources(json);
        }
      } catch (e) {
        console.error("Failed to refresh area info", e);
      }
    };

   
    fetchData();

    
    const id = setInterval(fetchData, 600_000);
    
    return () => {
      
      cancelled = true;
      clearInterval(id);
    };
  }, [dateFrom, dateTo]);

  return <Area_map sources={sources} start={start} end={end} />;
}