#!/usr/bin/env node
/**
 * setup-secrets.js
 *
 * Interactive helper to generate the .env file for the blog API.
 * Run once on the server (or locally) before starting the API.
 *
 * Usage:
 *   node setup-secrets.js
 */

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

async function main() {
  console.log('\n🔐  Blog API Secret Setup\n');

  const username = (await ask('Admin username: ')).trim();
  const password = (await ask('Admin password: ')).trim();

  if (!username || !password) {
    console.error('Username and password are required.');
    process.exit(1);
  }

  console.log('\nHashing password (bcrypt, cost 12)...');
  const hash = await bcrypt.hash(password, 12);
  const jwtSecret = crypto.randomBytes(48).toString('hex');

  const env = [
    `ADMIN_USERNAME=${username}`,
    `ADMIN_PASSWORD_HASH=${hash}`,
    `JWT_SECRET=${jwtSecret}`,
    `DB_PATH=/app/data/blog.db`,
    `ALLOWED_ORIGINS=http://localhost:5173`,
  ].join('\n');

  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, env + '\n', { mode: 0o600 });

  console.log(`\n✅  Written to ${envPath}`);
  console.log('   Keep this file safe — it contains your admin password hash and JWT secret.');
  console.log('   It is gitignored and will never be committed.\n');

  rl.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
