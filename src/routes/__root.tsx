import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { SpatialProvider } from "../components/spatial/SpatialProvider";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SpatialFind | Premium Discovery & Affiliate Platform" },
      { name: "description", content: "A next-generation discovery platform featuring spatial depth, expert curation, and premium product exploration." },
      { name: "author", content: "SpatialFind" },
      { property: "og:title", content: "SpatialFind | Premium Discovery & Affiliate Platform" },
      { property: "og:description", content: "A next-generation discovery platform featuring spatial depth, expert curation, and premium product exploration." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "SpatialFind" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@SpatialFind" },
      { name: "twitter:title", content: "SpatialFind | Premium Discovery & Affiliate Platform" },
      { name: "twitter:description", content: "A next-generation discovery platform featuring spatial depth, expert curation, and premium product exploration." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { pathname } = useRouterState({ select: (s) => s.location });
  const isAdmin = pathname.startsWith('/admin');

  return (
    <QueryClientProvider client={queryClient}>
      <SpatialProvider>
        {isAdmin ? (
          <Outlet />
        ) : (
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full glass border-b transition-all duration-300">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                  SPATIAL<span className="text-muted-foreground font-light">FIND</span>
                </Link>
                
                <nav className="hidden md:flex items-center gap-8">
                  <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Discover</Link>
                  <Link to="/deals" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1.5">
                    Deals <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold">HOT</span>
                  </Link>
                  <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Categories</Link>
                  <Link to="/guides" className="text-sm font-medium hover:text-primary transition-colors">Guides</Link>
                </nav>
                
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-accent rounded-full transition-colors" aria-label="Search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </button>
                  <button className="md:hidden p-2 hover:bg-accent rounded-full transition-colors" aria-label="Menu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            </header>

            <main className="flex-1">
              <Outlet />
            </main>

            <footer className="py-12 border-t bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold tracking-tighter">SPATIALFIND</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Discover something worth buying. Expert curation meeting spatial product exploration.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Platform</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><Link to="/">Trending</Link></li>
                      <li><Link to="/deals">Hot Deals</Link></li>
                      <li><Link to="/guides">Guides</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Categories</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><Link to="/">Computers</Link></li>
                      <li><Link to="/">Gaming</Link></li>
                      <li><Link to="/">Audio</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><Link to="/affiliate-disclosure">Affiliate Disclosure</Link></li>
                      <li><Link to="/">Privacy Policy</Link></li>
                    </ul>
                  </div>
                </div>
                <div className="pt-8 border-t text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <p>© 2026 SpatialFind. All rights reserved.</p>
                    <Link to="/admin" className="text-slate-500 hover:text-slate-400 transition-colors">Admin Console</Link>
                  </div>
                  <p className="max-w-md">
                    SpatialFind is a participant in the Amazon Services LLC Associates Program and other affiliate programs.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        )}
      </SpatialProvider>
    </QueryClientProvider>
  );
}

