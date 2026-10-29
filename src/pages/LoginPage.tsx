import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ShoppingBag,
  CheckCircle,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isConfigured, pendingCartAction } = useAuth();
  const { fulfillPendingCartAction } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Determine destination after successful sign in
  const redirectDestination =
    location.state?.from?.pathname ||
    pendingCartAction?.returnUrl ||
    '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // Fulfill pending Add to Cart action if one was captured
    if (pendingCartAction) {
      fulfillPendingCartAction();
    }

    // Navigate to original destination
    navigate(redirectDestination, { replace: true });
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-10 border border-cream-200 shadow-card">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-forest-900 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-serif font-extrabold text-2xl text-forest-950">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to manage your cart, orders, and delivery addresses
          </p>
        </div>

        {/* Pending Cart Banner (if redirected from Add to Cart) */}
        {pendingCartAction && (
          <div className="mb-5 p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
            <ShoppingBag className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Pending Cart Item Saved</p>
              <p className="text-[11px] text-amber-800">
                Sign in now to complete adding <strong>{pendingCartAction.product.name}</strong> to your cart.
              </p>
            </div>
          </div>
        )}

        {/* Configuration Notice if Supabase env vars not set */}
        {!isConfigured && (
          <div className="mb-5 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900">
            <p className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              Supabase Configuration Notice
            </p>
            <p className="text-[11px] mt-1 text-amber-800">
              Please configure <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
              <code className="bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in your{' '}
              <code className="bg-amber-100 px-1 rounded">.env</code> file.
            </p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600 transition-all"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600 transition-all"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </>
            )}
          </button>
        </form>

        {/* Switch to SignUp */}
        <div className="mt-6 pt-5 border-t border-cream-200 text-center">
          <p className="text-xs text-slate-600">
            Don't have an account yet?{' '}
            <Link
              to="/signup"
              state={location.state}
              className="font-bold text-forest-800 hover:text-forest-950 underline underline-offset-2"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Security Badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected with Supabase Secure Authentication</span>
        </div>
      </div>
    </div>
  );
};

