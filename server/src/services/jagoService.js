/**
 * JAGO AI Tribal Scholarship Assistant - Domain Knowledge & Reasoning Engine
 * Context-aware, multilingual, multimodal assistant for Scheduled Tribe students & families.
 */

export const JAGO_KNOWLEDGE_BASE = {
  schemes: [
    {
      code: 'PRE_MATRIC',
      name: 'Pre-Matric Scholarship for ST Students (Class IX & X)',
      incomeLimit: '₹2,50,000 per annum',
      rates: 'Day Scholar: ₹3,500/yr (₹350/mo for 10 months). Hosteller: ₹7,000/yr (₹700/mo for 10 months).',
      disabilityGrant: 'Additional 10% disability allowance + ₹1,000/yr book grant for Divyang students.',
      eligibility: 'ST student studying in Class IX or X in a Government or recognized school / Eklavya Model Residential School (EMRS). Family income <= ₹2.5 Lakh.',
      documents: 'ST Caste Certificate, Family Income Certificate, School Bonafide Certificate, Aadhaar details, Bank Account details.',
    },
    {
      code: 'POST_MATRIC',
      name: 'Post-Matric Scholarship for ST Students (Class XI to PhD)',
      incomeLimit: '₹2,50,000 per annum',
      rates: 'Group 1 (Medical/Engineering): ₹13,500/yr (Hosteller) / ₹7,000/yr (Day Scholar). Group 2 (Professional PG/UG): ₹9,500/yr (Hosteller) / ₹6,500/yr. Plus full compulsory non-refundable course fees reimbursed.',
      disabilityGrant: 'Special allowance ranging from ₹240 to ₹750/mo depending on disability type & helper requirements.',
      eligibility: 'ST student pursuing post-matriculation or post-secondary courses in recognized institutions. Family income <= ₹2.5 Lakh.',
      documents: 'ST Caste Certificate, Income Certificate, Previous Pass Marksheet, Fee Receipt, Bonafide Certificate, Bank Passbook, Domicile Certificate.',
    },
    {
      code: 'TOP_CLASS',
      name: 'National Scholarship for Higher Education / Top Class Education for ST Students',
      incomeLimit: '₹6,00,000 per annum',
      rates: 'Full tuition fee & non-refundable charges (up to ₹2.0 Lakh for private institutes, full for govt institutes), ₹3,000/mo living expenses (₹36,000/yr), ₹5,000/yr books/stationery, and one-time ₹45,000 computer/laptop grant.',
      slots: 'Total 1,000 fresh scholarship slots per year across 246 notified Premier Higher Education Institutes (IITs, IIMs, AIIMS, NITs, NLUs, etc.).',
      eligibility: 'ST student secured admission in notified premier higher education institute. Family income <= ₹6.0 Lakh.',
      documents: 'ST Certificate, Income Certificate, Institute Admission Letter / Bonafide, Fee Structure, Laptop purchase quotation / receipt.',
    },
    {
      code: 'NFST',
      name: 'National Fellowship for ST Students (M.Phil / Ph.D)',
      incomeLimit: 'No income ceiling (Purely merit & research admission based)',
      rates: 'JRF (Junior Research Fellowship): ₹31,000/mo for first 2 years. SRF (Senior Research Fellowship): ₹35,000/mo for remaining 3 years. Plus HRA as per govt rules and Contingency: ₹10,000/yr for Humanities/Social Sciences, ₹12,000/yr for Science/Engineering.',
      slots: 'Total 750 fresh fellowships awarded every year.',
      eligibility: 'ST student admitted to full-time regular M.Phil / Ph.D program in UGC-recognized universities or national institutes. Must have cleared UGC-NET / CSIR-NET / GATE.',
      documents: 'ST Certificate, NET/JRF Scorecard, University PhD Registration Letter, Research Supervisor Bonafide, Bank Account details.',
    },
    {
      code: 'NOS',
      name: 'National Overseas Scholarship for ST Students (Abroad Studies)',
      incomeLimit: '₹6,00,000 per annum',
      rates: 'Full tuition fees paid directly to foreign university. Annual maintenance allowance: USD 15,400 (USA/other countries) / GBP 9,900 (UK). Plus contingency allowance of USD 1,532 / GBP 1,116, visa fee, medical insurance, and economy airfare.',
      slots: '20 scholarship slots per year for Master\'s and Ph.D abroad (QS Top 500 universities).',
      eligibility: 'ST student secured unconditional offer of admission from top 500 QS world ranked foreign universities. Family income <= ₹6.0 Lakh.',
      documents: 'ST Certificate, Passport, Unconditional Admission Offer Letter, GRE/GMAT/IELTS/TOEFL scorecard, Income Certificate.',
    },
  ],
  generalRules: {
    oneScholarshipRule: 'Under Ministry of Tribal Affairs guidelines, a student can avail ONLY ONE government scholarship/fellowship at any given time. Receiving multiple concurrent scholarships from Central or State government is strictly prohibited and attracts recovery/cancellation.',
    npciAadhaarSeeding: 'For Direct Benefit Transfer (DBT) via PFMS, your bank account must be mapped/seeded in the NPCI central mapper. Merely linking Aadhaar for KYC is not enough. You must submit the Aadhaar Mandate form at your home bank branch.',
    nonBlockingVerification: 'If automated verification with state e-District or UIDAI times out, your application is NOT blocked. It is queued as NEEDS_MANUAL_REVIEW for Nodal Officer resolution within 48 hours.',
    pvtgPriority: 'Particularly Vulnerable Tribal Groups (PVTGs) such as Birhor, Chenchu, Dongria Kondh, Baiga, and Maria Gond receive top priority and relaxed scrutiny channels across all schemes.',
    divyangAllowance: 'Divyang (Persons with Disabilities) ST students receive additional monthly escorts allowance, reader allowance for visually impaired, and assistive device grants.',
  },
  helpline: {
    tollFree: '1800-11-7777',
    email: 'tribal-scholarships@gov.in',
    workingHours: 'Monday to Friday, 09:30 - 18:00 IST',
    portal: 'https://tribal.nic.in',
  },
};

/**
 * Multilingual Greetings & System Intros
 */
export const MULTILINGUAL_GREETINGS = {
  en: {
    greeting: 'Johar! I am JAGO, your Unified Tribal Scholarship AI Assistant.',
    defaultHelp: 'How can I assist you today with MoTA scholarship schemes, eligibility, document verification, or DBT payments?',
  },
  hi: {
    greeting: 'जोहार! मैं जागो (JAGO) हूँ, जनजातीय कार्य मंत्रालय का आपका डिजिटल सहायक।',
    defaultHelp: 'मैं आपकी छात्रवृत्ति योजनाओं, पात्रता, दस्तावेज़ सत्यापन या प्रत्यक्ष लाभ अंतरण (DBT) में क्या मदद कर सकता हूँ?',
  },
  or: {
    greeting: 'ଜୋହାର! ମୁଁ ଜାଗୋ (JAGO), ଜନଜାତି କାର୍ଯ୍ୟ ମନ୍ତ୍ରଣାଳୟର ଆପଣଙ୍କ ଡିଜିଟାଲ୍ ସହାୟକ।',
    defaultHelp: 'ମୁଁ ଆଜି ଆପଣଙ୍କୁ ଛାତ୍ରବୃତ୍ତି ଯୋଜନା, ଯୋଗ୍ୟତା, ପ୍ରମାଣପତ୍ର ଯାଞ୍ଚ କିମ୍ବା DBT ଟଙ୍କା ସମ୍ପର୍କରେ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',
  },
  bn: {
    greeting: 'জোহার! আমি জাগো (JAGO), উপজাতি বিষয়ক মন্ত্রকের আপনার ডিজিটাল সহকারী।',
    defaultHelp: 'আমি কীভাবে আপনাকে উপজাতি বৃত্তি প্রকল্প, যোগ্যতা, নথি যাচাই বা ডিবিটি পেমেন্ট সম্পর্কে সাহায্য করতে পারি?',
  },
  mr: {
    greeting: 'जोहार! मी जागो (JAGO) आहे, आदिवासी कार्य मंत्रालयाचा तुमचा डिजिटल सहाय्यक.',
    defaultHelp: 'मी आज तुम्हाला शिष्यवृत्ती योजना, पात्रता, कागदपत्र पडताळणी किंवा डीबीटी पेमेंटबाबत कशी मदत करू शकतो?',
  },
  te: {
    greeting: 'జోహార్! నేను జాగో (JAGO), గిరిజన వ్యవహారాల మంత్రిత్వ శాఖ డిజిటల్ సహాయకుడిని.',
    defaultHelp: 'నేను మీకు స్కాలర్‌షిప్ పథకాలు, అర్హత, సర్టిఫికెట్ల ధృవీకరణ లేదా డిబిటి చెల్లింపుల గురించి ఎలా సహాయపడగలను?',
  },
};

/**
 * Intelligent Keyword & Intent Matcher
 */
export class JagoService {
  /**
   * Process a user query with context-awareness and multilingual output
   */
  static processQuery(userMessage, student = null, language = 'en') {
    const raw = (userMessage || '').toLowerCase().trim();
    const lang = MULTILINGUAL_GREETINGS[language] ? language : 'en';

    // 1. Identify Intent & Context
    let matchedIntent = 'GENERAL_INQUIRY';
    let responseText = '';
    let actionButtons = [];
    let suggestedFollowUps = [];

    // Context flags from student record
    const hasStudent = !!student;
    const isPVTG = student?.isPVTG;
    const isDivyang = student?.isDivyang;
    const studentTribe = student?.tribe || 'Scheduled Tribe';
    const activeScheme = student?.activeScholarship?.schemeCode;
    const studentName = student?.name || 'Student';

    // INTENT 1: Greetings
    const isGreeting = raw.match(/^(hi|hello|hey|johar|namaste|pranam|namaskar|kemon|kemiti|namaskaram|halo|नमस्ते|जोहार|ନମସ୍କାର|নমস্কার|నమస్కారం|नमस्कार)/i) ||
      raw.includes('नमस्ते') || raw.includes('जोहार') || raw.includes('ନମସ୍କାର') || raw.includes('নমস্কার') || raw.includes('నమస్కారం') || raw.includes('नमस्कार');

    if (isGreeting) {
      matchedIntent = 'GREETING';
      const welcome = MULTILINGUAL_GREETINGS[lang].greeting;
      const help = MULTILINGUAL_GREETINGS[lang].defaultHelp;
      
      responseText = `${welcome}\n\n${hasStudent ? `Hello ${studentName}! I see you belong to the ${studentTribe} community${isPVTG ? ' (PVTG Priority Quota)' : ''}.\n\n` : ''}${help}`;
      
      actionButtons = [
        { label: 'Check All Scheme Rules', action: '/schemes', type: 'NAVIGATE' },
        { label: 'Check My Eligibility', action: 'OPEN_ELIGIBILITY_CHECKER', type: 'MODAL' },
        { label: 'Open Document Wallet', action: '/wallet', type: 'NAVIGATE' },
      ];

      suggestedFollowUps = [
        'Am I eligible for Top Class Education?',
        'How does the One-Scholarship rule work?',
        'Why is my DBT payment pending?',
        'How to link my bank account with NPCI?',
      ];

      return {
        intent: matchedIntent,
        response: responseText,
        actionButtons,
        suggestedFollowUps,
        language: lang,
      };
    }

    // INTENT 2: One-Scholarship Rule
    if (raw.includes('one scholarship') || raw.includes('single scheme') || raw.includes('two scholarship') || raw.includes('multiple scheme') || raw.includes('both scheme') || raw.includes('rule') || raw.includes('another scholarship')) {
      matchedIntent = 'ONE_SCHOLARSHIP_RULE';
      const detectedScheme = activeScheme || (student?.institutionName?.includes('IIT') ? 'TOP_CLASS' : 'POST_MATRIC');
      responseText = `📌 **Official One-Scholarship-at-a-Time Rule:**\n\n` +
        `Under Ministry of Tribal Affairs rules, an ST student can receive **ONLY ONE scholarship or fellowship** in an academic year.\n\n` +
        `• If you are already enrolled in a scheme (like Post-Matric or Top Class), applying for another scheme is restricted.\n` +
        `• Before applying for a new fellowship (e.g. NFST or NOS), your existing scholarship award must be either completed or formally surrendered.\n\n` +
        (hasStudent ? `⚠️ *Note for you:* Your profile currently has an active enrollment in **${detectedScheme}**. You must complete this cycle before availing another scheme.` : `✅ You currently have no active conflicting awards.`);

      actionButtons = [
        { label: 'View My Application Status', action: '/', type: 'NAVIGATE' },
        { label: 'Compare All 5 Schemes', action: '/schemes', type: 'NAVIGATE' },
      ];

      suggestedFollowUps = [
        'What happens if I get selected for NFST and Top Class?',
        'What is the income limit for Top Class scholarship?',
      ];
    }

    // INTENT 3: Top Class Scholarship
    else if (raw.includes('top class') || raw.includes('iit') || raw.includes('nit') || raw.includes('iim') || raw.includes('laptop') || raw.includes('premier institute')) {
      matchedIntent = 'SCHEME_TOP_CLASS';
      const tc = JAGO_KNOWLEDGE_BASE.schemes.find(s => s.code === 'TOP_CLASS');
      responseText = `🎓 **${tc.name}**\n\n` +
        `• **Income Ceiling:** ${tc.incomeLimit}\n` +
        `• **Financial Benefits:** ${tc.rates}\n` +
        `• **Slots:** ${tc.slots}\n` +
        `• **Eligibility:** ${tc.eligibility}\n` +
        `• **Key Documents:** ${tc.documents}\n\n` +
        `💡 *Special Feature:* ST students in IITs, NITs, IIMs, AIIMS, and NLUs receive a one-time **₹45,000 laptop/computer allowance** on admission!`;

      actionButtons = [
        { label: 'Apply for Top Class', action: '/apply/TOP_CLASS', type: 'NAVIGATE' },
        { label: 'Check 246 Notified Institutes', action: '/schemes', type: 'NAVIGATE' },
      ];

      suggestedFollowUps = [
        'How do I claim the ₹45,000 laptop grant?',
        'Is family income certificate from Tahsildar mandatory?',
      ];
    }

    // INTENT 4: National Fellowship (NFST)
    else if (raw.includes('nfst') || raw.includes('fellowship') || raw.includes('phd') || raw.includes('m.phil') || raw.includes('jrf') || raw.includes('srf')) {
      matchedIntent = 'SCHEME_NFST';
      const nfst = JAGO_KNOWLEDGE_BASE.schemes.find(s => s.code === 'NFST');
      responseText = `🔬 **${nfst.name}**\n\n` +
        `• **Income Limit:** ${nfst.incomeLimit}\n` +
        `• **Fellowship Rates:** ${nfst.rates}\n` +
        `• **Total Slots:** ${nfst.slots}\n` +
        `• **Eligibility:** ${nfst.eligibility}\n` +
        `• **Key Documents:** ${nfst.documents}\n\n` +
        `💡 *PVTG Advantage:* Special reservation quotas are allocated for students from PVTG communities like Birhor, Chenchu, Baiga, etc.`;

      actionButtons = [
        { label: 'Apply for NFST', action: '/apply/NFST', type: 'NAVIGATE' },
        { label: 'Upload UGC-NET Scorecard', action: '/wallet', type: 'NAVIGATE' },
      ];

      suggestedFollowUps = [
        'Is NET/JRF required for NFST fellowship?',
        'What is the contingency grant for science scholars?',
      ];
    }

    // INTENT 5: National Overseas Scholarship (NOS)
    else if (raw.includes('nos') || raw.includes('overseas') || raw.includes('abroad') || raw.includes('foreign') || raw.includes('masters abroad')) {
      matchedIntent = 'SCHEME_NOS';
      const nos = JAGO_KNOWLEDGE_BASE.schemes.find(s => s.code === 'NOS');
      responseText = `✈️ **${nos.name}**\n\n` +
        `• **Income Ceiling:** ${nos.incomeLimit}\n` +
        `• **Allowances:** ${nos.rates}\n` +
        `• **Slots:** ${nos.slots}\n` +
        `• **Eligibility:** ${nos.eligibility}\n` +
        `• **Key Documents:** ${nos.documents}\n\n` +
        `💡 *Institution Ranking:* The foreign university must be ranked in the **Top 500 in QS World University Rankings**.`;

      actionButtons = [
        { label: 'Apply for NOS Abroad', action: '/apply/NOS', type: 'NAVIGATE' },
        { label: 'Upload Passport & Offer Letter', action: '/wallet', type: 'NAVIGATE' },
      ];

      suggestedFollowUps = [
        'Which foreign universities are covered under NOS?',
        'Does NOS cover flight tickets and visa fees?',
      ];
    }

    // INTENT 6: Pre-Matric & Post-Matric
    else if (raw.includes('pre-matric') || raw.includes('post-matric') || raw.includes('class 9') || raw.includes('class 10') || raw.includes('class 11') || raw.includes('class 12') || raw.includes('nursing') || raw.includes('degree')) {
      matchedIntent = 'SCHEME_MATRIC';
      responseText = `📚 **MoTA School & College Scholarships:**\n\n` +
        `1. **Pre-Matric (Class IX-X):** For students in Govt/recognized schools and EMRS. Day Scholars get ₹3,500/yr, Hostellers get ₹7,000/yr. Income limit: ₹2.5 Lakh/yr.\n\n` +
        `2. **Post-Matric (Class XI to PG/PhD):** Covers full tuition fee + maintenance allowance from ₹2,500/yr to ₹13,500/yr depending on course group. Income limit: ₹2.5 Lakh/yr.\n\n` +
        `💡 Both schemes are disbursed directly to your bank account through State Tribal Welfare Departments.`;

      actionButtons = [
        { label: 'Apply for Pre-Matric', action: '/apply/PRE_MATRIC', type: 'NAVIGATE' },
        { label: 'Apply for Post-Matric', action: '/apply/POST_MATRIC', type: 'NAVIGATE' },
      ];

      suggestedFollowUps = [
        'How are Day Scholar and Hosteller rates calculated?',
        'What documents are needed for Post-Matric?',
      ];
    }

    // INTENT 7: DBT Payments & NPCI Seeding
    else if (raw.includes('payment') || raw.includes('dbt') || raw.includes('pfms') || raw.includes('npci') || raw.includes('money') || raw.includes('disbursed') || raw.includes('bank') || raw.includes('account')) {
      matchedIntent = 'PAYMENT_DBT';
      responseText = `💳 **Direct Benefit Transfer (DBT) & NPCI Seeding Guide:**\n\n` +
        `All MoTA scholarships are credited directly to your bank account using the **Aadhaar Payment Bridge System (APBS)** via PFMS.\n\n` +
        `**Key Steps to Ensure Timely Payment:**\n` +
        `1. Your primary bank account must be **seeded/mapped in NPCI** (not just linked for KYC).\n` +
        `2. Ensure your Name and DOB in your bank passbook match your Aadhaar record.\n` +
        `3. Check the **DBT Tracker** in this app to see your PFMS transaction ID and bank UTR reference number.\n\n` +
        (student ? `📊 You can check your personalized payment status in the DBT tab.` : '');

      actionButtons = [
        { label: 'Open DBT Payment Tracker', action: '/payments', type: 'NAVIGATE' },
        { label: 'Check NPCI Seeding Status', action: '/payments', type: 'NAVIGATE' },
      ];

      suggestedFollowUps = [
        'How to submit Aadhaar mandate at my bank branch?',
        'What does PFMS processing status mean?',
      ];
    }

    // INTENT 8: Documents & DigiLocker
    else if (raw.includes('document') || raw.includes('digilocker') || raw.includes('caste certificate') || raw.includes('income certificate') || raw.includes('upload') || raw.includes('verify')) {
      matchedIntent = 'DOCUMENTS_WALLET';
      responseText = `📁 **Digital Document Wallet & DigiLocker:**\n\n` +
        `You do not need to re-upload documents for every scheme!\n\n` +
        `• **DigiLocker Integration:** 1-Click pull verified ST Caste Certificate, Class 10/12 Marksheets, and Domicile certificates.\n` +
        `• **Non-Blocking Verification:** Even if state e-District servers are slow, your application submission is **never blocked**; it goes to the Nodal Officer review queue.\n` +
        `• **Reusable Vault:** Upload once and reuse across all 5 MoTA schemes.`;

      actionButtons = [
        { label: 'Open Document Wallet', action: '/wallet', type: 'NAVIGATE' },
        { label: 'Fetch from DigiLocker', action: '/wallet', type: 'NAVIGATE' },
      ];

      suggestedFollowUps = [
        'Which authority issues valid ST certificates?',
        'Is bonafide certificate required every semester?',
      ];
    }

    // INTENT 9: Grievance & Helpdesk
    else if (raw.includes('grievance') || raw.includes('complaint') || raw.includes('help') || raw.includes('contact') || raw.includes('helpline') || raw.includes('toll free') || raw.includes('delay') || raw.includes('problem')) {
      matchedIntent = 'GRIEVANCE_HELPDESK';
      responseText = `🆘 **Ministry Grievance Redressal & Helpdesk:**\n\n` +
        `If you face delays in verification, rejected bank mandates, or deficiency queries, raise a formal ticket in the Grievance tab.\n\n` +
        `• **Toll-Free Helpline:** ${JAGO_KNOWLEDGE_BASE.helpline.tollFree} (09:30 - 18:00 IST)\n` +
        `• **Official Email:** ${JAGO_KNOWLEDGE_BASE.helpline.email}\n` +
        `• **SLA Guarantee:** Nodal Officer review within 48 working hours, with 1-click escalation to the Central Ministry.`;

      actionButtons = [
        { label: 'Raise Grievance Ticket', action: '/grievance', type: 'NAVIGATE' },
        { label: 'Call Toll-Free 1800-11-7777', action: 'tel:1800117777', type: 'LINK' },
      ];

      suggestedFollowUps = [
        'How do I track my grievance ticket resolution?',
        'How to escalate an unresolved issue to MoTA?',
      ];
    }

    // INTENT 10: Fallback / General
    else {
      matchedIntent = 'GENERAL_FALLBACK';
      responseText = `Johar! I can guide you on everything regarding Ministry of Tribal Affairs (MoTA) scholarships:\n\n` +
        `1. **Scheme Rules & Eligibility** (Pre-Matric, Post-Matric, Top Class, NFST, NOS)\n` +
        `2. **One-Scholarship Rule** & Conflict Prevention\n` +
        `3. **PFMS Direct Benefit Transfer (DBT)** & NPCI Bank Seeding\n` +
        `4. **DigiLocker Document Sync** & Verification\n` +
        `5. **Grievance Redressal** & Helpdesk Support\n\n` +
        `What specific information would you like to explore?`;

      actionButtons = [
        { label: 'Check My Eligibility', action: 'OPEN_ELIGIBILITY_CHECKER', type: 'MODAL' },
        { label: 'Browse All 5 Schemes', action: '/schemes', type: 'NAVIGATE' },
        { label: 'Track DBT Payments', action: '/payments', type: 'NAVIGATE' },
      ];

      suggestedFollowUps = [
        'What are the eligibility criteria for Top Class scholarship?',
        'How to pull caste certificate from DigiLocker?',
        'What is the income limit for Pre-Matric and Post-Matric?',
      ];
    }

    // Localize response if non-English
    if (lang !== 'en') {
      responseText = JagoService.translateResponse(responseText, lang);
    }

    return {
      intent: matchedIntent,
      response: responseText,
      actionButtons,
      suggestedFollowUps,
      language: lang,
    };
  }

  /**
   * Helper translation for key terms
   */
  static translateResponse(text, lang) {
    if (lang === 'hi') {
      return text
        .replace(/Official One-Scholarship-at-a-Time Rule/g, 'एक समय पर एक छात्रवृत्ति का आधिकारिक नियम')
        .replace(/Income Ceiling:/g, 'पारिवारिक आय सीमा:')
        .replace(/Financial Benefits:/g, 'वित्तीय लाभ:')
        .replace(/Key Documents:/g, 'प्रमुख आवश्यक दस्तावेज़:')
        .replace(/Direct Benefit Transfer \(DBT\)/g, 'प्रत्यक्ष लाभ अंतरण (DBT)')
        .replace(/Digital Document Wallet/g, 'डिजिटल दस्तावेज़ वॉलेट');
    }
    if (lang === 'or') {
      return text
        .replace(/Official One-Scholarship-at-a-Time Rule/g, 'ଗୋଟିଏ ସମୟରେ ଗୋଟିଏ ଛାତ୍ରବୃତ୍ତି ନିୟମ')
        .replace(/Income Ceiling:/g, 'ପାରିବାରିକ ଆୟ ସୀମା:')
        .replace(/Financial Benefits:/g, 'ଆର୍ଥିକ ସୁବିଧା:')
        .replace(/Key Documents:/g, 'ଆବଶ୍ୟକୀୟ ପ୍ରମାଣପତ୍ର:')
        .replace(/Direct Benefit Transfer \(DBT\)/g, 'ପ୍ରତ୍ୟକ୍ଷ ଲାଭ ହସ୍ତାନ୍ତର (DBT)')
        .replace(/Digital Document Wallet/g, 'ଡିଜିଟାଲ୍ ଡକ୍ୟୁମେଣ୍ଟ ୱାଲେଟ୍');
    }
    return text;
  }
}

export default JagoService;
