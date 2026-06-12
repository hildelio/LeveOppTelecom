/**
 * HomePage — Landing page content (route: /)
 * ──────────────────────────────────────────────────────────────
 * Contains the same sections that were previously in AppShell,
 * now extracted to allow routing via react-router.
 */

import { Hero } from "@/app/components/Hero";
import { Pricing } from "@/app/components/Pricing";
import { LeveTV } from "@/app/components/LeveTV";
import { SpeedTest } from "@/app/components/SpeedTest";
import { Features } from "@/app/components/Features";

interface HomePageProps {
  onOpenModal?: () => void;
}

export function HomePage({ onOpenModal }: HomePageProps) {
  return (
    <>
      <Hero onOpenModal={onOpenModal} />
      <Pricing onOpenModal={onOpenModal} />
      <LeveTV />
      <SpeedTest />
      <Features />
    </>
  );
}
