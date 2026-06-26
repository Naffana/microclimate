// CustomToolTip.tsx
import React from "react";

type CustomTooltipProps = {
  active?: boolean;
  label?: any;
  payload?: any[];
};

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  label,
  payload,
}) => {
  if (!active || !payload || !payload.length) return null;

  // label = ts (начало минуты)
  const d = new Date(label);

  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow">
      {/* верхняя строка: дата/время минуты */}
      <div className="mb-1 text-center font-semibold text-gray-900">
        {Number.isNaN(d.getTime())
          ? String(label)
          : d.toLocaleString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "UTC",
            })}
      </div>
      <div className="text-xs font-medium text-center w-full">Датчики</div>
        <div className="flex flex-row">
        {payload.map((entry) => (
            <div key={entry.dataKey} className="flex items-center gap-1 mr-2">
            <span
                className="inline-block h-0.5 w-3 "
                style={{ backgroundColor: entry.color }}
            />
            <span style={{color: entry.color}}>{`${entry.name}:`}</span>
            <span className="font-medium text-gray-900">
                {typeof entry.value === "number"
                ? entry.value.toFixed(1)
                : entry.value}
            </span>
            </div>
        ))}
        </div>
    </div>
  );
};