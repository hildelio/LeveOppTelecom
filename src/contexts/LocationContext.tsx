/**
 * LocationContext — Vertical Slice
 * ──────────────────────────────────────────────────────────────
 * Full lifecycle for city detection:
 *
 *   1. city starts as `null`  (no assumption)
 *   2. detecting starts as `true`
 *   3. useEffect runs ONCE:
 *      a) localStorage hit  → set city, detecting=false, done.
 *      b) no cache → fetch ipapi.co
 *         ✓ match     → set city, persist, detecting=false
 *         ✗ no match  → fallback + OPEN modal (user decides)
 *         ✗ error     → fallback + OPEN modal (user decides)
 *
 * Normalization: city strings are lowercased, NFD-stripped of
 * diacritics before comparison to handle "Teofilândia" vs
 * "Teofilandia" and similar API quirks.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

// ── Constants ───────────────────────────────────────────────

const STORAGE_KEY = "telecom_user_city";
const SUPPORTED_CITIES = ["Serrinha", "Teofilândia", "Salvador"] as const;
export type City = (typeof SUPPORTED_CITIES)[number];
const FALLBACK_CITY: City = "Serrinha";

/** Strip diacritics and lowercase for fuzzy comparison. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Pre-compute normalized versions of supported cities. */
const NORMALIZED_MAP = SUPPORTED_CITIES.map((c) => ({
  original: c,
  normalized: normalize(c),
}));

function matchCity(raw: string | undefined | null): City | null {
  if (!raw) return null;
  const norm = normalize(raw);
  const found = NORMALIZED_MAP.find((m) => m.normalized === norm);
  return found?.original ?? null;
}

function isValidCachedCity(value: string | null): value is City {
  if (!value) return false;
  return (SUPPORTED_CITIES as readonly string[]).includes(value);
}

// ── Context shape ───────────────────────────────────────────

interface LocationContextValue {
  /** Current selected city — null while detecting (no premature fallback). */
  city: City | null;
  /** All cities available for selection. */
  cities: readonly City[];
  /** Update city and persist to localStorage. */
  setCity: (city: City) => void;
  /** Whether the location picker modal is visible. */
  isModalOpen: boolean;
  /** Open the location picker. */
  openModal: () => void;
  /** Close the location picker. */
  closeModal: () => void;
  /** True while the IP lookup or cache check is in-flight. */
  detecting: boolean;
}

const LocationContext = createContext<LocationContextValue | null>(null);

// ── Provider ────────────────────────────────────────────────

export function LocationProvider({ children }: { children: ReactNode }) {
  const [city, setCityState] = useState<City | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [detecting, setDetecting] = useState(true);
  const didRun = useRef(false);

  const setCity = useCallback((newCity: City) => {
    console.log("[LocationContext] setCity →", newCity);
    setCityState(newCity);
    localStorage.setItem(STORAGE_KEY, newCity);
  }, []);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  // ── Single-run lifecycle ──────────────────────────────────
  useEffect(() => {
    // StrictMode guard
    if (didRun.current) return;
    didRun.current = true;

    // ─── Step 1: Check localStorage ─────────────────────────
    const cached = localStorage.getItem(STORAGE_KEY);
    if (isValidCachedCity(cached)) {
      console.log("[LocationContext] ✅ Cache hit:", cached);
      setCityState(cached);
      setDetecting(false);
      return; // Done — no modal, no fetch.
    }

    // ─── Step 2: No cache — fetch IP ────────────────────────
    console.log("[LocationContext] No cache — starting IP detection…");

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.warn("[LocationContext] ⏱ Fetch timeout (4s) — aborting.");
      controller.abort();
    }, 4000);

    (async () => {
      try {
        let detectedCity: string | null = null;

        if (import.meta.env.DEV) {
          console.log("[LocationContext] Em ambiente DEV: Mockando geolocalização para 'Salvador'...");
          await new Promise((resolve) => setTimeout(resolve, 600));
          detectedCity = "Salvador";
        } else {
          console.log("[LocationContext] Fetching location from ipwho.is...");
          const res = await fetch("https://ipwho.is/", {
            signal: controller.signal,
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          
          const data = await res.json();
          
          // ipwho.is returns a 'success' boolean flag indicating if the lookup worked
          if (data.success === false) {
             throw new Error(data.message || "API returned success: false");
          }

          detectedCity = data.city;
        }

        clearTimeout(timeout);
        console.log(`[LocationContext] Success from ipwho.is:`, detectedCity);

        const match = matchCity(detectedCity);

        if (match) {
          console.log("[LocationContext] ✅ Matched:", match);
          setCityState(match);
          localStorage.setItem(STORAGE_KEY, match);
          setDetecting(false);
          // Open modal so user can CONFIRM
          setModalOpen(true);
        } else {
          console.warn(
            `[LocationContext] ⚠ "${detectedCity || "Unknown"}" not supported. Fallback: ${FALLBACK_CITY}`
          );
          setCityState(FALLBACK_CITY);
          setDetecting(false);
          setModalOpen(true); // User MUST choose
        }
      } catch (err) {
        clearTimeout(timeout);
        if ((err as Error).name === "AbortError") {
          console.log("[LocationContext] Fetch aborted by React Strict Mode or Timeout.");
          return; // Stop silently
        }

        console.error("[LocationContext] ❌ IP provider failed:", err);

        // Required state corrections to unblock UI
        setCityState(FALLBACK_CITY);
        setDetecting(false);
        setModalOpen(true); 
      }
    })();

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LocationContext.Provider
      value={{
        city,
        cities: SUPPORTED_CITIES,
        setCity,
        isModalOpen,
        openModal,
        closeModal,
        detecting,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

// ── Hook ────────────────────────────────────────────────────

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocation() must be used within a <LocationProvider>");
  }
  return ctx;
}
