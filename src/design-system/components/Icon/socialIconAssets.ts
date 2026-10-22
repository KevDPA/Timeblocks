// Figma-sourced logo assets — Figma Social Icons page (140:4952), file
// QsMHb5J2xyNAxJQsypiGUc. Exported via download_assets, one pair per
// platform: "default" is the full brand-color logo (colors preserved
// exactly as authored, including multi-color/gradient marks like
// Instagram — never recolor these, brand accuracy matters); "black" was
// originally hardcoded to this design system's own --slate-800 (#42474D)
// and has been edited to fill="currentColor" so it follows the Icon/*
// token in both light and dark mode instead of going invisible on a dark
// background.
import messengerDefault from './social/messenger-default.svg?raw';
import messengerBlack from './social/messenger-black.svg?raw';
import soundcloudDefault from './social/soundcloud-default.svg?raw';
import soundcloudBlack from './social/soundcloud-black.svg?raw';
import facebookDefault from './social/facebook-default.svg?raw';
import facebookBlack from './social/facebook-black.svg?raw';
import facebookFilledDefault from './social/facebook-filled-default.svg?raw';
import facebookFilledBlack from './social/facebook-filled-black.svg?raw';
import githubDefault from './social/github-default.svg?raw';
import githubBlack from './social/github-black.svg?raw';
import googleDriveDefault from './social/google-drive-default.svg?raw';
import googleDriveBlack from './social/google-drive-black.svg?raw';
import discordDefault from './social/discord-default.svg?raw';
import discordBlack from './social/discord-black.svg?raw';
import behanceDefault from './social/behance-default.svg?raw';
import behanceBlack from './social/behance-black.svg?raw';
import instagramDefault from './social/instagram-default.svg?raw';
import instagramBlack from './social/instagram-black.svg?raw';
import youtubeDefault from './social/youtube-default.svg?raw';
import youtubeBlack from './social/youtube-black.svg?raw';
import wordpressDefault from './social/wordpress-default.svg?raw';
import wordpressBlack from './social/wordpress-black.svg?raw';
import whatsappDefault from './social/whatsapp-default.svg?raw';
import whatsappBlack from './social/whatsapp-black.svg?raw';
import spotifyDefault from './social/spotify-default.svg?raw';
import spotifyBlack from './social/spotify-black.svg?raw';
import linkedinDefault from './social/linkedin-default.svg?raw';
import linkedinBlack from './social/linkedin-black.svg?raw';
import googleDefault from './social/google-default.svg?raw';
import googleBlack from './social/google-black.svg?raw';
import figmaDefault from './social/figma-default.svg?raw';
import figmaBlack from './social/figma-black.svg?raw';

import type { SocialPlatform } from './socialIconRegistry';

export const SOCIAL_ICON_ASSETS: Record<SocialPlatform, { default: string; black: string }> = {
  messenger: { default: messengerDefault, black: messengerBlack },
  soundcloud: { default: soundcloudDefault, black: soundcloudBlack },
  facebook: { default: facebookDefault, black: facebookBlack },
  'facebook-filled': { default: facebookFilledDefault, black: facebookFilledBlack },
  github: { default: githubDefault, black: githubBlack },
  'google-drive': { default: googleDriveDefault, black: googleDriveBlack },
  discord: { default: discordDefault, black: discordBlack },
  behance: { default: behanceDefault, black: behanceBlack },
  instagram: { default: instagramDefault, black: instagramBlack },
  youtube: { default: youtubeDefault, black: youtubeBlack },
  wordpress: { default: wordpressDefault, black: wordpressBlack },
  whatsapp: { default: whatsappDefault, black: whatsappBlack },
  spotify: { default: spotifyDefault, black: spotifyBlack },
  linkedin: { default: linkedinDefault, black: linkedinBlack },
  google: { default: googleDefault, black: googleBlack },
  figma: { default: figmaDefault, black: figmaBlack },
};
