import React, { useState } from 'react';
import { X, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { BookingRequest } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';

interface IncidentReportModalProps {
  booking: BookingRequest;
  onClose: () => void;
  onSubmitted: () => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  booking,
  onClose,
  onSubmitted,
}) => {
  const { user, reportIncident } = useAuth();

  const [incidentType, setIncidentType] = useState<
    'equipment-damage' | 'missing-component' | 'calibration-loss' | 'safety-violation'
  >('equipment-damage');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [referenceId, setReferenceId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !description.trim()) return;
    setIsSubmitting(true);
    const id = await reportIncident({
      bookingId: booking.id,
      resourceId: booking.resourceId,
      resourceTitle: booking.resourceTitle,
      reportedByEmail: user.email,
      reportedByName: user.fullName,
      reportedByRole: user.role,
      incidentType,
      severity,
      description,
    });
    setIsSubmitting(false);
    setReferenceId(id);
    setDone(true);
    setTimeout(() => onSubmitted(), 2000);
  };

  const severityColors: Record<string, string> = {
    low: 'bg-forest-50 text-forest-900 border-forest-300',
    medium: 'bg-amber-50 text-amber-900 border-amber-300',
    high: 'bg-orange-50 text-orange-900 border-orange-300',
    critical: 'bg-rose-50 text-rose-900 border-rose-300',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-ivory-50 border border-ivory-300 w-full max-w-md rounded shadow-modal overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-rose-50 border-b border-rose-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-rose-100 border border-rose-300 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-700" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                Incident Report
              </span>
              <h3 className="text-sm font-bold text-rose-950">File Equipment Incident</h3>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-rose-500 hover:text-rose-800 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-forest-100 border border-forest-300 flex items-center justify-center mx-auto">
              <Check className="w-7 h-7 text-forest-700" />
            </div>
            <h4 className="text-sm font-bold text-forest-950">Incident Logged</h4>
            <p className="text-xs text-charcoal-600">
              Reference: <span className="font-mono font-bold">{referenceId}</span>
            </p>
            <p className="text-xs text-charcoal-600">
              Admin team will review and follow up within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Booking Info */}
            <div className="p-3 bg-white border border-ivory-300 rounded space-y-1">
              <div className="flex justify-between items-center">
                <strong className="text-forest-950">{booking.resourceTitle}</strong>
                <span className="font-mono text-[10px] bg-forest-950 text-ivory-50 px-1.5 py-0.5 rounded">{booking.resourceCode}</span>
              </div>
              <div className="text-charcoal-600">
                {booking.institutionName} · {booking.sessionDate}
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] leading-relaxed">
              <strong>Note:</strong> Report factual observations only. Do not make attributions or accusations. 
              Admin will conduct the investigation.
            </div>

            {/* Incident Type */}
            <div>
              <label className="block font-bold text-charcoal-800 mb-1.5">Incident Type</label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value as typeof incidentType)}
                className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
              >
                <option value="equipment-damage">Equipment Damage</option>
                <option value="missing-component">Missing Component or Accessory</option>
                <option value="calibration-loss">Calibration Loss / Malfunction</option>
                <option value="safety-violation">Safety Protocol Issue</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block font-bold text-charcoal-800 mb-1.5">Severity Level</label>
              <div className="grid grid-cols-4 gap-2">
                {(['low', 'medium', 'high', 'critical'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className={`py-1.5 rounded border capitalize font-bold text-[10px] transition-all ${
                      severity === s
                        ? severityColors[s]
                        : 'bg-white text-charcoal-600 border-ivory-300 hover:bg-ivory-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-charcoal-800 mb-1.5">
                Description (factual observations only) <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you observed. Include specific details (e.g. 'Stage bracket bent at approx. 30 degrees', 'Power supply fan not spinning')."
                className="w-full p-2.5 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none resize-none"
              />
            </div>

            <div className="p-3 bg-forest-50 border border-forest-200 rounded text-forest-900 text-[11px] leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
              <span>
                Report filed by <strong>{user?.fullName}</strong> ({user?.role}) and routed to Admin review.
                No automatic sanctions are applied.
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
                disabled={isSubmitting || !description.trim()}
                className="flex-1 py-2.5 bg-rose-700 hover:bg-rose-800 text-ivory-50 font-bold rounded flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'File Incident Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
