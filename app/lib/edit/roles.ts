// lib/sql/adminRoles.ts
import { connect } from "../db";
import sql from "mssql";
import type { ListRoles } from "../definitions";
import bcrypt from "bcrypt";

export async function sqlSelectRoles(): Promise<(ListRoles[0] & { id: number })[]> {
  const pool = await connect();
  const result = await pool.request().query<ListRoles[0]>(`
    SELECT DISTINCT Auth.ID, Auth.Role, Auth.Password
    FROM Auth
  `);
  return result.recordset.map((row) => ({ ...row, id: row.ID }));
}

const SALT_ROUNDS = 10;

export async function sqlInsertRole(data: Partial<ListRoles[0]>) {
  const pool = await connect();

  const hashed =
    data.Password && data.Password !== ""
      ? await bcrypt.hash(data.Password, SALT_ROUNDS)
      : null;

  await pool
    .request()
    .input("Role", sql.NVarChar, data.Role)
    .input("Password", sql.NVarChar, hashed)
    .query(`
      INSERT INTO Auth (Role, Password)
      VALUES (@Role, @Password)
    `);
}

export async function sqlUpdateRole(id: number, data: Partial<ListRoles[0]>) {
  const pool = await connect();

  const hashed =
    data.Password && data.Password !== ""
      ? await bcrypt.hash(data.Password, SALT_ROUNDS)
      : null;

  await pool
    .request()
    .input("ID", sql.Int, id)
    .input("Role", sql.NVarChar, data.Role)
    .input("Password", sql.NVarChar, hashed)
    .query(`
      UPDATE Auth
      SET
        Role = COALESCE(@Role, Role),
        Password = COALESCE(@Password, Password)
      WHERE ID = @ID
    `);
}

export async function sqlDeleteRole(id: number) {
  const pool = await connect();
  await pool
    .request()
    .input("ID", sql.Int, id)
    .query(`DELETE FROM Auth WHERE ID = @ID`);
}