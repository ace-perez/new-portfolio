import React from 'react';
import { motion } from 'framer-motion';
import TerminalWindow from './TerminalWindow';

export const skillCategories = [
  {
    name: "cloud_platforms",
    skills: ["AWS (OpenSearch, Kafka, EC2, S3, VPC)", "AWS Analytics Services", "Cloud Infrastructure"],
  },
  {
    name: "devops_tooling",
    skills: ["Docker", "CI/CD Pipelines", "Bash Scripting", "Linux System Administration"],
  },
  {
    name: "data_engineering",
    skills: ["Apache Kafka", "OpenSearch / Elasticsearch", "Prometheus", "Logstash", "Python"],
  },
  {
    name: "networking",
    skills: ["CCNA (Routing & Switching)", "Enterprise Networking", "Network Security", "Wireless Essentials"],
  },
  {
    name: "software_dev",
    skills: ["Core Java", "Python", "Software Development Life Cycle (SDLC)", "Agile / Scrum"],
  },
];

const totalSkills = skillCategories.reduce((acc, c) => acc + c.skills.length, 0);

export default function SkillsSection() {
  return (
    <section id="skills" className="py-20">
      <div className="mb-8 font-mono">
        <span className="text-primary text-glow">$</span>
        <span className="text-muted-foreground ml-2">kubectl get skills --all-namespaces</span>
        <div className="h-px bg-gradient-to-r from-primary/40 to-transparent mt-3" />
      </div>

      <TerminalWindow title="skills — kubectl output">
        <div className="space-y-5">
          <div className="text-xs text-muted-foreground grid grid-cols-3 gap-2 pb-2 border-b border-border/40">
            <span>NAMESPACE</span>
            <span className="col-span-2">SKILLS</span>
          </div>

          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="grid grid-cols-3 gap-2 items-start"
            >
              <span className="text-accent text-xs font-mono">{cat.name}</span>
              <div className="col-span-2 flex flex-wrap gap-1.5">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded text-[10px] font-mono border border-border/60 bg-secondary/40 text-card-foreground/80 hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}

          <div className="pt-3 border-t border-border/40 text-xs font-mono text-muted-foreground">
            <span className="text-primary">{totalSkills}</span> skills loaded · status: <span className="text-green-400">Running</span>
          </div>
        </div>
      </TerminalWindow>
    </section>
  );
}