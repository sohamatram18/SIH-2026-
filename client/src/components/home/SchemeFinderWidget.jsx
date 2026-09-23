import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { 
  Search, 
  Sparkles, 
  GraduationCap, 
  MapPin, 
  Users, 
  Wallet, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  ChevronRight,
  Award,
  AlertCircle
} from 'lucide-react';

export const SchemeFinderWidget = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [educationLevel, setEducationLevel] = useState('ug_pg');
  const [state, setState] = useState('All');
  const [tribalCategory, setTribalCategory] = useState('ST');
  const [incomeRange, setIncomeRange] = useState('under_2_5l');
  const [matchedModalOpen, setMatchedModalOpen] = useState(false);

  const states = [
    'All India / Central Scheme',
    'Odisha',
    'Jharkhand',
    'Madhya Pradesh',
    'Chhattisgarh',
    'Maharashtra',
    'Gujarat',
    'Rajasthan',
    'Andhra Pradesh',
    'Telangana',
    'Assam & North East'
  ];

  // Logic to calculate matched schemes
  const calculateMatches = () => {
    const matches = [];

    if (educationLevel === 'school_9_10') {
      matches.push({
        code: 'PRE_MATRIC',
        name: 'Pre-Matric Scholarship for ST Students',
        target: 'Class IX & X in Govt / EMRS Schools',
        benefit: 'Day Scholar: ₹3,500/yr • Hosteller: ₹7,000/yr + 10% Divyang Grant',
        incomeLimit: '₹2.50 Lakh / year',
        link: '/apply/PRE_MATRIC',
        badge: '100% Eligible'
      });
    }

    if (educationLevel === 'school_11_12' || educationLevel === 'ug_pg') {
      if (incomeRange !== 'above_6l') {
        matches.push({
          code: 'POST_MATRIC',
          name: 'Post-Matric Scholarship for ST Students',
          target: 'Class XI, XII, Polytechnic, UG & PG Degrees',
          benefit: 'Full Compulsory Course Fees + ₹2,500 - ₹13,500/yr Maintenance Allowance',
          incomeLimit: '₹2.50 Lakh / year',
          link: '/apply/POST_MATRIC',
          badge: 'High Fit'
        });
      }

      if (incomeRange !== 'above_6l' && educationLevel === 'ug_pg') {
        matches.push({
          code: 'TOP_CLASS',
          name: 'National Scholarship for Higher Education (Top Class)',
          target: '246 Notified Institutes (IITs, IIMs, AIIMS, NITs, NLUs)',
          benefit: '100% Full Tuition Fee + ₹36,000/yr Living + ₹45,000 Laptop Grant',
          incomeLimit: '₹6.00 Lakh / year',
          link: '/apply/TOP_CLASS',
          badge: 'Premier Institute Grant'
        });
      }
    }

    if (educationLevel === 'phd') {
      matches.push({
        code: 'NFST',
        name: 'National Fellowship for ST Students (NFST)',
        target: 'M.Phil & Ph.D Scholars in UGC Recognized Universities',
        benefit: 'JRF: ₹31,000/mo • SRF: ₹35,000/mo + HRA + ₹12,000/yr Contingency',
        incomeLimit: 'No Income Cap (Pure Merit & UGC Registration)',
        link: '/apply/NFST',
        badge: 'Merit Fellowship'
      });
    }

    if (educationLevel === 'abroad') {
      matches.push({
        code: 'NOS',
        name: 'National Overseas Scholarship (NOS)',
        target: 'Master’s & Ph.D in Top 500 QS World Universities',
        benefit: 'Full Foreign Tuition + USD 15,400/yr (USA) / GBP 9,900/yr (UK) + Airfare & Visa',
        incomeLimit: '₹6.00 Lakh / year',
        link: '/apply/NOS',
        badge: 'Overseas Study'
      });
    }

    if (matches.length === 0) {
      matches.push({
        code: 'TOP_CLASS',
        name: 'National Scholarship for Higher Education (Top Class)',
        target: 'Premier Institutes across India (Income ceiling up to ₹6L)',
        benefit: 'Full Tuition + ₹45,000 Laptop Grant + ₹36,000/yr living allowance',
        incomeLimit: '₹6.00 Lakh / year',
        link: '/apply/TOP_CLASS',
        badge: 'Suggested'
      });
    }

    return matches;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setMatchedModalOpen(true);
  };

  const matchedSchemes = calculateMatches();

  return (
    <div className="relative -mt-6 sm:-mt-8 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/90 p-5 sm:p-7 backdrop-blur-lg">
        {/* Widget Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gov-blue text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                {t('findScholarshipTitle')}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                {t('findScholarshipSub')}
              </p>
            </div>
          </div>
          <span className="self-start sm:self-auto px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            {t('aiAssistedTag')}
          </span>
        </div>

        {/* 4 Multi-Select Filter Grid */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Filter 1: Education Level */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-gov-blue" />
              {t('eduLevelLabel')}
            </label>
            <div className="relative">
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-blue-100 focus:border-gov-blue transition appearance-none"
              >
                <option value="school_9_10">Class IX - X (School Education)</option>
                <option value="school_11_12">Class XI - XII / Polytechnic</option>
                <option value="ug_pg">UG / PG Degree (B.Tech, MBBS, B.Sc, MA)</option>
                <option value="phd">M.Phil / Ph.D. Research (Doctoral)</option>
                <option value="abroad">Master's / Ph.D. Abroad (NOS)</option>
              </select>
            </div>
          </div>

          {/* Filter 2: Domicile State / Region */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {t('stateLabel')}
            </label>
            <div className="relative">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-blue-100 focus:border-gov-blue transition appearance-none"
              >
                {states.map((st, idx) => (
                  <option key={idx} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter 3: Tribal Category & Inclusion */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              {t('tribalCatLabel')}
            </label>
            <div className="relative">
              <select
                value={tribalCategory}
                onChange={(e) => setTribalCategory(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-blue-100 focus:border-gov-blue transition appearance-none"
              >
                <option value="ST">Scheduled Tribe (ST) - General</option>
                <option value="PVTG">PVTG (Particularly Vulnerable Tribe)</option>
                <option value="DIVYANG">ST Student with Disability (Divyang 40%+)</option>
              </select>
            </div>
          </div>

          {/* Filter 4: Annual Family Income */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-purple-600" />
              {t('incomeLabel')}
            </label>
            <div className="relative">
              <select
                value={incomeRange}
                onChange={(e) => setIncomeRange(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-blue-100 focus:border-gov-blue transition appearance-none"
              >
                <option value="under_2_5l">Below ₹2.50 Lakh / year</option>
                <option value="2_5l_to_6l">₹2.50 Lakh to ₹6.00 Lakh / year</option>
                <option value="above_6l">Above ₹6.00 Lakh / Merit (No Cap)</option>
              </select>
            </div>
          </div>

          {/* Submit Action CTA Button */}
          <div className="sm:col-span-2 lg:col-span-4 pt-2">
            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-gov-blue to-gov-navy hover:from-slate-900 hover:to-gov-blue text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99]"
            >
              <Search className="w-4 h-4" />
              <span>{t('checkMatchedBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="font-bold text-slate-700">{t('quickFilters')}</span>
          <button 
            type="button"
            onClick={() => { setEducationLevel('ug_pg'); setIncomeRange('2_5l_to_6l'); setMatchedModalOpen(true); }}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 font-medium transition"
          >
            IITs/IIMs ₹45k Laptop Scheme
          </button>
          <button 
            type="button"
            onClick={() => { setEducationLevel('phd'); setMatchedModalOpen(true); }}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 font-medium transition"
          >
            Ph.D. ₹31k/mo Fellowship
          </button>
          <button 
            type="button"
            onClick={() => { setEducationLevel('abroad'); setIncomeRange('2_5l_to_6l'); setMatchedModalOpen(true); }}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 font-medium transition"
          >
            Overseas Top 500 QS
          </button>
        </div>
      </div>

      {/* Matched Schemes Modal Dialog */}
      {matchedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-gov-navy to-gov-blue text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    Matched Scholarship Schemes ({matchedSchemes.length})
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    JanjatiSetu AI Verified Matching
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMatchedModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {matchedSchemes.map((scheme, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-50 border border-slate-200 hover:border-gov-blue rounded-2xl p-4 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                        {scheme.badge}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 mt-1">
                        {scheme.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {scheme.target}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {scheme.code}
                    </span>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-xl p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-500 font-medium">Financial Benefit:</span>
                      <span className="font-bold text-emerald-700">{scheme.benefit}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-slate-100">
                      <span className="text-slate-500 font-medium">Income Ceiling:</span>
                      <span className="font-semibold text-slate-900">{scheme.incomeLimit}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => {
                        setMatchedModalOpen(false);
                        navigate(scheme.link);
                      }}
                      className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                    >
                      <span>Proceed to Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Statutory One-Scheme Rule:</strong> A tribal student may claim only one Central MoTA scholarship concurrently per academic cycle.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">JanjatiSetu • 100% verified against MoTA rules</span>
              <button
                onClick={() => setMatchedModalOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemeFinderWidget;
