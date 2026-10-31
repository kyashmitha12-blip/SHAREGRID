import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Ban,
  Building,
  Search,
  Bell,
  ClipboardList,
  Users,
  LogIn,
  LogOut,
  FileWarning,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BookingRequest, BookingStatus } from '../../types/auth';
import { CheckInModal } from '../workflow/CheckInModal';
import { CheckOutModal } from '../workflow/CheckOutModal';
import { ConditionReportModal } from '../workflow/ConditionReportModal';
import { IncidentReportModal } from '../workflow/IncidentReportModal';

interface BorrowerDashboardProps {
  onBrowseResources: () => void;
}

type ActiveTab = 'bookings' | 'waitlist' | 'notifications';

export const BorrowerDashboard: React.FC<BorrowerDashboardProps> = ({ onBrowseResources }) => {
  const {
    user,
    bookings,
    cancelBooking,
    waitingLists,
    leaveWaitingList,
    notifications,
    markNotificationRead,
    clearAllNotifications,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('bookings');
  const [filterStatus, setFilterStatus] = useState<'all' | BookingStatus>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Workflow modal states
  const [checkInBooking, setCheckInBooking] = useState<BookingRequest | null>(null);
  const [checkOutBooking, setCheckOutBooking] = useState<BookingRequest | null>(null);
  const [conditionReportBooking, setConditionReportBooking] = useState<{
    booking: BookingRequest;
    type: 'before-use' | 'after-use';
  } | null>(null);
  const [incidentReportBooking, setIncidentReportBooking] = useState<BookingRequest | null>(null);

  // Filter bookings for current borrower
  const myBookings = bookings.filter(
    (b) => b.borrowerEmail === user?.email || b.borrowerId === user?.id
  );

  const displayedBookings = myBookings.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  const pendingCount = myBookings.filter((b) => b.status === 'pending').length;
  const approvedCount = myBookings.filter((b) => b.status === 'approved').length;
  const totalHours = myBookings.reduce(
    (sum, b) => sum + (b.status !== 'cancelled' ? b.durationHours : 0),
    0
  );

  const myWaitlist = waitingLists.filter(
    (e) => e.borrowerEmail === user?.email && e.status === 'waiting'
  );
  const myNotifications = notifications.filter(
    (n) => n.userEmail === user?.email || n.userId === user?.id
  );
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    await cancelBooking(id);
    setCancellingId(null);
  };

  const handleLeaveWaitlist = async (entryId: string) => {
    await leaveWaitingList(entryId);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-forest-100 text-forest-900 border border-forest-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
            Approved & Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-300 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            Pending Host Sign-Off
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 text-rose-900 border border-rose-300 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Request Declined
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-ivory-200 text-charcoal-600 border border-ivory-400 text-xs font-medium">
            <Ban className="w-3.5 h-3.5 text-charcoal-400" />
            Cancelled
          </span>
        );
      case 'checked-in':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
            <LogIn className="w-3.5 h-3.5 text-blue-600" />
            Checked In — In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-forest-50 text-forest-800 border border-forest-200 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
            Session Completed
          </span>
        );
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="w-4 h-4 text-forest-700" />;
      case 'waiting_list': return <Users className="w-4 h-4 text-amber-600" />;
      case 'checkin': return <LogIn className="w-4 h-4 text-blue-600" />;
      case 'incident': return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'verification': return <CheckCircle2 className="w-4 h-4 text-forest-600" />;
      default: return <Bell className="w-4 h-4 text-charcoal-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-ivory-300 rounded shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">Total Requests</span>
          <span className="text-2xl font-extrabold text-forest-950 font-mono">{myBookings.length}</span>
          <span className="text-[11px] text-charcoal-500 block mt-1">Browser-local demo requests</span>
        </div>
        <div className="p-5 bg-white border border-ivory-300 rounded shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">Pending Approval</span>
          <span className="text-2xl font-extrabold text-amber-900 font-mono">{pendingCount}</span>
          <span className="text-[11px] text-charcoal-500 block mt-1">Awaiting demo owner action</span>
        </div>
        <div className="p-5 bg-white border border-ivory-300 rounded shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800 block mb-1">Confirmed Sessions</span>
          <span className="text-2xl font-extrabold text-forest-900 font-mono">{approvedCount}</span>
          <span className="text-[11px] text-charcoal-500 block mt-1">Approved demo bookings</span>
        </div>
        <div className="p-5 bg-white border border-ivory-300 rounded shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">Total Machine Hours</span>
          <span className="text-2xl font-extrabold text-forest-950 font-mono">{totalHours} hrs</span>
          <span className="text-[11px] text-charcoal-500 block mt-1">Requested demo booking hours</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border border-ivory-300 rounded shadow-editorial overflow-hidden">
        <div className="flex border-b border-ivory-300 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-5 py-3.5 transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'border-forest-900 text-forest-950 bg-forest-50/50'
                : 'border-transparent text-charcoal-600 hover:text-forest-900 hover:bg-ivory-50'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-forest-700" />
            <span>My Bookings & History</span>
            {myBookings.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-900 text-[10px] font-bold flex items-center justify-center">
                {myBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('waitlist')}
            className={`px-5 py-3.5 transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'waitlist'
                ? 'border-forest-900 text-forest-950 bg-forest-50/50'
                : 'border-transparent text-charcoal-600 hover:text-forest-900 hover:bg-ivory-50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-forest-700" />
            <span>Waiting List</span>
            {myWaitlist.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center">
                {myWaitlist.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-5 py-3.5 transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'notifications'
                ? 'border-forest-900 text-forest-950 bg-forest-50/50'
                : 'border-transparent text-charcoal-600 hover:text-forest-900 hover:bg-ivory-50'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-forest-700" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-accent-lime text-forest-950 text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* ── TAB: MY BOOKINGS ── */}
        {activeTab === 'bookings' && (
          <>
            <div className="p-5 border-b border-ivory-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-forest-950">My Reservation Requests & Booking History</h2>
                <p className="text-xs text-charcoal-600 mt-0.5">
                  Track status, review facility coordinator notes, and manage upcoming sessions.
                </p>
              </div>
              <button
                onClick={onBrowseResources}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-900 hover:bg-forest-800 text-ivory-50 text-xs font-bold rounded transition-colors shadow-sm"
              >
                <Search className="w-3.5 h-3.5 text-accent-lime" />
                <span>Discover New Resources</span>
              </button>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 px-5 py-3 bg-ivory-50 border-b border-ivory-200 overflow-x-auto text-xs">
              <span className="text-[11px] font-semibold text-charcoal-500 mr-2">Filter Status:</span>
              {(['all', 'pending', 'approved', 'checked-in', 'completed', 'cancelled'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded font-semibold capitalize transition-all ${
                    filterStatus === st
                      ? 'bg-forest-900 text-ivory-50 shadow-xs'
                      : 'bg-white hover:bg-ivory-200 text-charcoal-700 border border-ivory-300'
                  }`}
                >
                  {st} {st === 'all' ? `(${myBookings.length})` : ''}
                </button>
              ))}
            </div>

            {/* Booking List */}
            <div className="divide-y divide-ivory-200">
              {displayedBookings.length > 0 ? (
                displayedBookings.map((booking) => {
                  const isEligibleForCancel = booking.status === 'pending' || booking.status === 'approved';
                  const canCheckIn = booking.status === 'approved';
                  const canCheckOut = booking.status === 'checked-in';
                  const canConditionReport = booking.status === 'approved' || booking.status === 'checked-in' || booking.status === 'completed';
                  const canIncidentReport = booking.status === 'checked-in' || booking.status === 'completed';

                  return (
                    <div key={booking.id} className="p-5 hover:bg-ivory-50/60 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        {/* Left: Image & Details */}
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden bg-ivory-200 border border-ivory-300 flex-shrink-0">
                            <img
                              src={booking.resourceImage}
                              alt={booking.resourceTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 bg-forest-950 text-ivory-50 text-[10px] font-mono font-bold rounded">
                                {booking.resourceCode}
                              </span>
                              <span className="text-xs font-mono text-charcoal-500">REF: {booking.id}</span>
                              {getStatusBadge(booking.status)}
                            </div>

                            <h3 className="text-base font-bold text-forest-950 leading-tight">
                              {booking.resourceTitle}
                            </h3>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-600">
                              <span className="flex items-center gap-1 font-medium text-forest-900">
                                <Building className="w-3.5 h-3.5 text-forest-700" />
                                {booking.institutionName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-charcoal-400" />
                                {booking.sessionDate} ({booking.sessionTime})
                              </span>
                              <span className="flex items-center gap-1 font-mono font-semibold text-charcoal-900">
                                <Clock className="w-3.5 h-3.5 text-charcoal-400" />
                                {booking.durationHours} hrs (₹{booking.totalCost.toLocaleString('en-IN')})
                              </span>
                            </div>

                            <p className="text-xs text-charcoal-600 line-clamp-1 italic pt-1">
                              "{booking.projectBrief}"
                            </p>

                            {booking.approvalNotes && (
                              <div className="p-2.5 bg-forest-50 border border-forest-200 rounded text-xs text-forest-950 mt-2">
                                <strong>Coordinator Note:</strong> {booking.approvalNotes}
                              </div>
                            )}
                            {booking.rejectionReason && (
                              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-950 mt-2">
                                <strong>Decline Reason:</strong> {booking.rejectionReason}
                              </div>
                            )}

                            {/* Check-in record info */}
                            {booking.checkInRecord && (
                              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 mt-2">
                                <strong>Check-In:</strong> {booking.checkInRecord.checkInTime} via{' '}
                                {booking.checkInRecord.method === 'qr-scan' ? 'QR Scan' : 'Manual Token'} —
                                Gate Pass: <span className="font-mono font-bold">{booking.checkInRecord.gatePassCode}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2 flex-shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-ivory-200">
                          {booking.status === 'approved' && (
                            <div className="px-3 py-1 bg-forest-50 border border-forest-300 rounded text-[11px] font-mono text-forest-900 font-bold">
                              GATE PASS: #GP-{booking.id.toUpperCase()}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 justify-end">
                            {canCheckIn && (
                              <button
                                onClick={() => setCheckInBooking(booking)}
                                className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold rounded flex items-center gap-1.5 transition-colors"
                              >
                                <LogIn className="w-3 h-3" />
                                Check In
                              </button>
                            )}

                            {canCheckOut && (
                              <button
                                onClick={() => setCheckOutBooking(booking)}
                                className="px-3 py-1.5 text-xs bg-forest-700 hover:bg-forest-800 text-white font-bold rounded flex items-center gap-1.5 transition-colors"
                              >
                                <LogOut className="w-3 h-3" />
                                Check Out
                              </button>
                            )}

                            {canConditionReport && (
                              <button
                                onClick={() => setConditionReportBooking({
                                  booking,
                                  type: booking.status === 'checked-in' ? 'before-use' : 'after-use',
                                })}
                                className="px-3 py-1.5 text-xs bg-ivory-100 hover:bg-ivory-200 text-charcoal-800 border border-ivory-300 font-semibold rounded flex items-center gap-1 transition-colors"
                              >
                                <ClipboardList className="w-3 h-3" />
                                Condition Report
                              </button>
                            )}

                            {canIncidentReport && (
                              <button
                                onClick={() => setIncidentReportBooking(booking)}
                                className="px-3 py-1.5 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded flex items-center gap-1 transition-colors"
                              >
                                <FileWarning className="w-3 h-3" />
                                Report Incident
                              </button>
                            )}

                            {isEligibleForCancel && (
                              <button
                                onClick={() => handleCancel(booking.id)}
                                disabled={cancellingId === booking.id}
                                className="px-3 py-1.5 text-xs text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-rose-300 rounded font-semibold transition-colors flex items-center gap-1"
                              >
                                <Ban className="w-3 h-3" />
                                {cancellingId === booking.id ? 'Cancelling...' : 'Cancel'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-charcoal-500">
                  <Calendar className="w-8 h-8 text-charcoal-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-forest-950">No requests found</h4>
                  <p className="text-xs text-charcoal-500 mt-1 max-w-sm mx-auto">
                    You currently have no booking requests in this filter category.
                  </p>
                  <button
                    onClick={onBrowseResources}
                    className="mt-4 px-4 py-2 bg-forest-900 text-ivory-50 text-xs font-semibold rounded hover:bg-forest-800 transition-colors"
                  >
                    Browse Directory to Request Instrumentation
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── TAB: WAITING LIST ── */}
        {activeTab === 'waitlist' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-forest-950">My Waiting List</h2>
                <p className="text-xs text-charcoal-600 mt-0.5">
                  You'll be notified automatically when a slot opens up.
                </p>
              </div>
              <span className="text-xs font-mono text-charcoal-500">{myWaitlist.length} active entries</span>
            </div>

            {myWaitlist.length > 0 ? (
              <div className="space-y-3">
                {myWaitlist.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 bg-ivory-50 border border-ivory-300 rounded flex items-start gap-4"
                  >
                    <div className="w-14 h-14 rounded overflow-hidden bg-ivory-200 border border-ivory-300 flex-shrink-0">
                      <img src={entry.resourceImage} alt={entry.resourceTitle} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-forest-950 text-ivory-50 rounded">
                          {entry.resourceCode}
                        </span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold rounded">
                          Queue Position #{entry.position}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-forest-950 truncate">{entry.resourceTitle}</h4>
                      <p className="text-xs text-charcoal-600">{entry.institutionName}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {entry.requestedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {entry.requestedSlot}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal-500 italic mt-1">
                        Reason: {entry.allocationReason}
                      </p>
                    </div>
                    <button
                      onClick={() => handleLeaveWaitlist(entry.id)}
                      className="px-2.5 py-1.5 text-[10px] text-rose-700 hover:bg-rose-50 border border-rose-200 rounded font-semibold transition-colors flex-shrink-0"
                    >
                      Leave Queue
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-charcoal-500">
                <Users className="w-8 h-8 text-charcoal-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-forest-950">No waiting list entries</h4>
                <p className="text-xs text-charcoal-500 mt-1">
                  When a resource you want is unavailable, you can join its waiting list from the resource detail page.
                </p>
                <button
                  onClick={onBrowseResources}
                  className="mt-4 px-4 py-2 bg-forest-900 text-ivory-50 text-xs font-semibold rounded hover:bg-forest-800 transition-colors"
                >
                  Browse Available Resources
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: NOTIFICATIONS ── */}
        {activeTab === 'notifications' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-forest-950">Notifications</h2>
                <p className="text-xs text-charcoal-600 mt-0.5">
                  Booking updates, waiting list changes and system alerts.
                </p>
              </div>
              {myNotifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-[11px] text-charcoal-500 hover:text-rose-700 underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {myNotifications.length > 0 ? (
              <div className="space-y-2">
                {myNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-4 border rounded cursor-pointer transition-colors ${
                      n.read
                        ? 'bg-white border-ivory-200 opacity-60 hover:opacity-80'
                        : 'bg-forest-50 border-forest-200 hover:bg-forest-100/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                        n.read ? 'bg-ivory-100' : 'bg-white border border-forest-200'
                      }`}>
                        {getNotificationIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-forest-950">{n.title}</span>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-accent-lime flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-charcoal-600 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-charcoal-400 mt-1 block">{n.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-charcoal-500">
                <Bell className="w-8 h-8 text-charcoal-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-forest-950">No notifications yet</h4>
                <p className="text-xs text-charcoal-500 mt-1">
                  You'll see booking confirmations, approvals and alerts here.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── WORKFLOW MODALS ── */}
      {checkInBooking && (
        <CheckInModal
          booking={checkInBooking}
          onClose={() => setCheckInBooking(null)}
          onCheckedIn={() => setCheckInBooking(null)}
        />
      )}

      {checkOutBooking && (
        <CheckOutModal
          booking={checkOutBooking}
          onClose={() => setCheckOutBooking(null)}
          onCheckedOut={() => setCheckOutBooking(null)}
        />
      )}

      {conditionReportBooking && (
        <ConditionReportModal
          booking={conditionReportBooking.booking}
          reportType={conditionReportBooking.type}
          onClose={() => setConditionReportBooking(null)}
          onSubmitted={() => setConditionReportBooking(null)}
        />
      )}

      {incidentReportBooking && (
        <IncidentReportModal
          booking={incidentReportBooking}
          onClose={() => setIncidentReportBooking(null)}
          onSubmitted={() => setIncidentReportBooking(null)}
        />
      )}
    </div>
  );
};
