# VELOCE — Portfolio Case Study

## Problem

Premium rental interfaces often resemble generic ecommerce catalogs, reducing emotionally driven vehicles to interchangeable product cards.

## Goal

Create a frontend experience that communicates automotive character while keeping vehicle discovery and reservation clear, fast, and credible.

## Design Direction

Dark campaign photography, oversized editorial typography, disciplined spacing, and a restrained lime signal color create a precise premium identity without relying on visual excess.

## User Journey

Home → Fleet → Vehicle Detail → Schedule → Driver → Review → Confirmed.

## Information Architecture

The public experience stays deliberately small: one brand-led homepage, one collection, vehicle details, and four reservation states. Supporting content remains within those surfaces instead of creating low-value routes.

## Fleet Experience

Centralized vehicle data drives both the featured showroom and complete collection. Large imagery and essential performance metadata replace dense ecommerce cards.

## Reservation UX

The flow progressively collects schedule and driver details, continuously summarizes real client state, separates refundable deposits from estimated cost, and explicitly states that no payment is processed.

## 3D Machine Experience

A single lazy-loaded WebGL scene turns scroll progress into a restrained automotive camera move. Deep graphite body paint, studio strip reflections, and lightweight grounding integrate the model with the photographic art direction.

## Performance Decisions

The 3D scene renders on demand at capped DPR and is excluded from touch, reduced-motion, and unsuitable-device paths. Images use responsive delivery, and most motion stays on transforms and opacity.

## Accessibility

Semantic links and controls, visible focus treatment, labelled forms, keyboard-accessible fleet controls, reduced-motion behavior, and non-interactive decorative Canvas treatment support broader use.

## Challenges

- Balancing cinematic motion with responsive performance
- Preserving reservation state across App Router navigation
- Integrating a generic GLB into a specific premium visual language
- Preventing incomplete deep links from producing misleading summaries

## Solutions

- Lazy, demand-driven 3D with intentional fallbacks
- Typed `sessionStorage` state behind a focused provider
- Verified material-specific PBR tuning and controlled studio lighting
- Centralized prerequisite checks with branded recovery states

## Outcome

VELOCE demonstrates end-to-end frontend product thinking: brand direction, interaction design, typed state, responsive implementation, accessibility, performance discipline, and production-oriented failure handling.
