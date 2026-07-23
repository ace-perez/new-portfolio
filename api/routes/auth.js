const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

/**
 * POST /api/auth/login
 * Body: { username: string, password: string }
 * Returns: { token: string }
 *
 * Credentials are compared against ADMIN_USERNAME and ADMIN_PASSWORD_HASH
 * environment variables — never stored in the database or the codebase.
 *
 * To generate a hash for your password, run once in node:
 *   node -e "const b=require('bcryptjs'); console.log(b.hashSync('yourpassword', 12))"
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const expectedUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!expectedUsername || !passwordHash || !jwtSecret) {
    console.error('[auth] Missing ADMIN_USERNAME, ADMIN_PASSWORD_HASH, or JWT_SECRET env vars.');
    return res.status(500).json({ error: 'Server misconfiguration.' });
  }

  const usernameMatch = username === expectedUsername;
  const passwordMatch = await bcrypt.compare(password, passwordHash);

  if (!usernameMatch || !passwordMatch) {
    // Uniform error — don't reveal which field was wrong
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    jwtSecret,
    { expiresIn: '7d' }
  );

  res.json({ token });
});

/**
 * POST /api/auth/verify
 * Lightweight endpoint the frontend can hit to check if a stored token is still valid.
 * Returns 200 OK with { valid: true } or 401.
 */
router.post('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) return res.status(401).json({ valid: false });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
