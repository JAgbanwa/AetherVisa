import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { UserProfile, EligibilityResult } from '../types';
import { COUNTRIES, EDUCATION_LEVELS, RESEARCH_FIELDS } from '../data';
import { calculateEligibility } from '../hooks/useEligibility';
import { getUpdatesForVisa } from '../data/lawUpdates';
import { LawUpdatesPill } from '../components/LawUpdatesBanner';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ArrowRight, ArrowLeft, CheckCircle, XCircle, AlertTriangle,
  Sparkles, ChevronRight, TrendingUp, Shield, Loader, Scale, ExternalLink,
  FileText, Upload
} from 'lucide-react';
import clsx from 'clsx';

// Configure pdf.js worker (uses bundled legacy build to avoid CDN dependency)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const defaultProfile: UserProfile = {
  nationality: '',
  education: '',
  field: '',
  workExperience: 0,
  currentLocation: '',
  targetCountry: '',
  monthlyIncome: 0,
  hasJobOffer: false,
  hasUniversityOffer: false,
  languageLevel: 'None',
  languageLevels: {},
  familySize: 1,
};

// ── CV auto-fill ─────────────────────────────────────────────────────────────

/** Strip LaTeX markup from .tex source, leaving readable plain text */
function stripLatex(src: string): string {
  return src
    .replace(/\\[a-zA-Z]+\*?(\[[^\]]*\])*(\{[^}]*\})?/g, (_, _opt, arg) => arg ? arg.slice(1, -1) : ' ')
    .replace(/[{}]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Extract all text from a PDF ArrayBuffer using pdf.js */
async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const parts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    parts.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
  }
  return parts.join('\n');
}

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
type CefrLevel = typeof CEFR_LEVELS[number] | 'None';

/** Detect the CEFR level for a given language name from raw CV text */
function detectLangLevel(raw: string, langNames: string[]): CefrLevel {
  for (const name of langNames) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const patterns = [
      new RegExp(`${escapedName}[:\\s(]+([A-C][12])`, 'i'),
      new RegExp(`([A-C][12])[^.\\n]{0,30}${escapedName}`, 'i'),
    ];
    for (const pat of patterns) {
      const m = raw.match(pat);
      if (m) {
        const lvl = m[1].toUpperCase() as CefrLevel;
        if ((CEFR_LEVELS as readonly string[]).includes(lvl)) return lvl;
      }
    }
    // Qualitative: native / fluent / proficient / conversational / basic
    if (new RegExp(`native\\s+${escapedName}|${escapedName}[:\\s(]+native`, 'i').test(raw)) return 'C2';
    if (new RegExp(`fluent\\s+(?:in\\s+)?${escapedName}|${escapedName}[:\\s(]+fluent`, 'i').test(raw)) return 'C1';
    if (new RegExp(`proficient\\s+(?:in\\s+)?${escapedName}|${escapedName}[:\\s(]+proficient`, 'i').test(raw)) return 'B2';
    if (new RegExp(`conversational\\s+${escapedName}|${escapedName}[:\\s(]+conversational`, 'i').test(raw)) return 'B1';
    if (new RegExp(`basic\\s+${escapedName}|${escapedName}[:\\s(]+basic`, 'i').test(raw)) return 'A2';
  }
  return 'None';
}

function parseCV(raw: string): Partial<UserProfile> {
  const result: Partial<UserProfile> = {};

  // Education level (most specific first)
  if (/postdoctoral|post-doctoral|post\s+doc/i.test(raw)) result.education = 'Postdoctoral';
  else if (/ph\.?d|doctorate|doctoral thesis/i.test(raw)) result.education = 'PhD / Doctorate';
  else if (/master'?s?|\bmsc\b|m\.sc\.?|\bmba\b|m\.eng|\bmres\b|m\.a\.|magister/i.test(raw)) result.education = "Master's Degree";
  else if (/bachelor'?s?|\bbsc\b|b\.sc\.?|b\.eng|b\.a\.|undergraduate degree/i.test(raw)) result.education = "Bachelor's Degree";
  else if (/high school|secondary school|a[- ]?levels?|\bgcse\b|abitur|baccalaur/i.test(raw)) result.education = 'High School';
  else if (/\bcertif|\bdiploma\b|\bhnd\b|associate degree/i.test(raw)) result.education = 'Professional Certification';

  // Field (most specific first)
  if (/machine learning|artificial intelligence|deep learning|neural network/i.test(raw)) result.field = 'Computer Science / AI / Machine Learning';
  else if (/data science|data analyst/i.test(raw)) result.field = 'Data Science / Statistics';
  else if (/computer science|software engineer|software developer|web developer|full.?stack|\bdevops\b|back.?end|front.?end/i.test(raw)) result.field = 'Computer Science / AI / Machine Learning';
  else if (/biomedical|life science|molecular biology|genetics|biochemistry|neuroscience/i.test(raw)) result.field = 'Biomedical / Life Sciences';
  else if (/mechanical engineer|civil engineer|electrical engineer|structural engineer/i.test(raw)) result.field = 'Engineering (Mechanical/Civil/Electrical)';
  else if (/\bphysics\b|astrophysics|quantum/i.test(raw)) result.field = 'Physics';
  else if (/\bchemistry\b|materials science|nanotechnol/i.test(raw)) result.field = 'Chemistry';
  else if (/\bmathematics\b|pure math|applied math|actuarial|statistician/i.test(raw)) result.field = 'Mathematics';
  else if (/\bmedicine\b|physician|medical doctor|public health|clinical medicine/i.test(raw)) result.field = 'Medicine / Public Health';
  else if (/economics|investment banking|financial analyst/i.test(raw)) result.field = 'Economics / Finance';
  else if (/sociology|psychology|anthropology|political science/i.test(raw)) result.field = 'Social Sciences';
  else if (/\bhistory\b|philosophy|literature|linguistics|humanities/i.test(raw)) result.field = 'Humanities / Arts';
  else if (/environmental science|climate science|\becology\b|sustainability/i.test(raw)) result.field = 'Environmental / Climate Science';
  else if (/\blaw\b|legal practitioner|attorney|barrister|solicitor|jurisprudence/i.test(raw)) result.field = 'Law';
  else if (/\barchitecture\b|urban planning/i.test(raw)) result.field = 'Architecture';

  // Work experience — explicit statement first
  const expMatch =
    raw.match(/(\d{1,2})\+?\s*years?\s+(?:of\s+)?(?:work\s+|professional\s+|industry\s+|relevant\s+)?experience/i) ??
    raw.match(/experience[:\s]+(\d{1,2})\+?\s*years?/i);
  if (expMatch) {
    result.workExperience = Math.min(parseInt(expMatch[1]), 40);
  } else {
    const now = new Date().getFullYear();
    const ranges = [...raw.matchAll(/(20\d\d|19\d\d)\s*[-–—]\s*(20\d\d|present|current|now)/gi)];
    let total = 0;
    for (const r of ranges) {
      const from = parseInt(r[1]);
      const toStr = r[2].toLowerCase();
      const to = /present|current|now/.test(toStr) ? now : parseInt(r[2]);
      if (!isNaN(from) && !isNaN(to) && to > from && from >= 1970 && to <= now + 1) total += to - from;
    }
    if (total > 0) result.workExperience = Math.min(Math.round(total), 40);
  }

  // Language levels — detect all four tracked languages
  const langs: Record<string, string[]> = {
    de: ['german', 'deutsch'],
    nl: ['dutch', 'nederlands', 'flemish'],
    fr: ['french', 'français', 'francais'],
    es: ['spanish', 'español', 'espanol', 'castellano'],
  };
  // Also handle Goethe/TELC/DELF/DALF/DELE certificates
  const certPatterns: Record<string, RegExp> = {
    de: /(?:goethe|telc|dsh|testdaf)[^,\n]*([A-C][12])/i,
    fr: /(?:delf|dalf|tcf|tef)[^,\n]*([A-C][12])/i,
    es: /(?:dele|siele|cervantes)[^,\n]*([A-C][12])/i,
    nl: /(?:nt2|inburgering)[^,\n]*([A-C][12])/i,
  };
  const detectedLevels: Record<string, string> = {};
  for (const [code, names] of Object.entries(langs)) {
    // Certificate first
    const certMatch = raw.match(certPatterns[code]);
    if (certMatch) {
      const lvl = certMatch[1].toUpperCase();
      if ((CEFR_LEVELS as readonly string[]).includes(lvl)) {
        detectedLevels[code] = lvl;
        continue;
      }
    }
    const lvl = detectLangLevel(raw, names);
    if (lvl !== 'None') detectedLevels[code] = lvl;
  }
  if (Object.keys(detectedLevels).length > 0) {
    result.languageLevels = detectedLevels;
    // Back-fill legacy field with German level for DE visa scoring
    if (detectedLevels.de) result.languageLevel = detectedLevels.de;
  }

  // Offers
  if (/job offer|offer letter|employment contract|employment offer/i.test(raw)) result.hasJobOffer = true;
  if (/admission letter|acceptance letter|university offer|research position|phd position|phd studentship|research fellowship|research contract/i.test(raw)) result.hasUniversityOffer = true;

  // Monthly income
  const salaryMatch =
    raw.match(/(?:salary|income|compensation)[:\s]*(?:€|EUR)?\s*([\d,]+)\s*(?:€|EUR|per month|\/month|\bpm\b|p\.m\.)/i) ??
    raw.match(/(?:€|EUR)\s*([\d,]+)\s*(?:per month|\/month|\bpm\b|p\.m\.)/i);
  if (salaryMatch) {
    const amount = parseInt(salaryMatch[1].replace(/,/g, ''));
    if (amount >= 100 && amount <= 50000) result.monthlyIncome = amount;
  }

  return result;
}

const CV_FIELD_LABELS: Partial<Record<keyof UserProfile, string>> = {
  education: 'Education',
  field: 'Field',
  workExperience: 'Work Experience',
  languageLevels: 'Languages',
  hasJobOffer: 'Job Offer',
  hasUniversityOffer: 'University Offer',
  monthlyIncome: 'Monthly Income',
};
// ─────────────────────────────────────────────────────────────────────────────

// ── Language config per target country ───────────────────────────────────────
const LANGUAGE_CONFIG: Record<string, { code: string; label: string; hint?: string }[]> = {
  Germany: [{ code: 'de', label: 'German', hint: 'Required for job-seeker & some work visas' }],
  Netherlands: [{ code: 'nl', label: 'Dutch', hint: 'Helpful for integration; English widely accepted at work' }],
  Belgium: [
    { code: 'nl', label: 'Dutch (Flemish)', hint: 'Required in Flanders & Brussels (Flemish admin)' },
    { code: 'fr', label: 'French', hint: 'Required in Wallonia & Brussels (French admin)' },
    { code: 'de', label: 'German', hint: 'Required in the German-speaking community (East Belgium)' },
  ],
  Spain: [{ code: 'es', label: 'Spanish', hint: 'Helps integration; not formally required for most visas' }],
  France: [{ code: 'fr', label: 'French', hint: 'Required for talent passport pathways' }],
  Portugal: [{ code: 'pt', label: 'Portuguese', hint: 'Helpful for D3/D8 integration' }],
  Austria: [{ code: 'de', label: 'German', hint: 'Points-based Red-White-Red Card awards language points' }],
};

const CEFR_OPTIONS = ['None', 'A1 – Beginner', 'A2 – Elementary', 'B1 – Intermediate', 'B2 – Upper Intermediate', 'C1 – Advanced', 'C2 – Mastery'];
/** Strip the description suffix to store just "B2" etc. */
function cefrCode(opt: string) { return opt.split(' ')[0]; }
// ─────────────────────────────────────────────────────────────────────────────

// ── Target countries offered in the destination dropdown ─────────────────────
const TARGET_COUNTRIES = [
  'Germany', 'Netherlands', 'Belgium', 'Spain', 'France',
  'Portugal', 'Austria', 'Sweden', 'Denmark', 'Any / Unsure',
];
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, title: 'Background', desc: 'Where are you from?' },
  { id: 2, title: 'Education', desc: 'Your academic profile' },
  { id: 3, title: 'Work & Finances', desc: 'Experience and income' },
  { id: 4, title: 'Your Situation', desc: 'Current circumstances' },
];

function ProbabilityBar({ value, label }: { value: number; label: string }) {
  const color =
    value >= 70 ? 'from-emerald-500 to-green-500' :
    value >= 50 ? 'from-amber-500 to-yellow-500' :
    value >= 30 ? 'from-orange-500 to-amber-600' :
    'from-red-500 to-rose-600';

  const textColor =
    value >= 70 ? 'text-emerald-400' :
    value >= 50 ? 'text-amber-400' :
    value >= 30 ? 'text-orange-400' :
    'text-red-400';

  return (
    <div className="mb-1">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span className={`text-sm font-bold ${textColor}`}>{value}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ResultCard({ result, rank }: { result: EligibilityResult; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const { visa, probability, recommendation, missingRequirements, strengths, legalBasis } = result;

  const probColor =
    probability >= 70 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
    probability >= 50 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
    probability >= 30 ? 'text-orange-400 bg-orange-500/10 border-orange-500/30' :
    'text-red-400 bg-red-500/10 border-red-500/30';

  return (
    <div className={clsx('card transition-all duration-300', rank === 0 && 'border-blue-500/40 bg-blue-500/5')}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{visa.flag}</span>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-white font-semibold">{visa.name}</h3>
              {rank === 0 && (
                <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20">Best Match</span>
              )}
            </div>
            <p className="text-slate-400 text-sm">{visa.country} · {visa.type} · {visa.processingTime}</p>
          </div>
        </div>
        <div className={`badge border ${probColor} text-sm font-bold px-3 py-1.5`}>
          {probability}%
        </div>
      </div>

      <ProbabilityBar value={probability} label="Approval probability" />

      <p className="text-slate-300 text-sm mt-3 mb-4 leading-relaxed">{recommendation}</p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-400 text-sm font-medium flex items-center gap-1 hover:text-blue-300 transition-colors"
      >
        {expanded ? 'Hide details' : 'Show details'}
        <ChevronRight size={14} className={clsx('transition-transform', expanded && 'rotate-90')} />
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
          {strengths.length > 0 && (
            <div>
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">Your Strengths</p>
              {strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{s}</span>
                </div>
              ))}
            </div>
          )}
          {missingRequirements.length > 0 && (
            <div>
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">Missing / Needs Work</p>
              {missingRequirements.map((m, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <XCircle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{m}</span>
                </div>
              ))}
            </div>
          )}
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Key Requirements</p>
            {visa.requirements.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-start gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 flex-shrink-0" />
                <span className="text-slate-400 text-sm">{r}</span>
              </div>
            ))}
          </div>

          {legalBasis.length > 0 && (
            <div className="bg-blue-950/40 border border-blue-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Scale size={14} className="text-blue-400 flex-shrink-0" />
                <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider">Legal Basis &amp; EU Law Pathways</p>
              </div>
              <div className="space-y-3">
                {legalBasis.map((ref, i) => (
                  <div key={i} className="border-l-2 border-blue-600/40 pl-3">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <span className="text-blue-300 text-xs font-semibold leading-snug">{ref.label}</span>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-300 flex-shrink-0 transition-colors"
                        aria-label={`Open ${ref.label}`}
                      >
                        <ExternalLink size={11} />
                      </a>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{ref.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {getUpdatesForVisa(visa.id).length > 0 && (
            <div className="flex items-center gap-2 py-1">
              <span className="text-slate-500 text-xs">Law changes:</span>
              <LawUpdatesPill visaId={visa.id} />
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Link to="/comparison" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              Full comparison <ArrowRight size={13} />
            </Link>
            <Link to="/documents" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1">
              Generate documents <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EligibilityPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [results, setResults] = useState<EligibilityResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof UserProfile, value: string | number | boolean) => {
    setProfile((p) => ({ ...p, [key]: value }));
  };

  const [cvOpen, setCvOpen] = useState(false);
  const [cvText, setCvText] = useState('');
  const [cvDetected, setCvDetected] = useState<Partial<UserProfile> | null>(null);
  const [cvMode, setCvMode] = useState<'paste' | 'upload'>('paste');
  const [cvUploading, setCvUploading] = useState(false);
  const [cvFileName, setCvFileName] = useState('');

  const handleParseCV = () => {
    if (!cvText.trim()) return;
    setCvDetected(parseCV(cvText));
  };

  const handleApplyCV = () => {
    if (!cvDetected) return;
    setProfile(p => ({
      ...p,
      ...cvDetected,
      // Merge languageLevels rather than replace so manually-set values survive
      languageLevels: { ...p.languageLevels, ...(cvDetected.languageLevels ?? {}) },
    }));
    setCvOpen(false);
    setCvDetected(null);
    setCvText('');
    setCvFileName('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFileName(file.name);
    setCvDetected(null);
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      setCvUploading(true);
      try {
        const buf = await file.arrayBuffer();
        const text = await extractPdfText(buf);
        setCvText(text);
      } catch {
        setCvText('');
        alert('Could not extract text from this PDF. Try copy-pasting the text instead.');
      } finally {
        setCvUploading(false);
      }
    } else {
      // .txt or .tex — read as plain text, then strip LaTeX if needed
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (typeof evt.target?.result === 'string') {
          setCvText(ext === 'tex' ? stripLatex(evt.target.result) : evt.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const runCheck = () => {
    setLoading(true);
    // Simulate async calculation
    setTimeout(() => {
      const res = calculateEligibility(profile);
      setResults(res);
      setLoading(false);
    }, 1200);
  };

  const reset = () => {
    setResults(null);
    setStep(1);
    setProfile(defaultProfile);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Loader className="text-blue-400 animate-spin" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing your profile...</h2>
          <p className="text-slate-400">Calculating eligibility across 9 EU visa pathways</p>
        </div>
      </div>
    );
  }

  if (results) {
    const topThree = results.slice(0, 3);
    const rest = results.slice(3);

    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Your Results</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Eligibility Report</h1>
              <p className="text-slate-400 mt-1">Based on your profile — {profile.nationality || 'Unknown'} national, {profile.education || 'Unknown education'}</p>
            </div>
            <button onClick={reset} className="btn-secondary text-sm py-2">
              Start Over
            </button>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-8">
            <AlertTriangle size={15} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-400 text-xs leading-relaxed">
              Probability estimates are indicative only and based on general criteria. Legal references are provided for educational purposes — they do not constitute legal advice. Immigration outcomes depend on many factors. Always consult a qualified immigration lawyer.
            </p>
          </div>

          {/* Summary banner */}
          {topThree.length > 0 && topThree[0].probability >= 50 && (
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={20} className="text-emerald-400" />
                <h2 className="text-white font-semibold text-lg">Good news! You have strong options.</h2>
              </div>
              <p className="text-slate-300 text-sm">
                Your best match is <strong className="text-white">{topThree[0].visa.name}</strong> with a <strong className="text-emerald-400">{topThree[0].probability}%</strong> estimated probability.
              </p>
            </div>
          )}

          {/* Top 3 */}
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Shield size={16} className="text-blue-400" /> Top Recommendations
          </h2>
          <div className="space-y-4 mb-10">
            {topThree.map((result, i) => (
              <ResultCard key={result.visa.id} result={result} rank={i} />
            ))}
          </div>

          {/* Other options */}
          {rest.length > 0 && (
            <>
              <h2 className="text-slate-400 font-semibold text-sm uppercase tracking-wider mb-4">Other Pathways (Lower Probability)</h2>
              <div className="space-y-4">
                {rest.map((result, i) => (
                  <ResultCard key={result.visa.id} result={result} rank={i + 3} />
                ))}
              </div>
            </>
          )}

          {/* Next steps */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Generate Documents', path: '/documents', icon: '📄', desc: 'Create cover letters & templates' },
              { label: 'Compare Visas', path: '/comparison', icon: '⚖️', desc: 'Full side-by-side comparison' },
              { label: 'Estimate Costs', path: '/costs', icon: '💶', desc: 'Realistic budget breakdown' },
            ].map((item) => (
              <Link key={item.label} to={item.path} className="card-hover flex flex-col items-center text-center p-5">
                <span className="text-3xl mb-3">{item.icon}</span>
                <p className="text-white font-semibold text-sm mb-1">{item.label}</p>
                <p className="text-slate-400 text-xs">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={13} className="text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Free · No account needed</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Check Your Eligibility</h1>
          <p className="text-slate-400">Answer a few questions to see your best EU visa pathways with success probability estimates.</p>
        </div>

        {/* CV Auto-fill */}
        {!cvOpen ? (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setCvOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-sm"
            >
              <FileText size={14} /> Auto-fill from your CV
            </button>
          </div>
        ) : (
          <div className="card mb-8 border-blue-500/20 bg-blue-950/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-blue-400" />
                <h3 className="text-white font-semibold text-sm">Auto-fill from CV</h3>
              </div>
              <button
                onClick={() => { setCvOpen(false); setCvDetected(null); setCvText(''); }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <XCircle size={15} />
              </button>
            </div>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              Paste or upload your CV and we'll detect your education, field, experience, and language level to pre-fill the form. You can review and adjust everything before running the check.
            </p>

            {/* Mode tabs */}
            <div className="flex gap-1 mb-4 bg-slate-800/60 p-1 rounded-lg w-fit">
              {(['paste', 'upload'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setCvMode(m)}
                  className={clsx(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    cvMode === m ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white',
                  )}
                >
                  {m === 'paste' ? '📋 Paste text' : '📁 Upload .txt'}
                </button>
              ))}
            </div>

            {cvMode === 'paste' ? (
              <textarea
                className="input w-full h-40 text-xs font-mono resize-none mb-4"
                placeholder="Paste your CV / résumé text here…"
                value={cvText}
                onChange={e => { setCvText(e.target.value); setCvDetected(null); }}
              />
            ) : (
              <div className="mb-4">
                <label className="flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl cursor-pointer transition-colors bg-slate-800/30 hover:bg-blue-500/5">
                  {cvUploading ? (
                    <><Loader size={18} className="text-blue-400 animate-spin" /><span className="text-blue-400 text-xs">Extracting text from PDF…</span></>
                  ) : (
                    <><Upload size={18} className="text-slate-400" /><span className="text-slate-400 text-xs">Click to upload — .pdf, .tex, or .txt</span></>
                  )}
                  <input type="file" className="hidden" accept=".pdf,.tex,.txt" onChange={handleFileUpload} disabled={cvUploading} />
                </label>
                {cvFileName && !cvUploading && (
                  <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1">
                    <CheckCircle size={11} /> {cvFileName} loaded — {cvText.length.toLocaleString()} chars extracted
                  </p>
                )}
              </div>
            )}

            {/* Detection results */}
            {cvDetected && (
              <div className="bg-slate-800/40 rounded-xl p-4 mb-4">
                <p className="text-white text-xs font-semibold mb-3">
                  {Object.keys(cvDetected).length > 0
                    ? `✓ Detected ${Object.keys(cvDetected).length} field${Object.keys(cvDetected).length > 1 ? 's' : ''}`
                    : 'No fields detected — try adding more detail to your CV text'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* Non-language fields */}
                  {(Object.keys(CV_FIELD_LABELS) as (keyof UserProfile)[]).filter(k => k !== 'languageLevels').map(key => {
                    const detected = key in cvDetected;
                    const val = cvDetected[key as keyof typeof cvDetected];
                    return (
                      <span key={key} className={clsx('text-xs px-2.5 py-1 rounded-full border',
                        detected ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-slate-700/40 text-slate-500 border-slate-700')}>
                        {detected ? '✓ ' : ''}{CV_FIELD_LABELS[key]}
                        {detected && val !== true && val !== undefined && (
                          <span className="ml-1 opacity-70">{key === 'monthlyIncome' ? `€${val}` : key === 'workExperience' ? `${val} yrs` : String(val)}</span>
                        )}
                      </span>
                    );
                  })}
                  {/* Language levels */}
                  {cvDetected.languageLevels && Object.entries(cvDetected.languageLevels).map(([code, lvl]) => (
                    <span key={code} className="text-xs px-2.5 py-1 rounded-full border bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
                      ✓ {code.toUpperCase()} <span className="opacity-70">{lvl}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {!cvDetected ? (
                <button
                  onClick={handleParseCV}
                  disabled={!cvText.trim()}
                  className="btn-primary text-sm py-2 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Sparkles size={14} /> Parse CV
                </button>
              ) : Object.keys(cvDetected).length > 0 ? (
                <button onClick={handleApplyCV} className="btn-primary text-sm py-2 flex items-center gap-2">
                  <CheckCircle size={14} /> Apply to form ({Object.keys(cvDetected).length} field{Object.keys(cvDetected).length > 1 ? 's' : ''})
                </button>
              ) : (
                <button onClick={handleParseCV} className="btn-secondary text-sm py-2 flex items-center gap-2">
                  <Sparkles size={14} /> Try again
                </button>
              )}
              <button
                onClick={() => { setCvOpen(false); setCvDetected(null); setCvText(''); setCvFileName(''); }}
                className="btn-secondary text-sm py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={clsx(
                'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all flex-shrink-0',
                step > s.id ? 'bg-blue-600 text-white' :
                step === s.id ? 'bg-blue-600 text-white ring-4 ring-blue-600/20' :
                'bg-slate-800 text-slate-400 border border-slate-700'
              )}>
                {step > s.id ? <CheckCircle size={14} /> : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div className={clsx('flex-1 h-px transition-colors', step > s.id ? 'bg-blue-600' : 'bg-slate-700')} />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-white font-semibold mb-1">{STEPS[step - 1].title}</p>
        <p className="text-center text-slate-400 text-sm mb-8">{STEPS[step - 1].desc}</p>

        {/* Step content */}
        <div className="card">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="label">Your Nationality *</label>
                <select className="select" value={profile.nationality} onChange={e => update('nationality', e.target.value)}>
                  <option value="">Select your country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Preferred Destination Country</label>
                <select className="select" value={profile.targetCountry} onChange={e => update('targetCountry', e.target.value)}>
                  <option value="">Any / Not decided yet</option>
                  {TARGET_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <p className="text-slate-500 text-xs mt-1">Helps us tailor the language proficiency question</p>
              </div>
              <div>
                <label className="label">Current Location</label>
                <select className="select" value={profile.currentLocation} onChange={e => update('currentLocation', e.target.value)}>
                  <option value="">Where are you currently?</option>
                  <option value="home-country">My home country</option>
                  <option value="eu-legal">In EU (legal status)</option>
                  <option value="eu-student">In EU (student visa)</option>
                  <option value="eu-expired">In EU (expired/overstayed)</option>
                  <option value="uk">United Kingdom</option>
                  <option value="usa">United States</option>
                  <option value="canada">Canada</option>
                  <option value="other">Other country</option>
                </select>
                {profile.currentLocation === 'eu-expired' && (
                  <div className="flex items-start gap-2 mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-300 text-xs">Warning: Applying while overstaying is a critical risk. See our <Link to="/risks" className="underline">Risk Analyzer</Link> before proceeding.</p>
                  </div>
                )}
              </div>
              <div>
                <label className="label">Family Size (including yourself)</label>
                <input
                  type="number"
                  className="input"
                  min={1}
                  max={10}
                  value={profile.familySize}
                  onChange={e => update('familySize', parseInt(e.target.value))}
                />
              </div>
            </div>
          )}

          {step === 2 && (() => {
            // Determine which language(s) to ask about based on target country
            const target = profile.targetCountry;
            const langCfg = target && LANGUAGE_CONFIG[target] ? LANGUAGE_CONFIG[target] : LANGUAGE_CONFIG['Germany'];
            const showGenericNote = !target || target === 'Any / Unsure';
            return (
              <div className="space-y-5">
                <div>
                  <label className="label">Highest Education Level *</label>
                  <select className="select" value={profile.education} onChange={e => update('education', e.target.value)}>
                    <option value="">Select education level</option>
                    {EDUCATION_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Field of Study / Work *</label>
                  <select className="select" value={profile.field} onChange={e => update('field', e.target.value)}>
                    <option value="">Select your field</option>
                    {RESEARCH_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                {/* Dynamic language fields */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <p className="label mb-0">Language Proficiency</p>
                    {showGenericNote && <span className="text-slate-500 text-xs">(showing all EU languages)</span>}
                  </div>
                  {langCfg.map(({ code, label, hint }) => {
                    const stored = profile.languageLevels[code] ??
                      (code === 'de' ? profile.languageLevel : 'None');
                    const displayVal = CEFR_OPTIONS.find(o => o.startsWith(stored)) ?? 'None';
                    return (
                      <div key={code}>
                        <label className="label text-sm font-normal text-slate-300">{label}</label>
                        <select
                          className="select"
                          value={displayVal}
                          onChange={e => {
                            const code_val = cefrCode(e.target.value);
                            setProfile(p => ({
                              ...p,
                              languageLevels: { ...p.languageLevels, [code]: code_val },
                              // keep legacy field in sync for DE
                              ...(code === 'de' ? { languageLevel: code_val } : {}),
                            }));
                          }}
                        >
                          {CEFR_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        {hint && <p className="text-slate-500 text-xs mt-1">{hint}</p>}
                      </div>
                    );
                  })}
                  {showGenericNote && (
                    // Show all four languages when no destination chosen
                    Object.entries(LANGUAGE_CONFIG).filter(([c]) => !langCfg.find(l => l.code === Object.values(LANGUAGE_CONFIG[c]).map(x=>x.code).join())).length === 0
                      ? null
                      : (
                        <p className="text-slate-500 text-xs">
                          Select a destination country in Step 1 to see only the relevant language field(s).
                        </p>
                      )
                  )}
                </div>
              </div>
            );
          })()}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="label">Years of Work Experience</label>
                <input
                  type="number"
                  className="input"
                  min={0}
                  max={40}
                  placeholder="0"
                  value={profile.workExperience ?? ''}
                  onChange={e => update('workExperience', e.target.value === '' ? 0 : parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="label">Monthly Income / Budget (€)</label>
                <input
                  type="number"
                  className="input"
                  min={0}
                  placeholder="e.g. 2000"
                  value={profile.monthlyIncome ?? ''}
                  onChange={e => update('monthlyIncome', e.target.value === '' ? 0 : parseInt(e.target.value))}
                />
                <p className="text-slate-500 text-xs mt-1">Include salary, savings you can show, or family support</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">I have a job offer from a European employer</p>
                    <p className="text-slate-400 text-xs mt-0.5">Required for Blue Card, HSM, and some work permits</p>
                  </div>
                  <button
                    onClick={() => update('hasJobOffer', !profile.hasJobOffer)}
                    className={clsx(
                      'relative w-12 h-6 rounded-full transition-colors flex-shrink-0',
                      profile.hasJobOffer ? 'bg-blue-600' : 'bg-slate-600'
                    )}
                  >
                    <div className={clsx(
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm',
                      profile.hasJobOffer ? 'translate-x-7' : 'translate-x-1'
                    )} />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">I have a university / research institution offer</p>
                    <p className="text-slate-400 text-xs mt-0.5">Required for researcher visas and student visas</p>
                  </div>
                  <button
                    onClick={() => update('hasUniversityOffer', !profile.hasUniversityOffer)}
                    className={clsx(
                      'relative w-12 h-6 rounded-full transition-colors flex-shrink-0',
                      profile.hasUniversityOffer ? 'bg-blue-600' : 'bg-slate-600'
                    )}
                  >
                    <div className={clsx(
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm',
                      profile.hasUniversityOffer ? 'translate-x-7' : 'translate-x-1'
                    )} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep(s => Math.min(4, s + 1))}
              disabled={step === 1 && !profile.nationality}
              className="flex items-center gap-2 btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={runCheck}
              disabled={!profile.nationality || !profile.education}
              className="flex items-center gap-2 btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles size={16} /> Check Eligibility
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
