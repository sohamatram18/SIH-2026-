import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { 
  ShieldCheck, 
  Cpu, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Lock, 
  FileCheck2, 
  Sparkles,
  Building,
  Check
} from 'lucide-react';

export const HowItWorksSection = ({ onOpenJago }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      stepNumber: '01',
      title: t('step1Title'),
      subtitle: t('step1Sub'),
      desc: t('step1Desc'),
      icon: ShieldCheck,
      color: 'from-blue-600 to-indigo-600',
      badge: '1-Click e-KYC',
      highlights: [
        'Instant PKI verification without manual scanning',
        'HMAC SHA-256 tokenization (DPDP Act 2023 compliant)',
        'State e-District & DigiLocker direct sync',
        'Permanent digital wallet for future renewals'
      ],
      action: { label: t('step1Action'), link: '/wallet' }
    },
    {
      stepNumber: '02',
      title: t('step2Title'),
      subtitle: t('step2Sub'),
      desc: t('step2Desc'),
      icon: Cpu,
      color: 'from-amber-600 to-orange-600',
      badge: 'Conflict-Free Match',
      highlights: [
        'Instant eligibility calculation across all 5 MoTA schemes',
        '246 Notified Premier Institutes (IITs, IIMs, AIIMS) check',
        'Cross-scheme duplicate claim prevention',
        'PVTG & Divyang priority inclusion scoring'
      ],
      action: { label: t('step2Action'), link: '/schemes' }
    },
    {
      stepNumber: '03',
      title: t('step3Title'),
      subtitle: t('step3Sub'),
      desc: t('step3Desc'),
      icon: CreditCard,
      color: 'from-emerald-600 to-teal-600',
      badge: '100% Direct DBT',
      highlights: [
        'Real-time PFMS sanction order ledger',
        'Live NPCI Aadhaar bank account seeding status',
        'SMS & Multilingual JAGO AI voice updates',
        'Zero-touch direct bank account transfer'
      ],
      action: { label: t('step3Action'), link: '/payments' }
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80 relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-gov-blue text-xs font-extrabold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            {t('howItWorksBadge')}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('howItWorksSub')}
          </p>
        </div>

        {/* 3 Steps Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
          <div className="hidden md:block absolute top-24 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-300 via-amber-300 to-emerald-300 z-0"></div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isHovered = activeStep === idx;
            return (
              <div
                key={idx}
                onMouseEnter={() => setActiveStep(idx)}
                className={`relative z-10 bg-white rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl ${
                  isHovered ? 'border-gov-blue ring-2 ring-blue-100 -translate-y-1.5' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${step.color} text-white flex items-center justify-center shadow-lg shadow-blue-500/10`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-2xl sm:text-3xl font-black text-slate-300">
                        {step.stepNumber}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {step.badge}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-bold text-gov-blue tracking-wide uppercase">
                      {step.subtitle}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="space-y-2 py-4 border-t border-slate-100">
                    {step.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4">
                  <button
                    onClick={() => navigate(step.action.link)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-gov-blue hover:text-white text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <span>{step.action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Box */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">
                {t('dpdpGuarTitle')}
              </h4>
              <p className="text-[11px] text-slate-500">
                {t('dpdpGuarDesc')}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenJago}
            className="flex-shrink-0 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{t('askJago')}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
