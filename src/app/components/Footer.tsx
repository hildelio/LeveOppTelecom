import { MessageCircle, Mail, Instagram, Facebook, Youtube } from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";
import { useTranslation } from "@/contexts/I18nContext";

const socials = [{ Icon: Instagram, label: "Instagram" }, { Icon: Facebook, label: "Facebook" }, { Icon: Youtube, label: "YouTube" }];

export function Footer() {
  const { config, colors } = useTenant();
  const { t } = useTranslation();

  const quickLinks = [
    { label: t.nav.home, id: "home" },
    { label: t.nav.plans, id: "planos" },
    { label: `${config.brandName} ${t.nav.tv}`, id: "levetv" },
    { label: t.nav.contact, id: "contato" }
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
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
    <footer id="contato" style={{ background: colors.bgFooter, borderTop: "1px solid rgba(255,255,255,0.06)", padding: "80px 24px 32px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "48px", marginBottom: "64px" }}>

          {/* Brand */}
          <div>
            <img src={config.assets.logoPath} alt={config.brandName} style={{ height: "64px", width: "auto", objectFit: "contain", marginBottom: "16px", filter: `drop-shadow(0 0 8px ${colors.borderGlow})`, display: "block" }} />
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: colors.textSecondary, lineHeight: 1.8, maxWidth: "220px" }}>
              {t.footer.slogan}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px" }}>{t.footer.quickLinks}</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {quickLinks.map((link) => (
                <li key={link.id} style={{ marginBottom: "10px" }}>
                  <a href={`#${link.id}`} onClick={(e) => handleScroll(e, link.id)} style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.44)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = colors.primary)}
                    onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.44)")}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px" }}>{t.footer.supportLegal}</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {t.footer.legalLinks.map((l) => (
                <li key={l} style={{ marginBottom: "10px" }}>
                  <a href="#" style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.44)", textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = colors.primary)}
                    onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "rgba(255,255,255,0.44)")}>{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px" }}>{t.footer.contactTitle}</h4>
            <a href={`https://api.whatsapp.com/send?phone=${config.contact.whatsappNumber}&text=${encodeURIComponent(config.contact.whatsappMessage)}`} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.48)", textDecoration: "none", marginBottom: "12px", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = colors.primary)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.48)")}>
              <MessageCircle size={15} /> +{config.contact.whatsappNumber.replace(/(\d{2})(\d{2})(\d{4,5})(\d{4})/, "$1 ($2) $3-$4")}
            </a>
            <a href={`mailto:${config.contact.email}`}
              style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.48)", textDecoration: "none", marginBottom: "28px", transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = colors.primary)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.48)")}>
              <Mail size={15} /> {config.contact.email}
            </a>
            <div style={{ display: "flex", gap: "10px" }}>
              {socials.map(({ Icon, label }) => (
                <a key={label} href="#" title={label}
                  style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.48)", textDecoration: "none", transition: "all 0.2s ease" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = `rgba(${colors.primaryRgb}, 0.1)`; el.style.borderColor = `rgba(${colors.primaryRgb}, 0.4)`; el.style.color = colors.primary; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLAnchorElement; el.style.background = "rgba(255,255,255,0.05)"; el.style.borderColor = "rgba(255,255,255,0.09)"; el.style.color = "rgba(255,255,255,0.48)"; }}
                ><Icon size={16} /></a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.28)" }}>© {new Date().getFullYear()} {config.brandName}. {t.footer.copyright}</p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.28)" }}>CNPJ: {config.contact.cnpj}</p>
        </div>
      </div>
    </footer>
  );
}
