"use client";

import React from "react";
import type { TableConfig, TableField } from "../../lib/tableConfig";

type Row = { id: number | string; [key: string]: any };

type TableWithFormProps = {
  config: TableConfig;
  rows: Row[];
  tableKey: string; 
};

export function TableWithForm({ config, rows, tableKey }: TableWithFormProps) {
  const [mode, setMode] = React.useState<"create" | "edit" | null>(null);
  const [editingId, setEditingId] = React.useState<Row["id"] | null>(null);
  const [formData, setFormData] = React.useState<Partial<Row>>({});
  const [localRows, setLocalRows] = React.useState<Row[]>(rows);

  const startCreate = () => {
    setMode("create");
    setEditingId(null);
    setFormData({});
  };

  const startEdit = (row: Row) => {
    setMode("edit");
    setEditingId(row.id);
    setFormData(row);

    const { Password, ...rest } = row;
  setFormData({
    ...rest,
    Password: "",   // поле пароля в форме всегда пустое
  });
  };

  const cancel = () => {
    setMode(null);
    setEditingId(null);
    setFormData({});
  };

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Функция для обновления данных таблицы
  const refreshTableData = async () => {
    try {
      const res = await fetch(`/api/admin/${tableKey}`, {
        method: "GET",
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setLocalRows(data);
      }
    } catch (error) {
      console.error("Ошибка обновления таблицы:", error);
    }
  };

  const handleDelete = async (id: Row["id"]) => {
    // Сначала удаляем с сервера
    await fetch(`/api/admin/${tableKey}/${id}`, {
      method: "DELETE",
    });
    // Затем обновляем данные с сервера
    await refreshTableData();
    // И удаляем из локального состояния
    setLocalRows((prev) => prev.filter((row) => row.id !== id));
  };

  function renderCell(field: TableField, row: Row) {
  const value = row[field.key];

  if (field.key === "Password") {
    return "•".repeat(10); 
  }

  return String(value ?? "");
}

  const handleSubmit = async () => {

    if (config.title === "Роли / Auth") {
    const password = formData["Password"] as string | undefined;

    if ((!password || password.trim() === "")) {
      alert("Пароль не может быть пустым."); 
      return; 
    }
  }

    if (mode === "create") {
      const res = await fetch(`/api/admin/${tableKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
const newRow = await res.json();
      setLocalRows((prev) => [...prev, newRow]);
      await refreshTableData();
    } else if (mode === "edit" && editingId != null) {
      const res = await fetch(`/api/admin/${tableKey}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
const updated = await res.json();
      setLocalRows((prev) =>
        prev.map((row) => (row.id === editingId ? updated : row))
      );
      await refreshTableData();
    }
    cancel();
  };

  return (
    <div className="border border-border rounded p-4 w-full bg-secondary">
      <h2 className="font-semibold mb-2">{config.title}</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr>
              {config.displayFields.map((field) => (
                <th key={field.key} className="border border-border bg-accent text-white px-2 py-2 text-left">
                  {field.label}
                </th>
              ))}
              <th className="border border-border bg-accent text-white px-2 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {localRows.map((row) => (
              <tr key={String(row.id)}>
                {config.displayFields.map((field) => (
                  <td key={field.key} className="border border-border px-2 py-2 truncate">
                    {renderCell(field, row)}
                  </td>
                ))}
                <td className="border border-border px-2 py-2 whitespace-nowrap">
                  <button
                    className="text-accent hover:underline mr-2"
                    onClick={() => startEdit(row)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="text-accent-red hover:underline"
                    onClick={() => handleDelete(row.id)}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!mode && (
        <button
          className="text-white px-3 py-1 rounded hover:bg-primary bg-accent"
          onClick={startCreate}
        >
          Добавить
        </button>
      )}

      {mode && (
        <div className="border border-border rounded p-3 mt-2 bg-white">
          <h3 className="font-medium mb-2">{mode === "create" ? "Добавление" : "Редактирование"}</h3>
          <div className="flex flex-wrap gap-3 items-end">
            {config.formFields.map((field) => (
              <div key={field.key} className="flex flex-col">
                <label className="text-xs text-text mb-0.5">{field.label}</label>
                <FieldInput
                  field={field}
                  value={formData[field.key]}
                  onChange={(value) => handleChange(field.key, value)}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <button
                className="bg-accent text-white px-3 py-1 rounded hover:bg-primary"
                onClick={handleSubmit}
              >
                Сохранить
              </button>
              <button className="text-text border border-border px-3 py-1 rounded hover:bg-secondary" onClick={cancel}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function FieldInput({
  field,
  value,
  onChange,
}: {
  field: TableField;
  value: any;
  onChange: (value: any) => void;
}) {

  if (field.key === "Password") {
    return (
      <input
        type="password"
        className="border border-border px-1 py-0.5 rounded"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="new-password"
      />
    );
  }

  switch (field.type) {
    case "string":
      return (
        <input
          className="border border-border px-1 py-0.5 rounded"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "number":
      return (
        <input
          type="number"
          className="border border-border px-1 py-0.5 rounded"
          value={value ?? ""}
          onChange={(e) =>
            onChange(e.target.value === "" ? null : Number(e.target.value))
          }
        />
      );
    case "boolean":
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
      );
    case "select":
      return (
        <select
          className="border border-border px-1 py-0.5 rounded"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">—</option>
          {field.options?.map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    default:
      return <span>{String(value ?? "")}</span>;
  }
}