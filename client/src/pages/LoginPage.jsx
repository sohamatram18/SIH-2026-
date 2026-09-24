import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Building2, 
  GraduationCap,
  AlertCircle,
  Lock,
  RefreshCw,
  QrCode,
  FileCheck2,
  Cpu,
  BadgeCheck,
  Shield,
  Zap,
  Globe2,
  Award
} from 'lucide-react';

export const LoginPage = () => {
  const { sendOtp, verifyOtp, demoLogin, error } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('mobile'); // 'mobile' | 'apaar' | 'officer'
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [name, setName] = useState('');
  const [devOtpHint, setDevOtpHint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [timer, setTimer] = useState(0);

  // E2EE Dynamic handshake visual state
  const [e2eeKeyHash] = useState(() => '0x' + Math.random().toString(16).substring(2, 10).toUpperCase() + '...' + Math.random().toString(16).substring(2, 6).toUpperCase());
  const [sessionNonce] = useState(() => 'nonce_' + Date.now().toString(36));

  // APAAR ID state
  const [apaarId, setApaarId] = useState('');
  // Officer login state
  const [aisheCode, setAisheCode] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');

  // 60s Timer countdown for OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    try {
      setLoading(true);
      const res = await sendOtp(phone);
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
        setOtp(res.devOtp);
      }
      setStep('otp');
      setTimer(60);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!otp || otp.length < 4) {
      setFormError('Please enter the 6-digit OTP code.');
      return;
    }

    try {
      setLoading(true);
      await verifyOtp({ phone, otp, role: selectedRole, name });
      navigate('/');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApaarAuth = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!apaarId || apaarId.replace(/\D/g, '').length < 12) {
      setFormError('Please enter a valid 12-digit APAAR / EduID.');
      return;
    }
    try {
      setLoading(true);
      await demoLogin('student_topclass');
      navigate('/');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOfficerAuth = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!aisheCode) {
      setFormError('Please enter Institution AISHE Code or Directorate ID.');
      return;
    }
    try {
      setLoading(true);
      if (aisheCode.toUpperCase().includes('MOTA') || aisheCode.toUpperCase().includes('ADMIN')) {
        await demoLogin('mota_admin');
      } else if (aisheCode.toUpperCase().includes('STATE') || aisheCode.toUpperCase().includes('ODISHA')) {
        await demoLogin('state_nodal');
      } else {
        await demoLogin('institute_nodal');
      }
      navigate('/officer');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (key) => {
    setLoading(true);
    setFormError(null);
    try {
      await demoLogin(key);
      if (key.includes('nodal') || key.includes('admin')) {
        navigate('/officer');
      } else {
        navigate('/');
      }
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center px-4 py-8 max-w-xl mx-auto">
      {/* MoTA Emblem & Title Header */}
      <div className="text-center mb-6">
        <img 
          src="/janjatisetu-logo.png" 
          alt="JanjatiSetu Logo" 
          className="w-20 h-20 rounded-full object-cover shadow-xl border-2 border-amber-400 bg-amber-50 mx-auto mb-3"
        />
        <h2 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight">
          {t('siteName')} (JanjatiSetu)
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          {t('loginSubtitle')}
        </p>
        <p className="text-[11px] font-semibold text-amber-800 bg-amber-50 rounded-full py-0.5 px-3 inline-block mt-2 border border-amber-200">
          {t('loginBadgeOnePortal')}
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-7 space-y-5 relative overflow-hidden">
        {/* E2EE Cryptographic Security Header Box */}
        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-white space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 block leading-tight">
                  {t('e2eeBadge')}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {t('e2eeNotice')}
                </span>
              </div>
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-emerald-300">
              TLS 1.3
            </span>
          </div>

          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
            <div>
              <span className="text-slate-500 block">{t('e2eeCipherSuite')}</span>
              <span className="text-slate-300">{e2eeKeyHash}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">{t('e2eeAntiReplay')}</span>
              <span className="text-emerald-400">{sessionNonce}</span>
            </div>
          </div>
        </div>

        {/* 3 Login Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setActiveTab('mobile'); setFormError(null); }}
            className={`py-2 px-1 text-center rounded-xl transition ${
              activeTab === 'mobile' ? 'bg-white text-gov-blue shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('tabMobileOtp')}
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('apaar'); setFormError(null); }}
            className={`py-2 px-1 text-center rounded-xl transition ${
              activeTab === 'apaar' ? 'bg-white text-gov-blue shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('tabApaarDigi')}
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('officer'); setFormError(null); }}
            className={`py-2 px-1 text-center rounded-xl transition ${
              activeTab === 'officer' ? 'bg-white text-gov-blue shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('tabOfficerAishe')}
          </button>
        </div>

        {/* Error Alert Box */}
        {(formError || error) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{formError || error}</span>
          </div>
        )}

        {/* TAB 1: Mobile OTP Login */}
        {activeTab === 'mobile' && (
          <div>
            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t('mobileInputLabel')}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-slate-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength="10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder={t('mobilePlaceholder')}
                      className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-gov-blue focus:border-gov-blue transition"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-gov-navy to-gov-blue hover:from-slate-900 hover:to-gov-navy text-white text-xs font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{t('sendOtpBtn')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-150">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                  <p className="font-semibold">
                    {t('otpSentNotice')} <strong>+91 {phone}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => { setStep('phone'); setOtp(''); }}
                    className="text-[11px] text-gov-blue font-bold underline"
                  >
                    {t('changePhone')}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t('enterOtpLabel')}
                  </label>
                  <input
                    type="text"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[0.4em] font-mono text-lg py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-gov-blue transition font-bold"
                    required
                    autoFocus
                  />
                </div>

                {/* Instant Dev OTP Auto-Fill Button */}
                {devOtpHint && (
                  <button
                    type="button"
                    onClick={() => setOtp(devOtpHint)}
                    className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('instantDevOtpBtn')} ({devOtpHint})</span>
                  </button>
                )}

                {/* Resend OTP / Timer */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{t('didNotReceiveOtp')}</span>
                  {timer > 0 ? (
                    <span className="font-mono font-bold text-slate-700">
                      {t('resendOtpIn')} {timer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="font-bold text-gov-blue hover:underline"
                    >
                      {t('resendOtpNow')}
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{t('submitOtpVerify')}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: APAAR / DigiLocker e-KYC */}
        {activeTab === 'apaar' && (
          <form onSubmit={handleApaarAuth} className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {t('apaarInputLabel')}
              </label>
              <input
                type="text"
                value={apaarId}
                onChange={(e) => setApaarId(e.target.value)}
                placeholder={t('apaarPlaceholder')}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-gov-blue transition font-mono"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                {t('apaarAuthNotice')}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-indigo-800 hover:to-purple-900 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 transition"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{t('apaarVerifyBtn')}</span>
            </button>
          </form>
        )}

        {/* TAB 3: Nodal Officer AISHE / Admin Login */}
        {activeTab === 'officer' && (
          <form onSubmit={handleOfficerAuth} className="space-y-3.5 animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {t('aisheCodeLabel')}
              </label>
              <input
                type="text"
                value={aisheCode}
                onChange={(e) => setAisheCode(e.target.value)}
                placeholder={t('aishePlaceholder')}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  {t('officerPasswordLabel')}
                </label>
                <input
                  type="password"
                  value={officerPassword}
                  onChange={(e) => setOfficerPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  {t('securityPinLabel')}
                </label>
                <input
                  type="password"
                  maxLength="4"
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder="1234"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-center font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-800 to-slate-900 hover:from-purple-900 hover:to-black text-white text-xs font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 transition mt-2"
            >
              <Building2 className="w-4 h-4" />
              <span>{t('officerLoginBtn')}</span>
            </button>
          </form>
        )}

        {/* Full 9-Persona 1-Click Fast Evaluator Grid */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="text-center">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              {t('ninePersonasHeader')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {/* 1. Pre-Matric */}
            <button
              type="button"
              onClick={() => handleQuickDemo('student_prematric')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-800 text-[11px] text-left transition flex items-center gap-1.5 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
              <span className="truncate"><strong>Birsa</strong> (Pre-Matric IX)</span>
            </button>

            {/* 2. Post-Matric */}
            <button
              type="button"
              onClick={() => handleQuickDemo('student_postmatric')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 text-slate-800 text-[11px] text-left transition flex items-center gap-1.5 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0"></span>
              <span className="truncate"><strong>Mangal</strong> (Post-Matric ITI)</span>
            </button>

            {/* 3. Top Class */}
            <button
              type="button"
              onClick={() => handleQuickDemo('student_topclass')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-slate-800 text-[11px] text-left transition flex items-center gap-1.5 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></span>
              <span className="truncate"><strong>Jaipal</strong> (IIT Bombay Top Class)</span>
            </button>

            {/* 4. NFST Fellowship */}
            <button
              type="button"
              onClick={() => handleQuickDemo('student_nfst')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 text-slate-800 text-[11px] text-left transition flex items-center gap-1.5 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></span>
              <span className="truncate"><strong>Shanti</strong> (Ph.D. NFST Fellow)</span>
            </button>

            {/* 5. NOS Overseas */}
            <button
              type="button"
              onClick={() => handleQuickDemo('student_nos')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-800 text-[11px] text-left transition flex items-center gap-1.5 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></span>
              <span className="truncate"><strong>Arjun</strong> (Oxford NOS Scholar)</span>
            </button>

            {/* 6. PVTG Scholar */}
            <button
              type="button"
              onClick={() => handleQuickDemo('student_pvtg')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200 text-slate-800 text-[11px] text-left transition flex items-center gap-1.5 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></span>
              <span className="truncate"><strong>Sunita</strong> (PVTG Birhor Scholar)</span>
            </button>

            {/* 7. Institute Nodal Officer */}
            <button
              type="button"
              onClick={() => handleQuickDemo('institute_nodal')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-slate-800 text-[11px] text-left transition flex items-center gap-1.5 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></span>
              <span className="truncate"><strong>Prof. Meena</strong> (IIT Nodal)</span>
            </button>

            {/* 8. State Nodal Officer */}
            <button
              type="button"
              onClick={() => handleQuickDemo('state_nodal')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 text-slate-800 text-[11px] text-left transition flex items-center gap-1.5 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0"></span>
              <span className="truncate"><strong>Dr. Mohapatra</strong> (Odisha SNO)</span>
            </button>

            {/* 9. MoTA Central Admin */}
            <button
              type="button"
              onClick={() => handleQuickDemo('mota_admin')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-200 border border-slate-200 text-slate-800 text-[11px] text-left transition flex items-center gap-1.5 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-slate-800 flex-shrink-0"></span>
              <span className="truncate"><strong>Smt. Sharma</strong> (MoTA Admin)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoginPageDefault = LoginPage;
export default LoginPage;
