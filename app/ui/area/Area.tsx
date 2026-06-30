"use client";

import React, { useState, useEffect, useRef } from "react";

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
import { buildTicks, combineByMinute, generateTicksForRange } from "../../lib/actions";
import { CombinedPoint, Props } from "../../lib/definitions";


const MS_DAY = 24 * 60 * 60 * 1000;

export function SimpleAreaChart({ data, start, end, min, max, xDomain: xDomainProp, onXDomainChange, hoveredTs, hoveredX, containerWidth: containerWidthProp, onTooltipChange }: Props) {
  
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const [hoveringDataKey, setHoveringDataKey] =
  useState<string | undefined>(undefined);
  const [isLocalHover, setIsLocalHover] = useState(false);

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

  const { domain, ticksV, ticks } = React.useMemo(
    () => buildTicks(min, max, new Date(data[0].time), new Date(data[data.length - 1].time)),
    [min, max, data]
  );

  const [localXDomain, setLocalXDomain] = useState<[number, number]>([
    ticks[0],
    ticks[ticks.length - 1],
  ]);

  const xDomain = xDomainProp ?? localXDomain;

  const commitXDomain = React.useCallback((d: [number, number]) => {
    if (onXDomainChange) {
      onXDomainChange(d);
    } else {
      setLocalXDomain(d);
    }
  }, [onXDomainChange]);
  const commitXDomainRef = useRef(commitXDomain);
  commitXDomainRef.current = commitXDomain;

  useEffect(() => {
    const full: [number, number] = [ticks[0], ticks[ticks.length - 1]];
    if (onXDomainChange) {
      onXDomainChange(full);
    } else {
      setLocalXDomain(full);
    }
  }, [ticks[0], ticks[ticks.length - 1]]);

  const viewTicks = React.useMemo(() => {
    const all = generateTicksForRange(xDomain[0], xDomain[1]);
    if (all.length <= 2) return all;
    const range = xDomain[1] - xDomain[0];
    const margin = range*0.01;
    return all.filter(t => t > xDomain[0] + margin && t < xDomain[1] - margin);
  }, [xDomain[0], xDomain[1]]);

  const containerRef = useRef<HTMLDivElement>(null);
  const xDomainRef = useRef(xDomain);
  xDomainRef.current = xDomain;
  const ticksRef = useRef(ticks);
  ticksRef.current = ticks;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = el.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;

      const [min, max] = xDomainRef.current;
      const fullMin = ticksRef.current[0];
      const fullMax = ticksRef.current[ticksRef.current.length - 1];
      const cursorTs = min + ratio * (max - min);

      const range = max - min;
      const step = range * 0.1;

      if (e.deltaY < 0) {
        const newRange = range - 2 * step;
        if (newRange > (fullMax - fullMin) * 0.01) {
          commitXDomainRef.current([
            cursorTs - ratio * newRange,
            cursorTs + (1 - ratio) * newRange,
          ]);
        }
      } else {
        let newMin = cursorTs - ratio * (range + 2 * step);
        let newMax = cursorTs + (1 - ratio) * (range + 2 * step);
        if (newMin < fullMin) { newMax += fullMin - newMin; newMin = fullMin; }
        if (newMax > fullMax) { newMin -= newMax - fullMax; newMax = fullMax; }
        if (newMin < fullMin) newMin = fullMin;
        commitXDomainRef.current([newMin, newMax]);
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [isMounted]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let dragging = false;
    let startX = 0;
    let startDomain: [number, number] = [0, 0];

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startDomain = [...xDomainRef.current];
      el.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;

      const rect = el.getBoundingClientRect();
      const pixelDelta = e.clientX - startX;
      const timeDelta = (pixelDelta / rect.width) * (startDomain[1] - startDomain[0]);

      const fullMin = ticksRef.current[0];
      const fullMax = ticksRef.current[ticksRef.current.length - 1];
      let newMin = startDomain[0] - timeDelta;
      let newMax = startDomain[1] - timeDelta;

      if (newMin < fullMin) { newMax += fullMin - newMin; newMin = fullMin; }
      if (newMax > fullMax) { newMin -= newMax - fullMax; newMax = fullMax; }
      if (newMin < fullMin) newMin = fullMin;

      commitXDomainRef.current([newMin, newMax]);
    };

    const onMouseUp = () => {
      if (!dragging) return;
      dragging = false;
      el.style.cursor = "";
      document.body.style.userSelect = "";
    };

    el.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [isMounted]);

  const showDateAndTime = end.getTime() - start.getTime() > MS_DAY;

  const formatXAxis = (raw: any, index: number): string => {
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return String(raw);

    if (!showDateAndTime) {
      return d.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC"
      });
    }

    const dateLabel = d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      timeZone: "UTC"
    });
    const timeLabel = d.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC"
    });

    if (index === 0) {
      return dateLabel + "\n" + timeLabel;
    }

    const prevTs = viewTicks[index - 1];
    const prevDay = new Date(prevTs).toISOString().slice(0, 10);

    if (prevDay !== d.toISOString().slice(0, 10)) {
      return dateLabel + "\n" + timeLabel;
    }
    return timeLabel;
  };

  const CustomXTick = ({ x, y, payload }: any) => {
    const text = formatXAxis(payload.value, viewTicks.indexOf(payload.value));
    const lines = text.split("\n");
    return (
      <g>
        <text x={x} y={y} dy={16} textAnchor="middle" fontSize={13} fill="#6B7280">
          {lines.map((line: string, i: number) => (
            <tspan key={i} x={x} dy={i === 0 ? 0 : 16}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  };
  const colors = ["#F97373", "#60A5FA", "#34D399", "#A855F7"];

  const findClosest = React.useCallback((ts: number): CombinedPoint | null => {
    if (combined.length === 0) return null;
    let best = combined[0];
    let bestDist = Math.abs(best.ts - ts);
    for (let i = 1; i < combined.length; i++) {
      const dist = Math.abs(combined[i].ts - ts);
      if (dist < bestDist) {
        bestDist = dist;
        best = combined[i];
      }
    }
    return best;
  }, [combined]);

  const syncedPoint = React.useMemo(() => {
    if (hoveredTs == null) return null;
    return findClosest(hoveredTs);
  }, [hoveredTs, findClosest]);

  const syncedPayload = React.useMemo(() => {
    if (!syncedPoint) return [];
    return devices.map((d, i) => ({
      name: d,
      value: (syncedPoint as any)[d],
      dataKey: d,
      color: colors[i % colors.length],
      payload: syncedPoint,
    }));
  }, [syncedPoint, devices]);

  const onTooltipChangeRef = useRef(onTooltipChange);
  onTooltipChangeRef.current = onTooltipChange;
  const setIsLocalHoverRef = useRef(setIsLocalHover);
  setIsLocalHoverRef.current = setIsLocalHover;
  const combinedRef = useRef(combined);
  combinedRef.current = combined;
  const xDomainForTooltipRef = useRef(xDomain);
  xDomainForTooltipRef.current = xDomain;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const CHART_LEFT = 40;
    const CHART_RIGHT_MARGIN = 20;

    const handleTooltipMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const chartAreaWidth = rect.width - CHART_LEFT - CHART_RIGHT_MARGIN;

      if (mouseX < CHART_LEFT || mouseX > rect.width - CHART_RIGHT_MARGIN) {
        setIsLocalHoverRef.current(false);
        onTooltipChangeRef.current?.(null);
        return;
      }

      setIsLocalHoverRef.current(true);
      const ratio = (mouseX - CHART_LEFT) / chartAreaWidth;
      const [dMin, dMax] = xDomainForTooltipRef.current;
      const ts = dMin + ratio * (dMax - dMin);

      const data = combinedRef.current;
      if (data.length === 0) return;
      let best = data[0];
      let bestDist = Math.abs(best.ts - ts);
      for (let i = 1; i < data.length; i++) {
        const dist = Math.abs(data[i].ts - ts);
        if (dist < bestDist) { bestDist = dist; best = data[i]; }
      }

      onTooltipChangeRef.current?.({
        ts: best.ts,
        x: mouseX,
        w: rect.width,
      });
    };

    const handleTooltipLeave = () => {
      setIsLocalHoverRef.current(false);
      onTooltipChangeRef.current?.(null);
    };

    el.addEventListener("mousemove", handleTooltipMove);
    el.addEventListener("mouseleave", handleTooltipLeave);
    return () => {
      el.removeEventListener("mousemove", handleTooltipMove);
      el.removeEventListener("mouseleave", handleTooltipLeave);
    };
  }, [isMounted]);

   if (!isMounted) {
    return (
      <div className="w-full h-64 bg-white rounded-lg shadow flex items-center justify-center text-gray-400 text-sm">
        Загрузка информации...
      </div>
    );
  }
  
  return (
    <div className="w-full h-full bg-white rounded-lg shadow"
    ref={containerRef}
    style={{ cursor: "grab", position: "relative" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart<CombinedPoint>
          data={combined} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
        >
          {/* Сетка */}
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          {/* Ось X */}
          <XAxis
            dataKey="ts"
            type="number"
            tick={<CustomXTick />}
            ticks={viewTicks}
            domain={xDomain}
            allowDataOverflow
            tickLine={false}
            axisLine={false}
            interval={0}
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
            allowDataOverflow
          />

          <ReferenceLine y={min} stroke="#22C55E" strokeDasharray="4 4" />
          <ReferenceLine y={max} stroke="#EF4444" strokeDasharray="4 4" />
          
          {hoveredTs != null && (
            <ReferenceLine x={hoveredTs} stroke="#9CA3AF" strokeDasharray="3 3" />
          )}

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

              const opacity =
                hoveringDataKey && !isHovered
                  ? 0.3
                  : 1;
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
      {hoveredTs != null && syncedPoint && (
        <div
          style={{
            position: "absolute",
            left: hoveredX ?? 0,
            top: 0,
            transform: (containerWidthProp ?? 0) > 0 && (hoveredX ?? 0) > (containerWidthProp ?? 0) * 0.65
              ? "translateX(calc(-100% - 12px))"
              : "translateX(12px)",
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          <CustomTooltip active label={hoveredTs} payload={syncedPayload} />
        </div>
      )}
    </div>
  );
}