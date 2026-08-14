# Phase 1: Premium 3D Product Discovery & Affiliate Platform

Build a next-generation product discovery and affiliate-commerce platform using React, TanStack Start, and Three.js. The site features a 3D presentation layer, expert buying guides, and a curated deals engine, all powered by a mock data layer designed for a seamless future transition to a real backend.

## Design System

- **Visual Style**: Premium, futuristic, editorial, and spatial.
- **Typography**: Variable font stack (Inter/System) with strong hierarchical display sizes.
- **Color Palette**: OKLCH-based semantic tokens (Background, Foreground, Primary, Accent) with depth-focused shadows.
- **Components**: Customized shadcn/ui primitives.

## Technical Details

- **Framework**: TanStack Start v1 (React 19, Vite 7).
- **Styling**: Tailwind CSS v4 with Framer Motion for scroll-driven animations.
- **3D Engine**: `react-three-fiber` + `drei` for surgical WebGL implementation (OrbitControls, parallax scenes).
- **Routing**: Clean SEO-ready URLs (`/product/:slug`, `/category/:slug`, `/guides/:slug`, `/deals`).
- **Data Layer**: Abstracted hooks (`useProducts`, `useDeals`, `useCategories`) consuming typed local mock data.
- **Optimization**: Lazy-loaded 3D scenes, `prefers-reduced-motion` support, and mobile-safe fallbacks.

## Execution Plan

### 1. Foundation & Design System
- Configure Tailwind v4 with custom OKLCH tokens in `src/styles.css`.
- Set up global `Framer Motion` transitions and `shadcn` base primitives.
- Implement the abstracted mock data layer in `src/lib/data`.

### 2. Layout & Navigation
- Build a premium `__root.tsx` with a minimal, responsive navigation bar.
- Create the `/affiliate-disclosure` page and global footer with legal compliance.

### 3. Discovery Components (The UI Core)
- **Product Cards**: Implement 3D-tilt hover effects and merchant badges.
- **Hero Search**: Build a "flagship" search bar with live mock suggestions.
- **Category Tiles**: Layered image compositions with parallax.

### 4. 3D Presentation Layer
- Build a reusable `ProductViewer3D` component using `react-three-fiber`.
- Create the homepage hero scene with ambient floating silhouettes.
- Implement capability detection for mobile/low-end device fallbacks.

### 5. Routing & Page Content
- **Homepage**: Hero search + Trending/Deals asymmetric grids.
- **Product Detail**: Split hero (3D/Image) + Scroll-driven editorial sections + Affiliate CTA.
- **Deals Page**: Multi-dimensional filtering (Price AND Discount) with URL state sync.
- **Buying Guides**: Article layout with embedded product recommendation cards.

### 6. SEO & Performance
- Add unique `head()` metadata for every content route.
- Ensure all 3D scenes are code-split and lazy-loaded.

## User Review Required

- **3D Assets**: Are there specific products or categories you'd like me to prioritize for the initial 3D mock entries?
- **Brand Name**: Do you have a preferred name for the platform (to replace "Lovable App")?
- **Affiliate Disclosure**: Should I use a standard placeholder text or do you have a specific legal blurb ready?
