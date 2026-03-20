import React from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, Server, Shield, FolderOpen, 
  FileText, Mail, ChevronRight, Cpu
} from 'lucide-react';

const navItems = [
  { id: 'home', label: '~/', icon: Terminal },
  { id: 'experience', label: 'experience/', icon: Server },
  { id: 'skills', label: 'skills/', icon: Cpu },
  { id: 'projects', label: 'projects/', icon: FolderOpen },
  { id: 'education', label: 'education/', icon: FileText },
  { id: 'certifications', label: 'certs/', icon: Shield },
  { id: 'contact', label: 'contact/', icon: Mail },
];

export default function Sidebar({ activeSection, onNavigate }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-sidebar border-r border-sidebar-border z-50 flex flex-col">
      {/* Logo area */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <span className="font-mono text-sm font-semibold text-primary text-glow">
            devops@sre
          </span>
        </div>
        <p className="text-[10px] font-mono text-muted-foreground mt-1.5">
          ~/portfolio
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        <p className="text-[10px] font-mono text-muted-foreground px-2 mb-3 uppercase tracking-wider">
          File Explorer
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ x: 4 }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-mono transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary text-glow'
                  : 'text-sidebar-foreground/70 hover:text-primary hover:bg-sidebar-accent'
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{item.label}</span>
              {isActive && (
                <ChevronRight className="w-3 h-3 ml-auto text-primary" />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Status bar */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>all systems operational</span>
        </div>
      </div>
    </aside>
  );
}