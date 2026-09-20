import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, FileClock, ArrowRight, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export const PendingActionsPanel = ({ actions = [] }) => {
  if (!actions || actions.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">All Actions Up to Date</h4>
            <p className="text-[11px] text-slate-500">No pending queries or incomplete drafts requiring your action.</p>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-1 rounded-md">
          Zero Deficiencies
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-gov space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>Pending Actions ({actions.length})</span>
        </h3>
        <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
          Action Required
        </span>
      </div>

      <div className="space-y-2.5">
        {actions.map((act) => (
          <div
            key={act.id}
            className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                    act.severity === 'HIGH'
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {act.severity}
                </span>
                <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
              </div>
              <p className="text-xs text-slate-600">{act.description}</p>
            </div>

            <Link
              to={act.actionUrl}
              className="self-start sm:self-auto bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm whitespace-nowrap"
            >
              <span>{act.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
