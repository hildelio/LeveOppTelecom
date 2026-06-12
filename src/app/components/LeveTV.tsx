import { motion } from "motion/react";
import { Tv, Star } from "lucide-react";
import appStoreImg   from "../../imports/6f173690-25c6-42fe-911f-759e8cd952c4.png";
import googlePlayImg from "../../imports/27819495-1841-47f6-95ea-6c0baba08bdd.png";
import promoVideo    from "../../imports/Leve_Telecom_Provedor_de_internet__1_-2.mp4";
import { useTenant } from "@/contexts/TenantContext";
import { useTranslation } from "@/contexts/I18nContext";
import { Link } from "react-router";

const channels = ["Globo", "SBT", "Record", "Band", "ESPN", "Cartoon Network", "Discovery", "National Geographic"];

export function LeveTV() {
  const { config, colors } = useTenant();
  const { t } = useTranslation();

  return (
    <section id="levetv" style={{ background: colors.bgDeep, padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {/* bg glow */}
      <div style={{ position: "absolute", right: "-200px", top: "10%", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, rgba(${colors.secondaryRgb || colors.primaryRgb},0.14) 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "72px", alignItems: "center", position: "relative" }} className="ltv-grid">

        {/* ── Left: Text + Badges ── */}
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>

          {/* Tag */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `rgba(${colors.primaryRgb},0.08)`, border: `1px solid rgba(${colors.primaryRgb},0.2)`, borderRadius: "100px", padding: "5px 14px", marginBottom: "20px" }}>
            <Tv size={12} color={colors.primary} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: colors.primary, textTransform: "uppercase", letterSpacing: "1px" }}>{t.leveTv.badge}</span>
          </div>

          <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "clamp(28px,3.5vw,46px)", fontWeight: 800, color: colors.textPrimary, letterSpacing: "-1.5px", lineHeight: 1.15, marginBottom: "18px" }}>
            {t.leveTv.titleBefore}{" "}<span style={{ color: colors.primary }}>{t.leveTv.titleHighlight}</span>
          </h2>

          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", color: colors.textSecondary, lineHeight: 1.8, marginBottom: "24px", maxWidth: "460px" }}>
            {t.leveTv.paragraph1}{config.brandName}{t.leveTv.paragraph2}
          </p>

          {/* Channel chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
            {channels.map((ch) => (
              <span key={ch} style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 500, color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "6px", padding: "4px 10px" }}>{ch}</span>
            ))}
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 500, color: colors.primary, background: `rgba(${colors.primaryRgb},0.06)`, border: `1px solid rgba(${colors.primaryRgb},0.2)`, borderRadius: "6px", padding: "4px 10px" }}>{t.leveTv.channelsText}</span>
          </div>

          {/* Stars */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "32px" }}>
            {[1,2,3,4,5].map((n) => <Star key={n} size={13} color={colors.primary} fill={colors.primary} />)}
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.45)", marginLeft: "4px" }}>{t.leveTv.ratingText}</span>
          </div>

          {/* App Store Badges */}
          <div>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.36)", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: "12px" }}>
              {t.leveTv.downloadApp}
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {[
                { src: googlePlayImg, alt: t.leveTv.availableOnPlay,  href: "https://play.google.com/store" },
                { src: appStoreImg,   alt: t.leveTv.availableOnApple,    href: "https://apps.apple.com" },
              ].map(({ src, alt, href }) => (
                <a key={alt} href={href} target="_blank" rel="noopener noreferrer"
                  style={{ display: "block", borderRadius: "8px", overflow: "hidden", transition: "transform 0.22s ease, filter 0.22s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.07)"; (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1.15)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";   (e.currentTarget as HTMLAnchorElement).style.filter = "brightness(1)"; }}
                >
                  <img src={src} alt={alt} style={{ height: "44px", width: "auto", display: "block" }} />
                </a>
              ))}
            </div>
          </div>

          {/* CTA: See All Videos */}
          <Link
            to="/tv"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: 600,
              color: colors.primary,
              background: `rgba(${colors.primaryRgb}, 0.08)`,
              border: `1.5px solid rgba(${colors.primaryRgb}, 0.35)`,
              borderRadius: "10px",
              padding: "12px 24px",
              textDecoration: "none",
              marginTop: "20px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = `rgba(${colors.primaryRgb}, 0.16)`;
              (e.currentTarget as HTMLAnchorElement).style.borderColor = `rgba(${colors.primaryRgb}, 0.6)`;
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 20px rgba(${colors.primaryRgb}, 0.15)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = `rgba(${colors.primaryRgb}, 0.08)`;
              (e.currentTarget as HTMLAnchorElement).style.borderColor = `rgba(${colors.primaryRgb}, 0.35)`;
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            {t.tvPage.seeAllVideos} →
          </Link>
        </motion.div>

        {/* ── Right: Promo Video ── */}
        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ position: "relative" }}>
          {/* glow halo */}
          <div style={{ position: "absolute", inset: "-24px", borderRadius: "40px", background: `radial-gradient(ellipse, rgba(${colors.primaryRgb},0.09) 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ borderRadius: "20px", overflow: "hidden", boxShadow: `0 0 40px rgba(${colors.primaryRgb},0.12), 0 24px 64px rgba(0,0,0,0.6)`, border: `1px solid rgba(${colors.primaryRgb},0.14)`, background: "#000", position: "relative" }}>
            <video autoPlay muted loop playsInline style={{ width: "100%", height: "auto", display: "block", maxHeight: "420px", objectFit: "cover" }}>
              <source src={promoVideo} type="video/mp4" />
            </video>
          </div>
        </motion.div>
      </div>

      <style>{`@media (max-width:768px){ .ltv-grid{ grid-template-columns:1fr !important; gap:40px !important; } }`}</style>
    </section>
  );
}
