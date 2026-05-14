import { Link } from 'react-router-dom';
import { Globe, Mail } from 'lucide-react';

const footerLinks = {
  Tools: [
    { label: 'Eligibility Checker', path: '/eligibility' },
    { label: 'Visa Comparison', path: '/comparison' },
    { label: 'Cost Estimator', path: '/costs' },
    { label: 'Risk Analyzer', path: '/risks' },
  ],
  Resources: [
    { label: 'Document Generator', path: '/documents' },
    { label: 'University Outreach', path: '/outreach' },
    { label: 'Community', path: '/community' },
    { label: 'Pricing', path: '/pricing' },
  ],
  Countries: [
    { label: 'Spain Visas', path: '/comparison' },
    { label: 'Germany Visas', path: '/comparison' },
    { label: 'Netherlands Visas', path: '/comparison' },
    { label: 'Italy Visas', path: '/comparison' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Globe className="text-white" size={18} />
              </div>
              <span className="text-lg font-bold text-white">
                Aether<span className="gradient-text">Visa</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Helping immigrants, researchers, and skilled workers navigate the European immigration system with confidence.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" aria-label="Twitter">
                <span className="text-xs font-bold">𝕏</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" aria-label="LinkedIn">
                <span className="text-xs font-bold">in</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" aria-label="YouTube">
                <span className="text-xs font-bold">▶</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" aria-label="Email">
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-white font-semibold text-sm mb-4">{section}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-slate-400 hover:text-slate-200 text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 AetherVisa. Not legal advice. Always consult a qualified immigration lawyer.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
