import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Server, Shield, FolderOpen, 
  FileText, Mail, Cpu, Menu, X
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

export default function MobileSidebar({ activeSection, onNavigate }) {
  const [open, setOpen] = useState(false);

  const handleNav = (id) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded bg-card border border-border"
      >
        <Menu className="w-5 h-5 text-primary" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-56 bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
            >
              <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-primary" />
                  <span className="font-mono text-sm font-semibold text-primary text-glow">ace@perez</span>
                </div>
                <button onClick={() => setOpen(false)}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <nav className="flex-1 py-4 px-3 space-y-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-mono transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary text-glow'
                          : 'text-sidebar-foreground/70 hover:text-primary hover:bg-sidebar-accent'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}