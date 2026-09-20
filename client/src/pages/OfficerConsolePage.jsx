import React, { useEffect, useState } from 'react';
import { officerAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  TrendingUp, 
  BarChart3, 
  Layers, 
  Users, 
  Sparkles, 
  Search, 
  Filter, 
  Download, 
  Send, 
  Landmark, 
  ChevronRight, 
  CreditCard,
  MapPin,
  CheckSquare,
  Square,
  AlertTriangle,
  X
} from 'lucide-react';

export const OfficerConsolePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('SCRUTINY'); // 'SCRUTINY' | 'SANCTION_DBT' | 'COVERAGE_GAP'
  
  // Dashboard Summary & Scrutiny State
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedAppIds, setSelectedAppIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [schemeFilter, setSchemeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Action States
  const [inspectModalApp, setInspectModalApp] = useState(null);
  const [batchActionModal, setBatchActionModal] = useState(null); // 'APPROVE' | 'DEFICIENCY' | 'REJECT'
  const [batchRemarks, setBatchRemarks] = useState('');
  const [deficiencyField, setDeficiencyField] = useState('Bonafide Student Certificate');
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Coverage Gap & Analytics State
  const [coverageData, setCoverageData] = useState(null);
  const [stateFilter, setStateFilter] = useState('ALL');

  const isMotaAdmin = user?.role === 'mota_admin';
  const isStateNodal = user?.role === 'state_nodal';
  const isInstituteNodal = user?.role === 'institute_nodal';

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, appRes] = await Promise.all([
        officerAPI.getDashboard(),
        officerAPI.getApplications({
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          schemeCode: schemeFilter !== 'ALL' ? schemeFilter : undefined,
          search: searchQuery || undefined,
        }),
      ]);

      if (dashRes.data.success) {
        setStats(dashRes.data.stats);
      }
      if (appRes.data.success) {
        setApplications(appRes.data.applications);
      }
    } catch (err) {
      console.error('Officer Console Load Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCoverageAnalytics = async () => {
    try {
      const res = await officerAPI.getCoverageGap(stateFilter !== 'ALL' ? stateFilter : undefined);
      if (res.data.success) {
        setCoverageData(res.data.analytics);
      }
    } catch (err) {
      console.error('Coverage Gap Load Error:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [statusFilter, schemeFilter]);

  useEffect(() => {
    if (activeTab === 'COVERAGE_GAP') {
      loadCoverageAnalytics();
    }
  }, [activeTab, stateFilter]);

  // Handle Search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDashboardData();
  };

  // Toggle selection
  const toggleSelectAll = () => {
    if (selectedAppIds.length === applications.length) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(applications.map((a) => a._id));
    }
  };

  const toggleSelectApp = (id) => {
    setSelectedAppIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Execute Batch Action
  const handleExecuteBatch = async () => {
    if (selectedAppIds.length === 0) return;
    try {
      setActionLoading(true);
      const res = await officerAPI.batchAction({
        applicationIds: selectedAppIds,
        action: batchActionModal,
        remarks: batchRemarks,
        deficiencyField: batchActionModal === 'DEFICIENCY' ? deficiencyField : undefined,
      });

      if (res.data.success) {
        setMsg({ type: 'success', text: res.data.message });
        setBatchActionModal(null);
        setSelectedAppIds([]);
        setBatchRemarks('');
        await loadDashboardData();
      }
    } catch (err) {
      alert('Batch action failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // Generate Central Sanction Order
  const handleGenerateSanction = async () => {
    try {
      setActionLoading(true);
      const res = await officerAPI.generateSanctionOrder({
        schemeCode: schemeFilter !== 'ALL' ? schemeFilter : 'TOP_CLASS',
        academicYear: '2026-2027',
      });
      if (res.data.success) {
        setMsg({ type: 'success', text: res.data.message });
        await loadDashboardData();
      }
    } catch (err) {
      alert('Sanction generation error: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // Generate PFMS APBS DBT Batch
  const handleGenerateDbtBatch = async () => {
    try {
      setActionLoading(true);
      const res = await officerAPI.generatePfmsDbtBatch({ schemeCode: 'ALL' });
      if (res.data.success) {
        setMsg({ type: 'success', text: res.data.message });
        await loadDashboardData();
      }
    } catch (err) {
      alert('PFMS DBT execution error: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Sanctioned':
        return <span className="chip chip-sanctioned">Sanctioned</span>;
      case 'Disbursed':
        return <span className="chip chip-disbursed">Disbursed (DBT)</span>;
      case 'Submitted':
        return <span className="chip chip-submitted">Submitted</span>;
      case 'Under verification':
        return <span className="chip chip-under-verification">Under Verification</span>;
      case 'Deficiency raised':
        return <span className="chip chip-deficiency-raised">Deficiency Raised</span>;
      case 'Rejected':
        return <span className="chip chip-rejected">Rejected</span>;
      default:
        return <span className="chip chip-draft">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 safe-bottom-padding space-y-6">
      {/* Officer Persona & Role Context Ribbon */}
      <div className="bg-gradient-to-r from-gov-navy via-slate-900 to-gov-blue rounded-3xl p-5 sm:p-6 text-white shadow-gov-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-gov-navy flex items-center justify-center font-black shadow">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {user?.role?.replace('_', ' ')}
              </span>
              <h2 className="text-lg sm:text-xl font-bold">
                {user?.name || 'Nodal Officer'}
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {stats?.roleSpecificData?.scope || 'MoTA Verification & Administrative Console'}
              {stats?.roleSpecificData?.instituteName ? ` • ${stats.roleSpecificData.instituteName}` : ''}
              {stats?.roleSpecificData?.state ? ` • State Directorate: ${stats.roleSpecificData.state}` : ''}
            </p>
          </div>
        </div>

        {/* Global Summary Metric Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
            <span className="text-[10px] text-slate-300 block">Total Applications</span>
            <strong className="text-sm font-bold text-white">{stats?.totalApplications || 0}</strong>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
            <span className="text-[10px] text-slate-300 block">Under Scrutiny</span>
            <strong className="text-sm font-bold text-amber-300">
              {(stats?.submitted || 0) + (stats?.underVerification || 0)}
            </strong>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/15">
            <span className="text-[10px] text-slate-300 block">DBT Disbursed</span>
            <strong className="text-sm font-bold text-emerald-300">
              ₹{((stats?.totalDisbursedAmount || 0) / 100000).toFixed(1)} Lakh
            </strong>
          </div>
        </div>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-2xl flex items-center gap-2 text-xs font-bold border ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-red-50 text-red-900 border-red-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{msg.text}</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('SCRUTINY')}
          className={`py-2.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'SCRUTINY'
              ? 'border-gov-blue text-gov-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Application Scrutiny ({applications.length})</span>
        </button>

        {(isMotaAdmin || isStateNodal) && (
          <button
            onClick={() => setActiveTab('SANCTION_DBT')}
            className={`py-2.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'SANCTION_DBT'
                ? 'border-gov-blue text-gov-blue'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Sanction Orders & PFMS DBT</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('COVERAGE_GAP')}
          className={`py-2.5 px-4 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'COVERAGE_GAP'
              ? 'border-gov-blue text-gov-blue'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Tribal Coverage Gap & PVTG Explorer</span>
        </button>
      </div>

      {/* TAB 1: APPLICATION SCRUTINY */}
      {activeTab === 'SCRUTINY' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search application number, student name..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
              <button type="submit" className="bg-gov-blue text-white px-3 py-2 rounded-xl font-bold">
                Search
              </button>
            </form>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="ALL">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Under verification">Under Verification</option>
                <option value="Deficiency raised">Deficiency Raised</option>
                <option value="Sanctioned">Sanctioned</option>
                <option value="Disbursed">Disbursed</option>
              </select>

              <select
                value={schemeFilter}
                onChange={(e) => setSchemeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="ALL">All 5 Schemes</option>
                <option value="PRE_MATRIC">Pre-Matric</option>
                <option value="POST_MATRIC">Post-Matric</option>
                <option value="TOP_CLASS">Top Class</option>
                <option value="NFST">NFST Fellowship</option>
                <option value="NOS">NOS Overseas</option>
              </select>
            </div>
          </div>

          {/* Bulk Action Controls */}
          {selectedAppIds.length > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs animate-in fade-in">
              <span className="font-bold text-amber-900">
                {selectedAppIds.length} application(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBatchActionModal('APPROVE')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs"
                >
                  Batch Approve
                </button>
                <button
                  onClick={() => setBatchActionModal('DEFICIENCY')}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs"
                >
                  Flag Deficiency
                </button>
                <button
                  onClick={() => setBatchActionModal('REJECT')}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs"
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {/* Applications Table */}
          {loading ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              Loading scrutiny records...
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
              No applications match the current filter criteria.
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-gov overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="p-3.5 text-center w-10">
                        <button onClick={toggleSelectAll} className="p-1">
                          {selectedAppIds.length === applications.length && applications.length > 0 ? (
                            <CheckSquare className="w-4 h-4 text-gov-blue" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </th>
                      <th className="p-3.5">App Number</th>
                      <th className="p-3.5">Student / Community</th>
                      <th className="p-3.5">Scheme</th>
                      <th className="p-3.5">Institution / Course</th>
                      <th className="p-3.5">Income</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => {
                      const isSelected = selectedAppIds.includes(app._id);
                      return (
                        <tr
                          key={app._id}
                          className={`hover:bg-slate-50/70 transition ${
                            isSelected ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <td className="p-3.5 text-center">
                            <button onClick={() => toggleSelectApp(app._id)} className="p-1">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-gov-blue" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-300" />
                              )}
                            </button>
                          </td>

                          <td className="p-3.5 font-mono font-bold text-slate-900">
                            {app.applicationNumber}
                          </td>

                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">
                              {app.studentId?.name || app.formData?.personalDetails?.applicantName || 'Student'}
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1">
                              <span>{app.studentId?.tribe || 'ST'}</span>
                              {app.studentId?.isPVTG && (
                                <span className="bg-amber-100 text-amber-900 font-bold px-1 rounded text-[9px]">
                                  PVTG
                                </span>
                              )}
                              {app.studentId?.isDivyang && (
                                <span className="bg-emerald-100 text-emerald-900 font-bold px-1 rounded text-[9px]">
                                  Divyang
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span className="font-semibold text-slate-800">
                              {app.schemeCode}
                            </span>
                          </td>

                          <td className="p-3.5 text-[11px] text-slate-600">
                            <div className="font-medium text-slate-800">
                              {app.studentId?.institutionName || 'Recognized Institution'}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {app.studentId?.course || 'Academic Degree'}
                            </span>
                          </td>

                          <td className="p-3.5 font-semibold text-slate-700">
                            ₹{((app.studentId?.annualFamilyIncome || 120000) / 100000).toFixed(1)}L
                          </td>

                          <td className="p-3.5">
                            {getStatusBadge(app.status)}
                          </td>

                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setInspectModalApp(app)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-lg text-[11px] transition"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SANCTION ORDERS & PFMS DBT */}
      {activeTab === 'SANCTION_DBT' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sanction Order Generator Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-gov space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    MoTA Central Sanction Order Generator
                  </h3>
                  <p className="text-xs text-slate-500">
                    Allocate financial sanctions for verified scholarship cohorts
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">
                    Target Academic Cohort
                  </span>
                  <p className="font-bold text-slate-800">
                    Academic Year 2026-2027 • Direct Sanction Pool
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Ready for Sanction: <strong>{stats?.underVerification || 0} applications</strong>
                  </p>
                </div>

                <button
                  onClick={handleGenerateSanction}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-gov-blue hover:bg-gov-navy text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate MoTA Central Sanction Order</span>
                </button>
              </div>
            </div>

            {/* PFMS APBS DBT Batch Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-gov space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    PFMS APBS Direct Benefit Transfer Batch
                  </h3>
                  <p className="text-xs text-slate-500">
                    Export Aadhaar Payment Bridge payment batch to Reserve Bank / SBI
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">
                    Payment Routing
                  </span>
                  <p className="font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>NPCI APBS Validated Routing</span>
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Sanctioned Pending Transfer: <strong>{stats?.sanctioned || 0} students</strong>
                  </p>
                </div>

                <button
                  onClick={handleGenerateDbtBatch}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Execute PFMS APBS DBT Disbursement Batch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COVERAGE GAP & PVTG EXPLORER */}
      {activeTab === 'COVERAGE_GAP' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex items-center justify-between bg-white rounded-3xl p-4 border border-slate-200 shadow-gov">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Tribal District Coverage Gap & PVTG Saturation Index
              </h3>
              <p className="text-xs text-slate-500">
                Audited demographic analytics across notified tribal districts
              </p>
            </div>

            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
            >
              <option value="ALL">All Tribal States (6 States)</option>
              <option value="Odisha">Odisha</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>

          {/* Metric Cards */}
          {coverageData && (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-gov">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Total ST Population Covered
                </span>
                <p className="text-xl font-black text-slate-900 mt-1">
                  {(coverageData.summary.totalStPopulationCovered / 100000).toFixed(1)} Lakh
                </p>
                <span className="text-[10px] text-slate-500">Across {coverageData.summary.totalDistrictsMonitored} districts</span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-gov">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Active Beneficiaries
                </span>
                <p className="text-xl font-black text-gov-blue mt-1">
                  {coverageData.summary.totalActiveBeneficiaries.toLocaleString()}
                </p>
                <span className="text-[10px] text-blue-600">Pre + Post + Higher Edu</span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-gov">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Overall PVTG Saturation
                </span>
                <p className="text-xl font-black text-amber-600 mt-1">
                  {coverageData.summary.overallPvtgSaturationRate}%
                </p>
                <span className="text-[10px] text-amber-700">Special Vulnerable Quota</span>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-gov">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  Class X $\to$ XI Transition Cliff
                </span>
                <p className="text-xl font-black text-red-600 mt-1">
                  {coverageData.summary.averageTransitionDropoffRate}% Drop
                </p>
                <span className="text-[10px] text-red-600">Secondary to Higher Sec</span>
              </div>
            </div>
          )}

          {/* District Table */}
          {coverageData && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-gov overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  District-Wise Penetration & Bottleneck Analysis
                </h4>
                <span className="text-[11px] text-slate-400">
                  {coverageData.districts.length} Districts Audited
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                      <th className="p-3.5">District / State</th>
                      <th className="p-3.5">ST Population (%)</th>
                      <th className="p-3.5">PVTG Groups</th>
                      <th className="p-3.5">Coverage Rate</th>
                      <th className="p-3.5">PVTG Saturation</th>
                      <th className="p-3.5">Transition Drop</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {coverageData.districts.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">
                          {d.district} <span className="text-slate-400 font-normal">({d.state})</span>
                        </td>
                        <td className="p-3.5 font-semibold text-slate-700">
                          {d.stPopulation.toLocaleString()} ({d.stPopPercentage}%)
                        </td>
                        <td className="p-3.5 text-[11px] text-slate-600">
                          {d.pvtgCommunities.join(', ')}
                        </td>
                        <td className="p-3.5 font-bold text-slate-800">
                          {d.coverageRate}%
                        </td>
                        <td className="p-3.5 font-bold text-amber-700">
                          {d.pvtgOutreachRate}%
                        </td>
                        <td className="p-3.5 font-semibold text-red-600">
                          {d.transitionDropoffRate}%
                        </td>
                        <td className="p-3.5">
                          {d.status === 'CRITICAL_GAP' ? (
                            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Critical Gap
                            </span>
                          ) : d.status === 'NEEDS_OUTREACH' ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Needs Outreach
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Saturated
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DWO Action Directives */}
          {coverageData && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-gov space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Automated Directives for District Welfare Officers (DWOs)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {coverageData.policyRecommendations.map((rec) => (
                  <div key={rec.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500">{rec.id}</span>
                      <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-red-100 text-red-800">
                        {rec.priority}
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-900 leading-snug">{rec.title}</h5>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{rec.description}</p>
                    <div className="text-[10px] text-gov-blue font-semibold pt-1 border-t border-slate-200">
                      Target: {rec.targetDistricts.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Batch Action Modal */}
      {batchActionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Execute Batch Action: {batchActionModal}
              </h3>
              <button onClick={() => setBatchActionModal(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                You are applying action <strong>{batchActionModal}</strong> to <strong>{selectedAppIds.length}</strong> selected applications.
              </p>

              {batchActionModal === 'DEFICIENCY' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deficiency Field</label>
                  <select
                    value={deficiencyField}
                    onChange={(e) => setDeficiencyField(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="Bonafide Student Certificate">Bonafide Student Certificate</option>
                    <option value="ST Caste Certificate">ST Caste Certificate</option>
                    <option value="Income Certificate">Parental Income Certificate</option>
                    <option value="Marksheet Verification">Previous Pass Marksheet</option>
                    <option value="Bank Account Passbook">Bank Account / IFSC Details</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Officer Notes / Remarks</label>
                <textarea
                  rows={3}
                  value={batchRemarks}
                  onChange={(e) => setBatchRemarks(e.target.value)}
                  placeholder="Enter decision notes for student audit trail..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() => setBatchActionModal(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteBatch}
                  disabled={actionLoading}
                  className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white font-bold rounded-xl shadow disabled:opacity-50"
                >
                  Confirm & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deep Inspection Modal */}
      {inspectModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {inspectModalApp.applicationNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {inspectModalApp.studentId?.name || 'Applicant Dossier'}
                </h3>
              </div>
              <button onClick={() => setInspectModalApp(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block">Community / Tribe</span>
                  <strong className="text-slate-800">{inspectModalApp.studentId?.tribe || 'Scheduled Tribe'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Special Status</span>
                  <span className="font-semibold text-amber-800">
                    {inspectModalApp.studentId?.isPVTG ? 'PVTG Priority' : 'General ST'}
                    {inspectModalApp.studentId?.isDivyang ? ' • Divyang' : ''}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Enrolled Course</span>
                  <strong className="text-slate-800">{inspectModalApp.studentId?.course || 'Course'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Annual Family Income</span>
                  <strong className="text-slate-800">₹{inspectModalApp.studentId?.annualFamilyIncome?.toLocaleString() || '1,20,000'}</strong>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                  Verification Checklist
                </span>
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-[11px] text-emerald-900">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aadhaar SHA-256 Tokenization & Demographic Match (100%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>State e-District Caste Certificate Verified</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>One-Scholarship Cross Deduplication Checked (No conflicts)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setInspectModalApp(null)}
                className="px-5 py-2 bg-gov-blue text-white font-bold rounded-xl text-xs"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerConsolePage;
