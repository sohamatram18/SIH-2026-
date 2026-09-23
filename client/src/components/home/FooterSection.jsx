import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Globe, 
  ShieldCheck, 
  ExternalLink, 
  Smartphone, 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  Lock, 
  Download,
  Award
} from 'lucide-react';

export const FooterSection = () => {
  const navigate = useNavigate();

  const partnerPortals = [
    { name: 'DigiLocker', desc: 'National Document Repository', url: 'https://digilocker.gov.in' },
    { name: 'PFMS', desc: 'Public Financial Management System', url: 'https://pfms.nic.in' },
    { name: 'NSP Portal', desc: 'National Scholarship Portal', url: 'https://scholarships.gov.in' },
    { name: 'AISHE', desc: 'All India Survey on Higher Education', url: 'https://aishe.gov.in' },
    { name: 'myScheme', desc: 'National Government Scheme Aggregator', url: 'https://myscheme.gov.in' },
    { name: 'UMANG', desc: 'Unified Mobile App for New-Age Governance', url: 'https://web.umang.gov.in' }
  ];

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      {/* Top Ministry Accent Strip */}
      <div className="gov-tricolor-bar"></div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Ministry Branding & Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-white shadow-lg border-2 border-amber-300 text-lg flex-shrink-0">
                🇮🇳
              </div>
              <div>
                <h3 className="font-black text-sm text-white tracking-tight leading-tight">
                  MINISTRY OF TRIBAL AFFAIRS
                </h3>
                <p className="text-xs text-amber-400 font-semibold">
                  Government of India • जनजातीय कार्य मंत्रालय
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Unified Single-Window Scholarship Discovery & Disbursement Platform for Scheduled Tribe (ST) students across India. Empowering scholars with zero-paperwork DigiLocker e-KYC and direct PFMS bank transfer.
            </p>

            {/* DPDP Compliance Badge */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-extrabold text-white text-[11px] block">DPDP Act 2023 Compliant</span>
                <span className="text-[10px] text-slate-400">Zero raw Aadhaar storage • AES-256-GCM encryption</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-xs text-amber-400 uppercase tracking-wider">
              MoTA Scholarship Schemes
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <button onClick={() => navigate('/apply/PRE_MATRIC')} className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span>Pre-Matric ST (Class IX-X)</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/apply/POST_MATRIC')} className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span>Post-Matric ST (Class XI to PG)</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/apply/TOP_CLASS')} className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span>Top-Class (246 Premier IITs/IIMs)</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/apply/NFST')} className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span>National Fellowship (NFST PhD)</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/apply/NOS')} className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span>National Overseas Scholarship (NOS)</span>
                </button>
              </li>
              <li className="pt-2 border-t border-slate-800">
                <button onClick={() => navigate('/wallet')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DigiLocker Document Vault</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/payments')} className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span>PFMS DBT Payment Ledger</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Integrated National Portals (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-xs text-amber-400 uppercase tracking-wider">
              Integrated National Portals
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {partnerPortals.map((portal, idx) => (
                <a
                  key={idx}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between group"
                >
                  <div>
                    <span className="font-bold text-xs text-slate-200 group-hover:text-amber-300">
                      {portal.name}
                    </span>
                    <p className="text-[10px] text-slate-500">{portal.desc}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 4: Contact & Mobile App Download (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-extrabold text-xs text-amber-400 uppercase tracking-wider">
              Helpdesk & Contact
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-400">
                  Shastri Bhawan, Dr. Rajendra Prasad Rd, New Delhi 110001
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-mono text-xs font-bold text-amber-300">1800-11-7788</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-[11px]">scholarship-mota@gov.in</span>
              </div>
            </div>

            {/* Mobile App Download Buttons */}
            <div className="pt-2 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Download Mobile App
              </span>
              <button 
                onClick={() => alert('MoTA Unified Scholarship PWA is ready for offline install!')}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 block leading-tight">GET IT AS</span>
                  <span className="text-[11px]">Install Mobile PWA</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Accessibility Links */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Ministry of Tribal Affairs (MoTA), Government of India. All Rights Reserved.
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button onClick={() => navigate('/grievance')} className="hover:text-slate-300 transition">
              Grievance Redressal
            </button>
            <span>•</span>
            <span className="hover:text-slate-300 transition cursor-pointer">
              Privacy Policy (DPDP Act)
            </span>
            <span>•</span>
            <span className="hover:text-slate-300 transition cursor-pointer">
              Accessibility Statement
            </span>
            <span>•</span>
            <span className="hover:text-slate-300 transition cursor-pointer">
              Terms & Conditions
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
