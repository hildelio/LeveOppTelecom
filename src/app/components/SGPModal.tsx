import { useState, useEffect } from "react";
import { X, User, Phone, MapPin, CheckCircle } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";

interface SGPModalProps {
  open: boolean;
  onClose: () => void;
}

export function SGPModal({ open, onClose }: SGPModalProps) {
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { config, colors } = useTenant();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setSubmitted(false);
      setForm({ name: "", phone: "", address: "" });
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  function formatPhone(val: string) {
    const d = val.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  }

  const renderContent = () => {
    if (config.crmUrl) {
      return (
        <iframe
          src={config.crmUrl}
          sandbox="allow-scripts allow-forms allow-same-origin"
          loading="lazy"
          title="Área do Cliente"
          style={{
            width: "100%",
            height: "80vh",
            maxHeight: "700px",
            border: "none",
            borderRadius: "16px",
            background: "#fff",
          }}
        />
      );
    }

    // Fallback form
    return !submitted ? (
      <>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: `rgba(${colors.primaryRgb}, 0.08)`, border: `1px solid rgba(${colors.primaryRgb}, 0.2)`,
            borderRadius: "100px", padding: "4px 12px", marginBottom: "14px",
          }}>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 600, color: colors.primary, textTransform: "uppercase", letterSpacing: "1px" }}>
              Cadastro Rápido
            </span>
          </div>
          <h2 style={{ fontFamily: "'Inter',sans-serif", fontSize: "26px", fontWeight: 800, color: colors.textPrimary, letterSpacing: "-0.8px", marginBottom: "8px" }}>
            Quero assinar a {config.brandName}
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: colors.textSecondary, lineHeight: 1.65 }}>
            Preencha seus dados e nossa equipe entrará em contato em breve para finalizar sua assinatura.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {[
            { key: "name",    label: "Nome completo",       placeholder: "Seu nome",           Icon: User,   type: "text" },
            { key: "phone",   label: "WhatsApp / Telefone", placeholder: "(71) 99999-9999",    Icon: Phone,  type: "tel"  },
            { key: "address", label: "Endereço / Bairro",   placeholder: "Rua, número, bairro",Icon: MapPin, type: "text" },
          ].map(({ key, label, placeholder, Icon, type }) => (
            <div key={key} style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 600, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "7px" }}>
                {label}
              </label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: `rgba(${colors.primaryRgb}, 0.5)`, pointerEvents: "none" }}>
                  <Icon size={14} />
                </div>
                <input
                  className="sgp-field"
                  type={type}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => {
                    const v = key === "phone" ? formatPhone(e.target.value) : e.target.value;
                    setForm((f) => ({ ...f, [key]: v }));
                  }}
                  required
                  style={{
                    width: "100%", boxSizing: "border-box",
                    fontFamily: "'Inter',sans-serif", fontSize: "14px", color: colors.textPrimary,
                    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "10px", padding: "12px 14px 12px 38px",
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  }}
                />
              </div>
            </div>
          ))}

          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "6px 0 22px" }} />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", fontFamily: "'Inter',sans-serif", fontSize: "16px", fontWeight: 700,
              color: colors.bgDeep, background: loading ? `rgba(${colors.primaryRgb}, 0.55)` : colors.primary,
              border: "none", borderRadius: "12px", padding: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: `0 0 32px rgba(${colors.primaryRgb}, 0.4)`,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => { if (!loading) { (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 52px rgba(${colors.primaryRgb}, 0.65)`; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; } }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 32px rgba(${colors.primaryRgb}, 0.4)`; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
          >
            {loading ? "Enviando..." : "Concluir Cadastro"}
          </button>
        </form>
      </>
    ) : (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: `rgba(${colors.primaryRgb}, 0.1)`, border: `1px solid rgba(${colors.primaryRgb}, 0.3)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <CheckCircle size={36} color={colors.primary} />
        </div>
        <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "22px", fontWeight: 800, color: colors.textPrimary, marginBottom: "12px" }}>Cadastro recebido! 🎉</h3>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", color: colors.textSecondary, lineHeight: 1.7, marginBottom: "32px" }}>
          Nossa equipe entrará em contato no WhatsApp em até 2 horas úteis para confirmar a instalação.
        </p>
        <button
          onClick={onClose}
          style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 600, color: colors.bgDeep, background: colors.primary, border: "none", borderRadius: "10px", padding: "12px 32px", cursor: "pointer", boxShadow: `0 0 24px rgba(${colors.primaryRgb}, 0.4)` }}
        >
          Fechar
        </button>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes sgpFadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes sgpSlide  { from { opacity:0; transform:translateY(28px) scale(0.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        .sgp-overlay { animation: sgpFadeIn 0.22s ease forwards; }
        .sgp-card    { animation: sgpSlide  0.32s cubic-bezier(0.22,1,0.36,1) forwards; }
        .sgp-field:focus { outline:none; border-color:rgba(${colors.primaryRgb}, 0.75)!important; box-shadow:0 0 0 3px rgba(${colors.primaryRgb}, 0.13)!important; }
      `}</style>

      <div
        className="sgp-overlay"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 400,
          background: "rgba(4,8,22,0.85)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div
          className="sgp-card"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: config.crmUrl ? "900px" : "480px",
            background: colors.bgCard,
            backdropFilter: "blur(28px)",
            border: `1px solid rgba(${colors.primaryRgb}, 0.22)`,
            borderRadius: "24px",
            padding: config.crmUrl ? "24px" : "40px 36px",
            position: "relative",
            boxShadow: `0 0 80px rgba(${colors.primaryRgb}, 0.09), 0 32px 72px rgba(0,0,0,0.65)`,
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "18px", right: "18px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50%", width: "32px", height: "32px",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "rgba(255,255,255,0.5)",
              transition: "all 0.2s ease",
              zIndex: 10,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)"; }}
          >
            <X size={14} />
          </button>

          {renderContent()}
        </div>
      </div>
    </>
  );
}
