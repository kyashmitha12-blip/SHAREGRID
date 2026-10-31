import React, { useState } from 'react';
import { X, Check, LogOut, AlertCircle } from 'lucide-react';
import { BookingRequest } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';

interface CheckOutModalProps {
  booking: BookingRequest;
  onClose: () => void;
  onCheckedOut: () => void;
}

export const CheckOutModal: React.FC<CheckOutModalProps> = ({
  booking,
  onClose,
  onCheckedOut,
}) => {
  const { performCheckOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [confirmCleaned, setConfirmCleaned] = useState(false);
  const [confirmAccessories, setConfirmAccessories] = useState(false);
  const [confirmPoweredOff, setConfirmPoweredOff] = useState(false);

  const canSubmit = confirmCleaned && confirmAccessories && confirmPoweredOff;

  const handleCheckOut = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError(null);
    const result = await performCheckOut(booking.id);
    setIsSubmitting(false);
    if (result.success) {
      setDone(true);
      setTimeout(() => onCheckedOut(), 1500);
    } else {
      setError(result.error || 'Check-out failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-ivory-50 border border-ivory-300 w-full max-w-md rounded shadow-modal overflow-hidden my-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ivory-300">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 block">Session Closure</span>
            <h3 className="text-base font-bold text-forest-950">Laboratory Check-Out</h3>
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
            <h4 className="text-sm font-bold text-forest-950">Session Completed!</h4>
            <p className="text-xs text-charcoal-600">
              Check-out recorded. Please submit an after-use condition report from your booking history.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5 text-xs">
            {/* Booking info */}
            <div className="p-3 bg-white border border-ivory-300 rounded space-y-1">
              <div className="flex justify-between items-center">
                <strong className="text-forest-950">{booking.resourceTitle}</strong>
                <span className="font-mono text-[10px] bg-forest-950 text-ivory-50 px-1.5 py-0.5 rounded">{booking.resourceCode}</span>
              </div>
              <div className="text-charcoal-600">{booking.institutionName} · {booking.sessionDate}</div>
              <div className="text-charcoal-600">Researcher: <strong>{booking.borrowerName}</strong></div>
              {booking.checkInRecord && (
                <div className="text-forest-800 font-semibold">
                  Checked in at: {booking.checkInRecord.checkInTime}
                </div>
              )}
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-300 rounded text-rose-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <p className="font-bold text-forest-950 mb-3">Pre-Checkout Checklist</p>
              <div className="space-y-3">
                {[
                  {
                    id: 'cleaned',
                    label: 'Equipment cleaned and returned to proper configuration',
                    checked: confirmCleaned,
                    onChange: setConfirmCleaned,
                  },
                  {
                    id: 'accessories',
                    label: 'All accessories and consumables accounted for',
                    checked: confirmAccessories,
                    onChange: setConfirmAccessories,
                  },
                  {
                    id: 'poweredOff',
                    label: 'System powered down / properly shut off as per protocol',
                    checked: confirmPoweredOff,
                    onChange: setConfirmPoweredOff,
                  },
                ].map((item) => (
                  <label key={item.id} className="flex items-start gap-3 p-3 bg-ivory-50 border border-ivory-200 rounded cursor-pointer hover:bg-ivory-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={(e) => item.onChange(e.target.checked)}
                      className="mt-0.5 accent-forest-800 flex-shrink-0"
                    />
                    <span className="text-charcoal-800">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] leading-relaxed">
              After check-out, please file an <strong>After-Use Condition Report</strong> from your booking history to complete the session record.
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
                type="button"
                onClick={handleCheckOut}
                disabled={!canSubmit || isSubmitting}
                className="flex-1 py-2.5 bg-forest-900 hover:bg-forest-800 text-ivory-50 font-bold rounded flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-3.5 h-3.5 text-accent-lime" />
                <span>{isSubmitting ? 'Processing...' : 'Confirm Check-Out'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
