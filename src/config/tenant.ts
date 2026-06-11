/**
 * Tenant Configuration Module
 * ──────────────────────────────────────────────────────────────
 * Central source of truth for all tenant-specific values.
 * Reads from Vite env vars (VITE_*) injected at build time.
 *
 * Usage:
 *   import { tenantConfig } from '@/config/tenant';
 *   tenantConfig.brandName  // "Leve Telecom" | "OPP Telecom"
 */

// ── Type definitions ────────────────────────────────────────

export interface TenantColors {
  /** Main accent color (hex). Leve=#00E5FF, OPP=#E8860C */
  primary: string;
  /** CSS rgb triplet for rgba() usage. "0,229,255" */
  primaryRgb: string;
  /** Lighter primary for hover states */
  primaryHover: string;
  /** Secondary accent (hex) */
  secondary: string;
  /** Secondary CSS rgb triplet */
  secondaryRgb: string;
  /** Deepest background layer */
  bgDeep: string;
  /** Slightly lighter dark background */
  bgDark: string;
  /** Card/glass surface */
  bgCard: string;
  /** Header background (scrolled) */
  bgHeader: string;
  /** Header background (transparent/top) */
  bgHeaderTransparent: string;
  /** Subtle glow border */
  borderGlow: string;
  /** Primary text — white */
  textPrimary: string;
  /** Secondary text — off-white */
  textSecondary: string;
  /** Muted text — dim */
  textMuted: string;
}

export interface TenantAssets {
  logoPath: string;
  heroVideoMp4: string;
  heroVideoWebm: string;
  heroPoster: string;
}

export interface TenantContact {
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  phoneDisplay: string;
}

export interface TenantSocial {
  instagram: string;
  facebook: string;
  youtube: string;
  youtubeChannelId: string;
}

export interface TenantSeo {
  title: string;
  description: string;
  cnpj: string;
}

export interface TenantConfig {
  brandName: string;
  brandSlug: string;
  brandDomain: string;
  brandTagline: string;
  colors: TenantColors;
  assets: TenantAssets;
  contact: TenantContact;
  social: TenantSocial;
  seo: TenantSeo;
  crmUrl: string;
  crmEnabled: boolean;
}

// ── Build the config object ─────────────────────────────────

export const tenantConfig: TenantConfig = {
  // Brand
  brandName:    import.meta.env.VITE_BRAND_NAME || "Leve Telecom",
  brandSlug:    import.meta.env.VITE_BRAND_SLUG || "leve",
  brandDomain:  import.meta.env.VITE_BRAND_DOMAIN || "levetelecom.net",
  brandTagline: import.meta.env.VITE_BRAND_TAGLINE || "Ultravelocidade para sua casa",

  // Colors
  colors: {
    primary:              import.meta.env.VITE_COLOR_PRIMARY || "#00E5FF",
    primaryRgb:           import.meta.env.VITE_COLOR_PRIMARY_RGB || "0,229,255",
    primaryHover:         import.meta.env.VITE_COLOR_PRIMARY_HOVER || "#33EBFF",
    secondary:            import.meta.env.VITE_COLOR_SECONDARY || "#0077FF",
    secondaryRgb:         import.meta.env.VITE_COLOR_SECONDARY_RGB || "0,119,255",
    bgDeep:               import.meta.env.VITE_COLOR_BG_DEEP || "#0B132B",
    bgDark:               import.meta.env.VITE_COLOR_BG_DARK || "#080e20",
    bgCard:               import.meta.env.VITE_COLOR_BG_CARD || "rgba(255,255,255,0.04)",
    bgHeader:             import.meta.env.VITE_COLOR_BG_HEADER || "rgba(11,19,43,0.9)",
    bgHeaderTransparent:  import.meta.env.VITE_COLOR_BG_HEADER_TRANSPARENT || "rgba(11,19,43,0.4)",
    borderGlow:           import.meta.env.VITE_COLOR_BORDER_GLOW || "rgba(0,229,255,0.14)",
    textPrimary:          import.meta.env.VITE_COLOR_TEXT_PRIMARY || "#ffffff",
    textSecondary:        import.meta.env.VITE_COLOR_TEXT_SECONDARY || "rgba(255,255,255,0.65)",
    textMuted:            import.meta.env.VITE_COLOR_TEXT_MUTED || "rgba(255,255,255,0.45)",
  },

  // Assets
  assets: {
    logoPath:      import.meta.env.VITE_LOGO_PATH || "/assets/logo-leve.png",
    heroVideoMp4:  import.meta.env.VITE_HERO_VIDEO_MP4 || "/assets/hero-leve.mp4",
    heroVideoWebm: import.meta.env.VITE_HERO_VIDEO_WEBM || "/assets/hero-leve.webm",
    heroPoster:    import.meta.env.VITE_HERO_POSTER || "/assets/hero-poster-leve.jpg",
  },

  // Contact
  contact: {
    whatsappNumber:  import.meta.env.VITE_WHATSAPP_NUMBER || "5571999106705",
    whatsappMessage: import.meta.env.VITE_WHATSAPP_MESSAGE || "Olá! Vim pelo site.",
    email:           import.meta.env.VITE_EMAIL || "contato@levetelecom.net",
    phoneDisplay:    import.meta.env.VITE_PHONE_DISPLAY || "+55 (71) 99910-6705",
  },

  // Social
  social: {
    instagram:        import.meta.env.VITE_SOCIAL_INSTAGRAM || "#",
    facebook:         import.meta.env.VITE_SOCIAL_FACEBOOK || "#",
    youtube:          import.meta.env.VITE_SOCIAL_YOUTUBE || "#",
    youtubeChannelId: import.meta.env.VITE_YOUTUBE_CHANNEL_ID || "",
  },

  // SEO
  seo: {
    title:       import.meta.env.VITE_SEO_TITLE || "Telecom — Internet Fibra Óptica",
    description: import.meta.env.VITE_SEO_DESCRIPTION || "Planos de internet fibra óptica com velocidade real.",
    cnpj:        import.meta.env.VITE_CNPJ || "00.000.000/0001-00",
  },

  // CRM
  crmUrl:     import.meta.env.VITE_CRM_URL || "",
  crmEnabled: import.meta.env.VITE_CRM_ENABLED === "true",
};
