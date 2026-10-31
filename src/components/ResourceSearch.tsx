import React from 'react';
import { Search, MapPin, Layers, X } from 'lucide-react';
import { ResourceCategory, SearchFilters } from '../types/resource';
import { CITIES_LIST } from '../data/mockResources';

interface ResourceSearchProps {
  filters: SearchFilters;
  onFilterChange: (newFilters: Partial<SearchFilters>) => void;
  totalResults: number;
}

const CATEGORY_OPTIONS: { id: ResourceCategory; label: string }[] = [
  { id: 'all', label: 'All Disciplines' },
  { id: 'scientific-instruments', label: 'Scientific Instruments' },
  { id: 'fabrication-prototyping', label: 'Precision Fabrication' },
  { id: 'specialized-spaces', label: 'Specialized Spaces & Bays' },
  { id: 'heavy-computing', label: 'High-Density Compute' },
  { id: 'media-broadcasting', label: 'Media & Production' },
];

const SUGGESTED_QUERIES = [
  'Electron Microscope',
  '5-Axis CNC',
  'ISO Cleanroom',
  '600 MHz NMR',
  'NVIDIA H100',
  'Anechoic Chamber',
];

export const ResourceSearch: React.FC<ResourceSearchProps> = ({
  filters,
  onFilterChange,
  totalResults,
}) => {
  return (
    <div className="w-full bg-ivory-50 border border-ivory-300 rounded shadow-editorial p-4 sm:p-5 lg:p-6 transition-all duration-200">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Main Search Input */}
        <div className="md:col-span-5 relative">
          <label className="block text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">
            Search Resource or Model
          </label>
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => onFilterChange({ query: e.target.value })}
              placeholder="e.g. SEM, NMR, Cleanroom, Haas..."
              className="w-full pl-9 pr-8 py-2.5 bg-ivory-100 hover:bg-white focus:bg-white text-xs sm:text-sm text-charcoal-900 placeholder-charcoal-400 border border-ivory-300 focus:border-forest-700 rounded outline-none transition-colors"
            />
            {filters.query && (
              <button
                onClick={() => onFilterChange({ query: '' })}
                className="absolute right-2.5 p-1 text-charcoal-400 hover:text-charcoal-700"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-4">
          <label className="block text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">
            Equipment Classification
          </label>
          <div className="relative flex items-center">
            <Layers className="w-4 h-4 text-charcoal-400 absolute left-3 pointer-events-none" />
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value as ResourceCategory })}
              className="w-full pl-9 pr-8 py-2.5 bg-ivory-100 hover:bg-white focus:bg-white text-xs sm:text-sm text-charcoal-900 border border-ivory-300 focus:border-forest-700 rounded outline-none transition-colors appearance-none cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 pointer-events-none text-charcoal-400 text-xs">
              ▼
            </div>
          </div>
        </div>

        {/* Location Dropdown */}
        <div className="md:col-span-3">
          <label className="block text-[11px] font-semibold text-charcoal-500 uppercase tracking-wider mb-1.5">
            Campus / Region
          </label>
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-charcoal-400 absolute left-3 pointer-events-none" />
            <select
              value={filters.city}
              onChange={(e) => onFilterChange({ city: e.target.value })}
              className="w-full pl-9 pr-8 py-2.5 bg-ivory-100 hover:bg-white focus:bg-white text-xs sm:text-sm text-charcoal-900 border border-ivory-300 focus:border-forest-700 rounded outline-none transition-colors appearance-none cursor-pointer"
            >
              {CITIES_LIST.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <div className="absolute right-3 pointer-events-none text-charcoal-400 text-xs">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Query Tags & Live Results Counter */}
      <div className="mt-4 pt-3 border-t border-ivory-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium text-charcoal-500 mr-1">Frequent:</span>
          {SUGGESTED_QUERIES.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onFilterChange({ query: tag })}
              className="px-2 py-1 text-[11px] bg-ivory-200/70 hover:bg-forest-100 hover:text-forest-900 text-charcoal-700 rounded border border-ivory-300/80 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-charcoal-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-forest-600"></span>
            <strong className="text-forest-950 font-bold">{totalResults}</strong> sample {totalResults === 1 ? 'listing' : 'listings'}
          </span>
          {(filters.query || filters.category !== 'all' || filters.city !== 'All Locations') && (
            <button
              onClick={() => onFilterChange({ query: '', category: 'all', city: 'All Locations' })}
              className="text-[11px] text-forest-700 hover:text-forest-900 underline font-semibold ml-1"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
