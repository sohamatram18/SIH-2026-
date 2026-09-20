import React, { useEffect, useState } from 'react';
import { schemeAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  IndianRupee, 
  BookOpen, 
  GraduationCap, 
  AlertCircle, 
  PhoneCall, 
  Mail, 
  Settings, 
  Save, 
  X,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const SchemesPage = () => {
  const { user, student } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'Centrally Sponsored' | 'Central Sector'
  
  // Admin Editing Modal State
  const [editingScheme, setEditingScheme] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === 'mota_admin';

  const loadSchemes = async () => {
    try {
      setLoading(true);
      const res = await schemeAPI.getAll();
      if (res.data.success) {
        setSchemes(res.data.schemes);
      }
    } catch (err) {
      console.error('Failed to load schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemes();
  }, []);

  const openAdminEdit = (scheme) => {
    setEditingScheme(scheme);
    setEditFormData({
      maxIncomeLakhs: scheme.eligibility?.maxIncomeLakhs || 0,
      description: scheme.description || '',
      fundingSplitInfo: scheme.fundingSplitInfo || '',
      allowanceDesc: scheme.allowanceStructure?.description || '',
    });
    setSaveSuccessMsg(null);
  };

  const handleAdminSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        description: editFormData.description,
        fundingSplitInfo: editFormData.fundingSplitInfo,
        eligibility: {
          maxIncomeLakhs: parseFloat(editFormData.maxIncomeLakhs),
        },
        allowanceStructure: {
          description: editFormData.allowanceDesc,
        },
      };

      const res = await schemeAPI.updateConfig(editingScheme.code, payload);
      if (res.data.success) {
        setSaveSuccessMsg(`Scheme configuration saved (Version ${res.data.scheme.version})!`);
        setTimeout(() => {
          setEditingScheme(null);
          loadSchemes();
        }, 1200);
      }
    } catch (err) {
      alert('Failed to update scheme config: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const filteredSchemes = schemes.filter((s) => {
    if (filter === 'ALL') return true;
    return s.category === filter;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 safe-bottom-padding space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gov-navy">
            Ministry of Tribal Affairs Schemes
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Official guidelines, allowances, eligibility criteria, and source portal links
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-lg transition ${
              filter === 'ALL' ? 'bg-white text-gov-navy shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All (5)
          </button>
          <button
            onClick={() => setFilter('Centrally Sponsored')}
            className={`px-3 py-1 rounded-lg transition ${
              filter === 'Centrally Sponsored' ? 'bg-white text-gov-navy shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Centrally Sponsored
          </button>
          <button
            onClick={() => setFilter('Central Sector')}
            className={`px-3 py-1 rounded-lg transition ${
              filter === 'Central Sector' ? 'bg-white text-gov-navy shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Central Sector
          </button>
        </div>
      </div>

      {/* Admin Notice */}
      {isAdmin && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-center justify-between text-xs text-purple-900">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-purple-700 flex-shrink-0" />
            <span>
              <strong>MoTA Administrator Console Active:</strong> You can edit live scheme rules, income limits, and funding descriptions.
            </span>
          </div>
        </div>
      )}

      {/* Schemes Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">
          Loading MoTA scheme database...
        </div>
      ) : (
        <div className="space-y-5">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.code}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-gov hover:shadow-gov-lg transition space-y-4"
            >
              {/* Top Meta Header */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gov-blue bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                      {scheme.category}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      Code: {scheme.code}
                    </span>
                    {scheme.version > 1 && (
                      <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.2 rounded-full border border-purple-200">
                        Config v{scheme.version}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {scheme.name}
                  </h3>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => openAdminEdit(scheme)}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-purple-300 transition flex items-center gap-1.5"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Edit Rules</span>
                  </button>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-700 leading-relaxed">
                {scheme.description}
              </p>

              {/* Funding Split and Portal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Funding Ratio & Mechanism
                  </span>
                  <p className="text-slate-800 font-semibold">
                    {scheme.fundingSplitInfo}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Direct Benefit Transfer (DBT) operated via <strong>{scheme.dbtProvider}</strong>
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Designated Source Portal
                  </span>
                  <a
                    href={scheme.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-gov-blue hover:underline flex items-center gap-1"
                  >
                    <span>{scheme.portalName}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Unified status tracked seamlessly in this mobile application.
                  </p>
                </div>
              </div>

              {/* Allowance Breakdown */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 uppercase text-[11px] tracking-wide">
                    Financial Assistance & Allowance Structure
                  </span>
                  <span className="text-[11px] font-semibold text-amber-800">
                    Parental Income Ceiling: {scheme.eligibility?.maxIncomeLakhs > 50 ? 'Purely Merit-Based (No Income Ceiling)' : `≤ ₹${scheme.eligibility?.maxIncomeLakhs} Lakh / Year`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {scheme.allowanceStructure?.components?.map((comp, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-amber-200/80">
                      <p className="font-bold text-slate-800">{comp.title}</p>
                      <p className="text-xs font-extrabold text-amber-700">{comp.amount}</p>
                      <p className="text-[10px] text-slate-500">{comp.frequency} • {comp.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents & Grievance Contact Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-3 text-slate-600">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{scheme.grievanceContact?.email}</span>
                  </div>
                  {scheme.grievanceContact?.helpline && (
                    <div className="flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                      <span>{scheme.grievanceContact.helpline}</span>
                    </div>
                  )}
                </div>

                <a
                  href={scheme.grievanceContact?.portal || 'https://tribal.nic.in/Grievance'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-slate-500 hover:text-gov-navy hover:underline flex items-center gap-1"
                >
                  <span>MoTA Grievance Redressal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Scheme Configuration Modal */}
      {editingScheme && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Edit Scheme Rules ({editingScheme.shortName})
                </h3>
                <p className="text-xs text-slate-500">
                  MoTA Admin Live Configuration Editor
                </p>
              </div>
              <button
                onClick={() => setEditingScheme(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccessMsg ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-slate-900">{saveSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleAdminSave} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Parental Annual Income Limit (in Lakhs INR)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={editFormData.maxIncomeLakhs}
                    onChange={(e) => setEditFormData({ ...editFormData, maxIncomeLakhs: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pre/Post-Matric: 2.5L; Top Class / NOS: 6.0L; NFST: 99.0L (purely merit-based).
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Scheme Description
                  </label>
                  <textarea
                    rows="3"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Funding Ratio Information
                  </label>
                  <input
                    type="text"
                    value={editFormData.fundingSplitInfo}
                    onChange={(e) => setEditFormData({ ...editFormData, fundingSplitInfo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Allowance Summary Notes
                  </label>
                  <textarea
                    rows="2"
                    value={editFormData.allowanceDesc}
                    onChange={(e) => setEditFormData({ ...editFormData, allowanceDesc: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                    required
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingScheme(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl flex items-center gap-1.5 shadow"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
