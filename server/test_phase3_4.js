const BASE_URL = 'http://localhost:5000/api/v1';

async function runPhase34Tests() {
  console.log('=== STARTING PHASE 3 & 4 E2E INTEGRATION SUITE ===\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, msg) => {
    if (condition) {
      console.log(`[PASS] ${msg}`);
      passed++;
    } else {
      console.error(`[FAIL] ${msg}`);
      failed++;
    }
  };

  const parseCookie = (res) => {
    const raw = res.headers.get('set-cookie');
    if (!raw) return '';
    return raw.split(';')[0];
  };

  try {
    // 1. Student Login (Jaipal Singh Munda - Top Class)
    console.log('--- Step 1: Student Login (Jaipal Singh Munda) ---');
    const loginRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demoRole: 'student_topclass' }),
    });
    const loginData = await loginRes.json();
    const studentCookie = parseCookie(loginRes);
    assert(loginData.success, 'Student logged in successfully');
    const studentHeaders = {
      'Content-Type': 'application/json',
      Cookie: studentCookie,
    };

    // 2. DigiLocker Document Fetch
    console.log('\n--- Step 2: Digital Document Wallet & DigiLocker Sync ---');
    const digiRes = await fetch(`${BASE_URL}/wallet/digilocker-fetch`, {
      method: 'POST',
      headers: studentHeaders,
    });
    const digiData = await digiRes.json();
    assert(digiData.success && digiData.documents?.length >= 2, `DigiLocker pulled ${digiData.documents?.length} documents`);

    // 3. Wallet Document Listing
    const walletRes = await fetch(`${BASE_URL}/wallet`, {
      headers: studentHeaders,
    });
    const walletData = await walletRes.json();
    assert(walletData.success && walletData.documents?.length >= 2, `Wallet contains ${walletData.documents?.length} verified/queued documents`);
    const testDoc = walletData.documents[0];

    // 4. Document Upload with Automated Adapter Pipeline
    console.log('\n--- Step 3: Document Upload & Automated Adapter Pipeline ---');
    const uploadRes = await fetch(`${BASE_URL}/wallet/upload`, {
      method: 'POST',
      headers: studentHeaders,
      body: JSON.stringify({
        docType: 'INCOME_CERTIFICATE',
        title: 'Tahsil Income Certificate 2026',
        documentNumber: 'INC/OD/2026/9941',
        issuingAuthority: 'Revenue Officer Sambalpur',
      }),
    });
    const uploadData = await uploadRes.json();
    assert(uploadData.success && uploadData.document, `Document uploaded & auto-verified (Status: ${uploadData.document?.verificationStatus})`);

    // 5. Document Re-verification
    console.log('\n--- Step 4: Adapter Re-verification Trigger ---');
    const reverifyRes = await fetch(`${BASE_URL}/wallet/${testDoc._id}/verify`, {
      method: 'POST',
      headers: studentHeaders,
    });
    const reverifyData = await reverifyRes.json();
    assert(reverifyData.success && reverifyData.result, `Adapter executed re-verification (Status: ${reverifyData.result?.verificationStatus})`);

    // 6. Officer Login & Review Queue (State Nodal Officer)
    console.log('\n--- Step 5: Officer Manual Review Queue ---');
    const officerLoginRes = await fetch(`${BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ demoRole: 'state_nodal' }),
    });
    const officerData = await officerLoginRes.json();
    const officerCookie = parseCookie(officerLoginRes);
    const officerHeaders = {
      'Content-Type': 'application/json',
      Cookie: officerCookie,
    };

    const queueRes = await fetch(`${BASE_URL}/wallet/review-queue`, {
      headers: officerHeaders,
    });
    const queueData = await queueRes.json();
    const queueList = queueData.reviewQueue || [];
    assert(queueData.success, `Officer fetched manual review queue (${queueList.length} items)`);

    if (queueList.length > 0) {
      const queueItem = queueList[0];
      const resolveRes = await fetch(`${BASE_URL}/wallet/review-queue/${queueItem._id}/resolve`, {
        method: 'POST',
        headers: officerHeaders,
        body: JSON.stringify({
          decision: 'APPROVED',
          remarks: 'Verified via state revenue seal ledger',
        }),
      });
      const resolveData = await resolveRes.json();
      assert(resolveData.success, `Officer approved review queue item #${queueItem._id}`);
    }

    // 7. PFMS DBT Payments Tracker
    console.log('\n--- Step 6: PFMS Direct Benefit Transfer (DBT) Payments ---');
    const paymentsRes = await fetch(`${BASE_URL}/payments`, {
      headers: studentHeaders,
    });
    const paymentsData = await paymentsRes.json();
    assert(paymentsData.success && paymentsData.payments?.length > 0, `Retrieved ${paymentsData.payments?.length} PFMS DBT payment records`);
    const samplePayment = paymentsData.payments[0];
    assert(samplePayment.amount > 0 && samplePayment.status, `Payment amount: ₹${samplePayment.amount}, Status: ${samplePayment.status}`);

    // 8. Multi-Channel Notifications Engine
    console.log('\n--- Step 7: Notifications Engine ---');
    const notifRes = await fetch(`${BASE_URL}/notifications`, {
      headers: studentHeaders,
    });
    const notifData = await notifRes.json();
    assert(notifData.success, `Retrieved ${notifData.notifications?.length} notifications (Unread: ${notifData.unreadCount})`);

    if (notifData.notifications?.length > 0) {
      const firstNotif = notifData.notifications[0];
      const readRes = await fetch(`${BASE_URL}/notifications/${firstNotif._id}/read`, {
        method: 'PATCH',
        headers: studentHeaders,
      });
      const readData = await readRes.json();
      assert(readData.success, `Marked notification #${firstNotif._id} as read`);

      const markAllRes = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: studentHeaders,
      });
      const markAllData = await markAllRes.json();
      assert(markAllData.success, 'Marked all notifications as read');
    }

    // 9. Grievance Redressal System
    console.log('\n--- Step 8: Grievance Redressal System ---');
    const grvRes = await fetch(`${BASE_URL}/grievances`, {
      method: 'POST',
      headers: studentHeaders,
      body: JSON.stringify({
        schemeCode: 'TOP_CLASS',
        category: 'DBT_DISBURSEMENT_DELAY',
        subject: 'Inquiry regarding Q2 laptop allowance disbursal date',
        description: 'The Q1 tuition fee has been credited. Requesting update on laptop grant credit timeline.',
        priority: 'NORMAL',
      }),
    });
    const grvData = await grvRes.json();
    assert(grvData.success && grvData.grievance?.ticketNumber, `Grievance registered with Ticket #${grvData.grievance?.ticketNumber}`);
    const newGrievanceId = grvData.grievance._id;

    // 10. Grievance List & Escalation
    const grvListRes = await fetch(`${BASE_URL}/grievances`, {
      headers: studentHeaders,
    });
    const grvListData = await grvListRes.json();
    assert(grvListData.success && grvListData.grievances?.length > 0, `Fetched ${grvListData.grievances?.length} grievance tickets`);

    const escalateRes = await fetch(`${BASE_URL}/grievances/${newGrievanceId}/escalate`, {
      method: 'POST',
      headers: studentHeaders,
    });
    const escalateData = await escalateRes.json();
    assert(escalateData.success && escalateData.grievance?.status === 'ESCALATED', `Ticket #${grvData.grievance?.ticketNumber} escalated to MoTA Central Cell`);

    console.log(`\n==================================================`);
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`==================================================\n`);

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runPhase34Tests();
