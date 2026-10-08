// Counselling Workflow State Management
// Manages the TNEA counselling process phases and admin actions

export type CounsellingPhase = 
  | 'notification'
  | 'registration'
  | 'verification'
  | 'rankList'
  | 'choiceFilling'
  | 'allotment'
  | 'feeCollection'
  | 'reporting';

export interface CounsellingWorkflowState {
  currentPhase: CounsellingPhase;
  notification: {
    released: boolean;
    startDate: string | null;
    endDate: string | null;
  };
  registration: {
    open: boolean;
    totalRegistrations: number;
    startDate: string | null;
    endDate: string | null;
  };
  verification: {
    active: boolean;
    pending: number;
    verified: number;
    rejected: number;
  };
  rankList: {
    published: boolean;
    publishedDate: string | null;
  };
  choiceFilling: {
    enabled: boolean;
    studentsSubmitted: number;
    startDate: string | null;
    endDate: string | null;
  };
  allotment: {
    completed: boolean;
    round: number;
    seatsAllotted: number;
    publishedDate: string | null;
  };
  feeCollection: {
    open: boolean;
    paid: number;
    pending: number;
  };
  reporting: {
    active: boolean;
    reported: number;
    pending: number;
  };
}

const WORKFLOW_STORAGE_KEY = 'tnea_counselling_workflow';

// Initial workflow state
const initialWorkflowState: CounsellingWorkflowState = {
  currentPhase: 'notification',
  notification: {
    released: false,
    startDate: null,
    endDate: null,
  },
  registration: {
    open: false,
    totalRegistrations: 0,
    startDate: null,
    endDate: null,
  },
  verification: {
    active: false,
    pending: 0,
    verified: 0,
    rejected: 0,
  },
  rankList: {
    published: false,
    publishedDate: null,
  },
  choiceFilling: {
    enabled: false,
    studentsSubmitted: 0,
    startDate: null,
    endDate: null,
  },
  allotment: {
    completed: false,
    round: 0,
    seatsAllotted: 0,
    publishedDate: null,
  },
  feeCollection: {
    open: false,
    paid: 0,
    pending: 0,
  },
  reporting: {
    active: false,
    reported: 0,
    pending: 0,
  },
};

export const counsellingWorkflow = {
  // Get current workflow state
  getState(): CounsellingWorkflowState {
    if (typeof window === 'undefined') return initialWorkflowState;
    
    const stateStr = localStorage.getItem(WORKFLOW_STORAGE_KEY);
    if (!stateStr) {
      // Initialize with demo data for testing
      const demoState = {
        ...initialWorkflowState,
        currentPhase: 'choiceFilling' as CounsellingPhase,
        notification: {
          released: true,
          startDate: '2024-06-01',
          endDate: '2024-08-31',
        },
        registration: {
          open: true,
          totalRegistrations: 45234,
          startDate: '2024-06-10',
          endDate: '2024-06-30',
        },
        verification: {
          active: true,
          pending: 1248,
          verified: 43986,
          rejected: 0,
        },
        rankList: {
          published: true,
          publishedDate: '2024-07-01',
        },
        choiceFilling: {
          enabled: true,
          studentsSubmitted: 38567,
          startDate: '2024-07-15',
          endDate: '2024-07-25',
        },
      };
      this.setState(demoState);
      return demoState;
    }

    try {
      return JSON.parse(stateStr);
    } catch {
      return initialWorkflowState;
    }
  },

  // Update workflow state
  setState(state: CounsellingWorkflowState): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(state));
  },

  // Release counselling notification
  releaseNotification(startDate: string, endDate: string): void {
    const state = this.getState();
    state.notification.released = true;
    state.notification.startDate = startDate;
    state.notification.endDate = endDate;
    state.currentPhase = 'registration';
    this.setState(state);
  },

  // Open/Close registration
  toggleRegistration(open: boolean, startDate?: string, endDate?: string): void {
    const state = this.getState();
    state.registration.open = open;
    if (startDate) state.registration.startDate = startDate;
    if (endDate) state.registration.endDate = endDate;
    this.setState(state);
  },

  // Update registration count
  updateRegistrationCount(count: number): void {
    const state = this.getState();
    state.registration.totalRegistrations = count;
    this.setState(state);
  },

  // Toggle certificate verification
  toggleVerification(active: boolean): void {
    const state = this.getState();
    state.verification.active = active;
    if (active) state.currentPhase = 'verification';
    this.setState(state);
  },

  // Update verification stats
  updateVerificationStats(pending: number, verified: number, rejected: number): void {
    const state = this.getState();
    state.verification.pending = pending;
    state.verification.verified = verified;
    state.verification.rejected = rejected;
    this.setState(state);
  },

  // Publish rank list
  publishRankList(): void {
    const state = this.getState();
    state.rankList.published = true;
    state.rankList.publishedDate = new Date().toISOString().split('T')[0];
    state.currentPhase = 'rankList';
    this.setState(state);
  },

  // Unpublish rank list
  unpublishRankList(): void {
    const state = this.getState();
    state.rankList.published = false;
    state.rankList.publishedDate = null;
    this.setState(state);
  },

  // Toggle choice filling
  toggleChoiceFilling(enabled: boolean, startDate?: string, endDate?: string): void {
    const state = this.getState();
    state.choiceFilling.enabled = enabled;
    if (startDate) state.choiceFilling.startDate = startDate;
    if (endDate) state.choiceFilling.endDate = endDate;
    if (enabled) state.currentPhase = 'choiceFilling';
    this.setState(state);
  },

  // Update choice filling count
  updateChoiceFillingCount(count: number): void {
    const state = this.getState();
    state.choiceFilling.studentsSubmitted = count;
    this.setState(state);
  },

  // Run seat allotment
  runSeatAllotment(round: number, seatsAllotted: number): void {
    const state = this.getState();
    state.allotment.completed = true;
    state.allotment.round = round;
    state.allotment.seatsAllotted = seatsAllotted;
    state.allotment.publishedDate = new Date().toISOString().split('T')[0];
    state.currentPhase = 'allotment';
    this.setState(state);
  },

  // Toggle fee collection
  toggleFeeCollection(open: boolean): void {
    const state = this.getState();
    state.feeCollection.open = open;
    if (open) state.currentPhase = 'feeCollection';
    this.setState(state);
  },

  // Update fee collection stats
  updateFeeStats(paid: number, pending: number): void {
    const state = this.getState();
    state.feeCollection.paid = paid;
    state.feeCollection.pending = pending;
    this.setState(state);
  },

  // Toggle reporting
  toggleReporting(active: boolean): void {
    const state = this.getState();
    state.reporting.active = active;
    if (active) state.currentPhase = 'reporting';
    this.setState(state);
  },

  // Update reporting stats
  updateReportingStats(reported: number, pending: number): void {
    const state = this.getState();
    state.reporting.reported = reported;
    state.reporting.pending = pending;
    this.setState(state);
  },

  // Reset workflow (for testing)
  reset(): void {
    this.setState(initialWorkflowState);
  },
};
