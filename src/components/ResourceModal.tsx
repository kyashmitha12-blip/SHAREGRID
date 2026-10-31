import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  Building,
  Check
} from 'lucide-react';
import { ResourceItem } from '../types/resource';
import { useAuth } from '../context/AuthContext';

interface ResourceModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
}

const getLocalDate = (): string => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export const ResourceModal: React.FC<ResourceModalProps> = ({ resource, onClose }) => {
  const { user, createBooking } = useAuth();
  const [selectedHours, setSelectedHours] = useState<number>(4);
  const [withOperator, setWithOperator] = useState<boolean>(true);
  const [sessionDate, setSessionDate] = useState<string>(getLocalDate);
  const [sessionTime, setSessionTime] = useState<string>('09:00');
  const [projectSummary, setProjectSummary] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!resource) return;
    setSelectedHours(4);
    setWithOperator(true);
    setSessionDate(getLocalDate());
    setSessionTime('09:00');
    setProjectSummary('');
    setIsSubmitting(false);
    setIsSubmitted(false);
    setBookingReference(null);
    setBookingError(null);
  }, [resource?.id]);

  if (!resource) return null;

  const baseRate = resource.pricing.hourlyRate || Math.round((resource.pricing.dailyRate || 500) / 8);
  const operatorSelected = resource.operatorAssistance && withOperator;
  const operatorFee = operatorSelected ? 45 * selectedHours : 0;
  const subtotal = (baseRate * selectedHours) + operatorFee;
  const totalCost = subtotal;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    if (!user || user.role !== 'borrower') {
      setBookingError('Sign in to a borrower demo profile to request a booking.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBooking({
        resourceId: resource.id,
        resourceTitle: resource.title,
        resourceCode: resource.code,
        resourceImage: resource.image,
        borrowerId: user.id,
        borrowerName: user.fullName,
        borrowerEmail: user.email,
        borrowerInstitution: user.institution,
        ownerId: resource.ownerId || '',
        institutionName: resource.institution.name,
        sessionDate,
        sessionTime,
        durationHours: selectedHours,
        withOperator: operatorSelected,
        projectBrief: projectSummary,
        totalCost,
      });

      if (!result.success || !result.id) {
        setBookingError(result.error || 'The demo booking request could not be saved.');
        return;
      }

      setBookingReference(result.id);
      setIsSubmitted(true);
    } catch (error: unknown) {
      setBookingError(error instanceof Error ? error.message : 'The demo booking request could not be saved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fade-in">
      <div 
        className="bg-ivory-50 border border-ivory-300 w-full max-w-4xl rounded shadow-modal overflow-hidden relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-ivory-300">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 bg-forest-950 text-ivory-50 font-mono text-xs font-bold rounded">
              {resource.code}
            </span>
            <span className="text-xs font-semibold text-charcoal-500 uppercase tracking-wider">
              {resource.categoryLabel}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-charcoal-400 hover:text-charcoal-800 hover:bg-ivory-200 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Details & Specs */}
          <div className="lg:col-span-7 p-5 sm:p-6 space-y-6">
            {/* Image Preview */}
            <div className="h-56 sm:h-64 rounded overflow-hidden relative border border-ivory-300 bg-ivory-200">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-forest-950/90 backdrop-blur-md px-3 py-1.5 rounded text-ivory-50 text-xs">
                <span className="font-semibold">{resource.location.building}</span>
                <span className="mx-1.5 text-charcoal-400">·</span>
                <span>{resource.location.city}</span>
              </div>
            </div>

            {/* Title & Host info */}
            <div>
              <div className="flex items-center gap-2 text-xs text-charcoal-600 mb-1">
                <Building className="w-3.5 h-3.5 text-forest-700" />
                <span className="font-semibold text-forest-900">{resource.institution.name}</span>
                <span>({resource.institution.department})</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-forest-950 tracking-tight leading-snug">
                {resource.title}
              </h2>
            </div>

            {/* Comprehensive Description */}
            <div className="text-xs sm:text-sm text-charcoal-700 leading-relaxed space-y-2">
              <p>{resource.description}</p>
              {resource.longDescription && (
                <p className="text-charcoal-600 border-l-2 border-forest-600 pl-3 italic">
                  {resource.longDescription}
                </p>
              )}
            </div>

            {/* Technical Specifications Sheet */}
            <div>
              <h4 className="text-xs font-bold text-forest-950 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-forest-700" />
                <span>Listed Specifications (Demo Data)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {resource.specifications.map((spec, i) => (
                  <div key={i} className="p-2.5 bg-white border border-ivory-300 rounded">
                    <span className="text-charcoal-400 block text-[10px] uppercase font-semibold">
                      {spec.label}
                    </span>
                    <span className="font-bold text-charcoal-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo governance notice */}
            <div className="p-3.5 bg-forest-50 border border-forest-200 rounded text-xs text-forest-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-forest-700" />
                <span>Eligibility and Safety Requirements</span>
              </div>
              <p className="text-[11px] text-forest-800 leading-relaxed">
                Review the host's listed requirements before requesting access. This demo does not validate institutional agreements, certifications, or access credentials.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Reservation & Calculation Panel */}
          <div className="lg:col-span-5 bg-white border-t lg:border-t-0 lg:border-l border-ivory-300 p-5 sm:p-6 flex flex-col justify-between">
            {!isSubmitted ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="border-b border-ivory-300 pb-3">
                  <h3 className="text-base font-extrabold text-forest-950">
                    Schedule Slot Request
                  </h3>
                  <p className="text-xs text-charcoal-500">
                    Requests are saved in this browser-local demo; no live calendar is connected.
                  </p>
                </div>

                {/* Date & Time Select */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-600 uppercase mb-1">
                      Session Date
                    </label>
                    <input
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      min={getLocalDate()}
                      className="w-full px-2.5 py-1.5 text-xs bg-ivory-100 border border-ivory-300 rounded font-medium text-charcoal-800 focus:border-forest-700 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal-600 uppercase mb-1">
                      Start Time
                    </label>
                    <select
                      value={sessionTime}
                      onChange={(e) => setSessionTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-ivory-100 border border-ivory-300 rounded font-medium text-charcoal-800 focus:border-forest-700 outline-none"
                    >
                      <option value="09:00">09:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="13:30">01:30 PM</option>
                      <option value="15:30">03:30 PM</option>
                    </select>
                  </div>
                </div>

                {/* Duration Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="font-semibold text-charcoal-600 uppercase text-[11px]">
                      Session Duration
                    </span>
                    <span className="font-bold text-forest-950">{selectedHours} Hours</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={selectedHours}
                    onChange={(e) => setSelectedHours(Number(e.target.value))}
                    className="w-full accent-forest-800 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-charcoal-400 mt-0.5">
                    <span>1 hr</span>
                    <span>4 hrs (standard)</span>
                    <span>12 hrs</span>
                  </div>
                </div>

                {/* Operator Toggle */}
                {resource.operatorAssistance && (
                  <label className="flex items-start gap-2.5 p-3 bg-ivory-100 border border-ivory-300 rounded cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={withOperator}
                      onChange={(e) => setWithOperator(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-forest-800 accent-forest-800"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-charcoal-900 block">
                        Include Operator Assistance (Sample)
                      </span>
                      <span className="text-charcoal-500 text-[11px] block">
                        Assists with sample mounting, calibration, and beam alignment.
                      </span>
                    </div>
                  </label>
                )}

                {/* Project Brief */}
                <div>
                  <label className="block text-[11px] font-semibold text-charcoal-600 uppercase mb-1">
                    Research Objective / Project Reference
                  </label>
                  <textarea
                    rows={2}
                    value={projectSummary}
                    onChange={(e) => setProjectSummary(e.target.value)}
                    placeholder="Briefly state sample type or machining tolerances..."
                    className="w-full p-2 text-xs bg-ivory-100 border border-ivory-300 rounded font-normal text-charcoal-800 focus:border-forest-700 outline-none"
                    required
                  />
                </div>

                {/* Transparent Price Breakdown */}
                <div className="p-3.5 bg-ivory-100 border border-ivory-200 rounded space-y-1.5 text-xs">
                  <div className="flex justify-between text-charcoal-600">
                    <span>{resource.pricing.currency}{baseRate} x {selectedHours} hrs usage</span>
                    <span>{resource.pricing.currency}{baseRate * selectedHours}</span>
                  </div>
                  {withOperator && (
                    <div className="flex justify-between text-charcoal-600">
                      <span>Operator support (₹45/hr sample rate)</span>
                      <span>{resource.pricing.currency}{operatorFee}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-ivory-300 flex justify-between font-bold text-sm text-forest-950">
                    <span>Estimated Demo Total</span>
                    <span>{resource.pricing.currency}{totalCost}</span>
                  </div>
                  <p className="text-[10px] text-charcoal-500">Sample estimate only. No payment is collected.</p>
                </div>

                {bookingError && (
                  <p role="alert" className="p-2.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900">
                    {bookingError}
                  </p>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-forest-900 hover:bg-forest-800 text-ivory-50 text-xs font-bold rounded shadow transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Saving demo request...</span>
                  ) : (
                    <>
                      <span>Request Booking (Demo)</span>
                      <ArrowRight className="w-3.5 h-3.5 text-accent-lime" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="p-6 text-center my-auto space-y-4">
                <div className="w-12 h-12 bg-forest-100 text-forest-800 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h3 className="text-lg font-bold text-forest-950">
                  Booking Request Saved (Demo)
                </h3>
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  Your request for <strong className="text-forest-900">{resource.code}</strong> on {sessionDate} was saved to this browser's demo data. No message was sent to the facility and no voucher was issued.
                </p>
                <div className="p-3 bg-ivory-100 rounded text-left text-xs font-mono space-y-1">
                  <div className="text-charcoal-500">REF: {bookingReference}</div>
                  <div className="text-charcoal-700">STATUS: Pending (Demo)</div>
                  <div className="text-charcoal-700">PAYMENT: None collected</div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-2 px-4 bg-forest-900 text-ivory-50 text-xs font-semibold rounded hover:bg-forest-800"
                >
                  Return to Directory
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
