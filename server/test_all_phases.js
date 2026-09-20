const BASE_URL = 'http://localhost:5000/api/v1';

async function runMasterTestSuite() {
  console.log('======================================================================');
  console.log('🏛️  MoTA UNIFIED SCHOLARSHIP PORTAL - COMPLETE MASTER SUITE (PHASES 1-6)');
  console.log('======================================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, msg) => {
    if (condition) {
      console.log(`  ✅ [PASS] ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${msg}`);
      failed++;
    }
  };

  const parseCookie = (res) => {
    const raw = res.headers.get('set-cookie');
    if (!raw) return '';
    return raw.split(';')[0];
  };

  try {
    // -------------------------------------------------------------
    // PHASE 1: Health, Config, Institutions & 9-Persona Auth
    // -------------------------------------------------------------
    console.log('📌 PHASE 1: Infrastructure, Schemes Config & 9-Persona RBAC');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    assert(healthData.status === 'UP', 'Health check passed: MoTA Unified API is UP');

    const schemesRes = await fetch(`${BASE_URL}/schemes`);
    const schemesData = await schemesRes.json();
    assert(schemesData.schemes?.length === 5, `All 5 official MoTA schemes loaded (Count: ${schemesData.schemes?.length})`);

    const institutesRes = await fetch(`${BASE_URL}/institutions`);
    const institutesData = await institutesRes.json();
    assert(institutesData.institutions?.length >= 7, `AISHE institutions directory loaded (${institutesData.institutions?.length} premier institutes)`);

    // -------------------------------------------------------------
    // PHASE 2: Eligibility Engine, One-Scheme Rule & Wizard
    // -------------------------------------------------------------
    console.log('\n📌 PHASE 2: Eligibility Engine, One-Scheme Rule & Application Wizard');
    const birsaLoginRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demoRole: 'student_prematric' }),
    });
    const birsaData = await birsaLoginRes.json();
    const birsaCookie = parseCookie(birsaLoginRes);
    const birsaHeaders = { 'Content-Type': 'application/json', Cookie: birsaCookie };
    assert(birsaData.user?.role === 'student', 'Student Birsa Munda Jr. authenticated');

    const eligRes = await fetch(`${BASE_URL}/applications/eligibility/check?schemeCode=PRE_MATRIC`, {
      headers: birsaHeaders,
    });
    const eligData = await eligRes.json();
    assert(eligData.success && (eligData.evaluation || eligData.evaluations), 'Eligibility engine evaluated Pre-Matric criteria');

    const draftRes = await fetch(`${BASE_URL}/applications/draft`, {
      method: 'POST',
      headers: birsaHeaders,
      body: JSON.stringify({
        schemeCode: 'PRE_MATRIC',
        academicYear: '2026-2027',
        formData: {
          schemeCode: 'PRE_MATRIC',
          personalDetails: { applicantName: 'Birsa Munda Jr.' },
          academicDetails: { currentClass: 'Class IX' },
        },
      }),
    });
    const draftData = await draftRes.json();
    assert(draftData.success && draftData.application?.applicationNumber, `Application draft saved with ID ${draftData.application?.applicationNumber}`);

    // -------------------------------------------------------------
    // PHASE 3: Digital Wallet, 11 Adapters & Review Queue
    // -------------------------------------------------------------
    console.log('\n📌 PHASE 3: Digital Document Wallet & 11-Adapter Verification Layer');
    const digiRes = await fetch(`${BASE_URL}/wallet/digilocker-fetch`, {
      method: 'POST',
      headers: birsaHeaders,
    });
    const digiData = await digiRes.json();
    assert(digiData.success && digiData.documents?.length > 0, `DigiLocker adapter pulled ${digiData.documents?.length} documents`);

    const uploadRes = await fetch(`${BASE_URL}/wallet/upload`, {
      method: 'POST',
      headers: birsaHeaders,
      body: JSON.stringify({
        docType: 'BONAFIDE_STUDENT',
        title: 'Bonafide Certificate Class IX',
        documentNumber: 'BON/2026/001',
        issuingAuthority: 'EMRS Sundargarh',
      }),
    });
    const uploadData = await uploadRes.json();
    assert(uploadData.success && uploadData.document?.verificationStatus, `Automated adapter verified document (Status: ${uploadData.document?.verificationStatus})`);

    // -------------------------------------------------------------
    // PHASE 4: DBT Tracker, Notifications & Grievances
    // -------------------------------------------------------------
    console.log('\n📌 PHASE 4: PFMS DBT Payments, Notifications & Grievance Redressal');
    const jaipalLoginRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demoRole: 'student_topclass' }),
    });
    const jaipalCookie = parseCookie(jaipalLoginRes);
    const jaipalHeaders = { 'Content-Type': 'application/json', Cookie: jaipalCookie };

    const payRes = await fetch(`${BASE_URL}/payments`, { headers: jaipalHeaders });
    const payData = await payRes.json();
    assert(payData.success && payData.payments?.length > 0, `DBT Payments tracker fetched ${payData.payments?.length} PFMS disbursement entries`);

    const grvRes = await fetch(`${BASE_URL}/grievances`, {
      method: 'POST',
      headers: jaipalHeaders,
      body: JSON.stringify({
        schemeCode: 'TOP_CLASS',
        category: 'DBT_DISBURSEMENT_DELAY',
        subject: 'Quarterly laptop allowance verification inquiry',
        description: 'Testing grievance redressal pipeline.',
        priority: 'NORMAL',
      }),
    });
    const grvData = await grvRes.json();
    assert(grvData.success && grvData.grievance?.ticketNumber, `Grievance ticket created: ${grvData.grievance?.ticketNumber}`);

    // -------------------------------------------------------------
    // PHASE 5: JAGO AI Multilingual Chatbot
    // -------------------------------------------------------------
    console.log('\n📌 PHASE 5: JAGO AI Tribal Assistant & Multilingual Engine');
    const chatEnRes = await fetch(`${BASE_URL}/jago/query`, {
      method: 'POST',
      headers: jaipalHeaders,
      body: JSON.stringify({
        message: 'How does the one scholarship rule apply to me?',
        language: 'en',
      }),
    });
    const chatEnData = await chatEnRes.json();
    assert(
      chatEnData.success && chatEnData.intent === 'ONE_SCHOLARSHIP_RULE' && chatEnData.response.includes('TOP_CLASS'),
      'JAGO recognized Jaipal Singh Munda context & applied One-Scholarship rule'
    );

    const chatHiRes = await fetch(`${BASE_URL}/jago/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'नमस्ते जोहार',
        language: 'hi',
      }),
    });
    const chatHiData = await chatHiRes.json();
    assert(chatHiData.success && chatHiData.response.includes('जोहार'), 'JAGO answered Hindi greeting with native "जोहार"');

    // -------------------------------------------------------------
    // PHASE 6: Officer Console & Coverage Gap Engine
    // -------------------------------------------------------------
    console.log('\n📌 PHASE 6: Officer Console, Central Sanctions & Coverage Gap Explorer');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demoRole: 'mota_admin' }),
    });
    const adminCookie = parseCookie(adminLoginRes);
    const adminHeaders = { 'Content-Type': 'application/json', Cookie: adminCookie };

    const sanctionRes = await fetch(`${BASE_URL}/officer/sanction-order`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ schemeCode: 'ALL', academicYear: '2026-2027' }),
    });
    const sanctionData = await sanctionRes.json();
    assert(sanctionData.success && sanctionData.sanctionOrder?.sanctionOrderNo, `MoTA Admin issued Sanction Order #${sanctionData.sanctionOrder?.sanctionOrderNo}`);

    const dbtBatchRes = await fetch(`${BASE_URL}/officer/pfms-dbt-batch`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ schemeCode: 'ALL' }),
    });
    const dbtBatchData = await dbtBatchRes.json();
    assert(dbtBatchData.success && dbtBatchData.batch?.batchId, `PFMS APBS Batch #${dbtBatchData.batch?.batchId} executed successfully`);

    const coverageRes = await fetch(`${BASE_URL}/officer/coverage-gap?state=Odisha`, { headers: adminHeaders });
    const coverageData = await coverageRes.json();
    assert(
      coverageData.success && coverageData.analytics?.districts?.length > 0 && coverageData.analytics?.summary?.overallPvtgSaturationRate > 0,
      `Coverage Gap Engine evaluated tribal districts (PVTG Saturation: ${coverageData.analytics?.summary?.overallPvtgSaturationRate}%)`
    );

    console.log('\n======================================================================');
    console.log(`🎉 COMPLETE MASTER SUITE PASSED: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================================\n');

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Fatal master test error:', err);
    process.exit(1);
  }
}

runMasterTestSuite();
