import sql from "mssql";

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER!,    
  port: parseInt(process.env.DB_PORT!),
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true, 
  },
};

let poolPromise: Promise<sql.ConnectionPool> | null = null;

export async function connect() {
  try {
    if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
  } catch (err) {
    console.error("SQL connection error:", err);
    throw err;
  }
}

export {sql};