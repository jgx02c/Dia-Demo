export interface Case {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'active' | 'closed' | 'pending';
  priority: 'high' | 'medium' | 'low';
  type: string;
  lastUpdated: string;
}

export interface StatusColors {
  [key: string]: string;
  active: string;
  closed: string;
  pending: string;
}

export interface PriorityColors {
  [key: string]: string;
  high: string;
  medium: string;
  low: string;
}

export interface CaseFilters {
  searchTerm: string;
  status: string;
  type: string;
  dateRange: string;
  priority: string;
}

export interface CaseActivity {
  id: string;
  type: 'note' | 'status_change' | 'document' | 'assignment';
  content: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
}

export interface CaseDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface CaseAssignee {
  id: string;
  name: string;
  avatar: string;
  role: string;
  assignedAt: string;
} 