# PHASE 1 — A 3D-FIRST, SPATIAL PRODUCT DISCOVERY PLATFORM (FINAL)

Build a completely new, premium product-discovery and affiliate-commerce website.

This is **NOT** a blog, **NOT** a generic affiliate template, **NOT** a basic e-commerce clone, and **NOT** an Amazon/Flipkart lookalike.

This is a next-generation **product discovery platform**. Products are manually sourced from Amazon, Flipkart, and other merchants. Revenue comes entirely from affiliate click-throughs — every "buy" action is an outbound link to the merchant's site. There is **no cart, no checkout, no payment processing**, in this phase or any future phase of this site.

## THE SINGLE MOST IMPORTANT REQUIREMENT

**A page that contains a 3D object is NOT automatically a 3D page.**

Every major public-facing route — Homepage, Search, Deals, Categories, individual Category pages, Product Detail, Buying Guides, and individual Guide pages — must independently feel spatial, interactive, and premium, through spatial composition, depth, motion, perspective, layered presentation, and/or meaningful 3D interaction woven into the actual UX of that page. Not one page is allowed to fall back to:

Header → title → filter bar → ordinary card grid → footer.

Generic e-commerce layout must never become the default architecture for an internal page, no matter how strong the homepage turns out. The homepage is not allowed to receive disproportionately more design attention than the rest of the site — treat Homepage, Product Detail, Deals, Category, Search, and Buying Guide as six co-equal flagship experiences, not one showcase page plus five utility pages.

**The formal test, applied to every major route before Phase 1 is considered done:** "Would this page still look and behave like a conventional website if the 3D objects were removed?" If yes, that page has failed and must be redesigned — not patched by inserting another 3D object into it. The fix is to improve the actual composition, interaction, and information architecture of the page, not to decorate a conventional layout further.

This does **not** mean WebGL everywhere. It means spatial thinking everywhere — depth, layering, camera, and physical presence in every part of the experience, expressed through the right technology for each specific interaction (Section 2).

---

## 0. TECH STACK

- **React + Vite + TypeScript**
- **Tailwind CSS** for styling — no inline styles, no scattered CSS files
- **shadcn/ui** for base primitives only (dialogs, sheets, dropdowns) — restyled to match the spatial design system, never left in default appearance
- **Framer Motion** for scroll-driven motion, layout transitions, shared-element transitions, and all non-WebGL spatial effects
- **react-three-fiber + drei** for true 3D scenes — orbit controls, lighting, environment maps, damping, instancing
- **React Router**, with clean SEO-ready URLs (`/product/:slug`, `/category/:slug`, `/guides/:slug`, `/deals`) and route-level transitions that preserve spatial continuity (Section 9)
- Local/mock TypeScript data for Phase 1, accessed only through data-layer hooks (`useProducts()`, `useDeals()`, `useCategories()`, `useGuides()`) so a future phase can swap in a real backend without touching any UI or 3D component

No Google Fonts — self-hosted or system/variable font stack. No Supabase, no backend, no authentication, no Admin/CMS in this phase (Section 21).

---

## 1. THE 3D / SPATIAL DESIGN SYSTEM (build this first, before any page)

Before building a single page, establish a reusable spatial design system that every subsequent section references. Do not let individual pages invent their own ad-hoc motion — everything routes through this system.

**Depth levels** (every visual element is explicitly assigned one):
- Far background (atmospheric, slow-moving or static)
- Background
- Midground
- Content plane (where text/UI primarily lives)
- Foreground
- Interactive foreground (objects the user can directly manipulate)

**Motion layers** (each depth level responds differently to each input):
- Ambient motion (idle, no user input — subtle, continuous, never distracting)
- Cursor response (desktop pointer-driven parallax/tilt)
- Scroll response (position-driven camera/object/layer movement)
- Direct interaction (drag, click, hover)
- Product interaction (orbit, zoom, inspect)
- Page/route transition (Section 9)

**Spatial properties tracked per object**: scale, depth (z-position), perspective, rotation, lighting response, shadow relationship. Define these as a shared TypeScript config/theme (e.g. `spatial.config.ts`) — depth values, easing curves, camera FOV defaults, parallax multipliers per layer — imported everywhere, not re-invented per component.

**Technology selection rule** (apply this everywhere in the app):
- Use **react-three-fiber/WebGL** only where true 3D geometry, lighting, or camera control materially improves the experience (product hero scenes, orbit viewers, the homepage environment)
- Use **Framer Motion + CSS 3D transforms** for card depth, layered parallax, page transitions, and anywhere the effect is spatial but doesn't require actual 3D geometry
- Use static/optimized image fallbacks where appropriate, never as a lazy substitute for building the spatial treatment properly
- Never use WebGL for something that is functionally 2D UI with a shadow, and never skip real spatial treatment on a page just because it isn't the homepage

---

## 2. HOMEPAGE — A SEQUENCE OF SPATIAL SCENES, NOT STACKED SECTIONS

Reject the standard hero → cards → sections → footer structure entirely. Structure the homepage as a sequence of distinct spatial scenes the user moves *through*, each with its own depth composition, that hand off to one another with continuity rather than hard cuts.

**Opening scene (viewport 1):**
- A real react-three-fiber environment: product-inspired geometry or abstracted product silhouettes positioned at different depths, with directional + ambient lighting and soft shadows
- Subtle idle camera motion (ambient layer) plus cursor-driven parallax (desktop) — restrained, never disorienting
- The search interface is composited *into* the 3D environment — positioned on the content plane with real depth relative to the scene behind it (shadow/lighting consistent with the environment), not an HTML box floating on top of a canvas
- Atmospheric depth: far-background elements move slower than foreground, real occlusion between layers where objects overlap

**As the user scrolls past the opening scene:**
- Camera perspective shifts subtly between scenes (not a hard section cut)
- 3D/graphic objects from the opening scene can recede into the background as the next scene's objects come into focus at the content plane
- Foreground/background depth relationships change deliberately as new sections take over
- Product information (trending products, deals, categories) enters as spatial overlays — elements arrive from depth (scaling/translating from background toward content plane) rather than simple fade-ins

**Section order**, each treated as its own spatial scene with a distinct but system-consistent composition:
1. Opening 3D environment + integrated search
2. Trending Products — Product Spotlight / Recommendation Scene component (Section 11)
3. Today's Deals / Biggest Discounts — Deal Spotlight component
4. Shop by Category — Category World showcase (Section 6), not a grid
5. Recently Discovered — layered scene, clearly marked as demo/static logic
6. Recommended for You — Recommendation Scene, clearly marked as demo logic
7. Buying Guides teaser — editorial, lower motion intensity to signal a tonal shift toward reading

The homepage must not be the only page built to this standard — it is the *introduction* to the spatial system, and every route listed below must independently meet the same bar.

---

## 3. NAVIGATION — PART OF THE SAME WORLD

Primary items: Discover, Deals, Categories, Buying Guides — plus search and a deals indicator (e.g. live count).

The nav must feel physically connected to the environment it sits above, not like a generic SaaS navbar pasted on top of a 3D canvas:
- Real elevation/depth relative to page content, expressed through the shared spatial system (shadow, subtle blur-of-background, or scale) rather than a flat `position: fixed` bar with a drop shadow
- Scroll-state transformation: the nav's presence changes meaningfully as the user moves from the opening 3D scene into content-plane sections (e.g. nearly transparent/integrated at the top, gains solidity and depth once scrolled)
- Context-aware behavior appropriate to the route (e.g. category name/breadcrumb context surfaces in nav on category/product pages)
- Mobile nav is a slide-out or bottom sheet with its own entrance animation consistent with the motion system, not a generic hamburger drawer
- Breadcrumbs sit clearly and stably on the content plane, unaffected by background motion, since they are a wayfinding tool and must stay legible

---

## 4. SEARCH — A SPATIAL PRODUCT AND A FLAGSHIP PAGE

Search is a primary interaction and `/search` is a flagship route in its own right, not a basic results list.

**Search-as-interaction (site-wide):**
- Resting state: composited into the homepage 3D environment (Section 2)
- On focus: the environment subtly responds (e.g. depth-of-field shift, background recedes, lighting shifts toward the search plane) and the search surface expands
- Suggestions (categories, trending products, guides) appear as distinct spatial groups, animating into place from depth rather than snapping into a flat dropdown

**`/search` results page:**
- Spatial result grouping: products, categories, and buying guides are visually distinct groups with their own composition, not one undifferentiated list
- Results use the same Product Stage / card / spotlight components as the rest of the site (Section 11), animating into position from depth as they resolve
- Depth-aware filtering: refining results causes non-matches to recede and new matches to arrive, consistent with the Deals page's filter behavior (Section 5)
- A strong, designed empty state (no generic "No results found" text block) that still fits the spatial system and offers a next step (browse categories, trending products)
- All matching is against the local mock data layer (name, brand, category, tags) — no external APIs, no scraping, no fabricated live pricing

---

## 5. DEALS — A LIVE DEAL ENVIRONMENT

`/deals` is a flagship route and must feel like entering a dedicated discovery environment — never filters placed above a plain grid.

- A deal hero/spotlight scene at the top: one strongly discounted product presented with maximum visual emphasis (reuses the Deal Spotlight component, Section 11)
- Visual hierarchy clearly separates discount tiers (20%+ through 70%+ OFF) — stronger visual weight/emphasis as discount increases, expressed through the design system's depth/lighting/scale tools, not through color alone, and never through fake urgency or fake scarcity language
- Price-ceiling filters (Under ₹999 through ₹49,999) and discount filters are interactive spatial controls — pill/chip selectors with real state transitions (active state pushes forward on the depth axis, inactive recedes), not `<select>` dropdowns
- Filters combine (price AND discount); changing a filter causes the product set to visibly and immediately respond — non-matching products recede/fade out on their depth layer, new matches arrive from background, not an instant flat re-render
- Filter state reflected in the URL as query params for shareability/SEO
- The grid that ultimately holds filtered results is surrounded by this spatial framing (spotlight, tier hierarchy, animated filter response) rather than being the primary experience on its own — per the no-generic-grid rule (Section 12)
- Strong, consistent "CHECK PRICE" CTA treatment carried through from the product card system (Section 7)

---

## 6. CATEGORY PAGES — DISTINCT PRODUCT WORLDS

Categories: Computers, PC Components, Gaming, Smartphones, TVs, Audio, Air Conditioners, Refrigerators, Home & Kitchen, Appliances, Furniture, Accessories, Tools, Wearables.

**On the homepage**, "Shop by Category" is a spatial showcase (Category World component, Section 11): category tiles composed with real product imagery at layered depths (foreground product cutout, midground category label/typography, background atmospheric imagery), each with independent parallax response — not a flat icon grid, not uniform cards in a row.

**Each category's own page** (`/category/:slug`) is a flagship route with a distinct visual identity, while staying inside the same shared system:
- An animated category introduction (brief, restrained — objects/imagery arriving into the scene) — never just a page title
- A distinct atmospheric background, product arrangement style, and hero treatment per category, so Computers, Gaming, Home Appliances, TVs, Audio, and PC Components feel like different worlds sharing one design language, not one template with a swapped label
- Products entering the viewport with controlled depth as the user scrolls (staggered, from background toward content plane), never all at once
- A spatial filter/sort control (same interaction language as Deals, Section 5), not a `<select>`
- Any product grid on this page is framed by the spatial introduction and depth-aware interaction around it — the grid is never the whole page (Section 12)
- Category-to-category or category-to-product transitions use the shared transition system (Section 9)

---

## 7. PRODUCT CARDS — PHYSICAL OBJECTS, NOT FLAT CARDS

Every product card shows: image, name, current price, original/MRP price (strikethrough), discount %, rating, category tag, merchant badge, deal status badge, and a "View Deal" CTA — but the *presentation* of that information is spatial:

- Product image and card container respond independently on interaction (the image has its own depth plane, subtly separate from the card's shadow/edge plane)
- On hover (desktop): controlled perspective shift/tilt tracking cursor position (restrained — a few degrees, not a dramatic flip), dynamic shadow that grows with the implied lift off the surface, a lighting/highlight response consistent with the card "moving toward" the user
- Information layers (price, discount badge, CTA) sit at very slightly different depths so the hierarchy is felt, not just styled — discount badge and CTA read as closer to the user than the base card
- CTA visually moves forward in the hierarchy on hover/focus (scale + depth, not just a color change)
- No excessive spinning, no full 360° rotation gimmicks — the goal is premium spatial interaction, not a toy
- Touch devices: skip hover-only states, keep key info always visible, replace tilt with a subtle press/lift response on tap

---

## 8. PRODUCT DETAIL PAGE — THE MOST ADVANCED PAGE ON THE SITE

This page is the flagship 3D experience and must treat the product as occupying real visual space, not appearing as an image inside a standard card.

**Where a 3D asset (`threeDAsset`) exists:**
- A real, interactive react-three-fiber product viewer: orbit (drag to rotate), pinch/scroll to zoom, smooth camera damping, directional + ambient + environment lighting, soft shadows, reflections/roughness/metalness appropriate to the actual product material (Section 12 of the design system — a phone screen is not the same material as a fabric sofa)
- A reset-camera control and an expanded/fullscreen viewing mode
- Optional contextual spec hotspots/markers positioned spatially around the product (e.g. for an SSD: "1TB," "PCIe NVMe," "High-speed storage"), connected visually to the relevant area of the product — a small, curated set, never overloading the scene
- Camera motion is smooth and bounded — it must never move in a way that risks disorientation or motion sickness, and text must remain legible throughout any camera movement

**Where no real 3D model exists — solve this properly, do not fake it:**
- Never display an empty WebGL canvas, a generic cube or sphere, an unrelated abstract shape, or any placeholder that has visibly nothing to do with the actual product
- Build a reusable **procedural 3D product presentation system** using Three.js primitives for common product archetypes — SSDs, smartphones, monitors, TVs, headphones, laptops, keyboards, PC components, and similar categories can use simplified procedural geometry, proportioned and shaped to clearly read as "a laptop," "a pair of headphones," etc. This must never be presented as, or visually confused with, the exact real product unless it genuinely is the real model — it exists to prove out and exercise the 3D system in Phase 1 and is designed to be swapped for real GLB/GLTF assets later without any architecture change
- Where procedural geometry isn't a good fit, or as the default 2D-asset fallback, build a high-quality **spatial** product presentation instead of a flat photo: product cutout/render, multiple depth layers, perspective, directional lighting, a shadow plane, an atmospheric background consistent with the product's category, parallax, and subtle camera-like movement on scroll
- Add further product-focused interaction beyond the base image where a full 3D asset isn't present: layered gallery with depth, perspective movement, scroll-based product transformation, a specification reveal interaction, and spatial comparison against alternatives — the product must still feel like the centerpiece of the page, whichever path is used

**Below the hero**, scroll-driven sections (Why This Product?, Key Features, Who Should Buy It?, What Makes It Interesting?, Price/Deal, Specifications, Alternatives, Related Products, Related Guides), each entering with depth-aware motion consistent with the rest of the system — not a generic fade-up applied uniformly to every section.

**Primary CTA**: "CHECK LATEST PRICE" → `product.affiliateUrl` (placeholder for Phase 1), opens in a new tab, with a clearly visible affiliate disclosure directly beside/beneath it ("We may earn a commission from this link, at no extra cost to you") — required by Amazon Associates and Flipkart Affiliate program terms, not optional. Add a permanent `/affiliate-disclosure` page linked site-wide.

---

## 9. PAGE / ROUTE TRANSITIONS — ONE CONTINUOUS ENVIRONMENT

Navigating Home → Product, Category → Product, Deals → Product, Search → Product, or Guide → Product must never be an instant page swap.

- Shared-element continuity for the product image/visual: the same visual object appears to travel from its position in the originating grid/card/spotlight into its position in the destination hero (Framer Motion layout animations / shared layoutId patterns)
- Transitions read as spatial zoom or camera movement — depth-consistent translation and scale, not a generic fade or slide
- Keep transitions fast and purposeful (roughly 300–500ms) — the goal is continuity, not a showcase of the transition itself
- Respect `prefers-reduced-motion`: replace with a fast, simple cross-fade, no shared-element travel

---

## 10. SCROLL SYSTEM

Scroll position is a primary design input across the whole site, not just the homepage:

- Camera-like movement, object translation through depth, and scale changes are used deliberately on scroll-heavy pages: homepage, category pages, deals, search, product detail, and guide pages
- Not every section moves — motion has hierarchy. A small number of scenes carry real camera/depth movement; supporting content (specs tables, text-heavy sections) uses simpler, calmer reveal motion so it stays easy to read
- The site should feel designed around scroll from the start on every route, not have scroll effects patched on afterward, and not have scroll effects concentrated only on the homepage while internal pages scroll like a static document

---

## 11. REUSABLE SHOWCASE COMPONENTS — THE SHARED SYSTEM EVERY PAGE IS BUILT FROM

Do not implement unrelated one-off animations per page. Build this shared component system once and assemble every major route from it, so quality is structurally consistent rather than dependent on how much attention any one page happened to get:

- **Product Spotlight** — one large hero product + floating spec information (homepage, guides)
- **Product Stage** — the general-purpose spatial staging area for presenting a single product with depth (used within Product Detail and elsewhere)
- **Product Viewer** — the react-three-fiber orbit/zoom/damping viewer used for real 3D assets and procedural fallbacks alike (Section 8)
- **Product Comparison** — multiple products arranged spatially at different depths/positions for side-by-side consideration (Alternatives section, guides, search)
- **Deal Spotlight** — one strongly discounted product with maximum visual emphasis (homepage, deals)
- **Category World** — the distinct-per-category showcase composition (homepage category section, category pages)
- **Recommendation Scene** — recommended/related products as a spatial collection (homepage, product detail, search)
- **Spatial Search Results** — the grouped, depth-aware results presentation (search page)
- **Guide Showcase** — the editorial-but-spatial presentation used for buying guides (Section 12)
- **3D Scene Container** — the shared lazy-loaded, disposal-aware wrapper every WebGL scene mounts inside
- **Depth-aware Cards** — the base product card system (Section 7)
- **Spatial Filters** — the pill/chip depth-responsive filter controls (deals, category, search)
- **Shared Product Transitions** — the layoutId-based transition system (Section 9)

Every major route (Homepage, Search, Deals, Category, Product Detail, Buying Guides) must be assembled from these shared components, not bespoke one-off page code — this is what prevents any single page from quietly degrading to a generic layout.

---

## 12. BUYING GUIDES — EDITORIAL, INTERACTIVE, PRODUCT-DRIVEN, NOT A BLOG

This website is not a blog, and buying guides must not read like blog posts.

- Large visual opening for each guide (`/guides/:slug`) — not a plain title + hero image
- Embedded Product Spotlight / Product Stage scenes for featured products within the guide content, not static images pasted into prose
- Spatial comparison sections when the guide compares multiple products (reuses Product Comparison, Section 11)
- Interactive recommendation blocks and visual specification comparisons where relevant
- Related Products and Related Categories sections using the same spatial component system as the rest of the site
- The `/guides` index page is itself a flagship route: a Guide Showcase presentation (Section 11), not a simple list of article cards
- Content must remain fully readable and crawlable: primary text content is present in the DOM and accessible regardless of motion state — motion animates real, already-present content, it never gates or delays the content's existence in the page. Do not sacrifice accessibility or SEO-crawlability for visual effect anywhere in the guides system.

---

## 13. LIGHTING & MATERIALS (for real and procedural 3D assets)

Where actual or procedural 3D geometry is rendered: use directional lighting, ambient lighting, and environment lighting together; soft shadows; reflections, roughness, and metalness set appropriately per product type (electronics vs. fabric vs. plastic vs. glass should visibly differ). Do not apply a uniform glossy/showroom material to every product regardless of what it actually is — materials should read as belonging to the real object, including for procedural placeholder geometry.

---

## 14. CAMERA SYSTEM

Build a shared, reusable camera architecture (not per-component bespoke camera code):

- Controlled perspective and FOV defaults from the spatial config (Section 1)
- Smooth, damped transitions between camera states (scene-to-scene, product inspection, reset)
- Distinct desktop and mobile camera configurations (narrower FOV / simplified movement on mobile)
- Hard constraint: camera motion must never impair readability of text or risk motion sickness — bound rotation/movement ranges, avoid rapid or extreme moves, and always allow a "reset" back to a calm default view

---

## 15. PHYSICALITY IN INTERACTION

Interfaces should communicate weight, depth, momentum, proximity, and hierarchy — expressed consistently through the spatial design system, e.g.:

- A hovered product card moves subtly toward the user (scale + depth), not just brightens
- A CTA visually advances into the foreground when it becomes the primary action
- A product inspected in 3D rotates with damping that implies real mass, not instant snapping
- As one category/product comes into focus, a previous one recedes rather than simply disappearing

---

## 16. VISUAL LANGUAGE CONSTRAINTS

Rely primarily on composition, typography, depth, lighting, negative space, real product imagery, and controlled spatial movement to create the premium feel.

**Do not** default to glassmorphism, blur panels, glowing neon borders, or gradient-as-depth as the primary tools — these can appear sparingly and deliberately (e.g. a single subtle glass surface for the search bar), never as the site's main way of implying depth. Depth should come from actual spatial composition and lighting, not blur-and-transparency tricks standing in for it.

---

## 17. THE "NO GENERIC GRID" RULE

Product grids may exist when they are genuinely useful for browsing — but a plain grid must never be the *primary* experience of any major page.

Wherever a grid is used (Deals, Category, Search, Guides), it must be surrounded by:
- A spatial introduction or spotlight scene
- Depth-aware interaction (filters, transitions, hover response) consistent with Sections 5–8
- Strong visual hierarchy distinguishing featured/high-discount/recommended items from the rest
- Appropriate transitions into and out of the grid
- Contextual recommendations or related content nearby

The user should never feel like they are browsing a basic affiliate catalog — the grid is a component within a designed scene, not the page itself.

---

## 18. PRODUCT DISCOVERY IS STILL THE POINT

All of the above exists to serve, not distract from, the discovery funnel: Discover → Explore → Interact → Understand → Compare → Desire → Check Price → Merchant.

No fake scarcity, no fabricated discounts, no fabricated reviews, no fabricated real-time pricing. The spatial/3D system makes genuine products more compelling to explore — it never substitutes for or exaggerates the actual deal.

---

## 19. DATA MODELS

**Product:** id, slug, name, brand, category, description, price, originalPrice, discountPercent, rating, merchant, affiliateUrl, productImage, threeDAsset (nullable — the app must render fully and beautifully without it, per Section 8's procedural/spatial fallback system), specifications, features, tags, published, createdAt, updatedAt

**Category:** id, name, slug, description, image, parentCategory (nullable)

**Deal:** id, productId, discountPercent, price, previousPrice, merchant, affiliateUrl, expiresAt, published

**Guide:** id, title, slug, excerpt, content, category, featuredImage, published

Seed mock data with realistic placeholder entries across multiple categories. Include a meaningful number of products *with* a `threeDAsset` set (so the orbit viewer has real content to prove out) and a meaningful number *without* (so the procedural-geometry and spatial-fallback paths, not just the true-3D path, get properly built, exercised, and visually polished — not treated as a lesser-effort code path).

---

## 20. PERFORMANCE (non-negotiable)

A visually striking 3D site that runs badly fails its own purpose. Do not interpret any requirement above as "put everything into WebGL" — use react-three-fiber/Three.js only for actual 3D geometry, use Framer Motion/CSS 3D/layered imagery for spatial effects that don't require real geometry, and use static/optimized fallbacks where genuinely appropriate.

- Lazy-load and code-split every 3D component via the shared 3D Scene Container (Section 11); nothing WebGL-related is in the initial bundle for pages that don't need it
- Dispose Three.js resources correctly on unmount (geometries, materials, textures)
- Use instancing where multiple similar objects appear in one scene
- Reduce polygon complexity and use compressed/optimized textures wherever practical, especially for procedural geometry, which should stay deliberately low-poly and lightweight
- Never run a hidden/off-screen scene — pause or unmount 3D scenes that scroll out of view
- Respect `prefers-reduced-motion` sitewide: disable ambient/idle motion and auto-camera movement, keep only explicit user-initiated interaction
- Scrolling must stay smooth and responsive at all times, on every route, even pages with heavy scroll-driven motion
- The homepage opening scene in particular must be profiled and kept lightweight — it's the highest-traffic, highest-stakes moment for performance, but every flagship route (Section 2 list) must meet the same performance bar, not just the homepage

---

## 21. MOBILE — A REAL SPATIAL EXPERIENCE, NOT 3D REMOVED

Do not simply strip 3D on mobile and ship a flat fallback everywhere.

- Where full WebGL is too costly, replace with layered-depth Framer Motion/CSS-3D compositions (image layers + parallax + shadow), not a static image
- Use lighter 3D assets/geometry where WebGL is retained (e.g. the product orbit viewer can stay on mobile with a lower-poly real or procedural asset and simplified lighting)
- Touch interaction replaces cursor-driven parallax (drag-to-orbit, tap-to-inspect, scroll-driven depth still applies)
- The mobile experience should be recognizably the same spatial product as desktop on every major route, scaled to the device's real capability — not a different, plainer site, and not a site where only the homepage received a mobile-spatial treatment

---

## 22. SEO FOUNDATION (unchanged in substance, still required)

Clean URLs, per-page titles/meta descriptions, Open Graph tags per product/category/guide, canonical URLs, single-`h1` heading hierarchy, breadcrumb structure matching visible breadcrumbs, routing structured for future sitemap generation. No fabricated SEO copy. Since content now enters scenes via motion/transform on every route, ensure primary text content is always present in the DOM and crawlable on every page — motion animates real content, it never injects or delays content's existence until after animation completes. This applies as strictly to Guides, Category, and Search pages as to the Homepage.

---

## 23. PHASE 1 BOUNDARIES — UNCHANGED

Do **not** build in this phase:
- Admin dashboard, CMS, or any product-management interface
- Supabase or any backend/database connection
- Authentication
- Cart, checkout, or payment processing of any kind
- External pricing APIs, scraping, or any fabricated real-time price data

Keep the data layer abstracted behind hooks (Section 0) precisely so a future Admin/CMS phase can connect a real backend without rewriting this frontend or its 3D/spatial system.

The site must not visually resemble Amazon, Flipkart, or any existing marketplace — original visual identity throughout, on every route.

---

## 24. FORMAL VISUAL QA GATE — REQUIRED BEFORE PHASE 1 IS CONSIDERED COMPLETE

Before declaring Phase 1 done, evaluate every one of the following routes independently against this question:

**"Would this page still look and behave like a conventional website if the 3D objects were removed?"**

- Homepage
- Search
- Deals
- Categories (index)
- Individual Category pages
- Product Detail
- Buying Guides (index)
- Individual Guide pages

If the answer is YES for any route: that route fails. Do not fix it by adding another 3D object to it — redesign its composition, interaction, and information architecture per the relevant section above. Phase 1 is not complete until every route on this list passes independently, at the same quality bar as the homepage.

---

## 25. ACCEPTANCE CRITERIA — PHASE 1 HAS FAILED IF:

- The result can be fairly described as "a normal website with a 3D hero"
- The result can be fairly described as "a premium website with some hover animations"
- The homepage is visually strong while any internal route (Search, Deals, Category, Product Detail, Guides) reads as a conventional website with filters over a grid
- Removing the 3D/spatial elements from any major route would leave essentially the same page underneath
- A product without a real `threeDAsset` is presented as an empty canvas, a generic cube/sphere, an unrelated abstract shape, or an otherwise obviously-placeholder 3D object
- Motion is decorative rather than structural — i.e. it could be deleted from a page without changing how discovery, comparison, or understanding a product actually works on that page
- The site is visually striking but slow, janky, or unusable on a mid-range mobile device, on any route
- WebGL is used somewhere it shouldn't be (flat UI dressed up as 3D) or avoided somewhere it should be present (the product detail hero when a 3D asset or a well-built procedural equivalent should exist)
- Buying guides read as blog posts, or grids on Deals/Category/Search pages are the primary experience of those pages rather than a component within a designed scene

Phase 1 succeeds only when the 3D/spatial system materially changes how discovery, product inspection, comparison, and navigation actually feel — across every major route, not just the homepage — not merely how the site looks on first load.

**Final quality target:** a premium interactive product showroom, discovery engine, and editorial recommendation platform — not an affiliate blog, not an Amazon clone, not a normal e-commerce site with 3D decorations, not a SaaS dashboard, and not a landing page with a Three.js hero bolted onto an otherwise ordinary website. The journey — Discover → Explore → Interact → Understand → Compare → Desire → Check Price → Merchant — should feel materially different from browsing an ordinary website, on every page the user lands on.