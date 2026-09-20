import React, { useEffect, useState } from 'react';
import { walletAPI } from '../services/api.js';
import { DigiLockerModal } from '../components/DigiLockerModal.jsx';
import { 
  FolderLock, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  Clock, 
  RotateCw, 
  Plus, 
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export const DocumentWalletPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [digiLockerOpen, setDigiLockerOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const [uploadData, setUploadData] = useState({
    docType: 'ST_CERTIFICATE',
    title: '',
    documentNumber: '',
    issuingAuthority: '',
    fileSize: '350 KB',
  });

  const loadWallet = async () => {
    try {
      setLoading(true);
      const res = await walletAPI.getDocuments();
      if (res.data.success) {
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.error('Failed to load wallet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const handleDigiLockerFetch = async () => {
    const res = await walletAPI.fetchDigiLocker();
    if (res.data.success) {
      setMsg({ type: 'success', text: res.data.message });
      await loadWallet();
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await walletAPI.uploadDocument(uploadData);
      if (res.data.success) {
        setMsg({ type: 'success', text: 'Document uploaded and verified through automated adapter pipeline.' });
        setUploadModalOpen(false);
        setUploadData({ docType: 'ST_CERTIFICATE', title: '', documentNumber: '', issuingAuthority: '', fileSize: '350 KB' });
        loadWallet();
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReverify = async (id) => {
    try {
      setVerifyingId(id);
      const res = await walletAPI.verifyDocument(id);
      if (res.data.success) {
        setMsg({ type: 'success', text: `Document re-verified: ${res.data.result.verificationStatus}` });
        loadWallet();
      }
    } catch (err) {
      alert('Verification error: ' + err.message);
    } finally {
      setVerifyingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Verified
          </span>
        );
      case 'NEEDS_MANUAL_REVIEW':
        return (
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            Manual Review Queued
          </span>
        );
      case 'REJECTED':
        return (
          <span className="text-[11px] font-bold text-red-800 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-300 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
            Pending
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
            <FolderLock className="w-6 h-6 text-gov-blue" />
            <span>Digital Document Wallet</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Single repository for verified ST caste, income, and academic certificates reused across all 5 schemes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDigiLockerOpen(true)}
            className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Fetch from DigiLocker</span>
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
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

      {/* Trust & Non-Blocking Info Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Unified Verification Layer:</strong> Documents are cross-verified with DigiLocker, UIDAI, and State e-District APIs. Any gateway error is routed to manual review and <strong>never blocks application submission</strong>.
          </span>
        </div>
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-xs">
          Loading verified document vault...
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3 shadow-gov">
          <FolderLock className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Your Document Wallet is Empty</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Pull your verified ST caste and income certificates directly from DigiLocker or upload scanned copies to prefill scholarship applications.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={() => setDigiLockerOpen(true)}
              className="bg-blue-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow"
            >
              Fetch from DigiLocker
            </button>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="bg-slate-100 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl"
            >
              Upload PDF/Image
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-gov hover:shadow-gov-lg transition flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-gov-blue bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase">
                    {doc.docType.replace(/_/g, ' ')}
                  </span>
                  {getStatusBadge(doc.verificationStatus)}
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {doc.title}
                </h4>

                <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  {doc.documentNumber && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-[11px]">Cert No:</span>
                      <strong className="font-mono text-slate-800 text-[11px]">{doc.documentNumber}</strong>
                    </div>
                  )}
                  {doc.issuingAuthority && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-[11px]">Issuer:</span>
                      <span className="text-slate-700 text-[11px] font-semibold">{doc.issuingAuthority}</span>
                    </div>
                  )}
                  {doc.validUntil && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-[11px]">Validity:</span>
                      <span className="text-emerald-700 text-[11px] font-bold">
                        Valid till {new Date(doc.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gov-blue" />
                  <span>{doc.verificationSource || 'System Verified'}</span>
                </span>

                <button
                  onClick={() => handleReverify(doc._id)}
                  disabled={verifyingId === doc._id}
                  className="text-xs font-bold text-gov-blue hover:underline flex items-center gap-1 disabled:opacity-40"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${verifyingId === doc._id ? 'animate-spin' : ''}`} />
                  <span>{verifyingId === doc._id ? 'Verifying...' : 'Re-verify'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DigiLocker Modal */}
      {digiLockerOpen && (
        <DigiLockerModal
          onFetchComplete={handleDigiLockerFetch}
          onClose={() => setDigiLockerOpen(false)}
        />
      )}

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Upload Digital Certificate</h3>
              <button onClick={() => setUploadModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Category</label>
                <select
                  value={uploadData.docType}
                  onChange={(e) => setUploadData({ ...uploadData, docType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="ST_CERTIFICATE">ST Caste Certificate</option>
                  <option value="INCOME_CERTIFICATE">Parental Income Certificate</option>
                  <option value="DOMICILE_CERTIFICATE">Domicile / Residence Certificate</option>
                  <option value="PREVIOUS_MARKSHEET">Marksheet / Pass Certificate</option>
                  <option value="BONAFIDE_STUDENT">Institution Bonafide Certificate</option>
                  <option value="BANK_PASSBOOK">Bank Passbook Copy</option>
                  <option value="DIVYANG_CERTIFICATE">Disability (UDID) Certificate</option>
                  <option value="NET_JRF_SCORECARD">UGC-NET / JRF Scorecard</option>
                  <option value="PASSPORT_COPY">Passport (For NOS Overseas)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Certificate Title / Name</label>
                <input
                  type="text"
                  placeholder="e.g. ST Certificate Baripada Circle"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Certificate Number</label>
                <input
                  type="text"
                  placeholder="e.g. ST/OD/2026/8812"
                  value={uploadData.documentNumber}
                  onChange={(e) => setUploadData({ ...uploadData, documentNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Issuing Authority / Office</label>
                <input
                  type="text"
                  placeholder="e.g. Tahasildar / Revenue Officer"
                  value={uploadData.issuingAuthority}
                  onChange={(e) => setUploadData({ ...uploadData, issuingAuthority: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white font-bold rounded-xl shadow"
                >
                  Upload & Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
