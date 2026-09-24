"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

import { useMotionAllowed } from "@/components/motion/motion-preference";

const steps = [
  {
    number: "01",
    meta: "The machine",
    title: "Choose.",
    text:
      "Enter the collection and select the machine that fits the drive you have in mind.",
    footnote: "Collection / Vehicle",
  },
  {
    number: "02",
    meta: "The schedule",
    title: "Set the moment.",
    text:
      "Choose the location, pickup date, return date and timing that shape the reservation.",
    footnote: "Location / Date / Time",
  },
  {
    number: "03",
    meta: "The driver",
    title: "Add the essentials.",
    text:
      "Continue with the driver details and reservation information needed for the journey.",
    footnote: "Driver / Details",
  },
  {
    number: "04",
    meta: "The review",
    title: "Make it clear.",
    text:
      "Review the vehicle, schedule, driver information and estimated reservation summary before confirming.",
    footnote: "Review / Confirm",
  },
];

export function HowItWorks() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const [mounted, setMounted] =
    useState(false);

  const motionAllowed =
    useMotionAllowed();

  useEffect(() => {
    setMounted(true);
  }, []);

  const animate =
    mounted &&
    motionAllowed;

  const {
    scrollYProgress,
  } = useScroll({
    target: sectionRef,
    offset: [
      "start 70%",
      "end 70%",
    ],
  });

  const progress =
    useSpring(
      scrollYProgress,
      {
        stiffness: 48,
        damping: 28,
        mass: 0.95,
        restDelta:
          0.0001,
      },
    );

  const lineScale =
    useTransform(
      progress,
      [0, 0.94],
      [0, 1],
    );

  const wordX =
    useTransform(
      progress,
      [0, 1],
      [
        "8%",
        "-16%",
      ],
    );

  const wordOpacity =
    useTransform(
      progress,
      [
        0,
        0.2,
        0.78,
        1,
      ],
      [
        0.008,
        0.032,
        0.024,
        0.006,
      ],
    );

  return (
    <section
      ref={sectionRef}
      id="journey"
      aria-labelledby="journey-heading"
      className="campaign-journey relative overflow-clip bg-[#070808] text-white"
    >
      {/* =====================================================
          ARCHITECTURAL BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-6 top-0 h-full w-px bg-white/[0.022] lg:left-10" />

        <div className="absolute right-6 top-0 h-full w-px bg-white/[0.022] lg:right-10" />

        <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/[0.014] lg:block" />

        <div className="absolute left-[25%] top-0 hidden h-full w-px bg-white/[0.008] xl:block" />

        <div className="absolute right-[25%] top-0 hidden h-full w-px bg-white/[0.008] xl:block" />

        <motion.p
          initial={false}
          style={
            animate
              ? {
                  x: wordX,
                  opacity:
                    wordOpacity,
                }
              : {
                  opacity:
                    0.012,
                }
          }
          className="absolute left-0 top-[12%] select-none whitespace-nowrap text-[28vw] font-medium uppercase leading-none tracking-[-0.105em] text-white"
        >
          JOURNEY
        </motion.p>

        <div className="absolute left-1/2 top-[52%] h-[34rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.015] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1650px] px-5 py-24 sm:px-6 md:py-32 lg:px-10 lg:py-40">
        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div
          data-reveal
          className="flex items-center justify-between gap-6 border-b border-white/10 pb-5"
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-9 bg-[#d8ff3e]" />

            <p className="text-[8px] uppercase tracking-[0.45em] text-white/50">
              05 / Your Journey
            </p>
          </div>

          <p className="hidden text-[8px] uppercase tracking-[0.42em] text-white/22 md:block">
            Select / Schedule / Driver / Review
          </p>
        </div>

        {/* =====================================================
            MAIN JOURNEY
        ====================================================== */}

        <div className="grid gap-20 pt-16 lg:grid-cols-[.74fr_1.26fr] lg:gap-24 lg:pt-24 xl:gap-32">
          {/* =================================================
              STICKY INTRO
          ================================================== */}

          <div>
            <div className="lg:sticky lg:top-28">
              <p
                data-reveal
                className="text-[7px] uppercase tracking-[0.46em] text-white/24"
              >
                From choice to confirmation
              </p>

              <h2
                id="journey-heading"
                data-reveal
                className="mt-8 text-[15vw] font-medium uppercase leading-[0.75] tracking-[-0.09em] sm:text-[11vw] lg:text-[6vw] xl:text-[5.6rem]"
              >
                Four
                <br />
                moments.

                <span className="mt-2 block translate-x-[7%] text-white/24">
                  One flow.
                </span>
              </h2>

              <p
                data-reveal
                className="mt-10 max-w-sm text-sm leading-7 text-white/42"
              >
                The reservation should feel as considered as the machine.
                Nothing unnecessary. Just the information needed to move
                from selection to confirmation.
              </p>

              <Link
                href="/#reserve"
                className="group mt-11 inline-flex min-h-12 items-center gap-8 border-b border-white/20 text-[7px] uppercase tracking-[0.38em] text-white/55 transition-colors duration-300 hover:border-[#d8ff3e] hover:text-white"
              >
                Begin reservation

                <ArrowUpRight
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.1}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <div
                data-reveal
                className="mt-16 hidden items-center gap-4 lg:flex"
              >
                <span className="h-[5px] w-[5px] rounded-full bg-[#d8ff3e]" />

                <p className="text-[6px] uppercase tracking-[0.42em] text-white/22">
                  VELOCE / Reservation Sequence
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              JOURNEY TRACK
          ================================================== */}

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-[17px] top-0 w-px bg-white/[0.09] md:left-[25px]"
            />

            <motion.div
              aria-hidden="true"
              style={{
                scaleY:
                  animate
                    ? lineScale
                    : 1,
              }}
              className="absolute bottom-0 left-[17px] top-0 z-10 w-px origin-top bg-[#d8ff3e] md:left-[25px]"
            />

            <ol className="relative">
              {steps.map(
                (
                  step,
                  index,
                ) => (
                  <JourneyStep
                    key={
                      step.number
                    }
                    progress={
                      progress
                    }
                    index={
                      index
                    }
                    animate={
                      animate
                    }
                    {...step}
                  />
                ),
              )}
            </ol>
          </div>
        </div>

        {/* =====================================================
            CLOSING MOMENT
        ====================================================== */}

        <div className="mt-24 border-t border-white/10 pt-12 lg:mt-36 lg:pt-16">
          <div className="grid gap-12 md:grid-cols-[.45fr_1.55fr] md:items-end">
            <div>
              <p className="text-[7px] uppercase tracking-[0.45em] text-white/20">
                VELOCE / Confirmation
              </p>

              <p className="mt-5 text-[6px] uppercase leading-5 tracking-[0.38em] text-white/14">
                Machine
                <br />
                Schedule
                <br />
                Driver
                <br />
                Review
              </p>
            </div>

            <div className="md:text-right">
              <p
                data-reveal
                className="ml-auto max-w-[980px] text-4xl leading-[0.93] tracking-[-0.067em] text-white/90 sm:text-5xl md:text-6xl lg:text-[5.2rem]"
              >
                Everything before the road

                <span className="text-white/23">
                  {" "}
                  should feel effortless.
                </span>
              </p>

              <div
                data-reveal
                className="mt-9 flex items-center gap-4 md:justify-end"
              >
                <p className="text-[7px] uppercase tracking-[0.42em] text-white/24">
                  Then let the machine speak
                </p>

                <ArrowDownRight
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.1}
                  className="text-[#d8ff3e]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            PORTFOLIO DISCLOSURE
        ====================================================== */}

        <div className="mt-16 flex items-center justify-between border-t border-white/[0.06] pt-5">
          <p className="text-[6px] uppercase tracking-[0.42em] text-white/14">
            VELOCE / Portfolio Concept
          </p>

          <p className="hidden text-[6px] uppercase tracking-[0.42em] text-white/14 sm:block">
            No live payment processed
          </p>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   JOURNEY STEP
========================================================= */

function JourneyStep({
  progress,
  index,
  number,
  meta,
  title,
  text,
  footnote,
  animate,
}: {
  progress:
    MotionValue<number>;
  index: number;
  number: string;
  meta: string;
  title: string;
  text: string;
  footnote: string;
  animate: boolean;
}) {
  const total =
    steps.length;

  const start =
    index / total;

  const focus =
    (
      index +
      0.72
    ) /
    total;

  const end =
    Math.min(
      1,
      (
        index +
        1.15
      ) /
        total,
    );

  const opacity =
    useTransform(
      progress,
      [
        Math.max(
          0,
          start -
            0.08,
        ),
        focus,
        end,
      ],
      [
        index === 0
          ? 1
          : 0.2,
        1,
        index ===
        total - 1
          ? 1
          : 0.42,
      ],
    );

  const x =
    useTransform(
      progress,
      [
        Math.max(
          0,
          start -
            0.08,
        ),
        focus,
      ],
      [
        26,
        0,
      ],
    );

  const dotScale =
    useTransform(
      progress,
      [
        Math.max(
          0,
          start -
            0.04,
        ),
        focus,
      ],
      [
        0.7,
        1,
      ],
    );

  const numberOpacity =
    useTransform(
      progress,
      [
        Math.max(
          0,
          start -
            0.08,
        ),
        focus,
        end,
      ],
      [
        0.015,
        0.055,
        0.02,
      ],
    );

  return (
    <li className="relative grid min-h-[42svh] grid-cols-[36px_1fr] gap-7 border-b border-white/10 py-14 first:pt-0 md:min-h-[48svh] md:grid-cols-[52px_1fr] md:gap-10 md:py-20 lg:min-h-[62svh]">
      {/* =====================================================
          NODE
      ====================================================== */}

      <div className="relative z-20 flex justify-center">
        <motion.span
          aria-hidden="true"
          style={
            animate
              ? {
                  scale:
                    dotScale,
                }
              : undefined
          }
          className="mt-2 flex h-3 w-3 items-center justify-center rounded-full border border-[#d8ff3e]/70 bg-[#070808] md:h-4 md:w-4"
        >
          <span className="h-[3px] w-[3px] rounded-full bg-[#d8ff3e]" />
        </motion.span>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <motion.div
        style={
          animate
            ? {
                opacity,
                x,
              }
            : undefined
        }
        className="relative flex flex-col justify-center"
      >
        {/* huge ghost number */}

        <motion.span
          aria-hidden="true"
          style={
            animate
              ? {
                  opacity:
                    numberOpacity,
                }
              : {
                  opacity:
                    0.025,
                }
          }
          className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[10rem] font-medium leading-none tracking-[-0.09em] text-white md:text-[14rem] xl:text-[17rem]"
        >
          {number}
        </motion.span>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="text-[8px] uppercase tracking-[0.42em] text-[#d8ff3e]">
              {number}
            </p>

            <span className="h-px w-8 bg-white/12" />

            <p className="text-[7px] uppercase tracking-[0.4em] text-white/24">
              {meta}
            </p>
          </div>

          <h3 className="mt-7 max-w-[720px] text-[clamp(2.8rem,5vw,5.5rem)] font-medium leading-[0.88] tracking-[-0.072em] text-white/95">
            {title}
          </h3>

          <p className="mt-7 max-w-md text-sm leading-7 text-white/45">
            {text}
          </p>

          <div className="mt-10 flex items-center gap-4">
            <span className="h-px w-10 bg-white/12" />

            <p className="text-[6px] uppercase tracking-[0.4em] text-white/17">
              {footnote}
            </p>
          </div>
        </div>
      </motion.div>
    </li>
  );
}