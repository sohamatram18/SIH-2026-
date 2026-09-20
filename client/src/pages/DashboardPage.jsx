import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { applicationAPI, schemeAPI } from '../services/api.js';
import { useNavigate, Link } from 'react-router-dom';
import { ApplicationTimeline } from '../components/ApplicationTimeline.jsx';
import { PendingActionsPanel } from '../components/PendingActionsPanel.jsx';
import { EligibilityCheckerModal } from '../components/EligibilityCheckerModal.jsx';
import {
  ShieldAlert,
  CheckCircle,
  Clock,
  ExternalLink,
  GraduationCap,
  Building,
  UserCheck,
  AlertTriangle,
  CreditCard,
  FileText,
  ChevronRight,
  Info,
  Sparkles,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, student } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkerModalOpen, setCheckerModalOpen] = useState(false);
  const [selectedCheckScheme, setSelectedCheckScheme] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await applicationAPI.getDashboardSummary();
      if (res.data.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const openEligibilityChecker = (schemeCode = null) => {
    setSelectedCheckScheme(schemeCode);
    setCheckerModalOpen(true);
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
      case 'Draft':
        return <span className="chip chip-draft">Draft Saved</span>;
      case 'Rejected':
        return <span className="chip chip-rejected">Rejected</span>;
      default:
        return <span className="chip chip-not-applied">Not Applied</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 safe-bottom-padding space-y-6">
      {/* Student Identity & Domicile Summary Banner */}
      <div className="bg-gradient-to-r from-gov-navy via-gov-blue to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-gov-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-gov-navy font-black text-xl flex items-center justify-center shadow">
                {student?.name ? student.name.charAt(0) : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold">
                    {student?.name || user?.name || 'Tribal Student'}
                  </h2>
                  {student?.isPVTG && (
                    <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      PVTG ({student.pvtgCommunity || 'Special Quota'})
                    </span>
                  )}
                  {student?.isDivyang && (
                    <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Divyang ({student.divyangPercentage}% {student.divyangType})
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300">
                  {student?.tribe ? `Community: ${student.tribe} Tribe` : 'Scheduled Tribe (ST)'} •{' '}
                  {student?.state || 'State of Domicile'}, {student?.district || ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openEligibilityChecker()}
                className="bg-amber-400 hover:bg-amber-500 text-gov-navy text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
              >
                <Sparkles className="w-3.5 h-3.5 text-gov-navy" />
                <span>Check Eligibility</span>
              </button>

              <Link
                to="/profile"
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-white/20 transition flex items-center gap-1"
              >
                <span>Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-white/15 text-xs">
            <div className="bg-white/5 rounded-xl p-2.5">
              <span className="text-[10px] text-slate-300 block uppercase">APAAR ID</span>
              <span className="font-semibold text-amber-300 truncate block">
                {student?.apaarId || 'Not Linked'}
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5">
              <span className="text-[10px] text-slate-300 block uppercase">Family Income</span>
              <span className="font-semibold text-white">
                ₹{((student?.familyAnnualIncome || 0) / 100000).toFixed(1)} Lakh / yr
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5">
              <span className="text-[10px] text-slate-300 block uppercase">Enrolled Course</span>
              <span className="font-semibold text-white truncate block">
                {student?.course || 'Academic Course'}
              </span>
            </div>
            <div className="bg-white/5 rounded-xl p-2.5">
              <span className="text-[10px] text-slate-300 block uppercase">Aadhaar & Bank</span>
              <span className="font-semibold text-emerald-300 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {student?.aadhaarDetails?.aadhaarLast4
                  ? `XXXX-${student.aadhaarDetails.aadhaarLast4}`
                  : 'Verified'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ONE SCHOLARSHIP AT A TIME RULE BANNER */}
      {dashboardData?.conflictStatus?.hasConflict ? (
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Active Scholarship Enrolled • One-Scholarship Rule Active
              </h3>
              <p className="text-xs text-amber-800 mt-1">
                {dashboardData.conflictStatus.message}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border-l-4 border-gov-blue rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-gov-blue flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Single Unified Application Window
              </h3>
              <p className="text-xs text-blue-800 mt-1">
                You can apply for any eligible MoTA scheme below. Your verified documents and profile will be auto-filled into the resumable wizard.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Application Visual Progress Timeline */}
      <ApplicationTimeline
        timeline={dashboardData?.timeline}
        currentStatus={dashboardData?.activeApplication?.status || 'Not Applied'}
        applicationNumber={dashboardData?.activeApplication?.applicationNumber}
      />

      {/* Pending Actions Queue */}
      <PendingActionsPanel actions={dashboardData?.pendingActions || []} />

      {/* PFMS DBT Payments Summary Card */}
      {dashboardData?.paymentsSummary && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-gov space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Direct Benefit Transfer (PFMS / Canara SFMP) Summary</span>
            </h3>
            <Link
              to="/payments"
              className="text-[11px] text-gov-blue hover:underline font-bold flex items-center gap-0.5"
            >
              <span>Full DBT Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <Link
              to="/payments"
              className="p-3 bg-emerald-50/60 hover:bg-emerald-50 rounded-2xl border border-emerald-200 transition cursor-pointer"
            >
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">
                Total DBT Disbursed
              </span>
              <p className="text-lg font-black text-emerald-700 mt-0.5">
                ₹{dashboardData.paymentsSummary.totalDisbursed.toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-600">Credited to student account</span>
            </Link>

            <Link
              to="/payments"
              className="p-3 bg-blue-50/60 hover:bg-blue-50 rounded-2xl border border-blue-200 transition cursor-pointer"
            >
              <span className="text-[10px] text-blue-800 font-bold uppercase block">
                Pending Sanctioned Credit
              </span>
              <p className="text-lg font-black text-gov-blue mt-0.5">
                ₹{dashboardData.paymentsSummary.pendingDisbursement.toLocaleString()}
              </p>
              <span className="text-[10px] text-blue-600">In PFMS payment batch file</span>
            </Link>

            <Link
              to="/wallet"
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">
                  Document Vault
                </span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  DigiLocker & State IDs
                </p>
              </div>
              <span className="text-[10px] text-gov-blue font-semibold flex items-center gap-0.5">
                <span>Manage Wallet</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* All 5 MoTA Schemes Unified Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">
              Unified Scheme Directory (All 5 MoTA Schemes)
            </h3>
            <p className="text-xs text-slate-500">
              Apply, resume drafts, or track existing benefits across all portals
            </p>
          </div>
          <button
            onClick={() => openEligibilityChecker()}
            className="text-xs font-bold text-gov-blue hover:underline flex items-center gap-1"
          >
            <span>Run Eligibility Engine</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Synchronizing scheme data...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardData?.schemeStatuses?.map((sc) => {
              const isApplied = sc.status !== 'Not applied';
              const isDraft = sc.status === 'Draft';

              return (
                <div
                  key={sc.code}
                  className="bg-white rounded-3xl p-5 border border-slate-200 shadow-gov hover:shadow-gov-lg transition flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {sc.category}
                      </span>
                      {getStatusBadge(sc.status)}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {sc.name}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1">
                      {sc.allowanceSummary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => openEligibilityChecker(sc.code)}
                      className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Check Rules</span>
                    </button>

                    {isDraft ? (
                      <Link
                        to={`/apply/${sc.code}/${sc.applicationId}`}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm"
                      >
                        <span>Resume Draft</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : isApplied ? (
                      <button
                        onClick={() => alert(`Showing status details for ${sc.name} (${sc.status})`)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-xl transition"
                      >
                        Track Status
                      </button>
                    ) : (
                      <Link
                        to={`/apply/${sc.code}`}
                        className="bg-gov-blue hover:bg-gov-navy text-white font-bold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm"
                      >
                        <span>Apply Now</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Eligibility Checker Modal */}
      {checkerModalOpen && (
        <EligibilityCheckerModal
          schemeCode={selectedCheckScheme}
          onClose={() => setCheckerModalOpen(false)}
        />
      )}
    </div>
  );
};
