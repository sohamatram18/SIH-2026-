import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Laptop, 
  Globe2, 
  ShieldCheck, 
  GraduationCap, 
  FileCheck2, 
  Zap,
  Award,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const HeroBannerCarousel = ({ onOpenJago, onOpenCompare }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      badge: 'Academic Year 2026-27 Open',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      title: 'Unified Scholarship Portal for Tribal Students',
      highlight: 'Empowering 38.5 Lakh+ ST Scholars Across India',
      description: 'Single-window discovery and paperless application for all 5 official Ministry of Tribal Affairs (MoTA) schemes with instant DigiLocker e-KYC and conflict-free processing.',
      primaryBtn: { label: 'Explore 5 MoTA Schemes', link: '/schemes' },
      secondaryBtn: { label: 'DigiLocker Vault', link: '/wallet' },
      bgGradient: 'from-slate-950 via-slate-900 to-blue-950',
      accentColor: 'from-amber-400 to-amber-600',
      features: ['100% Paperless DigiLocker', 'Real-time PFMS DBT', 'Zero Application Fee', 'Multi-lingual JAGO AI'],
      statBox: { value: '₹1,420 Cr+', label: 'Direct Benefit Transfer (DBT) via PFMS' },
      icon: GraduationCap
    },
    {
      id: 2,
      badge: 'Top-Class Education • 246 Premier Institutes',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      title: 'Full Tuition + ₹45,000 Laptop Grant',
      highlight: 'For IITs, IIMs, AIIMS, NITs & National Law Universities',
      description: 'ST students admitted into notified premier institutes receive full tuition fee reimbursement, ₹36,000/yr living expenses, ₹5,000 book grant and a one-time ₹45,000 laptop entitlement.',
      primaryBtn: { label: 'Apply Top-Class Scheme', link: '/apply/TOP_CLASS' },
      secondaryBtn: { label: 'Check 246 Institutes', link: '/schemes' },
      bgGradient: 'from-slate-950 via-amber-950/70 to-slate-900',
      accentColor: 'from-amber-400 to-orange-500',
      features: ['100% Non-Refundable Fees', '₹36,000 Living Expenses', '₹45,000 Laptop Grant', 'Divyang Assistance'],
      statBox: { value: '246 Institutes', label: 'Empanelled Premier Institutes across India' },
      icon: Laptop
    },
    {
      id: 3,
      badge: 'National Overseas Scholarship (NOS)',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      title: 'Study at Top 500 QS World Universities',
      highlight: 'Full Foreign Tuition + USD 15,400 Annual Allowance',
      description: 'Pursue Master’s and Ph.D. degrees in premier universities abroad with airfare, medical insurance, visa fees, contingency grants and living allowances funded by the Ministry of Tribal Affairs.',
      primaryBtn: { label: 'Apply Overseas (NOS)', link: '/apply/NOS' },
      secondaryBtn: { label: 'Compare Benefits', action: 'compare' },
      bgGradient: 'from-slate-950 via-indigo-950/70 to-slate-900',
      accentColor: 'from-blue-400 to-cyan-400',
      features: ['Top 500 QS Universities', '$15,400/yr (USA) • £9,900/yr (UK)', 'Return Airfare Covered', 'Full Visa & Health Cover'],
      statBox: { value: '$15,400/yr', label: 'Annual Living Maintenance Allowance' },
      icon: Globe2
    },
    {
      id: 4,
      badge: 'National Fellowship for ST Students (NFST)',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      title: 'Doctoral Fellowship for ST Scholars',
      highlight: '₹31,000/mo JRF • ₹35,000/mo SRF + HRA & Contingency',
      description: 'Merit-based financial assistance for Scheduled Tribe students pursuing regular M.Phil and Ph.D. research courses in UGC-recognized Indian Universities with zero income cap.',
      primaryBtn: { label: 'Apply NFST Fellowship', link: '/apply/NFST' },
      secondaryBtn: { label: 'Ask JAGO AI', action: 'jago' },
      bgGradient: 'from-slate-950 via-purple-950/70 to-slate-900',
      accentColor: 'from-purple-400 to-pink-400',
      features: ['No Family Income Ceiling', '₹31,000 - ₹35,000/month', 'Annual Contingency Grant', 'PVTG Priority Quota'],
      statBox: { value: '₹35,000/mo', label: 'Senior Research Fellowship (SRF)' },
      icon: Award
    }
  ];

  // Auto-play timer (5.5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;

  const handleAction = (btn) => {
    if (btn.action === 'compare' && onOpenCompare) {
      onOpenCompare();
    } else if (btn.action === 'jago' && onOpenJago) {
      onOpenJago();
    } else if (btn.link) {
      navigate(btn.link);
    }
  };

  return (
    <section 
      className="relative bg-slate-950 text-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Ambient Glow & Patterns */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} transition-all duration-700 ease-out`}></div>
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

      {/* Tri-color Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-white/40 to-emerald-500 opacity-60"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-8 space-y-5 animate-in fade-in duration-500">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border tracking-wide flex items-center gap-1.5 shadow-sm ${slide.badgeColor}`}>
                <Sparkles className="w-3.5 h-3.5" />
                {slide.badge}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full border border-slate-700">
                <Clock className="w-3 h-3 text-amber-400" /> Deadline: Oct 31, 2026
              </span>
            </div>

            {/* Main Slide Title */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {slide.title}
              </h1>
              <p className={`text-base sm:text-xl font-bold bg-gradient-to-r ${slide.accentColor} bg-clip-text text-transparent`}>
                {slide.highlight}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {slide.description}
            </p>

            {/* Key Bullet Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {slide.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-200 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 backdrop-blur-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => handleAction(slide.primaryBtn)}
                className="px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition hover:scale-105"
              >
                <span>{slide.primaryBtn.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleAction(slide.secondaryBtn)}
                className="px-5 sm:px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-sm transition flex items-center gap-2"
              >
                <span>{slide.secondaryBtn.label}</span>
              </button>

              <button
                onClick={onOpenJago}
                className="px-3.5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-amber-500/30 transition flex items-center gap-1.5"
                title="Voice Assistant"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Ask JAGO Voice AI</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Card & Quick Stat Widget */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="relative bg-gradient-to-b from-white/10 to-white/5 border border-white/15 rounded-3xl p-6 backdrop-blur-md shadow-2xl space-y-5">
              {/* Highlight Icon Container */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg">
                  <IconComponent className="w-7 h-7" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Verified Govt Scheme
                </span>
              </div>

              {/* Big Stat Box */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <div className="text-2xl font-black text-amber-400">
                  {slide.statBox.value}
                </div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">
                  {slide.statBox.label}
                </div>
              </div>

              {/* Quick Checklist */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">Application Mode</span>
                  <span className="font-bold text-white">100% Online (PWA)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">Disbursement Channel</span>
                  <span className="font-bold text-white">Direct APBS Bank DBT</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Doc Verification</span>
                  <span className="font-bold text-emerald-400">DigiLocker PKI e-KYC</span>
                </div>
              </div>

              {/* Switch slide quick link */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>Slide {currentSlide + 1} of {slides.length}</span>
                <span className="text-amber-300 font-medium">Auto-rotating banner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Bottom Controls & Indicators */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slide Dots */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Quick Stats Ticker */}
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              DPDP Act 2023 Compliant
            </span>
            <span>•</span>
            <span className="text-slate-300">PFMS Sanctions Active</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBannerCarousel;
