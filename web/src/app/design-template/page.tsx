/**
 * Design Template Page
 * Comprehensive test page for theme system and components
 */

'use client';

import { FloatingNavigation } from '@/components/FloatingNavigation';
import { ContactModal } from '@/components/ContactModal';
import { useTheme } from '@/lib/theme/useTheme';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import engagementsData from '@/data/engagements.json';

function DesignTemplateContent() {
  // theme state consumed implicitly via CSS vars; avoid unused vars for lint
  useTheme();
  const searchParams = useSearchParams();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>();
  // Engagement filtering state
  const [selectedRoleType, setSelectedRoleType] = useState<string>('Product');
  const [engagementMode, setEngagementMode] = useState<'hire' | 'scoped'>('hire');
  // Parallax state
  const vulcanSectionRef = useRef<HTMLDivElement>(null);
  const [vulcanOffset, setVulcanOffset] = useState(0);
  
  const openContactModal = (service?: string) => {
    setPreselectedService(service);
    setIsContactModalOpen(true);
  };

  // Helper functions for engagement filtering
  const getUniqueRoleTypes = () => {
    return [...new Set(engagementsData.engagements.map(e => e.roleType))];
  };

  const getFilteredEngagements = () => {
    const timeframeOrder = ['Full time', '6 months', 'Fractional', '1 week', '1 day'];
    const hireTimeframes = ['Full time', 'Fractional'];
    const scopedTimeframes = ['6 months', '1 week', '1 day'];
    
    return engagementsData.engagements
      .filter(e => e.roleType === selectedRoleType)
      .filter(e => {
        if (engagementMode === 'hire') {
          return hireTimeframes.includes(e.timeframe);
        } else {
          return scopedTimeframes.includes(e.timeframe);
        }
      })
      .sort((a, b) => {
        const aIndex = timeframeOrder.indexOf(a.timeframe);
        const bIndex = timeframeOrder.indexOf(b.timeframe);
        return aIndex - bIndex;
      });
  };

  const updateUrlParams = (role: string, mode: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('role', role);
    url.searchParams.set('mode', mode);
    window.history.replaceState({}, '', url.toString());
  };

  // Initialize from URL params
  useEffect(() => {
    const roleParam = searchParams.get('role');
    const modeParam = searchParams.get('mode');
    
    if (roleParam && ['Product', 'Business', 'Data & Analytics'].includes(roleParam)) {
      setSelectedRoleType(roleParam);
    }
    
    if (modeParam && ['hire', 'scoped'].includes(modeParam)) {
      setEngagementMode(modeParam as 'hire' | 'scoped');
    }
  }, [searchParams]);

  // Listen for navigation CTA events
  useEffect(() => {
    const handleOpenContactModal = () => {
      openContactModal();
    };

    window.addEventListener('openContactModal', handleOpenContactModal);
    return () => window.removeEventListener('openContactModal', handleOpenContactModal);
  }, []);

  // Parallax effect for Vulcan image
  useEffect(() => {
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    let rafId = 0;
    const onScroll = () => {
      if (!vulcanSectionRef.current) return;
      const rect = vulcanSectionRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportH / 2;
      const progress = Math.max(-1, Math.min(1, (viewportCenter - sectionCenter) / (rect.height || 1)));
      const target = progress * 30; // max ±30px pan
      rafId = window.requestAnimationFrame(() => setVulcanOffset(target));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll as EventListener);
      window.removeEventListener('resize', onScroll as EventListener);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Floating Navigation */}
      <FloatingNavigation />
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)}
        preselectedService={preselectedService}
      />
      
      
      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 bg-gradient-to-br from-background via-accent3-200/10 to-accent1-200/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-3">
            Baz Iyer
          </h1>
          <p className="text-2xl md:text-4xl font-semibold text-foreground mb-6">
            Founder, Product & Data Leader
          </p>
          <p className="text-lg md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto">
            I build things and help teams ship, learn and decide fast
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => openContactModal()}
              className="btn-primary cta-glow text-lg"
            >
              Schedule a Call
            </button>
            <button 
              onClick={() => openContactModal()}
              className="btn-secondary text-lg"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-r from-accent1-200/10 to-accent2-200/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">About</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Product & Data Leader, Entrepreneur and Polymath
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Baz image */}
            <div className="order-1 md:order-none">
              <img src="/Baz Colour.png" alt="Baz Iyer" className="w-full h-auto rounded-2xl shadow-lg" />
            </div>
            {/* Right: Story and achievements */}
            <div className="order-2 md:order-none">
              <h3 className="text-2xl font-bold text-foreground mb-4">My Story</h3>
              <p className="text-foreground/70 mb-6">
                I&apos;ve spent <b>7 years building innovative products and teams</b> in London tech companies, including my own startup Vulcan. I enjoy building as an IC, as well as managing and coaching others.
                My specialty is <b>using data and AI to make better decisions</b>, and building the capabilities of companies and teams to use these tools.
              </p>
              <p className="text-foreground/70 mb-6">
                My career started as a management consultant at the Boston Consulting Group, and I hold MBA and Law degrees.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1 bg-accent1-200/30 text-accent1-600 rounded-full text-sm font-medium">Product Strategy</span>
                <span className="px-3 py-1 bg-accent2-200/30 text-accent2-600 rounded-full text-sm font-medium">Data & Analytics</span>
                <span className="px-3 py-1 bg-accent3-200/30 text-accent3-600 rounded-full text-sm font-medium">Team Leadership</span>
                <span className="px-3 py-1 bg-accent1-200/30 text-accent1-600 rounded-full text-sm font-medium">AI Integration</span>
              </div>
              <div className="bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-xl p-6 border border-accent1-200/30">
                <h4 className="text-xl font-semibold text-foreground mb-4">Key Achievements</h4>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent1 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Built building physics software startup as a solo founder, from concept to recurring revenues from 12 businesses. Raised £110k+ funds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent2 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Led launch of weight loss product (combining mobile apps, coaching and GLP-1 medications) from concept to £20K MRR in 6 months</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent3 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Led data science at NatWest digital bank. Oversaw AI/ML products. Led company data review, the best attended meeting outside all hands</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-accent1 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Single-handedly built software to model the physics of homes, including CAD data entry, simulation pipeline, and AI-led regulatory & tech stack</span>
                  </li>
                </ul>
                {/* Experience Accordion moved to bottom of About */}
                <div className="hidden" />
              </div>
            </div>
          </div>

          {/* Show full CV accordion across bottom of About */}
          <details className="mt-8 group">
            <summary className="cursor-pointer list-none">
              <div className="flex items-center justify-between px-5 py-4 bg-white/5 rounded-xl border border-accent1-200/30 hover:bg-white/10 transition-colors">
                <span className="font-semibold">Show full CV</span>
                <span className="text-foreground/60 group-open:rotate-180 transition-transform">▾</span>
              </div>
            </summary>
            <div className="mt-6 space-y-6">
                    {/* HOME ENERGY FOUNDRY */}
                    <div className="rounded-lg p-4 bg-white/5 border border-accent1-200/30">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h5 className="font-semibold">Founder & Director</h5>
                        <span className="text-sm text-foreground/60">2023 – now</span>
                      </div>
                      <p className="text-accent1 text-sm mb-2">
                        <a href="https://www.usevulcan.app" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
                          HOME ENERGY FOUNDRY
                        </a>
                        , London (Pre-seed, usevulcan.app)
                      </p>
                      <ul className="text-sm text-foreground/70 list-disc ml-5 space-y-1">
                        <li>Closed 12 B2B SaaS subscriptions (including Savills) and raised £110k total funding.</li>
                        <li>Single-handedly built energy modelling software, with CAD, simulation and visualisation features.</li>
                        <li>Developed AI-driven operating processes aligned to UK Government (MHCLG) requirements.</li>
                      </ul>
                    </div>
                    {/* SHUFFLE */}
                    <div className="rounded-lg p-4 bg-white/5 border border-accent2-200/30">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h5 className="font-semibold">Fractional Product Lead</h5>
                        <span className="text-sm text-foreground/60">2024 – now</span>
                      </div>
                      <p className="text-accent2 text-sm mb-2">
                        <a href="https://getshuffle.co.uk" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
                          SHUFFLE FINANCE
                        </a>
                        , London (Seed, getshuffle.co.uk)
                      </p>
                      <ul className="text-sm text-foreground/70 list-disc ml-5 space-y-1">
                        <li>Developed financial model and automated operations tooling.</li>
                        <li>Led 3-person team of designers and analysts; developed product roadmap.</li>
                        <li>Launched data products for business customers, including LLM‑driven analytics.</li>
                      </ul>
                    </div>
                    {/* NUMAN */}
                    <div className="rounded-lg p-4 bg-white/5 border border-accent3-200/30">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h5 className="font-semibold">Lead Product Manager</h5>
                        <span className="text-sm text-foreground/60">2022</span>
                      </div>
                      <p className="text-accent3 text-sm mb-2">
                        <a href="https://numan.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
                          NUMAN
                        </a>
                        , London (Series B, numan.com)
                      </p>
                      <ul className="text-sm text-foreground/70 list-disc ml-5 space-y-1">
                        <li>Led regulated weight loss product (mobile app, on‑demand coaching, GLP‑1 medication) from concept to £20k MRR (~100 paying customers) in 6 months.</li>
                        <li>Built and led 9‑person cross‑functional squad of doctors, engineers, designers and analysts.</li>
                      </ul>
                    </div>
                    {/* METTLE */}
                    <div className="rounded-lg p-4 bg-white/5 border border-accent1-200/30">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h5 className="font-semibold">Head of Product Strategy and Data Analytics</h5>
                        <span className="text-sm text-foreground/60">2020 – 2021</span>
                      </div>
                      <p className="text-accent1 text-sm mb-2">
                        <a href="https://mettle.co.uk" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
                          METTLE by NATWEST GROUP
                        </a>
                        , London (SME digital bank / bank‑as‑a‑service)
                      </p>
                      <ul className="text-sm text-foreground/70 list-disc ml-5 space-y-1">
                        <li>Stood up and led data science & analytics: 6 data scientists; platform used by 30% weekly; AI/ML products for fincrime, marketing and customers.</li>
                        <li>Helped scale from ~10k → 50k business customers; deposits grew +600%.</li>
                      </ul>
                    </div>
                    {/* Bó */}
                    <div className="rounded-lg p-4 bg-white/5 border border-accent2-200/30">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h5 className="font-semibold">New Proposition Lead</h5>
                        <span className="text-sm text-foreground/60">2019</span>
                      </div>
                      <p className="text-accent2 text-sm mb-2">Bó by NATWEST GROUP, London (Full stack digital retail bank – closed)</p>
                      <ul className="text-sm text-foreground/70 list-disc ml-5 space-y-1">
                        <li>Launched digital current account for under 18s (market first by a high street bank).</li>
                      </ul>
                    </div>
                    {/* Loot */}
                    <div className="rounded-lg p-4 bg-white/5 border border-accent3-200/30">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h5 className="font-semibold">Head of Special Projects</h5>
                        <span className="text-sm text-foreground/60">2018 – 2019</span>
                      </div>
                      <p className="text-accent3 text-sm mb-2">LOOT FINANCIAL SERVICES, London (Digital banking app for 18–25s – closed)</p>
                      <ul className="text-sm text-foreground/70 list-disc ml-5 space-y-1">
                        <li>Supported CEO/COO; partnerships, revenue strategy, OKRs; acqui-hire to NatWest.</li>
                      </ul>
                    </div>
                    {/* BCG */}
                    <div className="rounded-lg p-4 bg-white/5 border border-accent1-200/30">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h5 className="font-semibold">Consultant (promoted from Associate)</h5>
                        <span className="text-sm text-foreground/60">2014 – 2017</span>
                      </div>
                      <p className="text-accent1 text-sm mb-2">THE BOSTON CONSULTING GROUP, Australia, Denmark</p>
                      <ul className="text-sm text-foreground/70 list-disc ml-5 space-y-1">
                        <li>Top-decile ratings; £100k+ MBA sponsorship; energy/industrial/public sector work.</li>
                      </ul>
                    </div>

                    {/* Education */}
                    <div className="pt-2">
                      <h5 className="font-semibold text-foreground mt-6 mb-2">Education</h5>

                      {/* LBS */}
                      <div className="rounded-lg p-4 bg-white/5 border border-accent2-200/30">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-medium">London Business School — Masters of Business Administration</span>
                          <span className="text-sm text-foreground/60">2017 – 2019</span>
                        </div>
                        <ul className="text-sm text-foreground/70 list-disc ml-5 space-y-1">
                          <li>GMAT 760 (top 1% percentile).</li>
                          <li>Dean’s List (top 10% of cohort).</li>
                        </ul>
                      </div>

                      {/* UWA */}
                      <div className="rounded-lg p-4 bg-white/5 border border-accent3-200/30 mt-4">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-medium">University of Western Australia — LLB (Hons); BA (Economics)</span>
                          <span className="text-sm text-foreground/60">2008 – 2013</span>
                        </div>
                        <ul className="text-sm text-foreground/70 list-disc ml-5 space-y-1">
                          <li>Fogarty Foundation scholar (100% tuition + bursary for 6‑year degree).</li>
                          <li>99.95 entrance exam (top 0.05%); State 1st in Calculus; top 0.5% in Physics, Chemistry and Applicable Mathematics.</li>
                        </ul>
                      </div>
                    </div>
            </div>
          </details>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-accent2-200/10 to-accent3-200/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Testimonials</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              What others say about working with me
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl p-6 border border-accent1-200/30">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent1 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  OP
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-foreground">Ollie Purdue</h4>
                  <p className="text-sm text-foreground/60">Fintech CEO & former VC Partner</p>
                </div>
                <a 
                  href="https://www.linkedin.com/in/olliepurdue/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-accent1 transition-colors"
                  title="View LinkedIn Profile"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
              <p className="text-foreground/70 italic">
                &quot;Baz levels up everyone around him. Highly analytical, calm under pressure, and my first call for the hardest problems. He creates systems and teams that keep working after he’s gone.&quot;
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-6 border border-accent2-200/30">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent2 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  DS
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-foreground">Dave Sherwood</h4>
                  <p className="text-sm text-foreground/60">Edtech CEO & Rhodes Scholar</p>
                </div>
                <a 
                  href="https://www.linkedin.com/in/davejlsherwood/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-accent2 transition-colors"
                  title="View LinkedIn Profile"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
              <p className="text-foreground/70 italic">
                &quot;Baz is incredibly intelligent and efficient. He gets things done to a high standard and twice as fast as most other people. An A player you want on your team.&quot;
              </p>
            </div>
            
            <div className="bg-background rounded-xl p-6 border border-accent3-200/30">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent3 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  TN
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-foreground">Tim Naylor</h4>
                  <p className="text-sm text-foreground/60">Advisor, Investor, former Tech exec </p>
                </div>
                <a 
                  href="https://www.linkedin.com/in/timnaylorpublic/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-accent3 transition-colors"
                  title="View LinkedIn Profile"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
              <p className="text-foreground/70 italic">
                &quot;Baz brings unique clarity to complex business problems. He is bright, personable and hard working. I have no hesitation recommending him, particularly where time-critical and high-value intervention is required.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section removed (now in About accordion) */}

      {/* Vulcan Section (brand-isolated, shorter with parallax) */}
      <section id="vulcan" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={vulcanSectionRef} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1A3437' }}>
            <div className="grid md:grid-cols-2 items-stretch">
              {/* Parallax Image */}
              <div className="relative overflow-hidden h-64 md:h-auto md:min-h-[18rem]">
                <img src="/vulcan/blackwhitebuilding.jpg" alt="Black & white building" className="absolute inset-0 w-full h-full object-cover will-change-transform" style={{ transform: `translateY(${vulcanOffset}px) scale(1.2)`, transition: 'transform 60ms linear' }} />
              </div>
              {/* Content */}
              <div className="p-8 md:p-10 text-white flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <img src="/vulcan/VulcanLogo - large.png" alt="Vulcan logo" className="h-10 w-auto" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Vulcan</h3>
                <p className="text-white/80 mb-6 max-w-prose">
                  UK homes are polluting and expensive to heat. Vulcan enables home assessment and design professionals to use the Home Energy Model, the future foundation of UK new home standards and Energy Performance Certificates.
                  <br />
                  <br />
                  Unlike existing tools, Vulcan is designed to integrate with existing workflows, be faster and less work to use, and enable assessors to create more value for their clients.
                </p>
                <a
                  href="https://www.usevulcan.app" target="_blank" rel="noopener noreferrer"
                  className="inline-block px-6 py-3 font-semibold"
                  style={{ backgroundColor: '#EAFD5A', color: '#1A3437', borderRadius: 'var(--radius-md)' }}
                >
                  Visit Vulcan →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Engagements (JSON-driven) - filtered by roleType and mode */}
      <section id="services" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Engagements</h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">Flexible options by type of work</p>
          </div>
          
          {/* Combined Filter Pills - Single Row */}
          <div className="flex justify-center items-center gap-4 mb-8">
            {/* Role Type Pills */}
            {getUniqueRoleTypes().map((roleType) => (
              <button
                key={roleType}
                onClick={() => {
                  setSelectedRoleType(roleType);
                  updateUrlParams(roleType, engagementMode);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedRoleType === roleType
                    ? 'bg-accent1 text-white'
                    : 'bg-white/10 text-foreground hover:bg-white/20'
                }`}
              >
                {roleType}
              </button>
            ))}
            
            {/* Separator */}
            <div className="w-px h-6 bg-foreground/20 mx-2"></div>
            
            {/* Engagement Mode Pills */}
            <button
              onClick={() => {
                setEngagementMode('hire');
                updateUrlParams(selectedRoleType, 'hire');
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                engagementMode === 'hire'
                  ? 'bg-accent2 text-white'
                  : 'bg-white/10 text-foreground hover:bg-white/20'
              }`}
            >
              Hire
            </button>
            <button
              onClick={() => {
                setEngagementMode('scoped');
                updateUrlParams(selectedRoleType, 'scoped');
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                engagementMode === 'scoped'
                  ? 'bg-accent2 text-white'
                  : 'bg-white/10 text-foreground hover:bg-white/20'
              }`}
            >
              Scoped
            </button>
          </div>

          {/* Engagement Cards */}
          <div className="overflow-x-auto">
            <div className="flex gap-6 pb-4" style={{ minWidth: 'max-content' }}>
              {getFilteredEngagements().map((engagement) => (
                <div key={engagement.id} className="bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-xl p-6 border border-accent1-200/30 hover:border-accent1-400 transition-colors flex-shrink-0 flex flex-col justify-between" style={{ width: '380px', minHeight: '320px' }}>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-foreground">{engagement.name}</h4>
                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2 py-1 text-xs rounded-full bg-accent1-200/30 text-accent1-700">{engagement.roleType}</span>
                        <span className="text-xs text-foreground/60 font-mono">{engagement.timeframe}</span>
                      </div>
                    </div>
                    <p className="text-foreground/70 mb-4">{engagement.summary}</p>
                    <ul className="text-sm text-foreground/70 space-y-2">
                      {engagement.deliverables.map((d, i) => (
                        <li key={i} className="flex items-center gap-2"><span className="w-2 h-2 bg-accent1 rounded-full"></span>{d}</li>
                      ))}
                    </ul>
                  </div>
                  <button 
                    onClick={() => openContactModal(`${engagement.roleType} - ${engagement.name}`)}
                    className="w-full btn-primary mt-6"
                  >
                    {engagement.ctaText}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {getFilteredEngagements().length === 0 && (
            <div className="text-center py-12">
              <p className="text-foreground/60 mb-4">No engagements available for this combination.</p>
              <button
                onClick={() => {
                  setEngagementMode('hire');
                  updateUrlParams(selectedRoleType, 'hire');
                }}
                className="btn-secondary"
              >
                View Hire Options
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-foreground/70 mb-8">
            Let&apos;s discuss how I can help accelerate your product development
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => openContactModal()}
              className="btn-primary cta-glow text-lg"
            >
              Schedule a Call
            </button>
            <a 
              href="mailto:bharath.iyer.1@gmail.com?subject=Website%20Message%20from%20Baz%20Iyer&body=Hi%20Baz,%5Cn%5CnI%27d%20like%20to%20get%20in%20touch%20about..."
              className="btn-secondary text-lg inline-flex items-center justify-center"
            >
              Send Message
            </a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-accent1-200/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-foreground/60">
              © 2025 Baz Iyer. Built with Next.js and Tailwind CSS.
            </p>
            <div className="mt-4 flex justify-center gap-6">
              <a href="https://www.linkedin.com/in/baziyer/" target="_blank" rel="noopener noreferrer" className="text-accent1 hover:text-accent1-600 transition-colors">LinkedIn</a>
              <a href="https://github.com/baziyer" target="_blank" rel="noopener noreferrer" className="text-accent3 hover:text-accent3-600 transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function DesignTemplatePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-foreground">Loading...</div>
    </div>}>
      <DesignTemplateContent />
    </Suspense>
  );
}
