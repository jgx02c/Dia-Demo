import type { CaseFile } from './case-details';

export interface Database {
  id: string;
  name: string;
  status: 'ready' | 'indexing' | 'error';
  fileCount: number;
  lastUpdated: string;
  caseId: string;
  description?: string;
  files?: CaseFile[];
} 