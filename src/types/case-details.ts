import type { StrategyInstruction } from './strategy';

export type CaseStatus = 'active' | 'pending' | 'closed';

export interface Case {
  id: string;
  name: string;
  description: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CaseFile {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  caseId: string;
}

export interface Insight {
  id: string;
  type: 'transcription' | 'analysis' | 'summary';
  content: string;
  timestamp: string;
  status: 'processing' | 'completed' | 'error';
}

export interface Log {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface Transcription {
  id: string;
  title: string;
  date: string;
  duration: string;
  type: 'audio' | 'video';
  status: 'processing' | 'completed' | 'error';
}

export interface Bookmark {
  id: string;
  title: string;
  excerpt: string;
  type: 'evidence' | 'transcription';
  date: string;
  caseId: string;
}

export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  documentType: 'trial' | 'deposition' | 'evidence' | 'motion' | 'order' | 'expert_report';
  requirements: {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  dataPoints: {
    id: string;
    name: string;
    type: 'date' | 'person' | 'location' | 'amount' | 'fact' | 'citation';
    required: boolean;
  }[];
  isDefault: boolean;
  category: 'legal' | 'technical' | 'financial' | 'general';
  createdBy: string;
  createdAt: string;
}

export interface StrategySet {
  id: string;
  name: string;
  description: string;
  strategies: StrategyInstruction[];
  isDefault: boolean;
  category: 'legal' | 'technical' | 'financial' | 'general';
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
}

export type PreviewItemData = CaseFile | Transcription | Bookmark | StrategyInstruction;

export type PreviewItem = {
  type: 'document' | 'transcription' | 'bookmark' | 'strategy';
  data: PreviewItemData;
};

export interface TranscriptionSegment {
  id: string;
  timestamp: string;
  speaker: string;
  content: string;
  confidence: number;
  type: 'legal_issue' | 'fact_pattern' | 'evidence_reference' | 'action_item' | 'risk_assessment';
}

export interface DocumentReference {
  id: string;
  name: string;
  type: string;
  relevantSection: {
    page: number;
    text: string;
    highlight: string;
  };
}

export interface InsightAnalysis {
  id: string;
  type: 'legal_issue' | 'fact_pattern' | 'evidence_reference' | 'action_item' | 'risk_assessment';
  title: string;
  description: string;
  confidence: number;
  category: string;
  timestamp: string;
  transcriptionSegments: TranscriptionSegment[];
  relatedDocuments: DocumentReference[];
  relatedInstructions: StrategyInstruction[];
  analysis: {
    summary: string;
    keyPoints: string[];
    implications: string[];
    recommendations?: string[];
    riskLevel?: 'low' | 'medium' | 'high';
  };
  metadata: {
    generatedBy: string;
    modelVersion: string;
    processingTime: string;
  };
  status: 'completed' | 'processing' | 'failed';
}

export interface InsightViewerProps {
  insight: InsightAnalysis;
  onClose: () => void;
  onDocumentPreview: (document: DocumentReference) => void;
  onInstructionClick?: (instruction: StrategyInstruction) => void;
}

export { StrategyInstruction }; 