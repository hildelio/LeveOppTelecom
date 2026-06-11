import { useCallback, useEffect, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";
import { Check, Zap, ChevronLeft, ChevronRight, MapPin, Building2, User } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";
import { useLocation } from "@/contexts/LocationContext";
import { useSegment } from "@/contexts/SegmentContext";
import { getPlans } from "@/data/plans";

interface PricingProps {
  onOpenModal?: () => void;
}

export function Pricing({ onOpenModal }: PricingProps) {
  const { colors } = useTenant();
  const { city, detecting } = useLocation();
  const { segment, isB2B } = useSegment();

  // ── Reactive plan list ────────────────────────────────────
  const plans = useMemo(() => getPlans(city, segment), [city, segment]);

  // Find the index of the highlighted plan (or fallback to center)
  const highlightIdx = useMemo(() => {
    const idx = plans.findIndex((p) => p.highlight);
    return idx >= 0 ? idx : Math.floor(plans.length / 2);
  }, [plans]);

  // ── Embla carousel ────────────────────────────────────────
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: false,
    startIndex: highlightIdx,
  });
  const [prevOk, setPrevOk] = useState(false);
  const [nextOk, setNextOk] = useState(true);
  const [selIdx, setSelIdx] = useState(highlightIdx);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevOk(emblaApi.canScrollPrev());
    setNextOk(emblaApi.canScrollNext());
    setSelIdx(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // When city or segment changes, reset the carousel to the
  // highlighted plan and force Embla to re-initialize.
  useEffect(() => {
    if (!emblaApi) return;
    // Embla needs a frame to digest the new DOM children
    requestAnimationFrame(() => {
      emblaApi.reInit({ startIndex: highlightIdx });
      setSelIdx(highlightIdx);
    });
  }, [city, segment, emblaApi, highlightIdx]);

  // ── Subtitle text ─────────────────────────────────────────
  const subtitleText = detecting
    ? "Buscando os melhores planos para a sua região..."
    : isB2B
      ? `Links dedicados com SLA para empresas em ${city}.`
      : `Planos de fibra óptica para todos os perfis em ${city}. Sem fidelidade.`;

  return (
    <section
      id="planos"
      style={{
        background: colors.bgDark,
        padding: "100px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* bg glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "800px",
          height: "400px",
          background: `radial-gradient(ellipse, rgba(${colors.primaryRgb},0.05) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "60px", padding: "0 24px" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: `rgba(${colors.primaryRgb},0.08)`,
              border: `1px solid rgba(${colors.primaryRgb},0.2)`,
              borderRadius: "100px",
              padding: "5px 14px",
              marginBottom: "18px",
            }}
          >
            <Zap size={12} color={colors.primary} />
            <span
              style={{
                fontFamily: "'Inter',sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: colors.primary,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {isB2B ? "Empresas" : "Planos"}
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Inter',sans-serif",
              fontSize: "clamp(32px,4vw,48px)",
              fontWeight: 800,
              color: colors.textPrimary,
              letterSpacing: "-1.5px",
              marginBottom: "14px",
            }}
          >
            {isB2B ? "Soluções Corporativas" : "Escolha a sua velocidade"}
          </h2>

          <p
            style={{
              fontFamily: "'Inter',sans-serif",
              fontSize: "17px",
              color: colors.textSecondary,
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            {subtitleText}
          </p>

          {/* Active context chips */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: `rgba(${colors.primaryRgb},0.06)`,
                border: `1px solid rgba(${colors.primaryRgb},0.18)`,
                borderRadius: "100px",
                padding: "4px 12px",
                fontFamily: "'Inter',sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: colors.primary,
              }}
            >
              <MapPin size={11} />
              {detecting ? "Localizando..." : city}
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: `rgba(${colors.primaryRgb},0.06)`,
                border: `1px solid rgba(${colors.primaryRgb},0.18)`,
                borderRadius: "100px",
                padding: "4px 12px",
                fontFamily: "'Inter',sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: colors.primary,
              }}
            >
              {isB2B ? <Building2 size={11} /> : <User size={11} />}
              {isB2B ? "Empresas" : "Para Você"}
            </div>
          </div>
        </motion.div>

        {/* Carousel */}
        <div style={{ position: "relative" }}>
          {/* Arrows */}
          {(["left", "right"] as const).map((side) => {
            const canScroll = side === "left" ? prevOk : nextOk;
            return (
              <button
                key={side}
                onClick={() =>
                  side === "left"
                    ? emblaApi?.scrollPrev()
                    : emblaApi?.scrollNext()
                }
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  [side]: "8px",
                  zIndex: 10,
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: canScroll
                    ? `rgba(${colors.primaryRgb},0.12)`
                    : "rgba(255,255,255,0.04)",
                  border: canScroll
                    ? `1px solid rgba(${colors.primaryRgb},0.4)`
                    : "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: canScroll ? "pointer" : "default",
                  opacity: canScroll ? 1 : 0.3,
                  color: canScroll ? colors.primary : colors.textMuted,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (canScroll) {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      `rgba(${colors.primaryRgb},0.22)`;
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      `0 0 18px rgba(${colors.primaryRgb},0.28)`;
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    canScroll
                      ? `rgba(${colors.primaryRgb},0.12)`
                      : "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "none";
                }}
              >
                {side === "left" ? (
                  <ChevronLeft size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </button>
            );
          })}

          {/* Embla viewport */}
          <div
            ref={emblaRef}
            style={{ overflow: "hidden", padding: "20px 0 36px" }}
          >
            <div
              style={{
                display: "flex",
                gap: "20px",
                paddingLeft: "64px",
                paddingRight: "64px",
                alignItems: "center",
              }}
            >
              {detecting ? (
                // ── Skeletons ──
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`skel-${i}`}
                    style={{
                      flex: "0 0 296px",
                      minWidth: 0,
                      position: "relative",
                      background: colors.bgCard,
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "20px",
                      padding: "32px 24px",
                      transform: i === 1 ? "scale(1.02)" : "scale(0.94)",
                      opacity: i === 1 ? 1 : 0.62,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                      transition: "all 0.38s cubic-bezier(0.23,1,0.32,1)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <div style={{ height: "16px", width: "100px", borderRadius: "4px", background: `rgba(${colors.primaryRgb}, 0.1)`, animation: "pulse 1.5s infinite" }} />
                    <div style={{ height: "14px", width: "160px", borderRadius: "4px", background: `rgba(${colors.primaryRgb}, 0.05)`, animation: "pulse 1.5s infinite", marginBottom: "16px" }} />
                    
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "16px" }}>
                      <div style={{ height: "48px", width: "120px", borderRadius: "8px", background: `rgba(${colors.primaryRgb}, 0.1)`, animation: "pulse 1.5s infinite" }} />
                      <div style={{ height: "16px", width: "40px", borderRadius: "4px", background: `rgba(${colors.primaryRgb}, 0.05)`, animation: "pulse 1.5s infinite" }} />
                    </div>

                    <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "16px" }} />

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                      <div style={{ height: "12px", width: "100%", borderRadius: "4px", background: `rgba(${colors.primaryRgb}, 0.05)`, animation: "pulse 1.5s infinite" }} />
                      <div style={{ height: "12px", width: "90%", borderRadius: "4px", background: `rgba(${colors.primaryRgb}, 0.05)`, animation: "pulse 1.5s infinite" }} />
                      <div style={{ height: "12px", width: "95%", borderRadius: "4px", background: `rgba(${colors.primaryRgb}, 0.05)`, animation: "pulse 1.5s infinite" }} />
                    </div>

                    <div style={{ height: "46px", width: "100%", borderRadius: "10px", background: `rgba(${colors.primaryRgb}, 0.08)`, animation: "pulse 1.5s infinite", marginTop: "auto" }} />
                  </div>
                ))
              ) : (
                // ── Actual Plans ──
                plans.map((plan, i) => (
                <div
                  key={plan.id}
                  style={{
                    flex: "0 0 296px",
                    minWidth: 0,
                    position: "relative",
                    background: plan.highlight
                      ? `rgba(${colors.primaryRgb},0.07)`
                      : colors.bgCard,
                    backdropFilter: "blur(12px)",
                    border: plan.highlight
                      ? `1.5px solid rgba(${colors.primaryRgb},0.55)`
                      : "1px solid rgba(255,255,255,0.09)",
                    borderRadius: "20px",
                    padding: plan.highlight ? "40px 28px" : "32px 24px",
                    transform:
                      selIdx === i
                        ? plan.highlight
                          ? "scale(1.06)"
                          : "scale(1.02)"
                        : "scale(0.94)",
                    opacity: selIdx === i ? 1 : 0.62,
                    boxShadow: plan.highlight
                      ? `0 0 60px rgba(${colors.primaryRgb},0.18), 0 24px 48px rgba(0,0,0,0.4)`
                      : "0 8px 32px rgba(0,0,0,0.3)",
                    transition:
                      "all 0.38s cubic-bezier(0.23,1,0.32,1)",
                  }}
                >
                  {plan.badge && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-14px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: `linear-gradient(90deg,${colors.primary},${colors.secondary})`,
                        borderRadius: "100px",
                        padding: "4px 18px",
                        fontFamily: "'Inter',sans-serif",
                        fontSize: "12px",
                        fontWeight: 700,
                        color: colors.bgDeep,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div
                    style={{
                      fontFamily: "'Inter',sans-serif",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: plan.highlight
                        ? colors.primary
                        : colors.textSecondary,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    {plan.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Inter',sans-serif",
                      fontSize: "13px",
                      color: colors.textMuted,
                      marginBottom: "18px",
                    }}
                  >
                    {plan.description}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: "4px",
                      marginBottom: "22px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Inter',sans-serif",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: colors.textSecondary,
                        marginBottom: "8px",
                      }}
                    >
                      R$
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter',sans-serif",
                        fontSize: "52px",
                        fontWeight: 900,
                        color: colors.textPrimary,
                        lineHeight: 1,
                        letterSpacing: "-3px",
                      }}
                    >
                      {plan.price}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Inter',sans-serif",
                        fontSize: "13px",
                        color: colors.textMuted,
                        marginBottom: "6px",
                      }}
                    >
                      {plan.period}
                    </span>
                  </div>

                  <div
                    style={{
                      height: "1px",
                      background: plan.highlight
                        ? `rgba(${colors.primaryRgb},0.2)`
                        : "rgba(255,255,255,0.07)",
                      marginBottom: "18px",
                    }}
                  />

                  <ul
                    style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}
                  >
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "9px",
                          marginBottom: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "17px",
                            height: "17px",
                            borderRadius: "50%",
                            background: plan.highlight
                              ? `rgba(${colors.primaryRgb},0.15)`
                              : "rgba(255,255,255,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Check
                            size={10}
                            color={
                              plan.highlight
                                ? colors.primary
                                : colors.textSecondary
                            }
                            strokeWidth={3}
                          />
                        </div>
                        <span
                          style={{
                            fontFamily: "'Inter',sans-serif",
                            fontSize: "13px",
                            color: "rgba(255,255,255,0.68)",
                          }}
                        >
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={onOpenModal}
                    style={{
                      width: "100%",
                      fontFamily: "'Inter',sans-serif",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: plan.highlight
                        ? colors.bgDeep
                        : colors.textPrimary,
                      background: plan.highlight
                        ? colors.primary
                        : "rgba(255,255,255,0.07)",
                      border: plan.highlight
                        ? "none"
                        : "1px solid rgba(255,255,255,0.13)",
                      borderRadius: "10px",
                      padding: "13px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: plan.highlight
                        ? `0 0 24px rgba(${colors.primaryRgb},0.4)`
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (plan.highlight) {
                        (e.target as HTMLButtonElement).style.boxShadow =
                          `0 0 42px rgba(${colors.primaryRgb},0.6)`;
                      } else {
                        (e.target as HTMLButtonElement).style.background =
                          `rgba(${colors.primaryRgb},0.1)`;
                        (e.target as HTMLButtonElement).style.color =
                          colors.primary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (plan.highlight) {
                        (e.target as HTMLButtonElement).style.boxShadow =
                          `0 0 24px rgba(${colors.primaryRgb},0.4)`;
                      } else {
                        (e.target as HTMLButtonElement).style.background =
                          "rgba(255,255,255,0.07)";
                        (e.target as HTMLButtonElement).style.color =
                          colors.textPrimary;
                      }
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              )))}
            </div>
          </div>

          {/* Dot indicators */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "4px",
            }}
          >
            {plans.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                style={{
                  width: selIdx === i ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background:
                    selIdx === i
                      ? colors.primary
                      : "rgba(255,255,255,0.2)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s ease",
                  boxShadow:
                    selIdx === i
                      ? `0 0 10px rgba(${colors.primaryRgb},0.5)`
                      : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
