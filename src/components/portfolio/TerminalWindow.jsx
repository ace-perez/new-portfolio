import React from 'react';
import { motion } from 'framer-motion';

export default function TerminalWindow({ title = "terminal", children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg border border-border overflow-hidden bg-card ${className}`}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/80 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">
          {title}
        </span>
      </div>
      {/* Content */}
      <div className="p-5 font-mono text-sm leading-relaxed">
        {children}
      </div>
    </motion.div>
  );
}