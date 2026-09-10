import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, AlertCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '../context/AuthContext';
import heroWater from '@/assets/hero-water.jpg';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Detect session-expired redirect (from inactivity auto-logout)
  const sessionExpired = searchParams.get('expired') === '1';

  // Helper to resolve safe redirect destination
  const getRedirectTarget = () => {
    const returnTo = searchParams.get('returnTo');
    if (
      returnTo &&
      returnTo.startsWith('/admin') &&
      returnTo !== '/admin/login' &&
      returnTo !== '/admin' &&
      returnTo !== '/admin/'
    ) {
      return returnTo;
    }
    return '/admin/dashboard';
  };

  // If already logged in, bypass login
  useEffect(() => {
    if (user) {
      navigate(getRedirectTarget(), { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Required Fields Missing: Please input both your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      // Only store the email (never the password) for convenience
      if (rememberMe) {
        localStorage.setItem('veenero_remember_email', email);
      } else {
        localStorage.removeItem('veenero_remember_email');
      }
      toast.success('Authentication Successful', {
        description: 'Welcome back to Veenero Administration.',
      });
      navigate(getRedirectTarget(), { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-fill email if remembered
  useEffect(() => {
    const savedEmail = localStorage.getItem('veenero_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center overflow-hidden font-sans"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(4, 47, 46, 0.85), rgba(8, 51, 68, 0.75)), url(${heroWater})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Floating droplet background accents */}
      <div className="absolute top-[20%] left-[5%] w-10 h-10 rounded-full bg-white/10 border border-white/20 blur-[0.5px] pointer-events-none animate-float z-0" />
      <div className="absolute bottom-[20%] right-[5%] w-12 h-12 rounded-full bg-white/10 border border-white/20 blur-[1px] pointer-events-none animate-float animation-delay-400 z-0" />
      <div className="absolute top-[10%] right-[15%] w-6 h-6 rounded-full bg-white/10 border border-white/25 blur-[0.5px] pointer-events-none animate-float animation-delay-200 z-0" />

      {/* Grid Pattern overlay for depth */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="w-full max-w-md p-6 z-10 animate-fade-up">
        
        {/* Veenero OS Admin Branding */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative p-3.5 rounded-2xl bg-white text-teal-800 shadow-lg mb-4">
            <Icons.Droplet className="h-8 w-8 text-teal-700 fill-teal-500/10" />
            <div className="absolute -top-1 -right-1 bg-teal-800 p-0.5 rounded-full text-white">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            VEENERO <span className="text-teal-400 font-light">OS</span>
          </h1>
          <p className="text-sm text-teal-200/80 mt-1.5 font-medium">
            Water Intelligence SaaS Control Center
          </p>
        </div>

        {/* CLEAN WHITE LOGIN CARD */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 text-gray-900">
          
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
            <p className="text-xs text-gray-500 mt-1">Sign in to Veenero Admin</p>
          </div>

          {/* Session-expired banner (shown after inactivity auto-logout) */}
          {sessionExpired && !errorMsg && (
            <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs font-semibold flex items-start gap-2.5 leading-relaxed">
              <Clock className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
              <span>Your session expired due to inactivity. Please sign in again.</span>
            </div>
          )}

          {/* Inline Error block if validation/credentials fail */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-semibold flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50/50 border-gray-200 focus:border-teal-600 focus:ring-teal-500/10 text-gray-900 placeholder-gray-400 pl-10 h-11 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </Label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Password Recovery', {
                      description: 'Please contact your system administrator to reset your admin credentials.',
                    });
                  }}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50/50 border-gray-200 focus:border-teal-600 focus:ring-teal-500/10 text-gray-900 placeholder-gray-400 pl-10 pr-10 h-11 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="remember"
                checked={rememberMe}
                disabled={isLoading}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="border-gray-300 bg-gray-50 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 rounded"
              />
              <Label
                htmlFor="remember"
                className="text-xs text-gray-600 font-semibold cursor-pointer select-none"
              >
                Remember this device
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0f766e] hover:bg-[#0d6962] text-white font-bold py-3 rounded-xl border-none shadow-md flex items-center justify-center gap-2 transition-all duration-200 h-11 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying Security Token...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-teal-300/60 font-mono mt-8 uppercase tracking-widest">
          Secured by Veenero Cryptographic Shielding
        </p>
      </div>
    </div>
  );
};

// Create a small helper icons object locally because dynamic Icon loads inside this page specifically target Droplet
const Icons = {
  Droplet: (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
    </svg>
  ),
};

export default Login;
