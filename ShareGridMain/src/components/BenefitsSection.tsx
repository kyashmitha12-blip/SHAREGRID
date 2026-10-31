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
      title: 'Offset Capital Depreciation',
      description: 'Monetize downtime on high-cost instrumentation without interfering with internal research priorities.',
      icon: Coins
    },
    {
      title: 'Satisfy Grant Utilization Thresholds',
      description: 'Demonstrate broader institutional and regional impact required by NSF, NIH, and Horizon Europe grants.',
      icon: TrendingUp
    },
    {
      title: 'Total Host Control & Preemption',
      description: 'Internal researchers always retain overriding rights. Set custom blackout windows and operator staffing limits.',
      icon: Clock
    },
    {
      title: 'Pre-Approved Institutional Indemnity',
      description: 'Every session is shielded by comprehensive damage liability, specimen containment clauses, and insured operators.',
      icon: ShieldCheck
    }
  ];

  const innovatorBenefits = [
    {
      title: 'Tier-1 Capabilities Without Capex',
      description: 'Access \$2M+ optical and physical characterization platforms on an hourly basis. Accelerate proof-of-concept milestones.',
      icon: Zap
    },
    {
      title: 'Bypass Multi-Month Procurement',
      description: 'Skip institutional vendor negotiations and RFP cycles. Reserve validated lab time in minutes, not quarters.',
      icon: Clock
    },
    {
      title: 'Skilled Operator On-Demand',
      description: 'Do not have an in-house expert in cryo-microtomy or 5-axis toolpaths? Book alongside verified facility staff.',
      icon: Users2
    },
    {
      title: 'Audit-Ready Traceability',
      description: 'Digital run records, calibrated sensor logs, and certified test output files ready for regulatory submission.',
      icon: Layers
    }
  ];

  return (
    <section id="benefits" className="py-16 sm:py-20 lg:py-24 border-b border-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-ivory-200 border border-ivory-300 rounded text-xs font-bold text-forest-900 tracking-wider uppercase mb-3">
            <span>Bilateral Value System</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-forest-950 tracking-tight">
            Designed for institutional stewardship and accelerated scientific discovery.
          </h2>
          <p className="text-sm sm:text-base text-charcoal-700 mt-3 leading-relaxed">
            A balanced ecosystem where core labs optimize their asset lifecycle while external innovators gain non-dilutive access to critical infrastructure.
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
                    Institutional Perspective
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
                <span className="text-charcoal-600 font-medium">Average laboratory yield:</span>
                <span className="font-extrabold text-forest-950 text-sm">+\$180,000 / year</span>
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
                    Researcher Perspective
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
                <span className="text-charcoal-600 font-medium">Average procurement time reduction:</span>
                <span className="font-extrabold text-forest-950 text-sm">88% (from 4 mos to 48 hrs)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
