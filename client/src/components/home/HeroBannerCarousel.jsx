import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
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
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      badge: t('heroBadge1'),
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      title: t('heroTitle1'),
      highlight: t('heroHighlight1'),
      description: t('heroDesc1'),
      primaryBtn: { label: t('heroPrimary1'), link: '/schemes' },
      secondaryBtn: { label: t('heroSecondary1'), link: '/wallet' },
      bgGradient: 'from-slate-950 via-slate-900 to-blue-950',
      accentColor: 'from-amber-400 to-amber-600',
      features: [t('heroFeat1_1'), t('heroFeat1_2'), t('heroFeat1_3'), t('heroFeat1_4')],
      statBox: { value: t('heroStatVal1'), label: t('heroStatLbl1') },
      icon: GraduationCap
    },
    {
      id: 2,
      badge: t('heroBadge2'),
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      title: t('heroTitle2'),
      highlight: t('heroHighlight2'),
      description: t('heroDesc2'),
      primaryBtn: { label: t('heroPrimary2'), link: '/apply/TOP_CLASS' },
      secondaryBtn: { label: t('heroSecondary2'), link: '/schemes' },
      bgGradient: 'from-slate-950 via-amber-950/70 to-slate-900',
      accentColor: 'from-amber-400 to-orange-500',
      features: [t('heroFeat2_1'), t('heroFeat2_2'), t('heroFeat2_3'), t('heroFeat2_4')],
      statBox: { value: t('heroStatVal2'), label: t('heroStatLbl2') },
      icon: Laptop
    },
    {
      id: 3,
      badge: t('heroBadge3'),
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      title: t('heroTitle3'),
      highlight: t('heroHighlight3'),
      description: t('heroDesc3'),
      primaryBtn: { label: t('heroPrimary3'), link: '/apply/NOS' },
      secondaryBtn: { label: t('heroSecondary3'), action: 'compare' },
      bgGradient: 'from-slate-950 via-indigo-950/70 to-slate-900',
      accentColor: 'from-blue-400 to-cyan-400',
      features: [t('heroFeat3_1'), t('heroFeat3_2'), t('heroFeat3_3'), t('heroFeat3_4')],
      statBox: { value: t('heroStatVal3'), label: t('heroStatLbl3') },
      icon: Globe2
    },
    {
      id: 4,
      badge: t('heroBadge4'),
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      title: t('heroTitle4'),
      highlight: t('heroHighlight4'),
      description: t('heroDesc4'),
      primaryBtn: { label: t('heroPrimary4'), link: '/apply/NFST' },
      secondaryBtn: { label: t('heroSecondary4'), action: 'jago' },
      bgGradient: 'from-slate-950 via-purple-950/70 to-slate-900',
      accentColor: 'from-purple-400 to-pink-400',
      features: [t('heroFeat4_1'), t('heroFeat4_2'), t('heroFeat4_3'), t('heroFeat4_4')],
      statBox: { value: t('heroStatVal4'), label: t('heroStatLbl4') },
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
                <span>{t('askJago')}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="relative bg-gradient-to-b from-white/10 to-white/5 border border-white/15 rounded-3xl p-6 backdrop-blur-md shadow-2xl space-y-5">
              {/* Highlight Icon Container */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg">
                  <IconComponent className="w-7 h-7" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {t('verifiedGovtScheme')}
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
                  <span className="text-slate-400">{t('appMode')}</span>
                  <span className="font-bold text-white">{t('onlinePwa')}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/10">
                  <span className="text-slate-400">{t('disbChannel')}</span>
                  <span className="font-bold text-white">{t('directApbsDbt')}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">{t('docVerif')}</span>
                  <span className="font-bold text-emerald-400">{t('digilockerPki')}</span>
                </div>
              </div>

              {/* Switch slide quick link */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>{t('slideOf')} {currentSlide + 1} of {slides.length}</span>
                <span className="text-amber-300 font-medium">JanjatiSetu Portal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Bottom Controls */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
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
