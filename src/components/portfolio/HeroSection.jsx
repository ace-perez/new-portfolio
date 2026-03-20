import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TerminalWindow from './TerminalWindow';

const roles = [
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Cloud Support Engineer",
  "Production Engineer",
];

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentRole.length) {
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setRoleIndex((roleIndex + 1) % roles.length);
        }
      }
    }, isDeleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

  const displayedRole = roles[roleIndex].substring(0, charIndex);

  return (
    <section id="home" className="min-h-screen flex items-center py-20">
      <div className="w-full max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* ASCII art goose with pipe */}
          <pre className="text-primary text-glow text-[9px] sm:text-xs leading-tight mb-8 overflow-hidden select-none">
{`                 _
           ,--./  '.
          /  •  \\_  '>==--[pipe]
         |       _)
          '-.__.'|
         (       )
          \\_____/|
          /|  |  |
         / |  | /
        /__|__|/
       (__)(__)`}
          </pre>

          <TerminalWindow title="~/about — bash">
            <div className="space-y-3">
              <div>
                <span className="text-primary">$</span>
                <span className="text-muted-foreground"> whoami</span>
              </div>
              <div className="pl-2">
                <p className="text-foreground text-lg sm:text-xl font-semibold">
                  Ace Perez
                </p>
              </div>

              <div className="mt-4">
                <span className="text-primary">$</span>
                <span className="text-muted-foreground"> cat role.txt</span>
              </div>
              <div className="pl-2">
                <span className="text-accent text-glow-cyan text-base sm:text-lg">
                  {displayedRole}
                </span>
                <span className="cursor-blink text-primary font-bold">▌</span>
              </div>

              <div className="mt-4">
                <span className="text-primary">$</span>
                <span className="text-muted-foreground"> cat bio.txt</span>
              </div>
              <div className="pl-2 text-card-foreground/90 leading-relaxed max-w-xl">
                Proficient expert in AWS and cloud-based solutions, specialized in
                Software Development and DevOps for scalable, distributed systems.
                Strong in collaborative teamwork and problem-solving within Agile
                environments. Based in County Kildare, Ireland.
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <StatusBadge label="location" value="Kildare, IE" color="text-green-400" />
                <StatusBadge label="escalations" value="200+ resolved" color="text-green-400" />
                <StatusBadge label="acceptance" value="< 3% MLH" color="text-accent" />
                <StatusBadge label="coffee" value="∞" color="text-yellow-400" />
              </div>
            </div>
          </TerminalWindow>
        </motion.div>
      </div>
    </section>
  );
}

function StatusBadge({ label, value, color }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border bg-secondary/50 text-xs font-mono">
      <span className="text-muted-foreground">{label}:</span>
      <span className={color}>{value}</span>
    </div>
  );
}