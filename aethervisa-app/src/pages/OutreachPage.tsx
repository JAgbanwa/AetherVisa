import { useState } from 'react';
import { UNIVERSITIES } from '../data';
import type { University, OutreachEntry } from '../types';
import { Search, Mail, Star, ExternalLink, Plus, Trash2, Check, X } from 'lucide-react';
import clsx from 'clsx';

const COUNTRIES_FILTER = ['All', 'Spain', 'Germany', 'Netherlands', 'Italy', 'Belgium', 'Portugal'];

function generateEmail(uni: University, userField: string): string {
  return `Subject: Visiting Researcher Inquiry — ${userField}

Dear Professor [Name],

My name is [Your Name], and I am writing to inquire about the possibility of visiting your research group at ${uni.name}.

I am a researcher in ${userField} with [X years] of experience and [key achievements]. I have been following your work on [specific topic], which closely aligns with my research on [your specific work].

I would be visiting for [duration] and am funded through [funding source]. For my visa application as a researcher under EU Directive 2016/801, I would need a hosting agreement from ${uni.name} — I understand this is a significant commitment and would be happy to discuss everything before making a formal request.

Please find attached my CV and a brief research proposal. I would be grateful for the opportunity to speak with you.

With kind regards,
[Your Full Name]
[Email] | [LinkedIn] | [ORCID]`;
}

export default function OutreachPage() {
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [userField, setUserField] = useState('Computational Biology');
  const [tracker, setTracker] = useState<OutreachEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ universityName: '', professorName: '', department: '', notes: '' });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = UNIVERSITIES.filter(u => {
    if (countryFilter !== 'All' && u.country !== countryFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCopyEmail = (uni: University) => {
    const email = generateEmail(uni, userField);
    navigator.clipboard.writeText(email);
    setCopiedId(uni.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addToTracker = (status: OutreachEntry['status'] = 'sent') => {
    const entry: OutreachEntry = {
      id: Date.now().toString(),
      universityName: newEntry.universityName,
      professorName: newEntry.professorName,
      department: newEntry.department,
      emailSent: new Date().toISOString().split('T')[0],
      status,
      notes: newEntry.notes,
    };
    setTracker(prev => [entry, ...prev]);
    setNewEntry({ universityName: '', professorName: '', department: '', notes: '' });
    setShowAddForm(false);
  };

  const updateStatus = (id: string, status: OutreachEntry['status']) => {
    setTracker(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const statusStyles: Record<OutreachEntry['status'], string> = {
    sent: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    replied: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    'no-response': 'bg-slate-600/20 text-slate-400 border-slate-600/20',
    positive: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    negative: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">University Outreach Tool</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Find international-friendly universities and professors, generate personalized outreach emails, and track your applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* University list */}
          <div className="lg:col-span-3">
            {/* Search & Filters */}
            <div className="space-y-3 mb-6">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Search universities or cities..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {COUNTRIES_FILTER.map(c => (
                  <button
                    key={c}
                    onClick={() => setCountryFilter(c)}
                    className={clsx(
                      'px-3 py-1.5 rounded-lg text-xs border transition-colors',
                      countryFilter === c ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3 text-slate-500 text-sm">{filtered.length} universities found</div>

            <div className="space-y-4">
              {filtered.map(uni => (
                <div
                  key={uni.id}
                  className={clsx(
                    'card cursor-pointer transition-all',
                    selectedUni?.id === uni.id ? 'border-blue-500/40 bg-blue-500/5' : 'hover:border-slate-600'
                  )}
                  onClick={() => setSelectedUni(selectedUni?.id === uni.id ? null : uni)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-0.5">{uni.flag}</span>
                      <div>
                        <h3 className="text-white font-semibold">{uni.name}</h3>
                        <p className="text-slate-400 text-sm">{uni.city}, {uni.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star size={13} className="text-amber-400 fill-amber-400" />
                      <span className="text-white font-semibold text-sm">{uni.friendlinessScore}</span>
                      <span className="text-slate-500 text-xs">/100</span>
                    </div>
                  </div>

                  <p className="text-slate-400 text-sm leading-relaxed mb-3">{uni.notes}</p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {uni.departments.slice(0, 4).map(d => (
                      <span key={d} className="badge bg-slate-700/50 text-slate-300 text-xs">{d}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopyEmail(uni); }}
                      className={clsx(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                        copiedId === uni.id
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20'
                      )}
                    >
                      {copiedId === uni.id ? <><Check size={12} /> Copied!</> : <><Mail size={12} /> Copy Email</>}
                    </button>
                    <a
                      href={uni.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <ExternalLink size={12} /> Visit Website
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewEntry(n => ({ ...n, universityName: uni.name }));
                        setShowAddForm(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <Plus size={12} /> Track
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email preview + tracker */}
          <div className="lg:col-span-2 space-y-6">
            {/* Email preview */}
            <div className="card">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Mail size={15} className="text-blue-400" /> Email Template
              </h3>
              <div className="mb-3">
                <label className="label text-xs">Your Field (personalize emails)</label>
                <input
                  type="text"
                  className="input text-sm py-2"
                  value={userField}
                  onChange={e => setUserField(e.target.value)}
                />
              </div>
              {selectedUni ? (
                <>
                  <p className="text-slate-400 text-xs mb-3">Preview for: <strong className="text-slate-300">{selectedUni.name}</strong></p>
                  <pre className="bg-slate-900 rounded-xl p-4 text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-mono overflow-auto max-h-80">
                    {generateEmail(selectedUni, userField)}
                  </pre>
                  <button
                    onClick={() => handleCopyEmail(selectedUni)}
                    className="w-full mt-3 btn-primary text-sm py-2 flex items-center justify-center gap-2"
                  >
                    {copiedId === selectedUni.id ? <><Check size={14} /> Copied!</> : <><Mail size={14} /> Copy Email</>}
                  </button>
                </>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  Click a university to preview the email template
                </div>
              )}
            </div>

            {/* Outreach tracker */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  Outreach Tracker
                  {tracker.length > 0 && <span className="badge bg-blue-500/10 text-blue-400">{tracker.length}</span>}
                </h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              {showAddForm && (
                <div className="bg-slate-900/60 rounded-xl border border-slate-700 p-4 mb-4 space-y-3">
                  <input className="input text-sm py-2" placeholder="University name" value={newEntry.universityName} onChange={e => setNewEntry(n => ({ ...n, universityName: e.target.value }))} />
                  <input className="input text-sm py-2" placeholder="Professor name" value={newEntry.professorName} onChange={e => setNewEntry(n => ({ ...n, professorName: e.target.value }))} />
                  <input className="input text-sm py-2" placeholder="Department" value={newEntry.department} onChange={e => setNewEntry(n => ({ ...n, department: e.target.value }))} />
                  <textarea className="input text-sm py-2 resize-none h-16" placeholder="Notes" value={newEntry.notes} onChange={e => setNewEntry(n => ({ ...n, notes: e.target.value }))} />
                  <div className="flex gap-2">
                    <button onClick={() => addToTracker('sent')} className="btn-primary text-xs py-1.5 flex-1">Add Entry</button>
                    <button onClick={() => setShowAddForm(false)} className="btn-secondary text-xs py-1.5"><X size={13} /></button>
                  </div>
                </div>
              )}

              {tracker.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">No entries yet. Add universities you've contacted.</p>
              ) : (
                <div className="space-y-3">
                  {tracker.map(entry => (
                    <div key={entry.id} className="bg-slate-900/50 rounded-xl border border-slate-700 p-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="text-white font-medium text-sm">{entry.professorName || 'Professor'}</p>
                          <p className="text-slate-400 text-xs">{entry.universityName}</p>
                        </div>
                        <select
                          value={entry.status}
                          onChange={e => updateStatus(entry.id, e.target.value as OutreachEntry['status'])}
                          className={clsx('badge border text-xs bg-transparent cursor-pointer', statusStyles[entry.status])}
                        >
                          <option value="sent">Sent</option>
                          <option value="replied">Replied</option>
                          <option value="no-response">No Response</option>
                          <option value="positive">Positive</option>
                          <option value="negative">Negative</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">{entry.emailSent}</span>
                        <button onClick={() => setTracker(prev => prev.filter(e => e.id !== entry.id))} className="text-slate-600 hover:text-red-400 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
