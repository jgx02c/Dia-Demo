export interface QuickStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

export interface RecentActivity {
  id: string;
  type: 'case_update' | 'document_added' | 'comment_added' | 'status_change';
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
}

export interface DashboardProps {
  sidebarOpen?: boolean;
}

export type ActivityType = RecentActivity['type']; 