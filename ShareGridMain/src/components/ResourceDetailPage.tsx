import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  Clock,
  Calendar,
  Building,
  FileText,
  Check,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Info,
  UserCheck,
  Send,
  Layers,
  Sparkles,
  Users,
} from 'lucide-react';
import { ResourceItem, TimeSlot } from '../types/resource';
import { useAuth } from '../context/AuthContext';
import { WaitingListModal } from './workflow/WaitingListModal';

interface ResourceDetailPageProps {
  resource: ResourceItem;
  onBack: () => void;
  onSelectRelatedResource: (resource: ResourceItem) => void;
  allResources: ResourceItem[];
  onNavigateToDashboard?: () => void;
}

export const ResourceDetailPage: React.FC<ResourceDetailPageProps> = ({
  resource,
  onBack,
  onSelectRelatedResource,
  allResources,
  onNavigateToDashboard,
}) => {
  const { user, createBooking } = useAuth();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [withOperator, setWithOperator] = useState(resource.operatorAssistance);
  const [requestHours, setRequestHours] = useState(4);
  const [projectSummary, setProjectSummary] = useState('');
  const [applicantAffiliation, setApplicantAffiliation] = useState(
    user ? `${user.institution} (${user.department})` : ''
  );
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');
  const [showWaitingList, setShowWaitingList] = useState(false);
  const [waitlistJoined, setWaitlistJoined] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState(0);

  const schedule = resource.availability.schedule || [];
  const currentDay = schedule[selectedDayIndex] || schedule[0];
  const images = resource.images && resource.images.length > 0 ? resource.images : [resource.image];

  const isUnavailable = resource.availability.status !== 'available';

  const handleBookingRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const rate = resource.pricing.hourlyRate || Math.round((resource.pricing.dailyRate || 100) / 8);
    const totalCost = (rate * requestHours) + (withOperator ? 40 * requestHours : 0);

    const result = await createBooking({
      resourceId: resource.id,
      resourceTitle: resource.title,
      resourceCode: resource.code,
      resourceImage: resource.image,
      borrowerId: user?.id || 'usr-guest',
      borrowerName: user?.fullName || 'Visiting Academic Researcher',
      borrowerEmail: user?.email || 'researcher@university.edu',
      borrowerInstitution: applicantAffiliation || user?.institution || 'Academic Institute',
      ownerId: 'usr-owner-01',
      institutionName: resource.institution.name,
      sessionDate: currentDay?.date || '2026-11-04',
      sessionTime: selectedSlot ? selectedSlot.time : '09:00 - 13:00',
      durationHours: requestHours,
      withOperator,
      projectBrief: projectSummary,
      totalCost
    });

    setReferenceCode(result.id || result.error || 'BK-PENDING');
    setRequestSubmitted(true);
  };

  // Find related resources in same category
  const relatedResources = allResources
    .filter(item => item.id !== resource.id && item.category === resource.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-ivory-100 pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-ivory-300 text-xs">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-forest-900 hover:text-forest-700 font-bold px-3 py-1.5 bg-white border border-ivory-300 rounded shadow-sm transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Resource Directory</span>
          </button>

          <div className="flex items-center gap-2 text-charcoal-500 text-[11px]">
            <span>Directory</span>
            <span>/</span>
            <span className="text-forest-800 font-medium">{resource.categoryLabel}</span>
            <span>/</span>
            <span className="text-charcoal-800 font-bold truncate max-w-xs">{resource.code}</span>
          </div>
        </div>

        {/* Top Header Banner */}
        <div className="bg-white border border-ivory-300 rounded p-6 sm:p-8 shadow-editorial mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 bg-forest-950 text-ivory-50 font-mono text-xs font-bold rounded">
                {resource.code}
              </span>
              <span className="px-2.5 py-1 bg-ivory-100 text-forest-900 border border-ivory-300 text-xs font-semibold rounded">
                {resource.categoryLabel}
              </span>
              <span className="px-2.5 py-1 bg-ivory-100 text-charcoal-700 border border-ivory-300 text-xs font-medium rounded">
                Condition: {resource.conditionLabel}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-forest-50 border border-forest-200 text-forest-900 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-forest-600 animate-pulse" />
                {resource.availability.status === 'available' ? 'Available' : 'Currently Reserved'}
              </span>
              <span className="px-3 py-1 bg-ivory-100 text-charcoal-700 border border-ivory-300 text-xs font-medium rounded">
                {resource.approvalLabel}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-forest-950 tracking-tight leading-tight mb-3">
            {resource.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-charcoal-600 pt-2 border-t border-ivory-200">
            <div className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-forest-700" />
              <strong className="text-forest-950">{resource.institution.name}</strong>
              <span>({resource.institution.department})</span>
              {resource.institution.verified && (
                <span title="Verified Institutional Host" className="inline-flex">
                  <ShieldCheck className="w-4 h-4 text-forest-600" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-charcoal-400" />
              <span>{resource.location.building}, {resource.location.room || ''} — {resource.location.city} ({resource.location.campus})</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-forest-700" />
              <span>Next Slot: <strong>{resource.availability.nextAvailableSlot}</strong></span>
            </div>
          </div>
        </div>

        {/* Main Grid: Gallery & Details on Left, Booking Panel on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Gallery, Specs, Rules */}
          <div className="lg:col-span-8 space-y-8">
            {/* Multi-Image Gallery */}
            <div className="bg-white border border-ivory-300 rounded p-4 sm:p-5 shadow-editorial">
              {/* Main Preview Image */}
              <div className="relative h-72 sm:h-96 w-full rounded overflow-hidden bg-ivory-200 border border-ivory-300 mb-3">
                <img
                  src={images[selectedImageIndex] || resource.image}
                  alt={`${resource.title} preview ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                <div className="absolute bottom-3 left-3 bg-forest-950/85 backdrop-blur-md px-3 py-1 rounded text-ivory-50 text-xs font-mono">
                  Asset View {selectedImageIndex + 1} of {images.length}
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-16 sm:w-24 sm:h-18 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx 
                          ? 'border-forest-900 shadow-sm scale-[1.02]' 
                          : 'border-ivory-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Scientific Scope */}
            <div className="bg-white border border-ivory-300 rounded p-6 shadow-editorial space-y-4">
              <h2 className="text-lg font-bold text-forest-950 flex items-center gap-2">
                <FileText className="w-4 h-4 text-forest-700" />
                <span>Description & Operational Scope</span>
              </h2>
              <p className="text-sm text-charcoal-700 leading-relaxed">
                {resource.description}
              </p>
              {resource.longDescription && (
                <div className="p-4 bg-ivory-50 border-l-3 border-forest-700 rounded-r text-xs text-charcoal-700 leading-relaxed">
                  <p className="font-semibold text-forest-950 mb-1">Facility Custodian Notes:</p>
                  <p>{resource.longDescription}</p>
                </div>
              )}
            </div>

            {/* Technical Specifications */}
            <div className="bg-white border border-ivory-300 rounded p-6 shadow-editorial">
              <h2 className="text-lg font-bold text-forest-950 mb-4 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-forest-700" />
                <span>Technical Specifications</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {resource.specifications.map((spec, index) => (
                  <div key={index} className="p-3 bg-ivory-50 border border-ivory-300 rounded flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-bold text-charcoal-500 tracking-wider mb-1">
                      {spec.label}
                    </span>
                    <span className="font-extrabold text-charcoal-900 text-sm">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Dates & Time Slots */}
            <div className="bg-white border border-ivory-300 rounded p-6 shadow-editorial">
              <h2 className="text-lg font-bold text-forest-950 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-forest-700" />
                <span>Available Dates & Time Slots</span>
              </h2>
              <p className="text-xs text-charcoal-600 mb-4">
                Select an authorized laboratory window to inspect slot availability and book time.
              </p>

              {/* Day selection tabs */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                {schedule.map((day, idx) => (
                  <button
                    key={day.date}
                    onClick={() => {
                      setSelectedDayIndex(idx);
                      setSelectedSlot(null);
                    }}
                    className={`px-3.5 py-2 text-xs font-semibold rounded whitespace-nowrap border transition-all ${
                      selectedDayIndex === idx
                        ? 'bg-forest-900 text-ivory-50 border-forest-900 shadow-sm'
                        : 'bg-ivory-50 text-charcoal-700 border-ivory-300 hover:bg-ivory-200'
                    }`}
                  >
                    {day.dayLabel}
                  </button>
                ))}
              </div>

              {/* Slots Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {currentDay?.slots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <button
                      key={slot.id}
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded border text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                        !slot.available
                          ? 'bg-ivory-200/60 text-charcoal-400 border-ivory-300/80 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-accent-lime text-forest-950 border-forest-800 shadow-sm'
                          : 'bg-white text-charcoal-800 border-ivory-300 hover:border-forest-700'
                      }`}
                    >
                      <span>{slot.time}</span>
                      <span className="text-[10px] font-normal mt-0.5">
                        {slot.available ? (isSelected ? 'Selected' : 'Open') : 'Reserved'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedSlot && (
                <div className="mt-4 p-3 bg-forest-50 border border-forest-200 rounded text-xs text-forest-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forest-700" />
                    <span>Selected: <strong>{currentDay.dayLabel}</strong> at <strong>{selectedSlot.time}</strong></span>
                  </div>
                  <button
                    onClick={() => setSelectedSlot(null)}
                    className="text-[11px] underline text-charcoal-500 hover:text-charcoal-900"
                  >
                    Clear selection
                  </button>
                </div>
              )}
            </div>

            {/* Pricing & Usage Conditions */}
            <div className="bg-white border border-ivory-300 rounded p-6 shadow-editorial">
              <h2 className="text-lg font-bold text-forest-950 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-forest-700" />
                <span>Pricing & Usage Conditions</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
                <div className="p-4 bg-ivory-50 border border-ivory-300 rounded space-y-2">
                  <span className="font-bold text-forest-950 block">Usage & Cancellation Policies:</span>
                  <p className="text-charcoal-700">{resource.usageConditions.cancellationPolicy}</p>
                  {resource.usageConditions.depositRequired && (
                    <p className="text-charcoal-600">
                      <strong>Deposit/Escrow:</strong> {resource.usageConditions.depositRequired}
                    </p>
                  )}
                </div>

                <div className="p-4 bg-ivory-50 border border-ivory-300 rounded space-y-2">
                  <span className="font-bold text-forest-950 block">Permitted Applications:</span>
                  <ul className="space-y-1">
                    {resource.usageConditions.allowedUsage.map((usage, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-charcoal-700">
                        <Check className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                        <span>{usage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Eligibility Requirements */}
            <div className="bg-white border border-ivory-300 rounded p-6 shadow-editorial">
              <h2 className="text-lg font-bold text-forest-950 mb-4 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-forest-700" />
                <span>Eligibility & Safety Requirements</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-charcoal-500 uppercase text-[10px] tracking-wider block mb-1">
                    Authorized User Affiliations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {resource.eligibilityRequirements.affiliationRequired.map((aff, i) => (
                      <span key={i} className="px-2.5 py-1 bg-ivory-200 text-charcoal-800 rounded font-medium">
                        {aff}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-charcoal-500 uppercase text-[10px] tracking-wider block mb-1">
                    Safety Inductions & Certifications:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {resource.eligibilityRequirements.safetyCertifications.map((cert, i) => (
                      <span key={i} className="px-2.5 py-1 bg-forest-50 border border-forest-200 text-forest-900 rounded font-medium flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-forest-700" />
                        <span>{cert}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-ivory-200 text-charcoal-600">
                  <span>Minimum Competency Level: </span>
                  <strong className="text-forest-950">{resource.eligibilityRequirements.minimumUserLevel}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Booking Request Panel */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="bg-white border border-ivory-300 rounded p-6 shadow-editorial">
              <div className="pb-4 mb-5 border-b border-ivory-200">
                <span className="text-[11px] font-bold text-forest-800 uppercase tracking-wider block mb-1">
                  Access Fee Rate
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-forest-950">
                    {resource.pricing.currency}
                    {resource.pricing.hourlyRate || resource.pricing.dailyRate}
                  </span>
                  <span className="text-xs text-charcoal-600 font-medium">
                    /{resource.pricing.hourlyRate ? 'hour' : 'day'}
                  </span>
                </div>
                {resource.pricing.subsidizedForAcademia && (
                  <span className="text-[11px] text-forest-700 font-semibold block mt-1">
                    ✓ Subsidized academic & grant rates applicable
                  </span>
                )}
              </div>

              {!requestSubmitted ? (
                <form onSubmit={handleBookingRequest} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">
                      Applicant Institutional Affiliation
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantAffiliation}
                      onChange={(e) => setApplicantAffiliation(e.target.value)}
                      placeholder="e.g. Harvard / BioNano Core"
                      className="w-full px-3 py-2 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">
                      Requested Duration
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={requestHours}
                        onChange={(e) => setRequestHours(Number(e.target.value))}
                        className="flex-1 accent-forest-800"
                      />
                      <span className="font-bold text-forest-950 whitespace-nowrap">{requestHours} Hours</span>
                    </div>
                  </div>

                  {resource.operatorAssistance && (
                    <label className="flex items-start gap-2 p-2.5 bg-ivory-100 rounded border border-ivory-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={withOperator}
                        onChange={(e) => setWithOperator(e.target.checked)}
                        className="mt-0.5 rounded accent-forest-800"
                      />
                      <span className="text-charcoal-800">
                        Request dedicated certified operator assistance for session
                      </span>
                    </label>
                  )}

                  <div>
                    <label className="block text-charcoal-700 font-semibold mb-1">
                      Project Objective / Research Brief
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={projectSummary}
                      onChange={(e) => setProjectSummary(e.target.value)}
                      placeholder="Specify material composition, toolpaths, or assay targets..."
                      className="w-full p-2.5 bg-ivory-100 border border-ivory-300 rounded focus:border-forest-700 outline-none"
                    />
                  </div>

                  <div className="p-3 bg-ivory-50 border border-ivory-200 rounded space-y-1 text-[11px] text-charcoal-600">
                    <div className="flex justify-between">
                      <span>Base Usage Rate:</span>
                      <span>{resource.pricing.currency}{resource.pricing.hourlyRate ? resource.pricing.hourlyRate * requestHours : resource.pricing.dailyRate}</span>
                    </div>
                    {withOperator && (
                      <div className="flex justify-between">
                        <span>Technician Support:</span>
                        <span>{resource.pricing.currency}{40 * requestHours}</span>
                      </div>
                    )}
                    <div className="pt-1.5 border-t border-ivory-300 flex justify-between font-bold text-forest-950 text-xs">
                      <span>Estimated Ledger Hold:</span>
                      <span>
                        {resource.pricing.currency}
                        {(resource.pricing.hourlyRate ? resource.pricing.hourlyRate * requestHours : (resource.pricing.dailyRate || 100)) + (withOperator ? 40 * requestHours : 0)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-forest-900 hover:bg-forest-800 text-ivory-50 font-bold rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-accent-lime" />
                    <span>Transmit Booking Request</span>
                  </button>

                  <p className="text-[10px] text-charcoal-500 text-center leading-normal">
                    This action transmits an official Inter-Lab Request to the facility coordinator. No charges are billed until approved.
                  </p>
                </form>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h3 className="text-base font-bold text-forest-950">
                    Booking Request Transmitted
                  </h3>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    Your reservation request for <strong>{resource.title}</strong> has been forwarded to the <strong>{resource.institution.name}</strong> facility coordinator.
                  </p>
                  <div className="p-3 bg-ivory-100 rounded text-left font-mono text-[11px] space-y-1 text-charcoal-700">
                    <div>REFERENCE: <strong className="text-forest-950">{referenceCode}</strong></div>
                    <div>APPLICANT: {applicantAffiliation}</div>
                    <div>SLOT: {selectedSlot ? selectedSlot.time : 'Flexible window'}</div>
                    <div>STATUS: Pending Custodian Sign-off</div>
                  </div>
                  <div className="flex flex-col gap-2 pt-1">
                    {onNavigateToDashboard && (
                      <button
                        onClick={onNavigateToDashboard}
                        className="w-full py-2 bg-forest-900 text-ivory-50 rounded font-bold text-xs hover:bg-forest-800 transition-colors shadow-sm"
                      >
                        Track Status in My Dashboard →
                      </button>
                    )}
                    <button
                      onClick={() => setRequestSubmitted(false)}
                      className="w-full py-2 bg-ivory-200 text-charcoal-800 rounded font-semibold text-xs hover:bg-ivory-300"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Equipment Section */}
        {relatedResources.length > 0 && (
          <div className="mt-16 pt-10 border-t border-ivory-300">
            <h3 className="text-lg font-bold text-forest-950 mb-6">
              Complementary {resource.categoryLabel} in Network
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedResources.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectRelatedResource(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white border border-ivory-300 rounded p-4 hover:border-forest-700 cursor-pointer shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="h-36 rounded overflow-hidden mb-3 bg-ivory-200">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-forest-800 block mb-1">{item.code}</span>
                    <h4 className="font-bold text-xs text-forest-950 line-clamp-2 mb-2">{item.title}</h4>
                    <span className="text-[11px] text-charcoal-500 block mb-2">{item.location.city}</span>
                  </div>
                  <div className="pt-2 border-t border-ivory-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-forest-950">{item.pricing.currency}{item.pricing.hourlyRate || item.pricing.dailyRate}/{item.pricing.hourlyRate ? 'hr' : 'day'}</span>
                    <span className="text-forest-800 font-semibold text-[11px]">View Unit →</span>
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
