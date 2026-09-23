import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  MessageSquare, 
  PhoneCall, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  Send, 
  ThumbsUp, 
  Clock,
  User,
  ShieldCheck
} from 'lucide-react';

export const ExpertHelpCommunity = ({ onOpenJago }) => {
  const navigate = useNavigate();
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const communityQA = [
    {
      question: 'Can I apply for both Top-Class Higher Education and State Post-Matric scholarship?',
      asker: 'Mangal Munda (IIT Kharagpur)',
      date: '2 days ago',
      answer: 'No. As per Central Government statutory rules, a student can receive only ONE Central or State scholarship concurrently. If you are admitted to an empanelled Top-Class institute, apply for Top-Class to receive full tuition + ₹45,000 laptop grant.',
      officer: 'Officer Scrutiny Desk (MoTA)',
      likes: 42
    },
    {
      question: 'How long does DigiLocker e-KYC take if the State e-District server is slow?',
      asker: 'Sunita Soren (Utkal University)',
      date: '4 days ago',
      answer: 'Our verification layer has an automated 8-second circuit breaker. If State e-District is slow, you are NOT blocked — you can submit your application immediately, and the officer verifies it asynchronously.',
      officer: 'Nodal Technical Team',
      likes: 68
    },
    {
      question: 'Is there any family income ceiling for the NFST Doctoral Fellowship?',
      asker: 'Dr. Rajesh Gond (Research Scholar)',
      date: '1 week ago',
      answer: 'No. The National Fellowship for ST (NFST) has ZERO family income cap. It is purely awarded on merit to regular M.Phil and Ph.D. scholars in UGC-recognized universities.',
      officer: 'MoTA Central Fellowship Desk',
      likes: 89
    }
  ];

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setUserQuestion('');
      setAskModalOpen(false);
    }, 2000);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold tracking-wide uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            Assistance & Community
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Expert Help & Student Discussion Forum
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Get instant answers in your native language through the JAGO AI Voice Assistant or connect directly with MoTA Nodal Officers and tribal peer scholars.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: JAGO AI & Helpdesk Channels (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* JAGO AI Big Feature Card */}
            <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-6 sm:p-7 text-slate-950 shadow-xl space-y-5 relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-white text-slate-950 flex items-center justify-center font-bold shadow-md">
                  <Bot className="w-8 h-8 text-slate-950" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black tracking-wider uppercase">
                  24x7 Multilingual AI
                </span>
              </div>

              <div>
                <h3 className="font-black text-xl text-slate-950">
                  JAGO (जागो) Tribal AI Assistant
                </h3>
                <p className="text-xs text-amber-950 font-medium mt-1 leading-relaxed">
                  Ask questions via Speech-to-Text or chat in <strong>6 Indian languages</strong> (English, हिन्दी, ଓଡ଼ିଆ, বাংলা, संथाली, गोंडी) with tribal cultural greetings (<em>Johar!</em>).
                </p>
              </div>

              <div className="space-y-2 text-xs font-semibold text-amber-950">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Scheme recommendations & conflict checks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>DigiLocker document guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>PFMS DBT sanction status queries</span>
                </div>
              </div>

              <button
                onClick={onOpenJago}
                className="w-full py-3 px-5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition hover:scale-[1.02]"
              >
                <Bot className="w-4 h-4" />
                <span>Launch Voice Assistant Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Helpline Channels Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-gov-blue" />
                National Tribal Helpdesk
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Toll-Free National Hotline</span>
                    <p className="font-extrabold text-slate-900 text-sm">1800-11-7788</p>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    Mon-Sat (9 AM - 6 PM)
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Direct Grievance Desk</span>
                    <p className="font-extrabold text-slate-900 text-sm">grievance-mota@gov.in</p>
                  </div>
                  <button
                    onClick={() => navigate('/grievance')}
                    className="px-2.5 py-1 bg-gov-blue text-white rounded-lg text-xs font-bold hover:bg-gov-navy transition"
                  >
                    File Appeal
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Community Q&A Board (7 Cols) */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gov-blue" />
                <h3 className="font-extrabold text-base text-slate-900">
                  Recent Verified Answers
                </h3>
              </div>
              <button
                onClick={() => setAskModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gov-blue hover:bg-gov-navy text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
              >
                <span>Ask a Question</span>
              </button>
            </div>

            {/* Q&A List */}
            <div className="space-y-4">
              {communityQA.map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      Q: {item.question}
                    </h4>
                  </div>

                  <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100 text-xs text-slate-700 leading-relaxed space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-gov-blue uppercase">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Officer Response • {item.officer}</span>
                    </div>
                    <p>{item.answer}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Asked by {item.asker} • {item.date}</span>
                    <span className="flex items-center gap-1 text-slate-600 font-semibold">
                      <ThumbsUp className="w-3.5 h-3.5 text-amber-500" />
                      {item.likes} found helpful
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ask Question Modal */}
      {askModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-extrabold text-base text-slate-900">
              Ask MoTA Nodal Officer & Community
            </h3>
            <p className="text-xs text-slate-500">
              Post your query regarding eligibility, DigiLocker verification, or PFMS DBT bank transfers.
            </p>

            {submittedMessage ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">Question Submitted Successfully!</h4>
                <p className="text-xs text-emerald-700">A MoTA Nodal Officer will verify and reply shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleQuestionSubmit} className="space-y-4">
                <textarea
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="Type your scholarship query here in detail..."
                  rows={4}
                  required
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-gov-blue"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAskModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Query</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ExpertHelpCommunity;
