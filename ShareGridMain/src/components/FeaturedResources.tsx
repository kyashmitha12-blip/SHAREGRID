import React from 'react';
import { 
  ArrowUpDown, 
  RefreshCw,
  FolderOpen,
  ArrowRight
} from 'lucide-react';
import { ResourceItem, ResourceCategory, SearchFilters } from '../types/resource';
import { ResourceCard } from './ResourceCard';

interface FeaturedResourcesProps {
  resources: ResourceItem[];
  filters: SearchFilters;
  onFilterChange: (newFilters: Partial<SearchFilters>) => void;
  onSelectResource: (resource: ResourceItem) => void;
  onResetFilters: () => void;
  onOpenDirectory?: () => void;
}

const CATEGORY_TABS: { id: ResourceCategory; label: string }[] = [
  { id: 'all', label: 'All Disciplines' },
  { id: 'scientific-instruments', label: 'Scientific Instruments' },
  { id: 'fabrication-prototyping', label: 'Precision Fabrication' },
  { id: 'specialized-spaces', label: 'Cleanrooms & Spaces' },
  { id: 'heavy-computing', label: 'HPC & AI Compute' },
  { id: 'media-broadcasting', label: 'Production Soundstages' },
];

export const FeaturedResources: React.FC<FeaturedResourcesProps> = ({
  resources,
  filters,
  onFilterChange,
  onSelectResource,
  onResetFilters,
  onOpenDirectory,
}) => {
  return (
    <section id="resources" className="py-16 sm:py-20 lg:py-24 border-b border-ivory-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-ivory-300 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-forest-800 uppercase tracking-wider mb-1.5">
              <span className="w-2 h-2 rounded-full bg-forest-700"></span>
              <span>Available Institutional Assets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
              Curated Directory of Advanced Instrumentation
            </h2>
            <p className="text-sm text-charcoal-600 mt-1 max-w-xl">
              Inspect technical capabilities, review certified operator availability, and request compliant reservation slots.
            </p>
          </div>

          {/* Quick Sort Control & Full Directory Link */}
          <div className="flex flex-wrap items-center gap-3">
            {onOpenDirectory && (
              <button
                onClick={onOpenDirectory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-forest-900 hover:bg-forest-800 text-ivory-50 text-xs font-semibold rounded shadow-sm transition-colors"
              >
                <span>Open Full Directory</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent-lime" />
              </button>
            )}
            <div className="flex items-center gap-1.5 text-xs text-charcoal-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-charcoal-400" />
              <span className="font-medium">Sort by:</span>
            </div>
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as SearchFilters['sortBy'] })}
              className="text-xs bg-white border border-ivory-300 py-1.5 pl-2.5 pr-7 rounded font-medium text-charcoal-800 focus:border-forest-700 outline-none cursor-pointer"
            >
              <option value="recommended">Institutional Priority</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="availability">Immediate Availability</option>
            </select>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <div className="flex items-center gap-1.5">
            {CATEGORY_TABS.map((tab) => {
              const isActive = filters.category === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onFilterChange({ category: tab.id })}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-forest-900 text-ivory-50 shadow-sm'
                      : 'bg-white hover:bg-ivory-200 text-charcoal-700 border border-ivory-300'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Toggles (Academic Subsidy & Operator Assistance) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-ivory-50 border border-ivory-300 rounded mb-8 text-xs">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!filters.academicSubsidized}
                onChange={(e) => onFilterChange({ academicSubsidized: e.target.checked })}
                className="w-4 h-4 rounded border-ivory-300 text-forest-800 focus:ring-forest-700 accent-forest-800 cursor-pointer"
              />
              <span className="text-charcoal-800 font-medium">Academic & Grant-Eligible Rates Only</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={!!filters.operatorRequired}
                onChange={(e) => onFilterChange({ operatorRequired: e.target.checked })}
                className="w-4 h-4 rounded border-ivory-300 text-forest-800 focus:ring-forest-700 accent-forest-800 cursor-pointer"
              />
              <span className="text-charcoal-800 font-medium">Certified Operator Support Included</span>
            </label>
          </div>

          <div className="text-charcoal-500 text-xs">
            Showing <strong className="text-forest-950 font-bold">{resources.length}</strong> equipment units
          </div>
        </div>

        {/* Resources Grid or Empty State */}
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onSelect={onSelectResource}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-ivory-300 rounded p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded bg-ivory-200 text-charcoal-500 mx-auto flex items-center justify-center mb-4">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-forest-950 mb-1">
              No matching resources found
            </h3>
            <p className="text-xs text-charcoal-600 mb-6">
              No institutional equipment matches your current query or category filter. Try broadening your terms or resetting.
            </p>
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-forest-900 text-ivory-50 text-xs font-semibold rounded hover:bg-forest-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Search Criteria</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
