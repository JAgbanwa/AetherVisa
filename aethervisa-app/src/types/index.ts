export interface VisaOption {
  id: string;
  name: string;
  country: string;
  flag: string;
  type: string;
  targetGroup: string[];
  minSalary?: number;
  processingTime: string;
  cost: number;
  successRate?: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Very Hard';
  description: string;
  pros: string[];
  cons: string[];
  requirements: string[];
  link?: string;
}

export interface UserProfile {
  nationality: string;
  education: string;
  field: string;
  workExperience: number;
  currentLocation: string;
  monthlyIncome: number;
  hasJobOffer: boolean;
  hasUniversityOffer: boolean;
  languageLevel: string;
  familySize: number;
}

export interface LegalReference {
  label: string;       // Short display name, e.g. "Directive 2016/801, Art. 28"
  description: string; // Plain-English explanation of what this clause does for the applicant
  url: string;         // Canonical EUR-Lex or national law URL
}

export interface EligibilityResult {
  visa: VisaOption;
  probability: number;
  recommendation: string;
  missingRequirements: string[];
  strengths: string[];
  legalBasis: LegalReference[];  // EU / national law citations relevant to this result
}

export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  completed: boolean;
  category: string;
}

export interface CostBreakdown {
  visaFee: number;
  translationCost: number;
  legalHelp: number;
  healthInsurance: number;
  livingExpenses: number;
  travelCost: number;
  miscellaneous: number;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  flag: string;
  departments: string[];
  friendlinessScore: number;
  notes: string;
  website: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface OutreachEntry {
  id: string;
  universityName: string;
  professorName: string;
  department: string;
  emailSent: string;
  status: 'sent' | 'replied' | 'no-response' | 'positive' | 'negative';
  notes: string;
}

export type PricingTier = 'free' | 'premium' | 'enterprise';

export interface RedFlag {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  consequences: string[];
  howToAvoid: string;
}
