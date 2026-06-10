// app/api/db-check/route.ts
import { NextResponse } from 'next/server';
import { connect } from '../../lib/db';


export async function GET() {
  try {
    const pool = await connect();
    const result = await pool.request().query('SELECT 1 AS ok');

    return NextResponse.json({
      status: 'ok',
      db: result.recordset[0]?.ok,
    });
  } catch (err: any) {
    console.error('DB connection error:', err);
    return NextResponse.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}