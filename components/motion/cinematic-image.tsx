"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import { useMotionAllowed } from "./motion-preference";

type CinematicImageProps = {
  src: string;
  alt: string;
  sizes: string;

  className?: string;
  imageClassName?: string;

  priority?: boolean;
};

export function CinematicImage({
  src,
  alt,
  sizes,

  className = "aspect-[4/5]",
  imageClassName = "",

  priority = false,
}: CinematicImageProps) {
  const ref =
    useRef<HTMLDivElement>(null);

  const motionAllowed =
    useMotionAllowed();

  const {
    scrollYProgress,
  } = useScroll({
    target: ref,

    offset: [
      "start end",
      "end start",
    ],
  });

  /*
  |--------------------------------------------------------------------------
  | SMOOTH SCROLL INPUT
  |--------------------------------------------------------------------------
  */

  const progress =
    useSpring(
      scrollYProgress,
      {
        stiffness: 55,
        damping: 28,
        mass: 0.9,
        restDelta: 0.001,
      },
    );

  /*
  |--------------------------------------------------------------------------
  | CINEMATIC PARALLAX
  |--------------------------------------------------------------------------
  */

  const y =
    useTransform(
      progress,
      [0, 1],
      [
        "-5%",
        "5%",
      ],
    );

  const scale =
    useTransform(
      progress,
      [0, 0.5, 1],
      [
        1.12,
        1.08,
        1.04,
      ],
    );

  return (
    <div
      ref={ref}
      data-reveal="mask"
      className={[
        "relative isolate overflow-hidden bg-[#080909]",
        className,
      ].join(" ")}
    >
      <motion.div
        initial={false}
        style={
          motionAllowed
            ? {
                y,
                scale,
              }
            : undefined
        }
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          quality={88}
          sizes={sizes}
          className={[
            "object-cover",
            imageClassName,
          ].join(" ")}
        />
      </motion.div>
    </div>
  );
}