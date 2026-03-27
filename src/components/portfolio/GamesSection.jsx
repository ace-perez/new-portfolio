import React from 'react';
import { motion } from 'framer-motion';
import TerminalWindow from './TerminalWindow';
import { Trophy } from 'lucide-react';

export const games = [
  { name: "Fallout: New Vegas", achievements: "75/75", completedDate: "2023" },
  { name: "Fallout 4", achievements: "84/84", completedDate: "2025" },
  { name: "Divinity: Original Sin 2", achievements: "57/57", completedDate: "2025" },
  { name: "High on Life 2", achievements: "44/44", completedDate: "2026" },
  { name: "Far Cry 3", achievements: "44/44", completedDate: "2025" },
  { name: "The Walking Dead", achievements: "48/48", completedDate: "2026" },
  { name: "Maneater", achievements: "44/44", completedDate: "2026" },
  { name: "Star Wars KOTOR 2: The Sith Lords", achievements: "57/57", completedDate: "2025" },
  { name: "Duck Detective: The Ghost of Glamping", achievements: "11/11", completedDate: "2025" },
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