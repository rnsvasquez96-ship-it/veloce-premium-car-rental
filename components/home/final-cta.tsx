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
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import { MagneticLink } from "@/components/motion/magnetic-link";
import { useMotionAllowed } from "@/components/motion/motion-preference";

export function FinalCTA() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const [
    mounted,
    setMounted,
  ] = useState(false);

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
      "start end",
      "end start",
    ],
  });

  const progress =
    useSpring(
      scrollYProgress,
      {
        stiffness: 42,
        damping: 28,
        mass: 0.95,
        restDelta:
          0.0001,
      },
    );

  /* =========================================================
     CAMPAIGN TITLE
  ========================================================= */

  const leaveX =
    useTransform(
      progress,
      [
        0.08,
        0.48,
        0.92,
      ],
      [
        "-5%",
        "0%",
        "2%",
      ],
    );

  const ordinaryX =
    useTransform(
      progress,
      [
        0.08,
        0.48,
        0.92,
      ],
      [
        "8%",
        "3%",
        "-2%",
      ],
    );

  const titleOpacity =
    useTransform(
      progress,
      [
        0,
        0.2,
        0.82,
        1,
      ],
      [
        0.28,
        1,
        1,
        0.62,
      ],
    );

  /* =========================================================
     VELOCE WORDMARK
  ========================================================= */

  const wordmarkX =
    useTransform(
      progress,
      [0, 1],
      [
        "8%",
        "-14%",
      ],
    );

  const wordmarkOpacity =
    useTransform(
      progress,
      [
        0,
        0.28,
        0.78,
        1,
      ],
      [
        0.008,
        0.03,
        0.025,
        0.006,
      ],
    );

  /* =========================================================
     LIGHT
  ========================================================= */

  const lightX =
    useTransform(
      progress,
      [0, 1],
      [
        "-14%",
        "12%",
      ],
    );

  const lightOpacity =
    useTransform(
      progress,
      [
        0,
        0.28,
        0.8,
        1,
      ],
      [
        0.08,
        0.38,
        0.3,
        0.06,
      ],
    );

  const lightScale =
    useTransform(
      progress,
      [0, 1],
      [
        0.86,
        1.08,
      ],
    );

  /* =========================================================
     ACCENT
  ========================================================= */

  const lineScale =
    useTransform(
      progress,
      [
        0.12,
        0.52,
      ],
      [
        0,
        1,
      ],
    );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="next-drive-heading"
      className="campaign-finale relative isolate min-h-[100svh] overflow-clip bg-[#050505] text-white"
    >
      {/* =====================================================
          VOID
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 bg-[#050505]"
      />

      {/* =====================================================
          ARCHITECTURAL LIGHT
      ====================================================== */}

      <motion.div
        aria-hidden="true"
        initial={false}
        style={
          animate
            ? {
                x: lightX,
                opacity:
                  lightOpacity,
                scale:
                  lightScale,
              }
            : {
                opacity: 0.22,
              }
        }
        className="pointer-events-none absolute -top-[15%] left-[43%] -z-20 h-[125%] w-[32vw] min-w-[280px] rotate-[13deg]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.015)_18%,rgba(255,255,255,.09)_48%,rgba(255,255,255,.018)_74%,transparent_100%)] blur-[18px]" />

        <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
      </motion.div>

      {/* =====================================================
          HORIZON GLOW
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[57%] -z-20 h-[24rem] w-[85rem] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.055)_0%,rgba(255,255,255,.015)_38%,transparent_70%)] blur-2xl"
      />

      {/* =====================================================
          GIANT VELOCE
      ====================================================== */}

      <motion.p
        aria-hidden="true"
        initial={false}
        style={
          animate
            ? {
                x: wordmarkX,
                opacity:
                  wordmarkOpacity,
              }
            : {
                opacity:
                  0.012,
              }
        }
        className="pointer-events-none absolute left-0 top-[13%] -z-10 select-none whitespace-nowrap text-[29vw] font-medium uppercase leading-none tracking-[-0.105em] text-white"
      >
        VELOCE
      </motion.p>

      {/* =====================================================
          ARCHITECTURAL GRID
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-6 top-0 h-full w-px bg-white/[0.028] lg:left-10" />

        <div className="absolute right-6 top-0 h-full w-px bg-white/[0.028] lg:right-10" />

        <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/[0.013] lg:block" />

        <div className="absolute left-[25%] top-0 hidden h-full w-px bg-white/[0.008] xl:block" />

        <div className="absolute right-[25%] top-0 hidden h-full w-px bg-white/[0.008] xl:block" />

        <div className="absolute left-0 right-0 top-[58%] h-px bg-gradient-to-r from-transparent via-white/[0.045] to-transparent" />
      </div>

      {/* =====================================================
          EDGE GRADING
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28vh] bg-gradient-to-b from-[#050505] via-[#050505]/55 to-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[26vh] bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent"
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1650px] flex-col px-5 pb-8 pt-24 sm:px-6 md:pt-28 lg:px-10 lg:pb-10 lg:pt-32">
        {/* ===================================================
            TOP META
        ==================================================== */}

        <div
          data-reveal
          className="flex items-center justify-between gap-6 border-b border-white/10 pb-5"
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-9 bg-[#d8ff3e]" />

            <p className="text-[8px] uppercase tracking-[0.45em] text-white/50">
              06 / The Next Drive
            </p>
          </div>

          <p className="hidden text-[8px] uppercase tracking-[0.42em] text-white/20 md:block">
            VELOCE / Final Composition
          </p>
        </div>

        {/* ===================================================
            CAMPAIGN HERO
        ==================================================== */}

        <motion.div
          initial={false}
          style={
            animate
              ? {
                  opacity:
                    titleOpacity,
                }
              : undefined
          }
          className="my-auto flex flex-col justify-center py-20 md:py-24 lg:py-28"
        >
          {/* LEAVE */}

          <motion.div
            initial={false}
            style={
              animate
                ? {
                    x:
                      leaveX,
                  }
                : undefined
            }
          >
            <h2
              id="next-drive-heading"
              data-reveal
              className="text-[19vw] font-medium uppercase leading-[0.7] tracking-[-0.095em] sm:text-[15vw] lg:text-[10.5vw] xl:text-[9.5rem]"
            >
              Leave
            </h2>
          </motion.div>

          {/* ORDINARY */}

          <motion.div
            initial={false}
            style={
              animate
                ? {
                    x:
                      ordinaryX,
                  }
                : undefined
            }
            className="mt-2 md:mt-0"
          >
            <p className="text-[19vw] font-medium uppercase leading-[0.7] tracking-[-0.095em] text-white/23 sm:text-[15vw] lg:text-[10.5vw] xl:text-[9.5rem]">
              Ordinary.
            </p>
          </motion.div>

          {/* campaign signature */}

          <div className="mt-12 grid gap-7 lg:mt-16 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="flex max-w-[760px] items-center gap-5">
              <motion.span
                aria-hidden="true"
                initial={false}
                style={{
                  scaleX:
                    animate
                      ? lineScale
                      : 1,
                }}
                className="h-px flex-1 origin-left bg-[#d8ff3e]"
              />

              <p className="shrink-0 text-[6px] uppercase tracking-[0.44em] text-white/26 sm:text-[7px]">
                Choose / Reserve / Drive
              </p>
            </div>

            <p className="hidden text-right text-[6px] uppercase leading-5 tracking-[0.4em] text-white/14 lg:block">
              Manila
              <br />
              Philippines
            </p>
          </div>
        </motion.div>

        {/* ===================================================
            ACTION DESK
        ==================================================== */}

        <div className="grid gap-12 border-t border-white/12 pt-8 md:grid-cols-[.68fr_1.32fr] md:items-end lg:pt-10">
          {/* copy */}

          <div data-reveal>
            <p className="max-w-sm text-xl leading-[1.17] tracking-[-0.045em] text-white/88 md:text-2xl">
              Choose the machine.
              <br />
              Set the moment.
            </p>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/38">
              Explore the collection, shape your schedule, and continue
              through the VELOCE reservation experience.
            </p>
          </div>

          {/* actions */}

          <div
            data-reveal
            className="flex flex-col gap-5 md:flex-row md:items-end md:justify-end"
          >
            <MagneticLink href="/#reserve">
              Begin reservation

              <ArrowUpRight
                aria-hidden="true"
                size={18}
                strokeWidth={1.2}
              />
            </MagneticLink>

            <Link
              href="/fleet"
              className="group flex min-h-12 items-center justify-between gap-10 border-b border-white/18 px-1 text-[8px] uppercase tracking-[0.36em] text-white/48 transition-colors duration-300 hover:border-white/55 hover:text-white md:min-w-[220px]"
            >
              The collection

              <ArrowRight
                aria-hidden="true"
                size={16}
                strokeWidth={1.1}
                className="transition-transform duration-500 ease-out group-hover:translate-x-1.5"
              />
            </Link>
          </div>
        </div>

        {/* ===================================================
            FINAL METADATA
        ==================================================== */}

        <div className="mt-10 grid gap-5 border-t border-white/[0.055] pt-5 sm:grid-cols-3 sm:items-center">
          <p className="text-[6px] uppercase tracking-[0.42em] text-white/15">
            VELOCE / Portfolio Concept
          </p>

          <div className="hidden items-center justify-center gap-3 sm:flex">
            <span className="h-[4px] w-[4px] rounded-full bg-[#d8ff3e]" />

            <p className="text-[6px] uppercase tracking-[0.42em] text-white/15">
              Private Performance Fleet
            </p>
          </div>

          <p className="text-[6px] uppercase tracking-[0.42em] text-white/15 sm:text-right">
            No Live Transactions
          </p>
        </div>
      </div>
    </section>
  );
}