"use client";

import Link from "next/link";
import {
  motion,
  useSpring,
} from "motion/react";
import {
  useEffect,
  type PointerEvent,
  type ReactNode,
} from "react";

import { useMotionAllowed } from "./motion-preference";

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function MagneticLink({
  href,
  children,
  className = "primary-link",
}: MagneticLinkProps) {
  const allowed =
    useMotionAllowed();

  const x = useSpring(0, {
    stiffness: 190,
    damping: 22,
    mass: 0.45,
  });

  const y = useSpring(0, {
    stiffness: 190,
    damping: 22,
    mass: 0.45,
  });

  useEffect(() => {
    if (!allowed) {
      x.jump(0);
      y.jump(0);
    }
  }, [
    allowed,
    x,
    y,
  ]);

  function reset() {
    x.set(0);
    y.set(0);
  }

  function handlePointerMove(
    event:
      PointerEvent<HTMLDivElement>,
  ) {
    if (
      !allowed ||
      event.pointerType !==
        "mouse"
    ) {
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    const centerX =
      rect.left +
      rect.width / 2;

    const centerY =
      rect.top +
      rect.height / 2;

    const deltaX =
      event.clientX -
      centerX;

    const deltaY =
      event.clientY -
      centerY;

    /*
     * Keep the movement extremely restrained.
     * Premium magnetic interaction should be felt,
     * not obviously seen.
     */

    const magneticX =
      Math.max(
        -10,
        Math.min(
          10,
          deltaX * 0.11,
        ),
      );

    const magneticY =
      Math.max(
        -7,
        Math.min(
          7,
          deltaY * 0.1,
        ),
      );

    x.set(
      magneticX,
    );

    y.set(
      magneticY,
    );
  }

  return (
    <motion.div
      className="inline-flex"
      style={
        allowed
          ? {
              x,
              y,
            }
          : undefined
      }
      onPointerMove={
        handlePointerMove
      }
      onPointerLeave={
        reset
      }
      onPointerCancel={
        reset
      }
      onFocusCapture={() => {
        /*
         * Keyboard users should always get
         * the link in its natural position.
         */
        x.jump(0);
        y.jump(0);
      }}
      onBlurCapture={
        reset
      }
    >
      <Link
        href={href}
        className={
          className
        }
      >
        {children}
      </Link>
    </motion.div>
  );
}