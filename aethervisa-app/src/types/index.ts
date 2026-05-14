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
  targetCountry: string;          // preferred destination country
  monthlyIncome: number;
  hasJobOffer: boolean;
  hasUniversityOffer: boolean;
  /** Primary/legacy language level — always the German level for DE visas */
  languageLevel: string;
  /** Per-language CEFR levels, e.g. { de: 'B2', nl: 'A2', fr: 'None' } */
  languageLevels: Record<string, string>;
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

// ── Law change tracking ───────────────────────────────────────────────────────

export type LawChangeSeverity = 'critical' | 'important' | 'minor';

export interface LawUpdate {
  id: string;
  /** ISO date string when the change takes / took effect */
  effectiveDate: string;
  /** ISO date string when AetherVisa last verified this entry */
  verifiedAt: string;
  severity: LawChangeSeverity;
  country: string;
  flag: string;
  /** IDs of affected VisaOptions, or [] for cross-cutting EU changes */
  affectedVisaIds: string[];
  title: string;
  summary: string;
  /** What changed (before → after) */
  what: { before: string; after: string } | null;
  /** Plain-English action the applicant should take */
  actionRequired: string | null;
  sourceLabel: string;
  sourceUrl: string;
}

/** A versioned threshold value — salary, fee, income floor, etc. */
export interface VersionedThreshold {
  id: string;
  label: string;
  country: string;
  affectedVisaIds: string[];
  value: number;
  unit: string;
  effectiveDate: string;
  verifiedAt: string;
  sourceLabel: string;
  sourceUrl: string;
}
