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
      console.warn("[LocationContext] ⏱ Fetch timeout (8s) — aborting.");
      controller.abort();
    }, 8000);

    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/", {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        console.log("[LocationContext] ipapi.co HTTP", res.status);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        console.log("[LocationContext] ipapi.co payload:", {
          city: data.city,
          region: data.region,
          country: data.country_name,
          ip: data.ip,
        });

        const match = matchCity(data.city);

        if (match) {
          console.log("[LocationContext] ✅ Matched:", match);
          setCityState(match);
          localStorage.setItem(STORAGE_KEY, match);
          setDetecting(false);
          // Open modal so user can CONFIRM (not just silently set)
          setModalOpen(true);
        } else {
          // City not supported → fallback + force user to choose
          console.warn(
            `[LocationContext] ⚠ "${data.city}" not supported. ` +
            `Supported: ${SUPPORTED_CITIES.join(", ")}. Fallback: ${FALLBACK_CITY}`
          );
          setCityState(FALLBACK_CITY);
          setDetecting(false);
          setModalOpen(true); // ← User MUST choose
        }
      } catch (err) {
        clearTimeout(timeout);
        if ((err as Error).name === "AbortError") {
          console.warn("[LocationContext] ❌ Fetch aborted (timeout or unmount).");
        } else {
          console.error("[LocationContext] ❌ Fetch failed:", err);
        }
        // Error path → fallback + force user to choose
        setCityState(FALLBACK_CITY);
        setDetecting(false);
        setModalOpen(true); // ← User MUST choose
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
