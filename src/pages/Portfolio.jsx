import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/portfolio/Sidebar';
import MobileSidebar from '../components/portfolio/MobileSidebar';
import HeroSection from '../components/portfolio/HeroSection';
import ExperienceSection from '../components/portfolio/ExperienceSection';
import SkillsSection from '../components/portfolio/SkillsSection';
import ProjectsSection from '../components/portfolio/ProjectsSection';
import EducationSection from '../components/portfolio/EducationSection';
import CertificationsSection from '../components/portfolio/CertificationsSection';
import GamesSection from '../components/portfolio/GamesSection';
import ContactSection from '../components/portfolio/ContactSection';
import CRTBackground from '../components/portfolio/CRTBackground';
import InteractiveTerminal from '../components/portfolio/InteractiveTerminal';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const isNavigating = useRef(false);
  const sectionIds = ['home', 'experience', 'skills', 'projects', 'education', 'certifications', 'games', 'contact'];

  const handleNavigate = (id) => {
    const el = document.getElementById(id);
    if (el) {
      isNavigating.current = true;
      setActiveSection(id);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => { isNavigating.current = false; }, 1200);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isNavigating.current) return;

      // If near the bottom of the page, activate contact
      const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 80;
      if (nearBottom) {
        setActiveSection('contact');
        return;
      }

      const offset = 120;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <CRTBackground />
      {/* Desktop sidebar */}
      <div className="relative z-10 hidden lg:block">
        <Sidebar activeSection={activeSection} onNavigate={handleNavigate} onCollapse={setSidebarCollapsed} />
      </div>

      {/* Mobile sidebar */}
      <div className="relative z-10 lg:hidden">
        <MobileSidebar activeSection={activeSection} onNavigate={handleNavigate} />
      </div>

      {/* Main content */}
      <main className={`relative z-10 transition-all duration-250 px-6 sm:px-10 md:px-16 lg:px-20 max-w-4xl ${sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-56'}`}>
        <HeroSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <CertificationsSection />
        <GamesSection />
        <ContactSection />

        {/* Terminal FAB with ASCII pointer */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-1">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="font-mono text-primary text-[12px] leading-tight text-glow select-none flex flex-col items-center"
          >
            <div>try me!</div>
            <div>↓</div>
          </motion.div>
          <button
            onClick={() => setTerminalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-mono text-xs font-semibold shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            title="Open interactive terminal"
          >
            <span className="text-primary-foreground/70">$</span> terminal
            <span className="cursor-blink font-bold">▌</span>
          </button>
        </div>

        <InteractiveTerminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />

        {/* Footer */}
        <footer className="py-12 border-t border-border/30 font-mono text-xs text-muted-foreground text-center">
          <div className="space-y-1">
            <p>
              <span className="text-primary">$</span> echo "Built with ☕ and too many yaml files"
            </p>
            <p className="text-[10px]">© {new Date().getFullYear()} — All systems nominal</p>
          </div>
        </footer>
      </main>
    </div>
  );
}