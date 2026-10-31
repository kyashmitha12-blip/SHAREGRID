import React, { useState } from 'react';
import { X, Clock, Users, AlertCircle, CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ResourceItem } from '../../types/resource';

interface WaitingListModalProps {
  resource: ResourceItem;
  requestedDate: string;
  requestedSlot: string;
  allResources: ResourceItem[];
  onClose: () => void;
  onJoined: (position: number) => void;
}

const ALLOCATION_REASONS = [
  'Final year thesis / capstone project',
  'Funded research grant (external)',
  'Course project (credit)',
  'PhD dissertation requirement',
  'Post-doctoral research work',
  'Institutional collaboration project',
  'Faculty-supervised research',
  'Conference deadline submission',
];

export const WaitingListModal: React.FC<WaitingListModalProps> = ({
  resource,
  requestedDate,
  requestedSlot,
  allResources,
  onClose,
  onJoined,
}) => {
  const { user, joinWaitingList, waitingLists } = useAuth();

  const [allocationReason, setAllocationReason] = useState(ALLOCATION_REASONS[0]);
  const [customNote, setCustomNote] = useState('');
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);

  // Current queue for this resource + slot
  const currentQueue = waitingLists.filter(
    (e) =>
      e.resourceId === resource.id &&
      e.requestedDate === requestedDate &&
      e.requestedSlot === requestedSlot &&
      e.status === 'waiting'
  );

  // Alternative resources in the same category that are available
  const alternatives = allResources.filter(
    (r) =>
      r.id !== resource.id &&
      r.category === resource.category &&
      r.availability.status === 'available'
  ).slice(0, 3);

  const alreadyWaiting = waitingLists.some(
    (e) =>
      e.resourceId === resource.id &&
      e.borrowerEmail === user?.email &&
      e.status === 'waiting'
  );

  const handleJoin = async () => {
    if (!user) return;
    setJoining(true);
    const result = await joinWaitingList({
      resourceId: resource.id,
      resourceTitle: resource.title,
      resourceCode: resource.code,
      resourceImage: resource.image,
      institutionName: resource.institution.name,
      borrowerId: user.id,
      borrowerName: user.fullName,
      borrowerEmail: user.email,
      borrowerInstitution: user.institution,
      requestedDate,
      requestedSlot,
      allocationReason: `${allocationReason}${customNote ? ` — ${customNote}` : ''}`,
    });
    setJoining(false);
    if (result.success) {
      setQueuePosition(result.position);
      setJoined(true);
      setTimeout(() => onJoined(result.position), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/60 backdrop-blur-sm">
      <div className="bg-white rounded shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-amber-50 border-b border-amber-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-amber-100 border border-amber-300 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-amber-900 block uppercase tracking-wider">
                Join Waiting List
              </span>
              <span className="text-[11px] text-amber-800">{resource.code} — {resource.title}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded flex items-center justify-center hover:bg-amber-100 text-amber-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {joined ? (
          /* Success State */
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-forest-100 border border-forest-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-forest-700" />
            </div>
            <h3 className="text-base font-bold text-forest-950">You're #{queuePosition} in the queue</h3>
            <p className="text-xs text-charcoal-600 max-w-xs mx-auto">
              We'll notify you immediately when a slot becomes available. Your priority score has been recorded.
            </p>
            <div className="px-4 py-2.5 bg-forest-50 border border-forest-200 rounded inline-block text-xs font-mono text-forest-900 font-bold">
              WAITLIST POSITION: #{queuePosition}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Conflict Info */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded flex items-start gap-2 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Slot unavailable:</strong> {requestedDate} at {requestedSlot} is currently booked.{' '}
                {currentQueue.length > 0 && (
                  <span>{currentQueue.length} researcher(s) already in queue.</span>
                )}
              </div>
            </div>

            {alreadyWaiting && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900 font-semibold">
                You are already on the waiting list for this resource and slot.
              </div>
            )}

            {/* Current Queue Status */}
            {currentQueue.length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-ivory-50 border border-ivory-300 rounded text-xs">
                <Users className="w-4 h-4 text-charcoal-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-forest-950 block">Current waitlist: {currentQueue.length} ahead of you</span>
                  <span className="text-charcoal-500">Your position would be #{currentQueue.length + 1}</span>
                </div>
              </div>
            )}

            {/* Allocation Reason */}
            {!alreadyWaiting && (
              <>
                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                    Priority Justification <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={allocationReason}
                    onChange={(e) => setAllocationReason(e.target.value)}
                    className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded text-xs focus:border-forest-700 outline-none"
                  >
                    {ALLOCATION_REASONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                    Additional Context (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g. Deadline submission for IEEE conference, January 15th"
                    className="w-full p-2.5 bg-ivory-100 border border-ivory-300 rounded text-xs focus:border-forest-700 outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="w-full py-2.5 bg-forest-900 hover:bg-forest-800 text-ivory-50 text-xs font-bold rounded transition-colors flex items-center justify-center gap-2"
                >
                  <Clock className="w-3.5 h-3.5 text-accent-lime" />
                  <span>{joining ? 'Joining queue…' : 'Join Waiting List'}</span>
                </button>
              </>
            )}

            {/* Alternative Resources */}
            {alternatives.length > 0 && (
              <div className="border-t border-ivory-200 pt-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Layers className="w-3.5 h-3.5 text-forest-700" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-600">
                    Available Alternatives in Same Category
                  </span>
                </div>
                <div className="space-y-2">
                  {alternatives.map((alt) => (
                    <div key={alt.id} className="flex items-center gap-3 p-2.5 bg-ivory-50 border border-ivory-200 rounded text-xs">
                      <div className="w-10 h-10 rounded overflow-hidden bg-ivory-200 border border-ivory-300 flex-shrink-0">
                        <img src={alt.image} alt={alt.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-forest-950 block truncate">{alt.title}</span>
                        <span className="text-charcoal-500">{alt.institution.name} · ₹{alt.pricing.hourlyRate}/hr</span>
                      </div>
                      <span className="px-2 py-0.5 bg-forest-100 text-forest-800 rounded text-[10px] font-bold flex items-center gap-1 flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-forest-600" />
                        Available
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-charcoal-500 mt-2 flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" />
                  Go back to directory to book any of these alternatives directly.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
