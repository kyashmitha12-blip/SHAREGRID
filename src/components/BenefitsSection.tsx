import React from 'react';
import { 
  Coins, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Layers, 
  Users2, 
  Building2,
  Compass
} from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const custodianBenefits = [
    {
      title: 'Model Shared Capacity',
      description: 'Explore how a shared equipment listing and schedule could expose available capacity to other campus teams.',
      icon: Coins
    },
    {
      title: 'Review Sample Utilisation',
      description: 'Inspect browser-local booking history and indicative utilisation estimates; no grant reporting is generated.',
      icon: TrendingUp
    },
    {
      title: 'Owner Review Workflow',
      description: 'Try the demo owner view to approve or reject requests and manage sample listings.',
      icon: Clock
    },
    {
      title: 'Policy Requirements on Display',
      description: 'Resource pages can display eligibility and safety notes, but do not validate agreements, insurance, or access.',
      icon: ShieldCheck
    }
  ];

  const innovatorBenefits = [
    {
      title: 'Explore Campus Equipment',
      description: 'Browse sample equipment and spaces from Indian institutions with indicative INR rates.',
      icon: Zap
    },
    {
      title: 'Submit a Demo Booking',
      description: 'Create a browser-local booking request and explore pending, approved, and cancelled statuses.',
      icon: Clock
    },
    {
      title: 'Review Listed Assistance',
      description: 'Sample listings may describe operator support; the app does not verify staff qualifications or availability.',
      icon: Users2
    },
    {
      title: 'Keep Demo Activity History',
      description: 'Try check-in, condition, incident, and audit screens; local records are editable and not suitable for compliance.',
      icon: Layers
    }
  ];

  return (
    <section id="benefits" className="py-16 sm:py-20 lg:py-24 border-b border-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-ivory-200 border border-ivory-300 rounded text-xs font-bold text-forest-900 tracking-wider uppercase mb-3">
            <span>Demo Capabilities & Scope</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-forest-950 tracking-tight">
            Explore how campus resource sharing could work.
          </h2>
          <p className="text-sm sm:text-base text-charcoal-700 mt-3 leading-relaxed">
            These screens demonstrate possible workflows only. They do not represent connected institutions, realized savings, or legal agreements.
          </p>
        </div>

        {/* Dual Column Comparative Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Custodians Column */}
          <div className="bg-white border border-ivory-300 rounded p-6 sm:p-8 flex flex-col justify-between shadow-editorial">
            <div>
              <div className="flex items-center gap-3 pb-5 mb-6 border-b border-ivory-200">
                <div className="w-10 h-10 rounded bg-forest-900 text-ivory-50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-accent-lime" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-forest-800 tracking-wider uppercase block">
                    Owner Demo View
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-forest-950">
                    For Core Labs & Facility Directors
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                {custodianBenefits.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-7 h-7 rounded bg-ivory-100 border border-ivory-300 text-forest-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-forest-950 mb-1">
                          {b.title}
                        </h4>
                        <p className="text-xs text-charcoal-600 leading-relaxed">
                          {b.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-ivory-200 bg-ivory-50 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 rounded-b">
              <div className="flex items-center justify-between text-xs">
                <span className="text-charcoal-600 font-medium">Sample price display:</span>
                <span className="font-extrabold text-forest-950 text-sm">INR (₹)</span>
              </div>
            </div>
          </div>

          {/* Innovators Column */}
          <div className="bg-white border border-ivory-300 rounded p-6 sm:p-8 flex flex-col justify-between shadow-editorial">
            <div>
              <div className="flex items-center gap-3 pb-5 mb-6 border-b border-ivory-200">
                <div className="w-10 h-10 rounded bg-forest-900 text-ivory-50 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-accent-lime" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-forest-800 tracking-wider uppercase block">
                    Borrower Demo View
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-forest-950">
                    For Research Teams & Biotech Startups
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                {innovatorBenefits.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-7 h-7 rounded bg-ivory-100 border border-ivory-300 text-forest-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-forest-950 mb-1">
                          {b.title}
                        </h4>
                        <p className="text-xs text-charcoal-600 leading-relaxed">
                          {b.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-ivory-200 bg-ivory-50 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 rounded-b">
              <div className="flex items-center justify-between text-xs">
                <span className="text-charcoal-600 font-medium">Demo price currency:</span>
                <span className="font-extrabold text-forest-950 text-sm">INR (₹)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
