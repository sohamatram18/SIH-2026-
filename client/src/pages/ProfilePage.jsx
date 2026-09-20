import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { profileAPI } from '../services/api.js';
import { 
  User, 
  ShieldCheck, 
  Building, 
  GraduationCap, 
  CreditCard, 
  MapPin, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Lock
} from 'lucide-react';

export const ProfilePage = () => {
  const { student, updateStudentProfileState } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
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
    familyAnnualIncome: 0,
    apaarId: '',
    currentClass: 9,
    courseLevel: 'Pre-Matric',
    course: '',
    yearOfStudy: 1,
    institutionName: '',
    aisheCode: '',
    isHosteller: false,
    // Bank & Aadhaar
    accountHolderName: '',
    bankName: '',
    ifscCode: '',
    accountNumber: '',
    rawAadhaar: '',
    aadhaarLast4: '',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
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
        familyAnnualIncome: student.familyAnnualIncome || 0,
        apaarId: student.apaarId || '',
        currentClass: student.currentClass || 9,
        courseLevel: student.courseLevel || 'Pre-Matric',
        course: student.course || '',
        yearOfStudy: student.yearOfStudy || 1,
        institutionName: student.institutionName || '',
        aisheCode: student.aisheCode || '',
        isHosteller: student.isHosteller || false,
        accountHolderName: student.bankDetails?.accountHolderName || '',
        bankName: student.bankDetails?.bankName || '',
        ifscCode: student.bankDetails?.ifscCode || '',
        accountNumber: '', // Never display raw bank account; only masked representation
        rawAadhaar: '', // Never display raw Aadhaar
        aadhaarLast4: student.aadhaarDetails?.aadhaarLast4 || '',
      });
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const payload = {
        ...formData,
        familyAnnualIncome: parseFloat(formData.familyAnnualIncome),
        yearOfStudy: parseInt(formData.yearOfStudy, 10),
        divyangPercentage: formData.isDivyang ? parseFloat(formData.divyangPercentage) : undefined,
      };

      // Only send accountNumber if entered
      if (!formData.accountNumber) delete payload.accountNumber;
      if (!formData.rawAadhaar) delete payload.rawAadhaar;

      const res = await profileAPI.updateProfile(payload);
      if (res.data.success) {
        updateStudentProfileState(res.data.student);
        setSuccessMsg('Profile updated successfully with DPDP Act 2023 compliance.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 safe-bottom-padding space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gov-navy">
            Student Unified Profile
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Single master profile reused across all 5 MoTA scholarship applications
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>DPDP Act Compliant</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-900 font-semibold shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-900 font-semibold shadow-sm">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Personal & Tribal Community */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-gov space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="w-4 h-4 text-gov-blue" />
            <span>1. Personal & Tribal Identity</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <label className="block font-bold text-slate-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Scheduled Tribe (ST) Community</label>
              <input
                type="text"
                placeholder="e.g. Santhal, Gond, Bhil, Munda, Khasi"
                value={formData.tribe}
                onChange={(e) => setFormData({ ...formData, tribe: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                required
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-6 pt-2">
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
                <span className="font-bold text-slate-800">Divyang (Persons with Disabilities)</span>
              </label>
            </div>

            {formData.isPVTG && (
              <div className="sm:col-span-2">
                <label className="block font-bold text-amber-800 mb-1">PVTG Community Name</label>
                <input
                  type="text"
                  placeholder="e.g. Birhor, Chenchu, Baiga, Dongria Kondh"
                  value={formData.pvtgCommunity}
                  onChange={(e) => setFormData({ ...formData, pvtgCommunity: e.target.value })}
                  className="w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-xl"
                />
              </div>
            )}

            {formData.isDivyang && (
              <>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Disability Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Locomotor, Visual, Hearing"
                    value={formData.divyangType}
                    onChange={(e) => setFormData({ ...formData, divyangType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Disability Percentage (%)</label>
                  <input
                    type="number"
                    min="40"
                    max="100"
                    value={formData.divyangPercentage}
                    onChange={(e) => setFormData({ ...formData, divyangPercentage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 2: Domicile & Location */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-gov space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-gov-blue" />
            <span>2. Domicile & Residential Address</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">State of Domicile</label>
              <input
                type="text"
                placeholder="e.g. Odisha, Jharkhand, Madhya Pradesh"
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
                placeholder="e.g. Mayurbhanj, Ranchi, Mandla"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">PIN Code</label>
              <input
                type="text"
                maxLength="6"
                placeholder="e.g. 757001"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-700 mb-1">Village / Town / Full Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Academic Details & APAAR */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-gov space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <GraduationCap className="w-4 h-4 text-gov-blue" />
            <span>3. Academic Enrollment & APAAR ID</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">APAAR / Edu-Locker ID</label>
              <input
                type="text"
                placeholder="e.g. APAAR-2026-9901-4411"
                value={formData.apaarId}
                onChange={(e) => setFormData({ ...formData, apaarId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-gov-blue font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Course Level</label>
              <select
                value={formData.courseLevel}
                onChange={(e) => setFormData({ ...formData, courseLevel: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="Pre-Matric">Pre-Matric (Classes IX-X)</option>
                <option value="Post-Matric">Post-Matric (Class XI-XII / Diploma)</option>
                <option value="Graduation">Graduation (B.Tech, B.Sc, MBBS, etc.)</option>
                <option value="Post-Graduation">Post-Graduation (M.Tech, M.Sc, etc.)</option>
                <option value="MPhil">MPhil</option>
                <option value="PhD">Ph.D.</option>
                <option value="Post-Doc">Post-Doctoral</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Course / Degree Name</label>
              <input
                type="text"
                placeholder="e.g. B.Tech Computer Science"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Institution Name</label>
              <input
                type="text"
                placeholder="e.g. Indian Institute of Technology Bombay"
                value={formData.institutionName}
                onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">AISHE Code</label>
              <input
                type="text"
                placeholder="e.g. U-0306"
                value={formData.aisheCode}
                onChange={(e) => setFormData({ ...formData, aisheCode: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Annual Family Income (₹)</label>
              <input
                type="number"
                value={formData.familyAnnualIncome}
                onChange={(e) => setFormData({ ...formData, familyAnnualIncome: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                required
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                Eligible schemes: {formData.familyAnnualIncome <= 250000 ? 'Pre/Post-Matric, Top Class, NFST, NOS' : formData.familyAnnualIncome <= 600000 ? 'Top Class, NFST, NOS' : 'NFST (Merit-based)'}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isHosteller}
                  onChange={(e) => setFormData({ ...formData, isHosteller: e.target.checked })}
                  className="w-4 h-4 text-gov-blue rounded focus:ring-gov-blue"
                />
                <span className="font-bold text-slate-800">Residing in Recognized Hostel</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Aadhaar & DBT Bank Details (DPDP Act Compliance) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-gov space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gov-blue" />
              <span>4. Bank Account & Aadhaar (DPDP Act 2023 Compliant)</span>
            </h3>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Field-Level AES-256 Encryption
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Aadhaar Number (Last 4 Digits Stored)
              </label>
              <div className="p-2.5 bg-slate-100 rounded-xl font-mono text-slate-800 font-bold flex items-center justify-between">
                <span>XXXX-XXXX-{formData.aadhaarLast4 || '----'}</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                  Tokenized
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Full Aadhaar is never saved in the database.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Account Holder Name</label>
              <input
                type="text"
                value={formData.accountHolderName}
                onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">IFSC Code</label>
              <input
                type="text"
                placeholder="e.g. SBIN0001234"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Masked Account Number (DBT)
              </label>
              <div className="p-2.5 bg-slate-100 rounded-xl font-mono text-slate-800 font-bold">
                {student?.bankDetails?.maskedAccountNumber || '••••••••----'}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Update Bank Account Number
              </label>
              <input
                type="password"
                placeholder="Enter new account no."
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Will be encrypted with AES-256 before saving.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-gov-blue hover:bg-gov-navy text-white text-sm font-bold px-6 py-3 rounded-2xl shadow transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
