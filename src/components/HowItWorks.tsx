import React from 'react';
import { 
  Compass, 
  ShieldCheck, 
  CalendarClock, 
  FileCheck2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Browse the Sample Catalog',
      summary: 'Search sample Indian campus equipment and spaces by category, listed specifications, location, and indicative INR pricing.',
      icon: Compass,
      highlights: ['Search and category filters', 'Sample availability labels', 'Campus and location details']
    },
    {
      number: '02',
      title: 'Request and Review a Booking',
      summary: 'Borrowers can submit browser-local requests; a demo owner can approve or reject pending requests.',
      icon: ShieldCheck,
      highlights: ['Demo role-based screens', 'Local status updates', 'No live institutional authorization']
    },
    {
      number: '03',
      title: 'Track a Demo Loan',
      summary: 'Explore check-in/out, condition, waiting-list, notification, and incident-report interfaces using local sample state.',
      icon: CalendarClock,
      highlights: ['Sample booking references', 'Local condition and incident reports', 'No connected calendar or access badge']
    },
    {
      number: '04',
      title: 'Review Resource Signals',
      summary: 'Transparent rules summarize sample booking demand and low-utilisation resources. Estimates are not trained predictions.',
      icon: FileCheck2,
      highlights: ['Demo demand and supply estimate', 'Sample utilisation calculation', 'No payments or immutable audit log']
    }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 border-b border-ivory-300 bg-ivory-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-ivory-100 border border-ivory-300 rounded text-xs font-bold text-forest-900 tracking-wider uppercase mb-3">
            <span>Demo Workflow</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-forest-950 tracking-tight leading-tight">
            How to explore SHAREGRID's local demo.
          </h2>
          <p className="text-sm sm:text-base text-charcoal-700 mt-3 leading-relaxed">
            The app demonstrates resource discovery and sharing workflows. Demo changes are stored in this browser only and do not contact an institution or Supabase.
          </p>
        </div>

        {/* 4-Step Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.number}
                className="bg-white border border-ivory-300 rounded p-6 shadow-editorial flex flex-col justify-between relative group hover:border-forest-700/50 transition-colors"
              >
                <div>
                  {/* Top Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-ivory-200">
                    <span className="font-mono text-xs font-bold text-forest-800 tracking-widest bg-forest-50 px-2.5 py-1 rounded border border-forest-200">
                      STEP {step.number}
                    </span>
                    <div className="w-8 h-8 rounded bg-ivory-100 text-forest-900 flex items-center justify-center">
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-forest-950 mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 leading-relaxed mb-5">
                    {step.summary}
                  </p>
                </div>

                {/* Highlight Checkmarks */}
                <div className="pt-4 border-t border-ivory-200 space-y-2">
                  {step.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-charcoal-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-600 mt-1 flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Demo workflow banner */}
        <div className="mt-12 p-6 sm:p-8 bg-forest-950 text-ivory-100 rounded border border-forest-900 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-accent-lime uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demo Role Preview</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-ivory-50 tracking-tight">
                Are you an institution or facility director managing idle machinery?
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-400 leading-relaxed">
                Use the role preview to inspect resource management and booking workflows. No ROI, settlement, or live institutional onboarding is available.
              </p>
            </div>

            <div className="flex-shrink-0">
              <a
                href="#resources"
                className="inline-flex items-center gap-2 px-5 py-3 bg-accent-lime text-forest-950 hover:bg-accent-lime-hover text-xs font-bold rounded transition-colors"
              >
                <span>Explore Sample Resources</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
