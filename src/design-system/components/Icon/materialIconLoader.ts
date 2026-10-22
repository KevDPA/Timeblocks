import type { MaterialIconStyle } from './Icon';

/**
 * Loads a single Material Icons SVG by name from the jsDelivr CDN mirror of
 * the installed @material-design-icons/svg package (version pinned below,
 * matching the npm dependency). A plain runtime `fetch()`, not a bundler
 * macro — works the same under Vite, esbuild, or any other bundler, and
 * needs no build-time knowledge of which icons are used.
 */
const ICON_PKG_VERSION = '0.14.15';
const CDN_BASE = `https://cdn.jsdelivr.net/npm/@material-design-icons/svg@${ICON_PKG_VERSION}`;

const svgPromiseCache = new Map<string, Promise<string | null>>();

export async function loadMaterialIconSvg(name: string, style: MaterialIconStyle): Promise<string | null> {
  const key = `${style}/${name}`;
  let pending = svgPromiseCache.get(key);
  if (!pending) {
    pending = fetch(`${CDN_BASE}/${style}/${name}.svg`)
      .then((res) => (res.ok ? res.text() : null))
      .catch(() => null);
    svgPromiseCache.set(key, pending);
  }
  return pending;
}
