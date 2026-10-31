export type UserRole = 'borrower' | 'owner' | 'admin';

export type VerificationStatus = 'approved' | 'pending' | 'rejected' | 'unverified';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  institution: string;
  department: string;
  title?: string;
  verificationStatus: VerificationStatus;
  verificationDocuments?: string[];
  createdAt: string;
  phone?: string;
}

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'checked-in' | 'completed';

export interface CheckInOutRecord {
  id: string;
  bookingId: string;
  checkInTime: string;
  checkInVerifiedBy: string;
  checkOutTime?: string;
  checkOutVerifiedBy?: string;
  gatePassCode: string;
  method: 'qr-scan' | 'manual-token';
}

export interface ConditionReport {
  id: string;
  bookingId: string;
  resourceId: string;
  reportType: 'before-use' | 'after-use';
  submittedBy: string;
  submittedByName: string;
  rating: number; // 1 to 5
  cleanlinessRating: number; // 1 to 5
  physicalDefectsNoted: string;
  accessoriesPresent: boolean;
  operationalCheckPassed: boolean;
  notes: string;
  timestamp: string;
}

export interface IncidentReport {
  id: string;
  bookingId: string;
  resourceId: string;
  resourceTitle: string;
  reportedByEmail: string;
  reportedByName: string;
  reportedByRole: UserRole;
  incidentType: 'equipment-damage' | 'missing-component' | 'calibration-loss' | 'safety-violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'under-review' | 'investigating' | 'resolved';
  adminResolutionNotes?: string;
  timestamp: string;
}

export interface WaitingListEntry {
  id: string;
  resourceId: string;
  resourceTitle: string;
  resourceCode: string;
  resourceImage: string;
  institutionName: string;
  borrowerId: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerInstitution: string;
  requestedDate: string;
  requestedSlot: string;
  position: number;
  priorityScore: number;
  allocationReason: string;
  joinedAt: string;
  status: 'waiting' | 'offered' | 'expired' | 'fulfilled';
}

export interface AppNotification {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  message: string;
  type: 'booking' | 'waiting_list' | 'checkin' | 'incident' | 'verification';
  read: boolean;
  link?: string;
  timestamp: string;
}

export interface BookingRequest {
  id: string;
  resourceId: string;
  resourceTitle: string;
  resourceCode: string;
  resourceImage: string;
  borrowerId: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerInstitution: string;
  ownerId: string;
  institutionName: string;
  sessionDate: string;
  sessionTime: string;
  durationHours: number;
  withOperator: boolean;
  projectBrief: string;
  totalCost: number;
  currency: string;
  status: BookingStatus;
  createdAt: string;
  rejectionReason?: string;
  approvalNotes?: string;
  checkInRecord?: CheckInOutRecord;
  conditionReports?: ConditionReport[];
}

export interface PlatformAuditLog {
  id: string;
  timestamp: string;
  action: string;
  actorEmail: string;
  actorRole: UserRole;
  targetId?: string;
  details: string;
  category: 'auth' | 'booking' | 'resource' | 'verification' | 'incident' | 'allocation';
}
