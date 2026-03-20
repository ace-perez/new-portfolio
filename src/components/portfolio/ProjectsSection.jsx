import React from 'react';
import { motion } from 'framer-motion';
import TerminalWindow from './TerminalWindow';
import { GitBranch, Star, ExternalLink } from 'lucide-react';

export const projects = [
  {
    name: "k8s-autopilot",
    description: "Kubernetes auto-scaling operator that intelligently manages cluster resources based on predictive load patterns. Uses ML models to forecast traffic and pre-scale pods.",
    tech: ["Go", "Kubernetes", "Prometheus", "gRPC"],
    stars: 342,
  },
  {
    name: "infra-as-code-templates",
    description: "Production-ready Terraform modules for AWS/GCP infrastructure. Includes VPC, EKS, monitoring stack, and security baselines following CIS benchmarks.",
    tech: ["Terraform", "AWS", "GCP", "Python"],
    stars: 218,
  },
  {
    name: "deploy-guardian",
    description: "CI/CD pipeline security tool that scans container images, validates Helm charts, and enforces OPA policies before deployment. Integrates with GitHub Actions and GitLab CI.",
    tech: ["Python", "OPA", "Docker", "GitHub Actions"],
    stars: 156,
  },
  {
    name: "incident-commander",
    description: "Slack-integrated incident management bot that automates runbooks, creates war rooms, and generates postmortem documents from incident timelines.",
    tech: ["Go", "Slack API", "PostgreSQL", "Redis"],
    stars: 89,
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20">
      <div className="mb-8 font-mono">
        <span className="text-primary text-glow">$</span>
        <span className="text-muted-foreground ml-2">ls -la ~/projects/</span>
        <div className="h-px bg-gradient-to-r from-primary/40 to-transparent mt-3" />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {projects.map((project, i) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <TerminalWindow title={`projects/${project.name}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-primary" />
                    <span className="text-primary text-glow font-semibold">{project.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      {project.stars}
                    </span>
                    <ExternalLink className="w-3 h-3 hover:text-primary cursor-pointer transition-colors" />
                  </div>
                </div>

                <p className="text-card-foreground/80 text-xs leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full border border-accent/30 text-accent bg-accent/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </TerminalWindow>
          </motion.div>
        ))}
      </div>
    </section>
  );
}