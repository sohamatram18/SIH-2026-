import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { 
  Calculator, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Laptop, 
  IndianRupee, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2,
  Building,
  GraduationCap,
  Info
} from 'lucide-react';

export const DataToolsSection = ({ onOpenCompare }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Calculator State
  const [selectedScheme, setSelectedScheme] = useState('TOP_CLASS');
  const [isHosteller, setIsHosteller] = useState(true);
  const [isDivyang, setIsDivyang] = useState(false);
  const [annualTuition, setAnnualTuition] = useState(125000);
  const [claimLaptop, setClaimLaptop] = useState(true);

  // Calculation Logic
  const computeBreakup = () => {
    let tuition = 0;
    let maintenance = 0;
    let books = 0;
    let hardware = 0;

    if (selectedScheme === 'PRE_MATRIC') {
      tuition = 0;
      maintenance = isHosteller ? 7000 : 3500;
      if (isDivyang) maintenance += Math.round(maintenance * 0.1);
      books = 1000;
      hardware = 0;
    } else if (selectedScheme === 'POST_MATRIC') {
      tuition = Number(annualTuition);
      maintenance = isHosteller ? 13500 : 7000;
      if (isDivyang) maintenance += 2000;
      books = 2500;
      hardware = 0;
    } else if (selectedScheme === 'TOP_CLASS') {
      tuition = Number(annualTuition);
      maintenance = 36000;
      books = 5000;
      hardware = claimLaptop ? 45000 : 0;
      if (isDivyang) maintenance += 3000;
    } else if (selectedScheme === 'NFST') {
      tuition = Number(annualTuition);
      maintenance = 31000 * 12;
      books = 12000;
      hardware = 0;
    } else if (selectedScheme === 'NOS') {
      tuition = Number(annualTuition);
      maintenance = 1280000;
      books = 15000;
      hardware = 0;
    }

    const total = tuition + maintenance + books + hardware;
    return { tuition, maintenance, books, hardware, total };
  };

  const breakup = computeBreakup();

  return (
    <section id="calculator-section" className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold tracking-wide uppercase border border-amber-400/30">
            <Calculator className="w-3.5 h-3.5" />
            {t('interactiveToolsBadge')}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {t('allowanceCalcTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {t('allowanceCalcDesc')}
          </p>
        </div>

        {/* 2-Column Calculator + Comparison Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Calculator (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white">
                    {t('financialSimulator')}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {t('financialSimSub')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedScheme('TOP_CLASS');
                  setIsHosteller(true);
                  setIsDivyang(false);
                  setAnnualTuition(125000);
                  setClaimLaptop(true);
                }}
                className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="space-y-6">
              {/* Select Scheme */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {t('selectSchemeLabel')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'TOP_CLASS', label: 'Top Class (IIT/IIM/AIIMS)' },
                    { id: 'POST_MATRIC', label: 'Post-Matric (XI to PG)' },
                    { id: 'PRE_MATRIC', label: 'Pre-Matric (Class 9-10)' },
                    { id: 'NFST', label: 'NFST (PhD Fellowship)' },
                    { id: 'NOS', label: 'NOS (Abroad Studies)' }
                  ].map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedScheme(s.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition text-left border ${
                        selectedScheme === s.id
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                          : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Annual Tuition Fee Slider */}
              {selectedScheme !== 'PRE_MATRIC' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-300">
                      {t('annualTuitionLabel')}
                    </label>
                    <span className="font-mono text-xs font-extrabold text-amber-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700">
                      ₹{Number(annualTuition).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={annualTuition}
                    onChange={(e) => setAnnualTuition(e.target.value)}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>₹10,000</span>
                    <span>₹2,50,000</span>
                    <span>₹5,00,000</span>
                  </div>
                </div>
              )}

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div 
                  onClick={() => setIsHosteller(!isHosteller)}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    isHosteller ? 'bg-blue-500/10 border-blue-400 text-blue-300' : 'bg-slate-900/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold">{t('hostellerOption')}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isHosteller ? 'border-blue-400 bg-blue-500' : 'border-slate-500'}`}>
                    {isHosteller && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>

                <div 
                  onClick={() => setIsDivyang(!isDivyang)}
                  className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    isDivyang ? 'bg-purple-500/10 border-purple-400 text-purple-300' : 'bg-slate-900/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold">{t('divyangOption')}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isDivyang ? 'border-purple-400 bg-purple-500' : 'border-slate-500'}`}>
                    {isDivyang && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>

                {selectedScheme === 'TOP_CLASS' && (
                  <div 
                    onClick={() => setClaimLaptop(!claimLaptop)}
                    className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                      claimLaptop ? 'bg-amber-500/10 border-amber-400 text-amber-300' : 'bg-slate-900/60 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold">{t('laptopOption')}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${claimLaptop ? 'border-amber-400 bg-amber-500' : 'border-slate-500'}`}>
                      {claimLaptop && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                  </div>
                )}
              </div>

              {/* Calculated Results Summary Box */}
              <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-700 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    {t('totalEstAnnual')}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">
                    ₹{breakup.total.toLocaleString('en-IN')}
                    <span className="text-xs text-slate-400 font-normal ml-1">/ year</span>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-[10px]">{t('tuitionSupport')}</span>
                    <p className="font-extrabold text-white mt-0.5">₹{breakup.tuition.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-[10px]">{t('livingMaintenance')}</span>
                    <p className="font-extrabold text-emerald-400 mt-0.5">₹{breakup.maintenance.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-[10px]">{t('bookStationery')}</span>
                    <p className="font-extrabold text-blue-400 mt-0.5">₹{breakup.books.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                    <span className="text-slate-400 text-[10px]">{t('hardwareLaptop')}</span>
                    <p className="font-extrabold text-amber-400 mt-0.5">₹{breakup.hardware.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Action to Apply */}
                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => navigate(`/apply/${selectedScheme}`)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 transition"
                  >
                    <span>{t('proceedClaim')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Comparison & DigiLocker Tool Cards */}
          <div className="lg:col-span-4 space-y-5">
            {/* Tool 1: Scheme Comparator Card */}
            <div className="bg-gradient-to-br from-blue-900/60 to-indigo-950/80 border border-blue-500/30 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 uppercase tracking-wide">
                  Side-by-Side Matrix
                </span>
                <h3 className="font-extrabold text-base text-white mt-1">
                  {t('schemeComparator')}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {t('schemeComparatorSub')}
                </p>
              </div>
              <button
                onClick={onOpenCompare}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <span>{t('launchComparator')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tool 2: DigiLocker e-KYC Readiness Card */}
            <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase tracking-wide">
                  Zero Physical Uploads
                </span>
                <h3 className="font-extrabold text-base text-white mt-1">
                  {t('digilockerVault')}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {t('digilockerVaultSub')}
                </p>
              </div>
              <button
                onClick={() => navigate('/wallet')}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <span>{t('openDigitalWallet')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataToolsSection;
