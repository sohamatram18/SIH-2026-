import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { 
  Building2, 
  IndianRupee, 
  Users, 
  Award, 
  ShieldCheck, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export const TrustStatsBar = () => {
  const { t } = useLanguage();

  const stats = [
    {
      value: t('stat1Val'),
      label: t('stat1Lbl'),
      subtext: t('stat1Sub'),
      icon: Award,
      color: 'text-amber-500'
    },
    {
      value: t('stat2Val'),
      label: t('stat2Lbl'),
      subtext: t('stat2Sub'),
      icon: IndianRupee,
      color: 'text-emerald-500'
    },
    {
      value: t('stat3Val'),
      label: t('stat3Lbl'),
      subtext: t('stat3Sub'),
      icon: Users,
      color: 'text-blue-500'
    },
    {
      value: t('stat4Val'),
      label: t('stat4Lbl'),
      subtext: t('stat4Sub'),
      icon: Building2,
      color: 'text-purple-500'
    },
    {
      value: t('stat5Val'),
      label: t('stat5Lbl'),
      subtext: t('stat5Sub'),
      icon: ShieldCheck,
      color: 'text-teal-500'
    }
  ];

  return (
    <section className="bg-slate-950 text-white border-y border-slate-800 py-10 sm:py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className={`pt-4 sm:pt-0 ${idx !== 0 ? 'sm:pl-6 lg:pl-8' : ''} flex flex-col items-center sm:items-start text-center sm:text-left`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.subtext}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs font-semibold text-slate-300 mt-1">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustStatsBar;
