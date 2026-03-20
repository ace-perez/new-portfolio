import React from 'react';
import { motion } from 'framer-motion';
import TerminalWindow from './TerminalWindow';

const skillCategories = [
  {
    name: "containers_orchestration",
    items: ["Docker", "Kubernetes", "Helm", "Istio", "ArgoCD", "Podman"],
  },
  {
    name: "cloud_platforms",
    items: ["AWS", "GCP", "Azure", "DigitalOcean"],
  },
  {
    name: "iac_automation",
    items: ["Terraform", "Ansible", "Pulumi", "CloudFormation", "Packer"],
  },
  {
    name: "ci_cd",
    items: ["GitHub Actions", "GitLab CI", "Jenkins", "CircleCI", "Flux"],
  },
  {
    name: "monitoring_observability",
    items: ["Prometheus", "Grafana", "Datadog", "ELK Stack", "OpenTelemetry", "PagerDuty"],
  },
  {
    name: "languages_scripting",
    items: ["Python", "Go", "Bash", "YAML", "HCL", "JavaScript"],
  },
  {
    name: "networking_security",
    items: ["Nginx", "HAProxy", "Vault", "Cert-Manager", "Calico", "WireGuard"],
  },
];

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
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[200px_1fr] gap-3 text-xs text-muted-foreground uppercase border-b border-border/50 pb-2">
            <span>NAMESPACE</span>
            <span>PODS (READY)</span>
          </div>

          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="sm:grid sm:grid-cols-[200px_1fr] gap-3 items-start"
            >
              <span className="text-accent text-glow-cyan text-xs block mb-2 sm:mb-0">
                {cat.name}
              </span>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded border border-border bg-secondary/60 text-xs text-foreground/90 hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}

          <div className="border-t border-border/50 pt-3 text-xs text-muted-foreground">
            <span className="text-primary">✓</span> {skillCategories.reduce((a, c) => a + c.items.length, 0)} skills across {skillCategories.length} namespaces — all pods running
          </div>
        </div>
      </TerminalWindow>
    </section>
  );
}