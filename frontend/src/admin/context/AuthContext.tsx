import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  apiFetch,
  registerUnauthorizedCallback,
  clearUnauthorizedCallback,
  setStoredToken,
  clearStoredToken,
} from '@/config/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER';
  lastLogin?: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextType {
  /** The authenticated user, or null if logged out / loading. */
  user: AdminUser | null;
  /** True while the initial /api/auth/me session check is in flight. */
  loading: boolean;
  /** Derived convenience flag: !loading && !!user */
  isAuthenticated: boolean;
  /** Attempt login with email + password. Throws on failure. */
  login: (email: string, password: string) => Promise<void>;
  /** Clear the server-side cookie and local auth state. */
  logout: () => Promise<void>;
  /**
   * Call this from any service/component when a 401 is received on a
   * protected API (session expired mid-session). Clears local state and
   * triggers a redirect to /admin/login via ProtectedRoute.
   */
  handleApiUnauthorized: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** 15 minutes of inactivity before auto-logout (in milliseconds). */
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;

/** DOM events that count as "activity" and reset the inactivity timer. */
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  'mousemove',
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'click',
];

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true); // true until first /me check completes

  // Ref to the inactivity timeout so we can clear/reset it
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Session-expiry handler ────────────────────────────────────────────────
  const handleApiUnauthorized = useCallback(() => {
    clearStoredToken();
    setUser(null);
    // loading stays false — ProtectedRoute will redirect to /admin/login
  }, []);

  // Register (and clean up) the global 401 callback
  useEffect(() => {
    registerUnauthorizedCallback(handleApiUnauthorized);
    return () => clearUnauthorizedCallback();
  }, [handleApiUnauthorized]);

  // ── Logout (shared by manual logout and inactivity auto-logout) ───────────
  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout — clear local state regardless
    } finally {
      clearStoredToken();
      setUser(null);
    }
  }, []);

  // ── Inactivity auto-logout ────────────────────────────────────────────────
  // Only active when the user IS authenticated. We attach lightweight event
  // listeners to the window and reset the timer on any meaningful interaction.
  // When the timer fires (15 min of silence), we log out and redirect to the
  // login page with ?expired=1 so the login page can show a proper message.

  const scheduleInactivityLogout = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(async () => {
      // Perform server-side logout to clear the HttpOnly cookie
      await logout();
      // Redirect to login with expiry flag — router handles this via ProtectedRoute
      // We navigate imperatively to avoid circular AuthContext → router imports.
      window.location.replace('/admin/login?expired=1');
    }, INACTIVITY_TIMEOUT_MS);
  }, [logout]);

  useEffect(() => {
    // Only run inactivity tracking while authenticated
    if (!user) {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      return;
    }

    // Start the initial timer
    scheduleInactivityLogout();

    // Reset timer on any activity
    const handleActivity = () => scheduleInactivityLogout();

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      // Cleanup on unmount or when user becomes null
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user, scheduleInactivityLogout]);

  // ── Session restore on mount ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      try {
        const response = await apiFetch('/api/auth/me');

        if (!cancelled) {
          if (response.ok) {
            const data = await response.json();
            if (data?.success && data?.user) {
              setUser(data.user as AdminUser);
            } else {
              setUser(null);
            }
          } else {
            // 401 / 403 / any error → treat as unauthenticated
            setUser(null);
          }
        }
      } catch {
        // Network error → treat as unauthenticated (not an auth error per se)
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    restoreSession();
    return () => { cancelled = true; };
  }, []);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const response = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      // Propagate the backend error message (e.g. "Invalid email or password" / 429)
      const msg =
        response.status === 429
          ? 'Too many login attempts. Please try again in 15 minutes.'
          : data?.error?.message ?? 'Authentication failed. Please try again.';
      throw Object.assign(new Error(msg), { status: response.status });
    }

    if (data.token) {
      setStoredToken(data.token);
    }

    setUser(data.user as AdminUser);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !loading && !!user,
    login,
    logout,
    handleApiUnauthorized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
