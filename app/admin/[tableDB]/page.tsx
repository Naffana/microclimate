// app/admin/[tableDB]/page.tsx
import { TableWithForm } from "../../ui/Admin/AdminTable";
import {
  sourceConfig,
  makeNormyConfig,
  makeDeviceConfig,
  rolesConfig,
  typeConfig,
} from "../../lib/tablesConfigs";
import { 
  sqlSelectSource
   } from "../../lib/edit/source";
import {
  sqlSelectNormy
} from "../../lib/edit/normy";
import {
  sqlSelectDevice
} from "../../lib/edit/device";
import {
  sqlSelectRoles
} from "../../lib/edit/roles";
import { sqlSelectTypes } from "@/app/lib/edit/type";

type Props = { params: Promise<{ tableDB: string }> };

export default async function AdminTablePage({ params }: Props) {
  const { tableDB } = await params;

  switch (tableDB) {

    case "type": {
    const rows = await sqlSelectTypes();
    return (
      <TableWithForm
        config={typeConfig}
        rows={rows}
        tableKey="type"
      />
    );
  }
  
    case "source": {
      const rows = await sqlSelectSource();
      return (
        <TableWithForm
          config={sourceConfig}
          rows={rows}
          tableKey="source"
        />
      );
    }

    case "normy": {
      const sources = await sqlSelectSource();
      const sourceOptions = sources.map((s) => ({
        value: s.Id_Source,
        label: s.Name,
      }));

      const normyRows = await sqlSelectNormy();
      const typeOptions: { value: number; label: string }[] = normyRows
        .map((n) => ({ value: n.Id_Type, label: n.Type_Name }))
        .filter(
          (value, index, self) =>
            self.findIndex((v) => v.value === value.value) === index
        );

      const config = makeNormyConfig(sourceOptions, typeOptions);

      return (
        <TableWithForm
          config={config}
          rows={normyRows}
          tableKey="normy"
        />
      );
    }

    case "device": {
      const sources = await sqlSelectSource();
      const sourceOptions = sources.map((s) => ({
        value: s.Id_Source,
        label: s.Name,
      }));

      const deviceRows = await sqlSelectDevice();
      const config = makeDeviceConfig(sourceOptions);

      return (
        <TableWithForm
          config={config}
          rows={deviceRows}
          tableKey="device"
        />
      );
    }

    case "roles": {
      const rows = await sqlSelectRoles();
      return (
        <TableWithForm
          config={rolesConfig}
          rows={rows}
          tableKey="roles"
        />
      );
    }

    default:
      return <div>Неизвестная таблица: {tableDB}</div>;
  }
}