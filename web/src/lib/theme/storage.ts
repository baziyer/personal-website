/**
 * Theme Storage Utilities
 * Safe localStorage operations with fallbacks
 */

import { ThemeState } from './color';

const STORAGE_KEY = 'baziyer-theme';

/**
 * Safe localStorage getter with fallback
 */
export function getStoredTheme(): ThemeState | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    // Validate the stored theme
    if (
      typeof parsed === 'object' &&
      typeof parsed.base === 'string' &&
      ['dark', 'light'].includes(parsed.base) &&
      typeof parsed.hue === 'number' &&
      parsed.hue >= 0 && parsed.hue <= 360 &&
      typeof parsed.mode === 'string' &&
      ['static', 'kaleidoscope'].includes(parsed.mode)
    ) {
      return parsed as ThemeState;
    }
  } catch (error) {
    console.warn('Failed to parse stored theme:', error);
  }
  
  return null;
}

/**
 * Safe localStorage setter with error handling
 */
export function setStoredTheme(theme: ThemeState): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    return true;
  } catch (error) {
    console.warn('Failed to store theme:', error);
    return false;
  }
}

/**
 * Get initial theme state with fallbacks
 */
export function getInitialTheme(): ThemeState {
  const stored = getStoredTheme();
  
  if (stored) {
    return stored;
  }
  
  // Fallback to system preferences and Home Energy Foundry brand colors
  const prefersDark = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Randomize initial hue (0-359) and default to kaleidoscope mode
  const randomHue = Math.floor(Math.random() * 360);

  return {
    base: prefersDark ? 'dark' : 'light',
    hue: randomHue,
    mode: 'kaleidoscope'
  };
}

/**
 * Clear stored theme (reset to defaults)
 */
export function clearStoredTheme(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear stored theme:', error);
  }
}
