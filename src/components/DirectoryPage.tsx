import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Filter, 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  RotateCcw,
  Sparkles,
  ChevronDown,
  Building,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { ResourceItem, ResourceCategory, SearchFilters, ResourceCondition, ApprovalRequirement } from '../types/resource';
import { CATEGORY_DEFINITIONS, CAMPUS_LIST, CONDITION_OPTIONS, APPROVAL_OPTIONS } from '../data/mockResources';

interface DirectoryPageProps {
  resources: ResourceItem[];
  onSelectResource: (resource: ResourceItem) => void;
  initialCategory?: ResourceCategory;
}

export const DirectoryPage: React.FC<DirectoryPageProps> = ({
  resources,
  onSelectResource,
  initialCategory = 'all'
}) => {
  // Filter States
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory>(initialCategory);
  const [selectedCampus, setSelectedCampus] = useState('All Campuses');
  const [selectedAvailability, setSelectedAvailability] = useState<'all' | 'available' | 'in-use'>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedApproval, setSelectedApproval] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [academicOnly, setAcademicOnly] = useState(false);
  const [operatorOnly, setOperatorOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SearchFilters['sortBy']>('recommended');
  
  // UI states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Compute category counts dynamically
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: resources.length };
    resources.forEach(res => {
      counts[res.category] = (counts[res.category] || 0) + 1;
    });
    return counts;
  }, [resources]);

  // Reset all filters
  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedCampus('All Campuses');
    setSelectedAvailability('all');
    setSelectedCondition('all');
    setSelectedApproval('all');
    setMinPrice(0);
    setMaxPrice(1000);
    setAcademicOnly(false);
    setOperatorOnly(false);
    setSortBy('recommended');
  };

  // Check if any filter is active
  const isFiltered = query.trim() !== '' || 
    selectedCategory !== 'all' || 
    selectedCampus !== 'All Campuses' || 
    selectedAvailability !== 'all' || 
    selectedCondition !== 'all' || 
    selectedApproval !== 'all' || 
    minPrice > 0 || 
    maxPrice < 1000 || 
    academicOnly || 
    operatorOnly;

  // Real-time dynamic filtering
  const filteredResources = useMemo(() => {
    return resources.filter(item => {
      // 1. Search query (matches title, category, description, specifications, and code)
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        const matchCat = item.categoryLabel.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchInst = item.institution.name.toLowerCase().includes(q);
        const matchSpecs = item.specifications.some(
          s => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
        );

        if (!matchTitle && !matchCode && !matchCat && !matchDesc && !matchInst && !matchSpecs) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Campus / Location filter
      if (selectedCampus !== 'All Campuses' && item.location.campus !== selectedCampus) {
        return false;
      }

      // 4. Availability status
      if (selectedAvailability === 'available' && item.availability.status !== 'available') {
        return false;
      }
      if (selectedAvailability === 'in-use' && item.availability.status !== 'in-use') {
        return false;
      }

      // 5. Price range filter
      const effectiveRate = item.pricing.hourlyRate || (item.pricing.dailyRate ? Math.round(item.pricing.dailyRate / 8) : 0);
      if (effectiveRate < minPrice || effectiveRate > maxPrice) {
        return false;
      }

      // 6. Condition filter
      if (selectedCondition !== 'all' && item.condition !== selectedCondition) {
        return false;
      }

      // 7. Approval requirement filter
      if (selectedApproval !== 'all' && item.approvalRequirement !== selectedApproval) {
        return false;
      }

      // 8. Academic subsidy
      if (academicOnly && !item.pricing.subsidizedForAcademia) {
        return false;
      }

      // 9. Operator assistance
      if (operatorOnly && !item.operatorAssistance) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        const pA = a.pricing.hourlyRate || (a.pricing.dailyRate ? a.pricing.dailyRate / 8 : 9999);
        const pB = b.pricing.hourlyRate || (b.pricing.dailyRate ? b.pricing.dailyRate / 8 : 9999);
        return pA - pB;
      }
      if (sortBy === 'price-high') {
        const pA = a.pricing.hourlyRate || (a.pricing.dailyRate ? a.pricing.dailyRate / 8 : 0);
        const pB = b.pricing.hourlyRate || (b.pricing.dailyRate ? b.pricing.dailyRate / 8 : 0);
        return pB - pA;
      }
      if (sortBy === 'availability') {
        if (a.availability.status === 'available' && b.availability.status !== 'available') return -1;
        if (b.availability.status === 'available' && a.availability.status !== 'available') return 1;
        return a.availability.leadTimeDays - b.availability.leadTimeDays;
      }
      if (sortBy === 'name-asc') {
        return a.title.localeCompare(b.title);
      }
      // 'recommended'
      if (a.featured && !b.featured) return -1;
      if (b.featured && !a.featured) return 1;
      return b.institution.rating - a.institution.rating;
    });
  }, [
    resources, 
    query, 
    selectedCategory, 
    selectedCampus, 
    selectedAvailability, 
    minPrice, 
    maxPrice, 
    selectedCondition, 
    selectedApproval, 
    academicOnly, 
    operatorOnly, 
    sortBy
  ]);

  return (
    <div className="min-h-screen bg-ivory-100 pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Top Title & Scope */}
        <div className="mb-8 pb-6 border-b border-ivory-300">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-forest-800 uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-forest-700"></span>
                <span>Sample Resource Directory</span>
                <span className="text-charcoal-400">/</span>
                <span className="text-charcoal-600 font-normal">Browser-local Demo Catalog</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-forest-950 tracking-tight leading-tight">
                Discover & Request Sample Equipment
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-700 mt-2 max-w-2xl leading-relaxed">
                Filter sample listings by category, location, indicated availability, operator assistance, and INR estimate. Listings do not represent connected partners.
              </p>
            </div>

            {/* Quick stats pill */}
            <div className="flex items-center gap-2 self-start md:self-auto bg-white border border-ivory-300 px-3.5 py-2 rounded shadow-sm text-xs">
              <span className="w-2 h-2 rounded-full bg-accent-lime"></span>
              <span className="text-charcoal-600 font-medium">Sample catalog:</span>
              <strong className="text-forest-950 font-bold">{resources.length} listings</strong>
            </div>
          </div>
        </div>

        {/* Dynamic Search Input Bar */}
        <div className="bg-white border border-ivory-300 rounded p-3 sm:p-4 shadow-editorial mb-8">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by equipment name, specifications, code (e.g., 'SEM', 'CNC', 'LoRa', 'Cleanroom', '4K')..."
              className="w-full pl-10 pr-10 py-3 bg-ivory-100 hover:bg-white focus:bg-white text-xs sm:text-sm text-charcoal-900 border border-ivory-300 focus:border-forest-700 rounded outline-none transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 p-1 text-charcoal-400 hover:text-charcoal-700 rounded"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 mt-3 border-t border-ivory-200 text-xs">
            <span className="text-[11px] font-semibold text-charcoal-500 mr-1 whitespace-nowrap">Category:</span>
            {CATEGORY_DEFINITIONS.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded whitespace-nowrap border transition-all ${
                    isSelected
                      ? 'bg-forest-900 text-ivory-50 border-forest-900 shadow-sm'
                      : 'bg-ivory-100 hover:bg-ivory-200 text-charcoal-700 border-ivory-300'
                  }`}
                >
                  {cat.label}
                  <span className={`ml-1.5 text-[10px] px-1 py-0.2 rounded font-normal ${
                    isSelected ? 'bg-forest-800 text-ivory-200' : 'bg-ivory-200 text-charcoal-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4 flex items-center justify-between">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-ivory-300 rounded text-xs font-semibold text-charcoal-800 shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-forest-800" />
            <span>Filter Criteria ({isFiltered ? 'Active' : 'All'})</span>
          </button>

          <span className="text-xs text-charcoal-600 font-medium">
            <strong>{filteredResources.length}</strong> matching units
          </span>
        </div>

        {/* Content Layout: Left Sidebar Filters + Right Directory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Comprehensive Filters Sidebar */}
          <aside className={`lg:col-span-3 space-y-6 ${mobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white border border-ivory-300 rounded p-5 shadow-editorial space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-ivory-200">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-950 flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-forest-700" />
                  <span>Refine Resources</span>
                </span>
                {isFiltered && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-semibold text-forest-700 hover:text-forest-900 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* 1. Category Filter */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-2">
                  Resource Category
                </label>
                <div className="space-y-1.5 text-xs">
                  {CATEGORY_DEFINITIONS.map(cat => (
                    <label 
                      key={cat.id} 
                      className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
                        selectedCategory === cat.id ? 'bg-forest-50 text-forest-900 font-bold' : 'hover:bg-ivory-100 text-charcoal-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat.id}
                          onChange={() => setSelectedCategory(cat.id)}
                          className="accent-forest-800"
                        />
                        <span className="text-xs">{cat.label}</span>
                      </div>
                      <span className="text-[10px] text-charcoal-400 font-mono">
                        {categoryCounts[cat.id] || 0}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. Campus / Location Filter */}
              <div className="pt-4 border-t border-ivory-200">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-forest-700" />
                  <span>Campus / Location</span>
                </label>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="w-full p-2 bg-ivory-100 border border-ivory-300 rounded text-xs text-charcoal-800 focus:border-forest-700 outline-none cursor-pointer"
                >
                  {CAMPUS_LIST.map((campus) => (
                    <option key={campus} value={campus}>
                      {campus}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Availability Filter */}
              <div className="pt-4 border-t border-ivory-200">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-forest-700" />
                  <span>Availability Status</span>
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'all', label: 'All Statuses' },
                    { id: 'available', label: 'Available Now' },
                    { id: 'in-use', label: 'In-Use / Booked' }
                  ].map((st) => (
                    <label key={st.id} className="flex items-center gap-2 cursor-pointer text-charcoal-700 p-1 hover:bg-ivory-100 rounded">
                      <input
                        type="radio"
                        name="availability"
                        checked={selectedAvailability === st.id}
                        onChange={() => setSelectedAvailability(st.id as 'all' | 'available' | 'in-use')}
                        className="accent-forest-800"
                      />
                      <span>{st.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. Price Range Filter */}
              <div className="pt-4 border-t border-ivory-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal-600">
                    Max Price / Hr
                  </label>
                  <span className="text-xs font-extrabold text-forest-950 font-mono">
                    ₹{maxPrice}/hr
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-forest-800 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-charcoal-400 mt-1 font-mono">
                  <span>₹10</span>
                  <span>₹500</span>
                  <span>₹1000+</span>
                </div>
              </div>

              {/* 5. Resource Condition Filter */}
              <div className="pt-4 border-t border-ivory-200">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-2">
                  Resource Condition
                </label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full p-2 bg-ivory-100 border border-ivory-300 rounded text-xs text-charcoal-800 focus:border-forest-700 outline-none cursor-pointer"
                >
                  {CONDITION_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6. Approval Requirement Filter */}
              <div className="pt-4 border-t border-ivory-200">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-charcoal-600 mb-2">
                  Approval Requirement
                </label>
                <select
                  value={selectedApproval}
                  onChange={(e) => setSelectedApproval(e.target.value)}
                  className="w-full p-2 bg-ivory-100 border border-ivory-300 rounded text-xs text-charcoal-800 focus:border-forest-700 outline-none cursor-pointer"
                >
                  {APPROVAL_OPTIONS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Options: Academic Subsidized & Operator Support */}
              <div className="pt-4 border-t border-ivory-200 space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={academicOnly}
                    onChange={(e) => setAcademicOnly(e.target.checked)}
                    className="rounded accent-forest-800"
                  />
                  <span className="text-charcoal-800">Sample Academic-Rate Flag</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={operatorOnly}
                    onChange={(e) => setOperatorOnly(e.target.checked)}
                    className="rounded accent-forest-800"
                  />
                  <span className="text-charcoal-800">Operator Assistance Included</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Right Column: Listings Header & Cards */}
          <main className="lg:col-span-9 space-y-4">
            {/* Control Bar: Results count, active badges, Sort, View mode */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-ivory-300 rounded shadow-sm text-xs">
              <div className="flex items-center gap-2">
                <span className="text-charcoal-600 font-medium">
                  Showing <strong className="text-forest-950 font-bold">{filteredResources.length}</strong> matching units
                </span>
                {isFiltered && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-forest-700 underline font-semibold ml-2"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Sort selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-charcoal-500 font-medium">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SearchFilters['sortBy'])}
                    className="bg-ivory-100 border border-ivory-300 px-2.5 py-1.5 rounded font-semibold text-charcoal-800 focus:border-forest-700 outline-none cursor-pointer"
                  >
                    <option value="recommended">Priority Recommendation</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="availability">Immediate Availability</option>
                    <option value="name-asc">Alphabetical (A-Z)</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center border border-ivory-300 rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-forest-900 text-ivory-50' : 'bg-white text-charcoal-600 hover:bg-ivory-100'}`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-forest-900 text-ivory-50' : 'bg-white text-charcoal-600 hover:bg-ivory-100'}`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Resources List / Grid */}
            {filteredResources.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' 
                : 'space-y-4'
              }>
                {filteredResources.map((resource) => {
                  const isAvailable = resource.availability.status === 'available';

                  if (viewMode === 'list') {
                    return (
                      <article
                        key={resource.id}
                        onClick={() => onSelectResource(resource)}
                        className="bg-white border border-ivory-300 rounded p-4 shadow-sm hover:shadow-editorial hover:border-forest-700/60 transition-all flex flex-col md:flex-row gap-5 items-start cursor-pointer"
                      >
                        {/* List Image */}
                        <div className="w-full md:w-52 h-44 rounded overflow-hidden bg-ivory-200 border border-ivory-300 flex-shrink-0 relative">
                          <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-forest-950/85 text-ivory-50 text-[10px] font-mono rounded">
                            {resource.code}
                          </span>
                        </div>

                        {/* List Content */}
                        <div className="flex-1 flex flex-col justify-between min-h-full w-full">
                          <div>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                              <span className="text-[11px] font-semibold text-forest-800 bg-forest-50 px-2 py-0.5 rounded border border-forest-200">
                                {resource.categoryLabel}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  isAvailable ? 'bg-forest-100 text-forest-800' : 'bg-ivory-200 text-charcoal-700'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-forest-600' : 'bg-charcoal-400'}`} />
                                  {isAvailable ? 'Available' : 'Booked'}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 bg-ivory-100 border border-ivory-300 rounded text-charcoal-600">
                                  {resource.conditionLabel}
                                </span>
                              </div>
                            </div>

                            <h3 className="text-base font-bold text-forest-950 hover:text-forest-700 leading-snug mb-1">
                              {resource.title}
                            </h3>

                            <div className="flex items-center gap-2 text-xs text-charcoal-600 mb-2">
                              <span className="font-semibold">{resource.institution.name}</span>
                              {resource.institution.verified && (
                                <span title="Sample listing; institutional verification is not connected" className="text-[9px] text-charcoal-500">
                                  Demo
                                </span>
                              )}
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-charcoal-400" />
                                {resource.location.city} ({resource.location.campus})
                              </span>
                            </div>

                            <p className="text-xs text-charcoal-600 line-clamp-2 mb-3">
                              {resource.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-ivory-200 mt-2">
                            <div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-xl font-extrabold text-forest-950">
                                  {resource.pricing.currency}
                                  {resource.pricing.hourlyRate || resource.pricing.dailyRate}
                                </span>
                                <span className="text-xs text-charcoal-500 font-medium">
                                  /{resource.pricing.hourlyRate ? 'hour' : 'day'}
                                </span>
                              </div>
                              <span className="text-[10px] text-forest-800">Next Slot: {resource.availability.nextAvailableSlot}</span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectResource(resource);
                              }}
                              className="px-4 py-2 bg-forest-900 hover:bg-forest-800 text-ivory-50 text-xs font-bold rounded flex items-center gap-1.5 transition-colors"
                            >
                              <span>View Details</span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-accent-lime" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  }

                  // Default Grid Card
                  return (
                    <article
                      key={resource.id}
                      onClick={() => onSelectResource(resource)}
                      className="group bg-white rounded border border-ivory-300 hover:border-forest-700/60 shadow-editorial hover:shadow-editorial-hover transition-all duration-200 flex flex-col cursor-pointer overflow-hidden relative"
                    >
                      {/* Image Container */}
                      <div className="relative h-48 w-full overflow-hidden bg-ivory-200 border-b border-ivory-300">
                        <img
                          src={resource.image}
                          alt={resource.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                          loading="lazy"
                        />

                        {/* Badges overlay */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                          <span className="px-2 py-0.5 bg-forest-950/85 backdrop-blur-sm text-ivory-50 text-[10px] font-mono font-semibold rounded">
                            {resource.code}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold backdrop-blur-sm ${
                            isAvailable ? 'bg-white/95 text-forest-800' : 'bg-white/95 text-charcoal-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-forest-600 animate-pulse' : 'bg-charcoal-400'}`} />
                            {isAvailable ? 'Available' : 'Booked'}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1">
                          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-charcoal-800 text-[10px] font-semibold rounded border border-ivory-300/60">
                            {resource.categoryLabel}
                          </span>
                          <span className="px-2 py-0.5 bg-forest-900/90 text-ivory-50 text-[10px] font-semibold rounded">
                            {resource.conditionLabel}
                          </span>
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Institution & Verification */}
                          <div className="flex items-center gap-1.5 text-xs text-charcoal-500 mb-1">
                            <span className="font-semibold text-charcoal-800 truncate">{resource.institution.name}</span>
                            {resource.institution.verified && (
                              <span title="Sample listing; institutional verification is not connected" className="text-[9px] text-charcoal-500">
                                Demo
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-sm font-bold text-forest-950 group-hover:text-forest-700 leading-snug tracking-tight mb-2 line-clamp-2 transition-colors">
                            {resource.title}
                          </h3>

                          {/* Location */}
                          <div className="flex items-center gap-1 text-[11px] text-charcoal-500 mb-2">
                            <MapPin className="w-3 h-3 text-charcoal-400 flex-shrink-0" />
                            <span className="truncate">{resource.location.city} ({resource.location.campus})</span>
                          </div>

                          {/* Specifications snippet */}
                          <div className="grid grid-cols-2 gap-1.5 py-2 my-2 border-y border-ivory-200 text-[10px]">
                            {resource.specifications.slice(0, 2).map((s, idx) => (
                              <div key={idx} className="truncate">
                                <span className="text-charcoal-400 block uppercase font-medium">{s.label}</span>
                                <span className="text-charcoal-800 font-bold truncate block">{s.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom: Pricing & Action Button */}
                        <div className="pt-2 mt-2 border-t border-ivory-200 flex items-end justify-between">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-extrabold text-forest-950">
                                {resource.pricing.currency}
                                {resource.pricing.hourlyRate || resource.pricing.dailyRate}
                              </span>
                              <span className="text-xs text-charcoal-500 font-medium">
                                /{resource.pricing.hourlyRate ? 'hour' : 'day'}
                              </span>
                            </div>
                            <span className="text-[10px] text-forest-700 font-medium block">
                              Demo policy: {resource.approvalLabel}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectResource(resource);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-forest-900 group-hover:bg-forest-800 text-ivory-50 text-xs font-semibold rounded transition-colors"
                          >
                            <span>View Details</span>
                            <ArrowUpRight className="w-3 h-3 text-accent-lime" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-ivory-300 rounded p-12 text-center">
                <div className="w-12 h-12 rounded bg-ivory-200 text-charcoal-500 mx-auto flex items-center justify-center mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-forest-950 mb-1">
                  No resources match the selected criteria
                </h3>
                <p className="text-xs text-charcoal-600 max-w-md mx-auto mb-5">
                  Try adjusting your search query, expanding the price range, or selecting a broader equipment discipline.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-forest-900 text-ivory-50 text-xs font-semibold rounded hover:bg-forest-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Search Filters</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
