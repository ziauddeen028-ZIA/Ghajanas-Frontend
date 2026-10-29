import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-forest-900 text-amber-400 flex items-center justify-center animate-pulse mb-4 shadow-md">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="font-serif font-bold text-slate-800 text-base">Verifying your session...</p>
        <p className="text-xs text-slate-500 mt-1">Ghajanas Native Groceries</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login while preserving intended target destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

