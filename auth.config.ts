import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connect } from "@/app/lib/db";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        Role: { label: "Role", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const role = credentials.Role;
        const password = credentials.password;

        if (typeof role !== "string" || typeof password !== "string") {
          return null;
        }

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
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.Password);
        if (!isValid) return null;

        return {
          id: String(user.ID),
          role: user.Role,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string | undefined;
        (session.user as any).id = token.id as string | undefined;
      }
      return session;
    },
  },
};