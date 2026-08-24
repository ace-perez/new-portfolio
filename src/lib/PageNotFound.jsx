import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, ArrowLeft } from 'lucide-react';

export default function PageNotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = location.pathname.substring(1) || 'unknown';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">

      {/* Subtle CRT grid lines */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.5) 2px, rgba(0,255,65,0.5) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full font-mono"
      >
        {/* Terminal window chrome */}
        <div className="border border-border rounded-lg overflow-hidden bg-card shadow-2xl shadow-primary/5">

          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-sidebar">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
            </div>
            <div className="flex items-center gap-2 mx-auto">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">bash — 404</span>
            </div>
          </div>

          {/* Terminal body */}
          <div className="p-6 space-y-4 text-sm">

            {/* Command that was run */}
            <div className="flex items-start gap-2 text-muted-foreground">
              <span className="text-primary text-glow flex-shrink-0">$</span>
              <span>cd <span className="text-foreground">/{pageName}</span></span>
            </div>

            {/* Error output */}
            <div className="space-y-1 text-red-400/80">
              <p>bash: cd: /{pageName}: No such file or directory</p>
            </div>

            {/* 404 big display */}
            <div className="py-4 text-center">
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="text-7xl font-bold text-primary text-glow tracking-tight"
              >
                404
              </motion.div>
              <p className="text-muted-foreground text-xs mt-2">page not found</p>
            </div>

            {/* Suggestion */}
            <div className="flex items-start gap-2 text-muted-foreground">
              <span className="text-primary text-glow flex-shrink-0">$</span>
              <span>ls ~/</span>
            </div>
            <div className="text-xs text-muted-foreground pl-4 grid grid-cols-3 gap-1">
              {['experience/', 'skills/', 'education/', 'projects/', 'certs/', 'contact/'].map(item => (
                <span key={item} className="text-foreground/60">{item}</span>
              ))}
            </div>

            {/* Prompt with go home button */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-primary text-glow">$</span>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-primary/10 border border-primary/30 text-primary text-xs hover:bg-primary/20 hover:border-primary/50 transition-all text-glow"
              >
                <ArrowLeft className="w-3 h-3" />
                cd ~/
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}