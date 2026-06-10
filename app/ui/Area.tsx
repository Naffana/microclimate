"use client";

import React, { useState, useEffect } from "react";

// Подавление предупреждения recharts о размерах контейнера
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    args[0]?.includes?.("The width") &&
    args[0]?.includes?.("height") &&
    args[0]?.includes?.("should be greater than 0")
  ) {
    return;
  }
  originalWarn.apply(console, args);
};

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  DataKey,
  LegendPayload
} from "recharts";
import { CustomTooltip } from "./CustomToolTip";
import { buildTicks, combineByMinute } from "../lib/actions";
import { CombinedPoint, Props } from "../lib/definitions";


const MS_DAY = 24 * 60 * 60 * 1000;

export function SimpleAreaChart({ data, start, end, min, max}: Props) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const [hoveringDataKey, setHoveringDataKey] =
  useState<string | undefined>(undefined);

const handleLegendMouseEnter = (payload: any) => {
  setHoveringDataKey(payload.dataKey as string);
};

const handleLegendMouseLeave = () => {
  setHoveringDataKey(undefined);
};
  
  const { devices, combined } = React.useMemo(
    () => combineByMinute(data),
    [data]
  );

  const { domain, ticksV, ticks } = buildTicks(min, max, new Date(data[0].time), new Date(data[data.length - 1].time));

  const showDateAndTime = end.getTime() - start.getTime() > MS_DAY;

  const formatXAxis = (raw: any, index: number) => {
     const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return String(raw);

    if (!showDateAndTime) {
      return d.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone:"UTC"
      });
    }

    const thisDay = d.toISOString().slice(0, 10);
    const timeLabel = d.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone:"UTC"
    });

    if (index === 0) {
      return d.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC"
      });
    }

    const prevTs = ticks[index - 1];
    const prevDay = new Date(prevTs).toISOString().slice(0, 10);

    if (prevDay !== thisDay) {
      // сменился день → дата+время
      return d.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC"
      });
    }
    return timeLabel;
  };
  
   if (!isMounted) {
    return (
      <div className="w-full h-64 bg-white rounded-lg shadow flex items-center justify-center text-gray-400 text-sm">
        Загрузка информации...
      </div>
    );
  }
  const colors = ["#F97373", "#60A5FA", "#34D399", "#A855F7"];
  
  return (
    <div className="w-full 2xl:h-100 lg:h-70  bg-white rounded-lg shadow">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart<CombinedPoint>
          data={combined} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
          {/* Сетка */}
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          {/* Ось X */}
          <XAxis
            dataKey="ts"
            type="number"
            tick={{ fontSize: 13, fill: "#6B7280" }}
            ticks={ticks}
            domain={[ticks[0], ticks[ticks.length - 1]]}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatXAxis}
          />

          {/* Ось Y с °C */}
          <YAxis
            domain={domain}
            tick={{fontSize: 13, fill: "#6B7280" }}
            tickLine={false}
            axisLine={false}
            ticks={ticksV}
            tickFormatter={(v: number) => `${v} `}
            width={40}
          />

          <ReferenceLine y={min} stroke="#22C55E" strokeDasharray="4 4" />
          <ReferenceLine y={max} stroke="#EF4444" strokeDasharray="4 4" />
          
          {/* Tooltip */}
          <Tooltip
            content={<CustomTooltip/>}
          />

          {/* Градиент */}
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
            </linearGradient>
          </defs>
            
            <Legend
              onMouseEnter={handleLegendMouseEnter}
              onMouseLeave={handleLegendMouseLeave} 
              verticalAlign="bottom"
              align="center"
              iconType="plainline"
              wrapperStyle={{cursor:"pointer", fontSize: 16}}
            />

          {/* Линия + заливка */}
           {devices.map((deviceId, idx) => {
              const isHovered = hoveringDataKey === deviceId;

              // если что-то ховерим и это НЕ текущий девайс — делаем его бледным
              const opacity =
                hoveringDataKey && !isHovered
                  ? 0.3 // бледные остальные
                  : 1;  // нормальный, либо ничего не ховерят
            return(
                  <Area
                    key={deviceId}
                    type="monotone"
                    dataKey={deviceId}
                    stroke={colors[idx % colors.length]}
                    strokeWidth={2}
                    strokeOpacity={opacity}
                    fill="none"
                    activeDot={false}
                    name={deviceId}
                    isAnimationActive={false}
                  />
                )})}
          
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}