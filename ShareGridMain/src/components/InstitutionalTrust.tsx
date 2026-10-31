import React from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Lock, 
  FileSpreadsheet, 
  CheckCircle2
} from 'lucide-react';

export const InstitutionalTrust: React.FC = () => {
  const trustFeatures = [
    {
      title: 'Federated InCommon & eduGAIN SSO',
      description: 'Zero custom credential management. Researchers log in using their primary university or institute enterprise credentials.',
      icon: KeyRound,
      badge: 'Identity Standard'
    },
    {
      title: 'Automated ILTA & Liability Bonds',
      description: 'Standardized inter-institutional contracts, hazardous material waivers, and property insurance endorsements generated instantly.',
      icon: Lock,
      badge: 'Legal Architecture'
    },
    {
      title: 'Calibrated Traceability & ISO 17025',
      description: 'Every run log records operator credentials, ambient humidity/temperature readings, and equipment calibration serial numbers.',
      icon: FileSpreadsheet,
      badge: 'Audit Ready'
    },
    {
      title: 'Physical Access & Safety Certification',
      description: 'Access badges or digital keys are conditionally generated only after safety checklist completions and host lab orientation sign-offs.',
      icon: ShieldCheck,
      badge: 'Access Control'
    }
  ];

  return (
    <section id="trust" className="py-16 sm:py-20 lg:py-24 border-b border-ivory-300 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-ivory-100 border border-ivory-300 rounded text-xs font-bold text-forest-900 tracking-wider uppercase mb-3">
              <span>Security & Governance</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-forest-950 tracking-tight leading-tight">
              Enterprise security suited for sensitive academic & industrial research.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 max-w-md leading-relaxed">
            SHAREGRID does not simply book time; it enforces multi-party indemnification, IP firewall isolation, and certified chain of custody.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="p-5 sm:p-6 bg-ivory-50 border border-ivory-300 rounded shadow-sm hover:border-forest-700/60 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-8 h-8 rounded bg-forest-900 text-ivory-50 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-accent-lime" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-charcoal-500 tracking-wider">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-forest-950 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-ivory-200 flex items-center gap-1.5 text-[11px] font-semibold text-forest-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Verified Compliant</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
