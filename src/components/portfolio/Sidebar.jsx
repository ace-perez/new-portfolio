import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Server, Shield, FolderOpen, 
  FileText, Mail, ChevronRight, Cpu, PanelLeftClose, PanelLeftOpen, Gamepad2
} from 'lucide-react';

const navItems = [
  { id: 'home', label: '~/', icon: Terminal },
  { id: 'experience', label: 'experience/', icon: Server },
  { id: 'skills', label: 'skills/', icon: Cpu },
  { id: 'projects', label: 'projects/', icon: FolderOpen },
  { id: 'education', label: 'education/', icon: FileText },
  { id: 'certifications', label: 'certs/', icon: Shield },
  { id: 'games', label: 'games/', icon: Gamepad2 },
  { id: 'contact', label: 'contact/', icon: Mail },
];

export default function Sidebar({ activeSection, onNavigate, onCollapse }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapse?.(next);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 56 : 224 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-50 flex flex-col overflow-hidden"
    >
      {/* Logo area */}
      <div className="p-3 border-b border-sidebar-border flex items-center justify-between min-h-[60px]">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="font-mono text-sm font-semibold text-primary text-glow whitespace-nowrap">
                  ace_perez@ireland
                </span>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground mt-1 pl-7">
                ~/portfolio
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && <Terminal className="w-5 h-5 text-primary mx-auto" />}
        <button
          onClick={toggle}
          className="ml-auto flex-shrink-0 p-1 rounded text-muted-foreground hover:text-primary hover:bg-sidebar-accent transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-mono text-muted-foreground px-2 mb-3 uppercase tracking-wider whitespace-nowrap"
            >
              File Explorer
            </motion.p>
          )}
        </AnimatePresence>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ x: collapsed ? 0 : 4 }}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-2.5 px-2 py-2 rounded text-xs font-mono transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary text-glow'
                  : 'text-sidebar-foreground/70 hover:text-primary hover:bg-sidebar-accent'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!collapsed && isActive && (
                <ChevronRight className="w-3 h-3 ml-auto text-primary flex-shrink-0" />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Status bar */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                all systems operational
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}