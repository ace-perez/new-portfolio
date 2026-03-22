import React from 'react';
import { motion } from 'framer-motion';
import TerminalWindow from './TerminalWindow';
import { GitBranch } from 'lucide-react';

export const projects = [
  {
    name: "ace-perez-portfolio",
    description: "Containerized Flask application on AWS EC2, configured with Cloudflare DNS and a reverse proxy, orchestrated via Docker Compose and running as a Linux-managed service. Includes CI/CD pipelines with automated testing and container redeployments on merge, and Prometheus monitoring for EC2 resource utilization.",
    tech: ["AWS EC2", "Python", "Docker", "CI/CD"],
    bullets: [
      "Designed and operated a containerized Flask app on AWS EC2 with Cloudflare DNS, reverse proxy, Docker Compose, and Linux service management.",
      "Implemented CI/CD pipelines with automated testing and container redeployments on merge; integrated Prometheus monitoring for EC2 resource utilization.",
    ],
  },
  {
    name: "twitter-data-visualizer",
    description: "Scalable real-time pipeline using AWS Kinesis, OpenSearch, and S3 to ingest Twitter data and generate dashboards analyzing NBA player popularity trends.",
    tech: ["AWS Kinesis", "Python", "Twitter API", "OpenSearch"],
    bullets: [
      "Designed and deployed a scalable real-time pipeline using AWS Kinesis, OpenSearch, and S3 to ingest Twitter data and generate NBA player popularity dashboards.",
    ],
  },
  {
    name: "deepracer-ml-hackathon",
    description: "Placed 3rd in AWS Ireland's Internal DeepRacer competition by developing a high-performing reinforcement learning model.",
    tech: ["AWS Bedrock", "Python", "TensorFlow"],
    bullets: [
      "Placed 3rd in AWS Ireland's Internal DeepRacer competition by developing a high-performing reinforcement learning model.",
    ],
  },
  {
    name: "medicine-intake-tracker",
    description: "Mobile app with NFC integration to improve patient medication adherence, enabling seamless intake tracking with cloud backends for secure data storage and real-time accessibility.",
    tech: ["NFC", "Flutter", "Firebase"],
    bullets: [
      "Built a mobile app with NFC integration to improve patient medication adherence, enabling seamless intake tracking.",
      "Leveraged cloud backends for secure data storage and real-time accessibility across devices.",
    ],
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