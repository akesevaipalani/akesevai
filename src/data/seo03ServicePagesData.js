// src/data/seo03ServicePagesData.js
// Verified bilingual (Tamil & English) SEO-03 service page definitions.
// Strictly avoids hardcoded statutory fees, unconfirmed centre charges, processing-time promises,
// multi-district branch claims, or government/Aadhaar-centre impersonation.

const SITE_BASE_URL = 'https://www.akesevai.com';

export const SEO03_SERVICE_PAGES = {
  'pan-card-service': {
    id: 'pan-card-service',
    path: '/pan-card-service',
    seo: {
      title: 'PAN Card Assistance Palani & Tamil Nadu | Form 49A, Correction Guidance | AK E-SEVAI',
      description:
        'Independent PAN card application (Form 49A) & correction guidance in Palani & across Tamil Nadu. Document checklists, photo/signature tools & official portal links. Mill Road, Palani.',
      keywords:
        'PAN card service Palani, new PAN application Form 49A assistance, PAN correction online guidance Tamil Nadu, புதிய பான் கார்டு விண்ணப்பம் பழனி, பான் கார்டு பெயர் திருத்தம் உதவி',
      canonical: `${SITE_BASE_URL}/pan-card-service`,
      schemaType: 'palani-local',
      includeWebPageSchema: true,
      includeServiceSchema: true,
      breadcrumbLabel: 'PAN Card Assistance'
    },
    accentColor: '#1d4ed8',
    badgeTa: '🆔 பான் கார்டு ஆவண வழிகாட்டுதல் & உதவி',
    badgeEn: '🆔 PAN Card Application & Correction Guidance',
    h1Ta: 'பான் கார்டு விண்ணப்பம் & திருத்த உதவி (Palani & Tamil Nadu)',
    h1En: 'PAN Card Application & Correction Assistance',
    introTa:
      'புதிய பான் கார்டு (Form 49A), பெயர்/பிறந்த தேதி/கையொப்பத் திருத்தம் மற்றும் இழந்த பான் கார்டு மறுஅச்சு விண்ணப்பங்களுக்கான ஆவண சரிபார்ப்பு, புகைப்படம் & கையொப்ப அளவீடு மற்றும் அதிகாரப்பூர்வ போர்டல் வழிகாட்டுதல்.',
    introEn:
      'Step-by-step document preparation, photo/signature resizing, and independent filing guidance for new PAN card (Form 49A), PAN correction/reprint (CSF), and minor PAN applications via Protean (NSDL) and UTIITSL portals.',
    servicesCoveredTitleTa: 'நாங்கள் உதவும் முக்கிய பான் கார்டு சேவைகள்',
    servicesCoveredTitleEn: 'PAN Card Workflows Supported',
    sections: [
      {
        tagTa: 'புதிய பான் (Form 49A)',
        tagEn: 'New PAN (Form 49A)',
        titleTa: 'புதிய பான் கார்டு விண்ணப்ப உதவி',
        titleEn: 'New Individual / Minor PAN Filing Assistance',
        descTa:
          'ஆதார் e-KYC அல்லது ஆவண நகல் முறையில் புதிய பான் கார்டு பெற விண்ணப்பப் படிவ விவரங்கள், புகைப்படம் மற்றும் கையொப்பத்தைப் பிழையின்றி தயார் செய்ய உதவுகிறோம்.',
        descEn:
          'Guidance on preparing identity proofs, photograph, and black-ink signature scans cleanly before filing Form 49A on official Protean/UTIITSL portals.',
        checklistTa: [
          'விண்ணப்பதாரரின் ஆதார் அட்டை (பிறந்த தேதி & முகவரி விவரங்களுடன்)',
          'சமீபத்திய வெள்ளை பின்னணி வண்ண பாஸ்போர்ட் புகைப்படம்',
          'வெள்ளைத் தாளில் கருப்பு மையில் இடப்பட்ட தெளிவான கையொப்பம்',
          'மைனர் விண்ணப்பமெனில் பெற்றோர்/பாதுகாவலர் ஆதார் & கையொப்பம்'
        ],
        checklistEn: [
          'Applicant Aadhaar card with accurate Date of Birth and current address',
          'Recent colour passport photograph against plain white backdrop',
          'Clear signature scan in black ink on plain white paper',
          'For applicants under 18: Parent or guardian Aadhaar proof & signature'
        ]
      },
      {
        tagTa: 'திருத்தம் / மறுபதிப்பு (CSF)',
        tagEn: 'Correction / Reprint',
        titleTa: 'பெயர், பிறந்த தேதி, தந்தை பெயர் திருத்தம் & மறுஅச்சு',
        titleEn: 'PAN Details Correction & Damaged/Lost Card Reprint',
        descTa:
          'ஆதார் மற்றும் பள்ளிச் சான்றிதழ்களுடன் பொருந்தும் வகையில் பெயர், பிறந்த தேதி, புகைப்படம் மற்றும் கையொப்ப மாற்றத்திற்கான ஆவணத் தொகுப்பு வழிகாட்டுதல்.',
        descEn:
          'Checklists for aligning PAN details with Aadhaar and educational records, or requesting card re-issue when damaged or misplaced.',
        checklistTa: [
          'தற்போதுள்ள பான் கார்டு நகல் அல்லது பான் ஒதுக்கீட்டுக் கடிதம்',
          'ஆதார் அட்டை மற்றும் சமீபத்திய புகைப்படம் & கையொப்பம்',
          'முழு பெயர் மாற்றமெனில் அரசிதழ் (Gazette) / பாஸ்போர்ட் / பொருந்தும் ஆதாரம்',
          'அதிகாரப்பூர்வ போர்ட்டலில் நடப்பு அரசு கட்டணத்தைச் சரிபார்க்கவும்'
        ],
        checklistEn: [
          'Copy of existing PAN card or PAN allotment letter',
          'Applicant Aadhaar card, recent photo, and signature scan',
          'Supporting Gazette/Passport/Marriage proof where full name changed',
          'Confirm active statutory portal charges directly on Protean / UTIITSL'
        ]
      }
    ],
    officialPortals: [
      {
        labelTa: 'Protean (NSDL) PAN போர்டல்',
        labelEn: 'Protean (NSDL) Online PAN Portal',
        domain: 'onlineservices.nsdl.com',
        url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html'
      },
      {
        labelTa: 'UTIITSL PAN சேவை தளம்',
        labelEn: 'UTIITSL PAN Services Portal',
        domain: 'pan.utiitsl.com',
        url: 'https://www.pan.utiitsl.com/'
      },
      {
        labelTa: 'வருமான வரித்துறை e-Filing தளம்',
        labelEn: 'Income Tax e-Filing Portal',
        domain: 'incometax.gov.in',
        url: 'https://www.incometax.gov.in/'
      }
    ],
    relatedTools: [
      { to: '/tools/passport-size-photo', labelTa: 'பாஸ்போர்ட் போட்டோ கருவி', labelEn: 'Passport Photo Maker' },
      { to: '/tools/signature-resize', labelTa: 'கையொப்பம் ரீசைஸ்', labelEn: 'Signature Resizer' },
      { to: '/tools/photo-compress-50kb', labelTa: 'போட்டோ 50KB சுருக்கி', labelEn: '50KB Photo Compressor' }
    ],
    relatedPages: [
      { to: '/aadhaar-guidance', labelTa: 'ஆதார் வழிகாட்டுதல்', labelEn: 'Aadhaar Guidance' },
      { to: '/esevai-application-assistance', labelTa: 'இ-சேவை விண்ணப்ப உதவி', labelEn: 'e-Sevai Filing Assistance' }
    ],
    faqs: [
      {
        qTa: 'புதிய பான் கார்டுக்கு ஆதார் கார்டு மட்டும் போதுமா?',
        qEn: 'Is Aadhaar sufficient for a new individual PAN application?',
        aTa: 'பொதுவாக ஆதார் அட்டை அடையாளம், முகவரி மற்றும் பிறந்த தேதி ஆதாரமாக ஏற்கப்படுகிறது. e-KYC முறையில் ஆதாரில் இணைக்கப்பட்ட மொபைல் OTP தேவைப்படலாம்; சமீபத்திய விதிகளை Protean/UTIITSL போர்ட்டலில் சரிபார்க்கவும்.',
        aEn: 'In standard individual applications, Aadhaar serves as proof of identity, address, and date of birth, and paperless e-KYC uses Aadhaar OTP. Confirm active portal eligibility directly on Protean/UTIITSL.'
      },
      {
        qTa: 'பான் கார்டுக்கான புகைப்படம் மற்றும் கையொப்ப அளவை நானே தயார் செய்ய முடியுமா?',
        qEn: 'Can I prepare PAN photo and signature dimensions online before applying?',
        aTa: 'ஆம்! எங்கள் இலவச Passport Photo Maker மற்றும் Signature Resize கருவிகள் மூலம் உங்கள் பிரவுசரிலேயே படங்களைத் தயார் செய்யலாம்.',
        aEn: 'Yes. You can format your photo and signature strictly inside your browser using our free Passport Photo Maker and Signature Resizer utilities.'
      },
      {
        qTa: 'பான் கார்டு வழங்கப்படுவதற்கான கட்டணம் மற்றும் கால அளவு எவ்வளவு?',
        qEn: 'Where should I verify current PAN application fees and dispatch status?',
        aTa: 'அதிகாரப்பூர்வ பான் கார்டு கட்டணங்கள் மற்றும் ஒப்புதல்/அஞ்சல் நிலை விவரங்கள் Protean (onlineservices.nsdl.com) அல்லது UTIITSL (pan.utiitsl.com) தளங்களின் விதிகளுக்கு உட்பட்டவை.',
        aEn: 'Statutory application fees, allotment timing, and India Post tracking depend solely on Income Tax Department, Protean, and UTIITSL portal policies.'
      },
      {
        qTa: 'நேரில் உதவியும் ஆன்லைன் உதவியும் எங்கே கிடைக்கும்?',
        qEn: 'Where can I get walk-in or remote PAN preparation support?',
        aTa: 'நேரடி கவுண்டர் உதவி பழனி, மில் ரோடு மையத்தில் மட்டுமே வழங்கப்படுகிறது. தமிழ்நாட்டின் பிற மாவட்ட வாசிகள் எங்கள் இலவச பிரவுசர் கருவிகள் & வாட்ஸ்அப் (+91 93423 18844) வழிகாட்டலைப் பெறலாம்.',
        aEn: 'Walk-in document scanning and counter assistance are provided at our single centre on Mill Road, Palani 624601; online tools and WhatsApp guidance support users across Tamil Nadu.'
      }
    ]
  },

  'income-certificate': {
    id: 'income-certificate',
    path: '/income-certificate',
    seo: {
      title: 'Income Certificate Application Guidance Tamil Nadu & Palani | AK E-SEVAI',
      description:
        'Verified document checklist, browser PDF tools & TNeGA online guidance for Tamil Nadu Income Certificate. Walk-in support at Mill Road, Palani (624601).',
      keywords:
        'Income certificate apply online Tamil Nadu, TNeGA income certificate documents, income certificate assistance Palani, வருமானச் சான்றிதழ் விண்ணப்பம் தமிழ்நாடு, வருமானச் சான்றிதழ் ஆவணங்கள் பழனி',
      canonical: `${SITE_BASE_URL}/income-certificate`,
      schemaType: 'statewide-service',
      includeWebPageSchema: true,
      includeServiceSchema: true,
      breadcrumbLabel: 'Income Certificate Guidance'
    },
    accentColor: '#047857',
    badgeTa: '📄 வருவாய்த்துறை • வருமானச் சான்றிதழ் வழிகாட்டி',
    badgeEn: '📄 Revenue Department • Income Certificate Guidance',
    h1Ta: 'வருமானச் சான்றிதழ் விண்ணப்ப வழிகாட்டுதல் (Tamil Nadu)',
    h1En: 'Tamil Nadu Income Certificate Application Guidance',
    introTa:
      'கல்வி உதவித்தொகை (Scholarships), பள்ளிக் கட்டணச் சலுகை, RTE மற்றும் அரசு நலத்திட்டங்களுக்கு வட்டாட்சியர் வருமானச் சான்றிதழ் விண்ணப்பிக்கத் தேவையான ஆவணச் சரிபார்ப்பு & TNeGA போர்டல் வழிகாட்டுதல்.',
    introEn:
      'Organized document checklists, self-declaration orientation, and PDF preparation tools for citizens applying for a Tamil Nadu Income Certificate through the official TNeGA e-Sevai portal.',
    servicesCoveredTitleTa: 'ஆவணப் பட்டியல் & விண்ணப்ப தயாரிப்பு',
    servicesCoveredTitleEn: 'Document Preparation & Verification Scope',
    sections: [
      {
        tagTa: 'அடிப்படை ஆவணங்கள்',
        tagEn: 'Core Checklist',
        titleTa: 'வருமானச் சான்றிதழுக்குத் பொதுவாகத் தேவையான ஆவணங்கள்',
        titleEn: 'Commonly Requested Documents (Confirm Active Portal List)',
        descTa:
          'TNeGA இ-சேவை தளத்தில் விண்ணப்பிக்கும் முன் குடும்ப உறுப்பினர்களின் ஆண்டு வருமான விவரங்கள் மற்றும் கீழ்க்கண்ட ஆவணங்களைத் தெளிவாகத் தயார் செய்யவும்.',
        descEn:
          'Prepare legible scans and accurate family annual income figures prior to submitting through Citizen Portal or an authorized e-Sevai desk.',
        checklistTa: [
          'விண்ணப்பதாரரின் ஆதார் அட்டை & குடும்ப அட்டை (Smart Ration Card)',
          'சம்பளச் சீட்டு / Form 16 / வருமான ஆதாரம் அல்லது சுய வருமான உறுதிமொழி',
          'சமீபத்திய பாஸ்போர்ட் சைஸ் புகைப்படம் & சுய அறிவிப்புப் படிவம்',
          'OTP & CAN பதிவுக்கான செயல்பாட்டில் உள்ள மொபைல் எண்'
        ],
        checklistEn: [
          'Applicant Aadhaar card and Smart Ration / Family Card',
          'Salary slip / Form 16 / employer proof or self-income declaration (as applicable)',
          'Passport-size photograph & signed Self-Declaration Form',
          'Active mobile number linked to Citizen Access Number (CAN) OTP'
        ]
      },
      {
        tagTa: 'துறை சார்ந்த சரிபார்ப்பு',
        tagEn: 'Departmental Process',
        titleTa: 'விண்ணப்பத்திற்குப் பிறகான அரசு நடைமுறை & போர்டல் சோதனை',
        titleEn: 'Revenue Verification & Digital Certificate Download',
        descTa:
          'சான்றிதழ்களை வெளியிடும் அதிகாரம் முழுமையாகத் தமிழ்நாடு வருவாய்த்துறைக்கு (VAO, RI, Tahsildar) உட்பட்டது. AK E-SEVAI ஆவணத் தயாரிப்பு & வழிகாட்டுதலை மட்டுமே வழங்குகிறது.',
        descEn:
          'Official verification and issuance are conducted exclusively by Tamil Nadu Revenue authorities (VAO / RI / Tahsildar). AK E-SEVAI provides document formatting and filing assistance only.',
        checklistTa: [
          'அதிகாரப்பூர்வ tnesevai.tn.gov.in தளத்தில் CAN எண் சரிபார்ப்பு',
          'அனைத்து PDF பக்கங்களையும் போர்டல் KB வரம்பிற்குள் தெளிவாகச் சுருக்குதல்',
          'அதிகாரப்பூர்வ Status Search இணைப்பில் TN-விண்ணப்ப எண்ணைச் சரிபார்த்தல்',
          'உதவிக்கு பழனி மில் ரோடு மையம் அல்லது வாட்ஸ்அப் வழிகாட்டல்'
        ],
        checklistEn: [
          'Register or confirm Citizen Access Number (CAN) on tnesevai.tn.gov.in',
          'Compress multi-page declaration and proofs cleanly inside browser',
          'Track official application approval status on the TNeGA Public Search link',
          'Walk-in help available only in Palani; online tools accessible across Tamil Nadu'
        ]
      }
    ],
    officialPortals: [
      {
        labelTa: 'தமிழ்நாடு இ-சேவை (TNeGA)',
        labelEn: 'TNeGA Official e-Sevai Portal',
        domain: 'tnesevai.tn.gov.in',
        url: 'https://www.tnesevai.tn.gov.in/'
      },
      {
        labelTa: 'குடிமக்கள் உள்நுழைவு (Citizen Portal)',
        labelEn: 'TNeGA Citizen Login & CAN Registration',
        domain: 'tnesevai.tn.gov.in',
        url: 'https://tnesevai.tn.gov.in/Citizen/'
      },
      {
        labelTa: 'விண்ணப்ப நிலை சோதனை',
        labelEn: 'TNeGA Public Application Status Search',
        domain: 'tnesevai.tn.gov.in',
        url: 'https://www.tnesevai.tn.gov.in/edistrict/CheckStatus/PublicSearch/'
      }
    ],
    relatedTools: [
      { to: '/tools/document-size-checker', labelTa: 'ஆவண அளவு சோதனை', labelEn: 'Document Size Checker' },
      { to: '/tools/pdf-compress', labelTa: 'PDF சுருக்கி', labelEn: 'PDF Compressor' },
      { to: '/tools/photo-compress-50kb', labelTa: 'போட்டோ 50KB சுருக்கி', labelEn: '50KB Photo Compressor' }
    ],
    relatedPages: [
      { to: '/community-certificate', labelTa: 'சாதிச் சான்றிதழ் வழிகாட்டி', labelEn: 'Community Certificate Guide' },
      { to: '/certificate-services', labelTa: 'அனைத்து சான்றிதழ் சேவைகள்', labelEn: 'All Certificate Services' }
    ],
    faqs: [
      {
        qTa: 'வருமானச் சான்றிதழுக்கு வங்கி பாஸ்புக் அல்லது சம்பளச் சீட்டு கட்டாயமா?',
        qEn: 'Is a salary slip or bank statement always mandatory for an Income Certificate?',
        aTa: 'விண்ணப்பதாரர் அரசு/தனியார் ஊழியராக இருப்பின் சம்பளச் சீட்டு அல்லது படிவம் 16 கோரப்படலாம்; விவசாயி அல்லது சுயதொழில் செய்பவர்களுக்குப் பொருந்தும் ஆதாரம் மற்றும் சுய உறுதிமொழிப் படிவம் பயன்படும். அதிகாரப்பூர்வ TNeGA பட்டியலைச் சரிபார்க்கவும்.',
        aEn: 'Requirements depend on occupation: salaried applicants typically attach a salary slip or Form 16, whereas self-employed or agricultural families provide applicable proofs and self-declaration per TNeGA rules.'
      },
      {
        qTa: 'வருமானச் சான்றிதழ் ஒப்புதலை AK E-SEVAI வழங்குகிறதா?',
        qEn: 'Does AK E-SEVAI approve or issue the Income Certificate?',
        aTa: 'இல்லை. AK E-SEVAI தனியார் ஆவண உதவி மையம் மட்டுமே. சான்றிதழ் ஆய்வு மற்றும் ஒப்புதல் முழுமையாக வருவாய்த்துறை (VAO / RI / வட்டாட்சியர்) அதிகாரிகளால் மட்டுமே செய்யப்படும்.',
        aEn: 'No. AK E-SEVAI is an independent private assistance centre. Revenue authorities (VAO, RI, Tahsildar) review, verify, and digitally issue all statutory certificates.'
      },
      {
        qTa: 'அரசு கட்டணம் மற்றும் சான்றிதழ் கிடைக்க ஆகும் நாட்களை எங்கு சரிபார்ப்பது?',
        qEn: 'Where can I check current statutory fees and processing timelines?',
        aTa: 'நடப்பு அரசு கட்டண விவரம் மற்றும் விண்ணப்ப கால அளவு தமிழ்நாடு அரசின் அதிகாரப்பூர்வ tnesevai.tn.gov.in தளத்தில் வெளியிடப்படும் விதிகளுக்கு உட்பட்டது.',
        aEn: 'Official fees and statutory verification schedules are governed strictly by Tamil Nadu Revenue / TNeGA notifications on tnesevai.tn.gov.in.'
      }
    ]
  },

  'community-certificate': {
    id: 'community-certificate',
    path: '/community-certificate',
    seo: {
      title: 'Community Certificate Online Guidance Tamil Nadu & Palani | AK E-SEVAI',
      description:
        'Complete document checklist & PDF preparation guidance for Tamil Nadu Community Certificate (BC, BCM, MBC, DNC, SC, ST). Independent walk-in desk in Palani.',
      keywords:
        'Community certificate Tamil Nadu online guidance, caste certificate documents TNeGA, community certificate help Palani, சாதிச் சான்றிதழ் விண்ணப்பம் தமிழ்நாடு, கம்யூனிட்டி சர்டிபிகேட் ஆவணங்கள் பழனி',
      canonical: `${SITE_BASE_URL}/community-certificate`,
      schemaType: 'statewide-service',
      includeWebPageSchema: true,
      includeServiceSchema: true,
      breadcrumbLabel: 'Community Certificate Guidance'
    },
    accentColor: '#7c3aed',
    badgeTa: '📜 வருவாய்த்துறை • சாதிச் சான்றிதழ் வழிகாட்டி',
    badgeEn: '📜 Revenue Department • Community Certificate Guidance',
    h1Ta: 'சாதிச் சான்றிதழ் (Community Certificate) ஆன்லைன் வழிகாட்டுதல்',
    h1En: 'Tamil Nadu Community Certificate Application Guidance',
    introTa:
      'கல்வி, இடஒதுக்கீடு, உதவித்தொகை மற்றும் அரசு வேலைவாய்ப்புக்காக BC / BCM / MBC / DNC / SC / SCA / ST சாதிச் சான்றிதழ் விண்ணப்பிக்கத் தேவையான ஆவணத் தயாரிப்பு & TNeGA வழிகாட்டுதல்.',
    introEn:
      'Detailed document preparation checklists and PDF merge utilities to help Tamil Nadu citizens organize community, school, and family records accurately for e-Sevai Community Certificate filing.',
    servicesCoveredTitleTa: 'சாதிச் சான்றிதழ் ஆவணத் தொகுப்பு & நடைமுறை',
    servicesCoveredTitleEn: 'Community Certificate Filing Checklist',
    sections: [
      {
        tagTa: 'அத்தியாவசிய ஆவணங்கள்',
        tagEn: 'Required Proofs',
        titleTa: 'விண்ணப்பதாரர் தயார் செய்ய வேண்டிய ஆவணங்கள்',
        titleEn: 'Core Documents to Keep Ready Before Applying',
        descTa:
          'பெற்றோர் அல்லது உடன்பிறந்தோரின் சாதிச் சான்றிதழ் மற்றும் பள்ளி மாற்றுச் சான்றிதழ் தெளிவாகப் படிக்கக்கூடிய PDF-ஆக இருக்க வேண்டும்.',
        descEn:
          'Keep clear, legible PDF scans of school records and parent/sibling community proof ready before starting CAN submission.',
        checklistTa: [
          'விண்ணப்பதாரரின் ஆதார் அட்டை & ஸ்மார்ட் குடும்ப அட்டை',
          'பள்ளி மாற்றுச் சான்றிதழ் (TC) / மதிப்பெண் பட்டியல் (சாதி விவரம் உள்ளவாறு)',
          'பெற்றோர் அல்லது உடன்பிறந்தோரின் சாதிச் சான்றிதழ்',
          'பாஸ்போர்ட் அளவு புகைப்படம் & சுய அறிவிப்புப் படிவம்'
        ],
        checklistEn: [
          'Applicant Aadhaar card and Smart Ration / Family Card',
          'School Transfer Certificate (TC) or Marksheet indicating community',
          'Existing Community Certificate of parent or sibling (where available)',
          'Passport-size photograph & signed Self-Declaration Form'
        ]
      },
      {
        tagTa: 'முதல்முறை விண்ணப்பம்',
        tagEn: 'First-Time Family Filing',
        titleTa: 'குடும்பத்தில் முதல்முறையாக விண்ணப்பிக்கும்போது கூடுதல் குறிப்பு',
        titleEn: 'Special Notes for First-in-Family Applicants',
        descTa:
          'குடும்பத்தில் இதுவரை சாதிச் சான்றிதழ் இல்லாதபோது தந்தை வழி உறவினர் சான்றிதழ் & வம்சாவளி விவரம் துறை ஆய்வில் கோரப்படலாம்.',
        descEn:
          'When applying for the first time in a family line, field officers may ask for paternal relative community records and genealogical proof.',
        checklistTa: [
          'தந்தை வழி இரத்த உறவினர்களின் சாதிச் சான்றிதழ் & வம்சாவளி சான்று (தேவைக்கேற்ப)',
          'பல பக்கச் சான்றுகளை எங்கள் PDF Merge கருவி மூலம் ஒரே PDF-ஆக இணைக்கவும்',
          'டிஜிட்டல் கையொப்பம் & QR குறியீட்டுடன் கூடிய சான்றிதழை அரசே வெளியிடும்',
          'நேரடி உதவி பழனி மில் ரோடு மையத்தில் மட்டும்; ஆன்லைன் கருவிகள் அனைவருக்கும்'
        ],
        checklistEn: [
          'Paternal relatives’ community records & genealogical lineage (when requested)',
          'Combine multi-page proofs cleanly into one file via our local PDF Merge tool',
          'Digital certificate issuance is strictly governed by Tamil Nadu Revenue Dept.',
          'Walk-in counter in Palani only; online utilities serve entire Tamil Nadu'
        ]
      }
    ],
    officialPortals: [
      {
        labelTa: 'தமிழ்நாடு இ-சேவை (TNeGA)',
        labelEn: 'TNeGA Official e-Sevai Portal',
        domain: 'tnesevai.tn.gov.in',
        url: 'https://www.tnesevai.tn.gov.in/'
      },
      {
        labelTa: 'குடிமக்கள் போர்டல் (Citizen Login)',
        labelEn: 'TNeGA Citizen Portal',
        domain: 'tnesevai.tn.gov.in',
        url: 'https://tnesevai.tn.gov.in/Citizen/'
      }
    ],
    relatedTools: [
      { to: '/tools/pdf-merge', labelTa: 'PDF இணைப்பு கருவி', labelEn: 'PDF Merge Tool' },
      { to: '/tools/jpg-to-pdf', labelTa: 'JPG → PDF மாற்றி', labelEn: 'JPG to PDF Converter' },
      { to: '/tools/passport-size-photo', labelTa: 'பாஸ்போர்ட் போட்டோ', labelEn: 'Passport Photo Maker' }
    ],
    relatedPages: [
      { to: '/income-certificate', labelTa: 'வருமானச் சான்றிதழ் வழிகாட்டி', labelEn: 'Income Certificate Guide' },
      { to: '/esevai-application-assistance', labelTa: 'இ-சேவை விண்ணப்ப உதவி', labelEn: 'e-Sevai Application Assistance' }
    ],
    faqs: [
      {
        qTa: 'பெற்றோரின் சாதிச் சான்றிதழ் இல்லாமல் விண்ணப்பிக்க முடியுமா?',
        qEn: 'Can someone apply without a parent’s existing community certificate?',
        aTa: 'முதல்முறை விண்ணப்பதாரர்களுக்கு தந்தை வழி உறவினர்களின் சாதிச் சான்றிதழ், பள்ளி TC மற்றும் வம்சாவளி ஆவணங்கள் வருவாய்த்துறை ஆய்வில் கோரப்படலாம். அதிகாரப்பூர்வ TNeGA வழிகாட்டுதலைச் சரிபார்க்கவும்.',
        aEn: 'First-time applicants may be asked during VAO/RI verification for paternal relatives’ community certificates, school TC details, and genealogical records per Revenue rules.'
      },
      {
        qTa: 'பல பக்க சான்றிதழ்களை ஒரே PDF கோப்பாக மாற்றுவது எப்படி?',
        qEn: 'How do I combine Aadhaar, TC, and family proofs into a single PDF upload?',
        aTa: 'எங்கள் JPG to PDF மற்றும் PDF Merge கருவிகள் உங்கள் பிரவுசருக்குள்ளேயே செயல்படுவதால் தனிப்பட்ட சான்றிதழ்களை சர்வருக்குப் பதிவேற்றாமல் பாதுகாப்பாக இணைக்கலாம்.',
        aEn: 'Use our client-side JPG to PDF and PDF Merge tools directly in your browser so sensitive family certificates never leave your device.'
      },
      {
        qTa: 'அதிகாரப்பூர்வ சாதிச் சான்றிதழை யார் வெளியிடுகிறார்கள்?',
        qEn: 'Which authority approves and issues the Community Certificate?',
        aTa: 'தமிழ்நாடு வருவாய்த்துறை அலுவலர்கள் (VAO, RI, வட்டாட்சியர் / கோட்டாட்சியர்) மட்டுமே சரிபார்த்து டிஜிட்டல் சான்றிதழை வழங்குகிறார்கள். AK E-SEVAI தனியார் உதவி மையம் மட்டுமே.',
        aEn: 'Only Tamil Nadu Revenue authorities (VAO, RI, Tahsildar / RDO depending on category) verify and issue the digitally signed certificate. AK E-SEVAI provides private preparation assistance.'
      }
    ]
  },

  'smart-ration-card': {
    id: 'smart-ration-card',
    path: '/smart-ration-card',
    seo: {
      title: 'Smart Ration Card (TNPDS) Assistance Tamil Nadu & Palani | AK E-SEVAI',
      description:
        'Checklist & online assistance guide for TNPDS Smart Ration Card new requests, member addition, deletion & address updates across Tamil Nadu. Walk-in support in Palani.',
      keywords:
        'Smart ration card assistance Tamil Nadu, TNPDS add family member address change guidance, ration card help Palani, ஸ்மார்ட் குடும்ப அட்டை சேவைகள் தமிழ்நாடு, ரேஷன் கார்டு பெயர் சேர்த்தல் பழனி',
      canonical: `${SITE_BASE_URL}/smart-ration-card`,
      schemaType: 'statewide-service',
      includeWebPageSchema: true,
      includeServiceSchema: true,
      breadcrumbLabel: 'Smart Ration Card Guidance'
    },
    accentColor: '#0284c7',
    badgeTa: '🪪 உணவுப்பொருள் வழங்கல் துறை • TNPDS வழிகாட்டி',
    badgeEn: '🪪 Civil Supplies (TNPDS) • Smart Ration Card Guidance',
    h1Ta: 'ஸ்மார்ட் குடும்ப அட்டை (Smart Ration Card / TNPDS) வழிகாட்டுதல்',
    h1En: 'Smart Ration Card (TNPDS) Online Assistance Guide',
    introTa:
      'புதிய ஸ்மார்ட் குடும்ப அட்டை, உறுப்பினர் சேர்த்தல்/நீக்கல், முகவரி மாற்றம் மற்றும் குடும்பத் தலைவர் மாற்றத்திற்கு TNPDS போர்ட்டலில் தேவையான ஆவணங்களைச் சரியாகத் தயார் செய்யும் வழிகாட்டல்.',
    introEn:
      'Clear bilingual checklist and image/PDF resizing guidance for submitting new Smart Family Card, member addition, deletion, and address change requests on the official Tamil Nadu TNPDS portal.',
    servicesCoveredTitleTa: 'TNPDS முக்கிய சேவை பிரிவுகள்',
    servicesCoveredTitleEn: 'Common Smart Ration Card Requests',
    sections: [
      {
        tagTa: 'புதிய அட்டை விண்ணப்பம்',
        tagEn: 'New Family Card',
        titleTa: 'புதிய ஸ்மார்ட் கார்டு விண்ணப்ப ஆவணங்கள்',
        titleEn: 'Applying for a New Smart Ration Card',
        descTa:
          'புதிதாகத் தனிக்குடித்தனம் செல்லும் குடும்பங்கள் அனைத்து உறுப்பினர்களின் ஆதார் & முந்தைய அட்டை பெயர் நீக்கச் சான்றுடன் விண்ணப்பிக்க வேண்டும்.',
        descEn:
          'Newly formed separate households require Aadhaar proofs of all members and deletion/surrender proof confirming no active duplicate entry.',
        checklistTa: [
          'சேர்க்கப்பட வேண்டிய அனைத்து குடும்ப உறுப்பினர்களின் ஆதார் அட்டைகள்',
          'குடியிருப்பு முகவரி சான்று (மின் பில் / கேஸ் பில் / சொத்துவரி / வாடகை ஒப்பந்தம்)',
          'முந்தைய குடும்ப அட்டையிலிருந்து பெயர் நீக்கச் சான்று (Deletion Slip)',
          'குடும்பத் தலைவரின் புகைப்படம் & OTP பெற செயல்பாட்டில் உள்ள மொபைல் எண்'
        ],
        checklistEn: [
          'Aadhaar cards of all family members to be listed in the household',
          'Current residence proof (EB Bill / LPG receipt / Tax receipt / Rental agreement)',
          'Name deletion / surrender certificate from previous family ration card',
          'Head-of-Family passport photo & active mobile number for TNPDS OTP'
        ]
      },
      {
        tagTa: 'திருத்தம் & சேர்த்தல்',
        tagEn: 'Updates & Additions',
        titleTa: 'உறுப்பினர் சேர்த்தல், நீக்கல் & முகவரி மாற்றம்',
        titleEn: 'Member Addition, Removal & Address Correction',
        descTa:
          'பிறந்த குழந்தை, திருமணத்திற்குப் பிந்தைய பெயர் சேர்த்தல் அல்லது முகவரி மாற்றத்திற்கான ஆதாரங்களைத் தெளிவான JPG/PDF வடிவில் தயார் செய்யுங்கள்.',
        descEn:
          'Upload clean supporting proofs within TNPDS size rules when updating family members or shifting residence address.',
        checklistTa: [
          '12-இலக்க ஸ்மார்ட் கார்டு எண் & பதிவு செய்யப்பட்ட மொபைல் OTP',
          'குழந்தை சேர்க்க: நகராட்சி/உள்ளாட்சி வழங்கிய பிறப்புச் சான்றிதழ்',
          'திருமணமான உறுப்பினர் சேர்க்க: திருமணச் சான்று & பழைய அட்டை நீக்கச் சான்று',
          'துறை ஒப்புதல் & அட்டை அச்சிடலை tnpds.gov.in-ல் கண்காணிக்கவும்'
        ],
        checklistEn: [
          'Existing 12-digit Smart Card number & registered mobile OTP',
          'For child addition: Official municipal/local-body Birth Certificate',
          'For spouse addition: Marriage certificate + previous card Deletion Slip',
          'Verify live application approval status directly on tnpds.gov.in'
        ]
      }
    ],
    officialPortals: [
      {
        labelTa: 'தமிழ்நாடு TNPDS அதிகாரப்பூர்வ போர்டல்',
        labelEn: 'TNPDS Tamil Nadu Official Portal',
        domain: 'tnpds.gov.in',
        url: 'https://www.tnpds.gov.in/'
      }
    ],
    relatedTools: [
      { to: '/tools/image-to-pdf', labelTa: 'Image → PDF கருவி', labelEn: 'Image to PDF Tool' },
      { to: '/tools/photo-compress-100kb', labelTa: 'போட்டோ 100KB சுருக்கி', labelEn: '100KB Photo Compressor' },
      { to: '/tools/pdf-compress', labelTa: 'PDF சுருக்கி', labelEn: 'PDF Compressor' }
    ],
    relatedPages: [
      { to: '/aadhaar-guidance', labelTa: 'ஆதார் வழிகாட்டுதல்', labelEn: 'Aadhaar Guidance' },
      { to: '/tn-govt-services-guide', labelTa: 'தமிழ்நாடு அரசு சேவைகள்', labelEn: 'TN Govt Services Guide' }
    ],
    faqs: [
      {
        qTa: 'புதிதாகத் திருமணமானவரின் பெயரை குடும்ப அட்டையில் சேர்க்க என்ன முக்கிய ஆவணம் தேவை?',
        qEn: 'What key proof is required to add a spouse to an existing Smart Ration Card?',
        aTa: 'சேர்க்கப்பட வேண்டியவரின் ஆதார், திருமண ஆதாரம் மற்றும் அவரது பெற்றோர் குடும்ப அட்டையிலிருந்து பெயர் நீக்கம் செய்யப்பட்ட சான்றிதழ் (Deletion Certificate) அவசியம்.',
        aEn: 'Along with Aadhaar and marriage proof, a Name Deletion Certificate confirming removal from the previous family ration card is required.'
      },
      {
        qTa: 'TNPDS விண்ணப்ப நிலையை எப்படிச் சரிபார்ப்பது?',
        qEn: 'How can I check my Smart Ration Card application status?',
        aTa: 'tnpds.gov.in இணையதளத்தில் வழங்கப்பட்ட Reference Number உள்ளிட்டு விண்ணப்பத்தின் தற்போதைய நிலையை நேரடியாகத் தெரிந்துகொள்ளலாம்.',
        aEn: 'Enter your TNPDS Reference Number directly on tnpds.gov.in to track Civil Supplies verification and card dispatch.'
      },
      {
        qTa: 'ரேஷன் கார்டு ஒப்புதலை AK E-SEVAI வழங்குகிறதா?',
        qEn: 'Does AK E-SEVAI verify or dispatch Smart Ration Cards?',
        aTa: 'இல்லை. கள ஆய்வு, ஒப்புதல் மற்றும் கார்டு வழங்குதல் முழுமையாகத் தமிழ்நாடு உணவுப்பொருள் வழங்கல் துறை (TSO / TNPDS) அதிகாரிகளின் முடிவிற்கு உட்பட்டது. நாங்கள் ஆவணத் தயாரிப்பு & விண்ணப்ப வழிகாட்டுதலை மட்டுமே வழங்குகிறோம்.',
        aEn: 'No. Field verification, approval, and card dispatch are handled exclusively by Civil Supplies (TNPDS) officials. AK E-SEVAI offers private document preparation and portal assistance.'
      }
    ]
  },

  'patta-chitta': {
    id: 'patta-chitta',
    path: '/patta-chitta',
    seo: {
      title: 'Patta / Chitta & Tamil Nilam Guidance Palani & Tamil Nadu | AK E-SEVAI',
      description:
        'How to look up Patta Chitta extracts online via Tamil Nilam (eservices.tn.gov.in) and organize deeds/EC PDFs for Patta Name Transfer across Tamil Nadu. Walk-in desk in Palani.',
      keywords:
        'Patta Chitta online guidance Tamil Nadu, Tamil Nilam patta transfer documents, patta chitta assistance Palani, பட்டா சிட்டா பதிவிறக்கம் தமிழ் நிலம், பட்டா பெயர் மாற்றம் ஆவணங்கள் பழனி',
      canonical: `${SITE_BASE_URL}/patta-chitta`,
      schemaType: 'statewide-service',
      includeWebPageSchema: true,
      includeServiceSchema: true,
      breadcrumbLabel: 'Patta & Chitta Guidance'
    },
    accentColor: '#b45309',
    badgeTa: '🗺️ வருவாய்த்துறை & தமிழ் நிலம் • பட்டா/சிட்டா வழிகாட்டி',
    badgeEn: '🗺️ Revenue & Survey (Tamil Nilam) • Patta / Chitta Guidance',
    h1Ta: 'பட்டா / சிட்டா (Patta & Chitta) & நில ஆவண வழிகாட்டுதல்',
    h1En: 'Tamil Nadu Patta, Chitta & Land Record Guidance',
    introTa:
      'தமிழ் நிலம் (Tamil Nilam) போர்ட்டலில் கிராமம் & நகர்ப்புற பட்டா/சிட்டா விவரம் பார்ப்பது மற்றும் பட்டா பெயர் மாற்ற விண்ணப்பத்திற்குப் பத்திரம் & வில்லங்கச் சான்று (EC) PDF தயார் செய்யும் வழிகாட்டல்.',
    introEn:
      'Step-by-step orientation for viewing digitally signed Patta & Chitta extracts on Tamil Nilam and compiling registered deeds, EC, and identity PDFs cleanly for Patta transfer assistance.',
    servicesCoveredTitleTa: 'பட்டா / சிட்டா முக்கிய பிரிவுகள்',
    servicesCoveredTitleEn: 'Land Record Checklists & Portal Orientation',
    sections: [
      {
        tagTa: 'பட்டா/சிட்டா பார்வையிட',
        tagEn: 'View / Download Extract',
        titleTa: 'தமிழ் நிலம் இணையதளத்தில் பட்டா/சிட்டா சரிபார்த்தல்',
        titleEn: 'Checking Patta / Chitta / TSLR Extracts Online',
        descTa:
          'இணையவழியில் பட்டா/சிட்டா நகல் பார்க்க ஆவணப் பதிவேற்றம் தேவையில்லை; நிலத்தின் சரியான இருப்பிட & சர்வே எண் விவரங்கள் மட்டும் போதுமானது.',
        descEn:
          'Viewing a QR-verified Patta/Chitta copy online requires no document upload — only exact revenue location and survey details.',
        checklistTa: [
          'மாவட்டம், வட்டம் மற்றும் வருவாய் கிராமம் பெயர்',
          'பட்டா எண் அல்லது சர்வே எண் & உட்பிரிவு எண் (Sub-division)',
          'நகர்ப்புற நிலமெனில் வார்டு, பிளாக் மற்றும் நகர நில அளவை (TSLR) எண்',
          'அதிகாரப்பூர்வ eservices.tn.gov.in போர்ட்டலில் QR-பட்டா சரிபார்த்தல்'
        ],
        checklistEn: [
          'Exact District, Taluk, and Revenue Village selection',
          'Patta Number OR Survey Number and Sub-division number',
          'For urban parcels: Ward, Block, and Town Survey (TSLR) number',
          'Verify digitally signed e-Patta copy directly on eservices.tn.gov.in'
        ]
      },
      {
        tagTa: 'பட்டா பெயர் மாற்றம்',
        tagEn: 'Patta Transfer Prep',
        titleTa: 'பட்டா பெயர் மாற்ற விண்ணப்பத்திற்குத் தேவையான ஆவணங்கள்',
        titleEn: 'Documents Prepared for Patta Transfer Requests',
        descTa:
          'பத்திரம் பதிவு செய்யப்பட்ட பின் பட்டா பெயர் மாற்ற விண்ணப்பத்திற்கு அனைத்துப் பக்கங்களையும் தெளிவான PDF-ஆகத் தயார் செய்வது அவசியம்.',
        descEn:
          'Compile registered title documents and recent EC copies clearly before filing through Tamil Nilam / authorized e-Sevai portals.',
        checklistTa: [
          'பதிவு செய்யப்பட்ட கிரயப் பத்திரம் / பாகப்பிரிவினை / செட்டில்மெண்ட் பத்திரம்',
          'முந்தைய பட்டா/சிட்டா நகல் & நடப்பு வில்லங்கச் சான்றிதழ் (EC)',
          'விண்ணப்பதாரரின் ஆதார் அட்டை & நில வரி / சொத்துவரி ரசீது',
          'பெரிய பத்திரப் பக்கங்களை எங்கள் PDF Split/Compress மூலம் சீரமைக்கலாம்'
        ],
        checklistEn: [
          'Registered Sale, Partition, Gift, or Settlement Deed copy',
          'Previous Patta/Chitta record & recent Encumbrance Certificate (EC)',
          'Applicant Aadhaar card & tax/kist receipt (where applicable)',
          'Split or compress scanned deed pages in browser to meet portal limits'
        ]
      }
    ],
    officialPortals: [
      {
        labelTa: 'தமிழ் நிலம் (Patta/Chitta Portal)',
        labelEn: 'Tamil Nilam Official Portal',
        domain: 'eservices.tn.gov.in',
        url: 'https://eservices.tn.gov.in/eservicesnew/home.html'
      },
      {
        labelTa: 'TNREGINET (EC / வில்லங்கம்)',
        labelEn: 'TNREGINET Registration Portal (EC)',
        domain: 'tnreginet.gov.in',
        url: 'https://tnreginet.gov.in/'
      }
    ],
    relatedTools: [
      { to: '/tools/pdf-merge', labelTa: 'PDF இணைப்பு', labelEn: 'PDF Merge Tool' },
      { to: '/tools/pdf-compress', labelTa: 'PDF சுருக்கி', labelEn: 'PDF Compressor' },
      { to: '/tools/pdf-split', labelTa: 'PDF பிரிப்பு', labelEn: 'PDF Split Tool' }
    ],
    relatedPages: [
      { to: '/tn-govt-services-guide', labelTa: 'அரசு சேவைகள் வழிகாட்டி', labelEn: 'TN Govt Services Guide' },
      { to: '/esevai-application-assistance', labelTa: 'இ-சேவை விண்ணப்ப உதவி', labelEn: 'e-Sevai Application Assistance' }
    ],
    faqs: [
      {
        qTa: 'பட்டா/சிட்டா இணையவழியில் பார்க்க எந்த ஆவணங்கள் வேண்டும்?',
        qEn: 'Are scanned documents required just to view or verify Patta/Chitta?',
        aTa: 'இல்லை. eservices.tn.gov.in போர்ட்டலில் மாவட்டம், வட்டம், கிராமம் மற்றும் சர்வே எண் / பட்டா எண்ணை உள்ளிட்டு பட்டா/சிட்டா நகலைப் பார்க்கலாம்.',
        aEn: 'No uploads are required to view an extract. Only District, Taluk, Village, and Survey or Patta Number are needed on eservices.tn.gov.in.'
      },
      {
        qTa: 'வில்லங்கச் சான்றிதழ் (EC) மற்றும் பட்டா இரண்டும் ஒன்றா?',
        qEn: 'What is the difference between Encumbrance Certificate (EC) and Patta?',
        aTa: 'பட்டா என்பது வருவாய்த்துறையின் நில உரிமைப் பதிவேடு (eservices.tn.gov.in). EC என்பது பதிவுத்துறையின் சொத்துப் பரிவர்த்தனை வரலாறு (tnreginet.gov.in).',
        aEn: 'Patta is a Revenue Dept. land ownership record (Tamil Nilam), whereas EC is a Registration Dept. property transaction history (TNREGINET).'
      },
      {
        qTa: 'பட்டா பெயர் மாற்ற ஒப்புதல் எவ்வளவு நாட்களில் கிடைக்கும்?',
        qEn: 'Who approves Patta transfer and where are timelines tracked?',
        aTa: 'வருவாய்த்துறை & நில அளவை அதிகாரிகளின் ஆய்வு மற்றும் உட்பிரிவு தேவைக்கேற்ப கால அளவு மாறுபடும். அரசே அதிகாரப்பூர்வ பட்டா ஆணையை வெளியிடுகிறது; eservices.tn.gov.in-ல் நிலை அறியலாம்.',
        aEn: 'Processing depends on Tamil Nadu Revenue & Survey verification (and sub-division surveys where needed). Check status directly on eservices.tn.gov.in.'
      }
    ]
  },

  'aadhaar-guidance': {
    id: 'aadhaar-guidance',
    path: '/aadhaar-guidance',
    seo: {
      title: 'Aadhaar Online Address Update & myAadhaar Guidance | AK E-SEVAI',
      description:
        'Independent informational guidance for online Aadhaar address updates, e-Aadhaar download & PVC status on myAadhaar. Biometric & mobile updates require authorized Aadhaar Seva Kendras.',
      keywords:
        'Aadhaar online address update guide, myAadhaar e-Aadhaar download PVC order help, authorized Aadhaar Seva Kendra info, ஆதார் முகவரி மாற்றம் வழிகாட்டுதல், இ-ஆதார் பதிவிறக்கம்',
      canonical: `${SITE_BASE_URL}/aadhaar-guidance`,
      schemaType: 'statewide-service',
      includeWebPageSchema: true,
      includeServiceSchema: false,
      breadcrumbLabel: 'Aadhaar Guidance'
    },
    accentColor: '#4338ca',
    badgeTa: 'ℹ️ UIDAI பொது வழிகாட்டுதல் (அதிகாரப்பூர்வ மையம் அல்ல)',
    badgeEn: 'ℹ️ Aadhaar Information & Online Guidance Only',
    h1Ta: 'ஆதார் ஆன்லைன் சேவை வழிகாட்டுதல் (myAadhaar Guidance)',
    h1En: 'Aadhaar Online Services & Address Update Guidance',
    introTa:
      'myAadhaar போர்ட்டல் வழியாக இ-ஆதார் பதிவிறக்கம், முகவரி மாற்ற ஆவணத் தயாரிப்பு மற்றும் PVC கார்டு ஆர்டர் குறித்த தகவல் வழிகாட்டல். பயோமெட்ரிக் & மொபைல் எண் மாற்றத்திற்கு அங்கீகரிக்கப்பட்ட ஆதார் சேவை மையத்தை அணுகவும்.',
    introEn:
      'Informational guidance on resident self-service features available on UIDAI myAadhaar (address update document checklists, e-Aadhaar PDF access, status checking) plus clear instructions for visiting authorized Aadhaar Seva Kendras when required.',
    aadhaarNoticeTa:
      'முக்கிய அறிவிப்பு: AK E-SEVAI என்பது அங்கீகரிக்கப்பட்ட ஆதார் சேவை மையம் (Aadhaar Seva Kendra) அல்லது பதிவு மையம் அல்ல. புதிய ஆதார் பதிவு, மொபைல் எண் இணைப்பு/மாற்றம், புகைப்படம் மற்றும் கைரேகை/கண் கருவிழி (Biometric) புதுப்பிப்புகள் வங்கி, அஞ்சலகம் அல்லது அரசு அங்கீகாரம் பெற்ற ஆதார் சேவை மையத்தில் நேரில் மட்டுமே செய்யப்பட வேண்டும்.',
    aadhaarNoticeEn:
      'IMPORTANT NOTICE: AK E-SEVAI is NOT an authorized Aadhaar Seva Kendra or enrollment centre. New Aadhaar enrollment, mobile number linking/changes, photograph updates, and biometric updates (fingerprint/iris) MUST be completed in person at an authorized Bank, Post Office, or UIDAI Aadhaar Seva Kendra.',
    servicesCoveredTitleTa: 'ஆன்லைன் myAadhaar வழிகாட்டுதல் & நேரில் செல்ல வேண்டிய சேவைகள்',
    servicesCoveredTitleEn: 'Resident Online Guidance vs Authorized Kendra Scope',
    sections: [
      {
        tagTa: 'myAadhaar ஆன்லைன் வழிகாட்டி',
        tagEn: 'Online Self-Service Scope',
        titleTa: 'மொபைல் எண் இணைந்திருப்போர் ஆன்லைனில் செய்யக்கூடியவை',
        titleEn: 'What Residents Can Prepare via myAadhaar (Active Mobile Required)',
        descTa:
          'உங்கள் ஆதாரில் ஏற்கனவே செயல்பாட்டில் உள்ள மொபைல் எண் இணைக்கப்பட்டிருந்தால், OTP மூலம் myaadhaar.uidai.gov.in தளத்தில் பின்வரும் சேவைகளைப் பயன்படுத்தலாம்:',
        descEn:
          'When your mobile number is already linked with Aadhaar to receive UIDAI OTP, official self-service tools exist on myaadhaar.uidai.gov.in:',
        checklistTa: [
          'தகுதியான Proof of Address (PoA) ஆவணத்துடன் இணையவழி முகவரி மாற்றம்',
          'குடும்பத் தலைவர் (HoF) OTP ஒப்புதலுடன் முகவரி மாற்ற வழிகாட்டுதல்',
          'e-Aadhaar PDF பதிவிறக்கம் & Aadhaar PVC கார்டு ஆர்டர் நிலை சரிபார்த்தல்',
          'ஆதார் எண்ணுடன் மொபைல்/மின்னஞ்சல் நிலை சரிபார்ப்பு (Verify Email/Mobile)'
        ],
        checklistEn: [
          'Online Address Update request using valid Proof of Address (PoA)',
          'Head of Family (HoF) consent-based address update checklist',
          'Downloading e-Aadhaar PDF & checking UIDAI PVC Card request status',
          'Verifying registered email/mobile linkage & SRN status on myAadhaar'
        ]
      },
      {
        tagTa: 'அங்கீகரிக்கப்பட்ட மையம் அவசியம்',
        tagEn: 'Authorized Kendra Only',
        titleTa: 'அங்கீகரிக்கப்பட்ட ஆதார் சேவை மையத்தில் மட்டுமே செய்யக்கூடியவை',
        titleEn: 'Services Strictly Handled Only at Authorized Aadhaar Seva Kendras',
        descTa:
          'கீழ்க்கண்ட திருத்தங்கள் இணையவழியில் அல்லது தனியார் மையங்களில் செய்யப்பட மாட்டாது. இவற்றிற்கு உங்கள் அருகிலுள்ள அங்கீகரிக்கப்பட்ட மையத்திற்கு நேரில் செல்ல வேண்டும்:',
        descEn:
          'The following updates cannot be processed online or via third-party centres; residents must visit a designated Aadhaar Seva Kendra / Bank / Post Office in person:',
        checklistTa: [
          'புதிய ஆதார் எண் பதிவு (New Enrolment) & குழந்தை பயோமெட்ரிக் புதுப்பிப்பு',
          'மொபைல் எண் இணைப்பு அல்லது பழைய மொபைல் எண் மாற்றம்',
          'கைரேகை (Biometric), கண் கருவிழி (Iris) & புகைப்படம் மாற்றம்',
          'நேரடி பெயர் / பிறந்த தேதி / பாலின திருத்தச் சமர்ப்பிப்புகள்'
        ],
        checklistEn: [
          'New Aadhaar enrolment & mandatory child biometric updates',
          'First-time mobile number linking or changing an inactive mobile number',
          'Fingerprint, iris scan, and Aadhaar photograph updates',
          'Demographic name, date of birth, or gender update verification'
        ]
      }
    ],
    officialPortals: [
      {
        labelTa: 'UIDAI myAadhaar போர்டல்',
        labelEn: 'UIDAI myAadhaar Portal',
        domain: 'myaadhaar.uidai.gov.in',
        url: 'https://myaadhaar.uidai.gov.in/'
      },
      {
        labelTa: 'இ-ஆதார் பதிவிறக்கம்',
        labelEn: 'Download e-Aadhaar (myAadhaar)',
        domain: 'myaadhaar.uidai.gov.in',
        url: 'https://myaadhaar.uidai.gov.in/genricDownloadAadhaar/en'
      },
      {
        labelTa: 'ஆதார் நிலை சரிபார்ப்பு',
        labelEn: 'Check Aadhaar Enrolment / Update Status',
        domain: 'myaadhaar.uidai.gov.in',
        url: 'https://myaadhaar.uidai.gov.in/CheckAadhaarStatus/en'
      },
      {
        labelTa: 'UIDAI அதிகாரப்பூர்வ தளம் (கெந்த்ரா தேடல்)',
        labelEn: 'UIDAI Official Portal (Locate Enrolment Centre)',
        domain: 'uidai.gov.in',
        url: 'https://uidai.gov.in/'
      }
    ],
    relatedTools: [
      { to: '/tools/document-size-checker', labelTa: 'ஆவண அளவு சோதனை', labelEn: 'Document Size Checker' },
      { to: '/tools/pdf-compress', labelTa: 'PDF சுருக்கி', labelEn: 'PDF Compressor' }
    ],
    relatedPages: [
      { to: '/pan-card-service', labelTa: 'பான் கார்டு உதவி', labelEn: 'PAN Card Assistance' },
      { to: '/smart-ration-card', labelTa: 'ஸ்மார்ட் ரேஷன் கார்டு', labelEn: 'Smart Ration Card' }
    ],
    faqs: [
      {
        qTa: 'AK E-SEVAI மையத்தில் ஆதார் மொபைல் எண் அல்லது கைரேகை மாற்ற முடியுமா?',
        qEn: 'Can AK E-SEVAI link my mobile number or update Aadhaar biometrics?',
        aTa: 'முடியாது. AK E-SEVAI ஒரு தனியார் டிஜிட்டல் உதவி மையம் மட்டுமே; அங்கீகரிக்கப்பட்ட ஆதார் சேவை மையம் அல்ல. மொபைல் எண் இணைப்பு மற்றும் பயோமெட்ரிக் திருத்தங்களுக்கு வங்கி, அஞ்சலகம் அல்லது அரசு ஆதார் சேவை மையத்தை மட்டுமே நேரில் அணுக வேண்டும்.',
        aEn: 'No. AK E-SEVAI is an independent guidance centre and is NOT an authorized Aadhaar Seva Kendra. Mobile number linking and biometric updates must be completed in person at an authorized Bank, Post Office, or UIDAI Aadhaar Seva Kendra.'
      },
      {
        qTa: 'ஆன்லைனில் முகவரி மாற்றம் செய்ய என்ன தேவை?',
        qEn: 'What is required to prepare an online Aadhaar address update on myAadhaar?',
        aTa: 'ஏற்கனவே ஆதாரில் இணைக்கப்பட்ட செயல்பாட்டில் உள்ள மொபைல் எண் (OTP பெற) மற்றும் UIDAI ஏற்கும் செல்லுபடியாகும் முகவரி ஆதாரம் (PoA) அல்லது குடும்பத் தலைவர் (HoF) ஒப்புதல் ஆவணங்கள் தேவைப்படும்.',
        aEn: 'An active Aadhaar-linked mobile number for OTP login on myaadhaar.uidai.gov.in plus an eligible Proof of Address (PoA) or Head of Family (HoF) relationship proof.'
      },
      {
        qTa: 'அருகிலுள்ள அங்கீகரிக்கப்பட்ட ஆதார் சேவை மையத்தை எப்படிக் கண்டறிவது?',
        qEn: 'How can I locate the nearest authorized Aadhaar Seva Kendra?',
        aTa: 'இந்திய தனித்துவ அடையாள ஆணையத்தின் அதிகாரப்பூர்வ uidai.gov.in இணையதளத்தில் "Locate an Enrolment Center" பகுதி வழியாக உங்கள் அஞ்சல் குறியீட்டை (Pincode) உள்ளிட்டுத் தேடலாம்.',
        aEn: 'Visit the official uidai.gov.in website and use the Locate an Enrolment Center tool by PIN code or district to verify authorized locations.'
      }
    ]
  },

  'esevai-application-assistance': {
    id: 'esevai-application-assistance',
    path: '/esevai-application-assistance',
    seo: {
      title: 'e-Sevai Application Assistance Palani & Tamil Nadu | CAN & Filing Help | AK E-SEVAI',
      description:
        'Walk-in e-Sevai application assistance at Mill Road, Palani (624601) & WhatsApp document checks across Tamil Nadu (+91 93423 18844). Private digital guidance centre.',
      keywords:
        'e-Sevai application assistance Palani, TNeGA CAN number online filing help Tamil Nadu, digital document support, இ-சேவை ஆன்லைன் விண்ணப்ப உதவி பழனி, CAN எண் பதிவு வழிகாட்டுதல்',
      canonical: `${SITE_BASE_URL}/esevai-application-assistance`,
      schemaType: 'palani-local',
      includeWebPageSchema: true,
      includeServiceSchema: true,
      breadcrumbLabel: 'e-Sevai Application Assistance'
    },
    accentColor: '#0f766e',
    badgeTa: '🖥️ பழனி நேரில் உதவி & தமிழ்நாடு ஆன்லைன் வழிகாட்டல்',
    badgeEn: '🖥️ Walk-In Filing Assistance (Palani) & Remote Prep Guidance',
    h1Ta: 'இ-சேவை ஆன்லைன் விண்ணப்ப & ஆவண உதவி மையம்',
    h1En: 'e-Sevai Application & Document Preparation Assistance',
    introTa:
      'Citizen Access Number (CAN) பதிவு விவரத் தயாரிப்பு, சான்றிதழ் நகல்கள் ஸ்கேன்/PDF சீரமைப்பு, பழனி மில் ரோடு மையத்தில் நேரடி டோக்கன் சேவை மற்றும் தமிழ்நாடு முழுவதும் ஆவண வழிகாட்டல்.',
    introEn:
      'Independent citizen support for CAN (Citizen Access Number) checklist preparation, error-free document scanning/compression, walk-in Palani desk assistance, and status tracking orientation (separate from official government portals).',
    servicesCoveredTitleTa: 'ஆவணத் தயாரிப்பு & விண்ணப்ப உதவி நிலைகள்',
    servicesCoveredTitleEn: 'How AK E-SEVAI Helps Citizens Prepare',
    sections: [
      {
        tagTa: 'CAN எண் & ஆவண சரிபார்ப்பு',
        tagEn: 'CAN & Pre-Filing Check',
        titleTa: 'விண்ணப்பிக்கும் முன் சரிபார்க்க வேண்டிய முக்கிய விவரங்கள்',
        titleEn: 'Pre-Submission Document & Profile Preparation',
        descTa:
          'ஆவணங்கள் மங்கலாகவோ, தவறான பெயர் எழுத்துப்பிழையுடனோ பதிவேற்றப்பட்டால் விண்ணப்பங்கள் நிராகரிக்கப்படலாம்; இதைத் தவிர்க்க ஆரம்ப நிலை சரிபார்ப்பில் உதவுகிறோம்.',
        descEn:
          'Avoid avoidable clerical rejections by verifying name spelling, photo clarity, and file-size bounds before submitting online.',
        checklistTa: [
          'ஆதார், குடும்ப அட்டை & பள்ளி சான்றிதழ்களில் பெயர்/இனிஷியல் ஒப்பீடு',
          'CAN (Citizen Access Number) பதிவு & தற்போதைய மொபைல் எண் சரிபார்ப்பு',
          'தெளிவான PDF / JPG கோப்புகளைப் பிரவுசரில் தயார் செய்தல்',
          'பழனி நேரில் வருவோருக்கு Queue Token முன்பதிவு (/token-generator)'
        ],
        checklistEn: [
          'Compare name/initial spelling across Aadhaar, Ration card & TC before upload',
          'Verify CAN (Citizen Access Number) details & active mobile for portal OTPs',
          'Format legible PDF / JPG files using local browser tools without uploads',
          'Walk-in Palani visitors can reserve a desk slot via /token-generator'
        ]
      },
      {
        tagTa: 'நேரடி & தொலைதூர உதவி',
        tagEn: 'Palani Desk & Remote Help',
        titleTa: 'பழனி நேரில் சேவை & தமிழ்நாடு ஆன்லைன் கருவிகள்',
        titleEn: 'Single Walk-In Centre in Palani + Statewide Free Tools',
        descTa:
          'எங்கள் நேரடி கவுண்டர், ஜெராக்ஸ், டைப்பிங் மற்றும் பைண்டிங் சேவைகள் பழனி மில் ரோட்டில் மட்டுமே உள்ளன. மற்ற ஊர் பயனர்கள் எங்கள் 31 இலவச பிரவுசர் கருவிகள் & வாட்ஸ்அப் வழிகாட்டுதலைப் பயன்படுத்தலாம்.',
        descEn:
          'Physical walk-in counter assistance operates solely at Mill Road, Palani (624601), while citizens across Tamil Nadu can use our 31 browser tools and WhatsApp guidance.',
        checklistTa: [
          'வருமானம், சாதி, இருப்பிடம் & முதல் பட்டதாரி சான்றிதழ் வழிகாட்டுதல்',
          'பட்டா/சிட்டா, வில்லங்கம் (EC) & ஸ்மார்ட் ரேஷன் கார்டு போர்டல் உதவி',
          'பான் கார்டு, தேர்வு போட்டோ ரீசைஸ் & ஆவண அச்சிடுதல் (பழனி)',
          'வாடிக்கையாளர் நிலை சரிபார்ப்பு (/status-track) & அதிகாரப்பூர்வ போர்டல் இணைப்புகள்'
        ],
        checklistEn: [
          'Document checklists for Income, Community, Nativity & First Graduate certificates',
          'Guidance for Patta/Chitta, EC & Smart Ration Card official portals',
          'PAN assistance, exam photo resizing & walk-in print support in Palani',
          'Desk request lookup via /status-track and direct links to official portals'
        ]
      }
    ],
    officialPortals: [
      {
        labelTa: 'தமிழ்நாடு இ-சேவை (TNeGA)',
        labelEn: 'TNeGA Official e-Sevai Portal',
        domain: 'tnesevai.tn.gov.in',
        url: 'https://www.tnesevai.tn.gov.in/'
      },
      {
        labelTa: 'தமிழ் நிலம் (Patta / Chitta)',
        labelEn: 'Tamil Nilam Portal',
        domain: 'eservices.tn.gov.in',
        url: 'https://eservices.tn.gov.in/eservicesnew/home.html'
      },
      {
        labelTa: 'TNPDS ஸ்மார்ட் ரேஷன் கார்டு',
        labelEn: 'TNPDS Public Portal',
        domain: 'tnpds.gov.in',
        url: 'https://www.tnpds.gov.in/'
      },
      {
        labelTa: 'TNREGINET பதிவுத்துறை',
        labelEn: 'TNREGINET Portal',
        domain: 'tnreginet.gov.in',
        url: 'https://tnreginet.gov.in/'
      }
    ],
    relatedTools: [
      { to: '/tools/document-size-checker', labelTa: 'ஆவண அளவு சோதனை', labelEn: 'Document Size Checker' },
      { to: '/tools/pdf-merge', labelTa: 'PDF இணைப்பு', labelEn: 'PDF Merge Tool' },
      { to: '/tools/pdf-compress', labelTa: 'PDF சுருக்கி', labelEn: 'PDF Compressor' }
    ],
    relatedPages: [
      { to: '/esevai-services', labelTa: 'தமிழ்நாடு இ-சேவை மையம்', labelEn: 'Tamil Nadu e-Sevai Hub' },
      { to: '/online-application-assistance', labelTa: 'தேர்வு விண்ணப்ப உதவி', labelEn: 'Exam Application Assistance' }
    ],
    faqs: [
      {
        qTa: 'AK E-SEVAI அரசு இ-சேவை அலுவலகமா?',
        qEn: 'Is AK E-SEVAI an official government department office?',
        aTa: 'இல்லை. AK E-SEVAI என்பது தனியார் டிஜிட்டல் சேவை & ஆவண உதவி மையம். அனைத்து அரசு சான்றிதழ்களும் ஒப்புதலும் சம்பந்தப்பட்ட தமிழ்நாடு & மத்திய அரசுத் துறைகளால் மட்டுமே வழங்கப்படுகின்றன.',
        aEn: 'No. AK E-SEVAI is a private independent digital service and application assistance centre. Government departments review and issue all official certificates and records.'
      },
      {
        qTa: 'CAN (Citizen Access Number) எதற்குப் பயன்படுகிறது?',
        qEn: 'Why is a Citizen Access Number (CAN) required on TNeGA e-Sevai?',
        aTa: 'தமிழ்நாடு அரசின் இ-சேவை தளத்தில் வருவாய் & நலத்திட்டச் சான்றிதழ்களுக்கு விண்ணப்பிக்கும்போது குடிமக்களின் அடிப்படை விவரங்களை அடையாளம் காண CAN எண் பயன்படுகிறது.',
        aEn: 'A Citizen Access Number (CAN) is a single profile identifier on TNeGA used to keep demographic details consistent across revenue certificate submissions.'
      },
      {
        qTa: 'பழனி அல்லாத பிற ஊர்களில் உங்கள் கிளைகள் உள்ளனவா?',
        qEn: 'Does AK E-SEVAI have physical branches in other districts of Tamil Nadu?',
        aTa: 'இல்லை. எங்கள் நேரடி அலுவலகம் பழனி, மில் ரோடு (624601) முகவரியில் மட்டுமே செயல்படுகிறது. பிற ஊர் மக்கள் எங்கள் இலவச இணையக் கருவிகள் & வாட்ஸ்அப் ஆலோசனையைப் பெறலாம்.',
        aEn: 'No. We operate only one physical walk-in centre at Mill Road, Palani 624601. Residents elsewhere in Tamil Nadu can use our free online tools and remote WhatsApp guidance.'
      }
    ]
  }
};

export const SEO03_PAGE_SEO_MAP = Object.fromEntries(
  Object.entries(SEO03_SERVICE_PAGES).map(([slug, svc]) => [
    slug,
    {
      title: svc.seo.title,
      description: svc.seo.description,
      keywords: svc.seo.keywords,
      canonical: svc.seo.canonical,
      schemaType: svc.seo.schemaType,
      includeWebPageSchema: svc.seo.includeWebPageSchema,
      includeServiceSchema: svc.seo.includeServiceSchema,
      breadcrumbLabel: svc.seo.breadcrumbLabel,
      faqs: svc.faqs.map((item) => ({ q: item.qEn, a: item.aEn }))
    }
  ])
);

