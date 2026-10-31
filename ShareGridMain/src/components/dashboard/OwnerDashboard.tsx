import React, { useState } from 'react';
import {
  Building2,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Sliders,
  Activity,
  Check,
  X,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ResourceCategory } from '../../types/resource';
import { EditResourceModal } from '../workflow/EditResourceModal';

export const OwnerDashboard: React.FC = () => {
  const {
    user,
    resources,
    bookings,
    incidents,
    approveBooking,
    rejectBooking,
    addResource,
    updateResourceStatus,
    resolveIncident,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'requests' | 'resources' | 'add' | 'history' | 'incidents'>('requests');
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [approvingBookingId, setApprovingBookingId] = useState<string | null>(null);

  // Edit resource modal
  const [editingResource, setEditingResource] = useState<string | null>(null);

  // Incident resolution
  const [resolvingIncidentId, setResolvingIncidentId] = useState<string | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  // New Resource Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ResourceCategory>('laboratory-equipment');
  const [newHourlyRate, setNewHourlyRate] = useState<number>(850);
  const [newDescription, setNewDescription] = useState('');
  const [newBuilding, setNewBuilding] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [newImageUrl, setNewImageUrl] = useState(
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
  );
  const [hasOperator, setHasOperator] = useState(true);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const incomingBookings = bookings;
  const pendingRequests = incomingBookings.filter((b) => b.status === 'pending');
  const pastSessions = incomingBookings.filter(
    (b) => b.status === 'approved' || b.status === 'completed'
  );

  const totalRevenue = incomingBookings
    .filter((b) => b.status === 'approved' || b.status === 'completed')
    .reduce((sum, b) => sum + b.totalCost, 0);

  // Owner-relevant incidents (on resources that belong to this owner)
  const ownerIncidents = incidents.filter((inc) =>
    resources.some((r) => r.id === inc.resourceId)
  );
  const openIncidents = ownerIncidents.filter((i) => i.status !== 'resolved');

  const editResource = resources.find((r) => r.id === editingResource);

  const handleApprove = async (id: string) => {
    await approveBooking(id, approvalNotes || 'Authorized for scheduled lab time.');
    setApprovingBookingId(null);
    setApprovalNotes('');
  };

  const handleReject = async (id: string) => {
    if (!rejectReason) return;
    await rejectBooking(id, rejectReason);
    setRejectingBookingId(null);
    setRejectReason('');
  };

  const handleAddResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addResource({
      title: newTitle,
      category: newCategory,
      categoryLabel: newCategory.replace(/-/g, ' ').toUpperCase(),
      description: newDescription,
      image: newImageUrl,
      images: [newImageUrl],
      institution: {
        name: user?.institution || 'Research Institution',
        department: user?.department || 'Core Facility',
        campus: 'Main Campus',
        verified: true,
        rating: 5.0,
        totalShares: 1,
      },
      location: {
        building: newBuilding || 'Science Building',
        campus: 'Main Campus',
        city: 'India',
        room: newRoom || 'Lab 101',
      },
      pricing: {
        hourlyRate: Number(newHourlyRate),
        currency: '₹',
        billingType: 'hourly',
        subsidizedForAcademia: true,
      },
      specifications: [
        { label: 'Operational Status', value: 'Calibrated' },
        { label: 'Access Tier', value: 'Level 2' },
      ],
      availability: {
        status: 'available',
        nextAvailableSlot: 'Tomorrow at 09:00 IST',
        leadTimeDays: 1,
      },
      condition: 'certified',
      conditionLabel: 'Calibrated / Certified',
      approvalRequirement: 'host-approval',
      approvalLabel: 'Host Approval Required',
      usageConditions: {
        cancellationPolicy: '24-hour notice required.',
        allowedUsage: ['Standard academic research protocols'],
      },
      eligibilityRequirements: {
        affiliationRequired: ['Accredited University Affiliate'],
        safetyCertifications: ['Basic Lab Induction'],
        minimumUserLevel: 'Trained Operator',
      },
      operatorAssistance: hasOperator,
      certificationRequired: true,
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setActiveTab('resources');
    }, 1500);

    setNewTitle('');
    setNewDescription('');
    setNewBuilding('');
    setNewRoom('');
  };

  const handleResolveIncident = async (id: string) => {
    if (!resolutionNotes.trim()) return;
    await resolveIncident(id, resolutionNotes);
    setResolvingIncidentId(null);
    setResolutionNotes('');
  };

  const severityColor: Record<string, string> = {
    low: 'bg-forest-50 text-forest-900 border-forest-200',
    medium: 'bg-amber-50 text-amber-900 border-amber-200',
    high: 'bg-orange-50 text-orange-900 border-orange-300',
    critical: 'bg-rose-50 text-rose-900 border-rose-300',
  };

  return (
    <div className="space-y-6">
      {/* Verification Banner */}
      {user?.verificationStatus === 'pending' ? (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded flex items-start gap-3 text-amber-950">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold">Core Facility Verification Pending Review</h4>
            <p className="text-amber-900 leading-relaxed">
              Your institutional credentials for <strong>{user.institution}</strong> ({user.department}) have been
              received. Equipment is listable but public availability displays "Under Institutional Audit" until full
              verification is complete.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-forest-50 border border-forest-200 rounded flex items-center justify-between text-forest-950 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-forest-800 text-accent-lime flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block">Verified Institutional Facility Node</span>
              <span className="text-forest-800">
                Authorized Custodian: {user?.fullName} — {user?.institution} ({user?.department})
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-forest-800 text-ivory-50 font-mono text-[10px] font-bold rounded">
            ILTA CERTIFIED
          </span>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-ivory-300 rounded shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">Active Listings</span>
          <span className="text-2xl font-extrabold text-forest-950 font-mono">{resources.filter(r => r.active !== false).length}</span>
          <span className="text-[11px] text-charcoal-500 block mt-1">Indexed core facility units</span>
        </div>
        <div className="p-5 bg-white border border-ivory-300 rounded shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">Incoming Requests</span>
          <span className="text-2xl font-extrabold text-amber-900 font-mono">{pendingRequests.length}</span>
          <span className="text-[11px] text-charcoal-500 block mt-1">Action required</span>
        </div>
        <div className="p-5 bg-white border border-ivory-300 rounded shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-forest-800 block mb-1">Completed Run Hours</span>
          <span className="text-2xl font-extrabold text-forest-900 font-mono">
            {pastSessions.reduce((sum, b) => sum + b.durationHours, 0)} hrs
          </span>
          <span className="text-[11px] text-charcoal-500 block mt-1">Logged equipment utilization</span>
        </div>
        <div className="p-5 bg-white border border-ivory-300 rounded shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-500 block mb-1">Recovered Overhead</span>
          <span className="text-2xl font-extrabold text-forest-950 font-mono">₹{totalRevenue.toLocaleString('en-IN')}</span>
          <span className="text-[11px] text-charcoal-500 block mt-1">Depreciation offset ledger</span>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white border border-ivory-300 rounded shadow-editorial overflow-hidden">
        <div className="flex border-b border-ivory-300 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'requests', label: 'Incoming Requests', badge: pendingRequests.length },
            { id: 'resources', label: 'Manage Equipment', icon: <Sliders className="w-3.5 h-3.5 text-forest-700" /> },
            { id: 'add', label: 'List New Instrument', icon: <Plus className="w-3.5 h-3.5 text-forest-700" /> },
            { id: 'history', label: 'Usage History', icon: <Activity className="w-3.5 h-3.5 text-forest-700" /> },
            { id: 'incidents', label: 'Incident Reports', badge: openIncidents.length, badgeColor: 'bg-rose-100 text-rose-900' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-5 py-3.5 transition-colors border-b-2 whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-forest-900 text-forest-950 bg-forest-50/50'
                  : 'border-transparent text-charcoal-600 hover:text-forest-900 hover:bg-ivory-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${tab.badgeColor || 'bg-accent-lime text-forest-950'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── TAB: INCOMING REQUESTS ── */}
        {activeTab === 'requests' && (
          <div className="p-5 divide-y divide-ivory-200">
            {incomingBookings.length > 0 ? (
              incomingBookings.map((req) => (
                <div key={req.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-forest-950 text-ivory-50 rounded">
                          {req.resourceCode}
                        </span>
                        <span className="text-xs font-bold text-forest-950">{req.resourceTitle}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                            req.status === 'approved'
                              ? 'bg-forest-100 text-forest-900'
                              : req.status === 'pending'
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-ivory-200 text-charcoal-600'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                      <div className="text-xs text-charcoal-700 flex flex-wrap gap-x-4 gap-y-1 pt-1">
                        <span><strong>Borrower:</strong> {req.borrowerName} ({req.borrowerEmail})</span>
                        <span><strong>Institution:</strong> {req.borrowerInstitution}</span>
                        <span><strong>Session:</strong> {req.sessionDate} at {req.sessionTime} ({req.durationHours} hrs)</span>
                        <span><strong>Cost:</strong> ₹{req.totalCost.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-xs text-charcoal-600 italic bg-ivory-50 p-2.5 rounded border border-ivory-200 mt-2">
                        <strong>Research Statement:</strong> {req.projectBrief}
                      </p>
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex items-center gap-2 flex-shrink-0 self-end lg:self-start">
                        <button
                          onClick={() => setApprovingBookingId(req.id)}
                          className="px-3.5 py-1.5 bg-forest-900 hover:bg-forest-800 text-ivory-50 text-xs font-bold rounded flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5 text-accent-lime" />
                          <span>Approve Slot</span>
                        </button>
                        <button
                          onClick={() => setRejectingBookingId(req.id)}
                          className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold rounded flex items-center gap-1 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {approvingBookingId === req.id && (
                    <div className="p-3 bg-forest-50 border border-forest-300 rounded text-xs space-y-2 mt-2">
                      <label className="block font-semibold text-forest-950">Optional Coordinator Notes:</label>
                      <input
                        type="text"
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        placeholder="e.g. Please bring PPE and arrive 15 minutes before session."
                        className="w-full p-2 bg-white border border-forest-300 rounded text-xs outline-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setApprovingBookingId(null)} className="px-3 py-1 bg-white text-charcoal-700 border border-ivory-300 rounded">
                          Cancel
                        </button>
                        <button onClick={() => handleApprove(req.id)} className="px-3 py-1 bg-forest-900 text-ivory-50 font-bold rounded">
                          Confirm &amp; Issue Gate Pass
                        </button>
                      </div>
                    </div>
                  )}

                  {rejectingBookingId === req.id && (
                    <div className="p-3 bg-rose-50 border border-rose-300 rounded text-xs space-y-2 mt-2">
                      <label className="block font-semibold text-rose-950">Reason for Declining:</label>
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="e.g. Machine undergoing nitrogen refilling during requested window."
                        className="w-full p-2 bg-white border border-rose-300 rounded text-xs outline-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setRejectingBookingId(null)} className="px-3 py-1 bg-white text-charcoal-700 border border-ivory-300 rounded">
                          Cancel
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          disabled={!rejectReason}
                          className="px-3 py-1 bg-rose-800 text-ivory-50 font-bold rounded disabled:opacity-50"
                        >
                          Confirm Decline
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-charcoal-500 text-xs">No incoming booking requests yet.</div>
            )}
          </div>
        )}

        {/* ── TAB: MANAGE RESOURCES ── */}
        {activeTab === 'resources' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-charcoal-600 pb-2 border-b border-ivory-200">
              <span>Managed Equipment Units ({resources.length})</span>
              <span className="text-[11px]">Toggle availability or click Edit to modify listings</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className={`p-4 border rounded space-y-3 ${
                    res.active === false ? 'bg-ivory-100 border-ivory-200 opacity-70' : 'bg-ivory-50 border-ivory-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded overflow-hidden bg-ivory-200 flex-shrink-0 border border-ivory-300">
                      <img src={res.image} alt={res.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <span className="font-mono text-[10px] font-bold text-forest-800">{res.code}</span>
                      <h4 className="text-xs font-bold text-forest-950 truncate">{res.title}</h4>
                      <p className="text-[11px] text-charcoal-500 truncate">
                        {res.location.building} · ₹{res.pricing.hourlyRate || res.pricing.dailyRate}/
                        {res.pricing.hourlyRate ? 'hr' : 'day'}
                      </p>
                      {res.active === false && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-charcoal-500 bg-ivory-200 px-1.5 py-0.5 rounded">
                          INACTIVE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Availability Selector */}
                  <div className="flex items-center justify-between pt-2 border-t border-ivory-200 text-[10px]">
                    <span className="text-charcoal-600 font-medium">Availability:</span>
                    <div className="flex items-center gap-1.5">
                      {(['available', 'in-use', 'maintenance'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateResourceStatus(res.id, s)}
                          className={`px-2 py-1 font-bold rounded transition-colors capitalize ${
                            res.availability.status === s
                              ? s === 'available'
                                ? 'bg-forest-900 text-ivory-50'
                                : s === 'in-use'
                                ? 'bg-amber-800 text-ivory-50'
                                : 'bg-rose-800 text-ivory-50'
                              : 'bg-white text-charcoal-700 border border-ivory-300 hover:bg-ivory-100'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Edit button */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setEditingResource(res.id)}
                      className="flex-1 py-1.5 text-[11px] font-bold bg-white border border-ivory-300 text-charcoal-700 hover:bg-ivory-100 rounded flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3 h-3 text-forest-700" />
                      Edit Listing
                    </button>
                    <button
                      onClick={() => setEditingResource(res.id)}
                      className="py-1.5 px-2 text-[11px] font-bold bg-white border border-ivory-300 text-charcoal-700 hover:bg-ivory-100 rounded flex items-center gap-1 transition-colors"
                      title={res.active !== false ? 'Deactivate' : 'Activate'}
                    >
                      {res.active !== false ? (
                        <ToggleRight className="w-4 h-4 text-forest-700" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 text-charcoal-400" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: ADD RESOURCE ── */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddResourceSubmit} className="p-6 max-w-2xl space-y-4 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 block mb-1">
                Asset Provisioning
              </span>
              <h3 className="text-base font-bold text-forest-950">Register New Equipment or Research Space</h3>
            </div>

            {addedSuccess && (
              <div className="p-3 bg-forest-100 text-forest-900 border border-forest-300 rounded font-bold">
                ✓ Equipment registered and published to the SHAREGRID directory!
              </div>
            )}

            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">Equipment Title / Model Name</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Leica DM6 B Upright Research Microscope"
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Discipline Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ResourceCategory)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
                >
                  <option value="laboratory-equipment">Laboratory Equipment</option>
                  <option value="equipment-tools">Equipment &amp; Tools</option>
                  <option value="presentation-projectors">Projectors &amp; Presentation</option>
                  <option value="cameras-microphones">Cameras &amp; Microphones</option>
                  <option value="arduino-iot-kits">Arduino &amp; IoT Kits</option>
                  <option value="cnc-fabrication">CNC &amp; Fabrication Tools</option>
                  <option value="spaces-meeting-rooms">Research Spaces &amp; Rooms</option>
                  <option value="computers-hardware">Computers &amp; Specialised HW</option>
                </select>
              </div>
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Hourly Rate (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={newHourlyRate}
                  onChange={(e) => setNewHourlyRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-charcoal-700 font-semibold mb-1">Description &amp; Technical Scope</label>
              <textarea
                required
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Detail optical resolution, operating ranges, specimen requirements..."
                className="w-full p-2.5 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Building &amp; Lab Suite</label>
                <input
                  type="text"
                  required
                  value={newBuilding}
                  onChange={(e) => setNewBuilding(e.target.value)}
                  placeholder="e.g. Curie Hall, Lab 304"
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
                />
              </div>
              <div>
                <label className="block text-charcoal-700 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 p-3 bg-ivory-100 rounded border border-ivory-300 cursor-pointer">
              <input
                type="checkbox"
                checked={hasOperator}
                onChange={(e) => setHasOperator(e.target.checked)}
                className="accent-forest-800"
              />
              <span className="text-charcoal-800">Senior facility technician available to assist visiting researchers</span>
            </label>

            <button
              type="submit"
              className="w-full py-2.5 bg-forest-900 hover:bg-forest-800 text-ivory-50 font-bold rounded transition-colors shadow-sm"
            >
              Publish Resource to SHAREGRID Network
            </button>
          </form>
        )}

        {/* ── TAB: USAGE HISTORY ── */}
        {activeTab === 'history' && (
          <div className="p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-600">Audit-Ready Utilization Log</h3>
            <div className="divide-y divide-ivory-200 text-xs">
              {pastSessions.length > 0 ? (
                pastSessions.map((s) => (
                  <div key={s.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-forest-950 block">{s.resourceTitle}</span>
                      <span className="text-charcoal-500">
                        {s.sessionDate} · {s.borrowerName} ({s.borrowerInstitution})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-forest-900 block">
                        ₹{s.totalCost.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-forest-700 font-semibold">Ledger Cleared ✓</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-charcoal-500 text-center">No completed sessions yet.</p>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: INCIDENT REPORTS ── */}
        {activeTab === 'incidents' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-600">
                Equipment Incident Reports
              </h3>
              <span className="text-xs text-charcoal-500">
                {openIncidents.length} open · {ownerIncidents.filter(i => i.status === 'resolved').length} resolved
              </span>
            </div>

            {ownerIncidents.length > 0 ? (
              <div className="space-y-3">
                {ownerIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    className={`p-4 rounded border text-xs space-y-2 ${
                      inc.status === 'resolved' ? 'bg-ivory-50 border-ivory-200 opacity-70' : 'bg-white border-ivory-300'
                    }`}
                  >
                    <div className="flex items-start gap-2 justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded border font-bold text-[10px] capitalize ${severityColor[inc.severity]}`}>
                          {inc.severity}
                        </span>
                        <span className="font-bold text-forest-950">{inc.resourceTitle}</span>
                        <span className="text-charcoal-500 capitalize">{inc.incidentType.replace(/-/g, ' ')}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        inc.status === 'resolved'
                          ? 'bg-forest-100 text-forest-900'
                          : inc.status === 'investigating'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}>
                        {inc.status}
                      </span>
                    </div>

                    <p className="text-charcoal-600 italic">
                      Reported by {inc.reportedByName} · {inc.timestamp}
                    </p>
                    <p className="text-charcoal-800 leading-relaxed">{inc.description}</p>

                    {inc.adminResolutionNotes && (
                      <div className="p-2 bg-forest-50 border border-forest-200 rounded text-forest-900">
                        <strong>Resolution:</strong> {inc.adminResolutionNotes}
                      </div>
                    )}

                    {inc.status !== 'resolved' && (
                      resolvingIncidentId === inc.id ? (
                        <div className="space-y-2 pt-2 border-t border-ivory-200">
                          <label className="block font-semibold text-charcoal-800">Resolution Notes:</label>
                          <textarea
                            rows={2}
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            placeholder="Describe how the issue was addressed..."
                            className="w-full p-2 bg-ivory-100 border border-ivory-300 rounded outline-none resize-none"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setResolvingIncidentId(null)}
                              className="px-3 py-1 bg-white border border-ivory-300 text-charcoal-700 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleResolveIncident(inc.id)}
                              disabled={!resolutionNotes.trim()}
                              className="px-3 py-1 bg-forest-900 text-ivory-50 font-bold rounded disabled:opacity-50"
                            >
                              Mark Resolved
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setResolvingIncidentId(inc.id)}
                          className="text-xs px-3 py-1.5 bg-forest-50 border border-forest-200 text-forest-900 rounded font-semibold hover:bg-forest-100 transition-colors"
                        >
                          Mark as Resolved
                        </button>
                      )
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-charcoal-500">
                <AlertCircle className="w-8 h-8 text-charcoal-400 mx-auto mb-2" />
                <p className="text-xs">No incident reports for your resources yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Resource Modal */}
      {editingResource && editResource && (
        <EditResourceModal
          resource={editResource}
          onClose={() => setEditingResource(null)}
          onSaved={() => setEditingResource(null)}
        />
      )}
    </div>
  );
};
