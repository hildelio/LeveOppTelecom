import { useState } from "react";
import { TenantProvider, useTenant } from "@/contexts/TenantContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { SegmentProvider } from "@/contexts/SegmentContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Pricing } from "./components/Pricing";
import { LeveTV } from "./components/LeveTV";
import { SpeedTest } from "./components/SpeedTest";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { SGPModal } from "./components/SGPModal";
import { LocationModal } from "./components/LocationModal";

/**
 * Inner app shell that has access to all contexts.
 * Reads `colors.bgDeep` to set the page background dynamically.
 */
function AppShell() {
  const [modalOpen, setModalOpen] = useState(false);
  const { colors } = useTenant();

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: colors.bgDeep,
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Header onOpenModal={() => setModalOpen(true)} />
      <Hero onOpenModal={() => setModalOpen(true)} />
      <Pricing onOpenModal={() => setModalOpen(true)} />
      <LeveTV />
      <SpeedTest />
      <Features />
      <Footer />

      <WhatsAppButton />
      <SGPModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <LocationModal />
    </div>
  );
}

/**
 * Root component — wraps everything in the provider stack:
 *   TenantProvider  → CSS custom properties + brand config
 *   LocationProvider → city detection + localStorage
 *   SegmentProvider  → B2C / B2B toggle
 */
export default function App() {
  return (
    <TenantProvider>
      <LocationProvider>
        <SegmentProvider>
          <I18nProvider>
            <AppShell />
          </I18nProvider>
        </SegmentProvider>
      </LocationProvider>
    </TenantProvider>
  );
}
