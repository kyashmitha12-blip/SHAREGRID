import React from 'react';
import { 
  Grid3X3
} from 'lucide-react';
import { MOCK_RESOURCES } from '../data/mockResources';

export const Footer: React.FC = () => {
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
              A browser-local demonstration of institutional resource discovery, booking, and accountability workflows.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-forest-900/60 border border-forest-800/80 rounded p-4">
              <span className="text-[11px] font-bold text-ivory-100 uppercase tracking-wider block mb-1">
                Institutional Bulletin
              </span>
              <p className="text-[11px] text-charcoal-400">
                Email delivery is not connected in this demo. No email addresses are collected.
              </p>
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
              Demo Workflows
            </h4>
            <ul className="space-y-2.5 text-charcoal-400">
              <li>
                <a href="#how-it-works" className="hover:text-accent-lime transition-colors">
                  Booking requests and approvals
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-accent-lime transition-colors">
                  Check-in and condition reports
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-accent-lime transition-colors">
                  Incident reporting
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-accent-lime transition-colors">
                  Browser-local notifications
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-accent-lime transition-colors">
                  No contracts or insurance processing
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold text-ivory-100 uppercase tracking-wider text-[11px] mb-4">
              Role Previews
            </h4>
            <ul className="space-y-2.5 text-charcoal-400">
              <li>
                <a href="#benefits" className="hover:text-accent-lime transition-colors">
                  Borrower dashboard
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-accent-lime transition-colors">
                  Resource owner dashboard
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-accent-lime transition-colors">
                  Administrator dashboard
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-accent-lime transition-colors">
                  Explainable demand estimates
                </a>
              </li>
              <li>
                <a href="#trust" className="hover:text-accent-lime transition-colors">
                  No live authentication integration
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-bold text-ivory-100 uppercase tracking-wider text-[11px] mb-4">
              Demo Status
            </h4>
            <div className="space-y-3 text-charcoal-400">
              <div className="flex items-center gap-2 p-2 rounded bg-forest-900 border border-forest-800">
                <span className="w-2 h-2 rounded-full bg-accent-lime animate-pulse"></span>
                <span className="text-[11px] text-ivory-100 font-medium">Browser-local demo</span>
              </div>
              <div className="text-[11px] leading-relaxed">
                <div className="flex justify-between py-1 border-b border-forest-900">
                  <span>Sample resources:</span>
                  <span className="text-ivory-200 font-semibold">{MOCK_RESOURCES.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-forest-900">
                  <span>Database:</span>
                  <span className="text-ivory-200 font-semibold">Not connected</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Compliance:</span>
                  <span className="text-accent-lime font-semibold">Not certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-charcoal-400 gap-4">
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} SHAREGRID Demo.</span>
            <span className="hidden sm:inline text-forest-800">|</span>
            <span className="hidden sm:inline">Built with React, TypeScript & Tailwind CSS.</span>
          </div>

          <div className="flex items-center gap-5">
            <span>Privacy policy and legal terms are not yet implemented.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
