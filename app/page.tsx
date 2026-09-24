import { CinematicDrive } from "@/components/home/cinematic-drive";
import { Experience } from "@/components/home/experience";
import { FinalCTA } from "@/components/home/final-cta";
import { FleetShowcase } from "@/components/home/fleet-showcase";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Navbar } from "@/components/home/navbar";
import { RentalSearch } from "@/components/home/rental-search";

export default function Home() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen overflow-x-clip bg-[#050505] text-white outline-none"
    >
      <Navbar />

      <Hero />

      <FleetShowcase />

      <CinematicDrive modelAvailable />

      <RentalSearch />

      <Experience />

      <HowItWorks />

      <FinalCTA />

      <Footer />
    </main>
  );
}