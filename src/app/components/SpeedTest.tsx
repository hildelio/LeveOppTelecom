import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Gauge, ExternalLink, Zap } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";
import speedometerImg from "../../imports/c27fe2fb-8dcb-44e6-bc36-b7490af0b8c0.png";
import { useTranslation } from "@/contexts/I18nContext";

export function SpeedTest() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const { colors } = useTenant();
  const { t } = useTranslation();

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
    const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
    setTilt({ x: dy * -13, y: dx * 13 });
  }

  function onMouseLeave() { setTilt({ x: 0, y: 0 }); setHovered(false); }

  return (
    <section
      style={{ background: colors.bgDark, padding: "100px 24px", position: "relative", overflow: "hidden" }}
    >
      {/* bg glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)", width: "700px", height: "400px",
        background: `radial-gradient(ellipse, rgba(${colors.primaryRgb},0.06) 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: `rgba(${colors.primaryRgb},0.08)`, border: `1px solid rgba(${colors.primaryRgb},0.2)`,
            borderRadius: "100px", padding: "5px 14px", marginBottom: "20px",
          }}>
            <Gauge size={12} color={colors.primary} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: colors.primary, textTransform: "uppercase", letterSpacing: "1px" }}>
              {t.speedTest.badge}
            </span>
          </div>
          <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, color: colors.textPrimary, letterSpacing: "-1.5px", marginBottom: "14px" }}>
            {t.speedTest.titleBefore}{" "}<span style={{ color: colors.primary }}>{t.speedTest.titleHighlight}</span>
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "16px", color: colors.textSecondary, maxWidth: "460px", margin: "0 auto", lineHeight: 1.6 }}>
            {t.speedTest.paragraph}
          </p>
        </motion.div>

        {/* 3D Tilt Card */}
        <div style={{ display: "flex", justifyContent: "center", perspective: "1100px" }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ width: "100%", maxWidth: "780px" }}
          >
            <div
              ref={cardRef}
              onMouseMove={onMouseMove}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={onMouseLeave}
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: hovered ? "transform 0.07s linear" : "transform 0.55s cubic-bezier(0.23,1,0.32,1)",
                borderRadius: "24px",
                cursor: "default",
              }}
            >
              <div style={{
                background: colors.bgCard, backdropFilter: "blur(20px)",
                border: `1px solid ${colors.borderGlow}`, borderRadius: "24px", padding: "40px",
                boxShadow: hovered
                  ? `0 32px 80px rgba(0,0,0,0.55), 0 0 64px rgba(${colors.primaryRgb},0.14)`
                  : `0 16px 48px rgba(0,0,0,0.4), 0 0 40px rgba(${colors.primaryRgb},0.07)`,
                transition: "box-shadow 0.3s ease",
                position: "relative", overflow: "hidden",
              }}>
                {/* Top shimmer line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                  background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
                  opacity: hovered ? 1 : 0.35, transition: "opacity 0.3s ease",
                }} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center" }} className="spd-grid">
                  {/* Speedometer */}
                  <div style={{ transform: "translateZ(30px)" }}>
                    <img src={speedometerImg} alt="Teste de velocidade nPerf" style={{ width: "100%", height: "auto", borderRadius: "14px", display: "block", filter: `drop-shadow(0 6px 20px rgba(${colors.primaryRgb},0.18))` }} />
                  </div>

                  {/* Text */}
                  <div style={{ transform: "translateZ(20px)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `rgba(${colors.primaryRgb},0.1)`, border: `1px solid rgba(${colors.primaryRgb},0.25)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Zap size={18} color={colors.primary} />
                      </div>
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, color: colors.primary, textTransform: "uppercase", letterSpacing: "1.5px" }}>
                        nPerf Speed Test
                      </span>
                    </div>

                    <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "26px", fontWeight: 800, color: colors.textPrimary, letterSpacing: "-0.8px", lineHeight: 1.2, marginBottom: "12px", whiteSpace: "pre-line" }}>
                      {t.speedTest.cardTitle}
                    </h3>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: colors.textSecondary, lineHeight: 1.7, marginBottom: "24px" }}>
                      {t.speedTest.cardText}
                    </p>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: "20px", marginBottom: "28px", flexWrap: "wrap" }}>
                      {[{ l: t.speedTest.metrics.download, v: "300 Mb/s" }, { l: t.speedTest.metrics.upload, v: "150 Mb/s" }, { l: t.speedTest.metrics.ping, v: "< 10ms" }].map((s) => (
                        <div key={s.l}>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "16px", fontWeight: 800, color: colors.primary }}>{s.v}</div>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: colors.textMuted, marginTop: "2px" }}>{s.l}</div>
                        </div>
                      ))}
                    </div>

                    <a
                      href="https://www.nperf.com/pt/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        fontFamily: "'Inter',sans-serif", fontSize: "15px", fontWeight: 700,
                        color: colors.bgDeep, background: colors.primary, border: "none", borderRadius: "10px",
                        padding: "12px 24px", textDecoration: "none",
                        boxShadow: `0 0 24px rgba(${colors.primaryRgb},0.4)`, transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 44px rgba(${colors.primaryRgb},0.65)`; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 24px rgba(${colors.primaryRgb},0.4)`; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
                    >
                      {t.speedTest.testNow} <ExternalLink size={14} />
                    </a>

                    {/* 3D hint badge */}
                    <div style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "6px", background: `rgba(${colors.primaryRgb},0.04)`, border: `1px dashed rgba(${colors.primaryRgb},0.22)`, borderRadius: "8px", padding: "5px 10px" }}>
                      <span style={{ fontSize: "10px", color: colors.primary }}>✦</span>
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: `rgba(${colors.primaryRgb},0.55)`, fontStyle: "italic" }}>
                        {t.speedTest.hint}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`@media (max-width:640px){ .spd-grid{ grid-template-columns:1fr !important; } }`}</style>
    </section>
  );
}
