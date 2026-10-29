import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, logout, verifyAdminStatus, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    location.state?.error === 'unauthorized'
      ? 'Access denied: That account does not hold administrator privileges.'
      : null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter your admin credentials.');
      return;
    }

    setIsLoading(true);
    const loginResult = await login(email, password);

    if (loginResult.error) {
      setIsLoading(false);
      setError(loginResult.error);
      return;
    }

    // Explicitly verify admin status via server-verified token check
    const isVerifiedAdmin = await verifyAdminStatus();
    setIsLoading(false);

    if (!isVerifiedAdmin) {
      // User is authenticated but NOT an admin: log out and reject with 403 message
      await logout();
      setError(
        'Access Denied (403 Unauthorized): This account is not an authorized administrator. Customer accounts cannot access the admin control panel.'
      );
      return;
    }

    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-cream-100">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-card relative overflow-hidden">
        {/* Admin Badge Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-forest-950 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-md border border-forest-800">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="inline-block px-3 py-1 bg-amber-500/15 text-amber-800 rounded-full text-[11px] font-black uppercase tracking-wider mb-2">
            Restricted Area
          </span>
          <h1 className="font-serif font-black text-2xl text-forest-950">
            Ghajanas Admin Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Store management and order fulfillment authorization
          </p>
        </div>

        {/* Configuration Notice */}
        {!isConfigured && (
          <div className="mb-5 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              Supabase Not Configured
            </p>
            <p className="text-[11px] mt-1 text-amber-800">
              Please configure <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
              <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in frontend <code className="bg-amber-100 px-1 rounded">.env</code>.
            </p>
          </div>
        )}

        {/* Error Notice */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ghajanas.com"
                required
                className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-700 transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-700 transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-forest-950 hover:bg-forest-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verify & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-cream-200 flex items-center justify-between text-xs">
          <Link
            to="/"
            className="text-slate-500 hover:text-forest-900 flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>
          <Link
            to="/login"
            className="text-forest-800 hover:text-forest-950 font-bold"
          >
            Customer Login
          </Link>
        </div>
      </div>
    </div>
  );
};

