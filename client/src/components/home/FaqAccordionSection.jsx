import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  ArrowRight, 
  Sparkles,
  BookOpen,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export const FaqAccordionSection = ({ onOpenJago }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [expandedId, setExpandedId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      id: 1,
      category: 'ELIGIBILITY',
      question: 'What is the "One-Scholarship-at-a-Time" statutory rule?',
      answer: 'Under Central Government financial discipline rules, a tribal student is entitled to receive only ONE Central or State scholarship concurrently for the same course of study. JanjatiSetu AI conflict engine checks cross-scheme registrations in real time so your application is never flagged for duplicate claim clawbacks.',
      tags: ['Statutory Rule', 'Conflict Engine']
    },
    {
      id: 2,
      category: 'DIGILOCKER',
      question: 'Do I need to scan and upload physical paper certificates?',
      answer: 'No! JanjatiSetu uses a 100% paperless DigiLocker PKI integration. Simply link your Aadhaar, and the portal cryptographically pulls your ST Caste Certificate, Family Income Proof, and 10th/12th Marksheets directly from state e-District databases.',
      tags: ['DigiLocker', 'Paperless']
    },
    {
      id: 3,
      category: 'TOP_CLASS',
      question: 'How do I claim the ₹45,000 one-time Laptop / Hardware grant under Top-Class Scheme?',
      answer: 'When applying for the Top-Class Scholarship at an empanelled institute (IITs, IIMs, AIIMS, NITs, NLUs), check the "Hardware / Laptop Assistance" option in the Application Wizard. Once sanctioned by MoTA, ₹45,000 is directly credited to your Aadhaar-seeded bank account for IT equipment purchase.',
      tags: ['Top-Class', '₹45,000 Laptop']
    },
    {
      id: 4,
      category: 'PFMS',
      question: 'What if my bank account is not seeded with NPCI Aadhaar Payment Bridge (APBS)?',
      answer: 'Direct Benefit Transfer (DBT) requires your bank account to be mapped with NPCI. You can check your APBS health status in our "PFMS DBT Tracker" page. If inactive, visit your bank branch and submit the Aadhaar Seeding Consent Form to activate APBS routing.',
      tags: ['PFMS DBT', 'NPCI APBS']
    },
    {
      id: 5,
      category: 'DIGILOCKER',
      question: 'What happens if a State e-District server is down during document fetch?',
      answer: 'Our verification layer has an automated non-blocking fallback. You can continue and submit your application without delay. An asynchronous worker verifies the documents once the state database recovers, or the Institute Nodal Officer validates it manually in their review console.',
      tags: ['Non-Blocking', 'Failover']
    },
    {
      id: 6,
      category: 'FELLOWSHIP',
      question: 'Can I apply for NFST Fellowship without qualifying UGC NET-JRF?',
      answer: 'Yes! While NET/GATE qualified candidates receive merit priority, ST students with regular registration in M.Phil / Ph.D. programs in recognized universities can apply for the NFST slots sanctioned annually by the Ministry of Tribal Affairs.',
      tags: ['NFST', 'Ph.D. Fellowship']
    },
    {
      id: 7,
      category: 'NOS',
      question: 'Which foreign universities are covered under the National Overseas Scholarship (NOS)?',
      answer: 'Institutions ranked within the Top 500 in the latest QS World University Rankings are covered. The scheme provides full foreign tuition, USD 15,400/yr (USA) or GBP 9,900/yr (UK) living stipend, medical insurance, visa fees, and return economy airfare.',
      tags: ['NOS Abroad', 'QS Top 500']
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'ALL' || faq.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-gov-blue text-xs font-extrabold tracking-wide uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            {t('faqBadge')}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('faqTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('faqDesc')}
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm mb-8 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchFaqPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-gov-blue transition"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {[
              { key: 'ALL', label: t('allCategories') },
              { key: 'ELIGIBILITY', label: t('eligibilityRulesTab') },
              { key: 'DIGILOCKER', label: t('digilockerDocsTab') },
              { key: 'TOP_CLASS', label: t('topClassLaptopTab') },
              { key: 'PFMS', label: t('pfmsBankTab') },
              { key: 'NOS', label: t('overseasNosTab') }
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  activeCategory === cat.key
                    ? 'bg-gov-blue text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 text-xs">
              No matching FAQ found. Ask JAGO AI for instant assistance in your native language.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                    isExpanded ? 'border-gov-blue ring-1 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-extrabold text-xs sm:text-sm text-slate-900"
                  >
                    <span>{faq.question}</span>
                    <div className={`p-1.5 rounded-full bg-slate-100 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180 bg-blue-100 text-gov-blue' : 'text-slate-500'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150 space-y-3">
                      <p>{faq.answer}</p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {faq.tags.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Help Banner */}
        <div className="mt-10 bg-gradient-to-r from-slate-900 to-gov-navy text-white rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <h4 className="font-extrabold text-sm sm:text-base">
              {t('stillHaveQuestions')}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Ask JAGO AI in your native tribal dialect or submit an official grievance inquiry.
            </p>
          </div>
          <button
            onClick={onOpenJago}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition"
          >
            <span>{t('askJagoVoiceAi')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FaqAccordionSection;
