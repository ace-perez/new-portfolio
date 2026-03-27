import React from 'react';
import { motion } from 'framer-motion';
import TerminalWindow from './TerminalWindow';
import { Trophy } from 'lucide-react';

export const games = [
  {
    name: "Example Game Title",
    platform: "PC",
    achievements: "50/50",
    completedDate: "2023",
    notes: "Add your notes here",
  },
];

export default function GamesSection() {
  return (
    <section id="games" className="py-20">
      <div className="mb-8 font-mono">
        <span className="text-primary text-glow">$</span>
        <span className="text-muted-foreground ml-2">cat ~/games/100percent.log</span>
        <div className="h-px bg-gradient-to-r from-primary/40 to-transparent mt-3" />
      </div>

      <TerminalWindow title="games — 100% completed">
        <div className="space-y-3">
          {games.map((game, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded border border-border/50 bg-secondary/30 hover:border-primary/30 transition-colors"
            >
              <Trophy className="w-4 h-4 text-yellow-400/80 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-foreground/90 text-xs font-medium">{game.name}</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">
                  {game.platform}
                  {game.achievements && <> · <span className="text-primary/70">{game.achievements} achievements</span></>}
                  {game.completedDate && <> · <span className="text-yellow-400/80">{game.completedDate}</span></>}
                </p>
                {game.notes && (
                  <p className="text-muted-foreground/60 text-[10px] mt-1 italic">// {game.notes}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </TerminalWindow>
    </section>
  );
}