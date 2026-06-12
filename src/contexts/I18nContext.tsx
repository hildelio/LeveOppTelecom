/**
 * I18nContext — Internationalization (Vertical Slice)
 * ──────────────────────────────────────────────────────────────
 * Manages the active language (pt-BR / en-US).
 *
 * State:   lang (persisted in localStorage)
 * Hook:    useTranslation() → { t, lang, setLang }
 *          t is the entire dictionary object for the active lang.
 * Error:   Falls back to pt-BR if localStorage value is invalid.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import pt, { type TranslationKeys } from "@/locales/pt";
import en from "@/locales/en";

// ── Types ─────────────────────────────────────────────────────
export type Lang = "pt" | "en";

interface I18nContextValue {
  /** The full translation dictionary for the active language */
  t: TranslationKeys;
  /** Current language code */
  lang: Lang;
  /** Switch to another language (persists to localStorage) */
  setLang: (lang: Lang) => void;
}

// ── Constants ─────────────────────────────────────────────────
const STORAGE_KEY = "telecom_user_lang";
const SUPPORTED_LANGS: Lang[] = ["pt", "en"];
const DEFAULT_LANG: Lang = "pt";

const dictionaries: Record<Lang, TranslationKeys> = { pt, en };

// ── Helpers ───────────────────────────────────────────────────
function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && SUPPORTED_LANGS.includes(stored)) {
      return stored;
    }
  } catch {
    // SSR or localStorage disabled — ignore
  }
  return DEFAULT_LANG;
}

// ── Context ───────────────────────────────────────────────────
const I18nContext = createContext<I18nContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((newLang: Lang) => {
    if (!SUPPORTED_LANGS.includes(newLang)) return;
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  }, []);

  const t = dictionaries[lang];

  return (
    <I18nContext.Provider value={{ t, lang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────
export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within <I18nProvider>");
  }
  return ctx;
}
