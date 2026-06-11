/**
 * SegmentContext
 * ──────────────────────────────────────────────────────────────
 * Manages the audience segmentation state:
 *   "b2c" → Para Você  (default, residential plans)
 *   "b2b" → Para Empresas  (business/corporate plans)
 *
 * Persists the user's last choice in localStorage.
 *
 * Usage:
 *   const { segment, setSegment, isB2B, isB2C, toggle } = useSegment();
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// ── Types ───────────────────────────────────────────────────

export type Segment = "b2c" | "b2b";

const STORAGE_KEY = "telecom_user_segment";
const DEFAULT_SEGMENT: Segment = "b2c";

// ── Context shape ───────────────────────────────────────────

interface SegmentContextValue {
  /** Current segment */
  segment: Segment;
  /** Update segment and persist */
  setSegment: (s: Segment) => void;
  /** Convenience toggle */
  toggle: () => void;
  /** Helper booleans */
  isB2C: boolean;
  isB2B: boolean;
}

const SegmentContext = createContext<SegmentContextValue | null>(null);

// ── Provider ────────────────────────────────────────────────

interface SegmentProviderProps {
  children: ReactNode;
}

export function SegmentProvider({ children }: SegmentProviderProps) {
  const stored = localStorage.getItem(STORAGE_KEY) as Segment | null;
  const initial: Segment =
    stored === "b2b" || stored === "b2c" ? stored : DEFAULT_SEGMENT;

  const [segment, setSegmentState] = useState<Segment>(initial);

  const setSegment = useCallback((s: Segment) => {
    setSegmentState(s);
    localStorage.setItem(STORAGE_KEY, s);
  }, []);

  const toggle = useCallback(() => {
    setSegment(segment === "b2c" ? "b2b" : "b2c");
  }, [segment, setSegment]);

  const value: SegmentContextValue = {
    segment,
    setSegment,
    toggle,
    isB2C: segment === "b2c",
    isB2B: segment === "b2b",
  };

  return (
    <SegmentContext.Provider value={value}>
      {children}
    </SegmentContext.Provider>
  );
}

// ── Hook ────────────────────────────────────────────────────

export function useSegment(): SegmentContextValue {
  const ctx = useContext(SegmentContext);
  if (!ctx) {
    throw new Error(
      "useSegment() must be used within a <SegmentProvider>"
    );
  }
  return ctx;
}
