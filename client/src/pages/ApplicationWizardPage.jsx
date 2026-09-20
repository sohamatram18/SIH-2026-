import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { applicationAPI, schemeAPI } from '../services/api.js';
import { 
  Building2, 
  GraduationCap, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  Save, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  Sparkles,
  Lock,
  AlertTriangle
} from 'lucide-react';

export const ApplicationWizardPage = () => {
  const { schemeCode, applicationId } = useParams();
  const { student } = useAuth();
  const navigate = useNavigate();

  const [scheme, setScheme] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [appId, setAppId] = useState(applicationId || null);
  const [loading, setLoading] = useState(true);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [conflictError, setConflictError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Wizard Form State prefilled from verified student profile
  const [formData, setFormData] = useState({
    // Step 1: Personal & Tribal Domicile
    applicantName: '',
    dob: '',
    gender: 'Male',
    tribe: '',
    isPVTG: false,
    pvtgCommunity: '',
    isDivyang: false,
    divyangType: '',
    divyangPercentage: 0,
    state: '',
    district: '',
    address: '',
    pincode: '',
    apaarId: '',

    // Step 2: Academic & Institution
    courseLevel: 'Pre-Matric',
    course: '',
    yearOfStudy: 1,
    institutionName: '',
    aisheCode: '',
    isHosteller: false,
    mastersPercentage: 0,

    // Step 3: Income & Calculated Allowances
    familyAnnualIncome: 0,
    estimatedMaintenanceAllowance: '',
    estimatedTotalEntitlement: '',

    // Step 4: Documents Attached
    documentsAttached: [],

    // Step 5: Statutory Undertaking
    dpdpConsentGiven: true,
    noOtherScholarshipDeclared: false,
  });

  // Load Scheme & Existing Application (if any)
  useEffect(() => {
    const initWizard = async () => {
      try {
        setLoading(true);
        const schemeRes = await schemeAPI.getByCode(schemeCode);
        if (schemeRes.data.success) {
          setScheme(schemeRes.data.scheme);
        }

        // Prefill from student profile
        if (student) {
          const defaultDocs = (schemeRes.data.scheme?.documentsRequired || []).map((d) => ({
            docType: d.docType,
            docName: d.name,
            isVerified: true,
            verificationSource: 'DigiLocker / Nodal Verified',
            verifiedAt: new Date(),
          }));

          setFormData((prev) => ({
            ...prev,
            applicantName: student.name || '',
            dob: student.dob ? new Date(student.dob).toISOString().split('T')[0] : '',
            gender: student.gender || 'Male',
            tribe: student.tribe || '',
            isPVTG: student.isPVTG || false,
            pvtgCommunity: student.pvtgCommunity || '',
            isDivyang: student.isDivyang || false,
            divyangType: student.divyangType || '',
            divyangPercentage: student.divyangPercentage || 0,
            state: student.state || '',
            district: student.district || '',
            address: student.address || '',
            pincode: student.pincode || '',
            apaarId: student.apaarId || '',
            courseLevel: student.courseLevel || 'Pre-Matric',
            course: student.course || '',
            yearOfStudy: student.yearOfStudy || 1,
            institutionName: student.institutionName || '',
            aisheCode: student.aisheCode || '',
            isHosteller: student.isHosteller || false,
            familyAnnualIncome: student.familyAnnualIncome || 0,
            mastersPercentage: student.mastersPercentage || 0,
            documentsAttached: defaultDocs,
            estimatedMaintenanceAllowance: schemeRes.data.scheme?.allowanceStructure?.description || '',
            estimatedTotalEntitlement: schemeRes.data.scheme?.allowanceStructure?.components?.[0]?.amount || '',
          }));
        }

        // If resuming existing application
        if (applicationId) {
          const appRes = await applicationAPI.getApplicationById(applicationId);
          if (appRes.data.success && appRes.data.application) {
            const app = appRes.data.application;
            setCurrentStep(app.currentStep || 1);
            setFormData((prev) => ({ ...prev, ...app.formData }));
            setLastSaved(new Date(app.lastSavedAt).toLocaleTimeString());
          }
        }
      } catch (err) {
        console.error('Failed to initialize wizard:', err);
      } finally {
        setLoading(false);
      }
    };

    initWizard();
  }, [schemeCode, applicationId, student]);

  // Auto-Save Draft to Backend
  const saveDraft = async (stepToSave) => {
    try {
      setAutoSaving(true);
      const res = await applicationAPI.saveDraft({
        schemeCode: schemeCode.toUpperCase(),
        currentStep: stepToSave || currentStep,
        formData,
        applicationId: appId,
      });

      if (res.data.success) {
        if (!appId && res.data.application?._id) {
          setAppId(res.data.application._id);
        }
        setLastSaved(new Date().toLocaleTimeString());
        if (res.data.conflictWarning) {
          setConflictError(res.data.conflictWarning);
        }
      }
    } catch (err) {
      console.warn('Auto-save error:', err);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleNextStep = async () => {
    await saveDraft(currentStep + 1);
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitApplication = async () => {
    if (!formData.noOtherScholarshipDeclared) {
      alert('Please check the statutory declaration confirming you are not availing any other government scholarship.');
      return;
    }

    try {
      setSubmitting(true);
      setConflictError(null);

      // Ensure application draft ID exists
      let targetId = appId;
      if (!targetId) {
        const draftRes = await applicationAPI.saveDraft({
          schemeCode: schemeCode.toUpperCase(),
          currentStep: 5,
          formData,
        });
        targetId = draftRes.data.application?._id;
        setAppId(targetId);
      }

      const submitRes = await applicationAPI.submit(targetId, { formData });
      if (submitRes.data.success) {
        setSubmissionResult(submitRes.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Submission failed.';
      setConflictError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue"></div>
      </div>
    );
  }

  // Submission Complete View
  if (submissionResult) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 safe-bottom-padding text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-xl font-extrabold text-gov-navy">
          Application Successfully Submitted!
        </h2>

        <p className="text-xs text-slate-600 max-w-md mx-auto">
          {submissionResult.message}
        </p>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-xs text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Application Number:</span>
            <strong className="font-mono text-slate-800 font-bold">
              {submissionResult.application?.applicationNumber}
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Scheme:</span>
            <strong className="text-slate-800">{submissionResult.application?.schemeName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status:</span>
            <span className="chip chip-submitted">Submitted</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Designated Portal:</span>
            <strong className="text-gov-blue">{submissionResult.externalHandoff?.portalName}</strong>
          </div>
        </div>

        {/* External Portal Handoff Link */}
        {submissionResult.externalHandoff?.portalUrl && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl max-w-md mx-auto text-xs text-blue-900 space-y-2">
            <p className="font-bold flex items-center justify-center gap-1.5">
              <ExternalLink className="w-4 h-4 text-gov-blue" />
              <span>External System Synchronization Reference</span>
            </p>
            <p className="text-[11px] text-blue-800">
              Your application has been synchronized with <strong>{submissionResult.externalHandoff.portalName}</strong>. You can track all verification and PFMS DBT updates directly inside this Unified Mobile Application.
            </p>
          </div>
        )}

        <div className="pt-4 flex justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="bg-gov-blue text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow"
          >
            Go to Unified Dashboard
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { num: 1, title: 'Identity & Domicile' },
    { num: 2, title: 'Academic Details' },
    { num: 3, title: 'Fee & Allowances' },
    { num: 4, title: 'Documents' },
    { num: 5, title: 'Review & Submit' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 safe-bottom-padding space-y-6">
      {/* Top Scheme Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/schemes')}
          className="text-xs font-bold text-slate-500 hover:text-gov-navy flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Wizard</span>
        </button>

        <div className="flex items-center gap-2">
          {autoSaving ? (
            <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 animate-pulse">
              <Save className="w-3.5 h-3.5" />
              Auto-saving...
            </span>
          ) : lastSaved ? (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Draft saved at {lastSaved}
            </span>
          ) : null}
        </div>
      </div>

      {/* Scheme Title Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-gov">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-bold text-gov-blue bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
            {scheme?.category}
          </span>
          <span className="text-xs text-slate-500 font-medium">Scheme Code: {scheme?.code}</span>
        </div>
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
          {scheme?.name}
        </h2>
      </div>

      {/* ONE SCHOLARSHIP CONFLICT WARNING BANNER */}
      {conflictError && (
        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-2xl text-xs text-amber-900 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold uppercase tracking-wider text-amber-900">
              One-Scholarship Rule Enforcement
            </h4>
            <p className="mt-1 text-amber-800">{conflictError}</p>
          </div>
        </div>
      )}

      {/* Step Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center flex-1 text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition mb-1 ${
                  currentStep === s.num
                    ? 'bg-gov-blue text-white shadow ring-4 ring-blue-100'
                    : currentStep > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {currentStep > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-600">
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Contents */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-gov">
        {/* Step 1: Identity & Domicile */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Step 1: Domicile & Tribal Community (Verified Profile)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Applicant Name</label>
                <input
                  type="text"
                  value={formData.applicantName}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ST Tribe Community</label>
                <input
                  type="text"
                  value={formData.tribe}
                  onChange={(e) => setFormData({ ...formData, tribe: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">State of Domicile</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">APAAR / Edu-Locker ID</label>
                <input
                  type="text"
                  value={formData.apaarId}
                  onChange={(e) => setFormData({ ...formData, apaarId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-gov-blue font-bold"
                />
              </div>

              <div className="sm:col-span-2 p-3 bg-amber-50/60 rounded-2xl border border-amber-200 flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPVTG}
                    onChange={(e) => setFormData({ ...formData, isPVTG: e.target.checked })}
                    className="w-4 h-4 text-gov-blue rounded focus:ring-gov-blue"
                  />
                  <span className="font-bold text-slate-800">Particularly Vulnerable Tribal Group (PVTG)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isDivyang}
                    onChange={(e) => setFormData({ ...formData, isDivyang: e.target.checked })}
                    className="w-4 h-4 text-gov-blue rounded focus:ring-gov-blue"
                  />
                  <span className="font-bold text-slate-800">Divyang (PwD) Candidate</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic & Institution Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Step 2: Course & Institution Accreditation
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Enrolled Institution Name</label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">AISHE Code</label>
                <input
                  type="text"
                  value={formData.aisheCode}
                  onChange={(e) => setFormData({ ...formData, aisheCode: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Level</label>
                <input
                  type="text"
                  value={formData.courseLevel}
                  onChange={(e) => setFormData({ ...formData, courseLevel: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Course / Degree Program</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Year of Study</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={formData.yearOfStudy}
                  onChange={(e) => setFormData({ ...formData, yearOfStudy: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isHosteller}
                    onChange={(e) => setFormData({ ...formData, isHosteller: e.target.checked })}
                    className="w-4 h-4 text-gov-blue rounded focus:ring-gov-blue"
                  />
                  <span className="font-bold text-slate-800">
                    Hosteller (Residing in School/College Recognized Hostel)
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Fee & Allowance Estimation */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Step 3: Income & Calculated Allowance Preview
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Annual Family Income (Verified by Certificate)
                </label>
                <input
                  type="number"
                  value={formData.familyAnnualIncome}
                  onChange={(e) => setFormData({ ...formData, familyAnnualIncome: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  required
                />
              </div>

              {/* Breakdown Card */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide block">
                  MoTA Financial Assistance Estimate (Direct Benefit Transfer via PFMS)
                </span>

                <div className="space-y-2">
                  {scheme?.allowanceStructure?.components?.map((c, idx) => (
                    <div key={idx} className="p-2.5 bg-white rounded-xl border border-amber-200 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{c.title}</p>
                        <p className="text-[10px] text-slate-500">{c.frequency} • {c.notes}</p>
                      </div>
                      <span className="text-xs font-extrabold text-amber-800">
                        {c.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Digital Document Slots */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Step 4: Attached Digital Documents
            </h3>

            <p className="text-xs text-slate-500">
              Verified documents linked from your DigiLocker and Digital Document Wallet:
            </p>

            <div className="space-y-2.5 text-xs">
              {formData.documentsAttached?.map((doc, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-gov-blue flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-800">{doc.docName}</h4>
                      <p className="text-[10px] text-slate-500">{doc.verificationSource}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Attached
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Step 5: Review Summary & Statutory Undertaking
            </h3>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <strong className="text-slate-900">{formData.applicantName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tribe / Domicile:</span>
                <strong className="text-slate-900">{formData.tribe} ({formData.state})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Institution:</span>
                <strong className="text-slate-900">{formData.institutionName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Course / Year:</span>
                <strong className="text-slate-900">{formData.course} (Year {formData.yearOfStudy})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Parental Annual Income:</span>
                <strong className="text-slate-900">₹{formData.familyAnnualIncome.toLocaleString()}</strong>
              </div>
            </div>

            {/* Statutory Undertaking */}
            <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl space-y-3 text-xs text-amber-900">
              <h4 className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Statutory Declarations (Ministry of Tribal Affairs)</span>
              </h4>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.noOtherScholarshipDeclared}
                  onChange={(e) => setFormData({ ...formData, noOtherScholarshipDeclared: e.target.checked })}
                  className="w-4 h-4 text-gov-blue rounded focus:ring-gov-blue mt-0.5"
                  required
                />
                <span className="leading-snug">
                  <strong>One-Scholarship Declaration:</strong> I hereby declare that I am not currently receiving or availing any other government scholarship, fellowship, or stipend for the academic session 2026-27. I acknowledge that availing duplicate benefits is punishable under government rules.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dpdpConsentGiven}
                  onChange={(e) => setFormData({ ...formData, dpdpConsentGiven: e.target.checked })}
                  className="w-4 h-4 text-gov-blue rounded focus:ring-gov-blue mt-0.5"
                />
                <span className="leading-snug text-slate-700">
                  <strong>DPDP Act 2023 Consent:</strong> I authorize the Ministry of Tribal Affairs to verify my Aadhaar token, tribal caste certificate, academic records, and bank account for DBT disbursement through PFMS.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1 disabled:opacity-30"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
            >
              <span>Save & Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitApplication}
              disabled={submitting || !formData.noOtherScholarshipDeclared}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Submitting Application...' : 'Submit Application'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
