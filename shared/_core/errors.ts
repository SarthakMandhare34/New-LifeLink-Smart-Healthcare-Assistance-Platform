/**
 * ============================================================================
 * SHARED ISOMORPHIC LOGIC
 * ============================================================================
 *
 * WHY THIS FILE IS SPECIAL:
 * The code in this folder is executed by BOTH the front-end browser and the back-end server.
 * This ensures that when we calculate things (like the distance between clinics),
 * both the server and the phone agree on the exact same mathematical rules.
 */
// =========================================================================================
// SHARED HTTP ERROR DEFINITIONS
// Canonical HTTP error abstraction thrown by tRPC route handlers and API endpoints.
// Encapsulates standard numeric HTTP status codes (400, 401, 403, 404).
// =========================================================================================

export class HttpError extends Error {
  constructor(
    public statusCode: number,                                                                  // HTTP status response code (e.g. 400, 401, 404)
    message: string                                                                             // Human-readable error description
  ) {
    super(message);                                                                             // Pass message to base Error
    this.name = "HttpError";                                                                    // Assign error name
  }
}

// Convenience factory constructors for common REST/tRPC failure conditions
export const BadRequestError = (msg: string) => new HttpError(400, msg);                          // 400 Bad Request
export const UnauthorizedError = (msg: string) => new HttpError(401, msg);                        // 401 Unauthorized
export const ForbiddenError = (msg: string) => new HttpError(403, msg);                           // 403 Forbidden
export const NotFoundError = (msg: string) => new HttpError(404, msg);                            // 404 Not Found
