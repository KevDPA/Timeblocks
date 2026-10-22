export type SocialPlatform =
  | 'messenger'
  | 'soundcloud'
  | 'facebook'
  | 'facebook-filled'
  | 'github'
  | 'google-drive'
  | 'discord'
  | 'behance'
  | 'instagram'
  | 'youtube'
  | 'wordpress'
  | 'whatsapp'
  | 'spotify'
  | 'linkedin'
  | 'google'
  | 'figma';

interface SocialIconEntry {
  /**
   * A Material Icons name (snake_case, from @material-design-icons/svg),
   * IF a genuine brand-accurate equivalent exists there. When set,
   * SocialIcon renders it via the generic <Icon> instead of the
   * Figma-sourced logo asset — this is the override the design system
   * asked for: "material icons if and when one exists for a given
   * platform, else the design system's own icon."
   *
   * Verified empty for every platform below by searching the full,
   * installed @material-design-icons/svg catalog (2,122 icons) for each
   * name — Google's Material Icons deliberately excludes third-party
   * trademarks/brand logos as a design policy (confirmed: even "youtube"
   * only matches the unrelated "youtube_searched_for" UI icon; "google"
   * and "figma" have no self-brand mark either). If Google ever adds one,
   * set its name here and the override activates automatically — no
   * other code needs to change.
   */
  materialIconName?: string;
}

export const SOCIAL_ICON_REGISTRY: Record<SocialPlatform, SocialIconEntry> = {
  messenger: {},
  soundcloud: {},
  facebook: {},
  'facebook-filled': {},
  github: {},
  'google-drive': {},
  discord: {},
  behance: {},
  instagram: {},
  youtube: {},
  wordpress: {},
  whatsapp: {},
  spotify: {},
  linkedin: {},
  google: {},
  figma: {},
};
