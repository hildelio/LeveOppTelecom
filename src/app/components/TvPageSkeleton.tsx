/**
 * TvPageSkeleton — Loading placeholder for the /tv route.
 * Used both by React.lazy Suspense fallback and the hook loading state.
 */

import { useTenant } from "@/contexts/TenantContext";

export function TvPageSkeleton() {
  const { colors } = useTenant();

  const pulseStyle: React.CSSProperties = {
    background: `rgba(${colors.primaryRgb}, 0.08)`,
    borderRadius: "12px",
    animation: "pulse 1.5s infinite",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "96px",
        background: colors.bgDeep,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        {/* Hero skeleton */}
        <div
          style={{
            ...pulseStyle,
            width: "100%",
            aspectRatio: "16/9",
            maxHeight: "540px",
            marginBottom: "40px",
          }}
        />

        {/* Title skeleton */}
        <div style={{ ...pulseStyle, height: "32px", width: "280px", marginBottom: "12px" }} />
        <div style={{ ...pulseStyle, height: "16px", width: "400px", marginBottom: "40px" }} />

        {/* Video grid skeleton */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
            marginBottom: "60px",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div style={{ ...pulseStyle, width: "100%", aspectRatio: "16/9", marginBottom: "12px" }} />
              <div style={{ ...pulseStyle, height: "16px", width: "90%", marginBottom: "8px" }} />
              <div style={{ ...pulseStyle, height: "12px", width: "60%" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
