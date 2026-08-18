"use client";

import React, { useState, useMemo, useEffect } from "react";

import { SimpleAreaChart } from "./Area";
import type { SourceCharts } from "../../lib/data";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

export function Area_map({ sources, start, end, isLoading }: { sources: SourceCharts[], start: Date, end: Date, isLoading?: boolean }) {
  // Группируем источники по IP
  const sourcesByIp = useMemo(() => {
    const map = new Map<string, SourceCharts[]>();

    sources.forEach(source => {
      const ip = source.ip;
      const existing = map.get(ip);
      if (existing) {
        existing.push(source);
      } else {
        map.set(ip, [source]);
      }
    });

    return Array.from(map.entries()).map(([ip, items]) => ({
      ip,
      items,
    }));
  }, [sources]);

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [xDomains, setXDomains] = useState<Record<string, [number, number]>>({});
  const [fullRanges, setFullRanges] = useState<Record<string, [number, number]>>({});
  const [hoveredInfo, setHoveredInfo] = useState<Record<string, { ts: number, x: number, w: number } | null>>({});

  // Несколько типовых разрешений экрана компьютера
  const [screenH, setScreenH] = useState<number>(768);
  useEffect(() => {
    const update = () => setScreenH(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Вариации масштаба в зависимости от высоты экрана
  const scale = screenH < 800
    ? { header: "text-base lg:text-lg 2xl:text-xl", typeTitle: "text-xs lg:text-sm 2xl:text-base", srcLabel: "text-[10px] lg:text-xs" }      // 768p / мелкие ноутбуки
    : screenH < 950
    ? { header: "text-lg lg:text-xl 2xl:text-2xl", typeTitle: "text-sm lg:text-base 2xl:text-lg", srcLabel: "text-xs lg:text-sm" }           // 900p
    : screenH < 1200
    ? { header: "text-xl lg:text-2xl 2xl:text-3xl", typeTitle: "text-base lg:text-lg 2xl:text-xl", srcLabel: "text-sm lg:text-base" }         // 1080p
    : { header: "text-2xl lg:text-3xl 2xl:text-4xl", typeTitle: "text-lg lg:text-xl 2xl:text-2xl", srcLabel: "text-base lg:text-lg" };       // 1440p+

  const toggleSource = (ip: string) => {
    setOpenMap((prev) => ({
      ...prev,
      [ip]: !(prev[ip] ?? true),
    }));
  };

  return (
    <div className="flex flex-col h-full">
      {sourcesByIp.map((sourceGroup, index) => {
        const open = openMap[sourceGroup.ip] ?? true;
        const info = hoveredInfo[sourceGroup.ip] ?? null;

        // Собираем уникальные типы измерений по всем source в этой IP-группе
        const allTypes = Array.from(
          new Set(sourceGroup.items.flatMap(s => s.charts.map(c => c.type)))
        );

        return (
          <div key={index} className={clsx("flex flex-col shrink-0 snap-start", open ? "flex-1 min-h-0" : "")}>
            <button type="button"
              onClick={() => toggleSource(sourceGroup.ip)}
              className="flex items-center cursor-pointer shrink-0">
              <h2 className={clsx("font-bold", scale.header)}>{sourceGroup.items.map(s => s.source).join('\\')}</h2>
              <ChevronDownIcon
                className={clsx("h-4 w-4 text-gray-700 mt-1 ml-1 transition-transform duration-200 ",
                  { 'rotate-0': open, 'rotate-90': !open })}
              />
            </button>
            {open && (
              <div className="flex flex-col flex-1 min-h-0 gap-2 py-2">
                {/* По каждому типу измерения - строка, которая делит доступную высоту экрана */}
                {allTypes.map((typeName, typeIndex) => (
                  <div key={typeIndex} className="flex flex-col flex-1 min-h-0 gap-1">
                    <h3 className={clsx("font-semibold shrink-0", scale.typeTitle)}>{typeName}</h3>
                    <div className="flex flex-row flex-1 min-h-0 gap-4">
                      {sourceGroup.items.map((src, srcIndex) => {
                        const chart = src.charts.find(c => c.type === typeName);
                        return (
                          <div key={srcIndex} className="flex flex-col flex-1 min-w-0 min-h-0">
                            <p className={clsx("text-gray-500 mb-1 shrink-0", scale.srcLabel)}>{src.source}</p>
                            <div className="flex-1 min-h-0">
                              {chart && chart.data.length > 0 ? (
                                <SimpleAreaChart
                                  data={chart.data.map((p: { time: string; value: number; device: string; deviceName?: string; }) => ({
                                    time: p.time,
                                    ts: new Date(p.time).getTime(),
                                    temp: p.value,
                                    device: p.device,
                                    deviceName: p.deviceName || ''
                                  }))}
                                  start={start}
                                  end={end}
                                  type={chart.type}
                                  min={chart.min}
                                  max={chart.max}
                                  xDomain={xDomains[sourceGroup.ip]}
                                  fullRange={fullRanges[sourceGroup.ip]}
                                  onFullRangeChange={(d) => setFullRanges(prev => ({ ...prev, [sourceGroup.ip]: d }))}
                                  onXDomainChange={(d) => setXDomains(prev => ({ ...prev, [sourceGroup.ip]: d }))}
                                  hoveredTs={info?.ts ?? null}
                                  hoveredX={info?.x}
                                  containerWidth={info?.w}
                                  onTooltipChange={(i) => setHoveredInfo(prev => ({ ...prev, [sourceGroup.ip]: i }))}
                                  isLoading={isLoading}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-white rounded-lg shadow">
                                  Нет данных
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}