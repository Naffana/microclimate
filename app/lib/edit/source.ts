// lib/sql/adminSource.ts
import { connect } from "../db";
import type { Source } from "../definitions";
import sql from "mssql";

export async function sqlSelectSource(): Promise<(Source & { id: number })[]> {
  const pool = await connect();
  const result = await pool.request().query<Source>(`
    SELECT Id_Source, Ip, Name, Is_Panel
    FROM Source
  `);
 
  return result.recordset.map((row) => ({ ...row, id: row.Id_Source }));
}

export async function sqlInsertSource(data: Partial<Source>) {
  const pool = await connect();
  await pool
    .request()
    .input("Ip", sql.NVarChar, data.Ip)
    .input("Name", sql.NVarChar, data.Name)
    .input("Is_Panel", sql.Bit, data.Is_Panel ?? false)
    .query(`
      INSERT INTO Source (Ip, Name, Is_Panel)
      VALUES (@Ip, @Name, @Is_Panel)
    `);
}

export async function sqlUpdateSource(id: number, data: Partial<Source>) {
  const pool = await connect();
  await pool
    .request()
    .input("Id_Source", sql.Int, id)
    .input("Ip", sql.NVarChar, data.Ip)
    .input("Name", sql.NVarChar, data.Name)
    .input("Is_Panel", sql.Bit, data.Is_Panel)
    .query(`
      UPDATE Source
      SET
        Ip = COALESCE(@Ip, Ip),
        Name = COALESCE(@Name, Name),
        Is_Panel = COALESCE(@Is_Panel, Is_Panel)
      WHERE Id_Source = @Id_Source
    `);
}

export async function sqlDeleteSource(id: number) {
  const pool = await connect();
  await pool
    .request()
    .input("Id_Source", sql.Int, id)
    .query(`
      DELETE FROM Event WHERE ID_Source = @Id_Source;
      DELETE FROM Source WHERE Id_Source = @Id_Source;
    `);
}
