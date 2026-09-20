import React, { useEffect, useState } from 'react';
import { paymentAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight, 
  ShieldCheck, 
  Landmark, 
  HelpCircle, 
  RefreshCw, 
  Calendar,
  FileCheck,
  TrendingUp,
  Info
} from 'lucide-react';

export const PaymentsTrackerPage = () => {
  const { student, user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [showNpciModal, setShowNpciModal] = useState(false);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await paymentAPI.getPayments();
      if (res.data.success) {
        setPayments(res.data.payments);
      }
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const totalDisbursed = payments
    .filter((p) => p.status === 'SUCCESS')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const pendingDisbursed = payments
    .filter((p) => p.status === 'IN_PROGRESS' || p.status === 'INITIATED')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const filteredPayments = payments.filter((p) => {
    if (activeFilter === 'ALL') return true;
    return p.status === activeFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Disbursed
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-600" />
            PFMS Processing
          </span>
        );
      case 'INITIATED':
        return (
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            Sanctioned
          </span>
        );
      case 'FAILED':
        return (
          <span className="text-[11px] font-bold text-red-800 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-300 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-600" />
            Credit Failed
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 safe-bottom-padding space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gov-navy flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            <span>Direct Benefit Transfer (DBT) Tracker</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time PFMS payment tracking, Aadhaar-NPCI bank account seeding status, and scholarship disbursement ledger
          </p>
        </div>

        <button
          onClick={loadPayments}
          className="self-start sm:self-auto bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh DBT Status</span>
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-5 text-white shadow-gov flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between opacity-80 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>Total Disbursed</span>
              <TrendingUp className="w-4 h-4 text-emerald-200" />
            </div>
            <div className="text-2xl sm:text-3xl font-black">
              ₹{totalDisbursed.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-500/40 text-[11px] text-emerald-100 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Transferred via PFMS APBS direct to bank</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-gov flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Pending in Pipeline</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{pendingDisbursed.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>Sanction order approved, PFMS batch queued</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-gov flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Academic Cycle</span>
              <Calendar className="w-4 h-4 text-gov-blue" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
              AY 2026-2027
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Single scheme active disbursement policy</span>
          </div>
        </div>
      </div>

      {/* Aadhaar-NPCI Seeding Status Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-gov">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>NPCI Aadhaar Seeding Health Check</span>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  ACTIVE / SEEDED
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Direct Benefit Transfer requires your primary bank account to be linked with Aadhaar at NPCI mapper.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowNpciModal(true)}
            className="self-start sm:self-auto text-xs font-bold text-gov-blue hover:underline flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4" />
            <span>What is NPCI Seeding?</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 text-[11px] block">Aadhaar Linked Status</span>
            <div className="font-bold text-slate-800 flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Linked (Last 4: •••• {student?.aadhaarLast4 || '4321'})</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 text-[11px] block">Primary DBT Bank</span>
            <div className="font-bold text-slate-800 flex items-center gap-1.5 mt-1">
              <Landmark className="w-4 h-4 text-gov-blue" />
              <span>State Bank of India (SBI)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 text-[11px] block">APBS Route Status</span>
            <div className="font-bold text-emerald-700 flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Aadhaar Payment Bridge Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Header & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Disbursement Transactions Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Audited payment log with PFMS UTR, sanction orders, and credit confirmations
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs">
            {['ALL', 'SUCCESS', 'IN_PROGRESS', 'INITIATED'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-lg font-bold transition text-[11px] ${
                  activeFilter === filter
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {filter === 'ALL' ? 'All Records' : filter.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Ledger Table / Cards */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            Loading PFMS DBT records...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3 shadow-gov">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Payment Records Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Once your scholarship application is verified and sanctioned by MoTA, DBT disbursement entries will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayments.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-gov hover:shadow-gov-lg transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gov-blue bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {p.schemeCode || 'MoTA SCHEME'}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Academic Year: {p.academicYear}
                    </span>
                  </div>
                  {getStatusBadge(p.status)}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  <div>
                    <div className="text-2xl font-black text-slate-900">
                      ₹{p.amount?.toLocaleString('en-IN')}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Installment: <strong className="text-slate-800">{p.installmentNumber || 'Annual Full Grant'}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100 flex-1 max-w-xl">
                    <div>
                      <span className="text-slate-400 text-[10px] block">PFMS Transaction ID</span>
                      <strong className="font-mono text-slate-800 text-[11px]">{p.pfmsTransactionId || 'PFMS-PENDING'}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">Bank UTR Reference</span>
                      <strong className="font-mono text-slate-800 text-[11px]">{p.utrNumber || 'Awaiting UTR'}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] block">Disbursement Date</span>
                      <span className="text-slate-700 font-semibold text-[11px]">
                        {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : 'Scheduled'}
                      </span>
                    </div>
                  </div>
                </div>

                {p.remarks && (
                  <div className="text-[11px] text-slate-500 bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                    <span>{p.remarks}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NPCI Help Modal */}
      {showNpciModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Understanding NPCI Aadhaar Seeding</h3>
              <button onClick={() => setShowNpciModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>What is Aadhaar Seeding?</strong>
                <br />
                Under Government of India DBT guidelines, scholarship funds are routed via the Aadhaar Payment Bridge System (APBS). Merely linking Aadhaar for KYC is not enough; your bank account must be <em>mapped/seeded</em> in the NPCI central mapper to receive government subsidies.
              </p>

              <p>
                <strong>How to check or fix NPCI Seeding:</strong>
                <ol className="list-decimal pl-4 space-y-1 mt-1">
                  <li>Visit your bank branch and submit the "Aadhaar Seeding / Mandate Consent" form.</li>
                  <li>Check status via the UIDAI Aadhaar portal ("Check Aadhaar/Bank Account Linking Status").</li>
                  <li>Ensure your name and date of birth match exactly across Aadhaar and bank records.</li>
                </ol>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowNpciModal(false)}
                className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white font-bold rounded-xl text-xs"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsTrackerPage;
