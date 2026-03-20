import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TerminalWindow from './TerminalWindow';

export const links = [
  { label: "linkedin", value: "linkedin.com/in/acenperez", prefix: "https://" },
  { label: "email", value: "acenathen.perez@gmail.com", prefix: "mailto:" },
  { label: "phone", value: "+353 83 827 7111", prefix: "tel:" },
];

export default function ContactSection() {
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const cmd = inputValue.trim().toLowerCase();
    let output = '';

    if (cmd === 'help') {
      output = 'Available commands: help, links, clear, uptime';
    } else if (cmd === 'links') {
      output = links.map(l => `  ${l.label}: ${l.value}`).join('\n');
    } else if (cmd === 'clear') {
      setHistory([]);
      setInputValue('');
      return;
    } else if (cmd === 'uptime') {
      output = 'System uptime: always available for interesting opportunities ☕';
    } else {
      output = `command not found: ${cmd}. Type 'help' for available commands.`;
    }

    setHistory([...history, { cmd: inputValue, output }]);
    setInputValue('');
  };

  return (
    <section id="contact" className="py-20">
      <div className="mb-8 font-mono">
        <span className="text-primary text-glow">$</span>
        <span className="text-muted-foreground ml-2">ssh contact@portfolio</span>
        <div className="h-px bg-gradient-to-r from-primary/40 to-transparent mt-3" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Links */}
        <TerminalWindow title="contact/links.txt">
          <div className="space-y-3">
            <div className="text-muted-foreground text-xs"># How to reach me</div>
            {links.map((link, i) => (
              <motion.a
                key={link.label}
                href={`${link.prefix}${link.value}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 group"
              >
                <span className="text-primary">▸</span>
                <span className="text-accent">{link.label}</span>
                <span className="text-muted-foreground">=</span>
                <span className="text-foreground/80 group-hover:text-primary transition-colors underline underline-offset-2 decoration-border group-hover:decoration-primary">
                  {link.value}
                </span>
              </motion.a>
            ))}
          </div>
        </TerminalWindow>


      </div>
    </section>
  );
}