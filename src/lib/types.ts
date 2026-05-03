// ============================================================
// CodeMint AI — Core Types
// ============================================================

export type AnalysisType =
  | 'code-review'
  | 'bug-detection'
  | 'optimization'
  | 'security'
  | 'full-rewrite';

export type InputMethod = 'paste' | 'file' | 'github-pr';

export type SessionStatus =
  | 'pending'
  | 'awaiting-payment'
  | 'paid'
  | 'analyzing'
  | 'complete'
  | 'failed';

export type Language =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'rust'
  | 'go'
  | 'java'
  | 'cpp'
  | 'auto';

export interface AnalysisRequest {
  id: string;
  inputMethod: InputMethod;
  code?: string;
  fileName?: string;
  githubPrUrl?: string;
  analysisType: AnalysisType;
  language: Language;
  createdAt: string;
}

export interface CheckoutSession {
  id: string;
  requestId: string;
  amount: number;      // in USD cents
  currency: 'USD';
  status: 'pending' | 'paid' | 'expired' | 'failed';
  locusSessionId?: string;
  locusPaymentUrl?: string;
  walletAddress?: string;
  txHash?: string;
  createdAt: string;
  paidAt?: string;
}

export interface AnalysisFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  title: string;
  description: string;
  line?: number;
  suggestion?: string;
  codeSnippet?: string;
  fixedSnippet?: string;
}

export interface AnalysisResult {
  id: string;
  sessionId: string;
  requestId: string;
  summary: string;
  score: number; // 0-100
  findings: AnalysisFinding[];
  rewrittenCode?: string;
  metrics: {
    linesAnalyzed: number;
    issuesFound: number;
    criticalIssues: number;
    optimizationsFound: number;
  };
  createdAt: string;
}

export interface Order {
  id: string;
  request: AnalysisRequest;
  session: CheckoutSession;
  result?: AnalysisResult;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookLog {
  id: string;
  event: string;
  payload: Record<string, unknown>;
  status: 'received' | 'processed' | 'failed';
  sessionId?: string;
  timestamp: string;
}

export interface Analytics {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  conversionRate: number;
  avgOrderValue: number;
  revenueByType: Record<AnalysisType, number>;
}

// Pricing per analysis type (in USD cents)
export const ANALYSIS_PRICING: Record<AnalysisType, { price: number; label: string; description: string }> = {
  'code-review':   { price: 499,  label: 'Code Review',     description: 'Comprehensive review with best practices' },
  'bug-detection': { price: 699,  label: 'Bug Detection',   description: 'Find hidden bugs and logic errors' },
  'optimization':  { price: 599,  label: 'Optimization',    description: 'Performance and efficiency improvements' },
  'security':      { price: 999,  label: 'Security Audit',  description: 'Vulnerability scan and security hardening' },
  'full-rewrite':  { price: 1499, label: 'Full Rewrite',    description: 'AI-rewritten clean production code' },
};

export const ANALYSIS_LABELS: Record<AnalysisType, string> = {
  'code-review':   'Code Review',
  'bug-detection': 'Bug Detection',
  'optimization':  'Optimization',
  'security':      'Security Audit',
  'full-rewrite':  'Full Rewrite',
};
