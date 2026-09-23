import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Calendar, 
  FileText, 
  Download, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Filter, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const NewsUpdatesFeed = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [downloadModal, setDownloadModal] = useState(null);

  const updates = [
    {
      id: 1,
      category: 'SANCTION',
      tag: 'Sanction Order',
      tagColor: 'bg-emerald-100 text-emerald-800',
      title: 'MoTA Releases ₹184.20 Cr for Top-Class Higher Education Scheme (Q2 FY2026-27)',
      date: 'Sept 21, 2026',
      time: '14:30 IST',
      summary: 'Direct transfer to 246 premier institutes for tuition reimbursement and living allowances of 14,280 ST engineering and medical scholars.',
      sanctionNo: 'MoTA/DBT/2026-27/TOP-042',
      isNew: true
    },
    {
      id: 2,
      category: 'DEADLINE',
      tag: 'Important Deadline',
      tagColor: 'bg-rose-100 text-rose-800',
      title: 'Last Date for Pre-Matric & Post-Matric Fresh Applications Announced: Oct 31, 2026',
      date: 'Sept 18, 2026',
      time: '10:00 IST',
      summary: 'Students enrolled in Class IX to PG courses across all States and Union Territories must complete their DigiLocker e-KYC and submit online.',
      sanctionNo: 'MoTA/SCH/SCH-NOTICE-2026',
      isNew: true
    },
    {
      id: 3,
      category: 'GUIDELINE',
      tag: 'Official Guideline',
      tagColor: 'bg-blue-100 text-blue-800',
      title: 'Revised Guidelines for National Overseas Scholarship (NOS) for QS Top 500 Universities',
      date: 'Sept 12, 2026',
      time: '17:45 IST',
      summary: 'Enhanced contingency grant and simplified health insurance reimbursement protocol for tribal scholars in USA, UK, Australia & Germany.',
      sanctionNo: 'MoTA/NOS/POLICY/2026-V2',
      isNew: false
    },
    {
      id: 4,
      category: 'SANCTION',
      tag: 'Sanction Order',
      tagColor: 'bg-emerald-100 text-emerald-800',
      title: 'NFST Doctoral Fellowship August 2026 Monthly Stipend Disbursed via PFMS',
      date: 'Sept 05, 2026',
      time: '11:15 IST',
      summary: 'Monthly JRF (₹31,000) and SRF (₹35,000) fellowships with HRA credited directly to 3,420 tribal research scholars.',
      sanctionNo: 'MoTA/NFST/SFMP-82026',
      isNew: false
    },
    {
      id: 5,
      category: 'GRIEVANCE',
      tag: 'Grievance Drive',
      tagColor: 'bg-amber-100 text-amber-900',
      title: 'Special 7-Day Fast-Track Bank Seeding & NPCI Redressal Drive for PVTG Districts',
      date: 'Aug 29, 2026',
      time: '09:30 IST',
      summary: 'District Nodal Officers deployed in 75 PVTG clusters to resolve bank account mismatch and Aadhaar APBS inactive seeding.',
      sanctionNo: 'MoTA/APBS/PVTG-DRIVE-2026',
      isNew: false
    }
  ];

  const filteredUpdates = filter === 'ALL' 
    ? updates 
    : updates.filter(u => u.category === filter);

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-gov-blue text-xs font-extrabold tracking-wide uppercase mb-2">
              <Bell className="w-3.5 h-3.5" />
              Official Notifications
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Latest News, Sanction Orders & Circulars
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time administrative notices, PFMS DBT sanction ledgers, and deadline alerts directly from Shastri Bhawan, New Delhi.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
            {[
              { key: 'ALL', label: 'All Notices' },
              { key: 'SANCTION', label: 'Sanctions & DBT' },
              { key: 'DEADLINE', label: 'Deadlines' },
              { key: 'GUIDELINE', label: 'Guidelines' }
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filter === f.key
                    ? 'bg-gov-blue text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Notification Marquee Ticker */}
        <div className="bg-amber-500/10 border border-amber-300/60 rounded-2xl p-3 mb-8 flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] uppercase flex-shrink-0 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
            LIVE TICKER
          </div>
          <p className="text-xs font-bold text-amber-950 truncate">
            🔥 Fresh applications for Academic Year 2026-27 are now active across all 5 MoTA Schemes • DigiLocker e-KYC is mandatory for zero-document upload.
          </p>
        </div>

        {/* Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUpdates.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-gov-blue/50 p-5 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${item.tagColor}`}>
                    {item.tag}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{item.date}</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 leading-snug hover:text-gov-blue transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-400 truncate max-w-[150px]">
                  {item.sanctionNo}
                </span>

                <button
                  onClick={() => setDownloadModal(item)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-gov-blue hover:text-white text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Notice</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA to Payments Tracker */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/payments')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-gov-blue text-white text-xs font-extrabold shadow-md transition"
          >
            <span>Search All Central Sanctions in PFMS Ledger</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notice Viewer Modal */}
      {downloadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${downloadModal.tagColor}`}>
                  {downloadModal.tag}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-2">
                  {downloadModal.title}
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Official Order No:</span>
                <span className="font-mono font-bold text-slate-900">{downloadModal.sanctionNo}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Issued On:</span>
                <span className="font-semibold text-slate-900">{downloadModal.date} at {downloadModal.time}</span>
              </div>
              <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                {downloadModal.summary}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDownloadModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Downloading Official Circular: ${downloadModal.sanctionNo}.pdf`);
                  setDownloadModal(null);
                }}
                className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsUpdatesFeed;
