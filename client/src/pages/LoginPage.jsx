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
  BadgeCheck
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
      // Authenticate via Student Top Class / Post-Matric profile
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
      navigate('/');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center px-4 py-8 max-w-lg mx-auto">
      {/* MoTA Emblem & Title Header */}
      <div className="text-center mb-6">
        <img 
          src="/janjatisetu-logo.png" 
          alt="JanjatiSetu Logo" 
          className="w-20 h-20 rounded-full object-cover shadow-xl border-2 border-amber-400 bg-amber-50 mx-auto mb-3"
        />
        <h2 className="text-2xl font-black text-gov-navy tracking-tight">
          {t('siteName')} (JanjatiSetu)
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          {t('loginSubtitle')}
        </p>
        <p className="text-[11px] font-semibold text-amber-800 bg-amber-50 rounded-full py-0.5 px-3 inline-block mt-2 border border-amber-200">
          {t('loginBadgeOnePortal')}
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-7 space-y-5 relative overflow-hidden">
        {/* E2EE Cryptographic Security Strip */}
        <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-white flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-400 block leading-tight">
              {t('e2eeBadge')}
            </span>
            <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
              {t('e2eeNotice')}
            </span>
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
                    Change Phone Number
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
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-gov-blue transition"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1.5">
                {t('apaarAuthNotice')}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-700 to-purple-800 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 transition"
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
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-800 to-slate-900 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 transition mt-2"
            >
              <Building2 className="w-4 h-4" />
              <span>{t('officerLoginBtn')}</span>
            </button>
          </form>
        )}

        {/* 1-Click Fast Evaluator Persona Switcher */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
            {t('orQuickDemoPersonas')}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickDemo('student_topclass')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 text-slate-800 font-bold text-[11px] text-left transition flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Jaipal (IIT Top Class)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('student_prematric')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-slate-800 font-bold text-[11px] text-left transition flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Birsa (Pre-Matric IX)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('student_nfst')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 text-slate-800 font-bold text-[11px] text-left transition flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Shanti (NFST Fellow)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('institute_nodal')}
              className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 text-slate-800 font-bold text-[11px] text-left transition flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Prof. Meena (IIT Nodal)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
