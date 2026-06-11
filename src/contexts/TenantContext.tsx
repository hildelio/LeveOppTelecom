/**
 * TenantContext
 * ──────────────────────────────────────────────────────────────
 * React Context that provides tenant configuration to all
 * components and injects CSS custom properties on the <html>
 * element so that every part of the UI can consume brand colors
 * via `var(--brand-primary)` etc.
 *
 * Usage:
 *   const { config, colors } = useTenant();
 */

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { tenantConfig, type TenantConfig, type TenantColors } from "@/config/tenant";

// ── Context shape ───────────────────────────────────────────

interface TenantContextValue {
  config: TenantConfig;
  colors: TenantColors;
  /** True when slug === "leve" */
  isLeve: boolean;
  /** True when slug === "opp" */
  isOpp: boolean;
}

const TenantContext = createContext<TenantContextValue | null>(null);

// ── Provider ────────────────────────────────────────────────

interface TenantProviderProps {
  children: ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const { colors } = tenantConfig;

  // Inject CSS custom properties into :root (<html>) so they're
  // available globally — in CSS, inline styles, and Tailwind.
  useEffect(() => {
    const root = document.documentElement;

    // ── Brand palette ───────────────────────────────────────
    root.style.setProperty("--brand-primary", colors.primary);
    root.style.setProperty("--brand-primary-rgb", colors.primaryRgb);
    root.style.setProperty("--brand-primary-hover", colors.primaryHover);
    root.style.setProperty("--brand-secondary", colors.secondary);
    root.style.setProperty("--brand-secondary-rgb", colors.secondaryRgb);

    // ── Background layers ───────────────────────────────────
    root.style.setProperty("--brand-bg-deep", colors.bgDeep);
    root.style.setProperty("--brand-bg-dark", colors.bgDark);
    root.style.setProperty("--brand-bg-card", colors.bgCard);
    root.style.setProperty("--brand-bg-header", colors.bgHeader);
    root.style.setProperty("--brand-bg-header-transparent", colors.bgHeaderTransparent);

    // ── Borders / Glow ──────────────────────────────────────
    root.style.setProperty("--brand-border-glow", colors.borderGlow);

    // ── Text ────────────────────────────────────────────────
    root.style.setProperty("--brand-text-primary", colors.textPrimary);
    root.style.setProperty("--brand-text-secondary", colors.textSecondary);
    root.style.setProperty("--brand-text-muted", colors.textMuted);

    // ── Semantic aliases (used by many components) ───────────
    // Glow box-shadow fragments
    root.style.setProperty(
      "--brand-glow-sm",
      `0 0 12px rgba(${colors.primaryRgb}, 0.1)`
    );
    root.style.setProperty(
      "--brand-glow-md",
      `0 0 30px rgba(${colors.primaryRgb}, 0.3)`
    );
    root.style.setProperty(
      "--brand-glow-lg",
      `0 0 50px rgba(${colors.primaryRgb}, 0.5)`
    );

    // Data-attribute for CSS selectors
    root.setAttribute("data-tenant", tenantConfig.brandSlug);

  }, [colors]);

  const value: TenantContextValue = {
    config: tenantConfig,
    colors: tenantConfig.colors,
    isLeve: tenantConfig.brandSlug === "leve",
    isOpp: tenantConfig.brandSlug === "opp",
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

// ── Hook ────────────────────────────────────────────────────

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error("useTenant() must be used within a <TenantProvider>");
  }
  return ctx;
}
