/**
 * AK E-SEVAI — MASTER GOVERNMENT SERVICE CATALOG & REQUIRED DOCUMENTS REGISTRY
 *
 * Official Source References:
 * - Tamil Nadu Information Technology & Digital Services Department (it.tn.gov.in)
 * - Tamil Nadu e-Governance Agency - TNeGA / e-Sevai (tnesevai.tn.gov.in / edistricts.tn.gov.in)
 * - Revenue & Disaster Management Department (tn.gov.in/revenue)
 * - Civil Supplies and Consumer Protection Department - TNPDS (tnpds.gov.in)
 * - TANGEDCO / TNPDCL Consumer Services (tnebnet.org / tangedco.org)
 * - Registration Department - TNREGINET (tnreginet.gov.in)
 * - Transport Department - Sarathi / Parivahan (parivahan.gov.in)
 * - Social Welfare and Women Rights Department (tn.gov.in/socialwelfare)
 * - Tamil Nadu Police CCTNS (eservices.tnpolice.gov.in)
 * - Directorate of Municipal Administration (tnurbanepay.tn.gov.in)
 * - Tamil Nadu Unorganised Workers Welfare Board (tnuwwb.tn.gov.in)
 *
 * Note: AK E-SEVAI is an independent citizen assistance & digital facilitation centre.
 * Official government fees are collected as per actual department norms.
 */

export const SERVICE_CATEGORIES = [
  { id: 'all', nameEn: 'All Services', nameTa: 'அனைத்து சேவைகள்', icon: '🏛️' },
  { id: 'revenue_certificates', nameEn: 'Revenue – Certificates', nameTa: 'வருவாய்த்துறை – சான்றிதழ்கள்', icon: '📜' },
  { id: 'revenue_social_security', nameEn: 'Revenue – Social Security Pensions', nameTa: 'வருவாய்த்துறை – சமூக பாதுகாப்பு ஓய்வூதியம்', icon: '👵' },
  { id: 'revenue_land_nilam', nameEn: 'Revenue – Land & Tamil Nilam', nameTa: 'வருவாய்த்துறை – நிலம் & பட்டா', icon: '🗺️' },
  { id: 'civil_supplies_pds', nameEn: 'Civil Supplies – Smart Ration Card', nameTa: 'உணவுப்பொருள் – ஸ்மார்ட் குடும்ப அட்டை', icon: '🌾' },
  { id: 'tangedco_electricity', nameEn: 'TANGEDCO / Electricity Services', nameTa: 'மின்சார வாரிய சேவைகள் (TANGEDCO)', icon: '⚡' },
  { id: 'transport_rto', nameEn: 'Transport & Driving Licence (RTO)', nameTa: 'போக்குவரத்து & ஓட்டுநர் உரிமம்', icon: '🚗' },
  { id: 'registration_tnreginet', nameEn: 'Registration Department (TNREGINET)', nameTa: 'பதிவுத்துறை சேவைகள்', icon: '📑' },
  { id: 'social_welfare_women', nameEn: 'Social Welfare & Women Schemes', nameTa: 'சமூக நலம் & மகளிர் திட்டங்கள்', icon: '🌸' },
  { id: 'differently_abled', nameEn: 'Differently Abled Welfare', nameTa: 'மாற்றுத்திறனாளிகள் நலன்', icon: '♿' },
  { id: 'municipality_corporation', nameEn: 'Municipality & Local Body', nameTa: 'நகராட்சி & உள்ளாட்சி சேவைகள்', icon: '🏢' },
  { id: 'police_cctns', nameEn: 'Police Services (CCTNS)', nameTa: 'காவல்துறை சேவைகள்', icon: '👮' },
  { id: 'employment_training', nameEn: 'Employment & Skill Training', nameTa: 'வேலைவாய்ப்பு & பயிற்சி', icon: '💼' },
  { id: 'education_admissions', nameEn: 'Education & Admissions (TNEA/Exams)', nameTa: 'கல்வி & கல்லூரி சேர்க்கை', icon: '🎓' },
  { id: 'unorganised_welfare_board', nameEn: 'Unorganised Workers Welfare Boards', nameTa: 'தொழிலாளர் நல வாரியங்கள்', icon: '👷' },
  { id: 'fisheries_welfare', nameEn: 'Fisheries Department', nameTa: 'மீன்வளத்துறை சேவைகள்', icon: '🐟' },
  { id: 'fire_rescue_noc', nameEn: 'Fire & Rescue Services', nameTa: 'தீயணைப்புத்துறை (NOC)', icon: '🚒' },
  { id: 'drug_control', nameEn: 'Drug Control Administration', nameTa: 'மருந்து கட்டுப்பாட்டுத்துறை', icon: '💊' },
  { id: 'electrical_inspectorate', nameEn: 'Electrical Inspectorate', nameTa: 'மின் ஆய்வுத்துறை', icon: '🔌' },
  { id: 'waqf_board', nameEn: 'Tamil Nadu Waqf Board', nameTa: 'தமிழ்நாடு வக்ஃபு வாரியம்', icon: '🕌' },
  { id: 'identity_national', nameEn: 'Identity & National Citizen Services', nameTa: 'அடையாள & மத்திய அரசு சேவைகள்', icon: '🪪' },
];

export const GOVERNMENT_SERVICES = [
  // =========================================================================
  // 1. REVENUE DEPARTMENT – CERTIFICATE SERVICES (வருவாய்த்துறை சான்றிதழ்கள்)
  // =========================================================================
  {
    id: 'REV-101',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'Community Certificate',
    nameTa: 'சாதிச் சான்றிதழ்',
    descriptionEn: 'Official government certificate establishing the community/caste category (BC / MBC / DNC / SC / ST) of the applicant for education, scholarships, reservations and employment.',
    descriptionTa: 'கல்வி, இடஒதுக்கீடு, அரசு வேலைவாய்ப்பு மற்றும் உதவித்தொகைகளுக்காக விண்ணப்பதாரரின் சாதிப் பிரிவை (BC/MBC/SC/ST) உறுதிப்படுத்தும் அதிகாரப்பூர்வ வருவாய்த்துறைச் சான்றிதழ்.',
    eligibilityEn: 'Any resident citizen of Tamil Nadu belonging to eligible community categories.',
    eligibilityTa: 'தமிழ்நாட்டில் வசிக்கும் தகுதியுடைய சமூகப் பிரிவைச் சேர்ந்த அனைத்து குடிமக்களும்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Family Card / Smart Ration Card',
      'Applicant School Transfer Certificate (TC) / Mark Sheet (showing caste)',
      'Parent or Sibling Community Certificate',
      'Applicant Passport Size Photo',
      'Self-Declaration Form'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'பள்ளி மாற்றுச் சான்றிதழ் (TC) / மதிப்பெண் சான்றிதழ் (சாதி குறிப்பிடப்பட்டது)',
      'பெற்றோர் அல்லது உடன் பிறந்தோரின் சாதிச் சான்றிதழ்',
      'பாஸ்போர்ட் அளவு புகைப்படம்',
      'சுய அறிவிப்புப் படிவம் (Self-Declaration Form)'
    ],
    optionalDocuments: ['Parent TC Copy', 'Address Proof (EB bill)'],
    notesEn: 'Permanent validity. Issued with digital signature and QR verification.',
    notesTa: 'ஆயுள் முழுவதும் செல்லுபடியாகும் நிரந்தர சான்றிதழ். QR குறியீடு மற்றும் டிஜிட்டல் கையொப்பத்துடன் வழங்கப்படுகிறது.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-102',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'Nativity Certificate',
    nameTa: 'பிறப்பிடச் சான்றிதழ்',
    descriptionEn: 'Certifies that the applicant is a native born resident of Tamil Nadu, essential for state admissions (TNEA/TNGASA) and state government job reservations.',
    descriptionTa: 'விண்ணப்பதாரர் தமிழ்நாட்டைப் பூர்வீகமாகக் கொண்டவர் என்பதை உறுதிப்படுத்தும் சான்றிதழ். கல்லூரி சேர்க்கை மற்றும் அரசு பணிகளுக்கு மிக அவசியம்.',
    eligibilityEn: 'Individuals born and continuously brought up/educated in Tamil Nadu or whose parents are natives.',
    eligibilityTa: 'தமிழ்நாட்டில் பிறந்து தொடர்ந்து வசிக்கும் அல்லது பெற்றோர் பூர்வீகமாகக் கொண்ட நபர்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Family Card / Smart Ration Card',
      'Birth Certificate of Applicant / School TC (showing birthplace)',
      'Parent Nativity Certificate / School TC / Aadhaar',
      'Current Address Proof (EB Bill / Property Tax Receipt)',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'பிறப்புச் சான்றிதழ் அல்லது பள்ளி மாற்றுச் சான்றிதழ் (TC)',
      'பெற்றோரின் பிறப்பிடச் சான்று / TC / ஆதார்',
      'முகவரிச் சான்று (மின் கட்டண ரசீது / சொத்துவரி ரசீது)',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Passport Copy', 'Voter ID'],
    notesEn: 'Permanent certificate for natives. Essential for NEET / TNEA engineering counseling.',
    notesTa: 'நீட் மற்றும் பொறியியல் கல்லூரி சேர்க்கை கலந்தாய்விற்கு கட்டாயமானது.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-103',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'Income Certificate',
    nameTa: 'வருமானச் சான்றிதழ்',
    descriptionEn: 'Certifies total annual family income from all sources. Essential for fee concessions, scholarship applications, RTE admissions and welfare schemes.',
    descriptionTa: 'குடும்பத்தின் அனைத்து வழிகளிலிருந்தும் கிடைக்கும் மொத்த ஆண்டு வருமானத்தை உறுதிப்படுத்தும் சான்றிதழ். கல்வி உதவித்தொகை, சலுகைகளுக்கு அவசியம்.',
    eligibilityEn: 'Any resident citizen residing within the taluk / village jurisdiction.',
    eligibilityTa: 'அந்தந்த வட்டார/கிராம எல்லைக்குள் வசிக்கும் அனைத்து தமிழ்நாட்டுக் குடிமக்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Family Card / Smart Ration Card',
      'Salary Slip / Income Proof / Employer Certificate (or Income Declaration)',
      'Applicant Passport Size Photo',
      'Self-Declaration Form'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'மாத சம்பளச் சீட்டு / வருமான ஆதாரச் சான்று / சுய வருமான உறுதிமொழி',
      'பாஸ்போர்ட் அளவு புகைப்படம்',
      'சுய அறிவிப்புப் படிவம் (Self-Declaration Form)'
    ],
    optionalDocuments: ['Bank Passbook (6 months)', 'Agricultural Land Tax Receipt (if farmer)'],
    notesEn: 'Valid for 1 year from the date of issue by the Tahsildar.',
    notesTa: 'வட்டாட்சியர் வழங்கிய நாளிலிருந்து 1 வருடம் வரை மட்டுமே செல்லுபடியாகும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-104',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'Residence Certificate',
    nameTa: 'இருப்பிடச் சான்றிதழ்',
    descriptionEn: 'Verifies current residential proof of the citizen in a specific village/town/taluk for legal, employment, passport and business registrations.',
    descriptionTa: 'குறிப்பிட்ட முகவரியில் வசித்து வருவதை உறுதிப்படுத்தும் இருப்பிடச் சான்றிதழ். வேலைவாய்ப்பு, கடன் விண்ணப்பங்களுக்குத் தேவைப்படுகிறது.',
    eligibilityEn: 'Any citizen currently residing in the specified locality.',
    eligibilityTa: 'குறிப்பிட்ட கிராமம்/நகரத்தில் தற்போது வசித்து வரும் குடிமக்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Family Card / Smart Ration Card',
      'Current Address Proof (EB Bill / Gas Book / Property Tax)',
      'Rental Agreement (if residing in rented house)',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'தற்போதைய முகவரி ஆதாரம் (மின் கட்டணம் / கேஸ் ரசீது / சொத்துவரி)',
      'வாடகை ஒப்பந்தப் பத்திரம் (வாடகை வீட்டில் வசிப்பவராயின்)',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Voter ID Card', 'Bank Passbook'],
    notesEn: 'Valid for 1 year or until address modification.',
    notesTa: 'முகவரி மாற்றும் வரை அல்லது 1 ஆண்டு வரை செல்லுபடியாகும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-105',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'First Graduate Certificate',
    nameTa: 'முதல் பட்டதாரி சான்றிதழ்',
    descriptionEn: 'Certifies that no person in the applicant’s family has graduated before, granting state government tuition fee waivers in professional engineering/medical colleges.',
    descriptionTa: 'குடும்பத்தில் முதல்முறையாக பட்டப்படிப்பு பயிலும் மாணவர்களுக்கு தொழிற்கல்வி கல்விக் கட்டணச் சலுகை வழங்கும் அரசு சான்றிதழ்.',
    eligibilityEn: 'Candidates whose parents and siblings have not completed any degree/graduation.',
    eligibilityTa: 'பெற்றோர் மற்றும் உடன்பிறந்தவர்கள் எவரும் பட்டப்படிப்பு முடிக்காத குடும்பத்து மாணவர்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Family Card / Smart Ration Card',
      'Applicant 10th / 12th Mark Sheet & Transfer Certificate',
      'Father & Mother Educational Proof / TC / Non-Graduate Declaration',
      'Siblings Educational Proof / TC',
      'Joint Self-Declaration signed by Parent & Student',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'மாணவரின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      '10, 12-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ் & பள்ளி மாற்றுச் சான்றிதழ் (TC)',
      'தந்தை மற்றும் தாயின் கல்விச் சான்று / TC / படிக்கவில்லை என்பதற்கான உறுதிமொழி',
      'உடன்பிறந்தோரின் பள்ளி / கல்லூரி மாற்றுச் சான்றிதழ் (TC)',
      'பெற்றோர் மற்றும் மாணவர் கையொப்பமிட்ட கூட்டு உறுதிமொழிப் படிவம்',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Grandparents Non-Graduate Declaration (if required by VAO)'],
    notesEn: 'Avail fee waiver during TNEA / Paramedical counseling.',
    notesTa: 'பொறியியல் மற்றும் மருத்துவக் கலந்தாய்வில் முழுக் கல்விக் கட்டணச் சலுகை பெற உதவுகிறது.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-106',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'Legal Heir Certificate',
    nameTa: 'வாரிசுச் சான்றிதழ்',
    descriptionEn: 'Identifies the legal heirs of a deceased person for settlement of claims, property transfer, pension transfer, and bank deposits.',
    descriptionTa: 'மறைந்த நபரின் சட்டப்பூர்வ வாரிசுகளை உறுதிப்படுத்தும் சான்றிதழ். சொத்து மாற்றம், வங்கி பணப்பரிமாற்றம், குடும்ப ஓய்வூதியத்திற்கு அவசியம்.',
    eligibilityEn: 'Spouse, children, parents or legal dependents of the deceased person.',
    eligibilityTa: 'மறைந்த நபரின் மனைவி/கணவர், பிள்ளைகள் அல்லது பெற்றோர்.',
    requiredDocuments: [
      'Death Certificate of the Deceased Person',
      'Deceased Person Aadhaar Card / ID Proof',
      'Family Card / Smart Card of the Deceased Family',
      'Aadhaar Cards of All Legal Heirs',
      'Applicant Passport Size Photo',
      'Legal Heir Self-Declaration & Relationship Proof'
    ],
    requiredDocumentsTa: [
      'மறைந்த நபரின் அதிகாரப்பூர்வ இறப்புச் சான்றிதழ்',
      'மறைந்த நபரின் ஆதார் அட்டை / அடையாள அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'அனைத்து நேரடி வாரிசுகளின் ஆதார் அட்டைகள்',
      'விண்ணப்பதாரரின் பாஸ்போர்ட் அளவு புகைப்படம்',
      'வாரிசு உரிமை உறுதிமொழிப் படிவம் & உறவுமுறை ஆவணம்'
    ],
    optionalDocuments: ['Marriage Certificate', 'Legal Guardianship Order (if minors involved)'],
    notesEn: 'Direct legal heirs can apply online through e-Sevai. In disputed cases, civil court decree is required.',
    notesTa: 'நேரடி வாரிசுகள் இ-சேவை மூலம் விண்ணப்பிக்கலாம். தகராறு உள்ள வழக்குகளில் நீதிமன்றத்தை அணுக வேண்டும்.',
    variableRequirements: true,
    variableRequirementsNoteTa: 'வாரிசுகளின் எண்ணிக்கை மற்றும் உறவுமுறைக்கு ஏற்ப கூடுதல் ஆவணங்கள் தேவைப்படலாம்.',
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-107',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'OBC Certificate (Other Backward Class)',
    nameTa: 'மத்திய அரசு OBC சான்றிதழ்',
    descriptionEn: 'Central Government OBC non-creamy layer certificate for central government jobs (UPSC, SSC, Railway, Banking) and central university admissions (IIT, NIT, AIIMS).',
    descriptionTa: 'மத்திய அரசு வேலைவாய்ப்புகள் மற்றும் மத்திய உயர்கல்வி நிறுவனங்களில் 27% OBC இடஒதுக்கீடு பெற வழங்கப்படும் சான்றிதழ்.',
    eligibilityEn: 'Citizens of castes listed in Central OBC list with family income below Creamy Layer ceiling (Rs. 8 Lakhs).',
    eligibilityTa: 'மத்திய அரசின் OBC பட்டியலில் உள்ள சமூகப் பிரிவினர் மற்றும் ஆண்டு வருமானம் ₹8 லட்சத்திற்குள் உள்ளவர்கள்.',
    requiredDocuments: [
      'State Community Certificate Copy',
      'Applicant Aadhaar Card',
      'Family Card / Smart Ration Card',
      'Income Certificate / IT Return Copy / Form 16',
      'Applicant Passport Size Photo',
      'OBC Non-Creamy Layer Self Declaration'
    ],
    requiredDocumentsTa: [
      'தமிழக அரசின் சாதிச் சான்றிதழ் நகல்',
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'வருமானச் சான்றிதழ் / வருமான வரி படிவம் 16',
      'பாஸ்போர்ட் அளவு புகைப்படம்',
      'OBC Non-Creamy Layer உறுதிமொழிப் படிவம்'
    ],
    optionalDocuments: ['Father / Mother Payslip / Pension Proof'],
    notesEn: 'Valid for 1 Financial Year. Crucial for central recruitment exams.',
    notesTa: 'ஒரு நிதியாண்டுக்கு மட்டும் செல்லுபடியாகும். மத்திய அரசு தேர்வுகளுக்கு கட்டாயமானது.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-108',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'Destitute Widow Certificate',
    nameTa: 'ஆதரவற்ற விதவை சான்றிதழ்',
    descriptionEn: 'Certificate issued to widows with no independent source of income for government employment age concessions, priority reservations and welfare schemes.',
    descriptionTa: 'வருமானம் மற்றும் வாழ்வாதாரமற்ற விதவைப் பெண்களுக்கு அரசு வேலைவாய்ப்பில் வயது வரம்பு சலுகை மற்றும் முன்னுரிமை பெற உதவும் சான்றிதழ்.',
    eligibilityEn: 'Widows residing in TN whose annual family income is below government prescribed poverty limit.',
    eligibilityTa: 'குடும்ப ஆண்டு வருமானம் வறுமைக் கோட்டிற்குள் உள்ள கணவரை இழந்த பெண்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Husband Death Certificate',
      'Family Card / Smart Ration Card',
      'Income Proof / Certificate',
      'Applicant Passport Size Photo',
      'Self-Declaration of Destitute Status & Non-Remarriage'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'கணவரின் இறப்புச் சான்றிதழ்',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'வருமானச் சான்று / வட்டாட்சியர் வருமான உறுதிமொழி',
      'பாஸ்போர்ட் அளவு புகைப்படம்',
      'மறுமணம் செய்யவில்லை என்பதற்கான சுய உறுதிமொழிப் படிவம்'
    ],
    optionalDocuments: ['Legal Heir Certificate', 'Village Administrative Officer (VAO) Inquiry Report'],
    notesEn: 'Issued after field verification by VAO and Revenue Inspector (RI).',
    notesTa: 'கிராம நிர்வாக அலுவலர் மற்றும் வருவாய் ஆய்வாளர் கள ஆய்வுக்குப் பின் வழங்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-109',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'Deserted Woman Certificate',
    nameTa: 'கணவரால் கைவிடப்பட்ட பெண் சான்றிதழ்',
    descriptionEn: 'Certifies that a woman has been separated/deserted by her husband for over 5 years for government job priority and welfare assistance.',
    descriptionTa: 'கணவரால் 5 ஆண்டுகளுக்கு மேல் கைவிடப்பட்ட பெண்களுக்கு அரசு நலத்திட்டங்கள் மற்றும் வேலைவாய்ப்பு முன்னுரிமை பெற வழங்கப்படும் சான்றிதழ்.',
    eligibilityEn: 'Women separated/deserted by spouse without financial maintenance for over 5 years.',
    eligibilityTa: 'கணவரைப் பிரிந்து 5 ஆண்டுகளுக்கு மேலாக பராமரிப்பின்றி வாழும் பெண்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Family Card / Smart Ration Card',
      'Marriage Proof / Photo / Marriage Certificate',
      'Separation Proof / Police Complaint / Court Petition / VAO Certificate',
      'Income Proof',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'திருமண ஆதாரம் / திருமணப் புகைப்படம்',
      'பிரிந்து வாழ்வதற்கான சான்று / காவல் புகார் / VAO சான்றொப்பம்',
      'வருமானச் சான்று',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Panchayat / Community Elders Separation Letter'],
    notesEn: 'Requires local VAO inquiry and resident witness statements.',
    notesTa: 'கிராம நிர்வாக அலுவலர் விசாரணை மற்றும் சாட்சிகள் அறிக்கை அடிப்படையில் வழங்கப்படும்.',
    variableRequirements: true,
    variableRequirementsNoteTa: 'பிரிந்து வாழும் சூழ்நிலைக்கு ஏற்ப கூடுதல் ஆதாரங்கள் தேவைப்படலாம்.',
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-110',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'Small / Marginal Farmer Certificate',
    nameTa: 'சிறு / குறு விவசாயி சான்றிதழ்',
    descriptionEn: 'Certifies landholding size (up to 2.5 acres wetland / 5 acres dryland) for agriculture subsidies, micro-irrigation grants, and farm loan waivers.',
    descriptionTa: 'விவசாய நிலத்தின் பரப்பளவை உறுதிப்படுத்தி அரசு மானியங்கள், நுண்ணீர்ப் பாசன மானியம் மற்றும் கடன் தள்ளுபடி பெற வழங்கப்படும் சான்றிதழ்.',
    eligibilityEn: 'Farmers owning up to 2.5 acres of wetland or up to 5 acres of dryland.',
    eligibilityTa: '2.5 ஏக்கர் நன்செய் அல்லது 5 ஏக்கர் புன்செய் நிலம் வரை வைத்துள்ள விவசாயிகள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Family Card / Smart Ration Card',
      'Patta / Chitta Copy of Agricultural Lands',
      'Adangal Extract from VAO (Current Year Crop Details)',
      'Land Ownership Document / Sale Deed',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'விவசாயியின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'நிலத்திற்கான பட்டா / சிட்டா நகல்',
      'கிராம நிர்வாக அலுவலர் வழங்கிய அடங்கல் நகல்',
      'நிலப் பத்திர நகல் (கிரயப் பத்திரம்)',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['FMB Sketch Copy', 'Kisan Credit Card Copy'],
    notesEn: 'Essential for Agriculture Department subsidy schemes and PM-Kisan verification.',
    notesTa: 'வேளாண்மைத்துறை மானியங்கள் மற்றும் சொட்டுநீர்ப் பாசன உதவிக்கு மிக முக்கியமானது.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-111',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'Inter-caste Marriage Certificate',
    nameTa: 'கலப்புத் திருமணச் சான்றிதழ்',
    descriptionEn: 'Certificate proving marriage between two individuals of different caste/community groups for state financial incentives and government recruitment priority.',
    descriptionTa: 'வெவ்வேறு சமூகப் பிரிவைச் சேர்ந்தவர்கள் திருமணம் செய்துகொண்டதை உறுதிப்படுத்தி அரசு ஊக்கத்தொகை மற்றும் வேலைவாய்ப்பு முன்னுரிமை பெற உதவும் சான்றிதழ்.',
    eligibilityEn: 'Couples where one spouse belongs to SC/ST and another to non-SC/ST, or Forward vs BC/MBC.',
    eligibilityTa: 'கலப்புத் திருமணம் செய்துகொண்ட தம்பதியினர்.',
    requiredDocuments: [
      'Marriage Registration Certificate (from Sub-Registrar Office)',
      'Aadhaar Cards of Husband and Wife',
      'Community Certificates of Both Husband and Wife',
      'Marriage Photo / Invitation Card',
      'Family Card / Smart Card Copy',
      'Joint Passport Size Photo of Couple'
    ],
    requiredDocumentsTa: [
      'பதிவுத்துறை வழங்கிய திருமணப் பதிவுச் சான்றிதழ்',
      'கணவன் மற்றும் மனைவியின் ஆதார் அட்டைகள்',
      'இருவரின் சாதிச் சான்றிதழ்கள் (தனித்தனியாக)',
      'திருமணப் புகைப்படம் / திருமண அழைப்பிதழ்',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'தம்பதியரின் கூட்டு பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Address Proof'],
    notesEn: 'Marriage must be registered under the Tamil Nadu Marriage Registration Act.',
    notesTa: 'சார்பதிவாளர் அலுவலகத்தில் முறையாகப் பதிவு செய்யப்பட்டிருக்க வேண்டும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-112',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'Unemployment Certificate',
    nameTa: 'வேலையின்மைச் சான்றிதழ்',
    descriptionEn: 'Certifies that the candidate has no permanent job or institutional employment for availing government welfare allowances and special concessions.',
    descriptionTa: 'விண்ணப்பதாரர் எந்தவொரு அரசு அல்லது நிரந்தரப் பணியிலும் இல்லை என்பதை உறுதிப்படுத்தும் சான்றிதழ்.',
    eligibilityEn: 'Unemployed youth with minimum educational qualifications.',
    eligibilityTa: 'கல்வி முடித்து வேலையில்லாத இளைஞர்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Family Card / Smart Card',
      'Educational Qualification Mark Sheets & TC',
      'Employment Exchange Registration Card Copy',
      'Applicant Passport Size Photo',
      'Self-Declaration of Unemployment'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'கல்விச் சான்றிதழ்கள் & TC',
      'வேலைவாய்ப்பு அலுவலக பதிவு அட்டை நகல்',
      'பாஸ்போர்ட் அளவு புகைப்படம்',
      'வேலையில்லை என்பதற்கான சுய உறுதிமொழி'
    ],
    optionalDocuments: [],
    notesEn: 'Issued for financial allowance and government training assistance.',
    notesTa: 'வேலையில்லா பட்டதாரி உதவித்தொகை பெற பயன்படுகிறது.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-113',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'Unmarried Certificate',
    nameTa: 'திருமணமாகாதவர் சான்றிதழ்',
    descriptionEn: 'Official certification stating that the applicant is single / unmarried, required for defense recruitment, government jobs, scholarships and foreign employment.',
    descriptionTa: 'விண்ணப்பதாரர் திருமணமாகாதவர் என்பதை உறுதிப்படுத்தும் சான்றிதழ். ராணுவ ஆள்சேர்ப்பு மற்றும் வெளிநாட்டுப் பணிகளுக்குத் தேவைப்படுகிறது.',
    eligibilityEn: 'Any unmarried citizen above 18 years of age.',
    eligibilityTa: '18 வயது பூர்த்தியடைந்த திருமணமாகாத குடிமக்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Family Card / Smart Ration Card (showing applicant as dependent)',
      'School / College Transfer Certificate (TC) or Birth Certificate',
      'Applicant Passport Size Photo',
      'Self-Declaration of Single Status'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'பள்ளி / கல்லூரி மாற்றுச் சான்றிதழ் (TC) அல்லது பிறப்புச் சான்றிதழ்',
      'பாஸ்போர்ட் அளவு புகைப்படம்',
      'திருமணமாகவில்லை என்பதற்கான சுய அறிவிப்புப் படிவம்'
    ],
    optionalDocuments: ['Parent Aadhaar Cards', 'VAO Recommendation'],
    notesEn: 'Issued following VAO inquiry and family card verification.',
    notesTa: 'கிராம நிர்வாக அலுவலர் கள விசாரணை அடிப்படையில் வழங்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-114',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'No Male Child Certificate',
    nameTa: 'ஆண் வாரிசு இல்லை சான்றிதழ்',
    descriptionEn: 'Certifies that the family has only female children with no male heir, required for state special girl child protection schemes and government incentives.',
    descriptionTa: 'குடும்பத்தில் பெண் குழந்தைகள் மட்டுமே உள்ளனர், ஆண் வாரிசு இல்லை என்பதை உறுதிப்படுத்தும் சான்றிதழ் (பெண் குழந்தைகள் பாதுகாப்புத் திட்டத்திற்கு).',
    eligibilityEn: 'Parents having only 1 or 2 female children and no male children.',
    eligibilityTa: 'ஆண் வாரிசு இல்லாமல் பெண் குழந்தைகள் மட்டுமே உள்ள பெற்றோர்.',
    requiredDocuments: [
      'Parents Aadhaar Cards',
      'Family Card / Smart Ration Card',
      'Birth Certificates of All Female Children',
      'Sterilization / Family Planning Certificate (if applicable)',
      'Parents Passport Size Photo',
      'Joint Self-Declaration'
    ],
    requiredDocumentsTa: [
      'பெற்றோரின் ஆதார் அட்டைகள்',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'அனைத்து பெண் குழந்தைகளின் பிறப்புச் சான்றிதழ்கள்',
      'குடும்பக் கட்டுப்பாடு அறுவை சிகிச்சை சான்றிதழ்',
      'பாஸ்போர்ட் அளவு புகைப்படம்',
      'பெற்றோரின் கூட்டு உறுதிமொழிப் படிவம்'
    ],
    optionalDocuments: ['Doctor Sterilization Certificate'],
    notesEn: 'Crucial for Chief Minister Girl Child Protection Scheme registration.',
    notesTa: 'முதலமைச்சரின் பெண் குழந்தைகள் பாதுகாப்புத் திட்டத்தில் பயன்பெற அவசியம்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-115',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'Certificate for Loss of Educational Records',
    nameTa: 'கல்விச் சான்றிதழ் தொலைந்ததற்கான சான்றிதழ்',
    descriptionEn: 'Issued when SSLC / HSC / Degree mark sheets are lost or damaged due to natural calamities or theft, allowing application for duplicate mark sheets.',
    descriptionTa: 'பள்ளி அல்லது கல்லூரி மதிப்பெண் சான்றிதழ்கள் தொலைந்தால், புதிய நகல் பெற வருவாய்த்துறை மற்றும் காவல் துறையால் வழங்கப்படும் சான்றிதழ்.',
    eligibilityEn: 'Students whose original educational certificates were lost or destroyed beyond recovery.',
    eligibilityTa: 'கல்விச் சான்றிதழ்களைத் தவறவிட்ட மாணவர்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Police Non-Traceable Certificate / Lost Document Report (LDR)',
      'Copy of Lost Mark Sheet / Hall Ticket / Register Number details',
      'Family Card / Smart Card',
      'Applicant Passport Size Photo',
      'Self-Declaration regarding loss of certificates'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'காவல்துறை வழங்கிய கண்டுபிடிக்க முடியவில்லை என்ற சான்று (LDR)',
      'தொலைந்த மதிப்பெண் சான்றிதழின் நகல் அல்லது பதிவு எண் விவரம்',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'பாஸ்போர்ட் அளவு புகைப்படம்',
      'சான்றிதழ் தொலைந்துவிட்டது என்பதற்கான சுய உறுதிமொழி'
    ],
    optionalDocuments: ['News Paper Publication Copy (if required)'],
    notesEn: 'Required before submitting application to Directorate of Government Examinations for duplicate certificate.',
    notesTa: 'அரசு தேர்வுகள் இயக்ககத்தில் நகல் மதிப்பெண் சான்றிதழ் பெற இச்சான்றிதழ் கட்டாயம்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REV-116',
    category: 'revenue_certificates',
    department: 'Revenue Department',
    departmentTa: 'வருவாய்த்துறை',
    nameEn: 'Solvency Certificate',
    nameTa: 'சொத்து மதிப்பு / கடன் தீர்க்கும் திறன் சான்றிதழ்',
    descriptionEn: 'Certifies the financial solvency and property net worth of a person, required for government tenders, court sureties, liquor/petrol licenses and foreign studies.',
    descriptionTa: 'அரசு ஒப்பந்தங்கள், நீதிமன்ற ஜாமீன் மற்றும் வெளிநாட்டுக் கல்விக் கடனுக்காக ஒருவரின் சொத்து மதிப்பையும் நிதித் தகுதியையும் சான்றளிக்கும் ஆவணம்.',
    eligibilityEn: 'Property owners seeking official valuation and solvency certification from Tahsildar / Revenue Divisional Officer (RDO).',
    eligibilityTa: 'சொத்து வைத்துள்ள மற்றும் அரசு பணிகளுக்கு பிணை உத்தரவாதம் அளிக்க விரும்பும் நபர்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card & PAN Card',
      'Property Sale Deed / Title Documents',
      'Current Patta / Chitta & FMB Sketch',
      'Encumbrance Certificate (EC) for past 13 to 30 years',
      'Property Valuation Certificate from Registered Engineer / SRO Guideline Value',
      'Property Tax Receipt / Land Revenue Receipt',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை & பான் கார்டு',
      'சொத்துப் பத்திர நகல்கள் (மூலப்பத்திரம் & தாய் பத்திரம்)',
      'தற்போதைய பட்டா / சிட்டா & FMB வரைபடம்',
      'வில்லங்கச் சான்றிதழ் (EC) (13 முதல் 30 ஆண்டுகள் வரை)',
      'அங்கீகரிக்கப்பட்ட பொறியாளரின் சொத்து மதிப்பீட்டுச் சான்று / வழிகாட்டி மதிப்பு',
      'சொத்துவரி ரசீது / நிலத் தீர்வை ரசீது',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Bank Statement', 'Building Approval Plan'],
    notesEn: 'Solvency value determines eligibility for public works tenders and bail guarantees.',
    notesTa: 'சொத்தின் வழிகாட்டி மதிப்பை ஆய்வு செய்து வட்டாட்சியர் அல்லது RDO அவர்களால் வழங்கப்படும்.',
    variableRequirements: true,
    variableRequirementsNoteTa: 'சொத்தின் தன்மை (நிலம்/கட்டிடம்) மற்றும் மதிப்பிற்கு ஏற்ப கூடுதல் ஆவணங்கள் தேவைப்படும்.',
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue Administration (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 2. REVENUE – SOCIAL SECURITY PENSIONS (சமூகப் பாதுகாப்புத் திட்டங்கள் / ஓய்வூதியம்)
  // =========================================================================
  {
    id: 'SSP-201',
    category: 'revenue_social_security',
    department: 'Revenue – Social Security Schemes',
    departmentTa: 'வருவாய்த்துறை – சமூக பாதுகாப்புத் திட்டம்',
    nameEn: 'Indira Gandhi National Old Age Pension (IGNOAPS / OAP)',
    nameTa: 'இந்திரா காந்தி முதியோர் ஓய்வூதியத் திட்டம் (OAP)',
    descriptionEn: 'Monthly pension of ₹1,000 to ₹1,200 provided by the Tamil Nadu Government for senior citizens living below the poverty line with no financial support.',
    descriptionTa: 'வாழ்வாதாரமற்ற 60 வயதுக்கு மேற்பட்ட முதியோர்களுக்கு அரசு வழங்கும் மாதாந்திர உதவித்தொகை திட்டம்.',
    eligibilityEn: 'Senior citizens aged 60 and above living below the poverty line (BPL) with no earning adult son/support.',
    eligibilityTa: '60 வயது பூர்த்தியடைந்த வறுமைக் கோட்டிற்கு கீழ் வாழும் ஆதரவற்ற முதியோர்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Family Card / Smart Ration Card',
      'Age Proof (Voter ID / Birth Proof / Medical Certificate)',
      'Bank Account Passbook (Single Account in Applicant Name)',
      'Destitute / Income Self-Declaration Form',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'வயது சான்று (வாக்காளர் அட்டை / பிறப்புச் சான்று / அரசு மருத்துவர் சான்று)',
      'வங்கி கணக்கு புத்தக நகல் (விண்ணப்பதாரரின் பெயரில் உள்ள தனி கணக்கு)',
      'ஆதரவற்ற நிலை / வருமான உறுதிமொழிப் படிவம்',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Voter ID Card'],
    notesEn: 'Disbursed directly to the beneficiary bank account via Direct Benefit Transfer (DBT) or Postal Savings.',
    notesTa: 'வங்கிக் கணக்கில் மாதா மாதம் நேரடியாக உதவித்தொகை வரவு வைக்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Social Security Scheme (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'SSP-202',
    category: 'revenue_social_security',
    department: 'Revenue – Social Security Schemes',
    departmentTa: 'வருவாய்த்துறை – சமூக பாதுகாப்புத் திட்டம்',
    nameEn: 'Destitute Widow Pension Scheme (DWP)',
    nameTa: 'ஆதரவற்ற விதவை ஓய்வூதியத் திட்டம்',
    descriptionEn: 'Monthly financial assistance to destitute widows of any age who have no independent source of income or financial maintenance.',
    descriptionTa: 'கணவரை இழந்து வருமானமின்றி வாழும் ஆதரவற்ற பெண்களுக்கு அரசு வழங்கும் மாதாந்திர உதவித்தொகை.',
    eligibilityEn: 'Destitute widows residing in Tamil Nadu with family income within poverty limits.',
    eligibilityTa: 'கணவரை இழந்த ஆதரவற்ற பெண்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Husband Death Certificate',
      'Family Card / Smart Ration Card',
      'Bank Account Passbook (Single Account with IFSC)',
      'Self-Declaration of Non-Remarriage and Destitute Status',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'கணவரின் இறப்புச் சான்றிதழ்',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'வங்கி கணக்கு புத்தக நகல் (IFSC குறியீட்டுடன்)',
      'மறுமணம் செய்யவில்லை என்பதற்கான சுய உறுதிமொழிப் படிவம்',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Legal Heir Certificate'],
    notesEn: 'Verified by Village Administrative Officer and Special Tahsildar (SSS).',
    notesTa: 'கிராம நிர்வாக அலுவலர் மற்றும் சமூக பாதுகாப்பு வட்டாட்சியர் ஆய்வுக்குப் பின் அனுமதிக்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Social Security Scheme (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'SSP-203',
    category: 'revenue_social_security',
    department: 'Revenue – Social Security Schemes',
    departmentTa: 'வருவாய்த்துறை – சமூக பாதுகாப்புத் திட்டம்',
    nameEn: 'Differently Abled Pension Scheme (DAP)',
    nameTa: 'மாற்றுத்திறனாளிகள் மாதாந்திர ஓய்வூதியம்',
    descriptionEn: 'Monthly pension of ₹1,500 for persons with 40% and above disability to support their healthcare and livelihood needs.',
    descriptionTa: '40% அல்லது அதற்கு மேற்பட்ட மாற்றுத்திறன் கொண்ட நபர்களுக்கு அரசு வழங்கும் மாதாந்திர நிதி உதவித்தொகை.',
    eligibilityEn: 'Persons with disability percentage of 40% or more as certified by District Medical Board / UDID Card.',
    eligibilityTa: 'மருத்துவ வாரியத்தால் 40% மேல் மாற்றுத்திறன் சான்றளிக்கப்பட்ட நபர்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'National Disability Identity Card (UDID) / Medical Board Certificate',
      'Family Card / Smart Ration Card',
      'Bank Passbook (Single or Joint with Guardian if severe)',
      'Full Length Photo showing disability',
      'Passport Size Photo of Applicant'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'தேசிய மாற்றுத்திறனாளி அடையாள அட்டை (UDID) / மாவட்ட மருத்துவ சான்று',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'வங்கி கணக்கு புத்தக நகல்',
      'மாற்றுத்திறன் தெரியும் முழு உருவப் புகைப்படம்',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Guardian Aadhaar Card (if applicant is mentally challenged/minor)'],
    notesEn: 'Age relaxation applicable; available from childhood with medical certification.',
    notesTa: 'வயது வரம்பு இன்றி அனைத்து வயது மாற்றுத்திறனாளிகளுக்கும் பொருந்தும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Social Security Scheme (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'SSP-204',
    category: 'revenue_social_security',
    department: 'Revenue – Social Security Schemes',
    departmentTa: 'வருவாய்த்துறை – சமூக பாதுகாப்புத் திட்டம்',
    nameEn: 'Destitute / Deserted Wives Pension Scheme (DDWP)',
    nameTa: 'கணவரால் கைவிடப்பட்டோர் ஓய்வூதியம்',
    descriptionEn: 'Monthly financial assistance to women aged 30 years and above who are deserted by their husbands for over 5 years.',
    descriptionTa: 'கணவரால் 5 ஆண்டுகளுக்கு மேல் கைவிடப்பட்டு ஆதரவின்றி வாழும் பெண்களுக்கு வழங்கப்படும் மாதாந்திர ஓய்வூதியம்.',
    eligibilityEn: 'Women aged 30+ deserted by spouse for at least 5 years with no independent source of income.',
    eligibilityTa: '30 வயது பூர்த்தியடைந்து, கணவரைப் பிரிந்து 5 ஆண்டுகளுக்கு மேலாக வாழும் பெண்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Family Card / Smart Card',
      'Separation Proof / Deserted Certificate from Tahsildar / Court Order',
      'Age Proof (Voter ID / Birth Certificate)',
      'Bank Account Passbook Copy',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'கணவரால் கைவிடப்பட்ட சான்று / நீதிமன்ற உத்தரவு / VAO சான்றொப்பம்',
      'வயது சான்று (வாக்காளர் அட்டை / ஆதார்)',
      'வங்கி கணக்கு புத்தக நகல்',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Police Complaint Copy'],
    notesEn: 'Requires continuous residency and proof of abandonment.',
    notesTa: 'கள ஆய்வுக்குப் பின் சமூகப் பாதுகாப்பு வட்டாட்சியரால் ஆணை வழங்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Social Security Scheme (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'SSP-205',
    category: 'revenue_social_security',
    department: 'Revenue – Social Security Schemes',
    departmentTa: 'வருவாய்த்துறை – சமூக பாதுகாப்புத் திட்டம்',
    nameEn: 'Chief Minister Uzhavar Pathukappu Thittam (Farmers Pension)',
    nameTa: 'முதலமைச்சரின் உழவர் பாதுகாப்புத் திட்ட ஓய்வூதியம்',
    descriptionEn: 'Monthly pension and social security scheme for registered agricultural laborers and small marginal farmers aged 60+ in Tamil Nadu.',
    descriptionTa: '60 வயது பூர்த்தியடைந்த பதிவுபெற்ற விவசாயத் தொழிலாளர்கள் மற்றும் சிறு விவசாயிகளுக்கு வழங்கப்படும் மாதாந்திர ஓய்வூதியம்.',
    eligibilityEn: 'Registered members of Tamil Nadu Agricultural Workers Welfare Scheme aged 60 and above.',
    eligibilityTa: 'உழவர் பாதுகாப்பு அட்டை வைத்துள்ள 60 வயது நிரம்பிய விவசாயத் தொழிலாளர்கள்.',
    requiredDocuments: [
      'Uzhavar Pathukappu Scheme Membership Card (Green Card)',
      'Applicant Aadhaar Card',
      'Family Card / Smart Card',
      'Bank Account Passbook',
      'Age Proof (Voter ID / Aadhaar)',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'உழவர் பாதுகாப்பு திட்ட உறுப்பினர் அட்டை (பச்சை அட்டை)',
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'வங்கி கணக்கு புத்தக நகல்',
      'வயது சான்று (வாக்காளர் அட்டை / ஆதார்)',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Land Adangal / VAO Farm Worker Certificate'],
    notesEn: 'Direct pension benefit under Revenue SSS division.',
    notesTa: 'உழவர் பாதுகாப்பு அட்டை உள்ள விவசாயிகள் எளிதாக விண்ணப்பிக்கலாம்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNeGA / Revenue SSS (tnesevai.tn.gov.in)',
    officialPortalUrl: 'https://www.tnesevai.tn.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 3. REVENUE – LAND & TAMIL NILAM SERVICES (நிலம் & தமிழ்நிலம் சேவைகள்)
  // =========================================================================
  {
    id: 'LND-301',
    category: 'revenue_land_nilam',
    department: 'Revenue – Land Administration',
    departmentTa: 'வருவாய்த்துறை – நில நிர்வாகம்',
    nameEn: 'View / Download Patta & Chitta (Rural & Urban)',
    nameTa: 'பட்டா / சிட்டா நகல் பார்வையிட & பதிவிறக்கம்',
    descriptionEn: 'Instant official digital copy of land revenue records showing land ownership, survey number, subdivision, extent, land type and tax assessment.',
    descriptionTa: 'நிலத்தின் உரிமையாளர் பெயர், சர்வே எண், உட்பிரிவு, பரப்பளவு மற்றும் நிலத்தின் வகையைக் காட்டும் அரசு டிஜிட்டல் பட்டா/சிட்டா நகல்.',
    eligibilityEn: 'Any land owner, buyer, financial institution or legal researcher.',
    eligibilityTa: 'நில உரிமையாளர்கள் மற்றும் பொது மக்கள் அனைவரும்.',
    requiredDocuments: [
      'District, Taluk, and Village details',
      'Survey Number & Subdivision Number OR Patta Number',
      'Applicant Mobile Number for OTP download'
    ],
    requiredDocumentsTa: [
      'மாவட்டம், வட்டம், மற்றும் கிராமத்தின் பெயர்',
      'புல எண் (Survey No) & உட்பிரிவு எண் அல்லது பட்டா எண்',
      'பதிவிறக்கம் செய்ய மொபைல் எண்'
    ],
    optionalDocuments: [],
    notesEn: 'Available 24/7 through AnyTime Anywhere e-Services / Tamil Nilam portal with QR authentication.',
    notesTa: 'எப்போது வேண்டுமானாலும் இணையவழியில் QR குறியீட்டுடன் உடனே பதிவிறக்கம் செய்யலாம்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'AnyTime Anywhere e-Services / Tamil Nilam (eservices.tn.gov.in)',
    officialPortalUrl: 'https://eservices.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'LND-302',
    category: 'revenue_land_nilam',
    department: 'Revenue – Land Administration',
    departmentTa: 'வருவாய்த்துறை – நில நிர்வாகம்',
    nameEn: 'Patta Name Transfer Application (Non-Subdivision)',
    nameTa: 'முழு புல பட்டா பெயர் மாற்றம் (உட்பிரிவு இல்லாதது)',
    descriptionEn: 'Application to transfer patta ownership in revenue records when entire survey parcel is purchased without requiring physical sub-division survey.',
    descriptionTa: 'ஒரு சர்வே எண் முழுவதையும் வாங்கிய பின், உட்பிரிவு செய்யாமல் பட்டாவில் பெயர் மாற்றம் செய்ய விண்ணப்பிக்கும் சேவை.',
    eligibilityEn: 'Purchasers or inheritors of complete survey numbers registered at the Sub-Registrar Office.',
    eligibilityTa: 'முழு புல நிலத்தைப் பத்திரப்பதிவு செய்து வாங்கிய உரிமையாளர்கள்.',
    requiredDocuments: [
      'Registered Sale Deed / Settlement Deed / Title Deed Copy',
      'Previous Patta Copy / Chitta of the property',
      'Encumbrance Certificate (EC)',
      'Applicant Aadhaar Card',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'பதிவு செய்யப்பட்ட கிரயப் பத்திரம் / தானப் பத்திரம் / செட்டில்மெண்ட் பத்திரம்',
      'முந்தைய பட்டா நகல் / சிட்டா',
      'வில்லங்கச் சான்றிதழ் (EC)',
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Property Tax Receipt'],
    notesEn: 'Processed by Zonal Deputy Tahsildar (ZDT) within statutory service delivery timeline.',
    notesTa: 'மண்டல துணை வட்டாட்சியர் (ZDT) பரிசீலனைக்குப் பின் ஆணை பிறப்பிக்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Tamil Nilam / TNeGA (eservices.tn.gov.in)',
    officialPortalUrl: 'https://eservices.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'LND-303',
    category: 'revenue_land_nilam',
    department: 'Revenue – Land Administration',
    departmentTa: 'வருவாய்த்துறை – நில நிர்வாகம்',
    nameEn: 'Patta Transfer with Subdivision Survey',
    nameTa: 'உட்பிரிவுடன் கூடிய பட்டா பெயர் மாற்றம்',
    descriptionEn: 'Application for measuring, sub-dividing a portion of land survey number through government surveyor and issuing a new separate patta.',
    descriptionTa: 'ஒரு சர்வே எண்ணில் குறிப்பிட்ட பகுதியை மட்டும் வாங்கிய பின், நில அளவையர் மூலம் அளவீடு செய்து புதிய தனிப்பட்டா பெற விண்ணப்பித்தல்.',
    eligibilityEn: 'Property buyers who purchased a partial plot or land partition from a larger survey number.',
    eligibilityTa: 'ஒரு சர்வே எண்ணில் குறிப்பிட்ட நிலப்பரப்பை மட்டும் வாங்கிய உரிமையாளர்கள்.',
    requiredDocuments: [
      'Registered Sale Deed / Partition Deed / Gift Deed',
      'Parent Title Documents & Previous Patta Copy',
      'Encumbrance Certificate (EC)',
      'Field Sketch / Layout Plan (if plotted land)',
      'Applicant Aadhaar Card & Mobile Number',
      'Government Survey Fee Payment Challan'
    ],
    requiredDocumentsTa: [
      'பதிவு செய்யப்பட்ட கிரயப் பத்திரம் / பாகப்பிரிவினைப் பத்திரம்',
      'தாய் பத்திர நகல்கள் & முந்தைய பட்டா நகல்',
      'வில்லங்கச் சான்றிதழ் (EC)',
      'மனை வரைபடம் / அமைவிட வரைபடம்',
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'அரசு நில அளவைக் கட்டண ரசீது'
    ],
    optionalDocuments: ['Boundary Dispute Settlement NOC'],
    notesEn: 'Involves on-site inspection by Taluk Surveyor and approval by Tahsildar.',
    notesTa: 'வட்ட நில அளவையர் நேரில் அளவீடு செய்து வரைபடம் தயாரித்த பின் புதிய உட்பிரிவு பட்டா வழங்கப்படும்.',
    variableRequirements: true,
    variableRequirementsNoteTa: 'நிலத்தின் எல்லை மற்றும் பங்கீட்டிற்கு ஏற்ப கூடுதல் பத்திர ஆவணங்கள் தேவைப்படும்.',
    serviceType: 'e-Sevai Service',
    officialSource: 'Tamil Nilam / Revenue (eservices.tn.gov.in)',
    officialPortalUrl: 'https://eservices.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'LND-304',
    category: 'revenue_land_nilam',
    department: 'Revenue – Land Administration',
    departmentTa: 'வருவாய்த்துறை – நில நிர்வாகம்',
    nameEn: 'FMB Sketch Download (Field Measurement Book)',
    nameTa: 'FMB நில வரைபடம் பதிவிறக்கம்',
    descriptionEn: 'Extract of Field Measurement Book showing precise boundary measurements, dimensions and sub-division lines of agricultural and residential land.',
    descriptionTa: 'நிலத்தின் துல்லியமான எல்லை அளவுகள் மற்றும் வடிவத்தைக் காட்டும் FMB வரைபட நகல்.',
    eligibilityEn: 'Public citizens, land owners and advocates.',
    eligibilityTa: 'அனைத்து நில உரிமையாளர்கள் மற்றும் பொதுமக்கள்.',
    requiredDocuments: [
      'District, Taluk, and Village details',
      'Survey Number & Subdivision Number'
    ],
    requiredDocumentsTa: [
      'மாவட்டம், வட்டம், கிராம விவரங்கள்',
      'புல எண் (Survey Number) & உட்பிரிவு எண்'
    ],
    optionalDocuments: [],
    notesEn: 'Instant official digital download for digitized villages across Tamil Nadu.',
    notesTa: 'டிஜிட்டல் மயமாக்கப்பட்ட கிராமங்களின் வரைபடங்களை உடனே பதிவிறக்கலாம்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'AnyTime Anywhere e-Services (eservices.tn.gov.in)',
    officialPortalUrl: 'https://eservices.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'LND-305',
    category: 'revenue_land_nilam',
    department: 'Revenue – Land Administration',
    departmentTa: 'வருவாய்த்துறை – நில நிர்வாகம்',
    nameEn: 'TSLR Extract (Town Survey Land Register)',
    nameTa: 'நகர நில அளவைப் பதிவேடு (TSLR நகல்)',
    descriptionEn: 'Official land revenue register extract for urban municipal and corporation areas showing Town Survey Number, Ward, Block, and Owner details.',
    descriptionTa: 'நகராட்சி மற்றும் மாநகராட்சி பகுதிகளில் உள்ள நிலங்களுக்கான TSLR நகர நில அளவைப் பதிவேட்டு நகல்.',
    eligibilityEn: 'Owners of urban properties within Municipal / Corporation limits.',
    eligibilityTa: 'நகர்ப்புற சொத்து வைத்துள்ள உரிமையாளர்கள்.',
    requiredDocuments: [
      'District, Municipality/Town, Ward, and Block details',
      'Town Survey (TS) Number & Sub-division',
      'Applicant Aadhaar Card / ID Proof'
    ],
    requiredDocumentsTa: [
      'மாவட்டம், நகரம்/நகராட்சி, வார்டு, மற்றும் பிளாக் விவரங்கள்',
      'நகர நில அளவை எண் (TS No) & உட்பிரிவு',
      'விண்ணப்பதாரர் அடையாளச் சான்று'
    ],
    optionalDocuments: ['Property Tax Assessment Number'],
    notesEn: 'Essential for urban building plan approval and bank loan processing.',
    notesTa: 'நகர்ப்புற கட்டிட அனுமதி மற்றும் வீட்டுக் கடன்களுக்கு TSLR மிக அவசியம்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Tamil Nilam Urban (eservices.tn.gov.in)',
    officialPortalUrl: 'https://eservices.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'LND-306',
    category: 'revenue_land_nilam',
    department: 'Revenue – Land Administration',
    departmentTa: 'வருவாய்த்துறை – நில நிர்வாகம்',
    nameEn: 'A-Register Extract Download',
    nameTa: 'அ-பதிவேடு (A-Register) நகல்',
    descriptionEn: 'Historical village land ledger extract containing comprehensive land classification, total extent, soil type, irrigation source and assessment per acre.',
    descriptionTa: 'கிராம நிலங்களின் வகைப்பாடு, தரம், பரப்பு மற்றும் தீர்வை விவரங்களை விளக்கும் அ-பதிவேடு நகல்.',
    eligibilityEn: 'Any citizen checking government land classification or private title lineage.',
    eligibilityTa: 'நிலத்தின் வகையினை அறிய விரும்பும் அனைவரும்.',
    requiredDocuments: [
      'District, Taluk, and Village details',
      'Survey Number'
    ],
    requiredDocumentsTa: [
      'மாவட்டம், வட்டம், கிராம விவரங்கள்',
      'புல எண் (Survey Number)'
    ],
    optionalDocuments: [],
    notesEn: 'Determines whether a parcel is Ryotwari, Poramboke, Government Natham, or Temple land.',
    notesTa: 'நிலம் அரசு புறம்போக்கா அல்லது நத்தமா என்பதை அறிய பயன்படுகிறது.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'AnyTime Anywhere e-Services (eservices.tn.gov.in)',
    officialPortalUrl: 'https://eservices.tn.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 4. CIVIL SUPPLIES & PDS – SMART RATION CARD (ஸ்மார்ட் குடும்ப அட்டை)
  // =========================================================================
  {
    id: 'PDS-401',
    category: 'civil_supplies_pds',
    department: 'Civil Supplies & Consumer Protection',
    departmentTa: 'உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை',
    nameEn: 'New Smart Family Card Application',
    nameTa: 'புதிய ஸ்மார்ட் குடும்ப அட்டை விண்ணப்பம்',
    descriptionEn: 'Online application for issuance of a new digitized Smart Family Ration Card for newly married couples or uncarded households in Tamil Nadu.',
    descriptionTa: 'புதிதாக திருமணமான தம்பதியினர் அல்லது புதிய குடும்பத்தினருக்கு புதிய ஸ்மார்ட் ரேஷன் கார்டு பெற விண்ணப்பிக்கும் சேவை.',
    eligibilityEn: 'Newly formed families or residents residing at a separate kitchen/dwelling in Tamil Nadu.',
    eligibilityTa: 'தமிழ்நாட்டில் தனிக்குடித்தனம் இருக்கும் புதிய குடும்பங்கள்.',
    requiredDocuments: [
      'Aadhaar Cards of all family members to be included',
      'Name Deletion Certificate / Slip from parent family card (for married couple)',
      'Current Address Proof (Rental Agreement / EB Bill / Property Tax Receipt / Gas Bill)',
      'Marriage Registration Certificate or Marriage Invitation Photo',
      'Passport size photograph of Head of Family (Female head mandatory where applicable)',
      'LPG Gas Connection Consumer Number & Oil Company Name (if applicable)'
    ],
    requiredDocumentsTa: [
      'குடும்பத்தில் சேர்க்கப்பட வேண்டிய அனைவரின் ஆதார் அட்டைகள்',
      'பெற்றோர் குடும்ப அட்டையிலிருந்து பெயர் நீக்கம் செய்யப்பட்ட சான்றிதழ்',
      'முகவரி ஆதாரம் (வாடகை ஒப்பந்தம் / மின் கட்டணம் / கேஸ் ரசீது / சொத்துவரி)',
      'திருமணப் பதிவுச் சான்றிதழ் அல்லது திருமண அழைப்பிதழ்',
      'குடும்பத் தலைவியின் பாஸ்போர்ட் அளவு புகைப்படம்',
      'கேஸ் சிலிண்டர் இணைப்பு விவரங்கள் மற்றும் நுகர்வோர் எண்'
    ],
    optionalDocuments: ['Birth Certificate (for children under 5 years)'],
    notesEn: 'Field verification by Taluk Supply Officer (TSO). Card delivery at Fair Price Shop / e-Sevai print.',
    notesTa: 'வட்ட வழங்கல் அலுவலர் (TSO) கள ஆய்வுக்குப் பின் ஸ்மார்ட் கார்டு அச்சிடப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Tamil Nadu PDS (tnpds.gov.in)',
    officialPortalUrl: 'https://www.tnpds.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'PDS-402',
    category: 'civil_supplies_pds',
    department: 'Civil Supplies & Consumer Protection',
    departmentTa: 'உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை',
    nameEn: 'Add Family Member in Smart Card',
    nameTa: 'குடும்ப அட்டையில் புதிய உறுப்பினர் சேர்த்தல்',
    descriptionEn: 'Add newborn child, newly wedded spouse, or existing family member into the active Smart Ration Card.',
    descriptionTa: 'பிறந்த குழந்தை அல்லது புதிதாக திருமணம் செய்துகொண்ட நபரின் பெயரை ரேஷன் கார்டில் சேர்க்கும் சேவை.',
    eligibilityEn: 'Existing Smart Card holders in Tamil Nadu.',
    eligibilityTa: 'தற்போது ஸ்மார்ட் கார்டு வைத்துள்ள அனைத்துக் குடும்பங்கள்.',
    requiredDocuments: [
      'Smart Ration Card Copy / Registered Mobile OTP',
      'For Child (Below 5 yrs): Birth Certificate + Aadhaar (if enrolled)',
      'For Adult / Spouse: Name Deletion Certificate from previous card + Aadhaar Card + Marriage Certificate',
      'Applicant Mobile Number linked to TNPDS'
    ],
    requiredDocumentsTa: [
      'ஸ்மார்ட் குடும்ப அட்டை நகல் / TNPDS பதிவுசெய்த மொபைல் எண்',
      'குழந்தைகளுக்கு (5 வயது வரை): பிறப்புச் சான்றிதழ் + ஆதார் அட்டை (இருப்பின்)',
      'பெரியவர்கள் / மருமகள் / மருமகன்: முந்தைய கார்டில் பெயர் நீக்கிய சான்று + ஆதார் அட்டை + திருமணப் பத்திரம்',
      'OTP சரிபார்ப்புக்கான மொபைல்'
    ],
    optionalDocuments: [],
    notesEn: 'Adult members must be deleted from prior card before addition to prevent duplicate Aadhaar mapping.',
    notesTa: 'பெரியவர்களின் பெயரைச் சேர்க்க முந்தைய குடும்ப அட்டையிலிருந்து பெயர் நீக்கப்பட்டிருக்க வேண்டும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Tamil Nadu PDS (tnpds.gov.in)',
    officialPortalUrl: 'https://www.tnpds.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'PDS-403',
    category: 'civil_supplies_pds',
    department: 'Civil Supplies & Consumer Protection',
    departmentTa: 'உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை',
    nameEn: 'Remove / Delete Family Member from Smart Card',
    nameTa: 'குடும்ப அட்டையில் உறுப்பினர் பெயர் நீக்குதல்',
    descriptionEn: 'Delete family member name upon marriage, migration, separate card application, or death, generating official Deletion Certificate.',
    descriptionTa: 'திருமணம், பிரிந்து செல்லுதல் அல்லது இறப்பு காரணமாக குடும்ப அட்டையிலிருந்து பெயர் நீக்கம் செய்து சான்றிதழ் பெறும் சேவை.',
    eligibilityEn: 'Smart Card holders requesting removal of a family member.',
    eligibilityTa: 'ஸ்மார்ட் குடும்ப அட்டைதாரர்கள்.',
    requiredDocuments: [
      'Smart Ration Card Copy / OTP verification',
      'Aadhaar Card of the Member to be deleted',
      'Reason Proof: Marriage Certificate / Death Certificate / Migration Proof',
      'Registered Mobile OTP'
    ],
    requiredDocumentsTa: [
      'ஸ்மார்ட் குடும்ப அட்டை நகல் / மொபைல் OTP',
      'நீக்கப்பட வேண்டிய உறுப்பினரின் ஆதார் அட்டை',
      'காரண ஆதாரம்: திருமணப் பத்திரிக்கை / இறப்புச் சான்றிதழ் / வேறு இடத்திற்கு மாறுதல்',
      'பதிவுசெய்த மொபைல் எண்'
    ],
    optionalDocuments: [],
    notesEn: 'Generates instant downloadable Name Deletion Slip required for new card enrollment.',
    notesTa: 'புதிய குடும்ப அட்டை விண்ணப்பிக்கத் தேவையான பெயர் நீக்கல் சான்றிதழ் உடனடியாகக் கிடைக்கும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Tamil Nadu PDS (tnpds.gov.in)',
    officialPortalUrl: 'https://www.tnpds.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'PDS-404',
    category: 'civil_supplies_pds',
    department: 'Civil Supplies & Consumer Protection',
    departmentTa: 'உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை',
    nameEn: 'Smart Card Address Change',
    nameTa: 'குடும்ப அட்டை முகவரி மாற்றம்',
    descriptionEn: 'Update residential address within the same district or transfer card to a new taluk/district upon relocation.',
    descriptionTa: 'வீடு மாறும் போது குடும்ப அட்டையின் முகவரியை புதிய இடத்திற்கு மாற்றும் சேவை.',
    eligibilityEn: 'Smart Card holders relocated to a new address in Tamil Nadu.',
    eligibilityTa: 'வேறு பகுதிக்கு குடிபெயர்ந்த குடும்ப அட்டைதாரர்கள்.',
    requiredDocuments: [
      'Smart Ration Card Copy / Registered Mobile OTP',
      'New Address Proof (EB Bill / Property Tax / Rental Agreement / Gas Connection Bill)',
      'Aadhaar Card of Head of Family (with updated address if available)'
    ],
    requiredDocumentsTa: [
      'ஸ்மார்ட் குடும்ப அட்டை நகல் / மொபைல் OTP',
      'புதிய முகவரி ஆதாரம் (மின் கட்டணம் / வாடகை ஒப்பந்தம் / சொத்துவரி ரசீது / கேஸ் பில்)',
      'குடும்பத் தலைவரின் ஆதார் அட்டை'
    ],
    optionalDocuments: [],
    notesEn: 'Transfers mapped fair price shop automatically to the nearest PDS outlet in new area.',
    notesTa: 'புதிய பகுதிக்கு அருகில் உள்ள நியாயவிலைக் கடைக்கு குடும்ப அட்டை தானாக மாற்றப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Tamil Nadu PDS (tnpds.gov.in)',
    officialPortalUrl: 'https://www.tnpds.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'PDS-405',
    category: 'civil_supplies_pds',
    department: 'Civil Supplies & Consumer Protection',
    departmentTa: 'உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை',
    nameEn: 'Change Head of Family in Smart Card',
    nameTa: 'குடும்பத் தலைவர் மாற்றம்',
    descriptionEn: 'Change the designated Head of Family in the Smart Card upon demise of previous head or legal family consent.',
    descriptionTa: 'குடும்பத் தலைவர் மறைவு அல்லது குடும்ப முடிவின்படி புதிய குடும்பத் தலைவரை நியமிக்கும் சேவை.',
    eligibilityEn: 'Existing Smart Card holders.',
    eligibilityTa: 'குடும்ப அட்டைதாரர்கள்.',
    requiredDocuments: [
      'Smart Ration Card Copy',
      'Death Certificate of Previous Head of Family (if deceased)',
      'Aadhaar Card of the New Head of Family (Female member preferred as per TN norms)',
      'Passport size photo of New Head of Family',
      'Consent Declaration from remaining adult family members'
    ],
    requiredDocumentsTa: [
      'ஸ்மார்ட் குடும்ப அட்டை நகல்',
      'முந்தைய குடும்பத் தலைவரின் இறப்புச் சான்றிதழ் (இறந்திருந்தால்)',
      'புதிய குடும்பத் தலைவரின் ஆதார் அட்டை (பெண் தலைவருக்கு முன்னுரிமை)',
      'புதிய குடும்பத் தலைவரின் பாஸ்போர்ட் அளவு புகைப்படம்',
      'குடும்ப உறுப்பினர்களின் ஒப்புதல் கடிதம்'
    ],
    optionalDocuments: [],
    notesEn: 'Tamil Nadu government policy promotes adult woman as Head of Family.',
    notesTa: 'தமிழக அரசின் விதிகளின்படி மூத்த பெண்மணிக்கு குடும்பத் தலைவராக முன்னுரிமை அளிக்கப்படுகிறது.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Tamil Nadu PDS (tnpds.gov.in)',
    officialPortalUrl: 'https://www.tnpds.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'PDS-406',
    category: 'civil_supplies_pds',
    department: 'Civil Supplies & Consumer Protection',
    departmentTa: 'உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை',
    nameEn: 'Card Type Modification (Sugar to Rice Card)',
    nameTa: 'அட்டை வகை மாற்றம் (சர்க்கரை அட்டையிலிருந்து அரிசி அட்டைக்கு)',
    descriptionEn: 'Convert Non-Commodity (NC) / Sugar (NPHHS) card into Free Rice entitlement card (PHH / NPHH) to receive subsidized food grains.',
    descriptionTa: 'சர்க்கரை குடும்ப அட்டையை இலவச அரிசி பெறும் குடும்ப அட்டையாக மாற்றுவதற்கான விண்ணப்பம்.',
    eligibilityEn: 'Holders of Sugar / Non-Commodity Smart Cards seeking rice entitlement.',
    eligibilityTa: 'சர்க்கரை அட்டை வைத்துள்ள குடும்பங்கள்.',
    requiredDocuments: [
      'Smart Ration Card Copy',
      'Aadhaar Cards of all family members',
      'Income Declaration / Certificate (confirming eligibility)',
      'Registered Mobile OTP'
    ],
    requiredDocumentsTa: [
      'ஸ்மார்ட் குடும்ப அட்டை நகல்',
      'குடும்ப உறுப்பினர்களின் ஆதார் அட்டைகள்',
      'வருமான உறுதிமொழி / சான்றிதழ்',
      'பதிவுசெய்த மொபைல் OTP'
    ],
    optionalDocuments: [],
    notesEn: 'Approvals enabled during open government windows by Food & Consumer Protection Department.',
    notesTa: 'அரசு அனுமதிக்கும் காலங்களில் வட்ட வழங்கல் அலுவலரால் பரிசீலிக்கப்பட்டு மாற்றப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Tamil Nadu PDS (tnpds.gov.in)',
    officialPortalUrl: 'https://www.tnpds.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'PDS-407',
    category: 'civil_supplies_pds',
    department: 'Civil Supplies & Consumer Protection',
    departmentTa: 'உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை',
    nameEn: 'LPG Gas Cylinder Count Modification',
    nameTa: 'கேஸ் சிலிண்டர் எண்ணிக்கை மாற்றம்',
    descriptionEn: 'Update active LPG cylinder count (0, 1, or 2 cylinders) mapped to the smart card to adjust monthly kerosene entitlement.',
    descriptionTa: 'குடும்பத்தில் பயன்படுத்தும் கேஸ் சிலிண்டர் எண்ணிக்கையை பதிவு செய்தல் / திருத்துதல்.',
    eligibilityEn: 'Smart Card holders who bought or surrendered LPG connections.',
    eligibilityTa: 'கேஸ் இணைப்பு பெற்ற அல்லது மாற்றிய குடும்பங்கள்.',
    requiredDocuments: [
      'Smart Ration Card Copy',
      'Gas Connection Consumer Book / Voucher (SV) showing cylinder count',
      'Aadhaar Card of the Gas Connection Holder',
      'Registered Mobile OTP'
    ],
    requiredDocumentsTa: [
      'ஸ்மார்ட் குடும்ப அட்டை நகல்',
      'கேஸ் பாஸ்புக் / சந்தாதாரர் ரசீது (SV Copy)',
      'கேஸ் இணைப்பு வைத்துள்ளவரின் ஆதார் அட்டை',
      'பதிவுசெய்த மொபைல் OTP'
    ],
    optionalDocuments: [],
    notesEn: 'Affects monthly PDS kerosene allotment based on 0, 1 or 2 cylinder status.',
    notesTa: 'கேஸ் சிலிண்டர் எண்ணிக்கைக்கு ஏற்ப மண்ணெண்ணெய் அளவு நிர்ணயிக்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Tamil Nadu PDS (tnpds.gov.in)',
    officialPortalUrl: 'https://www.tnpds.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'PDS-408',
    category: 'civil_supplies_pds',
    department: 'Civil Supplies & Consumer Protection',
    departmentTa: 'உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை',
    nameEn: 'Duplicate Smart Card Reprint & Plastic Card Print',
    nameTa: 'நகல் ஸ்மார்ட் கார்டு அச்சிடுதல்',
    descriptionEn: 'Re-issue physical PVC plastic Smart Ration Card with QR code and biometric barcode upon loss, damage or theft.',
    descriptionTa: 'ரேஷன் கார்டு தொலைந்துவிட்டால் அல்லது சேதமடைந்தால் புதிய PVC பிளாஸ்டிக் ஸ்மார்ட் கார்டு அச்சிட்டு வழங்கும் சேவை.',
    eligibilityEn: 'Active Smart Card holders whose physical card is lost or damaged.',
    eligibilityTa: 'ஸ்மார்ட் கார்டு தொலைந்த அல்லது சேதமடைந்த குடும்பங்கள்.',
    requiredDocuments: [
      'Ration Card Number / Registered Mobile Number for OTP',
      'Aadhaar Card of Head of Family'
    ],
    requiredDocumentsTa: [
      'ரேஷன் கார்டு எண் / பதிவுசெய்த மொபைல் எண் (OTP சரிபார்ப்புக்கு)',
      'குடும்பத் தலைவரின் ஆதார் அட்டை'
    ],
    optionalDocuments: ['Police LDR report (if lost)'],
    notesEn: 'Official government plastic card printed instantly with high security QR barcode.',
    notesTa: 'பாதுகாப்பான QR பார்கோடுடன் கூடிய பிளாஸ்டிக் ஸ்மார்ட் கார்டு அச்சிடப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Tamil Nadu PDS / TNeGA (tnpds.gov.in)',
    officialPortalUrl: 'https://www.tnpds.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 5. TANGEDCO / TNPDCL ELECTRICITY SERVICES (மின்சார வாரிய சேவைகள் - 18 SERVICES)
  // =========================================================================
  {
    id: 'TNEB-501',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'Electricity Bill Payment (LT Consumer)',
    nameTa: 'மின் கட்டணம் செலுத்துதல் (ஆன்லைன்)',
    descriptionEn: 'Instant online payment of Low Tension (Domestic / Commercial / Agricultural) electricity consumption bills with official receipt generation.',
    descriptionTa: 'வீட்டு மற்றும் வணிக பயன்பாட்டு மின் கட்டணத்தை உடனே செலுத்தி அதிகாரப்பூர்வ ரசீது பெறும் சேவை.',
    eligibilityEn: 'All electricity consumers with active LT consumer numbers in Tamil Nadu.',
    eligibilityTa: 'தமிழ்நாட்டில் மின் இணைப்பு வைத்துள்ள அனைத்து நுகர்வோர்கள்.',
    requiredDocuments: [
      '10 to 12 Digit TANGEDCO Consumer Number (including Region code)',
      'Registered Mobile Number for SMS confirmation'
    ],
    requiredDocumentsTa: [
      '10 முதல் 12 இலக்க மின் நுகர்வோர் எண் (மண்டல குறியீட்டுடன்)',
      'உறுதிப்படுத்தல் SMS பெற மொபைல் எண்'
    ],
    optionalDocuments: [],
    notesEn: 'Instant credit and SMS acknowledgment. Late fee avoided by paying before due date.',
    notesTa: 'கட்டணம் செலுத்திய உடன் உடனடி ரசீது மற்றும் SMS உறுதிப்படுத்தல் கிடைக்கும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TANGEDCO Online Payment (tnebnet.org)',
    officialPortalUrl: 'https://www.tnebnet.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-502',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'New LT Service Connection Application (Domestic / Commercial)',
    nameTa: 'புதிய மின் இணைப்பு விண்ணப்பம் (வீடு / வணிகம்)',
    descriptionEn: 'Apply for a new Low Tension electricity meter connection for newly constructed residential houses, apartments, shops and small commercial buildings.',
    descriptionTa: 'புதிதாக கட்டப்பட்ட வீடுகள், கடைகள் மற்றும் வணிகக் கட்டிடங்களுக்கு புதிய மின் இணைப்பு கோரி விண்ணப்பிக்கும் சேவை.',
    eligibilityEn: 'Property owners or lawful occupiers of residential / commercial premises in Tamil Nadu.',
    eligibilityTa: 'கட்டிட உரிமையாளர்கள் அல்லது வாடகைதாரர்கள்.',
    requiredDocuments: [
      'Proof of Ownership: Registered Sale Deed / Partition Deed / Gift Deed OR Property Tax Receipt',
      'Approved Building Plan Copy (from Local Body / Panchayat / DTCP) OR Completion Certificate',
      'Applicant Aadhaar Card / ID Proof',
      'Passport size photograph of Applicant',
      'Wiring Completion Certificate signed by Licensed Electrical Contractor (LEC)',
      'For Tenancy: Owner Consent Letter / NOC with Owner Ownership Document'
    ],
    requiredDocumentsTa: [
      'சொத்து உரிமை ஆவணம்: கிரயப் பத்திரம் / செட்டில்மெண்ட் பத்திரம் அல்லது சொத்துவரி ரசீது',
      'அங்கீகரிக்கப்பட்ட கட்டிட வரைபடம் (பஞ்சாயத்து / நகராட்சி / DTCP அனுமதி)',
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'பாஸ்போர்ட் அளவு புகைப்படம்',
      'அங்கீகரிக்கப்பட்ட எலக்ட்ரீசியன் வயரிங் சான்றிதழ் (LEC Form)',
      'வாடகைதாரராயின்: உரிமையாளரின் சம்மதக் கடிதம் (NOC) மற்றும் பத்திரம்'
    ],
    optionalDocuments: ['Nearby Consumer Number (for pole identification)', 'Neighbor NOC'],
    notesEn: 'Site inspection conducted by TANGEDCO Junior Engineer (JE) within 7 days of online submission.',
    notesTa: 'விண்ணப்பித்த பின் மின்வாரிய உதவிப் பொறியாளர் நேரில் ஆய்வு செய்து மதிப்பீடு வழங்குவார்.',
    variableRequirements: true,
    variableRequirementsNoteTa: 'கட்டிடத்தின் அளவு, வகை மற்றும் வணிக தன்மைக்கு ஏற்ப அனுமதி சான்றிதழ்கள் மாறுபடலாம்.',
    serviceType: 'TANGEDCO/TNPDCL Online Service',
    officialSource: 'TANGEDCO Web Portal (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-503',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'New LT Connection Estimation & Deposit Payment',
    nameTa: 'புதிய மின் இணைப்பு மதிப்பீட்டுக் கட்டணம் & வைப்புத்தொகை செலுத்துதல்',
    descriptionEn: 'Online payment of demand notice charges, development charges, meter caution deposit (MCD) and service connection charges after JE inspection approval.',
    descriptionTa: 'புதிய மின் இணைப்பிற்கு பொறியாளர் ஒப்புதல் அளித்த பின் மீட்டர் வைப்புத்தொகை மற்றும் வளர்ச்சிக் கட்டணம் செலுத்தும் சேவை.',
    eligibilityEn: 'Applicants with issued Demand Notice / Application Number from TANGEDCO.',
    eligibilityTa: 'புதிய மின் இணைப்பு கோரி அறிவிப்பு பெற்ற விண்ணப்பதாரர்கள்.',
    requiredDocuments: [
      'New Service Connection Application Number',
      'TANGEDCO Demand Notice Copy / SMS details'
    ],
    requiredDocumentsTa: [
      'புதிய மின் இணைப்பு விண்ணப்ப எண் (Application Number)',
      'மின்வாரிய கோரிக்கை அறிவிப்பு (Demand Notice) நகல் / SMS'
    ],
    optionalDocuments: [],
    notesEn: 'Meter installation scheduled within 3 working days of payment receipt.',
    notesTa: 'கட்டணம் செலுத்திய 3 வேலை நாட்களுக்குள் மீட்டர் பொருத்தும் பணி தொடங்கும்.',
    variableRequirements: false,
    serviceType: 'TANGEDCO/TNPDCL Online Service',
    officialSource: 'TANGEDCO Web Portal (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-504',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'New Service Connection Status & Tracking Assistance',
    nameTa: 'புதிய மின் இணைப்பு விண்ணப்ப நிலை அறிதல்',
    descriptionEn: 'Track live workflow status of new LT connection application from field inspection, estimation to meter installation.',
    descriptionTa: 'விண்ணப்பித்த புதிய மின் இணைப்பின் நிலையை ஆன்லைனில் கண்காணிக்கும் சேவை.',
    eligibilityEn: 'Any applicant who submitted a new connection request.',
    eligibilityTa: 'புதிய மின் இணைப்பு விண்ணப்பதாரர்கள்.',
    requiredDocuments: [
      'New Service Application Reference Number',
      'Applicant Mobile Number'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பக் குறிப்பு எண் (Application Reference No)',
      'விண்ணப்பதாரர் மொபைல் எண்'
    ],
    optionalDocuments: [],
    notesEn: 'Live integration with TANGEDCO online workflow tracker.',
    notesTa: 'மின்வாரிய சர்வரில் இருந்து நேரடி நிலையை அறியலாம்.',
    variableRequirements: false,
    serviceType: 'Customer Assistance / Application Guidance',
    officialSource: 'TANGEDCO Tracking (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-505',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'EB Name Transfer / Ownership Change (LT Service)',
    nameTa: 'மின் இணைப்பு பெயர் மாற்றம் (உரிமையாளர் பெயர் மாற்றம்)',
    descriptionEn: 'Transfer the electricity service connection name from previous owner/deceased person to the current legal property owner in TANGEDCO records.',
    descriptionTa: 'வீடு அல்லது நிலத்தை வாங்கிய பின் மின் இணைப்பை பழைய உரிமையாளர் பெயரிலிருந்து புதிய உரிமையாளர் பெயருக்கு மாற்றும் சேவை.',
    eligibilityEn: 'Current legal property purchasers, settlement beneficiaries or legal heirs.',
    eligibilityTa: 'சொத்தை வாங்கிய புதிய உரிமையாளர்கள் அல்லது வாரிசுகள்.',
    requiredDocuments: [
      'Existing EB Consumer Number / Latest Bill Receipt Copy',
      'Registered Sale Deed / Title Deed Copy of the New Owner',
      'Current Property Tax Receipt in the name of the New Owner',
      'Patta Copy in New Owner name (for land/independent house)',
      'For Demise of Previous Owner: Death Certificate + Legal Heir Certificate + Legal Heirs Consent Letter / NOC',
      'Indemnity Bond on Non-Judicial Stamp Paper (Form 4)',
      'New Owner Aadhaar Card & Passport size photo'
    ],
    requiredDocumentsTa: [
      'தற்போதைய மின் நுகர்வோர் எண் / சமீபத்திய கட்டண ரசீது நகல்',
      'புதிய உரிமையாளரின் பதிவு செய்யப்பட்ட கிரயப் பத்திரம் / செட்டில்மெண்ட் பத்திரம்',
      'புதிய உரிமையாளர் பெயரில் உள்ள சமீபத்திய சொத்துவரி ரசீது',
      'பட்டா நகல் (தனி வீடு / நிலத்திற்கு)',
      'பழைய உரிமையாளர் இறந்திருந்தால்: இறப்புச் சான்றிதழ் + வாரிசுச் சான்றிதழ் + மற்ற வாரிசுகளின் சம்மதக் கடிதம் (NOC)',
      'முத்திரைத்தாளில் உறுதிமொழிப் பத்திரம் (Indemnity Bond - Form 4)',
      'புதிய உரிமையாளரின் ஆதார் அட்டை & புகைப்படம்'
    ],
    optionalDocuments: ['Previous Owner Consent Letter (if alive)'],
    notesEn: 'Name transfer fee & security deposit difference payable online following JE verification.',
    notesTa: 'ஆவணங்கள் சரிபார்க்கப்பட்ட பின் பெயர் மாற்றக் கட்டணம் மற்றும் வைப்புத்தொகை செலுத்த வேண்டும்.',
    variableRequirements: true,
    variableRequirementsNoteTa: 'பழைய உரிமையாளர் உயிரோடு உள்ளாரா அல்லது இறந்துவிட்டாரா என்பதைப் பொறுத்து ஆவணங்கள் மாறும்.',
    serviceType: 'TANGEDCO/TNPDCL Online Service',
    officialSource: 'TANGEDCO Consumer Services (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-506',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'Tariff Change Application (Domestic to Commercial / Vice Versa)',
    nameTa: 'மின் கட்டண விகிதம் (Tariff) மாற்றம்',
    descriptionEn: 'Change service tariff classification (e.g., Tariff IA Domestic to Tariff V Commercial, or Cottage Industry) based on premise usage change.',
    descriptionTa: 'கட்டிடத்தின் பயன்பாடு மாறும்போது மின் கட்டண விகிதத்தை (Tariff IA வீடு / Tariff V வணிகம்) மாற்றுவதற்கான விண்ணப்பம்.',
    eligibilityEn: 'EB Consumer seeking tariff re-classification corresponding to actual premise usage.',
    eligibilityTa: 'கட்டிடப் பயன்பாட்டை மாற்றியுள்ள மின் நுகர்வோர்கள்.',
    requiredDocuments: [
      'EB Consumer Number & Latest Paid Bill Receipt',
      'Proof of Purpose: Trade Licence / GST Certificate (for commercial) or Domestic Conversion Undertaking',
      'Applicant Aadhaar Card',
      'Premise Photo showing current usage'
    ],
    requiredDocumentsTa: [
      'மின் நுகர்வோர் எண் & கடைசியாக செலுத்திய கட்டண ரசீது',
      'பயன்பாட்டு ஆதாரம்: தொழில் உரிமம் / GST சான்றிதழ் (வணிகத்திற்கு) அல்லது வீட்டுப் பயன்பாட்டு உறுதிமொழி',
      'விண்ணப்பதாரர் ஆதார் அட்டை',
      'கட்டிட பயன்பாட்டைக் காட்டும் புகைப்படம்'
    ],
    optionalDocuments: ['Rental Agreement Copy'],
    notesEn: 'Inspected by Assistant Engineer (AE) before tariff code is updated in billing server.',
    notesTa: 'மின்வாரிய உதவிப் பொறியாளர் தள ஆய்வு செய்த பின் பில்லிங் கட்டண விகிதம் மாற்றப்படும்.',
    variableRequirements: false,
    serviceType: 'TANGEDCO/TNPDCL Online Service',
    officialSource: 'TANGEDCO (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-507',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'Additional Load Application',
    nameTa: 'கூடுதல் மின் பளு (Additional Load) விண்ணப்பம்',
    descriptionEn: 'Apply for increasing sanctioned electrical load (kW) to accommodate additional air conditioners, machinery, or heavy home appliances.',
    descriptionTa: 'கூடுதல் ஏசி, மோட்டார் அல்லது எந்திரங்கள் இயக்க அனுமதிக்கப்பட்ட மின் சுமையை (Load) அதிகப்படுத்த விண்ணப்பித்தல்.',
    eligibilityEn: 'Consumers whose connected load exceeds current sanctioned load.',
    eligibilityTa: 'அனுமதிக்கப்பட்ட அளவை விட அதிக மின்சாரம் தேவைப்படும் நுகர்வோர்கள்.',
    requiredDocuments: [
      'EB Consumer Number & Latest Bill Receipt',
      'List of Connected Electrical Equipment and Load details (kW calculation)',
      'Licensed Electrical Contractor (LEC) Wiring & Test Certificate',
      'Applicant Aadhaar Card & Ownership Proof'
    ],
    requiredDocumentsTa: [
      'மின் நுகர்வோர் எண் & சமீபத்திய கட்டண ரசீது',
      'பயன்படுத்தப்படும் மின்சாதனங்களின் பட்டியல் & தேவைப்படும் கூடுதல் கிலோவாட் (kW) விவரம்',
      'அங்கீகரிக்கப்பட்ட எலக்ட்ரீசியன் வயரிங் சான்றிதழ் (LEC)',
      'விண்ணப்பதாரர் ஆதார் அட்டை & கட்டிட உரிமை ஆவணம்'
    ],
    optionalDocuments: ['Industry / Machinery Catalogue'],
    notesEn: 'Development charges and additional security deposit payable based on increased kW.',
    notesTa: 'கூடுதல் கிலோவாட் அளவிற்கு ஏற்ப கூடுதல் வளர்ச்சிக் கட்டணம் செலுத்த வேண்டும்.',
    variableRequirements: false,
    serviceType: 'TANGEDCO/TNPDCL Online Service',
    officialSource: 'TANGEDCO (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-508',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'Load Reduction Application',
    nameTa: 'மின் பளு குறைப்பு (Load Reduction) விண்ணப்பம்',
    descriptionEn: 'Apply for reducing sanctioned load when heavy equipment or machines are removed, reducing fixed monthly charges for commercial/industrial consumers.',
    descriptionTa: 'தேவையற்ற மின்சாதனங்களை அகற்றிய பின், அனுமதிக்கப்பட்ட மின் சுமையைக் குறைத்து மாதாந்திர நிலைக் கட்டணத்தைக் குறைக்க விண்ணப்பித்தல்.',
    eligibilityEn: 'Consumers with excess sanctioned load wishing to reduce monthly fixed charges.',
    eligibilityTa: 'அனுமதிக்கப்பட்ட மின் சுமையைக் குறைக்க விரும்பும் நுகர்வோர்கள்.',
    requiredDocuments: [
      'EB Consumer Number & Latest Paid Bill',
      'Undertaking stating removal of extra load and list of current connected equipment',
      'Licensed Electrical Contractor Certificate',
      'Applicant ID Proof'
    ],
    requiredDocumentsTa: [
      'மின் நுகர்வோர் எண் & கட்டண ரசீது',
      'கூடுதல் சாதனங்கள் அகற்றப்பட்டுவிட்டன என்பதற்கான உறுதிமொழி & தற்போதைய உபகரணங்கள் பட்டியல்',
      'அங்கீகரிக்கப்பட்ட எலக்ட்ரீசியன் சான்றிதழ் (LEC)',
      'விண்ணப்பதாரர் அடையாள அட்டை'
    ],
    optionalDocuments: [],
    notesEn: 'Site inspection verified by TANGEDCO engineering team.',
    notesTa: 'பொறியாளர் ஆய்வு செய்து உபகரணங்கள் நீக்கப்பட்டதை உறுதிசெய்த பின் பளு குறைக்கப்படும்.',
    variableRequirements: false,
    serviceType: 'TANGEDCO/TNPDCL Online Service',
    officialSource: 'TANGEDCO (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-509',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'Single Phase to Three Phase Conversion',
    nameTa: '1-Phase முதல் 3-Phase மின் மாற்ற விண்ணப்பம்',
    descriptionEn: 'Convert single-phase 230V connection to three-phase 415V supply to run 3-phase submersible motors, lifts, centralized ACs or commercial machinery.',
    descriptionTa: 'சிங்கிள் பேஸ் இணைப்பை மும்முனை (3-Phase) இணைப்பாக மாற்றி 3-பேஸ் மோட்டார்கள் மற்றும் ஏசிக்கள் இயக்க விண்ணப்பித்தல்.',
    eligibilityEn: 'Consumers requiring 3-phase power supply (usually load > 4kW).',
    eligibilityTa: 'மும்முனை மின்சாரம் தேவைப்படும் நுகர்வோர்கள் (4 kW மேல் தேவைப்படுபவர்கள்).',
    requiredDocuments: [
      'Existing Single Phase EB Consumer Number & Paid Bill',
      '3-Phase Wiring Test Certificate signed by Licensed Electrical Contractor (Class A/B)',
      'List of 3-Phase Equipment and required kW capacity',
      'Applicant Aadhaar Card & Property Ownership Proof'
    ],
    requiredDocumentsTa: [
      'தற்போதைய சிங்கிள் பேஸ் மின் நுகர்வோர் எண் & ரசீது',
      '3-Phase வயரிங் செய்யப்பட்டு விட்டதற்கான அங்கீகரிக்கப்பட்ட எலக்ட்ரீசியன் சான்றிதழ் (LEC)',
      '3-Phase உபகரணங்களின் பட்டியல் & தேவைப்படும் மொத்த kW அளவு',
      'விண்ணப்பதாரரின் ஆதார் அட்டை & சொத்து ஆவணம்'
    ],
    optionalDocuments: ['Submersible pump motor invoice'],
    notesEn: 'New 3-Phase digital meter and meter box installed by TANGEDCO after fee payment.',
    notesTa: 'கட்டணம் செலுத்திய பின் 3-பேஸ் டிஜிட்டல் மீட்டர் பொருத்தப்படும்.',
    variableRequirements: false,
    serviceType: 'TANGEDCO/TNPDCL Online Service',
    officialSource: 'TANGEDCO (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-510',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'Shifting of Service Connection / Meter Shifting',
    nameTa: 'மின் இணைப்பு / மீட்டர் இடம் மாற்றுதல்',
    descriptionEn: 'Shifting of existing electricity meter board within the premises or shifting service connection to an adjacent building on the same property.',
    descriptionTa: 'வீடு புதுப்பிக்கும் போது மீட்டரை வேறு சுவருக்கு மாற்றுதல் அல்லது அதே எல்லைக்குள் வேறு இடத்திற்கு மாற்ற விண்ணப்பித்தல்.',
    eligibilityEn: 'EB Consumer modifying premise layout or renovating house/building.',
    eligibilityTa: 'கட்டிடம் புதுப்பிக்கும் அல்லது மீட்டர் பலகையை மாற்ற விரும்பும் நுகர்வோர்கள்.',
    requiredDocuments: [
      'EB Consumer Number & Latest Paid Bill',
      'Reason for shifting and Sketch showing proposed new meter location',
      'Property Ownership Document / Property Tax Receipt',
      'Applicant Aadhaar Card'
    ],
    requiredDocumentsTa: [
      'மின் நுகர்வோர் எண் & கட்டண ரசீது',
      'இடம் மாற்றுவதற்கான காரணம் & புதிய மீட்டர் வைக்கப்பட உள்ள இடத்திற்கான வரைபடம்',
      'சொத்து உரிமை ஆவணம் / சொத்துவரி ரசீது',
      'விண்ணப்பதாரர் ஆதார் அட்டை'
    ],
    optionalDocuments: ['LEC Wiring Certificate for new meter board'],
    notesEn: 'Estimate for service line wire and shifting charges prepared by Section Officer.',
    notesTa: 'கள ஆய்வுக்குப் பின் மதிப்பீட்டுக் கட்டணம் செலுத்த வேண்டும்.',
    variableRequirements: false,
    serviceType: 'TANGEDCO/TNPDCL Online Service',
    officialSource: 'TANGEDCO (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-511',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'Temporary Supply Connection Application',
    nameTa: 'தற்காலிக மின் இணைப்பு விண்ணப்பம் (கட்டுமானம் / விழாக்கள்)',
    descriptionEn: 'Short-term temporary electricity connection for construction work, exhibitions, marriages, temple festivals, or seasonal events.',
    descriptionTa: 'கட்டிடக் கட்டுமானம், விழாக்கள், கண்காட்சிகள் மற்றும் திருமண நிகழ்வுகளுக்கு தற்காலிக மின் இணைப்பு கோரி விண்ணப்பித்தல்.',
    eligibilityEn: 'Builders, contractors, festival committees or event organizers.',
    eligibilityTa: 'கட்டிட ஒப்பந்ததாரர்கள் மற்றும் விழா அமைப்பாளர்கள்.',
    requiredDocuments: [
      'Approved Building Plan (for construction) OR Local Police/Panchayat Permission Letter (for festivals)',
      'Property Ownership Proof / Lease Agreement / Event Venue Permission',
      'Applicant Aadhaar Card & Contact Details',
      'Wiring Completion Report & Load Requirements'
    ],
    requiredDocumentsTa: [
      'கட்டிட அனுமதி ஆவணம் (கட்டுமானத்திற்கு) அல்லது காவல்/உள்ளாட்சி அனுமதி கடிதம் (விழாக்களுக்கு)',
      'நில உரிமை ஆவணம் / வாடகை ஒப்பந்தம் / விழா நடக்கும் இடத்தின் அனுமதி',
      'விண்ணப்பதாரரின் ஆதார் அட்டை & தொலைபேசி எண்',
      'வயரிங் அறிக்கை & தேவைப்படும் மின் சுமை விவரம்'
    ],
    optionalDocuments: ['No Objection Certificate (NOC) from venue owner'],
    notesEn: 'Billed under Temporary Tariff VI with upfront temporary consumption advance deposit.',
    notesTa: 'தற்காலிக கட்டண விகிதத்தில் கணக்கிடப்பட்டு முன்வைப்புத் தொகையுடன் வழங்கப்படும்.',
    variableRequirements: false,
    serviceType: 'TANGEDCO/TNPDCL Online Service',
    officialSource: 'TANGEDCO (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-512',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'Meter Related Services & Testing Request',
    nameTa: 'மீட்டர் பழுது / துல்லியப் பரிசோதனை கோரிக்கை',
    descriptionEn: 'Request official lab testing of electricity meter when high billing or meter speed defect is suspected.',
    descriptionTa: 'மீட்டர் வேகமாக ஓடுவதாக சந்தேகம் எழுந்தால் அல்லது அதிக கட்டணம் வந்தால் மீட்டரை ஆய்வு செய்ய கோரிக்கை வைத்தல்.',
    eligibilityEn: 'Any consumer with billing anomalies suspecting meter calibration fault.',
    eligibilityTa: 'மீட்டர் பழுது என சந்தேகிக்கும் அனைத்து நுகர்வோர்கள்.',
    requiredDocuments: [
      'EB Consumer Number & Past 3 Billing Cycles Receipts',
      'Meter Testing Application / Complaint Description',
      'Applicant Contact Number'
    ],
    requiredDocumentsTa: [
      'மின் நுகர்வோர் எண் & கடந்த 3 மாத கட்டண ரசீதுகள்',
      'மீட்டர் ஆய்வு கோரிக்கை படிவம் / புகாரின் விவரம்',
      'தொடர்புக்கான மொபைல் எண்'
    ],
    optionalDocuments: [],
    notesEn: 'Standard testing fee deposited. If meter found defective, deposit refunded and bill adjusted.',
    notesTa: 'பரிசோதனைக் கட்டணம் செலுத்த வேண்டும்; மீட்டரில் கோளாறு இருப்பது உறுதியானால் கட்டணம் திருப்பித் தரப்பட்டு பில் சரிசெய்யப்படும்.',
    variableRequirements: false,
    serviceType: 'Customer Assistance / Application Guidance',
    officialSource: 'TANGEDCO Grievance (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-513',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'Defective / Burnt / Stuck Meter Replacement',
    nameTa: 'பழுதான / எரிந்த / ஓடாத மீட்டர் மாற்றுதல்',
    descriptionEn: 'Report burnt, stuck, glass broken or dead display meters for free replacement with modern smart static/electronic meters.',
    descriptionTa: 'டிஸ்ப்ளே தெரியாத, எரிந்துபோன அல்லது பழுதடைந்த மீட்டரை மாற்றி புதிய டிஜிட்டல் மீட்டர் பொருத்த விண்ணப்பித்தல்.',
    eligibilityEn: 'Consumers experiencing defective, display-dead or burnt energy meters.',
    eligibilityTa: 'பழுதான மீட்டர் வைத்துள்ள அனைத்து நுகர்வோர்கள்.',
    requiredDocuments: [
      'EB Consumer Number & Latest Bill Copy',
      'Photo of the Defective / Burnt Meter (showing meter number if visible)',
      'Applicant Contact Details'
    ],
    requiredDocumentsTa: [
      'மின் நுகர்வோர் எண் & சமீபத்திய பில் நகல்',
      'பழுதான மீட்டரின் புகைப்படம் (மீட்டர் எண் தெரியுமாறு)',
      'நுகர்வோரின் மொபைல் எண்'
    ],
    optionalDocuments: ['Fire NOC (if burnt due to external incident)'],
    notesEn: 'Average billing applied during defective period until new meter is installed and calibrated.',
    notesTa: 'புதிய மீட்டர் பொருத்தப்படும் வரை முந்தைய சராசரி கட்டண முறை கணக்கிடப்படும்.',
    variableRequirements: false,
    serviceType: 'Customer Assistance / Application Guidance',
    officialSource: 'TANGEDCO Consumer Portal (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-514',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'Reconnection of Disconnected Service',
    nameTa: 'துண்டிக்கப்பட்ட மின் இணைப்பை மீண்டும் இணைத்தல் (Reconnection)',
    descriptionEn: 'Reconnection of service connection disconnected due to non-payment of dues or temporary vacation after clearing pending arrears and reconnection fees.',
    descriptionTa: 'கட்டணம் செலுத்தாததால் துண்டிக்கப்பட்ட மின் இணைப்பிற்கு நிலுவைத்தொகை மற்றும் மறுஇணைப்புக் கட்டணம் செலுத்தி மீண்டும் மின்சாரம் பெறுதல்.',
    eligibilityEn: 'Consumers whose service line was disconnected within permissible statutory revival period (under 2 years).',
    eligibilityTa: 'மின் இணைப்பு துண்டிக்கப்பட்ட நுகர்வோர்கள்.',
    requiredDocuments: [
      'EB Consumer Number',
      'All Pending Arrears Payment Receipt Copy',
      'Government Reconnection Fee Receipt',
      'Applicant Identity Proof'
    ],
    requiredDocumentsTa: [
      'மின் நுகர்வோர் எண்',
      'அனைத்து நிலுவைத் தொகையும் செலுத்தியதற்கான ரசீது நகல்',
      'மறுஇணைப்புக் கட்டண ரசீது',
      'விண்ணப்பதாரர் அடையாளச் சான்று'
    ],
    optionalDocuments: [],
    notesEn: 'Line restored within 24 hours of reconnection fee verification.',
    notesTa: 'நிலுவை மற்றும் மறுஇணைப்புக் கட்டணம் செலுத்திய 24 மணி நேரத்திற்குள் மின் இணைப்பு வழங்கப்படும்.',
    variableRequirements: false,
    serviceType: 'TANGEDCO/TNPDCL Online Service',
    officialSource: 'TANGEDCO Online (tnebnet.org)',
    officialPortalUrl: 'https://www.tnebnet.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-515',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'Permanent Disconnection & Surrender of Service',
    nameTa: 'மின் இணைப்பை நிரந்தரமாக ரத்து செய்தல் & ஒப்படைப்பு',
    descriptionEn: 'Apply for permanent disconnection and surrender of meter board when building is demolished, reconstructed or amalgamated, with refund of security deposit.',
    descriptionTa: 'கட்டிடத்தை இடிக்கும் போது அல்லது தேவையற்ற மின் இணைப்பை நிரந்தரமாக ரத்து செய்து வைப்புத்தொகையை திரும்பப் பெறுதல்.',
    eligibilityEn: 'Registered property owner surrendering electricity service.',
    eligibilityTa: 'மின் இணைப்பை ரத்து செய்ய விரும்பும் சொத்து உரிமையாளர்கள்.',
    requiredDocuments: [
      'EB Consumer Number & Final Meter Reading Details',
      'Proof of Property Ownership (Sale Deed / Patta)',
      'Building Demolition Approval / Reconstruction Plan (if applicable)',
      'Original Meter Caution Deposit Receipt (for refund) & Bank Account Details',
      'Applicant Aadhaar Card & NOC from co-owners if any'
    ],
    requiredDocumentsTa: [
      'மின் நுகர்வோர் எண் & இறுதி மீட்டர் ரீடிங் விவரம்',
      'சொத்து உரிமை ஆவணம் (கிரயப் பத்திரம் / பட்டா)',
      'கட்டிடம் இடிப்பு அனுமதி / புதிய திட்ட அனுமதி (இருப்பின்)',
      'அசல் மீட்டர் வைப்புத்தொகை ரசீது & வங்கி கணக்கு விவரம் (பணம் திரும்பப்பெற)',
      'உரிமையாளரின் ஆதார் அட்டை & ஒப்புதல் கடிதம்'
    ],
    optionalDocuments: [],
    notesEn: 'Security deposit balance refunded directly to bank account after adjusting final bill.',
    notesTa: 'இறுதி பில் தொகையை கழித்த பின் மீதமுள்ள வைப்புத்தொகை வங்கிக் கணக்கில் வரவு வைக்கப்படும்.',
    variableRequirements: false,
    serviceType: 'TANGEDCO/TNPDCL Online Service',
    officialSource: 'TANGEDCO (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-516',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'Billing Grievance & Bill Correction Assistance',
    nameTa: 'மின் கட்டண புகார் & திருத்த உதவி',
    descriptionEn: 'Registration of formal consumer complaints regarding abnormal assessments, wrong meter reading entries, tariff errors, or double payments.',
    descriptionTa: 'தவறான மீட்டர் ரீடிங் பதிவு, அதிகப்படியான கட்டணம் அல்லது இரட்டைப் பரிவர்த்தனை புகார்களைப் பதிவு செய்து சரிசெய்யும் சேவை.',
    eligibilityEn: 'Any consumer with billing disputes or assessment calculation errors.',
    eligibilityTa: 'மின் கட்டணத்தில் முரண்பாடு உள்ள அனைத்து நுகர்வோர்கள்.',
    requiredDocuments: [
      'EB Consumer Number',
      'Disputed Electricity Bill Copy',
      'Current Photo of Meter Display (showing current reading and kWh unit)',
      'Past 6 Months Payment Receipts'
    ],
    requiredDocumentsTa: [
      'மின் நுகர்வோர் எண்',
      'தவறாக வந்த மின் கட்டண ரசீது நகல்',
      'தற்போதைய மீட்டர் ரீடிங் புகைப்படம் (kWh யூனிட் தெரியுமாறு)',
      'கடந்த 6 மாத கட்டண ரசீதுகள்'
    ],
    optionalDocuments: [
      'Bank Transaction Reference (if payment failed online)',
      'Prior Meter Test / Defective Assessment Slip (if applicable)'
    ],
    notesEn: 'Note & Facilitation: This is an administrative grievance escalation. Document verification and revised assessment are conducted by the Assistant Accounts Officer (AAO) or Section AE based on the specific billing discrepancy (e.g., door-lock estimated unit, defective meter average, or tariff slab mismatch).',
    notesTa: 'குறிப்பு & வழிகாட்டுதல்: இது மின்வாரிய கணக்கு பிரிவுக்கான வழிகாட்டுதல் மனுவாகும். மீட்டர் ரீடிங் தவறு, கதவு பூட்டியிருந்ததால் ஏற்பட்ட கூடுதல் கணக்கீடு அல்லது முந்தைய மாத சராசரி பில் போன்றவற்றிற்கு ஏற்ப உதவி கணக்கு அலுவலர் (AAO) அல்லது பிரிவு பொறியாளர் (AE) கள ஆய்வு செய்து திருத்தப்பட்ட பில் உத்தரவை வழங்குவர்.',
    variableRequirements: false,
    serviceType: 'Customer Assistance / Application Guidance',
    officialSource: 'TANGEDCO Consumer Grievance (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-517',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'Service Line / Damaged Cable Replacement Application',
    nameTa: 'மின் இணைப்பு கம்பி / கேபிள் மாற்றுதல்',
    descriptionEn: 'Request replacement of damaged, burnt, weak service overhead wire or underground cable connecting street pole to the consumer meter board.',
    descriptionTa: 'தெரு மின் கம்பத்திலிருந்து வீட்டிற்கு வரும் சேதமடைந்த மின் வயர் அல்லது கேபிளை மாற்றுவதற்கான கோரிக்கை.',
    eligibilityEn: 'Consumers experiencing low voltage, spark or damaged service drop wire.',
    eligibilityTa: 'மின் இணைப்பு கம்பி சேதமடைந்த அனைத்து நுகர்வோர்கள்.',
    requiredDocuments: [
      'EB Consumer Number & Location Address',
      'Photo of Damaged Service Line / Cable',
      'Applicant Contact Number'
    ],
    requiredDocumentsTa: [
      'மின் நுகர்வோர் எண் & இருப்பிட முகவரி',
      'சேதமடைந்த மின் கம்பியின் புகைப்படம்',
      'தொடர்புக்கான மொபைல் எண்'
    ],
    optionalDocuments: [
      'Property Tax / Ownership Proof (if meter board relocation is involved)'
    ],
    notesEn: 'Note & Facilitation: Replacement of damaged service cables from the distribution pole to the meter board is undertaken by TANGEDCO under routine O&M. If damage is within the consumer\'s private property boundary or meter outlet, replacement material/labor is assessed as per consumer premises norms.',
    notesTa: 'குறிப்பு & வழிகாட்டுதல்: மின் கம்பத்திலிருந்து மீட்டர் வரை உள்ள பொது விநியோகக் கேபிள் பழுதடைந்தால் மின்வாரிய பராமரிப்பின் கீழ் இலவசமாக மாற்றப்படும். நுகர்வோரின் தனிப்பட்ட வளாகத்திற்குள் உள்ள உள்வயரிங் கேபிள் பழுதடைந்தால் மதிப்பீட்டுக் கட்டணம் நுகர்வோரால் செலுத்தப்பட வேண்டும்.',
    variableRequirements: false,
    serviceType: 'Customer Assistance / Application Guidance',
    officialSource: 'TANGEDCO O&M (tangedco.org)',
    officialPortalUrl: 'https://www.tangedco.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'TNEB-518',
    category: 'tangedco_electricity',
    department: 'TANGEDCO / TNPDCL Electricity',
    departmentTa: 'தமிழ்நாடு மின்சார வாரியம் (TANGEDCO)',
    nameEn: 'Aadhaar – EB Consumer Number Linking',
    nameTa: 'ஆதார் – மின் நுகர்வோர் எண் இணைப்பு',
    descriptionEn: 'Mandatory seeding of Aadhaar number with TANGEDCO consumer connection number to avail 100 free units subsidy for domestic consumers.',
    descriptionTa: '100 யூனிட் இலவச மின்சாரம் மற்றும் மானியம் தொடர்ந்து பெற மின் நுகர்வோர் எண்ணுடன் ஆதாரை இணைக்கும் சேவை.',
    eligibilityEn: 'All Domestic, Handloom, Powerloom, and Agriculture service connection holders in Tamil Nadu.',
    eligibilityTa: 'வீட்டு மின் இணைப்பு வைத்துள்ள அனைத்து நுகர்வோர்கள்.',
    requiredDocuments: [
      '10 to 12 Digit TANGEDCO Consumer Number',
      'Aadhaar Card of the Property Owner / Tenant (Occupier)',
      'Aadhaar Registered Mobile Number for UIDAI OTP Verification',
      'Occupier Status (Owner / Tenant / NRI)'
    ],
    requiredDocumentsTa: [
      '10 முதல் 12 இலக்க மின் நுகர்வோர் எண்',
      'உரிமையாளர் அல்லது வாடகைதாரரின் ஆதார் அட்டை',
      'ஆதாரில் பதிவுசெய்த மொபைல் எண் (OTP சரிபார்ப்புக்கு)',
      'குடியிருப்பு நிலை (உரிமையாளர் / வாடகைதாரர்)'
    ],
    optionalDocuments: ['Rental Agreement (if linking as tenant)'],
    notesEn: 'Instant online OTP confirmation. Ensures continuity of 100 units bi-monthly free power subsidy.',
    notesTa: 'உடனடி OTP சரிபார்ப்பு மூலம் இலவச 100 யூனிட் மின்சார மானியம் தடையின்றி கிடைக்கும்.',
    variableRequirements: false,
    serviceType: 'TANGEDCO/TNPDCL Online Service',
    officialSource: 'TANGEDCO Aadhaar Link Portal (nsc.tnebltd.gov.in/adharupload/)',
    officialPortalUrl: 'https://nsc.tnebltd.gov.in/adharupload/',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 6. TRANSPORT & DRIVING LICENCE – SARATHI / RTO (போக்குவரத்து & ஓட்டுநர் உரிமம்)
  // =========================================================================
  {
    id: 'RTO-601',
    category: 'transport_rto',
    department: 'Transport Department (RTO)',
    departmentTa: 'போக்குவரத்துத்துறை (RTO)',
    nameEn: 'Learner Licence Application (LLR – Online Test / Slot)',
    nameTa: 'பழகுநர் ஓட்டுநர் உரிமம் (LLR) விண்ணப்பம்',
    descriptionEn: 'Application for Learner Licence for Two Wheeler (MCWG / MCWOG) and Four Wheeler (LMV) including online Aadhaar-authenticated test or RTO slot booking.',
    descriptionTa: 'இருசக்கர மற்றும் நான்கு சக்கர வாகனங்களுக்கான பழகுநர் உரிமம் (LLR) பெற ஆன்லைனில் விண்ணப்பிக்கும் சேவை.',
    eligibilityEn: 'Age 16+ for 50cc gearless; Age 18+ for Non-Transport (MCWG/LMV); Age 20+ for Transport vehicles.',
    eligibilityTa: '18 வயது பூர்த்தியடைந்த நபர்கள் (கியர் உள்ள பைக் / கார்).',
    requiredDocuments: [
      'Applicant Aadhaar Card (with updated mobile number)',
      'Age Proof: 10th School Mark Sheet / Birth Certificate / Passport / PAN Card',
      'Current Address Proof: Aadhaar Card / Voter ID / LIC Policy / Passport',
      'Medical Certificate Form 1A signed by Registered Medical Practitioner (for age 40+ or transport)',
      'Applicant Passport Size Photograph (White Background)',
      'Applicant Signature Specimen (Black Ink on White Paper)'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை (மொபைல் எண் இணைக்கப்பட்டது)',
      'வயது சான்று: 10-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ் / பிறப்புச் சான்றிதழ் / பான் கார்டு',
      'முகவரி ஆதாரம்: ஆதார் அட்டை / வாக்காளர் அட்டை / பாஸ்போர்ட்',
      'மருத்துவ தகுதிச் சான்று படிவம் 1A (40 வயதுக்கு மேற்பட்டோருக்கு)',
      'பாஸ்போர்ட் அளவு புகைப்படம் (வெள்ளை பின்னணி)',
      'கையொப்ப மாதிரி (வெள்ளைத்தாளில் கருப்பு மையினால் இடப்பட்டது)'
    ],
    optionalDocuments: ['Parent / Guardian Consent Form (for applicants aged 16-18)'],
    notesEn: 'Aadhaar-based faceless test can be taken from home or e-Sevai centre. LLR valid for 6 months.',
    notesTa: 'ஆதார் சரிபார்ப்பு மூலம் நேரடி தேர்வினை எழுதலாம். LLR 6 மாதங்கள் வரை செல்லுபடியாகும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Ministry of Road Transport / TN Transport (parivahan.gov.in)',
    officialPortalUrl: 'https://parivahan.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'RTO-602',
    category: 'transport_rto',
    department: 'Transport Department (RTO)',
    departmentTa: 'போக்குவரத்துத்துறை (RTO)',
    nameEn: 'Permanent Driving Licence (DL) Slot Booking & Application',
    nameTa: 'நிரந்தர ஓட்டுநர் உரிமம் (DL) & டிரைவிங் டெஸ்ட் முன்பதிவு',
    descriptionEn: 'Apply for permanent Smart Card Driving Licence after 30 days of LLR issue and book driving track test slot at the jurisdictional RTO.',
    descriptionTa: 'LLR பெற்று 30 நாட்கள் கழித்து நிரந்தர ஓட்டுநர் உரிமம் பெறவும், RTO அலுவலகத்தில் டிரைவிங் டெஸ்ட் செல்லவும் முன்பதிவு செய்தல்.',
    eligibilityEn: 'Holders of valid Learner Licence (LLR) between 30 to 180 days from date of LLR issue.',
    eligibilityTa: 'செல்லுபடியாகும் LLR பெற்று 30 நாட்கள் நிறைவடைந்த நபர்கள்.',
    requiredDocuments: [
      'Valid Active Learner Licence (LLR) Number',
      'Applicant Aadhaar Card',
      'Driving School Certificate Form 5 (for commercial/transport category)',
      'Vehicle Documents for Driving Test: RC Book, Insurance Policy, Pollution Certificate (PUC)',
      'Applicant Passport Size Photograph & Signature',
      'RTO Test Fee Payment Receipt'
    ],
    requiredDocumentsTa: [
      'செல்லுபடியாகும் பழகுநர் உரிம (LLR) எண்',
      'விண்ணப்பதாரர் ஆதார் அட்டை',
      'ஓட்டுநர் பயிற்சிப் பள்ளி சான்றிதழ் (Form 5)',
      'டெஸ்டிற்கு கொண்டு செல்லும் வாகனத்தின் ஆவணங்கள்: RC புக், இன்சூரன்ஸ், புகைச்சான்று (PUC)',
      'பாஸ்போர்ட் அளவு புகைப்படம் & கையொப்பம்',
      'RTO தேர்வுக் கட்டண ரசீது'
    ],
    optionalDocuments: [],
    notesEn: 'After passing test on RTO track, Smart Card DL dispatched to address by Speed Post.',
    notesTa: 'ஆர்.டி.ஓ டிரைவிங் டெஸ்ட் தேர்ச்சி பெற்ற பின் ஸ்மார்ட் கார்டு DL தபால் மூலம் வீட்டிற்கு அனுப்பப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Parivahan Sarathi (parivahan.gov.in)',
    officialPortalUrl: 'https://parivahan.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'RTO-603',
    category: 'transport_rto',
    department: 'Transport Department (RTO)',
    departmentTa: 'போக்குவரத்துத்துறை (RTO)',
    nameEn: 'Driving Licence Renewal (DL Renewal)',
    nameTa: 'ஓட்டுநர் உரிமம் புதுப்பித்தல் (DL Renewal)',
    descriptionEn: 'Renewal of expired non-transport / transport driving licence with online biometric upload and Medical Form 1A.',
    descriptionTa: 'காலாவதியான ஓட்டுநர் உரிமத்தைப் புதுப்பித்து புதிய ஸ்மார்ட் கார்டு பெற விண்ணப்பிக்கும் சேவை.',
    eligibilityEn: 'DL holders whose licence has expired or is expiring within 1 year.',
    eligibilityTa: 'ஓட்டுநர் உரிமம் காலாவதியான அல்லது 1 வருடத்திற்குள் காலாவதியாக உள்ள நபர்கள்.',
    requiredDocuments: [
      'Original Expired Driving Licence (DL) Details',
      'Applicant Aadhaar Card',
      'Medical Certificate Form 1A signed by Registered MBBS Doctor (mandatory if age is 40+ or for transport DL)',
      'Passport size photograph & Signature scan',
      'Address Proof (if address is being updated)'
    ],
    requiredDocumentsTa: [
      'காலாவதியான அசல் ஓட்டுநர் உரிம (DL) எண்',
      'விண்ணப்பதாரர் ஆதார் அட்டை',
      'அரசு பதிவுபெற்ற மருத்துவரிடம் பெற்ற மருத்துவ சான்றிதழ் Form 1A (40 வயதுக்கு மேற்பட்டோருக்கு)',
      'பாஸ்போர்ட் அளவு புகைப்படம் & கையொப்பம்',
      'முகவரி ஆதாரம் (முகவரி மாற்ற விரும்பினால்)'
    ],
    optionalDocuments: [],
    notesEn: 'Can be renewed up to 1 year before expiry or within grace period without re-test.',
    notesTa: 'காலாவதியாகும் 1 வருடத்திற்கு முன்பே அல்லது காலாவதியான பின்னும் புதுப்பிக்கலாம்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Parivahan Sarathi (parivahan.gov.in)',
    officialPortalUrl: 'https://parivahan.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'RTO-604',
    category: 'transport_rto',
    department: 'Transport Department (RTO)',
    departmentTa: 'போக்குவரத்துத்துறை (RTO)',
    nameEn: 'Duplicate Driving Licence Application',
    nameTa: 'நகல் ஓட்டுநர் உரிமம் விண்ணப்பம் (Duplicate DL)',
    descriptionEn: 'Apply for a replacement Driving Licence when original card is lost, stolen, mutilated, or completely damaged.',
    descriptionTa: 'ஓட்டுநர் உரிமம் தொலைந்துவிட்டாலோ அல்லது சேதமடைந்தாலோ புதிய நகல் DL பெற விண்ணப்பித்தல்.',
    eligibilityEn: 'Licence holders whose DL is lost, torn, defaced or damaged.',
    eligibilityTa: 'உரிமம் தொலைந்த அல்லது சேதமடைந்த நபர்கள்.',
    requiredDocuments: [
      'Driving Licence Number & Date of Birth',
      'Police Lost Document Report (LDR) / Non-Traceable Certificate (if lost)',
      'Damaged / Defaced Licence Copy (if mutilated)',
      'Applicant Aadhaar Card',
      'Passport size photograph and Signature'
    ],
    requiredDocumentsTa: [
      'ஓட்டுநர் உரிம எண் & பிறந்த தேதி',
      'காவல்துறை வழங்கிய LDR புகார் சான்றிதழ் (தொலைந்திருந்தால்)',
      'சேதமடைந்த உரிமத்தின் நகல் (சேதமடைந்திருந்தால்)',
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'பாஸ்போர்ட் அளவு புகைப்படம் மற்றும் கையொப்பம்'
    ],
    optionalDocuments: [],
    notesEn: 'New Smart Card DL issued with same validity as original licence.',
    notesTa: 'அசல் உரிமத்தின் அதே காலாவதி தேதியுடன் புதிய ஸ்மார்ட் கார்டு வழங்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Parivahan Sarathi (parivahan.gov.in)',
    officialPortalUrl: 'https://parivahan.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'RTO-605',
    category: 'transport_rto',
    department: 'Transport Department (RTO)',
    departmentTa: 'போக்குவரத்துத்துறை (RTO)',
    nameEn: 'Driving Licence Address Change',
    nameTa: 'ஓட்டுநர் உரிமத்தில் முகவரி மாற்றம்',
    descriptionEn: 'Update residential address in the Driving Licence and transfer driver record to the new jurisdictional RTO office.',
    descriptionTa: 'வீடு மாறும் போது ஓட்டுநர் உரிமத்தில் புதிய முகவரியை மாற்றுவதற்கான விண்ணப்பம்.',
    eligibilityEn: 'DL holders relocated to a new residential address.',
    eligibilityTa: 'வேறு பகுதிக்கு குடிபெயர்ந்த ஓட்டுநர் உரிமம் வைத்துள்ள நபர்கள்.',
    requiredDocuments: [
      'Driving Licence Details',
      'Aadhaar Card with Updated Current Address OR Passport / Voter ID',
      'Current Address Proof (EB bill / Rental Agreement / Gas bill)',
      'Applicant Passport Size Photo & Signature'
    ],
    requiredDocumentsTa: [
      'ஓட்டுநர் உரிம எண்',
      'புதிய முகவரியுடன் கூடிய ஆதார் அட்டை / பாஸ்போர்ட் / வாக்காளர் அட்டை',
      'தற்போதைய முகவரி ஆதாரம் (மின் கட்டணம் / வாடகை ஒப்பந்தம்)',
      'பாஸ்போர்ட் அளவு புகைப்படம் & கையொப்பம்'
    ],
    optionalDocuments: [],
    notesEn: 'Faceless online processing via Aadhaar authenticated Parivahan portal.',
    notesTa: 'ஆதார் அங்கீகாரம் மூலம் RTO அலுவலகம் செல்லாமல் ஆன்லைனில் மாற்றலாம்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Parivahan Sarathi (parivahan.gov.in)',
    officialPortalUrl: 'https://parivahan.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 7. REGISTRATION DEPARTMENT – TNREGINET (பதிவுத்துறை சேவைகள்)
  // =========================================================================
  {
    id: 'REG-701',
    category: 'registration_tnreginet',
    department: 'Registration Department',
    departmentTa: 'வணிகவரி மற்றும் பதிவுத்துறை',
    nameEn: 'Encumbrance Certificate (EC – Online Certified Copy)',
    nameTa: 'வில்லங்கச் சான்றிதழ் (EC – வில்லங்கம் பார்த்தல் & பதிவிறக்கம்)',
    descriptionEn: 'Instant search, verification and digitally certified download of property encumbrance records (EC) up to 1975 to current date from Sub-Registrar Office.',
    descriptionTa: 'சொத்தின் மீதான முந்தைய பத்திரப் பதிவுகள், அடமானங்கள் மற்றும் வில்லங்க விவரங்களை அறியவும், சான்றளிக்கப்பட்ட EC பதிவிறக்கவும் உதவும் சேவை.',
    eligibilityEn: 'Any citizen checking property title, buying real estate or availing bank loans.',
    eligibilityTa: 'சொத்து வாங்குபவர்கள், நில உரிமையாளர்கள் மற்றும் பொதுமக்கள் அனைவரும்.',
    requiredDocuments: [
      'Zone, District, and Sub-Registrar Office (SRO) Jurisdiction',
      'Village Name & Survey Number / Plot Number',
      'Search Period (From Date to To Date, e.g., 1987 to Current Year)',
      'Boundary Details / Document Number (if specific deed verification needed)'
    ],
    requiredDocumentsTa: [
      'மண்டலம், மாவட்டம் மற்றும் சார்பதிவாளர் அலுவலகம் (SRO)',
      'கிராமத்தின் பெயர், சர்வே எண் / மனை எண்',
      'தேட வேண்டிய காலம் (எ.கா. 1980 முதல் நடப்பு ஆண்டு வரை)',
      'நான்கு எல்லை விவரங்கள் / ஆவண எண் (தெரிந்திருப்பின்)'
    ],
    optionalDocuments: [],
    notesEn: 'Available instantly with government digital signature and QR verification.',
    notesTa: 'டிஜிட்டல் கையொப்பமிட்ட அதிகாரப்பூர்வ வில்லங்கச் சான்றிதழை உடனடியாகப் பெறலாம்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNREGINET (tnreginet.gov.in)',
    officialPortalUrl: 'https://tnreginet.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REG-702',
    category: 'registration_tnreginet',
    department: 'Registration Department',
    departmentTa: 'வணிகவரி மற்றும் பதிவுத்துறை',
    nameEn: 'Certified Copy of Registered Document (CC Copy)',
    nameTa: 'சான்றளிக்கப்பட்ட ஆவண நகல் (CC பத்திரம்)',
    descriptionEn: 'Apply and download official certified copy of registered Sale Deeds, Settlement, Partition, Mortgage or General Power Deeds from TNREGINET archives.',
    descriptionTa: 'சார்பதிவாளர் அலுவலகத்தில் பதிவு செய்யப்பட்ட கிரயப் பத்திரம், தானப் பத்திரம் போன்றவற்றின் அதிகாரப்பூர்வ சான்றளிக்கப்பட்ட நகல் பெறும் சேவை.',
    eligibilityEn: 'Property owners, legal heirs, buyers or advocates verifying registered deeds.',
    eligibilityTa: 'பத்திரத்தின் நகல் தேவைப்படும் உரிமையாளர்கள் மற்றும் பொதுமக்கள்.',
    requiredDocuments: [
      'Sub-Registrar Office (SRO) Name',
      'Document Number & Year of Registration (e.g. Doc No: 1234/2015)',
      'Book Number (Default Book 1 for immovable property)',
      'Applicant Aadhaar Card & Mobile Number'
    ],
    requiredDocumentsTa: [
      'பத்திரம் பதிவு செய்யப்பட்ட சார்பதிவாளர் அலுவலகத்தின் (SRO) பெயர்',
      'ஆவண எண் மற்றும் பதிவு செய்யப்பட்ட வருடம் (எ.கா: 1234/2015)',
      'புத்தக எண் (Book 1)',
      'விண்ணப்பதாரரின் ஆதார் அட்டை & தொலைபேசி எண்'
    ],
    optionalDocuments: [],
    notesEn: 'Signed certified digital PDF copy issued by Inspector General of Registration.',
    notesTa: 'பதிவுத்துறையின் அதிகாரப்பூர்வ டிஜிட்டல் முத்திரையுடன் கூடிய PDF பத்திரம் கிடைக்கும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNREGINET (tnreginet.gov.in)',
    officialPortalUrl: 'https://tnreginet.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REG-703',
    category: 'registration_tnreginet',
    department: 'Registration Department',
    departmentTa: 'வணிகவரி மற்றும் பதிவுத்துறை',
    nameEn: 'Marriage Registration Token & Application Booking',
    nameTa: 'திருமணப் பதிவு டோக்கன் & இணையவழி விண்ணப்பம்',
    descriptionEn: 'Online application data entry and appointment slot booking for Hindu Marriage Act or Special Marriage Act registration at Sub-Registrar Office.',
    descriptionTa: 'சார்பதிவாளர் அலுவலகத்தில் திருமணத்தைப் பதிவு செய்ய விண்ணப்பம் தயாரித்தல் மற்றும் நேரில் செல்ல டோக்கன் முன்பதிவு செய்தல்.',
    eligibilityEn: 'Married couples seeking legal marriage certificate under TN Marriage Registration Act.',
    eligibilityTa: 'திருமணம் செய்து கொண்ட தம்பதியினர்.',
    requiredDocuments: [
      'Aadhaar Cards of Bride and Groom (Bridegroom age 21+, Bride age 18+)',
      'Age Proof of Both: 10th TC / Mark Sheet / Birth Certificate / Passport',
      'Marriage Invitation Card & Marriage Photo (showing exchange of garlands/thali)',
      'Temple / Church / Mosque / Community Hall Marriage Receipt',
      'Aadhaar Cards of 3 Witnesses (with address proof)',
      'Joint Passport size photos of Bride & Groom'
    ],
    requiredDocumentsTa: [
      'மணமகன் மற்றும் மணமகளின் ஆதார் அட்டைகள் (மணமகன் 21+ வயது, மணமகள் 18+ வயது)',
      'இருவரின் வயது சான்றிதழ்: 10-ஆம் வகுப்பு TC / பிறப்புச் சான்றிதழ் / பாஸ்போர்ட்',
      'திருமண அழைப்பிதழ் & திருமணப் புகைப்படம் (மாலை மாற்றும் காட்சி)',
      'கோவில் / மண்டப திருமண ரசீது',
      'சாட்சிகள் 3 நபர்களின் ஆதார் அட்டை நகல்கள்',
      'மணமக்கள் பாஸ்போர்ட் அளவு புகைப்படங்கள்'
    ],
    optionalDocuments: ['Passport Copies (for NRI marriages)'],
    notesEn: 'Both spouses and 3 witnesses must appear before Sub-Registrar on the booked token date.',
    notesTa: 'டோக்கன் பெறப்பட்ட நாளில் தம்பதியினர் 3 சாட்சிகளுடன் சார்பதிவாளர் முன் நேரில் ஆஜராக வேண்டும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNREGINET (tnreginet.gov.in)',
    officialPortalUrl: 'https://tnreginet.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'REG-704',
    category: 'registration_tnreginet',
    department: 'Registration Department',
    departmentTa: 'வணிகவரி மற்றும் பதிவுத்துறை',
    nameEn: 'Document Registration Appointment Token Booking',
    nameTa: 'பத்திரப்பதிவு டோக்கன் முன்பதிவு (Document Registration Token)',
    descriptionEn: 'Online appointment token booking to present Sale Deeds, Settlement, Mortgage, or Lease Deeds before the Sub-Registrar without queue waiting.',
    descriptionTa: 'கிரயப்பத்திரம், தானப்பத்திரம் போன்றவற்றை சார்பதிவாளர் அலுவலகத்தில் பதிவு செய்ய முன்கூட்டியே டோக்கன் எடுக்கும் சேவை.',
    eligibilityEn: 'Property buyers, sellers, donors and deed executants.',
    eligibilityTa: 'பத்திரப்பதிவு செய்ய விரும்பும் வாங்குபவர் மற்றும் விற்பனையாளர்கள்.',
    requiredDocuments: [
      'Draft Deed Copy (Sale / Settlement / Partition / Lease)',
      'Aadhaar Cards & PAN Cards of Buyer and Seller',
      'Parent Title Documents, Patta & EC Copy',
      'Challan Payment Reference for Stamp Duty & Registration Fees',
      'SRO Office Name and Preferred Date/Time Slot'
    ],
    requiredDocumentsTa: [
      'தயாரிக்கப்பட்ட வரைவுப் பத்திரம் (Draft Deed)',
      'வாங்குபவர் மற்றும் விற்பவரின் ஆதார் & பான் கார்டுகள்',
      'தாய் பத்திரம், பட்டா மற்றும் வில்லங்கச் சான்றிதழ்',
      'முத்திரைத் தாள் & பதிவுக் கட்டணம் செலுத்திய ரசீது (e-Challan)',
      'சார்பதிவாளர் அலுவலகம் மற்றும் விரும்பிய தேதி/நேரம்'
    ],
    optionalDocuments: ['Building Evaluation Report (for apartments/commercial)'],
    notesEn: 'Guarantees priority queue time slot at the Sub-Registrar Office.',
    notesTa: 'முன்பதிவு செய்த குறிப்பிட்ட நேரத்தில் சார்பதிவாளர் அலுவலகத்தில் எளிதாகப் பதியலாம்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNREGINET (tnreginet.gov.in)',
    officialPortalUrl: 'https://tnreginet.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 8. SOCIAL WELFARE & WOMEN RIGHTS (சமூக நலம் & மகளிர் உரிமைத்துறை)
  // =========================================================================
  {
    id: 'SOC-801',
    category: 'social_welfare_women',
    department: 'Social Welfare & Women Empowerment',
    departmentTa: 'சமூக நலம் மற்றும் மகளிர் உரிமைத்துறை',
    nameEn: 'Moovalur Ramamirtham Ammaiyar Higher Education (Pudhumai Penn Scheme)',
    nameTa: 'புதுமைப் பெண் திட்டம் (மாதம் ₹1,000 கல்வி உதவி)',
    descriptionEn: 'Monthly financial assistance of ₹1,000 deposited directly into girl students’ bank accounts pursuing higher graduation after studying 6th to 12th in Government Schools.',
    descriptionTa: 'அரசுப் பள்ளிகளில் 6 முதல் 12-ஆம் வகுப்பு வரை படித்து உயர்கல்வி பயிலும் மாணவிகளுக்கு மாதம் ₹1,000 வழங்கும் திட்டம்.',
    eligibilityEn: 'Girl students enrolled in UG degree, diploma, ITI, or professional courses who completed schooling in TN government schools.',
    eligibilityTa: 'அரசுப் பள்ளியில் படித்து கல்லூரி/பட்டம்/டிப்ளமோ பயிலும் அனைத்து மாணவிகள்.',
    requiredDocuments: [
      'Student Aadhaar Card',
      '6th to 12th Government School Study Certificate (EMIS Bonafide signed by Headmaster)',
      'College Bonafide Certificate / Current Semester Fee Receipt',
      'Bank Account Passbook (Single account in student name with IFSC)',
      '10th and 12th Mark Sheets',
      'Passport size photograph'
    ],
    requiredDocumentsTa: [
      'மாணவியின் ஆதார் அட்டை',
      '6 முதல் 12-ஆம் வகுப்பு வரை அரசுப் பள்ளியில் படித்ததற்கான சான்றிதழ் (HM Bonafide)',
      'கல்லூரி சேர்க்கை சான்றிதழ் / Bonafide Certificate / கல்விக் கட்டண ரசீது',
      'மாணவியின் தனிப்பட்ட வங்கிக் கணக்கு புத்தக நகல்',
      '10 மற்றும் 12-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்கள்',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Family Card Copy'],
    notesEn: 'Credited directly on 7th of every month into student account through Aadhaar enabled payment system.',
    notesTa: 'மாதந்தோறும் ₹1,000 நேரடியாக மாணவியின் வங்கிக் கணக்கில் வரவு வைக்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Pudhumai Penn Portal / Social Welfare (pudhumaipenn.tn.gov.in)',
    officialPortalUrl: 'https://pudhumaipenn.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'SOC-802',
    category: 'social_welfare_women',
    department: 'Social Welfare & Women Empowerment',
    departmentTa: 'சமூக நலம் மற்றும் மகளிர் உரிமைத்துறை',
    nameEn: 'Tamil Pudhalvan Scheme (Higher Education for Boys)',
    nameTa: 'தமிழ்ப் புதல்வன் திட்டம் (மாணவர்களுக்கு மாதம் ₹1,000)',
    descriptionEn: 'Monthly scholarship of ₹1,000 for male students pursuing higher education degrees/diplomas who studied 6th to 12th in Tamil Nadu government schools.',
    descriptionTa: 'அரசுப் பள்ளிகளில் 6 முதல் 12-ஆம் வகுப்பு வரை படித்து கல்லூரிப் படிப்பு பயிலும் மாணவர்களுக்கு மாதம் ₹1,000 வழங்கும் திட்டம்.',
    eligibilityEn: 'Male students studying in collegiate / polytechnic / engineering courses with government schooling background.',
    eligibilityTa: 'அரசுப் பள்ளியில் படித்து கல்லூரி பயிலும் மாணவர்கள்.',
    requiredDocuments: [
      'Student Aadhaar Card',
      '6th to 12th Govt School Study Verification Certificate (EMIS Number)',
      'College Bonafide Certificate & Admission Proof',
      'Student Bank Passbook with IFSC',
      '10th & 12th Mark Sheets',
      'Passport size photograph'
    ],
    requiredDocumentsTa: [
      'மாணவரின் ஆதார் அட்டை',
      '6 முதல் 12-ஆம் வகுப்பு வரை அரசுப் பள்ளியில் படித்ததற்கான EMIS சான்று',
      'கல்லூரி Bonafide சான்றிதழ்',
      'மாணவரின் வங்கிக் கணக்கு புத்தக நகல்',
      '10 மற்றும் 12-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்கள்',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: [],
    notesEn: 'Disbursed directly via DBT every month.',
    notesTa: 'படிப்பை முடிக்கும் வரை மாதம் ₹1,000 வங்கிக் கணக்கில் வரவு வைக்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Tamil Pudhalvan Portal / Higher Education (tamilpudhalvan.tn.gov.in)',
    officialPortalUrl: 'https://tamilpudhalvan.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'SOC-803',
    category: 'social_welfare_women',
    department: 'Social Welfare & Women Empowerment',
    departmentTa: 'சமூக நலம் மற்றும் மகளிர் உரிமைத்துறை',
    nameEn: 'Chief Minister Girl Child Protection Scheme',
    nameTa: 'முதலமைச்சரின் பெண் குழந்தைகள் பாதுகாப்புத் திட்டம்',
    descriptionEn: 'Financial deposit scheme by Government of TN for poor families with only one or two girl children to encourage girl education and prevent female infanticide.',
    descriptionTa: 'ஒன்று அல்லது இரண்டு பெண் குழந்தைகள் மட்டுமே உள்ள ஏழைக் குடும்பங்களுக்கு அரசு நிதி வைப்புத்தொகை வழங்கும் திட்டம்.',
    eligibilityEn: 'Families with only 1 or 2 girl children and no male child, parent sterilized before age 35, family income within limit.',
    eligibilityTa: 'ஆண் குழந்தை இல்லாமல் 1 அல்லது 2 பெண் குழந்தைகள் மட்டுமே உள்ள குடும்பங்கள்.',
    requiredDocuments: [
      'Parents Aadhaar Cards',
      'Birth Certificates of Female Children',
      'Sterilization Certificate issued by Government Medical Officer',
      'Income Certificate from Tahsildar (below ₹72,000 per annum)',
      'No Male Child Certificate issued by Revenue Department',
      'Family Card / Smart Card Copy',
      'Passport size photo of Family with children'
    ],
    requiredDocumentsTa: [
      'பெற்றோரின் ஆதார் அட்டைகள்',
      'பெண் குழந்தைகளின் பிறப்புச் சான்றிதழ்கள்',
      'அரசு மருத்துவர் வழங்கிய குடும்பக் கட்டுப்பாடு அறுவை சிகிச்சை சான்றிதழ்',
      'வருமானச் சான்றிதழ் (ஆண்டு வருமானம் ₹72,000-க்குள்)',
      'ஆண் வாரிசு இல்லை என்பதற்கான வருவாய்த்துறைச் சான்றிதழ்',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'பெற்றோர் மற்றும் பெண் குழந்தைகள் இணைந்த குடும்பப் புகைப்படம்'
    ],
    optionalDocuments: [],
    notesEn: 'Fixed deposit bond matured and paid to girl child on completing 18 years for higher education.',
    notesTa: 'பெண் குழந்தைக்கு 18 வயது பூர்த்தியடையும் போது முதிர்வுத் தொகை உயர்கல்விக்காக வழங்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Social Welfare Department (tn.gov.in/socialwelfare)',
    officialPortalUrl: 'https://www.tn.gov.in/socialwelfare',
    lastVerified: '2026-09-03'
  },
  {
    id: 'SOC-804',
    category: 'social_welfare_women',
    department: 'Social Welfare & Women Empowerment',
    departmentTa: 'சமூக நலம் மற்றும் மகளிர் உரிமைத்துறை',
    nameEn: 'Free Sewing Machine Scheme (Sathiyavani Muthu Scheme)',
    nameTa: 'இலவச தையல் இயந்திரம் வழங்கும் திட்டம்',
    descriptionEn: 'Free motorized / manual sewing machines provided to destitute widows, deserted wives, differently abled women and poor craftswomen to generate self-employment.',
    descriptionTa: 'ஆதரவற்ற விதவைகள், கணவரால் கைவிடப்பட்ட பெண்கள் மற்றும் மாற்றுத்திறனாளி பெண்களுக்கு இலவச தையல் இயந்திரம் வழங்கும் திட்டம்.',
    eligibilityEn: 'Women aged 20 to 40 years with family income below poverty threshold knowing tailoring basics.',
    eligibilityTa: 'தையல் தெரிந்த 20 முதல் 40 வயதுக்குட்பட்ட ஏழை மற்றும் ஆதரவற்ற பெண்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Family Card / Smart Card',
      'Tailoring Course Completion / Competency Certificate from recognized institute',
      'Income Certificate from Tahsildar',
      'Category Proof: Destitute Widow / Deserted / Disability Certificate (if applicable)',
      'Age Proof (10th Mark Sheet / TC / Birth Proof)',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'தையல் பயிற்சி முடித்ததற்கான சான்றிதழ் (Tailoring Certificate)',
      'வருவாய்த்துறை வருமானச் சான்றிதழ்',
      'விதவை / கைவிடப்பட்டவர் / மாற்றுத்திறனாளி சான்றிதழ் (பொருந்துமாயின்)',
      'வயது சான்று (TC / பிறப்புச் சான்று)',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Community Certificate'],
    notesEn: 'Distributed through District Social Welfare Office (DSWO).',
    notesTa: 'மாவட்ட சமூக நல அலுவலர் மூலம் பயனாளிகளுக்கு தையல் இயந்திரம் வழங்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Social Welfare Department (tn.gov.in/socialwelfare)',
    officialPortalUrl: 'https://www.tn.gov.in/socialwelfare',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 9. DIFFERENTLY ABLED PERSONS WELFARE (மாற்றுத்திறனாளிகள் நலத்துறை)
  // =========================================================================
  {
    id: 'DAP-901',
    category: 'differently_abled',
    department: 'Welfare of Differently Abled Persons',
    departmentTa: 'மாற்றுத்திறனாளிகள் நலத்துறை',
    nameEn: 'UDID Unique Disability ID Card Registration',
    nameTa: 'தேசிய மாற்றுத்திறனாளி அடையாள அட்டை (UDID Card)',
    descriptionEn: 'Nationwide single smart card for persons with disabilities verifying disability percentage for all government concessions, travel passes, and job reservations.',
    descriptionTa: 'அனைத்து அரசு சலுகைகள் மற்றும் பயண சலுகைகளைப் பெற நாடு முழுவதும் செல்லுபடியாகும் தேசிய மாற்றுத்திறனாளி ஸ்மார்ட் அட்டை (UDID).',
    eligibilityEn: 'Any individual with physical, visual, hearing, intellectual or locational disability certified by Medical Board.',
    eligibilityTa: 'அரசு மருத்துவரால் சான்றளிக்கப்பட்ட அனைத்து மாற்றுத்திறனாளிகள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Existing State Disability Certificate / ID Book (if previously issued)',
      'Medical Assessment Form signed by District Medical Board Doctor',
      'Passport size photograph showing disability',
      'Signature or Thumb Impression Specimen',
      'Address Proof & Blood Group Details'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'முந்தைய மாற்றுத்திறனாளி அடையாள அட்டை / புத்தகம் (இருப்பின்)',
      'மாவட்ட மருத்துவக் குழு வழங்கிய மருத்துவப் பரிசோதனைச் சான்று',
      'பாஸ்போர்ட் அளவு புகைப்படம் (மாற்றுத்திறன் தெரியுமாறு)',
      'கையொப்பம் அல்லது கைரேகை மாதிரி',
      'முகவரிச் சான்று & இரத்தப் பிரிவு விவரம்'
    ],
    optionalDocuments: [],
    notesEn: 'UDID Smart Card dispatched to home address by Department of Empowerment of PwD, Govt of India.',
    notesTa: 'மத்திய அரசின் மாற்றுத்திறனாளிகள் நலத்துறை மூலம் ஸ்மார்ட் கார்டு அஞ்சலில் அனுப்பப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Swavlamban Card / UDID Portal (swavlambancard.gov.in)',
    officialPortalUrl: 'https://www.swavlambancard.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'DAP-902',
    category: 'differently_abled',
    department: 'Welfare of Differently Abled Persons',
    departmentTa: 'மாற்றுத்திறனாளிகள் நலத்துறை',
    nameEn: 'Marriage Assistance for Differently Abled Persons',
    nameTa: 'மாற்றுத்திறனாளிகள் திருமண நிதியுதவித் திட்டம்',
    descriptionEn: 'Financial assistance of ₹25,000 to ₹50,000 and 8 grams sovereign gold coin provided by Government of TN for marriages involving differently abled individuals.',
    descriptionTa: 'மாற்றுத்திறனாளிகள் திருமணம் செய்துகொள்ளும்போது அரசு வழங்கும் நிதி உதவி மற்றும் திருமாங்கல்யத்திற்கான தங்க நாணயம்.',
    eligibilityEn: 'Either one spouse or both spouses having disability with valid UDID card.',
    eligibilityTa: 'தம்பதியரில் ஒருவர் அல்லது இருவருமே மாற்றுத்திறனாளியாக உள்ள தம்பதியினர்.',
    requiredDocuments: [
      'Marriage Registration Certificate',
      'National Disability Identity Card (UDID) of the Person with Disability',
      'Aadhaar Cards of Bride and Groom',
      'Age Proof (Bride 18+, Groom 21+)',
      'Educational Certificates (for higher grant category)',
      'Joint Passport Size Photo & Marriage Photo',
      'Bank Account Passbook Copy'
    ],
    requiredDocumentsTa: [
      'பதிவு செய்யப்பட்ட திருமணச் சான்றிதழ்',
      'மாற்றுத்திறனாளி தேசிய அடையாள அட்டை (UDID)',
      'மணமகன் மற்றும் மணமகளின் ஆதார் அட்டைகள்',
      'வயது சான்றிதழ் (மணமகள் 18+, மணமகன் 21+)',
      'கல்விச் சான்றிதழ்கள் (பட்டதாரிகளுக்கு கூடுதல் தொகை பெற)',
      'தம்பதியரின் கூட்டு பாஸ்போர்ட் புகைப்படம் & திருமணப் புகைப்படம்',
      'வங்கிக் கணக்கு புத்தக நகல்'
    ],
    optionalDocuments: [],
    notesEn: 'Application must be submitted within 2 years from the date of marriage.',
    notesTa: 'திருமணம் முடிந்த 2 ஆண்டுகளுக்குள் மாவட்ட மாற்றுத்திறனாளிகள் நல அலுவலகத்தில் சமர்ப்பிக்க வேண்டும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Differently Abled Welfare Dept (tn.gov.in)',
    officialPortalUrl: 'https://www.tn.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 10. MUNICIPALITY & LOCAL BODY SERVICES (நகராட்சி & உள்ளாட்சி சேவைகள்)
  // =========================================================================
  {
    id: 'MUN-1001',
    category: 'municipality_corporation',
    department: 'Municipal Administration & Water Supply',
    departmentTa: 'நகராட்சி நிர்வாகம் மற்றும் குடிநீர் வழங்கல் துறை',
    nameEn: 'Property Tax Online Payment (Corporation / Municipality / Town Panchayat)',
    nameTa: 'சொத்துவரி ஆன்லைன் செலுத்துதல்',
    descriptionEn: 'Instant online payment of half-yearly Property Tax assessments for residential and commercial properties in Tamil Nadu urban local bodies.',
    descriptionTa: 'நகராட்சி, மாநகராட்சி மற்றும் பேரூராட்சிகளில் உள்ள வீடுகள் மற்றும் கடைகளுக்கான அரையாண்டு சொத்துவரியை ஆன்லைனில் செலுத்தும் சேவை.',
    eligibilityEn: 'All assessed building and property owners in urban local bodies.',
    eligibilityTa: 'சொத்துவரி மதிப்பீட்டு எண் உள்ள அனைத்து சொத்து உரிமையாளர்கள்.',
    requiredDocuments: [
      'Assessment Number / Old Assessment Number',
      'District and Municipality / Corporation / Town Panchayat Name',
      'Owner Mobile Number for Receipt SMS'
    ],
    requiredDocumentsTa: [
      'சொத்துவரி மதிப்பீட்டு எண் (Assessment Number)',
      'மாவட்டம் மற்றும் மாநகராட்சி / நகராட்சி / பேரூராட்சி பெயர்',
      'ரசீது பெற மொபைல் எண்'
    ],
    optionalDocuments: [],
    notesEn: 'Generates official municipal payment receipt valid for bank loans and utility services.',
    notesTa: 'உடனடி நகராட்சி கட்டண ரசீது கிடைக்கும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TN Urban E-Pay (tnurbanepay.tn.gov.in)',
    officialPortalUrl: 'https://tnurbanepay.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'MUN-1002',
    category: 'municipality_corporation',
    department: 'Municipal Administration & Water Supply',
    departmentTa: 'நகராட்சி நிர்வாகம் மற்றும் குடிநீர் வழங்கல் துறை',
    nameEn: 'Property Tax Name Transfer Application',
    nameTa: 'சொத்துவரி பெயர் மாற்றம் (நகராட்சி / மாநகராட்சி)',
    descriptionEn: 'Application to transfer the property tax assessment name in municipal records to the new buyer following property purchase or inheritance.',
    descriptionTa: 'சொத்து வாங்கிய பின் நகராட்சி வரிப் பதிவேட்டில் பழைய உரிமையாளர் பெயரை நீக்கி புதிய உரிமையாளர் பெயரைப் பதிவு செய்தல்.',
    eligibilityEn: 'Property buyers holding registered sale deed in municipal / corporation limits.',
    eligibilityTa: 'நகராட்சி வரம்பிற்குள் சொத்து வாங்கிய புதிய உரிமையாளர்கள்.',
    requiredDocuments: [
      'Registered Sale Deed / Title Deed Copy',
      'Latest Paid Property Tax Receipt',
      'Patta Copy / TSLR Extract in New Owner Name',
      'Encumbrance Certificate (EC)',
      'Applicant Aadhaar Card'
    ],
    requiredDocumentsTa: [
      'பதிவு செய்யப்பட்ட கிரயப் பத்திரம் / செட்டில்மெண்ட் பத்திரம்',
      'கடைசியாக செலுத்திய சொத்துவரி ரசீது',
      'புதிய உரிமையாளர் பெயரில் உள்ள பட்டா / TSLR நகல்',
      'வில்லங்கச் சான்றிதழ் (EC)',
      'விண்ணப்பதாரர் ஆதார் அட்டை'
    ],
    optionalDocuments: ['Building Approval Plan'],
    notesEn: 'Processed by Revenue Inspector / Municipal Commissioner after field valuation.',
    notesTa: 'நகராட்சி வருவாய் ஆய்வாளர் பரிசீலனைக்குப் பின் புதிய வரிப் புத்தகம் வழங்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TN Urban E-Pay (tnurbanepay.tn.gov.in)',
    officialPortalUrl: 'https://tnurbanepay.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'MUN-1003',
    category: 'municipality_corporation',
    department: 'Municipal Administration & Water Supply',
    departmentTa: 'நகராட்சி நிர்வாகம் மற்றும் குடிநீர் வழங்கல் துறை',
    nameEn: 'New Drinking Water & Underground Drainage (UGD) Connection',
    nameTa: 'புதிய குடிநீர் இணைப்பு & பாதாள சாக்கடை இணைப்பு',
    descriptionEn: 'Apply for fresh municipal drinking water pipeline tap and underground sewerage connection for residential or commercial buildings.',
    descriptionTa: 'வீடுகள் மற்றும் வணிகக் கட்டிடங்களுக்கு நகராட்சி குடிநீர் குழாய் இணைப்பு மற்றும் பாதாள சாக்கடை இணைப்பு கோரி விண்ணப்பித்தல்.',
    eligibilityEn: 'Building owners in municipal and corporation areas with active property tax assessment.',
    eligibilityTa: 'சொத்துவரி செலுத்தும் கட்டிட உரிமையாளர்கள்.',
    requiredDocuments: [
      'Current Paid Property Tax Receipt Copy',
      'Property Ownership Document (Sale Deed / Patta)',
      'Approved Building Plan Copy from Local Body',
      'Plumbing Diagram / Sketch showing distance from main pipeline',
      'Applicant Aadhaar Card & Contact Number'
    ],
    requiredDocumentsTa: [
      'நடப்பு சொத்துவரி செலுத்திய ரசீது நகல்',
      'சொத்து உரிமை ஆவணம் (கிரயப் பத்திரம் / பட்டா)',
      'அங்கீகரிக்கப்பட்ட கட்டிட வரைபடம்',
      'மெயின் குழாயிலிருந்து இணைப்பு பெறும் வரைபடம்',
      'விண்ணப்பதாரர் ஆதார் அட்டை'
    ],
    optionalDocuments: ['Nearby consumer water connection number'],
    notesEn: 'Connection charges and meter deposit estimated by Municipal Engineer.',
    notesTa: 'நகராட்சி பொறியாளர் ஆய்வு செய்து இணைப்பு மதிப்பீட்டுக் கட்டணம் வழங்குவார்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TN Urban E-Pay (tnurbanepay.tn.gov.in)',
    officialPortalUrl: 'https://tnurbanepay.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'MUN-1004',
    category: 'municipality_corporation',
    department: 'Municipal Administration & Public Health',
    departmentTa: 'பொது சுகாதாரத்துறை / உள்ளாட்சி',
    nameEn: 'Birth & Death Certificate Download & Correction Assistance',
    nameTa: 'பிறப்பு / இறப்புச் சான்றிதழ் பதிவிறக்கம் & திருத்தம்',
    descriptionEn: 'Instant search, view and download of digitally signed Birth and Death certificates registered in Tamil Nadu hospitals, municipalities and corporations.',
    descriptionTa: 'தமிழ்நாட்டில் பதிவு செய்யப்பட்ட அதிகாரப்பூர்வ பிறப்பு மற்றும் இறப்பு சான்றிதழ்களை டிஜிட்டல் முறையில் பதிவிறக்கம் செய்தல்.',
    eligibilityEn: 'Parents, legal heirs, relatives and citizens registered in Civil Registration System.',
    eligibilityTa: 'பொதுமக்கள் அனைவரும்.',
    requiredDocuments: [
      'Date of Birth / Death',
      'Gender (Male / Female / Transgender)',
      'District and Hospital / Town / Corporation Name',
      'Mother / Father / Deceased Name',
      'For Child Name Inclusion: Parents Aadhaar Card & Hospital Discharge Summary'
    ],
    requiredDocumentsTa: [
      'பிறந்த / இறந்த தேதி',
      'பாலினம் (ஆண் / பெண்)',
      'பிறந்த / இறந்த இடம் (மருத்துவமனை / நகரம் / கிராமம்)',
      'தாய் / தந்தை அல்லது இறந்தவரின் பெயர்',
      'பெயர் சேர்க்க: பெற்றோரின் ஆதார் அட்டை & மருத்துவமனை அறிக்கை'
    ],
    optionalDocuments: [],
    notesEn: 'Hospital births are registered within 21 days by CRS. Downloadable with official QR code.',
    notesTa: 'QR குறியீட்டுடன் கூடிய அரசு சான்றிதழை உடனே பதிவிறக்கம் செய்யலாம்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Civil Registration System / Town Panchayat (crstn.org)',
    officialPortalUrl: 'https://www.crstn.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'MUN-1005',
    category: 'municipality_corporation',
    department: 'Municipal Administration',
    departmentTa: 'நகராட்சி நிர்வாகம்',
    nameEn: 'Trade Licence (D&O Licence) New Application & Renewal',
    nameTa: 'தொழில் உரிமம் (Trade Licence) புதியது & புதுப்பித்தல்',
    descriptionEn: 'Apply for Dangerous and Offensive (D&O) Trade Licence mandatory for running shops, manufacturing units, hotels, bakeries, and commercial establishments.',
    descriptionTa: 'கடைகள், வணிக நிறுவனங்கள் மற்றும் தொழிற்சாலைகள் நடத்த நகராட்சி/மாநகராட்சியில் கட்டாயமாகப் பெற வேண்டிய தொழில் உரிமம்.',
    eligibilityEn: 'Business owners, shopkeepers, commercial establishment operators.',
    eligibilityTa: 'வணிக நிறுவனங்கள் மற்றும் கடை நடத்துவோர்.',
    requiredDocuments: [
      'Applicant Aadhaar Card & PAN Card',
      'Business Premise Rental Agreement OR Property Tax Receipt of the building',
      'Building Approval Plan / Layout Sketch of the Shop',
      'Fire Safety NOC (for eateries, hazardous trades, factories)',
      'FSSAI Licence (for food establishments)',
      'Passport size photograph of the Business Owner'
    ],
    requiredDocumentsTa: [
      'வணிக உரிமையாளரின் ஆதார் அட்டை & பான் கார்டு',
      'கடை வாடகை ஒப்பந்தப் பத்திரம் அல்லது கட்டிட சொத்துவரி ரசீது',
      'கடையின் வரைபடம் / கட்டிட அனுமதி நகல்',
      'தீயணைப்புத்துறை தடையில்லாச் சான்று (NOC) (உணவகங்கள்/தொழிற்சாலைகளுக்கு)',
      'FSSAI உணவு உரிமம் (உணவு வணிகங்களுக்கு)',
      'உரிமையாளரின் பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Pollution Control Board Consent (for industrial trades)'],
    notesEn: 'Renewable annually before April 30th to avoid statutory penalty.',
    notesTa: 'ஆண்டுதோறும் புதுப்பிக்கப்பட வேண்டும்.',
    variableRequirements: true,
    variableRequirementsNoteTa: 'தொழிலின் வகைக்கு ஏற்ப (உணவகம், பட்டறை, மருந்தகம்) கூடுதல் அனுமதிகள் தேவைப்படும்.',
    serviceType: 'e-Sevai Service',
    officialSource: 'TN Urban E-Pay (tnurbanepay.tn.gov.in)',
    officialPortalUrl: 'https://tnurbanepay.tn.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 11. POLICE DEPARTMENT – CCTNS (காவல்துறை சேவைகள்)
  // =========================================================================
  {
    id: 'POL-1101',
    category: 'police_cctns',
    department: 'Tamil Nadu Police (CCTNS)',
    departmentTa: 'தமிழ்நாடு காவல்துறை (CCTNS)',
    nameEn: 'Online Police Complaint Registration & CSR Tracking',
    nameTa: 'காவல்துறை இணையவழி புகார் பதிவு & CSR நிலை அறிதல்',
    descriptionEn: 'File non-cognizable / general grievances online to jurisdictional Police Station and download Community Service Register (CSR) acknowledgement receipt.',
    descriptionTa: 'காவல் நிலையத்திற்கு செல்லாமல் இணையவழியில் புகார் அளித்து CSR ரசீது பெறும் சேவை.',
    eligibilityEn: 'Any citizen residing in or affected by an incident in Tamil Nadu.',
    eligibilityTa: 'பொதுமக்கள் அனைவரும்.',
    requiredDocuments: [
      'Complainant Aadhaar Card & Contact Number',
      'Detailed Incident Description (Date, Time, Place and Facts)',
      'Opposite Party / Accused details (if known)',
      'Supporting Evidence: Photos / Audio / Video / Bank Statement (for cyber/financial fraud)'
    ],
    requiredDocumentsTa: [
      'புகார்தாரரின் ஆதார் அட்டை & மொபைல் எண்',
      'சம்பவத்தின் முழு விவரம் (நாள், நேரம், இடம் மற்றும் காரணம்)',
      'எதிர் தரப்பினர் / சந்தேக நபர் விவரங்கள் (தெரிந்திருப்பின்)',
      'ஆதார ஆவணங்கள்: புகைப்படங்கள் / ஆடியோ / வங்கி ரசீது (சைபர் மோசடிகளுக்கு)'
    ],
    optionalDocuments: [],
    notesEn: 'Instant online CSR number generated and assigned to Station House Officer (SHO).',
    notesTa: 'உடனடி CSR எண் ஒதுக்கப்பட்டு சம்பந்தப்பட்ட காவல் நிலையத்திற்கு விசாரணைக்கு அனுப்பப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Tamil Nadu Police Citizen Portal (eservices.tnpolice.gov.in)',
    officialPortalUrl: 'https://eservices.tnpolice.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'POL-1102',
    category: 'police_cctns',
    department: 'Tamil Nadu Police (CCTNS)',
    departmentTa: 'தமிழ்நாடு காவல்துறை (CCTNS)',
    nameEn: 'Lost Document Report (LDR – Non-Traceable Certificate)',
    nameTa: 'தொலைந்த ஆவண அறிக்கை (LDR சான்றிதழ்)',
    descriptionEn: 'Apply and receive official Police Lost Document Report (LDR) for misplaced original documents (RC Book, Driving Licence, Mark Sheets, Passport, Land Deed).',
    descriptionTa: 'சான்றிதழ்கள், ஆர்.சி புக், ஓட்டுநர் உரிமம், பாஸ்போர்ட் தொலைந்து போனால் காவல் துறையிடம் LDR சான்றிதழ் பெறும் சேவை.',
    eligibilityEn: 'Individuals who lost vital identity, educational or property documents in Tamil Nadu.',
    eligibilityTa: 'ஆவணங்களைத் தவறவிட்ட பொதுமக்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card & Mobile Number',
      'Lost Document Details (Document Type, Number, Issuing Authority)',
      'Copy of the Lost Document (if available)',
      'Self-Declaration of loss circumstances'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை & தொலைபேசி எண்',
      'தொலைந்த ஆவணத்தின் விவரம் (ஆவண வகை, எண், வழங்கிய அமைப்பு)',
      'தொலைந்த ஆவணத்தின் முந்தைய நகல் (இருப்பின்)',
      'ஆவணம் தொலைந்துவிட்டது என்பதற்கான சுய உறுதிமொழி'
    ],
    optionalDocuments: [],
    notesEn: 'Instant digitally verified police report accepted by RTO, University and Passport authorities for duplicate issue.',
    notesTa: 'RTO மற்றும் பல்கலைக்கழகங்களில் நகல் சான்றிதழ் பெற இந்த LDR சான்றிதழ் கட்டாயம்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TN Police Citizen Portal (eservices.tnpolice.gov.in)',
    officialPortalUrl: 'https://eservices.tnpolice.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'POL-1103',
    category: 'police_cctns',
    department: 'Tamil Nadu Police (CCTNS)',
    departmentTa: 'தமிழ்நாடு காவல்துறை (CCTNS)',
    nameEn: 'Police Verification Report (PVR – Job / Tenant / Domestic Help)',
    nameTa: 'காவல்துறை நடத்தைச் சான்றிதழ் (Police Verification Report)',
    descriptionEn: 'Official police background verification check confirming no criminal record, required for IT jobs, private security, school staff, and tenant screening.',
    descriptionTa: 'வேலைவாய்ப்பு, வெளிநாட்டுப் பணி மற்றும் வாடகைதாரர் சரிபார்ப்பிற்காக குற்றப் பின்னணி இல்லை என காவல்துறை வழங்கும் சான்றிதழ்.',
    eligibilityEn: 'Job applicants, tenants, domestic workers or employers seeking background verification.',
    eligibilityTa: 'வேலைவாய்ப்பு மற்றும் வெளிநாடு செல்ல விரும்புவோர்.',
    requiredDocuments: [
      'Applicant Aadhaar Card & Voter ID',
      'Current Address Proof & Native Address Proof',
      'Applicant Passport Size Photo',
      'Employer / Institution Request Letter (for job verification)',
      'Applicant Consent Declaration'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை & வாக்காளர் அட்டை',
      'தற்போதைய முகவரி மற்றும் பூர்வீக முகவரி சான்றுகள்',
      'பாஸ்போர்ட் அளவு புகைப்படம்',
      'நிறுவனத்தின் சரிபார்ப்புக் கடிதம் (வேலைக்கு விண்ணப்பிப்பவராயின்)',
      'சுய ஒப்புதல் கடிதம்'
    ],
    optionalDocuments: ['Passport Copy'],
    notesEn: 'Government verification fee payable online. Certificate generated following Special Branch / Station verification.',
    notesTa: 'காவல் நிலைய மற்றும் சிறப்புப் பிரிவு ஆய்வுக்குப் பின் டிஜிட்டல் சான்றிதழ் வழங்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TN Police Citizen Portal (eservices.tnpolice.gov.in)',
    officialPortalUrl: 'https://eservices.tnpolice.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'POL-1104',
    category: 'police_cctns',
    department: 'Tamil Nadu Police (CCTNS)',
    departmentTa: 'தமிழ்நாடு காவல்துறை (CCTNS)',
    nameEn: 'View FIR Status & Download Copy',
    nameTa: 'முதல் தகவல் அறிக்கை (FIR) பார்வையிட & பதிவிறக்கம்',
    descriptionEn: 'Search, track live status and download publicly registered First Information Report (FIR) copies across Tamil Nadu police stations.',
    descriptionTa: 'பதிவு செய்யப்பட்ட முதல் தகவல் அறிக்கையின் (FIR) நிலையை அறிந்து அதன் நகலை பதிவிறக்கம் செய்யும் சேவை.',
    eligibilityEn: 'Complainants, victims, legal representatives or authorized parties.',
    eligibilityTa: 'புகார்தாரர்கள் மற்றும் பொதுமக்கள்.',
    requiredDocuments: [
      'District and Police Station Name',
      'FIR Number & Year OR Complainant / Accused Name',
      'Date of Occurrence / Registration',
      'Mobile Number for OTP validation'
    ],
    requiredDocumentsTa: [
      'மாவட்டம் மற்றும் காவல் நிலையத்தின் பெயர்',
      'FIR எண் மற்றும் வருடம் அல்லது புகார்தாரர் பெயர்',
      'சம்பவம் நடந்த தேதி',
      'மொபைல் எண் (OTP சரிபார்ப்புக்கு)'
    ],
    optionalDocuments: [],
    notesEn: 'Excludes sensitive and protected legal matters as per High Court guidelines.',
    notesTa: 'நீதிமன்ற வழிகாட்டுதலின்படி பொது பார்வைக்கான FIR நகல்கள் கிடைக்கும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TN Police (eservices.tnpolice.gov.in)',
    officialPortalUrl: 'https://eservices.tnpolice.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 12. EMPLOYMENT & TRAINING (வேலைவாய்ப்பு & பயிற்சித்துறை)
  // =========================================================================
  {
    id: 'EMP-1201',
    category: 'employment_training',
    department: 'Department of Employment and Training',
    departmentTa: 'வேலைவாய்ப்பு மற்றும் பயிற்சித்துறை',
    nameEn: 'New Employment Exchange Registration',
    nameTa: 'வேலைவாய்ப்பு அலுவலக புதிய பதிவு',
    descriptionEn: 'Register SSLC / HSC / ITI / Diploma / Degree educational qualifications in Tamil Nadu District Employment Exchange for government seniority and job matching.',
    descriptionTa: '10, 12, பட்டப்படிப்பு மற்றும் தொழிற்கல்வி சான்றிதழ்களை மாவட்ட வேலைவாய்ப்பு அலுவலகத்தில் பதிவு செய்து பதிவு மூப்பு (Seniority) பெறும் சேவை.',
    eligibilityEn: 'Candidates completed 10th standard or higher qualification residing in Tamil Nadu.',
    eligibilityTa: '10-ஆம் வகுப்பு அல்லது அதற்கு மேல் படித்த தமிழ்நாட்டு மாணவர்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Family Card / Smart Ration Card (residence proof)',
      '10th / SSLC Mark Sheet (Mandatory base qualification)',
      'Higher Secondary (12th) / ITI / Diploma Mark Sheets (if applicable)',
      'Undergraduate (UG) / Postgraduate (PG) Provisional or Degree Certificate (if applicable)',
      'Community Certificate (for caste seniority reservation)',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      '10-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ் (அடிப்படை)',
      '12-ஆம் வகுப்பு / ITI / டிப்ளமோ மதிப்பெண் சான்றிதழ்கள்',
      'பட்டப்படிப்பு / முதுகலை தற்காலிக அல்லது பட்டச் சான்றிதழ்',
      'சாதிச் சான்றிதழ் (இடஒதுக்கீடு மூப்புக்கு)',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Typing / Shorthand / Computer Certificate', 'Differently Abled ID (for priority quota)'],
    notesEn: 'Generates official Employment Registration Card with Registration Number and Renewal Due Date.',
    notesTa: 'பதிவு எண் மற்றும் புதுப்பிக்கும் தேதியுடன் கூடிய அதிகாரப்பூர்வ வேலைவாய்ப்பு பதிவு அட்டை கிடைக்கும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TN Employment Portal (employmentexchange.tn.gov.in)',
    officialPortalUrl: 'https://employmentexchange.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'EMP-1202',
    category: 'employment_training',
    department: 'Department of Employment and Training',
    departmentTa: 'வேலைவாய்ப்பு மற்றும் பயிற்சித்துறை',
    nameEn: 'Employment Qualification Addition / Profile Update',
    nameTa: 'வேலைவாய்ப்பு கூடுதல் கல்வித் தகுதி சேர்த்தல்',
    descriptionEn: 'Add newly acquired degrees, B.Ed, Master Degrees, Typewriting or Driver licences to existing Employment Registration without losing prior seniority.',
    descriptionTa: 'முந்தைய பதிவு மூப்பு மாறாமல் புதிதாக முடித்த பட்டப்படிப்பு, B.Ed, தட்டச்சு போன்ற கூடுதல் தகுதிகளை இணைக்கும் சேவை.',
    eligibilityEn: 'Existing Employment Registration card holders who completed additional degrees.',
    eligibilityTa: 'ஏற்கனவே பதிவு செய்து புதிய படிப்பு முடித்த நபர்கள்.',
    requiredDocuments: [
      'Existing Employment Registration Card / Registration Number',
      'New Educational Degree / Provisional / Mark Sheet Copy',
      'Applicant Aadhaar Card',
      'Community Certificate (if updating)'
    ],
    requiredDocumentsTa: [
      'தற்போதைய வேலைவாய்ப்பு பதிவு அட்டை / பதிவு எண்',
      'புதிதாக முடித்த கல்விச் சான்றிதழ் / தற்காலிகச் சான்றிதழ் நகல்',
      'விண்ணப்பதாரர் ஆதார் அட்டை',
      'சாதிச் சான்றிதழ்'
    ],
    optionalDocuments: [],
    notesEn: 'Additional qualification seniority counted from the date of profile update.',
    notesTa: 'புதிய கல்வித் தகுதிக்கான மூப்பு பதிவு செய்த நாளிலிருந்து கணக்கிடப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TN Employment Portal (employmentexchange.tn.gov.in)',
    officialPortalUrl: 'https://employmentexchange.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'EMP-1203',
    category: 'employment_training',
    department: 'Department of Employment and Training',
    departmentTa: 'வேலைவாய்ப்பு மற்றும் பயிற்சித்துறை',
    nameEn: 'Employment Registration Renewal & Duplicate Card Print',
    nameTa: 'வேலைவாய்ப்பு பதிவு புதுப்பித்தல் & அட்டை அச்சிடுதல்',
    descriptionEn: 'Renew employment registration seniority within the 3-year validity cycle or reprint misplaced registration identity cards.',
    descriptionTa: '3 ஆண்டுகளுக்கு ஒருமுறை வேலைவாய்ப்பு பதிவை புதுப்பித்து மூப்பினைத் தக்கவைத்தல் மற்றும் அட்டை அச்சிடுதல்.',
    eligibilityEn: 'Registered jobseekers due for renewal or within grace period.',
    eligibilityTa: 'புதுப்பிக்கும் காலம் வந்த பதிவுதாரர்கள்.',
    requiredDocuments: [
      'Employment Registration Number & Date of Birth',
      'Applicant Aadhaar Card'
    ],
    requiredDocumentsTa: [
      'வேலைவாய்ப்பு பதிவு எண் & பிறந்த தேதி',
      'விண்ணப்பதாரர் ஆதார் அட்டை'
    ],
    optionalDocuments: [],
    notesEn: 'Renewal is valid for next 3 years. Government concessions apply during special concession windows.',
    notesTa: 'புதுப்பித்த நாளிலிருந்து அடுத்த 3 ஆண்டுகளுக்குப் பதிவு செல்லுபடியாகும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TN Employment Portal (employmentexchange.tn.gov.in)',
    officialPortalUrl: 'https://employmentexchange.tn.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 13. EDUCATION & ADMISSIONS (கல்வி & கல்லூரி சேர்க்கை சேவைகள்)
  // =========================================================================
  {
    id: 'EDU-1301',
    category: 'education_admissions',
    department: 'Directorate of Technical Education (DoTE)',
    departmentTa: 'தொழில்நுட்பக் கல்வி இயக்ககம் (DoTE)',
    nameEn: 'TNEA Engineering Admission Online Registration',
    nameTa: 'TNEA பொறியியல் கல்லூரி சேர்க்கை விண்ணப்பம்',
    descriptionEn: 'Online registration, choice filling, document upload and counseling facilitation for B.E / B.Tech engineering admissions across Tamil Nadu colleges.',
    descriptionTa: 'தமிழக பொறியியல் கல்லூரிகளில் B.E / B.Tech பட்டப்படிப்பில் சேர TNEA கலந்தாய்வு விண்ணப்பப் பதிவு மற்றும் சான்றிதழ் பதிவேற்றம்.',
    eligibilityEn: 'Students who passed 12th standard (HSC) with Mathematics, Physics and Chemistry (MPC).',
    eligibilityTa: '12-ஆம் வகுப்பில் கணிதம், இயற்பியல், வேதியியல் பயின்று தேர்ச்சி பெற்ற மாணவர்கள்.',
    requiredDocuments: [
      'Student 10th and 12th Standard Mark Sheets',
      '12th Standard Hall Ticket / Registration Number',
      'Transfer Certificate (TC)',
      'Community Certificate (for BC / MBC / SC / ST reservation)',
      'Nativity Certificate (if 8th to 12th studied outside TN)',
      'First Graduate Certificate & Joint Declaration (if claiming fee waiver)',
      'Special Reservation Certificate (Sports / Ex-Serviceman / Differently Abled if applicable)',
      'Student Aadhaar Card & Passport size photograph'
    ],
    requiredDocumentsTa: [
      '10 மற்றும் 12-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்கள்',
      '12-ஆம் வகுப்பு தேர்வு நுழைவுச்சீட்டு (Hall Ticket)',
      'பள்ளி மாற்றுச் சான்றிதழ் (TC)',
      'சாதிச் சான்றிதழ் (இடஒதுக்கீடு சலுகை பெற)',
      'பிறப்பிடச் சான்றிதழ் (வெளிமாநிலத்தில் படித்தவராயின்)',
      'முதல் பட்டதாரி சான்றிதழ் (கல்விக் கட்டணச் சலுகை பெற)',
      'சிறப்பு இடஒதுக்கீட்டுச் சான்றிதழ் (விளையாட்டு / முன்னாள் ராணுவத்தினர் / மாற்றுத்திறனாளி)',
      'மாணவரின் ஆதார் அட்டை & புகைப்படம்'
    ],
    optionalDocuments: ['Income Certificate (for Post-Matric SC/ST scholarship)'],
    notesEn: 'Anna University single-window centralized online counseling system.',
    notesTa: 'அண்ணா பல்கலைக்கழகத்தின் ஒற்றைச் சாளர இணையவழி கலந்தாய்வு.',
    variableRequirements: true,
    variableRequirementsNoteTa: 'சிறப்பு இடஒதுக்கீடு (7.5% அரசுப் பள்ளி, விளையாட்டு, மாற்றுத்திறனாளி) கோரினால் அதற்கான சான்றுகள் தேவை.',
    serviceType: 'e-Sevai Service',
    officialSource: 'TNEA Online Portal (tneaonline.org)',
    officialPortalUrl: 'https://www.tneaonline.org',
    lastVerified: '2026-09-03'
  },
  {
    id: 'EDU-1302',
    category: 'education_admissions',
    department: 'Directorate of Collegiate Education (DCE)',
    departmentTa: 'கல்லூரிக் கல்வி இயக்ககம் (DCE)',
    nameEn: 'TNGASA Arts & Science College Admission Registration',
    nameTa: 'TNGASA அரசு கலை மற்றும் அறிவியல் கல்லூரி சேர்க்கை',
    descriptionEn: 'Single window online admission registration for all Government Arts and Science Colleges in Tamil Nadu for BA / BSc / BCom / BBA / BCA courses.',
    descriptionTa: 'தமிழ்நாட்டில் உள்ள அனைத்து அரசு கலை மற்றும் அறிவியல் கல்லூரிகளில் பட்டப்படிப்பில் சேருவதற்கான ஒற்றைச் சாளர விண்ணப்பப் பதிவு.',
    eligibilityEn: 'Students passed 12th standard (HSC) in Arts, Science or Commerce streams.',
    eligibilityTa: '12-ஆம் வகுப்பு தேர்ச்சி பெற்ற மாணவர்கள்.',
    requiredDocuments: [
      'Student 10th and 12th Mark Sheets',
      'School Transfer Certificate (TC)',
      'Community Certificate',
      'Student Aadhaar Card & Mobile Number',
      'Passport size photograph and Signature'
    ],
    requiredDocumentsTa: [
      '10 மற்றும் 12-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்கள்',
      'பள்ளி மாற்றுச் சான்றிதழ் (TC)',
      'சாதிச் சான்றிதழ்',
      'மாணவரின் ஆதார் அட்டை & மொபைல் எண்',
      'பாஸ்போர்ட் அளவு புகைப்படம் மற்றும் கையொப்பம்'
    ],
    optionalDocuments: ['Income Certificate', 'Special Quota Certificate (7.5% Govt School)'],
    notesEn: 'Single application allows selection of multiple colleges and degree courses across the state.',
    notesTa: 'ஒரே விண்ணப்பத்தின் மூலம் பல அரசு கல்லூரிகள் மற்றும் பாடப்பிரிவுகளைத் தேர்வு செய்யலாம்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNGASA Portal (tngasa.in)',
    officialPortalUrl: 'https://www.tngasa.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'EDU-1303',
    category: 'education_admissions',
    department: 'School Education Department',
    departmentTa: 'பள்ளிக் கல்வித்துறை',
    nameEn: 'RTE 25% Free School Admission Online Application',
    nameTa: 'RTE 25% இலவச தனியார் பள்ளி மாணவர் சேர்க்கை',
    descriptionEn: 'Application under Right to Education (RTE) Act for 25% reserved free seats in private non-minority schools for disadvantaged and weaker sections (LKG / 1st Std).',
    descriptionTa: 'தனியார் பள்ளிகளில் 25% இடஒதுக்கீட்டின் கீழ் எல்கேஜி அல்லது 1-ஆம் வகுப்பில் இலவசமாக கல்வி பயில விண்ணப்பிக்கும் அரசு திட்டம்.',
    eligibilityEn: 'Children from disadvantaged groups (SC/ST/Differently abled/Sanitation workers) or Weaker Sections (annual income under ₹2 Lakhs) living within 1 km radius.',
    eligibilityTa: 'பள்ளிக்கு 1 கி.மீ சுற்றளவில் வசிக்கும் நலிவடைந்த பிரிவினர் (ஆண்டு வருமானம் ₹2 லட்சத்திற்குள் உள்ளவர்கள்).',
    requiredDocuments: [
      'Child Birth Certificate',
      'Child and Parent Aadhaar Cards',
      'Income Certificate from Tahsildar (annual income below ₹2,00,000)',
      'Community Certificate of Parent / Child',
      'Residential Address Proof within 1 KM (Aadhaar / Ration Card / Gas Bill / EB Bill)',
      'Child Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'குழந்தையின் பிறப்புச் சான்றிதழ்',
      'குழந்தை மற்றும் பெற்றோரின் ஆதார் அட்டைகள்',
      'வருவாய்த்துறை வருமானச் சான்றிதழ் (ஆண்டு வருமானம் ₹2 லட்சத்திற்குள்)',
      'சாதிச் சான்றிதழ்',
      'பள்ளிக்கு 1 கி.மீ தொலைவில் வசிப்பதற்கான முகவரி ஆதாரம் (ரேஷன் கார்டு / மின் கட்டணம்)',
      'குழந்தையின் பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Special Category Proof (Orphan / Transgender / HIV affected / Sanitation worker)'],
    notesEn: 'All tuition fees paid by the Tamil Nadu Government directly to the school until 8th standard.',
    notesTa: '8-ஆம் வகுப்பு வரை மாணவர்களின் கல்விக் கட்டணத்தை அரசே ஏற்கும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TN RTE Portal (rte.tnschools.gov.in)',
    officialPortalUrl: 'https://rte.tnschools.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 14. UNORGANISED WORKERS WELFARE BOARDS (தொழிலாளர் நல வாரியங்கள்)
  // =========================================================================
  {
    id: 'LAB-1401',
    category: 'unorganised_welfare_board',
    department: 'Tamil Nadu Unorganised Workers Welfare Board',
    departmentTa: 'தமிழ்நாடு அமைப்புசாரா தொழிலாளர்கள் நல வாரியம்',
    nameEn: 'Construction & Manual Workers Welfare Board Registration',
    nameTa: 'கட்டுமான / அமைப்புசாரா தொழிலாளர் நல வாரியப் புதிய பதிவு',
    descriptionEn: 'Registration in state welfare boards for construction workers, drivers, tailors, and manual laborers to receive marriage assistance, education grants, maternity aid and pension.',
    descriptionTa: 'கட்டுமானம், ஆட்டோ ஓட்டுநர்கள், தையல் மற்றும் உடலுழைப்பு தொழிலாளர்கள் நல வாரியத்தில் இணைந்து அரசு நலத்திட்ட உதவிகள் மற்றும் ஓய்வூதியம் பெறுவதற்கான பதிவு.',
    eligibilityEn: 'Manual workers aged 18 to 60 years engaged in designated unorganised trades in Tamil Nadu.',
    eligibilityTa: '18 முதல் 60 வயது வரை உள்ள அமைப்புசாரா மற்றும் கட்டுமானத் தொழிலாளர்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Family Card / Smart Ration Card',
      'Bank Account Passbook (Single account with IFSC in applicant name)',
      'Age Proof (10th TC / Voter ID / Aadhaar)',
      'Employment Certificate / Certificate from Registered Trade Union / Village Administrative Officer (VAO)',
      'Applicant Passport Size Photo & Nominee Aadhaar Card'
    ],
    requiredDocumentsTa: [
      'தொழிலாளியின் ஆதார் அட்டை',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'வங்கி கணக்கு புத்தக நகல் (IFSC குறியீட்டுடன்)',
      'வயது சான்று (TC / வாக்காளர் அட்டை / ஆதார்)',
      'தொழில் சான்றிதழ் (VAO அல்லது பதிவுபெற்ற தொழிற்சங்க சான்றொப்பம்)',
      'பாஸ்போர்ட் அளவு புகைப்படம் & வாரிசுதாரர் (Nominee) ஆதார் அட்டை'
    ],
    optionalDocuments: ['Driver Licence (for Auto/Taxi Drivers Board)'],
    notesEn: 'Entitles workers to ₹1,000 monthly pension on completing 60 years, ₹50,000 accidental grant, and marriage/scholarship claims.',
    notesTa: '60 வயதுக்கு பின் ₹1,000 ஓய்வூதியம், விபத்து நிவாரணம் மற்றும் கல்வி உதவித்தொகை கிடைக்கும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNUWWB Portal (tnuwwb.tn.gov.in)',
    officialPortalUrl: 'https://tnuwwb.tn.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'LAB-1402',
    category: 'unorganised_welfare_board',
    department: 'Tamil Nadu Unorganised Workers Welfare Board',
    departmentTa: 'தமிழ்நாடு அமைப்புசாரா தொழிலாளர்கள் நல வாரியம்',
    nameEn: 'Welfare Board Educational & Marriage Assistance Claim',
    nameTa: 'நல வாரிய கல்வி & திருமண நிதியுதவி கோருதல்',
    descriptionEn: 'Claim monetary assistance for children education (10th, 12th, ITI, Degree) and marriage financial assistance for registered welfare board members.',
    descriptionTa: 'நல வாரியத்தில் பதிவு செய்த தொழிலாளர்களின் பிள்ளைகளின் கல்வி மற்றும் திருமணத்திற்கான அரசு நிதியுதவி கோரும் சேவை.',
    eligibilityEn: 'Registered active welfare board members with minimum 1-year completed membership.',
    eligibilityTa: 'நல வாரியத்தில் தொடர்ந்து உறுப்பினராக உள்ள தொழிலாளர்கள்.',
    requiredDocuments: [
      'Welfare Board Member Identity Card',
      'Member and Child / Spouse Aadhaar Cards',
      'For Education Claim: School/College Bonafide Certificate & Passed Mark Sheet',
      'For Marriage Claim: Registered Marriage Certificate & Marriage Photo',
      'Member Bank Passbook Copy'
    ],
    requiredDocumentsTa: [
      'நல வாரிய உறுப்பினர் அடையாள அட்டை (ஸ்மார்ட் கார்டு)',
      'உறுப்பினர் மற்றும் பிள்ளை / துணையின் ஆதார் அட்டைகள்',
      'கல்வி உதவிக்கு: பள்ளி/கல்லூரி சேர்க்கைச் சான்று (Bonafide) & மதிப்பெண் சான்றிதழ்',
      'திருமண உதவிக்கு: பதிவு செய்யப்பட்ட திருமணச் சான்றிதழ் & திருமணப் புகைப்படம்',
      'தொழிலாளியின் வங்கிக் கணக்கு புத்தக நகல்'
    ],
    optionalDocuments: [],
    notesEn: 'Direct Benefit Transfer (DBT) deposited into member bank account upon Labor Officer approval.',
    notesTa: 'தொழிலாளர் நல அலுவலர் ஒப்புதலுக்குப் பின் நேரடியாக வங்கிக் கணக்கில் வரவு வைக்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'TNUWWB (tnuwwb.tn.gov.in)',
    officialPortalUrl: 'https://tnuwwb.tn.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 15. FISHERIES DEPARTMENT (மீன்வளத்துறை)
  // =========================================================================
  {
    id: 'FSH-1501',
    category: 'fisheries_welfare',
    department: 'Department of Fisheries and Fishermen Welfare',
    departmentTa: 'மீன்வளம் மற்றும் மீனவர் நலத்துறை',
    nameEn: 'Fishermen Welfare Board Registration & Ban Period Relief Assistance',
    nameTa: 'மீனவர் நல வாரியப் பதிவு & மீன்பிடி தடைக்கால நிவாரணம்',
    descriptionEn: 'Enrollment in Fishermen Welfare Board and application for annual fishing ban period relief allowance (₹8,000) and lean season relief.',
    descriptionTa: 'மீனவர் நல வாரியத்தில் புதிய பதிவு செய்தல் மற்றும் வருடாந்திர மீன்பிடி தடைக்கால நிவாரண உதவித்தொகை பெறுதல்.',
    eligibilityEn: 'Active marine and inland fishermen/fisherwomen registered in local Fishermen Cooperative Society.',
    eligibilityTa: 'மீனவர் கூட்டுறவு சங்கத்தில் உறுப்பினராக உள்ள கடல் மற்றும் உள்நாட்டு மீனவர்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Fishermen Cooperative Society Membership Card / Number',
      'Family Card / Smart Card',
      'Bank Account Passbook (single account with IFSC)',
      'Biometric Sea Identity Card (for marine fishermen)',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'மீனவரின் ஆதார் அட்டை',
      'மீனவர் கூட்டுறவு சங்க உறுப்பினர் அடையாள அட்டை / எண்',
      'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு',
      'வங்கி கணக்கு புத்தக நகல்',
      'பயோமெட்ரிக் கடல் அடையாள அட்டை (கடல் மீனவர்களுக்கு)',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: ['Boat Registration Certificate (if boat owner)'],
    notesEn: 'Disbursed during annual fishing ban periods (April to June) via DBT.',
    notesTa: 'மீன்பிடி தடைக்காலத்தில் நிவாரணத் தொகை நேரடியாக வங்கியில் செலுத்தப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Department of Fisheries (fisheries.tn.gov.in)',
    officialPortalUrl: 'https://fisheries.tn.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 16. FIRE & RESCUE SERVICES (தீயணைப்புத்துறை)
  // =========================================================================
  {
    id: 'FIR-1601',
    category: 'fire_rescue_noc',
    department: 'Tamil Nadu Fire and Rescue Services',
    departmentTa: 'தீயணைப்பு மற்றும் மீட்புப்பணிகள் துறை',
    nameEn: 'Fire Safety NOC for Commercial Establishments & Schools',
    nameTa: 'தீயணைப்புத்துறை தடையில்லாச் சான்றிதழ் (Fire NOC)',
    descriptionEn: 'Apply for Fire Safety No Objection Certificate (NOC) mandatory for schools, hospitals, commercial complexes, crackers shops, and multi-storey buildings.',
    descriptionTa: 'பள்ளிகள், மருத்துவமனைகள், திருமண மண்டபங்கள் மற்றும் வணிகக் கட்டிடங்களுக்கு தீத்தடுப்புத் தடையில்லாச் சான்று (NOC) பெறும் சேவை.',
    eligibilityEn: 'Building owners, educational trusts, hospital administrators and commercial establishments.',
    eligibilityTa: 'வணிகக் கட்டிடங்கள் மற்றும் கல்வி நிறுவனங்களின் உரிமையாளர்கள்.',
    requiredDocuments: [
      'Approved Building Plan Copy with Fire Exit details',
      'Property Tax Receipt / Ownership Deed Copy',
      'List of Installed Fire Fighting Equipment (Extinguishers, Hose Reels, Hydrants)',
      'Site Elevation Photos showing setback space and access road width',
      'Applicant Aadhaar / Authorized Signatory ID & PAN'
    ],
    requiredDocumentsTa: [
      'அங்கீகரிக்கப்பட்ட கட்டிட வரைபடம் (தீத்தடுப்பு வழிகள் குறிப்பிடப்பட்டது)',
      'சொத்துவரி ரசீது / கட்டிட உரிமைப் பத்திரம்',
      'பொருத்தப்பட்டுள்ள தீயணைப்புக் கருவிகளின் பட்டியல் (Fire Extinguishers)',
      'கட்டிடத்தை சுற்றியுள்ள சாலை வசதி மற்றும் இடத்தைக் காட்டும் புகைப்படங்கள்',
      'விண்ணப்பதாரர் / நிறுவனத்தின் ஆதார் அட்டை'
    ],
    optionalDocuments: ['Structural Stability Certificate'],
    notesEn: 'Station Officer and District Fire Officer conduct inspection before issuing digital certificate.',
    notesTa: 'தீயணைப்பு அலுவலர் நேரில் ஆய்வு செய்த பின் சான்றிதழ் வழங்கப்படும்.',
    variableRequirements: true,
    variableRequirementsNoteTa: 'கட்டிடத்தின் உயரம் மற்றும் தொழிலின் தன்மைக்கு ஏற்ப தீத்தடுப்பு உபகரணங்கள் மாறும்.',
    serviceType: 'e-Sevai Service',
    officialSource: 'TN Fire and Rescue Services (tnfrs.tn.gov.in)',
    officialPortalUrl: 'https://tnfrs.tn.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 17. DRUG CONTROL ADMINISTRATION (மருந்து கட்டுப்பாட்டுத்துறை)
  // =========================================================================
  {
    id: 'DRG-1701',
    category: 'drug_control',
    department: 'Drugs Control Administration',
    departmentTa: 'மருந்து கட்டுப்பாட்டு இயக்ககம்',
    nameEn: 'Retail & Wholesale Pharmacy Drug Licence Guidance',
    nameTa: 'மருந்தக உரிமம் (Medical Shop Licence) விண்ணப்ப வழிகாட்டுதல்',
    descriptionEn: 'Application guidance and document preparation for Form 20 / Form 21 Retail and Wholesale drug licenses to operate medical stores in Tamil Nadu.',
    descriptionTa: 'புதிய மெடிக்கல் ஷாப் (Pharmacy) அல்லது மொத்த மருந்து விற்பனை நிலையம் தொடங்க மருந்து கட்டுப்பாட்டுத்துறையில் உரிமம் பெற வழிகாட்டுதல்.',
    eligibilityEn: 'Registered Pharmacists (B.Pharm / D.Pharm with TN Pharmacy Council registration) or shop owners employing registered pharmacists.',
    eligibilityTa: 'தமிழ்நாடு பார்மசி கவுன்சிலில் பதிவு செய்த மருந்தாளுநர்கள்.',
    requiredDocuments: [
      'Registered Pharmacist Diploma/Degree Certificate & TN Pharmacy Council Registration Certificate',
      'Pharmacist Renewal Receipt & Pharmacist Aadhaar Card',
      'Shop Rental Agreement (Min 10 Sq. Meters for retail) or Property Tax Receipt',
      'Shop Blueprint / Key Plan showing refrigerator and storage layout',
      'Refrigerator Invoice / Purchase Bill (for temperature sensitive medicines)',
      'Applicant ID Proof & Passport size photos'
    ],
    requiredDocumentsTa: [
      'மருந்தாளுநர் பட்டயச் சான்றிதழ் & தமிழ்நாடு பார்மசி கவுன்சில் பதிவு அட்டை',
      'பார்மசி கவுன்சில் நடப்பு புதுப்பித்தல் ரசீது & மருந்தாளுநர் ஆதார்',
      'கடை வாடகை ஒப்பந்தம் (குறைந்தது 10 சதுர மீட்டர்) அல்லது சொத்துவரி ரசீது',
      'கடையின் வரைபடம் (Blueprint) மற்றும் குளிர்சாதனப் பெட்டி வைக்கும் இடம்',
      'பிரிட்ஜ் (Refrigerator) வாங்கியதற்கான அசல் பில்',
      'விண்ணப்பதாரர் அடையாளச் சான்று'
    ],
    optionalDocuments: [
      'Partnership Deed / GST Certificate (for wholesale / partnership firms)',
      'Local Body Trade NOC (if requested by Drugs Inspector)'
    ],
    notesEn: 'Guidance & Statutory Disclaimer: AK E-SEVAI provides application preparation and documentation assistance. Grant of pharmacy retail/wholesale licence (Form 20/21) is subject to physical inspection of storage cold-chain facilities by the Drugs Inspector and compliance with the Drugs and Cosmetics Act, 1940.',
    notesTa: 'வழிகாட்டுதல் & சட்டப்பூர்வ அறிவிப்பு: AK E-SEVAI என்பது ஆவண தயாரிப்பு மற்றும் இணையதள விண்ணப்ப வழிகாட்டுதல் மையமாகும். மருந்தக உரிமம் (Form 20/21) வழங்குவது தமிழ்நாடு மருந்து கட்டுப்பாட்டுத்துறை ஆய்வாளர் (Drug Inspector) நடத்தும் நேரடி கடை ஆய்வு, குளிர்பதன வசதி மற்றும் பார்மசி கவுன்சில் சரிபார்ப்புக்கு உட்பட்டது.',
    variableRequirements: false,
    serviceType: 'Customer Assistance / Application Guidance',
    officialSource: 'Drugs Control Administration TN (drugcontrol.tn.gov.in)',
    officialPortalUrl: 'https://drugcontrol.tn.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 18. ELECTRICAL INSPECTORATE (மின் ஆய்வுத்துறை)
  // =========================================================================
  {
    id: 'ELI-1801',
    category: 'electrical_inspectorate',
    department: 'Chief Electrical Inspectorate to Government',
    departmentTa: 'தலைமை மின் ஆய்வுத்துறை',
    nameEn: 'Electrical Contractor / Wireman Competency Licence Guidance',
    nameTa: 'எலக்ட்ரிக்கல் காண்ட்ராக்டர் & ஒயர்மேன் லைசென்ஸ் வழிகாட்டுதல்',
    descriptionEn: 'Guidance and application processing for Wireman Competency Certificate (Permit B) and Electrical Contractor Licence (Class EA/ESA).',
    descriptionTa: 'அங்கீகரிக்கப்பட்ட எலக்ட்ரீசியன் (Wireman B Licence) மற்றும் எலக்ட்ரிக்கல் காண்ட்ராக்டர் லைசென்ஸ் பெற விண்ணப்பிக்கும் சேவை.',
    eligibilityEn: 'ITI Electrical / Diploma / Degree in EEE certificate holders with apprenticeship experience.',
    eligibilityTa: 'ITI எலக்ட்ரீசியன் அல்லது EEE முடித்த தகுதியுடைய நபர்கள்.',
    requiredDocuments: [
      'ITI Electrical / Diploma / BE Electrical Degree & Mark Sheets',
      'Experience / Apprenticeship Certificate from Licensed Electrical Contractor',
      'Applicant Aadhaar Card & Age Proof',
      'Passport size photographs and Signature',
      'Government Application Fee Receipt'
    ],
    requiredDocumentsTa: [
      'ITI எலக்ட்ரீசியன் / டிப்ளமோ / பொறியியல் கல்விச் சான்றிதழ்கள்',
      'அனுபவச் சான்றிதழ் (அங்கீகரிக்கப்பட்ட காண்ட்ராக்டரிடம் பெற்றது)',
      'விண்ணப்பதாரர் ஆதார் அட்டை',
      'பாஸ்போர்ட் அளவு புகைப்படங்கள் மற்றும் கையொப்பம்',
      'அரசு தேர்வுக் கட்டண ரசீது'
    ],
    optionalDocuments: [
      'Bank Solvency Certificate (for Class EA/EB Contractor Licence)',
      'Testing Instrument Calibration Certificates (Megger / Earth Tester)'
    ],
    notesEn: 'Guidance & Statutory Disclaimer: AK E-SEVAI provides document compilation and online portal submission assistance. Issuance of Electrical Contractor / Competency Licence (Class EA/EB/ESB) is subject to instrument verification and examination by the Tamil Nadu Electrical Licensing Board (TNELB).',
    notesTa: 'வழிகாட்டுதல் & சட்டப்பூர்வ அறிவிப்பு: AK E-SEVAI என்பது விண்ணப்பப் படிவங்கள் மற்றும் ஆவணங்களை தயார் செய்வதற்கான வழிகாட்டுதல் சேவையாகும். தமிழ்நாடு மின் உரிம வாரியம் (TNELB) நடத்தும் செய்முறை/நேர்முகத் தேர்வு மற்றும் பரிசோதனை உபகரணங்கள் ஆய்வுக்குப் பின்பே தகுதிச் சான்றிதழ் / உரிமம் வழங்கப்படும்.',
    variableRequirements: false,
    serviceType: 'Customer Assistance / Application Guidance',
    officialSource: 'Tamil Nadu Electrical Licensing Board (tnealb.gov.in)',
    officialPortalUrl: 'https://www.tnealb.gov.in',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 19. TAMIL NADU WAQF BOARD (தமிழ்நாடு வக்ஃபு வாரியம்)
  // =========================================================================
  {
    id: 'WQF-1901',
    category: 'waqf_board',
    department: 'Tamil Nadu Waqf Board',
    departmentTa: 'தமிழ்நாடு வக்ஃபு வாரியம்',
    nameEn: 'Ulama & Mosque Workers Welfare Board Schemes & Marriage Aid',
    nameTa: 'உலமாக்கள் மற்றும் மசூதி பணியாளர்கள் நல வாரியத் திட்டங்கள்',
    descriptionEn: 'Welfare schemes, marriage assistance and monthly pension for registered Ulamas, Imams, Muezzins and Arabic teachers in Tamil Nadu.',
    descriptionTa: 'பதிவுபெற்ற உலமாக்கள், இமாம்கள், முஅத்தின்கள் மற்றும் மதரஸா ஆசிரியர்களுக்கு அரசு வழங்கும் நலத்திட்ட உதவிகள் மற்றும் ஓய்வூதியம்.',
    eligibilityEn: 'Registered members of Tamil Nadu Ulama and Other Employees Welfare Board.',
    eligibilityTa: 'உலமாக்கள் நல வாரியத்தில் பதிவு செய்துள்ள உறுப்பினர்கள்.',
    requiredDocuments: [
      'Ulama Welfare Board Identity Card Copy',
      'Applicant Aadhaar Card',
      'Mosque / Madarasa Employment Verification from Muthawalli / Managing Committee',
      'Bank Account Passbook Copy',
      'For Marriage Aid: Nikahnama / Marriage Registration Certificate',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'உலமா நல வாரிய உறுப்பினர் அடையாள அட்டை',
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'பள்ளிவாசல் / மதரஸாவில் பணிபுரிவதற்கான முத்தவல்லி சான்றிதழ்',
      'வங்கி கணக்கு புத்தக நகல்',
      'திருமண உதவிக்கு: நிக்கா நாமா (Nikahnama) / திருமணப் பதிவுச் சான்று',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: [],
    notesEn: 'Processed through District Waqf Inspector and State Waqf Board.',
    notesTa: 'மாவட்ட வக்ஃபு ஆய்வாளர் சரிபார்ப்புக்குப் பின் நிதி வழங்கப்படும்.',
    variableRequirements: false,
    serviceType: 'e-Sevai Service',
    officialSource: 'Tamil Nadu Waqf Board (tnwaqfboard.com)',
    officialPortalUrl: 'https://www.tnwaqfboard.com',
    lastVerified: '2026-09-03'
  },

  // =========================================================================
  // 20. IDENTITY & NATIONAL CITIZEN SERVICES (அடையாள & மத்திய அரசு சேவைகள்)
  // =========================================================================
  {
    id: 'NAT-2001',
    category: 'identity_national',
    department: 'Unique Identification Authority of India (UIDAI)',
    departmentTa: 'இந்திய தனித்துவ அடையாள ஆணையம் (UIDAI / ஆதார்)',
    nameEn: 'Aadhaar Address Update & PVC Card Ordering',
    nameTa: 'ஆதார் முகவரி மாற்றம் & பிளாஸ்டிக் PVC கார்டு ஆர்டர்',
    descriptionEn: 'Online address correction in Aadhaar using valid address proof / Head of Family (HOF) consent, and ordering official high-security PVC Aadhaar Card.',
    descriptionTa: 'ஆதாரில் முகவரியை திருத்துதல் மற்றும் அஞ்சல் மூலம் புதிய பாதுகாப்பான பிளாஸ்டிக் PVC ஆதார் கார்டு ஆர்டர் செய்தல்.',
    eligibilityEn: 'All Aadhaar holders with active mobile number linked to Aadhaar.',
    eligibilityTa: 'ஆதார் அட்டை வைத்துள்ள அனைத்து இந்தியக் குடிமக்கள்.',
    requiredDocuments: [
      'Aadhaar Number (12 Digits)',
      'Active Mobile linked to Aadhaar for UIDAI OTP',
      'For Address Update: Valid Address Proof (Voter ID / Ration Card / Passport / EB Bill / Bank Passbook / Rent Agreement) OR HOF Aadhaar'
    ],
    requiredDocumentsTa: [
      '12 இலக்க ஆதார் எண்',
      'OTP சரிபார்ப்புக்கான பதிவுசெய்த மொபைல் எண்',
      'முகவரி மாற்றத்திற்கு: முகவரி ஆதாரம் (வாக்காளர் அட்டை / ரேஷன் கார்டு / மின் பில் / பாஸ்புக்) அல்லது குடும்பத் தலைவர் ஆதார்'
    ],
    optionalDocuments: [],
    notesEn: 'Official Speed Post delivery of PVC Card within 7-10 working days directly from UIDAI.',
    notesTa: 'மத்திய அரசு UIDAI மூலம் அதிகாரப்பூர்வ PVC கார்டு அஞ்சலில் அனுப்பி வைக்கப்படும்.',
    variableRequirements: false,
    serviceType: 'Customer Assistance / Application Guidance',
    officialSource: 'myAadhaar Portal (myaadhaar.uidai.gov.in)',
    officialPortalUrl: 'https://myaadhaar.uidai.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'NAT-2002',
    category: 'identity_national',
    department: 'Income Tax Department (NSDL / UTIITSL)',
    departmentTa: 'வருமான வரித்துறை (PAN Card)',
    nameEn: 'New PAN Card Application & Correction Services',
    nameTa: 'புதிய பான் கார்டு விண்ணப்பம் & திருத்தம் (PAN Card)',
    descriptionEn: 'Application for New Permanent Account Number (PAN) Card (Form 49A) and correction of name, date of birth, father name or photo in existing PAN.',
    descriptionTa: 'புதிய பான் கார்டு விண்ணப்பித்தல் மற்றும் பழைய பான் கார்டில் பெயர், பிறந்த தேதி, கையொப்பம் திருத்துதல்.',
    eligibilityEn: 'Individuals, minors, businesses, firms, and trusts.',
    eligibilityTa: '18 வயது பூர்த்தியடைந்த நபர்கள் அல்லது மைனர்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card (Mandatory for instant paperless e-KYC)',
      'Two Passport size photographs (Color with white background)',
      'Signature Specimen on white paper',
      'For Correction: Existing PAN Card Copy + Supporting proof (10th Marksheet / Birth Certificate)'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை (கட்டாயம்)',
      'பாஸ்போர்ட் அளவு வண்ணப் புகைப்படங்கள் 2',
      'வெள்ளைத்தாளில் கையொப்ப மாதிரி',
      'திருத்தத்திற்கு: பழைய பான் கார்டு நகல் + சரியான பெயருக்கான சான்று (10th Marksheet / ஆதார்)'
    ],
    optionalDocuments: ['Voter ID / Driving Licence'],
    notesEn: 'e-PAN PDF delivered to email within 24-48 hours; Physical Plastic Card delivered via Speed Post.',
    notesTa: 'e-PAN 24 மணி நேரத்திற்குள் மின்னஞ்சலில் கிடைக்கும்; அசல் கார்டு தபாலில் வரும்.',
    variableRequirements: false,
    serviceType: 'Customer Assistance / Application Guidance',
    officialSource: 'Protean NSDL / UTIITSL (onlineservices.nsdl.com)',
    officialPortalUrl: 'https://www.onlineservices.nsdl.com',
    lastVerified: '2026-09-03'
  },
  {
    id: 'NAT-2003',
    category: 'identity_national',
    department: 'Election Commission of India (ECI)',
    departmentTa: 'இந்தியத் தேர்தல் ஆணையம் (வாக்காளர் அட்டை)',
    nameEn: 'New Voter ID Registration (Form 6) & Correction (Form 8)',
    nameTa: 'புதிய வாக்காளர் அட்டை விண்ணப்பம் (Form 6) & திருத்தம் (Form 8)',
    descriptionEn: 'Enrollment of new voters completing 18 years (Form 6), address shifting / photo correction (Form 8), and download of digital e-EPIC card.',
    descriptionTa: '18 வயது பூர்த்தியடைந்தவர்கள் புதிய வாக்காளர் பட்டியலில் சேருதல் (Form 6) மற்றும் வாக்காளர் அட்டை திருத்தம் செய்தல் (Form 8).',
    eligibilityEn: 'Indian citizens aged 18 years and above residing in Tamil Nadu assembly constituencies.',
    eligibilityTa: '18 வயது பூர்த்தியடைந்த அனைத்து இந்தியக் குடிமக்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card',
      'Age Proof (10th TC / Birth Certificate / Aadhaar / PAN)',
      'Address Proof (Family Ration Card / EB Bill / Gas Bill / Aadhaar)',
      'Family Member Voter ID (EPIC Number) for pooling in same booth',
      'Applicant Passport Size Photo'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை',
      'வயது சான்று (10-ஆம் வகுப்பு TC / பிறப்புச் சான்று / ஆதார்)',
      'முகவரி ஆதாரம் (ஸ்மார்ட் ரேஷன் கார்டு / மின் கட்டணம் / ஆதார்)',
      'குடும்ப உறுப்பினரின் வாக்காளர் அடையாள அட்டை எண் (வாக்குச்சாவடி கண்டறிய)',
      'பாஸ்போர்ட் அளவு புகைப்படம்'
    ],
    optionalDocuments: [],
    notesEn: 'Field verified by Booth Level Officer (BLO). Color PVC EPIC card delivered by Post free of cost.',
    notesTa: 'BLO அலுவலர் ஆய்வுக்குப் பின் வண்ண PVC வாக்காளர் அட்டை தபாலில் இலவசமாக வரும்.',
    variableRequirements: false,
    serviceType: 'Customer Assistance / Application Guidance',
    officialSource: 'Voters Service Portal ECI (voters.eci.gov.in)',
    officialPortalUrl: 'https://voters.eci.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'NAT-2004',
    category: 'identity_national',
    department: 'Ministry of External Affairs (Passport Seva)',
    departmentTa: 'வெளியுறவு அமைச்சகம் (பாஸ்போர்ட்)',
    nameEn: 'Fresh Passport Application & Re-issue Assistance',
    nameTa: 'புதிய பாஸ்போர்ட் விண்ணப்பம் & புதுப்பித்தல் உதவி',
    descriptionEn: 'Online application processing, document screening, and appointment slot booking for Fresh/Re-issue Passport at Passport Seva Kendra (PSK / POPSK).',
    descriptionTa: 'புதிய பாஸ்போர்ட் பெறுவதற்கும், காலாவதியான பாஸ்போர்ட்டைப் புதுப்பிப்பதற்கும் விண்ணப்பம் தயாரித்து PSK அலுவலகத்தில் தேதி முன்பதிவு செய்தல்.',
    eligibilityEn: 'Indian citizens traveling abroad for employment, education, pilgrimage or tourism.',
    eligibilityTa: 'வெளிநாடு செல்ல விரும்பும் இந்தியக் குடிமக்கள்.',
    requiredDocuments: [
      'Applicant Aadhaar Card (Primary Identity & Address Proof)',
      'Date of Birth Proof: Birth Certificate / 10th Mark Sheet / School TC',
      'Non-ECR Proof (Higher Education): 10th Standard or Higher Degree Mark Sheet / Degree Certificate (Mandatory for ECNR stamp)',
      'Current Address Proof: Bank Passbook (with photo) / Voter ID / Gas Bill / Rent Agreement',
      'PAN Card / Voter ID Card',
      'For Re-issue: Original Old Passport Copy'
    ],
    requiredDocumentsTa: [
      'விண்ணப்பதாரரின் ஆதார் அட்டை (முதன்மை அடையாளம் & முகவரி)',
      'பிறந்த தேதி சான்று: பிறப்புச் சான்றிதழ் அல்லது 10-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்',
      'ECNR சான்று: 10-ஆம் வகுப்பு அல்லது அதற்கு மேற்பட்ட கல்விச் சான்றிதழ்கள் (ECR முத்திரை தவிர்க்க)',
      'தற்போதைய முகவரி ஆதாரம்: வங்கி பாஸ்புக் / வாக்காளர் அட்டை / கேஸ் பில்',
      'பான் கார்டு / வாக்காளர் அட்டை',
      'புதுப்பித்தலுக்கு: பழைய அசல் பாஸ்போர்ட் நகல்'
    ],
    optionalDocuments: ['Marriage Certificate (if spouse name addition desired)', 'Annexure D (for Minors)'],
    notesEn: 'Applicant must appear in person at Passport Seva Kendra (PSK) on the booked appointment date for biometric capture.',
    notesTa: 'முன்பதிவு செய்த நாளில் பயோமெட்ரிக் பதிவுக்காக PSK அலுவலகத்திற்கு நேரில் செல்ல வேண்டும்.',
    variableRequirements: false,
    serviceType: 'Customer Assistance / Application Guidance',
    officialSource: 'Passport Seva Portal (passportindia.gov.in)',
    officialPortalUrl: 'https://www.passportindia.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'NAT-2005',
    category: 'identity_national',
    department: 'Employees Provident Fund Organisation (EPFO)',
    departmentTa: 'மத்திய வருங்கால வைப்பு நிதி (EPFO / PF)',
    nameEn: 'EPFO PF Advance Claim & Full Withdrawal Support',
    nameTa: 'EPFO PF பணம் எடுத்தல் (Advance / Full Claim)',
    descriptionEn: 'Online filing of Form 31 (Advance for illness, house construction, marriage), Form 19 (Final Settlement), and Form 10C (Pension Withdrawal).',
    descriptionTa: 'பிஎஃப் கணக்கிலிருந்து அவசரத் தேவைக்கான அட்வான்ஸ் (Form 31) மற்றும் வேலை நின்ற பின் மொத்த பிஎஃப் பணத்தை (Form 19 & 10C) எடுக்கும் சேவை.',
    eligibilityEn: 'Salaried employees with active Universal Account Number (UAN) seeded with Aadhaar and Bank account.',
    eligibilityTa: 'UAN எண் மற்றும் PF கணக்கு வைத்துள்ள தனியார் துறை தொழிலாளர்கள்.',
    requiredDocuments: [
      'Active Universal Account Number (UAN) & Password',
      'Aadhaar Linked Mobile Number for OTP Verification',
      'Bank Account Passbook / Cancelled Cheque Leaf showing Name, Account Number and IFSC',
      'PAN Card Copy (Mandatory if service < 5 years and withdrawal > ₹50,000 for TDS exemption)',
      'Date of Exit marked in EPFO portal (for Full Settlement)'
    ],
    requiredDocumentsTa: [
      'UAN எண் மற்றும் கடவுச்சொல் (Password)',
      'ஆதாரில் பதிவுசெய்த மொபைல் எண் (OTP சரிபார்ப்புக்கு)',
      'வங்கி பாஸ்புக் அல்லது பெயர் அச்சிடப்பட்ட ரத்து செய்யப்பட்ட காசோலை (Cancelled Cheque)',
      'பான் கார்டு நகல் (TDS வரி பிடித்தம் தவிர்க்க)',
      'பணியிலிருந்து விலகிய தேதி (Date of Exit) பதிவிடப்பட்டிருக்க வேண்டும்'
    ],
    optionalDocuments: [],
    notesEn: 'PF funds directly credited to bank account within 3-7 working days by EPFO field office.',
    notesTa: 'EPFO ஆய்வுக்குப் பின் 3 முதல் 7 வேலை நாட்களில் வங்கிக் கணக்கில் பணம் நேரடியாக வந்துவிடும்.',
    variableRequirements: false,
    serviceType: 'Customer Assistance / Application Guidance',
    officialSource: 'EPFO Member Portal (unifiedportal-mem.epfindia.gov.in)',
    officialPortalUrl: 'https://unifiedportal-mem.epfindia.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'NAT-2006',
    category: 'identity_national',
    department: 'Ministry of Micro, Small & Medium Enterprises',
    departmentTa: 'சிறு, குறு மற்றும் நடுத்தரத் தொழில் அமைச்சகம் (MSME)',
    nameEn: 'Udyam MSME Business Registration Certificate',
    nameTa: 'உத்யாம் (MSME) தொழில் பதிவுச் சான்றிதழ்',
    descriptionEn: 'Official government registration certificate for micro, small and medium enterprises to avail bank loan subsidies, priority lending, and government tender exemptions.',
    descriptionTa: 'சிறு தொழில்கள், கடைகள் மற்றும் உற்பத்தி நிறுவனங்களுக்கு வங்கிக் கடன் முன்னுரிமை மற்றும் அரசு மானியங்கள் பெற வழங்கப்படும் உத்யாம் MSME பதிவுச் சான்றிதழ்.',
    eligibilityEn: 'Proprietorships, partnerships, small businesses and manufacturing/service units.',
    eligibilityTa: 'சொந்தமாக தொழில் செய்யும் அனைவரும்.',
    requiredDocuments: [
      'Proprietor / Partner Aadhaar Card & PAN Card',
      'Business Name & Operational Address Proof (EB Bill / Rental Agreement)',
      'Business Bank Account Details (Account No & IFSC)',
      'Main Business Activity / Services / Products details',
      'Number of Employees & Investment in Plant / Machinery details'
    ],
    requiredDocumentsTa: [
      'தொழில் உரிமையாளரின் ஆதார் அட்டை & பான் கார்டு',
      'தொழில் நிறுவனத்தின் பெயர் & முகவரி ஆதாரம் (மின் பில் / வாடகை ஒப்பந்தம்)',
      'வணிக வங்கிக் கணக்கு எண் & IFSC குறியீடு',
      'தொழிலின் தன்மை & உற்பத்தி/சேவை விவரங்கள்',
      'பணியாளர்களின் எண்ணிக்கை & முதலீட்டுத் தொகை விவரம்'
    ],
    optionalDocuments: ['GSTIN (if GST registered)'],
    notesEn: 'Generates instant digital Udyam Registration Certificate with lifetime validity.',
    notesTa: 'வாழ்நாள் முழுவதும் செல்லுபடியாகும் அதிகாரப்பூர்வ MSME சான்றிதழ் உடனே கிடைக்கும்.',
    variableRequirements: false,
    serviceType: 'Customer Assistance / Application Guidance',
    officialSource: 'Udyam Registration Portal (udyamregistration.gov.in)',
    officialPortalUrl: 'https://udyamregistration.gov.in',
    lastVerified: '2026-09-03'
  },
  {
    id: 'NAT-2007',
    category: 'identity_national',
    department: 'Food Safety and Standards Authority of India (FSSAI)',
    departmentTa: 'இந்திய உணவுப் பாதுகாப்பு மற்றும் தர நிர்ணய ஆணையம் (FSSAI)',
    nameEn: 'FSSAI Food Safety Business Registration (FoSCoS)',
    nameTa: 'FSSAI உணவுப் பாதுகாப்பு பதிவு (உணவகங்கள் / கடைகள்)',
    descriptionEn: 'Mandatory Food Safety Registration / Licence for all food business operators including tea stalls, bakeries, hotels, canteens, grocery stores and food manufacturers.',
    descriptionTa: 'டீக்கடை, பேக்கரி, மளிகைக் கடை, உணவகங்கள் மற்றும் உணவு தயாரிப்பு நிலையங்கள் நடத்த கட்டாயமாகப் பெற வேண்டிய FSSAI உணவு பாதுகாப்புப் பதிவு.',
    eligibilityEn: 'Any individual or entity handling, packing, manufacturing or selling food items.',
    eligibilityTa: 'உணவு தொடர்பான தொழில் செய்யும் அனைத்து வணிகர்கள்.',
    requiredDocuments: [
      'Business Owner Aadhaar Card & PAN Card',
      'Passport size photograph of the Food Business Operator (FBO)',
      'Business Premise Address Proof (Shop Rental Agreement / Electricity Bill / Property Tax)',
      'Food Category List (Types of food items sold or prepared)',
      'Water Test Report (for food manufacturing / restaurants)'
    ],
    requiredDocumentsTa: [
      'உரிமையாளரின் ஆதார் அட்டை & பான் கார்டு',
      'பாஸ்போர்ட் அளவு புகைப்படம்',
      'கடை முகவரி ஆதாரம் (வாடகை ஒப்பந்தப் பத்திரம் / மின் கட்டண ரசீது)',
      'தயாரிக்கப்படும் / விற்கப்படும் உணவுப் பொருட்களின் பட்டியல்',
      'குடிநீர் பரிசோதனை அறிக்கை (உணவகங்கள்/உணவு தயாரிப்பாளர்களுக்கு)'
    ],
    optionalDocuments: ['NOC from Local Body / Municipality'],
    notesEn: 'Valid for 1 to 5 years. Digital FoSCoS registration certificate with 14-digit FSSAI number.',
    notesTa: '14 இலக்க FSSAI எண்ணுடன் கூடிய அதிகாரப்பூர்வ சான்றிதழ் கிடைக்கும்.',
    variableRequirements: false,
    serviceType: 'Customer Assistance / Application Guidance',
    officialSource: 'FoSCoS FSSAI Portal (foscos.fssai.gov.in)',
    officialPortalUrl: 'https://foscos.fssai.gov.in',
    lastVerified: '2026-09-03'
  }
];

// Helper: Find service by ID, English name, Tamil name, or partial keyword
export const findGovernmentService = (serviceIdentifier) => {
  if (!serviceIdentifier) return null;
  const clean = String(serviceIdentifier).trim().toLowerCase();

  // 1. Direct match on ID
  const byId = GOVERNMENT_SERVICES.find(s => s.id.toLowerCase() === clean);
  if (byId) return byId;

  // 2. Exact match on English or Tamil name
  const byName = GOVERNMENT_SERVICES.find(s =>
    s.nameEn.toLowerCase() === clean ||
    s.nameTa.toLowerCase() === clean
  );
  if (byName) return byName;

  // 3. Composite or substring match
  const bySubstring = GOVERNMENT_SERVICES.find(s =>
    clean.includes(s.id.toLowerCase()) ||
    clean.includes(s.nameEn.toLowerCase()) ||
    clean.includes(s.nameTa.toLowerCase()) ||
    s.nameEn.toLowerCase().includes(clean) ||
    s.nameTa.toLowerCase().includes(clean)
  );
  if (bySubstring) return bySubstring;

  // 4. Keyword fuzzy resolution for common terms
  if (clean.includes('வருமான') || clean.includes('income')) return GOVERNMENT_SERVICES.find(s => s.id === 'REV-103') || null;
  if (clean.includes('சாதி') || clean.includes('community')) return GOVERNMENT_SERVICES.find(s => s.id === 'REV-101') || null;
  if (clean.includes('பிறப்பிட') || clean.includes('nativity')) return GOVERNMENT_SERVICES.find(s => s.id === 'REV-102') || null;
  if (clean.includes('இருப்பிட') || clean.includes('residence')) return GOVERNMENT_SERVICES.find(s => s.id === 'REV-104') || null;
  if (clean.includes('பட்டதாரி') || clean.includes('first graduate')) return GOVERNMENT_SERVICES.find(s => s.id === 'REV-105') || null;
  if (clean.includes('வாரிசு') || clean.includes('legal heir')) return GOVERNMENT_SERVICES.find(s => s.id === 'REV-106') || null;
  if (clean.includes('ரேஷன்') || clean.includes('smart card') || clean.includes('குடும்ப அட்டை')) return GOVERNMENT_SERVICES.find(s => s.id === 'PDS-401') || null;
  if (clean.includes('ஓய்வூதியம்') || clean.includes('pension')) return GOVERNMENT_SERVICES.find(s => s.id === 'SSP-201') || null;
  if (clean.includes('பாஸ்போர்ட்') || clean.includes('passport')) return GOVERNMENT_SERVICES.find(s => s.id === 'NAT-2004') || null;
  if (clean.includes('பான்') || clean.includes('pan card')) return GOVERNMENT_SERVICES.find(s => s.id === 'NAT-2002') || null;
  if (clean.includes('வாக்காளர்') || clean.includes('voter')) return GOVERNMENT_SERVICES.find(s => s.id === 'NAT-2003') || null;
  if (clean.includes('வேலைவாய்ப்பு') || clean.includes('employment')) return GOVERNMENT_SERVICES.find(s => s.id === 'EMP-1201') || null;
  if (clean.includes('பட்டா') || clean.includes('patta')) return GOVERNMENT_SERVICES.find(s => s.id === 'LND-302') || null;
  if (clean.includes('வில்லங்கம்') || clean.includes('encumbrance') || clean.includes('ec')) return GOVERNMENT_SERVICES.find(s => s.id === 'REG-701') || null;
  if (clean.includes('tneb') || clean.includes('மின் இணைப்பு') || clean.includes('electricity')) return GOVERNMENT_SERVICES.find(s => s.id === 'TNEB-502') || null;

  return null;
};

// Backward-compatible alias
export const getGovernmentServiceById = (serviceId) => findGovernmentService(serviceId);

// Helper: Search services across Tamil and English keywords with Tamil stem tolerance
export const searchGovernmentServices = (query = '', categoryId = 'all') => {
  const rawQuery = query.trim().toLowerCase();
  if (!rawQuery && categoryId === 'all') return GOVERNMENT_SERVICES;

  // Generate stem variants for Tamil search words (e.g. வருமானம் -> வருமான, குடும்பம் -> குடும்ப)
  const queryWords = rawQuery.split(/\s+/).filter(Boolean);
  const stemWords = queryWords.map(w => w.replace(/(ம்|ச்)$/, ''));

  return GOVERNMENT_SERVICES.filter(service => {
    const matchesCategory = categoryId === 'all' || service.category === categoryId;
    if (!matchesCategory) return false;
    if (!rawQuery) return true;

    const searchableText = [
      service.id,
      service.department,
      service.departmentTa,
      service.nameEn,
      service.nameTa,
      service.descriptionEn,
      service.descriptionTa,
      service.eligibilityEn,
      service.eligibilityTa,
      ...(service.requiredDocuments || []),
      ...(service.requiredDocumentsTa || [])
    ].join(' ').toLowerCase();

    // Direct substring match
    if (searchableText.includes(rawQuery)) return true;

    // Stem or word match
    return stemWords.every(stem => stem && searchableText.includes(stem)) ||
           queryWords.some(w => searchableText.includes(w));
  });
};

// Helper: Get required documents array for a service name or ID with language support
export const getRequiredDocumentsList = (serviceIdentifier, lang = 'ta') => {
  if (!serviceIdentifier) {
    return lang === 'ta'
      ? ['ஆதார் அட்டை', 'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு', 'முகவரிச் சான்று', 'பாஸ்போர்ட் அளவு புகைப்படம்', 'துணை ஆவணம்']
      : ['Aadhaar Card', 'Family Card / Smart Card', 'Address Proof', 'Passport Photo', 'Supporting Document'];
  }

  const service = findGovernmentService(serviceIdentifier);
  if (service) {
    if (lang === 'ta' && Array.isArray(service.requiredDocumentsTa) && service.requiredDocumentsTa.length > 0) {
      return service.requiredDocumentsTa;
    }
    if (Array.isArray(service.requiredDocuments) && service.requiredDocuments.length > 0) {
      return service.requiredDocuments;
    }
  }

  // Fallback
  return lang === 'ta'
    ? ['ஆதார் அட்டை', 'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு', 'முகவரிச் சான்று', 'பாஸ்போர்ட் அளவு புகைப்படம்', 'துணை ஆவணம்']
    : ['Aadhaar Card', 'Family Card / Smart Card', 'Address Proof', 'Passport Photo', 'Supporting Document'];
};
