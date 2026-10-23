// server/ingestion/sourcesConfig.js
// Master Registry of Official Government & Competitive Exam Sources

export const OFFICIAL_EXAM_SOURCES = [
  // --- 1. TAMIL NADU STATE EXAMS ---
  {
    key: 'tnpsc',
    category: 'tnpsc',
    name: 'Tamil Nadu Public Service Commission (TNPSC)',
    url: 'https://www.tnpsc.gov.in/English/Notification.aspx',
    homepage: 'https://www.tnpsc.gov.in/',
    enabled: true,
    parserType: 'html_table',
    expectedFields: ['notificationNo', 'service', 'openingDate', 'closingDate', 'detailsLink']
  },
  {
    key: 'tnusrb',
    category: 'police_defence',
    name: 'Tamil Nadu Uniformed Services Recruitment Board (TNUSRB)',
    url: 'https://www.tnusrb.tn.gov.in/',
    homepage: 'https://www.tnusrb.tn.gov.in/',
    enabled: true,
    parserType: 'html_links',
    expectedFields: ['service', 'detailsLink']
  },
  {
    key: 'trb_tn',
    category: 'teaching',
    name: 'Teachers Recruitment Board Tamil Nadu (TRB)',
    url: 'https://trb.tn.gov.in/',
    homepage: 'https://trb.tn.gov.in/',
    enabled: true,
    parserType: 'html_links',
    expectedFields: ['service', 'detailsLink']
  },
  {
    key: 'mrb_tn',
    category: 'medical',
    name: 'Medical Services Recruitment Board Tamil Nadu (MRB)',
    url: 'https://www.mrb.tn.gov.in/',
    homepage: 'https://www.mrb.tn.gov.in/',
    enabled: true,
    parserType: 'html_table',
    expectedFields: ['service', 'closingDate', 'detailsLink']
  },

  // --- 2. BANKING & FINANCIAL INSTITUTIONS ---
  {
    key: 'ibps',
    category: 'banking',
    name: 'Institute of Banking Personnel Selection (IBPS)',
    url: 'https://www.ibps.in/',
    homepage: 'https://www.ibps.in/',
    enabled: true,
    parserType: 'html_feed',
    expectedFields: ['service', 'detailsLink']
  },
  {
    key: 'sbi_careers',
    category: 'banking',
    name: 'State Bank of India (SBI Careers)',
    url: 'https://sbi.co.in/web/careers/current-openings',
    homepage: 'https://sbi.co.in/web/careers',
    enabled: true,
    parserType: 'html_cards',
    expectedFields: ['service', 'closingDate', 'detailsLink']
  },
  {
    key: 'rbi_vacancies',
    category: 'banking',
    name: 'Reserve Bank of India (RBI Opportunities)',
    url: 'https://opportunities.rbi.org.in/scripts/vacancies.aspx',
    homepage: 'https://opportunities.rbi.org.in/',
    enabled: true,
    parserType: 'html_table',
    expectedFields: ['service', 'closingDate', 'detailsLink']
  },

  // --- 3. RAILWAY RECRUITMENT ---
  {
    key: 'rrb_central',
    category: 'railway',
    name: 'Railway Recruitment Boards Centralized Portal (RRB Apply)',
    url: 'https://www.rrbapply.gov.in/',
    homepage: 'https://www.rrbapply.gov.in/',
    enabled: true,
    parserType: 'html_table',
    expectedFields: ['notificationNo', 'service', 'detailsLink']
  },

  // --- 4. CENTRAL GOVERNMENT & UPSC ---
  {
    key: 'upsc_active',
    category: 'upsc',
    name: 'Union Public Service Commission (UPSC Active Exams)',
    url: 'https://upsc.gov.in/examinations/active-exams',
    homepage: 'https://upsc.gov.in/',
    enabled: true,
    parserType: 'html_table',
    expectedFields: ['service', 'openingDate', 'closingDate', 'detailsLink']
  },
  {
    key: 'ssc_notices',
    category: 'ssc',
    name: 'Staff Selection Commission (SSC Central Portal)',
    url: 'https://ssc.gov.in/',
    homepage: 'https://ssc.gov.in/',
    enabled: true,
    parserType: 'html_links',
    expectedFields: ['service', 'detailsLink']
  },
  {
    key: 'india_post_gds',
    category: 'psu',
    name: 'India Post (Gramin Dak Sevak / GDS Online)',
    url: 'https://indiapostgdsonline.gov.in/',
    homepage: 'https://indiapostgdsonline.gov.in/',
    enabled: true,
    parserType: 'html_links',
    expectedFields: ['service', 'detailsLink']
  },

  // --- 5. DEFENCE & UNIFORMED ---
  {
    key: 'indian_army',
    category: 'police_defence',
    name: 'Join Indian Army (Govt of India)',
    url: 'https://joinindianarmy.nic.in/',
    homepage: 'https://joinindianarmy.nic.in/',
    enabled: true,
    parserType: 'html_links',
    expectedFields: ['service', 'detailsLink']
  },
  {
    key: 'indian_navy',
    category: 'police_defence',
    name: 'Join Indian Navy (Nausena Bharti)',
    url: 'https://www.joinindiannavy.gov.in/',
    homepage: 'https://www.joinindiannavy.gov.in/',
    enabled: true,
    parserType: 'html_links',
    expectedFields: ['service', 'detailsLink']
  },
  {
    key: 'indian_airforce',
    category: 'police_defence',
    name: 'Indian Air Force (Agnipath Vayu)',
    url: 'https://agnipathvayu.cdac.in/',
    homepage: 'https://agnipathvayu.cdac.in/',
    enabled: true,
    parserType: 'html_links',
    expectedFields: ['service', 'detailsLink']
  },

  // --- 6. TEACHING & ELIGIBILITY ---
  {
    key: 'ctet_cbse',
    category: 'teaching',
    name: 'Central Teacher Eligibility Test (CTET / CBSE)',
    url: 'https://ctet.nic.in/',
    homepage: 'https://ctet.nic.in/',
    enabled: true,
    parserType: 'html_links',
    expectedFields: ['service', 'detailsLink']
  },
  {
    key: 'kvs_delhi',
    category: 'teaching',
    name: 'Kendriya Vidyalaya Sangathan (KVS)',
    url: 'https://kvsangathan.nic.in/employment-notice',
    homepage: 'https://kvsangathan.nic.in/',
    enabled: true,
    parserType: 'html_table',
    expectedFields: ['service', 'detailsLink']
  }
];

export const INGESTION_CONFIG = {
  requestTimeoutMs: 12000,
  maxConcurrentRequests: 2,
  rateLimitDelayMs: 2000,
  maxRecordsPerSource: 8,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 AkEsevai-Notification-Engine/2.0'
};
