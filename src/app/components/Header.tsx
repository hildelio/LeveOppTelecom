import { useState, useEffect } from "react";
import { Menu, X, MapPin, Building2, User } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";
import { useLocation } from "@/contexts/LocationContext";
import { useSegment } from "@/contexts/SegmentContext";

interface HeaderProps {
  onOpenModal?: () => void;
}

export function Header({ onOpenModal }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { config, colors } = useTenant();
  const { city, openModal: openLocationModal, detecting } = useLocation();
  const { segment, toggle: toggleSegment, isB2B } = useSegment();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Planos", id: "planos" },
    { label: `${config.brandName} TV`, id: "levetv" },
    { label: "Contato", id: "contato" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  // ── Shared sub-component styles ─────────────────────────────

  const pillStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontFamily: "'Inter',sans-serif",
    fontSize: "12px",
    fontWeight: 600,
    padding: "5px 12px",
    borderRadius: "100px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "none",
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
        background: scrolled ? colors.bgHeader : colors.bgHeaderTransparent,
        backdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? `1px solid ${colors.borderGlow}`
          : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* ── Left cluster: Logo + City Badge ──────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Logo */}
          <img
            src={config.assets.logoPath}
            alt={config.brandName}
            style={{
              height: "64px",
              width: "auto",
              objectFit: "contain",
              filter: `drop-shadow(0 0 8px ${colors.borderGlow})`,
            }}
          />

          {/* City badge — desktop only */}
          <button
            onClick={openLocationModal}
            className="hidden md:flex"
            title="Alterar cidade"
            disabled={detecting}
            style={{
              ...pillStyle,
              color: colors.primary,
              background: `rgba(${colors.primaryRgb},0.08)`,
              minWidth: detecting ? "110px" : "auto",
            }}
            onMouseEnter={(e) => {
              if (!detecting) (e.currentTarget as HTMLButtonElement).style.background = `rgba(${colors.primaryRgb},0.16)`;
            }}
            onMouseLeave={(e) => {
              if (!detecting) (e.currentTarget as HTMLButtonElement).style.background = `rgba(${colors.primaryRgb},0.08)`;
            }}
          >
            {detecting ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: `rgba(${colors.primaryRgb}, 0.2)`, animation: "pulse 1.5s infinite" }} />
                <div style={{ height: "8px", flex: 1, borderRadius: "4px", background: `rgba(${colors.primaryRgb}, 0.15)`, animation: "pulse 1.5s infinite" }} />
              </div>
            ) : (
              <>
                <MapPin size={13} />
                {city}
              </>
            )}
          </button>
        </div>

        {/* ── Center: Desktop nav ─────────────────────────────── */}
        <nav
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
          className="hidden md:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleScroll(e, link.id)}
              style={{
                fontFamily: "'Inter',sans-serif",
                fontSize: "15px",
                fontWeight: 400,
                color: colors.textSecondary,
                textDecoration: "none",
                padding: "6px 14px",
                borderRadius: "6px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = colors.primary;
                (e.target as HTMLAnchorElement).style.background = `rgba(${colors.primaryRgb}, 0.08)`;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = colors.textSecondary;
                (e.target as HTMLAnchorElement).style.background = "transparent";
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* ── Right cluster: Segment toggle + CTA ─────────────── */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "12px" }}
          className="hidden md:flex"
        >
          {/* B2C / B2B Toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: `rgba(${colors.primaryRgb},0.06)`,
              border: `1px solid rgba(${colors.primaryRgb},0.14)`,
              borderRadius: "100px",
              padding: "3px",
              position: "relative",
            }}
          >
            {/* Sliding highlight pill */}
            <div
              style={{
                position: "absolute",
                top: "3px",
                left: segment === "b2c" ? "3px" : "calc(50%)",
                width: "calc(50% - 3px)",
                height: "calc(100% - 6px)",
                borderRadius: "100px",
                background: colors.primary,
                transition: "left 0.3s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: `0 0 12px rgba(${colors.primaryRgb},0.3)`,
              }}
            />

            <button
              onClick={() => !isB2B || toggleSegment()}
              style={{
                ...pillStyle,
                position: "relative",
                zIndex: 1,
                color: segment === "b2c" ? colors.bgDeep : colors.textMuted,
                background: "transparent",
                padding: "5px 14px",
              }}
            >
              <User size={12} />
              Para Você
            </button>

            <button
              onClick={() => isB2B || toggleSegment()}
              style={{
                ...pillStyle,
                position: "relative",
                zIndex: 1,
                color: segment === "b2b" ? colors.bgDeep : colors.textMuted,
                background: "transparent",
                padding: "5px 14px",
              }}
            >
              <Building2 size={12} />
              Empresas
            </button>
          </div>

          {/* CTA Button */}
          <button
            onClick={onOpenModal}
            style={{
              fontFamily: "'Inter',sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: colors.primary,
              background: "transparent",
              border: `1.5px solid rgba(${colors.primaryRgb}, 0.6)`,
              borderRadius: "8px",
              padding: "9px 20px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: `0 0 12px rgba(${colors.primaryRgb}, 0.1)`,
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = `rgba(${colors.primaryRgb}, 0.1)`;
              (e.target as HTMLButtonElement).style.boxShadow = `0 0 22px rgba(${colors.primaryRgb}, 0.3)`;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = "transparent";
              (e.target as HTMLButtonElement).style.boxShadow = `0 0 12px rgba(${colors.primaryRgb}, 0.1)`;
            }}
          >
            Área do Cliente
          </button>
        </div>

        {/* ── Mobile hamburger ────────────────────────────────── */}
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: colors.textPrimary,
          }}
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── Mobile drawer ──────────────────────────────────────── */}
      {mobileOpen && (
        <div
          style={{
            background: colors.bgHeader,
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "16px 24px 24px",
          }}
        >
          {/* City selector — mobile */}
          <button
            onClick={() => {
              if (detecting) return;
              setMobileOpen(false);
              openLocationModal();
            }}
            disabled={detecting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              fontFamily: "'Inter',sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: colors.primary,
              background: `rgba(${colors.primaryRgb},0.06)`,
              border: `1px solid rgba(${colors.primaryRgb},0.18)`,
              borderRadius: "10px",
              padding: "12px 16px",
              cursor: detecting ? "default" : "pointer",
              marginBottom: "12px",
            }}
          >
            {detecting ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%" }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: `rgba(${colors.primaryRgb}, 0.2)`, animation: "pulse 1.5s infinite" }} />
                <div style={{ height: "10px", width: "80px", borderRadius: "4px", background: `rgba(${colors.primaryRgb}, 0.15)`, animation: "pulse 1.5s infinite" }} />
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "11px",
                    color: colors.textMuted,
                  }}
                >
                  detectando...
                </span>
              </div>
            ) : (
              <>
                <MapPin size={16} />
                {city}
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "11px",
                    color: colors.textMuted,
                  }}
                >
                  alterar
                </span>
              </>
            )}
          </button>

          {/* Segment toggle — mobile */}
          <div
            style={{
              display: "flex",
              borderRadius: "10px",
              border: `1px solid rgba(${colors.primaryRgb},0.14)`,
              overflow: "hidden",
              marginBottom: "16px",
            }}
          >
            <button
              onClick={() => {
                if (isB2B) toggleSegment();
              }}
              style={{
                flex: 1,
                fontFamily: "'Inter',sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                padding: "10px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                color: segment === "b2c" ? colors.bgDeep : colors.textMuted,
                background:
                  segment === "b2c"
                    ? colors.primary
                    : `rgba(${colors.primaryRgb},0.04)`,
                transition: "all 0.2s ease",
              }}
            >
              <User size={13} /> Para Você
            </button>
            <button
              onClick={() => {
                if (!isB2B) toggleSegment();
              }}
              style={{
                flex: 1,
                fontFamily: "'Inter',sans-serif",
                fontSize: "13px",
                fontWeight: 600,
                padding: "10px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                color: segment === "b2b" ? colors.bgDeep : colors.textMuted,
                background:
                  segment === "b2b"
                    ? colors.primary
                    : `rgba(${colors.primaryRgb},0.04)`,
                transition: "all 0.2s ease",
              }}
            >
              <Building2 size={13} /> Empresas
            </button>
          </div>

          {/* Nav links */}
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleScroll(e, link.id)}
              style={{
                display: "block",
                fontFamily: "'Inter',sans-serif",
                fontSize: "16px",
                color: "rgba(255,255,255,0.8)",
                textDecoration: "none",
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {link.label}
            </a>
          ))}

          <button
            onClick={() => {
              setMobileOpen(false);
              onOpenModal?.();
            }}
            style={{
              marginTop: "16px",
              width: "100%",
              fontFamily: "'Inter',sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              color: colors.primary,
              background: `rgba(${colors.primaryRgb}, 0.07)`,
              border: `1.5px solid rgba(${colors.primaryRgb}, 0.55)`,
              borderRadius: "8px",
              padding: "12px",
              cursor: "pointer",
            }}
          >
            Área do Cliente
          </button>
        </div>
      )}
    </header>
  );
}
