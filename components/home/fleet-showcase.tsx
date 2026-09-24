"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import { VehicleTransitionLink } from "@/components/navigation/vehicle-transition-link";
import { vehicles } from "@/data/vehicles";

const EASE = [0.16, 1, 0.3, 1] as const;

export function FleetShowcase() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const reduceMotion = useReducedMotion();

  const vehicle = vehicles[index] ?? vehicles[0];

  if (!vehicle) {
    return null;
  }

  function move(nextDirection: number) {
    setDirection(nextDirection);

    setIndex((current) => {
      return (
        (current + nextDirection + vehicles.length) %
        vehicles.length
      );
    });
  }

  function selectVehicle(nextIndex: number) {
    if (nextIndex === index) {
      return;
    }

    /*
     * When jumping from the final car back to the first
     * through the selector, keep the transition intuitive.
     */
    setDirection(nextIndex > index ? 1 : -1);
    setIndex(nextIndex);
  }

  const currentNumber = String(index + 1).padStart(2, "0");
  const totalNumber = String(vehicles.length).padStart(2, "0");

  return (
    <section
      id="fleet"
      aria-label="Featured VELOCE collection"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(event) => {
        if (
          (event.target as HTMLElement).closest(
            "input, select, textarea, button, a",
          )
        ) {
          return;
        }

        if (event.key === "ArrowRight") {
          event.preventDefault();
          move(1);
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        }
      }}
      className="campaign-fleet relative overflow-hidden bg-[#080909] text-white"
    >
      {/* =========================================================
          ARCHITECTURAL ENVIRONMENT
      ========================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-6 top-0 h-full w-px bg-white/[0.025] lg:left-10" />

        <div className="absolute right-6 top-0 h-full w-px bg-white/[0.025] lg:right-10" />

        <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/[0.016] lg:block" />

        <div className="absolute inset-x-0 top-[48%] h-px bg-white/[0.025]" />

        {/* showroom atmosphere */}
        <div className="absolute left-1/2 top-[50%] h-[55vw] max-h-[820px] w-[90vw] max-w-[1450px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-white/[0.018] blur-[100px]" />

        {/* restrained VELOCE lime atmosphere */}
        <div className="absolute left-[65%] top-[52%] h-[24rem] w-[24rem] -translate-y-1/2 rounded-full bg-[#d8ff3e]/[0.018] blur-[140px]" />
      </div>

      {/* =========================================================
          GIANT VEHICLE BRAND
      ========================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[34%] z-0 -translate-x-1/2"
      >
        <AnimatePresence
          mode="popLayout"
          initial={false}
        >
          <motion.p
            key={vehicle.brand}
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    x: direction * 100,
                  }
            }
            animate={{
              opacity: 0.03,
              x: 0,
            }}
            exit={
              reduceMotion
                ? {
                    opacity: 0,
                  }
                : {
                    opacity: 0,
                    x: direction * -80,
                  }
            }
            transition={{
              duration: reduceMotion ? 0 : 0.9,
              ease: EASE,
            }}
            className="select-none whitespace-nowrap text-[25vw] font-medium uppercase leading-none tracking-[-0.105em] text-white"
          >
            {vehicle.brand}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 py-24 sm:px-6 md:py-28 lg:px-10 lg:py-36">
        {/* =========================================================
            HEADER
        ========================================================== */}

        <div
          data-reveal
          className="flex items-center justify-between gap-6 border-b border-white/10 pb-5"
        >
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="h-px w-9 bg-[#d8ff3e]"
            />

            <p className="text-[8px] uppercase tracking-[0.45em] text-white/50">
              01 / The Collection
            </p>
          </div>

          <Link
            href="/fleet"
            className="group flex min-h-11 items-center gap-3 text-[8px] uppercase tracking-[0.36em] text-white/38 transition-colors duration-300 hover:text-white"
          >
            Complete collection

            <ArrowUpRight
              size={14}
              strokeWidth={1.3}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* =========================================================
            VEHICLE IDENTITY
        ========================================================== */}

        <div className="relative mt-12 md:mt-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div
              aria-live="polite"
              aria-atomic="true"
              className="relative z-20"
            >
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                <motion.div
                  key={vehicle.id}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: 28,
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={
                    reduceMotion
                      ? {
                          opacity: 0,
                        }
                      : {
                          opacity: 0,
                          y: -18,
                        }
                  }
                  transition={{
                    duration: reduceMotion ? 0 : 0.55,
                    ease: EASE,
                  }}
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <p className="text-[8px] uppercase tracking-[0.45em] text-[#d8ff3e]">
                      {vehicle.brand}
                    </p>

                    <span className="h-px w-10 bg-white/14" />

                    <p className="text-[7px] uppercase tracking-[0.4em] text-white/27">
                      {vehicle.category}
                    </p>
                  </div>

                  <h2 className="mt-5 max-w-[1080px] text-[15vw] font-medium uppercase leading-[0.75] tracking-[-0.095em] sm:text-[12vw] md:text-[10vw] lg:text-[7.2vw] xl:text-[6.9rem]">
                    {vehicle.model}
                  </h2>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="hidden pb-2 text-right lg:block">
              <p className="text-[7px] uppercase tracking-[0.42em] text-white/22">
                Selected machine
              </p>

              <p className="mt-2 text-4xl font-light tracking-[-0.06em] text-white/65 tabular-nums">
                {currentNumber}

                <span className="ml-2 text-lg text-white/20">
                  / {totalNumber}
                </span>
              </p>
            </div>
          </div>

          {/* =====================================================
              PRIVATE SHOWROOM STAGE
          ====================================================== */}

          <VehicleTransitionLink
            href={`/fleet/${vehicle.slug}`}
            aria-label={`Discover ${vehicle.brand} ${vehicle.model}`}
            data-cursor="Discover"
            className="group relative mt-1 block h-[52vw] min-h-[330px] max-h-[710px] w-full overflow-visible"
          >
            {/* overhead studio bloom */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[45%] h-[70%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.095),rgba(255,255,255,.025)_42%,transparent_72%)]"
            />

            {/* soft roof light */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[18%] h-px w-[42%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent blur-[1px]"
            />

            {/* horizon */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[6%] right-[6%] top-[73%] h-px bg-gradient-to-r from-transparent via-white/11 to-transparent"
            />

            {/* floor shadow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[12%] left-1/2 h-[7%] w-[57%] -translate-x-1/2 rounded-[50%] bg-black/80 blur-2xl"
            />

            {/* floor reflection */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[10%] left-1/2 h-[1px] w-[48%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/8 to-transparent"
            />

            <AnimatePresence
              initial={false}
              mode="sync"
              custom={direction}
            >
              <motion.div
                key={vehicle.id}
                custom={direction}
                variants={{
                  enter: (d: number) => ({
                    opacity: 0,
                    x: d * 190,
                    scale: 0.92,
                  }),

                  center: {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                  },

                  exit: (d: number) => ({
                    opacity: 0,
                    x: d * -150,
                    scale: 1.045,
                  }),
                }}
                initial={
                  reduceMotion
                    ? false
                    : "enter"
                }
                animate="center"
                exit={
                  reduceMotion
                    ? {
                        opacity: 0,
                      }
                    : "exit"
                }
                transition={{
                  duration: reduceMotion ? 0 : 0.82,
                  ease: EASE,
                }}
                className="absolute inset-[-4%] sm:inset-[-6%] lg:inset-[-9%]"
              >
                <motion.div
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          scale: 1.018,
                          y: -5,
                        }
                  }
                  transition={{
                    duration: 0.65,
                    ease: EASE,
                  }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={vehicle.image}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    fill
                    priority={index === 0}
                    quality={90}
                    sizes="(max-width: 768px) 115vw, (max-width: 1280px) 95vw, 90vw"
                    className="object-contain drop-shadow-[0_40px_48px_rgba(0,0,0,.7)]"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* discover cue */}

            <div className="pointer-events-none absolute bottom-[5%] right-0 hidden items-center gap-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:flex">
              <span className="h-px w-10 bg-[#d8ff3e]" />

              <p className="text-[7px] uppercase tracking-[0.42em] text-white/42">
                Enter the machine
              </p>

              <ArrowUpRight
                size={16}
                strokeWidth={1.2}
                className="text-[#d8ff3e]"
              />
            </div>
          </VehicleTransitionLink>

          {/* =====================================================
              MACHINE DATA
          ====================================================== */}

          <div className="relative z-20 -mt-3 grid border-y border-white/12 md:grid-cols-[1fr_auto] md:items-stretch">
            <div className="grid grid-cols-3 divide-x divide-white/10">
              <Spec
                label="Power"
                value={`${vehicle.horsepower} HP`}
              />

              <Spec
                label="0–100 km/h"
                value={vehicle.acceleration}
              />

              <Spec
                label="Transmission"
                value={vehicle.transmission}
              />
            </div>

            <div className="flex min-w-0 items-end justify-between gap-8 border-t border-white/10 py-6 md:min-w-[260px] md:border-l md:border-t-0 md:px-8">
              <div>
                <p className="text-[7px] uppercase tracking-[0.4em] text-white/24">
                  Daily rate
                </p>

                <p className="mt-2 text-2xl tracking-[-0.055em] md:text-3xl">
                  ₱
                  {vehicle.pricePerDay.toLocaleString(
                    "en-PH",
                  )}
                </p>

                <p className="mt-1 text-[7px] uppercase tracking-[0.32em] text-white/26">
                  per day
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            COLLECTION CONTROLS
        ========================================================== */}

        <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div
            role="tablist"
            aria-label="Select featured vehicle"
            className="flex flex-wrap items-center gap-x-8 gap-y-3"
          >
            {vehicles.map((item, itemIndex) => {
              const selected = itemIndex === index;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={`Show ${item.brand} ${item.model}`}
                  onClick={() =>
                    selectVehicle(itemIndex)
                  }
                  className={[
                    "group relative min-h-11 py-2",
                    "text-left text-[8px] uppercase tracking-[0.4em]",
                    "transition-colors duration-300",
                    selected
                      ? "text-white"
                      : "text-white/26 hover:text-white/65",
                  ].join(" ")}
                >
                  {item.brand}

                  <span
                    aria-hidden="true"
                    className={[
                      "absolute bottom-0 left-0 h-px bg-[#d8ff3e]",
                      "transition-[width] duration-500",
                      selected
                        ? "w-full"
                        : "w-0 group-hover:w-1/2",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous vehicle"
                onClick={() => move(-1)}
                className="group flex h-12 w-12 items-center justify-center border border-white/18 text-white/55 transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
              >
                <ArrowLeft
                  size={17}
                  strokeWidth={1.3}
                  className="transition-transform duration-300 group-hover:-translate-x-0.5"
                />
              </button>

              <p className="min-w-[64px] text-center text-[8px] uppercase tracking-[0.34em] text-white/34 tabular-nums">
                {currentNumber} / {totalNumber}
              </p>

              <button
                type="button"
                aria-label="Next vehicle"
                onClick={() => move(1)}
                className="group flex h-12 w-12 items-center justify-center border border-white/18 text-white/55 transition-all duration-300 hover:border-white hover:bg-white hover:text-black"
              >
                <ArrowRight
                  size={17}
                  strokeWidth={1.3}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />
              </button>
            </div>

            <VehicleTransitionLink
              href={`/fleet/${vehicle.slug}`}
              className="group flex min-h-12 items-center justify-between gap-8 border-b border-white/25 px-1 text-[8px] uppercase tracking-[0.34em] text-white/72 transition-colors duration-300 hover:border-[#d8ff3e] hover:text-white md:min-w-[230px]"
            >
              Discover vehicle

              <ArrowUpRight
                size={16}
                strokeWidth={1.3}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </VehicleTransitionLink>
          </div>
        </div>

        {/* =========================================================
            COLLECTION CLOSING
        ========================================================== */}

        <div className="mt-16 flex items-center justify-between border-t border-white/[0.07] pt-5">
          <p className="text-[7px] uppercase tracking-[0.42em] text-white/18">
            VELOCE / Private Performance Collection
          </p>

          <Link
            href="/fleet"
            className="hidden text-[7px] uppercase tracking-[0.4em] text-white/24 transition-colors hover:text-[#d8ff3e] sm:block"
          >
            View complete collection
          </Link>
        </div>
      </div>
    </section>
  );
}

function Spec({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 px-3 py-6 first:pl-0 sm:px-6 sm:first:pl-0">
      <p className="text-[6px] uppercase tracking-[0.34em] text-white/26 sm:text-[7px]">
        {label}
      </p>

      <p className="mt-3 truncate text-sm tracking-[-0.03em] text-white/92 sm:text-lg">
        {value}
      </p>
    </div>
  );
}