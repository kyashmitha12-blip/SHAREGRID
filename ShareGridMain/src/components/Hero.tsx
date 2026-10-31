import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ResourceSearch } from './ResourceSearch';
import { SearchFilters } from '../types/resource';

interface HeroProps {
  filters: SearchFilters;
  onFilterChange: (newFilters: Partial<SearchFilters>) => void;
  totalResults: number;
  onExploreClick: () => void;
  onListClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  filters,
  onFilterChange,
  totalResults,
  onExploreClick,
  onListClick,
}) => {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 lg:pb-24 border-b border-ivory-300 overflow-hidden">
      {/* Subtle architectural grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(#112219 1px, transparent 1px), linear-gradient(90deg, #112219 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-10 sm:mb-12">
          {/* Editorial category badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-ivory-200/90 border border-ivory-300 rounded text-xs font-semibold text-charcoal-700 tracking-wider uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-700"></span>
            <span>Intelligent Institutional Resource Exchange</span>
            <span className="text-charcoal-400">/</span>
            <span className="text-forest-800 font-bold">Standard 3.4</span>
          </div>

          {/* Main Editorial Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-forest-950 tracking-tight leading-[1.12] mb-6">
            Discover, book, and share <br className="hidden sm:inline" />
            <span className="relative inline-block">
              underutilized equipment
              <span className="absolute left-0 right-0 -bottom-1 h-[3px] bg-accent-lime opacity-90 -z-10"></span>
            </span>{' '}
            and spaces.
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-charcoal-700 max-w-2xl mx-auto leading-relaxed mb-8">
            Connect verified research labs, universities, and industrial prototyping facilities.
            Eliminate multi-month capex bottlenecks through governed peer access to electron microscopes,
            cleanrooms, CNC bays, and AI compute clusters.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-semibold mb-10">
            <a
              href="#resources"
              className="px-5 py-2.5 bg-forest-900 text-ivory-50 hover:bg-forest-800 rounded transition-all shadow-sm flex items-center gap-2 group"
            >
              <span>Explore Resource Catalog</span>
              <ArrowRight className="w-4 h-4 text-accent-lime group-hover:translate-x-0.5 transition-transform" />
            </a>
            <button
              onClick={onListClick}
              className="px-5 py-2.5 bg-ivory-50 text-forest-900 border border-forest-800/40 hover:bg-ivory-200 rounded transition-colors"
            >
              List an Underutilized Facility
            </button>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="max-w-4xl mx-auto mb-12">
          <ResourceSearch
            filters={filters}
            onFilterChange={onFilterChange}
            totalResults={totalResults}
          />
        </div>

        {/* Editorial Trust & Proof Grid */}
        <div className="max-w-4xl mx-auto pt-6 border-t border-ivory-300/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="space-y-1">
              <span className="block text-2xl font-extrabold text-forest-950 tracking-tight">
                $48.2M+
              </span>
              <span className="block text-xs text-charcoal-600 font-medium leading-tight">
                Activated capital equipment indexed across labs
              </span>
            </div>

            <div className="space-y-1">
              <span className="block text-2xl font-extrabold text-forest-950 tracking-tight">
                88+ Labs
              </span>
              <span className="block text-xs text-charcoal-600 font-medium leading-tight">
                Verified university & research partner nodes
              </span>
            </div>

            <div className="space-y-1">
              <span className="block text-2xl font-extrabold text-forest-950 tracking-tight">
                99.4%
              </span>
              <span className="block text-xs text-charcoal-600 font-medium leading-tight">
                Scheduled session & operator fidelity score
              </span>
            </div>

            <div className="space-y-1">
              <span className="block text-2xl font-extrabold text-forest-950 tracking-tight">
                ISO 17025
              </span>
              <span className="block text-xs text-charcoal-600 font-medium leading-tight">
                Standardized calibration and cleanroom audit log
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
