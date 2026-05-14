import { useState } from 'react';
import { FileText, Copy, CheckCircle, Download, ChevronDown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  premium: boolean;
  fields: { key: string; label: string; placeholder: string; multiline?: boolean }[];
  template: (values: Record<string, string>) => string;
}

const TEMPLATES: Template[] = [
  {
    id: 'cover-letter-researcher',
    name: 'Researcher Visa Cover Letter',
    description: 'Cover letter for Spain / Belgium researcher visa application',
    category: 'Visa Application',
    premium: false,
    fields: [
      { key: 'fullName', label: 'Your Full Name', placeholder: 'e.g. John Doe' },
      { key: 'nationality', label: 'Nationality', placeholder: 'e.g. Nigerian' },
      { key: 'institution', label: 'Host Institution', placeholder: 'e.g. Universidad Autónoma de Madrid' },
      { key: 'supervisor', label: 'Supervisor Name', placeholder: 'e.g. Prof. María García' },
      { key: 'field', label: 'Research Field', placeholder: 'e.g. Computational Biology' },
      { key: 'duration', label: 'Planned Duration', placeholder: 'e.g. 24 months' },
      { key: 'startDate', label: 'Intended Start Date', placeholder: 'e.g. September 2026' },
    ],
    template: (v) => `[Your Address]
[City, Country]
[Date]

The Consul General
Spanish Consulate / Embassy
[City, Country]

RE: Application for Research Visa (Visado de Investigación)

Dear Sir/Madam,

I am writing to apply for a Research Visa to conduct research at ${v.institution || '[Host Institution]'} in Spain. My name is ${v.fullName || '[Your Name]'}, a ${v.nationality || '[Nationality]'} national, and I am a researcher in the field of ${v.field || '[Research Field]'}.

I have been invited by ${v.supervisor || '[Supervisor Name]'} at ${v.institution || '[Host Institution]'} to undertake a research project in ${v.field || '[Research Field]'} for a period of ${v.duration || '[Duration]'}, commencing ${v.startDate || '[Start Date]'}.

The purpose of my research visit is to [briefly describe your research objectives and why this institution is ideal]. This research is funded through [funding source: institutional grant / personal funds / scholarship].

I confirm that I fulfill all conditions for the research visa under Directive 2016/801/EU:
• I hold a signed Hosting Agreement from ${v.institution || '[Host Institution]'}
• I have adequate financial resources to support myself during my stay
• I hold valid health insurance for the duration of my stay
• I will return to my country of origin upon expiry of my visa/permit

I respectfully request that my application be considered favorably. All required documents are attached.

Yours sincerely,

${v.fullName || '[Your Full Name]'}
[Phone Number]
[Email Address]`,
  },
  {
    id: 'hosting-request',
    name: 'Hosting Agreement Request Email',
    description: 'Email to ask a professor to sign a hosting agreement',
    category: 'Outreach',
    premium: false,
    fields: [
      { key: 'yourName', label: 'Your Full Name', placeholder: 'e.g. Amara Kofi' },
      { key: 'profName', label: 'Professor\'s Name', placeholder: 'e.g. Prof. García' },
      { key: 'profTitle', label: 'Professor\'s Title', placeholder: 'e.g. Associate Professor' },
      { key: 'university', label: 'University Name', placeholder: 'e.g. Universitat Autònoma de Barcelona' },
      { key: 'department', label: 'Department', placeholder: 'e.g. Department of Computer Science' },
      { key: 'researchArea', label: 'Your Research Area', placeholder: 'e.g. Machine Learning for Healthcare' },
      { key: 'duration', label: 'Proposed Duration', placeholder: 'e.g. 12 months' },
      { key: 'yourBackground', label: 'Your Background (1-2 sentences)', placeholder: 'e.g. PhD holder in AI with 3 papers published', multiline: true },
    ],
    template: (v) => `Subject: Research Hosting Agreement Request — ${v.researchArea || '[Research Area]'}

Dear ${v.profTitle || 'Professor'} ${v.profName || '[Professor Name]'},

My name is ${v.yourName || '[Your Name]'}, and I am writing to respectfully inquire whether you would be willing to host me as a visiting researcher in your group at ${v.university || '[University]'}, ${v.department || '[Department]'}.

${v.yourBackground || '[Your background]'}

I am deeply interested in your work on [specific topic from their recent publications], which closely aligns with my research focus on ${v.researchArea || '[Research Area]'}. I believe a collaboration would be mutually beneficial and contribute meaningfully to [specific aspect of their research].

My proposed visit would be for ${v.duration || '[Duration]'}, during which I would [describe specific contributions: data collection, experiments, writing, etc.]. I am self-funded / funded by [scholarship/grant name] and would not require institutional financial support.

To facilitate my visa application as a researcher (under EU Directive 2016/801), I would need a signed Hosting Agreement from ${v.university || '[University]'}. I understand this is a significant commitment, and I am happy to discuss the details at your convenience before making any formal request.

I have attached my CV and a brief research proposal for your review. I would be very grateful for even a brief video call to discuss whether this might be feasible.

Thank you sincerely for your time and consideration.

Warm regards,
${v.yourName || '[Your Name]'}
[Email] | [LinkedIn] | [ORCID/ResearchGate if applicable]`,
  },
  {
    id: 'motivation-letter',
    name: 'Motivation Letter (Student/Researcher)',
    description: 'Why you chose this country and institution',
    category: 'Visa Application',
    premium: true,
    fields: [
      { key: 'name', label: 'Your Name', placeholder: 'Your full name' },
      { key: 'institution', label: 'Target Institution', placeholder: 'e.g. Politecnico di Milano' },
      { key: 'program', label: 'Program / Role', placeholder: 'e.g. PhD in Robotics' },
      { key: 'country', label: 'Target Country', placeholder: 'e.g. Italy' },
      { key: 'careerGoal', label: 'Career Goal', placeholder: 'e.g. become a researcher in human-robot interaction', multiline: true },
      { key: 'uniqueValue', label: 'What makes you unique', placeholder: 'e.g. 5 years industry experience + 2 publications', multiline: true },
    ],
    template: (v) => `MOTIVATION LETTER

Dear Admissions Committee / Visa Officer,

My name is ${v.name || '[Your Name]'}, and I am writing this letter to express my sincere motivation to pursue ${v.program || '[Program/Role]'} at ${v.institution || '[Institution]'} in ${v.country || '[Country]'}.

[BODY - Customize this section with your story]

My interest in ${v.country || '[Country]'} stems from [specific reason: academic reputation, research culture, alignment with goals]. ${v.institution || '[Institution]'} in particular stands out because of [specific labs, professors, or publications that inspire you].

${v.uniqueValue || '[Your unique background]'} — this foundation positions me to contribute meaningfully to the research environment while gaining the expertise needed to advance my career goal to ${v.careerGoal || '[your career goal]'}.

I am fully committed to respecting the laws and immigration requirements of ${v.country || '[Country]'}, and I intend to return to my home country / continue legally after completing my program.

I am confident that this opportunity will allow me to [specific outcome], and I am grateful for your consideration.

Sincerely,
${v.name || '[Your Name]'}`,
  },
  {
    id: 'financial-letter',
    name: 'Financial Proof Explanation Letter',
    description: 'Explains irregular income / deposits to visa officers',
    category: 'Supporting Documents',
    premium: true,
    fields: [
      { key: 'name', label: 'Your Name', placeholder: 'Your full name' },
      { key: 'country', label: 'Target Country', placeholder: 'e.g. Spain' },
      { key: 'income', label: 'Monthly Income/Budget (€)', placeholder: 'e.g. 1,500' },
      { key: 'source', label: 'Source of Funds', placeholder: 'e.g. freelance income + family support' },
      { key: 'bankHistory', label: 'Any unusual transactions to explain', placeholder: 'e.g. large transfer in March from family', multiline: true },
    ],
    template: (v) => `[Your Address]
[City, Country]
[Date]

RE: Financial Proof Declaration

Dear Visa Officer,

I, ${v.name || '[Your Name]'}, hereby declare that I have sufficient financial means to support myself during my stay in ${v.country || '[Country]'}.

My financial resources are as follows:
- Monthly income/budget: approximately €${v.income || '[Amount]'}
- Source: ${v.source || '[Source of Funds]'}
- Evidence: Bank statements (last 6 months) are attached

${v.bankHistory ? `Regarding unusual transactions in my bank history: ${v.bankHistory}` : ''}

I confirm that the funds shown in my attached bank statements are genuinely my own and are from legitimate sources. I understand that misrepresentation is grounds for immediate refusal and future bans.

I declare that the above information is truthful and accurate to the best of my knowledge.

Signed: ${v.name || '[Your Name]'}
Date: [Date]`,
  },
  {
    id: 'appeal-letter',
    name: 'Visa Rejection Appeal Letter',
    description: 'Appeal a rejected visa application with strong argumentation',
    category: 'Appeals',
    premium: true,
    fields: [
      { key: 'name', label: 'Your Full Name', placeholder: 'Your full name' },
      { key: 'refusalDate', label: 'Date of Refusal', placeholder: 'e.g. 15 March 2026' },
      { key: 'visaType', label: 'Visa Type Applied For', placeholder: 'e.g. Spain Researcher Visa' },
      { key: 'refusalReason', label: 'Stated Reason for Refusal', placeholder: 'e.g. insufficient financial proof', multiline: true },
      { key: 'rebuttal', label: 'Your Counter-Arguments', placeholder: 'e.g. I have now provided 6 months statements + €10,000 balance', multiline: true },
    ],
    template: (v) => `[Your Address]
[Date]

RE: FORMAL APPEAL — Visa Refusal dated ${v.refusalDate || '[Date]'}
Applicant: ${v.name || '[Your Name]'}
Visa Type: ${v.visaType || '[Visa Type]'}

Dear Sir/Madam,

I am writing to formally appeal the refusal of my ${v.visaType || '[Visa Type]'} application dated ${v.refusalDate || '[Date]'}.

The stated reason for refusal was: "${v.refusalReason || '[Reason]'}"

I respectfully submit that this assessment was incorrect or that the circumstances have changed, for the following reasons:

${v.rebuttal || '[Your arguments]'}

I request that this appeal be reviewed in light of the above and that a new decision be issued in my favor. I am fully committed to meeting all requirements and to complying with the terms of my visa.

I am available for any further questions or a personal interview at your convenience.

Respectfully,
${v.name || '[Your Name]'}
[Phone] | [Email]`,
  },
];

const categories = ['All', 'Visa Application', 'Outreach', 'Supporting Documents', 'Appeals'];

export default function DocumentsPage() {
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = TEMPLATES.filter(t => categoryFilter === 'All' || t.category === categoryFilter);

  const handleSelect = (t: Template) => {
    setActiveTemplate(t);
    setValues({});
    setCopied(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const generatedText = activeTemplate ? activeTemplate.template(values) : '';

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Document Generator</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Generate professional, customized documents for your visa application — cover letters, hosting agreement requests, motivation letters, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Template list */}
          <div className="lg:col-span-2">
            <div className="flex gap-2 flex-wrap mb-5">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategoryFilter(c)}
                  className={clsx(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                    categoryFilter === c
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filtered.map(t => (
                <button
                  key={t.id}
                  onClick={() => !t.premium && handleSelect(t)}
                  className={clsx(
                    'w-full text-left p-4 rounded-xl border transition-all',
                    activeTemplate?.id === t.id
                      ? 'bg-blue-500/10 border-blue-500/40'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-600',
                    t.premium && 'opacity-75'
                  )}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-blue-400 flex-shrink-0" />
                      <span className="text-white font-medium text-sm">{t.name}</span>
                    </div>
                    {t.premium ? (
                      <span className="badge bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0">
                        <Lock size={10} /> Premium
                      </span>
                    ) : (
                      <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0">Free</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed ml-5">{t.description}</p>
                  <div className="ml-5 mt-1.5">
                    <span className="badge bg-slate-700/50 text-slate-400 text-xs">{t.category}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generator panel */}
          <div className="lg:col-span-3">
            {!activeTemplate ? (
              <div className="card flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center mb-4">
                  <FileText size={28} className="text-slate-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Select a template</h3>
                <p className="text-slate-400 text-sm max-w-xs">Choose a free template from the list to start generating your document</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Fields */}
                <div className="card">
                  <div className="flex items-center gap-2 mb-5">
                    <FileText size={16} className="text-blue-400" />
                    <h2 className="text-white font-semibold">{activeTemplate.name}</h2>
                  </div>
                  <div className="space-y-4">
                    {activeTemplate.fields.map(field => (
                      <div key={field.key}>
                        <label className="label">{field.label}</label>
                        {field.multiline ? (
                          <textarea
                            className="input resize-none h-20"
                            placeholder={field.placeholder}
                            value={values[field.key] || ''}
                            onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                          />
                        ) : (
                          <input
                            type="text"
                            className="input"
                            placeholder={field.placeholder}
                            value={values[field.key] || ''}
                            onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold text-sm">Preview</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(generatedText)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg transition-colors"
                      >
                        {copied ? <CheckCircle size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([generatedText], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${activeTemplate.id}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                      >
                        <Download size={13} /> Download
                      </button>
                    </div>
                  </div>
                  <pre className="bg-slate-900 rounded-xl p-4 text-slate-300 text-xs leading-relaxed whitespace-pre-wrap font-mono overflow-auto max-h-[500px]">
                    {generatedText}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premium upgrade */}
        <div className="mt-12 card bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Lock size={18} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">Unlock Premium Templates</h3>
              <p className="text-slate-400 text-sm mb-4">
                Get motivation letters, appeal letters, financial proof letters, and 10+ more templates with your Premium subscription.
              </p>
              <Link to="/pricing" className="btn-primary text-sm inline-flex items-center gap-2 py-2">
                View Premium Plans <ChevronDown size={14} className="-rotate-90" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
