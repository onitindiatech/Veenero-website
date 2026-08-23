import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  apiFetch,
  registerUnauthorizedCallback,
  clearUnauthorizedCallback,
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

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true); // true until first /me check completes

  // ── Session-expiry handler ────────────────────────────────────────────────
  // This is exposed so that any service using apiFetch can trigger a logout
  // without importing AuthContext (circular dep) — they call apiFetch which
  // fires the registered callback, which calls this.
  const handleApiUnauthorized = useCallback(() => {
    setUser(null);
    // loading stays false — ProtectedRoute will redirect to /admin/login
  }, []);

  // Register (and clean up) the global 401 callback
  useEffect(() => {
    registerUnauthorizedCallback(handleApiUnauthorized);
    return () => clearUnauthorizedCallback();
  }, [handleApiUnauthorized]);

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

    setUser(data.user as AdminUser);
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout — clear local state regardless
    } finally {
      setUser(null);
    }
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
