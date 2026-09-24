"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowDown,
  ArrowUpRight,
} from "lucide-react";

import { MagneticLink } from "@/components/motion/magnetic-link";
import { useMotionAllowed } from "@/components/motion/motion-preference";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  /*
  |--------------------------------------------------------------------------
  | HYDRATION-SAFE MOTION
  |--------------------------------------------------------------------------
  |
  | The server and first browser render remain visually identical.
  | Scroll transforms begin only after hydration.
  |
  */

  const [mounted, setMounted] = useState(false);
  const motionAllowed = useMotionAllowed();

  useEffect(() => {
    setMounted(true);
  }, []);

  const animate = mounted && motionAllowed;

  /*
  |--------------------------------------------------------------------------
  | SCROLL PROGRESS
  |--------------------------------------------------------------------------
  */

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 48,
    damping: 26,
    mass: 0.95,
    restDelta: 0.0001,
  });

  /*
  |--------------------------------------------------------------------------
  | ENVIRONMENT
  |--------------------------------------------------------------------------
  |
  | Intentionally restrained.
  | This should resemble a slow cinema-camera push,
  | not obvious website parallax.
  |
  */

  const imageScale = useTransform(
    progress,
    [0, 1],
    [1.025, 1.095],
  );

  const imageY = useTransform(
    progress,
    [0, 1],
    ["0%", "7%"],
  );

  const imageOpacity = useTransform(
    progress,
    [0, 0.72, 1],
    [1, 0.92, 0.64],
  );

  /*
  |--------------------------------------------------------------------------
  | TITLE
  |--------------------------------------------------------------------------
  */

  const titleY = useTransform(
    progress,
    [0, 1],
    ["0%", "-8%"],
  );

  const titleOpacity = useTransform(
    progress,
    [0, 0.58, 1],
    [1, 1, 0],
  );

  const driveX = useTransform(
    progress,
    [0, 1],
    ["0%", "-11%"],
  );

  const exceptionalX = useTransform(
    progress,
    [0, 1],
    ["0%", "9%"],
  );

  /*
  |--------------------------------------------------------------------------
  | SUPPORTING CONTENT
  |--------------------------------------------------------------------------
  */

  const supportingY = useTransform(
    progress,
    [0, 1],
    ["0%", "-16%"],
  );

  const supportingOpacity = useTransform(
    progress,
    [0, 0.62, 1],
    [1, 0.92, 0],
  );

  /*
  |--------------------------------------------------------------------------
  | BACKGROUND WORDMARK
  |--------------------------------------------------------------------------
  */

  const watermarkX = useTransform(
    progress,
    [0, 1],
    ["6%", "-10%"],
  );

  const watermarkOpacity = useTransform(
    progress,
    [0, 0.4, 0.82, 1],
    [0.012, 0.035, 0.025, 0],
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#050606] text-white"
    >
      {/* =========================================================
          HERO ENVIRONMENT
      ========================================================== */}

      <motion.div
        initial={false}
        aria-hidden="true"
        style={
          animate
            ? {
                scale: imageScale,
                y: imageY,
                opacity: imageOpacity,
              }
            : undefined
        }
        className="absolute inset-0 -z-30"
      >
        <Image
          src="/images/hero/hero-environment.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="
            object-cover
            object-[56%_center]
            sm:object-[52%_center]
            lg:object-center
          "
        />
      </motion.div>

      {/* =========================================================
          CINEMATIC GRADING
      ========================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0 -z-20
          bg-[linear-gradient(90deg,rgba(2,3,3,.78)_0%,rgba(2,3,3,.38)_34%,rgba(2,3,3,.07)_65%,rgba(2,3,3,.28)_100%)]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0 -z-20
          bg-gradient-to-b
          from-black/55
          via-transparent
          to-[#050606]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0 -z-20
          bg-[radial-gradient(circle_at_58%_48%,transparent_8%,rgba(5,6,6,.08)_48%,rgba(5,6,6,.72)_100%)]
        "
      />

      {/* Mobile lower readability gradient */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-x-0 bottom-0 -z-10
          h-[44%]
          bg-gradient-to-t
          from-[#050606]
          via-[#050606]/75
          to-transparent
          md:hidden
        "
      />

      {/* =========================================================
          HUGE BACKGROUND WORDMARK
      ========================================================== */}

      <motion.p
        initial={false}
        aria-hidden="true"
        style={
          animate
            ? {
                x: watermarkX,
                opacity: watermarkOpacity,
              }
            : {
                opacity: 0.018,
              }
        }
        className="
          pointer-events-none
          absolute left-0 top-[42%] -z-10
          select-none whitespace-nowrap
          text-[29vw]
          font-medium uppercase
          leading-none
          tracking-[-0.105em]
          text-white
        "
      >
        VELOCE
      </motion.p>

      {/* =========================================================
          ARCHITECTURAL GUIDES
      ========================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-6 top-0
          h-full w-px
          bg-white/[0.035]
          lg:left-10
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute right-6 top-0
          h-full w-px
          bg-white/[0.035]
          lg:right-10
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute left-1/2 top-0
          hidden h-full w-px
          bg-white/[0.018]
          lg:block
        "
      />

      {/* =========================================================
          CONTENT
      ========================================================== */}

      <div
        className="
          relative z-10
          mx-auto flex
          min-h-[100svh]
          w-full max-w-[1600px]
          flex-col
          px-6
          pb-7 pt-28
          sm:pb-8
          lg:px-10
          lg:pb-10
          lg:pt-32
        "
      >
        {/* =====================================================
            TOP META
        ====================================================== */}

        <motion.div
          initial={false}
          style={
            animate
              ? {
                  y: supportingY,
                  opacity: supportingOpacity,
                }
              : undefined
          }
          className="flex items-start justify-between gap-8"
        >
          <div>
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="h-px w-9 bg-[#d8ff3e]"
              />

              <p className="text-[8px] uppercase tracking-[0.45em] text-white/58">
                Premium Car Rental
              </p>
            </div>

            <p className="mt-4 max-w-[285px] text-[8px] uppercase leading-5 tracking-[0.25em] text-white/28 sm:text-[9px]">
              Curated performance machines
              <br />
              for journeys worth remembering.
            </p>
          </div>

          <div className="hidden text-right md:block">
            <p className="text-[8px] uppercase tracking-[0.42em] text-white/36">
              Manila / Philippines
            </p>

            <div className="mt-4 flex items-center justify-end gap-3">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-[#d8ff3e]"
              />

              <p className="text-[7px] uppercase tracking-[0.38em] text-white/27">
                Private performance fleet
              </p>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            MAIN CAMPAIGN TYPOGRAPHY
        ====================================================== */}

        <motion.div
          initial={false}
          style={
            animate
              ? {
                  y: titleY,
                  opacity: titleOpacity,
                }
              : undefined
          }
          className="my-auto py-12 sm:py-16 lg:py-20"
        >
          {/* DRIVE */}

          <div className="overflow-hidden">
            <motion.div
              initial={false}
              style={
                animate
                  ? {
                      x: driveX,
                    }
                  : undefined
              }
            >
              <h1
                id="hero-heading"
                className="
                  text-[19vw]
                  font-medium uppercase
                  leading-[0.72]
                  tracking-[-0.1em]
                  sm:text-[16vw]
                  lg:text-[10.7vw]
                  xl:text-[9.6rem]
                "
              >
                Drive
              </h1>
            </motion.div>
          </div>

          {/* EXCEPTIONAL */}

          <div className="overflow-hidden">
            <motion.div
              initial={false}
              style={
                animate
                  ? {
                      x: exceptionalX,
                    }
                  : undefined
              }
              className="pl-[7vw]"
            >
              <span
                className="
                  block
                  text-[17vw]
                  font-medium uppercase
                  leading-[0.76]
                  tracking-[-0.095em]
                  text-[#bec5b7]
                  sm:text-[14vw]
                  lg:text-[9.2vw]
                  xl:text-[8.3rem]
                "
              >
                Exceptional.
              </span>
            </motion.div>
          </div>

          {/* Campaign annotation */}

          <div className="mt-8 flex items-center gap-5 sm:ml-[8vw] md:mt-10">
            <span
              aria-hidden="true"
              className="h-px w-12 bg-white/24"
            />

            <p className="text-[7px] uppercase tracking-[0.42em] text-white/30">
              Independent spirit / Extraordinary machines
            </p>
          </div>
        </motion.div>

        {/* =====================================================
            LOWER STORY / ACTIONS
        ====================================================== */}

        <motion.div
          initial={false}
          style={
            animate
              ? {
                  opacity: supportingOpacity,
                }
              : undefined
          }
          className="
            grid gap-8
            border-t border-white/20
            pt-7
            md:grid-cols-[0.8fr_1.2fr]
            md:items-end
          "
        >
          <div>
            <p
              data-reveal
              className="
                max-w-sm
                text-xl
                leading-[1.18]
                tracking-[-0.04em]
                text-white/90
                md:text-2xl
              "
            >
              The road changes
              <br />
              when the machine does.
            </p>

            <p
              data-reveal
              data-delay="160"
              className="mt-5 max-w-xs text-sm leading-7 text-white/46"
            >
              Choose from a curated performance fleet and
              shape the journey around you.
            </p>
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-end">
            <MagneticLink href="/#reserve">
              Find your drive

              <ArrowUpRight
                size={18}
                strokeWidth={1.35}
              />
            </MagneticLink>

            <a
              href="#fleet"
              className="
                group
                flex min-h-12
                items-center justify-between
                gap-8
                border-b border-white/20
                px-1
                text-[8px] uppercase
                tracking-[0.36em]
                text-white/50
                transition-colors
                duration-300
                hover:border-white/60
                hover:text-white
                md:min-w-[220px]
              "
            >
              Enter the collection

              <ArrowDown
                size={15}
                strokeWidth={1.3}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-y-1
                "
              />
            </a>
          </div>
        </motion.div>

        {/* =====================================================
            BOTTOM DETAILS
        ====================================================== */}

        <div className="mt-7 flex items-end justify-between gap-6">
          <p className="text-[6px] uppercase tracking-[0.45em] text-white/20">
            14°33′ N / 121°03′ E
          </p>

          <p className="hidden text-[6px] uppercase tracking-[0.42em] text-white/20 sm:block">
            Scroll / Begin the journey
          </p>
        </div>
      </div>
    </section>
  );
}