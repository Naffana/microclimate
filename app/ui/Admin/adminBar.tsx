"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


const tables = [
  { key: "device", label: "Устройства (Device)" },
  { key: "type", label: "Типы измерения (Type)" },
  { key: "source", label: "Комнаты (Source)" },
  { key: "normy", label: "Нормы (Normy)" },
  { key: "roles", label: "Роли (Auth)" },
];

export function AdminTopBar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-secondary m-auto px-4 py-2">
      <nav className="flex gap-2">
        {tables.map((table) => {
          const href = `/admin/${table.key}`;
          const isActive = pathname.startsWith(href);

          return (
            <Link key={table.key} href={href} prefetch={true}>
              <button
                className={
                  "px-3 py-1 rounded border text-sm " +
                  (isActive
                    ? "bg-accent text-white border-accent"
                    : "bg-secondary text-text border-border hover:bg-border")
                }
              >
                {table.label}
              </button>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}