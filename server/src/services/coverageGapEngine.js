/**
 * Tribal District Coverage Gap & PVTG Saturation Analytics Engine
 * Computes ST scholarship penetration index, PVTG outreach ratios,
 * transition drop-off bottlenecks, and automated DWO directives.
 */

export const TRIBAL_DISTRICTS_DATA = [
  // Odisha
  {
    district: 'Mayurbhanj',
    state: 'Odisha',
    stPopulation: 1479795,
    stPopPercentage: 58.7,
    pvtgCommunities: ['Birhor', 'Lodha', 'Hill Kharia'],
    pvtgPopulation: 42300,
    enrolledPreMatric: 38400,
    enrolledPostMatric: 19800,
    enrolledHigherEdu: 3120,
    pvtgEnrolled: 6840,
    transitionDropoffRate: 48.4, // % drop from Class 10 to Class 11
    avgProcessingDays: 14.2,
    documentBottleneckFactor: 'HIGH_INCOME_CERT_LATENCY',
    dwoDirectives: [
      'Deploy mobile DigiLocker registration vans in Baripada and Rairangpur sub-divisions.',
      'Conduct fast-track caste certification camps for Birhor and Hill Kharia settlements.',
    ],
  },
  {
    district: 'Sundargarh',
    state: 'Odisha',
    stPopulation: 1062349,
    stPopPercentage: 50.7,
    pvtgCommunities: ['Paudi Bhuyan', 'Birhor'],
    pvtgPopulation: 28500,
    enrolledPreMatric: 31200,
    enrolledPostMatric: 18400,
    enrolledHigherEdu: 4250,
    pvtgEnrolled: 5120,
    transitionDropoffRate: 41.0,
    avgProcessingDays: 11.8,
    documentBottleneckFactor: 'LOW_BOTTLENECK',
    dwoDirectives: [
      'Scale up Top Class awareness in NIT Rourkela and EMRS Bhavani.',
      'Organize bank Aadhaar-NPCI seeding drives with Lead District Bank (SBI).',
    ],
  },
  {
    district: 'Koraput',
    state: 'Odisha',
    stPopulation: 697583,
    stPopPercentage: 50.6,
    pvtgCommunities: ['Didayi', 'Dongria Kondh', 'Bonda'],
    pvtgPopulation: 34200,
    enrolledPreMatric: 19800,
    enrolledPostMatric: 8200,
    enrolledHigherEdu: 1180,
    pvtgEnrolled: 3950,
    transitionDropoffRate: 58.6,
    avgProcessingDays: 18.5,
    documentBottleneckFactor: 'VERY_HIGH_CASTE_CERT_LATENCY',
    dwoDirectives: [
      'Special saturation campaign for Dongria Kondh and Bonda students across 14 Gram Panchayats.',
      'Empower Block Development Officers (BDOs) with offline token upload kits.',
    ],
  },

  // Jharkhand
  {
    district: 'Khunti',
    state: 'Jharkhand',
    stPopulation: 391599,
    stPopPercentage: 73.2,
    pvtgCommunities: ['Birhor'],
    pvtgPopulation: 12400,
    enrolledPreMatric: 14500,
    enrolledPostMatric: 7900,
    enrolledHigherEdu: 1420,
    pvtgEnrolled: 2180,
    transitionDropoffRate: 45.5,
    avgProcessingDays: 12.0,
    documentBottleneckFactor: 'MODERATE',
    dwoDirectives: [
      'Birthplace of Bhagwan Birsa Munda: Achieve 100% Pre-Matric EMRS saturation.',
      'Strengthen Post-Matric bridge coaching in Torpa and Murhu blocks.',
    ],
  },
  {
    district: 'West Singhbhum',
    state: 'Jharkhand',
    stPopulation: 1011296,
    stPopPercentage: 67.3,
    pvtgCommunities: ['Birhor', 'Mal Paharia'],
    pvtgPopulation: 21000,
    enrolledPreMatric: 27800,
    enrolledPostMatric: 13200,
    enrolledHigherEdu: 2100,
    pvtgEnrolled: 3800,
    transitionDropoffRate: 52.5,
    avgProcessingDays: 16.2,
    documentBottleneckFactor: 'HIGH_BANK_SEEDING_REJECTION',
    dwoDirectives: [
      'Address NPCI mapper mismatch via Gram Rozgar Sevaks in Chaibasa.',
      'Ensure 100% scholarship bank accounts are converted to zero-balance PMJDY/DBT accounts.',
    ],
  },

  // Chhattisgarh
  {
    district: 'Bastar',
    state: 'Chhattisgarh',
    stPopulation: 576408,
    stPopPercentage: 65.8,
    pvtgCommunities: ['Abujh Maria', 'Maria Gond'],
    pvtgPopulation: 38000,
    enrolledPreMatric: 18400,
    enrolledPostMatric: 8900,
    enrolledHigherEdu: 1350,
    pvtgEnrolled: 4400,
    transitionDropoffRate: 51.6,
    avgProcessingDays: 15.0,
    documentBottleneckFactor: 'HIGH_REMOTE_CONNECTIVITY',
    dwoDirectives: [
      'Enable offline PWA caching for remote ashram schools in Jagdalpur and Tokapal.',
      'Expedite NFST research fellowship guidance for Bastar University scholars.',
    ],
  },
  {
    district: 'Dantewada',
    state: 'Chhattisgarh',
    stPopulation: 201814,
    stPopPercentage: 76.9,
    pvtgCommunities: ['Maria Gond', 'Dhurwa'],
    pvtgPopulation: 19500,
    enrolledPreMatric: 7800,
    enrolledPostMatric: 3400,
    enrolledHigherEdu: 620,
    pvtgEnrolled: 2300,
    transitionDropoffRate: 56.4,
    avgProcessingDays: 17.1,
    documentBottleneckFactor: 'MODERATE_CONNECTIVITY',
    dwoDirectives: [
      'Intensify NMDC & Education City Dantewada Top Class entrance coaching tie-ups.',
      'Deploy mobile CSC kiosks for Class 10 student document digitization.',
    ],
  },

  // Madhya Pradesh
  {
    district: 'Jhabua',
    state: 'Madhya Pradesh',
    stPopulation: 893577,
    stPopPercentage: 87.0,
    pvtgCommunities: ['Bhil', 'Bhilala', 'Baiga'],
    pvtgPopulation: 14000,
    enrolledPreMatric: 29400,
    enrolledPostMatric: 14600,
    enrolledHigherEdu: 1950,
    pvtgEnrolled: 2600,
    transitionDropoffRate: 50.3,
    avgProcessingDays: 13.4,
    documentBottleneckFactor: 'SEASONAL_MIGRATION',
    dwoDirectives: [
      'Issue portable DigiLocker scholarship cards for migratory tribal families.',
      'Establish proactive SMS reminders before annual verification cut-offs.',
    ],
  },
  {
    district: 'Mandla',
    state: 'Madhya Pradesh',
    stPopulation: 597089,
    stPopPercentage: 57.9,
    pvtgCommunities: ['Baiga'],
    pvtgPopulation: 46000,
    enrolledPreMatric: 21500,
    enrolledPostMatric: 10800,
    enrolledHigherEdu: 1700,
    pvtgEnrolled: 7400,
    transitionDropoffRate: 49.8,
    avgProcessingDays: 12.9,
    documentBottleneckFactor: 'LOW_BOTTLENECK',
    dwoDirectives: [
      'Baiga Habitat Rights saturation: Fast-track 100% Baiga youth for Post-Matric & Higher Edu.',
      'Distribute bilingual (Gondi/Hindi) scholarship eligibility guides.',
    ],
  },

  // Maharashtra
  {
    district: 'Nandurbar',
    state: 'Maharashtra',
    stPopulation: 1111082,
    stPopPercentage: 69.3,
    pvtgCommunities: ['Katkari', 'Kolam'],
    pvtgPopulation: 18000,
    enrolledPreMatric: 34500,
    enrolledPostMatric: 17800,
    enrolledHigherEdu: 2800,
    pvtgEnrolled: 3200,
    transitionDropoffRate: 48.4,
    avgProcessingDays: 13.1,
    documentBottleneckFactor: 'LOW_BOTTLENECK',
    dwoDirectives: [
      'Achieve 100% Satpuda tribal belt coverage for tribal engineering & medical students.',
      'Conduct institutional verification audits across Dhadgaon and Akkalkuwa ashram schools.',
    ],
  },
];

export class CoverageGapEngine {
  /**
   * Get comprehensive coverage gap analytics
   */
  static getAnalytics(filterState = null) {
    let districts = TRIBAL_DISTRICTS_DATA;
    if (filterState && filterState !== 'ALL') {
      districts = districts.filter(d => d.state.toLowerCase() === filterState.toLowerCase());
    }

    const totalStPop = districts.reduce((acc, d) => acc + d.stPopulation, 0);
    const totalPvtgPop = districts.reduce((acc, d) => acc + d.pvtgPopulation, 0);
    const totalPreMatric = districts.reduce((acc, d) => acc + d.enrolledPreMatric, 0);
    const totalPostMatric = districts.reduce((acc, d) => acc + d.enrolledPostMatric, 0);
    const totalHigherEdu = districts.reduce((acc, d) => acc + d.enrolledHigherEdu, 0);
    const totalPvtgEnrolled = districts.reduce((acc, d) => acc + d.pvtgEnrolled, 0);
    const totalEnrolled = totalPreMatric + totalPostMatric + totalHigherEdu;

    // Derived Saturation Indices
    const nationalPreMatricCoverageRatio = totalPreMatric / (totalStPop * 0.08); // Estimate ~8% school-going Class 9-10
    const pvtgSaturationRate = (totalPvtgEnrolled / (totalPvtgPop * 0.25)) * 100; // ~25% school/college age
    const avgTransitionDropoff = districts.reduce((acc, d) => acc + d.transitionDropoffRate, 0) / districts.length;

    // Enrich districts with computed saturation & coverage grades
    const enrichedDistricts = districts.map(d => {
      const estimatedSchoolAgeST = d.stPopulation * 0.18; // ~18% youth population
      const districtTotalBeneficiaries = d.enrolledPreMatric + d.enrolledPostMatric + d.enrolledHigherEdu;
      const coverageRate = Math.min(100, (districtTotalBeneficiaries / estimatedSchoolAgeST) * 100);
      const pvtgOutreachRate = Math.min(100, (d.pvtgEnrolled / (d.pvtgPopulation * 0.25)) * 100);

      let status = 'SATURATED';
      if (coverageRate < 45 || d.transitionDropoffRate > 52) {
        status = 'CRITICAL_GAP';
      } else if (coverageRate < 65 || d.transitionDropoffRate > 45) {
        status = 'NEEDS_OUTREACH';
      }

      return {
        ...d,
        coverageRate: parseFloat(coverageRate.toFixed(1)),
        pvtgOutreachRate: parseFloat(pvtgOutreachRate.toFixed(1)),
        totalBeneficiaries: districtTotalBeneficiaries,
        status,
      };
    });

    // Top priority critical districts requiring immediate intervention
    const criticalDistricts = enrichedDistricts.filter(d => d.status === 'CRITICAL_GAP');

    return {
      summary: {
        totalDistrictsMonitored: districts.length,
        totalStPopulationCovered: totalStPop,
        totalPvtgPopulationCovered: totalPvtgPop,
        totalActiveBeneficiaries: totalEnrolled,
        totalPreMatricEnrolled: totalPreMatric,
        totalPostMatricEnrolled: totalPostMatric,
        totalHigherEduEnrolled: totalHigherEdu,
        totalPvtgBeneficiaries: totalPvtgEnrolled,
        overallPvtgSaturationRate: parseFloat(pvtgSaturationRate.toFixed(1)),
        averageTransitionDropoffRate: parseFloat(avgTransitionDropoff.toFixed(1)),
        criticalGapDistrictsCount: criticalDistricts.length,
      },
      districts: enrichedDistricts,
      criticalDistricts,
      policyRecommendations: [
        {
          id: 'REC-01',
          priority: 'URGENT',
          title: 'Address 58.6% Class X to XI Transition Cliff in Koraput & Dantewada',
          description: 'Establish automatic roll-over from Pre-Matric to Post-Matric where school certificates are automatically mapped to nearest Higher Secondary / ITI / Polytechnic institutions.',
          targetDistricts: ['Koraput', 'Dantewada', 'West Singhbhum'],
        },
        {
          id: 'REC-02',
          priority: 'HIGH',
          title: 'Special PVTG Saturation Mission for Birhor & Dongria Kondh',
          description: 'Authorize Gram Panchayat Sarpanch and EMRS Principals to issue on-spot temporary bonafide certificates to prevent deadline forfeitures.',
          targetDistricts: ['Mayurbhanj', 'Khunti', 'Koraput'],
        },
        {
          id: 'REC-03',
          priority: 'NORMAL',
          title: 'Lead Bank NPCI APBS Seeding Drives',
          description: 'Coordinate with Lead District Managers (LDMs) of SBI, PNB, and Bank of India to clear 4,200 pending Aadhaar-NPCI mappings before next DBT quarter.',
          targetDistricts: ['West Singhbhum', 'Bastar', 'Jhabua'],
        },
      ],
    };
  }
}

export default CoverageGapEngine;
