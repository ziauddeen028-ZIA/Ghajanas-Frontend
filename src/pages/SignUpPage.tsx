import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { signup, isConfigured, pendingCartAction } = useAuth();
  const { fulfillPendingCartAction } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const redirectDestination =
    location.state?.from
      ? typeof location.state.from === 'string'
        ? location.state.from
        : (location.state.from.pathname || '/') + (location.state.from.search || '')
      : pendingCartAction?.returnUrl || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const result = await signup(email, password, fullName, cleanPhone);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // Auto-login succeeded immediately: fulfill pending cart action if any
    if (pendingCartAction) {
      fulfillPendingCartAction();
    }

    // Immediately navigate to homepage or requested destination
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
            Create Customer Account
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Join Ghajanas for fast checkout and order tracking
          </p>
        </div>

        {/* Configuration Notice if Supabase not configured */}
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
            <div className="flex-1">
              <span>{error}</span>
              {error.toLowerCase().includes('already exists') && (
                <div className="mt-1.5">
                  <Link
                    to="/login"
                    state={location.state}
                    className="font-bold text-forest-900 hover:text-forest-950 underline underline-offset-2"
                  >
                    Click here to Sign In →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Senthil Kumar"
                required
                className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600 transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Mobile Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                required
                className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600 transition-all"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 chars"
                  required
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600 transition-all"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  required
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-forest-600 transition-all"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-60"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Switch to Login */}
        <div className="mt-6 pt-5 border-t border-cream-200 text-center">
          <p className="text-xs text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              state={location.state}
              className="font-bold text-forest-800 hover:text-forest-950 underline underline-offset-2"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
