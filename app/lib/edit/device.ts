// lib/sql/adminDevice.ts
import { connect } from "../db";
import type { Device } from "../definitions";
import sql from "mssql";

export async function sqlSelectDevice(): Promise<(Device & { id: number })[]> {
  const pool = await connect();

  const result = await pool.request().query<{
    Id_Device: number;
    Id_Source: number;
    Source: string;
    Slave_Id: number;
    Name: string;
    In_Out: string;
  }>(`
    SELECT
      Device.Id_Device,
      Device.Id_Source,
      Source.Name   AS Source,
      Device.Slave_Id,
      Device.Name   AS Name,
      Device.In_Out
    FROM Device
    JOIN Source ON Source.Id_Source = Device.Id_Source
  `);

  return result.recordset.map((row) => ({
    Id_Device: row.Id_Device,
    Id_Source: row.Id_Source,
    Source: row.Source,
    Slave_Id: row.Slave_Id,
    Name: row.Name,
    In_Out: row.In_Out,
    id: row.Id_Device,    
  }));
}

export async function sqlInsertDevice(data: Partial<Device>) {
  const pool = await connect();
  await pool
    .request()
    .input("Id_Source", sql.Int, data.Id_Source)
    .input("Slave_Id", sql.Int, data.Slave_Id)
    .input("Name", sql.NVarChar, data.Name)
    .input("In_Out", sql.NVarChar, data.In_Out)
    .query(`
      INSERT INTO Device (Id_Source, Slave_Id, Name, In_Out)
      VALUES (@Id_Source, @Slave_Id, @Name, @In_Out)
    `);
}

export async function sqlUpdateDevice(id: number, data: Partial<Device>) {
  const pool = await connect();
  await pool
    .request()
    .input("Id_Device", sql.Int, id)
    .input("Id_Source", sql.Int, data.Id_Source)
    .input("Slave_Id", sql.Int, data.Slave_Id)
    .input("Name", sql.NVarChar, data.Name)
    .input("In_Out", sql.NVarChar, data.In_Out)
    .query(`
      UPDATE Device
      SET
        Id_Source = COALESCE(@Id_Source, Id_Source),
        Slave_Id = COALESCE(@Slave_Id, Slave_Id),
        Name = COALESCE(@Name, Name),
        In_Out = COALESCE(@In_Out, In_Out)
      WHERE Id_Device = @Id_Device
    `);
}

export async function sqlDeleteDevice(id: number) {
  const pool = await connect();
  await pool
    .request()
    .input("Id_Device", sql.Int, id)
    .query(`DELETE FROM Device WHERE Id_Device = @Id_Device`);
}