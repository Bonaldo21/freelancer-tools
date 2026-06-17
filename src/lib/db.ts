import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

export default pool;

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email       TEXT UNIQUE NOT NULL,
      name        TEXT,
      image       TEXT,
      is_pro      BOOLEAN DEFAULT FALSE,
      pro_since   TIMESTAMPTZ,
      mp_ref      TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

export async function upsertUser(email: string, name?: string, image?: string) {
  const res = await pool.query(
    `INSERT INTO users (email, name, image)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name, image=EXCLUDED.image
     RETURNING *`,
    [email, name ?? null, image ?? null]
  );
  return res.rows[0];
}

export async function getUserByEmail(email: string) {
  const res = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
  return res.rows[0] ?? null;
}

export async function markUserAsPro(email: string, mpRef: string) {
  await pool.query(
    `UPDATE users SET is_pro=TRUE, pro_since=NOW(), mp_ref=$2 WHERE email=$1`,
    [email, mpRef]
  );
}
