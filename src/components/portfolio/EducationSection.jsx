import React from 'react';
import TerminalWindow from './TerminalWindow';

const education = [
  {
    degree: "Bachelor's Degree (Hons), Computer Science",
    school: "Technological University Dublin",
    period: "2019 — 2023",
    highlights: [
      "Honours degree with focus on software development and cloud computing",
      "Developed strong foundations in distributed systems and Agile methodologies",
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