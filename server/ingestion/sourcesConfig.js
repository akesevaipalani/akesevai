// server/ingestion/sourcesConfig.js
// Master Registry of Official Government, Competitive Exam, Insurance & PSU Sources

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
    url: 'https://tnusrb.tn.gov.in/',
    homepage: 'https://tnusrb.tn.gov.in/',
    enabled: true,
    parserType: 'html_links',
    expectedFields: ['service', 'detailsLink']
  },
  {
    key: 'trb_tn',
    category: 'teaching',
    name: 'Teachers Recruitment Board Tamil Nadu (TRB)',
    url: 'https://trb.tn.gov.in/notification.php?language=LG-1&status=Active',
    homepage: 'https://trb.tn.gov.in/',
    enabled: true,
    parserType: 'html_table',
    expectedFields: ['notificationNo', 'service', 'openingDate', 'closingDate', 'examDate', 'detailsLink']
  },
  {
    key: 'mrb_tn',
    category: 'medical',
    name: 'Medical Services Recruitment Board Tamil Nadu (MRB)',
    url: 'https://www.mrb.tn.gov.in/content.php?menu_id=MTkw&dept_id=ODAw&lang=MQ==',
    homepage: 'https://www.mrb.tn.gov.in/',
    enabled: true,
    parserType: 'html_table',
    expectedFields: ['notificationNo', 'service', 'detailsLink']
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
    key: 'rrb_chennai',
    category: 'railway',
    name: 'Railway Recruitment Board Chennai (Indian Railways / CEN)',
    url: 'https://rrbchennai.gov.in/',
    homepage: 'https://rrbchennai.gov.in/',
    enabled: true,
    parserType: 'html_table',
    expectedFields: ['notificationNo', 'service', 'detailsLink']
  },

  // --- 4. CENTRAL GOVERNMENT & UPSC / SSC ---
  {
    key: 'upsc_active',
    category: 'upsc',
    name: 'Union Public Service Commission (UPSC Active Exams)',
    url: 'https://upsc.gov.in/examinations/active-exams',
    homepage: 'https://upsc.gov.in/',
    enabled: true,
    parserType: 'views_rows',
    expectedFields: ['service', 'openingDate', 'closingDate', 'detailsLink']
  },
  {
    key: 'ssc_notices',
    category: 'ssc',
    name: 'Staff Selection Commission (SSC Official Portal API)',
    url: 'https://ssc.gov.in/api/general-website/portal/notice-boards?contentType=notice-boards&key=createdAt&order=DESC&isAttachment=true&language=english&attributes=id,headline,examId,contentType,redirectUrl,startDate,endDate,language,createdAt',
    homepage: 'https://ssc.gov.in/',
    enabled: true,
    parserType: 'rest_api_json',
    expectedFields: ['service', 'detailsLink', 'publishedDate']
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
    expectedFields: ['service', 'detailsLink'],
    requiresCaptcha: true
  },
  {
    key: 'indian_navy',
    category: 'police_defence',
    name: 'Join Indian Navy (Nausena Bharti / Current Events)',
    url: 'https://www.joinindiannavy.gov.in/en/page/current-events.html',
    homepage: 'https://www.joinindiannavy.gov.in/',
    enabled: true,
    parserType: 'html_events',
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
    name: 'Kendriya Vidyalaya Sangathan (KVS Interview & Recruitment)',
    url: 'https://kvs.gov.in/interview-notice/',
    homepage: 'https://kvs.gov.in/',
    enabled: true,
    parserType: 'html_table',
    expectedFields: ['notificationNo', 'service', 'publishedDate', 'detailsLink']
  },

  // --- 7. INSURANCE CORPORATIONS ---
  {
    key: 'lic_careers',
    category: 'banking',
    name: 'Life Insurance Corporation of India (LIC Careers)',
    url: 'https://licindia.in/web/guest/careers',
    homepage: 'https://licindia.in/',
    enabled: true,
    parserType: 'html_links',
    expectedFields: ['service', 'detailsLink']
  },
  {
    key: 'niacl_careers',
    category: 'banking',
    name: 'New India Assurance Co. Ltd. (NIACL Recruitment)',
    url: 'https://www.newindia.co.in/recruitment/list',
    homepage: 'https://www.newindia.co.in/',
    enabled: true,
    parserType: 'html_links',
    expectedFields: ['service', 'detailsLink']
  },

  // --- 8. PUBLIC SECTOR UNDERTAKINGS (PSU) ---
  {
    key: 'bel_psu',
    category: 'psu',
    name: 'Bharat Electronics Limited (BEL Job Notifications)',
    url: 'https://bel-india.in/job-notifications/',
    homepage: 'https://bel-india.in/',
    enabled: true,
    parserType: 'html_links',
    expectedFields: ['service', 'detailsLink']
  },
  {
    key: 'bhel_psu',
    category: 'psu',
    name: 'Bharat Heavy Electricals Limited (BHEL Current Openings)',
    url: 'https://careers.bhel.in/index.jsp',
    homepage: 'https://careers.bhel.in/',
    enabled: true,
    parserType: 'html_links',
    expectedFields: ['service', 'detailsLink']
  }
];

export const INGESTION_CONFIG = {
  requestTimeoutMs: 15000,
  maxConcurrentRequests: 2,
  rateLimitDelayMs: 1500,
  maxRecordsPerSource: 10,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 AkEsevai-Notification-Engine/2.0'
};
