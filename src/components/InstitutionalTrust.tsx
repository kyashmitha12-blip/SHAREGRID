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
      title: 'Role Previews (Demo)',
      description: 'Sample borrower, owner, and administrator profiles are available to explore the interface. No university identity provider or real authentication is connected.',
      icon: KeyRound,
      badge: 'Not Live'
    },
    {
      title: 'Booking Approval Workflow',
      description: 'Booking requests and owner decisions can be demonstrated in local browser data. Contracts, waivers, insurance, and payments are not generated.',
      icon: Lock,
      badge: 'Browser Demo'
    },
    {
      title: 'Condition and Audit History',
      description: 'Demo check-in, condition, incident, and audit entries are stored in browser localStorage. They are not signed, immutable, or shared across users.',
      icon: FileSpreadsheet,
      badge: 'Not Tamper-Proof'
    },
    {
      title: 'Access Requirements',
      description: 'Eligibility and safety requirements are displayed for review only. The demo does not validate credentials or enforce physical access controls.',
      icon: ShieldCheck,
      badge: 'Not Enforced'
    }
  ];

  return (
    <section id="trust" className="py-16 sm:py-20 lg:py-24 border-b border-ivory-300 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-ivory-100 border border-ivory-300 rounded text-xs font-bold text-forest-900 tracking-wider uppercase mb-3">
              <span>              Trust & Governance — Demo Scope</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-forest-950 tracking-tight leading-tight">
              Clear boundaries before real institutional use.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-600 max-w-md leading-relaxed">
            This prototype is not a production security boundary. Server-side authorization, institutional verification, legal workflows, and compliance certifications require real backend implementation.
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
                  <span>{feature.badge === 'Browser Demo' ? 'Saved locally only' : 'Not production verified'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
