import { useState } from 'react';
import { VISA_OPTIONS } from '../data';
import type { VisaOption } from '../types';
import { CheckCircle, XCircle, Filter, Clock, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const countryFilters = ['All', 'Spain', 'Germany', 'Netherlands', 'Italy', 'Belgium', 'Portugal'];
const typeFilters = ['All', 'Researcher', 'Student', 'Skilled Worker', 'Job Seeker', 'Talent'];

function DifficultyBadge({ level }: { level: VisaOption['difficulty'] }) {
  const styles = {
    Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Moderate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Hard: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'Very Hard': 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`badge border ${styles[level]}`}>{level}</span>
  );
}

function VisaCard({ visa, onSelect, selected }: { visa: VisaOption; onSelect: (v: VisaOption) => void; selected: boolean }) {
  return (
    <div
      onClick={() => onSelect(visa)}
      className={clsx(
        'card cursor-pointer transition-all duration-200',
        selected
          ? 'border-blue-500/60 bg-blue-500/5 ring-1 ring-blue-500/20'
          : 'hover:border-slate-600'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{visa.flag}</span>
          <div>
            <h3 className="text-white font-semibold text-sm leading-tight">{visa.name}</h3>
            <p className="text-slate-400 text-xs">{visa.country}</p>
          </div>
        </div>
        <DifficultyBadge level={visa.difficulty} />
      </div>
      <p className="text-slate-400 text-xs leading-relaxed mb-3">{visa.description.slice(0, 100)}...</p>
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1"><Clock size={11} /> {visa.processingTime}</span>
        <span className="flex items-center gap-1"><DollarSign size={11} /> €{visa.cost}</span>
      </div>
      {selected && (
        <div className="mt-3 flex items-center gap-1.5 text-blue-400 text-xs font-medium">
          <CheckCircle size={12} /> Selected for comparison
        </div>
      )}
    </div>
  );
}

function ComparisonRow({ label, values }: { label: string; values: React.ReactNode[] }) {
  return (
    <tr className="border-t border-slate-800">
      <td className="py-3 px-4 text-slate-400 text-sm font-medium whitespace-nowrap">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="py-3 px-4 text-slate-200 text-sm">{v}</td>
      ))}
    </tr>
  );
}

export default function ComparisonPage() {
  const [countryFilter, setCountryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selected, setSelected] = useState<VisaOption[]>([]);
  const [mode, setMode] = useState<'browse' | 'compare'>('browse');

  const filtered = VISA_OPTIONS.filter(v => {
    if (countryFilter !== 'All' && v.country !== countryFilter) return false;
    if (typeFilter !== 'All' && v.type !== typeFilter) return false;
    return true;
  });

  const toggleSelect = (visa: VisaOption) => {
    setSelected(prev => {
      if (prev.find(v => v.id === visa.id)) {
        return prev.filter(v => v.id !== visa.id);
      }
      if (prev.length >= 4) return prev;
      return [...prev, visa];
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Visa Pathway Comparison</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Browse all {VISA_OPTIONS.length} EU visa pathways and compare them side by side. Select up to 4 visas to compare.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex bg-slate-800 border border-slate-700 rounded-xl p-1">
            {(['browse', 'compare'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize',
                  mode === m ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                )}
              >
                {m} {m === 'compare' && selected.length > 0 && `(${selected.length})`}
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <button onClick={() => setSelected([])} className="text-slate-400 hover:text-white text-sm transition-colors">
              Clear selection
            </button>
          )}
        </div>

        {mode === 'browse' && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <span className="text-slate-400 text-sm">Country:</span>
              </div>
              {countryFilters.map(f => (
                <button
                  key={f}
                  onClick={() => setCountryFilter(f)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-sm transition-colors border',
                    countryFilter === f
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <span className="text-slate-400 text-sm">Type:</span>
              </div>
              {typeFilters.map(f => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-sm transition-colors border',
                    typeFilter === f
                      ? 'bg-violet-600 border-violet-600 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            <p className="text-slate-500 text-sm mb-5">{filtered.length} visa{filtered.length !== 1 && 's'} shown · Select up to 4 to compare</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(visa => (
                <VisaCard
                  key={visa.id}
                  visa={visa}
                  onSelect={toggleSelect}
                  selected={!!selected.find(v => v.id === visa.id)}
                />
              ))}
            </div>

            {selected.length >= 2 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
                <button
                  onClick={() => setMode('compare')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-2xl shadow-blue-900/40 transition-colors"
                >
                  Compare {selected.length} visas <ArrowRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

        {mode === 'compare' && (
          <>
            {selected.length < 2 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 text-lg mb-4">Select at least 2 visas to compare</p>
                <button onClick={() => setMode('browse')} className="btn-primary">Browse Visas</button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left text-slate-400 text-sm font-medium w-40">Feature</th>
                      {selected.map(v => (
                        <th key={v.id} className="py-3 px-4 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{v.flag}</span>
                            <div>
                              <p className="text-white font-semibold text-sm">{v.name}</p>
                              <p className="text-slate-400 text-xs">{v.country}</p>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <ComparisonRow label="Type" values={selected.map(v => <span className="badge bg-slate-700/50 text-slate-300">{v.type}</span>)} />
                    <ComparisonRow label="Difficulty" values={selected.map(v => <DifficultyBadge level={v.difficulty} />)} />
                    <ComparisonRow label="Processing Time" values={selected.map(v => (
                      <span className="flex items-center gap-1 text-slate-200"><Clock size={13} className="text-blue-400" />{v.processingTime}</span>
                    ))} />
                    <ComparisonRow label="Visa Fee" values={selected.map(v => (
                      <span className="flex items-center gap-1 text-slate-200"><DollarSign size={13} className="text-emerald-400" />€{v.cost}</span>
                    ))} />
                    <ComparisonRow label="Min. Salary" values={selected.map(v =>
                      v.minSalary ? `€${v.minSalary.toLocaleString()}/month` : <span className="text-slate-500">Not specified</span>
                    )} />
                    <ComparisonRow label="For" values={selected.map(v => (
                      <div className="flex flex-wrap gap-1">
                        {v.targetGroup.map(g => <span key={g} className="badge bg-slate-700 text-slate-300 text-xs">{g}</span>)}
                      </div>
                    ))} />
                    <tr className="border-t border-slate-800">
                      <td className="py-3 px-4 text-slate-400 text-sm font-medium align-top">Pros</td>
                      {selected.map(v => (
                        <td key={v.id} className="py-3 px-4 align-top">
                          {v.pros.slice(0, 3).map((p, i) => (
                            <div key={i} className="flex items-start gap-1.5 mb-1.5">
                              <CheckCircle size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span className="text-slate-300 text-xs">{p}</span>
                            </div>
                          ))}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-800">
                      <td className="py-3 px-4 text-slate-400 text-sm font-medium align-top">Cons</td>
                      {selected.map(v => (
                        <td key={v.id} className="py-3 px-4 align-top">
                          {v.cons.slice(0, 3).map((c, i) => (
                            <div key={i} className="flex items-start gap-1.5 mb-1.5">
                              <XCircle size={12} className="text-rose-400 mt-0.5 flex-shrink-0" />
                              <span className="text-slate-300 text-xs">{c}</span>
                            </div>
                          ))}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-800">
                      <td className="py-3 px-4 text-slate-400 text-sm font-medium">Best For</td>
                      {selected.map(v => (
                        <td key={v.id} className="py-3 px-4 text-slate-300 text-sm">{v.targetGroup.join(', ')}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>

                <div className="mt-8 flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                  <AlertTriangle size={15} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-400 text-xs">
                    Visa requirements and fees change frequently. Always verify information directly with the relevant embassy or immigration authority. This comparison is for guidance only.
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <button onClick={() => setMode('browse')} className="btn-secondary">
                    ← Modify Selection
                  </button>
                  <Link to="/eligibility" className="btn-primary flex items-center gap-2">
                    Check My Eligibility <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
