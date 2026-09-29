/**
 * ============================================================================
 * LifeLink Smart Healthcare Assistance Platform
 * React 19 Application Root & Provider Pipeline (v1.3.0)
 * ============================================================================
 *
 * Core frontend architecture:
 * - TanStack React Query client with fast-fail retry policies
 * - tRPC batch HTTP link with superjson serialization
 * - ThemeContext for clinical dark/light mode switching
 * - StrictMode root mounting
 * ============================================================================
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";               // TanStack React Query cache and provider
import { httpBatchLink } from "@trpc/client";                                              // tRPC HTTP batch network link
import React from "react";                                                                 // React library
import ReactDOM from "react-dom/client";                                                   // React DOM root renderer
import superjson from "superjson";                                                         // Superjson serializer supporting complex types
import App from "./App.tsx";                                                               // Root application router component
import { ThemeProvider } from "./context/ThemeContext.tsx";                                // Dark/light mode theme provider
import "./index.css";                                                                      // Global Swiss Clinical Humanist CSS styles and animations
import { trpc } from "./lib/trpc";                                                         // Type-safe tRPC React hooks

// STEP 1: Initialize TanStack Query Client with intelligent caching and fast-fail policy
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,                                                                        // Fail fast without continuous retries on network error
      refetchOnWindowFocus: false,                                                         // Prevent unwanted refetches when switching browser tabs
      staleTime: 60 * 1000,                                                                // Retain data freshness for 1 minute for instant tab switching
      gcTime: 5 * 60 * 1000,                                                               // Cache inactive query data for 5 minutes
    }
  },
});

// STEP 2: Configure tRPC batch client pointing to local Express API server
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",                                                                    // Relative URL routing to Express backend
      transformer: superjson,                                                              // Preserve JavaScript Date objects across HTTP boundary
      // Ensure cross-origin or local cookie headers are passed for session verification
      fetch: (url, options) => fetch(url, { ...options, credentials: "include" })          // Send HTTP-only session cookies with every request
    })
  ],
});

// Mount the React tree into the root DOM element
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>,
);
