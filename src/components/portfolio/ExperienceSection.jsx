import React from 'react';
import { motion } from 'framer-motion';
import TerminalWindow from './TerminalWindow';

const experiences = [
  {
    role: "Senior Site Reliability Engineer",
    company: "Company Name",
    period: "2023 — Present",
    bullets: [
      "Designed and maintained Kubernetes clusters serving 50M+ daily requests with 99.99% availability",
      "Built observability stack with Prometheus, Grafana, and OpenTelemetry reducing MTTR by 65%",
      "Automated infrastructure provisioning with Terraform, managing 200+ cloud resources across AWS and GCP",
      "Led incident response for P1/P2 incidents, implementing blameless postmortems culture",
      "Reduced cloud spend by 35% through right-sizing, spot instances, and resource optimization",
    ],
  },
  {
    role: "DevOps Engineer",
    company: "Previous Company",
    period: "2021 — 2023",
    bullets: [
      "Built CI/CD pipelines with GitHub Actions and ArgoCD, enabling 300+ deployments/week",
      "Migrated monolithic application to microservices architecture on Kubernetes",
      "Implemented GitOps workflow with Flux and Helm, reducing deployment errors by 80%",
      "Set up centralized logging with ELK stack processing 2TB+ logs/day",
      "Mentored junior engineers on cloud-native best practices and SRE principles",
    ],
  },
  {
    role: "Cloud Engineer",
    company: "First Company",
    period: "2019 — 2021",
    bullets: [
      "Managed AWS infrastructure for 20+ services using CloudFormation and Ansible",
      "Designed and implemented multi-region disaster recovery with RPO < 1hr",
      "Automated security compliance scanning with custom Python tools and AWS Config",
      "Developed internal developer platform reducing onboarding time from weeks to hours",
    ],
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20">
      <SectionHeader command="ls -la experience/" />
      <div className="space-y-6">
        {experiences.map((exp, i) => (
          <TerminalWindow key={i} title={`experience/${exp.company.toLowerCase().replace(/\s+/g, '-')}.log`}>
            <div className="space-y-3">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-accent text-glow-cyan font-semibold text-base">{exp.role}</span>
                <span className="text-muted-foreground">@</span>
                <span className="text-primary text-glow">{exp.company}</span>
              </div>
              <div className="text-muted-foreground text-xs">
                <span className="text-yellow-400/80">[{exp.period}]</span>
              </div>
              <div className="border-t border-border/50 my-3" />
              <ul className="space-y-2">
                {exp.bullets.map((bullet, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.1 }}
                    className="flex gap-2 text-card-foreground/85"
                  >
                    <span className="text-primary shrink-0">▸</span>
                    <span>{bullet}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </TerminalWindow>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ command }) {
  return (
    <div className="mb-8 font-mono">
      <span className="text-primary text-glow">$</span>
      <span className="text-muted-foreground ml-2">{command}</span>
      <div className="h-px bg-gradient-to-r from-primary/40 to-transparent mt-3" />
    </div>
  );
}