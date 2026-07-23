import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, LogOut, Plus, Edit2, Trash2, Eye, EyeOff,
  Save, X, ChevronLeft, AlertTriangle, Loader2, BookOpen, FileText
} from 'lucide-react';
import { login, logout, isLoggedIn, verifyToken } from '@/lib/api';
import { useAdminPosts, useCreatePost, useUpdatePost, useDeletePost } from '@/hooks/useBlogPosts';

// ── Helpers ───────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  tags: '',
  read_time: '',
  published: false,
};

function postToForm(post) {
  return {
    title: post.title || '',
    excerpt: post.excerpt || '',
    content: post.content || '',
    tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
    read_time: post.read_time || '',
    published: Boolean(post.published),
  };
}

function formToPayload(form) {
  return {
    title: form.title.trim(),
    excerpt: form.excerpt.trim(),
    content: form.content,
    tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    read_time: form.read_time.trim(),
    published: form.published,
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TerminalInput({ label, value, onChange, placeholder, type = 'text', as = 'input', rows }) {
  const cls = `w-full bg-background border border-border rounded px-3 py-2 font-mono text-sm text-foreground 
    placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all`;
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows || 4}
          className={`${cls} resize-y leading-relaxed`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  );
}

// ── Login Screen ──────────────────────────────────────────────────────────────

function LoginScreen({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Terminal className="w-5 h-5 text-primary text-glow" />
          <span className="font-mono text-sm text-muted-foreground">~/admin</span>
        </div>
        <h1 className="font-mono text-2xl font-bold text-foreground mb-1">
          <span className="text-primary text-glow">$</span> sudo login
        </h1>
        <p className="font-mono text-xs text-muted-foreground mb-8">
          Admin access only.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TerminalInput
            label="username"
            value={username}
            onChange={setUsername}
            placeholder="ace"
          />
          <TerminalInput
            label="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••••"
            type="password"
          />

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 px-3 py-2 rounded border border-red-500/30 bg-red-500/5 text-red-400 text-xs font-mono"
              >
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading || !username || !password}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-primary text-primary-foreground font-mono text-sm font-semibold 
              hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'authenticating...' : '$ login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Post Editor ───────────────────────────────────────────────────────────────

function PostEditor({ post, onSave, onCancel }) {
  const [form, setForm] = useState(post ? postToForm(post) : EMPTY_FORM);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const isEditing = Boolean(post);

  const set = useCallback((field) => (value) => setForm((f) => ({ ...f, [field]: value })), []);

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const payload = formToPayload(form);
      if (isEditing) {
        await updatePost.mutateAsync({ slug: post.slug, data: payload });
      } else {
        await createPost.mutateAsync(payload);
      }
      onSave();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          back
        </button>
        <span className="text-border font-mono text-xs">·</span>
        <span className="font-mono text-xs text-muted-foreground">
          {isEditing ? `editing: ${post.slug}` : 'new post'}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono transition-colors ${
              preview
                ? 'border-primary/50 text-primary bg-primary/5'
                : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary/70'
            }`}
          >
            {preview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {preview ? 'edit' : 'preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.title.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-mono font-semibold 
              hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            {saving ? 'saving...' : 'save'}
          </button>
        </div>
      </div>

      {/* Publish toggle */}
      <div className="flex items-center gap-3 px-4 py-3 rounded border border-border bg-card/40">
        <span className="font-mono text-xs text-muted-foreground flex-1">
          {form.published ? 'Published — visible on /blog' : 'Draft — not publicly visible'}
        </span>
        <button
          onClick={() => set('published')(!form.published)}
          className={`relative w-10 h-5 rounded-full transition-colors ${form.published ? 'bg-primary' : 'bg-secondary'}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${form.published ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {preview ? (
        // Preview pane
        <div className="rounded-lg border border-border bg-card/40 p-6 min-h-[400px]">
          <h2 className="font-mono font-bold text-xl text-foreground mb-2">{form.title || 'Untitled'}</h2>
          <p className="font-mono text-xs text-muted-foreground mb-6">{form.read_time && `${form.read_time} read · `}{form.tags}</p>
          <p className="font-mono text-sm text-muted-foreground mb-6 italic">{form.excerpt}</p>
          <pre className="font-mono text-sm text-card-foreground/80 whitespace-pre-wrap leading-relaxed">
            {form.content || <span className="text-muted-foreground/30">No content yet...</span>}
          </pre>
        </div>
      ) : (
        // Edit fields
        <div className="space-y-4">
          <TerminalInput label="title" value={form.title} onChange={set('title')} placeholder="Zero-Downtime Deployments on AWS ECS" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TerminalInput label="read time" value={form.read_time} onChange={set('read_time')} placeholder="8 min" />
            <TerminalInput label="tags (comma-separated)" value={form.tags} onChange={set('tags')} placeholder="AWS, ECS, DevOps" />
          </div>
          <TerminalInput label="excerpt" value={form.excerpt} onChange={set('excerpt')} placeholder="A short summary shown on the blog listing..." as="textarea" rows={3} />
          <TerminalInput label="content (markdown)" value={form.content} onChange={set('content')} placeholder="## Introduction&#10;&#10;Write your post here in Markdown..." as="textarea" rows={24} />
        </div>
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ onLogout }) {
  const { data: posts = [], isLoading, isError } = useAdminPosts();
  const deleteMutation = useDeletePost();
  const updateMutation = useUpdatePost();
  const [editing, setEditing] = useState(null); // null=list, 'new'=new, post=editing
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleTogglePublish = async (post) => {
    await updateMutation.mutateAsync({ slug: post.slug, data: { published: !post.published } });
  };

  const handleDelete = async (slug) => {
    await deleteMutation.mutateAsync(slug);
    setConfirmDelete(null);
  };

  if (editing === 'new' || (editing && editing !== null)) {
    return (
      <PostEditor
        post={editing === 'new' ? null : editing}
        onSave={() => setEditing(null)}
        onCancel={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <h1 className="font-mono text-xl font-bold text-foreground">
            <span className="text-primary text-glow">$</span> ls posts/
          </h1>
          <p className="font-mono text-xs text-muted-foreground mt-0.5">
            {posts.length} post{posts.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setEditing('new')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-mono font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            new post
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs font-mono text-muted-foreground hover:text-red-400 hover:border-red-400/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            logout
          </button>
        </div>
      </div>

      {/* Posts list */}
      {isLoading && (
        <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground py-8">
          <Loader2 className="w-4 h-4 animate-spin" />
          loading posts...
        </div>
      )}
      {isError && (
        <div className="flex items-center gap-2 font-mono text-sm text-red-400 py-8">
          <AlertTriangle className="w-4 h-4" />
          Failed to load posts. Is the API running?
        </div>
      )}

      <div className="space-y-2">
        {posts.map((post) => (
          <motion.div
            key={post.slug}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 px-4 py-3 rounded-lg border border-border bg-card/40 hover:bg-card/70 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                {post.published
                  ? <BookOpen className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  : <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                }
                <span className="font-mono text-sm text-foreground truncate">{post.title}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground pl-5">
                <span className={post.published ? 'text-green-400' : 'text-yellow-500'}>
                  {post.published ? '● published' : '○ draft'}
                </span>
                <span>·</span>
                <span>{post.slug}</span>
                {post.read_time && <><span>·</span><span>{post.read_time} read</span></>}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => handleTogglePublish(post)}
                disabled={updateMutation.isPending}
                title={post.published ? 'Unpublish' : 'Publish'}
                className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                {post.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setEditing(post)}
                title="Edit"
                className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setConfirmDelete(post)}
                title="Delete"
                className="p-1.5 rounded text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-auto px-4"
            >
              <div className="rounded-lg border border-red-500/30 bg-card p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="font-mono text-sm font-semibold text-foreground">confirm delete</span>
                </div>
                <p className="font-mono text-xs text-muted-foreground mb-5">
                  Permanently delete <span className="text-foreground">"{confirmDelete.title}"</span>? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 px-3 py-2 rounded border border-border text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                  >
                    cancel
                  </button>
                  <button
                    onClick={() => handleDelete(confirmDelete.slug)}
                    disabled={deleteMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-red-500/80 text-white text-xs font-mono font-semibold hover:bg-red-500 transition-colors disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                    delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Admin Page ────────────────────────────────────────────────────────────────

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If there's a stored token, verify it's still valid before showing the dashboard
    if (isLoggedIn()) {
      verifyToken().then((valid) => {
        setAuthed(valid);
        setChecking(false);
      });
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-background px-6 sm:px-10 md:px-16 max-w-4xl mx-auto py-14">
      {/* Page header */}
      <div className="flex items-center gap-2 mb-8">
        <Terminal className="w-5 h-5 text-primary text-glow" />
        <span className="font-mono text-xs text-muted-foreground">~/admin — blog cms</span>
        <span className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-green-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
          authenticated
        </span>
      </div>

      <Dashboard onLogout={() => setAuthed(false)} />
    </div>
  );
}
