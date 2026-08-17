// lib/adminTablesConfigs.ts
import type { TableConfig } from "./tableConfig";
import type { Source, NormyRow, Device, ListRoles, type as TypeRow } from "../lib/definitions";

// Source (комнаты)
export const sourceConfig: TableConfig = {
  title: "Комнаты / Source",
  formFields: [
    { key: "Ip", label: "IP", type: "string" },
    { key: "Name", label: "Название", type: "string" },
    { key: "Is_Panel", label: "Панель", type: "boolean" },
  ],
  displayFields: [
    { key: "Ip", label: "IP", type: "string" },
    { key: "Name", label: "Название", type: "string" },
    { key: "Is_Panel", label: "Панель", type: "boolean" },
  ],
};

// Normy (нормы): Source и Type должны быть select
// options для Source и Type будем подставлять динамически на странице
export function makeNormyConfig(
  sourceOptions: { value: number; label: string }[],
  typeOptions: { value: number; label: string }[]
): TableConfig {
  return {
    title: "Нормы / Normy",

    displayFields: [
      { key: "Source_Name", label: "Комната", type: "string" },
      { key: "Type_Name", label: "Тип измерения", type: "string" },
      { key: "Min_Value", label: "Мин. значение", type: "number" },
      { key: "Max_Value", label: "Макс. значение", type: "number" },
      { key: "Delta", label: "Дельта", type: "number" },
    ],

    // форма редактирования/добавления использует ID
    formFields: [
      {
        key: "Id_Source",
        label: "Комната",
        type: "select",
        options: sourceOptions,
      },
      {
        key: "Id_Type",
        label: "Тип измерения",
        type: "select",
        options: typeOptions,
      },
      { key: "Min_Value", label: "Мин. значение", type: "number" },
      { key: "Max_Value", label: "Макс. значение", type: "number" },
      { key: "Delta", label: "Дельта", type: "number" },
    ],
  };
}

// Device: Source — выбор из списка
export function makeDeviceConfig(
  sourceOptions: { value: number; label: string }[]
): TableConfig {
  return {
    title: "Устройства / Device",

    // таблица: только имя комнаты и параметры
    displayFields: [
      { key: "Source", label: "Комната", type: "string" }, // имя из JOIN
      { key: "Slave_Id", label: "Slave ID", type: "number" },
      { key: "Name", label: "Название", type: "string" },
      { key: "In_Out", label: "Вход/Выход", type: "string" },
    ],

    formFields: [
      {
        key: "Id_Source",
        label: "Комната",
        type: "select",
        options: sourceOptions,
      },
      { key: "Slave_Id", label: "Slave ID", type: "number" },
      { key: "Name", label: "Название", type: "string" },
      { key: "In_Out", label: "Вход/Выход", type: "string" },
    ],
  };
}

// Роли (Auth)
export const rolesConfig: TableConfig = {
  title: "Роли / Auth",
  formFields: [
    { key: "Role", label: "Роль", type: "string" },
    { key: "Password", label: "Пароль (хэш)", type: "string" },
  ],
  displayFields: [
    { key: "Role", label: "Роль", type: "string" },
    { key: "Password", label: "Пароль (хэш)", type: "string" },
  ],
};

export const typeConfig: TableConfig = {
  title: "Типы измерения / Type",
  formFields: [
    { key: "Type_Name", label: "Название типа", type: "string" },
    { key: "Register", label: "№ рег. датчика", type: "number" },
    { key: "Register_Panel", label: "№ рег. панели", type: "number"},
  ],
  displayFields: [
    { key: "Type_Name", label: "Название типа", type: "string" },
    { key: "Register", label: "№ рег. датчика", type: "number" },
    { key: "Register_Panel", label: "№ рег. панели", type: "number"},
  ],
};