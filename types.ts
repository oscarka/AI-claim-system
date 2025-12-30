
export enum ClaimStatus {
  PENDING = 'PENDING',
  OCR_PROCESSING = 'OCR_PROCESSING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PENDING_DOCS = 'PENDING_DOCS'
}

export type DocType = '发票' | '费用明细' | '诊断证明' | '出院小结' | '身份证明' | '检查报告' | '未知';

export interface ClaimDoc {
  id: string;
  url: string;
  type: DocType;
  confidence: number;
  extractedData?: any;
}

export interface Visit {
  id: string;
  hospitalName: string;
  hospitalLevel: string;
  admissionDate: string;
  dischargeDate: string;
  diagnosis: string;
  totalVisitAmount: number;
  docs: ClaimDoc[];
}

export interface Claim {
  id: string;
  caseNumber: string;
  insuredId: string;
  insuredName: string;
  idCard: string;
  policyNumber: string;
  status: ClaimStatus;
  amount: number;
  createdAt: string;
  visits: Visit[];
}

export interface Insured {
  id: string;
  name: string;
  age: number;
  gender: '男' | '女';
  idCard: string;
  riskLevel: '低' | '中' | '高';
  historyCount: number;
  tags: string[];
}

export interface PolicyMember {
  id: string;
  name: string;
  idCard: string;
  premium: number;
  claimCount: number;
}

export interface PolicyPlan {
  id: string;
  name: string;
  benefits: string[];
  specialTerms: string[]; // 特别约定
  members: PolicyMember[];
}

export interface Policy {
  id: string;
  policyNumber: string;
  name: string;
  type: '雇主责任险' | '团体意外险' | '补充医疗险';
  holder: string;
  insuredCount: number;
  status: '生效中' | '已过期';
  effectiveDate: string;
  expiryDate: string;
  terms: string;
  plans: PolicyPlan[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'Person' | 'Claim' | 'Diagnosis' | 'Treatment' | 'Hospital';
}

export interface GraphLink {
  source: string;
  target: string;
  label: string;
}
