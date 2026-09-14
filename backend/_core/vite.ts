/**
 * ============================================================================
 * VITE SERVER BRIDGE & STATIC ASSET PIPELINE (backend/_core/vite.ts)
 * ============================================================================
 * 
 * WHAT THIS FILE DOES:
 * This file connects Vite (our frontend tool) with Express (our backend server)
 * in two distinct runtime modes:
 * 
 * 1. DEVELOPMENT MODE (`setupVite`):
 *    - Embeds Vite directly into Express as middleware.
 *    - Enables Hot Module Replacement (HMR) so code edits appear instantly in the browser.
 *    - Automatically transforms index.html and injects unique cache-busting IDs.
 * 
 * 2. PRODUCTION MODE (`serveStatic`):
 *    - Serves the pre-compiled frontend bundle from `dist/public`.
 *    - Sets a 1-year immutable cache header (`maxAge: 1y`) on content-hashed files (/assets/*)
 *      so browsers cache them permanently for zero-latency loading.
 *    - Forces HTML files (`index.html`) to revalidate (`no-cache, must-revalidate`) so users
 *      immediately get updates whenever a new version is released.
 */
import express, { type Express } from "express";                                        // Express application framework and types
import fs from "fs";                                                                        // Node file system module for reading built HTML files
import { type Server } from "http";                                                         // Node HTTP Server type for attaching WebSocket HMR
import { nanoid } from "nanoid";                                                            // Unique ID generator to invalidate script caching during HMR
import path from "path";                                                                    // Cross-platform filesystem path resolution
import { createServer as createViteServer } from "vite";                                    // Vite programmatic development server constructor
import viteConfig from "../../vite.config";                                                 // Base Vite configuration shared with frontend

// STEP 1: Configures and mounts Vite's development middleware directly into Express
export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,                                                                  // Embed Vite as middleware inside our existing Express server
    hmr: { server },                                                                       // Bind Hot Module Replacement WebSocket to the HTTP server
    allowedHosts: true as const,                                                           // Allow development tunneling and custom hosts
  };

  const vite = await createViteServer({                                                    // Create internal Vite dev instance
    ...viteConfig,                                                                         // Inherit aliases and plugins from vite.config.ts
    configFile: false,                                                                     // Disable redundant file loading
    server: serverOptions,                                                                 // Apply middleware and HMR settings
    appType: "custom",                                                                     // Custom SPA HTML handling
  });

  app.use(vite.middlewares);                                                               // Mount Vite asset compiler middleware on Express
  app.use("*", async (req, res, next) => {                                                 // Catch-all SPA route for dev HTML rendering
    const url = req.originalUrl;                                                           // Current requested URL path

    try {
      const clientTemplate = path.resolve(                                                 // Locate frontend index.html entry file
        import.meta.dirname,
        "../..",
        "frontend",
        "index.html"
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");                  // Read HTML template from disk on each request
      template = template.replace(                                                         // Add cache-busting timestamp ID to main.tsx
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);                           // Transform HTML with Vite plugins and scripts
      res.status(200).set({ "Content-Type": "text/html" }).end(page);                      // Send rendered HTML back to browser
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);                                                   // Correct source map line numbers on server errors
      next(e);                                                                             // Pass error down to Express error handler
    }
  });
}

// Serves the pre-built static production bundle created by `vite build`
export function serveStatic(app: Express) {
  const distPath =                                                                         // Determine public distribution directory path
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {                                                          // Warn if build artifacts are missing
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // Immutable long-term caching for content-hashed assets (CSS, JS, chunks)
  const assetsPath = path.resolve(distPath, "assets");
  if (fs.existsSync(assetsPath)) {
    app.use(
      "/assets",
      express.static(assetsPath, {
        maxAge: "1y",
        immutable: true,
        index: false,
      })
    );
  }

  // General static file serving with HTML revalidation policy
  app.use(
    express.static(distPath, {
      maxAge: "1h",
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, must-revalidate");
        }
      },
    })
  );

  // Fallback route: serve index.html for any client-side routes (SPA router support)
  app.use("*", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    res.sendFile(path.resolve(distPath, "index.html"));                                    // Stream index.html for client-side routing
  });
}
