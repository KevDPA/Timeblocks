import React from 'react';
import { Icon } from './Icon';
import { SOCIAL_ICON_REGISTRY, type SocialPlatform } from './socialIconRegistry';
import { SOCIAL_ICON_ASSETS } from './socialIconAssets';
import './Icon.css';

export type { SocialPlatform };

export interface SocialIconProps {
  platform: SocialPlatform;
  /** "default" = full brand color (recommended — preserves brand
   * recognition). "black" = monochrome, follows currentColor. */
  variant?: 'default' | 'black';
  /** CSS size for the icon's height; width follows the logo's natural
   * aspect ratio (these are not uniformly square, e.g. Facebook's mark
   * is 12:24). Defaults to 1em. */
  size?: string;
  className?: string;
  /** Accessible name. Defaults to a human-readable platform name. */
  title?: string;
}

const DEFAULT_LABELS: Record<SocialPlatform, string> = {
  messenger: 'Messenger',
  soundcloud: 'SoundCloud',
  facebook: 'Facebook',
  'facebook-filled': 'Facebook',
  github: 'GitHub',
  'google-drive': 'Google Drive',
  discord: 'Discord',
  behance: 'Behance',
  instagram: 'Instagram',
  youtube: 'YouTube',
  wordpress: 'WordPress',
  whatsapp: 'WhatsApp',
  spotify: 'Spotify',
  linkedin: 'LinkedIn',
  google: 'Google',
  figma: 'Figma',
};

/**
 * Renders a social/brand platform icon, applying the design system's
 * override policy: a Material Icon if the registry names a genuine
 * equivalent for this platform, otherwise the Figma-sourced logo asset.
 * See socialIconRegistry.ts for why every entry currently falls back —
 * this is a real, working mechanism, not a placeholder, it just has
 * nothing to override with today.
 */
export const SocialIcon: React.FC<SocialIconProps> = ({
  platform,
  variant = 'default',
  size = '1em',
  className = '',
  title,
}) => {
  const registryEntry = SOCIAL_ICON_REGISTRY[platform];
  const accessibleName = title ?? DEFAULT_LABELS[platform];

  if (registryEntry.materialIconName) {
    return <Icon name={registryEntry.materialIconName} size={size} className={className} title={accessibleName} />;
  }

  const asset = SOCIAL_ICON_ASSETS[platform];
  const svg = variant === 'black' ? asset.black : asset.default;

  return (
    <span
      className={`pa-icon pa-social-icon ${className}`}
      style={{ height: size, width: 'auto' }}
      role={accessibleName ? 'img' : undefined}
      aria-label={accessibleName}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default SocialIcon;
