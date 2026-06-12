import { useState } from "react";
import { motion } from "motion/react";
import {
  Play,
  Users,
  ExternalLink,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router";
import { useTenant } from "@/contexts/TenantContext";
import { useTranslation } from "@/contexts/I18nContext";
import { useYouTubeChannel } from "@/hooks/useYouTubeChannel";
import { TvPageSkeleton } from "@/app/components/TvPageSkeleton";

// ── Helpers ───────────────────────────────────────────────────

function timeAgo(
  dateStr: string,
  prefix: string,
  units: Record<string, string>
): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, now - then);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let value: number;
  let unit: string;

  if (years > 0) {
    value = years;
    unit = years === 1 ? units.year : units.years;
  } else if (months > 0) {
    value = months;
    unit = months === 1 ? units.month : units.months;
  } else if (weeks > 0) {
    value = weeks;
    unit = weeks === 1 ? units.week : units.weeks;
  } else if (days > 0) {
    value = days;
    unit = days === 1 ? units.day : units.days;
  } else if (hours > 0) {
    value = hours;
    unit = hours === 1 ? units.hour : units.hours;
  } else if (minutes > 0) {
    value = minutes;
    unit = minutes === 1 ? units.minute : units.minutes;
  } else {
    value = seconds;
    unit = units.seconds;
  }

  return prefix ? `${prefix} ${value} ${unit}` : `${value} ${unit}`;
}

// ── Component ─────────────────────────────────────────────────

export default function TvPage() {
  const { config, colors } = useTenant();
  const { t } = useTranslation();
  const { data, loading, error, refetch } = useYouTubeChannel();
  
  // State for the master-detail player interaction
  const [playTrigger, setPlayTrigger] = useState(0);
  const [activeVideo, setActiveVideo] = useState<any>(null);

  if (loading) return <TvPageSkeleton />;

  // ── Error / Fallback UI ──────────────────────────────────
  if (error || !data) {
    return (
      <div
        style={{
          minHeight: "100vh",
          paddingTop: "120px",
          background: colors.bgDeep,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: "center",
            maxWidth: "480px",
            padding: "48px 32px",
            background: colors.bgCard,
            backdropFilter: "blur(12px)",
            border: `1px solid rgba(${colors.primaryRgb}, 0.15)`,
            borderRadius: "24px",
            boxShadow: `0 24px 64px rgba(0,0,0,0.4)`,
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: `rgba(${colors.primaryRgb}, 0.1)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
            }}
          >
            <AlertCircle size={28} color={colors.primary} />
          </div>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "22px",
              fontWeight: 700,
              color: colors.textPrimary,
              marginBottom: "12px",
            }}
          >
            {t.tvPage.errorTitle}
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              color: colors.textSecondary,
              lineHeight: 1.7,
              marginBottom: "28px",
            }}
          >
            {t.tvPage.errorText}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={refetch}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: colors.bgDeep,
                background: colors.primary,
                border: "none",
                borderRadius: "10px",
                padding: "12px 24px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              <RefreshCw size={14} /> Retry
            </button>
            <a
              href={config.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: colors.primary,
                background: `rgba(${colors.primaryRgb}, 0.1)`,
                border: `1px solid rgba(${colors.primaryRgb}, 0.3)`,
                borderRadius: "10px",
                padding: "12px 24px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              {t.tvPage.errorCta} <ExternalLink size={14} />
            </a>
          </div>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: colors.textMuted,
              textDecoration: "none",
              marginTop: "24px",
              transition: "color 0.2s ease",
            }}
          >
            <ArrowLeft size={14} /> {t.tvPage.backToHome}
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Success UI ───────────────────────────────────────────
  const hasLiveChannel = !!data.liveVideo;
  const defaultVideo = data.liveVideo || data.latestVideos[0] || null;
  const currentVideo = activeVideo || defaultVideo;

  const gridVideos = data.latestVideos; // Master-Detail: shows all latest videos in the grid

  // Fallback: If gridVideos is empty, populate with skeletons
  const displayGridVideos = gridVideos.length > 0 
    ? gridVideos 
    : [1, 2, 3, 4].map(id => ({
        id: `mock-${id}`,
        title: "",
        thumbnail: "",
        viewCount: "0",
        publishedAt: "",
        isLive: false,
        isMock: true
      }));

  // Main hero playback handler
  const handleMainPlay = () => {
    // 1. Force the player back to the featured video (Live or latest)
    setActiveVideo(defaultVideo);

    // 2. Increment the numeric trigger to force iframe remount with autoplay
    setPlayTrigger((prev) => prev + 1);

    // 3. Smooth scroll to the top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Play parameter logic
  const isCurrentVideoLive = !!currentVideo?.isLive;
  const autoPlayParam = playTrigger > 0 || isCurrentVideoLive ? "1" : "0";
  const iframeSrc = currentVideo 
    ? `https://www.youtube.com/embed/${currentVideo.id}?autoplay=${autoPlayParam}&mute=${autoPlayParam}&rel=0&modestbranding=1`
    : "";

  return (
    <main
      style={{
        minHeight: "100vh",
        paddingTop: "72px",
        background: colors.bgDeep,
      }}
    >
      {/* ── HeroSection ──────────────────────────── */}
      {currentVideo && (
        <section
          style={{
            position: "relative",
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "64px 24px 64px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 500px), 1fr))",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* Left Column: Typography & CTAs (Static texts) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: colors.primary,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {hasLiveChannel ? t.tvPage.heroTag : t.tvPage.heroFallbackTag}
              </span>
              {hasLiveChannel && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#FF0000",
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "#fff",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    {t.tvPage.heroLiveBadge}
                  </span>
                </div>
              )}
            </div>

            <h1
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(40px, 5vw, 56px)",
                fontWeight: 800,
                color: colors.textPrimary,
                letterSpacing: "-1.5px",
                lineHeight: 1.15,
                marginBottom: "20px",
              }}
            >
              {hasLiveChannel ? t.tvPage.heroTitle : t.tvPage.heroFallbackTitle}
            </h1>
            
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "18px",
                color: colors.textSecondary,
                lineHeight: 1.6,
                marginBottom: "40px",
                maxWidth: "540px",
              }}
            >
              {t.tvPage.heroSubtitle}
            </p>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {/* Primary Button - IN PLATFORM PLAYER */}
              <button
                onClick={handleMainPlay}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#fff",
                  background: colors.primary,
                  border: "none",
                  borderRadius: "14px",
                  padding: "16px 32px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.3s ease",
                  boxShadow: `0 0 32px rgba(${colors.primaryRgb}, 0.5)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = `0 0 40px rgba(${colors.primaryRgb}, 0.7)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = `0 0 32px rgba(${colors.primaryRgb}, 0.5)`;
                }}
              >
                <div style={{ background: "#fff", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <Play size={14} fill={colors.primary} color={colors.primary} style={{ marginLeft: "2px" }} />
                </div>
                {t.tvPage.watchLive}
              </button>
              
              {/* Secondary Button - EXTERNAL */}
              <a
                href={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: colors.textPrimary,
                  background: "transparent",
                  border: `1.5px solid ${colors.primary}`,
                  borderRadius: "14px",
                  padding: "16px 32px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = `rgba(${colors.primaryRgb}, 0.08)`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                <Play size={20} fill={colors.primary} color={colors.primary} />
                {t.tvPage.watchOnYouTube}
              </a>
            </div>
          </motion.div>

          {/* Right Column: YouTube Embed */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            id="hero-player"
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "56.25%", // 16:9 Aspect Ratio
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: `0 0 40px rgba(${colors.primaryRgb}, 0.08), 0 24px 48px rgba(0,0,0,0.5)`,
                border: `1px solid rgba(255,255,255, 0.1)`,
                background: "#000",
                marginBottom: "16px",
              }}
            >
              <iframe
                key={`${currentVideo.id}-${playTrigger}`}
                src={iframeSrc}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
            {/* Title Below Player (Dynamic based on active video) */}
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                color: colors.textPrimary,
                padding: "0 8px",
              }}
            >
              {currentVideo.title}
            </p>
          </motion.div>
        </section>
      )}

      {/* ── LatestVideosSection ───────────────────────────── */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px 64px",
        }}
      >
        <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: colors.primary,
              borderRadius: "8px",
              width: "32px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Play size={12} fill="#fff" color="#fff" />
          </div>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(20px, 3vw, 24px)",
              fontWeight: 700,
              color: colors.textPrimary,
              letterSpacing: "-0.5px",
            }}
          >
            {t.tvPage.latestVideosTitle}
          </h2>
        </div>

        {/* CSS Grid via Tailwind classes as requested */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayGridVideos.map((video: any, i: number) => {
            const isMock = video.isMock;

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{ height: "100%" }}
              >
                {isMock ? (
                  // Render Skeleton Card
                  <div
                    style={{
                      height: "100%",
                      borderRadius: "16px",
                      background: `rgba(255,255,255,0.02)`,
                      border: `1px solid rgba(255,255,255,0.05)`,
                      padding: "0",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ position: "relative", aspectRatio: "16/9", background: `rgba(255,255,255,0.05)`, width: "100%" }}>
                       <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)", animation: "shimmer 2s infinite" }} />
                    </div>
                    <div style={{ padding: "16px", flexGrow: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ height: "16px", background: `rgba(255,255,255,0.05)`, borderRadius: "4px", width: "90%" }} />
                      <div style={{ height: "16px", background: `rgba(255,255,255,0.05)`, borderRadius: "4px", width: "60%" }} />
                      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: `rgba(255,255,255,0.05)` }} />
                        <div style={{ height: "12px", background: `rgba(255,255,255,0.05)`, borderRadius: "4px", width: "80px" }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Render Real Video Card (Master-Detail logic)
                  <button
                    onClick={() => {
                      setActiveVideo(video);
                      setPlayTrigger((prev) => prev + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    style={{
                      textDecoration: "none",
                      border: "none",
                      textAlign: "left",
                      borderRadius: "16px",
                      overflow: "hidden",
                      background: `rgba(255,255,255,0.03)`,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: currentVideo?.id === video.id ? colors.primary : `rgba(255,255,255,0.08)`,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      width: "100%",
                      padding: 0,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLButtonElement).style.background = `rgba(255,255,255,0.05)`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLButtonElement).style.background = `rgba(255,255,255,0.03)`;
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "#000", width: "100%" }}>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.4s ease",
                        }}
                      />
                      {/* Play overlay */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(0,0,0,0.4)",
                          opacity: currentVideo?.id === video.id ? 1 : 0,
                          transition: "opacity 0.2s ease",
                        }}
                        className="play-overlay"
                      >
                        <div
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.95)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                          }}
                        >
                          <Play size={24} fill="#000" color="#000" style={{ marginLeft: "4px" }} />
                        </div>
                      </div>

                      {/* Duration/Live badge on thumbnail */}
                      {video.isLive ? (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "8px",
                            right: "8px",
                            background: "rgba(255,0,0,0.9)",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: "#fff",
                            textTransform: "uppercase",
                          }}
                        >
                          {t.tvPage.heroLiveBadge}
                        </div>
                      ) : (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "8px",
                            right: "8px",
                            background: "rgba(0,0,0,0.8)",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "11px",
                            fontWeight: 600,
                            color: "#fff",
                          }}
                        >
                          12:34
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ padding: "16px", flexGrow: 1, display: "flex", flexDirection: "column", width: "100%", boxSizing: "border-box" }}>
                      <h3
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "15px",
                          fontWeight: 600,
                          color: colors.textPrimary,
                          lineHeight: 1.4,
                          marginBottom: "8px",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {video.title}
                      </h3>
                      
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "12px",
                          color: colors.textMuted,
                          marginBottom: "16px",
                        }}
                      >
                        {video.viewCount && <span>{video.viewCount} {t.tvPage.views}</span>}
                        {video.viewCount && video.publishedAt && <span> • </span>}
                        {video.publishedAt && (
                          <span>
                            {timeAgo(video.publishedAt, t.tvPage.publishedAgo, t.tvPage.timeUnits)}
                          </span>
                        )}
                      </div>

                      {/* Channel Info at bottom of card */}
                      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
                        {data.channelThumbnail && (
                          <img
                            src={data.channelThumbnail}
                            alt={data.channelTitle}
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: `1px solid rgba(255,255,255,0.1)`,
                            }}
                          />
                        )}
                        <span
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "12px",
                            color: colors.textSecondary,
                            fontWeight: 500,
                          }}
                        >
                          {data.channelTitle}
                        </span>
                      </div>
                    </div>
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── SubscribeBar ──────────────────────── */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            background: colors.bgCard,
            border: `1px solid rgba(255,255,255,0.08)`,
            borderRadius: "20px",
            padding: "24px 32px",
            flexWrap: "wrap",
            boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
          }}
        >
          {/* Left: Channel Avatar & Metrics */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {data.channelThumbnail ? (
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", inset: -2, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.primary}, transparent)`, opacity: 0.5 }} />
                <img
                  src={data.channelThumbnail}
                  alt={data.channelTitle}
                  style={{
                    position: "relative",
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `3px solid ${colors.bgCard}`,
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: `rgba(${colors.primaryRgb}, 0.1)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Users size={28} color={colors.primary} />
              </div>
            )}
            
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "20px",
                  fontWeight: 800,
                  color: colors.textPrimary,
                  letterSpacing: "-0.5px",
                  marginBottom: "4px",
                }}
              >
                {data.channelTitle}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  color: colors.textSecondary,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontWeight: 500,
                }}
              >
                <Users size={14} color={colors.primary} />
                <span style={{ color: colors.textPrimary, fontWeight: 700 }}>{data.subscriberCount}</span> {t.tvPage.subscriberCountLabel?.replace(':', '') || "Inscritos"}
              </div>
            </div>
          </div>

          {/* Right: Subscribe CTA */}
          <a
            href={config.social.youtube + "?sub_confirmation=1"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              color: "#000",
              background: colors.primary,
              border: "none",
              borderRadius: "12px",
              padding: "14px 32px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = `0 4px 20px rgba(${colors.primaryRgb}, 0.3)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Play size={16} fill="#000" color="#000" /> {t.tvPage.subscribeCta}
          </a>
        </motion.div>
      </section>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        button:hover .play-overlay { opacity: 1 !important; }
        button:hover img { transform: scale(1.03); }
      `}</style>
    </main>
  );
}
