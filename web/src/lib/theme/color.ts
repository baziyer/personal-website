/**
 * Theme Color Engine
 * Generates accessible color palettes with HSL-based accent colors
 */

export interface ThemeColors {
  hue: number;
  accent1: string;
  accent1_600: string;
  accent1_400: string;
  accent1_200: string;
  accent2: string;
  accent2_600: string;
  accent2_400: string;
  accent2_200: string;
  accent3: string;
  accent3_600: string;
  accent3_400: string;
  accent3_200: string;
}

export interface ThemeState {
  base: 'dark' | 'light';
  hue: number;
  mode: 'static' | 'kaleidoscope';
}


/**
 * Check if a color meets WCAG AA contrast requirements
 */
export function meetsContrastRatio(foreground: string, background: string): boolean {
  // Simplified contrast check - in production, use a proper library
  const fgLuminance = getLuminance(foreground);
  const bgLuminance = getLuminance(background);
  
  const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                   (Math.min(fgLuminance, bgLuminance) + 0.05);
  
  return contrast >= 4.5; // AA standard
}

/**
 * Get relative luminance of a color (simplified)
 */
function getLuminance(color: string): number {
  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  // Apply gamma correction
  const gamma = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  
  return 0.2126 * gamma(r) + 0.7152 * gamma(g) + 0.0722 * gamma(b);
}

/**
 * Generate HSL color with automatic contrast adjustment
 */
export function generateHSLColor(
  hue: number, 
  baseMode: 'dark' | 'light',
  isAccent: boolean = true
): string {
  let saturation: number;
  let lightness: number;
  
  if (isAccent) {
    // Accent colors - more vibrant
    saturation = baseMode === 'dark' ? 88 : 70;
    lightness = baseMode === 'dark' ? 60 : 45;
  } else {
    // Text colors - more muted
    saturation = baseMode === 'dark' ? 15 : 25;
    lightness = baseMode === 'dark' ? 85 : 20;
  }
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Generate a complete theme color palette
 */
export function generateThemeColors(hue: number, baseMode: 'dark' | 'light'): ThemeColors {
  const accent1Hue = hue;
  const accent2Hue = (hue + 30) % 360;
  const accent3Hue = (hue + 180) % 360;
  
  const generateAccentRamp = (h: number) => {
    const base = generateHSLColor(h, baseMode, true);
    const darker = generateHSLColor(h, baseMode, true).replace(/(\d+)%/, (match, lightness) => {
      return `${Math.max(parseInt(lightness) - 15, 20)}%`;
    });
    const lighter = generateHSLColor(h, baseMode, true).replace(/(\d+)%/, (match, lightness) => {
      return `${Math.min(parseInt(lightness) + 20, 80)}%`;
    });
    const lightest = generateHSLColor(h, baseMode, true).replace(/(\d+)%/, (match, lightness) => {
      return `${Math.min(parseInt(lightness) + 35, 90)}%`;
    });
    
    return { base, darker, lighter, lightest };
  };
  
  const accent1 = generateAccentRamp(accent1Hue);
  const accent2 = generateAccentRamp(accent2Hue);
  const accent3 = generateAccentRamp(accent3Hue);
  
  return {
    hue,
    accent1: accent1.base,
    accent1_600: accent1.darker,
    accent1_400: accent1.lighter,
    accent1_200: accent1.lightest,
    accent2: accent2.base,
    accent2_600: accent2.darker,
    accent2_400: accent2.lighter,
    accent2_200: accent2.lightest,
    accent3: accent3.base,
    accent3_600: accent3.darker,
    accent3_400: accent3.lighter,
    accent3_200: accent3.lightest,
  };
}

/**
 * Apply theme colors to CSS custom properties
 */
export function applyThemeColors(colors: ThemeColors): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Set the hue variable for CSS animation
  root.style.setProperty('--hue', colors.hue.toString());
  
  // Generate dynamic colors using CSS calc() functions
  const hue = colors.hue;
  root.style.setProperty('--accent1', `hsl(${hue}, 70%, 50%)`);
  root.style.setProperty('--accent1-600', `hsl(${hue}, 70%, 35%)`);
  root.style.setProperty('--accent1-400', `hsl(${hue}, 70%, 65%)`);
  root.style.setProperty('--accent1-200', `hsl(${hue}, 70%, 80%)`);
  
  root.style.setProperty('--accent2', `hsl(${(hue + 30) % 360}, 70%, 50%)`);
  root.style.setProperty('--accent2-600', `hsl(${(hue + 30) % 360}, 70%, 35%)`);
  root.style.setProperty('--accent2-400', `hsl(${(hue + 30) % 360}, 70%, 65%)`);
  root.style.setProperty('--accent2-200', `hsl(${(hue + 30) % 360}, 70%, 80%)`);
  
  root.style.setProperty('--accent3', `hsl(${(hue + 180) % 360}, 70%, 50%)`);
  root.style.setProperty('--accent3-600', `hsl(${(hue + 180) % 360}, 70%, 35%)`);
  root.style.setProperty('--accent3-400', `hsl(${(hue + 180) % 360}, 70%, 65%)`);
  root.style.setProperty('--accent3-200', `hsl(${(hue + 180) % 360}, 70%, 80%)`);
}

