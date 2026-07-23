/**
 * api.js — Thin fetch wrapper for the blog API.
 *
 * In production, nginx routes /api/* to the Express container — same origin, no CORS.
 * In dev, Vite proxies /api/* to localhost:3001.
 */

const BASE = '/api';

function getToken() {
  return localStorage.getItem('admin_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json', ...authHeaders() };
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function login(username, password) {
  const data = await request('POST', '/auth/login', { username, password });
  localStorage.setItem('admin_token', data.token);
  return data;
}

export function logout() {
  localStorage.removeItem('admin_token');
}

export async function verifyToken() {
  if (!getToken()) return false;
  try {
    await request('POST', '/auth/verify');
    return true;
  } catch {
    logout();
    return false;
  }
}

export function isLoggedIn() {
  return Boolean(getToken());
}

// ── Public blog posts ─────────────────────────────────────────────────────────

export function fetchPosts() {
  return request('GET', '/posts');
}

export function fetchPost(slug) {
  return request('GET', `/posts/${slug}`);
}

// ── Admin blog posts ──────────────────────────────────────────────────────────

export function fetchAllPosts() {
  return request('GET', '/posts/admin/all');
}

export function createPost(data) {
  return request('POST', '/posts', data);
}

export function updatePost(slug, data) {
  return request('PUT', `/posts/${slug}`, data);
}

export function deletePost(slug) {
  return request('DELETE', `/posts/${slug}`);
}
