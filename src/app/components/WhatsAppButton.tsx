import { useState } from "react";
import { X } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";
import { useTranslation } from "@/contexts/I18nContext";

export function WhatsAppButton() {
  const [popupOpen, setPopupOpen] = useState(false);
  const { config } = useTenant();
  const { t } = useTranslation();

  const waUrl = `https://api.whatsapp.com/send?phone=${config.contact.whatsappNumber}&text=${encodeURIComponent(config.contact.whatsappMessage)}`;

  return (
    <>
      <style>{`
        @keyframes waPulse {
          0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.6); }
          70%  { box-shadow: 0 0 0 18px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
        }
        @keyframes waBounce {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.07); }
        }
        .wa-fab {
          animation: waPulse 2.2s ease-out infinite, waBounce 3.2s ease-in-out infinite;
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        .wa-fab:hover {
          animation: none !important;
          transform: scale(1.14) !important;
          box-shadow: 0 8px 36px rgba(37,211,102,0.55) !important;
        }
        @keyframes waSlideUp {
          from { opacity: 0; transform: translateY(14px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .wa-popup { animation: waSlideUp 0.28s cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>

      {/* Popup */}
      {popupOpen && (
        <div
          className="wa-popup"
          style={{
            position: "fixed",
            bottom: "108px",
            right: "24px",
            zIndex: 200,
            width: "300px",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 16px 52px rgba(0,0,0,0.55)",
          }}
        >
          {/* Green header */}
          <div
            style={{
              background: "linear-gradient(135deg, #075E54, #128C7E)",
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* WA icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.12-1.34A9.93 9.93 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.16 14.07c-.22.62-1.27 1.15-1.75 1.22-.44.06-.99.09-1.6-.1-.37-.11-.84-.27-1.44-.53-2.53-1.1-4.18-3.65-4.31-3.82-.13-.17-1.06-1.41-1.06-2.69 0-1.28.67-1.91 1.04-2.17.22-.16.49-.2.65-.2.19 0 .38.01.54.02.18 0 .43-.07.67.51.25.6.85 2.07.92 2.22.08.15.13.33.03.53-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.25 1.64 2.03.86.78 1.59 1.02 1.89 1.14.3.12.48.1.65-.06.17-.16.73-.85.93-1.14.2-.29.4-.24.67-.15.27.09 1.72.81 2.02.96.3.15.49.22.56.34.07.12.07.69-.15 1.31z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", fontWeight: 700, color: "#fff", margin: 0 }}>
                  WhatsApp
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.75)", margin: 0 }}>
                  {t.whatsapp.onlineNow}
                </p>
              </div>
            </div>
            <button
              onClick={() => setPopupOpen(false)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Chat body */}
          <div style={{ background: "#ECE5DD", padding: "18px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: "0 12px 12px 12px",
                padding: "10px 14px",
                maxWidth: "90%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              }}
            >
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#111", margin: 0, lineHeight: 1.5 }}>
                <span dangerouslySetInnerHTML={{ __html: t.whatsapp.greeting1 + config.brandName + t.whatsapp.greeting2 }} />
              </p>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: "0 12px 12px 12px",
                padding: "10px 14px",
                maxWidth: "70%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              }}
            >
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#111", margin: 0 }}>
                {t.whatsapp.help}
              </p>
            </div>
          </div>

          {/* CTA */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "#25D366",
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              textAlign: "center",
              padding: "14px 20px",
              textDecoration: "none",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#1ebe5d")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "#25D366")}
          >
            {t.whatsapp.openChat}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M2 21l1.65-5.96A9.9 9.9 0 012 10C2 4.48 6.48 0 12 0s10 4.48 10 10-4.48 10-10 10a9.9 9.9 0 01-5.04-1.35L2 21z" opacity=".8"/></svg>
          </a>
        </div>
      )}

      {/* FAB */}
      <button
        className="wa-fab"
        onClick={() => setPopupOpen((v) => !v)}
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 200,
          width: "62px",
          height: "62px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #25D366, #128C7E)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label={t.whatsapp.ariaLabel}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l5.12-1.34A9.93 9.93 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.16 14.07c-.22.62-1.27 1.15-1.75 1.22-.44.06-.99.09-1.6-.1-.37-.11-.84-.27-1.44-.53-2.53-1.1-4.18-3.65-4.31-3.82-.13-.17-1.06-1.41-1.06-2.69 0-1.28.67-1.91 1.04-2.17.22-.16.49-.2.65-.2.19 0 .38.01.54.02.18 0 .43-.07.67.51.25.6.85 2.07.92 2.22.08.15.13.33.03.53-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.25 1.64 2.03.86.78 1.59 1.02 1.89 1.14.3.12.48.1.65-.06.17-.16.73-.85.93-1.14.2-.29.4-.24.67-.15.27.09 1.72.81 2.02.96.3.15.49.22.56.34.07.12.07.69-.15 1.31z"/>
        </svg>
      </button>
    </>
  );
}
