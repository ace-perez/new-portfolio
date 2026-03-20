import React from 'react';
import { motion } from 'framer-motion';
import TerminalWindow from './TerminalWindow';
import { Shield } from 'lucide-react';

const certs = [
  { name: "AWS Solutions Architect – Professional", issuer: "Amazon Web Services", year: "2023" },
  { name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF", year: "2022" },
  { name: "Certified Kubernetes Security Specialist (CKS)", issuer: "CNCF", year: "2023" },
  { name: "HashiCorp Terraform Associate", issuer: "HashiCorp", year: "2022" },
  { name: "Google Cloud Professional DevOps Engineer", issuer: "Google Cloud", year: "2023" },
];

export default function CertificationsSection() {
  return (
    <section id="certifications" className="py-20">
      <div className="mb-8 font-mono">
        <span className="text-primary text-glow">$</span>
        <span className="text-muted-foreground ml-2">gpg --list-keys certifications/</span>
        <div className="h-px bg-gradient-to-r from-primary/40 to-transparent mt-3" />
      </div>

      <TerminalWindow title="certifications — verified">
        <div className="space-y-3">
          {certs.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded border border-border/50 bg-secondary/30 hover:border-primary/30 transition-colors"
            >
              <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-foreground/90 text-xs font-medium">{cert.name}</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">
                  {cert.issuer} · <span className="text-yellow-400/80">{cert.year}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </TerminalWindow>
    </section>
  );
}