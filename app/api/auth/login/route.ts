import { NextResponse } from "next/server";
import { signIn } from "@/auth";
import bcrypt from "bcrypt";
import { connect } from "@/app/lib/db";

export async function POST(req: Request) {
  let role = "";
  try {
    const body = await req.json();
    role = body.role ?? "";
    const password = body.password ?? "";

    // Проверяем учётные данные вручную, чтобы signIn не бросил CredentialsSignin
    const pool = await connect();
    const result = await pool
      .request()
      .input("Role", role)
      .query(`
        SELECT ID, Role, Password
        FROM Auth
        WHERE Role = @Role
      `);

    const user = result.recordset[0];
    if (!user || !(await bcrypt.compare(password, user.Password))) {
      console.log(`[auth] Неверный пароль для роли "${role.trim()}"`);
      return NextResponse.json({ success: false });
    }

    // Учётные данные верны — signIn не бросит ошибку
    await signIn("credentials", {
      redirect: false,
      Role: role,
      password,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[auth] Ошибка при входе:", err);
    return NextResponse.json({ success: false });
  }
}