import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Building2, 
  UserCheck, 
  Lock, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRedirectToDashboard?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  onSuccessRedirectToDashboard
}) => {
  const { user, login, register, logout, isSupabaseMode } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration form states
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<'borrower' | 'owner'>('borrower');
  const [regInstitution, setRegInstitution] = useState('');
  const [regDepartment, setRegDepartment] = useState('');
  const [regFacilityDetails, setRegFacilityDetails] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    const res = await login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (res.success) {
      onClose();
      if (onSuccessRedirectToDashboard) onSuccessRedirectToDashboard();
    } else {
      setAuthError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickLogin = async (email: string) => {
    setLoginEmail(email);
    setLoginPassword('password123');
    setIsSubmitting(true);
    const res = await login(email, 'password123');
    setIsSubmitting(false);
    if (res.success) {
      onClose();
      if (onSuccessRedirectToDashboard) onSuccessRedirectToDashboard();
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    const res = await register({
      email: regEmail,
      fullName: regFullName,
      role: regRole,
      institution: regInstitution,
      department: regDepartment,
      facilityDetails: regFacilityDetails
    });

    setIsSubmitting(false);

    if (res.success) {
      onClose();
      if (onSuccessRedirectToDashboard) onSuccessRedirectToDashboard();
    } else {
      setAuthError(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-ivory-50 border border-ivory-300 w-full max-w-lg rounded shadow-modal overflow-hidden relative my-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-ivory-300">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800">
                Institutional Access & Identity
              </span>
              <span className="px-1.5 py-0.2 bg-ivory-200 border border-ivory-300 rounded text-[9px] font-mono text-charcoal-600">
                {isSupabaseMode ? 'Supabase Auth' : 'Local Mode'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-forest-950">
              {mode === 'login' ? 'Institutional Member Sign In' : 'Create an Institutional Account'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 text-charcoal-400 hover:text-charcoal-800 rounded"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User is already logged in? */}
        {user ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-forest-950">
                Authenticated as {user.fullName}
              </h4>
              <p className="text-xs text-charcoal-600 mt-1">
                Active role: <strong className="text-forest-900 uppercase font-mono">{user.role}</strong> ({user.institution})
              </p>
            </div>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => {
                  onClose();
                  if (onSuccessRedirectToDashboard) onSuccessRedirectToDashboard();
                }}
                className="px-4 py-2 bg-forest-900 text-ivory-50 text-xs font-bold rounded hover:bg-forest-800"
              >
                Go to My Dashboard
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-ivory-200 text-charcoal-800 text-xs font-semibold rounded hover:bg-ivory-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Mode Switcher */}
            <div className="flex border-b border-ivory-300 mb-5 text-xs font-semibold">
              <button
                onClick={() => { setMode('login'); setAuthError(null); }}
                className={`flex-1 pb-2.5 text-center transition-colors border-b-2 ${
                  mode === 'login'
                    ? 'border-forest-900 text-forest-950 font-bold'
                    : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('register'); setAuthError(null); }}
                className={`flex-1 pb-2.5 text-center transition-colors border-b-2 ${
                  mode === 'register'
                    ? 'border-forest-900 text-forest-950 font-bold'
                    : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
                }`}
              >
                Register New Account
              </button>
            </div>

            {authError && (
              <div className="p-3 mb-4 bg-rose-50 border border-rose-300 rounded text-rose-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* TAB: LOGIN */}
            {mode === 'login' && (
              <div className="space-y-4">
                <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">
                      Institutional Email Address (.edu or org)
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="researcher@university.edu"
                      className="w-full px-3 py-2 bg-white border border-ivory-300 rounded focus:border-forest-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">
                      Password or Secure Passkey
                    </label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 bg-white border border-ivory-300 rounded focus:border-forest-700 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-forest-900 text-ivory-50 font-bold rounded hover:bg-forest-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-accent-lime" />
                    <span>{isSubmitting ? 'Authenticating credentials...' : 'Sign In to Laboratory Console'}</span>
                  </button>
                </form>

                {/* Pre-configured Role Quick Selectors for Test Verification */}
                <div className="pt-3 border-t border-ivory-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block mb-2">
                    Quick Sign-In by Test Role:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('borrower@mit.edu')}
                      className="p-2 bg-white hover:bg-ivory-100 border border-ivory-300 rounded text-left transition-colors"
                    >
                      <span className="text-[10px] font-bold text-blue-900 block font-mono">BORROWER</span>
                      <span className="text-[10px] text-charcoal-500 truncate block">Dr. Elena (MIT)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('owner@harvard.edu')}
                      className="p-2 bg-white hover:bg-ivory-100 border border-ivory-300 rounded text-left transition-colors"
                    >
                      <span className="text-[10px] font-bold text-forest-900 block font-mono">OWNER</span>
                      <span className="text-[10px] text-charcoal-500 truncate block">Prof. Marcus (Core)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('admin@sharegrid.org')}
                      className="p-2 bg-white hover:bg-ivory-100 border border-ivory-300 rounded text-left transition-colors"
                    >
                      <span className="text-[10px] font-bold text-purple-900 block font-mono">ADMIN</span>
                      <span className="text-[10px] text-charcoal-500 truncate block">Compliance Lead</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: REGISTER */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                {/* Role Selector: Borrower vs Owner ONLY! Never expose Admin */}
                <div>
                  <label className="block text-charcoal-700 font-semibold mb-1">
                    Select Your Institutional Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className={`p-2.5 border rounded cursor-pointer transition-colors flex items-start gap-2 ${
                      regRole === 'borrower' ? 'bg-forest-50 border-forest-800' : 'bg-white border-ivory-300'
                    }`}>
                      <input
                        type="radio"
                        name="regRole"
                        checked={regRole === 'borrower'}
                        onChange={() => setRegRole('borrower')}
                        className="mt-0.5 accent-forest-800"
                      />
                      <div>
                        <span className="font-bold text-forest-950 block text-xs">Borrower</span>
                        <span className="text-[10px] text-charcoal-500 block">
                          Researchers, postdocs, & student innovators requesting tool time.
                        </span>
                      </div>
                    </label>

                    <label className={`p-2.5 border rounded cursor-pointer transition-colors flex items-start gap-2 ${
                      regRole === 'owner' ? 'bg-forest-50 border-forest-800' : 'bg-white border-ivory-300'
                    }`}>
                      <input
                        type="radio"
                        name="regRole"
                        checked={regRole === 'owner'}
                        onChange={() => setRegRole('owner')}
                        className="mt-0.5 accent-forest-800"
                      />
                      <div>
                        <span className="font-bold text-forest-950 block text-xs">Resource Owner</span>
                        <span className="text-[10px] text-charcoal-500 block">
                          Facility directors, PIs, & equipment custodians listing machinery.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">
                      Full Legal / Academic Name
                    </label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Dr. Jordan Blake"
                      className="w-full px-3 py-2 bg-white border border-ivory-300 rounded focus:border-forest-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">
                      Institutional Email (.edu / .org)
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="j.blake@university.edu"
                      className="w-full px-3 py-2 bg-white border border-ivory-300 rounded focus:border-forest-700 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">
                      Host University or Research Center
                    </label>
                    <input
                      type="text"
                      required
                      value={regInstitution}
                      onChange={(e) => setRegInstitution(e.target.value)}
                      placeholder="e.g. Columbia University"
                      className="w-full px-3 py-2 bg-white border border-ivory-300 rounded focus:border-forest-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">
                      Department or Core Facility
                    </label>
                    <input
                      type="text"
                      required
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      placeholder="e.g. Nanotechnology Center"
                      className="w-full px-3 py-2 bg-white border border-ivory-300 rounded focus:border-forest-700 outline-none"
                    />
                  </div>
                </div>

                {regRole === 'owner' && (
                  <div className="p-3 bg-ivory-100 border border-ivory-300 rounded space-y-2">
                    <label className="block text-charcoal-800 font-semibold text-[11px]">
                      Core Facility Accreditation / Verification Summary
                    </label>
                    <input
                      type="text"
                      required
                      value={regFacilityDetails}
                      onChange={(e) => setRegFacilityDetails(e.target.value)}
                      placeholder="e.g. ISO 17025 accredited core, Room 102 Science Quad"
                      className="w-full px-3 py-1.5 bg-white border border-ivory-300 rounded text-xs outline-none"
                    />
                    <p className="text-[10px] text-charcoal-500 leading-normal">
                      Facility owner applications undergo verification by the SHAREGRID Institutional Compliance Board before receiving certified public listing badges.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-charcoal-700 font-semibold mb-1">
                    Set Account Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3 py-2 bg-white border border-ivory-300 rounded focus:border-forest-700 outline-none"
                  />
                </div>

                {/* Explicit Admin Security Notice */}
                <div className="p-2.5 bg-ivory-100 border border-ivory-200 rounded text-[10px] text-charcoal-600 flex items-start gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-charcoal-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Administrative Access Policy:</strong> Platform Admin rights are strictly provisioned by institutional compliance officers directly via PostgreSQL RLS roles and are never available through public registration.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-forest-900 text-ivory-50 font-bold rounded hover:bg-forest-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{isSubmitting ? 'Registering Account...' : `Register as ${regRole === 'borrower' ? 'Borrower' : 'Core Facility Owner'}`}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-accent-lime" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
