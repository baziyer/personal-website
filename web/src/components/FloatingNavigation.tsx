/**
 * Floating Navigation Component
 * Floating rounded navigation with backdrop blur and ghost buttons
 */

'use client';

import { useState, useEffect } from 'react';
import { ThemeColorDisplay } from './ThemeColorDisplay';
import { useTheme } from '@/lib/theme/useTheme';

export function FloatingNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { theme, setBase, setMode } = useTheme();
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  const navSections = [
    { id: 'about', label: 'About' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'vulcan', label: 'Vulcan' },
    { id: 'services', label: 'Engagements' }
  ];
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };
  
  return (
    <div className="floating-nav">
      <div className="flex items-center gap-2">
        {/* Brand removed per request; keep padding for balance */}
        <div className="px-1" />
        
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="btn-ghost text-sm"
            >
              {section.label}
            </button>
          ))}
        </div>
        
        {/* Theme Controls Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 transition-colors"
          title="Theme controls"
          style={{ borderRadius: 'var(--radius-pill)' }}
        >
          <div className="flex items-center gap-1">
            {isHydrated ? (
              <>
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: `hsl(${Math.round(theme.hue)}, 70%, 50%)` }}
                />
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: `hsl(${Math.round((theme.hue + 30) % 360)}, 70%, 50%)` }}
                />
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: `hsl(${Math.round((theme.hue + 180) % 360)}, 70%, 50%)` }}
                />
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <div className="w-2 h-2 rounded-full bg-gray-400" />
              </>
            )}
          </div>
        </button>
        
        {/* Book a call CTA */}
        <button
          onClick={() => {
            // This will be handled by the parent component
            const event = new CustomEvent('openContactModal');
            window.dispatchEvent(event);
          }}
          className="btn-ghost text-sm ml-2"
        >
          Book a call
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-white/10 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-foreground">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      
      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-background/95 backdrop-blur-sm border border-accent1-200/30 shadow-lg z-50" style={{ borderRadius: 'var(--radius-lg)' }} onMouseLeave={() => setIsMenuOpen(false)}>
          <div className="p-4">
            {/* Mobile Nav Links */}
            <div className="md:hidden mb-4">
              <div className="space-y-1">
                {navSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent1-200/20 transition-colors"
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Theme Controls */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Theme Controls</h3>
              
              {/* Base Theme Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Base Theme</span>
                <div className="flex bg-white/20 dark:bg-black/20 p-1" style={{ borderRadius: 'var(--radius-pill)' }}>
                  <button
                    onClick={() => setBase('light')}
                    className={`px-3 py-1 text-xs transition-colors ${
                      theme.base === 'light'
                        ? 'bg-accent1 text-black'
                        : 'text-foreground hover:bg-white/20'
                    }`}
                    style={{ borderRadius: 'var(--radius-pill)' }}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setBase('dark')}
                    className={`px-3 py-1 text-xs transition-colors ${
                      theme.base === 'dark'
                        ? 'bg-accent1 text-black'
                        : 'text-foreground hover:bg-white/20'
                    }`}
                    style={{ borderRadius: 'var(--radius-pill)' }}
                  >
                    Dark
                  </button>
                </div>
              </div>
              
              {/* Mode Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Mode</span>
                <div className="flex bg-white/20 dark:bg-black/20 p-1" style={{ borderRadius: 'var(--radius-pill)' }}>
                  <button
                    onClick={() => setMode('static')}
                    className={`px-3 py-1 text-xs transition-colors ${
                      theme.mode === 'static'
                        ? 'bg-accent2 text-black'
                        : 'text-foreground hover:bg-white/20'
                    }`}
                    style={{ borderRadius: 'var(--radius-pill)' }}
                  >
                    Static
                  </button>
                  <button
                    onClick={() => setMode('kaleidoscope')}
                    className={`px-3 py-1 text-xs transition-colors ${
                      theme.mode === 'kaleidoscope'
                        ? 'bg-accent2 text-black'
                        : 'text-foreground hover:bg-white/20'
                    }`}
                    style={{ borderRadius: 'var(--radius-pill)' }}
                  >
                    Kaleidoscope
                  </button>
                </div>
              </div>
              
              {/* Theme Color Display */}
              <ThemeColorDisplay />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
