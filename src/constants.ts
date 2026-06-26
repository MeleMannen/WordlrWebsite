import { Caveat, Dancing_Script } from "next/font/google";
import { ColorScheme } from "./types/shared";

/**
 * "system" - follows the user's system appearance
 * "light" - forces your website to always use light theme
 * "dark" - forces your website to always use dark theme
 */
export const THEME: "system" | "light" | "dark" = "dark";

/**
 * Your App Store App ID without the 'id' prefix.
 * You can find it in your App Store Connect.
 * Go to your app -> App Information -> Apple ID.
 *
 * Example: "6502667826"
 */
export const APP_ID = "6740833142";

/**
 * Custom fonts for 'whimsical' and 'cursive' font styles.
 * Default system font is used for all other font styles.
 * See https://nextjs.org/docs/app/getting-started/fonts#google-fonts
 */
export const WHIMSICAL_FONT = Caveat({ subsets: ["latin"] });
export const CURSIVE_FONT = Dancing_Script({ subsets: ["latin"] });

export const MATERIAL_SYMBOLS = [
  "send",
  "check_circle",
  "star",
  "mail",
  "open_in_new",
  "open_in_full",
  "play_arrow",
  "pause",
  "lock",
  "target",
  "menu",
  "close",
] as const;

// Neutral
export const COLORS: ColorScheme = {
  LIGHT: {
    "text-primary": "#142014",
    "text-secondary": "rgba(44, 76, 52, 0.66)",
    "fill-0": "#ffffff",
    "fill-1": "#eef7f0",
    "fill-2": "#dcefe0",
    "fill-3": "#c8e2ce",
    "accent-brand": "#2f8a57",
    "accent-orange": "#f58a4a",
    "accent-green": "#34C759",
    "accent-red": "#FF3B30",
    "accent-blue": "#007AFF",
    "accent-indigo": "#5856D6",
    "accent-mint": "#00C7BE",
    "accent-purple": "#AF52DE",
    "accent-pink": "#FF2D55",
  },
  DARK: {
    "text-primary": "#f2fbf5",
    "text-secondary": "rgba(200, 224, 206, 0.7)",
    "fill-0": "#0b140f",
    "fill-1": "#101b14",
    "fill-2": "#1b2c22",
    "fill-3": "#264032",
    "accent-brand": "#2FA956",
    "accent-orange": "#ff9a4a",
    "accent-green": "#30D158",
    "accent-red": "#FF453A",
    "accent-blue": "#0A84FF",
    "accent-indigo": "#5E5CE6",
    "accent-mint": "#63E6E2",
    "accent-purple": "#BF5AF2",
    "accent-pink": "#FF375F",
  }
} as const;

export const MAX_RELEASE_NOTES_PER_PAGE = 5;

export const IS_WAITLIST_ENABLED = false;
