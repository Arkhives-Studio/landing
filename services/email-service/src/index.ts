import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { z } from 'zod';

const requiredEnv = ['DATABASE_URL'] as const;
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️  Environment variable ${key} is not set. The service may fail to start.`);
  }
});

const app = express();
const port = Number(process.env.PORT) || 4000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined,
});

const emailSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim());

app.use(
  cors({
    origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : '*',
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/emails', async (req, res) => {
  const parseResult = emailSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid payload', details: parseResult.error.issues });
  }

  const { email, source } = parseResult.data;

  try {
    await pool.query(
      `INSERT INTO email_signups (email, source)
       VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET source = EXCLUDED.source, created_at = NOW()`,
      [email, source ?? null],
    );

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Failed to save email', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const ensureTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS email_signups (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      source TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
};

const start = async () => {
  try {
    await ensureTable();
    app.listen(port, () => {
      console.log(`Email service listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize service', error);
    process.exit(1);
  }
};

void start();
