import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  Building2, 
  Award, 
  Globe, 
  HeartHandshake, 
  ArrowRight, 
  TrendingUp, 
  Laptop, 
  FileText, 
  CheckCircle, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const DiscoveryCategories = ({ onOpenCompare }) => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'pre_matric',
      code: 'PRE_MATRIC',
      title: 'School Education',
      subtitle: 'Class IX & X (EMRS & Govt Schools)',
      benefit: '₹3,500/yr (Day) • ₹7,000/yr (Hostel)',
      income: 'Income ≤ ₹2.50 Lakh/yr',
      tag: 'School Level',
      tagColor: 'bg-emerald-100 text-emerald-800',
      icon: BookOpen,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      link: '/apply/PRE_MATRIC',
      count: '15.2 Lakh Scholars'
    },
    {
      id: 'post_matric',
      code: 'POST_MATRIC',
      title: 'Post-Matric Higher Studies',
      subtitle: 'Class XI, XII, UG, PG & Professional',
      benefit: '100% Course Fee + ₹13,500/yr Maintenance',
      income: 'Income ≤ ₹2.50 Lakh/yr',
      tag: 'College / Degree',
      tagColor: 'bg-blue-100 text-blue-800',
      icon: GraduationCap,
      iconBg: 'bg-blue-50 text-gov-blue border-blue-200',
      link: '/apply/POST_MATRIC',
      count: '21.4 Lakh Scholars'
    },
    {
      id: 'top_class',
      code: 'TOP_CLASS',
      title: 'Top-Class Premier Institutes',
      subtitle: '246 Notified Institutes (IIT, IIM, AIIMS, NIT)',
      benefit: 'Full Fee + ₹45,000 Laptop + ₹36,000 Living',
      income: 'Income ≤ ₹6.00 Lakh/yr',
      tag: 'Premier Institutes',
      tagColor: 'bg-amber-100 text-amber-900',
      icon: Building2,
      iconBg: 'bg-amber-50 text-amber-800 border-amber-200',
      link: '/apply/TOP_CLASS',
      count: '246 Empanelled'
    },
    {
      id: 'nfst',
      code: 'NFST',
      title: 'National Fellowship (NFST)',
      subtitle: 'M.Phil & Ph.D Scholars in UGC Universities',
      benefit: '₹31k/mo JRF • ₹35k/mo SRF + HRA & Grants',
      income: 'Merit-Based (No Income Ceiling)',
      tag: 'Doctoral Research',
      tagColor: 'bg-purple-100 text-purple-800',
      icon: Award,
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
      link: '/apply/NFST',
      count: '750 New Slots/yr'
    },
    {
      id: 'nos',
      code: 'NOS',
      title: 'National Overseas Studies (NOS)',
      subtitle: 'Master’s & Ph.D in Top 500 QS Universities',
      benefit: 'Full Tuition + $15,400/yr + Airfare & Visa',
      income: 'Income ≤ ₹6.00 Lakh/yr',
      tag: 'Study Abroad',
      tagColor: 'bg-indigo-100 text-indigo-800',
      icon: Globe,
      iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      link: '/apply/NOS',
      count: '20 Slots/yr'
    },
    {
      id: 'pvtg',
      code: 'PVTG',
      title: 'PVTG Special Saturation',
      subtitle: 'Particularly Vulnerable Tribal Groups Priority',
      benefit: '100% Saturation Grant + Dedicated Officer Scrutiny',
      income: 'Zero Financial Cap Barrier',
      tag: 'Special Cohort',
      tagColor: 'bg-rose-100 text-rose-800',
      icon: HeartHandshake,
      iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
      link: '/schemes',
      count: '75 PVTG Tribes'
    }
  ];

  const popularTrends = [
    { label: 'Top Class ₹45,000 Laptop Allowance', link: '/apply/TOP_CLASS', badge: 'High Demand' },
    { label: 'IIT & AIIMS AISHE Code Empanelment', link: '/schemes', badge: '246 Institutes' },
    { label: 'DigiLocker Zero-Upload Vault', link: '/wallet', badge: '1-Click e-KYC' },
    { label: 'Compare 5 Schemes Side-by-Side', action: 'compare', badge: 'Tool' },
    { label: 'NPCI Aadhaar Seeding Tracker', link: '/payments', badge: 'PFMS DBT' }
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold tracking-wide uppercase mb-2">
              <Compass className="w-3.5 h-3.5" />
              Direct Scheme Discovery
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Browse MoTA Scholarships by Cohort
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select your educational level to view tailored benefits, statutory eligibility, and application forms.
            </p>
          </div>

          <button
            onClick={() => navigate('/schemes')}
            className="self-start md:self-auto px-4 py-2 text-xs font-bold text-gov-blue hover:text-slate-900 flex items-center gap-1.5 transition group"
          >
            <span>View All Schemes Matrix</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => navigate(cat.link)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-gov-blue/60 p-6 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Top Strip Highlight */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-gov-blue group-hover:to-amber-500 transition"></div>

                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${cat.iconBg} shadow-sm group-hover:scale-110 transition`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${cat.tagColor}`}>
                        {cat.tag}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {cat.count}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-gov-blue transition leading-snug">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {cat.subtitle}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-400 text-[11px]">Benefit:</span>
                      <span className="font-bold text-slate-900 text-right truncate max-w-[200px]">{cat.benefit}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="text-slate-400 text-[11px]">Income Limit:</span>
                      <span className="font-semibold text-slate-600 text-right">{cat.income}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-gov-blue group-hover:text-amber-600 transition">
                  <span>Apply Now</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Secondary Row: Popular / Trending Links Strip (Careers360 style) */}
        <div className="mt-10 bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>Trending Tools & Predictors:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 flex-1">
              {popularTrends.map((trend, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (trend.action === 'compare' && onOpenCompare) onOpenCompare();
                    else if (trend.link) navigate(trend.link);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-xs text-slate-700 hover:text-amber-900 font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <span>{trend.label}</span>
                  <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 text-[9px] font-bold rounded">
                    {trend.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoveryCategories;
