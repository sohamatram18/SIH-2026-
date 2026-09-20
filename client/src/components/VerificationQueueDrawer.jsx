import React, { useEffect, useState } from 'react';
import { walletAPI } from '../services/api.js';
import { 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const VerificationQueueDrawer = ({ isOpen, onClose }) => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const loadQueue = async () => {
    try {
      setLoading(true);
      const res = await walletAPI.getReviewQueue();
      if (res.data.success) {
        setQueue(res.data.queue);
      }
    } catch (err) {
      console.error('Failed to load review queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadQueue();
    }
  }, [isOpen]);

  const handleResolve = async (decision) => {
    if (!selectedItem) return;
    try {
      setSubmitting(true);
      const res = await walletAPI.resolveReview(selectedItem._id, {
        decision,
        reviewNotes: reviewNotes || (decision === 'APPROVE' ? 'Manually verified by Nodal Officer' : 'Rejected after document inspection'),
      });
      if (res.data.success) {
        setMsg({ type: 'success', text: `Item marked as ${decision === 'APPROVE' ? 'VERIFIED' : 'REJECTED'}` });
        setSelectedItem(null);
        setReviewNotes('');
        await loadQueue();
      }
    } catch (err) {
      alert('Action failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gov-navy text-white">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">Nodal Officer Manual Review Queue</h3>
              <p className="text-[10px] text-amber-300">Non-blocking automated verification exception handler</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 text-emerald-900 border-b border-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Loading review queue...
            </div>
          ) : queue.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Verification Queue is Clear</p>
              <p className="text-[11px] text-slate-400">
                All automated adapter verifications passed successfully with zero manual exceptions.
              </p>
            </div>
          ) : (
            queue.map((item) => (
              <div
                key={item._id}
                className={`p-4 rounded-2xl border transition space-y-3 ${
                  selectedItem?._id === item._id
                    ? 'bg-amber-50/50 border-amber-400 shadow-md ring-2 ring-amber-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    {item.verificationType || 'DOCUMENT_VERIFICATION'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-900">
                    {item.documentId?.title || 'Submitted Certificate'}
                  </h4>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    {item.documentId?.documentNumber && (
                      <p>Number: <strong className="font-mono text-slate-800">{item.documentId.documentNumber}</strong></p>
                    )}
                    {item.documentId?.issuingAuthority && (
                      <p>Authority: <span className="font-semibold text-slate-700">{item.documentId.issuingAuthority}</span></p>
                    )}
                    <p className="text-amber-800 bg-amber-100/60 p-2 rounded-xl text-[10px] font-medium mt-1">
                      ⚠️ Reason: {item.rawResponse?.message || 'Adapter returned manual inspection flag'}
                    </p>
                  </div>
                </div>

                {selectedItem?._id === item._id ? (
                  <div className="space-y-2 pt-2 border-t border-amber-200">
                    <label className="block text-[11px] font-bold text-slate-700">
                      Officer Decision Notes:
                    </label>
                    <textarea
                      rows={2}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="e.g. Scanned seal verified against state revenue stamp directory"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleResolve('APPROVE')}
                        disabled={submitting}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Verify</span>
                      </button>
                      <button
                        onClick={() => handleResolve('REJECT')}
                        disabled={submitting}
                        className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow"
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Reject / Flag</span>
                      </button>
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition"
                  >
                    <span>Inspect & Take Decision</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-center text-[10px] text-slate-400">
          MoTA 11-Adapter Unified Verification Layer • SLA 48h Resolution
        </div>
      </div>
    </div>
  );
};

export default VerificationQueueDrawer;
