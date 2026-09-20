import React, { createContext, useContext, useState, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
];

export const TRANSLATIONS = {
  en: {
    // Header & Brand
    portalTitle: 'Unified Tribal Scholarship Portal',
    ministryName: 'Ministry of Tribal Affairs (MoTA)',
    govIndia: 'Government of India',
    demoPersona: 'Demo Persona',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    home: 'Home',
    schemes: 'Schemes',
    wallet: 'Wallet',
    dbt: 'DBT',
    profile: 'Profile',
    officerConsole: 'Officer Console',
    reviewQueue: 'Review Queue',

    // Dashboard
    studentDashboard: 'Tribal Student Dashboard',
    apaarId: 'APAAR ID',
    familyIncome: 'Family Income',
    enrolledCourse: 'Enrolled Course',
    aadhaarBank: 'Aadhaar & Bank',
    checkEligibility: 'Check Eligibility',
    singleWindowNotice: 'Single Unified Application Window',
    singleWindowDesc: 'Apply for any eligible MoTA scheme. Your verified documents and profile will be auto-filled.',
    oneSchemeRuleWarning: 'Active Scholarship Enrolled • One-Scholarship Rule Active',
    dbtSummary: 'Direct Benefit Transfer (PFMS) Summary',
    totalDisbursed: 'Total DBT Disbursed',
    pendingCredit: 'Pending Sanctioned Credit',
    documentVault: 'Document Vault',
    unifiedDirectory: 'Unified Scheme Directory (All 5 MoTA Schemes)',
    applyNow: 'Apply Now',
    resumeDraft: 'Resume Draft',
    trackStatus: 'Track Status',

    // Schemes
    preMatricName: 'Pre-Matric Scholarship (Class IX-X)',
    postMatricName: 'Post-Matric Scholarship (Class XI-PhD)',
    topClassName: 'Top Class Education for ST Students',
    nfstName: 'National Fellowship for ST (M.Phil / PhD)',
    nosName: 'National Overseas Scholarship (Abroad)',

    // JAGO AI
    askJago: 'Ask JAGO AI',
    jagoTitle: 'JAGO Tribal Scholarship Assistant',
    jagoSubtitle: 'Jan Jatiya Sahayak • Context-aware & Voice-enabled',
    speakNow: 'Listening to your voice...',
    typePlaceholder: 'Ask in your preferred language or tap mic...',
    jagoGreeting: 'Johar! How can I assist you with MoTA scholarships today?',

    // Statuses
    verified: 'Verified',
    submitted: 'Submitted',
    underVerification: 'Under Verification',
    deficiencyRaised: 'Deficiency Raised',
    sanctioned: 'Sanctioned',
    disbursed: 'Disbursed (DBT)',
    rejected: 'Rejected',
    draft: 'Draft Saved',
    notApplied: 'Not Applied',
  },

  hi: {
    // Header & Brand
    portalTitle: 'एकीकृत जनजातीय छात्रवृत्ति पोर्टल',
    ministryName: 'जनजातीय कार्य मंत्रालय (MoTA)',
    govIndia: 'भारत सरकार',
    demoPersona: 'डेमो व्यक्तित्व',
    signIn: 'लॉग इन करें',
    signOut: 'लॉग आउट',
    home: 'होम',
    schemes: 'योजनाएं',
    wallet: 'वॉलेट',
    dbt: 'डीबीटी',
    profile: 'प्रोफ़ाइल',
    officerConsole: 'अधिकारी कंसोल',
    reviewQueue: 'समीक्षा कतार',

    // Dashboard
    studentDashboard: 'जनजातीय छात्र डैशबोर्ड',
    apaarId: 'अपार (APAAR) आईडी',
    familyIncome: 'पारिवारिक वार्षिक आय',
    enrolledCourse: 'नामांकित पाठ्यक्रम',
    aadhaarBank: 'आधार और बैंक',
    checkEligibility: 'पात्रता जांचें',
    singleWindowNotice: 'एकल एकीकृत आवेदन खिड़की',
    singleWindowDesc: 'किसी भी पात्र योजना के लिए आवेदन करें। आपके सत्यापित दस्तावेज़ स्वतः भरे जाएंगे।',
    oneSchemeRuleWarning: 'सक्रिय छात्रवृत्ति नामांकित • एक-छात्रवृत्ति नियम सक्रिय',
    dbtSummary: 'प्रत्यक्ष लाभ अंतरण (PFMS) सारांश',
    totalDisbursed: 'कुल डीबीटी भुगतान',
    pendingCredit: 'लंबित स्वीकृत राशि',
    documentVault: 'दस्तावेज़ वॉल्ट',
    unifiedDirectory: 'एकीकृत योजना निर्देशिका (सभी 5 MoTA योजनाएं)',
    applyNow: 'आवेदन करें',
    resumeDraft: 'ड्राफ्ट फिर से शुरू करें',
    trackStatus: 'स्थिति ट्रैक करें',

    // Schemes
    preMatricName: 'प्री-मैट्रिक छात्रवृत्ति (कक्षा 9-10)',
    postMatricName: 'पोस्ट-मैट्रिक छात्रवृत्ति (कक्षा 11-पीएचडी)',
    topClassName: 'शीर्ष श्रेणी शिक्षा छात्रवृत्ति (Top Class)',
    nfstName: 'राष्ट्रीय फैलोशिप (NFST - एम.फिल / पीएचडी)',
    nosName: 'राष्ट्रीय विदेशी छात्रवृत्ति (NOS)',

    // JAGO AI
    askJago: 'जागो (JAGO) से पूछें',
    jagoTitle: 'जागो जनजातीय छात्रवृत्ति सहायक',
    jagoSubtitle: 'जनजातीय सहायक • संदर्भ-जागरूक और आवाज-सक्षम',
    speakNow: 'आपकी आवाज सुन रहा हूँ...',
    typePlaceholder: 'अपनी पसंदीदा भाषा में पूछें या माइक दबाएं...',
    jagoGreeting: 'जोहार! मैं आज जनजातीय छात्रवृत्ति में आपकी क्या सहायता कर सकता हूँ?',

    // Statuses
    verified: 'सत्यापित',
    submitted: 'जमा किया गया',
    underVerification: 'सत्यापनाधीन',
    deficiencyRaised: 'कमी पाई गई',
    sanctioned: 'स्वीकृत',
    disbursed: 'भुगतान पूर्ण (DBT)',
    rejected: 'अस्वीकृत',
    draft: 'ड्राफ्ट सहेजा गया',
    notApplied: 'आवेदन नहीं किया',
  },

  or: {
    // Header & Brand
    portalTitle: 'ୟୁନିଫାଏଡ୍ ଜନଜାତି ଛାତ୍ରବୃତ୍ତି ପୋର୍ଟାଲ୍',
    ministryName: 'ଜନଜାତି କାର୍ଯ୍ୟ ମନ୍ତ୍ରଣାଳୟ (MoTA)',
    govIndia: 'ଭାରତ ସରକାର',
    demoPersona: 'ଡେମୋ ପର୍ସନା',
    signIn: 'ସାଇନ୍ ଇନ୍',
    signOut: 'ଲଗ୍ ଆଉଟ୍',
    home: 'ମୂଳପୃଷ୍ଠା',
    schemes: 'ଯୋଜନାସମୂହ',
    wallet: 'ୱାଲେଟ୍',
    dbt: 'DBT',
    profile: 'ପ୍ରୋଫାଇଲ୍',
    officerConsole: 'ଅଫିସର୍ କନସୋଲ୍',
    reviewQueue: 'ଯାଞ୍ଚ ତାଲିକା',

    // Dashboard
    studentDashboard: 'ଆଦିବାସୀ ଛାତ୍ର ଡ୍ୟାସବୋର୍ଡ',
    apaarId: 'APAAR ଆଇଡି',
    familyIncome: 'ପାରିବାରିକ ଆୟ',
    enrolledCourse: 'ନାମଲେଖା ପାଠ୍ୟକ୍ରମ',
    aadhaarBank: 'ଆଧାର ଓ ବ୍ୟାଙ୍କ',
    checkEligibility: 'ଯୋଗ୍ୟତା ଯାଞ୍ଚ କରନ୍ତୁ',
    singleWindowNotice: 'ଏକକ ୟୁନିଫାଏଡ୍ ଆବେଦନ ୱିଣ୍ଡୋ',
    singleWindowDesc: 'ଯୋଗ୍ୟ MoTA ଯୋଜନା ପାଇଁ ଆବେଦନ କରନ୍ତୁ। ଯାଞ୍ଚ ହୋଇଥିବା ପ୍ରମାଣପତ୍ର ଆପେ ପୂରଣ ହେବ।',
    oneSchemeRuleWarning: 'ଗୋଟିଏ ସମୟରେ ଗୋଟିଏ ଛାତ୍ରବୃତ୍ତି ନିୟମ ସକ୍ରିୟ',
    dbtSummary: 'ପ୍ରତ୍ୟକ୍ଷ ଲାଭ ହସ୍ତାନ୍ତର (PFMS) ସାରାଂଶ',
    totalDisbursed: 'ମୋଟ DBT ଟଙ୍କା ପ୍ରଦାନ',
    pendingCredit: 'ଅପେକ୍ଷାରତ ଅନୁମୋଦିତ ରାଶି',
    documentVault: 'ପ୍ରମାଣପତ୍ର ଭଣ୍ଡାର',
    unifiedDirectory: 'ସମସ୍ତ ୫ଟି MoTA ଛାତ୍ରବୃତ୍ତି ଯୋଜନା',
    applyNow: 'ଆବେଦନ କରନ୍ତୁ',
    resumeDraft: 'ଡ୍ରାଫ୍ଟ ଜାରି ରଖନ୍ତୁ',
    trackStatus: 'ସ୍ଥିତି ଦେଖନ୍ତୁ',

    // Schemes
    preMatricName: 'ପ୍ରି-ମେଟ୍ରିକ୍ ଛାତ୍ରବୃତ୍ତି (ଶ୍ରେଣୀ ୯-୧୦)',
    postMatricName: 'ପୋଷ୍ଟ-ମେଟ୍ରିକ୍ ଛାତ୍ରବୃତ୍ତି (ଶ୍ରେଣୀ ୧୧-PhD)',
    topClassName: 'ଟପ୍ କ୍ଲାସ୍ ଉଚ୍ଚ ଶିକ୍ଷା ଛାତ୍ରବୃତ୍ତି',
    nfstName: 'ଜାତୀୟ ଫେଲୋସିପ୍ (NFST - M.Phil / PhD)',
    nosName: 'ଜାତୀୟ ବିଦେଶୀ ଛାତ୍ରବୃତ୍ତି (NOS)',

    // JAGO AI
    askJago: 'ଜାଗୋ (JAGO) କୁ ପଚାରନ୍ତୁ',
    jagoTitle: 'ଜାଗୋ ଆଦିବାସୀ ଛାତ୍ରବୃତ୍ତି ସହାୟକ',
    jagoSubtitle: 'ଜନଜାତି ସହାୟକ • ସ୍ୱର-ସକ୍ଷମ AI',
    speakNow: 'ଆପଣଙ୍କ କଥା ଶୁଣାଯାଉଛି...',
    typePlaceholder: 'ଓଡ଼ିଆ କିମ୍ବା ଇଂରାଜୀରେ ପଚାରନ୍ତୁ...',
    jagoGreeting: 'ଜୋହାର! ଛାତ୍ରବୃତ୍ତି ସମ୍ବନ୍ଧରେ ଆଜି ମୁଁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?',

    // Statuses
    verified: 'ଯାଞ୍ଚ ହୋଇଛି',
    submitted: 'ଦାଖଲ ହୋଇଛି',
    underVerification: 'ଯାଞ୍ଚ ଚାଲିଛି',
    deficiencyRaised: 'ତ୍ରୁଟି ଦର୍ଶାଯାଇଛି',
    sanctioned: 'ମଞ୍ଜୁର ହୋଇଛି',
    disbursed: 'ଖାତାକୁ ଜମା ହୋଇଛି (DBT)',
    rejected: 'ଅଗ୍ରାହ୍ୟ',
    draft: 'ସାଇତା ହୋଇଛି',
    notApplied: 'ଆବେଦନ ହୋଇନାହିଁ',
  },

  bn: {
    // Header & Brand
    portalTitle: 'একীকৃত উপজাতি বৃত্তি পোর্টাল',
    ministryName: 'উপজাতি বিষয়ক মন্ত্রক (MoTA)',
    govIndia: 'ভারত সরকার',
    demoPersona: 'ডেমো ভূমিকা',
    signIn: 'সাইন ইন',
    signOut: 'সাইন আউট',
    home: 'হোম',
    schemes: 'প্রকল্পসমূহ',
    wallet: 'ওয়ালেট',
    dbt: 'ডিবিটি',
    profile: 'প্রোফাইল',
    officerConsole: 'অফিসার কনসোল',
    reviewQueue: 'পর্যালোচনা সারি',

    // Dashboard
    studentDashboard: 'উপজাতি ছাত্র ড্যাশবোর্ড',
    apaarId: 'আপার (APAAR) আইডি',
    familyIncome: 'পারিবারিক বার্ষিক আয়',
    enrolledCourse: 'নথিভুক্ত কোর্স',
    aadhaarBank: 'আধার ও ব্যাংক',
    checkEligibility: 'যোগ্যতা পরীক্ষা করুন',
    singleWindowNotice: 'একক সমন্বিত আবেদন উইন্ডো',
    singleWindowDesc: 'যেকোনো উপযুক্ত স্কিমের জন্য আবেদন করুন। নথি স্বতঃপূর্ণ হবে।',
    oneSchemeRuleWarning: 'একটি স্কিম নিয়ম সক্রিয়',
    dbtSummary: 'সরাসরি সুবিধা হস্তান্তর (PFMS) সারসংক্ষেপ',
    totalDisbursed: 'মোট ডিবিটি প্রদত্ত',
    pendingCredit: 'অনুমোদনের অপেক্ষায়',
    documentVault: 'নথি ভল্ট',
    unifiedDirectory: 'সমস্ত ৫টি MoTA উপজাতি বৃত্তি প্রকল্প',
    applyNow: 'আবেদন করুন',
    resumeDraft: 'ড্রাফট পুনরায় শুরু করুন',
    trackStatus: 'স্থিতি ট্র্যাক করুন',

    // Schemes
    preMatricName: 'প্রাক-ম্যাট্রিক বৃত্তি (নবম-দশম শ্রেণী)',
    postMatricName: 'পোস্ট-ম্যাট্রিক বৃত্তি (একাদশ-পিএইচডি)',
    topClassName: 'টপ ক্লাস উচ্চশিক্ষা বৃত্তি',
    nfstName: 'জাতীয় ফেলোশিপ (NFST - এম.ফিল/পিএইচডি)',
    nosName: 'জাতীয় বিদেশী বৃত্তি (NOS)',

    // JAGO AI
    askJago: 'জাগো (JAGO) কে জিজ্ঞাসা করুন',
    jagoTitle: 'জাগো উপজাতি সহকারী',
    jagoSubtitle: 'জনজাতি সহায়ক • ভয়েস-সক্ষম AI',
    speakNow: 'শুনছি...',
    typePlaceholder: 'আপনার প্রশ্ন লিখুন...',
    jagoGreeting: 'জোহার! উপজাতি বৃত্তি সম্পর্কে আপনাকে কীভাবে সাহায্য করতে পারি?',

    // Statuses
    verified: 'যাচাইকৃত',
    submitted: 'জমা হয়েছে',
    underVerification: 'যাচাইকরণাধীন',
    deficiencyRaised: 'ত্রুটি চিহ্নিত',
    sanctioned: 'অনুমোদিত',
    disbursed: 'জমা হয়েছে (DBT)',
    rejected: 'প্রত্যাখ্যাত',
    draft: 'সংরক্ষিত ড্রাফট',
    notApplied: 'আবেদন করা হয়নি',
  },

  mr: {
    // Header & Brand
    portalTitle: 'एकीकृत आदिवासी शिष्यवृत्ती पोर्टल',
    ministryName: 'आदिवासी कार्य मंत्रालय (MoTA)',
    govIndia: 'भारत सरकार',
    demoPersona: 'डेमो भूमिका',
    signIn: 'साइन इन',
    signOut: 'साइन आउट',
    home: 'मुख्यपृष्ठ',
    schemes: 'योजना',
    wallet: 'वॉलेट',
    dbt: 'डीबीटी',
    profile: 'प्रोफाइल',
    officerConsole: 'अधिकारी कन्सोल',
    reviewQueue: 'पुनरावलोकन रांग',

    // Dashboard
    studentDashboard: 'आदिवासी विद्यार्थी डॅशबोर्ड',
    apaarId: 'अपार (APAAR) आयडी',
    familyIncome: 'कौटुंबिक वार्षिक उत्पन्न',
    enrolledCourse: 'प्रवेश घेतलेला अभ्यासक्रम',
    aadhaarBank: 'आधार व बँक',
    checkEligibility: 'पात्रता तपासा',
    singleWindowNotice: 'एकल एकात्मिक अर्ज खिडकी',
    singleWindowDesc: 'कोणत्याही पात्र योजनेसाठी अर्ज करा. कागदपत्रे आपोआप भरली जातील.',
    oneSchemeRuleWarning: 'एका वेळी एक शिष्यवृत्ती नियम सक्रिय',
    dbtSummary: 'थेट लाभ हस्तांतरण (PFMS) सारांश',
    totalDisbursed: 'एकूण डीबीटी वितरित',
    pendingCredit: 'प्रलंबित मंजूर रक्कम',
    documentVault: 'कागदपत्र तिजोरी',
    unifiedDirectory: 'सर्व ५ MoTA आदिवासी शिष्यवृत्ती योजना',
    applyNow: 'अर्ज करा',
    resumeDraft: 'मसुदा सुरू ठेवा',
    trackStatus: 'स्थिती तपासा',

    // Schemes
    preMatricName: 'मॅट्रिकपूर्व शिष्यवृत्ती (इयत्ता ९-१०)',
    postMatricName: 'मॅट्रिकोत्तर शिष्यवृत्ती (इयत्ता ११-पीएचडी)',
    topClassName: 'टॉप क्लास उच्च शिक्षण शिष्यवृत्ती',
    nfstName: 'राष्ट्रीय फेलोशिप (NFST - एम.फिल/पीएचडी)',
    nosName: 'राष्ट्रीय परदेशी शिष्यवृत्ती (NOS)',

    // JAGO AI
    askJago: 'जागो (JAGO) ला विचारा',
    jagoTitle: 'जागो आदिवासी शिष्यवृत्ती सहाय्यक',
    jagoSubtitle: 'जनजाती सहाय्यक • व्हॉईस-सक्षम AI',
    speakNow: 'तुमचा आवाज ऐकत आहे...',
    typePlaceholder: 'आपल्या भाषेत विचारा...',
    jagoGreeting: 'जोहार! मी आदिवासी शिष्यवृत्तीबाबत कशी मदत करू शकतो?',

    // Statuses
    verified: 'पडताळणी पूर्ण',
    submitted: 'सादर केले',
    underVerification: 'पडताळणी सुरू',
    deficiencyRaised: 'त्रुटी आढळली',
    sanctioned: 'मंजूर',
    disbursed: 'खात्यात जमा (DBT)',
    rejected: 'नाकारले',
    draft: 'जतन केलेला मसुदा',
    notApplied: 'अर्ज केलेला नाही',
  },

  te: {
    // Header & Brand
    portalTitle: 'ఏకీకృత గిరిజన స్కాలర్‌షిప్ పోర్టల్',
    ministryName: 'గిరిజన వ్యవహారాల మంత్రిత్వ శాఖ (MoTA)',
    govIndia: 'భారత ప్రభుత్వం',
    demoPersona: 'డెమో ప్రొఫైల్',
    signIn: 'సైన్ ఇన్',
    signOut: 'సైన్ అవుట్',
    home: 'హోమ్',
    schemes: 'పథకాలు',
    wallet: 'వ్యాలెట్',
    dbt: 'డిబిటి',
    profile: 'ప్రొఫైల్',
    officerConsole: 'అధికారి కన్సోల్',
    reviewQueue: 'పరిశీలన వరుస',

    // Dashboard
    studentDashboard: 'గిరిజన విద్యార్థి డాష్‌బోర్డ్',
    apaarId: 'అపార్ (APAAR) ఐడి',
    familyIncome: 'కుటుంబ వార్షిక ఆదాయం',
    enrolledCourse: 'చేరిన కోర్సు',
    aadhaarBank: 'ఆధార్ & బ్యాంక్',
    checkEligibility: 'అర్హతను తనిఖీ చేయండి',
    singleWindowNotice: 'సింగిల్ యూనిఫైడ్ అప్లికేషన్ విండో',
    singleWindowDesc: 'ఏదైనా MoTA పథకానికి దరఖాస్తు చేయండి. ధృవీకరించబడిన పత్రాలు స్వయంచాలకంగా నింపబడతాయి.',
    oneSchemeRuleWarning: 'ఒక స్కాలర్‌షిప్ నియమం సక్రియంగా ఉంది',
    dbtSummary: 'డైరెక్ట్ బెనిఫిట్ ట్రాన్స్‌ఫర్ (PFMS) సారాంశం',
    totalDisbursed: 'మొత్తం డిబిటి జమ చేసినది',
    pendingCredit: 'మంజూరు వేచి ఉంది',
    documentVault: 'పత్రాల వాల్ట్',
    unifiedDirectory: 'మొత్తం 5 MoTA స్కాలర్‌షిప్ పథకాలు',
    applyNow: 'దరఖాస్తు చేసుకోండి',
    resumeDraft: 'డ్రాఫ్ట్ పునఃప్రారంభించండి',
    trackStatus: 'స్థితిని ట్రాక్ చేయండి',

    // Schemes
    preMatricName: 'ప్రీ-మెట్రిక్ స్కాలర్‌షిప్ (9-10 తరగతులు)',
    postMatricName: 'పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్ (11వ తరగతి - PhD)',
    topClassName: 'టాప్ క్లాస్ ఉన్నత విద్య స్కాలర్‌షిప్',
    nfstName: 'నేషనల్ ఫెలోషిప్ (NFST - ఎం.ఫిల్/పీహెచ్‌డీ)',
    nosName: 'నేషనల్ ఓవర్సీస్ స్కాలర్‌షిప్ (విదేశీ విద్య)',

    // JAGO AI
    askJago: 'జాగో (JAGO) ని అడగండి',
    jagoTitle: 'జాగో గిరిజన సహాయకుడు',
    jagoSubtitle: 'జనజాతి సహాయకుడు • వాయిస్ ఆధారిత AI',
    speakNow: 'వింటున్నాను...',
    typePlaceholder: 'తెలుగు లేదా ఇంగ్లీషులో అడగండి...',
    jagoGreeting: 'జోహార్! స్కాలర్‌షిప్‌ల గురించి నేను మీకు ఎలా సహాయపడగలను?',

    // Statuses
    verified: 'ధృవీకరించబడింది',
    submitted: 'సమర్పించబడింది',
    underVerification: 'పరిశీలనలో ఉంది',
    deficiencyRaised: 'లోపం గుర్తించబడింది',
    sanctioned: 'మంజూరైంది',
    disbursed: 'జమ చేయబడింది (DBT)',
    rejected: 'తిరస్కరించబడింది',
    draft: 'డ్రాఫ్ట్ సేవ్ అయింది',
    notApplied: 'దరఖాస్తు చేయలేదు',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('mota_app_lang') || 'en';
  });

  const setLanguage = (langCode) => {
    if (TRANSLATIONS[langCode]) {
      setCurrentLanguage(langCode);
      localStorage.setItem('mota_app_lang', langCode);
    }
  };

  const t = (key) => {
    const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
