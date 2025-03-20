export interface Permission {
  id: string;
  user: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Edit' | 'View';
  dateAdded: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  user: string;
  timestamp: string;
}

export interface OrgPermission {
  id: string;
  role: string;
  description: string;
  users: number;
} 