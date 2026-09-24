"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
} from "lucide-react";

import { VehicleTransitionLink } from "@/components/navigation/vehicle-transition-link";
import { vehicles } from "@/data/vehicles";

const categories = [
  "All",
  ...Array.from(
    new Set(vehicles.map((vehicle) => vehicle.category)),
  ),
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function FleetCatalog() {
  const [category, setCategory] = useState("All");
  const reduceMotion = useReducedMotion();

  const filtered = useMemo(() => {
    if (category === "All") {
      return vehicles;
    }

    return vehicles.filter(
      (vehicle) => vehicle.category === category,
    );
  }, [category]);

  return (
    <>
      {/* =========================================================
          COLLECTION OPENING
      ========================================================== */}

      <header className="relative min-h-[82svh] overflow-hidden border-b border-white/10 bg-[#050606]">
        {/* architectural background */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-6 top-0 h-full w-px bg-white/[0.025] lg:left-10" />
          <div className="absolute right-6 top-0 h-full w-px bg-white/[0.025] lg:right-10" />
          <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/[0.018] lg:block" />

          <div className="absolute left-[10%] top-[42%] h-[55vw] w-[80vw] rounded-[50%] bg-white/[0.018] blur-[120px]" />

          <p className="absolute -right-[0.055em] top-[12%] select-none whitespace-nowrap text-[29vw] font-medium uppercase leading-none tracking-[-0.1em] text-white/[0.014]">
            COLLECTION
          </p>
        </div>

        <div className="relative mx-auto flex min-h-[82svh] max-w-[1600px] flex-col px-5 pb-10 pt-32 sm:px-6 lg:px-10 lg:pb-12 lg:pt-36">
          {/* top label */}

          <div
            data-reveal
            className="flex items-center justify-between border-b border-white/10 pb-5"
          >
            <div className="flex items-center gap-4">
              <span className="h-px w-9 bg-[#d8ff3e]" />

              <p className="text-[8px] uppercase tracking-[0.45em] text-white/50">
                01 / The Collection
              </p>
            </div>

            <p className="hidden text-[8px] uppercase tracking-[0.42em] text-white/22 md:block">
              Private performance fleet
            </p>
          </div>

          {/* title */}

          <div className="my-auto grid gap-12 py-20 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
            <div>
              <p
                data-reveal
                className="text-[8px] uppercase tracking-[0.45em] text-white/25"
              >
                Choose without compromise
              </p>

              <h1
                data-reveal
                className="mt-7 text-[17vw] font-medium uppercase leading-[0.74] tracking-[-0.095em] sm:text-[13vw] lg:text-[8.4vw] xl:text-[7.8rem]"
              >
                The

                <span className="block translate-x-[7%] text-white/28">
                  Collection.
                </span>
              </h1>
            </div>

            <div
              data-reveal
              className="max-w-md lg:justify-self-end lg:pb-3"
            >
              <p className="text-xl leading-[1.25] tracking-[-0.04em] text-white/82 md:text-2xl">
                Machines selected for journeys worth remembering.
              </p>

              <p className="mt-5 max-w-sm text-sm leading-7 text-white/40">
                Performance, presence and character. A deliberately
                small collection where every machine earns its place.
              </p>
            </div>
          </div>

          {/* bottom cue */}

          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <p className="text-[7px] uppercase tracking-[0.4em] text-white/20">
              VELOCE / Private Collection
            </p>

            <a
              href="#collection"
              className="group flex min-h-10 items-center gap-4 text-[7px] uppercase tracking-[0.4em] text-white/30 transition-colors hover:text-white"
            >
              Enter the collection

              <ArrowDown
                size={14}
                strokeWidth={1.2}
                className="transition-transform duration-300 group-hover:translate-y-1"
              />
            </a>
          </div>
        </div>
      </header>

      {/* =========================================================
          COLLECTION
      ========================================================== */}

      <section
        id="collection"
        aria-labelledby="fleet-heading"
        className="relative overflow-hidden bg-[#080909]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-6 top-0 h-full w-px bg-white/[0.025] lg:left-10" />
          <div className="absolute right-6 top-0 h-full w-px bg-white/[0.025] lg:right-10" />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-5 py-24 sm:px-6 md:py-28 lg:px-10 lg:py-36">
          {/* =====================================================
              FILTER HEADER
          ====================================================== */}

          <div className="grid gap-10 border-b border-white/10 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-[8px] uppercase tracking-[0.43em] text-white/25">
                Available machines
              </p>

              <h2
                id="fleet-heading"
                className="mt-4 text-4xl font-medium uppercase leading-none tracking-[-0.06em] md:text-5xl"
              >
                Select your drive.
              </h2>
            </div>

            <div
              role="group"
              aria-label="Filter fleet by category"
              className="flex flex-wrap gap-x-8 gap-y-3"
            >
              {categories.map((item) => {
                const selected = category === item;

                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setCategory(item)}
                    className={[
                      "group relative min-h-11 py-2",
                      "text-[8px] uppercase tracking-[0.38em]",
                      "transition-colors duration-300",
                      selected
                        ? "text-white"
                        : "text-white/28 hover:text-white/70",
                    ].join(" ")}
                  >
                    {item}

                    <span
                      aria-hidden="true"
                      className={[
                        "absolute inset-x-0 bottom-0 h-px origin-left bg-[#d8ff3e]",
                        "transition-transform duration-500",
                        selected
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-50",
                      ].join(" ")}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* result information */}

          <div className="flex items-center justify-between py-6">
            <p
              role="status"
              className="text-[7px] uppercase tracking-[0.38em] text-white/22"
            >
              {String(filtered.length).padStart(2, "0")}{" "}
              {filtered.length === 1 ? "machine" : "machines"}
            </p>

            <p className="hidden text-[7px] uppercase tracking-[0.38em] text-white/18 sm:block">
              Performance / Grand Touring
            </p>
          </div>

          {/* =====================================================
              VEHICLES
          ====================================================== */}

          <div>
            <AnimatePresence
              initial={false}
              mode="popLayout"
            >
              {filtered.map((vehicle, filteredIndex) => {
                const originalIndex = vehicles.findIndex(
                  (item) => item.slug === vehicle.slug,
                );

                const number = String(
                  originalIndex + 1,
                ).padStart(2, "0");

                const reversed = filteredIndex % 2 === 1;

                return (
                  <motion.article
                    key={vehicle.slug}
                    layout
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 35,
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: reduceMotion ? 0 : 20,
                    }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.65,
                      delay: reduceMotion
                        ? 0
                        : filteredIndex * 0.05,
                      ease: EASE,
                    }}
                    className="relative border-b border-white/10 py-20 md:py-24 lg:min-h-[820px] lg:py-28"
                  >
                    {/* giant brand */}

                    <p
                      aria-hidden="true"
                      className={[
                        "pointer-events-none absolute top-[17%]",
                        "select-none whitespace-nowrap",
                        "text-[21vw] font-medium uppercase leading-none tracking-[-0.1em]",
                        "text-white/[0.018]",
                        reversed
                          ? "-left-[2%]"
                          : "-right-[2%]",
                      ].join(" ")}
                    >
                      {vehicle.brand}
                    </p>

                    <div
                      className={[
                        "relative grid gap-12 lg:min-h-[600px]",
                        "lg:grid-cols-[0.66fr_1.34fr] lg:items-center lg:gap-10",
                        reversed ? "lg:grid-cols-[1.34fr_.66fr]" : "",
                      ].join(" ")}
                    >
                      {/* ===========================================
                          IDENTITY / DETAILS
                      ============================================ */}

                      <div
                        className={[
                          "relative z-20",
                          reversed
                            ? "lg:order-2 lg:pl-12"
                            : "lg:pr-10",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-[8px] tabular-nums tracking-[0.4em] text-[#d8ff3e]">
                            {number}
                          </span>

                          <span className="h-px w-10 bg-white/15" />

                          <span className="text-[7px] uppercase tracking-[0.4em] text-white/25">
                            {vehicle.category}
                          </span>
                        </div>

                        <p className="mt-10 text-[8px] uppercase tracking-[0.45em] text-white/35">
                          {vehicle.brand}
                        </p>

                        <h3 className="mt-4 max-w-[560px] text-[13vw] font-medium uppercase leading-[0.79] tracking-[-0.09em] sm:text-[10vw] lg:text-[5.4vw] xl:text-[5rem]">
                          {vehicle.model}
                        </h3>

                        {/* specs */}

                        <dl className="mt-10 grid max-w-lg grid-cols-3 divide-x divide-white/10 border-y border-white/10">
                          <Spec
                            label="Power"
                            value={`${vehicle.horsepower} HP`}
                          />

                          <Spec
                            label="0–100"
                            value={vehicle.acceleration}
                          />

                          <Spec
                            label="Transmission"
                            value={vehicle.transmission}
                          />
                        </dl>

                        {/* price */}

                        <div className="mt-8 flex flex-wrap items-end justify-between gap-8 lg:block">
                          <div>
                            <p className="text-[7px] uppercase tracking-[0.4em] text-white/24">
                              Daily rate
                            </p>

                            <p className="mt-2 text-3xl tracking-[-0.05em]">
                              ₱
                              {vehicle.pricePerDay.toLocaleString(
                                "en-PH",
                              )}
                            </p>

                            <p className="mt-1 text-[7px] uppercase tracking-[0.34em] text-white/22">
                              per day
                            </p>
                          </div>

                          <VehicleTransitionLink
                            href={`/fleet/${vehicle.slug}`}
                            className="group mt-8 inline-flex min-h-12 min-w-[230px] items-center justify-between gap-8 border-b border-white/20 text-[8px] uppercase tracking-[0.34em] text-white/60 transition-colors hover:border-[#d8ff3e] hover:text-white"
                          >
                            Discover vehicle

                            <ArrowUpRight
                              size={16}
                              strokeWidth={1.25}
                              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                          </VehicleTransitionLink>
                        </div>
                      </div>

                      {/* ===========================================
                          CAR STAGE
                      ============================================ */}

                      <VehicleTransitionLink
                        href={`/fleet/${vehicle.slug}`}
                        aria-label={`Discover ${vehicle.brand} ${vehicle.model}`}
                        data-cursor="Discover"
                        className={[
                          "group relative block",
                          "min-h-[340px] sm:min-h-[430px] lg:min-h-[600px]",
                          reversed ? "lg:order-1" : "",
                        ].join(" ")}
                      >
                        {/* studio illumination */}

                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute left-1/2 top-1/2 h-[68%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.085),rgba(255,255,255,.018)_45%,transparent_72%)]"
                        />

                        {/* subtle lime atmospheric edge */}

                        <div
                          aria-hidden="true"
                          className={[
                            "pointer-events-none absolute top-[20%] h-[45%] w-[30%] blur-[90px]",
                            "bg-[#d8ff3e]/[0.025]",
                            reversed ? "left-[8%]" : "right-[8%]",
                          ].join(" ")}
                        />

                        {/* horizon */}

                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute bottom-[21%] left-[4%] right-[4%] h-px bg-gradient-to-r from-transparent via-white/12 to-transparent"
                        />

                        {/* grounding */}

                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute bottom-[17%] left-1/2 h-[7%] w-[58%] -translate-x-1/2 rounded-[50%] bg-black/80 blur-2xl"
                        />

                        {/* car */}

                        <motion.div
                          whileHover={
                            reduceMotion
                              ? undefined
                              : {
                                  scale: 1.025,
                                  y: -7,
                              }
                          }
                          transition={{
                            duration: 0.7,
                            ease: EASE,
                          }}
                          className="absolute inset-[-5%] sm:inset-[-8%] lg:inset-[-9%]"
                        >
                          <Image
                            src={vehicle.image}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            fill
                            quality={90}
                            sizes="(max-width: 768px) 110vw, (max-width: 1280px) 70vw, 65vw"
                            className="object-contain drop-shadow-[0_42px_55px_rgba(0,0,0,.68)]"
                          />
                        </motion.div>

                        {/* image interaction cue */}

                        <div
                          className={[
                            "pointer-events-none absolute bottom-[7%]",
                            "hidden items-center gap-4 opacity-0",
                            "transition-opacity duration-500 group-hover:opacity-100 md:flex",
                            reversed ? "left-5" : "right-5",
                          ].join(" ")}
                        >
                          <span className="h-px w-10 bg-[#d8ff3e]" />

                          <p className="text-[7px] uppercase tracking-[0.42em] text-white/40">
                            Enter the machine
                          </p>
                        </div>
                      </VehicleTransitionLink>
                    </div>

                    {/* editorial footer */}

                    <div className="mt-10 flex items-center justify-between border-t border-white/[0.06] pt-5 lg:mt-4">
                      <p className="text-[6px] uppercase tracking-[0.42em] text-white/16">
                        VELOCE / Machine {number}
                      </p>

                      <p className="hidden text-[6px] uppercase tracking-[0.42em] text-white/16 sm:block">
                        {vehicle.brand} / {vehicle.category}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="py-28 text-center">
                <p className="text-[8px] uppercase tracking-[0.4em] text-white/30">
                  No machines available
                </p>
              </div>
            )}
          </div>

          {/* =====================================================
              COLLECTION END
          ====================================================== */}

          <div className="grid gap-12 pt-24 lg:grid-cols-[0.48fr_1.52fr] lg:items-end lg:pt-36">
            <div>
              <p className="text-[7px] uppercase tracking-[0.45em] text-white/22">
                VELOCE / The Collection
              </p>
            </div>

            <div>
              <p
                data-reveal
                className="max-w-[1000px] text-4xl leading-[0.96] tracking-[-0.065em] text-white/88 sm:text-5xl md:text-6xl lg:text-[5.2rem]"
              >
                Three machines.
                <span className="text-white/25">
                  {" "}
                  Three different reasons to take the long way.
                </span>
              </p>

              <div
                data-reveal
                className="mt-10 flex items-center gap-4"
              >
                <span className="h-px w-14 bg-[#d8ff3e]/70" />

                <p className="text-[7px] uppercase tracking-[0.4em] text-white/25">
                  Choose yours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
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
    <div className="min-w-0 px-3 py-6 first:pl-0 sm:px-5 sm:first:pl-0">
      <dt className="text-[6px] uppercase tracking-[0.34em] text-white/25 sm:text-[7px]">
        {label}
      </dt>

      <dd className="mt-3 truncate text-xs tracking-[-0.02em] text-white/72 sm:text-sm">
        {value}
      </dd>
    </div>
  );
}