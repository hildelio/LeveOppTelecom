import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";
import { useTranslation } from "@/contexts/I18nContext";

interface HeroProps {
  onOpenModal?: () => void;
}

export function Hero({ onOpenModal }: HeroProps) {
  const { config, colors } = useTenant();
  const { t } = useTranslation();

  const handleScrollToPlanos = () => {
    const element = document.getElementById("planos");
    if (element) {
      const headerOffset = 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section
      id="home"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: colors.bgDeep,
      }}
    >
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.4,
        }}
      >
        <source src={config.assets.heroVideoWebm} type="video/webm" />
        <source src={config.assets.heroVideoMp4} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${colors.bgHeader} 0%, transparent 60%, rgba(${colors.primaryRgb},0.2) 100%)`,
        }}
      />

      {/* Glow orb */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "5%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(${colors.primaryRgb},0.07) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          paddingTop: "130px", // Compensate for fixed header height
          width: "100%",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ maxWidth: "700px" }}
        >
          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(40px, 6vw, 68px)",
              fontWeight: 900,
              color: colors.textPrimary,
              lineHeight: 1.1,
              marginBottom: "24px",
              letterSpacing: "-2px",
            }}
          >
              {t.hero.headlineBefore}
            <span
              style={{
                color: colors.primary,
                textShadow: `0 0 30px rgba(${colors.primaryRgb},0.5)`,
              }}
            >
              {t.hero.headlineHighlight}
            </span>{" "}
            {t.hero.headlineAfter}
          </h1>

          {/* Subtext */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "18px",
              fontWeight: 400,
              color: colors.textSecondary,
              lineHeight: 1.7,
              marginBottom: "44px",
              maxWidth: "520px",
            }}
          >
            {t.hero.slogan} {t.hero.subtext}
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <button
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                color: colors.bgDeep,
                background: colors.primary,
                border: "none",
                borderRadius: "10px",
                padding: "15px 36px",
                cursor: "pointer",
                boxShadow: `0 0 30px rgba(${colors.primaryRgb}, 0.5), 0 4px 16px rgba(${colors.primaryRgb},0.3)`,
                transition: "all 0.2s ease",
                letterSpacing: "0.2px",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.target as HTMLButtonElement).style.boxShadow =
                  `0 0 50px rgba(${colors.primaryRgb}, 0.7), 0 8px 24px rgba(${colors.primaryRgb},0.4)`;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                (e.target as HTMLButtonElement).style.boxShadow =
                  `0 0 30px rgba(${colors.primaryRgb}, 0.5), 0 4px 16px rgba(${colors.primaryRgb},0.3)`;
              }}
              onClick={onOpenModal}
            >
              {t.hero.ctaPrimary}
            </button>
            <button
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                color: colors.textPrimary,
                background: "rgba(255,255,255,0.06)",
                border: "1.5px solid rgba(255,255,255,0.25)",
                borderRadius: "10px",
                padding: "15px 36px",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
                (e.target as HTMLButtonElement).style.borderColor = `rgba(${colors.primaryRgb},0.5)`;
                (e.target as HTMLButtonElement).style.color = colors.primary;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                (e.target as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.25)";
                (e.target as HTMLButtonElement).style.color = colors.textPrimary;
              }}
              onClick={handleScrollToPlanos}
            >
              {t.hero.ctaSecondary}
            </button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              display: "flex",
              gap: "48px",
              marginTop: "64px",
              flexWrap: "wrap",
            }}
          >
            {t.hero.stats.map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "32px",
                    fontWeight: 800,
                    color: colors.primary,
                    lineHeight: 1,
                    marginBottom: "4px",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    color: colors.textSecondary,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          opacity: 0.5,
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "11px",
            color: colors.textSecondary,
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          {t.hero.scroll}
        </span>
        <ChevronDown size={18} color={colors.textSecondary} />
      </motion.div>
    </section>
  );
}
