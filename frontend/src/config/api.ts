/**
 * api.ts — Centralized API configuration for the Veenero frontend.
 *
 * All backend requests must go through `apiFetch()` so that:
 *  - The base URL is resolved from a single env variable (never hardcoded).
 *  - `credentials: 'include'` is always set (sends the HttpOnly JWT cookie).
 *  - Global 401 handling (session expiry) can be wired in one place.
 */

// ── Base URL ──────────────────────────────────────────────────────────────────
// Reads from VITE_API_URL in .env / .env.local.
// Falls back to localhost:4000 for safety (never put this in production builds
// without setting the env var in your CI/CD pipeline).
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:4000';

// ── Global 401 callback ───────────────────────────────────────────────────────
// Registered by AuthProvider so any service can trigger a session-expiry logout.
type UnauthorizedCallback = () => void;
let _onUnauthorized: UnauthorizedCallback | null = null;

export function registerUnauthorizedCallback(cb: UnauthorizedCallback): void {
  _onUnauthorized = cb;
}

export function clearUnauthorizedCallback(): void {
  _onUnauthorized = null;
}

// ── apiFetch ──────────────────────────────────────────────────────────────────
/**
 * Thin wrapper around `fetch` that:
 *  - Prepends API_BASE_URL to relative paths (e.g. `/api/auth/me`)
 *  - Always sends credentials (HttpOnly cookie)
 *  - Calls the registered 401 callback on session expiry
 *
 * Usage:
 *   const res = await apiFetch('/api/auth/me');
 *   const data = await apiFetch('/api/admin/careers', { method: 'POST', body: ... });
 */
export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  // Global session-expiry handler: any 401 from the API clears auth state
  // and redirects to login (unless it's from the login endpoint itself).
  if (response.status === 401 && !path.includes('/auth/login')) {
    _onUnauthorized?.();
  }

  return response;
}
