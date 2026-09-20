import React, { useEffect, useState } from 'react';
import { applicationAPI } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  X, 
  Sparkles, 
  ShieldAlert, 
  Building,
  GraduationCap
} from 'lucide-react';

export const EligibilityCheckerModal = ({ schemeCode, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const runCheck = async () => {
      try {
        setLoading(true);
        const res = await applicationAPI.checkEligibility(schemeCode);
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to run eligibility check:', err);
      } finally {
        setLoading(false);
      }
    };
    runCheck();
  }, [schemeCode]);

  const handleApply = (targetSchemeCode) => {
    onClose();
    navigate(`/apply/${targetSchemeCode}`);
  };

  const evaluations = data?.evaluations || (data?.evaluation ? [data.evaluation] : []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Live Scheme Eligibility Engine
              </h3>
              <p className="text-xs text-slate-500">
                Automated MoTA criteria evaluation against your verified profile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Evaluating rules from MoTA scheme configuration...
          </div>
        ) : !data?.isProfileComplete ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-2">
            <p className="font-bold">Student Profile Incomplete</p>
            <p>{data?.message || 'Please complete your student profile to run eligibility checks.'}</p>
            <button
              onClick={() => { onClose(); navigate('/profile'); }}
              className="bg-gov-blue text-white px-3 py-1.5 rounded-xl font-bold"
            >
              Update Profile Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {evaluations.map((ev) => (
              <div
                key={ev.schemeCode}
                className={`p-4 rounded-2xl border transition ${
                  ev.verdict === 'ELIGIBLE'
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : ev.verdict === 'CONDITIONAL'
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200 bg-slate-50/40'
                }`}
              >
                {/* Scheme Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {ev.schemeCode}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {ev.schemeName}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">
                      {ev.percentageMatch}% Match
                    </span>
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                        ev.verdict === 'ELIGIBLE'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : ev.verdict === 'CONDITIONAL'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {ev.verdict}
                    </span>
                  </div>
                </div>

                {/* Conflict Notice if any */}
                {ev.hasConflict && (
                  <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 mb-3 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">One Scholarship Rule Warning:</p>
                      <p className="text-[11px] text-amber-800">{ev.conflictDetails?.message}</p>
                    </div>
                  </div>
                )}

                {/* Criteria Checklist */}
                <div className="space-y-1.5 my-3 text-xs">
                  {ev.reasons.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-white rounded-xl border border-slate-100 flex items-start gap-2"
                    >
                      {r.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-bold text-slate-800 block">{r.rule}</span>
                        <span className="text-[11px] text-slate-500">{r.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preferential Notes */}
                {ev.preferentialNotes && ev.preferentialNotes.length > 0 && (
                  <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-xs text-purple-900 mb-3 space-y-1">
                    <span className="font-bold block text-[11px] text-purple-800">
                      ★ Preferential Allocations Available:
                    </span>
                    {ev.preferentialNotes.map((note, idx) => (
                      <p key={idx} className="text-[11px] text-purple-700">
                        • {note}
                      </p>
                    ))}
                  </div>
                )}

                {/* Apply Button */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-500">
                    Est. Benefit: <strong className="text-slate-700">{ev.estimatedEntitlement}</strong>
                  </span>
                  <button
                    onClick={() => handleApply(ev.schemeCode)}
                    disabled={ev.hasConflict}
                    className="bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm disabled:opacity-40"
                  >
                    <span>{ev.hasConflict ? 'Active Conflict' : 'Apply Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
