import type { BookingRequest, UserProfile } from '../types/auth';
import type { ResourceItem } from '../types/resource';

export interface ResourceRecommendation {
  resource: ResourceItem;
  score: number;
  reasons: string[];
}

export interface DemandEstimate {
  category: string;
  period: string;
  demand: number;
  supply: number;
  gap: number;
  sampleSize: number;
}

export interface IdleResourceInsight {
  resource: ResourceItem;
  utilizationPercent: number;
  lastUsed: string | null;
  sessions: number;
}

const activeStatuses = new Set(['pending', 'approved', 'checked-in']);

export function recommendResources(
  resources: ResourceItem[],
  bookings: BookingRequest[],
  user: UserProfile | null,
): ResourceRecommendation[] {
  const userBookings = user
    ? bookings.filter((booking) => booking.borrowerId === user.id)
    : [];
  const previouslyBookedResources = userBookings
    .map((booking) => resources.find((resource) => resource.id === booking.resourceId))
    .filter((resource): resource is ResourceItem => resource !== undefined);
  const preferredCategories = new Map<string, number>();
  const preferredSpecifications = new Set<string>();

  for (const booking of userBookings) {
    const category = resources.find((resource) => resource.id === booking.resourceId)?.category;
    if (category) preferredCategories.set(category, (preferredCategories.get(category) ?? 0) + 1);
  }
  for (const resource of previouslyBookedResources) {
    for (const specification of resource.specifications) {
      preferredSpecifications.add(`${specification.label.toLowerCase()}:${specification.value.toLowerCase()}`);
    }
  }

  const averageHourlyBudget = userBookings.length > 0
    ? userBookings.reduce((sum, booking) => sum + booking.totalCost / Math.max(booking.durationHours, 1), 0) / userBookings.length
    : null;
  const averageDuration = userBookings.length > 0
    ? userBookings.reduce((sum, booking) => sum + booking.durationHours, 0) / userBookings.length
    : null;
  const preferredCities = new Set(previouslyBookedResources.map((resource) => resource.location.city.toLowerCase()));

  return resources
    .filter((resource) => resource.active !== false && resource.availability.status === 'available')
    .map((resource) => {
      const reasons: string[] = [];
      let score = 0;

      score += 35;
      reasons.push('Currently listed as available');

      if (resource.institution.verified) {
        score += 20;
        reasons.push('Host marked verified in sample data; not externally checked');
      }

      const categoryInterest = preferredCategories.get(resource.category) ?? 0;
      if (categoryInterest > 0) {
        score += Math.min(categoryInterest * 15, 30);
        reasons.push('Matches a category in your booking history');
      }

      const matchingSpecifications = resource.specifications.filter((specification) =>
        preferredSpecifications.has(`${specification.label.toLowerCase()}:${specification.value.toLowerCase()}`),
      );
      if (matchingSpecifications.length > 0) {
        score += Math.min(matchingSpecifications.length * 5, 15);
        reasons.push(`Technical specifications match prior use (${matchingSpecifications.map((item) => item.label).slice(0, 2).join(', ')})`);
      }

      if (user && resource.institution.name === user.institution) {
        score += 10;
        reasons.push('Available within your institution');
      }
      if (preferredCities.has(resource.location.city.toLowerCase())) {
        score += 5;
        reasons.push(`Located in ${resource.location.city}, matching a past booking`);
      }

      const hourlyRate = resource.pricing.hourlyRate ??
        (resource.pricing.dailyRate === undefined ? undefined : resource.pricing.dailyRate / 8);
      if (averageHourlyBudget !== null && hourlyRate !== undefined && hourlyRate <= averageHourlyBudget) {
        score += 10;
        reasons.push(`Within your past average of ₹${Math.round(averageHourlyBudget).toLocaleString('en-IN')}/hour`);
      } else if (averageHourlyBudget !== null && hourlyRate !== undefined) {
        score -= 5;
        reasons.push('Above your past average hourly spend; review the estimate');
      }

      if (user && resource.eligibilityRequirements.affiliationRequired.includes(user.institution)) {
        score += 10;
        reasons.push('Your institution is explicitly listed in eligibility');
      } else {
        reasons.push('Review the host eligibility and safety requirements');
      }

      if (averageDuration !== null && resource.availability.schedule) {
        const availableSlots = resource.availability.schedule.flatMap((day) => day.slots)
          .filter((slot) => slot.available);
        const hasDurationFit = availableSlots.some((slot) => {
          const times = [...slot.time.matchAll(/(\d{1,2}):(\d{2})/g)];
          if (times.length < 2) return false;
          const start = Number(times[0][1]) * 60 + Number(times[0][2]);
          const end = Number(times[1][1]) * 60 + Number(times[1][2]);
          return end - start >= averageDuration * 60;
        });
        if (hasDurationFit) {
          score += 10;
          reasons.push('Listed schedule includes a slot fitting your average booking duration');
        } else if (availableSlots.length > 0) {
          score -= 5;
          reasons.push('Listed slots may be shorter than your average booking duration');
        }
      }

      score += Math.max(0, Math.min(5, Math.round(resource.institution.rating)));
      if (reasons.length === 0) reasons.push('Matches available network inventory');

      return { resource, score, reasons };
    })
    .sort((a, b) => b.score - a.score || a.resource.title.localeCompare(b.resource.title))
    .slice(0, 3);
}

export function estimateCategoryDemand(
  resources: ResourceItem[],
  bookings: BookingRequest[],
): DemandEstimate[] {
  const supplyByCategory = new Map<string, number>();
  const samplesByCategoryPeriod = new Map<string, number>();
  const resourceById = new Map(resources.map((resource) => [resource.id, resource]));

  for (const resource of resources) {
    if (resource.active !== false && resource.availability.status !== 'maintenance') {
      supplyByCategory.set(resource.categoryLabel, (supplyByCategory.get(resource.categoryLabel) ?? 0) + 1);
    }
  }

  for (const booking of bookings) {
    if (!activeStatuses.has(booking.status) && booking.status !== 'completed') continue;
    const resource = resourceById.get(booking.resourceId);
    if (!resource) continue;
    const period = /^\d{4}-\d{2}/.test(booking.sessionDate) ? booking.sessionDate.slice(0, 7) : 'Undated';
    const key = `${resource.categoryLabel}\u0000${period}`;
    samplesByCategoryPeriod.set(key, (samplesByCategoryPeriod.get(key) ?? 0) + 1);
  }

  const categoryPeriods = [...samplesByCategoryPeriod.entries()].map(([key, samples]) => {
    const [category, period] = key.split('\u0000');
    return { category, period, samples };
  });
  if (categoryPeriods.length === 0) {
    return [...supplyByCategory.entries()].map(([category, supply]) => ({
      category,
      period: 'No sample',
      demand: 0,
      supply,
      gap: 0,
      sampleSize: 0,
    }));
  }

  return categoryPeriods
    .map(({ category, period, samples }) => {
      const demand = Math.ceil(samples * 1.25);
      const supply = supplyByCategory.get(category) ?? 0;
      return {
        category,
        period,
        demand,
        supply,
        gap: Math.max(0, demand - supply),
        sampleSize: samples,
      };
    })
    .sort((a, b) => b.gap - a.gap || b.demand - a.demand || a.period.localeCompare(b.period) || a.category.localeCompare(b.category));
}

export function detectIdleResources(
  resources: ResourceItem[],
  bookings: BookingRequest[],
): IdleResourceInsight[] {
  const completedByResource = new Map<string, BookingRequest[]>();

  for (const booking of bookings) {
    if (booking.status !== 'completed' && booking.status !== 'checked-in') continue;
    const records = completedByResource.get(booking.resourceId) ?? [];
    records.push(booking);
    completedByResource.set(booking.resourceId, records);
  }

  return resources
    .map((resource) => {
      const sessions = completedByResource.get(resource.id) ?? [];
      const usedHours = sessions.reduce((sum, booking) => sum + booking.durationHours, 0);
      const utilizationPercent = Math.min(100, Math.round((usedHours / (30 * 8)) * 100));
      const orderedSessions = sessions.map((booking) => booking.sessionDate).sort();
      const lastUsed = orderedSessions.length > 0 ? orderedSessions[orderedSessions.length - 1] : null;

      return { resource, utilizationPercent, lastUsed, sessions: sessions.length };
    })
    .filter((insight) => insight.utilizationPercent < 20)
    .sort((a, b) => a.utilizationPercent - b.utilizationPercent)
    .slice(0, 6);
}
