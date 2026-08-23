import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─── Premium Loading Screen ───────────────────────────────────────────────────
// Shown while the /api/auth/me session check is in flight.
// This PREVENTS any protected page from rendering before auth status is known.
const AuthLoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#071318]">
    <div className="flex flex-col items-center gap-5">
      {/* Animated Veenero droplet logo */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-teal-500/30 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-teal-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
          </svg>
        </div>
        {/* Pulsing outer ring */}
        <div className="absolute inset-0 rounded-full border border-teal-500/20 animate-ping" />
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-teal-400 text-sm font-semibold tracking-widest uppercase font-mono">
          Checking secure session
        </p>
        <div className="flex gap-1 mt-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-teal-500/60"
              style={{ animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite` }}
            />
          ))}
        </div>
      </div>
    </div>

    <style>{`
      @keyframes bounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
        40% { transform: translateY(-6px); opacity: 1; }
      }
    `}</style>
  </div>
);

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
/**
 * Guards all /admin/* routes.
 *
 * States:
 *  loading=true        → show AuthLoadingScreen (NEVER render children)
 *  !loading, !user     → Navigate to /admin/login?returnTo=<current path>
 *  !loading, user      → render children
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While session check is in flight: show loading screen.
  // This is the critical gate that prevents Dashboard from ever flashing.
  if (loading) {
    return <AuthLoadingScreen />;
  }

  // Session check done — user is not authenticated.
  // Preserve the originally requested path so login can redirect back.
  if (!user) {
    const returnTo = location.pathname + location.search;
    const isAdminLogin = returnTo === '/admin/login' || returnTo === '/admin';
    const loginUrl = isAdminLogin
      ? '/admin/login'
      : `/admin/login?returnTo=${encodeURIComponent(returnTo)}`;
    return <Navigate to={loginUrl} replace />;
  }

  // Authenticated — render the protected content.
  return <>{children}</>;
};

export default ProtectedRoute;
