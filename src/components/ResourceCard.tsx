import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  ArrowUpRight
} from 'lucide-react';
import { ResourceItem } from '../types/resource';

interface ResourceCardProps {
  resource: ResourceItem;
  onSelect: (resource: ResourceItem) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onSelect }) => {
  const isAvailable = resource.availability.status === 'available';

  return (
    <article 
      onClick={() => onSelect(resource)}
      className="group bg-white rounded border border-ivory-300 hover:border-forest-700/60 shadow-editorial hover:shadow-editorial-hover transition-all duration-200 flex flex-col cursor-pointer overflow-hidden relative"
    >
      {/* Image Container with Editorial Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-ivory-200 border-b border-ivory-300">
        <img
          src={resource.image}
          alt={resource.title}
          className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-1 bg-forest-950/85 backdrop-blur-sm text-ivory-50 text-[10px] font-mono tracking-wider font-semibold rounded uppercase">
            {resource.code}
          </span>

          <div className="flex items-center gap-1.5">
            {resource.featured && (
              <span className="px-2 py-0.5 bg-accent-lime text-forest-950 text-[10px] font-bold tracking-wider uppercase rounded shadow-sm">
                Priority Asset
              </span>
            )}
            <span 
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold backdrop-blur-sm ${
                isAvailable 
                  ? 'bg-white/90 text-forest-800' 
                  : 'bg-white/90 text-charcoal-700'
              }`}
            >
              <span 
                className={`w-1.5 h-1.5 rounded-full ${
                  isAvailable ? 'bg-forest-600 animate-pulse' : 'bg-charcoal-400'
                }`}
              />
              {isAvailable ? 'Available' : 'Booked'}
            </span>
          </div>
        </div>

        {/* Category label bottom left */}
        <div className="absolute bottom-2.5 left-3">
          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-charcoal-800 text-[11px] font-medium rounded border border-ivory-300/60">
            {resource.categoryLabel}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Institution Header */}
          <div className="flex items-center gap-1.5 text-xs text-charcoal-500 mb-1.5">
            <span className="font-semibold text-charcoal-800 truncate">
              {resource.institution.name}
            </span>
            {resource.institution.verified && (
              <span title="Sample listing; institutional verification is not connected" className="text-[9px] text-charcoal-500">
                Demo
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-forest-950 group-hover:text-forest-700 leading-snug tracking-tight mb-2 line-clamp-2 transition-colors">
            {resource.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-charcoal-600 leading-relaxed line-clamp-2 mb-3">
            {resource.description}
          </p>

          {/* Key Specs Matrix */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 py-2.5 my-2 border-y border-ivory-200 text-[11px]">
            {resource.specifications.slice(0, 4).map((spec, idx) => (
              <div key={idx} className="truncate">
                <span className="text-charcoal-400 block text-[10px] uppercase font-medium">{spec.label}</span>
                <span className="text-charcoal-800 font-semibold truncate block">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing, Assistance, and Next Slot */}
        <div className="pt-2 mt-auto">
          <div className="flex items-center justify-between text-xs mb-3 text-charcoal-600">
            <span className="flex items-center gap-1 text-[11px]">
              <MapPin className="w-3 h-3 text-charcoal-400" />
              {resource.location.city}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-forest-800 font-medium">
              <Clock className="w-3 h-3 text-forest-600" />
              {resource.availability.nextAvailableSlot}
            </span>
          </div>

          <div className="flex items-end justify-between pt-2 border-t border-ivory-200">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-xl font-extrabold text-forest-950">
                  {resource.pricing.currency}
                  {resource.pricing.hourlyRate || resource.pricing.dailyRate}
                </span>
                <span className="text-xs text-charcoal-500 font-medium">
                  /{resource.pricing.hourlyRate ? 'hour' : 'day'}
                </span>
              </div>
              {resource.pricing.subsidizedForAcademia && (
                <span className="text-[10px] text-forest-700 font-semibold block">
                  Sample academic-rate flag
                </span>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(resource);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-forest-900 group-hover:bg-forest-800 text-ivory-50 text-xs font-semibold rounded transition-colors"
            >
              <span>Inspect</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-accent-lime" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
