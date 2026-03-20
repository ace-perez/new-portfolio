import React from 'react';
import TerminalWindow from './TerminalWindow';

const education = [
  {
    degree: "B.S. Computer Science",
    school: "University Name",
    period: "2015 — 2019",
    highlights: [
      "Distributed Systems & Cloud Computing focus",
      "GPA: 3.8 / 4.0",
      "Senior thesis: 'Autonomous Container Orchestration with Reinforcement Learning'",
    ],
  },
];

export default function EducationSection() {
  return (
    <section id="education" className="py-20">
      <div className="mb-8 font-mono">
        <span className="text-primary text-glow">$</span>
        <span className="text-muted-foreground ml-2">cat /etc/education.conf</span>
        <div className="h-px bg-gradient-to-r from-primary/40 to-transparent mt-3" />
      </div>

      {education.map((edu, i) => (
        <TerminalWindow key={i} title="education.conf">
          <div className="space-y-2">
            <div className="text-muted-foreground text-xs"># Education Configuration</div>
            <div>
              <span className="text-accent">degree</span>
              <span className="text-muted-foreground"> = </span>
              <span className="text-foreground">"{edu.degree}"</span>
            </div>
            <div>
              <span className="text-accent">institution</span>
              <span className="text-muted-foreground"> = </span>
              <span className="text-foreground">"{edu.school}"</span>
            </div>
            <div>
              <span className="text-accent">period</span>
              <span className="text-muted-foreground"> = </span>
              <span className="text-yellow-400/80">"{edu.period}"</span>
            </div>
            <div className="mt-3 text-muted-foreground text-xs"># Highlights</div>
            {edu.highlights.map((h, j) => (
              <div key={j}>
                <span className="text-accent">highlight_{j}</span>
                <span className="text-muted-foreground"> = </span>
                <span className="text-card-foreground/85">"{h}"</span>
              </div>
            ))}
          </div>
        </TerminalWindow>
      ))}
    </section>
  );
}