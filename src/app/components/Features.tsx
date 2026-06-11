import { motion } from "motion/react";
import { Zap, Headphones, Wifi, Clock } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";

export function Features() {
  const { config, colors } = useTenant();

  const features = [
    {
      icon: Zap,
      title: "Fibra Óptica",
      description:
        "Tecnologia de ponta com cabos de fibra óptica para máxima estabilidade e velocidade real até sua porta.",
      color: colors.primary,
    },
    {
      icon: Headphones,
      title: "Suporte 24h",
      description:
        "Equipe técnica disponível 24 horas por dia, 7 dias por semana para resolver qualquer problema.",
      color: colors.secondary,
    },
    {
      icon: Wifi,
      title: "Wi-Fi Grátis",
      description:
        "Roteador dual-band de última geração incluso na instalação, sem custo adicional.",
      color: colors.primary,
    },
    {
      icon: Clock,
      title: "Instalação Rápida",
      description:
        "Agendamento em até 24h e instalação em menos de 2 horas por nossos técnicos certificados.",
      color: colors.secondary,
    },
  ];

  return (
    <section
      style={{
        background: colors.bgDark,
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent, rgba(${colors.primaryRgb},0.2), transparent)`,
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 800,
              color: colors.textPrimary,
              letterSpacing: "-1.5px",
              marginBottom: "16px",
            }}
          >
            Por que escolher a{" "}
            <span style={{ color: colors.primary }}>{config.brandName}</span>?
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "16px",
              color: colors.textSecondary,
              maxWidth: "460px",
              margin: "0 auto",
            }}
          >
            Infraestrutura moderna, atendimento humanizado e compromisso com a
            sua conexão.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {features.map((feat, i) => {
            const Icon = feat.icon;
            // The hover colors require HEX -> rgba conversion, which is tricky in inline styles
            // But we have rgb in colors.primaryRgb / secondaryRgb. Let's just use CSS opacity or the RGB values.
            // A simple trick is using box-shadow and border colors directly.
            const featColorRgb = feat.color === colors.primary ? colors.primaryRgb : colors.secondaryRgb;

            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{
                  background: colors.bgCard,
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  padding: "36px 28px",
                  cursor: "default",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(-6px)";
                  el.style.border = `1px solid rgba(${featColorRgb}, 0.3)`;
                  el.style.boxShadow = `0 12px 40px rgba(${featColorRgb}, 0.1)`;
                  el.style.background = `rgba(${featColorRgb}, 0.04)`;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.transform = "translateY(0)";
                  el.style.border = "1px solid rgba(255,255,255,0.08)";
                  el.style.boxShadow = "none";
                  el.style.background = colors.bgCard;
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "14px",
                    background: `linear-gradient(135deg, rgba(${featColorRgb},0.2), rgba(${featColorRgb},0.05))`,
                    border: `1px solid rgba(${featColorRgb},0.3)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                    boxShadow: `0 0 20px rgba(${featColorRgb},0.15)`,
                  }}
                >
                  <Icon
                    size={24}
                    style={{
                      color: feat.color,
                      filter: `drop-shadow(0 0 6px rgba(${featColorRgb},0.5))`,
                    }}
                  />
                </div>

                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "18px",
                    fontWeight: 700,
                    color: colors.textPrimary,
                    marginBottom: "10px",
                    letterSpacing: "-0.3px",
                  }}
                >
                  {feat.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "14px",
                    color: colors.textSecondary,
                    lineHeight: 1.7,
                  }}
                >
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
