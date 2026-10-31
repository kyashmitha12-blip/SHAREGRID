import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
  BookingRequest, 
  BookingStatus, 
  PlatformAuditLog, 
  CheckInOutRecord, 
  ConditionReport, 
  IncidentReport, 
  WaitingListEntry, 
  AppNotification 
} from '../types/auth';
import { ResourceItem } from '../types/resource';
import { MOCK_RESOURCES } from '../data/mockResources';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isSupabaseMode: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsRole: (role: UserRole) => void;
  register: (data: {
    email: string;
    fullName: string;
    role: 'borrower' | 'owner';
    institution: string;
    department: string;
    title?: string;
    facilityDetails?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  
  // Bookings
  bookings: BookingRequest[];
  createBooking: (booking: Omit<BookingRequest, 'id' | 'createdAt' | 'status' | 'currency'>) => Promise<{ success: boolean; id?: string; error?: string; isConflicting?: boolean }>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  approveBooking: (bookingId: string, notes?: string) => Promise<boolean>;
  rejectBooking: (bookingId: string, reason: string) => Promise<boolean>;

  // Check-In & Check-Out Lifecycle
  performCheckIn: (bookingId: string, method?: 'qr-scan' | 'manual-token') => Promise<{ success: boolean; record?: CheckInOutRecord; error?: string }>;
  performCheckOut: (bookingId: string) => Promise<{ success: boolean; error?: string }>;

  // Condition Reports
  conditionReports: ConditionReport[];
  submitConditionReport: (report: Omit<ConditionReport, 'id' | 'timestamp'>) => Promise<boolean>;

  // Incident Reports
  incidents: IncidentReport[];
  reportIncident: (incident: Omit<IncidentReport, 'id' | 'timestamp' | 'status'>) => Promise<string>;
  resolveIncident: (incidentId: string, adminResolutionNotes: string) => Promise<boolean>;

  // Fair Allocation & Waiting Lists
  waitingLists: WaitingListEntry[];
  joinWaitingList: (entry: Omit<WaitingListEntry, 'id' | 'joinedAt' | 'position' | 'status' | 'priorityScore'>) => Promise<{ success: boolean; position: number; entryId: string }>;
  leaveWaitingList: (entryId: string) => Promise<boolean>;

  // Notifications
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Owner Resources
  resources: ResourceItem[];
  addResource: (newResource: Omit<ResourceItem, 'id' | 'code'>) => Promise<ResourceItem>;
  editResource: (resourceId: string, updatedData: Partial<ResourceItem>) => Promise<boolean>;
  toggleResourceActive: (resourceId: string, active: boolean) => Promise<boolean>;
  deleteResource: (resourceId: string) => Promise<{ success: boolean; error?: string }>;
  updateResourceStatus: (resourceId: string, status: ResourceItem['availability']['status']) => Promise<boolean>;

  // Admin Oversight
  allUsers: UserProfile[];
  pendingVerifications: UserProfile[];
  approveOwner: (userId: string) => Promise<boolean>;
  rejectOwner: (userId: string) => Promise<boolean>;
  auditLogs: PlatformAuditLog[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial Indian institutional users
const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr-borrower-01',
    email: 'priya.sharma@iitb.ac.in',
    fullName: 'Dr. Priya Sharma',
    role: 'borrower',
    institution: 'IIT Bombay',
    department: 'Department of Metallurgical Engineering & Materials Science',
    title: 'Senior Research Scholar',
    verificationStatus: 'approved',
    phone: '+91 98201 44521',
    createdAt: '2026-08-15'
  },
  {
    id: 'usr-owner-01',
    email: 'aravind.nair@iisc.ac.in',
    fullName: 'Prof. K. Aravind Nair',
    role: 'owner',
    institution: 'IISc Bangalore',
    department: 'Centre for Nano Science and Engineering (CeNSE)',
    title: 'Facility Director & Principal Investigator',
    verificationStatus: 'approved',
    verificationDocuments: ['IISc-CeNSE-MoA-2026.pdf', 'NABL-ISO-17025-Cert.pdf'],
    phone: '+91 94480 32189',
    createdAt: '2026-06-10'
  },
  {
    id: 'usr-owner-pending-02',
    email: 'lab.curator@iitm.ac.in',
    fullName: 'Dr. Meera Sundaram',
    role: 'owner',
    institution: 'IIT Madras',
    department: 'Centre for Innovation (CFI)',
    title: 'Central Machining & Prototyping Lead',
    verificationStatus: 'pending',
    verificationDocuments: ['IITM-CFI-Facility-Charter.pdf'],
    phone: '+91 98410 77123',
    createdAt: '2026-10-25'
  },
  {
    id: 'usr-admin-01',
    email: 'admin@sharegrid.in',
    fullName: 'R. Venkatesh',
    role: 'admin',
    institution: 'National Scientific Resource Exchange Council (SHAREGRID India)',
    department: 'Institutional Governance, Audit & Trust',
    title: 'Chief Compliance Officer',
    verificationStatus: 'approved',
    phone: '+91 98100 12345',
    createdAt: '2026-01-01'
  }
];

const INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: 'BK-9201',
    resourceId: 'res-fe-sem-7900',
    resourceTitle: 'JEOL JSM-7900F Field Emission Scanning Electron Microscope',
    resourceCode: 'LAB-SEM-08',
    resourceImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    borrowerId: 'usr-borrower-01',
    borrowerName: 'Dr. Priya Sharma',
    borrowerEmail: 'priya.sharma@iitb.ac.in',
    borrowerInstitution: 'IIT Bombay',
    ownerId: 'usr-owner-01',
    institutionName: 'IISc Bangalore',
    sessionDate: '2026-11-04',
    sessionTime: '09:00 - 11:00',
    durationHours: 2,
    withOperator: true,
    projectBrief: 'High-resolution field emission imaging of 2D molybdenum disulfide flakes synthesized on sapphire substrate.',
    totalCost: 3600,
    currency: '₹',
    status: 'approved',
    approvalNotes: 'Authorized by CeNSE coordinator. Please carry your Institute ID card and clean sample mounts.',
    createdAt: '2026-10-30T10:15:00Z',
    checkInRecord: {
      id: 'chk-01',
      bookingId: 'BK-9201',
      checkInTime: '2026-11-04T08:50:00Z',
      checkInVerifiedBy: 'CeNSE Duty Officer S. Murthy',
      gatePassCode: 'PASS-IISC-9201',
      method: 'qr-scan'
    }
  },
  {
    id: 'BK-8842',
    resourceId: 'res-haas-5axis',
    resourceTitle: 'Haas UMC-750 5-Axis Universal Machining Center',
    resourceCode: 'FAB-CNC-04',
    resourceImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    borrowerId: 'usr-borrower-01',
    borrowerName: 'Dr. Priya Sharma',
    borrowerEmail: 'priya.sharma@iitb.ac.in',
    borrowerInstitution: 'IIT Bombay',
    ownerId: 'usr-owner-01',
    institutionName: 'IIT Madras',
    sessionDate: '2026-11-05',
    sessionTime: '11:30 - 13:30',
    durationHours: 2,
    withOperator: false,
    projectBrief: '5-Axis milling of titanium Grade 5 bone scaffold prototype with Mastercam verified toolpath.',
    totalCost: 1700,
    currency: '₹',
    status: 'pending',
    createdAt: '2026-10-31T08:20:00Z'
  },
  {
    id: 'BK-7612',
    resourceId: 'res-iso5-cleanroom',
    resourceTitle: 'ISO Class 5 Photolithography Bay',
    resourceCode: 'SP-CLN-02',
    resourceImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    borrowerId: 'usr-borrower-01',
    borrowerName: 'Dr. Priya Sharma',
    borrowerEmail: 'priya.sharma@iitb.ac.in',
    borrowerInstitution: 'IIT Bombay',
    ownerId: 'usr-owner-01',
    institutionName: 'IISc Bangalore',
    sessionDate: '2026-10-22',
    sessionTime: '10:00 - 14:00',
    durationHours: 4,
    withOperator: false,
    projectBrief: 'Suss MA6 contact aligner exposure on 4-inch silicon wafer with AZ 5214E resist.',
    totalCost: 6400,
    currency: '₹',
    status: 'completed',
    createdAt: '2026-10-20T09:00:00Z',
    checkInRecord: {
      id: 'chk-02',
      bookingId: 'BK-7612',
      checkInTime: '2026-10-22T09:45:00Z',
      checkInVerifiedBy: 'NNfC Bay Manager',
      checkOutTime: '2026-10-22T14:10:00Z',
      checkOutVerifiedBy: 'NNfC Bay Manager',
      gatePassCode: 'PASS-IISC-7612',
      method: 'qr-scan'
    }
  }
];

const INITIAL_WAITING_LIST: WaitingListEntry[] = [
  {
    id: 'wait-01',
    resourceId: 'res-nmr-600',
    resourceTitle: 'Bruker Avance III HD 600 MHz Biomolecular NMR Spectrometer',
    resourceCode: 'LAB-NMR-01',
    resourceImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    institutionName: 'NCBS / TIFR Bangalore',
    borrowerId: 'usr-borrower-01',
    borrowerName: 'Dr. Priya Sharma',
    borrowerEmail: 'priya.sharma@iitb.ac.in',
    borrowerInstitution: 'IIT Bombay',
    requestedDate: '2026-11-06',
    requestedSlot: '09:00 - 11:00',
    position: 1,
    priorityScore: 92,
    allocationReason: 'Priority #1: PhD Thesis Submission Window (Dept. Endorsed)',
    joinedAt: '2026-10-30T14:00:00Z',
    status: 'waiting'
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    userId: 'usr-borrower-01',
    userEmail: 'priya.sharma@iitb.ac.in',
    title: 'Booking Approved for JEOL FE-SEM',
    message: 'Prof. K. Aravind Nair (IISc CeNSE) approved your session for 04 Nov 2026 at 09:00 IST. Gate pass #PASS-IISC-9201 has been generated.',
    type: 'booking',
    read: false,
    timestamp: '2026-10-31T09:00:00Z'
  },
  {
    id: 'notif-02',
    userId: 'usr-borrower-01',
    userEmail: 'priya.sharma@iitb.ac.in',
    title: 'Waiting List Status Update',
    message: 'You are currently Position #1 on the waiting list for 600 MHz NMR at NCBS Bangalore for 06 Nov 2026.',
    type: 'waiting_list',
    read: true,
    timestamp: '2026-10-30T15:30:00Z'
  },
  {
    id: 'notif-03',
    userId: 'usr-owner-01',
    userEmail: 'aravind.nair@iisc.ac.in',
    title: 'New Booking Request Received',
    message: 'Dr. Priya Sharma (IIT Bombay) requested a 2-hour slot on Haas UMC-750 for 05 Nov 2026.',
    type: 'booking',
    read: false,
    timestamp: '2026-10-31T08:22:00Z'
  }
];

const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'INC-101',
    bookingId: 'BK-7612',
    resourceId: 'res-iso5-cleanroom',
    resourceTitle: 'ISO Class 5 Photolithography Bay',
    reportedByEmail: 'aravind.nair@iisc.ac.in',
    reportedByName: 'Prof. K. Aravind Nair',
    reportedByRole: 'owner',
    incidentType: 'calibration-loss',
    severity: 'low',
    description: 'Post-run inspection noted vacuum wand tip seal slightly loose. Re-aligned and certified without equipment downtime.',
    status: 'resolved',
    adminResolutionNotes: 'Investigated by CeNSE maintenance engineering. Standard maintenance log filed.',
    timestamp: '2026-10-23T11:00:00Z'
  }
];

const INITIAL_AUDIT_LOGS: PlatformAuditLog[] = [
  {
    id: 'aud-001',
    timestamp: '2026-10-31T09:00:00Z',
    action: 'BOOKING_APPROVED',
    actorEmail: 'aravind.nair@iisc.ac.in',
    actorRole: 'owner',
    targetId: 'BK-9201',
    details: 'Approved JEOL JSM-7900F FE-SEM reservation for Dr. Priya Sharma (IIT Bombay).',
    category: 'booking'
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-30T14:00:00Z',
    action: 'WAITING_LIST_JOINED',
    actorEmail: 'priya.sharma@iitb.ac.in',
    actorRole: 'borrower',
    targetId: 'wait-01',
    details: 'Enrolled in waiting list for Bruker 600 MHz NMR (Position #1).',
    category: 'allocation'
  },
  {
    id: 'aud-003',
    timestamp: '2026-10-30T10:15:00Z',
    action: 'BOOKING_REQUEST_DISPATCHED',
    actorEmail: 'priya.sharma@iitb.ac.in',
    actorRole: 'borrower',
    targetId: 'BK-9201',
    details: 'Dispatched inter-institutional booking request to IISc CeNSE.',
    category: 'booking'
  },
  {
    id: 'aud-004',
    timestamp: '2026-10-28T09:10:00Z',
    action: 'SYSTEM_AUDIT_CHECK',
    actorEmail: 'admin@sharegrid.in',
    actorRole: 'admin',
    details: 'NABL calibration certificate verification completed across 8 Indian institutional nodes.',
    category: 'resource'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isSupabase = isSupabaseConfigured();
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sharegrid_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_USERS[0]; // Start logged in as Dr. Priya Sharma (Borrower)
  });

  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [bookings, setBookings] = useState<BookingRequest[]>(INITIAL_BOOKINGS);
  const [resources, setResources] = useState<ResourceItem[]>(MOCK_RESOURCES);
  const [waitingLists, setWaitingLists] = useState<WaitingListEntry[]>(INITIAL_WAITING_LIST);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [conditionReports, setConditionReports] = useState<ConditionReport[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>(INITIAL_INCIDENTS);
  const [auditLogs, setAuditLogs] = useState<PlatformAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('sharegrid_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sharegrid_user');
    }
  }, [user]);

  const addAudit = (
    action: string, 
    actorEmail: string, 
    actorRole: UserRole, 
    details: string, 
    category: PlatformAuditLog['category'],
    targetId?: string
  ) => {
    const entry: PlatformAuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action,
      actorEmail,
      actorRole,
      details,
      category,
      targetId
    };
    setAuditLogs(prev => [entry, ...prev]);
  };

  const addNotification = (
    userEmail: string,
    title: string,
    message: string,
    type: AppNotification['type']
  ) => {
    const notif: AppNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: `usr-${userEmail}`,
      userEmail,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Login handler
  const login = async (email: string, _password?: string) => {
    setIsLoading(true);
    try {
      if (isSupabase && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: _password || 'password123'
        });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            setUser(profile as UserProfile);
            setIsLoading(false);
            return { success: true };
          }
        }
      }

      // Local integration mode fallback
      const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
        addAudit('USER_LOGIN', found.email, found.role, 'User signed into institutional console', 'auth');
        setIsLoading(false);
        return { success: true };
      }

      // If user not in initial mock list, create new profile
      const genericUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        fullName: email.split('@')[0].toUpperCase(),
        role: 'borrower',
        institution: 'Academic Institute (India)',
        department: 'Science & Engineering Core',
        verificationStatus: 'approved',
        createdAt: new Date().toISOString()
      };
      setUser(genericUser);
      setAllUsers(prev => [genericUser, ...prev]);
      addAudit('USER_LOGIN_NEW', email, 'borrower', 'New session initiated', 'auth');
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      return { success: false, error: (err as Error).message || 'Authentication failed' };
    }
  };

  // Quick switch role for testing all 3 roles effortlessly
  const loginAsRole = (role: UserRole) => {
    const roleUser = allUsers.find(u => u.role === role);
    if (roleUser) {
      setUser(roleUser);
      addAudit('ROLE_SWITCH', roleUser.email, role, `Switched session to ${role} role`, 'auth');
    }
  };

  // Register a new user (Borrower or Owner only)
  const register = async (data: {
    email: string;
    fullName: string;
    role: 'borrower' | 'owner';
    institution: string;
    department: string;
    title?: string;
    facilityDetails?: string;
  }) => {
    setIsLoading(true);
    try {
      const newProfile: UserProfile = {
        id: `usr-${Date.now()}`,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        institution: data.institution,
        department: data.department,
        title: data.title,
        verificationStatus: data.role === 'owner' ? 'pending' : 'approved',
        verificationDocuments: data.facilityDetails ? ['Facility-Accreditation.pdf'] : undefined,
        createdAt: new Date().toISOString()
      };

      setAllUsers(prev => [newProfile, ...prev]);
      setUser(newProfile);
      addAudit(
        data.role === 'owner' ? 'OWNER_REGISTRATION_PENDING' : 'BORROWER_REGISTRATION',
        data.email,
        data.role,
        `New ${data.role} account created for ${data.institution}`,
        'auth'
      );

      addNotification(
        data.email,
        `Welcome to SHAREGRID India`,
        `Account created successfully as ${data.role === 'owner' ? 'Facility Owner (Pending Verification)' : 'Verified Academic Borrower'}.`,
        'verification'
      );

      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      return { success: false, error: (err as Error).message || 'Registration failed' };
    }
  };

  const logout = () => {
    if (user) {
      addAudit('USER_LOGOUT', user.email, user.role, 'User signed out', 'auth');
    }
    setUser(null);
    if (isSupabase && supabase) {
      supabase.auth.signOut();
    }
  };

  // 1. Create booking with conflict & duplicate prevention
  const createBooking = async (
    bookingData: Omit<BookingRequest, 'id' | 'createdAt' | 'status' | 'currency'>
  ): Promise<{ success: boolean; id?: string; error?: string; isConflicting?: boolean }> => {
    // Check for duplicate reservation by the SAME borrower
    const duplicate = bookings.find(
      b => b.borrowerEmail === bookingData.borrowerEmail &&
           b.resourceId === bookingData.resourceId &&
           b.sessionDate === bookingData.sessionDate &&
           b.sessionTime === bookingData.sessionTime &&
           (b.status === 'pending' || b.status === 'approved' || b.status === 'checked-in')
    );

    if (duplicate) {
      return {
        success: false,
        error: 'You already have an active or pending reservation for this instrument during this time slot.'
      };
    }

    // Check for slot conflict with ANY OTHER user
    const conflicting = bookings.find(
      b => b.resourceId === bookingData.resourceId &&
           b.sessionDate === bookingData.sessionDate &&
           b.sessionTime === bookingData.sessionTime &&
           (b.status === 'approved' || b.status === 'checked-in')
    );

    if (conflicting) {
      return {
        success: false,
        isConflicting: true,
        error: `This slot is already reserved by another researcher (${conflicting.borrowerInstitution}). You can join the waiting list for priority fair allocation.`
      };
    }

    const newId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookingRequest = {
      ...bookingData,
      id: newId,
      currency: '₹',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);

    addAudit(
      'BOOKING_REQUEST_DISPATCHED',
      bookingData.borrowerEmail,
      'borrower',
      `Requested ${bookingData.durationHours}h slot on ${bookingData.resourceTitle} (Total ₹${bookingData.totalCost})`,
      'booking',
      newId
    );

    // Notify the borrower
    addNotification(
      bookingData.borrowerEmail,
      'Booking Request Transmitted',
      `Your request for ${bookingData.resourceTitle} on ${bookingData.sessionDate} (${bookingData.sessionTime}) has been sent to ${bookingData.institutionName}.`,
      'booking'
    );

    // Notify the facility owner
    const targetOwner = allUsers.find(u => u.institution === bookingData.institutionName) || INITIAL_USERS[1];
    addNotification(
      targetOwner.email,
      'New Incoming Booking Request',
      `${bookingData.borrowerName} (${bookingData.borrowerInstitution}) has requested ${bookingData.resourceTitle} for ${bookingData.sessionDate}.`,
      'booking'
    );

    return { success: true, id: newId };
  };

  // 2. Cancel booking (with waiting list auto-promotion!)
  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return false;

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));

    if (user) {
      addAudit('BOOKING_CANCELLED', user.email, user.role, `Cancelled booking #${bookingId}`, 'booking', bookingId);
    }

    addNotification(
      target.borrowerEmail,
      'Booking Cancelled',
      `Your reservation #${bookingId} for ${target.resourceTitle} was cancelled.`,
      'booking'
    );

    // Fair Allocation Promotion: If someone was waiting for this slot, promote the top candidate!
    const candidate = waitingLists.find(
      w => w.resourceId === target.resourceId && 
           w.requestedDate === target.sessionDate && 
           w.status === 'waiting'
    );

    if (candidate) {
      setWaitingLists(prev => prev.map(w => w.id === candidate.id ? { ...w, status: 'offered' } : w));
      addNotification(
        candidate.borrowerEmail,
        'Waiting List Slot Available!',
        `A slot has opened up for ${candidate.resourceTitle} on ${candidate.requestedDate}! You have been allocated priority queue confirmation.`,
        'waiting_list'
      );
      addAudit(
        'WAITING_LIST_PROMOTED',
        candidate.borrowerEmail,
        'borrower',
        `Promoted from waiting list for ${candidate.resourceTitle} following cancellation of #${bookingId}`,
        'allocation',
        candidate.id
      );
    }

    return true;
  };

  // 3. Approve booking request
  const approveBooking = async (bookingId: string, notes?: string): Promise<boolean> => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return false;

    const gatePass = `PASS-${target.institutionName.replace(/\s+/g, '').substring(0, 4).toUpperCase()}-${target.id.replace('BK-', '')}`;

    setBookings(prev => prev.map(b => b.id === bookingId ? { 
      ...b, 
      status: 'approved', 
      approvalNotes: notes,
      checkInRecord: {
        id: `chk-${Date.now()}`,
        bookingId: b.id,
        checkInTime: '',
        checkInVerifiedBy: user?.fullName || 'Facility Coordinator',
        gatePassCode: gatePass,
        method: 'qr-scan'
      }
    } : b));

    if (user) {
      addAudit('BOOKING_APPROVED', user.email, user.role, `Approved booking #${bookingId} with Gate Pass ${gatePass}`, 'booking', bookingId);
    }

    addNotification(
      target.borrowerEmail,
      'Booking Request Approved!',
      `Your reservation for ${target.resourceTitle} has been approved by ${user?.fullName || 'the facility coordinator'}. Gate Pass #${gatePass} issued.`,
      'booking'
    );

    return true;
  };

  // 4. Reject booking request
  const rejectBooking = async (bookingId: string, reason: string): Promise<boolean> => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return false;

    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'rejected', rejectionReason: reason } : b));

    if (user) {
      addAudit('BOOKING_REJECTED', user.email, user.role, `Rejected booking #${bookingId}: ${reason}`, 'booking', bookingId);
    }

    addNotification(
      target.borrowerEmail,
      'Booking Request Declined',
      `Your request for ${target.resourceTitle} was declined: "${reason}". Check alternative units in the directory.`,
      'booking'
    );

    return true;
  };

  // 5. Check-In Action
  const performCheckIn = async (bookingId: string, method: 'qr-scan' | 'manual-token' = 'qr-scan') => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return { success: false, error: 'Booking not found' };

    const checkInRecord: CheckInOutRecord = {
      id: `chk-${Date.now()}`,
      bookingId,
      checkInTime: new Date().toISOString(),
      checkInVerifiedBy: user?.fullName || 'Lab Duty Officer',
      gatePassCode: target.checkInRecord?.gatePassCode || `PASS-${bookingId.replace('BK-', '')}`,
      method
    };

    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      status: 'checked-in',
      checkInRecord
    } : b));

    addAudit('CHECK_IN_RECORDED', user?.email || target.borrowerEmail, user?.role || 'borrower', `Session #${bookingId} checked in via ${method}`, 'booking', bookingId);
    addNotification(
      target.borrowerEmail,
      'Session Checked In',
      `Your session on ${target.resourceTitle} is now ACTIVE. Please perform initial condition check.`,
      'checkin'
    );

    return { success: true, record: checkInRecord };
  };

  // 6. Check-Out Action
  const performCheckOut = async (bookingId: string) => {
    const target = bookings.find(b => b.id === bookingId);
    if (!target) return { success: false, error: 'Booking not found' };

    const updatedRecord: CheckInOutRecord = {
      id: target.checkInRecord?.id || `chk-${Date.now()}`,
      bookingId,
      checkInTime: target.checkInRecord?.checkInTime || new Date().toISOString(),
      checkInVerifiedBy: target.checkInRecord?.checkInVerifiedBy || 'Facility Staff',
      checkOutTime: new Date().toISOString(),
      checkOutVerifiedBy: user?.fullName || 'Facility Staff',
      gatePassCode: target.checkInRecord?.gatePassCode || `PASS-${bookingId}`,
      method: target.checkInRecord?.method || 'qr-scan'
    };

    setBookings(prev => prev.map(b => b.id === bookingId ? {
      ...b,
      status: 'completed',
      checkInRecord: updatedRecord
    } : b));

    addAudit('CHECK_OUT_COMPLETED', user?.email || target.borrowerEmail, user?.role || 'borrower', `Session #${bookingId} checked out. Completed usage.`, 'booking', bookingId);
    addNotification(
      target.borrowerEmail,
      'Session Completed & Checked Out',
      `Your session on ${target.resourceTitle} is completed. Please file your post-use condition report.`,
      'checkin'
    );

    return { success: true };
  };

  // 7. Submit Condition Report
  const submitConditionReport = async (reportData: Omit<ConditionReport, 'id' | 'timestamp'>) => {
    const newReport: ConditionReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    setConditionReports(prev => [newReport, ...prev]);

    setBookings(prev => prev.map(b => {
      if (b.id === reportData.bookingId) {
        return {
          ...b,
          conditionReports: [...(b.conditionReports || []), newReport]
        };
      }
      return b;
    }));

    addAudit(
      'CONDITION_REPORT_SUBMITTED',
      reportData.submittedBy,
      'borrower',
      `Filed ${reportData.reportType} condition report for #${reportData.bookingId} (Rating: ${reportData.rating}/5)`,
      'resource',
      newReport.id
    );

    return true;
  };

  // 8. Report an Incident (damaged or missing equipment)
  const reportIncident = async (incidentData: Omit<IncidentReport, 'id' | 'timestamp' | 'status'>) => {
    const incId = `INC-${Math.floor(100 + Math.random() * 900)}`;
    const newIncident: IncidentReport = {
      ...incidentData,
      id: incId,
      status: 'under-review',
      timestamp: new Date().toISOString()
    };

    setIncidents(prev => [newIncident, ...prev]);

    // If critical severity, update resource availability to maintenance
    if (incidentData.severity === 'critical') {
      setResources(prev => prev.map(r => r.id === incidentData.resourceId ? {
        ...r,
        availability: { ...r.availability, status: 'maintenance' }
      } : r));
    }

    addAudit(
      'INCIDENT_REPORTED',
      incidentData.reportedByEmail,
      incidentData.reportedByRole,
      `Reported [${incidentData.severity.toUpperCase()}] incident on ${incidentData.resourceTitle}: ${incidentData.incidentType}`,
      'incident',
      incId
    );

    // Notify Admins
    addNotification(
      'admin@sharegrid.in',
      `Equipment Incident Flagged (${incidentData.severity.toUpperCase()})`,
      `${incidentData.reportedByName} reported a ${incidentData.incidentType} on ${incidentData.resourceTitle}. Review required.`,
      'incident'
    );

    return incId;
  };

  // 9. Resolve an Incident (Admin only)
  const resolveIncident = async (incidentId: string, adminResolutionNotes: string) => {
    setIncidents(prev => prev.map(inc => inc.id === incidentId ? {
      ...inc,
      status: 'resolved',
      adminResolutionNotes
    } : inc));

    addAudit(
      'INCIDENT_RESOLVED',
      user?.email || 'admin@sharegrid.in',
      'admin',
      `Resolved incident #${incidentId}: ${adminResolutionNotes}`,
      'incident',
      incidentId
    );

    return true;
  };

  // 10. Join Waiting List (Fair Allocation System)
  const joinWaitingList = async (
    entryData: Omit<WaitingListEntry, 'id' | 'joinedAt' | 'position' | 'status' | 'priorityScore'>
  ) => {
    // Prevent duplicate waiting list enrollments for the same slot
    const existing = waitingLists.find(
      w => w.borrowerEmail === entryData.borrowerEmail && 
           w.resourceId === entryData.resourceId && 
           w.requestedDate === entryData.requestedDate &&
           w.status === 'waiting'
    );

    if (existing) {
      return { success: false, position: existing.position, entryId: existing.id };
    }

    const currentQueue = waitingLists.filter(
      w => w.resourceId === entryData.resourceId && 
           w.requestedDate === entryData.requestedDate && 
           w.status === 'waiting'
    );

    const position = currentQueue.length + 1;
    const entryId = `wait-${Date.now()}`;
    const newEntry: WaitingListEntry = {
      ...entryData,
      id: entryId,
      position,
      priorityScore: 90 - (position * 5),
      joinedAt: new Date().toISOString(),
      status: 'waiting'
    };

    setWaitingLists(prev => [...prev, newEntry]);

    addAudit(
      'WAITING_LIST_ENROLLED',
      entryData.borrowerEmail,
      'borrower',
      `Joined waiting list for ${entryData.resourceTitle} on ${entryData.requestedDate} (Queue #${position})`,
      'allocation',
      entryId
    );

    addNotification(
      entryData.borrowerEmail,
      'Enrolled on Priority Waiting List',
      `You are Queue Position #${position} for ${entryData.resourceTitle} on ${entryData.requestedDate}. We will notify you instantly if a slot opens.`,
      'waiting_list'
    );

    return { success: true, position, entryId };
  };

  // 11. Leave Waiting List
  const leaveWaitingList = async (entryId: string) => {
    const target = waitingLists.find(w => w.id === entryId);
    if (!target) return false;

    setWaitingLists(prev => prev.filter(w => w.id !== entryId));

    addAudit(
      'WAITING_LIST_LEFT',
      target.borrowerEmail,
      'borrower',
      `Withdrew from waiting list for ${target.resourceTitle}`,
      'allocation',
      entryId
    );

    return true;
  };

  // 12. Notifications Management
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    if (user) {
      setNotifications(prev => prev.filter(n => n.userEmail !== user.email));
    }
  };

  // 13. Owner Resource Management: Add, Edit, Deactivate, Delete
  const addResource = async (newResourceData: Omit<ResourceItem, 'id' | 'code'>): Promise<ResourceItem> => {
    const id = `res-custom-${Date.now()}`;
    const code = `INST-${newResourceData.category.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const item: ResourceItem = {
      ...newResourceData,
      id,
      code,
      active: true,
      ownerId: user?.id || 'usr-owner-01'
    };
    setResources(prev => [item, ...prev]);
    if (user) {
      addAudit('RESOURCE_CREATED', user.email, user.role, `Listed resource ${item.title} (${code})`, 'resource', id);
    }
    return item;
  };

  const editResource = async (resourceId: string, updatedData: Partial<ResourceItem>) => {
    setResources(prev => prev.map(r => r.id === resourceId ? { ...r, ...updatedData } : r));
    if (user) {
      addAudit('RESOURCE_EDITED', user.email, user.role, `Updated resource details for #${resourceId}`, 'resource', resourceId);
    }
    return true;
  };

  const toggleResourceActive = async (resourceId: string, active: boolean) => {
    setResources(prev => prev.map(r => r.id === resourceId ? { ...r, active } : r));
    if (user) {
      addAudit('RESOURCE_ACTIVATION_TOGGLED', user.email, user.role, `Listing #${resourceId} set to active=${active}`, 'resource', resourceId);
    }
    return true;
  };

  const deleteResource = async (resourceId: string) => {
    // Check if there are active approved/checked-in bookings
    const activeBooking = bookings.find(
      b => b.resourceId === resourceId && (b.status === 'approved' || b.status === 'checked-in')
    );

    if (activeBooking) {
      return { 
        success: false, 
        error: `Cannot delete listing: active session #${activeBooking.id} is confirmed. Please cancel or complete bookings first.` 
      };
    }

    setResources(prev => prev.filter(r => r.id !== resourceId));
    if (user) {
      addAudit('RESOURCE_DELETED', user.email, user.role, `Deleted resource listing #${resourceId}`, 'resource', resourceId);
    }
    return { success: true };
  };

  const updateResourceStatus = async (resourceId: string, status: ResourceItem['availability']['status']) => {
    setResources(prev => prev.map(r => r.id === resourceId ? {
      ...r,
      availability: { ...r.availability, status }
    } : r));
    if (user) {
      addAudit('RESOURCE_STATUS_CHANGED', user.email, user.role, `Resource ${resourceId} status set to ${status}`, 'resource', resourceId);
    }
    return true;
  };

  // 14. Admin Owner Verification
  const approveOwner = async (userId: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, verificationStatus: 'approved' } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, verificationStatus: 'approved' } : null);
    }
    if (user) {
      addAudit('OWNER_VERIFIED', user.email, 'admin', `Approved core facility verification for user ${userId}`, 'verification', userId);
    }
    return true;
  };

  const rejectOwner = async (userId: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, verificationStatus: 'rejected' } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, verificationStatus: 'rejected' } : null);
    }
    if (user) {
      addAudit('OWNER_REJECTED', user.email, 'admin', `Rejected core facility verification for user ${userId}`, 'verification', userId);
    }
    return true;
  };

  const pendingVerifications = allUsers.filter(u => u.role === 'owner' && u.verificationStatus === 'pending');

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isSupabaseMode: isSupabase,
      login,
      loginAsRole,
      register,
      logout,
      bookings,
      createBooking,
      cancelBooking,
      approveBooking,
      rejectBooking,
      performCheckIn,
      performCheckOut,
      conditionReports,
      submitConditionReport,
      incidents,
      reportIncident,
      resolveIncident,
      waitingLists,
      joinWaitingList,
      leaveWaitingList,
      notifications,
      markNotificationRead,
      clearAllNotifications,
      resources,
      addResource,
      editResource,
      toggleResourceActive,
      deleteResource,
      updateResourceStatus,
      allUsers,
      pendingVerifications,
      approveOwner,
      rejectOwner,
      auditLogs
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
