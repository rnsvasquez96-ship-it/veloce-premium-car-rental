import type { Metadata } from "next";

import { FleetCatalog } from "@/components/fleet/fleet-catalog";
import { Footer } from "@/components/home/footer";
import { Navbar } from "@/components/home/navbar";

export const metadata: Metadata = {
  title: "The Collection — VELOCE",
  description:
    "Enter the VELOCE private performance collection. Explore a curated selection of exceptional machines available for your next journey.",
  openGraph: {
    title: "The Collection — VELOCE",
    description:
      "A curated private collection of performance and grand touring machines.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Collection — VELOCE",
    description:
      "A curated private collection of performance and grand touring machines.",
  },
};

export default function FleetPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative min-h-screen overflow-x-clip bg-[#050606] text-white outline-none"
    >
      {/* =========================================================
          PAGE ARCHITECTURE
      ========================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
      >
        <div className="absolute left-6 top-0 h-full w-px bg-white/[0.018] lg:left-10" />

        <div className="absolute right-6 top-0 h-full w-px bg-white/[0.018] lg:right-10" />

        <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/[0.012] xl:block" />

        <div className="absolute inset-x-0 top-[50vh] h-px bg-white/[0.012]" />
      </div>

      {/* =========================================================
          NAVIGATION
      ========================================================== */}

      <Navbar />

      {/* =========================================================
          PRIVATE COLLECTION
      ========================================================== */}

      <div className="relative z-10">
        <FleetCatalog />
      </div>

      {/* =========================================================
          CLOSING
      ========================================================== */}

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}