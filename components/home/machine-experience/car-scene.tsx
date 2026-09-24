"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useGLTF } from "@react-three/drei";
import {
  useFrame,
  useThree,
} from "@react-three/fiber";
import type { MotionValue } from "motion/react";
import * as THREE from "three";

import {
  sampleCamera,
  type CameraShot,
} from "./camera-path";

const MODEL_URL =
  "/models/sports-car.glb";

type CarSceneProps = {
  progress: MotionValue<number>;
  active: boolean;
  onReady: () => void;
};

export function CarScene({
  progress,
  active,
  onReady,
}: CarSceneProps) {
  /*
  |--------------------------------------------------------------------------
  | LOAD THE REAL GLB
  |--------------------------------------------------------------------------
  */

  const gltf =
    useGLTF(MODEL_URL);

  const scene =
    gltf.scene;

  const {
    camera,
    invalidate,
  } = useThree();

  const perspectiveCamera =
    camera as THREE.PerspectiveCamera;

  /*
  |--------------------------------------------------------------------------
  | NORMALIZE MODEL
  |--------------------------------------------------------------------------
  |
  | Do not clone or mutate the GLTF yet.
  | First priority: reliably display the actual model.
  |
  */

  const modelStudy =
    useMemo(() => {
      scene.updateMatrixWorld(true);

      const box =
        new THREE.Box3().setFromObject(
          scene,
        );

      const size =
        box.getSize(
          new THREE.Vector3(),
        );

      const center =
        box.getCenter(
          new THREE.Vector3(),
        );

      const longest =
        Math.max(
          size.x,
          size.y,
          size.z,
          0.001,
        );

      const scale =
        5.2 / longest;

      const offset =
        new THREE.Vector3(
          -center.x,
          -box.min.y,
          -center.z,
        );

      return {
        scale,
        offset,
      };
    }, [scene]);

  /*
  |--------------------------------------------------------------------------
  | INITIAL RENDER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    console.info(
      "[VELOCE 3D] sports-car.glb loaded",
      {
        scene,
        scale:
          modelStudy.scale,
      },
    );

    invalidate();
  }, [
    scene,
    modelStudy.scale,
    invalidate,
  ]);

  /*
  |--------------------------------------------------------------------------
  | DEMAND RENDERING
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!active) {
      return;
    }

    invalidate();

    const unsubscribe =
      progress.on(
        "change",
        () => {
          if (
            !document.hidden
          ) {
            invalidate();
          }
        },
      );

    return unsubscribe;
  }, [
    active,
    progress,
    invalidate,
  ]);

  /*
  |--------------------------------------------------------------------------
  | TAB VISIBILITY
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    function handleVisibility() {
      if (
        active &&
        !document.hidden
      ) {
        invalidate();
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibility,
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility,
      );
    };
  }, [
    active,
    invalidate,
  ]);

  /*
  |--------------------------------------------------------------------------
  | CAMERA
  |--------------------------------------------------------------------------
  */

  const shot =
    useRef<CameraShot>({
      angle: 0.5,
      radius: 10.8,
      height: 2.72,
      target: 0.94,
      fov: 34,
    });

  const announced =
    useRef(false);

  useFrame(() => {
    const view =
      sampleCamera(
        progress.get(),
        perspectiveCamera.aspect,
        shot.current,
      );

    perspectiveCamera.position.set(
      Math.sin(view.angle) *
        view.radius,

      view.height,

      Math.cos(view.angle) *
        view.radius,
    );

    perspectiveCamera.lookAt(
      0,
      view.target,
      0,
    );

    if (
      Math.abs(
        perspectiveCamera.fov -
          view.fov,
      ) > 0.001
    ) {
      perspectiveCamera.fov =
        view.fov;

      perspectiveCamera.updateProjectionMatrix();
    }

    /*
     * If this callback runs, WebGL is alive
     * and the GLB has successfully resolved.
     */
    if (
      !announced.current
    ) {
      announced.current = true;

      console.info(
        "[VELOCE 3D] first GLB frame rendered",
      );

      onReady();
    }
  });

  return (
    <>
      {/* =====================================================
          WORLD
      ====================================================== */}

      <color
        attach="background"
        args={["#080909"]}
      />

      <fog
        attach="fog"
        args={[
          "#080909",
          18,
          38,
        ]}
      />

      {/* =====================================================
          PREMIUM STUDIO LIGHTING
      ====================================================== */}

      <hemisphereLight
        args={[
          "#f4f5ef",
          "#050606",
          0.75,
        ]}
      />

      {/* Main soft key */}

      <directionalLight
        position={[
          5,
          8,
          7,
        ]}
        intensity={3.2}
        color="#fff8ed"
      />

      {/* Cool opposite fill */}

      <directionalLight
        position={[
          -6,
          4,
          3,
        ]}
        intensity={1.8}
        color="#dce8f0"
      />

      {/* Rear rim */}

      <directionalLight
        position={[
          -4,
          5,
          -7,
        ]}
        intensity={2.8}
        color="#ffffff"
      />

      {/* Roof highlight */}

      <spotLight
        position={[
          0,
          9,
          1,
        ]}
        intensity={5}
        angle={0.72}
        penumbra={0.85}
        distance={25}
        color="#ffffff"
      />

      {/* Subtle side highlight */}

      <spotLight
        position={[
          7,
          3,
          -2,
        ]}
        intensity={2.2}
        angle={0.7}
        penumbra={0.9}
        distance={22}
        color="#eff4ff"
      />

      {/* =====================================================
          ACTUAL SPORTS-CAR.GLB
      ====================================================== */}

      <group
        scale={
          modelStudy.scale
        }
      >
        <primitive
          object={scene}
          position={
            modelStudy.offset
          }
        />
      </group>

      {/* =====================================================
          FLOOR
      ====================================================== */}

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          0,
          -0.015,
          0,
        ]}
        receiveShadow
      >
        <planeGeometry
          args={[
            100,
            100,
          ]}
        />

        <meshStandardMaterial
          color="#101212"
          metalness={0.08}
          roughness={0.9}
        />
      </mesh>

      {/* =====================================================
          FAKE PREMIUM FLOOR SHADOW
      ====================================================== */}

      <mesh
        rotation={[
          -Math.PI / 2,
          0,
          0,
        ]}
        position={[
          0,
          0.002,
          0,
        ]}
      >
        <circleGeometry
          args={[
            3.5,
            64,
          ]}
        />

        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.36}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(
  MODEL_URL,
);