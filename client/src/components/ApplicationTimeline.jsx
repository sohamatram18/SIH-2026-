import React from 'react';
import { CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';

export const ApplicationTimeline = ({ timeline = [], currentStatus = 'Submitted', applicationNumber }) => {
  const standardStages = [
    { key: 'Submission', label: '1. Submission', desc: 'Unified Mobile Submission' },
    { key: 'Institute Verification', label: '2. Institute Scrutiny', desc: 'Bonafide & AISHE Verification' },
    { key: 'State Verification', label: '3. State Approval', desc: 'Welfare Department Check' },
    { key: 'Ministry Sanction', label: '4. Ministry Sanction', desc: 'Central Grant Authorization' },
    { key: 'PFMS DBT Disbursement', label: '5. PFMS DBT Credit', desc: 'Direct Benefit Transfer' },
  ];

  // Helper to map event status
  const getStageStatus = (stageKey) => {
    const event = timeline.find((e) => e.stage === stageKey);
    if (!event) return { state: 'PENDING', remarks: 'Awaiting stage initiation' };
    
    if (event.status.toLowerCase().includes('reject')) return { state: 'REJECTED', ...event };
    if (event.status.toLowerCase().includes('deficiency')) return { state: 'DEFICIENCY', ...event };
    if (event.status.toLowerCase().includes('process') || event.status.toLowerCase().includes('progress') || event.status.toLowerCase().includes('review')) {
      return { state: 'IN_PROGRESS', ...event };
    }
    return { state: 'COMPLETED', ...event };
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-gov space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gov-navy flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gov-blue" />
              Real-Time Verification & DBT Timeline
            </span>
            <span className="chip chip-under-verification">{currentStatus}</span>
          </div>
          {applicationNumber && (
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Ref: <strong className="text-slate-800">{applicationNumber}</strong>
            </p>
          )}
        </div>
        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold border border-emerald-200 flex items-center gap-1 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          End-to-End Gov Integration
        </span>
      </div>

      {/* Horizontal Steps on Desktop / Vertical on Mobile */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {standardStages.map((stage, idx) => {
            const info = getStageStatus(stage.key);

            let iconColor = 'bg-slate-100 text-slate-400 border-slate-200';
            let badgeText = 'Pending';
            let badgeClass = 'text-slate-500 bg-slate-100';

            if (info.state === 'COMPLETED') {
              iconColor = 'bg-emerald-500 text-white border-emerald-600 shadow';
              badgeText = 'Completed';
              badgeClass = 'text-emerald-700 bg-emerald-50 border border-emerald-200';
            } else if (info.state === 'IN_PROGRESS') {
              iconColor = 'bg-gov-blue text-white border-blue-600 animate-pulse shadow';
              badgeText = 'In Progress';
              badgeClass = 'text-blue-700 bg-blue-50 border border-blue-200';
            } else if (info.state === 'DEFICIENCY') {
              iconColor = 'bg-amber-500 text-white border-amber-600 shadow';
              badgeText = 'Query Raised';
              badgeClass = 'text-amber-800 bg-amber-50 border border-amber-300';
            } else if (info.state === 'REJECTED') {
              iconColor = 'bg-red-500 text-white border-red-600 shadow';
              badgeText = 'Rejected';
              badgeClass = 'text-red-700 bg-red-50 border border-red-200';
            }

            return (
              <div
                key={stage.key}
                className={`p-3 rounded-2xl border transition ${
                  info.state === 'IN_PROGRESS'
                    ? 'border-blue-300 bg-blue-50/40 ring-2 ring-blue-200/50'
                    : info.state === 'COMPLETED'
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : info.state === 'DEFICIENCY'
                    ? 'border-amber-300 bg-amber-50/40'
                    : 'border-slate-100 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border ${iconColor}`}>
                    {info.state === 'COMPLETED' ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badgeClass}`}>
                    {badgeText}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 leading-tight">
                  {stage.label}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {stage.desc}
                </p>

                {info.remarks && (
                  <p className="text-[10px] text-slate-600 bg-white/80 p-1.5 rounded-lg mt-2 border border-slate-200/60 line-clamp-2">
                    {info.remarks}
                  </p>
                )}
                {info.timestamp && (
                  <span className="text-[9px] text-slate-400 block mt-1">
                    {new Date(info.timestamp).toLocaleDateString()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
