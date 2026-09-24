# VELOCE

A cinematic premium car rental frontend experience.

## Overview

VELOCE is a portfolio project exploring how editorial art direction, automotive product presentation, and a focused reservation journey can coexist in a fast, responsive web experience. It is a frontend concept: no real inventory, transactions, or payments are processed.

## Live Demo

Live URL: _Coming after deployment._

## Key Features

- Cinematic, responsive homepage with restrained scroll choreography
- Data-driven featured showroom and filterable fleet collection
- Editorial vehicle detail pages with real project data
- Four-stage schedule, driver, review, and confirmation journey
- Scroll-controlled 3D Machine Experience with intentional fallbacks
- Session-persisted reservation state and client-side validation
- Accessible focus states, reduced-motion support, and mobile navigation

## Tech Stack

- Next.js App Router
- TypeScript and React
- Tailwind CSS
- Motion
- React Three Fiber, Drei, and Three.js
- Lucide icons
- `sessionStorage` reservation persistence

## UX / Product Flow

```text
Home → Fleet → Vehicle Detail → Schedule → Driver → Review → Confirmed
```

The flow keeps vehicle selection and reservation context visible while progressively collecting only the information required for the concept.

## 3D Machine Experience

The Machine section loads `public/models/sports-car.glb` into a single React Three Fiber Canvas. Motion scroll progress drives a restrained camera rig, model rotation, and studio-light changes. The scene uses `frameloop="demand"`, capped DPR, no post-processing, and no expensive realtime reflections.

Touch devices, reduced-motion users, missing models, and failed WebGL/GLB loads receive a composed cinematic image fallback instead of a broken viewer.

## Performance Strategy

- Dynamically imported 3D scene initialized only near its section
- Demand-based WebGL rendering and DPR capped at `[1, 1.5]`
- Mobile and reduced-motion image fallback
- `next/image` with responsive `sizes` and below-fold lazy loading
- Transform/opacity-focused motion with restrained blur and backdrop filtering
- No global smooth-scroll dependency mounted at runtime
- Ref-driven custom cursor updates on fine-pointer devices only

## Reservation Architecture

`ReservationProvider` owns typed reservation data and synchronizes it with `sessionStorage` after hydration. Search preferences flow into the schedule step; later routes validate prerequisite state and provide recoverable empty states for malformed or incomplete sessions. Confirmation remains a frontend simulation and never requests payment information.

## Project Structure

```text
app/                         Routes, layouts, metadata, and icon
components/home/             Homepage experiences
components/home/machine-experience/
                             Lazy 3D Canvas and car scene
components/fleet/            Fleet catalog
components/reservation/      Reservation context and state helpers
components/navigation/       Scoped navigation transitions
data/vehicles.ts             Central vehicle catalog
public/images/               Hero, fleet, lifestyle, and experience assets
public/models/               3D model assets
docs/                        Portfolio case-study content
```

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Screenshots

_Add deployed screenshots for the Home, Fleet, Vehicle, Schedule, Review, and Confirmation views._

## Design Direction

VELOCE combines dark automotive campaign imagery with premium editorial typography, large product compositions, precise micro-interactions, and a restrained lime accent. The interface intentionally avoids dashboard patterns, generic ecommerce cards, and decorative motion without product value.

## Disclaimer

VELOCE is a frontend portfolio concept. Vehicles, availability, reservations, and pricing are illustrative. No live transactions or payments are processed.

## Credits

Design and frontend implementation by Ranz Nathaniel S. Vasquez. Vehicle imagery and the 3D model remain subject to their respective source licenses and should be documented here before public deployment.
