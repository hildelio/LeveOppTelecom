import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { TenantProvider, useTenant } from "@/contexts/TenantContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { SegmentProvider } from "@/contexts/SegmentContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { SGPModal } from "./components/SGPModal";
import { LocationModal } from "./components/LocationModal";
import { HomePage } from "./pages/HomePage";
import { TvPageSkeleton } from "./components/TvPageSkeleton";

// ── Code-split: TvPage loaded only when /tv is visited ──────
const TvPage = lazy(() => import("./pages/TvPage"));

/**
 * AppShell — Layout wrapper shared across all routes.
 * Renders Header, Footer, modals, WhatsApp FAB and the active route content.
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

      <Routes>
        <Route
          path="/"
          element={<HomePage onOpenModal={() => setModalOpen(true)} />}
        />
        <Route
          path="/tv"
          element={
            <Suspense fallback={<TvPageSkeleton />}>
              <TvPage />
            </Suspense>
          }
        />
      </Routes>

      <Footer />
      <WhatsAppButton />
      <SGPModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <LocationModal />
    </div>
  );
}

/**
 * Root component — wraps everything in the provider stack + BrowserRouter:
 *   BrowserRouter  → SPA routing
 *   TenantProvider  → CSS custom properties + brand config
 *   LocationProvider → city detection + localStorage
 *   SegmentProvider  → B2C / B2B toggle
 *   I18nProvider     → pt-BR / en-US
 */
export default function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <LocationProvider>
          <SegmentProvider>
            <I18nProvider>
              <AppShell />
            </I18nProvider>
          </SegmentProvider>
        </LocationProvider>
      </TenantProvider>
    </BrowserRouter>
  );
}
