---
title: "Phase 2: TinyFish Product Intelligence + Admin Control Center"
description: "Implementation of the intelligence layer and admin dashboard for SpatialFind."
---

# Phase 2 Plan - Intelligence & Admin

## 1. Technical Foundation
- [ ] **TinyFish Service Layer**: Create `src/server/services/tinyfish/client.server.ts` to handle server-side search, fetch, and agent tasks.
- [ ] **Intelligence Data Layer**: Implement `src/lib/admin/data/intelligence.functions.ts` for server-side intelligence processing.
- [ ] **Authentication**: Setup a basic admin authentication gate (for Phase 2 development, using a shared secret or simple login).

## 2. Admin Dashboard (/admin)
- [ ] **Layout**: High-density "Intelligence Command Center" with sidebar navigation.
- [ ] **Overview**: Summary cards for "What should I look at today?" (Trending, Bestsellers, Deals).
- [ ] **Intelligence Sections**:
    - [ ] Most Selling / Bestselling Signals
    - [ ] Search Demand / Search Interest Signals
    - [ ] Trending / Rising Products
    - [ ] Biggest Discounts & Price Drops
    - [ ] Affiliate Opportunity Engine (Scoring)

## 3. Research Engine
- [ ] **Job Management**: `/admin/research` to launch and track research jobs.
- [ ] **Research Components**:
    - [ ] Quick Scan (Categories/Products)
    - [ ] Deep Product Research
    - [ ] Deep Category Research
- [ ] **Evidence Panel**: Detailed view of why a recommendation was made (sources, URLs, timestamps).

## 4. Product CMS & Approval Workflow
- [ ] **Approval Pipeline**: Discovered -> Recommended -> Admin Review -> Published.
- [ ] **Product Editor**: Manage 3D assets, descriptions, and manual affiliate URL entry.
- [ ] **Affiliate Management**: `/admin/affiliate-links` for multi-merchant support.

## 5. Integration
- [ ] **Data Sync**: Ensure the public Phase 1 site consumes data from the new intelligence-backed store (transitioning from mock to structured admin data).

## Technical Details
- **TinyFish**: Server-only integration via `createServerFn`.
- **UI**: Optimized for information density using shadcn/ui components but with a "Command Center" aesthetic.
- **Security**: Strict API key protection; no secrets in client bundles.
