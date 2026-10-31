export type ResourceCategory = 
  | 'all'
  | 'equipment-tools'
  | 'laboratory-equipment'
  | 'presentation-projectors'
  | 'cameras-microphones'
  | 'arduino-iot-kits'
  | 'cnc-fabrication'
  | 'spaces-meeting-rooms'
  | 'computers-hardware'
  // Backward compatibility aliases
  | 'scientific-instruments'
  | 'fabrication-prototyping'
  | 'specialized-spaces'
  | 'media-broadcasting'
  | 'heavy-computing';

export type AvailabilityStatus = 'available' | 'in-use' | 'maintenance' | 'restricted';

export type ResourceCondition = 'new' | 'excellent' | 'good' | 'certified';

export type ApprovalRequirement = 'instant' | 'host-approval' | 'dept-signoff';

export interface HostInstitution {
  name: string;
  department: string;
  campus: string;
  verified: boolean;
  rating: number;
  totalShares: number;
}

export interface ResourceSpecification {
  label: string;
  value: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  dayLabel: string;
  slots: TimeSlot[];
}

export interface UsageConditions {
  cancellationPolicy: string;
  depositRequired?: string;
  cleaningOrResetFee?: string;
  allowedUsage: string[];
}

export interface EligibilityRequirements {
  affiliationRequired: string[];
  safetyCertifications: string[];
  minimumUserLevel: string;
}

export interface ResourceItem {
  id: string;
  ownerId?: string;
  active?: boolean;
  title: string;
  code: string; // e.g. LAB-NMR-600
  category: ResourceCategory;
  categoryLabel: string;
  description: string;
  longDescription?: string;
  image: string;
  images: string[];
  institution: HostInstitution;
  location: {
    building: string;
    campus: string;
    city: string;
    room?: string;
    coordinates?: [number, number];
  };
  pricing: {
    hourlyRate?: number;
    dailyRate?: number;
    currency: string;
    billingType: 'hourly' | 'daily' | 'project';
    subsidizedForAcademia: boolean;
  };
  specifications: ResourceSpecification[];
  availability: {
    status: AvailabilityStatus;
    nextAvailableSlot: string;
    leadTimeDays: number;
    schedule?: DayAvailability[];
  };
  condition: ResourceCondition;
  conditionLabel: string;
  approvalRequirement: ApprovalRequirement;
  approvalLabel: string;
  usageConditions: UsageConditions;
  eligibilityRequirements: EligibilityRequirements;
  operatorAssistance: boolean;
  certificationRequired: boolean;
  featured?: boolean;
}

export interface SearchFilters {
  query: string;
  category: ResourceCategory;
  city: string;
  campus?: string;
  availability?: 'all' | 'available' | 'in-use';
  minPrice?: number;
  maxPrice?: number;
  condition?: 'all' | ResourceCondition;
  approvalRequirement?: 'all' | ApprovalRequirement;
  operatorRequired?: boolean;
  academicSubsidized?: boolean;
  sortBy: 'recommended' | 'price-low' | 'price-high' | 'availability' | 'name-asc';
}
