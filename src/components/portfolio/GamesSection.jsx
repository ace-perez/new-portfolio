import React from 'react';
import { motion } from 'framer-motion';
import TerminalWindow from './TerminalWindow';
import { Trophy } from 'lucide-react';

export const games = [
  {
    name: "Example Game Title",
    achievements: "50/50",
    completedDate: "2023",
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
        <div className="grid grid-cols-2 gap-2">
          {games.map((game, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-2 p-2.5 rounded border border-border/50 bg-secondary/30 hover:border-primary/30 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-yellow-400/80 mt-0.5 shrink-0" />
              <div>
                <p className="text-foreground/90 text-xs font-medium leading-tight">{game.name}</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">
                  {game.achievements && <span className="text-primary/70">{game.achievements} achievements</span>}
                  {game.achievements && game.completedDate && <> · </>}
                  {game.completedDate && <span className="text-yellow-400/80">{game.completedDate}</span>}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </TerminalWindow>
    </section>
  );
}