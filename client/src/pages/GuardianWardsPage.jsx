import React, { useEffect, useState } from 'react';
import { profileAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const GuardianWardsPage = () => {
  const { user } = useAuth();
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkData, setLinkData] = useState({ apaarId: '', studentPhone: '', aadhaarLast4: '' });
  const [linking, setLinking] = useState(false);
  const [msg, setMsg] = useState(null);

  const loadWards = async () => {
    try {
      setLoading(true);
      const res = await profileAPI.getGuardianWards();
      if (res.data.success) {
        setWards(res.data.wards);
      }
    } catch (err) {
      console.error('Failed to load wards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWards();
  }, []);

  const handleLinkWard = async (e) => {
    e.preventDefault();
    setLinking(true);
    setMsg(null);
    try {
      const res = await profileAPI.linkGuardianWard(linkData);
      if (res.data.success) {
        setMsg({ type: 'success', text: res.data.message });
        setLinkModalOpen(false);
        setLinkData({ apaarId: '', studentPhone: '', aadhaarLast4: '' });
        loadWards();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to link ward.' });
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 safe-bottom-padding space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gov-navy">
            Guardian Family Dashboard
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Single view to track applications, verification and DBT benefits for all children
          </p>
        </div>

        <button
          onClick={() => setLinkModalOpen(true)}
          className="bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Link Another Child</span>
        </button>
      </div>

      {msg && (
        <div
          className={`p-3 rounded-2xl flex items-center gap-2 text-xs font-bold border ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-red-50 text-red-900 border-red-300'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">
          Loading linked student profiles...
        </div>
      ) : wards.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Wards Linked Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You can link your school or college-going ST children using their APAAR ID or registered mobile number to manage their scholarships in one place.
          </p>
          <button
            onClick={() => setLinkModalOpen(true)}
            className="bg-gov-blue text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Link Ward Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wards.map((ward) => (
            <div
              key={ward._id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-gov hover:shadow-gov-lg transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-gov-blue bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {ward.courseLevel}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    APAAR: {ward.apaarId || 'Linked'}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900">{ward.name}</h4>
                <p className="text-xs text-slate-600">{ward.institutionName}</p>

                <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tribe / Domicile:</span>
                    <strong className="text-slate-800">{ward.tribe} ({ward.state})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Course:</span>
                    <strong className="text-slate-800">{ward.course}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Benefit:</span>
                    <strong className="text-amber-800 font-bold">
                      {ward.activeScholarship?.schemeName || 'None (Eligible for MoTA Scheme)'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  DBT Seeded
                </span>
                <button
                  onClick={() => alert(`Opening unified application manager for ${ward.name}...`)}
                  className="font-bold text-gov-blue hover:underline flex items-center gap-1"
                >
                  <span>Manage Application</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Link Ward Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Link Child / Ward Profile
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter child's APAAR ID or registered mobile number to bring their scholarship records into your guardian account.
            </p>

            <form onSubmit={handleLinkWard} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  APAAR / Edu-Locker ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. APAAR-2026-9901-4411"
                  value={linkData.apaarId}
                  onChange={(e) => setLinkData({ ...linkData, apaarId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div className="text-center font-bold text-slate-400 text-[10px] uppercase">
                — OR —
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Child's Registered Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={linkData.studentPhone}
                  onChange={(e) => setLinkData({ ...linkData, studentPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Child's Aadhaar (Last 4 Digits for Verification)
                </label>
                <input
                  type="text"
                  maxLength="4"
                  placeholder="e.g. 4821"
                  value={linkData.aadhaarLast4}
                  onChange={(e) => setLinkData({ ...linkData, aadhaarLast4: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linking}
                  className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white font-bold rounded-xl shadow"
                >
                  {linking ? 'Linking...' : 'Verify & Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
