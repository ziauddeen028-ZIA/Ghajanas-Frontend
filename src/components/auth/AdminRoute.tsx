import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-forest-950 text-emerald-400 flex items-center justify-center animate-pulse mb-4 shadow-md">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <p className="font-serif font-bold text-slate-800 text-base">Verifying admin credentials...</p>
        <p className="text-xs text-slate-500 mt-1">Ghajanas Admin Portal</p>
      </div>
    );
  }

  // Not logged in -> go to admin login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Logged in but not an authorized admin -> block access
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-rose-200 shadow-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="font-serif font-bold text-xl text-slate-900 mb-2">403 — Unauthorized Access</h2>
        <p className="text-xs text-slate-600 leading-relaxed mb-6">
          The signed-in account (<strong className="text-slate-800">{user.email}</strong>) does not have verified administrator privileges.
        </p>
        <div className="space-y-2">
          <a
            href="/"
            className="block w-full py-2.5 px-4 bg-forest-900 hover:bg-forest-950 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            Return to Storefront
          </a>
          <Navigate to="/admin/login" state={{ error: 'unauthorized' }} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

