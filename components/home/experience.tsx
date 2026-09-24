"use client";

import Image from "next/image";
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

const chapters = [
  {
    number: "01",
    eyebrow: "Arrival",
    meta: "The first encounter",
    title: "The experience begins before the engine does.",
    description:
      "Before the first kilometre, there is a moment of anticipation — the machine waiting, the destination ahead, and the drive still unwritten.",
    detail: "Arrival / Presence / Anticipation",
  },
  {
    number: "02",
    eyebrow: "Presence",
    meta: "Closer inspection",
    title: "Character reveals itself in the details.",
    description:
      "From a distance, it is proportion and silhouette. Move closer and light begins to reveal the surfaces, lamps, grille and lines that give the machine its identity.",
    detail: "Form / Light / Surface",
  },
  {
    number: "03",
    eyebrow: "Cockpit",
    meta: "Behind the wheel",
    title: "Then everything moves inside.",
    description:
      "The final perspective is the one that matters most — the road framed through the steering wheel, controls and cabin surrounding the driver.",
    detail: "Driver / Machine / Road",
  },
];

export function Experience() {
  const sectionRef =
    useRef<HTMLElement>(null);

  const storyRef =
    useRef<HTMLDivElement>(null);

  const [mounted, setMounted] =
    useState(false);

  const motionAllowed =
    useMotionAllowed();

  useEffect(() => {
    setMounted(true);
  }, []);

  const animate =
    mounted && motionAllowed;

  /* =========================================================
     STORY PROGRESS
  ========================================================= */

  const {
    scrollYProgress,
  } = useScroll({
    target: storyRef,
    offset: [
      "start start",
      "end end",
    ],
  });

  const progress =
    useSpring(
      scrollYProgress,
      {
        stiffness: 42,
        damping: 28,
        mass: 0.95,
        restDelta: 0.0001,
      },
    );

  /* =========================================================
     IMAGE 01 — ARRIVAL
  ========================================================= */

  const arrivalOpacity =
    useTransform(
      progress,
      [
        0,
        0.22,
        0.34,
      ],
      [
        1,
        1,
        0,
      ],
    );

  const arrivalScale =
    useTransform(
      progress,
      [
        0,
        0.34,
      ],
      [
        1.02,
        1.095,
      ],
    );

  const arrivalY =
    useTransform(
      progress,
      [
        0,
        0.34,
      ],
      [
        "0%",
        "-3.5%",
      ],
    );

  /* =========================================================
     IMAGE 02 — DETAIL
  ========================================================= */

  const detailOpacity =
    useTransform(
      progress,
      [
        0.25,
        0.36,
        0.56,
        0.67,
      ],
      [
        0,
        1,
        1,
        0,
      ],
    );

  const detailScale =
    useTransform(
      progress,
      [
        0.25,
        0.67,
      ],
      [
        1.11,
        1.025,
      ],
    );

  const detailY =
    useTransform(
      progress,
      [
        0.25,
        0.67,
      ],
      [
        "3%",
        "-3%",
      ],
    );

  /* =========================================================
     IMAGE 03 — COCKPIT
  ========================================================= */

  const interiorOpacity =
    useTransform(
      progress,
      [
        0.59,
        0.7,
        1,
      ],
      [
        0,
        1,
        1,
      ],
    );

  const interiorScale =
    useTransform(
      progress,
      [
        0.59,
        1,
      ],
      [
        1.09,
        1.025,
      ],
    );

  const interiorY =
    useTransform(
      progress,
      [
        0.59,
        1,
      ],
      [
        "3%",
        "-2%",
      ],
    );

  /* =========================================================
     UI MOTION
  ========================================================= */

  const railProgress =
    useTransform(
      progress,
      [0, 1],
      [0, 1],
    );

  const wordmarkX =
    useTransform(
      progress,
      [0, 1],
      [
        "8%",
        "-16%",
      ],
    );

  const wordmarkOpacity =
    useTransform(
      progress,
      [
        0,
        0.2,
        0.75,
        1,
      ],
      [
        0.01,
        0.035,
        0.025,
        0.008,
      ],
    );

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-labelledby="experience-heading"
      className="relative overflow-clip bg-[#070808] text-white"
    >
      {/* =====================================================
          ARCHITECTURAL BACKGROUND
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-6 top-0 h-full w-px bg-white/[0.02] lg:left-10" />

        <div className="absolute right-6 top-0 h-full w-px bg-white/[0.02] lg:right-10" />

        <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/[0.012] lg:block" />

        <motion.div
          initial={false}
          style={
            animate
              ? {
                  x: wordmarkX,
                  opacity:
                    wordmarkOpacity,
                }
              : {
                  opacity: 0.012,
                }
          }
          className="absolute top-[7%] select-none whitespace-nowrap text-[28vw] font-medium uppercase leading-none tracking-[-0.105em] text-white"
        >
          VELOCE
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-[1650px] px-5 pb-24 pt-24 sm:px-6 md:pb-32 md:pt-32 lg:px-10 lg:pb-40 lg:pt-40">
        {/* =====================================================
            SECTION LABEL
        ====================================================== */}

        <div
          data-reveal
          className="flex items-center justify-between gap-6 border-b border-white/10 pb-5"
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-9 bg-[#d8ff3e]" />

            <p className="text-[8px] uppercase tracking-[0.45em] text-white/50">
              04 / The VELOCE Experience
            </p>
          </div>

          <p className="hidden text-[8px] uppercase tracking-[0.42em] text-white/22 md:block">
            Arrival / Presence / Cockpit
          </p>
        </div>

        {/* =====================================================
            INTRO
        ====================================================== */}

        <div className="grid gap-12 pb-24 pt-14 lg:grid-cols-[1.3fr_.7fr] lg:items-end lg:pb-36 lg:pt-20">
          <h2
            id="experience-heading"
            data-reveal
            className="max-w-[1100px] text-[17vw] font-medium uppercase leading-[0.74] tracking-[-0.095em] sm:text-[13vw] lg:text-[8.4vw] xl:text-[7.8rem]"
          >
            Beyond

            <span className="block translate-x-[8%] text-white/24">
              the drive.
            </span>
          </h2>

          <div
            data-reveal
            className="max-w-md lg:justify-self-end lg:pb-3"
          >
            <p className="text-xl leading-[1.18] tracking-[-0.045em] text-white/90 md:text-2xl">
              Luxury is not a single moment.
            </p>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/42">
              It is the sequence surrounding the machine — the arrival,
              the details you notice as you move closer, and the perspective
              that changes once you take the driver&apos;s seat.
            </p>
          </div>
        </div>

        {/* =====================================================
            DESKTOP STORY
        ====================================================== */}

        <div
          ref={storyRef}
          className="relative hidden lg:grid lg:grid-cols-[1.08fr_.92fr] lg:gap-20 xl:gap-28"
        >
          {/* ===================================================
              LEFT / STICKY VISUAL
          ==================================================== */}

          <div className="relative">
            <div className="sticky top-[10vh] h-[80vh] min-h-[600px] max-h-[900px]">
              {/* frame */}

              <div className="absolute inset-0 border border-white/[0.08]" />

              {/* -------------------------------------------------
                  ARRIVAL
              -------------------------------------------------- */}

              <motion.div
                initial={false}
                style={
                  animate
                    ? {
                        opacity:
                          arrivalOpacity,
                      }
                    : {
                        opacity: 1,
                      }
                }
                className="absolute inset-0 overflow-hidden bg-[#090a0a]"
              >
                <motion.div
                  initial={false}
                  style={
                    animate
                      ? {
                          scale:
                            arrivalScale,
                          y:
                            arrivalY,
                        }
                      : undefined
                  }
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/experience/delivery.jpg"
                    alt="Luxury performance vehicles positioned outside a premium entrance"
                    fill
                    quality={88}
                    sizes="(min-width: 1280px) 52vw, (min-width: 1024px) 55vw, 100vw"
                    className="object-cover object-center"
                  />
                </motion.div>

                <ImageGrade />
              </motion.div>

              {/* -------------------------------------------------
                  DETAIL
              -------------------------------------------------- */}

              <motion.div
                initial={false}
                style={
                  animate
                    ? {
                        opacity:
                          detailOpacity,
                      }
                    : {
                        opacity: 0,
                      }
                }
                className="absolute inset-0 overflow-hidden bg-[#090a0a]"
              >
                <motion.div
                  initial={false}
                  style={
                    animate
                      ? {
                          scale:
                            detailScale,
                          y:
                            detailY,
                        }
                      : undefined
                  }
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/experience/detail.jpg"
                    alt="Close view of a performance car headlight, grille and bodywork"
                    fill
                    quality={88}
                    sizes="(min-width: 1280px) 52vw, (min-width: 1024px) 55vw, 100vw"
                    className="object-cover object-[38%_center]"
                  />
                </motion.div>

                <ImageGrade />
              </motion.div>

              {/* -------------------------------------------------
                  INTERIOR
              -------------------------------------------------- */}

              <motion.div
                initial={false}
                style={
                  animate
                    ? {
                        opacity:
                          interiorOpacity,
                      }
                    : {
                        opacity: 0,
                      }
                }
                className="absolute inset-0 overflow-hidden bg-[#090a0a]"
              >
                <motion.div
                  initial={false}
                  style={
                    animate
                      ? {
                          scale:
                            interiorScale,
                          y:
                            interiorY,
                        }
                      : undefined
                  }
                  className="absolute inset-0"
                >
                  <Image
                    src="/images/experience/interior.jpg"
                    alt="Performance vehicle cockpit illuminated at night"
                    fill
                    quality={88}
                    sizes="(min-width: 1280px) 52vw, (min-width: 1024px) 55vw, 100vw"
                    className="object-cover object-center"
                  />
                </motion.div>

                <ImageGrade />
              </motion.div>

              {/* -------------------------------------------------
                  PREMIUM FRAME DETAILS
              -------------------------------------------------- */}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-5 z-20 border border-white/[0.07]"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-5 top-5 z-20 h-7 w-px bg-[#d8ff3e]/70"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-5 top-5 z-20 h-px w-7 bg-[#d8ff3e]/70"
              />

              <div className="absolute left-7 top-7 z-30">
                <p className="text-[6px] uppercase tracking-[0.48em] text-white/36">
                  VELOCE / EXPERIENCE
                </p>
              </div>

              <div className="absolute right-7 top-7 z-30 text-right">
                <p className="text-[6px] uppercase tracking-[0.48em] text-white/28">
                  04
                </p>
              </div>

              {/* bottom gradient */}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[38%] bg-gradient-to-t from-black/75 via-black/20 to-transparent"
              />

              {/* bottom caption */}

              <div className="absolute bottom-7 left-7 z-30">
                <p className="text-[7px] uppercase tracking-[0.46em] text-white/38">
                  Scroll / Discover
                </p>
              </div>

              {/* progress */}

              <div className="absolute bottom-7 right-7 z-30 flex items-center gap-4">
                <span className="text-[7px] uppercase tracking-[0.4em] text-white/34">
                  01
                </span>

                <div className="relative h-px w-28 overflow-hidden bg-white/15">
                  <motion.div
                    aria-hidden="true"
                    style={{
                      scaleX:
                        animate
                          ? railProgress
                          : 1,
                    }}
                    className="absolute inset-0 origin-left bg-[#d8ff3e]"
                  />
                </div>

                <span className="text-[7px] uppercase tracking-[0.4em] text-white/34">
                  03
                </span>
              </div>

              {/* right-edge marker */}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-1/2 z-20 h-px w-5 bg-white/20"
              />
            </div>
          </div>

          {/* ===================================================
              RIGHT / EDITORIAL STORY
          ==================================================== */}

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-px bg-white/[0.08]"
            />

            <motion.div
              aria-hidden="true"
              style={{
                scaleY:
                  animate
                    ? progress
                    : 1,
              }}
              className="absolute left-0 top-0 h-full w-px origin-top bg-[#d8ff3e]"
            />

            {chapters.map(
              (
                chapter,
                index,
              ) => (
                <ExperienceChapter
                  key={
                    chapter.number
                  }
                  chapter={
                    chapter
                  }
                  index={
                    index
                  }
                  progress={
                    progress
                  }
                />
              ),
            )}

            {/* =================================================
                CLOSING
            ================================================== */}

            <div className="flex min-h-[78svh] flex-col justify-center border-t border-white/10 py-24 pl-14">
              <p className="text-[7px] uppercase tracking-[0.45em] text-white/23">
                VELOCE / The Standard
              </p>

              <p
                data-reveal
                className="mt-8 max-w-[720px] text-4xl leading-[0.93] tracking-[-0.067em] text-white/92 sm:text-5xl xl:text-[4.7rem]"
              >
                Everything around the drive

                <span className="text-white/23">
                  {" "}
                  should feel just as considered.
                </span>
              </p>

              <div className="mt-11 flex items-center gap-4">
                <span className="h-px w-14 bg-[#d8ff3e]" />

                <p className="text-[7px] uppercase tracking-[0.42em] text-white/27">
                  The VELOCE experience
                </p>

                <ArrowUpRight
                  aria-hidden="true"
                  size={14}
                  strokeWidth={1}
                  className="text-white/24"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE / TABLET STORY
        ====================================================== */}

        <div className="space-y-28 lg:hidden">
          <MobileChapter
            number="01"
            eyebrow="Arrival"
            meta="The first encounter"
            title="The experience begins before the engine does."
            description="Before the first kilometre, there is a moment of anticipation — the machine waiting and the drive still unwritten."
            image="/images/experience/delivery.jpg"
            alt="Luxury performance cars at a premium entrance"
            imagePosition="object-center"
          />

          <MobileChapter
            number="02"
            eyebrow="Presence"
            meta="Closer inspection"
            title="Character reveals itself in the details."
            description="Move closer and light begins to reveal the surfaces, lamps, grille and lines that define the machine."
            image="/images/experience/detail.jpg"
            alt="Close-up view of a performance vehicle headlight and grille"
            imagePosition="object-[38%_center]"
          />

          <MobileChapter
            number="03"
            eyebrow="Cockpit"
            meta="Behind the wheel"
            title="Then everything moves inside."
            description="The final perspective is the road framed through the steering wheel, controls and cabin surrounding the driver."
            image="/images/experience/interior.jpg"
            alt="Performance vehicle cockpit illuminated at night"
            imagePosition="object-center"
          />

          <div className="border-t border-white/10 pt-16">
            <p className="text-[7px] uppercase tracking-[0.44em] text-white/24">
              VELOCE / The Standard
            </p>

            <p
              data-reveal
              className="mt-7 text-4xl leading-[0.94] tracking-[-0.065em] text-white/90 sm:text-5xl"
            >
              Everything around the drive

              <span className="text-white/24">
                {" "}
                should feel just as considered.
              </span>
            </p>

            <div className="mt-9 flex items-center gap-4">
              <span className="h-px w-12 bg-[#d8ff3e]" />

              <p className="text-[7px] uppercase tracking-[0.4em] text-white/28">
                The VELOCE experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   DESKTOP CHAPTER
========================================================= */

function ExperienceChapter({
  chapter,
  index,
  progress,
}: {
  chapter:
    (typeof chapters)[number];
  index: number;
  progress:
    MotionValue<number>;
}) {
  const ranges = [
    {
      start: 0,
      enter: 0.04,
      hold: 0.2,
      exit: 0.32,
    },
    {
      start: 0.24,
      enter: 0.35,
      hold: 0.54,
      exit: 0.67,
    },
    {
      start: 0.58,
      enter: 0.69,
      hold: 0.88,
      exit: 1,
    },
  ];

  const range =
    ranges[index];

  const opacity =
    useTransform(
      progress,
      [
        range.start,
        range.enter,
        range.hold,
        range.exit,
      ],
      [
        index === 0
          ? 1
          : 0.16,
        1,
        1,
        index ===
        chapters.length - 1
          ? 1
          : 0.16,
      ],
    );

  const y =
    useTransform(
      progress,
      [
        range.start,
        range.enter,
        range.exit,
      ],
      [
        index === 0
          ? 0
          : 34,
        0,
        -24,
      ],
    );

  const numberOpacity =
    useTransform(
      progress,
      [
        range.start,
        range.enter,
        range.hold,
        range.exit,
      ],
      [
        0.025,
        0.07,
        0.07,
        0.025,
      ],
    );

  return (
    <motion.article
      style={{
        opacity,
        y,
      }}
      className="relative flex min-h-[94svh] flex-col justify-center border-b border-white/10 py-24 pl-14"
    >
      {/* huge chapter numeral */}

      <motion.span
        aria-hidden="true"
        style={{
          opacity:
            numberOpacity,
        }}
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[18rem] font-medium leading-none tracking-[-0.09em] text-white"
      >
        {chapter.number}
      </motion.span>

      {/* rail node */}

      <div
        aria-hidden="true"
        className="absolute -left-[4px] top-1/2 h-[8px] w-[8px] -translate-y-1/2 rounded-full border border-[#d8ff3e] bg-[#070808]"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-4">
          <span className="text-[8px] uppercase tracking-[0.45em] text-[#d8ff3e]">
            {chapter.number}
          </span>

          <span className="h-px w-10 bg-white/15" />

          <span className="text-[7px] uppercase tracking-[0.42em] text-white/28">
            {chapter.eyebrow}
          </span>
        </div>

        <p className="mt-5 text-[7px] uppercase tracking-[0.42em] text-white/20">
          {chapter.meta}
        </p>

        <h3 className="mt-10 max-w-[680px] text-4xl leading-[0.93] tracking-[-0.067em] text-white/95 sm:text-5xl xl:text-[4.65rem]">
          {chapter.title}
        </h3>

        <p className="mt-8 max-w-lg text-sm leading-7 text-white/43">
          {chapter.description}
        </p>

        <div className="mt-12 flex items-center justify-between gap-6 border-t border-white/10 pt-5">
          <p className="text-[7px] uppercase tracking-[0.4em] text-white/22">
            {chapter.detail}
          </p>

          <ArrowDownRight
            aria-hidden="true"
            size={17}
            strokeWidth={1}
            className="text-white/20"
          />
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   IMAGE GRADE
========================================================= */

function ImageGrade() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/[0.04] to-black/14"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.22),transparent_36%,transparent_72%,rgba(0,0,0,.17))]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,.24)]"
      />
    </>
  );
}

/* =========================================================
   MOBILE CHAPTER
========================================================= */

function MobileChapter({
  number,
  eyebrow,
  meta,
  title,
  description,
  image,
  alt,
  imagePosition,
}: {
  number: string;
  eyebrow: string;
  meta: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  imagePosition: string;
}) {
  return (
    <article>
      <div className="flex items-center gap-4">
        <span className="text-[8px] uppercase tracking-[0.42em] text-[#d8ff3e]">
          {number}
        </span>

        <span className="h-px w-9 bg-white/15" />

        <span className="text-[7px] uppercase tracking-[0.42em] text-white/28">
          {eyebrow}
        </span>
      </div>

      <p className="mt-4 text-[7px] uppercase tracking-[0.4em] text-white/18">
        {meta}
      </p>

      {/* explicit aspect ratio prevents Next Image height warnings */}

      <div className="relative mt-7 aspect-[4/5] w-full overflow-hidden bg-[#090a0a] sm:aspect-[16/11]">
        <Image
          src={image}
          alt={alt}
          fill
          quality={88}
          sizes="(max-width: 1023px) 100vw, 50vw"
          className={`object-cover ${imagePosition}`}
        />

        <ImageGrade />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 border border-white/[0.07]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 right-4 h-px w-10 bg-[#d8ff3e]/60"
        />
      </div>

      <h3
        data-reveal
        className="mt-8 max-w-xl text-4xl leading-[0.95] tracking-[-0.062em] text-white/95 sm:text-5xl"
      >
        {title}
      </h3>

      <p className="mt-5 max-w-md text-sm leading-7 text-white/43">
        {description}
      </p>
    </article>
  );
}