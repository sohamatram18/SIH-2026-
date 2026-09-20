const BASE_URL = 'http://localhost:5000/api/v1';

async function runPhase56Tests() {
  console.log('================================================================');
  console.log('🤖 PHASE 5 (JAGO AI) & PHASE 6 (OFFICER CONSOLE / COVERAGE GAP)');
  console.log('================================================================\n');

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
    // PHASE 5: JAGO AI CHATBOT & MULTILINGUAL ENGINE
    // -------------------------------------------------------------
    console.log('📌 Testing Phase 5: JAGO AI Assistant & Multilingual Reasoning');

    // 1. JAGO Knowledge Base Overview
    const kbRes = await fetch(`${BASE_URL}/jago/knowledge`);
    const kbData = await kbRes.json();
    assert(kbData.success && kbData.knowledgeBase?.schemes?.length === 5, 'JAGO loaded full knowledge base for all 5 MoTA schemes');

    // 2. Unauthenticated Chat Query (English)
    const chatEnRes = await fetch(`${BASE_URL}/jago/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'What is the laptop allowance in Top Class scholarship?',
        language: 'en',
      }),
    });
    const chatEnData = await chatEnRes.json();
    assert(
      chatEnData.success &&
      chatEnData.intent === 'SCHEME_TOP_CLASS' &&
      chatEnData.response.includes('₹45,000'),
      'JAGO correctly identified Top Class intent and returned ₹45,000 laptop grant'
    );

    // 3. Multilingual Query (Hindi)
    const chatHiRes = await fetch(`${BASE_URL}/jago/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'नमस्ते, मुझे छात्रवृत्ति के बारे में जानकारी चाहिए',
        language: 'hi',
      }),
    });
    const chatHiData = await chatHiRes.json();
    assert(
      chatHiData.success &&
      chatHiData.intent === 'GREETING' &&
      chatHiData.response.includes('जोहार'),
      'JAGO answered Hindi greeting with native "जोहार" and tribal assistance guidance'
    );

    // 4. Authenticated Student Context Query (Jaipal Singh Munda)
    const studentLoginRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demoRole: 'student_topclass' }),
    });
    const studentCookie = parseCookie(studentLoginRes);
    const studentHeaders = { 'Content-Type': 'application/json', Cookie: studentCookie };

    const contextChatRes = await fetch(`${BASE_URL}/jago/query`, {
      method: 'POST',
      headers: studentHeaders,
      body: JSON.stringify({
        message: 'Can I apply for another scholarship while receiving Top Class?',
        language: 'en',
      }),
    });
    const contextChatData = await contextChatRes.json();
    assert(
      contextChatData.success &&
      contextChatData.intent === 'ONE_SCHOLARSHIP_RULE' &&
      contextChatData.response.includes('TOP_CLASS'),
      'JAGO personalized response recognizing Jaipal Singh active enrollment in TOP_CLASS'
    );

    // 5. JAGO Starter Suggestions API
    const suggRes = await fetch(`${BASE_URL}/jago/suggestions`, { headers: studentHeaders });
    const suggData = await suggRes.json();
    assert(suggData.success && suggData.suggestions?.length > 0, `JAGO generated ${suggData.suggestions.length} tailored suggestion prompts`);

    // -------------------------------------------------------------
    // PHASE 6: OFFICER CONSOLE & COVERAGE GAP ENGINE
    // -------------------------------------------------------------
    console.log('\n📌 Testing Phase 6: Officer Console, Scrutiny, Sanction Orders & Coverage Gap');

    // 6. Security Check: Student blocked from Officer Console
    const forbiddenRes = await fetch(`${BASE_URL}/officer/dashboard`, { headers: studentHeaders });
    assert(forbiddenRes.status === 403, 'RBAC Security: Student correctly blocked from accessing officer console (HTTP 403)');

    // 7. Institute Nodal Officer Login (Prof. Meena, IIT Bombay)
    const instituteLoginRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demoRole: 'institute_nodal' }),
    });
    const instituteCookie = parseCookie(instituteLoginRes);
    const instituteHeaders = { 'Content-Type': 'application/json', Cookie: instituteCookie };

    const instDashRes = await fetch(`${BASE_URL}/officer/dashboard`, { headers: instituteHeaders });
    const instDashData = await instDashRes.json();
    assert(
      instDashData.success &&
      instDashData.stats?.roleSpecificData?.aisheCode === 'U-0306',
      'Institute Nodal Officer console loaded with IIT Bombay AISHE code U-0306'
    );

    // 8. State Nodal Officer Scrutiny Queue (Rajeshwar Hembram, Odisha)
    const stateLoginRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demoRole: 'state_nodal' }),
    });
    const stateCookie = parseCookie(stateLoginRes);
    const stateHeaders = { 'Content-Type': 'application/json', Cookie: stateCookie };

    const appsRes = await fetch(`${BASE_URL}/officer/applications`, { headers: stateHeaders });
    const appsData = await appsRes.json();
    assert(appsData.success && appsData.applications?.length > 0, `State Nodal Officer fetched ${appsData.applications.length} applications for scrutiny`);

    // 9. Batch Scrutiny Action (State Officer approves an application)
    const targetApp = appsData.applications[0];
    const batchRes = await fetch(`${BASE_URL}/officer/batch-action`, {
      method: 'POST',
      headers: stateHeaders,
      body: JSON.stringify({
        applicationIds: [targetApp._id],
        action: 'APPROVE',
        remarks: 'State tribal revenue check completed. Domicile and ST caste verified.',
      }),
    });
    const batchData = await batchRes.json();
    assert(batchData.success && batchData.updatedCount === 1, `Batch approval executed successfully on application ${targetApp.applicationNumber}`);

    // 10. MoTA Central Admin Login (Dr. Rameshwar Oraon, New Delhi)
    const adminLoginRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demoRole: 'mota_admin' }),
    });
    const adminCookie = parseCookie(adminLoginRes);
    const adminHeaders = { 'Content-Type': 'application/json', Cookie: adminCookie };

    // 11. Central Sanction Order Generator
    const sanctionRes = await fetch(`${BASE_URL}/officer/sanction-order`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        schemeCode: 'ALL',
        academicYear: '2026-2027',
      }),
    });
    const sanctionData = await sanctionRes.json();
    assert(
      sanctionData.success &&
      sanctionData.sanctionOrder?.sanctionOrderNo?.startsWith('MOTA/SANCTION'),
      `MoTA Central Admin issued Sanction Order #${sanctionData.sanctionOrder?.sanctionOrderNo} for ₹${sanctionData.sanctionOrder?.totalSanctionAmount?.toLocaleString()}`
    );

    // 12. PFMS APBS Direct Benefit Transfer Batch Execution
    const dbtBatchRes = await fetch(`${BASE_URL}/officer/pfms-dbt-batch`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({ schemeCode: 'ALL' }),
    });
    const dbtBatchData = await dbtBatchRes.json();
    assert(
      dbtBatchData.success &&
      dbtBatchData.batch?.batchId?.startsWith('PFMS-APBS'),
      `PFMS APBS Batch #${dbtBatchData.batch?.batchId} executed for ${dbtBatchData.batch?.totalBeneficiaries} beneficiaries (₹${dbtBatchData.batch?.totalBatchAmount?.toLocaleString()})`
    );

    // 13. Tribal Coverage Gap & PVTG Saturation Analytics Engine
    const coverageRes = await fetch(`${BASE_URL}/officer/coverage-gap?state=Odisha`, { headers: adminHeaders });
    const coverageData = await coverageRes.json();
    assert(
      coverageData.success &&
      coverageData.analytics?.districts?.length > 0 &&
      coverageData.analytics?.summary?.overallPvtgSaturationRate > 0,
      `Coverage Gap Engine evaluated Odisha tribal districts (PVTG Saturation: ${coverageData.analytics?.summary?.overallPvtgSaturationRate}%, Critical Gap Districts: ${coverageData.analytics?.summary?.criticalGapDistrictsCount})`
    );

    console.log('\n================================================================');
    console.log(`🎉 PHASE 5 & 6 TEST SUITE COMPLETED: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Fatal error during test execution:', err);
    process.exit(1);
  }
}

runPhase56Tests();
