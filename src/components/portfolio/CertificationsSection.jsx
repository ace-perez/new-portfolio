import React from 'react';
import { motion } from 'framer-motion';
import TerminalWindow from './TerminalWindow';
import { Shield } from 'lucide-react';

export const certs = [
  { name: "Oracle Certified Associate, Java SE 8 Programmer", issuer: "Oracle", year: "", url: "https://catalog-education.oracle.com/ords/certview/sharebadge?id=EC6D4B34BDDFC093C35C55E5AA65CFF58D3657EEAF231356F5D3B3E2BF236F5B" },
  { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", year: "", url: "https://www.credly.com/badges/8bf039fa-2dfb-4fb5-a0b3-5161b8dc5364?source=linked_in_profile", note: "renewal pending" },
  { name: "AWS Academy Graduate – AWS Academy Cloud Architecting", issuer: "Amazon Web Services", year: "", url: "https://www.credly.com/badges/63a9502c-04f4-407e-9390-338a257329e5" },
  { name: "CCNAv7: Switching, Routing, and Wireless Essentials", issuer: "Cisco", year: "" },
  { name: "CCNAv7: Enterprise Networking, Security, and Automation", issuer: "Cisco", year: "" },
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
              className={`flex items-start gap-3 p-3 rounded border border-border/50 bg-secondary/30 transition-colors ${cert.url ? 'hover:border-primary/30 cursor-pointer' : 'hover:border-primary/30'}`}
              onClick={() => cert.url && window.open(cert.url, '_blank')}
            >
              <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className={`text-xs font-medium ${cert.url ? 'text-primary/90 hover:text-primary' : 'text-foreground/90'}`}>{cert.name}</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">
                  {cert.issuer}{cert.year && <> · <span className="text-yellow-400/80">{cert.year}</span></>}{cert.note && <> · <span className="text-yellow-400/60 italic">{cert.note}</span></>}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </TerminalWindow>
    </section>
  );
}