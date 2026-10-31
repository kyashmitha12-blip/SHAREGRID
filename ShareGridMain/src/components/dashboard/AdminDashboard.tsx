import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building, 
  Calendar, 
  AlertTriangle, 
  Check, 
  CheckCircle2,
  X, 
  Activity, 
  Database, 
  FileCheck2, 
  Search,
  ExternalLink,
  Layers,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserProfile, UserRole } from '../../types/auth';

export const AdminDashboard: React.FC = () => {
  const { 
    user, 
    allUsers, 
    pendingVerifications, 
    approveOwner, 
    rejectOwner, 
    resources, 
    bookings, 
    auditLogs,
    isSupabaseMode 
  } = useAuth();

  const [activeAdminTab, setActiveAdminTab] = useState<'verifications' | 'users' | 'bookings' | 'resources' | 'audit'>('verifications');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | UserRole>('all');
  const [searchUserQuery, setSearchUserQuery] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Filter users by role and search
  const filteredUsers = allUsers.filter(u => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (searchUserQuery.trim()) {
      const q = searchUserQuery.toLowerCase();
      return u.fullName.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q) || 
        u.institution.toLowerCase().includes(q);
    }
    return true;
  });

  const handleApproveVerification = async (userId: string) => {
    await approveOwner(userId);
    setActionMessage('Core facility verified. Node status updated to Approved.');
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleRejectVerification = async (userId: string) => {
    await rejectOwner(userId);
    setActionMessage('Owner accreditation application declined.');
    setTimeout(() => setActionMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Admin Privilege Header */}
      <div className="p-4 bg-forest-950 text-ivory-50 rounded shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-forest-800 text-accent-lime flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-accent-lime uppercase">
                Platform Administrative Console
              </span>
              <span className="px-1.5 py-0.2 bg-forest-800 text-ivory-300 text-[10px] rounded font-mono">
                RESTRICTED ACCESS
              </span>
            </div>
            <h2 className="text-base font-bold text-ivory-50">
              Governance & Oversight Portal — {user?.fullName} ({user?.email})
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto text-xs">
          <span className={`px-2.5 py-1 rounded font-mono font-semibold ${
            isSupabaseMode 
              ? 'bg-forest-800 text-accent-lime border border-accent-lime/40' 
              : 'bg-amber-950/80 text-amber-300 border border-amber-600/40'
          }`}>
            {isSupabaseMode ? 'Supabase DB: Connected' : 'Supabase: Integration Standby'}
          </span>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-forest-100 text-forest-950 border border-forest-300 rounded text-xs font-bold animate-fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-forest-700" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Global Oversight Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 bg-white border border-ivory-300 rounded shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
            Registered Members
          </span>
          <span className="text-2xl font-extrabold text-forest-950 font-mono">
            {allUsers.length}
          </span>
          <span className="text-[10px] text-charcoal-500 block mt-0.5">
            Borrowers & Owners
          </span>
        </div>

        <div className="p-4 bg-white border border-ivory-300 rounded shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
            Verification Queue
          </span>
          <span className="text-2xl font-extrabold text-amber-900 font-mono">
            {pendingVerifications.length}
          </span>
          <span className="text-[10px] text-charcoal-500 block mt-0.5">
            Pending institutional audit
          </span>
        </div>

        <div className="p-4 bg-white border border-ivory-300 rounded shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 block mb-1">
            Active Catalog Units
          </span>
          <span className="text-2xl font-extrabold text-forest-900 font-mono">
            {resources.length}
          </span>
          <span className="text-[10px] text-charcoal-500 block mt-0.5">
            Indexed instruments
          </span>
        </div>

        <div className="p-4 bg-white border border-ivory-300 rounded shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
            Total Reservations
          </span>
          <span className="text-2xl font-extrabold text-forest-950 font-mono">
            {bookings.length}
          </span>
          <span className="text-[10px] text-charcoal-500 block mt-0.5">
            Across network nodes
          </span>
        </div>

        <div className="p-4 bg-white border border-ivory-300 rounded shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">
            System Run Logs
          </span>
          <span className="text-2xl font-extrabold text-forest-950 font-mono">
            {auditLogs.length}
          </span>
          <span className="text-[10px] text-charcoal-500 block mt-0.5">
            Cryptographic ledger entries
          </span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white border border-ivory-300 rounded shadow-editorial overflow-hidden">
        <div className="flex border-b border-ivory-300 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('verifications')}
            className={`px-5 py-3.5 transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeAdminTab === 'verifications'
                ? 'border-forest-900 text-forest-950 bg-forest-50/50'
                : 'border-transparent text-charcoal-600 hover:text-forest-900 hover:bg-ivory-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
            <span>Owner Verification Queue</span>
            {pendingVerifications.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded-full font-bold text-[10px]">
                {pendingVerifications.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-5 py-3.5 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeAdminTab === 'users'
                ? 'border-forest-900 text-forest-950 bg-forest-50/50'
                : 'border-transparent text-charcoal-600 hover:text-forest-900 hover:bg-ivory-50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-forest-700" />
            <span>User & Institution Directory</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('bookings')}
            className={`px-5 py-3.5 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeAdminTab === 'bookings'
                ? 'border-forest-900 text-forest-950 bg-forest-50/50'
                : 'border-transparent text-charcoal-600 hover:text-forest-900 hover:bg-ivory-50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-forest-700" />
            <span>Global Booking Monitor</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('audit')}
            className={`px-5 py-3.5 transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeAdminTab === 'audit'
                ? 'border-forest-900 text-forest-950 bg-forest-50/50'
                : 'border-transparent text-charcoal-600 hover:text-forest-900 hover:bg-ivory-50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-forest-700" />
            <span>Platform Activity Audit</span>
          </button>
        </div>

        {/* TAB 1: OWNER VERIFICATION QUEUE */}
        {activeAdminTab === 'verifications' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-ivory-200">
              <span className="font-bold text-forest-950 uppercase tracking-wider text-[11px]">
                Institutional Core Facility Accreditation Requests
              </span>
              <span className="text-charcoal-500">
                Audited against university charters & ISO 17025 certificates
              </span>
            </div>

            {pendingVerifications.length > 0 ? (
              <div className="space-y-3">
                {pendingVerifications.map((owner) => (
                  <div key={owner.id} className="p-4 bg-ivory-50 border border-ivory-300 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-forest-950 text-sm">{owner.fullName}</span>
                        <span className="text-charcoal-500 font-mono text-[11px]">({owner.email})</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-bold rounded">
                          Verification Pending
                        </span>
                      </div>
                      <div className="text-charcoal-700">
                        <strong>Institution:</strong> {owner.institution} — <strong>Department:</strong> {owner.department}
                      </div>
                      {owner.verificationDocuments && (
                        <div className="text-charcoal-600 text-[11px] flex items-center gap-1 pt-1">
                          <FileCheck2 className="w-3.5 h-3.5 text-forest-700" />
                          <span>Submitted Documents: <strong>{owner.verificationDocuments.join(', ')}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApproveVerification(owner.id)}
                        className="px-3.5 py-1.5 bg-forest-900 hover:bg-forest-800 text-ivory-50 text-xs font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5 text-accent-lime" />
                        <span>Approve Facility</span>
                      </button>
                      <button
                        onClick={() => handleRejectVerification(owner.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold rounded flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-charcoal-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-forest-700 mx-auto mb-2" />
                <h4 className="font-bold text-forest-950">Verification Queue Clear</h4>
                <p className="text-charcoal-500 mt-0.5">All institutional core facilities have been reviewed and accredited.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: USER DIRECTORY */}
        {activeAdminTab === 'users' && (
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ivory-200">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  placeholder="Filter users by name, email, or campus..."
                  className="w-full pl-8 pr-3 py-1.5 bg-ivory-100 border border-ivory-300 rounded text-xs outline-none focus:border-forest-700"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-charcoal-500">Role:</span>
                {(['all', 'borrower', 'owner', 'admin'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setUserRoleFilter(role)}
                    className={`px-2.5 py-1 rounded capitalize font-semibold transition-colors ${
                      userRoleFilter === role 
                        ? 'bg-forest-900 text-ivory-50' 
                        : 'bg-ivory-100 hover:bg-ivory-200 text-charcoal-700'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory-100 text-charcoal-600 font-bold uppercase text-[10px] tracking-wider border-b border-ivory-300">
                  <tr>
                    <th className="py-2.5 px-3">Member Name & Email</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Institution & Dept</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-200">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-ivory-50">
                      <td className="py-3 px-3">
                        <strong className="text-forest-950 block">{u.fullName}</strong>
                        <span className="text-charcoal-500 font-mono text-[11px]">{u.email}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                          u.role === 'admin' 
                            ? 'bg-purple-100 text-purple-900' 
                            : u.role === 'owner' 
                            ? 'bg-forest-100 text-forest-900' 
                            : 'bg-blue-100 text-blue-900'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-charcoal-700">
                        <span className="font-semibold block">{u.institution}</span>
                        <span className="text-charcoal-500 text-[11px]">{u.department}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.verificationStatus === 'approved' 
                            ? 'bg-forest-100 text-forest-900' 
                            : u.verificationStatus === 'pending'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-ivory-200 text-charcoal-700'
                        }`}>
                          {u.verificationStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-charcoal-500 font-mono text-[11px]">
                        {u.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GLOBAL BOOKING MONITOR */}
        {activeAdminTab === 'bookings' && (
          <div className="p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-600 mb-2">
              Cross-Institutional Reservations Matrix
            </h3>
            <div className="divide-y divide-ivory-200 text-xs">
              {bookings.map((b) => (
                <div key={b.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold bg-forest-950 text-ivory-50 px-1.5 py-0.5 rounded">
                        {b.resourceCode}
                      </span>
                      <strong className="text-forest-950">{b.resourceTitle}</strong>
                    </div>
                    <div className="text-charcoal-500 text-[11px] mt-0.5">
                      Borrower: {b.borrowerName} ({b.borrowerInstitution}) → Host: {b.institutionName}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="font-mono font-bold text-forest-950">${b.totalCost}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded capitalize ${
                      b.status === 'approved' 
                        ? 'bg-forest-100 text-forest-900' 
                        : b.status === 'pending'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-ivory-200 text-charcoal-600'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PLATFORM ACTIVITY AUDIT */}
        {activeAdminTab === 'audit' && (
          <div className="p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-600 mb-2">
              Cryptographically Attested Platform Audit Log
            </h3>
            <div className="font-mono text-[11px] divide-y divide-ivory-200 bg-ivory-50 p-4 rounded border border-ivory-300 max-h-96 overflow-y-auto space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="pt-2 first:pt-0">
                  <div className="flex items-center justify-between text-charcoal-500">
                    <span className="text-forest-900 font-bold">{log.action}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString()} · {new Date(log.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="text-charcoal-800 mt-0.5">
                    <strong>[{log.actorRole.toUpperCase()}]</strong> {log.actorEmail}: {log.details}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
