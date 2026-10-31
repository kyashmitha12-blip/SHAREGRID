import React, { useState } from 'react';
import { 
  Grid3X3
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-forest-950 text-ivory-300 border-t border-forest-900 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section with Newsletter Dispatch */}
        <div className="pb-12 border-b border-forest-900 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded bg-forest-900 text-accent-lime flex items-center justify-center font-bold">
                <Grid3X3 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-extrabold tracking-wider text-base text-ivory-50 uppercase">
                SHARE<span className="text-accent-lime font-semibold">GRID</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-300 max-w-xl leading-relaxed">
              The intelligent resource-sharing network for academic, biomedical, and advanced engineering institutions. Accelerating discovery through governed equipment activation.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-forest-900/60 border border-forest-800/80 rounded p-4">
              <span className="text-[11px] font-bold text-ivory-100 uppercase tracking-wider block mb-1">
                Institutional Bulletin & Call for Facilities
              </span>
              <p className="text-[11px] text-charcoal-400 mb-3">
                Bi-weekly dispatch on newly listed instruments, grant matching protocols, and excess capacity reports.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="coordinator@university.edu"
                  required
                  className="flex-1 px-3 py-1.5 text-xs bg-forest-950 border border-forest-800 rounded text-ivory-50 placeholder-charcoal-500 focus:border-accent-lime outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-accent-lime hover:bg-accent-lime-hover text-forest-950 text-xs font-bold rounded transition-colors whitespace-nowrap"
                >
                  {subscribed ? 'Registered ✓' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="py-12 border-b border-forest-900 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* Column 1 */}
          <div>
            <h4 className="font-bold text-ivory-100 uppercase tracking-wider text-[11px] mb-4">
              Asset Directory
            </h4>
            <ul className="space-y-2.5 text-charcoal-400">
              <li>
                <a href="#resources" className="hover:text-accent-lime transition-colors">
                  Electron & Optical Microscopy
                </a>
              </li>
              <li>
                <a href="#resources" className="hover:text-accent-lime transition-colors">
                  Multi-Axis CNC & Wire EDM
                </a>
              </li>
              <li>
                <a href="#resources" className="hover:text-accent-lime transition-colors">
                  ISO Class 4-7 Cleanrooms
                </a>
              </li>
              <li>
                <a href="#resources" className="hover:text-accent-lime transition-colors">
                  High-Field Biomolecular NMR
                </a>
              </li>
              <li>
                <a href="#resources" className="hover:text-accent-lime transition-colors">
                  DGX & HGX AI Clusters
                </a>
              </li>
              <li>
                <a href="#resources" className="hover:text-accent-lime transition-colors">
                  RF Anechoic Chambers
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold text-ivory-100 uppercase tracking-wider text-[11px] mb-4">
              Protocol & Legal
            </h4>
            <ul className="space-y-2.5 text-charcoal-400">
              <li>
                <a href="#how-it-works" className="hover:text-accent-lime transition-colors">
                  Inter-Lab Transfer Agreement (ILTA)
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-accent-lime transition-colors">
                  ISO 17025 Calibration Chains
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-accent-lime transition-colors">
                  Export Control & EAR99 Protocols
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-accent-lime transition-colors">
                  Hazardous Material & BSL-2 Rules
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-accent-lime transition-colors">
                  Operator Indemnity & Insurance
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold text-ivory-100 uppercase tracking-wider text-[11px] mb-4">
              For Core Facilities
            </h4>
            <ul className="space-y-2.5 text-charcoal-400">
              <li>
                <a href="#benefits" className="hover:text-accent-lime transition-colors">
                  Facility Onboarding Guide
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-accent-lime transition-colors">
                  Depreciation Yield Calculator
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-accent-lime transition-colors">
                  Calendar Sync Integration
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-accent-lime transition-colors">
                  NSF/NIH Grant Compliance
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-accent-lime transition-colors">
                  eduGAIN & SAML SSO Integration
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-bold text-ivory-100 uppercase tracking-wider text-[11px] mb-4">
              Grid Status & Nodes
            </h4>
            <div className="space-y-3 text-charcoal-400">
              <div className="flex items-center gap-2 p-2 rounded bg-forest-900 border border-forest-800">
                <span className="w-2 h-2 rounded-full bg-accent-lime animate-pulse"></span>
                <span className="text-[11px] text-ivory-100 font-medium">Grid Protocol: Operational</span>
              </div>
              <div className="text-[11px] leading-relaxed">
                <div className="flex justify-between py-1 border-b border-forest-900">
                  <span>Indexed Nodes:</span>
                  <span className="text-ivory-200 font-semibold">88 verified</span>
                </div>
                <div className="flex justify-between py-1 border-b border-forest-900">
                  <span>Avg Sync Latency:</span>
                  <span className="text-ivory-200 font-semibold">18 ms</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Network Security:</span>
                  <span className="text-accent-lime font-semibold">SOC2 Type II</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-charcoal-400 gap-4">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} SHAREGRID Inc. All rights reserved.</span>
            <span className="hidden sm:inline text-forest-800">|</span>
            <span className="hidden sm:inline">Built with React, TypeScript & Tailwind CSS.</span>
          </div>

          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-ivory-100 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ivory-100 transition-colors">Terms of Exchange</a>
            <a href="#" className="hover:text-ivory-100 transition-colors">Security Disclosure</a>
            <a href="#" className="hover:text-ivory-100 transition-colors">System Health</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
