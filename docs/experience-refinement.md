# VELOCE cinematic campaign — implementation and verification

## Current experience

The homepage retains the rich campaign choreography: scroll-linked hero typography and image movement, directional vehicle swaps, a multi-angle GLB study, masked photography with parallax, a traced journey, magnetic CTAs, a cursor halo, animated navigation, and a cinematic finale. Fleet routes have immediate navigation with an incoming visual wipe. Reservation pages keep their established controls, state, validation, and recovery behavior.

## Camera and Three.js

`camera-path.ts` defines six eased compositions: front three-quarter, approach, shoulder study, profile, rear three-quarter, and final hero. The camera moves through less than half an orbit; the normalized vehicle remains stationary on its floor. Quintic interpolation gives smooth shot junctions and the opening/closing compositions hold briefly. Adaptive distance preserves portrait-window framing while making the car larger on wide screens.

Demand rendering, DPR 1–1.5, lazy module/model loading, one-time environment and contact-shadow captures, offscreen subscription cleanup, and hidden-tab handling remain. Mobile/coarse-pointer devices use an animated photographic study; reduced motion uses a static presentation. Timeout, module-load, model, unavailable-WebGL, and context-loss fallbacks remain.

## Campaign runtime lifecycle

- Motion's frame scheduler is the sole Lenis clock; touch scrolling remains native.
- A single synchronization function checks sheet presence and tab visibility before scheduling. It cancels the clock while blocked and resumes it once when both locks clear.
- Sheet presence includes its closing transition. A runtime mounted with an already-open sheet or hidden tab starts paused.
- Route, pointer-capability, and reduced-motion changes disconnect observers and listeners, cancel active animations, and destroy Lenis. Reservation routes do not install the campaign runtime effects.
- Reveal discovery handles streamed content. Each DOM element reveals once; detached nodes and animations are released. Queued observer callbacks are harmless after teardown.
- Native anchor enhancement excludes handled Next links, modified clicks, downloads, external targets, and sheet navigation. It never delays route navigation.
- Magnetic controls reset on keyboard focus and reduced-motion changes. Reduced-motion CSS disables entrance choreography.

## Checks

Run from `frontend`:

```sh
node scripts/verify-motion.mjs
npm run lint
npx tsc --noEmit
npm run build
```

The motion verification script executes the production camera sampler against bounds derived from the actual GLB. It checks 16,008 samples across eight aspect ratios, all bounding-box corners, near/far planes, continuity, smooth shot junctions, and the stationary ground position. Maximum normalized screen extent is approximately 0.801, leaving about 10% of the full screen dimension to the closest edge at the tested samples.

The same script executes the production runtime with DOM and clock doubles. It tests sheet/visibility lock combinations, clean remount, reduced-motion teardown, native mobile reveals, late-arriving nodes, disconnected-node cleanup, stale callbacks, and unmodified versus handled/modified anchor clicks. These are lifecycle tests, not browser integration or GPU benchmarks.

The production browser verified homepage content order and Home to Fleet navigation with no captured console errors. Screenshot capture timed out, so visual screenshot iteration, real-device pointer/menu playback, lighting inspection, and measured FPS remain unverified. Production build and numerical/lifecycle checks pass.

The existing portfolio-concept/no-live-transactions disclosure remains. Self-hosted deployments should set `NEXT_PUBLIC_SITE_URL`; Vercel uses `VERCEL_PROJECT_PRODUCTION_URL` for social metadata.

## Final portfolio art direction

The homepage now introduces the collection and machine sequence before rental search. The primary hero CTA opens the fleet. Numbered sections remain sequential, and the navigation retains direct reservation access. Featured vehicles gain an editorial edition marker; vehicle detail gains a wider launch composition and caption rail. Review retains every field, edit link, price calculation, and confirmation guard with calmer olive-black surfaces. Confirmation opens with a full-width selected-vehicle composition and restrained entrance, followed by the reference and receipt. Reduced motion disables that entrance. Clipboard failure now presents the manual-copy fallback.
