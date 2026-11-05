"use client";

import { useState } from "react";
import type { event } from "../../lib/definitions";

type ExportType = {
  ID_Type: number;
  Type_Name: string;
  ID_Source: number;
  Min_Value: number;
  Max_Value: number;
};

type Props = {
  sourceName: string;
  dateFrom?: string;
  dateTo?: string;
  types: ExportType[];
};

// Форматирование совпадает с твоим Table.tsx
function formatDate(value: event["Date"]): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

// Сегодняшняя дата для названия файла и подписей.
// Если сервер определяет текущий день не в UTC,
// здесь нужно указать тот же часовой пояс, что и на сервере.
function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function ExportExcelButton({
  sourceName,
  dateFrom,
  dateTo,
  types,
}: Props) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  async function handleExport() {
    if (exporting || types.length === 0) {
      return;
    }

    setExporting(true);
    setError("");

    try {
      const XLSX = await import("xlsx-js-style");

      const today = getToday();

      // Эти значения используются только для подписей.
      // Логику отбора данных по умолчанию оставляем в API.
      const hasSelectedPeriod = Boolean(dateFrom || dateTo);

      const periodFrom = hasSelectedPeriod
        ? dateFrom || "Без ограничения"
        : today;

      const periodTo = hasSelectedPeriod
        ? dateTo || "Без ограничения"
        : today;

      const workbook = XLSX.utils.book_new();

      for (const [index, type] of types.entries()) {
        const params = new URLSearchParams();

        params.set("ID_Type", String(type.ID_Type));
        params.set("source", String(type.ID_Source));

        // Если даты пустые, ничего не подставляем:
        // API сам отберёт текущий день.
        if (dateFrom) {
          params.set("dateFrom", dateFrom);
        }

        if (dateTo) {
          params.set("dateTo", dateTo);
        }

        const response = await fetch(
          `/api/info?${params.toString()}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(
            `Не удалось загрузить "${type.Type_Name}". ` +
              `Код ответа: ${response.status}`
          );
        }

        const rows = (await response.json()) as event[];

        if (!Array.isArray(rows)) {
          throw new Error(
            `Некорректный ответ API для "${type.Type_Name}".`
          );
        }

        const content: (string | number | null)[][] = [
          ["Источник", sourceName],
          ["Тип измерения", type.Type_Name],
          ["Минимум", type.Min_Value],
          ["Максимум", type.Max_Value],
          ["Период с", periodFrom],
          ["Период по", periodTo],
          [],
          ["Дата", "Значение", "Название", "ID устройства"],
        ];

        for (const row of rows) {
          content.push([
            formatDate(row.Date),
            row.Value ?? null,
            row.Name ?? "",
            row.Slave_ID ?? null,
          ]);
        }

        const worksheet = XLSX.utils.aoa_to_sheet(content);

        worksheet["!cols"] = [
          { wch: 24 },
          { wch: 18 },
          { wch: 35 },
          { wch: 24 },
        ];

        // Подписи над таблицей
        for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
          const labelAddress = XLSX.utils.encode_cell({
            r: rowIndex,
            c: 0,
          });

          const labelCell = worksheet[labelAddress];

          if (labelCell) {
            labelCell.s = {
              font: {
                bold: true,
                color: { rgb: "315D86" },
              },
              alignment: {
                vertical: "center",
              },
            };
          }
        }

        const headerRowIndex = 7;
        const firstDataRowIndex = 8;

        // Заголовки столбцов
        for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
          const address = XLSX.utils.encode_cell({
            r: headerRowIndex,
            c: columnIndex,
          });

          const cell = worksheet[address];

          if (cell) {
            cell.s = {
              fill: {
                patternType: "solid",
                fgColor: { rgb: "315D86" },
              },
              font: {
                bold: true,
                color: { rgb: "FFFFFF" },
              },
              alignment: {
                horizontal: "center",
                vertical: "center",
                wrapText: true,
              },
            };
          }
        }

        // Строки измерений и выделение значений вне нормы
        rows.forEach((row, rowIndex) => {
          const value = row.Value;

          const isOutOfRange =
            typeof value === "number" &&
            Number.isFinite(value) &&
            (value < type.Min_Value || value > type.Max_Value);

          for (
            let columnIndex = 0;
            columnIndex < 4;
            columnIndex++
          ) {
            const address = XLSX.utils.encode_cell({
              r: firstDataRowIndex + rowIndex,
              c: columnIndex,
            });

            // Создаём пустую ячейку при необходимости,
            // чтобы заливка покрывала всю строку.
            const cell = worksheet[address] ?? {
              t: "s",
              v: "",
            };

            cell.s = {
              alignment: {
                horizontal: "center",
                vertical: "center",
                wrapText: true,
              },

              ...(columnIndex === 3
                ? { numFmt: "0.00" }
                : {}),

              ...(isOutOfRange
                ? {
                    fill: {
                      patternType: "solid",
                      fgColor: { rgb: "C62828" },
                    },
                    font: {
                      bold: true,
                      color: { rgb: "FFFFFF" },
                    },
                  }
                : {}),
            };

            worksheet[address] = cell;
          }
        });

        // Фильтр по столбцам Excel
        if (rows.length > 0) {
          worksheet["!autofilter"] = {
            ref: `A8:D${8 + rows.length}`,
          };
        }

        // Уникальное имя листа, не длиннее 31 символа
        const prefix = `${index + 1}. `;

        const cleanTypeName = type.Type_Name
          .replace(/[\\/?*[\]:']/g, "_")
          .trim();

        const sheetName =
          prefix +
          (cleanTypeName || "Данные").slice(
            0,
            31 - prefix.length
          );

        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          sheetName
        );
      }

      const safeSourceName = sourceName
        .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_")
        .trim()
        .slice(0, 80);

      const periodName = !hasSelectedPeriod
        ? today
        : dateFrom && dateFrom === dateTo
          ? dateFrom
          : [
              dateFrom || "начало",
              dateTo || "конец",
            ].join("_");

      const fileName = [
        safeSourceName || "Данные",
        periodName,
      ].join("_");

      XLSX.writeFile(workbook, `${fileName}.xlsx`, {
        compression: true,
      });
    } catch (error) {
      console.error("Ошибка экспорта Excel:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Не удалось сформировать Excel-файл."
      );
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleExport}
        disabled={exporting || types.length === 0}
        className="
          rounded-lg bg-green-700 px-4 py-2 mb-4 text-white
          hover:bg-green-800
          disabled:cursor-not-allowed disabled:opacity-50
        "
      >
        {exporting
          ? "Выгрузка данных..."
          : "Скачать все таблицы в Excel"}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}