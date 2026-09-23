import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
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
  const { t } = useLanguage();

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
      <div className="gov-tricolor-bar"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Ministry Branding & Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/janjatisetu-logo.png" 
                alt="JanjatiSetu Logo" 
                className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-amber-400 bg-amber-50 flex-shrink-0"
              />
              <div>
                <h3 className="font-black text-sm text-white tracking-tight leading-tight">
                  {t('siteName')} • {t('footerMinistry')}
                </h3>
                <p className="text-xs text-amber-400 font-semibold">
                  {t('footerGovt')}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footerAbout')}
            </p>

            {/* DPDP Compliance Badge */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-extrabold text-white text-[11px] block">{t('dpdpCompliant')}</span>
                <span className="text-[10px] text-slate-400">{t('dpdpEncDesc')}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-xs text-amber-400 uppercase tracking-wider">
              {t('schemes')}
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
                  <span>{t('wallet')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/payments')} className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <span>{t('dbtTracker')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Integrated National Portals */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-xs text-amber-400 uppercase tracking-wider">
              {t('integratedPortals')}
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

          {/* Col 4: Contact & Mobile App Download */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-extrabold text-xs text-amber-400 uppercase tracking-wider">
              {t('helpdeskContact')}
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
                {t('downloadMobileApp')}
              </span>
              <button 
                onClick={() => alert('JanjatiSetu Mobile PWA is ready for installation!')}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 block leading-tight">GET IT AS</span>
                  <span className="text-[11px]">{t('installPwa')}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {t('siteName')} • {t('allRightsReserved')}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <button onClick={() => navigate('/grievance')} className="hover:text-slate-300 transition">
              {t('grievanceRedressal')}
            </button>
            <span>•</span>
            <span className="hover:text-slate-300 transition cursor-pointer">
              {t('privacyPolicy')}
            </span>
            <span>•</span>
            <span className="hover:text-slate-300 transition cursor-pointer">
              {t('accessibilityStatement')}
            </span>
            <span>•</span>
            <span className="hover:text-slate-300 transition cursor-pointer">
              {t('termsConditions')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
