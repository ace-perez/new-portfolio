require('newrelic');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Ensure DB_PATH directory exists before requiring the db module
const fs = require('fs');
const dbDir = path.dirname(process.env.DB_PATH || path.join(__dirname, 'data', 'blog.db'));
fs.mkdirSync(dbDir, { recursive: true });

const authRouter = require('./routes/auth');
const postsRouter = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────────────────────────

// In production nginx proxies /api/ to this service, so CORS isn't needed
// for same-origin requests. This permissive config is for local dev only.
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman) and whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    console.error(`[api] CORS blocked origin: "${origin}"`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));

// ── Routes ────────────────────────────────────────────────────────────────────

app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter);

// Health check — used by Docker and nginx upstream checks
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 catch-all for unrecognised API paths
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[api] Blog API running on port ${PORT}`);
  console.log(`[api] DB path: ${process.env.DB_PATH || path.join(__dirname, 'data', 'blog.db')}`);
});
