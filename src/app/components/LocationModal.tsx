/**
 * LocationModal
 * ──────────────────────────────────────────────────────────────
 * Full-screen overlay that asks the user to confirm or choose
 * their city.  Inherits Dark UI + tenant colors automatically
 * via useTenant().
 *
 * Opens:
 *  1. On first visit (after IP detection finishes).
 *  2. When the user clicks the city badge in the Header.
 */

import { MapPin, Loader2, Check } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";
import { useLocation, type City } from "@/contexts/LocationContext";
import { useTranslation } from "@/contexts/I18nContext";

export function LocationModal() {
  const { colors, config } = useTenant();
  const { city, cities, setCity, isModalOpen, closeModal, detecting } =
    useLocation();
  const { t } = useTranslation();

  if (!isModalOpen) return null;

  const handleSelect = (c: City) => {
    setCity(c);
    closeModal();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeModal}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 900,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(8px)",
        }}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={detecting ? t.location.detectingTitle : t.location.selectTitle}
        style={{
          position: "fixed",
          zIndex: 910,
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "min(440px, calc(100vw - 48px))",
          background: colors.bgDeep,
          border: `1px solid ${colors.borderGlow}`,
          borderRadius: "20px",
          padding: "40px 32px 32px",
          boxShadow: `0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(${colors.primaryRgb},0.12)`,
          animation: "locationModalIn 0.3s ease",
        }}
      >
        {/* Top shimmer line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: "2px",
            borderRadius: "0 0 4px 4px",
            background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
            opacity: 0.6,
          }}
        />

        {/* Icon */}
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: `rgba(${colors.primaryRgb},0.1)`,
            border: `1px solid rgba(${colors.primaryRgb},0.25)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          {detecting ? (
            <Loader2
              size={22}
              color={colors.primary}
              style={{ animation: "spin 1s linear infinite" }}
            />
          ) : (
            <MapPin size={22} color={colors.primary} />
          )}
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Inter',sans-serif",
            fontSize: "22px",
            fontWeight: 800,
            color: colors.textPrimary,
            textAlign: "center",
            letterSpacing: "-0.5px",
            marginBottom: "6px",
          }}
        >
          {detecting ? t.location.detectingTitle : t.location.selectTitle}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Inter',sans-serif",
            fontSize: "14px",
            color: colors.textSecondary,
            textAlign: "center",
            lineHeight: 1.6,
            marginBottom: "28px",
          }}
        >
          {detecting
            ? t.location.detectingSubtitle
            : t.location.selectSubtitle}
        </p>

        {/* City buttons */}
        {!detecting && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {cities.map((c) => {
              const isSelected = c === city;
              return (
                <button
                  key={c}
                  onClick={() => handleSelect(c)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    fontFamily: "'Inter',sans-serif",
                    fontSize: "15px",
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? colors.bgDeep : colors.textPrimary,
                    background: isSelected
                      ? colors.primary
                      : `rgba(${colors.primaryRgb},0.06)`,
                    border: `1.5px solid ${
                      isSelected
                        ? colors.primary
                        : `rgba(${colors.primaryRgb},0.18)`
                    }`,
                    borderRadius: "12px",
                    padding: "14px 18px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: isSelected
                      ? `0 0 24px rgba(${colors.primaryRgb},0.35)`
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.background = `rgba(${colors.primaryRgb},0.12)`;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = `rgba(${colors.primaryRgb},0.4)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      (e.currentTarget as HTMLButtonElement).style.background = `rgba(${colors.primaryRgb},0.06)`;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = `rgba(${colors.primaryRgb},0.18)`;
                    }
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <MapPin size={16} />
                    {c}
                  </span>
                  {isSelected && <Check size={18} />}
                </button>
              );
            })}
          </div>
        )}

        {/* Detecting skeleton */}
        {detecting && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  height: "50px",
                  borderRadius: "12px",
                  background: `rgba(${colors.primaryRgb},0.04)`,
                  border: `1px solid rgba(${colors.primaryRgb},0.08)`,
                  animation: "pulse 1.5s ease-in-out infinite",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Keyframes injected once */}
      <style>{`
        @keyframes locationModalIn {
          from { opacity: 0; transform: translate(-50%,-50%) scale(0.92); }
          to   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 0.8; }
        }
      `}</style>
    </>
  );
}
