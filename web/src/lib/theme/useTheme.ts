/**
 * Theme Hook
 * Main hook for theme state management and controls
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ThemeState, 
  generateThemeColors, 
  applyThemeColors
} from './color';
import { getInitialTheme, setStoredTheme } from './storage';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeState>(() => {
    // Use a safe default for SSR
    if (typeof window === 'undefined') {
      return {
        base: 'light',
        hue: 45,
        mode: 'static'
      };
    }
    return getInitialTheme();
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Handle hydration and initialization
  useEffect(() => {
    setIsHydrated(true);
    // Update theme with actual stored values after hydration
    const actualTheme = getInitialTheme();
    setTheme(actualTheme);
    setIsLoading(false);
    
    // Apply initial theme
    const colors = generateThemeColors(actualTheme.hue, actualTheme.base);
    applyThemeColors(colors);
    
    // Apply data-theme attribute
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', actualTheme.base);
    }
  }, []);
  
  // Handle kaleidoscope mode changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    const root = document.documentElement;
    
    console.log('Kaleidoscope mode change:', { mode: theme.mode });
    
    if (theme.mode === 'kaleidoscope') {
      console.log('Starting kaleidoscope animation');
      startKaleidoscope();
    } else {
      console.log('Stopping kaleidoscope animation');
      stopKaleidoscope();
    }
  }, [theme.mode]);
  
  // Kaleidoscope animation state
  const kaleidoscopeRef = useRef<number | null>(null);
  
  const startKaleidoscope = () => {
    if (kaleidoscopeRef.current) return; // Already running
    
    const root = document.documentElement;
    let hue = 0;
    const targetHues = [0, 60, 120, 180, 240, 300];
    let targetIndex = 0;
    const speed = 0.5; // degrees per frame
    
    const animate = () => {
      const targetHue = targetHues[targetIndex];
      let diff = targetHue - hue;
      
      // Calculate shortest path
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      
      // Move toward target
      if (Math.abs(diff) <= speed) {
        hue = targetHue;
        targetIndex = (targetIndex + 1) % targetHues.length;
      } else {
        hue += diff > 0 ? speed : -speed;
        if (hue < 0) hue += 360;
        if (hue >= 360) hue -= 360;
      }
      
      // Update colors using the theme system
      const colors = generateThemeColors(hue, theme.base);
      applyThemeColors(colors);
      
      // Update theme state so UI components reflect current hue
      setTheme(prev => ({ ...prev, hue }));
      
      kaleidoscopeRef.current = requestAnimationFrame(animate);
    };
    
    kaleidoscopeRef.current = requestAnimationFrame(animate);
  };
  
  const stopKaleidoscope = () => {
    if (kaleidoscopeRef.current) {
      cancelAnimationFrame(kaleidoscopeRef.current);
      kaleidoscopeRef.current = null;
    }
  };
  
  /**
   * Update theme base (dark/light)
   */
  const setBase = useCallback((base: 'dark' | 'light') => {
    const newTheme = { ...theme, base };
    setTheme(newTheme);
    setStoredTheme(newTheme);
    
    // Apply data-theme attribute to html element
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', base);
    }
    
    // Only apply static colors if not in kaleidoscope mode
    if (newTheme.mode !== 'kaleidoscope') {
      const colors = generateThemeColors(newTheme.hue, base);
      applyThemeColors(colors);
    }
  }, [theme]);
  
  
  /**
   * Set specific hue
   */
  const setHue = useCallback((hue: number) => {
    const clampedHue = Math.max(0, Math.min(360, hue));
    const newTheme = { ...theme, hue: clampedHue };
    setTheme(newTheme);
    setStoredTheme(newTheme);
    
    // Only apply static colors if not in kaleidoscope mode
    if (newTheme.mode !== 'kaleidoscope') {
      const colors = generateThemeColors(clampedHue, theme.base);
      applyThemeColors(colors);
    }
  }, [theme]);
  
  /**
   * Toggle kaleidoscope mode
   */
  const setMode = useCallback((mode: 'static' | 'kaleidoscope') => {
    console.log('setMode called:', { from: theme.mode, to: mode });
    const newTheme = { ...theme, mode };
    setTheme(newTheme);
    setStoredTheme(newTheme);
    // CSS animation is handled by useEffect
  }, [theme]);
  
  
  return {
    theme,
    isLoading,
    isHydrated,
    setBase,
    setHue,
    setMode,
    isKaleidoscopeActive: theme.mode === 'kaleidoscope'
  };
}
