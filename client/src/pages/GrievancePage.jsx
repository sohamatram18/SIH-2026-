import React, { useEffect, useState } from 'react';
import { grievanceAPI } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { 
  HelpCircle, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  Phone, 
  Mail, 
  ShieldAlert, 
  ChevronRight, 
  ArrowUpRight, 
  ExternalLink,
  LifeBuoy,
  X
} from 'lucide-react';

export const GrievancePage = () => {
  const { user, student } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [escalatingId, setEscalatingId] = useState(null);
  const [msg, setMsg] = useState(null);

  const [formData, setFormData] = useState({
    schemeCode: 'GENERAL',
    category: 'DBT_DISBURSEMENT_DELAY',
    subject: '',
    description: '',
    priority: 'NORMAL',
  });

  const loadGrievances = async () => {
    try {
      setLoading(true);
      const res = await grievanceAPI.getGrievances();
      if (res.data.success) {
        setGrievances(res.data.grievances);
        if (selectedGrievance) {
          const updated = res.data.grievances.find((g) => g._id === selectedGrievance._id);
          if (updated) setSelectedGrievance(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load grievances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrievances();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await grievanceAPI.raiseGrievance(formData);
      if (res.data.success) {
        setMsg({ type: 'success', text: `Grievance ticket #${res.data.grievance.ticketNumber || 'NEW'} registered successfully.` });
        setModalOpen(false);
        setFormData({
          schemeCode: 'GENERAL',
          category: 'PAYMENT_DELAY',
          subject: '',
          description: '',
          priority: 'MEDIUM',
        });
        await loadGrievances();
      }
    } catch (err) {
      alert('Error registering grievance: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEscalate = async (id) => {
    try {
      setEscalatingId(id);
      const res = await grievanceAPI.escalateGrievance(id);
      if (res.data.success) {
        setMsg({ type: 'success', text: 'Ticket escalated to MoTA Central Redressal Cell.' });
        await loadGrievances();
      }
    } catch (err) {
      alert('Escalation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setEscalatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Resolved
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-600" />
            Investigating
          </span>
        );
      case 'ESCALATED':
        return (
          <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-300 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-purple-600" />
            Escalated to MoTA
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            Submitted
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
            <LifeBuoy className="w-6 h-6 text-gov-blue" />
            <span>Tribal Student Grievance Redressal</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Direct dispute resolution for MoTA schemes with SLA-backed escalation matrix
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Grievance</span>
        </button>
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

      {/* Main Grid: Tickets on Left, Helpline & Selected Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ticket List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Your Support Tickets</h3>
            <span className="text-xs text-slate-500">{grievances.length} Registered</span>
          </div>

          {loading ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              Loading grievances...
            </div>
          ) : grievances.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3 shadow-gov">
              <LifeBuoy className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">No Open Grievance Tickets</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                If you encounter delays in verification, bank account rejection, or DBT disbursement, raise a ticket here for prompt resolution.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-gov-blue text-white text-xs font-bold px-4 py-2 rounded-xl shadow mt-2"
              >
                Raise a Ticket
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {grievances.map((g) => (
                <div
                  key={g._id}
                  onClick={() => setSelectedGrievance(g)}
                  className={`bg-white rounded-3xl border p-4 sm:p-5 shadow-gov hover:shadow-gov-lg transition cursor-pointer space-y-2.5 ${
                    selectedGrievance?._id === g._id
                      ? 'border-gov-blue ring-2 ring-blue-100'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        #{g.ticketNumber || g._id.slice(-6).toUpperCase()}
                      </span>
                      <span className="text-[10px] font-bold text-gov-blue bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        {g.schemeCode || 'GENERAL'}
                      </span>
                    </div>
                    {getStatusBadge(g.status)}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {g.subject}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {g.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Category: <strong>{g.category?.replace(/_/g, ' ')}</strong></span>
                    <span>{new Date(g.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Ticket Detail / Quick Contacts */}
        <div className="space-y-4">
          {selectedGrievance ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-gov space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">Active Ticket</span>
                  <h4 className="text-sm font-bold text-slate-900 font-mono">
                    #{selectedGrievance.ticketNumber || selectedGrievance._id.slice(-6).toUpperCase()}
                  </h4>
                </div>
                {getStatusBadge(selectedGrievance.status)}
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Subject</span>
                  <p className="font-bold text-slate-800">{selectedGrievance.subject}</p>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Student Statement</span>
                  <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-0.5 leading-relaxed">
                    {selectedGrievance.description}
                  </p>
                </div>

                {selectedGrievance.resolutionNotes && (
                  <div>
                    <span className="text-emerald-700 text-[10px] uppercase font-bold">Officer Resolution</span>
                    <p className="text-emerald-900 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 mt-0.5 leading-relaxed">
                      {selectedGrievance.resolutionNotes}
                    </p>
                  </div>
                )}
              </div>

              {selectedGrievance.status !== 'RESOLVED' && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleEscalate(selectedGrievance._id)}
                    disabled={escalatingId === selectedGrievance._id || selectedGrievance.status === 'ESCALATED'}
                    className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
                    <span>
                      {selectedGrievance.status === 'ESCALATED'
                        ? 'Already Escalated to MoTA'
                        : 'Escalate to MoTA Central Cell'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* MoTA Official Helpdesk Card */}
          <div className="bg-gradient-to-br from-gov-navy to-slate-900 rounded-3xl p-5 text-white shadow-gov space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">MoTA Helpdesk</h4>
                <p className="text-[11px] text-amber-300">National Tribal Support Cell</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Toll-Free Helpline</span>
                  <strong className="text-white">1800-11-7777</strong> (09:30 - 18:00 IST)
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Official Support Email</span>
                  <span className="text-white font-mono">tribal-scholarships@gov.in</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-normal">
              MoTA grievance tickets have an SLA of 48 working hours for initial nodal officer assignment.
            </p>
          </div>
        </div>
      </div>

      {/* Raise Grievance Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Raise Grievance Ticket</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Related MoTA Scheme</label>
                <select
                  value={formData.schemeCode}
                  onChange={(e) => setFormData({ ...formData, schemeCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="GENERAL">General / Portal Issue</option>
                  <option value="PRE_MATRIC">Pre-Matric Scholarship (Class IX-X)</option>
                  <option value="POST_MATRIC">Post-Matric Scholarship (Class XI-PhD)</option>
                  <option value="TOP_CLASS">Top Class Education for ST</option>
                  <option value="NFST">National Fellowship for ST (M.Phil / PhD)</option>
                  <option value="NOS">National Overseas Scholarship (NOS)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="DBT_DISBURSEMENT_DELAY">Payment Delay / DBT Disbursal</option>
                  <option value="INCORRECT_BANK_ACCOUNT">Bank Account / NPCI Seeding Issue</option>
                  <option value="INSTITUTE_VERIFICATION_DELAY">Institute or State Verification Delay</option>
                  <option value="DEFICIENCY_CLARIFICATION">Deficiency Clarification / Document Error</option>
                  <option value="DOCUMENT_MISMATCH_QUERY">Document Mismatch / Verification Issue</option>
                  <option value="STATE_SCRUTINY_QUERY">State Scrutiny Inquiry</option>
                  <option value="TECHNICAL_GLITCH">Portal Technical Glitch</option>
                  <option value="OTHER">Other Query</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. DBT payment delayed for Q2 installment"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe your issue with exact application number or certificate details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl leading-relaxed"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white font-bold rounded-xl shadow disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Register Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievancePage;
