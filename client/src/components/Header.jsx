import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useNavigate } from 'react-router-dom';
import { notificationAPI } from '../services/api.js';
import { NotificationsDrawer } from './NotificationsDrawer.jsx';
import { VerificationQueueDrawer } from './VerificationQueueDrawer.jsx';
import { 
  Building2, 
  Globe, 
  LogOut, 
  User as UserIcon, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  Users,
  Bell,
  ShieldAlert,
  HelpCircle,
  BarChart3,
  Bot
} from 'lucide-react';

export const Header = ({ onOpenJago }) => {
  const { user, student, logout, demoLogin } = useAuth();
  const { currentLanguage, setLanguage, t, languages } = useLanguage();
  const navigate = useNavigate();
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [reviewQueueOpen, setReviewQueueOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isOfficer = user && ['institute_nodal', 'state_nodal', 'mota_admin'].includes(user.role);

  useEffect(() => {
    if (user) {
      notificationAPI.getNotifications().then((res) => {
        if (res.data?.success) {
          setUnreadCount(res.data.unreadCount || 0);
        }
      }).catch(() => {});
    }
  }, [user]);

  const demoRoles = [
    { key: 'student_prematric', label: 'Birsa Munda (Class IX, Pre-Matric)', role: 'student' },
    { key: 'student_postmatric', label: 'Rani Gond (B.Sc Nursing, Post-Matric)', role: 'student' },
    { key: 'student_topclass', label: 'Jaipal Singh (IIT Bombay, Top Class, Divyang)', role: 'student' },
    { key: 'student_nfst', label: 'Shanti Birhor (PhD, NFST Fellow, PVTG)', role: 'student' },
    { key: 'student_nos', label: 'Mangal Oraon (Abroad Aspirant, NOS)', role: 'student' },
    { key: 'guardian', label: 'Somra Munda (Family Guardian View)', role: 'guardian' },
    { key: 'institute_nodal', label: 'Prof. Meena (IIT Bombay Nodal Officer)', role: 'institute_nodal' },
    { key: 'state_nodal', label: 'Rajeshwar Hembram (Odisha State Officer)', role: 'state_nodal' },
    { key: 'mota_admin', label: 'Dr. Rameshwar Oraon (MoTA Central Admin)', role: 'mota_admin' },
  ];

  const handleDemoSwitch = async (key) => {
    setDemoMenuOpen(false);
    await demoLogin(key);
    navigate('/');
  };

  const getRoleBadge = () => {
    if (!user) return null;
    switch (user.role) {
      case 'mota_admin':
        return <span className="bg-purple-100 text-purple-900 text-xs px-2 py-0.5 rounded-full font-semibold border border-purple-300">MoTA Admin</span>;
      case 'institute_nodal':
        return <span className="bg-blue-100 text-blue-900 text-xs px-2 py-0.5 rounded-full font-semibold border border-blue-300">Institute Nodal</span>;
      case 'state_nodal':
        return <span className="bg-emerald-100 text-emerald-900 text-xs px-2 py-0.5 rounded-full font-semibold border border-emerald-300">State Nodal</span>;
      case 'guardian':
        return <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-full font-semibold border border-amber-300">Guardian</span>;
      default:
        return (
          <span className="bg-amber-50 text-amber-900 text-xs px-2 py-0.5 rounded-full font-semibold border border-amber-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            ST Student
          </span>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        {/* Tri-color Top Accent Ribbon */}
        <div className="gov-tricolor-bar"></div>

        {/* Top Ministry Bar */}
        <div className="bg-gov-navy text-white px-3 sm:px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Government Emblem & Title */}
            <div 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-white shadow-inner flex-shrink-0 border-2 border-amber-200/50 text-xs sm:text-sm">
                🇮🇳
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] sm:text-xs text-amber-300 font-semibold tracking-wider uppercase">
                    {t('govIndia')}
                  </span>
                  <span className="hidden sm:inline-block text-slate-400 text-xs">|</span>
                  <span className="hidden sm:inline-block text-[11px] text-slate-300">
                    {t('ministryName')}
                  </span>
                </div>
                <h1 className="text-sm sm:text-base font-bold text-white leading-tight">
                  {t('portalTitle')}
                </h1>
              </div>
            </div>

            {/* Quick Controls: Demo Switcher, Notification Bell, Officer Queue, Auth */}
            <div className="flex items-center gap-2">
              {/* Quick Demo Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                  className="bg-gov-blue hover:bg-slate-700 text-amber-300 border border-amber-400/40 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                  title="Quick Demo Role Switcher"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline font-medium">{t('demoPersona')}</span>
                  <ChevronDown className="w-3 h-3 text-slate-300" />
                </button>

                {demoMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800">
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Switch Demo Role (1-Click)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Evaluates different scheme states and dashboards
                      </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto py-1">
                      {demoRoles.map((dr) => (
                        <button
                          key={dr.key}
                          onClick={() => handleDemoSwitch(dr.key)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-amber-50 hover:text-amber-900 flex flex-col transition"
                        >
                          <span className="font-semibold text-slate-900">{dr.label}</span>
                          <span className="text-[10px] text-slate-500 uppercase">{dr.role.replace('_', ' ')}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Officer Console Navigation Button */}
              {isOfficer && (
                <button
                  onClick={() => navigate('/officer')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition shadow"
                  title="Officer Operational Console"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('officerConsole')}</span>
                </button>
              )}

              {/* Officer Review Queue Button */}
              {isOfficer && (
                <button
                  onClick={() => setReviewQueueOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition shadow"
                  title="Review Queue (Manual Exceptions)"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('reviewQueue')}</span>
                </button>
              )}

              {/* Ask JAGO Trigger in Header */}
              {onOpenJago && (
                <button
                  onClick={onOpenJago}
                  className="bg-amber-400 hover:bg-amber-500 text-gov-navy text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition shadow"
                  title="Ask JAGO AI Assistant"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Ask JAGO</span>
                </button>
              )}

              {/* Notification Bell */}
              {user && (
                <button
                  onClick={() => setNotificationsOpen(true)}
                  className="relative p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
                  title="Notifications & Alerts"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-gov-navy animate-pulse"></span>
                  )}
                </button>
              )}

              {/* Grievance Redressal Direct Link */}
              <button
                onClick={() => navigate('/grievance')}
                className="hidden sm:flex text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
                title="Grievance Redressal Support"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {/* Language Switcher */}
              <div className="hidden md:flex items-center bg-slate-800/80 rounded-lg px-2 py-1 text-xs text-slate-200 border border-slate-700">
                <Globe className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <select
                  value={currentLanguage}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code} className="bg-slate-800 text-white">
                      {l.nativeName} ({l.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* Logout / Sign In */}
              {user ? (
                <button
                  onClick={logout}
                  className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                >
                  {t('signIn')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sub-Header: Active Persona Banner & Quick Identity */}
        {user && (
          <div className="bg-slate-50 px-3 sm:px-6 py-1.5 border-b border-slate-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 max-w-[70%] truncate">
              <UserIcon className="w-3.5 h-3.5 text-gov-blue flex-shrink-0" />
              <span className="font-semibold text-slate-800 truncate">
                {student?.name || user.name || 'User'}
              </span>
              {student?.tribe && (
                <span className="hidden sm:inline-block text-slate-500">
                  • Tribe: <strong className="text-slate-700">{student.tribe}</strong>
                </span>
              )}
              {student?.isPVTG && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-300">
                  PVTG
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {getRoleBadge()}
            </div>
          </div>
        )}
      </header>

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      {/* Officer Manual Review Queue Drawer */}
      <VerificationQueueDrawer
        isOpen={reviewQueueOpen}
        onClose={() => setReviewQueueOpen(false)}
      />
    </>
  );
};

export default Header;
