import React from 'react';
import { 
  User, 
  Shield, 
  Building2, 
  ArrowLeft, 
  LogOut, 
  Info, 
  CheckCircle2, 
  Clock, 
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BorrowerDashboard } from './BorrowerDashboard';
import { OwnerDashboard } from './OwnerDashboard';
import { AdminDashboard } from './AdminDashboard';
import { UserRole } from '../../types/auth';

interface DashboardLayoutProps {
  onBackToDirectory: () => void;
  onOpenLoginModal: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  onBackToDirectory, 
  onOpenLoginModal 
}) => {
  const { user, logout, loginAsRole, isSupabaseMode } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-ivory-100 pt-28 pb-20 font-sans flex items-center justify-center">
        <div className="bg-white border border-ivory-300 rounded p-8 max-w-md w-full mx-4 shadow-editorial text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-forest-950">
            Sign In Required
          </h2>
          <p className="text-xs text-charcoal-600 leading-relaxed">
            Please sign in with your institutional credentials or university SSO to access your dashboard.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={onOpenLoginModal}
              className="w-full py-2.5 bg-forest-900 hover:bg-forest-800 text-ivory-50 text-xs font-bold rounded transition-colors"
            >
              Sign In to Institutional Portal
            </button>
            <button
              onClick={onBackToDirectory}
              className="w-full py-2.5 bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 text-xs font-semibold rounded border border-ivory-300 transition-colors"
            >
              Back to Public Directory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-100 pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Supabase Technical Integration Notice */}
        {!isSupabaseMode ? (
          <div className="p-3.5 bg-ivory-200/80 border border-ivory-400/80 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-charcoal-800">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-forest-800 flex-shrink-0" />
              <span>
                <strong>Integration Note:</strong> Supabase credentials (<code className="font-mono text-[11px] bg-ivory-300 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> & <code className="font-mono text-[11px] bg-ivory-300 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code>) are not configured. Running in local state integration mode with strict role enforcement.
              </span>
            </div>
            <span className="text-[11px] font-mono text-forest-900 bg-forest-100 px-2 py-0.5 rounded border border-forest-300 whitespace-nowrap self-start sm:self-auto font-semibold">
              Ready for PostgreSQL Schema
            </span>
          </div>
        ) : (
          <div className="p-3.5 bg-forest-50 border border-forest-300 rounded flex items-center gap-2 text-xs text-forest-900 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-forest-700" />
            <span>Connected to Supabase Authentication & PostgreSQL Database.</span>
          </div>
        )}

        {/* Dashboard Top Header & Role Switcher */}
        <div className="bg-white border border-ivory-300 rounded p-6 sm:p-8 shadow-editorial">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-ivory-200">
            {/* User Identity & Role Badge */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                  Institutional Console
                </span>
                <span className="text-charcoal-300">/</span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-950 border border-purple-300' 
                    : user.role === 'owner' 
                    ? 'bg-forest-100 text-forest-950 border border-forest-300' 
                    : 'bg-blue-100 text-blue-950 border border-blue-300'
                }`}>
                  Role: {user.role === 'borrower' ? 'Borrower' : user.role === 'owner' ? 'Resource Owner' : 'System Admin'}
                </span>
                <span className="px-2 py-0.5 bg-ivory-100 border border-ivory-300 rounded text-[10px] text-charcoal-600 font-semibold">
                  Status: {user.verificationStatus}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
                {user.fullName}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-600 pt-0.5">
                <span><strong>Affiliation:</strong> {user.institution} ({user.department})</span>
                <span><strong>Email:</strong> {user.email}</span>
                {user.title && <span><strong>Title:</strong> {user.title}</span>}
              </div>
            </div>

            {/* Quick Role Tester & Sign Out */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quick role tester */}
              <div className="p-2 bg-ivory-50 border border-ivory-300 rounded text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
                  Test Role Switcher:
                </span>
                <div className="flex items-center gap-1.5">
                  {(['borrower', 'owner', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => loginAsRole(r)}
                      className={`px-2.5 py-1 text-xs font-bold rounded capitalize transition-colors ${
                        user.role === r
                          ? 'bg-forest-900 text-ivory-50 shadow-xs'
                          : 'bg-white hover:bg-ivory-200 text-charcoal-700 border border-ivory-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={logout}
                className="px-3.5 py-2 text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-rose-300 rounded transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs">
            <button
              onClick={onBackToDirectory}
              className="inline-flex items-center gap-1 text-forest-900 hover:text-forest-700 font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Resource Directory</span>
            </button>
          </div>
        </div>

        {/* Dynamic Role-Based View */}
        {user.role === 'borrower' && (
          <BorrowerDashboard onBrowseResources={onBackToDirectory} />
        )}

        {user.role === 'owner' && (
          <OwnerDashboard />
        )}

        {user.role === 'admin' && (
          <AdminDashboard />
        )}
      </div>
    </div>
  );
};
