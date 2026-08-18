// lib/sql/adminType.ts
import { connect } from "../db";
import sql from "mssql";
import type { TypeRow } from "../definitions";


export async function sqlSelectTypes(): Promise<(TypeRow & { id: number })[]> {
  const pool = await connect();

  const result = await pool.request().query<TypeRow>(`
    SELECT
      Id_Type     AS ID_Type,
      Name        AS Type_Name,
      Register,
      Register_Panel
    FROM Type
  `);


  return result.recordset.map((row) => ({
    ...row,
    id: row.ID_Type,
  }));
}

// INSERT: добавить новый тип
export async function sqlInsertType(data: Partial<TypeRow>) {
  const pool = await connect();

  await pool
    .request()
    .input("Name", sql.NVarChar, data.Type_Name)
    .input("Register", sql.Int, data.Register)
    .input("Register_Panel", sql.Int, data.Register_Panel)
    .query(`
      INSERT INTO Type (Name,Register,Register_Panel)
      VALUES (@Name,@Register,@Register_Panel)
    `);
}

// UPDATE: изменить существующий тип
export async function sqlUpdateType(id: number, data: Partial<TypeRow>) {
  const pool = await connect();

  await pool
    .request()
    .input("Id_Type", sql.Int, id)
    .input("Name", sql.NVarChar, data.Type_Name)
    .input("Register", sql.Int, data.Register)
    .input("Register_Panel", sql.Int, data.Register_Panel)
    .query(`
      UPDATE Type
      SET Name = COALESCE(@Name, Name),
       Register = COALESCE(@Register, Register),
       Register_Panel = COALESCE(@Register_Panel, Register_Panel)
      WHERE Id_Type = @Id_Type
    `);
}

// DELETE: удалить тип
export async function sqlDeleteType(id: number) {
  const pool = await connect();

  await pool
    .request()
    .input("Id_Type", sql.Int, id)
    .query(`
      DELETE FROM Event WHERE ID_Type = @Id_Type;
      DELETE FROM Type WHERE Id_Type = @Id_Type;
    `);
}
