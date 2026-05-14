import { useState } from 'react';
import { DollarSign, Clock, Zap, Shield, TrendingDown, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface CostItem {
  label: string;
  amount: number;
  note?: string;
  optional?: boolean;
}

interface Pathway {
  id: string;
  name: string;
  country: string;
  flag: string;
  processingWeeks: number;
  items: CostItem[];
  notes: string[];
  timeline: { phase: string; duration: string; desc: string }[];
}

const PATHWAYS: Pathway[] = [
  {
    id: 'spain-researcher',
    name: 'Spain Researcher Visa',
    country: 'Spain',
    flag: '🇪🇸',
    processingWeeks: 4,
    items: [
      { label: 'Visa fee', amount: 190 },
      { label: 'Criminal record apostille', amount: 60 },
      { label: 'Degree apostille + translation', amount: 150 },
      { label: 'Document certified translations', amount: 200 },
      { label: 'Health insurance (1 year)', amount: 400 },
      { label: 'TIE biometric card fee', amount: 16 },
      { label: 'Consulate appointment costs (travel)', amount: 100 },
      { label: 'Flight to Spain', amount: 400, note: 'Variable', optional: true },
      { label: 'First month rent (deposit + month)', amount: 1400, note: 'Madrid avg. €700/month' },
      { label: 'Registration / empadronamiento fee', amount: 0 },
      { label: 'Legal assistance (optional)', amount: 500, optional: true },
    ],
    notes: [
      'Spain is one of the cheaper EU destinations for researchers',
      'Processing time at consulates varies greatly by country (2–12 weeks)',
      'Monthly living costs: €1,200–€2,000 (Madrid/Barcelona); €800–€1,400 (smaller cities)',
      'You need at least €6,000–€8,000 in savings before starting the process',
    ],
    timeline: [
      { phase: 'Preparation', duration: '4–8 weeks', desc: 'Get hosting agreement, apostilles, translations, health insurance' },
      { phase: 'Consulate application', duration: '2–8 weeks', desc: 'Book appointment, submit application, wait for decision' },
      { phase: 'Enter Spain & register', duration: '1–2 weeks', desc: 'Empadronamiento, bank account, TIE appointment booking' },
      { phase: 'TIE collection', duration: '4–8 weeks', desc: 'Waiting period after TIE appointment (varies by region)' },
    ],
  },
  {
    id: 'germany-job-seeker',
    name: 'Germany Job Seeker Visa',
    country: 'Germany',
    flag: '🇩🇪',
    processingWeeks: 8,
    items: [
      { label: 'Visa fee', amount: 75 },
      { label: 'Degree recognition evaluation (anabin/KMK)', amount: 200, note: 'Required for some degrees' },
      { label: 'Document translations (certified)', amount: 300 },
      { label: 'Health insurance (6 months travel)', amount: 300 },
      { label: 'Language test (TestDaF/Goethe B1)', amount: 230, optional: true },
      { label: 'Flight to Germany', amount: 500, optional: true },
      { label: 'First month rent + deposit (Munich)', amount: 3000, note: 'Avg. €1,500/month in Munich' },
      { label: 'First month rent + deposit (Berlin)', amount: 2400, note: 'Avg. €1,200/month in Berlin' },
      { label: 'Blocked account requirement', amount: 6162, note: '€1,027/month × 6 months (returnable)' },
    ],
    notes: [
      'The blocked account requirement (Sperrkonto) is €1,027/month for 6 months',
      'Degree recognition can be complicated for non-EU degrees — budget extra time',
      'German language B1 is recommended even for English-speaking jobs',
      'Munich is significantly more expensive than Berlin or Hamburg',
      'Total initial budget needed: €10,000–€15,000',
    ],
    timeline: [
      { phase: 'Degree recognition', duration: '4–12 weeks', desc: 'Submit to anabin/KMK, get evaluation letter' },
      { phase: 'Preparation', duration: '3–6 weeks', desc: 'Translations, blocked account setup, health insurance' },
      { phase: 'Consulate application', duration: '4–12 weeks', desc: 'Book appointment, submit docs, wait for decision' },
      { phase: 'Job search in Germany', duration: 'Up to 6 months', desc: 'Actively looking for work, attending interviews' },
      { phase: 'Work permit conversion', duration: '4–8 weeks', desc: 'Convert to work visa once employed' },
    ],
  },
  {
    id: 'netherlands-hsm',
    name: 'Netherlands Highly Skilled Migrant',
    country: 'Netherlands',
    flag: '🇳🇱',
    processingWeeks: 3,
    items: [
      { label: 'IND application fee', amount: 345 },
      { label: 'MVV entry visa (if required)', amount: 192, optional: true },
      { label: 'Document translations', amount: 200 },
      { label: 'Health insurance (first year)', amount: 1600, note: 'Dutch health insurance is mandatory ~€130/month' },
      { label: 'DigiD registration', amount: 0 },
      { label: 'First month rent + deposit (Amsterdam)', amount: 4500, note: 'Avg. €1,500–€2,500/month' },
      { label: 'Legal/relocation assistance (optional)', amount: 800, optional: true },
    ],
    notes: [
      'Processing is fastest of all EU countries (2–4 weeks via recognized sponsor)',
      'Must have a job offer BEFORE applying — this is the hardest step',
      'Dutch health insurance is mandatory and relatively expensive (€130–160/month)',
      'Amsterdam is one of the most expensive cities in Europe',
      'Salary threshold ensures you can afford living costs',
      'Path to permanent residency after 5 years',
    ],
    timeline: [
      { phase: 'Job search & offer', duration: 'Variable (months)', desc: 'Most time is spent finding a sponsoring employer' },
      { phase: 'IND application', duration: '2–4 weeks', desc: 'Employer submits application on your behalf' },
      { phase: 'Entry & registration', duration: '1–2 weeks', desc: 'Municipal registration (BRP), BSN number' },
      { phase: 'Health insurance', duration: '1 week', desc: 'Mandatory within 4 months of arrival' },
    ],
  },
  {
    id: 'portugal-d3',
    name: 'Portugal D3 Visa',
    country: 'Portugal',
    flag: '🇵🇹',
    processingWeeks: 4,
    items: [
      { label: 'Visa fee', amount: 83 },
      { label: 'Document apostilles', amount: 100 },
      { label: 'Certified translations', amount: 150 },
      { label: 'Health insurance', amount: 300 },
      { label: 'AIMA permit fee', amount: 83 },
      { label: 'First month rent + deposit (Lisbon)', amount: 2400, note: 'Avg. €800–1200/month' },
      { label: 'NIF (tax number) fee', amount: 10 },
    ],
    notes: [
      'Portugal has the lowest overall costs of these pathways',
      'AIMA (successor to SEF) processing can be slow (6–12 months for residence permit)',
      'Lower salaries than Northern Europe but much lower cost of living',
      'Strong startup and tech community in Lisbon',
      'Monthly living costs: €1,000–€1,800 in Lisbon; €700–€1,200 elsewhere',
    ],
    timeline: [
      { phase: 'Preparation', duration: '3–6 weeks', desc: 'Apostilles, translations, health insurance, documents' },
      { phase: 'Consulate application', duration: '2–8 weeks', desc: 'Long-stay D3 visa application' },
      { phase: 'Enter Portugal & register', duration: '1–2 weeks', desc: 'NIF registration, bank account, address registration' },
      { phase: 'AIMA residence permit', duration: '6–18 months', desc: 'Submit for residence permit — significant backlog currently' },
    ],
  },
];

function CostBar({ amount, maxAmount }: { amount: number; maxAmount: number }) {
  const pct = Math.min(100, (amount / maxAmount) * 100);
  return (
    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden mt-1">
      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function CostsPage() {
  const [selected, setSelected] = useState<string>('spain-researcher');
  const [includeOptional, setIncludeOptional] = useState(false);
  const [mode, setMode] = useState<'cheapest' | 'fastest' | 'safest'>('cheapest');

  const pathway = PATHWAYS.find(p => p.id === selected)!;
  const items = pathway.items.filter(i => includeOptional || !i.optional);
  const total = items.reduce((s, i) => s + i.amount, 0);
  const maxItem = Math.max(...items.map(i => i.amount));

  const comparisons = [
    { id: 'cheapest', label: 'Cheapest', icon: TrendingDown, visas: ['portugal-d3', 'spain-researcher', 'germany-job-seeker'], color: 'emerald' },
    { id: 'fastest', label: 'Fastest', icon: Zap, visas: ['netherlands-hsm', 'spain-researcher', 'portugal-d3'], color: 'blue' },
    { id: 'safest', label: 'Safest (Lowest Rejection Risk)', icon: Shield, visas: ['spain-researcher', 'portugal-d3', 'germany-job-seeker'], color: 'violet' },
  ] as const;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Cost & Timeline Estimator</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Get a realistic breakdown of all costs and timelines for each EU visa pathway — no surprises.
          </p>
        </div>

        {/* Comparison mode */}
        <div className="card mb-10">
          <h2 className="text-white font-semibold mb-4">Quick Comparison</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {comparisons.map(c => (
              <button
                key={c.id}
                onClick={() => setMode(c.id)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                  mode === c.id
                    ? `bg-${c.color}-600 border-${c.color}-600 text-white`
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                )}
              >
                <c.icon size={14} />
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {comparisons.find(c => c.id === mode)!.visas.map((vid, rank) => {
              const pw = PATHWAYS.find(p => p.id === vid);
              if (!pw) return null;
              const visaTotal = pw.items.reduce((s, i) => s + i.amount, 0);
              return (
                <div key={vid} className="bg-slate-900/60 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{pw.flag}</span>
                    <div>
                      <p className="text-white font-medium text-sm">{pw.name}</p>
                      <p className="text-slate-400 text-xs">{pw.country}</p>
                    </div>
                    <span className={clsx('ml-auto badge', rank === 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-700 text-slate-400')}>
                      #{rank + 1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs">Est. initial costs</p>
                      <p className="text-white font-bold text-lg">€{visaTotal.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs">Processing</p>
                      <p className="text-white font-semibold">{pw.processingWeeks}w</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pathway selector */}
          <div>
            <h2 className="text-white font-semibold mb-4">Select Pathway</h2>
            <div className="space-y-3">
              {PATHWAYS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={clsx(
                    'w-full text-left p-4 rounded-xl border transition-all',
                    selected === p.id
                      ? 'bg-blue-500/10 border-blue-500/40'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{p.flag}</span>
                    <span className="text-white font-medium text-sm">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3 ml-8 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock size={11} /> ~{p.processingWeeks}w</span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={11} />€{p.items.reduce((s, i) => s + i.amount, 0).toLocaleString()}+
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">
                {pathway.flag} {pathway.name} — Detailed Costs
              </h2>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-slate-400 text-sm">Include optional</span>
                <div
                  onClick={() => setIncludeOptional(!includeOptional)}
                  className={clsx(
                    'relative w-10 h-5 rounded-full transition-colors cursor-pointer',
                    includeOptional ? 'bg-blue-600' : 'bg-slate-600'
                  )}
                >
                  <div className={clsx(
                    'absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm',
                    includeOptional ? 'translate-x-5' : 'translate-x-0.5'
                  )} />
                </div>
              </label>
            </div>

            <div className="card mb-6">
              {items.map((item) => (
                <div key={item.label} className="mb-4 last:mb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-slate-300 text-sm">{item.label}</span>
                      {item.optional && <span className="ml-1 text-slate-500 text-xs">(optional)</span>}
                      {item.note && <p className="text-slate-500 text-xs">{item.note}</p>}
                    </div>
                    <span className="text-white font-semibold text-sm flex-shrink-0">
                      {item.amount === 0 ? 'Free' : `€${item.amount.toLocaleString()}`}
                    </span>
                  </div>
                  {item.amount > 0 && <CostBar amount={item.amount} maxAmount={maxItem} />}
                </div>
              ))}
              <div className="border-t border-slate-700 mt-4 pt-4 flex items-center justify-between">
                <span className="text-white font-semibold">Estimated Total (first year setup)</span>
                <span className="text-2xl font-bold text-white">€{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Timeline */}
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Clock size={16} className="text-blue-400" /> Expected Timeline
            </h3>
            <div className="space-y-3 mb-6">
              {pathway.timeline.map((phase, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    {i < pathway.timeline.length - 1 && <div className="w-px flex-1 bg-slate-700 mt-1 mb-1 min-h-4" />}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white font-medium text-sm">{phase.phase}</span>
                      <span className="badge bg-slate-700 text-slate-300 text-xs">{phase.duration}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{phase.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-5">
              <h4 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-400" /> Important Notes
              </h4>
              <ul className="space-y-2">
                {pathway.notes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 flex-shrink-0" />
                    <span className="text-slate-400 text-sm">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
