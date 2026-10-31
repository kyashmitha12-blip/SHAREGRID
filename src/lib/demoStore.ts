import type {
  AppNotification,
  BookingRequest,
  ConditionReport,
  IncidentReport,
  PlatformAuditLog,
  UserProfile,
  WaitingListEntry,
} from '../types/auth';
import type { ResourceItem } from '../types/resource';

const STORAGE_KEY = 'sharegrid_demo_state_v1';

export interface DemoState {
  user: UserProfile | null;
  allUsers: UserProfile[];
  bookings: BookingRequest[];
  resources: ResourceItem[];
  waitingLists: WaitingListEntry[];
  notifications: AppNotification[];
  conditionReports: ConditionReport[];
  incidents: IncidentReport[];
  auditLogs: PlatformAuditLog[];
}

export function loadDemoState(defaults: DemoState): DemoState {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaults;

    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return defaults;

    const state = parsed as Partial<DemoState>;
    return {
      user: state.user ?? defaults.user,
      allUsers: Array.isArray(state.allUsers) ? state.allUsers : defaults.allUsers,
      bookings: Array.isArray(state.bookings) ? state.bookings : defaults.bookings,
      resources: Array.isArray(state.resources) ? state.resources : defaults.resources,
      waitingLists: Array.isArray(state.waitingLists) ? state.waitingLists : defaults.waitingLists,
      notifications: Array.isArray(state.notifications) ? state.notifications : defaults.notifications,
      conditionReports: Array.isArray(state.conditionReports) ? state.conditionReports : defaults.conditionReports,
      incidents: Array.isArray(state.incidents) ? state.incidents : defaults.incidents,
      auditLogs: Array.isArray(state.auditLogs) ? state.auditLogs : defaults.auditLogs,
    };
  } catch {
    return defaults;
  }
}

export function saveDemoState(state: DemoState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

