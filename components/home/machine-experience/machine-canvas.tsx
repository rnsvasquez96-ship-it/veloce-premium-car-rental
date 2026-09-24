"use client";

import {
  Component,
  Suspense,
  useEffect,
  type ErrorInfo,
  type ReactNode,
} from "react";
import {
  Canvas,
  useThree,
} from "@react-three/fiber";
import type { MotionValue } from "motion/react";

import { CarScene } from "./car-scene";

type MachineCanvasProps = {
  progress: MotionValue<number>;
  active: boolean;
  onReady: () => void;
  onError: () => void;
};

export function MachineCanvas({
  progress,
  active,
  onReady,
  onError,
}: MachineCanvasProps) {
  return (
    <SceneErrorBoundary
      fallback={null}
      onError={onError}
    >
      <Canvas
        dpr={1}
        frameloop="demand"
        camera={{
          fov: 34,
          near: 0.1,
          far: 100,
          position: [5.2, 2.7, 9.4],
        }}
        gl={{
          alpha: false,
          antialias: true,

          /*
           * Do NOT force "high-performance".
           *
           * Some Windows / Chromium configurations
           * refuse the context when a specific GPU
           * preference is requested.
           */
          powerPreference: "default",

          /*
           * If the GPU/context becomes temporarily
           * unavailable, fail less aggressively.
           */
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(
            "#080909",
            1,
          );

          console.log(
            "[VELOCE 3D] WebGL ready",
          );
        }}
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        fallback={
          <CanvasUnavailable
            onError={onError}
          />
        }
      >
        <ContextGuard
          onError={onError}
        />

        <Suspense fallback={null}>
          <CarScene
            progress={progress}
            active={active}
            onReady={onReady}
          />
        </Suspense>
      </Canvas>
    </SceneErrorBoundary>
  );
}

/* =========================================================
   CANVAS UNAVAILABLE
========================================================= */

function CanvasUnavailable({
  onError,
}: {
  onError: () => void;
}) {
  useEffect(() => {
    /*
     * Don't use console.error here.
     * Next dev overlay treats console.error as an error screen.
     */

    console.warn(
      "[VELOCE 3D] Browser could not create WebGL canvas",
    );

    onError();
  }, [onError]);

  return null;
}

/* =========================================================
   CONTEXT LOSS
========================================================= */

function ContextGuard({
  onError,
}: {
  onError: () => void;
}) {
  const {
    gl,
    invalidate,
  } = useThree();

  useEffect(() => {
    const canvas =
      gl.domElement;

    function handleLost(
      event: Event,
    ) {
      event.preventDefault();

      console.warn(
        "[VELOCE 3D] WebGL context lost",
      );

      onError();
    }

    function handleRestored() {
      console.log(
        "[VELOCE 3D] WebGL context restored",
      );

      invalidate();
    }

    canvas.addEventListener(
      "webglcontextlost",
      handleLost,
    );

    canvas.addEventListener(
      "webglcontextrestored",
      handleRestored,
    );

    return () => {
      canvas.removeEventListener(
        "webglcontextlost",
        handleLost,
      );

      canvas.removeEventListener(
        "webglcontextrestored",
        handleRestored,
      );
    };
  }, [
    gl,
    invalidate,
    onError,
  ]);

  return null;
}

/* =========================================================
   R3F ERROR BOUNDARY
========================================================= */

class SceneErrorBoundary extends Component<
  {
    children: ReactNode;
    fallback: ReactNode;
    onError: () => void;
  },
  {
    failed: boolean;
  }
> {
  state = {
    failed: false,
  };

  static getDerivedStateFromError() {
    return {
      failed: true,
    };
  }

  componentDidCatch(
    error: Error,
    info: ErrorInfo,
  ) {
    console.warn(
      "[VELOCE 3D] Scene error:",
      error,
      info,
    );

    this.props.onError();
  }

  render() {
    return this.state.failed
      ? this.props.fallback
      : this.props.children;
  }
}