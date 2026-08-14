# SEO Optimization Plan - SpatialFind

Implement unique SEO metadata (title, description, OG tags) for every content route to fix generic placeholders and improve search visibility.

## User Review Required

> [!IMPORTANT]
> The current metadata describes a community initiative app (Hearts United Online) which is incorrect for this spatial commerce platform. I will update all routes to reflect "SpatialFind".

## Proposed Changes

### 1. Root Layout (`src/routes/__root.tsx`)
- Update fallback title to "SpatialFind | Premium Discovery & Affiliate Platform"
- Update fallback description to "A next-generation discovery platform featuring spatial depth, expert curation, and premium product exploration."
- Set correct `twitter:card`, `og:type`, and `og:site_name`.

### 2. Homepage (`src/routes/index.tsx`)
- Implement `head()` function.
- Title: "SpatialFind | Discover Something Worth Buying"
- Description: "Explore manually curated premium products with 3D spatial depth. SpatialFind is an editorial magazine-style discovery platform for tech, gaming, and audio."

### 3. Product Detail (`src/routes/product.$slug.tsx`)
- Implement `head()` function using dynamic product data (name, brand, category).
- Title: "[Product Name] by [Brand] | SpatialFind Discovery"
- Description: "Expert review and 3D spatial exploration of the [Product Name]. See detailed specs and find the best prices."
- Set `og:image` to the product's featured image.

### 4. Deals Page (`src/routes/deals.tsx`)
- Implement `head()` function.
- Title: "Top Product Deals & Discounts | SpatialFind"
- Description: "Browse the best hand-picked deals on premium tech and lifestyle products. Save on expert-recommended items."

### 5. Guides Page (`src/routes/guides.tsx`)
- Implement `head()` function.
- Title: "Expert Buying Guides & Curated Collections | SpatialFind"
- Description: "Editorial deep-dives into the latest products. Read our buying guides to find the perfect gear for your needs."

### 6. Individual Guide Page (`src/routes/guides.$slug.tsx`)
- Implement `head()` function using dynamic guide data.
- Title: "[Guide Title] | SpatialFind Buying Guide"
- Description: "[Excerpt]"

### 7. Search & Affiliate Disclosure Pages
- Implement specific `head()` for `/search` and `/affiliate-disclosure`.

## Technical Details
- Use TanStack Router's `head` option in `createFileRoute`.
- Ensure `og:type` is `website` for standard pages and `article` for guides/products where appropriate.
- Verify all images use absolute URLs for social sharing.
