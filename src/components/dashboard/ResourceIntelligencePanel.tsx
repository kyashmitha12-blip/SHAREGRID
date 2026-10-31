import React from 'react';
import { Activity, ArrowUpRight, Lightbulb, Search, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  detectIdleResources,
  estimateCategoryDemand,
  recommendResources,
} from '../../lib/resourceIntelligence';

export const ResourceIntelligencePanel: React.FC = () => {
  const {
    user,
    resources,
    bookings,
    toggleResourceActive,
    updateResourceStatus,
  } = useAuth();

  const recommendations = recommendResources(resources, bookings, user);
  const demand = estimateCategoryDemand(resources, bookings).slice(0, 4);
  const idleResources = detectIdleResources(
    user?.role === 'owner'
      ? resources.filter((resource) => resource.ownerId === user.id)
      : resources,
    bookings,
  );
  const isGovernanceRole = user?.role === 'admin' || user?.role === 'owner';
  const canApproveActivation = user?.role === 'admin' || user?.role === 'owner';

  const approveActivation = async (resourceId: string) => {
    const resource = resources.find((item) => item.id === resourceId);
    if (!resource || resource.availability.status === 'maintenance' || resource.availability.status === 'in-use') return;
    if (!window.confirm(`Approve listing activation for ${resource.title}?`)) return;

    const activated = await toggleResourceActive(resourceId, true);
    if (activated && resource.availability.status === 'restricted') {
      await updateResourceStatus(resourceId, 'available');
    }
  };

  return (
    <section className="bg-white border border-ivory-300 rounded shadow-editorial overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 px-5 py-4 border-b border-ivory-300">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-forest-800">
            <Activity className="w-3.5 h-3.5" />
            <span>Explainable Resource Intelligence</span>
          </div>
          <h2 className="mt-1 text-lg font-extrabold tracking-tight text-forest-950">
            Network signals & recommendations
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded text-[10px] font-semibold text-amber-900">
          Demo estimates · sample booking data
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-ivory-200">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-forest-700" />
            <h3 className="text-sm font-bold text-forest-950">Demand & supply snapshot</h3>
          </div>
          <p className="text-[11px] leading-relaxed text-charcoal-500 mb-3">
            Sample booking counts are grouped by requested session month, then scaled by 25%. This is a demo estimate, not a trained forecast.
          </p>
          <div className="space-y-2.5">
            {demand.map((item) => (
              <div key={item.category} className="flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="font-semibold text-charcoal-800 truncate">{item.category}</p>
                  <p className="text-[10px] text-charcoal-500">
                    {item.period === 'No sample' ? 'No historical booking sample' : `Session month: ${item.period} · ${item.sampleSize} sample booking${item.sampleSize === 1 ? '' : 's'}`}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-mono font-bold text-forest-950">{item.demand} / {item.supply}</span>
                  {item.gap > 0 && (
                    <p className="text-[10px] font-semibold text-amber-800">Estimated gap: {item.gap}</p>
                  )}
                  {item.gap === 0 && (
                    <p className="text-[10px] text-charcoal-500">No estimated shortfall</p>
                  )}
                </div>
              </div>
            ))}
            {demand.length === 0 && (
              <p className="text-xs text-charcoal-500">No resources are available to compare.</p>
            )}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-forest-700" />
            <h3 className="text-sm font-bold text-forest-950">
              {isGovernanceRole ? 'Low-utilisation review' : 'Suggested resources'}
            </h3>
          </div>

          {isGovernanceRole ? (
            <div className="space-y-2.5">
              {idleResources.map(({ resource, utilizationPercent, lastUsed, sessions }) => (
                <div key={resource.id} className="p-3 bg-ivory-50 border border-ivory-200 rounded">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-forest-950 truncate">{resource.title}</p>
                      <p className="text-[10px] text-charcoal-500 mt-0.5">
                        {utilizationPercent}% sample usage against 240h reference capacity · {sessions} recorded session{sessions === 1 ? '' : 's'}
                      </p>
                      <p className="text-[10px] text-charcoal-500">
                        {lastUsed ? `Last used ${lastUsed}` : 'No completed demo session recorded'}
                      </p>
                    </div>
                    {canApproveActivation && resource.active === false && resource.availability.status !== 'maintenance' && resource.availability.status !== 'in-use' && (
                      <button
                        type="button"
                        onClick={() => void approveActivation(resource.id)}
                        className="shrink-0 px-2 py-1 border border-forest-700 text-forest-900 hover:bg-forest-50 rounded text-[10px] font-bold"
                      >
                        Approve activation
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {idleResources.length === 0 && (
                <p className="text-xs text-charcoal-500">No low-utilisation resources found in the current sample.</p>
              )}
              {user?.role === 'admin' && (
                <p className="text-[10px] text-charcoal-500">
                  Owner-specific activation is limited to resources in this demo catalog; confirm with the owner before changing real availability.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {recommendations.map(({ resource, reasons }) => (
                <div key={resource.id} className="p-3 bg-ivory-50 border border-ivory-200 rounded">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-forest-950 truncate">{resource.title}</p>
                      <p className="mt-1 text-[10px] leading-relaxed text-charcoal-600">
                        {reasons.join(' · ')}
                      </p>
                    </div>
                    <Search className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                  </div>
                </div>
              ))}
              {recommendations.length === 0 && (
                <p className="text-xs text-charcoal-500">No active resources match the current sample.</p>
              )}
            </div>
          )}

          {isGovernanceRole && (
            <p className="mt-3 flex items-start gap-1.5 text-[10px] text-charcoal-500">
              <ArrowUpRight className="w-3 h-3 shrink-0 mt-0.5" />
              Review suggestions are based on recorded demo bookings, not external analytics.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
