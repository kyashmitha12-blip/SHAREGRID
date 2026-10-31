import React, { useState } from 'react';
import { X, Star, Check, ShieldCheck, AlertTriangle } from 'lucide-react';
import { BookingRequest } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';

interface ConditionReportModalProps {
  booking: BookingRequest;
  reportType: 'before-use' | 'after-use';
  onClose: () => void;
  onSubmitted: () => void;
}

const StarRating: React.FC<{ value: number; onChange: (v: number) => void; label: string }> = ({
  value,
  onChange,
  label,
}) => (
  <div>
    <span className="block font-semibold text-charcoal-800 mb-1">{label}</span>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
            n <= value ? 'text-forest-700' : 'text-ivory-400'
          }`}
        >
          <Star className="w-5 h-5" fill={n <= value ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>
      ))}
      <span className="text-xs text-charcoal-500 ml-2 self-center">{value}/5</span>
    </div>
  </div>
);

export const ConditionReportModal: React.FC<ConditionReportModalProps> = ({
  booking,
  reportType,
  onClose,
  onSubmitted,
}) => {
  const { user, submitConditionReport } = useAuth();

  const [rating, setRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [accessoriesPresent, setAccessoriesPresent] = useState(true);
  const [operationalCheckPassed, setOperationalCheckPassed] = useState(true);
  const [defectsNoted, setDefectsNoted] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    const ok = await submitConditionReport({
      bookingId: booking.id,
      resourceId: booking.resourceId,
      reportType,
      submittedBy: user.email,
      submittedByName: user.fullName,
      rating,
      cleanlinessRating,
      physicalDefectsNoted: defectsNoted || 'None',
      accessoriesPresent,
      operationalCheckPassed,
      notes: notes || 'No additional notes.',
    });
    setIsSubmitting(false);
    if (ok) {
      setDone(true);
      setTimeout(() => onSubmitted(), 1500);
    }
  };

  const isBefore = reportType === 'before-use';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-ivory-50 border border-ivory-300 w-full max-w-md rounded shadow-modal overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ivory-300">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 block">
              {isBefore ? 'Pre-Use' : 'Post-Use'} Condition Report
            </span>
            <h3 className="text-base font-bold text-forest-950">
              {isBefore ? 'Before-Use Inspection' : 'After-Use Inspection'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-charcoal-400 hover:text-charcoal-800 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-forest-100 border border-forest-300 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 text-forest-700" />
            </div>
            <h4 className="text-sm font-bold text-forest-950">Report Submitted</h4>
            <p className="text-xs text-charcoal-600">
              Condition report recorded in the facility audit trail.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Resource Info */}
            <div className="p-3 bg-white border border-ivory-300 rounded text-xs space-y-1">
              <div className="flex justify-between items-center">
                <strong className="text-forest-950">{booking.resourceTitle}</strong>
                <span className="font-mono text-[10px] bg-forest-950 text-ivory-50 px-1.5 py-0.5 rounded">{booking.resourceCode}</span>
              </div>
              <div className="text-charcoal-600">
                {booking.institutionName} · {booking.sessionDate}
              </div>
              <div className="text-charcoal-600">
                Session REF: <span className="font-mono">{booking.id}</span>
              </div>
            </div>

            {/* Ratings */}
            <div className="space-y-3 p-4 bg-white border border-ivory-300 rounded">
              <StarRating value={rating} onChange={setRating} label="Overall Equipment Condition" />
              <StarRating value={cleanlinessRating} onChange={setCleanlinessRating} label="Cleanliness & Workspace" />
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              {[
                {
                  id: 'accessories',
                  label: 'All accessories and consumables present',
                  checked: accessoriesPresent,
                  onChange: setAccessoriesPresent,
                },
                {
                  id: 'operational',
                  label: 'Operational check passed (powers on, calibrated)',
                  checked: operationalCheckPassed,
                  onChange: setOperationalCheckPassed,
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2.5 p-3 bg-ivory-50 border border-ivory-200 rounded cursor-pointer hover:bg-ivory-100"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => item.onChange(e.target.checked)}
                    className="accent-forest-800"
                  />
                  <span className="text-charcoal-800">{item.label}</span>
                </label>
              ))}
            </div>

            {/* Physical Defects */}
            <div>
              <label className="block font-bold text-charcoal-800 mb-1">
                Physical Defects Noted (or "None")
              </label>
              <textarea
                rows={2}
                value={defectsNoted}
                onChange={(e) => setDefectsNoted(e.target.value)}
                placeholder='e.g. "Minor scratch on stage casing. Does not affect function." or "None"'
                className="w-full p-2.5 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none resize-none"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block font-bold text-charcoal-800 mb-1">
                Additional Notes (optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any other observations for the facility coordinator..."
                className="w-full p-2.5 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none resize-none"
              />
            </div>

            {!operationalCheckPassed && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  If there is a defect affecting operation, please also submit an Incident Report after this.
                </span>
              </div>
            )}

            <div className="p-3 bg-forest-50 border border-forest-200 rounded text-forest-900 text-[11px] leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
              <span>
                This report is signed by <strong>{user?.fullName}</strong> and forms part of the equipment custody audit trail.
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-ivory-200 text-charcoal-700 font-semibold rounded hover:bg-ivory-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-forest-900 hover:bg-forest-800 text-ivory-50 font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5 text-accent-lime" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
