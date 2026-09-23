/**
 * ============================================================================
 * SYSTEM CORE & INFRASTRUCTURE
 * ============================================================================
 *
 * WHY THIS FILE IS SPECIAL:
 * These are the foundational building blocks of the backend server.
 * It sets up the Express framework, cookie parsing, and environment variables.
 * Without this core infrastructure, the application cannot boot or talk to the internet securely.
 */
import "dotenv/config";                                          // Load secret environment variables from .env into process.env
import express from "express";                                   // Express web framework for routing and middleware
import path from "node:path";                                    // Node.js path utility for cross-platform directory paths
import { createServer } from "http";                             // Node.js built-in HTTP server module
import net from "net";                                           // Node.js network module for socket probing
import { createExpressMiddleware } from "@trpc/server/adapters/express"; // Bridge connecting tRPC router to Express HTTP pipeline

import { appRouter } from "../routers";                           // Master tRPC API router containing all procedures
import { createContext } from "./context";                       // Request context extractor (reads cookies and auth sessions)
import { serveStatic, setupVite } from "./vite";                 // Helpers for serving frontend assets
import { registerDoctorRealtimeRoute, registerPatientRealtimeRoute } from "../realtime/patientRealtime"; // Server-Sent Events (SSE) live updates
import { registerProviderAuthRoutes } from "../auth/providerAuth"; // Google OAuth login callback routes
import { registerPatientProfilePhotoRoute } from "../profilePhoto"; // Multer file upload endpoint for user avatar photos

// --- Cluster: Port Liveness Prober ---
// Checks if a specific network port is free or currently in use by another program
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();                           // Create a test socket server
    server.listen(port, "0.0.0.0", () => {
      server.close(() => resolve(true));                         // Port is free and available!
    });
    server.on("error", () => resolve(false));                    // Port is busy / occupied
  });
}

// Scans up to 5 consecutive ports starting from startPort to find a free port
async function findAvailablePort(startPort: number = 4000): Promise<number> {
  for (let port = startPort; port < startPort + 5; port++) {
    if (await isPortAvailable(port)) {
      return port;                                               // Return the first available open port
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

// --- Cluster: Master Server Bootstrap ---
async function startServer() {
  const app = express();                                         // 1. Initialize Express application instance
  const server = createServer(app);                              // 2. Wrap Express in Node's HTTP server

  // Configure body parsers with a generous 50MB limit for medical reports, scans, and photos
  app.use(express.json({ limit: "50mb" }));                      // Parse incoming JSON request bodies
  app.use(express.urlencoded({ limit: "50mb", extended: true }));// Parse URL-encoded form submissions

  // Register dedicated REST and real-time streaming routes outside of tRPC
  registerProviderAuthRoutes(app);                               // Mounts /api/auth/google OAuth endpoints
  registerPatientRealtimeRoute(app);                             // Mounts /api/realtime/patient Server-Sent Events stream
  registerDoctorRealtimeRoute(app);                              // Mounts /api/realtime/doctor Server-Sent Events stream
  registerPatientProfilePhotoRoute(app);                         // Mounts /api/patient/profile/photo upload handler

  // Serve uploaded profile pictures and files statically from the local /uploads directory
  app.use("/uploads", express.static(path.resolve(process.cwd(), 'uploads')));

  // Direct health check endpoint for cloud load balancers and Render health checks
  app.get(["/health", "/api/health"], (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: Date.now() });
  });

  // --- Cluster: tRPC Middleware Mounting ---
  // Connects our type-safe tRPC API router to the /api/trpc endpoint
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,                                         // Connect the master tRPC procedure router
      createContext,                                             // Injects user and doctor session cookies into each request
    })
  );

  // In development mode, Vite runs alongside Express; in production, Express serves compiled HTML/JS
  if (process.env.NODE_ENV === "development" && process.env.EMBED_VITE === "true") {
    await setupVite(app, server);                                // Connects Vite development server middleware
  } else if (process.env.NODE_ENV === "production" || !process.env.NODE_ENV) {
    serveStatic(app);                                            // Serves optimized production build from dist/public
  } else {
    // Helpful landing page when visiting the backend port directly in a browser
    app.get("/", (_req, res) => {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>LifeLink API Server</title></head>
          <body style="font-family: system-ui, sans-serif; padding: 40px; background: #E6F9FC; color: #102B2D; text-align: center;">
            <h1 style="color: #00C4CC; margin-bottom: 8px;">LifeLink Backend API Server</h1>
            <p style="font-size: 1.1rem; color: #2D9D9C;">Running on port ${process.env.PORT || 4000}</p>
            <p style="margin-top: 24px;">Open the frontend application at: <br/><a href="http://localhost:5173" style="display: inline-block; margin-top: 12px; padding: 12px 24px; background: #00C4CC; color: #FFF; text-decoration: none; border-radius: 12px; font-weight: bold;">http://localhost:5173</a></p>
          </body>
        </html>
      `);
    });
  }

  const preferredPort = parseInt(process.env.PORT || "4000", 10); // Check configured port from .env or default to 4000
  let currentPort = preferredPort;

  // Gracefully handle any unexpected socket error during listen
  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`[Backend] Port ${currentPort} is busy (EADDRINUSE), retrying on port ${currentPort + 1}...`);
      currentPort++;
      if (currentPort <= preferredPort + 5) {
        server.listen(currentPort, "0.0.0.0");
      } else {
        console.error(`[Backend Fatal] Exhausted port range ${preferredPort}–${preferredPort + 5}.`);
      }
    } else {
      console.error("[Backend Server Error]", err);
    }
  });

  // Begin listening for incoming HTTP connections
  server.listen(preferredPort, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${currentPort}/`);  // Confirmation log when server is ready
  });
}

startServer().catch(console.error);                               // Start server and catch any fatal startup errors
