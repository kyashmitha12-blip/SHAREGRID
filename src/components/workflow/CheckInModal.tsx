import React, { useState } from 'react';
import {
  X,
  Check,
  QrCode,
  ShieldCheck,
  Key,
  AlertCircle,
} from 'lucide-react';
import { BookingRequest } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';

interface CheckInModalProps {
  booking: BookingRequest;
  onClose: () => void;
  onCheckedIn: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  booking,
  onClose,
  onCheckedIn,
}) => {
  const { performCheckIn } = useAuth();
  const [manualCode, setManualCode] = useState('');
  const [method, setMethod] = useState<'qr-scan' | 'manual-token'>('qr-scan');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const expectedPassCode = `PASS-${booking.id.replace('BK-', '').toUpperCase()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (method === 'manual-token') {
      if (manualCode.trim().toUpperCase() !== expectedPassCode.toUpperCase()) {
        setError(`Invalid Gate Pass token. Expected: ${expectedPassCode}`);
        return;
      }
    }

    setIsSubmitting(true);
    const result = await performCheckIn(booking.id, method);
    setIsSubmitting(false);

    if (result.success) {
      setDone(true);
      setTimeout(() => onCheckedIn(), 1500);
    } else {
      setError(result.error || 'Check-in failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-ivory-50 border border-ivory-300 w-full max-w-md rounded shadow-modal overflow-hidden relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ivory-300">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 block">
              Facility Access Control
            </span>
            <h3 className="text-base font-bold text-forest-950">Laboratory Check-In &amp; Gate Pass</h3>
          </div>
          <button onClick={onClose} className="p-1 text-charcoal-400 hover:text-charcoal-800 rounded" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-forest-100 border border-forest-300 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 text-forest-700" />
            </div>
            <h4 className="text-sm font-bold text-forest-950">Check-In Recorded!</h4>
            <p className="text-xs text-charcoal-600">
              Session started. You can now submit a before-use condition report.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Booking Brief */}
            <div className="p-3 bg-white border border-ivory-300 rounded text-xs space-y-1">
              <div className="flex justify-between items-center">
                <strong className="text-forest-950">{booking.resourceTitle}</strong>
                <span className="font-mono text-[10px] bg-forest-950 text-ivory-50 px-1.5 py-0.5 rounded">
                  {booking.resourceCode}
                </span>
              </div>
              <div className="text-charcoal-600">
                {booking.institutionName} · {booking.sessionDate} ({booking.sessionTime})
              </div>
              <div className="text-charcoal-600">
                Researcher: <strong>{booking.borrowerName}</strong>
              </div>
            </div>

            {/* Method Tabs */}
            <div className="flex border-b border-ivory-300 text-xs font-semibold">
              {(['qr-scan', 'manual-token'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`flex-1 pb-2 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                    method === m
                      ? 'border-forest-900 text-forest-950 font-bold'
                      : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
                  }`}
                >
                  {m === 'qr-scan' ? <QrCode className="w-3.5 h-3.5" /> : <Key className="w-3.5 h-3.5" />}
                  <span>{m === 'qr-scan' ? 'Digital QR Pass' : 'Manual Token'}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-300 rounded text-rose-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {method === 'qr-scan' ? (
                <div className="p-5 bg-white border border-ivory-300 rounded text-center space-y-3">
                  <div className="w-36 h-36 mx-auto bg-white border-2 border-forest-950 p-2 rounded shadow-xs flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-forest-950 fill-current">
                      <rect x="5" y="5" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="12" y="12" width="14" height="14" rx="1" fill="currentColor" />
                      <rect x="67" y="5" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="74" y="12" width="14" height="14" rx="1" fill="currentColor" />
                      <rect x="5" y="67" width="28" height="28" rx="2" fill="none" stroke="currentColor" strokeWidth="6" />
                      <rect x="12" y="74" width="14" height="14" rx="1" fill="currentColor" />
                      <rect x="42" y="10" width="6" height="6" />
                      <rect x="52" y="15" width="8" height="6" />
                      <rect x="40" y="26" width="6" height="12" />
                      <rect x="54" y="28" width="6" height="6" />
                      <rect x="10" y="44" width="8" height="8" />
                      <rect x="24" y="48" width="10" height="6" />
                      <rect x="40" y="44" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
                      <circle cx="48" cy="52" r="3" fill="currentColor" />
                      <rect x="65" y="45" width="10" height="6" />
                      <rect x="80" y="40" width="10" height="10" />
                      <rect x="68" y="58" width="8" height="8" />
                      <rect x="82" y="56" width="8" height="8" />
                      <rect x="45" y="68" width="8" height="16" />
                      <rect x="58" y="72" width="10" height="6" />
                      <rect x="74" y="74" width="16" height="16" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-forest-950 tracking-wider block">
                      {expectedPassCode}
                    </span>
                    <span className="text-[11px] text-charcoal-500">
                      Scan at facility entrance or show to duty technician
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-charcoal-700 font-semibold">Enter Demo Gate Pass Code</label>
                  <input
                    type="text"
                    required
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder={`e.g. ${expectedPassCode}`}
                    className="w-full px-3 py-2 bg-white border border-ivory-300 rounded font-mono text-center tracking-widest text-sm uppercase focus:border-forest-700 outline-none"
                  />
                  <span className="text-[10px] text-charcoal-500 block text-center">
                    Demo token: <strong className="font-mono">{expectedPassCode}</strong>
                  </span>
                </div>
              )}

              <div className="p-3 bg-forest-50 border border-forest-200 rounded text-forest-900 text-[11px] leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
                  <span>Demo Check-In Record</span>
                </div>
                Confirming check-in saves a local demo timestamp and unlocks the before-use inspection report. No facility access is granted.
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
                  <span>{isSubmitting ? 'Saving...' : 'Record Demo Check-In'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
