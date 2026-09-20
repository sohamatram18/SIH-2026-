import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, FileText, ArrowRight, X, Lock, ExternalLink } from 'lucide-react';

export const DigiLockerModal = ({ onFetchComplete, onClose }) => {
  const [fetching, setFetching] = useState(false);
  const [step, setStep] = useState('CONSENT'); // 'CONSENT' | 'FETCHING' | 'SUCCESS'

  const availableCerts = [
    { title: 'Scheduled Tribe (ST) Certificate', issuer: 'State Revenue Department', docType: 'ST_CERTIFICATE' },
    { title: 'Parental Income Certificate', issuer: 'Revenue Officer (Valid 2026-27)', docType: 'INCOME_CERTIFICATE' },
    { title: 'State Domicile / Residence Certificate', issuer: 'Sub-Divisional Magistrate', docType: 'DOMICILE_CERTIFICATE' },
    { title: 'Secondary / High School Marksheet', issuer: 'State Board of Secondary Education', docType: 'PREVIOUS_MARKSHEET' },
  ];

  const handleAuthorize = async () => {
    setStep('FETCHING');
    setFetching(true);
    try {
      await onFetchComplete();
      setStep('SUCCESS');
    } catch (err) {
      alert('DigiLocker synchronization failed: ' + err.message);
      setStep('CONSENT');
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        {/* DigiLocker Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow">
              DL
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>DigiLocker Digital Wallet</span>
                <span className="text-[10px] bg-blue-50 text-blue-800 font-bold px-1.5 py-0.2 rounded border border-blue-200">
                  MeriPehchaan
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">Ministry of Electronics & IT (MeitY)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'CONSENT' && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1.5">
              <p className="font-bold text-blue-950 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-gov-blue" />
                <span>One-Click Digital Certificate Synchronization</span>
              </p>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                By providing consent, the Unified Tribal Scholarship Portal will pull digitally signed, tamper-proof certificates directly from your Aadhaar/APAAR-linked DigiLocker account:
              </p>
            </div>

            <div className="space-y-2">
              {availableCerts.map((cert, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gov-blue flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800 text-[11px]">{cert.title}</p>
                      <p className="text-[10px] text-slate-500">{cert.issuer}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Ready
                  </span>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>DPDP Act 2023 Compliant: Certificates used exclusively for MoTA scholarship verification.</span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAuthorize}
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl shadow flex items-center gap-1.5"
              >
                <span>Authorize & Fetch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 'FETCHING' && (
          <div className="py-12 text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gov-blue mx-auto"></div>
            <p className="text-xs font-bold text-slate-800">Connecting to DigiLocker PKI Gateway...</p>
            <p className="text-[11px] text-slate-500">Verifying digital signatures with State Issuing Authorities</p>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">DigiLocker Certificates Imported!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your ST Caste, Income, and Domicile certificates are verified and saved in your Document Wallet.
            </p>
            <button
              onClick={onClose}
              className="bg-gov-blue text-white text-xs font-bold px-5 py-2 rounded-xl shadow mt-2"
            >
              View Document Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
