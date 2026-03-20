import React, { useState, useEffect } from 'react';
import Sidebar from '../components/portfolio/Sidebar';
import MobileSidebar from '../components/portfolio/MobileSidebar';
import HeroSection from '../components/portfolio/HeroSection';
import ExperienceSection from '../components/portfolio/ExperienceSection';
import SkillsSection from '../components/portfolio/SkillsSection';
import ProjectsSection from '../components/portfolio/ProjectsSection';
import EducationSection from '../components/portfolio/EducationSection';
import CertificationsSection from '../components/portfolio/CertificationsSection';
import ContactSection from '../components/portfolio/ContactSection';

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');

  const handleNavigate = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const sectionIds = ['home', 'experience', 'skills', 'projects', 'education', 'certifications', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((a, b) => a.boundingClientRect.top < b.boundingClientRect.top ? a : b);
          setActiveSection(top.target.id);
        }
      },
      { threshold: 0.15, rootMargin: '-80px 0px -40% 0px' }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <MobileSidebar activeSection={activeSection} onNavigate={handleNavigate} />
      </div>

      {/* Main content */}
      <main className="lg:ml-56 px-6 sm:px-10 md:px-16 lg:px-20 max-w-4xl">
        {/* Subtle scanline overlay */}
        <div className="fixed inset-0 pointer-events-none z-40 opacity-[0.015]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,65,0.08) 1px, rgba(0,255,65,0.08) 2px)',
          }}
        />

        <HeroSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <CertificationsSection />
        <ContactSection />

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