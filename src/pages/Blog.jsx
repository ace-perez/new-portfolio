import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Terminal, Tag, Clock, ChevronRight, Search, BookOpen, Loader2, AlertTriangle
} from 'lucide-react';
import CRTBackground from '../components/portfolio/CRTBackground';
import Sidebar from '../components/portfolio/Sidebar';
import MobileSidebar from '../components/portfolio/MobileSidebar';
import { useBlogPosts } from '../hooks/useBlogPosts';

const TAG_COLORS = {
  AWS: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  ECS: 'text-orange-400 border-orange-400/30 bg-orange-400/5',
  DevOps: 'text-green-400 border-green-400/30 bg-green-400/5',
  'CI/CD': 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  Terraform: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  IaC: 'text-purple-300 border-purple-300/30 bg-purple-300/5',
  'Platform Engineering': 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5',
  Kubernetes: 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  'Cost Optimisation': 'text-green-300 border-green-300/30 bg-green-300/5',
  EKS: 'text-orange-300 border-orange-300/30 bg-orange-300/5',
  SRE: 'text-primary border-primary/30 bg-primary/5',
  Culture: 'text-pink-400 border-pink-400/30 bg-pink-400/5',
  'On-Call': 'text-red-400 border-red-400/30 bg-red-400/5',
  Reliability: 'text-accent border-accent/30 bg-accent/5',
};

function TagBadge({ tag }) {
  const cls = TAG_COLORS[tag] || 'text-muted-foreground border-border bg-secondary/30';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono ${cls}`}>
      <Tag className="w-2.5 h-2.5" />
      {tag}
    </span>
  );
}

function PostSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card/30 p-5 animate-pulse space-y-3">
      <div className="flex gap-3">
        <div className="h-2.5 w-20 bg-muted rounded" />
        <div className="h-2.5 w-16 bg-muted rounded" />
      </div>
      <div className="h-4 w-3/4 bg-muted rounded" />
      <div className="space-y-1.5 pl-6">
        <div className="h-2.5 w-full bg-muted rounded" />
        <div className="h-2.5 w-5/6 bg-muted rounded" />
      </div>
      <div className="flex gap-2 pl-6">
        <div className="h-5 w-12 bg-muted rounded" />
        <div className="h-5 w-14 bg-muted rounded" />
        <div className="h-5 w-10 bg-muted rounded" />
      </div>
    </div>
  );
}

export default function Blog() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState(null);

  const { data: posts = [], isLoading, isError } = useBlogPosts();

  const allTags = [...new Set(posts.flatMap((p) => p.tags || []))];

  const filtered = posts.filter((post) => {
    const matchSearch =
      search === '' ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      (post.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchTag = activeTag === null || (post.tags || []).includes(activeTag);
    return matchSearch && matchTag;
  });

  const handleSidebarNavigate = (id) => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <CRTBackground />

      {/* Desktop sidebar */}
      <div className="relative z-10 hidden lg:block">
        <Sidebar
          activeSection="blog"
          onNavigate={handleSidebarNavigate}
          onCollapse={setSidebarCollapsed}
        />
      </div>

      {/* Mobile sidebar */}
      <div className="relative z-10 lg:hidden">
        <MobileSidebar activeSection="blog" onNavigate={handleSidebarNavigate} />
      </div>

      {/* Main content */}
      <main
        className={`relative z-10 transition-all duration-250 px-6 sm:px-10 md:px-16 lg:px-20 max-w-4xl pb-20 ${
          sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-56'
        }`}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-16 pb-10"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform inline-block">←</span>
            cd ~/portfolio
          </button>

          <div className="flex items-center gap-3 mb-2">
            <Terminal className="w-5 h-5 text-primary text-glow" />
            <span className="font-mono text-xs text-muted-foreground">~/blog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-mono font-bold text-foreground mb-3">
            <span className="text-primary text-glow">$</span> cat posts/
          </h1>
          <p className="font-mono text-sm text-muted-foreground max-w-xl">
            Notes on DevOps, SRE, cloud architecture, and whatever else I'm thinking about.
          </p>
        </motion.div>

        {/* Search + Tag Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="grep -i 'keyword' posts/"
              className="w-full pl-9 pr-4 py-2.5 rounded border border-border bg-card/50 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-2.5 py-1 rounded border text-[10px] font-mono transition-colors ${
                  activeTag === null
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary/70'
                }`}
              >
                all
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`px-2.5 py-1 rounded border text-[10px] font-mono transition-colors ${
                    activeTag === tag
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/50 hover:text-primary/70'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* State: loading */}
        {isLoading && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground mb-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              fetching posts...
            </div>
            {[1, 2, 3].map((n) => <PostSkeleton key={n} />)}
          </div>
        )}

        {/* State: error */}
        {isError && (
          <div className="flex items-start gap-3 px-4 py-4 rounded-lg border border-red-500/30 bg-red-500/5 font-mono text-xs text-red-400">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Failed to load posts.</p>
              <p className="text-red-400/70">The API may be unavailable. Try refreshing.</p>
            </div>
          </div>
        )}

        {/* State: loaded */}
        {!isLoading && !isError && (
          <>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-[11px] text-muted-foreground mb-5"
            >
              {filtered.length} post{filtered.length !== 1 ? 's' : ''} found
            </motion.p>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${search}-${activeTag}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {filtered.length === 0 ? (
                  <div className="text-center py-16 font-mono text-muted-foreground">
                    <p className="text-2xl mb-2">404</p>
                    <p className="text-xs">No posts matching your query.</p>
                  </div>
                ) : (
                  filtered.map((post, i) => (
                    <motion.article
                      key={post.slug}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.06 }}
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      className="group cursor-pointer rounded-lg border border-border bg-card/40 hover:bg-card/70 hover:border-primary/40 transition-all duration-200 p-5"
                    >
                      <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground mb-3">
                        <span>{new Date(post.created_at).toLocaleDateString('en-IE', { year: 'numeric', month: '2-digit', day: '2-digit' })}</span>
                        {post.read_time && (
                          <>
                            <span className="text-border">·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {post.read_time} read
                            </span>
                          </>
                        )}
                      </div>

                      <h2 className="font-mono font-semibold text-base text-foreground group-hover:text-primary transition-colors mb-2 flex items-start gap-2">
                        <BookOpen className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary/60 group-hover:text-primary transition-colors" />
                        {post.title}
                      </h2>

                      <p className="text-xs text-muted-foreground leading-relaxed mb-4 pl-6">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between gap-2 flex-wrap pl-6">
                        <div className="flex flex-wrap gap-1.5">
                          {(post.tags || []).map((t) => (
                            <TagBadge key={t} tag={t} />
                          ))}
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-mono text-primary/60 group-hover:text-primary transition-colors whitespace-nowrap">
                          read more
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </motion.article>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-border/30 font-mono text-xs text-muted-foreground text-center">
          <p>
            <span className="text-primary">$</span> echo "more posts coming soon..."
          </p>
        </footer>
      </main>
    </div>
  );
}
