// app/ui/room-charts.tsx
"use client";

import { SimpleAreaChart } from "./Area";
import type { SourceCharts } from "../lib/data";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export function Area_map({ sources, start, end}: { sources: SourceCharts[], start:Date, end: Date}) {
 const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggleSource = (sourceName: string) => {
    setOpenMap((prev) => ({
      ...prev,
      [sourceName]: !prev[sourceName],
    }));
  };

  return (
    <div className="space-y-6">
      {sources.map((source, index) => {
        const open = openMap[source.source] ?? true;
        return(
        <div key={index} className="space-y-4">
          <button type="button"
        onClick={() => toggleSource(source.source)}
        className="flex items-center cursor-pointer">
            <h2 className="lg:text-lg 2xl:text-2xl font-bold">{source.source}</h2>
            <ChevronDownIcon
              className={clsx("h-4 w-4 text-gray-700 mt-1 ml-1 transition-transform duration-200 ",
                {'rotate-0': open,
                 'rotate-90': !open
                })}
              />
          </button>
          {open && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {source.charts.map((chart, index) => (
              <div key={index} className="flex flex-col mr-4">
                <div className="flex flex-row justify-between lg:text-sm 2xl:text-lg font-semibold mx-2">
                <h3 className=" mb-1">{chart.type}</h3>
                <p className="italic">Норма: {chart.min} - {chart.max}</p>
                </div>
                <SimpleAreaChart
                  data={chart.data.map((p) => ({
                    time: p.time,
                    ts: new Date(p.time).getTime(),
                    temp: p.value,
                    device: p.device
                  }))}
                  start={start}
                  end = {end}
                  min={chart.min}
                  max={chart.max}
                />
              </div>
            ))}
          </div>
          )}
        </div>
      )})}
    </div>
  );
}