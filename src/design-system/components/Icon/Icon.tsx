import React, { useEffect, useState } from 'react';
import './Icon.css';

/** Matches Figma's Iconography page exactly — 5 style variants, same names. */
export type MaterialIconStyle = 'outlined' | 'filled' | 'round' | 'sharp' | 'two-tone';

export interface IconProps {
  /**
   * Material Icons snake_case name (e.g. "email", "help_outline",
   * "check_circle") — matches Figma's Iconography component names 1:1,
   * so a Figma icon reference translates directly with no lookup table.
   */
  name: string;
  style?: MaterialIconStyle;
  /** CSS size (any valid length). Defaults to 1em, so it follows font-size
   * the way text does — set a parent's font-size, or pass a fixed value. */
  size?: string;
  className?: string;
  /** Accessible name. Omit for a purely decorative icon (aria-hidden). */
  title?: string;
}

/**
 * Loads icons from the full @material-design-icons/svg catalog (2,122
 * icons × 5 styles) on demand, by name — not via a hand-maintained
 * registry (would need a line added per icon). The loader lives in
 * materialIconLoader.ts, fetched by name from a CDN mirror at request
 * time; reached via dynamic `import()` so its (small) module weight never
 * lands in the main bundle.
 */
const svgCache = new Map<string, string>();

export const Icon: React.FC<IconProps> = ({ name, style = 'outlined', size = '1em', className = '', title }) => {
  const cacheKey = `${style}/${name}`;
  const [svg, setSvg] = useState<string | null>(svgCache.get(cacheKey) ?? null);

  useEffect(() => {
    if (svgCache.has(cacheKey)) {
      setSvg(svgCache.get(cacheKey)!);
      return;
    }
    let cancelled = false;
    import('./materialIconLoader').then(({ loadMaterialIconSvg }) => loadMaterialIconSvg(name, style)).then((raw) => {
      if (cancelled) return;
      if (!raw) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.warn(`Icon: no Material icon named "${name}" in style "${style}". Check the name against Figma's Iconography page.`);
        }
        return;
      }
      svgCache.set(cacheKey, raw);
      setSvg(raw);
    });
    return () => {
      cancelled = true;
    };
  }, [cacheKey, name, style]);

  if (!svg) {
    return <span className={`pa-icon pa-icon--loading ${className}`} style={{ width: size, height: size }} aria-hidden="true" />;
  }

  return (
    <span
      className={`pa-icon ${className}`}
      style={{ width: size, height: size }}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Icon;
