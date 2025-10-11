/**
 * Navigation Component
 * Minimal nav with collapsible theme controls
 */

'use client';

import { useState } from 'react';
import { ThemeColorDisplay } from './ThemeColorDisplay';
import { useTheme } from '@/lib/theme/useTheme';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setBase, setMode } = useTheme();
  
  const navSections = [
    { id: 'services', label: 'Services' },
    { id: 'experience', label: 'Experience' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };
  
  return (
    <div className="relative">
      {/* Main Nav */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-foreground">Baz Iyer</h1>
        
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="text-foreground hover:text-accent1 transition-colors"
            >
              {section.label}
            </button>
          ))}
        </div>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 hover:bg-white/10 rounded transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-foreground">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        
        {/* Theme Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-white/10 rounded transition-colors"
          title="Theme controls"
        >
          <div className="flex items-center gap-1">
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
          </div>
        </button>
      </div>
      
      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-background/95 backdrop-blur-sm border border-accent1-200/30 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {/* Mobile Nav Links */}
            <div className="md:hidden mb-4">
              <div className="space-y-2">
                {navSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent1-200/20 rounded transition-colors"
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
                <div className="flex bg-white/20 dark:bg-black/20 rounded-lg p-1">
                  <button
                    onClick={() => setBase('light')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      theme.base === 'light'
                        ? 'bg-accent1 text-white'
                        : 'text-foreground hover:bg-white/20'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setBase('dark')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      theme.base === 'dark'
                        ? 'bg-accent1 text-white'
                        : 'text-foreground hover:bg-white/20'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
              
              {/* Mode Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Mode</span>
                <div className="flex bg-white/20 dark:bg-black/20 rounded-lg p-1">
                  <button
                    onClick={() => setMode('static')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      theme.mode === 'static'
                        ? 'bg-accent2 text-white'
                        : 'text-foreground hover:bg-white/20'
                    }`}
                  >
                    Static
                  </button>
                  <button
                    onClick={() => setMode('kaleidoscope')}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      theme.mode === 'kaleidoscope'
                        ? 'bg-accent2 text-white'
                        : 'text-foreground hover:bg-white/20'
                    }`}
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
