export type DocumentType = 'trial' | 'deposition' | 'evidence' | 'motion' | 'order' | 'expert_report' | 'transcription';
export type Priority = 'high' | 'medium' | 'low';
export type DataPointType = 'date' | 'person' | 'location' | 'amount' | 'fact' | 'citation' | 'currency' | 'string';
export type StrategyCategory = 'legal' | 'technical' | 'financial' | 'general';

export interface Requirement {
  id: string;
  title: string;
  description: string;
  priority: Priority;
}

export interface DataPoint {
  id: string;
  name: string;
  type: DataPointType;
  required: boolean;
}

export interface NewStrategy {
  title: string;
  documentType: DocumentType;
  description: string;
  requirements: Requirement[];
  dataPoints: DataPoint[];
}

export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  documentType: DocumentType;
  requirements: Requirement[];
  dataPoints: DataPoint[];
  isDefault: boolean;
  category: StrategyCategory;
  createdBy: string;
  createdAt: string;
}

export interface StrategySet {
  id: string;
  name: string;
  description: string;
  strategies: StrategyInstruction[];
  isDefault: boolean;
  category: StrategyCategory;
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
}

export interface StrategyInstruction {
  id: string;
  documentType: DocumentType;
  title: string;
  description: string;
  requirements: Requirement[];
  dataPoints: DataPoint[];
  lastUpdated: string;
  updatedBy: string;
  templateId?: string;
  caseId: string;
  customizations?: {
    addedRequirements: string[];
    removedRequirements: string[];
    addedDataPoints: string[];
    removedDataPoints: string[];
  };
} 