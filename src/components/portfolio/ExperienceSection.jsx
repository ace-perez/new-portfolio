import React from 'react';
import { motion } from 'framer-motion';
import TerminalWindow from './TerminalWindow';

const experiences = [
  {
    role: "Site Reliability Engineer / Production Engineer Fellow",
    company: "Meta & Major League Hacking",
    period: "June 2025 — September 2025",
    location: "Dublin, Ireland",
    bullets: [
      "Selected as part of the first EU cohort of the MLH Production Engineering Fellowship (highly selective, < 3% acceptance), mentored by Meta's Dublin Production Engineering team",
      "Debugged and optimized Linux system services and network configurations during intensive on-call simulations, reducing MTTR for simulated production outages",
      "Architected CI/CD pipelines and containerized environments using Docker and Bash, resulting in a reduction in deployment errors during simulated production cycles",
      "Delivered a Linux-focused portfolio website integrating monitoring, services, and system administration concepts",
      "Helped organize and led the first-ever MLH cohort visit to a Meta office, fostering knowledge-sharing and collaboration between fellows and Meta engineers",
    ],
  },
  {
    role: "Cloud Support Engineer I (Data Analytics)",
    company: "Amazon Web Services (AWS)",
    period: "September 2023 — May 2025",
    location: "County Dublin, Ireland",
    bullets: [
      "Handled 200+ high-severity escalations for Kafka and OpenSearch clusters, performing deep-dive debugging to resolve stuck processes, rebalance load, optimize configurations, and stabilize degraded distributed systems",
      "Consulted on system design and optimization, deploying AWS analytics services such as OpenSearch (Elasticsearch) and Apache Kafka to streamline data pipelines and meet complex client needs",
      "Developed efficient data processing and analysis workflows using Python, enabling advanced data visualization and actionable insights",
      "Engineered seamless integration of Apache Kafka with external systems like Prometheus and Logstash, enhancing system functionality, scalability, and performance",
      "Coordinated effectively with internal cross-functional teams within an Agile environment, ensuring timely and efficient delivery of software solutions",
    ],
  },
  {
    role: "Cloud Support Associate Intern (Data Analytics)",
    company: "Amazon Web Services (AWS)",
    period: "January 2022 — September 2022",
    location: "Ireland",
    bullets: [
      "Addressed technical challenges in cloud infrastructure and coding, enhancing project efficiency and system stability",
      "Applied Linux expertise to strengthen team capabilities and guided clients on optimized cloud analytics",
      "Fostered collaboration through active participation in team meetings and activities, improving technical skills in Linux and Data Analytics",
    ],
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20">
      <div className="mb-8 font-mono">
        <span className="text-primary text-glow">$</span>
        <span className="text-muted-foreground ml-2">cat /var/log/career.log</span>
        <div className="h-px bg-gradient-to-r from-primary/40 to-transparent mt-3" />
      </div>

      <div className="space-y-6">
        {experiences.map((exp, i) => (
          <TerminalWindow key={i} title={`${exp.company.toLowerCase().replace(/[^a-z]/g, '_')}.log`}>
            <div className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-primary font-semibold">{exp.role}</p>
                  <p className="text-accent text-glow-cyan text-xs mt-0.5">{exp.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400/80 text-xs">{exp.period}</p>
                  <p className="text-muted-foreground text-[10px]">{exp.location}</p>
                </div>
              </div>
              <div className="border-t border-border/40 pt-3 space-y-2">
                {exp.bullets.map((b, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.07 }}
                    className="flex gap-2 text-xs text-card-foreground/80"
                  >
                    <span className="text-primary mt-0.5 shrink-0">▸</span>
                    <span>{b}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </TerminalWindow>
        ))}
      </div>
    </section>
  );
}