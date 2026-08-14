# Phase 2 Production Functionality Fix

Convert the current Admin Panel from a visual prototype into a real operational system powered by Lovable Cloud and TinyFish.

## User Experience
- **Secure Admin Entry**: Dedicated login at `/admin/login` with persistent sessions.
- **Real-time Command Center**: Live metrics and intelligence signals replacing all mock data.
- **Intelligence Pipeline**: Fully operational research engine using TinyFish API (Search, Fetch, Agent).
- **Integrated CMS**: Products, Deals, and Guides managed through a database-backed workflow.

## Technical Details
- **Authentication**: Implementing Supabase Auth for `/admin` routes.
- **Database Architecture**:
  - `products`, `categories`, `deals`, `guides` tables with RLS and `private.has_role` guards.
  - `research_jobs` and `intelligence_signals` for tracking TinyFish outcomes.
  - `settings` table (server-side only) for secure TinyFish API key storage.
- **Server Functions**:
  - `tinyfish.functions.ts`: Secure server-side execution of research tasks.
  - `admin.functions.ts`: CRUD operations for CMS entities.
- **TinyFish Integration**:
  - `src/server/services/tinyfish/client.server.ts` updated to handle real API requests.
  - Connection testing and status monitoring in Admin Settings.

## Workflow
1. **Infrastructure**: Database schema and RLS policies (Applied).
2. **Authentication**: Implement `/admin/login` and route guards.
3. **TinyFish Setup**: Create secure settings management for the API key.
4. **Research Engine**: Convert mock jobs into real asynchronous tasks.
5. **Intelligence UI**: Bind `/admin/intelligence/*` routes to live signals.
6. **CMS Full Implementation**: Connect all Add/Edit/Preview/Publish buttons to the database.
7. **End-to-End Validation**: Audit every button and state transition.
