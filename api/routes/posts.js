const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// ── Helpers ───────────────────────────────────────────────────────────────────

function deserializePost(row) {
  if (!row) return null;
  return {
    ...row,
    tags: JSON.parse(row.tags || '[]'),
    published: row.published === 1,
  };
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ── Public routes ─────────────────────────────────────────────────────────────

/**
 * GET /api/posts
 * Returns all published posts, newest first.
 */
router.get('/', (req, res) => {
  const rows = db
    .prepare(`SELECT * FROM blog_posts WHERE published = 1 ORDER BY created_at DESC`)
    .all();
  res.json(rows.map(deserializePost));
});

/**
 * GET /api/posts/:slug
 * Returns a single published post by slug.
 */
router.get('/:slug', (req, res) => {
  const row = db
    .prepare(`SELECT * FROM blog_posts WHERE slug = ? AND published = 1`)
    .get(req.params.slug);

  if (!row) return res.status(404).json({ error: 'Post not found.' });
  res.json(deserializePost(row));
});

// ── Admin routes (JWT required) ────────────────────────────────────────────────

/**
 * GET /api/posts/admin/all
 * Returns ALL posts (published + drafts), newest first. Admin only.
 */
router.get('/admin/all', requireAuth, (req, res) => {
  const rows = db
    .prepare(`SELECT * FROM blog_posts ORDER BY created_at DESC`)
    .all();
  res.json(rows.map(deserializePost));
});

/**
 * POST /api/posts
 * Create a new post. Admin only.
 * Body: { title, excerpt, content, tags[], published, read_time }
 */
router.post('/', requireAuth, (req, res) => {
  const { title, excerpt = '', content = '', tags = [], published = false, read_time = '' } = req.body;

  if (!title) return res.status(400).json({ error: 'Title is required.' });

  let slug = slugify(title);

  // Ensure slug uniqueness
  const existing = db.prepare(`SELECT id FROM blog_posts WHERE slug = ?`).get(slug);
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const now = new Date().toISOString();
  const result = db.prepare(`
    INSERT INTO blog_posts (slug, title, excerpt, content, tags, published, read_time, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(slug, title, excerpt, content, JSON.stringify(tags), published ? 1 : 0, read_time, now, now);

  const post = db.prepare(`SELECT * FROM blog_posts WHERE id = ?`).get(result.lastInsertRowid);
  res.status(201).json(deserializePost(post));
});

/**
 * PUT /api/posts/:slug
 * Update an existing post. Admin only.
 * Body: any subset of { title, excerpt, content, tags[], published, read_time }
 */
router.put('/:slug', requireAuth, (req, res) => {
  const current = db.prepare(`SELECT * FROM blog_posts WHERE slug = ?`).get(req.params.slug);
  if (!current) return res.status(404).json({ error: 'Post not found.' });

  const {
    title = current.title,
    excerpt = current.excerpt,
    content = current.content,
    tags = JSON.parse(current.tags),
    published = current.published === 1,
    read_time = current.read_time,
  } = req.body;

  const now = new Date().toISOString();

  db.prepare(`
    UPDATE blog_posts
    SET title = ?, excerpt = ?, content = ?, tags = ?, published = ?, read_time = ?, updated_at = ?
    WHERE slug = ?
  `).run(title, excerpt, content, JSON.stringify(tags), published ? 1 : 0, read_time, now, req.params.slug);

  const updated = db.prepare(`SELECT * FROM blog_posts WHERE slug = ?`).get(req.params.slug);
  res.json(deserializePost(updated));
});

/**
 * DELETE /api/posts/:slug
 * Permanently delete a post. Admin only.
 */
router.delete('/:slug', requireAuth, (req, res) => {
  const result = db.prepare(`DELETE FROM blog_posts WHERE slug = ?`).run(req.params.slug);
  if (result.changes === 0) return res.status(404).json({ error: 'Post not found.' });
  res.json({ success: true, slug: req.params.slug });
});

module.exports = router;
