import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import { z } from 'zod';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const requiredEnv = ['DATABASE_URL'] as const;
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(
      `⚠️  Environment variable ${key} is not set. The service may fail to start.`,
    );
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

const listEmailsSchema = z.object({
  limit: z.coerce.number().int().positive().max(1000).optional(),
});

const defaultOrigins = [
  'http://localhost:3000',
  'https://arkhives-studio.github.io',
  'https://arkhives-studio.github.io/landing/',
];

const envOrigins =
  process.env.CORS_ORIGIN?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const allowedOrigins = Array.from(new Set([...envOrigins, ...defaultOrigins]));

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : undefined,
  }),
);

app.use(express.json());

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Arkhives Email Signup API',
    version: '1.0.0',
    description: 'API for collecting email signups across Arkhives audiences.',
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Local development server',
    },
    {
      url:
        process.env.SERVICE_PUBLIC_URL ??
        'https://arkhives-studio.github.io/landing',
      description: 'Public deployment',
    },
  ],
  tags: [
    {
      name: 'Status',
      description: 'Service status endpoints',
    },
    {
      name: 'Emails',
      description: 'Email signup endpoints',
    },
  ],
  components: {
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },
        },
      },
      EmailSignupRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'player@example.com',
          },
          source: {
            type: 'string',
            example: 'gamers',
          },
        },
      },
      EmailSignup: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'player@example.com',
          },
          source: {
            type: 'string',
            nullable: true,
            example: 'gamers',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      EmailListResponse: {
        type: 'object',
        properties: {
          count: {
            type: 'integer',
            example: 1,
          },
          emails: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/EmailSignup',
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Invalid payload',
          },
          details: {
            type: 'array',
            items: {
              type: 'object',
            },
            nullable: true,
          },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Status'],
        summary: 'Service health check',
        responses: {
          200: {
            description: 'Service is up',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse',
                },
              },
            },
          },
        },
      },
    },
    '/emails': {
      post: {
        tags: ['Emails'],
        summary: 'Capture an email signup',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/EmailSignupRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Email stored successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/EmailSignup',
                },
              },
            },
          },
          400: {
            description: 'Invalid payload',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
      get: {
        tags: ['Emails'],
        summary: 'Retrieve recently captured email signups',
        parameters: [
          {
            in: 'query',
            name: 'limit',
            schema: {
              type: 'integer',
              minimum: 1,
              maximum: 1000,
              default: 1000,
            },
            description: 'Maximum number of records to return (default 1000)',
          },
        ],
        responses: {
          200: {
            description: 'List of email signups',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/EmailListResponse',
                },
              },
            },
          },
          400: {
            description: 'Invalid query parameters',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJsdoc({ definition: swaggerDefinition, apis: [] });

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

/**
 * @openapi
 * /emails:
 *   post:
 *     tags: [Emails]
 *     summary: Capture an email signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               source:
 *                 type: string
 *                 example: gamers
 *     responses:
 *       201:
 *         description: Email stored successfully
 *       400:
 *         description: Invalid payload
 *       500:
 *         description: Internal server error
 */
app.post('/emails', async (req, res) => {
  const parseResult = emailSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ error: 'Invalid payload', details: parseResult.error.issues });
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

/**
 * @openapi
 * /emails:
 *   get:
 *     tags: [Emails]
 *     summary: Retrieve recently captured email signups
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
           minimum: 1
           maximum: 1000
         description: Maximum number of records to return (default 1000)
     responses:
       200:
         description: List of email signups
         content:
           application/json:
             schema:
               type: object
               properties:
                 count:
                   type: integer
                 emails:
                   type: array
                   items:
                     type: object
                     properties:
                       id:
                         type: integer
                       email:
                         type: string
                         format: email
                       source:
                         type: string
                         nullable: true
                       created_at:
                         type: string
                         format: date-time
       400:
         description: Invalid query parameters
       500:
         description: Internal server error
 */
app.get('/emails', async (req, res) => {
  const parseResult = listEmailsSchema.safeParse(req.query);
  if (!parseResult.success) {
    return res
      .status(400)
      .json({ error: 'Invalid query', details: parseResult.error.issues });
  }

  const { limit = 1000 } = parseResult.data;

  try {
    const result = await pool.query(
      `SELECT id, email, source, created_at
       FROM email_signups
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit],
    );

    res.json({ count: result.rowCount, emails: result.rows });
  } catch (error) {
    console.error('Failed to fetch emails', error);
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
