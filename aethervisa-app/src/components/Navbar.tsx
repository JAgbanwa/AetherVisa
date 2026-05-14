import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { LawUpdatesBadge } from './LawUpdatesBanner';
import clsx from 'clsx';

const navItems = [
  {
    label: 'Tools',
    children: [
      { label: 'Eligibility Checker', path: '/eligibility', desc: 'Find your best visa option' },
      { label: 'Visa Comparison', path: '/comparison', desc: 'Compare pathways side by side' },
      { label: 'Cost Estimator', path: '/costs', desc: 'Realistic budget planning' },
      { label: 'Risk Analyzer', path: '/risks', desc: 'Avoid critical mistakes' },
    ],
  },
  {
    label: 'Resources',
    children: [
      { label: 'Document Generator', path: '/documents', desc: 'Create application documents' },
      { label: 'University Outreach', path: '/outreach', desc: 'Connect with supervisors' },
      { label: 'Community', path: '/community', desc: 'Learn from others\' experiences' },
      { label: 'Law Updates', path: '/law-updates', desc: 'Track immigration law changes' },
    ],
  },
  { label: 'Pricing', path: '/pricing' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <Globe className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Aether<span className="gradient-text">Visa</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 rounded-lg nav-link hover:bg-slate-800 text-sm font-medium">
                    {item.label}
                    {item.label === 'Resources' && <LawUpdatesBadge />}
                    <ChevronDown size={14} className={clsx('transition-transform', activeDropdown === item.label && 'rotate-180')} />
                  </button>
                  {activeDropdown === item.label && (
                    <div className="absolute top-full left-0 pt-2 w-64">
                      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl shadow-black/40 overflow-hidden">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={clsx(
                              'flex flex-col px-4 py-3 hover:bg-slate-800 transition-colors',
                              location.pathname === child.path && 'bg-slate-800'
                            )}
                          >
                            <span className="text-white text-sm font-medium">{child.label}</span>
                            <span className="text-slate-400 text-xs">{child.desc}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.path!}
                  className={clsx(
                    'px-3 py-2 rounded-lg nav-link hover:bg-slate-800 text-sm font-medium',
                    location.pathname === item.path && 'text-white bg-slate-800'
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/eligibility" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-600/20">
              <Sparkles size={14} />
              Check Eligibility
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider px-2 py-1">{item.label}</p>
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-sm"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.path!}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 text-sm"
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-2 border-t border-slate-800">
              <Link to="/eligibility" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 btn-primary w-full text-sm">
                <Sparkles size={14} />
                Check Eligibility Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
