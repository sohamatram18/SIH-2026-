import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Layers, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  GraduationCap, 
  Laptop, 
  Globe, 
  Award,
  Sparkles,
  Info
} from 'lucide-react';

export const SchemeCompareModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const schemes = [
    {
      code: 'PRE_MATRIC',
      name: 'Pre-Matric ST Scholarship',
      short: 'Pre-Matric',
      target: 'Class IX & X in Govt / EMRS Schools',
      incomeLimit: '≤ ₹2.50 Lakh / year',
      tuitionCoverage: 'Compulsory school fees covered',
      maintenanceAllowance: 'Day Scholar: ₹3,500/yr • Hosteller: ₹7,000/yr',
      specialGrant: '10% additional allowance for Divyang students',
      laptopGrant: 'Not Applicable',
      fellowshipStipend: 'N/A',
      docRequired: 'Aadhaar, ST Caste Certificate, Income Proof, Class 8 Marksheet',
      disbursement: 'Annual DBT into Aadhaar-linked Bank Account',
      portalLink: '/apply/PRE_MATRIC'
    },
    {
      code: 'POST_MATRIC',
      name: 'Post-Matric ST Scholarship',
      short: 'Post-Matric',
      target: 'Class XI to Post-Doctoral degrees (UG/PG)',
      incomeLimit: '≤ ₹2.50 Lakh / year',
      tuitionCoverage: '100% Compulsory Non-Refundable Course Fees',
      maintenanceAllowance: '₹2,500 to ₹13,500 / year (Group-wise slabs)',
      specialGrant: 'Study tour & thesis typing charges for professional courses',
      laptopGrant: 'Not Included in standard slab',
      fellowshipStipend: 'N/A',
      docRequired: 'Aadhaar, ST Certificate, Income, 10th/12th/UG Marksheet, Fee Receipt',
      disbursement: 'Annual direct PFMS APBS transfer',
      portalLink: '/apply/POST_MATRIC'
    },
    {
      code: 'TOP_CLASS',
      name: 'National Scholarship for Higher Education (Top Class)',
      short: 'Top Class (IIT/IIM)',
      target: '246 Notified Institutes (IITs, IIMs, AIIMS, NITs, NLUs)',
      incomeLimit: '≤ ₹6.00 Lakh / year',
      tuitionCoverage: '100% Full Tuition & Non-Refundable Institute Fees',
      maintenanceAllowance: '₹36,000 / year (₹3,000 per month living allowance)',
      specialGrant: '₹5,000 / year Books & Stationery grant',
      laptopGrant: '₹45,000 One-time grant (Computer / Laptop)',
      fellowshipStipend: 'N/A',
      docRequired: 'Aadhaar, ST Certificate, Income Proof, JEE/CAT/NEET Rank, Institute ID',
      disbursement: 'Tuition to Institute + Living & Hardware directly to Student',
      portalLink: '/apply/TOP_CLASS'
    },
    {
      code: 'NFST',
      name: 'National Fellowship for ST Students (NFST)',
      short: 'NFST (PhD Fellowship)',
      target: 'Full-time M.Phil & Ph.D. scholars in UGC Universities',
      incomeLimit: 'No Income Cap (Pure Merit & UGC Registration)',
      tuitionCoverage: 'Fellowship stipend + University fees',
      maintenanceAllowance: 'JRF: ₹31,000/mo • SRF: ₹35,000/mo',
      specialGrant: 'Contingency: ₹10,000 - ₹12,000/yr + HRA as per UGC city norms',
      laptopGrant: 'Purchasable from Contingency Grant',
      fellowshipStipend: '₹31,000 to ₹35,000 / month',
      docRequired: 'UGC NET/Admission Proof, Ph.D. Registration, ST Certificate, Guide Letter',
      disbursement: 'Monthly Direct DBT via Canara Bank / PFMS SFMP',
      portalLink: '/apply/NFST'
    },
    {
      code: 'NOS',
      name: 'National Overseas Scholarship (NOS)',
      short: 'NOS (Abroad Studies)',
      target: 'Master’s & Ph.D. in Top 500 QS World Universities',
      incomeLimit: '≤ ₹6.00 Lakh / year (55%+ marks in qualifying degree)',
      tuitionCoverage: '100% Foreign Tuition & Exam Fees directly to University',
      maintenanceAllowance: 'USD 15,400 / yr (USA) • GBP 9,900 / yr (UK & other countries)',
      specialGrant: 'Economy return airfare, Visa fees, Medical Insurance, ₹1,500 Books',
      laptopGrant: 'Contingency allowance includes research hardware',
      fellowshipStipend: 'Quarterly living allowance disbursement',
      docRequired: 'Passport, Foreign University Offer Letter, ST Certificate, ITR/Income Proof',
      disbursement: 'Indian Embassy / MoTA Foreign Exchange DBT',
      portalLink: '/apply/NOS'
    }
  ];

  const [selectedCodes, setSelectedCodes] = useState(['POST_MATRIC', 'TOP_CLASS', 'NOS']);

  if (!isOpen) return null;

  const toggleScheme = (code) => {
    if (selectedCodes.includes(code)) {
      if (selectedCodes.length > 2) {
        setSelectedCodes(selectedCodes.filter(c => c !== code));
      }
    } else {
      if (selectedCodes.length < 3) {
        setSelectedCodes([...selectedCodes, code]);
      } else {
        setSelectedCodes([selectedCodes[1], selectedCodes[2], code]);
      }
    }
  };

  const activeSchemes = schemes.filter(s => selectedCodes.includes(s.code));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-gov-navy via-slate-900 to-gov-blue text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                Side-by-Side MoTA Scheme Comparator
              </h3>
              <p className="text-xs text-slate-300">
                Compare benefits, income ceilings, laptop grants, and allowances across 5 official Central schemes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scheme Selector Pills */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span>Select 2 to 3 Schemes:</span>
            <span className="text-[11px] font-normal text-slate-500">(Click to toggle comparison)</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {schemes.map(s => {
              const isSelected = selectedCodes.includes(s.code);
              return (
                <button
                  key={s.code}
                  onClick={() => toggleScheme(s.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-gov-blue text-white shadow-sm' 
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{s.short}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison Table / Matrix */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 font-black text-slate-400 uppercase tracking-wider w-1/4 bg-slate-50/50 rounded-tl-xl">
                    Criteria
                  </th>
                  {activeSchemes.map((s, idx) => (
                    <th key={s.code} className="py-3 px-4 font-black text-slate-900 text-sm bg-blue-50/40 border-l border-slate-200">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded bg-gov-blue text-white text-[10px] font-mono">
                          {s.code}
                        </span>
                        <div className="font-extrabold text-slate-900 line-clamp-2">
                          {s.name}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Row 1: Target Cohort */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/30">Target Cohort</td>
                  {activeSchemes.map(s => (
                    <td key={s.code} className="py-3 px-4 text-slate-800 border-l border-slate-100">
                      {s.target}
                    </td>
                  ))}
                </tr>

                {/* Row 2: Income Ceiling */}
                <tr className="bg-amber-50/20">
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/30">Family Income Cap</td>
                  {activeSchemes.map(s => (
                    <td key={s.code} className="py-3 px-4 font-extrabold text-amber-900 border-l border-slate-100">
                      {s.incomeLimit}
                    </td>
                  ))}
                </tr>

                {/* Row 3: Tuition Fee Coverage */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/30">Tuition Fee Support</td>
                  {activeSchemes.map(s => (
                    <td key={s.code} className="py-3 px-4 text-emerald-800 font-semibold border-l border-slate-100">
                      {s.tuitionCoverage}
                    </td>
                  ))}
                </tr>

                {/* Row 4: Maintenance Allowance */}
                <tr className="bg-emerald-50/20">
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/30">Living / Maintenance</td>
                  {activeSchemes.map(s => (
                    <td key={s.code} className="py-3 px-4 font-bold text-emerald-900 border-l border-slate-100">
                      {s.maintenanceAllowance}
                    </td>
                  ))}
                </tr>

                {/* Row 5: Laptop & Hardware Entitlement */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/30">Laptop Grant (₹45,000)</td>
                  {activeSchemes.map(s => (
                    <td key={s.code} className="py-3 px-4 border-l border-slate-100">
                      {s.code === 'TOP_CLASS' ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-black text-[11px] border border-amber-300">
                          ₹45,000 One-Time Grant
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">{s.laptopGrant}</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Row 6: Required Documents */}
                <tr>
                  <td className="py-3 px-4 font-bold text-slate-700 bg-slate-50/30">DigiLocker Verification</td>
                  {activeSchemes.map(s => (
                    <td key={s.code} className="py-3 px-4 text-slate-600 border-l border-slate-100 text-[11px]">
                      {s.docRequired}
                    </td>
                  ))}
                </tr>

                {/* Row 7: Action Row */}
                <tr className="bg-slate-50">
                  <td className="py-4 px-4 font-bold text-slate-700">Apply Directly</td>
                  {activeSchemes.map(s => (
                    <td key={s.code} className="py-4 px-4 border-l border-slate-200">
                      <button
                        onClick={() => {
                          onClose();
                          navigate(s.portalLink);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-gov-blue hover:bg-gov-navy text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <span>Apply {s.short}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Data synced with official MoTA guidelines & statutory orders.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition"
          >
            Close Comparator
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemeCompareModal;
