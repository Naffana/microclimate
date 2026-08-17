// lib/sql/adminNormy.ts
import { connect } from "../db";
import sql from "mssql";
import { NormyRow } from "../definitions";


export async function sqlSelectNormy(): Promise<(NormyRow & { id: number })[]> {
  const pool = await connect();
  const result = await pool.request().query<NormyRow>(`
    SELECT
      Normy.Id_Norm,
      Normy.Id_Source,
      Normy.Id_Type,
      Normy.Min_Value,
      Normy.Max_Value,
      Normy.Delta,
      Source.Name AS Source_Name,
      Type.Name AS Type_Name
    FROM Normy
    JOIN Source ON Source.Id_Source = Normy.Id_Source
    JOIN Type ON Type.Id_Type = Normy.Id_Type
  `);
  return result.recordset.map((row) => ({ ...row, id: row.Id_Norm }));
}

export async function sqlInsertNormy(data: Partial<NormyRow>) {
  const pool = await connect();
  await pool
    .request()
    .input("Id_Source", sql.Int, data.Id_Source)
    .input("Id_Type", sql.Int, data.Id_Type)
    .input("Min_Value", sql.Float, data.Min_Value)
    .input("Max_Value", sql.Float, data.Max_Value)
    .input("Delta", sql.Float, data.Delta)
    .query(`
      INSERT INTO Normy (Id_Source, Id_Type, Min_Value, Max_Value, Delta)
      VALUES (@Id_Source, @Id_Type, @Min_Value, @Max_Value, @Delta)
    `);
}

export async function sqlUpdateNormy(id: number, data: Partial<NormyRow>) {
  const pool = await connect();
  await pool
    .request()
    .input("Id_Norm", sql.Int, id)
    .input("Id_Source", sql.Int, data.Id_Source)
    .input("Id_Type", sql.Int, data.Id_Type)
    .input("Min_Value", sql.Float, data.Min_Value)
    .input("Max_Value", sql.Float, data.Max_Value)
    .input("Delta", sql.Float, data.Delta)
    .query(`
      UPDATE Normy
      SET
        Id_Source = COALESCE(@Id_Source, Id_Source),
        Id_Type   = COALESCE(@Id_Type, Id_Type),
        Min_Value = COALESCE(@Min_Value, Min_Value),
        Max_Value = COALESCE(@Max_Value, Max_Value),
        Delta     = COALESCE(@Delta, Delta)
      WHERE Id_Norm = @Id_Norm
    `);
}

export async function sqlDeleteNormy(id: number) {
  const pool = await connect();
  await pool
    .request()
    .input("Id_Norm", sql.Int, id)
    .query(`DELETE FROM Normy WHERE Id_Norm = @Id_Norm`);
}