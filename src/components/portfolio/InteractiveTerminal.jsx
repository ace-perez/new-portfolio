import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Minus } from 'lucide-react';
import { experiences } from './ExperienceSection';
import { skillCategories } from './SkillsSection';
import { projects } from './ProjectsSection';
import { education } from './EducationSection';
import { certs } from './CertificationsSection';
import { links } from './ContactSection';

const HELP_TEXT = `
Available commands:
  whoami          — about Ace Perez
  experience      — work history
  skills          — technical skills
  skills <name>   — skills in a category (e.g. skills devops_tooling)
  projects        — list projects
  project <name>  — details for a specific project
  education       — academic background
  certs           — certifications
  contact         — contact links
  clear           — clear terminal
  help            — show this help
`.trim();

function processCommand(cmd) {
  const parts = cmd.trim().toLowerCase().split(/\s+/);
  const base = parts[0];
  const arg = parts.slice(1).join(' ');

  switch (base) {
    case 'whoami':
      return `Ace Perez — DevOps / SRE / Cloud Support Engineer
Location: County Kildare, Ireland
Bio: Proficient expert in AWS and cloud-based solutions, specialized in
     Software Development and DevOps for scalable, distributed systems.
     Strong in collaborative teamwork and problem-solving within Agile environments.`;

    case 'experience': {
      return experiences.map((e, i) =>
        `[${i + 1}] ${e.role}\n    @ ${e.company} · ${e.period} · ${e.location}`
      ).join('\n');
    }

    case 'skills': {
      if (arg) {
        const cat = skillCategories.find(c => c.name.toLowerCase() === arg);
        if (!cat) return `No skill category "${arg}". Try: ${skillCategories.map(c => c.name).join(', ')}`;
        return `[${cat.name}]\n  ${cat.skills.join('\n  ')}`;
      }
      return skillCategories.map(c =>
        `  ${c.name.padEnd(22)} ${c.skills.length} skills`
      ).join('\n') + `\n\nTip: run "skills <name>" to see skills in a category.`;
    }

    case 'projects': {
      return projects.map(p =>
        `  ${p.name.padEnd(28)} ★${p.stars}  [${p.tech.join(', ')}]`
      ).join('\n') + '\n\nTip: run "project <name>" for details.';
    }

    case 'project': {
      const p = projects.find(proj => proj.name.toLowerCase() === arg);
      if (!p) return `Project "${arg}" not found. Run "projects" to list all.`;
      return `${p.name}  ★${p.stars}\n\n${p.description}\n\nStack: ${p.tech.join(', ')}`;
    }

    case 'education': {
      return education.map(e =>
        `${e.degree}\n  ${e.school} · ${e.period}\n  ${e.highlights.join('\n  ')}`
      ).join('\n\n');
    }

    case 'certs': {
      return certs.map((c, i) =>
        `  [${i + 1}] ${c.name}\n       Issued by: ${c.issuer}${c.year ? ` · ${c.year}` : ''}`
      ).join('\n');
    }

    case 'contact': {
      return links.map(l => `  ${l.label.padEnd(10)} ${l.value}`).join('\n');
    }

    case 'help':
      return HELP_TEXT;

    case 'clear':
      return '__CLEAR__';

    case '':
      return '';

    default:
      return `command not found: ${cmd}. Type "help" for available commands.`;
  }
}

export default function InteractiveTerminal({ open, onClose }) {
  const [history, setHistory] = useState([
    { type: 'output', text: 'Welcome to ace@perez — interactive shell\nType "help" to explore.' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const result = processCommand(input);

    if (result === '__CLEAR__') {
      setHistory([]);
    } else {
      setHistory(prev => [
        ...prev,
        { type: 'input', text: input },
        { type: 'output', text: result },
      ]);
    }

    setCmdHistory(prev => [input, ...prev]);
    setCmdIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(cmdIndex + 1, cmdHistory.length - 1);
      setCmdIndex(next);
      setInput(cmdHistory[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = cmdIndex - 1;
      if (next < 0) { setCmdIndex(-1); setInput(''); }
      else { setCmdIndex(next); setInput(cmdHistory[next]); }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Terminal window */}
          <motion.div
            className="fixed z-50 inset-x-4 top-[5%] mx-auto max-w-3xl"
            initial={{ opacity: 0, y: -30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-t-lg">
              <div className="flex gap-1.5">
                <button
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"
                />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 text-center flex items-center justify-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-mono text-muted-foreground">
                  ace@perez:~/portfolio — interactive shell
                </span>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Terminal body */}
            <div
              className="bg-background border border-t-0 border-border rounded-b-lg p-4 h-[70vh] overflow-y-auto font-mono text-xs"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((entry, i) => (
                <div key={i} className="mb-1.5">
                  {entry.type === 'input' ? (
                    <div>
                      <span className="text-primary">ace@perez</span>
                      <span className="text-muted-foreground">:~$ </span>
                      <span className="text-foreground">{entry.text}</span>
                    </div>
                  ) : (
                    <pre className="text-card-foreground/85 whitespace-pre-wrap leading-relaxed pl-1">
                      {entry.text}
                    </pre>
                  )}
                </div>
              ))}

              {/* Input line */}
              <form onSubmit={handleSubmit} className="flex items-center gap-1 mt-1">
                <span className="text-primary">ace@perez</span>
                <span className="text-muted-foreground">:~$ </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-foreground caret-primary"
                  spellCheck={false}
                  autoComplete="off"
                />
              </form>

              <div ref={bottomRef} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}