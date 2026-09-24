import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";

import { CinematicImage } from "@/components/motion/cinematic-image";
import { MagneticLink } from "@/components/motion/magnetic-link";
import { Footer } from "@/components/home/footer";
import { Navbar } from "@/components/home/navbar";
import { vehicles } from "@/data/vehicles";

type VehiclePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const lifestyleImages: Record<string, string> = {
  "porsche-911": "porsche-night",
  "bmw-m4": "bmw-city",
  "mercedes-amg-gt-63": "amg-night",
};

export async function generateMetadata({
  params,
}: VehiclePageProps): Promise<Metadata> {
  const { slug } = await params;

  const vehicle = vehicles.find(
    (item) => item.slug === slug,
  );

  if (!vehicle) {
    return {
      title: "Vehicle — VELOCE",
    };
  }

  return {
    title: `${vehicle.brand} ${vehicle.model} — VELOCE`,
    description: `Discover the ${vehicle.brand} ${vehicle.model} in the VELOCE private performance collection. ${vehicle.horsepower} HP, ${vehicle.acceleration} 0–100 km/h, from ₱${vehicle.pricePerDay.toLocaleString("en-PH")} per day.`,
  };
}

export function generateStaticParams() {
  return vehicles.map((vehicle) => ({
    slug: vehicle.slug,
  }));
}

export default async function VehiclePage({
  params,
}: VehiclePageProps) {
  const { slug } = await params;

  const vehicle = vehicles.find(
    (item) => item.slug === slug,
  );

  if (!vehicle) {
    notFound();
  }

  const photograph =
    lifestyleImages[vehicle.slug] ?? "porsche-night";

  const vehicleNumber = String(
    vehicles.findIndex(
      (item) => item.id === vehicle.id,
    ) + 1,
  ).padStart(2, "0");

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative min-h-screen overflow-x-clip bg-[#050606] text-white outline-none"
    >
      <Navbar />

      {/* =========================================================
          VEHICLE LAUNCH
      ========================================================== */}

      <section
        aria-labelledby="vehicle-heading"
        className="relative min-h-[100svh] overflow-hidden"
      >
        {/* architectural background */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-6 top-0 h-full w-px bg-white/[0.03] lg:left-10" />

          <div className="absolute right-6 top-0 h-full w-px bg-white/[0.03] lg:right-10" />

          <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/[0.018] lg:block" />

          <div className="absolute left-0 top-[54%] h-px w-full bg-white/[0.025]" />

          <div className="absolute left-1/2 top-[56%] h-[55vw] w-[90vw] max-w-[1400px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-white/[0.02] blur-[90px]" />
        </div>

        {/* giant brand */}

        <p
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[30%] select-none whitespace-nowrap text-[25vw] font-medium uppercase leading-none tracking-[-0.105em] text-white/[0.025]"
          style={{
            transform: "translateX(-50%)",
          }}
        >
          {vehicle.brand}
        </p>

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-5 pb-8 pt-28 sm:px-6 lg:px-10 lg:pb-10 lg:pt-32">
          {/* =====================================================
              TOP BAR
          ====================================================== */}

          <div className="flex items-center justify-between gap-6 border-b border-white/12 pb-5">
            <Link
              href="/fleet"
              className="group flex min-h-11 items-center gap-4 text-[8px] uppercase tracking-[0.38em] text-white/42 transition-colors hover:text-white"
            >
              <ArrowLeft
                size={15}
                strokeWidth={1.3}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              The collection
            </Link>

            <div className="flex items-center gap-5">
              <p className="hidden text-[7px] uppercase tracking-[0.4em] text-white/22 sm:block">
                Machine / {vehicleNumber}
              </p>

              <span className="h-px w-8 bg-white/15" />

              <p className="text-[7px] uppercase tracking-[0.4em] text-[#d8ff3e]">
                {vehicle.category}
              </p>
            </div>
          </div>

          {/* =====================================================
              IDENTITY
          ====================================================== */}

          <div className="relative z-20 mt-10 md:mt-14">
            <div className="flex flex-wrap items-center gap-4">
              <p className="text-[8px] uppercase tracking-[0.45em] text-[#d8ff3e]">
                {vehicle.brand}
              </p>

              <span className="h-px w-10 bg-white/15" />

              <p className="text-[7px] uppercase tracking-[0.4em] text-white/25">
                Private performance collection
              </p>
            </div>

            <h1
              id="vehicle-heading"
              data-reveal
              className="mt-5 max-w-[1300px] text-[16vw] font-medium uppercase leading-[0.75] tracking-[-0.095em] sm:text-[13vw] lg:text-[8vw] xl:text-[7.5rem]"
            >
              {vehicle.model}
            </h1>
          </div>

          {/* =====================================================
              VEHICLE STAGE
          ====================================================== */}

          <div
            data-reveal="mask"
            className="relative my-auto flex min-h-[330px] flex-1 items-center justify-center py-5 md:min-h-[420px]"
          >
            {/* light */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[47%] h-[65%] w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.085),rgba(255,255,255,.018)_42%,transparent_72%)]"
            />

            {/* horizon */}

            <div
              aria-hidden="true"
              className="absolute bottom-[18%] left-[7%] right-[7%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />

            {/* ground shadow */}

            <div
              aria-hidden="true"
              className="absolute bottom-[14%] left-1/2 h-[7%] w-[54%] -translate-x-1/2 rounded-[50%] bg-black/80 blur-2xl"
            />

            <div className="relative h-[47vw] max-h-[650px] min-h-[300px] w-[112%] sm:w-full">
              <Image
                src={vehicle.image}
                alt={`${vehicle.brand} ${vehicle.model}`}
                fill
                priority
                quality={90}
                sizes="(max-width: 768px) 115vw, 92vw"
                className="object-contain drop-shadow-[0_40px_55px_rgba(0,0,0,.7)]"
              />
            </div>

            {/* vehicle annotation */}

            <div className="absolute bottom-[9%] left-0 hidden items-center gap-4 lg:flex">
              <span className="h-px w-12 bg-[#d8ff3e]/60" />

              <p className="text-[7px] uppercase tracking-[0.42em] text-white/30">
                Engineering / Presence / Motion
              </p>
            </div>
          </div>

          {/* =====================================================
              SPECIFICATION CONSOLE
          ====================================================== */}

          <div className="relative z-20 grid border-y border-white/12 lg:grid-cols-[1fr_auto]">
            <dl className="grid grid-cols-3 divide-x divide-white/10">
              <Spec
                value={`${vehicle.horsepower} HP`}
                label="Power"
              />

              <Spec
                value={vehicle.acceleration}
                label="0–100 km/h"
              />

              <Spec
                value={vehicle.transmission}
                label="Transmission"
              />
            </dl>

            <div className="flex flex-col justify-between gap-7 border-t border-white/10 py-6 lg:min-w-[380px] lg:flex-row lg:items-center lg:border-l lg:border-t-0 lg:px-8">
              <div>
                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25">
                  Daily rate
                </p>

                <p className="mt-2 text-3xl tracking-[-0.055em]">
                  ₱
                  {vehicle.pricePerDay.toLocaleString(
                    "en-PH",
                  )}
                </p>

                <p className="mt-1 text-[7px] uppercase tracking-[0.32em] text-white/24">
                  per day
                </p>
              </div>

              <MagneticLink
                href={`/reserve/${vehicle.slug}`}
              >
                Begin reservation

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.3}
                />
              </MagneticLink>
            </div>
          </div>

          {/* =====================================================
              SCROLL CUE
          ====================================================== */}

          <div className="mt-7 flex items-center justify-between">
            <p className="text-[6px] uppercase tracking-[0.42em] text-white/18">
              VELOCE / Machine {vehicleNumber}
            </p>

            <a
              href="#perspective"
              className="group hidden min-h-10 items-center gap-4 text-[7px] uppercase tracking-[0.4em] text-white/25 transition-colors hover:text-white sm:flex"
            >
              Discover the drive

              <ArrowDown
                size={14}
                strokeWidth={1.2}
                className="transition-transform duration-300 group-hover:translate-y-1"
              />
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================
          LIFESTYLE / PERSPECTIVE
      ========================================================== */}

      <section
        id="perspective"
        aria-labelledby="vehicle-perspective"
        className="relative overflow-hidden bg-[#0c0e0d]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-6 top-0 h-full w-px bg-white/[0.025] lg:left-10" />

          <div className="absolute right-6 top-0 h-full w-px bg-white/[0.025] lg:right-10" />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-5 py-24 sm:px-6 md:py-32 lg:px-10 lg:py-40">
          {/* section label */}

          <div
            data-reveal
            className="flex items-center justify-between border-b border-white/10 pb-5"
          >
            <div className="flex items-center gap-4">
              <span className="h-px w-9 bg-[#d8ff3e]" />

              <p className="text-[8px] uppercase tracking-[0.45em] text-white/50">
                A different perspective
              </p>
            </div>

            <p className="hidden text-[7px] uppercase tracking-[0.4em] text-white/22 md:block">
              {vehicle.brand} / {vehicle.category}
            </p>
          </div>

          {/* opening copy */}

          <div className="grid gap-10 pb-16 pt-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:pb-24 lg:pt-20">
            <h2
              id="vehicle-perspective"
              data-reveal
              className="max-w-[1050px] text-[13vw] font-medium uppercase leading-[0.78] tracking-[-0.085em] sm:text-[10vw] lg:text-[6vw] xl:text-[5.7rem]"
            >
              The destination

              <span className="block translate-x-[7%] text-white/27">
                is only half.
              </span>
            </h2>

            <div
              data-reveal
              className="max-w-md lg:justify-self-end"
            >
              <p className="text-xl leading-[1.25] tracking-[-0.04em] text-white/82 md:text-2xl">
                Make room for the drive itself.
              </p>

              <p className="mt-5 text-sm leading-7 text-white/43">
                Choose your dates and preferred handover
                location, then review every detail before
                confirming your reservation.
              </p>
            </div>
          </div>

          {/* cinematic photography */}

          <div className="relative">
            <CinematicImage
              src={`/images/lifestyle/${photograph}.jpg`}
              alt={`${vehicle.brand} ${vehicle.model} photographed in an urban setting`}
              sizes="(max-width: 1024px) 100vw, 88vw"
              className="ml-auto aspect-[4/5] w-full sm:aspect-[16/10] lg:w-[88%] lg:aspect-[16/8.2]"
              imageClassName="object-cover"
            />

            <div className="pointer-events-none absolute inset-0 ml-auto bg-gradient-to-t from-black/45 via-transparent to-black/10 lg:w-[88%]" />

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-6 lg:bottom-8 lg:left-[15%] lg:right-8">
              <div>
                <p className="text-[7px] uppercase tracking-[0.42em] text-white/42">
                  {vehicle.model} / After dark
                </p>

                <p className="mt-3 max-w-lg text-xl tracking-[-0.04em] md:text-3xl">
                  The road is part of the destination.
                </p>
              </div>

              <ArrowUpRight
                aria-hidden="true"
                size={27}
                strokeWidth={1.1}
                className="hidden text-[#d8ff3e] md:block"
              />
            </div>
          </div>

          {/* =====================================================
              FINAL VEHICLE CTA
          ====================================================== */}

          <div className="mt-20 grid gap-12 border-t border-white/10 pt-10 lg:mt-28 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[7px] uppercase tracking-[0.42em] text-white/24">
                Your next drive
              </p>

              <p
                data-reveal
                className="mt-6 max-w-[950px] text-4xl leading-[0.98] tracking-[-0.06em] text-white/88 sm:text-5xl md:text-6xl lg:text-[5rem]"
              >
                This machine.
                <span className="text-white/25">
                  {" "}
                  Your journey.
                </span>
              </p>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row lg:flex-col xl:flex-row">
              <MagneticLink
                href={`/reserve/${vehicle.slug}`}
              >
                Plan your drive

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.3}
                />
              </MagneticLink>

              <Link
                href="/fleet"
                className="group flex min-h-12 items-center justify-between gap-8 border-b border-white/20 text-[8px] uppercase tracking-[0.36em] text-white/45 transition-colors hover:border-white/60 hover:text-white sm:min-w-[200px]"
              >
                The collection

                <ArrowLeft
                  size={15}
                  strokeWidth={1.3}
                  className="transition-transform duration-300 group-hover:-translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Spec({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="min-w-0 px-3 py-6 first:pl-0 sm:px-6 sm:first:pl-0 lg:py-7">
      <dt className="text-[6px] uppercase tracking-[0.35em] text-white/27 sm:text-[7px]">
        {label}
      </dt>

      <dd className="mt-3 truncate text-sm tracking-[-0.03em] text-white/92 sm:text-lg lg:text-xl">
        {value}
      </dd>
    </div>
  );
}