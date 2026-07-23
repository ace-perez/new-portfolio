import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Terminal, Clock, Tag, ChevronRight, Loader2, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CRTBackground from '../components/portfolio/CRTBackground';
import Sidebar from '../components/portfolio/Sidebar';
import MobileSidebar from '../components/portfolio/MobileSidebar';
import { useBlogPost, useBlogPosts } from '../hooks/useBlogPosts';

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

// Markdown components styled to match the terminal aesthetic
const mdComponents = {
  h2: ({ children }) => (
    <h2 className="text-lg font-mono font-semibold text-primary text-glow mt-10 mb-4 flex items-center gap-2">
      <span className="text-muted-foreground">##</span> {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-mono font-semibold text-accent text-glow-cyan mt-7 mb-3 flex items-center gap-2">
      <span className="text-muted-foreground">###</span> {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-sm text-card-foreground/85 leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="space-y-1.5 mb-5 pl-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-1.5 mb-5 pl-1 list-decimal list-inside">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-sm text-card-foreground/80 font-mono flex items-start gap-2">
      <span className="text-primary mt-0.5 flex-shrink-0">›</span>
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="text-foreground font-semibold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-accent italic">{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-primary/50 pl-4 my-5 italic text-sm text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline && match) {
      return (
        <div className="my-5 rounded-lg overflow-hidden border border-border">
          <div className="flex items-center gap-2 px-4 py-2 bg-card border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground ml-1">{match[1]}</span>
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: 0,
              background: 'hsl(220, 18%, 10%)',
              fontSize: '12px',
              lineHeight: '1.6',
            }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    }
    return (
      <code className="px-1.5 py-0.5 rounded bg-secondary text-accent font-mono text-[11px]">
        {children}
      </code>
    );
  },
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline underline-offset-2 hover:text-primary transition-colors"
    >
      {children}
    </a>
  ),
};

export default function BlogPost() {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: post, isLoading, isError } = useBlogPost(slug);
  const { data: allPosts = [] } = useBlogPosts();

  // Derive prev/next from the full post list
  const postIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = postIndex > 0 ? allPosts[postIndex - 1] : null;
  const nextPost = postIndex < allPosts.length - 1 ? allPosts[postIndex + 1] : null;

  const handleSidebarNavigate = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
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
        {/* Loading state */}
        {isLoading && (
          <div className="pt-14 space-y-6">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              loading post...
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-3 w-32 bg-muted rounded" />
              <div className="h-8 w-3/4 bg-muted rounded" />
              <div className="flex gap-2">
                {[1, 2, 3].map((n) => <div key={n} className="h-5 w-14 bg-muted rounded" />)}
              </div>
              <div className="space-y-2 mt-8">
                {[1, 2, 3, 4, 5].map((n) => <div key={n} className="h-3 bg-muted rounded" style={{ width: `${70 + n * 5}%` }} />)}
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="pt-14">
            <div className="flex items-start gap-3 px-4 py-4 rounded-lg border border-red-500/30 bg-red-500/5 font-mono text-xs text-red-400 mb-6">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Post not found.</p>
                <p className="text-red-400/70">It may have been removed or the URL is incorrect.</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              cd ../blog
            </button>
          </div>
        )}

        {/* Post loaded */}
        {post && !isLoading && (
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="pt-14"
          >
            {/* Breadcrumb nav */}
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground mb-8">
              <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">
                ~/portfolio
              </button>
              <ChevronRight className="w-3 h-3" />
              <button onClick={() => navigate('/blog')} className="hover:text-primary transition-colors">
                blog/
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary truncate max-w-[180px]">{post.slug}</span>
            </div>

            {/* Post header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-primary" />
                  {new Date(post.created_at).toLocaleDateString('en-IE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
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

              <h1 className="text-2xl sm:text-3xl font-mono font-bold text-foreground mb-5 leading-snug">
                {post.title}
              </h1>

              <div className="flex flex-wrap gap-1.5">
                {(post.tags || []).map((t) => (
                  <TagBadge key={t} tag={t} />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border/40 mb-8" />

            {/* Post content */}
            <ReactMarkdown components={mdComponents}>{post.content}</ReactMarkdown>

            {/* Divider */}
            <div className="border-t border-border/40 mt-12 mb-8" />

            {/* Prev / Next navigation */}
            <nav className="flex justify-between items-start gap-6">
              {prevPost ? (
                <button
                  onClick={() => navigate(`/blog/${prevPost.slug}`)}
                  className="group text-left max-w-[45%]"
                >
                  <p className="text-[10px] font-mono text-muted-foreground mb-1 group-hover:text-primary transition-colors">← prev</p>
                  <p className="text-xs font-mono text-foreground group-hover:text-primary transition-colors line-clamp-2">{prevPost.title}</p>
                </button>
              ) : <div />}
              {nextPost ? (
                <button
                  onClick={() => navigate(`/blog/${nextPost.slug}`)}
                  className="group text-right max-w-[45%]"
                >
                  <p className="text-[10px] font-mono text-muted-foreground mb-1 group-hover:text-primary transition-colors">next →</p>
                  <p className="text-xs font-mono text-foreground group-hover:text-primary transition-colors line-clamp-2">{nextPost.title}</p>
                </button>
              ) : <div />}
            </nav>

            {/* Back to blog */}
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/blog')}
                className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mx-auto group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                cd ../blog
              </button>
            </div>
          </motion.article>
        )}

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-border/30 font-mono text-xs text-muted-foreground text-center">
          <p><span className="text-primary">$</span> echo "Hello World!"</p>
        </footer>
      </main>
    </div>
  );
}
