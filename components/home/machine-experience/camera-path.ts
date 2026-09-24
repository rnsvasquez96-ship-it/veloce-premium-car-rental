/*
|--------------------------------------------------------------------------
| VELOCE CINEMATIC CAMERA PATH
|--------------------------------------------------------------------------
|
| The CAR never performs a cheap showroom spin.
|
| Instead, the CAMERA moves through a controlled automotive
| campaign sequence around a stationary machine.
|
| Sequence:
|
| 01  Front three-quarter presence
| 02  Slow approach
| 03  Low front-quarter tension
| 04  Transition toward profile
| 05  True profile
| 06  Rear three-quarter
| 07  Final composed hero
|
| Total rotation remains well below a full orbit.
|
*/

export type CameraShot = {
  angle: number;
  radius: number;
  height: number;
  target: number;
  fov: number;
};

type TimedCameraShot =
  CameraShot & {
    at: number;
  };

const shots: readonly TimedCameraShot[] = [
  /*
   * OPENING
   * Calm front three-quarter composition.
   */
  {
    at: 0,
    angle: 0.5,
    radius: 10.8,
    height: 2.72,
    target: 0.94,
    fov: 34,
  },

  /*
   * PRESENCE
   * Subtle push toward the car.
   */
  {
    at: 0.14,
    angle: 0.63,
    radius: 9.65,
    height: 2.18,
    target: 0.89,
    fov: 33.5,
  },

  /*
   * LOW QUARTER
   * More tension, slightly lower camera.
   */
  {
    at: 0.3,
    angle: 0.94,
    radius: 8.95,
    height: 1.68,
    target: 0.8,
    fov: 35.5,
  },

  /*
   * FORM
   * Begin revealing the side proportions.
   */
  {
    at: 0.47,
    angle: 1.3,
    radius: 9.35,
    height: 1.74,
    target: 0.84,
    fov: 35,
  },

  /*
   * PROFILE
   * Controlled true-side study.
   */
  {
    at: 0.64,
    angle: 1.57,
    radius: 10.35,
    height: 2.02,
    target: 0.98,
    fov: 34.5,
  },

  /*
   * REAR THREE-QUARTER
   */
  {
    at: 0.82,
    angle: 2.08,
    radius: 9.85,
    height: 2.24,
    target: 0.94,
    fov: 35,
  },

  /*
   * FINAL HERO
   * Pull back just enough for a calm closing frame.
   */
  {
    at: 1,
    angle: 2.4,
    radius: 10.75,
    height: 2.62,
    target: 0.93,
    fov: 34,
  },
];

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    max,
    Math.max(
      min,
      value,
    ),
  );
}

/*
 * Quintic smootherstep.
 *
 * Gives every camera move a gentle acceleration and
 * deceleration without stopping abruptly at each shot.
 */
function smootherstep(
  value: number,
) {
  const t = clamp(
    value,
    0,
    1,
  );

  return (
    t *
    t *
    t *
    (
      t *
        (
          t * 6 -
          15
        ) +
      10
    )
  );
}

/*
|--------------------------------------------------------------------------
| CAMERA SAMPLING
|--------------------------------------------------------------------------
*/

export function sampleCamera(
  progress: number,
  aspect: number,
  output: CameraShot,
) {
  /*
   * Hold the opening/final composition very slightly.
   * This keeps section entry and exit from feeling rushed.
   */
  const normalized = clamp(
    (progress - 0.035) /
      0.93,
    0,
    1,
  );

  let index = 0;

  for (
    let i = 0;
    i < shots.length - 1;
    i++
  ) {
    if (
      normalized >=
        shots[i].at &&
      normalized <=
        shots[i + 1].at
    ) {
      index = i;
      break;
    }
  }

  const a =
    shots[index];

  const b =
    shots[
      Math.min(
        index + 1,
        shots.length - 1,
      )
    ];

  const span = Math.max(
    b.at - a.at,
    0.0001,
  );

  const local =
    (normalized - a.at) /
    span;

  const t =
    smootherstep(local);

  output.angle =
    a.angle +
    (b.angle - a.angle) *
      t;

  output.radius =
    a.radius +
    (b.radius - a.radius) *
      t;

  output.height =
    a.height +
    (b.height - a.height) *
      t;

  output.target =
    a.target +
    (b.target - a.target) *
      t;

  output.fov =
    a.fov +
    (b.fov - a.fov) *
      t;

  /*
  |--------------------------------------------------------------------------
  | RESPONSIVE FRAMING
  |--------------------------------------------------------------------------
  |
  | Wide screens can come slightly closer.
  | Narrow portrait/tablet canvases move further away so the
  | nose/tail never gets clipped.
  |
  */

  const safeAspect =
    Math.max(
      aspect,
      0.35,
    );

  const aspectFactor =
    clamp(
      1.28 /
        safeAspect,
      0.78,
      1.55,
    );

  output.radius *=
    aspectFactor;

  return output;
}