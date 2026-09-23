import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { notificationAPI } from '../../services/api.js';
import { NotificationsDrawer } from '../NotificationsDrawer.jsx';
import { VerificationQueueDrawer } from '../VerificationQueueDrawer.jsx';
import {
  Search,
  ChevronDown,
  Globe,
  Bell,
  User as UserIcon,
  LogOut,
  Sparkles,
  ShieldCheck,
  Building2,
  GraduationCap,
  Calculator,
  Layers,
  FileText,
  HelpCircle,
  Menu,
  X,
  Bot,
  ExternalLink,
  BookOpen,
  Landmark,
  Compass,
  CreditCard,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const HeaderNav = ({ onOpenJago, onOpenCompare }) => {
  const { user, student, logout, demoLogin } = useAuth();
  const { currentLanguage, setLanguage, t, languages } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState(null);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [reviewQueueOpen, setReviewQueueOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const searchRef = useRef(null);
  const langMenuRef = useRef(null);
  const megaMenuTimeoutRef = useRef(null);

  const isOfficer = user && ['institute_nodal', 'state_nodal', 'mota_admin'].includes(user.role);

  // Search catalog with keywords
  const searchableItems = [
    { title: 'Pre-Matric Scholarship for ST Students', category: 'Scheme', code: 'PRE_MATRIC', link: '/apply/PRE_MATRIC', desc: 'Class IX & X in Govt / EMRS schools (₹3,500 - ₹7,000/yr)' },
    { title: 'Post-Matric Scholarship for ST Students', category: 'Scheme', code: 'POST_MATRIC', link: '/apply/POST_MATRIC', desc: 'Class XI to Post-Doctoral degree courses' },
    { title: 'National Higher Education Scholarship (Top Class)', category: 'Scheme', code: 'TOP_CLASS', link: '/apply/TOP_CLASS', desc: 'IITs, IIMs, AIIMS, NITs (Full fee + ₹45,000 Laptop Grant)' },
    { title: 'National Fellowship for ST Students (NFST)', category: 'Scheme', code: 'NFST', link: '/apply/NFST', desc: 'M.Phil & Ph.D Scholars in UGC Universities (₹31,000/mo JRF)' },
    { title: 'National Overseas Scholarship (NOS)', category: 'Scheme', code: 'NOS', link: '/apply/NOS', desc: 'Master & Ph.D in Top 500 QS World Universities ($15,400/yr)' },
    { title: 'Top 246 Premier Institutes Directory', category: 'Institutes', link: '/schemes', desc: 'AISHE codes, IIT Bombay, IIM Ahmedabad, AIIMS New Delhi' },
    { title: 'DigiLocker Digital Document Wallet', category: 'Tool', link: '/wallet', desc: '1-click Aadhaar, Caste & Income Certificate vault' },
    { title: 'PFMS DBT Sanction & Payment Ledger', category: 'DBT Tracker', link: '/payments', desc: 'Track Aadhaar APBS bank transfer & UTR reference' },
    { title: 'Scholarship Allowance & Entitlement Calculator', category: 'Tool', action: 'calculator', desc: 'Calculate maintenance allowance, book grant & laptop allowance' },
    { title: 'Side-by-Side Scheme Comparison Matrix', category: 'Tool', action: 'compare', desc: 'Compare benefits, income cap and deadlines across 5 MoTA schemes' },
    { title: 'Grievance Redressal & Support Desk', category: 'Services', link: '/grievance', desc: 'File appeal, track query status with Central MoTA officer' }
  ];

  const filteredSearch = searchQuery.trim() === ''
    ? []
    : searchableItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );

  useEffect(() => {
    if (user) {
      notificationAPI.getNotifications().then((res) => {
        if (res.data?.success) {
          setUnreadCount(res.data.unreadCount || 0);
        }
      }).catch(() => {});
    }
  }, [user]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMegaMenuEnter = (menuKey) => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setActiveMegaMenu(menuKey);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 200);
  };

  const demoRoles = [
    { key: 'student_prematric', label: 'Birsa Munda (Class IX, Pre-Matric)', role: 'student', tag: 'Class IX' },
    { key: 'student_postmatric', label: 'Rani Gond (B.Sc Nursing, Post-Matric)', role: 'student', tag: 'College' },
    { key: 'student_topclass', label: 'Jaipal Singh (IIT Bombay, Top Class, Divyang)', role: 'student', tag: 'IIT B.Tech' },
    { key: 'student_nfst', label: 'Shanti Birhor (PhD, NFST Fellow, PVTG)', role: 'student', tag: 'PhD Fellow' },
    { key: 'student_nos', label: 'Mangal Oraon (Oxford Univ Aspirant, NOS)', role: 'student', tag: 'Abroad' },
    { key: 'guardian', label: 'Somra Munda (Family Guardian View)', role: 'guardian', tag: 'Parent' },
    { key: 'institute_nodal', label: 'Prof. Meena (IIT Bombay Nodal Officer)', role: 'institute_nodal', tag: 'AISHE Officer' },
    { key: 'state_nodal', label: 'Rajeshwar Hembram (Odisha State Officer)', role: 'state_nodal', tag: 'State Scrutiny' },
    { key: 'mota_admin', label: 'Dr. Rameshwar Oraon (MoTA Central Admin)', role: 'mota_admin', tag: 'National Admin' },
  ];

  const handleDemoSwitch = async (key) => {
    setDemoMenuOpen(false);
    await demoLogin(key);
    navigate('/');
  };

  const handleSearchSelect = (item) => {
    setSearchOpen(false);
    setSearchQuery('');
    if (item.action === 'compare' && onOpenCompare) {
      onOpenCompare();
    } else if (item.action === 'calculator') {
      const calcEl = document.getElementById('calculator-section');
      if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
      else navigate('/#calculator-section');
    } else if (item.link) {
      navigate(item.link);
    }
  };

  const currentLangObj = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
        {/* Tri-color Accent Bar */}
        <div className="gov-tricolor-bar"></div>

        {/* Top Government Strip */}
        <div className="bg-slate-900 text-slate-200 text-xs px-3 sm:px-6 py-1.5 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-medium tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {t('govIndia')} | {t('ministryName')}
              </span>
              <span className="hidden md:inline text-slate-500">|</span>
              <span className="hidden md:inline text-slate-400">
                {t('dbtMissionCompliance')}
              </span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Language Switcher */}
              <div ref={langMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition border border-amber-400/30"
                  aria-label="Change Language"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentLangObj.native}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {langMenuOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-2xl border border-slate-200 py-1 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Language / भाषा चुनें
                    </div>
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLanguage(l.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-50 hover:text-amber-900 transition ${
                          currentLanguage === l.code ? 'font-black text-amber-900 bg-amber-100/60' : 'text-slate-700'
                        }`}
                      >
                        <span className="font-bold">{l.native}</span>
                        <span className="text-[10px] text-slate-400">{l.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Demo Persona Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/30 border border-amber-400/40 text-amber-300 font-medium hover:from-amber-500/30 hover:to-amber-600/40 transition"
                  title="Switch 9 Demo Roles"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{t('roleSwitcher')}</span>
                  <span className="sm:hidden">Roles</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {demoMenuOpen && (
                  <div className="absolute right-0 mt-1 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 text-slate-800 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-xl">
                      <div>
                        <p className="font-bold text-xs text-slate-800">{t('demoPersonas')}</p>
                        <p className="text-[10px] text-slate-500">{t('demoSub')}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-semibold text-[10px] rounded-full">
                        {t('ninePersonas')}
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-100">
                      {demoRoles.map((role) => (
                        <button
                          key={role.key}
                          type="button"
                          onClick={() => handleDemoSwitch(role.key)}
                          className="w-full text-left px-4 py-2 hover:bg-amber-50/70 transition flex items-center justify-between group"
                        >
                          <div>
                            <div className="font-medium text-xs text-slate-800 group-hover:text-amber-900">
                              {role.label.split(' (')[0]}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              ({role.label.split(' (')[1]}
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-amber-200 group-hover:text-amber-950">
                            {role.tag}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Brand & Global Search Bar */}
        <div className="bg-white px-3 sm:px-6 py-2.5 sm:py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Logo & JanjatiSetu Name */}
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-3 cursor-pointer flex-shrink-0 group"
            >
              <img 
                src="/janjatisetu-logo.png" 
                alt="JanjatiSetu Logo" 
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shadow-md border-2 border-amber-400 bg-amber-50 flex-shrink-0 group-hover:scale-105 transition"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-black text-slate-900 text-base sm:text-lg tracking-tight leading-tight flex items-center gap-1.5">
                    <span>{t('siteName')}</span>
                    {t('siteName') !== 'JanjatiSetu' && (
                      <span className="text-xs text-slate-400 font-semibold">(JanjatiSetu)</span>
                    )}
                  </h1>
                  <span className="hidden md:inline px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                    MoTA
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  {t('siteTagline')} • {t('govIndia')}
                </p>
              </div>
            </div>

            {/* Global Search Bar with Typeahead */}
            <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
              <div className="relative flex items-center">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-10 pr-20 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-300 focus:border-gov-blue rounded-full focus:ring-2 focus:ring-blue-100 transition shadow-inner"
                />
                <div className="absolute right-3 flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <kbd className="hidden lg:inline px-1.5 py-0.5 bg-slate-200 border border-slate-300 rounded font-mono text-[10px] text-slate-600">
                    /
                  </kbd>
                </div>
              </div>

              {/* Typeahead Search Results Dropdown */}
              {searchOpen && searchQuery.trim() !== '' && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-slate-800">{t('matchingResults')} ({filteredSearch.length})</span>
                    <span className="text-[11px]">ESC to close</span>
                  </div>

                  {filteredSearch.length === 0 ? (
                    <div className="px-4 py-6 text-center text-slate-500 text-xs">
                      <HelpCircle className="w-6 h-6 mx-auto text-slate-300 mb-2" />
                      No exact matches for "{searchQuery}".
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto py-1 divide-y divide-slate-50">
                      {filteredSearch.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSearchSelect(item)}
                          className="px-4 py-2.5 hover:bg-blue-50/70 cursor-pointer transition flex items-start gap-3 group"
                        >
                          <div className="p-1.5 rounded-lg bg-blue-100 text-gov-blue group-hover:bg-gov-blue group-hover:text-white transition mt-0.5">
                            {item.category === 'Scheme' ? <Award className="w-4 h-4" /> :
                             item.category === 'Institutes' ? <Building2 className="w-4 h-4" /> :
                             item.category === 'Tool' ? <Calculator className="w-4 h-4" /> :
                             <CreditCard className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-slate-900 group-hover:text-gov-blue truncate">
                                {item.title}
                              </p>
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-gov-blue transition self-center" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Ask JAGO Prompt in Search */}
                  <div 
                    onClick={() => { setSearchOpen(false); onOpenJago?.(); }}
                    className="mt-2 mx-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between cursor-pointer hover:bg-amber-100/60 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-amber-700" />
                      <span className="text-xs font-bold text-amber-900">
                        {t('cantFindAskJago')}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-800 flex items-center gap-0.5">
                      {t('askJago')} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Action Icons & Auth Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Notifications */}
              {user && (
                <button
                  onClick={() => setNotificationsOpen(true)}
                  className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 transition"
                  title="Notifications & Sanctions"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}

              {/* JAGO AI Trigger Button */}
              <button
                onClick={onOpenJago}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-full font-bold text-xs shadow-sm transition hover:scale-105"
                title="Ask JAGO AI Assistant"
              >
                <Bot className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">{t('askJago')}</span>
              </button>

              {/* User Account / Login Button */}
              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
                  >
                    <div className="w-6 h-6 rounded-full bg-gov-blue text-white flex items-center justify-center font-bold text-[10px]">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <span className="hidden sm:inline max-w-[100px] truncate">{user.name || t('profile')}</span>
                  </button>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title={t('signOut')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-1.5 rounded-full bg-gov-navy hover:bg-gov-blue text-white font-bold text-xs shadow-sm transition"
                >
                  {t('signIn')}
                </button>
              )}

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Navigation Bar */}
        <nav className="hidden md:block bg-gov-navy text-white border-t border-slate-800 relative shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <ul className="flex items-center space-x-1 lg:space-x-2 text-xs font-bold tracking-wide">
              {/* Home */}
              <li>
                <button
                  onClick={() => navigate('/')}
                  className={`px-3 py-3 rounded hover:bg-slate-800 transition flex items-center gap-1.5 ${
                    location.pathname === '/' ? 'text-amber-400 bg-slate-800' : 'text-slate-200'
                  }`}
                >
                  {t('home')}
                </button>
              </li>

              {/* Schemes Mega Menu */}
              <li
                onMouseEnter={() => handleMegaMenuEnter('schemes')}
                onMouseLeave={handleMegaMenuLeave}
                className="relative"
              >
                <button
                  onClick={() => navigate('/schemes')}
                  className={`px-3 py-3 rounded hover:bg-slate-800 transition flex items-center gap-1 ${
                    activeMegaMenu === 'schemes' || location.pathname === '/schemes' ? 'text-amber-400 bg-slate-800' : 'text-slate-200'
                  }`}
                >
                  {t('schemes')}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Schemes Mega Dropdown Panel */}
                {activeMegaMenu === 'schemes' && (
                  <div className="absolute top-full left-0 w-[680px] bg-white rounded-b-2xl shadow-2xl border border-slate-200 p-5 text-slate-800 z-50 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-gov-blue" />
                        {t('schoolHigherEd')}
                      </h4>
                      <div className="space-y-2">
                        <div 
                          onClick={() => { setActiveMegaMenu(null); navigate('/apply/PRE_MATRIC'); }}
                          className="p-2.5 rounded-xl hover:bg-blue-50 cursor-pointer transition border border-slate-100 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 group-hover:text-gov-blue">Pre-Matric ST Scholarship</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Class IX-X</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">₹3,500/yr (Day) • ₹7,000/yr (Hostel)</p>
                        </div>

                        <div 
                          onClick={() => { setActiveMegaMenu(null); navigate('/apply/POST_MATRIC'); }}
                          className="p-2.5 rounded-xl hover:bg-blue-50 cursor-pointer transition border border-slate-100 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 group-hover:text-gov-blue">Post-Matric ST Scholarship</span>
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">Class XI to PG</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">100% compulsory tuition + maintenance allowance</p>
                        </div>

                        <div 
                          onClick={() => { setActiveMegaMenu(null); navigate('/apply/TOP_CLASS'); }}
                          className="p-2.5 rounded-xl hover:bg-blue-50 cursor-pointer transition border border-amber-200 bg-amber-50/40 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 group-hover:text-gov-blue">Top-Class Higher Education</span>
                            <span className="text-[10px] bg-amber-200 text-amber-900 font-black px-1.5 py-0.2 rounded">₹45k Laptop</span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">IITs, IIMs, AIIMS (Full fee + ₹36k/yr living)</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-600" />
                        {t('fellowshipsAbroad')}
                      </h4>
                      <div className="space-y-2">
                        <div 
                          onClick={() => { setActiveMegaMenu(null); navigate('/apply/NFST'); }}
                          className="p-2.5 rounded-xl hover:bg-blue-50 cursor-pointer transition border border-slate-100 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 group-hover:text-gov-blue">National Fellowship (NFST)</span>
                            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded">Ph.D / M.Phil</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">₹31,000/mo JRF • ₹35,000/mo SRF + HRA</p>
                        </div>

                        <div 
                          onClick={() => { setActiveMegaMenu(null); navigate('/apply/NOS'); }}
                          className="p-2.5 rounded-xl hover:bg-blue-50 cursor-pointer transition border border-slate-100 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 group-hover:text-gov-blue">National Overseas Scholarship</span>
                            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded">Top 500 QS</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Full foreign tuition + $15,400/yr allowance</p>
                        </div>

                        <div 
                          onClick={() => { setActiveMegaMenu(null); navigate('/schemes'); }}
                          className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 cursor-pointer transition flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-xs text-amber-400">{t('viewAllSchemesMatrix')}</p>
                            <p className="text-[10px] text-slate-300">Eligibility rules, guidelines & timelines</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-amber-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>

              {/* Data & Tools Mega Menu */}
              <li
                onMouseEnter={() => handleMegaMenuEnter('tools')}
                onMouseLeave={handleMegaMenuLeave}
                className="relative"
              >
                <button
                  className={`px-3 py-3 rounded hover:bg-slate-800 transition flex items-center gap-1 ${
                    activeMegaMenu === 'tools' ? 'text-amber-400 bg-slate-800' : 'text-slate-200'
                  }`}
                >
                  {t('predictorsTools')}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {activeMegaMenu === 'tools' && (
                  <div className="absolute top-full left-0 w-[500px] bg-white rounded-b-2xl shadow-2xl border border-slate-200 p-4 text-slate-800 z-50 grid grid-cols-2 gap-3">
                    <div 
                      onClick={() => {
                        setActiveMegaMenu(null);
                        const calcEl = document.getElementById('calculator-section');
                        if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
                        else navigate('/#calculator-section');
                      }}
                      className="p-3 rounded-xl hover:bg-emerald-50 border border-slate-100 cursor-pointer transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-800">{t('allowanceCalculator')}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t('allowanceCalcSub')}</p>
                    </div>

                    <div 
                      onClick={() => {
                        setActiveMegaMenu(null);
                        if (onOpenCompare) onOpenCompare();
                      }}
                      className="p-3 rounded-xl hover:bg-blue-50 border border-slate-100 cursor-pointer transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-gov-blue flex items-center justify-center mb-2">
                        <Layers className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-gov-blue">{t('schemeComparator')}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t('schemeComparatorSub')}</p>
                    </div>

                    <div 
                      onClick={() => { setActiveMegaMenu(null); navigate('/wallet'); }}
                      className="p-3 rounded-xl hover:bg-indigo-50 border border-slate-100 cursor-pointer transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-800">{t('digilockerVault')}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t('digilockerVaultSub')}</p>
                    </div>

                    <div 
                      onClick={() => { setActiveMegaMenu(null); navigate('/payments'); }}
                      className="p-3 rounded-xl hover:bg-amber-50 border border-slate-100 cursor-pointer transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-900">{t('pfmsLedger')}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t('pfmsLedgerSub')}</p>
                    </div>
                  </div>
                )}
              </li>

              {/* Digital Wallet */}
              <li>
                <button
                  onClick={() => navigate('/wallet')}
                  className={`px-3 py-3 rounded hover:bg-slate-800 transition flex items-center gap-1.5 ${
                    location.pathname === '/wallet' ? 'text-amber-400 bg-slate-800' : 'text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {t('wallet')}
                </button>
              </li>

              {/* PFMS Payments */}
              <li>
                <button
                  onClick={() => navigate('/payments')}
                  className={`px-3 py-3 rounded hover:bg-slate-800 transition flex items-center gap-1.5 ${
                    location.pathname === '/payments' ? 'text-amber-400 bg-slate-800' : 'text-slate-200'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  {t('dbtTracker')}
                </button>
              </li>

              {/* Grievance & Help */}
              <li>
                <button
                  onClick={() => navigate('/grievance')}
                  className={`px-3 py-3 rounded hover:bg-slate-800 transition flex items-center gap-1.5 ${
                    location.pathname === '/grievance' ? 'text-amber-400 bg-slate-800' : 'text-slate-200'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                  {t('grievance')}
                </button>
              </li>

              {/* Officer Console */}
              {isOfficer && (
                <li>
                  <button
                    onClick={() => navigate('/officer')}
                    className={`px-3 py-3 rounded hover:bg-purple-900 transition flex items-center gap-1.5 font-black text-purple-300 ${
                      location.pathname === '/officer' ? 'bg-purple-900 text-white' : ''
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    {t('officerConsole')}
                  </button>
                </li>
              )}
            </ul>

            {/* Right Quick Action: Apply Now Badge */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/schemes')}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-full font-black text-xs flex items-center gap-1 transition shadow hover:scale-105"
              >
                <span>{t('applyForFY')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
            {/* Language Selector Mobile */}
            <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-amber-600" />
                Language / भाषा:
              </span>
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-900"
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code}>{l.native}</option>
                ))}
              </select>
            </div>

            {/* Accordion Categories */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/'); }}
                className="w-full py-2.5 flex items-center gap-2 font-bold text-slate-800 border-b border-slate-100 text-left"
              >
                {t('home')}
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/schemes'); }}
                className="w-full py-2.5 flex items-center gap-2 font-bold text-slate-800 border-b border-slate-100 text-left"
              >
                <GraduationCap className="w-4 h-4 text-gov-blue" />
                {t('schemes')}
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/wallet'); }}
                className="w-full py-2.5 flex items-center gap-2 font-bold text-slate-800 border-b border-slate-100 text-left"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                {t('wallet')}
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/payments'); }}
                className="w-full py-2.5 flex items-center gap-2 font-bold text-slate-800 border-b border-slate-100 text-left"
              >
                <CreditCard className="w-4 h-4 text-amber-600" />
                {t('dbtTracker')}
              </button>

              <button
                onClick={() => { setMobileMenuOpen(false); navigate('/grievance'); }}
                className="w-full py-2.5 flex items-center gap-2 font-bold text-slate-800 border-b border-slate-100 text-left"
              >
                <HelpCircle className="w-4 h-4 text-blue-600" />
                {t('grievance')}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Notifications Drawer */}
      <NotificationsDrawer isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

      {/* Review Queue Drawer for Officers */}
      <VerificationQueueDrawer isOpen={reviewQueueOpen} onClose={() => setReviewQueueOpen(false)} />
    </>
  );
};

export default HeaderNav;
