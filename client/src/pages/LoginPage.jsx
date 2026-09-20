import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
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
  AlertCircle
} from 'lucide-react';

export const LoginPage = () => {
  const { sendOtp, verifyOtp, demoLogin, error } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [name, setName] = useState('');
  const [devOtpHint, setDevOtpHint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

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
        setOtp(res.devOtp); // pre-fill for ease of testing
      }
      setStep('otp');
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
      setFormError('Please enter the 6-digit OTP sent to your phone.');
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
    <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center px-4 py-8 max-w-md mx-auto">
      {/* MoTA Emblem & Title Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-gov-navy to-gov-blue text-white shadow-lg mb-3 border-2 border-amber-300">
          <GraduationCap className="w-8 h-8 text-amber-300" />
        </div>
        <h2 className="text-2xl font-extrabold text-gov-navy tracking-tight">
          Unified Tribal Scholarship Portal
        </h2>
        <p className="text-xs text-slate-600 mt-1">
          Ministry of Tribal Affairs (MoTA), Government of India
        </p>
        <p className="text-[11px] font-medium text-amber-700 bg-amber-50 rounded-full py-0.5 px-3 inline-block mt-2 border border-amber-200">
          Single Portal for All 5 MoTA Schemes (Pre/Post-Matric, Top Class, NFST, NOS)
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white rounded-2xl shadow-gov-lg border border-slate-200 p-6">
        {(formError || error) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{formError || error}</span>
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Enter Mobile Number (Aadhaar / DBT Linked)
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
                  placeholder="98765 43210"
                  className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-gov-blue focus:border-gov-blue transition"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                A 6-digit OTP will be sent to your mobile for passwordless sign-in.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Account Type / Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-gov-blue"
              >
                <option value="student">🎓 ST Student (Applicant)</option>
                <option value="guardian">👨‍👧 Guardian / Parent (Multiple Children)</option>
                <option value="institute_nodal">🏫 Institute Nodal Officer</option>
                <option value="state_nodal">🏛️ State Nodal Officer</option>
                <option value="mota_admin">🛡️ MoTA Central Administrator</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="w-full bg-gov-blue hover:bg-gov-navy text-white font-bold py-3 px-4 rounded-xl text-sm shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Sending OTP via SMS...</span>
              ) : (
                <>
                  <span>Get OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Enter 6-Digit OTP
                </label>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs text-gov-blue hover:underline font-semibold"
                >
                  Change Mobile
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center text-lg font-bold tracking-widest text-slate-800 focus:bg-white focus:ring-2 focus:ring-gov-blue"
                  required
                />
              </div>

              {devOtpHint && (
                <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Dev Mock OTP: <strong>{devOtpHint}</strong> (auto-filled)</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full bg-gov-blue hover:bg-gov-navy text-white font-bold py-3 px-4 rounded-xl text-sm shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Continue'}
            </button>
          </form>
        )}

        {/* DPDP Act 2023 Trust Seal */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>DPDP Act 2023 Compliant. Raw Aadhaar is never stored.</span>
        </div>
      </div>

      {/* 1-Click Demo Evaluation Presets */}
      <div className="mt-6 bg-amber-50/70 border border-amber-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
            Quick 1-Click Demo Roles (Instant Evaluation)
          </h3>
        </div>
        <p className="text-[11px] text-amber-800 mb-3">
          Click any persona below to test pre-seeded profiles and schemes:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => handleQuickDemo('student_prematric')}
            className="p-2.5 bg-white hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition flex flex-col"
          >
            <span className="font-bold text-slate-800">Birsa Munda (Pre-Matric)</span>
            <span className="text-[10px] text-slate-500">Class IX, Santhal Tribe, Odisha</span>
          </button>

          <button
            onClick={() => handleQuickDemo('student_topclass')}
            className="p-2.5 bg-white hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition flex flex-col"
          >
            <span className="font-bold text-slate-800">Jaipal Singh (Top Class)</span>
            <span className="text-[10px] text-slate-500">IIT Bombay, Divyang, Munda Tribe</span>
          </button>

          <button
            onClick={() => handleQuickDemo('student_nfst')}
            className="p-2.5 bg-white hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition flex flex-col"
          >
            <span className="font-bold text-slate-800">Shanti Birhor (NFST Fellow)</span>
            <span className="text-[10px] text-slate-500">Ph.D. JNU, PVTG Birhor Community</span>
          </button>

          <button
            onClick={() => handleQuickDemo('guardian')}
            className="p-2.5 bg-white hover:bg-amber-100 border border-amber-200 rounded-xl text-left transition flex flex-col"
          >
            <span className="font-bold text-slate-800">Somra Munda (Guardian)</span>
            <span className="text-[10px] text-slate-500">Family Multi-Child Dashboard</span>
          </button>

          <button
            onClick={() => handleQuickDemo('mota_admin')}
            className="p-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-left transition flex flex-col col-span-1 sm:col-span-2"
          >
            <span className="font-bold text-purple-900">Dr. Rameshwar Oraon (MoTA Admin)</span>
            <span className="text-[10px] text-purple-700">Scheme Config Editor, Income Limits, Premier Institutes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
