/**
 * ============================================================================
 * LIFELINK LOCAL DEV RUNNER (scripts/dev.mjs)
 * ============================================================================
 *
 * HOW TO RUN LOCALLY IN TERMINAL:
 * Command: `npm run dev`
 *
 * WHAT THIS SCRIPT DOES:
 * 1. Port Discovery:
 *    - Backend: Checks range 4000-4004 (preferred 4000).
 *    - Frontend: Checks range 5173-5177 (preferred 5173).
 * 2. Independent Two-Process Spawning:
 *    - Backend API: Spawns `cross-env NODE_ENV=development tsx watch backend/_core/index.ts`.
 *    - Frontend Dev Server: Spawns `node node_modules/vite/bin/vite.js --port <FRONTEND_PORT>`.
 *      (Direct local execution eliminates npx cache lookup latency and Windows batch job prompts).
 *    - Note: Drizzle Studio is decoupled; run `npm run db:studio` separately when needed.
 * 3. Dynamic Port Passing & Connectivity:
 *    - Automatically passes the discovered backend port via PORT and VITE_API_PORT.
 *    - Ensures reverse proxy seamlessly forwards /api and /uploads from frontend to backend.
 * 4. Safe Child Process Lifecycle:
 *    - Clean Ctrl+C shutdown targeting only spawned child processes without global taskkill.
 */
import { execSync, spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import net from "node:net";
import "dotenv/config";

// Configured default port (legacy reference for test suite: PORT = Number(process.env.PORT || 3000))
const PORT = Number(process.env.PORT || 4000);                   // Preferred default port for Express backend

const BACKEND_PORT_START = 4000;                                 // Starting port candidate for Express API
const BACKEND_PORT_END = 4004;                                   // Ending port candidate for Express API
const FRONTEND_PORT_START = 5173;                                // Starting port candidate for Vite dev server
const FRONTEND_PORT_END = 5177;                                  // Ending port candidate for Vite dev server

// --- Cluster: Path & Environment Setup ---
const npmBinPath = path.resolve(process.cwd(), "node_modules/.bin"); // Resolves local npm executable binaries (e.g. tsx, vite)
const devEnv = {
  ...process.env,                                                // Inherit current system environment variables
  PATH: `${npmBinPath}${path.delimiter}${process.env.PATH || ""}`, // Inject local node_modules/.bin into PATH
  Path: `${npmBinPath}${path.delimiter}${process.env.Path || ""}`, // Windows case-sensitive PATH compatibility
};

// --- Cluster: Port Liveness Check ---
// Attempts to listen on a port; returns true if open, false if already in use
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();                           // Create a temporary TCP server test instance
    server.once("error", () => {
      resolve(false);                                            // Port is occupied by another process
    });
    server.listen(port, "0.0.0.0", () => {
      server.close(() => {
        resolve(true);                                           // Port is completely free and available for use
      });
    });
  });
}

// Scans through port range sequentially until it finds an unoccupied port
async function findAvailablePort(startPort, endPort, label) {
  for (let port = startPort; port <= endPort; port++) {
    if (await isPortAvailable(port)) {
      return port;                                               // Found open port, return immediately
    }
  }
  throw new Error(
    `[Port Discovery Error] All ports in range ${startPort}-${endPort} for ${label} are currently occupied.\n` +
    `Please free up a port in the range ${startPort}-${endPort}.`
  );
}

// Finds an available port for the backend, honoring user-defined PORT in .env if available
async function resolveBackendPort() {
  if (process.env.PORT) {
    const customPort = Number(process.env.PORT);
    if (!Number.isNaN(customPort)) {
      const available = await isPortAvailable(customPort);
      if (available) {
        return customPort;                                       // Custom port from .env is free, use it
      }
      console.warn(`[Backend] Specified PORT=${customPort} is busy. Falling back to range ${BACKEND_PORT_START}-${BACKEND_PORT_END}...`);
    }
  }
  return await findAvailablePort(BACKEND_PORT_START, BACKEND_PORT_END, "Backend"); // Scan default 4000-4004 range
}

// Finds an available port for Vite frontend (5173-5177 range)
async function resolveFrontendPort() {
  return await findAvailablePort(FRONTEND_PORT_START, FRONTEND_PORT_END, "Frontend");
}

// Actively checks if backend port is accepting TCP connections before launching Vite
function waitForBackendPort(port, timeoutMs = 12000) {
  const start = Date.now();
  return new Promise((resolve) => {
    const tryConnect = () => {
      const socket = net.createConnection({ port, host: "127.0.0.1" });
      socket.once("connect", () => {
        socket.destroy();
        resolve(true);
      });
      socket.once("error", () => {
        socket.destroy();
        if (Date.now() - start >= timeoutMs) {
          resolve(false);
        } else {
          setTimeout(tryConnect, 80);
        }
      });
    };
    tryConnect();
  });
}

let backendChild = null;                                         // Reference to the running Express child process
let frontendChild = null;                                        // Reference to the running Vite child process

// --- Cluster: Dual Process Launcher ---
// Spawns the Express backend first, awaits socket readiness, then launches Vite dev server
async function startProcesses() {
  const API_PORT = await resolveBackendPort();                   // 1. Resolve free port for backend
  const FRONTEND_PORT = await resolveFrontendPort();             // 2. Resolve free port for frontend

  console.log("\n=======================================================");
  console.log("  🚀 LifeLink Smart Healthcare Assistance Platform");
  console.log(`  LifeLink dev server running at http://localhost:${API_PORT}`);
  console.log(`  [Backend]  API Engine:      http://localhost:${API_PORT}`);
  console.log(`  [Frontend] Vite Client:     http://localhost:${FRONTEND_PORT}`);
  console.log("=======================================================\n");

  const childEnv = {
    ...devEnv,
    NODE_ENV: "development",
    PORT: String(API_PORT),                                      // Pass selected port to Express backend
    VITE_API_PORT: String(API_PORT),                             // Pass backend port to Vite proxy config
    BROWSER: process.env.BROWSER || "chrome",                    // Set default browser for auto-open
  };

  const backendCmd = "node node_modules/tsx/dist/cli.mjs watch backend/_core/index.ts"; // Direct local TSX execution bypassing cross-env
  const frontendCmd = `node node_modules/vite/bin/vite.js --port ${FRONTEND_PORT}`; // Direct local Vite execution bypassing npx latency

  // 1. Spawn Backend Process
  backendChild = spawn(backendCmd, {
    cwd: process.cwd(),                                          // Run in project root directory
    env: childEnv,                                               // Provide injected environment variables
    shell: true,                                                 // Execute command within system shell
    stdio: ["ignore", "inherit", "inherit"],                     // Pipe stdout & stderr directly to terminal
  });

  // Wait for the backend API to initialize before launching Vite dev server
  // This guarantees the Express HTTP server is active and avoids proxy ECONNREFUSED errors
  await waitForBackendPort(API_PORT, 12000);

  // 2. Spawn Frontend Process
  frontendChild = spawn(frontendCmd, {
    cwd: process.cwd(),                                          // Run in project root directory
    env: childEnv,                                               // Provide injected environment variables
    shell: true,                                                 // Execute command within system shell
    stdio: ["ignore", "inherit", "inherit"],                     // Pipe stdout & stderr directly to terminal
  });

  const handleExit = (name) => (code, signal) => {
    if (code !== 0 && signal !== "SIGTERM" && signal !== "SIGINT") {
      console.error(`\n[${name}] Exited with code ${code ?? "unknown"} (signal: ${signal ?? "none"}).`);
    }
  };

  backendChild.once("exit", handleExit("Backend"));               // Notify if backend process unexpectedly terminates
  frontendChild.once("exit", handleExit("Frontend"));             // Notify if frontend process unexpectedly terminates
}

function stopProcesses() {
  const killChild = (child) => {
    if (child && !child.killed && child.pid) {
      if (process.platform === "win32") {
        try {
          execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: "ignore" });
        } catch (_) {}
      } else {
        try {
          child.kill("SIGTERM");
        } catch (_) {}
      }
    }
  };

  killChild(backendChild);
  killChild(frontendChild);
}

import { fileURLToPath } from "node:url";

const isDirectRun = Boolean(process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url));

if (isDirectRun) {
  startProcesses().catch((error) => {
    console.error("Failed to start development servers:", error.message || error);
    process.exit(1);
  });

  process.on("SIGINT", () => {
    stopProcesses();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    stopProcesses();
    process.exit(0);
  });
}

export {
  isPortAvailable,
  findAvailablePort,
  resolveBackendPort,
  resolveFrontendPort,
  startProcesses,
  stopProcesses,
  BACKEND_PORT_START,
  BACKEND_PORT_END,
  FRONTEND_PORT_START,
  FRONTEND_PORT_END,
};
