/**
 * Theme Color Display Component
 * Shows current accent colors in the toolbar
 */

'use client';

import { useTheme } from '@/lib/theme/useTheme';

export function ThemeColorDisplay() {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center gap-2">
      {/* Current Theme Colors */}
      <div className="flex items-center gap-1">
        <div 
          className="w-3 h-3 rounded-full border border-white/20"
          style={{ backgroundColor: `hsl(${theme.hue}, 70%, 50%)` }}
          title={`Accent 1: ${theme.hue}°`}
        />
        <div 
          className="w-3 h-3 rounded-full border border-white/20"
          style={{ backgroundColor: `hsl(${(theme.hue + 30) % 360}, 70%, 50%)` }}
          title={`Accent 2: ${(theme.hue + 30) % 360}°`}
        />
        <div 
          className="w-3 h-3 rounded-full border border-white/20"
          style={{ backgroundColor: `hsl(${(theme.hue + 180) % 360}, 70%, 50%)` }}
          title={`Accent 3: ${(theme.hue + 180) % 360}°`}
        />
      </div>
      <span className="text-xs text-foreground/60 font-mono">
        {Math.round(theme.hue)}°
      </span>
    </div>
  );
}
