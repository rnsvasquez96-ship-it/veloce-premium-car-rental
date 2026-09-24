"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import { useMotionAllowed } from "@/components/motion/motion-preference";

const MachineCanvas = dynamic(
  () =>
    import("./machine-experience/machine-canvas").then(
      (module) => module.MachineCanvas,
    ),
  {
    ssr: false,
  },
);

type MachineStatus =
  | "idle"
  | "loading"
  | "ready"
  | "failed";

const chapters = [
  {
    number: "01 / Presence",
    eyebrow: "The first impression",
    title: "An instinct.",
    subtitle:
      "Before the road. Before the sound. Presence arrives first.",
    start: 0,
    peakIn: 0.06,
    peakOut: 0.2,
    end: 0.29,
    align: "left" as const,
  },
  {
    number: "02 / Form",
    eyebrow: "Sculpted tension",
    title: "Every line.",
    subtitle:
      "Proportion, surface and intent reduced to one unmistakable silhouette.",
    start: 0.25,
    peakIn: 0.34,
    peakOut: 0.45,
    end: 0.55,
    align: "right" as const,
  },
  {
    number: "03 / Poise",
    eyebrow: "Built to move",
    title: "Pure tension.",
    subtitle:
      "Stillness with somewhere to go. The machine holds its energy before release.",
    start: 0.5,
    peakIn: 0.59,
    peakOut: 0.7,
    end: 0.79,
    align: "left" as const,
  },
  {
    number: "04 / Motion",
    eyebrow: "The final composition",
    title: "Beyond words.",
    subtitle:
      "Some things are not explained. They are understood from behind the wheel.",
    start: 0.75,
    peakIn: 0.84,
    peakOut: 1,
    end: 1,
    align: "right" as const,
  },
];

export function CinematicDrive({
  modelAvailable = true,
}: {
  modelAvailable?: boolean;
}) {
  const sectionRef =
    useRef<HTMLElement>(null);

  const [
    status,
    setStatus,
  ] = useState<MachineStatus>(
    "idle",
  );

  const [
    mounted,
    setMounted,
  ] = useState(false);

  const [
    desktop,
    setDesktop,
  ] = useState(false);

  const [
    webGLAvailable,
    setWebGLAvailable,
  ] = useState(false);

  const motionAllowed =
    useMotionAllowed();

  /*
  |--------------------------------------------------------------------------
  | CLIENT CAPABILITY CHECK
  |--------------------------------------------------------------------------
  |
  | Do the test directly in this browser.
  |
  | We no longer depend on the old combined media-query store.
  |
  */

  useEffect(() => {
    setMounted(true);

    const updateViewport =
      () => {
        setDesktop(
          window.innerWidth >=
            768,
        );
      };

    updateViewport();

    window.addEventListener(
      "resize",
      updateViewport,
    );

    let available = false;

    try {
      const canvas =
        document.createElement(
          "canvas",
        );

      available =
        Boolean(
          canvas.getContext(
            "webgl2",
          ),
        ) ||
        Boolean(
          canvas.getContext(
            "webgl",
          ),
        );
    } catch {
      available = false;
    }

    setWebGLAvailable(
      available,
    );

    console.log(
      "[VELOCE 3D] capability:",
      {
        webGL: available,
        width:
          window.innerWidth,
      },
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateViewport,
      );
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | PRELOAD WINDOW
  |--------------------------------------------------------------------------
  */

  const shouldLoad =
    useInView(
      sectionRef,
      {
        margin:
          "900px 0px",
        once: true,
      },
    );

  /*
  |--------------------------------------------------------------------------
  | ACTIVE SCENE WINDOW
  |--------------------------------------------------------------------------
  */

  const active =
    useInView(
      sectionRef,
      {
        margin:
          "20% 0px 20% 0px",
      },
    );

  /*
  |--------------------------------------------------------------------------
  | SCROLL
  |--------------------------------------------------------------------------
  */

  const {
    scrollYProgress,
  } = useScroll({
    target: sectionRef,
    offset: [
      "start start",
      "end end",
    ],
  });

  const progress =
    useSpring(
      scrollYProgress,
      {
        stiffness: 48,
        damping: 27,
        mass: 1,
        restDelta:
          0.0001,
      },
    );

  /*
  |--------------------------------------------------------------------------
  | FALLBACK MOTION
  |--------------------------------------------------------------------------
  */

  const fallbackCarScale =
    useTransform(
      progress,
      [0, 0.5, 1],
      [
        0.92,
        1.02,
        0.94,
      ],
    );

  const fallbackCarX =
    useTransform(
      progress,
      [0, 0.5, 1],
      [
        "3%",
        "-2%",
        "2%",
      ],
    );

  const fallbackCarY =
    useTransform(
      progress,
      [0, 0.5, 1],
      [
        "4%",
        "-2%",
        "2%",
      ],
    );

  /*
  |--------------------------------------------------------------------------
  | WATERMARK
  |--------------------------------------------------------------------------
  */

  const watermarkX =
    useTransform(
      progress,
      [0, 0.5, 1],
      [
        "8%",
        "-4%",
        "-17%",
      ],
    );

  const watermarkOpacity =
    useTransform(
      progress,
      [
        0,
        0.15,
        0.8,
        1,
      ],
      [
        0.025,
        0.055,
        0.04,
        0.012,
      ],
    );

  /*
  |--------------------------------------------------------------------------
  | 3D ELIGIBILITY
  |--------------------------------------------------------------------------
  */

  const canAttempt3D =
    mounted &&
    modelAvailable &&
    desktop &&
    webGLAvailable &&
    shouldLoad;

  const ready =
    status === "ready";

  /*
  |--------------------------------------------------------------------------
  | STATUS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      canAttempt3D &&
      status === "idle"
    ) {
      setStatus(
        "loading",
      );
    }
  }, [
    canAttempt3D,
    status,
  ]);

  const markReady =
    useCallback(() => {
      console.log(
        "[VELOCE 3D] machine ready",
      );

      setStatus(
        "ready",
      );
    }, []);

  const markFailed =
    useCallback(() => {
      /*
       * IMPORTANT:
       * Do not unmount the Canvas.
       *
       * We keep it alive underneath the static fallback
       * so a transient context/load issue doesn't permanently
       * kill the Machine section.
       */

      console.warn(
        "[VELOCE 3D] machine reported an error",
      );

      setStatus(
        "failed",
      );
    }, []);

  /*
  |--------------------------------------------------------------------------
  | FALLBACK VISIBILITY
  |--------------------------------------------------------------------------
  */

  const fallbackVisible =
    !ready;

  return (
    <section
      id="machine"
      ref={sectionRef}
      aria-labelledby="machine-heading"
      data-machine-state={
        ready
          ? "ready"
          : status ===
              "failed"
            ? "fallback"
            : "loading"
      }
      className="campaign-machine relative bg-[#080909]"
    >
      <div className="campaign-machine-stage sticky top-0 h-[100svh] overflow-hidden">
        {/* =====================================================
            STUDIO
        ====================================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[#080909]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[48%] h-[72%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.07),rgba(255,255,255,.014)_47%,transparent_73%)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[18%] h-px w-[45%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/12 to-transparent"
        />

        {/* =====================================================
            PORSCHE FALLBACK / LOADING PLATE
        ====================================================== */}

        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{
            opacity:
              fallbackVisible
                ? 1
                : 0,
          }}
          transition={{
            duration: 0.9,
            ease: [
              0.16,
              1,
              0.3,
              1,
            ],
          }}
          className="pointer-events-none absolute inset-0 z-[2]"
        >
          <motion.div
            style={
              motionAllowed
                ? {
                    scale:
                      fallbackCarScale,
                    x:
                      fallbackCarX,
                    y:
                      fallbackCarY,
                  }
                : undefined
            }
            className="absolute inset-[14%_-12%_12%_-12%] sm:inset-[11%_-8%_9%_-8%] md:inset-[8%_-5%_7%_-5%]"
          >
            <Image
              src="/images/porsche-911.png"
              alt=""
              fill
              quality={88}
              sizes="110vw"
              className="object-contain drop-shadow-[0_45px_65px_rgba(0,0,0,.75)]"
            />
          </motion.div>

          <div className="absolute bottom-[17%] left-1/2 h-[7%] w-[55%] -translate-x-1/2 rounded-[50%] bg-black/80 blur-2xl" />

          <div className="absolute bottom-[21%] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </motion.div>

        {/* =====================================================
            REAL GLB
        ====================================================== */}

        {canAttempt3D && (
          <motion.div
            aria-hidden="true"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity:
                ready
                  ? 1
                  : 0.01,
            }}
            transition={{
              duration: 1,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
            }}
            /*
             * Keep it mounted and technically visible
             * while loading.
             *
             * opacity: 0.01 avoids certain browsers
             * deprioritizing completely invisible
             * WebGL surfaces.
             */
            className="pointer-events-none absolute inset-0 z-10"
          >
            <MachineCanvas
              progress={
                progress
              }
              active={
                active
              }
              onReady={
                markReady
              }
              onError={
                markFailed
              }
            />
          </motion.div>
        )}

       

        {/* =====================================================
            LOADING INDICATOR
        ====================================================== */}

        {canAttempt3D &&
          !ready && (
            <div
              role="status"
              aria-live="polite"
              className="absolute bottom-[12%] left-6 z-30 lg:left-10"
            >
              <p className="text-[7px] uppercase tracking-[0.42em] text-white/35">
                {status ===
                "failed"
                  ? "Retrying machine"
                  : "Initializing machine"}
              </p>

              <div
                aria-hidden="true"
                className="mt-4 h-px w-28 overflow-hidden bg-white/10"
              >
                <motion.div
                  className="h-full w-1/2 bg-[#d8ff3e]"
                  animate={{
                    x: [
                      "-120%",
                      "230%",
                    ],
                  }}
                  transition={{
                    duration:
                      1.3,
                    repeat:
                      Infinity,
                    ease: [
                      0.4,
                      0,
                      0.2,
                      1,
                    ],
                  }}
                />
              </div>
            </div>
          )}

        {/* =====================================================
            VELOCE WORDMARK
        ====================================================== */}

        <motion.p
          aria-hidden="true"
          style={
            motionAllowed
              ? {
                  x:
                    watermarkX,
                  opacity:
                    watermarkOpacity,
                }
              : {
                  opacity:
                    0.025,
                }
          }
          className="pointer-events-none absolute left-0 top-[46%] z-[11] select-none whitespace-nowrap text-[29vw] font-medium uppercase leading-none tracking-[-0.105em] text-white"
        >
          VELOCE
        </motion.p>

        {/* =====================================================
            GRADING
        ====================================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[24vh] bg-gradient-to-b from-[#080909] via-[#080909]/55 to-transparent"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[27vh] bg-gradient-to-t from-[#080909] via-[#080909]/65 to-transparent"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[26vw] bg-gradient-to-r from-black/38 to-transparent"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-[22vw] bg-gradient-to-l from-black/26 to-transparent"
        />

        {/* =====================================================
            TOP META
        ====================================================== */}

        <div className="pointer-events-none absolute inset-x-6 top-7 z-30 flex items-center justify-between lg:inset-x-10 lg:top-9">
          <div className="flex items-center gap-4">
            <span className="h-px w-9 bg-[#d8ff3e]" />

            <p className="text-[8px] uppercase tracking-[0.45em] text-white/52">
              02 / The Machine
            </p>
          </div>

          <p className="hidden text-[8px] uppercase tracking-[0.42em] text-white/24 sm:block">
            Precision / From every perspective
          </p>
        </div>

        <h2
          id="machine-heading"
          className="sr-only"
        >
          VELOCE machine experience —
          presence, form, poise and
          motion.
        </h2>

        {/* =====================================================
            STORY
        ====================================================== */}

        <div className="pointer-events-none absolute inset-0 z-30">
          {motionAllowed ? (
            chapters.map(
              (
                chapter,
              ) => (
                <Chapter
                  key={
                    chapter.number
                  }
                  progress={
                    progress
                  }
                  {...chapter}
                />
              ),
            )
          ) : (
            <div className="absolute bottom-[18%] left-6 lg:left-10">
              <p className="text-[8px] uppercase tracking-[0.42em] text-[#d8ff3e]">
                04 / Motion
              </p>

              <p className="mt-4 text-[clamp(3rem,8vw,7rem)] font-medium uppercase leading-[0.8] tracking-[-0.08em]">
                Beyond
                <br />
                words.
              </p>

              <p className="mt-5 max-w-xs text-sm leading-6 text-white/48">
                Some things are
                understood only from
                behind the wheel.
              </p>
            </div>
          )}
        </div>

        {/* =====================================================
            BOTTOM
        ====================================================== */}

        <div className="pointer-events-none absolute inset-x-6 bottom-7 z-30 lg:inset-x-10 lg:bottom-9">
          <div className="flex items-end justify-between gap-6">
            <p className="text-[7px] uppercase tracking-[0.4em] text-white/25">
              VELOCE / Machine Study
            </p>

            <p className="text-right text-[7px] uppercase tracking-[0.4em] text-white/25">
              {ready
                ? "Scroll / Change perspective"
                : !desktop
                  ? "Static machine / Mobile"
                  : !webGLAvailable
                    ? "WebGL unavailable"
                    : status ===
                        "failed"
                      ? "Machine retrying"
                      : "Preparing experience"}
            </p>
          </div>

          <div className="mt-5 h-px overflow-hidden bg-white/12">
            <motion.div
              aria-hidden="true"
              style={
                motionAllowed
                  ? {
                      scaleX:
                        progress,
                    }
                  : {
                      scaleX:
                        1,
                    }
              }
              className="h-full origin-left bg-[#d8ff3e]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Chapter({
  progress,
  start,
  peakIn,
  peakOut,
  end,
  eyebrow,
  title,
  subtitle,
  number,
  align,
}: {
  progress: MotionValue<number>;
  start: number;
  peakIn: number;
  peakOut: number;
  end: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  number: string;
  align:
    | "left"
    | "right";
}) {
  const opacity =
    useTransform(
      progress,
      [
        start,
        peakIn,
        peakOut,
        end,
      ],
      [
        start === 0
          ? 1
          : 0,
        1,
        1,
        end === 1
          ? 1
          : 0,
      ],
    );

  const y =
    useTransform(
      progress,
      [
        start,
        peakIn,
        end,
      ],
      [
        start === 0
          ? 0
          : 30,
        0,
        -14,
      ],
    );

  const x =
    useTransform(
      progress,
      [
        start,
        peakIn,
        end,
      ],
      align ===
        "left"
        ? [
            -18,
            0,
            -7,
          ]
        : [
            18,
            0,
            7,
          ],
    );

  return (
    <motion.div
      aria-hidden="true"
      style={{
        opacity,
        x,
        y,
      }}
      className={[
        "absolute bottom-[18%] max-w-[560px]",
        align ===
        "left"
          ? "left-6 text-left lg:left-10"
          : "right-6 text-right lg:right-10",
      ].join(" ")}
    >
      <div
        className={[
          "flex items-center gap-4",
          align ===
          "right"
            ? "justify-end"
            : "",
        ].join(" ")}
      >
        <p className="text-[7px] uppercase tracking-[0.42em] text-[#d8ff3e]">
          {number}
        </p>

        <span className="h-px w-8 bg-white/15" />

        <p className="text-[6px] uppercase tracking-[0.4em] text-white/25">
          {eyebrow}
        </p>
      </div>

      <p className="mt-4 text-[clamp(3rem,7vw,7.5rem)] font-medium uppercase leading-[0.8] tracking-[-0.08em]">
        {title}
      </p>

      <p
        className={[
          "mt-5 max-w-xs text-sm leading-6 text-white/48",
          align ===
          "right"
            ? "ml-auto"
            : "",
        ].join(" ")}
      >
        {subtitle}
      </p>
    </motion.div>
  );
}