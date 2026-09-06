/**
 * AK E-SEVAI — MASTER GOVERNMENT SERVICE CATALOG & REQUIRED DOCUMENTS REGISTRY
 *
 * Official Facilitation Service Catalog (98 Citizen Service Assistance Options)
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
 * - Unique Identification Authority of India - UIDAI (uidai.gov.in / myaadhaar.uidai.gov.in)
 * - Election Commission of India - ECI (voters.eci.gov.in)
 * - Income Tax Department / NSDL (tin-nsdl.com)
 * - Ministry of External Affairs - Passport Seva (passportindia.gov.in)
 *
 * Compliance Notice:
 * AK E-SEVAI is an independent citizen digital facilitation and assistance centre.
 * AK E-SEVAI facilitates online application submissions on behalf of citizens.
 * Official government statutory fees are charged as per official department norms.
 */

export const SERVICE_CATEGORIES = [
  {
    "id": "all",
    "nameEn": "All Services",
    "nameTa": "அனைத்து சேவைகள்",
    "icon": "🏛️"
  },
  {
    "id": "revenue_certificates",
    "nameEn": "Revenue – Certificates",
    "nameTa": "வருவாய்த்துறை – சான்றிதழ்கள்",
    "icon": "📜"
  },
  {
    "id": "revenue_social_security",
    "nameEn": "Revenue – Social Security Pensions",
    "nameTa": "வருவாய்த்துறை – சமூக பாதுகாப்பு ஓய்வூதியம்",
    "icon": "👵"
  },
  {
    "id": "revenue_land_nilam",
    "nameEn": "Revenue – Land & Tamil Nilam",
    "nameTa": "வருவாய்த்துறை – நிலம் & பட்டா",
    "icon": "🗺️"
  },
  {
    "id": "civil_supplies_pds",
    "nameEn": "Civil Supplies – Smart Ration Card",
    "nameTa": "உணவுப்பொருள் – ஸ்மார்ட் குடும்ப அட்டை",
    "icon": "🌾"
  },
  {
    "id": "tangedco_electricity",
    "nameEn": "TANGEDCO / Electricity Services",
    "nameTa": "மின்சார வாரிய சேவைகள் (TANGEDCO)",
    "icon": "⚡"
  },
  {
    "id": "transport_rto",
    "nameEn": "Transport & Driving Licence (RTO)",
    "nameTa": "போக்குவரத்து & ஓட்டுநர் உரிமம்",
    "icon": "🚗"
  },
  {
    "id": "registration_tnreginet",
    "nameEn": "Registration Department (TNREGINET)",
    "nameTa": "பதிவுத்துறை சேவைகள்",
    "icon": "📑"
  },
  {
    "id": "social_welfare_women",
    "nameEn": "Social Welfare & Women Schemes",
    "nameTa": "சமூக நலம் & மகளிர் திட்டங்கள்",
    "icon": "🌸"
  },
  {
    "id": "differently_abled",
    "nameEn": "Differently Abled Welfare",
    "nameTa": "மாற்றுத்திறனாளிகள் நலன்",
    "icon": "♿"
  },
  {
    "id": "municipality_corporation",
    "nameEn": "Municipality & Local Body",
    "nameTa": "நகராட்சி & உள்ளாட்சி சேவைகள்",
    "icon": "🏢"
  },
  {
    "id": "police_cctns",
    "nameEn": "Police Services (CCTNS)",
    "nameTa": "காவல்துறை சேவைகள்",
    "icon": "👮"
  },
  {
    "id": "employment_training",
    "nameEn": "Employment & Skill Training",
    "nameTa": "வேலைவாய்ப்பு & பயிற்சி",
    "icon": "💼"
  },
  {
    "id": "education_admissions",
    "nameEn": "Education & Admissions (TNEA/Exams)",
    "nameTa": "கல்வி & கல்லூரி சேர்க்கை",
    "icon": "🎓"
  },
  {
    "id": "unorganised_welfare_board",
    "nameEn": "Unorganised Workers Welfare Boards",
    "nameTa": "தொழிலாளர் நல வாரியங்கள்",
    "icon": "👷"
  },
  {
    "id": "fisheries_welfare",
    "nameEn": "Fisheries Department",
    "nameTa": "மீன்வளத்துறை சேவைகள்",
    "icon": "🐟"
  },
  {
    "id": "fire_rescue_noc",
    "nameEn": "Fire & Rescue Services",
    "nameTa": "தீயணைப்புத்துறை (NOC)",
    "icon": "🚒"
  },
  {
    "id": "drug_control",
    "nameEn": "Drug Control Administration",
    "nameTa": "மருந்து கட்டுப்பாட்டுத்துறை",
    "icon": "💊"
  },
  {
    "id": "electrical_inspectorate",
    "nameEn": "Electrical Inspectorate",
    "nameTa": "மின் ஆய்வுத்துறை",
    "icon": "🔌"
  },
  {
    "id": "waqf_board",
    "nameEn": "Tamil Nadu Waqf Board",
    "nameTa": "தமிழ்நாடு வக்ஃபு வாரியம்",
    "icon": "🕌"
  },
  {
    "id": "identity_national",
    "nameEn": "Identity & National Citizen Services",
    "nameTa": "அடையாள & மத்திய அரசு சேவைகள்",
    "icon": "🪪"
  }
];

export const GOVERNMENT_SERVICES = [
  {
    "id": "REV-101",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "Community Certificate",
    "nameTa": "சாதிச் சான்றிதழ்",
    "descriptionEn": "Official government certificate establishing the community/caste category (BC / BCM / MBC / DNC / SC / SCA / ST) of the applicant for education, scholarships, reservations and employment.",
    "descriptionTa": "கல்வி, இடஒதுக்கீடு, அரசு வேலைவாய்ப்பு மற்றும் உதவித்தொகைகளுக்காக விண்ணப்பதாரரின் சாதிப் பிரிவை (BC/MBC/SC/ST) உறுதிப்படுத்தும் அதிகாரப்பூர்வ வருவாய்த்துறைச் சான்றிதழ்.",
    "eligibilityEn": "Any resident citizen of Tamil Nadu belonging to eligible community categories.",
    "eligibilityTa": "தமிழ்நாட்டில் வசிக்கும் தகுதியுடைய சமூகப் பிரிவைச் சேர்ந்த அனைத்து குடிமக்களும்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Applicant School Transfer Certificate (TC) / Mark Sheet (showing caste)",
      "Parent or Sibling Community Certificate",
      "Applicant Passport Size Photo",
      "Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "பள்ளி மாற்றுச் சான்றிதழ் (TC) / மதிப்பெண் சான்றிதழ் (சாதி குறிப்பிடப்பட்டது)",
      "பெற்றோர் அல்லது உடன் பிறந்தோரின் சாதிச் சான்றிதழ்",
      "பாஸ்போர்ட் அளவு புகைப்படம்",
      "சுய அறிவிப்புப் படிவம் (Self-Declaration Form)"
    ],
    "optionalDocuments": [
      "Parent TC Copy",
      "Address Proof (EB bill)"
    ],
    "optionalDocumentsTa": [
      "பெற்றோரின் பள்ளி மாற்றுச் சான்றிதழ் (TC)",
      "முகவரிச் சான்று (மின் கட்டண ரசீது)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If applicant is first in family to obtain community certificate",
        "conditionTa": "குடும்பத்தில் முதல்முறையாக சாதிச் சான்றிதழ் பெறுபவராயின்",
        "requirement": "Paternal relatives community certificate & genealogical tree (வம்சாவளி சான்று)",
        "requirementTa": "தந்தை வழி இரத்த உறவினர்களின் சாதிச் சான்றிதழ் & வம்சாவளிச் சான்று"
      }
    ],
    "prerequisites": [
      "Active mobile number to receive verification OTP and status updates",
      "CAN Number (Citizen Access Number registered on e-District / e-Sevai portal)"
    ],
    "prerequisitesTa": [
      "OTP சரிபார்ப்பு மற்றும் குறுஞ்செய்தி பெற செயல்பாட்டில் உள்ள மொபைல் எண்",
      "இ-சேவை CAN எண் (Citizen Access Number)"
    ],
    "notesEn": "Permanent validity. Issued with digital signature and QR verification.",
    "notesTa": "ஆயுள் முழுவதும் செல்லுபடியாகும் நிரந்தர சான்றிதழ். QR குறியீடு மற்றும் டிஜிட்டல் கையொப்பத்துடன் வழங்கப்படுகிறது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-102",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "Nativity Certificate",
    "nameTa": "பிறப்பிடச் சான்றிதழ்",
    "descriptionEn": "Certifies that the applicant is a native born resident of Tamil Nadu, essential for state admissions (TNEA/TNGASA/NEET) and state government job reservations.",
    "descriptionTa": "விண்ணப்பதாரர் தமிழ்நாட்டைப் பூர்வீகமாகக் கொண்டவர் என்பதை உறுதிப்படுத்தும் சான்றிதழ். கல்லூரி சேர்க்கை மற்றும் அரசு பணிகளுக்கு மிக அவசியம்.",
    "eligibilityEn": "Individuals born and continuously brought up/educated in Tamil Nadu or whose parents are natives.",
    "eligibilityTa": "தமிழ்நாட்டில் பிறந்து தொடர்ந்து வசிக்கும் அல்லது பெற்றோர் பூர்வீகமாகக் கொண்ட நபர்கள்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Birth Certificate of Applicant / School TC (showing birthplace)",
      "Parent Nativity Certificate / School TC / Aadhaar",
      "Current Address Proof (EB Bill / Property Tax Receipt)",
      "Applicant Passport Size Photo"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "பிறப்புச் சான்றிதழ் அல்லது பள்ளி மாற்றுச் சான்றிதழ் (TC)",
      "பெற்றோரின் பிறப்பிடச் சான்று / TC / ஆதார்",
      "தற்போதைய முகவரிச் சான்று (மின் கட்டண ரசீது / சொத்துவரி)",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Passport Copy",
      "Voter ID"
    ],
    "optionalDocumentsTa": [
      "பாஸ்போர்ட் நகல்",
      "வாக்காளர் அடையாள அட்டை"
    ],
    "conditionalDocuments": [
      {
        "condition": "If continuous residence in Tamil Nadu needs verification",
        "conditionTa": "தமிழ்நாட்டில் தொடர்ந்து 5 ஆண்டுகள் வசிப்பதற்கான ஆதாரம் கோரப்பட்டால்",
        "requirement": "Consecutive 5 years School Study Certificates or Property Tax / EB receipts",
        "requirementTa": "தொடர்ந்து 5 ஆண்டுகள் படித்ததற்கான பள்ளிச் சான்றுகள் அல்லது வரி ரசீதுகள்"
      }
    ],
    "prerequisites": [
      "Active mobile number for OTP",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "OTP சரிபார்ப்புக்கு மொபைல் எண்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Permanent certificate for native residents. Essential for state admissions and quota reservations.",
    "notesTa": "நீட், பொறியியல் மற்றும் கல்லூரி சேர்க்கை கலந்தாய்விற்கு கட்டாயமானது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-103",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "Income Certificate",
    "nameTa": "வருமானச் சான்றிதழ்",
    "descriptionEn": "Certifies total annual family income from all sources. Essential for fee concessions, scholarship applications, RTE admissions and welfare schemes.",
    "descriptionTa": "குடும்பத்தின் அனைத்து வழிகளிலிருந்தும் கிடைக்கும் மொத்த ஆண்டு வருமானத்தை உறுதிப்படுத்தும் சான்றிதழ். கல்வி உதவித்தொகை, சலுகைகளுக்கு அவசியம்.",
    "eligibilityEn": "Any resident citizen residing within the taluk / village jurisdiction.",
    "eligibilityTa": "அந்தந்த வட்டார/கிராம எல்லைக்குள் வசிக்கும் அனைத்து தமிழ்நாட்டுக் குடிமக்கள்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Salary Slip / Income Proof / Employer Certificate (or Self-Income Declaration)",
      "Applicant Passport Size Photo",
      "Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "மாத சம்பளச் சீட்டு / வருமான ஆதாரச் சான்று / சுய வருமான உறுதிமொழி",
      "பாஸ்போர்ட் அளவு புகைப்படம்",
      "சுய அறிவிப்புப் படிவம் (Self-Declaration Form)"
    ],
    "optionalDocuments": [
      "Bank Passbook (last 6 months)",
      "Agricultural Land Tax Receipt (if farmer)"
    ],
    "optionalDocumentsTa": [
      "வங்கி பாஸ்புக் (கடைசி 6 மாத பரிவர்த்தனை)",
      "விவசாய நில வரி ரசீது (விவசாயிகளாயின்)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If applicant or family member is a government/private employee",
        "conditionTa": "குடும்ப உறுப்பினர் அரசு அல்லது தனியார் ஊழியராக இருந்தால்",
        "requirement": "Form 16 / Latest Salary Slip showing gross & net income",
        "requirementTa": "படிவம் 16 (Form 16) அல்லது நடப்பு மாத சம்பளச் சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "Details of total annual income earned by all family members",
      "Active mobile number for OTP",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "குடும்பத்தின் அனைத்து உறுப்பினர்களின் மொத்த ஆண்டு வருமான விவரங்கள்",
      "OTP சரிபார்ப்புக்கு மொபைல் எண்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Valid for 1 financial year from the date of issue by the Tahsildar.",
    "notesTa": "வட்டாட்சியர் வழங்கிய நாளிலிருந்து 1 நிதியாண்டு வரை மட்டுமே செல்லுபடியாகும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-104",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "Residence Certificate",
    "nameTa": "இருப்பிடச் சான்றிதழ்",
    "descriptionEn": "Verifies current residential proof of the citizen in a specific village/town/taluk for legal, employment, passport and business registrations.",
    "descriptionTa": "குறிப்பிட்ட முகவரியில் வசித்து வருவதை உறுதிப்படுத்தும் இருப்பிடச் சான்றிதழ். வேலைவாய்ப்பு, கடன் விண்ணப்பங்களுக்குத் தேவைப்படுகிறது.",
    "eligibilityEn": "Any citizen currently residing in the specified locality.",
    "eligibilityTa": "குறிப்பிட்ட கிராமம்/நகரத்தில் தற்போது வசித்து வரும் குடிமக்கள்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Current Address Proof (EB Bill / Gas Bill / Property Tax Receipt)",
      "Applicant Passport Size Photo"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "தற்போதைய முகவரி ஆதாரம் (மின் கட்டணம் / கேஸ் ரசீது / சொத்துவரி)",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Voter ID Card",
      "Bank Passbook with address"
    ],
    "optionalDocumentsTa": [
      "வாக்காளர் அட்டை",
      "முகவரியுடன் கூடிய வங்கி பாஸ்புக்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If residing in a rented house",
        "conditionTa": "வாடகை வீட்டில் வசிப்பவராயின்",
        "requirement": "Registered Rental Agreement / House Owner Consent Letter",
        "requirementTa": "வாடகை ஒப்பந்தப் பத்திரம் / வீட்டு உரிமையாளர் சம்மதக் கடிதம்"
      }
    ],
    "prerequisites": [
      "Current address and duration of stay details",
      "Active mobile number for OTP",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "தற்போதைய முகவரியில் வசித்து வரும் கால அளவு விவரங்கள்",
      "OTP பெற மொபைல் எண்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Valid for 1 year or until change of address.",
    "notesTa": "முகவரி மாற்றும் வரை அல்லது 1 ஆண்டு வரை செல்லுபடியாகும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-105",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "First Graduate Certificate",
    "nameTa": "முதல் பட்டதாரி சான்றிதழ்",
    "descriptionEn": "Certifies that no person in the applicant’s family has graduated before, granting state government tuition fee waivers in professional engineering/medical colleges.",
    "descriptionTa": "குடும்பத்தில் முதல்முறையாக பட்டப்படிப்பு பயிலும் மாணவர்களுக்கு தொழிற்கல்வி கல்விக் கட்டணச் சலுகை வழங்கும் அரசு சான்றிதழ்.",
    "eligibilityEn": "Candidates whose parents and siblings have not completed any degree/graduation.",
    "eligibilityTa": "பெற்றோர் மற்றும் உடன்பிறந்தவர்கள் எவரும் பட்டப்படிப்பு முடிக்காத குடும்பத்து மாணவர்கள்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Applicant 10th / 12th Mark Sheet & School Transfer Certificate (TC)",
      "Father & Mother Educational Proof / TC / Non-Graduate Declaration",
      "Siblings Educational Proof / TC",
      "Joint Self-Declaration signed by Parent & Student",
      "Applicant Passport Size Photo"
    ],
    "requiredDocumentsTa": [
      "மாணவரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "10, 12-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ் & பள்ளி மாற்றுச் சான்றிதழ் (TC)",
      "தந்தை மற்றும் தாயின் கல்விச் சான்று / TC / படிக்கவில்லை என்பதற்கான உறுதிமொழி",
      "உடன்பிறந்தோரின் பள்ளி / கல்லூரி மாற்றுச் சான்றிதழ் (TC)",
      "பெற்றோர் மற்றும் மாணவர் கையொப்பமிட்ட கூட்டு உறுதிமொழிப் படிவம்",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Grandparents Non-Graduate Declaration (if requested by VAO)"
    ],
    "optionalDocumentsTa": [
      "தாத்தா / பாட்டி படிக்கவில்லை என்பதற்கான உறுதிமொழி (தேவைப்படின்)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If any sibling is currently pursuing degree/diploma",
        "conditionTa": "உடன்பிறந்தவர்கள் எவரேனும் தற்போது கல்லூரியில் படித்துக் கொண்டிருந்தால்",
        "requirement": "Bonafide Certificate from College confirming non-graduation / non-availment of first graduate concession",
        "requirementTa": "கல்லூரியில் முதல் பட்டதாரி சலுகை பெறவில்லை என்பதற்கான போனாபைட் சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "Confirmation that no person in the applicant family up to first generation has graduated before",
      "Active mobile number for OTP",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "குடும்பத்தில் எவரும் இதற்கு முன் பட்டப்படிப்பு முடிக்கவில்லை என்ற உறுதிப்பாடு",
      "OTP சரிபார்ப்புக்கு மொபைல் எண்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Essential to claim tuition fee waiver in professional engineering/medical counseling.",
    "notesTa": "பொறியியல் மற்றும் மருத்துவக் கலந்தாய்வில் முழுக் கல்விக் கட்டணச் சலுகை பெற உதவுகிறது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-106",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "Legal Heir Certificate",
    "nameTa": "வாரிசுச் சான்றிதழ்",
    "descriptionEn": "Identifies the legal heirs of a deceased person for settlement of claims, property transfer, pension transfer, and bank deposits.",
    "descriptionTa": "மறைந்த நபரின் சட்டப்பூர்வ வாரிசுகளை உறுதிப்படுத்தும் சான்றிதழ். சொத்து மாற்றம், வங்கி பணப்பரிமாற்றம், குடும்ப ஓய்வூதியத்திற்கு அவசியம்.",
    "eligibilityEn": "Spouse, children, parents or legal dependents of the deceased person.",
    "eligibilityTa": "மறைந்த நபரின் மனைவி/கணவர், பிள்ளைகள் அல்லது பெற்றோர்.",
    "requiredDocuments": [
      "Death Certificate of the Deceased Person",
      "Deceased Person Aadhaar Card / ID Proof",
      "Smart Ration Card of the Deceased Family",
      "Aadhaar Cards of All Legal Heirs",
      "Applicant Passport Size Photo",
      "Legal Heir Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "மறைந்த நபரின் அதிகாரப்பூர்வ இறப்புச் சான்றிதழ்",
      "மறைந்த நபரின் ஆதார் அட்டை / அடையாள அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "அனைத்து நேரடி வாரிசுகளின் ஆதார் அட்டைகள்",
      "விண்ணப்பதாரரின் பாஸ்போர்ட் அளவு புகைப்படம்",
      "வாரிசுதாரர் சுய உறுதிமொழிப் படிவம்"
    ],
    "optionalDocuments": [
      "Marriage Certificate of Deceased & Spouse",
      "Birth Certificates of children"
    ],
    "optionalDocumentsTa": [
      "திருமணப் பதிவுச் சான்றிதழ்",
      "பிள்ளைகளின் பிறப்புச் சான்றிதழ்கள்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If any legal heir has passed away",
        "conditionTa": "நேரடி வாரிசுகளில் எவரேனும் காலமாயிருந்தால்",
        "requirement": "Death Certificate of deceased legal heir and their legal heirs list",
        "requirementTa": "மறைந்த வாரிசின் இறப்புச் சான்றிதழ் & அவர்களின் வாரிசு விவரங்கள்"
      },
      {
        "condition": "If deceased was a Government employee",
        "conditionTa": "மறைந்தவர் அரசு ஊழியராகப் பணியாற்றியிருந்தால்",
        "requirement": "Service Verification / NOC / Death intimation from employer department",
        "requirementTa": "பணிபுரிந்த அரசுத் துறையின் தடையில்லாச் சான்று / இறப்புத் தகவல் கடிதம்"
      }
    ],
    "prerequisites": [
      "Complete family tree details including names, ages, and relationship of all legal heirs",
      "Active mobile number for OTP",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "அனைத்து நேரடி வாரிசுகளின் பெயர், பிறந்த தேதி மற்றும் உறவுமுறை விபரங்கள்",
      "OTP சரிபார்ப்புக்கு மொபைல் எண்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Issued for Class-I legal heirs by the Tahsildar after VAO and Revenue Inspector (RI) enquiry.",
    "notesTa": "VAO மற்றும் வருவாய் ஆய்வாளர் கள ஆய்வுக்குப் பின் வட்டாட்சியரால் வழங்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-107",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "OBC Certificate (Other Backward Class)",
    "nameTa": "மத்திய அரசு ஓ.பி.சி சான்றிதழ் (OBC Certificate)",
    "descriptionEn": "Central Government format Other Backward Class certificate for recruitment in Central Government ministries, PSUs, UPSC, SSC, Banking, and central educational institutions (IIT, NIT, AIIMS, Central Universities).",
    "descriptionTa": "மத்திய அரசுப் பணிகள், பொதுத்துறை நிறுவனங்கள் (PSU), UPSC, SSC, வங்கித் தேர்வுகள் மற்றும் மத்திய கல்வி நிறுவனங்களில் 27% இடஒதுக்கீடு பெற உதவும் OBC சான்றிதழ்.",
    "eligibilityEn": "Residents belonging to castes recognized in the Central OBC list for Tamil Nadu and falling within Non-Creamy Layer (NCL) income limits.",
    "eligibilityTa": "மத்திய அரசின் தமிழ்நாடு OBC பட்டியலில் இடம்பெற்றுள்ள சமூகத்தினர் மற்றும் ஆண்டு வருமானம் ₹8 லட்சத்திற்குள் உள்ளவர்கள்.",
    "requiredDocuments": [
      "Applicant Community Certificate (State BC / MBC / DNC)",
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Income Certificate (Creamy layer verification – annual family income below ₹8 Lakhs)",
      "Applicant Passport Size Photo",
      "Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் தமிழ்நாடு சாதிச் சான்றிதழ் (BC/MBC)",
      "ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "வருமானச் சான்றிதழ் (ஆண்டு வருமானம் ₹8 லட்சத்திற்குள் இருத்தல் அவசியம்)",
      "பாஸ்போர்ட் அளவு புகைப்படம்",
      "சுய உறுதிமொழிப் படிவம்"
    ],
    "optionalDocuments": [
      "Parents Form 16 / Income Tax Returns",
      "Parents Community Certificate"
    ],
    "optionalDocumentsTa": [
      "பெற்றோரின் Form 16 / வருமான வரி ரசீது",
      "பெற்றோரின் சாதிச் சான்றிதழ்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If applying for Central Government job or admission (UPSC / SSC / IIT / NEET)",
        "conditionTa": "மத்திய அரசு வேலைவாய்ப்பு அல்லது மத்திய கல்வி நிறுவன சேர்க்கைக்கு விண்ணப்பித்தால்",
        "requirement": "Verification that caste is listed in Central OBC list for Tamil Nadu",
        "requirementTa": "மத்திய அரசின் தமிழ்நாடு OBC பட்டியலில் குறிப்பிட்ட சாதி இடம்பெற்றிருக்க வேண்டும்"
      }
    ],
    "prerequisites": [
      "Non-Creamy Layer (NCL) status verification",
      "Active mobile number for OTP",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "கிரீமிலேயர் வரம்பிற்குள் வராததற்கான உறுதிப்படுத்தல் (Non-Creamy Layer)",
      "OTP பெற மொபைல் எண்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Valid for 1 financial year for Central Government jobs, UPSC, SSC, Banking, and central admissions.",
    "notesTa": "மத்திய அரசுப் பணிகள் மற்றும் தேசியக் கல்வி நிறுவன சேர்க்கைக்கு 1 நிதியாண்டு வரை செல்லுபடியாகும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-108",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "Destitute Widow Certificate",
    "nameTa": "ஆதரவற்ற விதவைச் சான்றிதழ்",
    "descriptionEn": "Certificate issued to widows with income below poverty line thresholds, enabling special age relaxation and priority reservation in Tamil Nadu Government recruitment (TNPSC).",
    "descriptionTa": "ஆதரவற்ற விதவைப் பெண்களுக்கு அரசு வேலைவாய்ப்புகளில் (TNPSC) முன்னுரிமை மற்றும் 58 வயது வரை வயது வரம்பு சலுகை வழங்கும் வருவாய்த்துறைச் சான்றிதழ்.",
    "eligibilityEn": "Widowed women whose annual family income is below ₹4,000 without independent income or supporting earning adult children.",
    "eligibilityTa": "ஆண்டு வருமானம் ₹4,000-க்குள் உள்ள ஆதரவற்ற நிலையில் வாழும் கைம்பெண்கள்.",
    "requiredDocuments": [
      "Husband Death Certificate",
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Income Certificate (Annual income below ₹4,000 for destitute widow status)",
      "Community Certificate of Applicant",
      "Applicant Passport Size Photo",
      "Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "கணவரின் இறப்புச் சான்றிதழ்",
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "வருமானச் சான்றிதழ் (ஆண்டு வருமானம் ₹4,000-க்குள் இருத்தல்)",
      "விண்ணப்பதாரரின் சாதிச் சான்றிதழ்",
      "பாஸ்போர்ட் அளவு புகைப்படம்",
      "சுய உறுதிமொழிப் படிவம்"
    ],
    "optionalDocuments": [
      "VAO Destitute Certificate (ஆதரவற்ற நிலை சான்று)",
      "Marriage Certificate"
    ],
    "optionalDocumentsTa": [
      "VAO ஆதரவற்ற நிலை சான்று",
      "திருமணப் பதிவுச் சான்றிதழ்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If claiming age relaxation or special priority in TNPSC / TRB recruitment",
        "conditionTa": "TNPSC / TRB அரசுப் பணிகளில் வயது வரம்பு சலுகை மற்றும் முன்னுரிமை கோரினால்",
        "requirement": "RDO / Sub-Collector certified Destitute Widow Certificate",
        "requirementTa": "வருவாய் கோட்டாட்சியர் (RDO) வழங்கிய அதிகாரப்பூர்வ ஆதரவற்ற விதவைச் சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "Non-remarried status",
      "Age criteria (Minimum 18 years)",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "மறுமணம் செய்யாத நிலை",
      "குறைந்தபட்ச வயது 18 ஆண்டுகள்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Grants reservation and age relaxation up to 58 years in Tamil Nadu government recruitment (TNPSC).",
    "notesTa": "TNPSC தேர்வுகளில் 58 வயது வரை வயது வரம்பு சலுகை மற்றும் சிறப்பு இடஒதுக்கீடு பெற உதவுகிறது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-109",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "Deserted Woman Certificate",
    "nameTa": "கணவரால் கைவிடப்பட்ட பெண் சான்றிதழ்",
    "descriptionEn": "Certificate issued to women deserted by their husbands for a minimum period of 5 years without maintenance or legal reunion, enabling welfare scheme benefits.",
    "descriptionTa": "கணவரால் கைவிடப்பட்டு 5 ஆண்டுகளுக்கு மேலாக தனியாக வாழும் பெண்களுக்கு அரசு நலத்திட்டங்கள் மற்றும் முன்னுரிமைகளுக்காக வழங்கப்படும் சான்றிதழ்.",
    "eligibilityEn": "Women living separately from husband for 5+ years continuously without financial support.",
    "eligibilityTa": "கணவரைப் பிரிந்து 5 ஆண்டுகளுக்கு மேலாக எந்தவித ஜீவனாம்சமும் இன்றி ஆதரவற்று வாழும் பெண்கள்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Proof of Marriage (Marriage Certificate / Wedding Photo / Invitation)",
      "Certificate of Separation from VAO / Local Community Leaders (Min 5 years separation)",
      "Applicant Passport Size Photo",
      "Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "திருமண ஆதாரம் (திருமண சான்றிதழ் / புகைப்படங்கள் / அழைப்பிதழ்)",
      "5 ஆண்டுகளுக்கு மேல் பிரிந்து வாழ்வதற்கான VAO கள ஆய்வு அறிக்கை / சான்று",
      "பாஸ்போர்ட் அளவு புகைப்படம்",
      "சுய அறிவிப்புப் படிவம்"
    ],
    "optionalDocuments": [
      "Police Complaint Copy (if filed)",
      "Court Maintenance Petition (if filed)"
    ],
    "optionalDocumentsTa": [
      "காவல்துறை புகார் மனு நகல் (இருப்பின்)",
      "நீதிமன்ற வழக்கு நகல் (இருப்பின்)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If divorced through court of law",
        "conditionTa": "நீதிமன்றம் மூலம் விவாகரத்து பெற்றிருப்பின்",
        "requirement": "Court Decree of Divorce copy",
        "requirementTa": "நீதிமன்ற விவாகரத்து தீர்ப்பு நகல்"
      }
    ],
    "prerequisites": [
      "Minimum 5 years continuous separation from husband without reunion or maintenance",
      "Active mobile number for OTP",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "கணவரைப் பிரிந்து குறைந்தபட்சம் 5 ஆண்டுகள் தொடர்ந்து தனியாக வாழ்தல்",
      "OTP பெற மொபைல் எண்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Issued after VAO and RI field enquiry. Essential for welfare pensions and government priority quota.",
    "notesTa": "அரசு நலத்திட்ட உதவிகள் மற்றும் முன்னுரிமை இடஒதுக்கீடு பெற உதவுகிறது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-110",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "Small / Marginal Farmer Certificate",
    "nameTa": "சிறு / குறு விவசாயி சான்றிதழ்",
    "descriptionEn": "Certifies agricultural landholding size for availing government subsidies on drip irrigation (100% subsidy), farm mechanization, crop loans and electricity tariff concessions.",
    "descriptionTa": "சொட்டு நீர் பாசன 100% மானியம், வேளாண் உபகரண மானியம், பயிர்க்கடன் தள்ளுபடி பெற விவசாய நில அளவை உறுதிப்படுத்தும் சான்றிதழ்.",
    "eligibilityEn": "Marginal farmers holding up to 2.5 acres dry land or 1.25 acres wet land; Small farmers holding up to 5 acres dry land or 2.5 acres wet land.",
    "eligibilityTa": "2.5 ஏக்கர் புன்செய் வரை நிலமுள்ள குறு விவசாயிகள் அல்லது 5 ஏக்கர் வரை நிலமுள்ள சிறு விவசாயிகள்.",
    "requiredDocuments": [
      "Land Patta / Chitta Copy in applicant name",
      "Recent Land Adangal Extract (நடப்பு பசலி அடங்கல்)",
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரர் பெயரிலான பட்டா / சிட்டா நகல்",
      "நடப்பு பசலி கிராம அடங்கல் சான்று",
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "சுய அறிவிப்புப் படிவம்"
    ],
    "optionalDocuments": [
      "Land Sale Deed Copy",
      "FMB Map Sketch"
    ],
    "optionalDocumentsTa": [
      "கிரயப் பத்திர நகல்",
      "FMB வரைபடம்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If land is jointly held with family members",
        "conditionTa": "கூட்டுப் பட்டாவாக இருக்கும் பட்சத்தில்",
        "requirement": "Co-owners Consent Letter and Sub-division share partition statement",
        "requirementTa": "கூட்டுப் பட்டாதாரர்களின் சம்மதக் கடிதம் & பாகப்பிரிவினை விவரம்"
      }
    ],
    "prerequisites": [
      "Land ceiling limits: Marginal Farmer (<= 2.5 acres dry land / <= 1.25 acres wet land); Small Farmer (<= 5.0 acres dry / <= 2.5 acres wet)",
      "Survey number and sub-division details",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "நில வரம்பு: குறு விவசாயி (2.5 ஏக்கர் புன்செய் அல்லது 1.25 ஏக்கர் நன்செய் வரை); சிறு விவசாயி (5 ஏக்கர் புன்செய் அல்லது 2.5 ஏக்கர் நன்செய் வரை)",
      "சர்வே எண் மற்றும் உட்பிரிவு விவரங்கள்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Essential for micro-irrigation subsidies (சொட்டு நீர் பாசனம்), farm equipment subsidy and agricultural loans.",
    "notesTa": "சொட்டு நீர் பாசன 100% மானியம், வேளாண் உபகரண மானியம் மற்றும் பயிர்க்கடன் பெற அவசியம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-111",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "Inter-caste Marriage Certificate",
    "nameTa": "கலப்புத் திருமணச் சான்றிதழ்",
    "descriptionEn": "Certifies inter-caste marriage between individuals of different castes/communities, required for Dr. Muthulakshmi Reddy Ninaivu Inter-Caste Marriage Assistance Scheme and employment priority.",
    "descriptionTa": "கலப்புத் திருமணம் செய்துகொண்ட தம்பதியருக்கு அரசு திருமண நிதியுதவித் திட்டம் (₹25,000/₹50,000 + தங்கம்) மற்றும் அரசுப் பணிகளில் முன்னுரிமை பெற உதவும் சான்றிதழ்.",
    "eligibilityEn": "Couples where one spouse belongs to SC/ST and the other to a non-SC/ST community, or one belongs to Forward/BC and the other to MBC/SC/ST.",
    "eligibilityTa": "சட்டப்பூர்வமாக கலப்புத் திருமணம் செய்துகொண்ட தம்பதியர்.",
    "requiredDocuments": [
      "Marriage Registration Certificate",
      "Bridegroom Aadhaar Card & Community Certificate",
      "Bride Aadhaar Card & Community Certificate",
      "Smart Ration Card / Family Cards",
      "Joint Passport Size Photograph of the Married Couple",
      "Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "பதிவு செய்யப்பட்ட திருமணச் சான்றிதழ்",
      "மணமகனின் ஆதார் அட்டை & சாதிச் சான்றிதழ்",
      "மணமகளின் ஆதார் அட்டை & சாதிச் சான்றிதழ்",
      "இரு குடும்பங்களின் குடும்ப அட்டைகள்",
      "தம்பதியரின் கூட்டு பாஸ்போர்ட் அளவு புகைப்படம்",
      "சுய உறுதிமொழிப் படிவம்"
    ],
    "optionalDocuments": [
      "Marriage Invitation Card",
      "Wedding Photographs"
    ],
    "optionalDocumentsTa": [
      "திருமண அழைப்பிதழ்",
      "திருமண புகைப்படங்கள்"
    ],
    "conditionalDocuments": [
      {
        "condition": "Community criteria verification for government incentive",
        "conditionTa": "அரசு திருமண உதவித்தொகை பெற சாதிப் பிரிவு நிபந்தனை",
        "requirement": "One spouse must belong to SC/ST category and other to non-SC/ST, OR one to Forward/BC and other to MBC/SC/ST",
        "requirementTa": "ஒருவர் SC/ST பிரிவாகவும் மற்றவர் பிற சமூகமாகவும், அல்லது ஒருவர் BC/OC மற்றவர் MBC/SC/ST ஆக இருத்தல் வேண்டும்"
      }
    ],
    "prerequisites": [
      "Valid legal marriage registration under Hindu Marriage Act / Special Marriage Act",
      "Active mobile number for OTP",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "சட்டப்பூர்வ திருமணப் பதிவு",
      "OTP பெற மொபைல் எண்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Enables application for Dr. Muthulakshmi Reddy Inter-Caste Marriage Assistance Scheme.",
    "notesTa": "டாக்டர் முத்துலட்சுமி ரெட்டி கலப்புத் திருமண நிதியுதவித் திட்டத்திற்கு விண்ணப்பிக்க உதவுகிறது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-112",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "Unemployment Certificate",
    "nameTa": "வேலையின்மைச் சான்றிதழ்",
    "descriptionEn": "Certifies that the applicant has completed studies and is currently unemployed, essential for unemployed youth monthly allowance and government loan subsidy schemes.",
    "descriptionTa": "படிப்பு முடித்து வேலைவாய்ப்பின்றி இருக்கும் இளைஞர்களுக்கு மாதாந்திர உதவித்தொகை மற்றும் சுயதொழில் கடன் மானியம் பெற வழங்கப்படும் சான்றிதழ்.",
    "eligibilityEn": "Unemployed resident citizens who have registered with the employment exchange and are not employed in organized public/private sector.",
    "eligibilityTa": "வேலைவாய்ப்பு அலுவலகத்தில் பதிவு செய்து தொடர்ந்து வேலையின்றி இருக்கும் தமிழ்நாட்டு இளைஞர்கள்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Educational Mark Sheets (10th / 12th / Degree / Diploma)",
      "School / College Transfer Certificate (TC)",
      "Employment Exchange Registration Card (if registered)",
      "Applicant Passport Size Photo",
      "Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "கல்வி மதிப்பெண் சான்றிதழ்கள் (10th / 12th / Degree)",
      "பள்ளி / கல்லூரி மாற்றுச் சான்றிதழ் (TC)",
      "வேலைவாய்ப்பு அலுவலக பதிவு அட்டை (இருப்பின்)",
      "பாஸ்போர்ட் அளவு புகைப்படம்",
      "சுய அறிவிப்புப் படிவம்"
    ],
    "optionalDocuments": [
      "Technical Training / Skill Course Certificates"
    ],
    "optionalDocumentsTa": [
      "தொழிற்பயிற்சி சான்றிதழ்கள்"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "Applicant must not be in regular government or private salaried employment",
      "Age between 18 and 45 years",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "எந்தவொரு அரசு அல்லது தனியார் நிறுவனத்திலும் நிரந்தர ஊதிய பணியில் இல்லாதிருத்தல்",
      "வயது 18 முதல் 45 வரை",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Required for unemployed youth financial assistance scheme and government self-employment loan subsidies.",
    "notesTa": "வேலையில்லா இளைஞர் உதவித்தொகை மற்றும் அரசு சுயதொழில் கடன் மானியங்களுக்குத் தேவைப்படுகிறது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-113",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "Unmarried Certificate",
    "nameTa": "திருமணமாகாதவர் சான்றிதழ்",
    "descriptionEn": "Certifies that the applicant has not been married, required for defense recruitment (Army, Navy, Air Force), police sub-inspector recruitment and specific overseas visas.",
    "descriptionTa": "விண்ணப்பதாரருக்கு இதுவரை திருமணம் ஆகவில்லை என்பதை உறுதிப்படுத்தும் சான்றிதழ். இராணுவம், விமானப்படை, காவல்துறை பணிகளுக்கு மிக அவசியம்.",
    "eligibilityEn": "Single unmarried citizens residing within the taluk/village jurisdiction.",
    "eligibilityTa": "அந்தந்த வட்டார/கிராம எல்லைக்குள் வசிக்கும் திருமணமாகாத குடிமக்கள்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Age Proof (School TC / Birth Certificate / 10th Mark Sheet)",
      "Applicant Passport Size Photo",
      "Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "வயது ஆதாரம் (பள்ளி TC / பிறப்புச் சான்றிதழ் / 10th மதிப்பெண் சான்றிதழ்)",
      "பாஸ்போர்ட் அளவு புகைப்படம்",
      "சுய உறுதிமொழிப் படிவம்"
    ],
    "optionalDocuments": [
      "Parent Aadhaar Card",
      "Local Body VAO Recommendation Letter"
    ],
    "optionalDocumentsTa": [
      "பெற்றோரின் ஆதார் அட்டை",
      "VAO பரிந்துரைக் கடிதம்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If applying for Defense / Police / Airforce recruitment requiring unmarried status",
        "conditionTa": "இராணுவம் / காவல்துறை போன்ற திருமணமாகாதவர் நிபந்தனை கொண்ட பணிகளுக்கு விண்ணப்பித்தால்",
        "requirement": "Recruitment Notification & Format Form signed by VAO & Tahsildar",
        "requirementTa": "தேர்வு அறிவிக்கையில் குறிப்பிடப்பட்டுள்ள படிவத்தில் சான்று"
      }
    ],
    "prerequisites": [
      "Minimum age of marriage criteria (21 for male, 18 for female)",
      "Active mobile number for OTP",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "சட்டப்பூர்வ திருமண வயது பூர்த்தியடைந்திருத்தல் (ஆண் 21, பெண் 18)",
      "OTP பெற மொபைல் எண்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Issued after VAO local enquiry confirming marital status.",
    "notesTa": "கிராம நிர்வாக அலுவலர் (VAO) கள ஆய்வுக்குப் பின் வழங்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-114",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "No Male Child Certificate",
    "nameTa": "ஆண் வாரிசு இன்மைச் சான்றிதழ்",
    "descriptionEn": "Certifies that the family has only female children and no male children, and either parent has undergone sterilization, required for Chief Minister Girl Child Protection Scheme.",
    "descriptionTa": "குடும்பத்தில் பெண் குழந்தைகள் மட்டுமே உள்ளனர், ஆண் வாரிசு இல்லை மற்றும் பெற்றோர் குடும்பக் கட்டுப்பாடு செய்துள்ளனர் என்பதை உறுதிப்படுத்தும் சான்றிதழ்.",
    "eligibilityEn": "Families with only one or two girl children and no male children.",
    "eligibilityTa": "ஒன்று அல்லது இரண்டு பெண் குழந்தைகள் மட்டுமே உள்ள குடும்பங்கள்.",
    "requiredDocuments": [
      "Girl Child / Children Birth Certificates",
      "Applicant Parents Aadhaar Cards",
      "Smart Ration Card / Family Card",
      "Sterilization / Family Planning Certificate (குடும்பக் கட்டுப்பாடு சான்றிதழ்) of either parent",
      "Self-Declaration Form of Parents",
      "Family Group Photo"
    ],
    "requiredDocumentsTa": [
      "பெண் குழந்தையின் / குழந்தைகளின் பிறப்புச் சான்றிதழ்கள்",
      "பெற்றோரின் ஆதார் அட்டைகள்",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "தந்தை அல்லது தாயின் குடும்பக் கட்டுப்பாடு அறுவை சிகிச்சை சான்றிதழ்",
      "பெற்றோரின் சுய உறுதிமொழிப் படிவம்",
      "குடும்பக் குழு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Hospital Discharge Summary for Sterilization"
    ],
    "optionalDocumentsTa": [
      "குடும்பக் கட்டுப்பாடு மருத்துவமனை சிகிச்சை ரசீது"
    ],
    "conditionalDocuments": [
      {
        "condition": "Family structure condition",
        "conditionTa": "குடும்பக் கட்டமைப்பு நிபந்தனை",
        "requirement": "Family must have only one or two female children and no male children",
        "requirementTa": "குடும்பத்தில் ஒன்று அல்லது இரண்டு பெண் குழந்தைகள் மட்டுமே இருக்க வேண்டும்; ஆண் குழந்தை இருக்கக் கூடாது"
      }
    ],
    "prerequisites": [
      "Sterilization must have been performed before age 35 of mother",
      "Active mobile number for OTP",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "தாயின் 35 வயதுக்குள் குடும்பக் கட்டுப்பாடு செய்யப்பட்டிருத்தல்",
      "OTP பெற மொபைல் எண்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Mandatory certificate for Chief Minister Girl Child Protection Scheme Fixed Deposit benefit.",
    "notesTa": "முதலமைச்சரின் பெண் குழந்தைகள் பாதுகாப்புத் திட்ட வைப்புத்தொகை பெற கட்டாயமான சான்றிதழ்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-115",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "Certificate for Loss of Educational Records",
    "nameTa": "கல்விச் சான்றிதழ் தொலைந்தமைக்கான சான்றிதழ்",
    "descriptionEn": "Certificate issued by the Revenue Divisional Officer / Tahsildar for loss of 10th / 12th / University mark sheets due to flood, fire, theft or misplacement, enabling issue of duplicate mark sheet.",
    "descriptionTa": "வெள்ளம், தீ விபத்து அல்லது எதிர்பாராத காரணங்களால் தொலைந்துபோன பள்ளி/கல்லூரி மதிப்பெண் சான்றிதழ்களின் மறு நகல் (Duplicate Marksheet) பெற வட்டாட்சியரால் வழங்கப்படும் சான்றிதழ்.",
    "eligibilityEn": "Students whose original educational certificates are lost beyond recovery.",
    "eligibilityTa": "கல்விச் சான்றிதழ்களைத் தவறவிட்ட அனைத்து மாணவர்களும்.",
    "requiredDocuments": [
      "Lost Document Report (LDR) from Tamil Nadu Police CCTNS Portal",
      "Copy of Lost Mark Sheet / Certificate (if available)",
      "School / College Study Bonafide Certificate confirming student register number & years of study",
      "Applicant Aadhaar Card & Smart Ration Card",
      "Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "காவல்துறை இணையதளத்தில் (CCTNS) பெறப்பட்ட தொலைந்த ஆவண அறிக்கை (LDR சான்றிதழ்)",
      "தொலைந்துபோன சான்றிதழின் நகல் (இருப்பின்)",
      "படித்த பள்ளி / கல்லூரியின் போனாபைட் சான்றிதழ் (பதிவு எண் & படித்த ஆண்டு விபரங்களுடன்)",
      "விண்ணப்பதாரரின் ஆதார் அட்டை & குடும்ப அட்டை",
      "சுய அறிவிப்புப் படிவம்"
    ],
    "optionalDocuments": [
      "Paper Advertisement Copy in leading newspaper (if required by DGE/University)"
    ],
    "optionalDocumentsTa": [
      "நாளிதழில் வெளியிடப்பட்ட காணவில்லை விளம்பர நகல் (பல்கலைக்கழகம் கோரினால்)"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "Police Non-Traceable LDR reference number",
      "School / University Register Number, Examination Month & Year details",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "காவல்துறை LDR அறிக்கை எண்",
      "பள்ளி / கல்லூரி தேர்வுப் பதிவு எண் மற்றும் தேர்ச்சி பெற்ற ஆண்டு விபரம்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Essential prerequisite to apply for duplicate 10th / 12th / Degree mark sheet from DGE / University.",
    "notesTa": "பள்ளித் தேர்வுகள் இயக்ககம் (DGE) அல்லது பல்கலைக்கழகத்தில் மறு மதிப்பெண் சான்றிதழ் பெற அவசியம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REV-116",
    "category": "revenue_certificates",
    "department": "Revenue Department",
    "departmentTa": "வருவாய்த்துறை",
    "nameEn": "Solvency Certificate",
    "nameTa": "சொத்து மதிப்பு / கடன்தீர் திறன் சான்றிதழ்",
    "descriptionEn": "Certifies the financial solvency and unencumbered immovable property value of an individual, required for government tenders, liquor/excise licences, forest contracts and court bail sureties.",
    "descriptionTa": "அரசு ஒப்பந்தங்கள், மதுவிலக்கு உரிமங்கள், வனத்துறை ஏலங்கள் மற்றும் நீதிமன்ற பிணைகளுக்காக ஒருவரது அசையா சொத்தின் நிகர மதிப்பை உறுதிப்படுத்தும் வருவாய்த்துறைச் சான்றிதழ்.",
    "eligibilityEn": "Property owners having clear title deeds of immovable land/buildings without prior encumbrance/mortgage.",
    "eligibilityTa": "எந்தவித வில்லங்கமும் இல்லாத சொந்த நிலம்/கட்டிடம் வைத்துள்ள சொத்து உரிமையாளர்கள்.",
    "requiredDocuments": [
      "Property Title Deeds (Registered Sale Deed / Partition Deed / Settlement Deed)",
      "Latest Encumbrance Certificate (EC) for past 13 to 30 years",
      "Land Patta / Chitta Extract in applicant name",
      "Guideline Value Certificate from TNREGINET",
      "Latest Property Tax Receipt",
      "Applicant Aadhaar Card & PAN Card",
      "Applicant Passport Size Photo",
      "Solvency Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "சொத்து கிரயப் பத்திரம் / பாகப்பிரிவினை / செட்டில்மெண்ட் பத்திரம்",
      "கடந்த 13 முதல் 30 ஆண்டுகளுக்கான வில்லங்கச் சான்றிதழ் (EC)",
      "விண்ணப்பதாரர் பெயரிலான பட்டா / சிட்டா நகல்",
      "வழிகாட்டி மதிப்புச் சான்று (Guideline Value Certificate)",
      "நடப்பு நிதியாண்டு சொத்துவரி ரசீது",
      "விண்ணப்பதாரரின் ஆதார் அட்டை & பான் கார்டு",
      "பாஸ்போர்ட் அளவு புகைப்படம்",
      "சொத்து மதிப்பு சுய உறுதிமொழிப் படிவம்"
    ],
    "optionalDocuments": [
      "Bank Fixed Deposit Receipts (if pledging bank deposits)",
      "Property Valuation Certificate from Registered Chartered Engineer"
    ],
    "optionalDocumentsTa": [
      "வங்கி நிலையான வைப்பு ரசீதுகள் (Fixed Deposit Receipts)",
      "அங்கீகரிக்கப்பட்ட பொறியாளரின் சொத்து மதிப்பீட்டுச் சான்றிதழ்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If required for Government Tenders / Excise Contracts / Court Bail",
        "conditionTa": "அரசு ஒப்பந்தப் பணிகள், மதுவிலக்கு ஒப்பந்தங்கள் அல்லது நீதிமன்ற பிணைக்காக கோரப்பட்டால்",
        "requirement": "Tahsildar / RDO inspection and certification for specified monetary solvency limit",
        "requirementTa": "குறிப்பிட்ட தொகைக்கான வட்டாட்சியர் / வருவாய் கோட்டாட்சியர் கள ஆய்வு மற்றும் ஒப்புதல்"
      }
    ],
    "prerequisites": [
      "Clear marketable title of immovable property without existing mortgage or court attachment",
      "Active mobile number for OTP",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "சொத்து மீது எந்தவித வில்லங்கமும் அல்லது நீதிமன்ற வழக்கும் இல்லாதிருத்தல்",
      "OTP பெற மொபைல் எண்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Issued after VAO, RI, and Tahsildar valuation enquiry. Solvency certificate valid for 3 years.",
    "notesTa": "வட்டாட்சியர் கள ஆய்வுக்குப் பின் வழங்கப்படும். 3 ஆண்டுகள் வரை செல்லுபடியாகும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNeGA / Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "SSP-201",
    "category": "revenue_social_security",
    "department": "Revenue Department (Social Security Schemes)",
    "departmentTa": "வருவாய்த்துறை (சமூக பாதுகாப்புத் திட்டம்)",
    "nameEn": "Indira Gandhi National Old Age Pension (IGNOAPS / OAP)",
    "nameTa": "முதியோர் உதவித்தொகை திட்டம் (OAP Pension)",
    "descriptionEn": "Monthly pension of ₹1,000 / ₹1,200 granted to destitute elderly citizens below the poverty line directly credited to bank account via Direct Benefit Transfer (DBT).",
    "descriptionTa": "வறுமைக்கோட்டிற்கு கீழ் வாழும் 60 வயதுக்கு மேற்பட்ட முதியோர்களுக்கு அரசு வழங்கும் மாதாந்திர ₹1,000 / ₹1,200 ஓய்வூதியத் திட்டம்.",
    "eligibilityEn": "Destitute elderly residents aged 60+ (OAP) or 65+ (IGNOAPS) without earning adult children or independent means of livelihood.",
    "eligibilityTa": "ஆதரவற்ற நிலையில் வாழும் 60 வயதுக்கு மேற்பட்ட முதியோர்கள்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Bank Account Passbook (Single account with IFSC in applicant name)",
      "Age Proof (School TC / Voter ID / Aadhaar / Medical Board Age Certificate)",
      "Applicant Passport Size Photo"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "வங்கி கணக்கு பாஸ்புக் (விண்ணப்பதாரர் பெயரிலான ஒற்றை கணக்கு & IFSC)",
      "வயது ஆதாரம் (பள்ளி TC / வாக்காளர் அட்டை / ஆதார் / மருத்துவ வயதுச் சான்று)",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "VAO Destitute Certificate"
    ],
    "optionalDocumentsTa": [
      "கிராம நிர்வாக அலுவலர் (VAO) ஆதரவற்ற நிலை சான்று"
    ],
    "conditionalDocuments": [
      {
        "condition": "If applicant has sons/daughters living separately without providing maintenance",
        "conditionTa": "பிள்ளைகள் இருந்தும் ஆதரவின்றி தனியாக வசித்தால்",
        "requirement": "Family Tree Certificate & Destitute Affidavit confirming no maintenance support",
        "requirementTa": "குடும்ப வம்சாவளிச் சான்று & பராமரிப்பு உதவி கிடைக்கவில்லை என்பதற்கான உறுதிமொழி"
      }
    ],
    "prerequisites": [
      "Age minimum 60 years",
      "Below Poverty Line (BPL) economic status",
      "Bank account seeded with Aadhaar for Direct Benefit Transfer (DBT)",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "குறைந்தபட்ச வயது 60 ஆண்டுகள் பூர்த்தியடைந்திருத்தல்",
      "வறுமைக்கோட்டிற்கு கீழ் வாழும் நிலை",
      "DBT திட்டத்திற்கு ஆதாரில் இணைக்கப்பட்ட வங்கிக் கணக்கு",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Monthly pension is credited directly to the pensioner bank account. Biometric / Jeevan Pramaan digital life certificate required annually in November.",
    "notesTa": "ஓய்வூதியம் நேரடியாக வங்கிக் கணக்கில் வரவு வைக்கப்படும். ஆண்டுதோறும் நவம்பர் மாதத்தில் டிஜிட்டல் ஜீவன் பிரமாண் வாழ்நாள் சான்று சமர்ப்பிக்க வேண்டும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Social Security Schemes, Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "SSP-202",
    "category": "revenue_social_security",
    "department": "Revenue Department (Social Security Schemes)",
    "departmentTa": "வருவாய்த்துறை (சமூக பாதுகாப்புத் திட்டம்)",
    "nameEn": "Destitute Widow Pension Scheme (DWP)",
    "nameTa": "ஆதரவற்ற விதவை ஓய்வூதியத் திட்டம்",
    "descriptionEn": "Monthly social security pension of ₹1,000 / ₹1,200 provided to destitute widows who have not remarried, supporting their livelihood.",
    "descriptionTa": "கணவரை இழந்து ஆதரவற்ற நிலையில் வாழும் மறுமணம் செய்யாத பெண்களுக்கு மாதாந்திர ₹1,000 / ₹1,200 வாழ்வாதார ஓய்வூதியம் வழங்கும் திட்டம்.",
    "eligibilityEn": "Widows of any age residing in Tamil Nadu, living below poverty line without regular support.",
    "eligibilityTa": "கணவரை இழந்த ஆதரவற்ற நிலையில் வாழும் மறுமணம் செய்யாத பெண்கள்.",
    "requiredDocuments": [
      "Husband Death Certificate",
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Bank Account Passbook (Single account with IFSC)",
      "Applicant Passport Size Photo"
    ],
    "requiredDocumentsTa": [
      "கணவரின் இறப்புச் சான்றிதழ்",
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "வங்கி கணக்கு பாஸ்புக் (IFSC குறியீட்டுடன்)",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Marriage Certificate / Wedding Photo"
    ],
    "optionalDocumentsTa": [
      "திருமணப் பதிவுச் சான்றிதழ் / திருமண புகைப்படம்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If applicant has minor children",
        "conditionTa": "மைனர் குழந்தைகள் இருப்பின்",
        "requirement": "Children Birth Certificates or School Study Bonafide",
        "requirementTa": "குழந்தைகளின் பிறப்புச் சான்றிதழ்கள் அல்லது பள்ளி போனாபைட் சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "Non-remarried status",
      "Minimum age 18 years",
      "Aadhaar seeded bank account for DBT",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "மறுமணம் செய்யாத நிலை",
      "குறைந்தபட்ச வயது 18 ஆண்டுகள்",
      "DBT வங்கி கணக்கு இணைப்பு",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Pension credited directly to the applicant DBT bank account after Tahsildar sanction.",
    "notesTa": "வட்டாட்சியர் ஒப்புதலுக்குப் பின் மாதாந்திர ஓய்வூதியம் நேரடியாக வங்கிக் கணக்கில் வரவு வைக்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Social Security Schemes, Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "SSP-203",
    "category": "revenue_social_security",
    "department": "Revenue Department (Social Security Schemes)",
    "departmentTa": "வருவாய்த்துறை (சமூக பாதுகாப்புத் திட்டம்)",
    "nameEn": "Differently Abled Pension Scheme (DAP)",
    "nameTa": "மாற்றுத்திறனாளிகள் ஓய்வூதியத் திட்டம் (DAP Pension)",
    "descriptionEn": "Monthly financial assistance of ₹1,000 / ₹1,500 / ₹2,000 provided to differently abled persons with benchmark disability.",
    "descriptionTa": "40% அல்லது அதற்கு மேற்பட்ட மாற்றுத்திறன் கொண்ட நபர்களுக்கு தமிழ்நாடு அரசு வழங்கும் மாதாந்திர உதவித்தொகைத் திட்டம்.",
    "eligibilityEn": "Persons with minimum 40% recognized benchmark disability holding official Disability Medical Board Certificate or UDID card.",
    "eligibilityTa": "40% மற்றும் அதற்கு மேற்பட்ட மாற்றுத்திறன் கொண்ட அனைத்து நபர்களும்.",
    "requiredDocuments": [
      "National Disability Identity Card (UDID Card) OR District Medical Board Disability Certificate",
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Bank Account Passbook (Single or Joint with Legal Guardian)",
      "Full Body Photograph showing disability clearly"
    ],
    "requiredDocumentsTa": [
      "தேசிய மாற்றுத்திறனாளி அடையாள அட்டை (UDID Card) அல்லது மாவட்ட மருத்துவக் குழு சான்றிதழ்",
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "வங்கி கணக்கு பாஸ்புக் (விண்ணப்பதாரர் / பாதுகாவலர் பெயரில்)",
      "மாற்றுத்திறனைத் தெளிவாகக் காட்டும் முழு உருவப் புகைப்படம்"
    ],
    "optionalDocuments": [
      "Guardian Aadhaar Card (if severe / mental disability)"
    ],
    "optionalDocumentsTa": [
      "பாதுகாவலரின் ஆதார் அட்டை (மனநலம் பாதிக்கப்பட்டோர் / தீவிர மாற்றுத்திறனாளிகளுக்கு)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If disability is 75% and above (Severely disabled / Intellectual disability)",
        "conditionTa": "75% மற்றும் அதற்கு மேற்பட்ட தீவிர மாற்றுத்திறனாளிகளுக்கு",
        "requirement": "Higher Maintenance Allowance sanction category recommendation from DDAWO",
        "requirementTa": "மாவட்ட மாற்றுத்திறனாளிகள் நல அலுவலரின் (DDAWO) தீவிர பராமரிப்பு உதவித்தொகை பரிந்துரை"
      }
    ],
    "prerequisites": [
      "Minimum 40% benchmark disability certified by Medical Board",
      "UDID Card Number",
      "Aadhaar linked DBT bank account",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "மருத்துவ வாரியத்தால் சான்றளிக்கப்பட்ட குறைந்தபட்சம் 40% மாற்றுத்திறன்",
      "UDID அட்டை எண்",
      "DBT திட்டத்திற்கான வங்கிக் கணக்கு",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "No minimum age limit for Differently Abled pension. Higher monthly assistance of ₹2,000 provided for severe intellectual/muscular dystrophy cases.",
    "notesTa": "மாற்றுத்திறனாளிகள் ஓய்வூதியத்திற்கு குறைந்தபட்ச வயது வரம்பு இல்லை. தீவிர பாதிப்புள்ளவர்களுக்கு மாதம் ₹2,000 வரை உதவித்தொகை கிடைக்கும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Social Security Schemes & Differently Abled Welfare Department",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "SSP-204",
    "category": "revenue_social_security",
    "department": "Revenue Department (Social Security Schemes)",
    "departmentTa": "வருவாய்த்துறை (சமூக பாதுகாப்புத் திட்டம்)",
    "nameEn": "Destitute / Deserted Wives Pension Scheme (DDWP)",
    "nameTa": "கணவரால் கைவிடப்பட்டோர் ஓய்வூதியத் திட்டம்",
    "descriptionEn": "Monthly maintenance pension of ₹1,000 / ₹1,200 granted to destitute deserted wives living separately for 5+ years without financial support from husband.",
    "descriptionTa": "கணவரால் கைவிடப்பட்டு 5 ஆண்டுகளுக்கு மேலாக தனியாக வாழும் ஆதரவற்ற பெண்களுக்கு வழங்கப்படும் மாதாந்திர ₹1,000 / ₹1,200 ஓய்வூதியம்.",
    "eligibilityEn": "Deserted women aged 30+ who have lived separately from husband for minimum 5 years without maintenance.",
    "eligibilityTa": "30 வயது பூர்த்தியடைந்த, கணவரைப் பிரிந்து 5 ஆண்டுகளுக்கு மேலாக வாழும் பெண்கள்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Deserted Woman Certificate from Tahsildar / Legal Separation Order",
      "Bank Account Passbook (Single account with IFSC in applicant name)",
      "Applicant Passport Size Photo"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "வட்டாட்சியர் வழங்கிய கணவரால் கைவிடப்பட்ட பெண் சான்றிதழ் / விவாகரத்து ஆவணம்",
      "வங்கி கணக்கு பாஸ்புக் (IFSC குறியீட்டுடன்)",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "VAO Field Enquiry Report"
    ],
    "optionalDocumentsTa": [
      "கிராம நிர்வாக அலுவலர் கள ஆய்வு அறிக்கை"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "Minimum age 30 years",
      "Minimum 5 years continuous separation from husband",
      "Aadhaar seeded bank account for DBT",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "குறைந்தபட்ச வயது 30 ஆண்டுகள்",
      "கணவரைப் பிரிந்து 5 ஆண்டுகள் நிறைவடைந்திருத்தல்",
      "DBT வங்கி கணக்கு இணைப்பு",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Issued after VAO/RI field verification. Monthly pension directly credited via DBT.",
    "notesTa": "VAO மற்றும் வருவாய் ஆய்வாளர் கள ஆய்வுக்குப் பின் வட்டாட்சியர் ஒப்புதலுடன் ஓய்வூதியம் வழங்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Social Security Schemes, Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "SSP-205",
    "category": "revenue_social_security",
    "department": "Revenue Department (Social Security Schemes)",
    "departmentTa": "வருவாய்த்துறை (சமூக பாதுகாப்புத் திட்டம்)",
    "nameEn": "Chief Minister Uzhavar Pathukappu Thittam (Farmers Pension)",
    "nameTa": "முதலமைச்சரின் உழவர் பாதுகாப்புத் திட்டம் (விவசாயிகள் ஓய்வூதியம்)",
    "descriptionEn": "Monthly social security pension of ₹1,000 / ₹1,200 provided to registered small/marginal farmers and agricultural landless labourers upon reaching 60 years of age.",
    "descriptionTa": "60 வயது பூர்த்தியடைந்த பதிவுபெற்ற சிறு/குறு விவசாயிகள் மற்றும் விவசாயத் தொழிலாளர்களுக்கு வழங்கப்படும் மாதாந்திர உழவர் பாதுகாப்பு ஓய்வூதியம்.",
    "eligibilityEn": "Registered members of the Tamil Nadu Agricultural Workers Welfare Board / Uzhavar Pathukappu Thittam aged 60+.",
    "eligibilityTa": "உழவர் பாதுகாப்புத் திட்டத்தில் பதிவு செய்துள்ள 60 வயதுக்கு மேற்பட்ட விவசாயிகள் மற்றும் விவசாயத் தொழிலாளர்கள்.",
    "requiredDocuments": [
      "Chief Minister Uzhavar Pathukappu Thittam Member Identity Card (உழவர் பாதுகாப்பு அட்டை)",
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Bank Account Passbook Copy (Single account with IFSC)",
      "Land / Agricultural Labourer Verification Certificate from VAO",
      "Applicant Passport Size Photo"
    ],
    "requiredDocumentsTa": [
      "முதலமைச்சரின் உழவர் பாதுகாப்புத் திட்ட உறுப்பினர் அட்டை",
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "வங்கி கணக்கு பாஸ்புக் (விண்ணப்பதாரர் பெயரிலான கணக்கு)",
      "VAO வழங்கிய விவசாயத் தொழிலாளர் சான்று / நில உரிமை விபரம்",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Land Patta / Chitta Copy (if small landholder)"
    ],
    "optionalDocumentsTa": [
      "பட்டா / சிட்டா நகல் (நில உரிமையாளராய் இருந்தால்)"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "Active registration in Chief Minister Uzhavar Pathukappu Thittam",
      "Age minimum 60 years",
      "Aadhaar seeded bank account for DBT",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "உழவர் பாதுகாப்புத் திட்டத்தில் செல்லுபடியாகும் உறுப்பினர் பதிவு",
      "குறைந்தபட்ச வயது 60 ஆண்டுகள்",
      "DBT வங்கி கணக்கு இணைப்பு",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Covers small farmers, marginal farmers, and registered farm coolies with comprehensive accident/natural death relief benefits.",
    "notesTa": "விவசாயிகள் மற்றும் விவசாயக் கூலித் தொழிலாளர்களுக்கு மாதாந்திர ஓய்வூதியம் மற்றும் இயற்கை மரண உதவி வழங்கப்படுகிறது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Uzhavar Pathukappu Thittam, Revenue Administration",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "LND-301",
    "category": "revenue_land_nilam",
    "department": "Revenue & Survey Department (Tamil Nilam)",
    "departmentTa": "வருவாய்த்துறை & நில அளவைத்துறை (தமிழ் நிலம்)",
    "nameEn": "View / Download Patta & Chitta (Rural & Urban)",
    "nameTa": "பட்டா / சிட்டா பார்வையிட & பதிவிறக்கம் (கிராமம் & நகரம்)",
    "descriptionEn": "Instant query, digital verification, and download of official QR-coded e-Patta and Chitta extract from Tamil Nilam portal establishing legal landownership.",
    "descriptionTa": "தமிழ் நிலம் இணையதளத்தில் இருந்து நில உரிமைப் பதிவேடான அதிகாரப்பூர்வ e-பட்டா மற்றும் சிட்டா சான்றை உடனடியாக பார்வையிட மற்றும் பதிவிறக்கம் செய்யும் சேவை.",
    "eligibilityEn": "Any citizen or landowner possessing survey number/patta number details.",
    "eligibilityTa": "சர்வே எண் அல்லது பட்டா எண் விபரம் வைத்துள்ள அனைத்து நில உரிமையாளர்களும்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "District, Taluk, and Village details",
      "Patta Number OR Survey Number & Sub-division Number",
      "For Urban areas: Ward, Block, and Town Survey (TS) Land Register Number"
    ],
    "prerequisitesTa": [
      "மாவட்டம், வட்டம் மற்றும் கிராம விபரம்",
      "பட்டா எண் அல்லது சர்வே எண் & உட்பிரிவு எண்",
      "நகர்ப்புற நிலங்களுக்கு: வார்டு, பிளாக் மற்றும் நகர நில அளவை (TS) எண்"
    ],
    "notesEn": "Instant online PDF download. No physical document upload is required. Digitally signed by Tahsildar with 2D verification barcode.",
    "notesTa": "உடனடி இணையவழி பதிவிறக்கம். ஆவணப் பதிவேற்றம் எதுவும் தேவையில்லை. வட்டாட்சியரின் டிஜிட்டல் கையொப்பம் மற்றும் QR குறியீட்டுடன் கிடைக்கும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Anytime Anywhere e-Services, Tamil Nilam (eservices.tn.gov.in)",
    "officialPortalUrl": "https://eservices.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "LND-302",
    "category": "revenue_land_nilam",
    "department": "Revenue & Survey Department (Tamil Nilam)",
    "departmentTa": "வருவாய்த்துறை & நில அளவைத்துறை (தமிழ் நிலம்)",
    "nameEn": "Patta Name Transfer Application (Non-Subdivision)",
    "nameTa": "பட்டா பெயர் மாற்றம் (முழுப் புலம் / உட்பிரிவு இல்லாதது)",
    "descriptionEn": "Online application for transferring patta name where entire surveyed land parcel is transferred without requiring new physical field sub-division measurement.",
    "descriptionTa": "நிலத்தின் முழுப் புலமும் கிரயம்/பாகப்பிரிவினை செய்யப்பட்டுள்ள போது, புதிய உட்பிரிவு அளவீடு இன்றி நேரடியாக பட்டா பெயர் மாற்றம் செய்யும் இணையவழி விண்ணப்பம்.",
    "eligibilityEn": "Purchasers or inheritors of an entire survey field parcel with registered title deeds.",
    "eligibilityTa": "முழு நிலப் புலத்தையும் கிரயம் வாங்கிய அல்லது வாரிசுரிமை மூலம் பெற்ற சொத்து உரிமையாளர்கள்.",
    "requiredDocuments": [
      "Registered Sale Deed / Partition Deed / Gift Deed / Settlement Deed",
      "Previous Patta Copy / Chitta Extract",
      "Latest Encumbrance Certificate (EC)",
      "Applicant Aadhaar Card",
      "Property Tax / Land Tax (Kist) Paid Receipt"
    ],
    "requiredDocumentsTa": [
      "பதிவு செய்யப்பட்ட கிரயப் பத்திரம் / பாகப்பிரிவினை / தான செட்டில்மெண்ட் பத்திரம்",
      "முந்தைய பட்டா நகல் / சிட்டா சான்று",
      "நடப்பு வில்லங்கச் சான்றிதழ் (EC)",
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "சொத்துவரி / நிலத் தீர்வை (கிஸ்தி) ரசீது"
    ],
    "optionalDocuments": [
      "Legal Heir Certificate & Death Certificate (if inherited succession)"
    ],
    "optionalDocumentsTa": [
      "வாரிசுச் சான்றிதழ் & இறப்புச் சான்றிதழ் (பூர்வீக வாரிசு வழி உரிமை எனில்)"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "Document Number, Year of Registration, and Sub-Registrar Office (SRO) details",
      "Survey Number and Sub-division Number (Full Field)",
      "Statutory Government Patta Transfer Fee payment (₹60 via online challan)",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "பத்திரப் பதிவு எண், பதிவு ஆண்டு மற்றும் சார்-பதிவாளர் அலுவலக விபரம்",
      "சர்வே எண் மற்றும் உட்பிரிவு எண் (முழு புலம்)",
      "அரசு பட்டா பெயர் மாற்றக் கட்டணம் (₹60 இணையவழி செலுத்துதல்)",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Processed within 15 working days by the Headquarters Deputy Tahsildar (HQDT) without surveyor field visit.",
    "notesTa": "கள அளவீடு தேவையில்லை என்பதால் 15 வேலை நாட்களுக்குள் தலைமையிடத்து துணை வட்டாட்சியரால் (HQDT) ஆணை பிறப்பிக்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nilam, Revenue Administration (tnesevai.tn.gov.in)",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "LND-303",
    "category": "revenue_land_nilam",
    "department": "Revenue & Survey Department (Tamil Nilam)",
    "departmentTa": "வருவாய்த்துறை & நில அளவைத்துறை (தமிழ் நிலம்)",
    "nameEn": "Patta Transfer with Subdivision Survey",
    "nameTa": "உட்பிரிவு பட்டா பெயர் மாற்றம் (நில அளவையர் அளவீடுடன் கூடியது)",
    "descriptionEn": "Application for sub-dividing a survey parcel and transferring patta name for a specific portion of land, involving physical field measurement and boundary demarcation by Revenue Surveyor.",
    "descriptionTa": "ஒரு சர்வே எண்ணில் குறிப்பிட்ட பகுதியை மட்டும் வாங்கிய போது, நில அளவையர் மூலம் கள அளவீடு செய்யப்பட்டு புதிய உட்பிரிவு எண் மற்றும் தனிப்பட்டா வழங்கும் விண்ணப்பம்.",
    "eligibilityEn": "Property owners who have acquired a specific sub-divided portion of a survey parcel.",
    "eligibilityTa": "சர்வே எண்ணில் ஒரு பகுதியை கிரயம் பெற்று தனிப்பட்டா பெற விரும்பும் சொத்து உரிமையாளர்கள்.",
    "requiredDocuments": [
      "Registered Sale Deed / Settlement Deed / Partition Deed showing exact boundary schedule (நான்குமால் எல்லை விபரம்)",
      "Parent Title Documents & Previous Patta / Chitta Copy",
      "Latest Encumbrance Certificate (EC)",
      "Applicant Aadhaar Card",
      "Layout Approval / DTCP Sanction (if residential plot in approved layout)"
    ],
    "requiredDocumentsTa": [
      "நான்குமால் எல்லைகள் தெளிவாகக் குறிப்பிடப்பட்ட பதிவு செய்யப்பட்ட கிரயப் பத்திரம்",
      "தாய் பத்திர நகல் & முந்தைய பட்டா / சிட்டா நகல்",
      "நடப்பு வில்லங்கச் சான்றிதழ் (EC)",
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "அங்கீகரிக்கப்பட்ட மனைப்பிரிவு வரைபடம் (DTCP / பஞ்சாயத்து அப்ரூவல் மனை எனில்)"
    ],
    "optionalDocuments": [
      "Field Boundary Sketch (FMB draft)",
      "Property Tax Receipt"
    ],
    "optionalDocumentsTa": [
      "எல்லை வரைபட நகல்",
      "சொத்துவரி ரசீது"
    ],
    "conditionalDocuments": [
      {
        "condition": "If sub-division affects adjoining co-owners / boundaries",
        "conditionTa": "அண்டை நில உரிமையாளர்களுக்கு எல்லை அறிவிப்பு தேவைப்படின்",
        "requirement": "Survey Notice Form acknowledgement by boundary neighbours during field inspection",
        "requirementTa": "நில அளவையர் கள ஆய்வின் போது அண்டை நில உரிமையாளர்களின் எல்லை ஏற்பு கையொப்பம்"
      }
    ],
    "prerequisites": [
      "Subdivision Survey Fee payment as per Government norms (Rural: ₹400 per sub-division; Urban: ₹800 per sub-division)",
      "Presence of applicant and boundary neighbours during scheduled surveyor field visit with boundary stones",
      "Registration Document Number and SRO details",
      "CAN Number"
    ],
    "prerequisitesTa": [
      "அரசு நில அளவைக் கட்டணம் செலுத்துதல் (கிராமப்புறம்: ₹400; நகர்ப்புறம்: ₹800)",
      "நில அளவையர் கள ஆய்வின் போது எல்லைக் கற்கள் அமைத்து நிலத்தில் நேரில் ஆஜராகுதல்",
      "பத்திர எண் மற்றும் சார்-பதிவக விபரம்",
      "இ-சேவை CAN எண்"
    ],
    "notesEn": "Revenue Surveyor inspects the land, marks new sub-division boundaries, prepares FMB sketch and Tahsildar issues separate e-Patta with new sub-division number.",
    "notesTa": "நில அளவையர் அளவீடு செய்து புதிய உட்பிரிவு வரைபடம் தயாரித்த பின் வட்டாட்சியரால் புதிய உட்பிரிவு எண்ணுடன் தனி e-பட்டா வழங்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nilam, Survey & Settlement Department",
    "officialPortalUrl": "https://www.tnesevai.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "LND-304",
    "category": "revenue_land_nilam",
    "department": "Revenue & Survey Department (Tamil Nilam)",
    "departmentTa": "வருவாய்த்துறை & நில அளவைத்துறை (தமிழ் நிலம்)",
    "nameEn": "FMB Sketch Download (Field Measurement Book)",
    "nameTa": "FMB புல வரைபடம் பதிவிறக்கம் (Field Measurement Book)",
    "descriptionEn": "Instant online retrieval and download of official digitized Field Measurement Book (FMB) map showing precise survey boundary lines, ladder dimensions and sub-divisions.",
    "descriptionTa": "சர்வே எண்ணின் துல்லியமான எல்லை அளவுகள், உட்பிரிவுகள் மற்றும் அளவீட்டுக் குறிப்புகளைக் காட்டும் அதிகாரப்பூர்வ FMB வரைபடத்தை உடனடியாக பதிவிறக்கும் சேவை.",
    "eligibilityEn": "Any citizen or landowner knowing district, taluk, village and survey number.",
    "eligibilityTa": "சர்வே எண் விபரம் வைத்துள்ள அனைத்து குடிமக்களும்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "District, Taluk, and Village name",
      "Survey Number and Sub-division Number"
    ],
    "prerequisitesTa": [
      "மாவட்டம், வட்டம் மற்றும் கிராமப் பெயர்",
      "சர்வே எண் மற்றும் உட்பிரிவு எண்"
    ],
    "notesEn": "Instant high-resolution PDF download of official digitized FMB map with surveyor ladder dimensions. No document uploads required.",
    "notesTa": "உடனடி FMB வரைபட பதிவிறக்கம். ஆவணப் பதிவேற்றம் எதுவும் தேவையில்லை. எல்லைப் பிரச்சனைகளைத் தீர்க்கவும் நிலப் பாதை கண்டறியவும் மிக அவசியம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nilam e-Services (eservices.tn.gov.in)",
    "officialPortalUrl": "https://eservices.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "LND-305",
    "category": "revenue_land_nilam",
    "department": "Revenue & Survey Department (Tamil Nilam)",
    "departmentTa": "வருவாய்த்துறை & நில அளவைத்துறை (தமிழ் நிலம்)",
    "nameEn": "TSLR Extract (Town Survey Land Register)",
    "nameTa": "TSLR நகர நில அளவைப் பதிவேடு நகல் (Town Survey Land Register)",
    "descriptionEn": "Download of official Town Survey Land Register (TSLR) extract for urban municipal and corporation areas certifying plot ownership, ward, block, and TS number.",
    "descriptionTa": "நகராட்சி மற்றும் மாநகராட்சி பகுதிகளில் உள்ள மனை மற்றும் கட்டிடங்களுக்கான அதிகாரப்பூர்வ TSLR நில உரிமைச் சான்றை பதிவிறக்கம் செய்யும் சேவை.",
    "eligibilityEn": "Property owners in urban municipal/corporation limits.",
    "eligibilityTa": "நகராட்சி மற்றும் மாநகராட்சி எல்லைக்குட்பட்ட பகுதிகளில் நிலம் வைத்துள்ள உரிமையாளர்கள்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "Municipality / Corporation Name",
      "Ward Number, Block Number",
      "Town Survey (TS) Number and Sub-division Number"
    ],
    "prerequisitesTa": [
      "நகராட்சி / மாநகராட்சியின் பெயர்",
      "வார்டு எண், பிளாக் எண்",
      "நகர நில அளவை (TS) எண் மற்றும் உட்பிரிவு எண்"
    ],
    "notesEn": "TSLR extract serves as urban equivalent of Patta in municipal towns and city corporations. Instant query download.",
    "notesTa": "நகர்ப்புறங்களில் பட்டாவிற்கு இணையான முதன்மை ஆவணம் TSLR ஆகும். உடனடி இணையவழி பதிவிறக்கம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nilam Urban e-Services (eservices.tn.gov.in)",
    "officialPortalUrl": "https://eservices.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "LND-306",
    "category": "revenue_land_nilam",
    "department": "Revenue & Survey Department (Tamil Nilam)",
    "departmentTa": "வருவாய்த்துறை & நில அளவைத்துறை (தமிழ் நிலம்)",
    "nameEn": "A-Register Extract Download",
    "nameTa": "அ-பதிவேடு நகல் பதிவிறக்கம் (A-Register Extract)",
    "descriptionEn": "Online extract of Village Settlement A-Register containing permanent land classification (Nanjai/Punjai/Poramboke), soil assessment rate, total extent, and original registered pattadar details.",
    "descriptionTa": "கிராம நிலங்களின் வகைப்பாடு (நன்செய்/புன்செய்/நத்தம்/அரசு புறம்போக்கு), மண் தரம், தீர்வை மற்றும் மூலப் பட்டாதாரர் விபரங்களைக் காட்டும் அதிகாரப்பூர்வ அ-பதிவேடு நகல்.",
    "eligibilityEn": "Any citizen verifying official village revenue land classification.",
    "eligibilityTa": "நில வகைப்பாடு மற்றும் அரசு நில விவரங்களை அறிய விரும்பும் அனைவரும்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "District, Taluk, and Village details",
      "Survey Number and Sub-division Number"
    ],
    "prerequisitesTa": [
      "மாவட்டம், வட்டம் மற்றும் கிராம விபரம்",
      "சர்வே எண் மற்றும் உட்பிரிவு எண்"
    ],
    "notesEn": "Essential document for property title legal opinion and verifying government poramboke / waterbody objections. Instant online extract.",
    "notesTa": "நிலத்தின் வகைப்பாடு மற்றும் நீர்நிலை புறம்போக்கு ஆட்சேபனைகளைச் சரிபார்க்க மிக அவசியமான ஆவணம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nilam e-Services (eservices.tn.gov.in)",
    "officialPortalUrl": "https://eservices.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "PDS-401",
    "category": "civil_supplies_pds",
    "department": "Civil Supplies & Consumer Protection Department (TNPDS)",
    "departmentTa": "உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை (TNPDS)",
    "nameEn": "New Smart Family Card Application",
    "nameTa": "புதிய ஸ்மார்ட் குடும்ப அட்டை விண்ணப்பம் (New Smart Card)",
    "descriptionEn": "Online application for issuance of new biometric NFC Smart Ration Card for newly formed or separated families in Tamil Nadu.",
    "descriptionTa": "புதிதாகத் திருமணமானவர்கள் அல்லது தனிக் குடும்பமாக பிரிந்தவர்களுக்கு புதிய டிஜிட்டல் ஸ்மார்ட் குடும்ப அட்டை வழங்கும் இணையவழி விண்ணப்பம்.",
    "eligibilityEn": "Newly married couples, families living separately, or residents moving to a new independent household in Tamil Nadu.",
    "eligibilityTa": "தமிழ்நாட்டில் தனிக்குடித்தனம் இருக்கும் அனைத்து குடும்பங்களும்.",
    "requiredDocuments": [
      "Aadhaar Cards of ALL family members to be included in the card (Mandatory)",
      "Residential Address Proof (LPG Gas Bill / Electricity Bill / Property Tax Receipt / Registered Rental Agreement)",
      "Name Deletion / Surrender Certificate from previous family card (for married members)",
      "Passport size color photograph of Head of Family (Female head preferred under NFSA)",
      "LPG Gas Connection Consumer Booking Receipt / Passbook copy (if gas cylinder exists)"
    ],
    "requiredDocumentsTa": [
      "அட்டையில் சேர்க்கப்பட வேண்டிய அனைத்து குடும்ப உறுப்பினர்களின் ஆதார் அட்டைகள்",
      "குடியிருப்பு முகவரி ஆதாரம் (கேஸ் பில் / மின் கட்டண ரசீது / சொத்துவரி / வாடகை ஒப்பந்தம்)",
      "பெற்றோர் குடும்ப அட்டையிலிருந்து பெயர் நீக்கம் செய்யப்பட்டதற்கான சான்றிதழ் (Deletion Certificate)",
      "குடும்பத் தலைவரின் பாஸ்போர்ட் அளவு வண்ணப் புகைப்படம்",
      "LPG கேஸ் இணைப்பு பாஸ்புக் / பதிவு ரசீது (கேஸ் இணைப்பு இருப்பின்)"
    ],
    "optionalDocuments": [
      "Marriage Certificate / Wedding Photo (for newly married couples)"
    ],
    "optionalDocumentsTa": [
      "திருமணப் பதிவுச் சான்றிதழ் / திருமண அழைப்பிதழ்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If migrating from another state in India",
        "conditionTa": "வெளி மாநிலத்திலிருந்து தமிழ்நாட்டிற்கு குடிபெயர்ந்திருந்தால்",
        "requirement": "Official Ration Card Surrender / Cancellation Certificate from parent state Civil Supplies department",
        "requirementTa": "முந்தைய மாநில உணவுப் பொருள் வழங்கல் துறையின் ரேஷன் கார்டு ரத்துச் சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "Head of Family must be an adult female member aged 18+ (NFSA statutory norm, unless family has no adult female)",
      "Active mobile number to receive TNPDS OTP and monthly ration SMS",
      "No member being added can already be present in another active smart card",
      "Government plastic card printing fee (₹20 paid during card delivery)"
    ],
    "prerequisitesTa": [
      "18 வயதுக்கு மேற்பட்ட பெண் குடும்பத் தலைவராக இருத்தல் வேண்டும் (NFSA விதிமுறை)",
      "OTP மற்றும் மாதாந்திர ரேஷன் விபரங்களைப் பெற செயல்பாட்டில் உள்ள மொபைல் எண்",
      "சேர்க்கப்படும் எந்த உறுப்பினரும் வேறு எந்த ரேஷன் கார்டிலும் இடம்பெற்றிருக்கக் கூடாது",
      "அரசு ஸ்மார்ட் கார்டு அச்சிடும் கட்டணம் ₹20"
    ],
    "notesEn": "Field inspection conducted by Supply Officer / TSO. Physical NFC smart card dispatched by Speed Post or collected from Taluk Supply Office.",
    "notesTa": "வட்ட வழங்கல் அலுவலர் (TSO) கள ஆய்வுக்குப் பின் புதிய ஸ்மார்ட் கார்டு தபாலில் அல்லது தாலுகா அலுவலகத்தில் வழங்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNPDS Public Portal (tnpds.gov.in)",
    "officialPortalUrl": "https://www.tnpds.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "PDS-402",
    "category": "civil_supplies_pds",
    "department": "Civil Supplies & Consumer Protection Department (TNPDS)",
    "departmentTa": "உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை (TNPDS)",
    "nameEn": "Add Family Member in Smart Card",
    "nameTa": "குடும்ப அட்டை உறுப்பினர் பெயர் சேர்த்தல் (Add Member)",
    "descriptionEn": "Online service to add newborn children, spouse after marriage, or other lawful dependent family members to an existing Smart Ration Card.",
    "descriptionTa": "தற்போதுள்ள ஸ்மார்ட் குடும்ப அட்டையில் புதிதாகப் பிறந்த குழந்தை அல்லது திருமணமான மருமகள்/குடும்ப உறுப்பினரின் பெயரைச் சேர்க்கும் சேவை.",
    "eligibilityEn": "Any active Smart Card holder having valid proof of relation and deletion certificate for the person being added.",
    "eligibilityTa": "செல்லுபடியாகும் ஸ்மார்ட் கார்டு வைத்துள்ள அனைத்து குடும்பத் தலைவர்களும்.",
    "requiredDocuments": [
      "Smart Ration Card Copy / 12-Digit Smart Card Number",
      "Aadhaar Card of the member to be added",
      "For Newborn Child (Age 0-5): Official Birth Certificate from Local Body / Municipality",
      "For Marriage / Adult Addition: Marriage Certificate / Wedding Card AND Name Deletion Certificate from previous family card"
    ],
    "requiredDocumentsTa": [
      "தற்போதுள்ள ஸ்மார்ட் ரேஷன் கார்டு நகல் / 12-இலக்க அட்டை எண்",
      "சேர்க்கப்பட வேண்டிய உறுப்பினரின் ஆதார் அட்டை",
      "பிறந்த குழந்தைகளுக்கு: நகராட்சி / உள்ளாட்சி வழங்கிய அதிகாரப்பூர்வ பிறப்புச் சான்றிதழ்",
      "திருமணமான உறுப்பினருக்கு: திருமணச் சான்றிதழ் & முந்தைய குடும்ப அட்டையிலிருந்து பெயர் நீக்கிய சான்று (Deletion Slip)"
    ],
    "optionalDocuments": [
      "Family Group Photograph"
    ],
    "optionalDocumentsTa": [
      "குடும்பப் புகைப்படம்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If member is aged above 5 years without Aadhaar",
        "conditionTa": "5 வயதுக்கு மேற்பட்ட நபர்களுக்கு ஆதார் இல்லையெனில்",
        "requirement": "Aadhaar Enrolment ID (EID) slip (Mandatory to seed Aadhaar within 90 days)",
        "requirementTa": "ஆதார் பதிவு ரசீது (EID Slip - 90 நாட்களுக்குள் ஆதார் எண் இணைத்தல் கட்டாயம்)"
      }
    ],
    "prerequisites": [
      "12-Digit Smart Card Number",
      "Registered mobile number for receiving OTP",
      "Member must be deleted from previous ration card before applying to add here"
    ],
    "prerequisitesTa": [
      "12-இலக்க ஸ்மார்ட் கார்டு எண்",
      "OTP பெற ரேஷன் கார்டில் பதிவு செய்யப்பட்ட மொபைல் எண்",
      "முந்தைய குடும்ப அட்டையில் பெயர் நீக்கம் செய்யப்பட்டிருப்பது கட்டாயம்"
    ],
    "notesEn": "Processed within 7-15 working days by the Taluk Supply Officer (TSO). Member is instantly updated in digital PDS database.",
    "notesTa": "வட்ட வழங்கல் அலுவலர் (TSO) ஆய்வுக்குப் பின் 7 முதல் 15 வேலை நாட்களில் பெயர் சேர்க்கப்பட்டு ரேஷன் பொருட்கள் பெறலாம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNPDS Public Portal (tnpds.gov.in)",
    "officialPortalUrl": "https://www.tnpds.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "PDS-403",
    "category": "civil_supplies_pds",
    "department": "Civil Supplies & Consumer Protection Department (TNPDS)",
    "departmentTa": "உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை (TNPDS)",
    "nameEn": "Remove / Delete Family Member from Smart Card",
    "nameTa": "குடும்ப அட்டை உறுப்பினர் பெயர் நீக்கம் (Remove Member)",
    "descriptionEn": "Online service to delete a member from smart family card due to marriage, separate household creation, death, or permanent migration, generating official Deletion / Surrender Certificate.",
    "descriptionTa": "திருமணம், தனிக் குடும்பமாக பிரிதல் அல்லது இறப்பு காரணமாக குடும்ப அட்டையிலிருந்து உறுப்பினரின் பெயரை நீக்கி அதிகாரப்பூர்வ நீக்கல் சான்றிதழ் பெறும் சேவை.",
    "eligibilityEn": "Head of family or family member requesting removal of self/dependent.",
    "eligibilityTa": "ஸ்மார்ட் குடும்ப அட்டை வைத்துள்ள குடும்பத் தலைவர்.",
    "requiredDocuments": [
      "Smart Ration Card Copy / Smart Card Number",
      "Aadhaar Card of the member to be deleted",
      "Reason Proof: For Marriage: Marriage Certificate / Wedding Invitation; For Death: Official Death Certificate; For Relocation: Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "ஸ்மார்ட் ரேஷன் கார்டு நகல் / 12-இலக்க அட்டை எண்",
      "நீக்கப்பட வேண்டிய நபரின் ஆதார் அட்டை",
      "காரணத்திற்கான ஆதாரம்: திருமணத்திற்கு - திருமணச் சான்றிதழ்/அழைப்பிதழ்; இறப்பிற்கு - இறப்புச் சான்றிதழ்; பிரிந்து செல்ல - சுய உறுதிமொழிப் படிவம்"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [
      {
        "condition": "If member removal is due to death",
        "conditionTa": "இறப்பு காரணமாக பெயர் நீக்கம் செய்யப்பட்டால்",
        "requirement": "Official Death Certificate from Municipality / Town Panchayat / Village Panchayat",
        "requirementTa": "உள்ளாட்சி அமைப்பு வழங்கிய அதிகாரப்பூர்வ இறப்புச் சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "12-Digit Smart Card Number",
      "Registered mobile number for OTP",
      "Generates official digital Deletion Certificate (சான்றிதழ்) required for adding in new card"
    ],
    "prerequisitesTa": [
      "12-இலக்க ஸ்மார்ட் கார்டு எண்",
      "OTP பெற பதிவு செய்யப்பட்ட மொபைல் எண்",
      "புதிய அட்டையில் பெயர் சேர்க்கத் தேவையான டிஜிட்டல் நீக்கல் சான்றிதழ் உடனடியாக கிடைக்கும்"
    ],
    "notesEn": "Instant digital Deletion Certificate is generated upon TSO approval, essential for new smart card application.",
    "notesTa": "TSO ஒப்புதலுக்குப் பின் அதிகாரப்பூர்வ டிஜிட்டல் பெயர் நீக்கல் சான்றிதழ் (Deletion Certificate) பதிவிறக்கம் செய்துகொள்ளலாம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNPDS Public Portal (tnpds.gov.in)",
    "officialPortalUrl": "https://www.tnpds.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "PDS-404",
    "category": "civil_supplies_pds",
    "department": "Civil Supplies & Consumer Protection Department (TNPDS)",
    "departmentTa": "உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை (TNPDS)",
    "nameEn": "Smart Card Address Change",
    "nameTa": "குடும்ப அட்டை முகவரி மாற்றம் (Address Change)",
    "descriptionEn": "Online service to update residential address and transfer Fair Price Shop (FPS / Ration Shop) allocation within the same district or across different districts in Tamil Nadu.",
    "descriptionTa": "வீடு மாறிய குடும்பங்களுக்கு ஸ்மார்ட் அட்டையில் முகவரியை மாற்றி, புதிய பகுதிக்குரிய நியாயவிலைக் கடையை (ரேஷன் கடை) ஒதுக்கீடு செய்யும் சேவை.",
    "eligibilityEn": "Families relocated to a new residence in Tamil Nadu.",
    "eligibilityTa": "தமிழ்நாட்டிற்குள் புதிய முகவரிக்கு குடிபெயர்ந்த குடும்பங்கள்.",
    "requiredDocuments": [
      "Smart Ration Card Copy / Smart Card Number",
      "New Residential Address Proof (Updated Aadhaar Card / Electricity Bill / LPG Gas Bill / Property Tax Receipt / Registered Rental Agreement)",
      "Aadhaar Card of Head of Family"
    ],
    "requiredDocumentsTa": [
      "ஸ்மார்ட் ரேஷன் கார்டு நகல் / 12-இலக்க அட்டை எண்",
      "புதிய முகவரி ஆதாரம் (புதிய முகவரியுள்ள ஆதார் / மின் கட்டண ரசீது / கேஸ் பில் / சொத்துவரி / பதிவு செய்த வாடகை ஒப்பந்தம்)",
      "குடும்பத் தலைவரின் ஆதார் அட்டை"
    ],
    "optionalDocuments": [
      "Bank Passbook with new address",
      "Voter ID with new address"
    ],
    "optionalDocumentsTa": [
      "புதிய முகவரியுடன் கூடிய வங்கி பாஸ்புக்",
      "வாக்காளர் அட்டை"
    ],
    "conditionalDocuments": [
      {
        "condition": "If shifting across Taluk or District boundaries",
        "conditionTa": "வேறு வட்டம் அல்லது மாவட்ட எல்லைக்கு மாறினால்",
        "requirement": "Automatic reallocation to the nearest Fair Price Shop (FPS) based on new pincode and street",
        "requirementTa": "புதிய அஞ்சல் குறியீடு மற்றும் தெரு விபரத்தின் அடிப்படையில் புதிய ரேஷன் கடை தானாக ஒதுக்கீடு செய்யப்படும்"
      }
    ],
    "prerequisites": [
      "12-Digit Smart Card Number",
      "Registered mobile number for OTP",
      "Complete new door number, street name, village/ward, and pincode"
    ],
    "prerequisitesTa": [
      "12-இலக்க ஸ்மார்ட் கார்டு எண்",
      "OTP பெற பதிவு செய்யப்பட்ட மொபைல் எண்",
      "புதிய கதவு எண், தெரு, கிராமம் மற்றும் அஞ்சல் குறியீட்டு விபரங்கள்"
    ],
    "notesEn": "Address updated and new ration shop mapped within 7-10 working days.",
    "notesTa": "7 முதல் 10 வேலை நாட்களில் புதிய முகவரி மாற்றப்பட்டு புதிய நியாயவிலைக் கடையில் ரேஷன் பொருட்களைப் பெறலாம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNPDS Public Portal (tnpds.gov.in)",
    "officialPortalUrl": "https://www.tnpds.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "PDS-405",
    "category": "civil_supplies_pds",
    "department": "Civil Supplies & Consumer Protection Department (TNPDS)",
    "departmentTa": "உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை (TNPDS)",
    "nameEn": "Change Head of Family in Smart Card",
    "nameTa": "குடும்பத் தலைவர் மாற்றம் (Change Head of Family)",
    "descriptionEn": "Online service to update the Head of Family (HoF) in smart ration card upon death of previous head, marital status change, or statutory female empowerment compliance.",
    "descriptionTa": "குடும்பத் தலைவர் மறைவு அல்லது குடும்ப சூழ்நிலை காரணமாக ஸ்மார்ட் குடும்ப அட்டையின் தலைவரை மாற்றம் செய்யும் சேவை.",
    "eligibilityEn": "Families modifying designated head of family among existing enrolled adult members.",
    "eligibilityTa": "குடும்ப அட்டையில் உள்ள தகுதியான உறுப்பினர்களில் ஒருவரை புதிய தலைவராக மாற்ற விரும்பும் குடும்பங்கள்.",
    "requiredDocuments": [
      "Smart Ration Card Copy / Smart Card Number",
      "Aadhaar Card of the Proposed New Head of Family (Female member aged 18+ preferred)",
      "Passport size color photograph of the New Head of Family",
      "Reason Proof: If previous head deceased: Death Certificate; If mutual change: Consent Letter signed by all adult members"
    ],
    "requiredDocumentsTa": [
      "ஸ்மார்ட் ரேஷன் கார்டு நகல் / 12-இலக்க அட்டை எண்",
      "புதிய குடும்பத் தலைவரின் ஆதார் அட்டை (18 வயதுக்கு மேற்பட்ட பெண் உறுப்பினர்)",
      "புதிய குடும்பத் தலைவரின் பாஸ்போர்ட் அளவு வண்ணப் புகைப்படம்",
      "காரண ஆதாரம்: முந்தைய தலைவர் மறைந்திருந்தால் - இறப்புச் சான்றிதழ்; பரஸ்பர மாற்றம் எனில் - குடும்ப உறுப்பினர்களின் சம்மதக் கடிதம்"
    ],
    "optionalDocuments": [
      "Legal Heir Certificate (if dispute resolution needed)"
    ],
    "optionalDocumentsTa": [
      "வாரிசுச் சான்றிதழ்"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "Proposed new head must already be an enrolled member in the smart card",
      "12-Digit Smart Card Number",
      "Registered mobile number for OTP"
    ],
    "prerequisitesTa": [
      "புதிய தலைவர் ஏற்கனவே அந்த ரேஷன் கார்டில் உறுப்பினராக இடம்பெற்றிருக்க வேண்டும்",
      "12-இலக்க ஸ்மார்ட் கார்டு எண்",
      "OTP பெற பதிவு செய்யப்பட்ட மொபைல் எண்"
    ],
    "notesEn": "Processed by the TSO. Name on front of physical card is updated in system immediately.",
    "notesTa": "TSO ஒப்புதலுக்குப் பின் கணினியில் குடும்பத் தலைவர் பெயர் மாற்றப்பட்டு புதிய அட்டை அச்சிடலாம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNPDS Public Portal (tnpds.gov.in)",
    "officialPortalUrl": "https://www.tnpds.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "PDS-406",
    "category": "civil_supplies_pds",
    "department": "Civil Supplies & Consumer Protection Department (TNPDS)",
    "departmentTa": "உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை (TNPDS)",
    "nameEn": "Card Type Modification (Sugar to Rice Card)",
    "nameTa": "அட்டை வகை மாற்றம் (சர்க்கரை அட்டை to அரிசி அட்டை)",
    "descriptionEn": "Online service to convert Sugar Option Card (NPHH-S) or Non-Commodity Card (NPHH-NC) to Rice Card (NPHH / PHH) for availing free rice, wheat, dal, and all monthly PDS commodities.",
    "descriptionTa": "சர்க்கரை அட்டை அல்லது பொருட்கள் இல்லா அட்டையை இலவச அரிசி உள்ளிட்ட அனைத்து ரேஷன் பொருட்களையும் பெறும் அரிசி குடும்ப அட்டையாக மாற்றும் சேவை.",
    "eligibilityEn": "Holders of NPHH-S (Sugar) or NPHH-NC cards wishing to receive full monthly food commodities.",
    "eligibilityTa": "அரிசி பெற விரும்பும் அனைத்து சர்க்கரை குடும்ப அட்டைதாரர்களும்.",
    "requiredDocuments": [
      "Smart Ration Card Copy / Smart Card Number",
      "Aadhaar Card of Head of Family",
      "Family Income Declaration / Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "ஸ்மார்ட் ரேஷன் கார்டு நகல் / 12-இலக்க அட்டை எண்",
      "குடும்பத் தலைவரின் ஆதார் அட்டை",
      "குடும்ப ஆண்டு வருமான உறுதிமொழிப் படிவம்"
    ],
    "optionalDocuments": [
      "VAO Income Verification Certificate"
    ],
    "optionalDocumentsTa": [
      "கிராம நிர்வாக அலுவலர் வருமானச் சான்று"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "12-Digit Smart Card Number",
      "Registered mobile number for OTP",
      "Card type change processed by District Supply Officer (DSO)"
    ],
    "prerequisitesTa": [
      "12-இலக்க ஸ்மார்ட் கார்டு எண்",
      "OTP பெற பதிவு செய்யப்பட்ட மொபைல் எண்",
      "மாவட்ட வழங்கல் அலுவலரால் (DSO) ஒப்புதல் அளிக்கப்படும்"
    ],
    "notesEn": "Converts card to Rice category, entitling family to free rice, sugar at ₹25/kg, toor dal at ₹30/kg, and palm oil at ₹25/packet.",
    "notesTa": "அரிசி அட்டையாக மாறியவுடன் இலவச அரிசி, மலிவு விலை பருப்பு, எண்ணெய் மற்றும் அனைத்துப் பொருட்களையும் நியாயவிலைக் கடையில் பெறலாம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNPDS Public Portal (tnpds.gov.in)",
    "officialPortalUrl": "https://www.tnpds.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "PDS-407",
    "category": "civil_supplies_pds",
    "department": "Civil Supplies & Consumer Protection Department (TNPDS)",
    "departmentTa": "உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை (TNPDS)",
    "nameEn": "LPG Gas Cylinder Count Modification",
    "nameTa": "கேஸ் சிலிண்டர் எண்ணிக்கை மாற்றம் (LPG Modification)",
    "descriptionEn": "Online registration or update of domestic LPG cylinder count (No cylinder / 1 cylinder / 2 cylinders) in Smart Ration Card ensuring correct kerosene entitlement.",
    "descriptionTa": "ஸ்மார்ட் குடும்ப அட்டையில் உள்ள சமையல் எரிவாயு சிலிண்டர் எண்ணிக்கையை (சிலிண்டர் இல்லை / 1 சிலிண்டர் / 2 சிலிண்டர்) பதிவு செய்து மண்ணெண்ணெய் அளவை முறைப்படுத்தும் சேவை.",
    "eligibilityEn": "Smart Card holders who have obtained a new gas connection, surrendered a cylinder, or have no gas connection.",
    "eligibilityTa": "புதிய கேஸ் இணைப்பு பெற்ற அல்லது சிலிண்டர் விவரங்களை புதுப்பிக்க விரும்பும் குடும்பங்கள்.",
    "requiredDocuments": [
      "Smart Ration Card Copy / Smart Card Number",
      "LPG Gas Consumer Passbook / Subscription Voucher (SV) / Cash Memo from Oil Company (Indane / Bharat / HP)",
      "Aadhaar Card of Head of Family"
    ],
    "requiredDocumentsTa": [
      "ஸ்மார்ட் ரேஷன் கார்டு நகல் / 12-இலக்க அட்டை எண்",
      "LPG கேஸ் இணைப்பு பாஸ்புக் / சந்தா ரசீது (SV) / கேஸ் பில் (இண்டேன் / பாரத் / ஹெச்பி)",
      "குடும்பத் தலைவரின் ஆதார் அட்டை"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [
      {
        "condition": "If gas connection is surrendered or disconnected",
        "conditionTa": "கேஸ் இணைப்பு ஒப்படைக்கப்பட்டிருந்தால்",
        "requirement": "Safe Custody / Surrender Voucher from Gas Distributor to restore kerosene entitlement",
        "requirementTa": "கேஸ் ஏஜென்சி வழங்கிய சிலிண்டர் ஒப்படைப்பு ரசீது (மண்ணெண்ணெய் ஒதுக்கீடு பெற)"
      }
    ],
    "prerequisites": [
      "17-Digit LPG Consumer ID (17-Digit LPG ID printed on gas passbook)",
      "12-Digit Smart Card Number",
      "Registered mobile number for OTP"
    ],
    "prerequisitesTa": [
      "17-இலக்க LPG நுகர்வோர் எண் (LPG ID)",
      "12-இலக்க ஸ்மார்ட் கார்டு எண்",
      "OTP பெற பதிவு செய்யப்பட்ட மொபைல் எண்"
    ],
    "notesEn": "Kerosene quota is determined based on LPG cylinder count (0 cylinders: 3-10 Litres; 1 cylinder: 3 Litres; 2 cylinders: Nil).",
    "notesTa": "சிலிண்டர் எண்ணிக்கைக்கு ஏற்ப மண்ணெண்ணெய் ஒதுக்கீடு கணினியில் தானாக மாறும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNPDS Public Portal (tnpds.gov.in)",
    "officialPortalUrl": "https://www.tnpds.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "PDS-408",
    "category": "civil_supplies_pds",
    "department": "Civil Supplies & Consumer Protection Department (TNPDS)",
    "departmentTa": "உணவுப்பொருள் வழங்கல் மற்றும் நுகர்வோர் பாதுகாப்புத்துறை (TNPDS)",
    "nameEn": "Duplicate Smart Card Reprint & Plastic Card Print",
    "nameTa": "மறு ஸ்மார்ட் கார்டு அச்சிடுதல் (Duplicate Smart Card Print)",
    "descriptionEn": "Request for reprinting and issuing a duplicate physical plastic NFC Smart Family Card in case of loss, damage, mutilation, or wear and tear of original card.",
    "descriptionTa": "குடும்ப அட்டை தொலைந்துபோனது அல்லது சேதமடைந்த நிலையில் புதிய பிளாஸ்டிக் NFC ஸ்மார்ட் கார்டை மறு அச்சிட்டுப் பெறும் சேவை.",
    "eligibilityEn": "Any Smart Card holder whose card is lost, damaged, stolen, or illegible.",
    "eligibilityTa": "ஸ்மார்ட் கார்டு தொலைந்த அல்லது பழுதான அனைத்து குடும்ப அட்டைதாரர்களும்.",
    "requiredDocuments": [
      "Aadhaar Card of Head of Family"
    ],
    "requiredDocumentsTa": [
      "குடும்பத் தலைவரின் ஆதார் அட்டை"
    ],
    "optionalDocuments": [
      "Old Damaged Smart Card Copy (if available)",
      "Lost Document Report (LDR) from Police if stolen"
    ],
    "optionalDocumentsTa": [
      "பழைய சேதமடைந்த கார்டின் நகல் (இருப்பின்)",
      "காவல்துறை LDR அறிக்கை (கார்டு திருடப்பட்டிருந்தால்)"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "Smart Ration Card Number (or Registered Mobile Number)",
      "Registered mobile number for OTP",
      "Statutory Government Plastic Card Printing Fee (₹20 paid to e-Sevai / TSO centre)"
    ],
    "prerequisitesTa": [
      "12-இலக்க ஸ்மார்ட் கார்டு எண் (அல்லது பதிவு செய்த மொபைல் எண்)",
      "OTP பெற பதிவு செய்யப்பட்ட மொபைல் எண்",
      "அரசு பிளாஸ்டிக் கார்டு அச்சிடும் கட்டணம் ₹20"
    ],
    "notesEn": "Physical NFC chip plastic Smart Card is printed instantly at e-Sevai centres or dispatched via Speed Post by Taluk Supply Office.",
    "notesTa": "இ-சேவை மையத்தில் உடனே புதிய பிளாஸ்டிக் ஸ்மார்ட் கார்டாக அச்சிட்டு பெற்றுக்கொள்ளலாம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNPDS Public Portal (tnpds.gov.in)",
    "officialPortalUrl": "https://www.tnpds.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-501",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL (Tamil Nadu Power Distribution Corporation)",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "Electricity Bill Payment (LT Consumer)",
    "nameTa": "மின் கட்டணம் ஆன்லைன் செலுத்துதல் (TNEB Bill Payment)",
    "descriptionEn": "Instant online verification of bi-monthly/monthly current consumption (CC) bill and secure digital payment for Low Tension (LT) domestic, commercial and agricultural service connections.",
    "descriptionTa": "வீட்டு மற்றும் வணிக மின் இணைப்புகளுக்கான நடப்பு மின்கட்டண தொகையை அறிந்து யுபிஐ / நெட் பேங்கிங் மூலம் உடனடியாக செலுத்தும் சேவை.",
    "eligibilityEn": "Any TANGEDCO / TNPDCL Low Tension (LT) electricity consumer.",
    "eligibilityTa": "அனைத்து மின் நுகர்வோர்களும்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "10 to 12 Digit TANGEDCO Consumer Service Connection Number (Section Code + Distribution + Consumer Number)",
      "Digital Payment Mode (UPI / Debit Card / Credit Card / Net Banking)"
    ],
    "prerequisitesTa": [
      "10 முதல் 12 இலக்க மின் இணைப்பு நுகர்வோர் எண்",
      "இணையவழி கட்டணம் செலுத்த UPI / டெபிட் கார்டு / நெட் பேங்கிங்"
    ],
    "notesEn": "Generates instant official TANGEDCO digital receipt with transaction reference ID. Avoids late payment penalty.",
    "notesTa": "பணம் செலுத்தியவுடன் உடனடி அதிகாரப்பூர்வ TNEB டிஜிட்டல் ரசீது பதிவிறக்கம் செய்துகொள்ளலாம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Online Payment Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-502",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "New LT Service Connection Application (Domestic / Commercial)",
    "nameTa": "புதிய மின் இணைப்பு விண்ணப்பம் (வீடு / வணிகம்)",
    "descriptionEn": "Online application for sanction and installation of new Low Tension (LT) single phase or three phase electricity connection for domestic houses, shops, commercial complexes and small industries.",
    "descriptionTa": "புதிய வீடுகள், கடைகள், வணிக வளாகங்கள் மற்றும் தொழிற்சாலைகளுக்கு புதிய மின் இணைப்பு பெறுவதற்கான அதிகாரப்பூர்வ இணையவழி விண்ணப்பம்.",
    "eligibilityEn": "Lawful owner or lawful occupier of premises requiring new electricity supply.",
    "eligibilityTa": "புதிய மின் இணைப்பு தேவைப்படும் சொத்து உரிமையாளர்கள் அல்லது வாடகைதாரர்கள்.",
    "requiredDocuments": [
      "Proof of Ownership of Premises (Registered Sale Deed / Patta Copy / Property Tax Receipt / Settlement Deed)",
      "Approved Building Plan / Sanctioned Layout from Local Body (DTCP / CMDA / Local Panchayat / Municipality)",
      "Wiring Completion & Test Certificate (Form 1 / Form 2) from Licensed Electrical Contractor",
      "Applicant Aadhaar Card & PAN Card",
      "Applicant Passport Size Photo"
    ],
    "requiredDocumentsTa": [
      "சொத்து உரிமை ஆதாரம் (கிரயப் பத்திரம் / பட்டா நகல் / சொத்துவரி ரசீது)",
      "உள்ளாட்சி அமைப்பால் அங்கீகரிக்கப்பட்ட கட்டிட வரைபடம் (DTCP / பஞ்சாயத்து அப்ரூவல்)",
      "அங்கீகரிக்கப்பட்ட எலக்ட்ரிக்கல் காண்ட்ராக்டர் வழங்கிய வயரிங் பரிசோதனை சான்றிதழ் (Test Report)",
      "விண்ணப்பதாரரின் ஆதார் அட்டை & பான் கார்டு",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Lease / Rental Agreement (if applied by lawful tenant with owner consent)"
    ],
    "optionalDocumentsTa": [
      "வாடகை ஒப்பந்தப் பத்திரம் (வாடகைதாரர் விண்ணப்பித்தால்)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If applicant is a tenant or lawful occupier (not owner)",
        "conditionTa": "கட்டிட உரிமையாளர் அல்லாத வாடகைதாரர் விண்ணப்பித்தால்",
        "requirement": "Owner Consent Letter (Form 5) and Indemnity Bond in ₹80 Non-Judicial Stamp Paper",
        "requirementTa": "வீட்டு உரிமையாளர் சம்மதக் கடிதம் (படிவம் 5) & ₹80 முத்திரைத்தாளில் உறுதிமொழிப் பத்திரம்"
      }
    ],
    "prerequisites": [
      "Premise full address with landmark and nearest TNEB distribution pole/pillar number",
      "Required connected load in KW / HP (e.g. 2KW, 5KW, 10KW) and phase requirement (1-Phase / 3-Phase)",
      "Initial Registration & Application Fee payment"
    ],
    "prerequisitesTa": [
      "கட்டிடத்தின் முழு முகவரி மற்றும் அருகில் உள்ள மின் கம்பத்தின் எண்",
      "தேவையான மின்பளு அளவு (KW / HP) மற்றும் பேஸ் விபரம் (சிங்கிள் பேஸ் / 3-பேஸ்)",
      "விண்ணப்பப் பதிவு கட்டணம் செலுத்துதல்"
    ],
    "notesEn": "Field inspection conducted by Assistant Engineer (AE/O&M). Estimation advice issued within 7 days. Meter energized upon payment of Development & Meter Caution Deposit.",
    "notesTa": "மின்வாரிய உதவிப் பொறியாளர் (AE) கள ஆய்வுக்குப் பின் மதிப்பீட்டுத் தொகை அறிவிக்கப்படும். கட்டணம் செலுத்திய பின் மீட்டர் பொருத்தப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Consumer Portal (nsc.tnebltd.gov.in)",
    "officialPortalUrl": "https://www.tnebltd.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-503",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "New LT Connection Estimation & Deposit Payment",
    "nameTa": "புதிய மின் இணைப்பு மதிப்பீட்டுக் கட்டணம் செலுத்துதல் (Estimation Payment)",
    "descriptionEn": "Online payment of TANGEDCO sanctioned Estimation Charges, Service Connection Charges, Meter Caution Deposit (MCD), and Development Charges for new LT connection.",
    "descriptionTa": "புதிய மின் இணைப்பு விண்ணப்பத்திற்கான மின்வாரிய மதிப்பீட்டுக் கட்டணம், மீட்டர் வைப்புத்தொகை மற்றும் வளர்ச்சிக் கட்டணங்களை ஆன்லைனில் செலுத்தும் சேவை.",
    "eligibilityEn": "Applicants who have received official Sanction Demand / Estimation Notice from TANGEDCO Assistant Engineer.",
    "eligibilityTa": "மின்வாரியத்திலிருந்து மதிப்பீட்டு அறிவிப்பு (Demand Notice) பெற்ற விண்ணப்பதாரர்கள்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "New Service Connection Application Reference Number",
      "Sanctioned Estimation Demand Notice details",
      "Online Payment Mode (UPI / Net Banking / Debit Card)"
    ],
    "prerequisitesTa": [
      "புதிய மின் இணைப்பு விண்ணப்ப பதிவு எண்",
      "மின்வாரியம் வழங்கிய மதிப்பீட்டுக் கட்டண அறிவிப்பு விபரம்",
      "இணையவழி கட்டணம் செலுத்தும் வசதி"
    ],
    "notesEn": "Payment receipt triggers work order to line staff for service pole erection and meter installation within statutory timelines.",
    "notesTa": "கட்டணம் செலுத்தியவுடன் பணி ஆணை பிறப்பிக்கப்பட்டு குறித்த காலத்தில் மின் இணைப்பு வழங்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-504",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "New Service Connection Status & Tracking Assistance",
    "nameTa": "மின் இணைப்பு விண்ணப்ப நிலை அறிதல் (Tracking Status)",
    "descriptionEn": "Real-time tracking of new electricity service connection application across AE inspection, estimation sanction, deposit payment, and meter installation stages.",
    "descriptionTa": "புதிய மின் இணைப்பு விண்ணப்பத்தின் தற்போதைய நிலையை (கள ஆய்வு, மதிப்பீடு, மீட்டர் பொருத்துதல்) ஆன்லைனில் கண்காணிக்கும் சேவை.",
    "eligibilityEn": "Any applicant who has submitted a new LT/HT connection application.",
    "eligibilityTa": "புதிய மின் இணைப்புக்கு விண்ணப்பித்துள்ள அனைத்து விண்ணப்பதாரர்களும்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "New Service Connection Application Reference Number",
      "Applicant Registered Mobile Number"
    ],
    "prerequisitesTa": [
      "விண்ணப்பப் பதிவு எண்",
      "விண்ணப்பதாரரின் பதிவு செய்த மொபைல் எண்"
    ],
    "notesEn": "Displays AE field visit date, demand notice issue date, and scheduled meter installation date. Instant online query.",
    "notesTa": "கள ஆய்வு மற்றும் மின் இணைப்பு வழங்கப்படும் தேதியை துல்லியமாக அறிந்துகொள்ளலாம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-505",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "EB Name Transfer / Ownership Change (LT Service)",
    "nameTa": "மின் இணைப்பு பெயர் மாற்றம் (EB Name Transfer)",
    "descriptionEn": "Online application for transferring electricity consumer service connection to the new property owner upon property purchase, partition, settlement, or inheritance.",
    "descriptionTa": "சொத்து கிரயம், பாகப்பிரிவினை அல்லது வாரிசுரிமை மூலம் சொத்து வாங்கிய புதிய உரிமையாளரின் பெயருக்கு மின் இணைப்பை பெயர் மாற்றம் செய்யும் அதிகாரப்பூர்வ விண்ணப்பம்.",
    "eligibilityEn": "New property owners who have acquired registered title deeds for the premise.",
    "eligibilityTa": "சொத்தின் புதிய உரிமையாளர்கள்.",
    "requiredDocuments": [
      "Registered Property Document (Sale Deed / Partition Deed / Gift Settlement Deed)",
      "Latest Property Tax Receipt / Municipal Tax Receipt in applicant name",
      "Latest Paid Current Consumption (CC) Bill Receipt (with zero arrears)",
      "Consent Letter from Previous Owner OR Indemnity Bond (Form 4) in ₹80 Non-Judicial Stamp Paper",
      "Applicant Aadhaar Card & Smart Ration Card"
    ],
    "requiredDocumentsTa": [
      "பதிவு செய்யப்பட்ட சொத்து ஆவணம் (கிரயப் பத்திரம் / பாகப்பிரிவினை / செட்டில்மெண்ட்)",
      "நடப்பு சொத்துவரி ரசீது (விண்ணப்பதாரர் பெயரில் அல்லது மூல உரிமையாளர் பெயரில்)",
      "நடப்பு மின்கட்டணம் செலுத்திய ரசீது (நிலுவைத்தொகை இன்றி)",
      "முந்தைய உரிமையாளரின் சம்மதக் கடிதம் அல்லது ₹80 முத்திரைத்தாளில் ஈட்டுறுதி ஆவணம் (Form 4)",
      "விண்ணப்பதாரரின் ஆதார் அட்டை & குடும்ப அட்டை"
    ],
    "optionalDocuments": [
      "Legal Heir Certificate & Death Certificate (if transfer due to death of previous owner)"
    ],
    "optionalDocumentsTa": [
      "வாரிசுச் சான்றிதழ் & இறப்புச் சான்றிதழ் (முந்தைய உரிமையாளர் இறந்திருந்தால்)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If previous owner is deceased or untraceable",
        "conditionTa": "முந்தைய உரிமையாளர் இறந்துவிட்டாலோ அல்லது சம்மதக் கடிதம் பெற இயலாவிட்டாலோ",
        "requirement": "Form 4 Indemnity Bond on ₹80 Stamp Paper with Legal Heir / Ownership proof",
        "requirementTa": "₹80 முத்திரைத்தாளில் ஈட்டுறுதி ஆவணம் (Indemnity Bond) மற்றும் வாரிசு/உரிமை சான்று"
      }
    ],
    "prerequisites": [
      "TNEB Consumer Service Connection Number",
      "Distribution Section Office (AE/O&M) jurisdiction",
      "Name Transfer Government Fee payment (₹60 to ₹300 based on contracted load)",
      "Zero outstanding electricity arrears on the service number"
    ],
    "prerequisitesTa": [
      "மின் இணைப்பு நுகர்வோர் எண்",
      "சம்பந்தப்பட்ட மின்வாரிய பிரிவு அலுவலகம் (AE Office)",
      "அரசு பெயர் மாற்றக் கட்டணம் செலுத்துதல்",
      "மின் இணைப்பில் எந்தவித நிலுவைத் தொகையும் இல்லாதிருத்தல்"
    ],
    "notesEn": "Processed by the Assistant Engineer (AE/O&M). Consumer name in TANGEDCO database and online billing is updated within 7 working days.",
    "notesTa": "AE கள ஆய்வுக்குப் பின் 7 வேலை நாட்களில் மின்வாரியப் பதிவேடுகளில் புதிய பெயர் மாற்றப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-506",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "Tariff Change Application (Domestic to Commercial / Vice Versa)",
    "nameTa": "மின்கட்டண விகிதம் மாற்றம் (Tariff Change Application)",
    "descriptionEn": "Application for changing electricity tariff classification between Domestic (Tariff 1A), Commercial (Tariff 5), Industrial (Tariff 3), or Educational/Institutional categories.",
    "descriptionTa": "வீட்டு மின்கட்டண விகிதத்திலிருந்து (Tariff 1A) வணிக மின்கட்டண விகிதத்திற்கோ (Tariff 5) அல்லது வணிகத்திலிருந்து வீட்டிற்கோ மாற்றும் விண்ணப்பம்.",
    "eligibilityEn": "Consumers whose premise usage pattern has changed from residential to commercial or vice versa.",
    "eligibilityTa": "கட்டிடத்தின் பயன்பாட்டை மாற்றியுள்ள அனைத்து மின் நுகர்வோர்களும்.",
    "requiredDocuments": [
      "Latest Paid Electricity Bill Receipt",
      "Applicant Aadhaar Card & Property Tax Receipt",
      "Proof of Changed Usage (Trade Licence / FSSAI / GST / Rental Agreement for commercial; Residential conversion proof for domestic)"
    ],
    "requiredDocumentsTa": [
      "நடப்பு மின்கட்டணம் செலுத்திய ரசீது",
      "விண்ணப்பதாரரின் ஆதார் அட்டை & சொத்துவரி ரசீது",
      "மாற்றப்பட்ட பயன்பாட்டிற்கான ஆதாரம் (தொழில் உரிமம் / GST / கடை வாடகை ஒப்பந்தம்)"
    ],
    "optionalDocuments": [
      "Revised Wiring Test Report from Licensed Electrical Contractor"
    ],
    "optionalDocumentsTa": [
      "திருத்தப்பட்ட மின் வயரிங் பரிசோதனை அறிக்கை"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "Consumer Service Connection Number",
      "Current tariff code and requested revised tariff category",
      "Inspection by TANGEDCO Section Officer"
    ],
    "prerequisitesTa": [
      "மின் இணைப்பு நுகர்வோர் எண்",
      "தற்போதைய மின்கட்டண பிரிவு மற்றும் மாற்றப்பட வேண்டிய புதிய பிரிவு",
      "மின்வாரிய கள ஆய்வு"
    ],
    "notesEn": "AE inspects premise to verify actual end-use. Tariff is updated in the computerized billing system from the next billing cycle.",
    "notesTa": "AE கள ஆய்வுக்குப் பின் அடுத்த பில்லிங் சுழற்சியில் இருந்து புதிய கட்டண விகிதம் அமலுக்கு வரும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-507",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "Additional Load Application",
    "nameTa": "கூடுதல் மின்பளு விண்ணப்பம் (Additional Load)",
    "descriptionEn": "Application for enhancing sanctioned connected load (e.g. from 2KW to 5KW or 10KW) due to installation of air conditioners, heavy machinery, or building expansion.",
    "descriptionTa": "புதிய ஏசி, மோட்டார் அல்லது கூடுதல் உபகரணங்கள் காரணமாக அனுமதிக்கப்பட்ட மின்பளுவை (KW/HP) அதிகரிக்கும் விண்ணப்பம்.",
    "eligibilityEn": "Consumers requiring increased sanctioned load to prevent meter tripping and low voltage issues.",
    "eligibilityTa": "கூடுதல் மின்பளு தேவைப்படும் நுகர்வோர்கள்.",
    "requiredDocuments": [
      "Latest Paid Electricity Bill Receipt",
      "Wiring Test Report for Enhanced Load from Licensed Electrical Contractor",
      "Applicant Aadhaar Card & Property Tax Receipt"
    ],
    "requiredDocumentsTa": [
      "நடப்பு மின்கட்டணம் செலுத்திய ரசீது",
      "கூடுதல் மின்சுமைக்கான வயரிங் பரிசோதனை அறிக்கை (Contractor Test Report)",
      "விண்ணப்பதாரரின் ஆதார் அட்டை & சொத்துவரி ரசீது"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [
      {
        "condition": "If total load exceeds 4 KW in single phase",
        "conditionTa": "மொத்த மின்பளு 4 KW-க்கு மேல் அதிகரித்தால்",
        "requirement": "Mandatory Conversion to Three Phase (3-Phase) connection and separate 3-phase meter installation",
        "requirementTa": "கட்டாய 3-பேஸ் (Three Phase) மாற்றத்திற்கான விண்ணப்பம்"
      }
    ],
    "prerequisites": [
      "Consumer Service Connection Number",
      "Existing sanctioned load in KW and additional required load in KW",
      "Payment of Additional Development Charges & Meter Caution Deposit (MCD)"
    ],
    "prerequisitesTa": [
      "மின் இணைப்பு நுகர்வோர் எண்",
      "தற்போதுள்ள மின்பளு மற்றும் கூடுதலாக தேவைப்படும் மின்பளு (KW அளவில்)",
      "கூடுதல் வளர்ச்சிக் கட்டணம் மற்றும் வைப்புத்தொகை செலுத்துதல்"
    ],
    "notesEn": "Sanctioned load updated in records and adequate fuse gear/meter capacity verified by TANGEDCO.",
    "notesTa": "மின்வாரிய கள ஆய்வுக்குப் பின் கூடுதல் மின்பளு கணினியில் பதிவு செய்யப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-508",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "Load Reduction Application",
    "nameTa": "மின்பளு குறைப்பு விண்ணப்பம் (Load Reduction)",
    "descriptionEn": "Application for reducing sanctioned connected load when heavy machinery is decommissioned or premise power requirement decreases, reducing fixed monthly demand charges.",
    "descriptionTa": "தேவை குறைந்துவிட்ட போது அனுமதிக்கப்பட்ட மின்பளுவை குறைத்து மாதந்திர நிலைக்கட்டணத்தை சேமிக்கும் விண்ணப்பம்.",
    "eligibilityEn": "Consumers wishing to formally downsize sanctioned load.",
    "eligibilityTa": "அனுமதிக்கப்பட்ட மின்பளுவைக் குறைக்க விரும்பும் நுகர்வோர்கள்.",
    "requiredDocuments": [
      "Latest Paid Electricity Bill Receipt",
      "Self-Declaration / Reason letter explaining reduction of electrical appliances/machinery",
      "Applicant Aadhaar Card"
    ],
    "requiredDocumentsTa": [
      "நடப்பு மின்கட்டணம் செலுத்திய ரசீது",
      "மின் உபகரணங்கள் குறைக்கப்பட்டதற்கான சுய உறுதிமொழி / கடிதம்",
      "விண்ணப்பதாரரின் ஆதார் அட்டை"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "Consumer Service Connection Number",
      "Existing load and requested reduced load in KW",
      "No outstanding bill arrears"
    ],
    "prerequisitesTa": [
      "மின் இணைப்பு நுகர்வோர் எண்",
      "தற்போதைய மின்பளு மற்றும் குறைக்கப்பட வேண்டிய புதிய அளவு",
      "எந்தவித கட்டண நிலுவையும் இல்லாதிருத்தல்"
    ],
    "notesEn": "AE inspects premise and ratifies connected load reduction.",
    "notesTa": "AE கள ஆய்வுக்குப் பின் அனுமதிக்கப்பட்ட மின்சுமை குறைக்கப்பட்டு நிலைக்கட்டணம் குறையும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-509",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "Single Phase to Three Phase Conversion",
    "nameTa": "சிங்கிள் பேஸ் to 3-பேஸ் மின் இணைப்பு மாற்றம் (1-Phase to 3-Phase)",
    "descriptionEn": "Application for upgrading existing single phase 230V connection to three phase 415V supply for heavy electrical loads, multiple AC units, commercial chillers, and borewell motors.",
    "descriptionTa": "அதிக மின்பளு கொண்ட உபகரணங்கள், ஏசி, மோட்டார் இயக்க சிங்கிள் பேஸ் மின் இணைப்பை 3-பேஸ் இணைப்பாக தரம் உயர்த்தும் விண்ணப்பம்.",
    "eligibilityEn": "Consumers requiring balanced 3-phase 415V power supply for total load exceeding 4 KW.",
    "eligibilityTa": "3-பேஸ் மின்சாரம் தேவைப்படும் நுகர்வோர்கள்.",
    "requiredDocuments": [
      "Latest Paid Electricity Bill Receipt",
      "3-Phase Internal Wiring Completion Certificate from Licensed Electrical Contractor",
      "Applicant Aadhaar Card & Property Tax Receipt"
    ],
    "requiredDocumentsTa": [
      "நடப்பு மின்கட்டணம் செலுத்திய ரசீது",
      "அங்கீகரிக்கப்பட்ட எலக்ட்ரிக்கல் காண்ட்ராக்டரின் 3-பேஸ் வயரிங் பரிசோதனை சான்றிதழ்",
      "விண்ணப்பதாரரின் ஆதார் அட்டை & சொத்துவரி ரசீது"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "Consumer Service Connection Number",
      "Payment of 3-Phase Service Connection Charges, Meter Caution Deposit, and Development Charges",
      "Provision of 3-phase main distribution board and earthing pit on premise"
    ],
    "prerequisitesTa": [
      "மின் இணைப்பு நுகர்வோர் எண்",
      "3-பேஸ் இணைப்பு கட்டணம் மற்றும் வைப்புத்தொகை செலுத்துதல்",
      "கட்டிடத்தில் 3-பேஸ் மெயின் போர்டு மற்றும் எர்த்திங் (Earthing) வசதி அமைத்தல்"
    ],
    "notesEn": "TANGEDCO installs static 3-phase electronic digital meter and energizes all 3 phases after wiring inspection.",
    "notesTa": "AE வயரிங் ஆய்வுக்குப் பின் புதிய 3-பேஸ் டிஜிட்டல் மீட்டர் பொருத்தப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-510",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "Shifting of Service Connection / Meter Shifting",
    "nameTa": "மின் இணைப்பு / மீட்டர் இடமாற்றம் (Service Shifting)",
    "descriptionEn": "Application for shifting electricity meter within the same building premise during renovation or shifting entire service connection to an adjacent building property.",
    "descriptionTa": "கட்டிட புனரமைப்பு காரணமாக மீட்டரை வேறு இடத்திற்கு மாற்ற அல்லது அருகில் உள்ள கட்டிடத்திற்கு மின் இணைப்பை இடமாற்றம் செய்யும் விண்ணப்பம்.",
    "eligibilityEn": "Property owners carrying out construction, renovation or premise alteration.",
    "eligibilityTa": "மீட்டரை இடமாற்றம் செய்ய விரும்பும் உரிமையாளர்கள்.",
    "requiredDocuments": [
      "Latest Paid Electricity Bill Receipt",
      "Property Ownership Document of the premise",
      "Contractor Wiring Test Report for new meter board location",
      "Applicant Aadhaar Card"
    ],
    "requiredDocumentsTa": [
      "நடப்பு மின்கட்டணம் செலுத்திய ரசீது",
      "சொத்து உரிமை ஆவணம்",
      "புதிய மீட்டர் பலகைக்கான வயரிங் பரிசோதனை அறிக்கை",
      "விண்ணப்பதாரரின் ஆதார் அட்டை"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [
      {
        "condition": "If shifting across separate property boundaries",
        "conditionTa": "வேறு இடத்திற்கு இடமாற்றம் செய்யப்பட்டால்",
        "requirement": "Field Feasibility & Technical Feasibility Report from Assistant Engineer",
        "requirementTa": "உதவிப் பொறியாளரின் கள ஆய்வு மற்றும் சாத்தியக்கூறு அறிக்கை"
      }
    ],
    "prerequisites": [
      "Consumer Service Connection Number",
      "Shifting fee payment as per TANGEDCO estimate",
      "Readiness of new weatherproof meter board at shifted location"
    ],
    "prerequisitesTa": [
      "மின் இணைப்பு நுகர்வோர் எண்",
      "மின்வாரிய இடமாற்ற மதிப்பீட்டுக் கட்டணம் செலுத்துதல்",
      "புதிய இடத்தில் மீட்டர் பலகை தயார் நிலையில் இருத்தல்"
    ],
    "notesEn": "TANGEDCO line staff relocates service wire, pole connection, and meter to the new sanctioned spot.",
    "notesTa": "கட்டணம் செலுத்திய பின் மின்வாரிய ஊழியர்களால் மீட்டர் புதிய இடத்திற்கு மாற்றப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-511",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "Temporary Supply Connection Application",
    "nameTa": "தற்காலிக மின் இணைப்பு விண்ணப்பம் (Temporary Supply)",
    "descriptionEn": "Application for sanctioning temporary electricity supply for building construction, public exhibitions, festival illumination, circuses, and short-term commercial projects.",
    "descriptionTa": "கட்டிடக் கட்டுமானம், திருவிழாக்கள், கண்காட்சிகள் மற்றும் குறுகிய கால பயன்பாட்டிற்கு தற்காலிக மின் இணைப்பு பெறும் விண்ணப்பம்.",
    "eligibilityEn": "Contractors, organizers, or builders requiring temporary electricity for a defined duration (up to 1 year).",
    "eligibilityTa": "தற்காலிக மின்சாரம் தேவைப்படும் ஒப்பந்ததாரர்கள் மற்றும் பொதுமக்கள்.",
    "requiredDocuments": [
      "Ownership Document / Lease Agreement / Local Body Permission for event or construction",
      "Contractor Wiring Safety Test Report",
      "Applicant Aadhaar Card & PAN Card"
    ],
    "requiredDocumentsTa": [
      "சொத்து ஆவணம் அல்லது திருவிழா/நிகழ்ச்சிக்கான உள்ளாட்சி அனுமதி கடிதம்",
      "வயரிங் பாதுகாப்பு பரிசோதனை சான்றிதழ்",
      "விண்ணப்பதாரரின் ஆதார் அட்டை & பான் கார்டு"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "Exact duration required (Days / Months)",
      "Required connected load in KW",
      "Payment of Temporary Supply Advance Consumption Deposit (ACD) & service charges (Tariff 6)"
    ],
    "prerequisitesTa": [
      "தேவையான கால அளவு (நாட்கள் / மாதங்கள்)",
      "தேவையான மின்சுமை (KW)",
      "தற்காலிக கட்டண விகிதத்திற்கான முன்பணம் மற்றும் வளர்ச்சிக் கட்டணம்"
    ],
    "notesEn": "Billed under Tariff 6 (Temporary supply rate). Disconnected automatically upon expiry of sanctioned period or converted to permanent supply upon completion.",
    "notesTa": "குறிப்பிட்ட காலம் முடிந்ததும் இணைப்பு துண்டிக்கப்படும் அல்லது நிரந்தர இணைப்பாக மாற்றப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-512",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "Meter Related Services & Testing Request",
    "nameTa": "மீட்டர் பரிசோதனை & சேவை கோரிக்கை (Meter Testing Request)",
    "descriptionEn": "Official request to test an electricity meter suspected of recording abnormally high consumption, sluggish reading, or creeping defects in accredited TANGEDCO laboratory.",
    "descriptionTa": "மின்கட்டணம் வழக்கத்திற்கு மாறாக அதிகமாக வரும்போது மீட்டரின் துல்லியத்தை லேப் டெஸ்ட் மூலம் பரிசோதிக்கக் கோரும் விண்ணப்பம்.",
    "eligibilityEn": "Any consumer disputing accuracy of existing electricity meter.",
    "eligibilityTa": "மீட்டர் மீது சந்தேகம் உள்ள அனைத்து நுகர்வோர்களும்.",
    "requiredDocuments": [
      "Latest Paid Electricity Bill Receipt",
      "Applicant Aadhaar Card"
    ],
    "requiredDocumentsTa": [
      "நடப்பு மின்கட்டணம் செலுத்திய ரசீது",
      "விண்ணப்பதாரரின் ஆதார் அட்டை"
    ],
    "optionalDocuments": [
      "Previous 6 months bill payment history showing sudden anomaly"
    ],
    "optionalDocumentsTa": [
      "கடைசி 6 மாத பில் விவரம்"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "Consumer Service Connection Number",
      "Meter Serial Number",
      "Statutory Meter Testing Fee payment (₹100 for 1-Phase / ₹300 for 3-Phase)"
    ],
    "prerequisitesTa": [
      "மின் இணைப்பு நுகர்வோர் எண்",
      "மீட்டர் எண்",
      "அரசு மீட்டர் பரிசோதனைக் கட்டணம் செலுத்துதல்"
    ],
    "notesEn": "If meter is found defective (>3% fast), testing fee is refunded and excess billed amount is adjusted in subsequent electricity bills.",
    "notesTa": "பரிசோதனையில் மீட்டரில் பிழை இருப்பது உறுதியானால் பரிசோதனைக் கட்டணம் திருப்பித் தரப்பட்டு அதிகப்படியான பில் தொகை அடுத்த பில்லில் சரிக்கட்டப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-513",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "Defective / Burnt / Stuck Meter Replacement",
    "nameTa": "பழுதான / எரிந்த மீட்டர் மாற்றுதல் (Defective Meter Replacement)",
    "descriptionEn": "Request for immediate replacement of a burnt, broken glass, stuck digital display, or lightning-damaged electricity meter restoring accurate billing.",
    "descriptionTa": "தீ விபத்து, இடி மின்னல் அல்லது பழுது காரணமாக செயல்படாத மீட்டரை மாற்றி புதிய டிஜிட்டல் மீட்டர் பொருத்தக் கோரும் சேவை.",
    "eligibilityEn": "Consumers whose electricity meter is defective, blank, or burnt.",
    "eligibilityTa": "மீட்டர் பழுதான அனைத்து நுகர்வோர்களும்.",
    "requiredDocuments": [
      "Latest Electricity Bill Copy",
      "Applicant Aadhaar Card"
    ],
    "requiredDocumentsTa": [
      "கடைசி மின்கட்டண ரசீது",
      "விண்ணப்பதாரரின் ஆதார் அட்டை"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [
      {
        "condition": "If meter burnt due to consumer internal short circuit",
        "conditionTa": "உள் வயரிங் கோளாறால் மீட்டர் எரிந்திருந்தால்",
        "requirement": "Meter cost replacement fee payment advice from Assistant Engineer",
        "requirementTa": "மின்வாரியம் நிர்ணயிக்கும் மீட்டர் ஈட்டுத்தொகை செலுத்துதல்"
      }
    ],
    "prerequisites": [
      "Consumer Service Connection Number",
      "Inspection by TANGEDCO Assessor / Section Staff"
    ],
    "prerequisitesTa": [
      "மின் இணைப்பு நுகர்வோர் எண்",
      "கணக்கீட்டாளர் / மின்வாரிய கள ஆய்வு"
    ],
    "notesEn": "New electronic digital static meter installed within 7 working days. Average billing applied for defective period as per TNERC code.",
    "notesTa": "7 நாட்களுக்குள் புதிய மீட்டர் பொருத்தப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-514",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "Reconnection of Disconnected Service",
    "nameTa": "துண்டிக்கப்பட்ட மின் இணைப்பு மீண்டும் பெறுதல் (EB Reconnection)",
    "descriptionEn": "Application for restoration of electricity supply disconnected due to non-payment of CC charges upon full clearance of outstanding dues and reconnection fee.",
    "descriptionTa": "கட்டணம் செலுத்தாததால் துண்டிக்கப்பட்ட மின் இணைப்பிற்கு நிலுவைத் தொகையை முழுமையாக செலுத்தி மீண்டும் மின்சாரத்தைப் பெறும் சேவை.",
    "eligibilityEn": "Consumers whose service was temporarily disconnected for bill default within 6 months.",
    "eligibilityTa": "மின் இணைப்பு துண்டிக்கப்பட்ட நுகர்வோர்கள்.",
    "requiredDocuments": [
      "Proof of full payment of all outstanding electricity bill arrears",
      "Applicant Aadhaar Card"
    ],
    "requiredDocumentsTa": [
      "அனைத்து நிலுவைத் தொகைகளும் முழுமையாக செலுத்தியதற்கான ரசீது",
      "விண்ணப்பதாரரின் ஆதார் அட்டை"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "Consumer Service Connection Number",
      "Payment of Reconnection Fee (₹60 for 1-Phase / ₹120 for 3-Phase)",
      "Service must not have been permanently dismantled (>6 months)"
    ],
    "prerequisitesTa": [
      "மின் இணைப்பு நுகர்வோர் எண்",
      "மறு இணைப்புக் கட்டணம் செலுத்துதல் (சிங்கிள் பேஸ்: ₹60; 3-பேஸ்: ₹120)",
      "துண்டிக்கப்பட்டு 6 மாதங்களுக்குள் இருத்தல் வேண்டும்"
    ],
    "notesEn": "Power supply is reconnected within 24 hours of payment of arrears and reconnection fee.",
    "notesTa": "கட்டணம் செலுத்திய 24 மணி நேரத்திற்குள் மின் இணைப்பு மீண்டும் வழங்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-515",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "Permanent Disconnection & Surrender of Service",
    "nameTa": "மின் இணைப்பு நிரந்தர துண்டிப்பு & ஒப்படைத்தல் (Permanent Disconnection)",
    "descriptionEn": "Application for voluntary permanent surrender and dismantling of electricity connection upon building demolition, property merger, or permanent closure.",
    "descriptionTa": "கட்டிடம் இடித்தல் அல்லது பயன்பாடு முடிவடைந்த நிலையில் மின் இணைப்பை நிரந்தரமாக ஒப்படைத்து மீட்டர் காப்புத்தொகையை திரும்பப் பெறும் விண்ணப்பம்.",
    "eligibilityEn": "Registered property owner surrendering electricity service.",
    "eligibilityTa": "மின் இணைப்பை ஒப்படைக்க விரும்பும் சொத்து உரிமையாளர்கள்.",
    "requiredDocuments": [
      "Latest Paid Bill Receipt with Zero Arrears",
      "Ownership Document / Demolition Sanction Copy",
      "Applicant Aadhaar Card",
      "Surrender Application Form"
    ],
    "requiredDocumentsTa": [
      "நிலுவைத்தொகை ஏதுமில்லை என்ற நடப்பு மின்கட்டண ரசீது",
      "சொத்து உரிமை ஆவணம் / கட்டிடம் இடிப்பு அனுமதி",
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "மின் இணைப்பு ஒப்படைப்பு படிவம்"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "Consumer Service Connection Number",
      "Final meter reading clearance by Section Officer",
      "Bank account details for refund of initial security deposit"
    ],
    "prerequisitesTa": [
      "மின் இணைப்பு நுகர்வோர் எண்",
      "இறுதி மீட்டர் கணக்கீடு செய்தல்",
      "வைப்புத்தொகை திரும்பப் பெற வங்கிக் கணக்கு விபரம்"
    ],
    "notesEn": "Meter and service line removed by TANGEDCO. Initial security deposit balance refunded to consumer bank account.",
    "notesTa": "மீட்டர் அகற்றப்பட்டு பாதுகாப்பு வைப்புத்தொகை நுகர்வோர் வங்கிக் கணக்கிற்கு திருப்பி அனுப்பப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-516",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "Billing Grievance & Bill Correction Assistance",
    "nameTa": "மின்கட்டண குறைதீர்ப்பு & திருத்தம் (Billing Grievance)",
    "descriptionEn": "Online grievance registration for rectification of wrong meter reading entry, incorrect tariff computation, missing subsidy units, or double payment deduplication.",
    "descriptionTa": "தவறான மீட்டர் ரீடிங், கூடுதல் கட்டணம் அல்லது 100 யூனிட் இலவச மின்சார மானியம் விடுபட்டது குறித்த புகார் பதிவு மற்றும் திருத்த சேவை.",
    "eligibilityEn": "Any consumer disputing a specific electricity bill calculation.",
    "eligibilityTa": "பில் தொகையில் முரண்பாடு உள்ள அனைத்து நுகர்வோர்களும்.",
    "requiredDocuments": [
      "Disputed Electricity Bill Copy",
      "Previous 3 Paid Bill Receipts / Payment History",
      "Applicant Aadhaar Card"
    ],
    "requiredDocumentsTa": [
      "முரண்பாடு உள்ள தற்போதைய மின்கட்டண ரசீது",
      "முந்தைய 3 மின்கட்டண ரசீதுகள்",
      "விண்ணப்பதாரரின் ஆதார் அட்டை"
    ],
    "optionalDocuments": [
      "Photo of Current Meter Digital Display showing reading"
    ],
    "optionalDocumentsTa": [
      "தற்போதைய மீட்டர் ரீடிங் புகைப்படம்"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "Consumer Service Connection Number",
      "Exact meter reading displayed currently on meter glass"
    ],
    "prerequisitesTa": [
      "மின் இணைப்பு நுகர்வோர் எண்",
      "மீட்டரில் தற்போது உள்ள துல்லியமான ரீடிங் அளவு"
    ],
    "notesEn": "Investigated by Accounts Officer / AE. Corrected assessment order generated within 5 working days.",
    "notesTa": "கணக்கு அலுவலர் ஆய்வுக்குப் பின் பில் திருத்தம் செய்யப்பட்டு கூடுதல் தொகை சரிசெய்யப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Consumer Grievance Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-517",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "Service Line / Damaged Cable Replacement Application",
    "nameTa": "சேதமடைந்த மின் கம்பி / சர்வீஸ் வயர் மாற்றுதல் (Cable Replacement)",
    "descriptionEn": "Request for replacement of worn out, sagging, tree-damaged, or hazardous overhead aerial service wire between TNEB distribution pole and consumer meter box.",
    "descriptionTa": "மின்கம்பத்திற்கும் வீட்டிற்கும் இடையே உள்ள சேதமடைந்த அல்லது அறுந்து விழும் நிலையில் உள்ள சர்வீஸ் மின் கம்பியை மாற்றி புதிய கம்பி அமைக்கக் கோரும் சேவை.",
    "eligibilityEn": "Consumers experiencing low voltage, spark hazards, or snapping overhead service lines.",
    "eligibilityTa": "சர்வீஸ் வயர் பழுதான அனைத்து நுகர்வோர்களும்.",
    "requiredDocuments": [
      "Latest Paid Electricity Bill Receipt",
      "Applicant Aadhaar Card"
    ],
    "requiredDocumentsTa": [
      "நடப்பு மின்கட்டணம் செலுத்திய ரசீது",
      "விண்ணப்பதாரரின் ஆதார் அட்டை"
    ],
    "optionalDocuments": [
      "Photo of Damaged / Sagging Service Cable"
    ],
    "optionalDocumentsTa": [
      "சேதமடைந்த மின் கம்பியின் புகைப்படம்"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "Consumer Service Connection Number",
      "Exact pole number and physical defect description"
    ],
    "prerequisitesTa": [
      "மின் இணைப்பு நுகர்வோர் எண்",
      "மின் கம்ப எண் மற்றும் கோளாறு விபரம்"
    ],
    "notesEn": "Inspected and replaced by TANGEDCO line staff to ensure uninterrupted power safety.",
    "notesTa": "மின்வாரிய கள ஊழியர்களால் புதிய சர்வீஸ் வயர் மாற்றப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Portal (tnebnet.org)",
    "officialPortalUrl": "https://www.tnebnet.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "TNEB-518",
    "category": "tangedco_electricity",
    "department": "TANGEDCO / TNPDCL",
    "departmentTa": "தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மானக் கழகம் (TANGEDCO)",
    "nameEn": "Aadhaar – EB Consumer Number Linking",
    "nameTa": "ஆதார் – மின் இணைப்பு எண் இணைத்தல் (Aadhaar EB Linking)",
    "descriptionEn": "Mandatory online linking of 12-digit Aadhaar Number of the consumer/owner/tenant with the TANGEDCO service number to avail 100 units bi-monthly free electricity subsidy.",
    "descriptionTa": "100 யூனிட் இலவச மின்சாரம் மற்றும் விவசாய/நெசவாளர் மின் மானியங்களைத் தொடர்ந்து பெற நுகர்வோர் எண்ணுடன் ஆதார் எண்ணை இணைக்கும் சேவை.",
    "eligibilityEn": "All domestic, hut, powerloom, handloom, and agricultural electricity consumers in Tamil Nadu.",
    "eligibilityTa": "அனைத்து வீட்டு மற்றும் விவசாய மின் நுகர்வோர்களும்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "TNEB Consumer Service Connection Number (10 to 12 Digits)",
      "12-Digit Aadhaar Number of the Consumer / Property Owner / Lawful Tenant",
      "Active Mobile Number linked with Aadhaar to receive UIDAI OTP authentication"
    ],
    "prerequisitesTa": [
      "10 முதல் 12 இலக்க மின் இணைப்பு நுகர்வோர் எண்",
      "உரிமையாளர் அல்லது வாடகைதாரரின் 12-இலக்க ஆதார் எண்",
      "UIDAI OTP பெற ஆதாரில் இணைக்கப்பட்ட மொபைல் எண்"
    ],
    "notesEn": "Instant online OTP verification. No physical documents need to be uploaded. Mandatory to protect 100 units free domestic electricity scheme.",
    "notesTa": "உடனடி OTP சரிபார்ப்பு மூலம் ஆதார் எண் இணைக்கப்படும். ஆவணப் பதிவேற்றம் எதுவும் தேவையில்லை.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TANGEDCO Aadhaar Seeding Portal (tnebnet.org/aadhar)",
    "officialPortalUrl": "https://www.tnebnet.org/aadhar",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "RTO-601",
    "category": "transport_rto",
    "department": "Transport Department (Sarathi / Parivahan)",
    "departmentTa": "போக்குவரத்துத்துறை (Parivahan / Sarathi)",
    "nameEn": "Learner Licence Application (LLR – Online Test / Slot)",
    "nameTa": "பழகுநர் உரிமம் விண்ணப்பம் (LLR – Learner Licence)",
    "descriptionEn": "Online application and contactless faceless online computer exam slot booking for obtaining Learner Licence (LLR) for Motorcycle with Gear, Without Gear, and Light Motor Vehicle (LMV).",
    "descriptionTa": "இருசக்கர மற்றும் நான்கு சக்கர வாகனங்களுக்கான பழகுநர் உரிமம் (LLR) பெற வீட்டில் இருந்தே ஆன்லைன் தேர்வு எழுத அல்லது RTO முன்பதிவு செய்யும் சேவை.",
    "eligibilityEn": "Citizens aged 16+ (for non-gear 50cc) or 18+ (for geared motorcycle and cars/LMV).",
    "eligibilityTa": "18 வயது பூர்த்தியடைந்த அனைத்து குடிமக்களும் (50cc கியர் இல்லாத வண்டிக்கு 16 வயது).",
    "requiredDocuments": [
      "Age Proof (10th Standard Mark Sheet / School TC / Birth Certificate / Passport / PAN Card)",
      "Current Address Proof (Aadhaar Card / Smart Ration Card / Voter ID / Passport)",
      "Medical Fitness Certificate Form 1-A (Mandatory if applicant age is 40+ or applying for transport vehicles)",
      "Applicant Passport Size Photo & Signature Specimen on plain white paper"
    ],
    "requiredDocumentsTa": [
      "வயது ஆதாரம் (10-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ் / பள்ளி TC / பிறப்புச் சான்றிதழ் / பாஸ்போர்ட் / பான் கார்டு)",
      "முகவரி ஆதாரம் (ஆதார் அட்டை / குடும்ப அட்டை / வாக்காளர் அட்டை)",
      "படிவம் 1-A மருத்துவத் தகுதிச் சான்றிதழ் (40 வயதுக்கு மேற்பட்டோருக்கு மட்டும் கட்டாயம்)",
      "பாஸ்போர்ட் அளவு புகைப்படம் & வெள்ளைத்தாளில் கையொப்பம்"
    ],
    "optionalDocuments": [
      "Blood Group Diagnostic Report"
    ],
    "optionalDocumentsTa": [
      "இரத்த வகை பரிசோதனை அறிக்கை (Blood Group Report)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If applicant is between 16 and 18 years applying for non-gear motorcycle",
        "conditionTa": "16 முதல் 18 வயதுக்குள் உள்ளவர்கள் கியர் இல்லாத வண்டிக்கு விண்ணப்பித்தால்",
        "requirement": "Parent / Legal Guardian Consent Declaration Form signed in presence of Notary/RTO",
        "requirementTa": "பெற்றோர் / பாதுகாவலர் சம்மதக் கடிதம்"
      }
    ],
    "prerequisites": [
      "Aadhaar e-KYC (Mandatory for faceless online LLR exam from home without visiting RTO)",
      "Active mobile number linked with Aadhaar to receive Sarathi OTP",
      "Parivahan Government LLR Fee payment (₹150 to ₹350 based on vehicle categories chosen)"
    ],
    "prerequisitesTa": [
      "ஆதார் e-KYC சரிபார்ப்பு (வீட்டிலிருந்தே ஆன்லைன் தேர்வு எழுதி உடனே LLR பெற)",
      "ஆதாரில் இணைக்கப்பட்ட மொபைல் எண்",
      "அரசு LLR கட்டணம் செலுத்துதல்"
    ],
    "notesEn": "Upon passing online road safety test, digital LLR is issued instantly with 6 months validity.",
    "notesTa": "ஆன்லைன் சாலைப் பாதுகாப்பு தேர்வில் தேர்ச்சி பெற்றவுடன் உடனடி டிஜிட்டல் LLR பதிவிறக்கம் செய்துகொள்ளலாம். 6 மாதங்கள் வரை செல்லுபடியாகும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "MoRTH Sarathi Portal (parivahan.gov.in)",
    "officialPortalUrl": "https://sarathi.parivahan.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "RTO-602",
    "category": "transport_rto",
    "department": "Transport Department (Sarathi / Parivahan)",
    "departmentTa": "போக்குவரத்துத்துறை (Parivahan / Sarathi)",
    "nameEn": "Permanent Driving Licence (DL) Slot Booking & Application",
    "nameTa": "நிரந்தர ஓட்டுநர் உரிமம் முன்பதிவு & விண்ணப்பம் (Permanent DL)",
    "descriptionEn": "Application and RTO automated driving track slot booking for practical driving test to obtain official Smart Card / Digital Permanent Driving Licence.",
    "descriptionTa": "LLR பெற்று 30 நாட்கள் முடிந்த பின் நிரந்தர ஓட்டுநர் உரிமம் (DL) பெற RTO தேர்வுத் தேதி முன்பதிவு மற்றும் விண்ணப்ப சேவை.",
    "eligibilityEn": "Holders of valid Learner Licence (LLR) having completed minimum 30 days and within 180 days.",
    "eligibilityTa": "செல்லுபடியாகும் LLR பெற்று 30 நாட்கள் நிறைவடைந்த விண்ணப்பதாரர்கள்.",
    "requiredDocuments": [
      "Valid Learner Licence (LLR) Copy",
      "Driving School Training Certificate Form 5 (Mandatory for Transport / Commercial vehicle categories)",
      "Vehicle Registration Certificate (RC), Insurance, and Pollution Certificate (PUC) of the test vehicle",
      "Applicant Passport Size Photo"
    ],
    "requiredDocumentsTa": [
      "செல்லுபடியாகும் பழகுநர் உரிம (LLR) நகல்",
      "டிரைவிங் ஸ்கூல் பயிற்சி சான்றிதழ் (படிவம் 5 - வணிக வாகனங்களுக்கு மட்டும் கட்டாயம்)",
      "தேர்வுக்கு கொண்டு செல்லும் வாகனத்தின் RC புக், இன்சூரன்ஸ் மற்றும் புகைச்சான்று (PUC)",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [
      {
        "condition": "Vehicle roadworthiness compliance",
        "conditionTa": "தேர்வு வாகன நிபந்தனை",
        "requirement": "Test vehicle must have valid insurance, fitness, PUC certificate and L-board display",
        "requirementTa": "தேர்வு வாகனத்தில் L-போர்டு, நடப்பு இன்சூரன்ஸ் மற்றும் புகைச்சான்று இருத்தல் வேண்டும்"
      }
    ],
    "prerequisites": [
      "Valid LLR Number (Minimum 30 days old and within 180 days validity)",
      "Mandatory physical appearance with test vehicle at RTO driving test track on booked slot date",
      "Parivahan Government DL Test Fee & Smart Card Fee payment (₹800 to ₹1,200 as per class of vehicles)"
    ],
    "prerequisitesTa": [
      "LLR பெற்று 30 நாட்கள் முடிந்திருக்க வேண்டும் (180 நாட்களுக்குள்)",
      "முன்பதிவு செய்த நாளில் RTO அலுவலகத்தில் வாகனத்துடன் நேரில் ஆஜராகி ஓட்டி காண்பித்தல்",
      "அரசு ஓட்டுநர் உரிம கட்டணம் & ஸ்மார்ட் கார்டு கட்டணம் செலுத்துதல்"
    ],
    "notesEn": "After clearing practical 8-track / H-track driving test before Motor Vehicle Inspector (MVI), digital DL is generated and smart card is dispatched by Speed Post.",
    "notesTa": "RTO மோட்டார் வாகன ஆய்வாளர் (MVI) முன்னிலையில் ஓட்டுநர் தேர்வில் தேர்ச்சி பெற்ற பின் ஸ்மார்ட் கார்டு அஞ்சலில் அனுப்பி வைக்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "MoRTH Sarathi Portal (parivahan.gov.in)",
    "officialPortalUrl": "https://sarathi.parivahan.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "RTO-603",
    "category": "transport_rto",
    "department": "Transport Department (Sarathi / Parivahan)",
    "departmentTa": "போக்குவரத்துத்துறை (Parivahan / Sarathi)",
    "nameEn": "Driving Licence Renewal (DL Renewal)",
    "nameTa": "ஓட்டுநர் உரிமம் புதுப்பித்தல் (DL Renewal)",
    "descriptionEn": "Online renewal of expired or expiring Driving Licence without retest, with Aadhaar-based faceless authentication and home delivery of renewed Smart Card.",
    "descriptionTa": "காலாவதியான அல்லது காலாவதியாகும் நிலையில் உள்ள ஓட்டுநர் உரிமத்தை (DL) ஆன்லைனில் புதுப்பிக்கும் சேவை.",
    "eligibilityEn": "Driving licence holders within 1 year before expiry or up to 1 year after expiry.",
    "eligibilityTa": "ஓட்டுநர் உரிமத்தை புதுப்பிக்க விரும்பும் அனைத்து ஓட்டுநர்களும்.",
    "requiredDocuments": [
      "Original Expired / Expiring Driving Licence Copy",
      "Medical Fitness Certificate Form 1-A signed by Registered Medical Practitioner (Mandatory if age is 40+ or for transport vehicle DL)",
      "Applicant Aadhaar Card",
      "Applicant Passport Size Photo & Signature Specimen"
    ],
    "requiredDocumentsTa": [
      "பழைய ஓட்டுநர் உரிம அட்டை நகல்",
      "படிவம் 1-A மருத்துவத் தகுதிச் சான்றிதழ் (40 வயதுக்கு மேற்பட்டோருக்கு கட்டாயம்)",
      "ஆதார் அட்டை",
      "பாஸ்போர்ட் அளவு புகைப்படம் & கையொப்பம்"
    ],
    "optionalDocuments": [
      "Eye Specialist Vision Certificate"
    ],
    "optionalDocumentsTa": [
      "கண் பரிசோதனை சான்றிதழ்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If renewal is applied after 1 year of expiry date",
        "conditionTa": "காலாவதியாகி 1 வருடத்திற்குப் பிறகு புதுப்பித்தால்",
        "requirement": "Mandatory practical retest fee and Motor Vehicle Inspector (MVI) re-assessment",
        "requirementTa": "மறு ஓட்டுநர் தேர்வு (Retest) மற்றும் அபராதக் கட்டணம்"
      }
    ],
    "prerequisites": [
      "Existing DL Number and Date of Birth matching Parivahan centralized database",
      "Aadhaar e-KYC authentication for faceless renewal without visiting RTO",
      "Parivahan DL Renewal Fee payment (₹400 to ₹1,500 based on delay period)"
    ],
    "prerequisitesTa": [
      "ஓட்டுநர் உரிம எண் மற்றும் பிறந்த தேதி விபரம்",
      "RTO செல்லாமல் வீட்டிலிருந்தே புதுப்பிக்க ஆதார் e-KYC சரிபார்ப்பு",
      "அரசு புதுப்பித்தல் கட்டணம் செலுத்துதல்"
    ],
    "notesEn": "Renewed for 10 years (or up to age 55 for non-transport). Renewed PVC Smart Card delivered via Speed Post to Aadhaar address.",
    "notesTa": "10 ஆண்டுகள் வரை புதுப்பிக்கப்பட்டு புதிய ஸ்மார்ட் கார்டு அஞ்சலில் வீட்டிற்கு அனுப்பி வைக்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "MoRTH Sarathi Portal (parivahan.gov.in)",
    "officialPortalUrl": "https://sarathi.parivahan.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "RTO-604",
    "category": "transport_rto",
    "department": "Transport Department (Sarathi / Parivahan)",
    "departmentTa": "போக்குவரத்துத்துறை (Parivahan / Sarathi)",
    "nameEn": "Duplicate Driving Licence Application",
    "nameTa": "மறு ஓட்டுநர் உரிமம் / தொலைந்த DL நகல் (Duplicate DL)",
    "descriptionEn": "Online application for issuance of duplicate Driving Licence smart card in case of theft, loss, tearing, or physical mutilation of original licence.",
    "descriptionTa": "ஓட்டுநர் உரிமம் தொலைந்துபோனது அல்லது சேதமடைந்த நிலையில் புதிய மறு ஓட்டுநர் உரிம அட்டை (Duplicate DL) பெறும் சேவை.",
    "eligibilityEn": "Any driving licence holder whose licence is lost, stolen, or damaged.",
    "eligibilityTa": "ஓட்டுநர் உரிமத்தை தொலைத்த அனைத்து நபர்களும்.",
    "requiredDocuments": [
      "Lost Document Report (LDR) from Tamil Nadu Police CCTNS Portal (if lost/stolen)",
      "Applicant Aadhaar Card",
      "Applicant Passport Size Photo & Signature Specimen"
    ],
    "requiredDocumentsTa": [
      "காவல்துறை இணையதளத்தில் (CCTNS) பெறப்பட்ட தொலைந்த ஆவண அறிக்கை (LDR சான்றிதழ்)",
      "ஆதார் அட்டை",
      "பாஸ்போர்ட் அளவு புகைப்படம் & கையொப்பம்"
    ],
    "optionalDocuments": [
      "Copy of Old Driving Licence (if available)"
    ],
    "optionalDocumentsTa": [
      "பழைய ஓட்டுநர் உரிமத்தின் நகல் (இருப்பின்)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If original licence is physically torn / damaged / mutilated",
        "conditionTa": "அசல் உரிமம் சேதமடைந்திருந்தால்",
        "requirement": "Surrender of old damaged physical licence card to RTO",
        "requirementTa": "சேதமடைந்த பழைய அட்டையை RTO-வில் ஒப்படைத்தல்"
      }
    ],
    "prerequisites": [
      "DL Number and Date of Birth",
      "Police Non-Traceable LDR reference number",
      "Duplicate DL Government Fee payment (₹400 via Parivahan)"
    ],
    "prerequisitesTa": [
      "ஓட்டுநர் உரிம எண் மற்றும் பிறந்த தேதி",
      "காவல்துறை LDR அறிக்கை எண்",
      "அரசு மறு உரிமக் கட்டணம் செலுத்துதல்"
    ],
    "notesEn": "Duplicate Smart Card printed and dispatched by Speed Post to resident address.",
    "notesTa": "புதிய ஸ்மார்ட் கார்டு அச்சிடப்பட்டு அஞ்சல் மூலம் முகவரிக்கு அனுப்பப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "MoRTH Sarathi Portal (parivahan.gov.in)",
    "officialPortalUrl": "https://sarathi.parivahan.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "RTO-605",
    "category": "transport_rto",
    "department": "Transport Department (Sarathi / Parivahan)",
    "departmentTa": "போக்குவரத்துத்துறை (Parivahan / Sarathi)",
    "nameEn": "Driving Licence Address Change",
    "nameTa": "ஓட்டுநர் உரிமம் முகவரி மாற்றம் (DL Address Change)",
    "descriptionEn": "Online service to update residential address in Driving Licence and transfer jurisdiction to new local RTO with Aadhaar e-KYC faceless processing.",
    "descriptionTa": "வீடு மாறிய ஓட்டுநர்கள் தங்கள் ஓட்டுநர் உரிமத்தில் புதிய முகவரியை மாற்றி புதிய RTO எல்லைக்கு மாற்றும் சேவை.",
    "eligibilityEn": "Licence holders relocated to a new address.",
    "eligibilityTa": "புதிய முகவரிக்கு குடிபெயர்ந்த ஓட்டுநர் உரிமதாரர்கள்.",
    "requiredDocuments": [
      "Existing Driving Licence Copy",
      "New Address Proof (Updated Aadhaar Card / Voter ID / Passport / Gas Bill / Rent Agreement)",
      "Applicant Passport Size Photo & Signature Specimen"
    ],
    "requiredDocumentsTa": [
      "தற்போதுள்ள ஓட்டுநர் உரிம நகல்",
      "புதிய முகவரி ஆதாரம் (புதிய முகவரியுள்ள ஆதார் அட்டை / பாஸ்போர்ட் / வாக்காளர் அட்டை)",
      "பாஸ்போர்ட் அளவு புகைப்படம் & கையொப்பம்"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "Existing DL Number and Date of Birth",
      "Aadhaar e-KYC with updated residential address",
      "Government Address Change & Smart Card Fee payment (₹500 via Parivahan)"
    ],
    "prerequisitesTa": [
      "ஓட்டுநர் உரிம எண் மற்றும் பிறந்த தேதி",
      "புதிய முகவரியுடன் கூடிய ஆதார் e-KYC சரிபார்ப்பு",
      "அரசு முகவரி மாற்றக் கட்டணம் செலுத்துதல்"
    ],
    "notesEn": "Address updated in national registry and new Smart Card delivered by Speed Post.",
    "notesTa": "புதிய முகவரியுடன் கூடிய ஓட்டுநர் உரிம அட்டை அஞ்சலில் வீட்டிற்கு வரும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "MoRTH Sarathi Portal (parivahan.gov.in)",
    "officialPortalUrl": "https://sarathi.parivahan.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REG-701",
    "category": "registration_tnreginet",
    "department": "Registration Department (TNREGINET)",
    "departmentTa": "பதிவுத்துறை (TNREGINET)",
    "nameEn": "Encumbrance Certificate (EC – Online Certified Copy)",
    "nameTa": "வில்லங்கச் சான்றிதழ் பார்வையிட & பதிவிறக்கம் (EC Search & Download)",
    "descriptionEn": "Instant search, verification and digitally certified download of property encumbrance records (EC) up to 1975 to current date from Sub-Registrar Office establishing registered mortgages, sales, and leases.",
    "descriptionTa": "1975 முதல் நடப்பு நாள் வரையிலான சொத்தின் வில்லங்க விபரங்கள், அடமானம், கிரயம் மற்றும் பத்திரப் பதிவுகளை உடனடியாக பார்வையிட மற்றும் பதிவிறக்கம் செய்யும் சேவை.",
    "eligibilityEn": "Any citizen or property buyer verifying title search and encumbrance status.",
    "eligibilityTa": "சொத்து விபரம் அறிய விரும்பும் அனைவரும்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "Zone, District, Sub-Registrar Office (SRO), and Village name",
      "Survey Number and Sub-division Number OR Plot Number / Door Number",
      "Search Period (From Date to To Date)"
    ],
    "prerequisitesTa": [
      "மண்டலம், மாவட்டம், சார்-பதிவாளர் அலுவலகம் மற்றும் கிராமப் பெயர்",
      "சர்வே எண் & உட்பிரிவு எண் அல்லது மனை எண் / கதவு எண்",
      "தேட வேண்டிய கால அளவு (ஆண்டு மற்றும் தேதி விபரம்)"
    ],
    "notesEn": "Digitally certified QR-coded official government PDF download. No physical document upload required.",
    "notesTa": "அதிகாரப்பூர்வ QR குறியீட்டுடன் கூடிய டிஜிட்டல் வில்லங்கச் சான்றிதழ் உடனடியாக கிடைக்கும். ஆவணப் பதிவேற்றம் எதுவும் தேவையில்லை.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNREGINET Portal (tnreginet.gov.in)",
    "officialPortalUrl": "https://tnreginet.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REG-702",
    "category": "registration_tnreginet",
    "department": "Registration Department (TNREGINET)",
    "departmentTa": "பதிவுத்துறை (TNREGINET)",
    "nameEn": "Certified Copy of Registered Document (CC Copy)",
    "nameTa": "பத்திர நகல் இணையவழி பதிவிறக்கம் (Certified Copy of Document)",
    "descriptionEn": "Online request and download of official digitally signed Certified Copy (CC) of registered sale deed, partition deed, gift deed, settlement, or power of attorney.",
    "descriptionTa": "சார்பதிவாளர் அலுவலகத்தில் பதிவு செய்யப்பட்ட கிரயப் பத்திரம், பாகப்பிரிவினை, செட்டில்மெண்ட் அல்லது பொது அதிகாரப் பத்திரத்தின் அதிகாரப்பூர்வ சான்றளிக்கப்பட்ட நகல் பெறும் சேவை.",
    "eligibilityEn": "Property owners, legal heirs, or advocates requiring certified true copy of registered deeds.",
    "eligibilityTa": "பத்திர நகல் தேவைப்படும் சொத்து உரிமையாளர்கள் மற்றும் பொதுமக்கள்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "Sub-Registrar Office (SRO) where document was originally registered",
      "Registered Document Number and Year of Registration",
      "Book Type (Book 1 - Immovable property regular deeds)",
      "Statutory Government Certified Copy Fee payment"
    ],
    "prerequisitesTa": [
      "பத்திரம் பதிவு செய்யப்பட்ட சார்-பதிவாளர் அலுவலக விபரம்",
      "பத்திர எண் மற்றும் பதிவு செய்யப்பட்ட ஆண்டு",
      "அரசு பத்திர நகல் கட்டணம் செலுத்துதல்"
    ],
    "notesEn": "Generates official tamper-proof PDF with registration stamp and QR watermark legally admissible in courts and banks.",
    "notesTa": "நீதிமன்றம் மற்றும் வங்கிகளில் ஏற்றுக்கொள்ளப்படும் அதிகாரப்பூர்வ சான்றளிக்கப்பட்ட டிஜிட்டல் பத்திர நகல் கிடைக்கும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNREGINET Portal (tnreginet.gov.in)",
    "officialPortalUrl": "https://tnreginet.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REG-703",
    "category": "registration_tnreginet",
    "department": "Registration Department (TNREGINET)",
    "departmentTa": "பதிவுத்துறை (TNREGINET)",
    "nameEn": "Marriage Registration Token & Application Booking",
    "nameTa": "திருமணப் பதிவு டோக்கன் & இணையவழி விண்ணப்பம்",
    "descriptionEn": "Online application form submission and Sub-Registrar Office appointment slot token booking for registering marriages under Tamil Nadu Registration of Marriages Act 2009 or Hindu Marriage Act.",
    "descriptionTa": "தமிழ்நாடு திருமணப் பதிவுச் சட்டம் 2009 அல்லது இந்து திருமணச் சட்டத்தின் கீழ் சார்-பதிவாளர் அலுவலகத்தில் திருமணத்தைப் பதிவு செய்ய டோக்கன் முன்பதிவு செய்யும் சேவை.",
    "eligibilityEn": "Couples solemnized marriage where groom is age 21+ and bride is age 18+.",
    "eligibilityTa": "சட்டப்பூர்வ திருமண வயது பூர்த்தியடைந்த தம்பதியர்.",
    "requiredDocuments": [
      "Bridegroom & Bride Aadhaar Cards and Age Proof (10th Mark Sheet / School TC / Birth Certificate / Passport)",
      "Proof of Solemnization of Marriage (Temple Marriage Receipt / Church Certificate / Nikahnama / Wedding Invitation Card & Wedding Photos)",
      "Three Passport Size Joint Photographs of Bride and Groom",
      "Aadhaar Cards & Address Proofs of Three Witnesses",
      "Smart Ration Cards of both Bride and Groom families"
    ],
    "requiredDocumentsTa": [
      "மணமகன் மற்றும் மணமகளின் ஆதார் அட்டை & வயது சான்று (10th TC / பிறப்புச் சான்றிதழ்)",
      "திருமணம் நடந்ததற்கான ஆதாரம் (கோவில் ரசீது / சர்ச் சான்றிதழ் / நிக்கா சான்று / திருமண அழைப்பிதழ் & திருமண புகைப்படங்கள்)",
      "தம்பதியரின் 3 கூட்டு பாஸ்போர்ட் அளவு புகைப்படங்கள்",
      "மூன்று சாட்சிகளின் ஆதார் அட்டைகள் & முகவரி ஆதாரம்",
      "இரு குடும்பங்களின் குடும்ப அட்டைகள்"
    ],
    "optionalDocuments": [
      "Divorce Decree / Death Certificate of former spouse (if second marriage)"
    ],
    "optionalDocumentsTa": [
      "விவாகரத்து தீர்ப்பு நகல் / முந்தைய துணையின் இறப்புச் சான்றிதழ் (மறுமணம் எனில்)"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "Groom must have completed 21 years of age and Bride must have completed 18 years",
      "Mandatory physical appearance of Bride, Groom, and 3 Witnesses with original documents at SRO on booked token date",
      "Marriage Registration Government Fee payment"
    ],
    "prerequisitesTa": [
      "மணமகனுக்கு 21 வயதும், மணமகளுக்கு 18 வயதும் பூர்த்தியடைந்திருத்தல் வேண்டும்",
      "முன்பதிவு செய்த நாளில் மணமக்கள் மற்றும் 3 சாட்சிகள் அசல் ஆவணங்களுடன் சார்பதிவாளர் அலுவலகத்தில் நேரில் ஆஜராகுதல்",
      "அரசு திருமணப் பதிவு கட்டணம் செலுத்துதல்"
    ],
    "notesEn": "Marriage registration certificate is issued on the same day by the Sub-Registrar after biometric authentication and photo capture of the couple and witnesses.",
    "notesTa": "சார்-பதிவாளர் முன்னிலையில் கையொப்பம் மற்றும் பயோமெட்ரிக் பதிவுக்குப் பின் அன்றைய தினமே திருமணச் சான்றிதழ் வழங்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNREGINET Portal (tnreginet.gov.in)",
    "officialPortalUrl": "https://tnreginet.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "REG-704",
    "category": "registration_tnreginet",
    "department": "Registration Department (TNREGINET)",
    "departmentTa": "பதிவுத்துறை (TNREGINET)",
    "nameEn": "Document Registration Appointment Token Booking",
    "nameTa": "பத்திரப்பதிவு டோக்கன் முன்பதிவு (Document Registration Token)",
    "descriptionEn": "Online preparation of draft deed abstract, automated stamp duty and registration fee calculation, and Sub-Registrar Office time-slot token booking for property sale, gift, partition, or power deeds.",
    "descriptionTa": "கிரயப் பத்திரம், தான செட்டில்மெண்ட், பாகப்பிரிவினை உள்ளிட்ட பத்திரங்களை சார்பதிவாளர் அலுவலகத்தில் பதிவு செய்ய முத்திரைத்தாள் கட்டணம் கணக்கிட்டு டோக்கன் முன்பதிவு செய்யும் சேவை.",
    "eligibilityEn": "Property buyers, sellers, or authorized power agents executing registered deeds.",
    "eligibilityTa": "பத்திரப் பதிவு செய்ய விரும்பும் சொத்து வாங்குபவர் / விற்பவர்.",
    "requiredDocuments": [
      "Draft Deed Document prepared in Tamil / English",
      "Parent Documents, Previous Sale Deed, and Patta Copy / TSLR Extract",
      "Latest Encumbrance Certificate (EC)",
      "Buyer and Seller Aadhaar Cards & PAN Cards (or Form 60)",
      "Two Witnesses Aadhaar Cards & ID Proofs"
    ],
    "requiredDocumentsTa": [
      "தயாரிக்கப்பட்ட வரைவுப் பத்திரம் (Draft Deed)",
      "தாய் பத்திரம், முந்தைய கிரயப் பத்திரம் மற்றும் பட்டா நகல்",
      "நடப்பு வில்லங்கச் சான்றிதழ் (EC)",
      "பத்திரம் எழுதுபவர், வாங்குபவர் இருவரின் ஆதார் அட்டை & பான் கார்டு",
      "இரண்டு சாட்சிகளின் ஆதார் அட்டைகள்"
    ],
    "optionalDocuments": [
      "Building Valuation Certificate / Approved Building Plan (if building involved)"
    ],
    "optionalDocumentsTa": [
      "கட்டிட மதிப்பீட்டுச் சான்றிதழ் / அப்ரூவல் வரைபடம்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If property transaction value exceeds ₹50 Lakhs",
        "conditionTa": "சொத்தின் மதிப்பு ₹50 லட்சத்திற்கு மேல் இருந்தால்",
        "requirement": "Mandatory PAN of Buyer & Seller and 1% TDS Form 26QB Payment Challan Receipt",
        "requirementTa": "கட்டாய பான் கார்டு மற்றும் 1% TDS செலுத்திய படிவம் 26QB ரசீது"
      }
    ],
    "prerequisites": [
      "Selection of jurisdiction Sub-Registrar Office (SRO)",
      "Online calculation and payment of Stamp Duty (7%) and Registration Fee (2%) via Star 2.0 portal",
      "Mandatory physical presence of Buyer, Seller, and 2 Witnesses with biometrics at SRO on scheduled token date"
    ],
    "prerequisitesTa": [
      "சம்பந்தப்பட்ட சார்-பதிவாளர் அலுவலகத் தேர்வு",
      "முத்திரைத்தாள் கட்டணம் மற்றும் பதிவுக் கட்டணம் இணையவழியில் செலுத்துதல்",
      "முன்பதிவு செய்த நேரத்தில் வாங்குபவர், விற்பவர் மற்றும் 2 சாட்சிகள் அசல் ஆவணங்களுடன் நேரில் ஆஜராகுதல்"
    ],
    "notesEn": "Token booking eliminates long waiting queues at Sub-Registrar offices. Registered original deed is handed over on the same day after scanning and biometric capture.",
    "notesTa": "டோக்கன் முன்பதிவு மூலம் குறிப்பிட்ட நேரத்தில் சிரமமின்றி பத்திரப்பதிவு செய்து அன்றே அசல் பத்திரத்தைப் பெற்றுக்கொள்ளலாம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNREGINET Star 2.0 Portal (tnreginet.gov.in)",
    "officialPortalUrl": "https://tnreginet.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "SOC-801",
    "category": "social_welfare_women",
    "department": "Social Welfare and Women Rights Department",
    "departmentTa": "சமூக நலம் மற்றும் மகளிர் உரிமைத்துறை",
    "nameEn": "Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme (Pudhumai Penn)",
    "nameTa": "புதுமைப் பெண் திட்டம் (மூவலூர் ராமாமிர்தம் அம்மையார் உயர்கல்வி உறுதித் திட்டம் – ₹1,000/மாதம்)",
    "descriptionEn": "Online registration for monthly financial assistance of ₹1,000 per month for girl students who studied classes 6th to 12th in Tamil Nadu Government schools and enrolled in higher education (degrees/diplomas).",
    "descriptionTa": "அரசுப் பள்ளிகளில் 6 முதல் 12-ஆம் வகுப்பு வரை படித்து உயர்கல்வி (பட்டப்படிப்பு / பட்டயம் / தொழிற்கல்வி) பயிலும் மாணவிகளுக்கு மாதம் ₹1,000 வழங்கும் திட்டம்.",
    "eligibilityEn": "Girl students who studied 6th to 12th in TN Government schools and currently pursuing recognized undergraduate, diploma, or ITI courses.",
    "eligibilityTa": "தமிழ்நாடு அரசுப் பள்ளிகளில் 6 முதல் 12-ஆம் வகுப்பு வரை படித்து கல்லூரி / தொழிற்கல்வி பயிலும் மாணவிகள்.",
    "requiredDocuments": [
      "Student Aadhaar Card",
      "10th and 12th Class Mark Sheets",
      "6th to 12th Government School Study Bonafide Certificate (HM certified)",
      "College Admission ID Card / Current Year Bonafide Certificate",
      "Student Single Bank Account Passbook (Aadhaar linked)",
      "Student Passport Size Photo"
    ],
    "requiredDocumentsTa": [
      "மாணவியின் ஆதார் அட்டை",
      "10 மற்றும் 12-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்கள்",
      "6 முதல் 12-ஆம் வகுப்பு வரை அரசுப் பள்ளியில் படித்ததற்கான தலைமை ஆசிரியர் சான்றிதழ் (Bonafide)",
      "கல்லூரி அடையாள அட்டை / நடப்பு ஆண்டிற்கான போனாபைட் சான்றிதழ்",
      "மாணவியின் பெயரிலான தனி வங்கி சேமிப்புக் கணக்கு பாஸ்புக் (ஆதார் இணைக்கப்பட்டது)",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Smart Ration Card / Family Card"
    ],
    "optionalDocumentsTa": [
      "ஸ்மார்ட் ரேஷன் கார்டு / குடும்ப அட்டை"
    ],
    "conditionalDocuments": [
      {
        "condition": "If studied in Government Aided School in Tamil medium",
        "conditionTa": "அரசு உதவிபெறும் பள்ளியில் தமிழ் வழியில் படித்திருந்தால்",
        "requirement": "PSTM (Person Studied in Tamil Medium) Certificate from 6th to 12th standard",
        "requirementTa": "6 முதல் 12-ஆம் வகுப்பு வரை தமிழ் வழியில் படித்ததற்கான PSTM சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "Continuous education in Tamil Nadu Government schools from Class 6 to 12",
      "Active undergraduate degree / polytechnic diploma / ITI enrollment in a recognized institution",
      "Single Bank Savings Account in student name linked with Aadhaar for Direct Benefit Transfer (DBT)",
      "Active mobile number registered in Aadhaar"
    ],
    "prerequisitesTa": [
      "தமிழ்நாடு அரசுப் பள்ளிகளில் 6 முதல் 12-ஆம் வகுப்பு வரை தொடர்ந்து படித்திருத்தல்",
      "அங்கீகரிக்கப்பட்ட கல்லூரியில் பட்டப்படிப்பு / டிப்ளமோ பயின்று கொண்டிருத்தல்",
      "மாணவியின் பெயரில் ஆதார் இணைக்கப்பட்ட தனி வங்கி சேமிப்புக் கணக்கு",
      "ஆதாரில் பதிவு செய்யப்பட்ட செயல்பாட்டில் உள்ள மொபைல் எண்"
    ],
    "notesEn": "₹1,000 is directly credited every month to the student bank account until course completion.",
    "notesTa": "படிப்பு முடியும் வரை மாதம் ₹1,000 நேரடியாக மாணவியின் வங்கி கணக்கில் வரவு வைக்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Pudhumai Penn Portal (pudhumaipenn.tn.gov.in)",
    "officialPortalUrl": "https://www.pudhumaipenn.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "SOC-802",
    "category": "social_welfare_women",
    "department": "Social Welfare and Women Rights Department",
    "departmentTa": "சமூக நலம் மற்றும் மகளிர் உரிமைத்துறை",
    "nameEn": "Tamil Pudhalvan Higher Education Financial Assistance Scheme",
    "nameTa": "தமிழ்ப் புதல்வன் திட்டம் (அரசுப் பள்ளி மாணவர்களுக்கான உயர்கல்வி உதவித்தொகை – ₹1,000/மாதம்)",
    "descriptionEn": "Monthly financial assistance of ₹1,000 to boy students who studied classes 6th to 12th in Tamil Nadu Government schools and joined collegiate higher education (degrees, engineering, medicine, polytechnic, ITI).",
    "descriptionTa": "அரசுப் பள்ளிகளில் 6 முதல் 12-ஆம் வகுப்பு வரை படித்து உயர்கல்வி பயிலும் மாணவர்களுக்கு மாதம் ₹1,000 உதவித்தொகை வழங்கும் திட்டம்.",
    "eligibilityEn": "Boy students who completed 6th to 12th in TN Government schools enrolled in regular higher education courses.",
    "eligibilityTa": "தமிழ்நாடு அரசுப் பள்ளிகளில் 6 முதல் 12-ஆம் வகுப்பு வரை படித்து கல்லூரி / பாலிடெக்னிக் பயிலும் மாணவர்கள்.",
    "requiredDocuments": [
      "Student Aadhaar Card",
      "10th and 12th Standard Mark Sheets",
      "6th to 12th Standard Government School Study Certificate",
      "College Admission Fee Receipt / College Bonafide Certificate",
      "Student Bank Passbook Copy (Aadhaar linked)",
      "Passport Size Photo"
    ],
    "requiredDocumentsTa": [
      "மாணவரின் ஆதார் அட்டை",
      "10 மற்றும் 12-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்கள்",
      "6 முதல் 12-ஆம் வகுப்பு வரை அரசுப் பள்ளியில் படித்ததற்கான சான்றிதழ்",
      "கல்லூரி சேர்க்கை ரசீது / கல்லூரி போனாபைட் சான்றிதழ்",
      "மாணவரின் வங்கி பாஸ்புக் நகல் (ஆதார் இணைக்கப்பட்டது)",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Smart Ration Card Copy"
    ],
    "optionalDocumentsTa": [
      "குடும்ப அட்டை நகல்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If studied in Tamil Medium in Government Aided School",
        "conditionTa": "அரசு உதவிபெறும் பள்ளியில் தமிழ் வழியில் பயின்றிருந்தால்",
        "requirement": "6th to 12th PSTM Certificate signed by Headmaster and DEO",
        "requirementTa": "தலைமை ஆசிரியர் மற்றும் மாவட்ட கல்வி அலுவலர் சான்றளித்த PSTM சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "Male student studied 6th to 12th in Government schools in Tamil Nadu",
      "Enrolled in full-time recognized Degree / Engineering / Medicine / Diploma / ITI course",
      "Bank savings account seeded with Aadhaar for DBT",
      "Active mobile number"
    ],
    "prerequisitesTa": [
      "தமிழ்நாடு அரசுப் பள்ளிகளில் 6 முதல் 12-ஆம் வகுப்பு வரை படித்த ஆண் மாணவர்",
      "முழு நேரக் கல்லூரிப் படிப்பில் சேர்ந்திருத்தல்",
      "ஆதார் இணைக்கப்பட்ட தனி வங்கி சேமிப்புக் கணக்கு",
      "செயல்பாட்டில் உள்ள மொபைல் எண்"
    ],
    "notesEn": "Assists students in purchasing books and academic materials. Credited directly on a monthly basis.",
    "notesTa": "பாடப் புத்தகங்கள் மற்றும் கல்வி உபகரணங்கள் வாங்க மாதம் ₹1,000 நேரடியாக வங்கிக் கணக்கில் வரவு வைக்கப்படுகிறது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Pudhalvan Portal (tamilpudhalvan.tn.gov.in)",
    "officialPortalUrl": "https://tamilpudhalvan.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "SOC-803",
    "category": "social_welfare_women",
    "department": "Social Welfare and Women Rights Department",
    "departmentTa": "சமூக நலம் மற்றும் மகளிர் உரிமைத்துறை",
    "nameEn": "Dr. Dharmambal Ammaiyar Ninaivu Widow Remarriage Assistance Scheme",
    "nameTa": "டாக்டர் தர்மாம்பாள் அம்மையார் நினைவு விதவை மறுமண உதவித் திட்டம்",
    "descriptionEn": "Financial assistance and 8-gram gold coin for the remarriage of widows to encourage widow rehabilitation and self-reliance in Tamil Nadu.",
    "descriptionTa": "விதவைகளின் மறுவாழ்வை ஊக்குவிக்க விதவை மறுமணத்திற்கு நிதியுதவி மற்றும் 8 கிராம் 22 காரட் தங்க நாணயம் வழங்கும் சமூக நலத்திட்டம்.",
    "eligibilityEn": "Widow entering into legal remarriage; Bride minimum age 20 and Bridegroom minimum age 21.",
    "eligibilityTa": "மறுமணம் செய்துகொள்ளும் பெண் (குறைந்தபட்ச வயது 20) மற்றும் மணமகன் (குறைந்தபட்ச வயது 21).",
    "requiredDocuments": [
      "Deceased First Husband Death Certificate",
      "Widow Remarriage Registration Certificate",
      "Bride Aadhaar Card and Age Proof (10th TC / Birth Certificate)",
      "Bridegroom Aadhaar Card and Age Proof",
      "Smart Ration Card / Family Card",
      "Bride Single Bank Account Passbook",
      "Joint Passport Size Photo of the Married Couple",
      "Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "மறைந்த முதல் கணவரின் இறப்புச் சான்றிதழ்",
      "மறுமணப் பதிவுச் சான்றிதழ்",
      "மணமகளின் ஆதார் அட்டை & வயது சான்று (10th TC / பிறப்புச் சான்றிதழ்)",
      "மணமகனின் ஆதார் அட்டை & வயது சான்று",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "மணமகளின் பெயரிலான வங்கி பாஸ்புக் நகல்",
      "தம்பதியரின் கூட்டு பாஸ்போர்ட் அளவு புகைப்படம்",
      "சுய உறுதிமொழிப் படிவம்"
    ],
    "optionalDocuments": [
      "Wedding Invitation Card",
      "Remarriage Photos"
    ],
    "optionalDocumentsTa": [
      "திருமண அழைப்பிதழ்",
      "மறுமண புகைப்படங்கள்"
    ],
    "conditionalDocuments": [
      {
        "condition": "For Scheme II (Graduate / Diploma Holder: 8g Gold + ₹50,000 Cash)",
        "conditionTa": "திட்டம் 2 (பட்டதாரி / டிப்ளமோ தகுதி: 8 கிராம் தங்கம் + ₹50,000 நிதியுதவி)",
        "requirement": "Degree / Diploma Certificate and Consolidated Marksheet of the Bride",
        "requirementTa": "மணமகளின் பட்டப்படிப்பு அல்லது பட்டயச் சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "Bride age between 20 and 30 years at the time of remarriage; Groom age under 40 years",
      "No annual income ceiling limit",
      "Application to be submitted within 6 months from the date of remarriage",
      "Active mobile number for status alerts"
    ],
    "prerequisitesTa": [
      "மறுமணத்தின் போது மணமகளுக்கு 20 முதல் 30 வயதுக்குள்ளும், மணமகனுக்கு 40 வயதுக்குள்ளும் இருத்தல்",
      "வருமான வரம்பு கிடையாது",
      "மறுமணம் நடைபெற்ற 6 மாதங்களுக்குள் விண்ணப்பித்தல்",
      "செயல்பாட்டில் உள்ள மொபைல் எண்"
    ],
    "notesEn": "Provides 8 grams (1 sovereign) 22-carat Gold Coin plus cash assistance (₹25,000 for non-graduates / ₹50,000 for degree/diploma holders).",
    "notesTa": "8 கிராம் தங்க நாணயம் மற்றும் நிதியுதவி (பட்டதாரிகளுக்கு ₹50,000 / மற்றவர்களுக்கு ₹25,000) வழங்கப்படுகிறது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Social Welfare & Women Empowerment Department (tn.gov.in/socialwelfare)",
    "officialPortalUrl": "https://cms.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "SOC-804",
    "category": "social_welfare_women",
    "department": "Social Welfare and Women Rights Department",
    "departmentTa": "சமூக நலம் மற்றும் மகளிர் உரிமைத்துறை",
    "nameEn": "E.V.R. Maniammaiyar Ninaivu Marriage Assistance Scheme for Daughters of Poor Widows",
    "nameTa": "ஈ.வே.ரா. மணியம்மையார் நினைவு ஏழை விதவைகளின் மகள் திருமண உதவித் திட்டம்",
    "descriptionEn": "Government marriage assistance of 8-gram gold coin and cash grant to poor widow mothers for the solemnization of their daughter marriage.",
    "descriptionTa": "ஏழை விதவைத் தாயின் மகளின் திருமணத்திற்கு 8 கிராம் தங்க நாணயம் மற்றும் நிதியுதவி வழங்கும் சமூகப் பாதுகாப்புத் திட்டம்.",
    "eligibilityEn": "Daughters of poor widows where family annual income does not exceed ₹72,000.",
    "eligibilityTa": "ஆண்டு வருமானம் ₹72,000-க்குள் உள்ள ஏழை விதவைத் தாயின் மகள்கள்.",
    "requiredDocuments": [
      "Mother (Widow) Aadhaar Card and Father Death Certificate",
      "Mother Destitute Widow Certificate / Widow Certificate from Tahsildar",
      "Bride Aadhaar Card and Age Proof (minimum 18 years)",
      "Bridegroom Aadhaar Card and Age Proof (minimum 21 years)",
      "Smart Ration Card / Family Card",
      "Income Certificate (Annual family income <= ₹72,000)",
      "Mother Bank Account Passbook (Single account)",
      "Bride and Mother Passport Size Photos",
      "Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "தாயின் ஆதார் அட்டை மற்றும் தந்தையின் இறப்புச் சான்றிதழ்",
      "வட்டாட்சியர் வழங்கிய விதவைச் சான்றிதழ்",
      "மணமகளின் ஆதார் அட்டை & வயது சான்று (குறைந்தபட்சம் 18 வயது)",
      "மணமகனின் ஆதார் அட்டை & வயது சான்று (குறைந்தபட்சம் 21 வயது)",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "வருமானச் சான்றிதழ் (ஆண்டு வருமானம் ₹72,000-க்குள்)",
      "தாயின் வங்கி சேமிப்புக் கணக்கு பாஸ்புக்",
      "மணமகள் மற்றும் தாயின் பாஸ்போர்ட் அளவு புகைப்படங்கள்",
      "சுய உறுதிமொழிப் படிவம்"
    ],
    "optionalDocuments": [
      "Marriage Invitation Card",
      "Community Certificate of Bride"
    ],
    "optionalDocumentsTa": [
      "திருமண அழைப்பிதழ்",
      "மணமகளின் சாதிச் சான்றிதழ்"
    ],
    "conditionalDocuments": [
      {
        "condition": "For Scheme II (Graduate / Diploma Daughter: 8g Gold + ₹50,000)",
        "conditionTa": "திட்டம் 2 (பட்டதாரி மகள்: 8 கிராம் தங்கம் + ₹50,000)",
        "requirement": "Daughter Degree / Diploma Certificate / Mark Sheet from recognized University/Board",
        "requirementTa": "மணமகளின் பட்டப்படிப்பு / பட்டயச் சான்றிதழ் நகல்"
      }
    ],
    "prerequisites": [
      "Family annual income must not exceed ₹72,000",
      "Bride must have completed 18 years and Groom 21 years of age",
      "Applicable only for one daughter per poor widow mother",
      "Application must be submitted at least 40 days prior to marriage date",
      "Active mobile number for SMS alerts"
    ],
    "prerequisitesTa": [
      "குடும்ப ஆண்டு வருமானம் ₹72,000-க்கு மிகாமல் இருத்தல்",
      "திருமண நாளில் பெண்ணுக்கு 18 வயதும், ஆணுக்கு 21 வயதும் பூர்த்தியடைந்திருத்தல்",
      "ஒரு குடும்பத்தில் ஒரு மகளுக்கு மட்டுமே இச்சலுகை பொருந்தும்",
      "திருமணத்திற்கு 40 நாட்களுக்கு முன்பாக விண்ணப்பிக்க வேண்டும்",
      "செயல்பாட்டில் உள்ள மொபைல் எண்"
    ],
    "notesEn": "Sanctions 8 grams 22ct Gold Coin + ₹25,000 cash for 10th passed or ₹50,000 for degree/diploma holders.",
    "notesTa": "8 கிராம் தங்க நாணயத்துடன் ₹25,000 (10-ஆம் வகுப்பு) அல்லது ₹50,000 (பட்டதாரிகள்) உதவித்தொகை வழங்கப்படுகிறது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Social Welfare & Women Empowerment Department (tn.gov.in/socialwelfare)",
    "officialPortalUrl": "https://cms.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "DAP-901",
    "category": "differently_abled",
    "department": "Welfare of Differently Abled Persons Department",
    "departmentTa": "மாற்றுத்திறனாளிகள் நலத்துறை",
    "nameEn": "Unique Disability ID (UDID) Card Online Application",
    "nameTa": "மாற்றுத்திறனாளிகளுக்கான தேசிய அடையாள அட்டை (UDID Card Online Application)",
    "descriptionEn": "National Unique Disability ID (UDID) card application and medical board appointment booking for issuing nationwide smart card disability certificates.",
    "descriptionTa": "நாடு முழுவதும் ஏற்றுக்கொள்ளப்படும் மாற்றுத்திறனாளிகளுக்கான தேசிய அடையாள அட்டை (UDID Smart Card) பெற இணையவழி விண்ணப்பம்.",
    "eligibilityEn": "Persons with benchmark disabilities (locomotor, visual, hearing, intellectual, mental illness, neurological, etc.).",
    "eligibilityTa": "உடல், பார்வை, செவித்திறன், அறிவுசார் உள்ளிட்ட மாற்றுத்திறன் கொண்ட அனைத்து குடிமக்களும்.",
    "requiredDocuments": [
      "Disability Certificate issued by Government Medical Board / Civil Surgeon",
      "Applicant Aadhaar Card",
      "Address Proof (Smart Ration Card / Voter ID / EB Bill)",
      "Recent Colour Passport Size Photograph showing disability clearly",
      "Applicant Signature or Thumb Impression"
    ],
    "requiredDocumentsTa": [
      "அரசு மருத்துவக் குழு வழங்கிய மாற்றுத்திறனாளி மருத்துவச் சான்றிதழ்",
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "முகவரி ஆதாரம் (ஸ்மார்ட் ரேஷன் கார்டு / வாக்காளர் அட்டை)",
      "மாற்றுத்திறன் தெரியும் வகையிலான பாஸ்போர்ட் அளவு வண்ணப் புகைப்படம்",
      "விண்ணப்பதாரரின் கையொப்பம் அல்லது இடது பெருவிரல் ரேகை"
    ],
    "optionalDocuments": [
      "Blood Group Report",
      "Previous State Disability ID Card (National Disability Identity Card)"
    ],
    "optionalDocumentsTa": [
      "இரத்த வகை சான்று",
      "முந்தைய மாற்றுத்திறனாளி நல அடையாள அட்டை"
    ],
    "conditionalDocuments": [
      {
        "condition": "If applying for renewal due to expired temporary disability certificate",
        "conditionTa": "காலாவதியான தற்காலிக மருத்துவச் சான்றிதழைப் புதுப்பிக்க விண்ணப்பித்தால்",
        "requirement": "Latest Re-assessment Medical Report from District Headquarters Hospital Board",
        "requirementTa": "மாவட்ட தலைமை அரசு மருத்துவமனை மறுமதிப்பீட்டு மருத்துவ அறிக்கை"
      }
    ],
    "prerequisites": [
      "Minimum 40% benchmark disability certified by designated Medical Board",
      "Physical presence for medical assessment at District Hospital if fresh case or directed by CMO",
      "Active mobile number to receive UDID dispatch tracking SMS"
    ],
    "prerequisitesTa": [
      "அரசு மருத்துவக் குழுவால் 40% அல்லது அதற்கு மேற்பட்ட மாற்றுத்திறன் உறுதி செய்யப்படுதல்",
      "புதிய விண்ணப்பதாரர்கள் மருத்துவக் குழு முன் பரிசோதனைக்கு ஆஜராகுதல்",
      "UDID கார்டு தபால் கண்காணிப்பு SMS பெற மொபைல் எண்"
    ],
    "notesEn": "UDID card enables hassle-free nationwide access to bus/train travel concessions, scholarships, appliances, and pensions.",
    "notesTa": "நாடு முழுவதும் இலவச பேருந்து பயணம், ரயில் பயணக் கட்டணச் சலுகை மற்றும் உதவி உபகரணங்கள் பெற பயன்படுகிறது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Department of Empowerment of Persons with Disabilities, GoI (swavlambancard.gov.in)",
    "officialPortalUrl": "https://www.swavlambancard.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "DAP-902",
    "category": "differently_abled",
    "department": "Welfare of Differently Abled Persons Department",
    "departmentTa": "மாற்றுத்திறனாளிகள் நலத்துறை",
    "nameEn": "Differently Abled Maintenance Allowance / Monthly Pension Scheme",
    "nameTa": "மாற்றுத்திறனாளிகள் மாதாந்திர பராமரிப்பு உதவித்தொகை (Maintenance Allowance – ₹1,500/₹2,000)",
    "descriptionEn": "Monthly pension and maintenance allowance scheme providing ₹1,500 to ₹2,000 per month for severely differently abled persons, intellectual disabilities, muscular dystrophy, Parkinson’s, and spinal cord injuries.",
    "descriptionTa": "கடுமையான மாற்றுத்திறனாளிகள், மனவளர்ச்சி குன்றியோர் மற்றும் தண்டுவடம் பாதிக்கப்பட்டோருக்கு மாதம் ₹1,500 முதல் ₹2,000 வரை மாதாந்திர பராமரிப்பு உதவித்தொகை வழங்கும் திட்டம்.",
    "eligibilityEn": "Persons with 40%+ disability (or 75%+ for severe maintenance allowance category) not covered under regular government employment.",
    "eligibilityTa": "40% அல்லது 75%-க்கு மேல் மாற்றுத்திறன் கொண்ட தகுதியுடைய நபர்கள்.",
    "requiredDocuments": [
      "UDID Card / Government Medical Board Disability Certificate",
      "Applicant Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Applicant Single Bank Account Passbook (or Joint with Legal Guardian)",
      "Applicant Passport Size Photo",
      "Self-Declaration Form"
    ],
    "requiredDocumentsTa": [
      "UDID அட்டை / அரசு மருத்துவக் குழு மாற்றுத்திறனாளி சான்றிதழ்",
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "விண்ணப்பதாரரின் வங்கி பாஸ்புக் நகல் (அல்லது பாதுகாவலருடன் இணைந்த கணக்கு)",
      "பாஸ்போர்ட் அளவு புகைப்படம்",
      "சுய உறுதிமொழிப் படிவம்"
    ],
    "optionalDocuments": [
      "Guardian Aadhaar Card & Photo (for minor or mentally challenged applicant)"
    ],
    "optionalDocumentsTa": [
      "பாதுகாவலரின் ஆதார் அட்டை & புகைப்படம் (மனவளர்ச்சி குன்றியோர் எனில்)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If applicant is mentally challenged or severely disabled incapable of managing finance",
        "conditionTa": "மனவளர்ச்சி குன்றியோர் அல்லது சுயமாக முடிவெடுக்க இயலாத தீவிர மாற்றுத்திறனாளி எனில்",
        "requirement": "Legal Guardianship Certificate issued by Local Level Committee (LLC) under National Trust Act / District Collector",
        "requirementTa": "தேசிய அறக்கட்டளைச் சட்டம் அல்லது மாவட்ட ஆட்சியர் வழங்கிய சட்டப்பூர்வ பாதுகாவலர் சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "Benchmark disability percentage certified by competent Medical Authority",
      "Tamil Nadu resident status",
      "Bank savings account seeded with Aadhaar for Direct Benefit Transfer (DBT)",
      "Active mobile number for pension credit notification"
    ],
    "prerequisitesTa": [
      "அரசு மருத்துவக் குழுவால் சான்றளிக்கப்பட்ட மாற்றுத்திறன் சதவீதம்",
      "தமிழ்நாட்டில் வசிப்பவர்",
      "ஆதார் இணைக்கப்பட்ட வங்கி சேமிப்புக் கணக்கு",
      "பராமரிப்புத் தொகை வரவு SMS பெற மொபைல் எண்"
    ],
    "notesEn": "Sanctioned by District Differently Abled Welfare Officer (DDAWO) after verification. Transferred monthly via DBT.",
    "notesTa": "மாவட்ட மாற்றுத்திறனாளிகள் நல அலுவலரின் கள ஆய்வுக்குப் பின் மாதாந்திர உதவித்தொகை வங்கிக் கணக்கில் வரவு வைக்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Welfare of Differently Abled Persons Department (tn.gov.in/diffabled)",
    "officialPortalUrl": "https://scd.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "MUN-1001",
    "category": "municipality_corporation",
    "department": "Directorate of Public Health and Local Bodies",
    "departmentTa": "பொது சுகாதாரத்துறை மற்றும் உள்ளாட்சி அமைப்புகள்",
    "nameEn": "Birth Certificate Online Search & Certified Download",
    "nameTa": "பிறப்புச் சான்றிதழ் இணையவழி தேடல் & பதிவிறக்கம் (Birth Certificate Download)",
    "descriptionEn": "Instant search, verification and certified PDF download of digitally signed, QR-coded Birth Certificates registered across all Corporations, Municipalities, Town Panchayats, and Village Panchayats in Tamil Nadu.",
    "descriptionTa": "தமிழ்நாடு முழுவதும் மாநகராட்சி, நகராட்சி, பேரூராட்சி மற்றும் கிராம ஊராட்சிகளில் பதிவு செய்யப்பட்ட அதிகாரப்பூர்வ டிஜிட்டல் பிறப்புச் சான்றிதழை தேடி பதிவிறக்கம் செய்யும் சேவை.",
    "eligibilityEn": "Any citizen or parent seeking certified official copy of birth record registered in Tamil Nadu.",
    "eligibilityTa": "தமிழ்நாட்டில் பதிவு செய்யப்பட்ட பிறப்புச் சான்றிதழ் பெற விரும்பும் அனைவரும்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "Child Date of Birth",
      "Child Gender (Male / Female / Transgender)",
      "Mother Full Name and Father Full Name (as per hospital record)",
      "Hospital Name / Place of Birth and District / Local Body jurisdiction"
    ],
    "prerequisitesTa": [
      "குழந்தை பிறந்த தேதி",
      "பாலினம் (ஆண் / பெண் / மூன்றாம் பாலினம்)",
      "தாய் மற்றும் தந்தை முழுப் பெயர்",
      "பிறந்த மருத்துவமனை / இடம் மற்றும் மாவட்டம் / உள்ளாட்சி அமைப்பு"
    ],
    "notesEn": "Official government digitally signed QR-coded certificate legally valid for school admissions, passport, Aadhaar, and all government purposes. Zero upload required for registered births.",
    "notesTa": "பள்ளிச் சேர்க்கை, பாஸ்போர்ட், ஆதார் உள்ளிட்ட அனைத்து தேவைகளுக்கும் செல்லுபடியாகும் அதிகாரப்பூர்வ QR சான்றிதழ். ஆவணப் பதிவேற்றம் தேவையில்லை.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Civil Registration System / DPH TN (crstn.org)",
    "officialPortalUrl": "https://www.crstn.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "MUN-1002",
    "category": "municipality_corporation",
    "department": "Directorate of Public Health and Local Bodies",
    "departmentTa": "பொது சுகாதாரத்துறை மற்றும் உள்ளாட்சி அமைப்புகள்",
    "nameEn": "Death Certificate Online Search & Certified Download",
    "nameTa": "இறப்புச் சான்றிதழ் இணையவழி தேடல் & பதிவிறக்கம் (Death Certificate Download)",
    "descriptionEn": "Instant search, verification and certified PDF download of officially registered Death Certificates with QR code authentication issued by local bodies in Tamil Nadu.",
    "descriptionTa": "தமிழ்நாடு உள்ளாட்சி அமைப்புகளில் பதிவு செய்யப்பட்ட அதிகாரப்பூர்வ டிஜிட்டல் இறப்புச் சான்றிதழை உடனடி சரிபார்ப்புடன் பதிவிறக்கம் செய்யும் சேவை.",
    "eligibilityEn": "Legal heirs, family members, or authorized persons requiring certified official death record.",
    "eligibilityTa": "மறைந்த நபரின் வாரிசுதாரர்கள் மற்றும் குடும்ப உறுப்பினர்கள்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "Date of Death of the deceased person",
      "Gender of the deceased person",
      "Full Name of the Deceased Person",
      "Father / Husband / Wife Name of the Deceased",
      "Place of Death (Hospital name / Home address) and District / Local Body"
    ],
    "prerequisitesTa": [
      "இறந்த தேதி",
      "மறைந்த நபரின் பாலினம்",
      "மறைந்த நபரின் முழுப் பெயர்",
      "தந்தை / கணவர் / மனைவி பெயர்",
      "இறந்த இடம் (மருத்துவமனை / இல்லம்) மற்றும் மாவட்டம் / உள்ளாட்சி அமைப்பு"
    ],
    "notesEn": "Tamper-proof digital certificate issued under Registration of Births and Deaths Act. Mandatory for legal heir certificate, insurance claims, property transfer, and bank settlements.",
    "notesTa": "வாரிசு சான்றிதழ், இன்சூரன்ஸ் க்ளைம், சொத்து மாற்றம் மற்றும் வங்கி பணப் பரிமாற்றத்திற்கு கட்டாயமானது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Civil Registration System / DPH TN (crstn.org)",
    "officialPortalUrl": "https://www.crstn.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "MUN-1003",
    "category": "municipality_corporation",
    "department": "Directorate of Municipal Administration / GCC",
    "departmentTa": "நகராட்சி நிர்வாக இயக்ககம் / சென்னை மாநகராட்சி",
    "nameEn": "Property Tax Online Assessment Search & Payment",
    "nameTa": "சொத்துவரி மதிப்பீடு தேடல் & இணையவழி செலுத்துதல் (Property Tax Payment)",
    "descriptionEn": "Online property tax demand search, penalty calculation, instant digital payment, and official tamper-proof computerized payment receipt download for all urban local bodies in Tamil Nadu.",
    "descriptionTa": "தமிழ்நாடு நகராட்சிகள் மற்றும் மாநகராட்சிகளில் சொத்துவரி நிலுவை விபரம் அறிந்து இணையவழியில் செலுத்தி உடனடி ரசீது பெறும் சேவை.",
    "eligibilityEn": "Property owners, tenants, or authorized representatives holding an existing property tax assessment.",
    "eligibilityTa": "சொத்து உரிமையாளர்கள் மற்றும் பொதுமக்கள்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [
      {
        "condition": "If applying for new / revised property tax assessment for new construction or alteration",
        "conditionTa": "புதிய கட்டிடத்திற்கான புதிய சொத்துவரி விதிப்புக்கு விண்ணப்பித்தால்",
        "requirement": "Registered Title Deed Copy, Approved Building Plan Drawing, and Land Patta Copy",
        "requirementTa": "கிரயப் பத்திர நகல், அங்கீகரிக்கப்பட்ட கட்டிட வரைபடம் மற்றும் பட்டா நகல்"
      }
    ],
    "prerequisites": [
      "15-digit Property Tax Assessment Number / Old Assessment Number",
      "Local Body Name (Corporation / Municipality / Town Panchayat)",
      "Ward Number and Street Name"
    ],
    "prerequisitesTa": [
      "15 இலக்க சொத்துவரி விதிப்பு எண் (Assessment Number)",
      "உள்ளாட்சி அமைப்பு (மாநகராட்சி / நகராட்சி / பேரூராட்சி)",
      "வார்டு எண் மற்றும் தெரு பெயர்"
    ],
    "notesEn": "Online tax payment provides instant authorized municipal receipt. Timely payment before April 30 / October 30 qualifies for 5% incentive rebate.",
    "notesTa": "இணையவழியில் செலுத்தியவுடன் அதிகாரப்பூர்வ நகராட்சி வரி ரசீது உடனடியாக கிடைக்கும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TN Urban E-Services Portal (tnurbanepay.tn.gov.in)",
    "officialPortalUrl": "https://tnurbanepay.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "MUN-1004",
    "category": "municipality_corporation",
    "department": "Directorate of Municipal Administration / GCC",
    "departmentTa": "நகராட்சி நிர்வாக இயக்ககம் / சென்னை மாநகராட்சி",
    "nameEn": "Professional Tax Online Payment & Assessment Search",
    "nameTa": "தொழில்வரி இணையவழி செலுத்துதல் (Professional Tax Payment)",
    "descriptionEn": "Online search and payment of half-yearly professional tax levied on salaried employees, professionals, traders, and business establishments by local urban bodies.",
    "descriptionTa": "வணிகர்கள், நிறுவனங்கள் மற்றும் தொழில் செய்பவர்கள் நகராட்சி / மாநகராட்சிக்கு செலுத்த வேண்டிய அரையாண்டு தொழில்வரியை இணையவழியில் செலுத்தும் சேவை.",
    "eligibilityEn": "Traders, employers, companies, and practicing professionals registered under local body jurisdiction.",
    "eligibilityTa": "வணிக நிறுவனங்கள், மருத்துவர்கள், வழக்கறிஞர்கள், ஆடிட்டர்கள் மற்றும் தொழில் நிறுவனங்கள்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [
      {
        "condition": "If registering a new business or firm for professional tax",
        "conditionTa": "புதிய நிறுவனத்திற்கான தொழில்வரி பதிவுக்கு விண்ணப்பித்தால்",
        "requirement": "Business GST Registration / Trade Licence Copy & Entity PAN Card",
        "requirementTa": "வணிக ஜிஎஸ்டி பதிவு / உரிம நகல் & நிறுவனத்தின் பான் கார்டு"
      }
    ],
    "prerequisites": [
      "Professional Tax Assessment Number / Trade License Number",
      "Local Body jurisdiction (Corporation / Municipality / Town Panchayat)",
      "Half-yearly gross salary / turnover slab calculation"
    ],
    "prerequisitesTa": [
      "தொழில்வரி மதிப்பீட்டு எண் / வணிக உரிம எண்",
      "சம்பந்தப்பட்ட உள்ளாட்சி அமைப்பு",
      "அரையாண்டு வருமான அடுக்கு விபரம்"
    ],
    "notesEn": "Statutory local body compliance. Generated receipt serves as valid audit proof for commercial enterprises.",
    "notesTa": "வணிக தணிக்கை மற்றும் உள்ளாட்சி சட்ட விதிகளுக்கு தொழில்வரி செலுத்திய ரசீது கட்டாயமானது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TN Urban E-Services Portal (tnurbanepay.tn.gov.in)",
    "officialPortalUrl": "https://tnurbanepay.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "MUN-1005",
    "category": "municipality_corporation",
    "department": "Directorate of Municipal Administration / TWAD / CMWSSB",
    "departmentTa": "நகராட்சி நிர்வாக இயக்ககம் / குடிநீர் வழங்கல் வாரியம்",
    "nameEn": "Underground Drainage (UGD) & Water Supply Connection Application",
    "nameTa": "பாதாள சாக்கடை & குடிநீர் புதிய இணைப்பு விண்ணப்பம் (UGD & Water Connection)",
    "descriptionEn": "Online application for new domestic / commercial municipal drinking water pipeline connection and underground drainage (UGD) sewerage connection.",
    "descriptionTa": "வீடு மற்றும் வணிக பயன்பாட்டிற்கான புதிய நகராட்சி குடிநீர் குழாய் இணைப்பு மற்றும் பாதாள சாக்கடை இணைப்பு பெற விண்ணப்பிக்கும் சேவை.",
    "eligibilityEn": "Property owners in urban areas where underground drainage and water supply pipeline network is commissioned.",
    "eligibilityTa": "பாதாள சாக்கடை மற்றும் குடிநீர் வசதியுள்ள நகர்ப்புற சொத்து உரிமையாளர்கள்.",
    "requiredDocuments": [
      "Latest Property Tax Paid Receipt (with zero arrears)",
      "Registered Property Sale Deed / Title Deed Copy",
      "Land Patta / TSLR Extract Copy",
      "Approved Building Plan Drawing Blueprint / Sketch",
      "Applicant Aadhaar Card and Passport Photo"
    ],
    "requiredDocumentsTa": [
      "நடப்பு நிதியாண்டு சொத்துவரி செலுத்திய ரசீது (நிலுவையின்றி)",
      "சொத்து கிரயப் பத்திர நகல்",
      "பட்டா / TSLR சான்றிதழ் நகல்",
      "அங்கீகரிக்கப்பட்ட கட்டிட வரைபடம் (Approved Plan)",
      "விண்ணப்பதாரரின் ஆதார் அட்டை & பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Licensed Plumber Work Estimate Sketch"
    ],
    "optionalDocumentsTa": [
      "அங்கீகரிக்கப்பட்ட பிளம்பர் மதிப்பீட்டு வரைபடம்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If tenant / occupier is applying on behalf of property owner",
        "conditionTa": "வாடகைக்கு குடியிருப்பவர் உரிமையாளர் சார்பில் விண்ணப்பித்தால்",
        "requirement": "Property Owner NOC Consent Affidavit and Owner ID proof copy",
        "requirementTa": "சொத்து உரிமையாளரின் சம்மதக் கடிதம் (NOC) மற்றும் அடையாள அட்டை நகல்"
      }
    ],
    "prerequisites": [
      "Property tax dues must be cleared up to current half-year",
      "Physical site feasibility inspection by Municipal / Metro Water Assistant Engineer",
      "Payment of prescribed Connection Charges, Road Restoration Fees, and Security Caution Deposit"
    ],
    "prerequisitesTa": [
      "சொத்துவரி நிலுவையின்றி முழுமையாக செலுத்தப்பட்டிருத்தல்",
      "நகராட்சி / மெட்ரோ வாட்டர் உதவிப் பொறியாளரின் தள ஆய்வு",
      "இணைப்புக் கட்டணம், சாலை சீரமைப்பு கட்டணம் மற்றும் வைப்புத்தொகை செலுத்துதல்"
    ],
    "notesEn": "Site inspection is conducted within 7 working days. Connection is commissioned upon fee payment.",
    "notesTa": "தள ஆய்வுக்குப் பின் அரசு நிர்ணயித்த கட்டணம் செலுத்தியவுடன் குடிநீர் மற்றும் பாதாள சாக்கடை இணைப்பு வழங்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TN Urban E-Services Portal (tnurbanepay.tn.gov.in)",
    "officialPortalUrl": "https://tnurbanepay.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "POL-1101",
    "category": "police_cctns",
    "department": "Tamil Nadu Police (CCTNS)",
    "departmentTa": "தமிழ்நாடு காவல்துறை (CCTNS)",
    "nameEn": "Police Online Complaint Registration & CSR Tracking",
    "nameTa": "காவல்துறை இணையவழி புகார் பதிவு & CSR ரசீது பெறுதல் (Online Police Complaint)",
    "descriptionEn": "Online registration of non-emergency civil, cyber, financial fraud, missing, or property crime complaints with instant Community Service Register (CSR) acknowledgement from Tamil Nadu Police.",
    "descriptionTa": "காவல் நிலையம் செல்லாமல் இணையவழியில் புகார் பதிவு செய்து CSR ரசீது மற்றும் விசாரணை நிலை அறியும் சேவை.",
    "eligibilityEn": "Any citizen or resident of Tamil Nadu affected by a cognizable or non-cognizable incident.",
    "eligibilityTa": "பாதிக்கப்பட்ட பொதுமக்கள் மற்றும் பொதுமக்கள் அனைவரும்.",
    "requiredDocuments": [
      "Complainant Aadhaar Card / Government Photo ID Proof"
    ],
    "requiredDocumentsTa": [
      "புகார்தாரரின் ஆதார் அட்டை / அரசு புகைப்பட அடையாள அட்டை"
    ],
    "optionalDocuments": [
      "Supporting Documentary Proof (Transaction slip, WhatsApp chat screenshots, Photographs, Agreement copy)"
    ],
    "optionalDocumentsTa": [
      "புகார் தொடர்பான ஆதார ஆவணங்கள் (பணப்பரிவர்த்தனை ரசீது, வாட்ஸ்அப் உரையாடல், புகைப்படங்கள்)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If complaint pertains to Online Cyber Crime or UPI / Bank Financial Fraud",
        "conditionTa": "இணையவழி நிதி மோசடி அல்லது சைபர் குற்றப் புகார் எனில்",
        "requirement": "Bank Account Statement highlighting unauthorized fraudulent debit transactions and UTR Reference Numbers",
        "requirementTa": "மோசடி பணப்பரிவர்த்தனை இடம்பெற்ற வங்கி கணக்கு அறிக்கை (Bank Statement) & UTR எண்"
      }
    ],
    "prerequisites": [
      "Detailed factual narrative of the incident (Date, Time, Place of occurrence, and facts)",
      "Accused person details (Name, Address, Mobile number if known)",
      "Selection of jurisdiction Police Station based on incident location",
      "Active mobile number to receive OTP verification and official CSR / FIR SMS tracking updates"
    ],
    "prerequisitesTa": [
      "சம்பவம் நடந்த இடம், தேதி, நேரம் மற்றும் முழுமையான விவரங்கள்",
      "எதிர்மனுதாரர் விபரம் (பெயர், முகவரி, செல்போன் எண் - தெரிந்திருப்பின்)",
      "சம்பவம் நடந்த எல்லைக்குட்பட்ட காவல் நிலையத் தேர்வு",
      "OTP மற்றும் CSR பதிவு SMS பெற செயல்பாட்டில் உள்ள மொபைல் எண்"
    ],
    "notesEn": "Online complaints are directly assigned to the concerned Station House Officer (SHO). Digital CSR receipt is generated immediately upon registration.",
    "notesTa": "புகார் நேரடியாக சம்பந்தப்பட்ட காவல் நிலைய ஆய்வாளருக்கு அனுப்பப்பட்டு உடனடியாக CSR ஒப்புகை ரசீது வழங்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nadu Police CCTNS Citizen Portal (eservices.tnpolice.gov.in)",
    "officialPortalUrl": "https://eservices.tnpolice.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "POL-1102",
    "category": "police_cctns",
    "department": "Tamil Nadu Police (CCTNS)",
    "departmentTa": "தமிழ்நாடு காவல்துறை (CCTNS)",
    "nameEn": "Police Verification Certificate (PVC – Character / Antecedents)",
    "nameTa": "காவல்துறை நடத்தைச் சான்றிதழ் (Police Verification Certificate – PVC)",
    "descriptionEn": "Online application for official Police Verification Certificate (PVC) certifying clear criminal antecedents and character for job employment, immigration, tenant, domestic maid, or institutional verification.",
    "descriptionTa": "வேலைவாய்ப்பு, வெளிநாடு பயணம், வாடகைக்கு குடியிருத்தல் போன்றவற்றிற்காக காவல்துறை நடத்தை மற்றும் நன்னடத்தைச் சான்றிதழ் (PVC) பெறும் சேவை.",
    "eligibilityEn": "Individuals, prospective employees, tenants, domestic workers, or corporate employers seeking background verification.",
    "eligibilityTa": "வேலைவாய்ப்பு, வெளிநாட்டு வேலை அல்லது குத்தகைக்கு விண்ணப்பிக்கும் தனிநபர்கள் மற்றும் நிறுவனங்கள்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card",
      "Current Address Proof (Smart Ration Card / Passport / Voter ID / Bank Passbook)",
      "Recent Colour Passport Size Photograph",
      "Self-Declaration Affidavit on criminal record status"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "தற்போதைய முகவரி ஆதாரம் (ஸ்மார்ட் ரேஷன் கார்டு / பாஸ்போர்ட் / வாக்காளர் அட்டை)",
      "சமீபத்திய வண்ண பாஸ்போர்ட் அளவு புகைப்படம்",
      "குற்றப் பின்னணி இல்லை என்பதற்கான சுய உறுதிமொழிப் படிவம்"
    ],
    "optionalDocuments": [
      "Employer / Institution Request Letter (for corporate/job candidate verification)"
    ],
    "optionalDocumentsTa": [
      "நிறுவனத்தின் அதிகாரப்பூர்வ கோரிக்கை கடிதம்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If verification is requested by Employer / Institution for an employee or candidate",
        "conditionTa": "நிறுவனம் அல்லது பணி வழங்குபவர் மூலம் கோரப்பட்டால்",
        "requirement": "Official Company Letterhead Request with Employee Written Consent Form",
        "requirementTa": "நிறுவனத்தின் அதிகாரப்பூர்வ கோரிக்கை கடிதம் மற்றும் பணியாளர் சம்மதக் கடிதம்"
      }
    ],
    "prerequisites": [
      "Selection of jurisdiction Police Station based on current residence address",
      "Payment of statutory Tamil Nadu Police Verification Fee (₹500 for individuals / ₹1,000 for commercial establishments)",
      "Cooperation during local police beat officer field verification visit / enquiry"
    ],
    "prerequisitesTa": [
      "தற்போதைய முகவரிக்குட்பட்ட காவல் நிலையத் தேர்வு",
      "அரசு காவல் துறை சரிபார்ப்புக் கட்டணம் (தனிநபருக்கு ₹500 / நிறுவனங்களுக்கு ₹1,000) இணையவழியில் செலுத்துதல்",
      "காவல்துறை நேரடி கள ஆய்வின் போது அசல் ஆவணங்களை காண்பித்தல்"
    ],
    "notesEn": "Digitally signed QR-coded Police Verification Certificate is issued within 15 working days following Special Branch (SB) and local station records check.",
    "notesTa": "காவல்துறை கள ஆய்வுக்குப் பின் 15 நாட்களுக்குள் அதிகாரப்பூர்வ டிஜிட்டல் நடத்தைச் சான்றிதழ் வழங்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nadu Police CCTNS Citizen Portal (eservices.tnpolice.gov.in)",
    "officialPortalUrl": "https://eservices.tnpolice.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "POL-1103",
    "category": "police_cctns",
    "department": "Tamil Nadu Police (CCTNS)",
    "departmentTa": "தமிழ்நாடு காவல்துறை (CCTNS)",
    "nameEn": "Lost Document Report (LDR – Instant Police Non-Traceable Certificate)",
    "nameTa": "தொலைந்த ஆவண அறிக்கை (Lost Document Report – LDR சான்றிதழ்)",
    "descriptionEn": "Instant online generation of officially certified Police Lost Document Report (LDR) for lost/misplaced Passport, Driving Licence, RC Book, School/College Mark Sheets, or Identity Cards.",
    "descriptionTa": "பாஸ்போர்ட், ஓட்டுநர் உரிமம், வாகன ஆர்சி புக், மதிப்பெண் சான்றிதழ் போன்ற ஆவணங்கள் தொலைந்துபோனால் காவல் நிலையத்தில் உடனடி LDR சான்றிதழ் பெறும் சேவை.",
    "eligibilityEn": "Any citizen who has lost or misplaced essential government identity cards, educational certificates, or vehicle documents.",
    "eligibilityTa": "சான்றிதழ்கள் அல்லது ஆவணங்களை தொலைத்த பொதுமக்கள் அனைவரும்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card / Any Government Photo ID Proof"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை / அரசு புகைப்பட அடையாள அட்டை"
    ],
    "optionalDocuments": [
      "Xerox copy of the lost document (if available)"
    ],
    "optionalDocumentsTa": [
      "தொலைந்துபோன ஆவணத்தின் நகல் (இருப்பின்)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If lost document is a Vehicle Registration Certificate (RC Book)",
        "conditionTa": "தொலைந்துபோன ஆவணம் வாகன பதிவு புத்தகம் (RC Book) எனில்",
        "requirement": "Vehicle Chassis Number, Engine Number, and Insurance Policy Copy",
        "requirementTa": "வாகன சேசிஸ் எண், என்ஜின் எண் மற்றும் இன்சூரன்ஸ் நகல்"
      },
      {
        "condition": "If lost document is an Indian Passport",
        "conditionTa": "தொலைந்துபோன ஆவணம் பாஸ்போர்ட் எனில்",
        "requirement": "Passport Number, Date of Issue, and Place of Issue details",
        "requirementTa": "பாஸ்போர்ட் எண், வழங்கப்பட்ட தேதி மற்றும் இடம்"
      }
    ],
    "prerequisites": [
      "Accurate date, time, and approximate location where the document was lost/misplaced",
      "Original document identification number (Certificate number / Roll number / RC number / Passport number)",
      "Active mobile number to receive instant OTP verification and downloadable LDR report link"
    ],
    "prerequisitesTa": [
      "ஆவணம் தொலைந்துபோன இடம், தேதி, நேரம்",
      "தொலைந்த ஆவணத்தின் பதிவு எண் (Certificate / Roll / RC / Passport எண்)",
      "OTP பெற செயல்பாட்டில் உள்ள மொபைல் எண்"
    ],
    "notesEn": "Tamper-proof digitally signed LDR PDF with QR validation is generated instantly. Legally accepted by RTO, Passport Seva Kendra, DGE, and Universities for issuing duplicate documents.",
    "notesTa": "QR குறியீட்டுடன் கூடிய அதிகாரப்பூர்வ LDR சான்றிதழ் உடனடியாக பதிவிறக்கம் செய்யப்படும். நகல் ஆவணம் பெற இது கட்டாயமானது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nadu Police CCTNS Citizen Portal (eservices.tnpolice.gov.in)",
    "officialPortalUrl": "https://eservices.tnpolice.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "POL-1104",
    "category": "police_cctns",
    "department": "Tamil Nadu Police (CCTNS)",
    "departmentTa": "தமிழ்நாடு காவல்துறை (CCTNS)",
    "nameEn": "Online FIR / CSR Status Search & View",
    "nameTa": "காவல்துறை முதல் தகவல் அறிக்கை / CSR நிலை அறிதல் (Online FIR / CSR Status)",
    "descriptionEn": "Free online search, tracking, and certified viewing/downloading of First Information Reports (FIR) and Community Service Register (CSR) receipts registered by Tamil Nadu Police.",
    "descriptionTa": "தமிழ்நாடு காவல் துறையில் பதிவு செய்யப்பட்ட முதல் தகவல் அறிக்கை (FIR) மற்றும் CSR ஒப்புகை நிலையை இணையவழியில் தேடி பார்வையிடும் சேவை.",
    "eligibilityEn": "Complainants, victims, accused, advocates, or citizens verifying official police case status.",
    "eligibilityTa": "புகார்தாரர்கள், வழக்கறிஞர்கள் மற்றும் பொதுமக்கள் அனைவரும்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "District and Police Station jurisdiction name",
      "FIR Number and Year of Registration OR CSR Number and Year",
      "Complainant / Accused Name OR Registered Mobile Number for OTP verification"
    ],
    "prerequisitesTa": [
      "மாவட்டம் மற்றும் சம்பந்தப்பட்ட காவல் நிலையம்",
      "முதல் தகவல் அறிக்கை (FIR) எண் & பதிவு செய்த ஆண்டு அல்லது CSR எண்",
      "புகார்தாரர் பெயர் அல்லது OTP சரிபார்ப்புக்கு மொபைல் எண்"
    ],
    "notesEn": "Enables real-time public access to registered FIRs within 24 hours as per Supreme Court guidelines (excluding sensitive cases). Zero upload required.",
    "notesTa": "உச்சநீதிமன்ற வழிகாட்டுதலின்படி 24 மணி நேரத்திற்குள் பதிவு செய்யப்பட்ட FIR-ஐ இணையவழியில் இலவசமாக பார்வையிடலாம். ஆவணப் பதிவேற்றம் தேவையில்லை.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nadu Police CCTNS Citizen Portal (eservices.tnpolice.gov.in)",
    "officialPortalUrl": "https://eservices.tnpolice.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "EMP-1201",
    "category": "employment_training",
    "department": "Department of Employment and Training",
    "departmentTa": "வேலைவாய்ப்பு மற்றும் பயிற்சித்துறை",
    "nameEn": "Employment Exchange Online New Registration",
    "nameTa": "வேலைவாய்ப்பு அலுவலக புதிய பதிவு (Employment Exchange Registration)",
    "descriptionEn": "Online registration of basic school, higher secondary, technical diploma, degree, and postgraduate educational qualifications with Tamil Nadu Department of Employment and Training to establish employment seniority.",
    "descriptionTa": "அரசு வேலைவாய்ப்புகளில் முன்னுரிமை மற்றும் பதிவு மூப்பு (Seniority) பெற 10, 12, பட்டப்படிப்பு மற்றும் தொழிற்கல்வி தகுதிகளை வேலைவாய்ப்பு அலுவலகத்தில் ஆன்லைனில் பதிவு செய்யும் சேவை.",
    "eligibilityEn": "Citizens of Tamil Nadu minimum age 14 years possessing any recognized educational qualification.",
    "eligibilityTa": "14 வயது பூர்த்தியடைந்த கல்வித் தகுதியுள்ள தமிழ்நாட்டு குடிமக்கள் அனைவரும்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card",
      "Educational Mark Sheets (10th / 12th / ITI / Diploma / Degree / PG / Professional courses)",
      "Provisional / Degree / Diploma Certificates",
      "School / College Transfer Certificate (TC) showing Date of Birth and Caste",
      "Community Certificate (BC / MBC / SC / ST)",
      "Applicant Recent Passport Size Photo"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "கல்வி மதிப்பெண் சான்றிதழ்கள் (10th, 12th, ITI, Diploma, Degree)",
      "இளங்கலை / முதுகலை பட்டச் சான்றிதழ் / தற்காலிக சான்றிதழ் (Provisional)",
      "பள்ளி / கல்லூரி மாற்றுச் சான்றிதழ் (TC)",
      "சாதிச் சான்றிதழ் (BC/MBC/SC/ST)",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Typewriting / Shorthand English & Tamil Technical Examination Certificates",
      "Driving Licence (Light / Heavy Transport)",
      "Computer on Office Automation (COA) / Recognized Computer Course Certificates"
    ],
    "optionalDocumentsTa": [
      "தட்டச்சு / சுருக்கெழுத்து அரசு தொழில்நுட்ப சான்றிதழ்கள் (Typewriting / Shorthand)",
      "ஓட்டுநர் உரிமம்",
      "கணினி சான்றிதழ் (COA / Computer Courses)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If registering Differently Abled concession",
        "conditionTa": "மாற்றுத்திறனாளி சிறப்பு சலுகையுடன் பதிவு செய்ய",
        "requirement": "UDID Card / Government Medical Board Disability Certificate",
        "requirementTa": "UDID அட்டை / அரசு மருத்துவக் குழு மாற்றுத்திறனாளி சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "Candidate must have completed minimum 14 years of age (no upper age limit)",
      "Permanent resident status of Tamil Nadu",
      "Active mobile number and email ID for registration confirmation and login credentials"
    ],
    "prerequisitesTa": [
      "குறைந்தபட்ச வயது 14 ஆண்டுகள் பூர்த்தியடைந்திருத்தல் (அதிகபட்ச வயது வரம்பு இல்லை)",
      "தமிழ்நாட்டில் வசிப்பவர்",
      "பதிவு எண் மற்றும் கடவுச்சொல் பெற செயல்பாட்டில் உள்ள மொபைல் எண் & மின்னஞ்சல்"
    ],
    "notesEn": "Online registration automatically establishes seniority date from the date of submission. Registration card can be printed immediately.",
    "notesTa": "பதிவு செய்த நாளிலிருந்து வேலைவாய்ப்பு பதிவு மூப்பு (Seniority) கணக்கிடப்படும். பதிவு அடையாள அட்டையை உடனடியாக பிரிண்ட் செய்து கொள்ளலாம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Department of Employment and Training (employmentexchange.tn.gov.in)",
    "officialPortalUrl": "https://employmentexchange.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "EMP-1202",
    "category": "employment_training",
    "department": "Department of Employment and Training",
    "departmentTa": "வேலைவாய்ப்பு மற்றும் பயிற்சித்துறை",
    "nameEn": "Employment Registration Additional Qualification Updation",
    "nameTa": "வேலைவாய்ப்பு அலுவலக கூடுதல் கல்வித்தகுதி சேர்த்தல் (Qualification Updation)",
    "descriptionEn": "Online addition of newly acquired degrees, post-graduation, B.Ed, M.Phil, Ph.D, typing, shorthand, or technical skills to existing employment exchange profile while preserving previous basic seniority.",
    "descriptionTa": "ஏற்கனவே உள்ள வேலைவாய்ப்பு பதிவில் புதிதாக முடித்த பட்டப்படிப்பு, பி.எட், தட்டச்சு போன்ற கூடுதல் கல்வித் தகுதிகளை முந்தைய சீனியாரிட்டி மாறாமல் இணைக்கும் சேவை.",
    "eligibilityEn": "Candidates having an active existing Tamil Nadu employment exchange registration.",
    "eligibilityTa": "ஏற்கனவே வேலைவாய்ப்பு அலுவலகத்தில் பதிவு செய்துள்ளவர்கள்.",
    "requiredDocuments": [
      "Newly Acquired Degree / PG / Diploma / Technical Examination Mark Sheets",
      "Provisional Certificate / Convocation Degree Certificate",
      "College Transfer Certificate (TC) / Course Completion Certificate"
    ],
    "requiredDocumentsTa": [
      "புதிதாக பெற்ற பட்டப்படிப்பு / முதுகலை / டிப்ளமோ மதிப்பெண் சான்றிதழ்கள்",
      "பட்டச் சான்றிதழ் / தற்காலிக சான்றிதழ் (Provisional)",
      "கல்லூரி மாற்றுச் சான்றிதழ் (TC)"
    ],
    "optionalDocuments": [
      "Additional Technical Skill / Experience / Apprentice Certificates"
    ],
    "optionalDocumentsTa": [
      "தொழில்நுட்ப திறன் / தொழிற்பயிற்சி சான்றிதழ்கள்"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "Existing Employment Registration Number",
      "Candidate Date of Birth and Login User ID / Password",
      "Active registered mobile number for OTP"
    ],
    "prerequisitesTa": [
      "ஏற்கனவே உள்ள வேலைவாய்ப்பு பதிவு எண்",
      "பிறந்த தேதி மற்றும் லாகின் விபரங்கள்",
      "OTP சரிபார்ப்புக்கு மொபைல் எண்"
    ],
    "notesEn": "Adding new qualifications retains original seniority date for earlier qualifications, with a new separate seniority date allocated for the newly added qualification.",
    "notesTa": "முந்தைய கல்வித் தகுதிகளின் சீனியாரிட்டி பாதிக்கப்படாமல், புதிய தகுதிக்கு மட்டும் புதிய சீனியாரிட்டி எண் ஒதுக்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Department of Employment and Training (employmentexchange.tn.gov.in)",
    "officialPortalUrl": "https://employmentexchange.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "EMP-1203",
    "category": "employment_training",
    "department": "Department of Employment and Training",
    "departmentTa": "வேலைவாய்ப்பு மற்றும் பயிற்சித்துறை",
    "nameEn": "Employment Exchange Online Renewal & Lapsed Grace Period Renewal",
    "nameTa": "வேலைவாய்ப்பு அலுவலக பதிவு புதுப்பித்தல் (Employment Exchange Renewal)",
    "descriptionEn": "Instant online renewal of 3-year employment registration validity, including government grace-period concessions for candidates whose registration has lapsed.",
    "descriptionTa": "வேலைவாய்ப்பு பதிவு காலாவதியாகும் முன் அல்லது அரசு அறிவித்துள்ள சலுகைக் காலத்தில் ஆன்லைனில் உடனடியாகப் புதுப்பிக்கும் சேவை.",
    "eligibilityEn": "Registered job seekers in Tamil Nadu whose 3-year renewal is due or falls within government grace period.",
    "eligibilityTa": "3 ஆண்டு வேலைவாய்ப்பு பதிவு புதுப்பிக்கும் காலம் வந்தவர்கள்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "Employment Registration Number (e.g., W/CHE/2018/...)",
      "Candidate Date of Birth (as per registration record)",
      "Login Password OR Registered Mobile Number for OTP access"
    ],
    "prerequisitesTa": [
      "வேலைவாய்ப்பு பதிவு எண்",
      "பதிவில் உள்ள பிறந்த தேதி",
      "லாகின் பாஸ்வேர்ட் அல்லது OTP பெற மொபைல் எண்"
    ],
    "notesEn": "Instant renewal confirmation. Next renewal date is extended by 3 years. Zero document upload required.",
    "notesTa": "உடனடியாக புதுப்பிக்கப்பட்டு அடுத்த 3 ஆண்டுகளுக்கு கால நீட்டிப்பு செய்யப்படும். ஆவணப் பதிவேற்றம் எதுவும் தேவையில்லை.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Department of Employment and Training (employmentexchange.tn.gov.in)",
    "officialPortalUrl": "https://employmentexchange.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "EDU-1301",
    "category": "education_admissions",
    "department": "Directorate of Technical Education (DoTE) / Anna University",
    "departmentTa": "தொழில்நுட்பக் கல்வி இயக்ககம் (DoTE) / அண்ணா பல்கலைக்கழகம்",
    "nameEn": "TNEA Engineering Online Admission Counseling Registration",
    "nameTa": "தமிழ்நாடு பொறியியல் கலந்தாய்வு விண்ணப்பம் (TNEA Engineering Counseling)",
    "descriptionEn": "Single-window online application registration, certificate upload, fee payment, and choice filling assistance for B.E. / B.Tech admissions in Anna University departments, constituent colleges, government, and self-financing engineering colleges.",
    "descriptionTa": "அண்ணா பல்கலைக்கழகம் மற்றும் தமிழ்நாட்டில் உள்ள அனைத்து பொறியியல் கல்லூரிகளில் B.E. / B.Tech சேர்க்கைக்கான TNEA இணையவழி கலந்தாய்வு பதிவு மற்றும் சான்றிதழ் பதிவேற்றம்.",
    "eligibilityEn": "Students who passed 12th standard (+2 HSC) with Physics, Chemistry, and Mathematics (PCM).",
    "eligibilityTa": "பிளஸ் 2 தேர்வில் கணிதம், இயற்பியல், வேதியியல் பாடங்களில் தேர்ச்சி பெற்ற மாணவர்கள்.",
    "requiredDocuments": [
      "10th Standard Mark Sheet",
      "11th and 12th Standard Mark Sheets / DigiLocker Certified Mark Sheet",
      "12th Standard Examination Hall Ticket",
      "School Transfer Certificate (TC)",
      "Community Certificate (Permanent Card / Digital QR for BC / BCM / MBC / DNC / SC / SCA / ST)",
      "Student Aadhaar Card",
      "Recent Passport Size Photograph and Signature"
    ],
    "requiredDocumentsTa": [
      "10-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்",
      "11 மற்றும் 12-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்கள்",
      "12-ஆம் வகுப்பு தேர்வு நுழைவுச் சீட்டு (Hall Ticket)",
      "பள்ளி மாற்றுச் சான்றிதழ் (TC)",
      "சாதிச் சான்றிதழ் (BC/MBC/SC/ST)",
      "மாணவரின் ஆதார் அட்டை",
      "பாஸ்போர்ட் அளவு புகைப்படம் மற்றும் கையொப்பம்"
    ],
    "optionalDocuments": [
      "Nativity Certificate (if 8th to 12th studied outside Tamil Nadu)",
      "Sports / Ex-Servicemen / Differently Abled Special Reservation Certificates"
    ],
    "optionalDocumentsTa": [
      "பிறப்பிடச் சான்றிதழ் (8 முதல் 12 வரை தமிழ்நாட்டிற்கு வெளியே படித்திருந்தால்)",
      "விளையாட்டு / முன்னாள் ராணுவத்தினர் / மாற்றுத்திறனாளி சிறப்பு இடஒதுக்கீடு சான்றிதழ்கள்"
    ],
    "conditionalDocuments": [
      {
        "condition": "If claiming 7.5% Government School Special Reservation Quota (முழு கல்விக் கட்டண விலக்கு)",
        "conditionTa": "7.5% அரசுப் பள்ளி மாணவர்களுக்கான முன்னுரிமை இடஒதுக்கீடு கோரினால்",
        "requirement": "6th to 12th Continuous Tamil Nadu Government School Study Bonafide Certificate countersigned by Chief Educational Officer (CEO)",
        "requirementTa": "6 முதல் 12-ஆம் வகுப்பு வரை அரசுப் பள்ளியில் படித்ததற்கான முதன்மைக் கல்வி அலுவலர் (CEO) சான்றளித்த Bonafide"
      },
      {
        "condition": "If claiming First Graduate Tuition Fee Concession (முதல் பட்டதாரி கட்டணச் சலுகை)",
        "conditionTa": "முதல் பட்டதாரி கல்விக் கட்டணச் சலுகை கோரினால்",
        "requirement": "First Graduate Certificate issued by Tahsildar & Joint Declaration signed by parent and candidate",
        "requirementTa": "வட்டாட்சியர் வழங்கிய முதல் பட்டதாரி சான்றிதழ் & பெற்றோர் மாணவர் கூட்டு உறுதிமொழிப் படிவம்"
      }
    ],
    "prerequisites": [
      "Minimum qualifying PCM cut-off marks as per Anna University norms (45% for General, 40% for Reserved)",
      "Payment of official TNEA counseling registration fee (₹500 for General/BC/MBC / ₹250 for SC/SCA/ST)",
      "Active mobile number and email ID for OTP authentication, rank list notification, and seat allotment SMS"
    ],
    "prerequisitesTa": [
      "கணிதம், இயற்பியல், வேதியியல் பாடங்களில் குறைந்தபட்ச கட்-ஆப் மதிப்பெண்கள்",
      "அரசு கலந்தாய்வுக் கட்டணம் (பொது/BC/MBC பிரிவுக்கு ₹500 / SC/ST பிரிவுக்கு ₹250) இணையவழியில் செலுத்துதல்",
      "OTP, தரவரிசை மற்றும் கல்லூரி ஒதுக்கீட்டு தகவல் பெற செயல்பாட்டில் உள்ள மொபைல் எண் & மின்னஞ்சல்"
    ],
    "notesEn": "Centralized single-window online system. Allotment is strictly based on engineering cut-off marks and reservation rules.",
    "notesTa": "கட்-ஆப் மதிப்பெண் மற்றும் இடஒதுக்கீடு அடிப்படையில் ஆன்லைன் மூலமாகவே கல்லூரி மற்றும் பாடப்பிரிவு ஒதுக்கீடு செய்யப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nadu Engineering Admissions Portal (tneaonline.org)",
    "officialPortalUrl": "https://www.tneaonline.org",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "EDU-1302",
    "category": "education_admissions",
    "department": "Directorate of Collegiate Education (DCE)",
    "departmentTa": "கல்லூரிக் கல்வி இயக்ககம் (DCE)",
    "nameEn": "Tamil Nadu Government Arts & Science Colleges Online Admission (TNGASA)",
    "nameTa": "தமிழ்நாடு அரசு கலை மற்றும் அறிவியல் கல்லூரி சேர்க்கை (TNGASA Online Admission)",
    "descriptionEn": "Centralized single-window online registration, college course selection, and application submission for undergraduate degree courses (B.A., B.Sc., B.Com., BBA, BCA) across all 164+ Government Arts and Science Colleges in Tamil Nadu.",
    "descriptionTa": "தமிழ்நாட்டில் உள்ள அனைத்து அரசு கலை மற்றும் அறிவியல் கல்லூரிகளில் இளங்கலை பட்டப்படிப்புகளில் (B.A, B.Sc, B.Com, BBA, BCA) சேர TNGASA இணையவழி விண்ணப்பப் பதிவு.",
    "eligibilityEn": "Students who passed 12th standard (HSC Academic / Vocational) examinations.",
    "eligibilityTa": "பிளஸ் 2 தேர்ச்சி பெற்ற மாணவர்கள்.",
    "requiredDocuments": [
      "10th and 12th Standard Mark Sheets",
      "School Transfer Certificate (TC)",
      "Community Certificate (BC / BCM / MBC / DNC / SC / SCA / ST)",
      "Student Aadhaar Card",
      "Recent Passport Size Photograph"
    ],
    "requiredDocumentsTa": [
      "10 மற்றும் 12-ஆம் வகுப்பு மதிப்பெண் சான்றிதழ்கள்",
      "பள்ளி மாற்றுச் சான்றிதழ் (TC)",
      "சாதிச் சான்றிதழ் (BC/MBC/SC/ST)",
      "மாணவரின் ஆதார் அட்டை",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Sports / NCC / NSS Certificates",
      "Income Certificate (for post-matric scholarship eligibility)"
    ],
    "optionalDocumentsTa": [
      "விளையாட்டு / NCC / NSS சான்றிதழ்கள்",
      "வருமானச் சான்றிதழ் (கல்வி உதவித்தொகைக்கு)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If claiming 7.5% Government School Student Special Quota",
        "conditionTa": "7.5% அரசுப் பள்ளி ஒதுக்கீடு கோரினால்",
        "requirement": "6th to 12th Continuous Government School Study Bonafide Certificate",
        "requirementTa": "6 முதல் 12-ஆம் வகுப்பு வரை அரசுப் பள்ளியில் படித்ததற்கான Bonafide சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "HSC / 12th pass in relevant subject stream matching chosen degree criteria",
      "Choice selection of Government Arts Colleges and specific degree courses (B.Com, B.Sc Computer Science, B.A English, etc.)",
      "Payment of statutory TNGASA application fee (₹50 registration fee per 5 colleges for General/BC/MBC / ₹2 for SC/ST)",
      "Active mobile number and email ID for merit rank and counseling intimation"
    ],
    "prerequisitesTa": [
      "பிளஸ் 2 தேர்ச்சி",
      "விரும்பும் அரசு கல்லூரிகள் மற்றும் பாடப்பிரிவுகள் தேர்வு",
      "அரசு விண்ணப்பக் கட்டணம் (5 கல்லூரிகளுக்கு ₹50 / SC/ST பிரிவுக்கு ₹2) செலுத்துதல்",
      "தரவரிசை மற்றும் கலந்தாய்வு அழைப்பு பெற மொபைல் எண் & மின்னஞ்சல்"
    ],
    "notesEn": "Enables applying to multiple government colleges across districts through a single centralized online form.",
    "notesTa": "ஒரே விண்ணப்பத்தின் மூலம் பல மாவட்டங்களில் உள்ள அரசு கலைக் கல்லூரிகளுக்கு எளிதாக விண்ணப்பிக்கலாம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNGASA Portal (tngasa.in)",
    "officialPortalUrl": "https://www.tngasa.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "EDU-1303",
    "category": "education_admissions",
    "department": "Directorate of School Education",
    "departmentTa": "பள்ளிக் கல்வி இயக்ககம்",
    "nameEn": "Right to Education (RTE 25%) Free Private School Online Admission",
    "nameTa": "கல்வி உரிமைச் சட்டம் – 25% இலவச தனியார் பள்ளி மாணவர் சேர்க்கை (RTE Admission)",
    "descriptionEn": "Online application for 25% reserved free seats in private non-minority matriculation, CBSE, and ICSE schools for children from Economically Weaker Sections (EWS) and Disadvantaged Groups under RTE Act.",
    "descriptionTa": "கல்வி உரிமைச் சட்டத்தின் கீழ் தனியார் பள்ளிகளில் LKG / 1-ஆம் வகுப்பில் 25% இடஒதுக்கீட்டில் 8-ஆம் வகுப்பு வரை கட்டணமில்லா இலவச சேர்க்கை பெற இணையவழி விண்ணப்பம்.",
    "eligibilityEn": "Children entering LKG or Class 1 residing within 1 km radius of eligible private schools, belonging to disadvantaged groups or weaker sections.",
    "eligibilityTa": "பள்ளியிலிருந்து 1 கி.மீ சுற்றளவில் வசிக்கும் நலிவடைந்த / விளிம்புநிலை குடும்பங்களைச் சேர்ந்த LKG / 1-ஆம் வகுப்பு குழந்தைகள்.",
    "requiredDocuments": [
      "Child Official Birth Certificate / Hospital Discharge Card",
      "Parent / Guardian Aadhaar Card",
      "Address Proof (Smart Ration Card / Voter ID / EB Bill / Registered Rental Agreement located within 1 km of school)",
      "Child Recent Colour Passport Size Photograph"
    ],
    "requiredDocumentsTa": [
      "குழந்தையின் அதிகாரப்பூர்வ பிறப்புச் சான்றிதழ்",
      "பெற்றோரின் ஆதார் அட்டை",
      "முகவரி ஆதாரம் (ஸ்மார்ட் ரேஷன் கார்டு / வாக்காளர் அட்டை / மின் கட்டணம் / பள்ளிக்கு 1 கி.மீ சுற்றளவிலான வாடகை ஒப்பந்தம்)",
      "குழந்தையின் பாஸ்போர்ட் அளவு வண்ணப் புகைப்படம்"
    ],
    "optionalDocuments": [
      "Parent Community Certificate (for BC / MBC / SC / ST category)"
    ],
    "optionalDocumentsTa": [
      "பெற்றோரின் சாதிச் சான்றிதழ்"
    ],
    "conditionalDocuments": [
      {
        "condition": "For Weaker Section Category (பொருளாதாரத்தில் நலிவடைந்த பிரிவு)",
        "conditionTa": "பொருளாதாரத்தில் நலிவடைந்த பிரிவு எனில்",
        "requirement": "Income Certificate showing total family annual income less than ₹2,00,000 issued by Tahsildar",
        "requirementTa": "குடும்ப ஆண்டு வருமானம் ₹2 லட்சத்திற்குள் உள்ளதற்கான வட்டாட்சியர் வருமானச் சான்றிதழ்"
      },
      {
        "condition": "For Disadvantaged Special Category (Orphan / HIV affected / Transgender / Child of Scavenger / Differently Abled)",
        "conditionTa": "சிறப்பு விளிம்புநிலை பிரிவு எனில்",
        "requirement": "Relevant Certificate issued by Competent Medical Authority / District Child Welfare Committee (CWC) / Tahsildar",
        "requirementTa": "சம்பந்தப்பட்ட அரசுத் துறை / மாவட்ட குழந்தைகள் நலக்குழு வழங்கிய அதிகாரப்பூர்வ சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "Child age criteria: LKG (3+ to 4 years as on 31st July) / 1st Standard (5+ to 6 years)",
      "Residential address must be strictly within 1 km aerial radius of the chosen private schools",
      "Maximum choice selection up to 5 private non-minority schools in neighborhood",
      "Active mobile number to receive online random lottery selection result SMS"
    ],
    "prerequisitesTa": [
      "வயது வரம்பு: LKG (31 ஜூலை நிலவரப்படி 3+ முதல் 4 வயது வரை) / 1-ஆம் வகுப்பு (5+ முதல் 6 வயது வரை)",
      "இருப்பிடம் தனியார் பள்ளியிலிருந்து 1 கி.மீ சுற்றளவுக்குள் இருத்தல் அவசியம்",
      "அதிகபட்சம் 5 பள்ளிகள் வரை தேர்வு செய்யலாம்",
      "ஆன்லைன் குலுக்கல் தேர்வு முடிவுகள் பெற செயல்பாட்டில் உள்ள மொபைல் எண்"
    ],
    "notesEn": "Selected students receive 100% free schooling from LKG up to Class 8. No school fees or tuition fees payable by parents.",
    "notesTa": "தேர்வு செய்யப்படும் குழந்தைகளுக்கு LKG முதல் 8-ஆம் வகுப்பு வரை எந்தவித கட்டணமும் இன்றி 100% இலவச கல்வி வழங்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TN RTE Online Portal (rte.tnschools.gov.in)",
    "officialPortalUrl": "https://rte.tnschools.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "LAB-1401",
    "category": "unorganised_welfare_board",
    "department": "Tamil Nadu Unorganised Workers Welfare Board (TNUWWB)",
    "departmentTa": "தமிழ்நாடு அமைப்புசாரா தொழிலாளர் நல வாரியம்",
    "nameEn": "Unorganised & Construction Workers Welfare Board Online New Registration",
    "nameTa": "அமைப்புசாரா மற்றும் கட்டுமான தொழிலாளர் நல வாரிய புதிய பதிவு (TNUWWB Registration)",
    "descriptionEn": "Online registration for Construction, Manual Labor, Tailoring, Auto/Taxi Driver, Agricultural, Washermen, Hairdressers, and other unorganised workers in Tamil Nadu Welfare Boards for comprehensive social security benefits.",
    "descriptionTa": "கட்டுமானம், ஆட்டோ ஓட்டுநர்கள், தையல், சுமை தூக்குவோர் உள்ளிட்ட 18 அமைப்புசாரா தொழிலாளர் நல வாரியங்களில் புதிய உறுப்பினராக பதிவு செய்யும் சேவை.",
    "eligibilityEn": "Workers aged 18 to 60 years engaged in manual, construction, informal trade, or unorganised labor in Tamil Nadu.",
    "eligibilityTa": "18 முதல் 60 வயதுடைய கட்டுமான மற்றும் அமைப்புசாரா தொழிலாளர்கள்.",
    "requiredDocuments": [
      "Worker Aadhaar Card",
      "Smart Ration Card / Family Card",
      "First Page of Worker Single Bank Account Passbook (Aadhaar linked)",
      "Age Proof (School TC / Birth Certificate / Voter ID / Driving Licence)",
      "Employment / Work Engagement Certificate (Certified by VAO / Registered Trade Union / Registered Contractor / Labor Officer)",
      "Worker Passport Size Photo"
    ],
    "requiredDocumentsTa": [
      "தொழிலாளியின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "தொழிலாளியின் பெயரிலான வங்கி சேமிப்புக் கணக்கு பாஸ்புக் (ஆதார் இணைக்கப்பட்டது)",
      "வயது சான்று (பள்ளி TC / வாக்காளர் அட்டை / ஓட்டுநர் உரிமம்)",
      "கிராம நிர்வாக அலுவலர் (VAO) அல்லது தொழிற்சங்கம் அல்லது ஒப்பந்ததாரர் சான்றளித்த தொழில் சான்றிதழ்",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Nominee Aadhaar Card Copy and Photo"
    ],
    "optionalDocumentsTa": [
      "வாரிசுதாரரின் ஆதார் அட்டை மற்றும் புகைப்படம்"
    ],
    "conditionalDocuments": [
      {
        "condition": "For Construction Workers Welfare Board (TNCWWB)",
        "conditionTa": "கட்டுமானத் தொழிலாளர் நல வாரியம் எனில்",
        "requirement": "90 Days Construction Work Certificate issued by Registered Employer / Civil Engineer / Union Secretary",
        "requirementTa": "90 நாட்கள் கட்டுமானப் பணி செய்ததற்கான பதிவுபெற்ற ஒப்பந்ததாரர் / பொறியாளர் சான்றிதழ்"
      },
      {
        "condition": "For Driver and Auto Workers Board",
        "conditionTa": "ஓட்டுநர் நல வாரியம் எனில்",
        "requirement": "Valid Driving Licence and Badge Endorsement / Vehicle details",
        "requirementTa": "செல்லுபடியாகும் ஓட்டுநர் உரிமம் மற்றும் பேட்ஜ் நகல்"
      }
    ],
    "prerequisites": [
      "Worker age between 18 and 60 years",
      "Engaged in unorganised manual / trade / informal profession in Tamil Nadu",
      "Active mobile number linked with Aadhaar for OTP verification"
    ],
    "prerequisitesTa": [
      "வயது 18 முதல் 60 வரை இருத்தல்",
      "தமிழ்நாட்டில் அமைப்புசாரா தொழில் செய்பவராக இருத்தல்",
      "OTP சரிபார்ப்புக்கு மொபைல் எண்"
    ],
    "notesEn": "Registered members are eligible for Marriage Assistance (up to ₹50,000), Maternity Aid (₹18,000), Education Aid, Accidental Relief (₹5,00,000), and Monthly Pension (₹1,000) at age 60.",
    "notesTa": "திருமண உதவி, மகப்பேறு உதவி ₹18,000, கல்வி உதவி, விபத்து நிவாரணம் ₹5 லட்சம் மற்றும் 60 வயதில் மாதாந்திர ஓய்வூதியம் ₹1,000 பெறலாம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nadu Unorganised Workers Welfare Board (tnuwwb.tn.gov.in)",
    "officialPortalUrl": "https://tnuwwb.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "LAB-1402",
    "category": "unorganised_welfare_board",
    "department": "Tamil Nadu Unorganised Workers Welfare Board (TNUWWB)",
    "departmentTa": "தமிழ்நாடு அமைப்புசாரா தொழிலாளர் நல வாரியம்",
    "nameEn": "TNUWWB Welfare Scheme Claim Assistance (Education / Marriage / Maternity / Pension)",
    "nameTa": "தொழிலாளர் நல வாரிய உதவித்தொகை விண்ணப்பம் (கல்வி / திருமணம் / மகப்பேறு / ஓய்வூதியம்)",
    "descriptionEn": "Online submission of claim applications for financial benefits including educational assistance for children, daughter/son marriage assistance, maternity benefit, funeral expense relief, and monthly old-age pension for registered welfare board members.",
    "descriptionTa": "நல வாரியத்தில் பதிவு செய்த உறுப்பினர்கள் தங்களின் பிள்ளைகளின் கல்வி உதவித்தொகை, திருமண உதவி, மகப்பேறு உதவி மற்றும் மாதாந்திர ஓய்வூதியம் பெற ஆன்லைனில் விண்ணப்பிக்கும் சேவை.",
    "eligibilityEn": "Active registered members of Tamil Nadu Unorganised Workers Welfare Boards.",
    "eligibilityTa": "நல வாரியத்தில் பதிவு செய்துள்ள நடப்பு உறுப்பினர்கள்.",
    "requiredDocuments": [
      "TNUWWB Worker Smart Registration Card / Membership Certificate Copy",
      "Worker Aadhaar Card",
      "Smart Ration Card / Family Card",
      "Worker Bank Account Passbook (Aadhaar linked for DBT)",
      "Worker Passport Size Photo"
    ],
    "requiredDocumentsTa": [
      "நல வாரிய உறுப்பினர் ஸ்மார்ட் கார்டு / பதிவு சான்றிதழ் நகல்",
      "தொழிலாளியின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "வங்கி பாஸ்புக் நகல் (ஆதார் இணைக்கப்பட்டது)",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Live Membership Renewal Slip"
    ],
    "optionalDocumentsTa": [
      "உறுப்பினர் புதுப்பித்தல் ஒப்புகைச் சீட்டு"
    ],
    "conditionalDocuments": [
      {
        "condition": "For Children Education Scholarship Claim (கல்வி உதவித்தொகை கோரினால்)",
        "conditionTa": "பிள்ளைகளுக்கான கல்வி உதவித்தொகை கோரினால்",
        "requirement": "Child 10th / 12th / ITI / Diploma / Degree Mark Sheet & Current Academic Year School / College Bonafide Certificate",
        "requirementTa": "பிள்ளையின் மதிப்பெண் சான்றிதழ் மற்றும் பள்ளி / கல்லூரி நடப்பு ஆண்டு Bonafide சான்றிதழ்"
      },
      {
        "condition": "For Marriage Assistance Claim (திருமண உதவித்தொகை கோரினால்)",
        "conditionTa": "திருமண உதவித்தொகை கோரினால்",
        "requirement": "Marriage Registration Certificate and Original Wedding Invitation Card",
        "requirementTa": "பதிவு செய்யப்பட்ட திருமணச் சான்றிதழ் மற்றும் அசல் திருமண அழைப்பிதழ்"
      },
      {
        "condition": "For Maternity Assistance Claim (மகப்பேறு உதவித்தொகை கோரினால்)",
        "conditionTa": "மகப்பேறு உதவித்தொகை கோரினால்",
        "requirement": "Child Birth Certificate and Hospital Discharge Summary / RCH Health Card",
        "requirementTa": "குழந்தையின் பிறப்புச் சான்றிதழ் மற்றும் தாய்-சேய் நல அட்டை (RCH Card)"
      },
      {
        "condition": "For Monthly Old-Age Pension (60 வயது முதியோர் ஓய்வூதியம் – ₹1,000/மாதம்)",
        "conditionTa": "60 வயது பூர்த்தியடைந்த மாதாந்திர ஓய்வூதியம் கோரினால்",
        "requirement": "Age Proof certifying completion of 60 years and Continuous 5-year active Board membership verification",
        "requirementTa": "60 வயது பூர்த்தி அடைந்ததற்கான சான்று & 5 ஆண்டுகள் தொடர்ந்து உறுப்பினராக இருந்ததற்கான சான்று"
      }
    ],
    "prerequisites": [
      "Active live membership status in TNUWWB without lapsed registration",
      "Minimum required continuous membership duration depending on the specific benefit scheme",
      "Bank account seeded with Aadhaar for Direct Benefit Transfer (DBT)",
      "Active mobile number for status alerts"
    ],
    "prerequisitesTa": [
      "நல வாரியத்தில் புதுப்பிக்கப்பட்ட நேரடி உறுப்பினர் நிலை",
      "குறிப்பிட்ட உதவித்தொகை திட்டத்திற்கான குறைந்தபட்ச உறுப்பினர் காலம்",
      "ஆதார் இணைக்கப்பட்ட வங்கி சேமிப்புக் கணக்கு",
      "செயல்பாட்டில் உள்ள மொபைல் எண்"
    ],
    "notesEn": "Sanctioned assistance is credited directly into the member’s bank account following scrutiny by the Labor Enforcement Officer.",
    "notesTa": "தொழிலாளர் நல அலுவலரின் கள ஆய்வுக்குப் பின் உதவித்தொகை நேரடியாக வங்கி கணக்கில் வரவு வைக்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nadu Unorganised Workers Welfare Board (tnuwwb.tn.gov.in)",
    "officialPortalUrl": "https://tnuwwb.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "FSH-1501",
    "category": "fisheries_welfare",
    "department": "Department of Fisheries and Fishermen Welfare",
    "departmentTa": "மீன்வளம் மற்றும் மீனவர் நலத்துறை",
    "nameEn": "Fishermen Welfare Scheme & Lean Period Financial Relief Application",
    "nameTa": "மீனவர் சேமிப்பு மற்றும் மீன்பிடி தடைக்கால நிவாரண உதவி விண்ணப்பம்",
    "descriptionEn": "Online registration and annual financial relief assistance application for sea-going marine and inland fishermen during the annual fishing ban period, lean season, and disaster relief periods.",
    "descriptionTa": "மீன்பிடி தடைக்காலம் மற்றும் மீன்பிடிப்பு குறைந்த காலங்களில் மீனவர்களுக்கு ஆண்டு நிவாரண உதவித்தொகை மற்றும் நலத்திட்ட உதவிகள் பெறும் சேவை.",
    "eligibilityEn": "Active marine and inland traditional fishermen holding valid Fishermen Biometric Identity Card / Welfare Board membership.",
    "eligibilityTa": "மீனவர் பயோமெட்ரிக் அட்டை வைத்துள்ள பாரம்பரிய கடல் மற்றும் உள்நாட்டு மீனவர்கள்.",
    "requiredDocuments": [
      "Marine / Inland Fishermen Biometric Identity Card / Fishermen Board Membership Card",
      "Applicant Fisherman Aadhaar Card",
      "Smart Ration Card / Family Card",
      "First Page of Fisherman Single Bank Account Passbook (Aadhaar linked)",
      "Passport Size Photograph"
    ],
    "requiredDocumentsTa": [
      "மீனவர் பயோமெட்ரிக் ஸ்மார்ட் அடையாள அட்டை / மீனவர் நல வாரிய அட்டை",
      "மீனவரின் ஆதார் அட்டை",
      "குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு",
      "வங்கி சேமிப்புக் கணக்கு பாஸ்புக் (ஆதார் இணைக்கப்பட்டது)",
      "பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Mechanised / Motorised Boat Registration Certificate & Fishing Licence Copy (if boat owner)"
    ],
    "optionalDocumentsTa": [
      "படகு பதிவுச் சான்றிதழ் மற்றும் மீன்பிடி உரிம நகல் (படகு உரிமையாளராயின்)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If applying for Fishermen Free Concrete Housing Scheme (இலவச கான்கிரீட் வீடு)",
        "conditionTa": "இலவச கான்கிரீட் வீடு கட்டும் திட்டம் எனில்",
        "requirement": "Land Patta / Coastal Allotment Order in applicant name & Non-Encumbrance Certificate (EC)",
        "requirementTa": "விண்ணப்பதாரர் பெயரிலான பட்டா / ஒதுக்கீட்டு ஆணை மற்றும் வில்லங்கச் சான்று"
      }
    ],
    "prerequisites": [
      "Active membership in registered Primary Fishermen / Fisherwomen Cooperative Society",
      "Engaged in active direct fishing profession in Tamil Nadu coastal or inland water bodies",
      "Active Aadhaar-seeded bank account for DBT payment"
    ],
    "prerequisitesTa": [
      "மீனவர் தொடக்க கூட்டுறவு சங்கத்தில் பதிவு பெற்ற நேரடி உறுப்பினர்",
      "நேரடி மீன்பிடித் தொழில் செய்பவராக இருத்தல்",
      "ஆதார் இணைக்கப்பட்ட வங்கி சேமிப்புக் கணக்கு"
    ],
    "notesEn": "Provides ₹5,000 to ₹8,000 fishing ban period relief and national savings-cum-relief matching contribution credited directly to bank account.",
    "notesTa": "மீன்பிடி தடைக்கால நிவாரணம் மற்றும் சேமிப்பு நிவாரணத் தொகை நேரடியாக வங்கி கணக்கில் வரவு வைக்கப்படுகிறது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Fisheries and Fishermen Welfare Department (fisheries.tn.gov.in)",
    "officialPortalUrl": "https://fisheries.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "FIR-1601",
    "category": "fire_rescue_noc",
    "department": "Tamil Nadu Fire and Rescue Services Department (TNFRS)",
    "departmentTa": "தீயணைப்பு மற்றும் மீட்புப் பணிகள் துறை",
    "nameEn": "Fire & Rescue Services No Objection Certificate (NOC)",
    "nameTa": "தீயணைப்புத்துறை தடையில்லாச் சான்றிதழ் (Fire NOC Application)",
    "descriptionEn": "Online application, fee payment, and compliance certificate processing for Fire Safety No Objection Certificate (NOC) for schools, colleges, hospitals, commercial complexes, marriage halls, high-rise buildings, fuel stations, and industrial units.",
    "descriptionTa": "பள்ளிகள், கல்லூரிகள், மருத்துவமனைகள், திருமண மண்டபங்கள், வணிக வளாகங்கள் மற்றும் தொழிற்சாலைகளுக்கு தீயணைப்புத்துறை தடையில்லாச் சான்றிதழ் (NOC) பெறும் சேவை.",
    "eligibilityEn": "Building owners, institutional heads, commercial tenants, or industrial managements requiring statutory Fire NOC.",
    "eligibilityTa": "வணிக நிறுவனங்கள், கல்வி நிறுவனங்கள், மருத்துவமனைகள் மற்றும் கட்டிட உரிமையாளர்கள்.",
    "requiredDocuments": [
      "Registered Property Document / Lease Agreement / Rental Deed Copy",
      "Approved Building Plan Blueprint (with marked fire escape exits, emergency staircases, and driveway)",
      "Building Structural Stability Certificate issued by Chartered Structural Engineer",
      "Fire Fighting Equipment Layout Plan and Invoices (Fire Extinguishers, Hose Reels, Yard Hydrants, Sprinklers)",
      "Latest Property Tax Receipt / Local Body Assessment Copy"
    ],
    "requiredDocumentsTa": [
      "சொத்து கிரயப் பத்திரம் / குத்தகை ஒப்பந்தப் பத்திரம்",
      "அங்கீகரிக்கப்பட்ட கட்டிட வரைபடம் (அவசர கால வழி, படிக்கட்டுகள் குறிக்கப்பட்டது)",
      "சான்றளிக்கப்பட்ட பொறியாளரின் கட்டிட உறுதித்தன்மை சான்றிதழ் (Stability Certificate)",
      "தீயணைப்பு உபகரணங்கள் அமைக்கப்பட்ட வரைபடம் மற்றும் கொள்முதல் ரசீதுகள்",
      "நடப்பு சொத்துவரி செலுத்திய ரசீது"
    ],
    "optionalDocuments": [
      "Local Body Trade Licence / Industrial Consent copy"
    ],
    "optionalDocumentsTa": [
      "உள்ளாட்சி தொழில் உரிம நகல்"
    ],
    "conditionalDocuments": [
      {
        "condition": "For High-Rise Commercial / Industrial Buildings (above 15 meters in height)",
        "conditionTa": "15 மீட்டருக்கு மேல் உயரமுள்ள அடுக்குமாடி வணிக கட்டிடங்கள் எனில்",
        "requirement": "Directorate of Fire and Rescue Services Technical Scrutiny Committee Approval & Automatic Sprinkler / Underground Sump capacity compliance certificate",
        "requirementTa": "தீயணைப்பு இயக்கக தொழில்நுட்பக் குழுவின் ஒப்புதல் மற்றும் தானியங்கி தீயணைப்பு நீர் தொட்டி சான்று"
      }
    ],
    "prerequisites": [
      "Installation of mandatory fire safety extinguishers, signage, and evacuation pathways as per National Building Code (NBC Part IV)",
      "Payment of official government inspection and scrutiny fee online",
      "Physical inspection of premises and mock fire drill demonstration by Station Fire Officer (SFO) / District Fire Officer (DFO)"
    ],
    "prerequisitesTa": [
      "தேசிய கட்டிட விதிகளின்படி தீயணைப்பு கருவிகள் மற்றும் அவசரகால வழிகள் அமைத்திருத்தல்",
      "அரசு ஆய்வுக் கட்டணம் இணையவழியில் செலுத்துதல்",
      "தீயணைப்பு நிலைய அலுவலரின் நேரடி தள ஆய்வு மற்றும் பரிசோதனை"
    ],
    "notesEn": "Statutory Fire NOC is valid for 1 year (commercial/hospitals/schools) or 3 years (residential) and is mandatory for local body trade licenses, CBSE/state school affiliations, and hospital NABH accreditation.",
    "notesTa": "பள்ளி அங்கீகாரம், மருத்துவமனை உரிமம் மற்றும் வணிக உரிமங்களுக்கு தீயணைப்பு NOC சான்றிதழ் கட்டாயமானது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "TNFRS Citizen Portal (tnfrs.tn.gov.in)",
    "officialPortalUrl": "https://tnfrs.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "DRG-1701",
    "category": "drug_control",
    "department": "Drugs Control Administration",
    "departmentTa": "மருந்து கட்டுப்பாட்டு நிர்வாக இயக்ககம்",
    "nameEn": "Retail & Wholesale Pharmacy Drug Sale License Application (Form 20 / 21)",
    "nameTa": "மருந்து விற்பனை உரிமம் – மெடிக்கல் ஷாப் / மொத்த விற்பனை (Drug License Form 20/21)",
    "descriptionEn": "Online application and statutory documentation assistance for granting Retail (Form 20 / Form 21) and Wholesale (Form 20B / Form 21B) Drug Licenses to operate pharmacies, medical shops, and pharmaceutical wholesale distribution.",
    "descriptionTa": "புதிய மெடிக்கல் ஷாப் மற்றும் மொத்த மருந்து விற்பனை நிறுவனம் தொடங்க படிவம் 20, 21-ன் கீழ் மருந்து விற்பனை உரிமம் பெற இணையவழி விண்ணப்பம்.",
    "eligibilityEn": "Registered Pharmacists, proprietors, partnerships, or corporate entities setting up pharmaceutical retail or wholesale premises.",
    "eligibilityTa": "பதிவுபெற்ற மருந்தாளுநர்கள் மற்றும் புதிய மெடிக்கல் ஷாப் தொடங்க விரும்பும் தொழில்முனைவோர்.",
    "requiredDocuments": [
      "Registered Pharmacist Registration Certificate (issued by Tamil Nadu Pharmacy Council) and Renewal Receipt",
      "Pharmacist Appointment Letter, Bio-data, and Pharmacist Consent Affidavit",
      "Registered Rent Agreement / Lease Deed / Ownership Document of Shop Premises",
      "Key Plan and Site Blueprint Layout Sketch of the Shop (minimum 10 sq.m carpet area for retail / 15 sq.m for retail+wholesale)",
      "Invoice and Warranty Bill of 24x7 Refrigerator (for cold-storage medicines storage between 2°C to 8°C)",
      "Applicant / Proprietor Aadhaar Card, PAN Card, and Passport Size Photograph"
    ],
    "requiredDocumentsTa": [
      "தமிழ்நாடு பார்மசி கவுன்சில் வழங்கிய மருந்தாளுநர் பதிவுச் சான்றிதழ் மற்றும் நடப்பு புதுப்பித்தல் ரசீது",
      "மருந்தாளுநர் நியமனக் கடிதம் மற்றும் ஒப்புதல் பிரமாணப் பத்திரம்",
      "கடை வாடகை ஒப்பந்தப் பத்திரம் / கிரயப் பத்திரம்",
      "கடை அளவு வரைபடம் (குறைந்தபட்சம் 10 சதுர மீட்டர் பரப்பளவு)",
      "குளிர்சாதனப் பெட்டி வாங்கிய ரசீது (Refrigerator Bill)",
      "விண்ணப்பதாரரின் ஆதார் அட்டை, பான் கார்டு மற்றும் பாஸ்போர்ட் அளவு புகைப்படம்"
    ],
    "optionalDocuments": [
      "Partnership Deed / Certificate of Incorporation (if partnership / private limited company)"
    ],
    "optionalDocumentsTa": [
      "கூட்டு வணிக ஒப்பந்தப் பத்திரம் / நிறுவன பதிவுச் சான்றிதழ் (நிறுவனம் எனில்)"
    ],
    "conditionalDocuments": [
      {
        "condition": "For Wholesale Drug License Application (Form 20B & 21B)",
        "conditionTa": "மொத்த மருந்து விற்பனை உரிமம் (Wholesale) எனில்",
        "requirement": "Competent Person Experience Certificate (minimum 4 years continuous experience in approved wholesale drug firm) OR Registered Pharmacist degree/diploma",
        "requirementTa": "தகுதியான நபரின் 4 ஆண்டுகள் அனுபவச் சான்றிதழ் அல்லது பதிவுபெற்ற மருந்தாளுநர் சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "Appointment of a dedicated, full-time Registered Pharmacist holding valid Tamil Nadu Pharmacy Council registration",
      "Dedicated commercial shop premises with minimum 10 sq.m (retail) or 15 sq.m (wholesale) carpet area",
      "Mandatory functional 24x7 refrigerator for cold-chain vaccines and temperature-sensitive pharmaceuticals",
      "Payment of statutory government license fees online (₹3,000 per form)",
      "Physical inspection of premises and pharmacist verification by jurisdictional Senior Drugs Inspector"
    ],
    "prerequisitesTa": [
      "முழு நேர பதிவுபெற்ற மருந்தாளுநரின் இருப்பு",
      "குறைந்தபட்சம் 10 சதுர மீட்டர் வணிக கடை வசதி",
      "செயல்பாட்டில் உள்ள குளிர்சாதனப் பெட்டி",
      "அரசு உரிமக் கட்டணம் இணையவழியில் செலுத்துதல்",
      "மருந்து ஆய்வாளரின் நேரடி கள ஆய்வு"
    ],
    "notesEn": "Issued under the Drugs and Cosmetics Act 1940 and Rules 1945. Grants legal authorization to stock, sell, and dispense Allopathic medications and schedule drugs.",
    "notesTa": "மருந்துகள் மற்றும் அழகுசாதனப் பொருட்கள் சட்டத்தின் கீழ் வழங்கப்படும் அதிகாரப்பூர்வ சட்டப்பூர்வ உரிமம்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nadu Drugs Control Administration (drugscontrol.tn.gov.in)",
    "officialPortalUrl": "https://drugscontrol.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "ELI-1801",
    "category": "electrical_inspectorate",
    "department": "Tamil Nadu Electrical Inspectorate (TNEI)",
    "departmentTa": "மின் ஆய்வுத்துறை (TNEI)",
    "nameEn": "Electrical Safety Certificate & Passenger Lift License Application",
    "nameTa": "மின் ஆய்வுத்துறை பாதுகாப்புச் சான்றிதழ் & லிப்ட் உரிமம் (Electrical Safety & Lift License)",
    "descriptionEn": "Statutory online application for Electrical Safety Inspection Certificate and Lift Erection/Operation License (under TN Lift Act) for high-voltage transformers, HT power installations, DG generator sets, multi-storey buildings, and commercial passenger/goods lifts.",
    "descriptionTa": "உயர் அழுத்த மின்மாற்றி (Transformer), ஜெனரேட்டர் (DG Set) மற்றும் வணிக கட்டிட லிப்ட் இயக்குவதற்கான மின் ஆய்வுத்துறை பாதுகாப்புச் சான்றிதழ் & லிப்ட் உரிமம் பெறும் சேவை.",
    "eligibilityEn": "Building developers, industrial factories, commercial complexes, hospitals, and educational institutions commissioning HT substations, captive generators, or lifts.",
    "eligibilityTa": "உயர் அழுத்த மின் வசதி மற்றும் லிப்ட் நிறுவும் கட்டிட உரிமையாளர்கள் மற்றும் தொழிற்சாலைகள்.",
    "requiredDocuments": [
      "Electrical Contractor Work Completion Report and Test Certificate (Form A issued by Class ESA / EA Licensed Electrical Contractor)",
      "Complete Single-Line Schematic Circuit Diagram (SLD) and Equipment Layout Drawing signed by Licensed Engineer",
      "Manufacturer Factory Test Reports and Purchase Invoices for Transformer, DG Set, or Switchgear equipment",
      "Building Approved Plan Drawing and Property Ownership / Lease Deed Copy",
      "Applicant Company PAN, GST, and Authorized Signatory Aadhaar Card"
    ],
    "requiredDocumentsTa": [
      "அங்கீகரிக்கப்பட்ட மின் ஒப்பந்ததாரர் வழங்கிய பணி நிறைவு சான்றிதழ் மற்றும் பரிசோதனை அறிக்கை (Form A)",
      "மின் சுற்று வரைபடம் (Single Line Diagram – SLD)",
      "மின்மாற்றி / ஜெனரேட்டர் தயாரிப்பு நிறுவனத்தின் பரிசோதனை அறிக்கை மற்றும் பில்",
      "அங்கீகரிக்கப்பட்ட கட்டிட வரைபடம் மற்றும் சொத்து ஆவணம்",
      "நிறுவனத்தின் பான் கார்டு, ஜிஎஸ்டி மற்றும் விண்ணப்பதாரரின் ஆதார் அட்டை"
    ],
    "optionalDocuments": [
      "Tamil Nadu Pollution Control Board (TNPCB) DG Set Consent Order Copy"
    ],
    "optionalDocumentsTa": [
      "மாசு கட்டுப்பாட்டு வாரிய இசைவு ஆணை நகல்"
    ],
    "conditionalDocuments": [
      {
        "condition": "For Passenger / Goods Lift License Application (Form ‘A’ & ‘B’ under TN Lifts Act)",
        "conditionTa": "லிப்ட் இயக்குவதற்கான உரிமத்திற்கு விண்ணப்பித்தால்",
        "requirement": "Authorized Lift Manufacturing Company Annual Maintenance Contract (AMC) & Full-Load Safety Drop Test Certificate",
        "requirementTa": "லிப்ட் தயாரிப்பு நிறுவனத்தின் வருடாந்திர பராமரிப்பு ஒப்பந்தம் (AMC) & சுமை பாதுகாப்பு பரிசோதனை சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "Physical installation and earthing testing completed by a Class ESA / EA Licensed Electrical Contractor",
      "Payment of prescribed Electrical Inspectorate statutory inspection fee tariff online",
      "On-site physical inspection, insulation testing, and safety trip mechanism verification by Assistant Electrical Inspector / CEIG"
    ],
    "prerequisitesTa": [
      "அங்கீகரிக்கப்பட்ட ஒப்பந்ததாரரால் மின் பணிகள் மற்றும் எர்த்திங் சோதனைகள் முடிக்கப்பட்டிருத்தல்",
      "அரசு மின் ஆய்வுக் கட்டணம் இணையவழியில் செலுத்துதல்",
      "மின் ஆய்வாளரின் நேரடி தள ஆய்வு மற்றும் பரிசோதனை"
    ],
    "notesEn": "Mandatory statutory safety clearance required before energizing high-voltage (HV/HT) installations, multi-story buildings, cinema theaters, hospitals, and passenger lifts.",
    "notesTa": "உயர் அழுத்த மின் இணைப்பு பெறுவதற்கும், லிப்ட் இயக்குவதற்கும் மின் ஆய்வுத்துறை பாதுகாப்புச் சான்றிதழ் கட்டாயமானது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nadu Electrical Inspectorate (tnei.tn.gov.in)",
    "officialPortalUrl": "https://tnei.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "WQF-1901",
    "category": "waqf_board",
    "department": "Tamil Nadu Waqf Board",
    "departmentTa": "தமிழ்நாடு வக்ஃபு வாரியம்",
    "nameEn": "Tamil Nadu Waqf Board Property Registration & Welfare Scheme Assistance",
    "nameTa": "தமிழ்நாடு வக்ஃபு வாரிய பதிவு & உலமாக்கள் நலத்திட்ட உதவி விண்ணப்பம்",
    "descriptionEn": "Online documentation assistance for registering new Auqaf (mosques, madrasas, dargahs, burial grounds, and charitable endowments) under Section 36 of Waqf Act 1995, and processing financial grants, major mosque repair subsidies, and Ulama Welfare Board assistance.",
    "descriptionTa": "பள்ளிவாசல்கள், மதரஸாக்கள், தர்காக்கள் மற்றும் வக்ஃபு சொத்துக்களை பதிவு செய்தல், பள்ளிவாசல் புனரமைப்பு மானியம் மற்றும் உலமாக்கள் நல வாரிய உதவிகள் பெறும் சேவை.",
    "eligibilityEn": "Mutawallis, Waqf Managing Committees, Ulama personnel, or donors dedicating immovable property for Islamic charitable/religious endowments.",
    "eligibilityTa": "முத்தவல்லிகள், பள்ளிவாசல் நிர்வாகக் குழுவினர், உலமாக்கள் மற்றும் பொதுமக்கள்.",
    "requiredDocuments": [
      "Waqf Endowment Deed / Inam Title Deed / Registered Dedication Document Copy",
      "List of Managing Committee Members / Mutawalli with Aadhaar Cards and Photos",
      "Waqf Immovable Property Revenue Records (Patta / Chitta / TSLR Extract / Municipal Tax Receipts)",
      "Latest Audited Annual Statement of Income, Expenditure, and Assets of the Waqf",
      "Formal Resolution of the Mosque / Waqf Managing Committee"
    ],
    "requiredDocumentsTa": [
      "வக்ஃபு தானப் பத்திரம் / பட்டா / பதிவு செய்யப்பட்ட ஆவண நகல்",
      "முத்தவல்லி / நிர்வாகக் குழு உறுப்பினர்களின் ஆதார் அட்டைகள் & புகைப்படங்கள்",
      "வக்ஃபு சொத்தின் பட்டா, சிட்டா, TSLR மற்றும் நகராட்சி வரி ரசீதுகள்",
      "வக்ஃபு சொத்தின் தணிக்கை செய்யப்பட்ட வரவு செலவு கணக்கு அறிக்கை",
      "பள்ளிவாசல் / வக்ஃபு நிர்வாகக் குழுவின் தீர்மான நகல்"
    ],
    "optionalDocuments": [
      "30-Year Encumbrance Certificate (EC) of Waqf immovable property"
    ],
    "optionalDocumentsTa": [
      "வக்ஃபு சொத்தின் 30 ஆண்டுகால வில்லங்கச் சான்றிதழ் (EC)"
    ],
    "conditionalDocuments": [
      {
        "condition": "For Ulama / Peshimam / Muazzin Welfare Board Financial Assistance & Monthly Pension",
        "conditionTa": "உலமாக்கள் / பேஷ்இமாம் / முஅத்தின் மாதாந்திர உதவித்தொகை கோரினால்",
        "requirement": "Ulama Welfare Board Identity Card, Mosque Service Certificate signed by Mutawalli, and Aadhaar-linked Bank Passbook",
        "requirementTa": "உலமாக்கள் நல வாரிய அட்டை, முத்தவல்லி சான்றளித்த பணிச் சான்றிதழ் மற்றும் வங்கி பாஸ்புக்"
      },
      {
        "condition": "For Major Mosque / Dargah Repair & Renovation Government Grant",
        "conditionTa": "பள்ளிவாசல் பழுதுபார்ப்பு மற்றும் புனரமைப்பு அரசு மானியம் கோரினால்",
        "requirement": "Detailed Engineering Estimate prepared by Registered Civil Engineer and Site Photographs of the dilapidated structure",
        "requirementTa": "பொறியாளர் தயாரித்த மதிப்பீட்டு அறிக்கை மற்றும் பழுதடைந்த கட்டிட புகைப்படங்கள்"
      }
    ],
    "prerequisites": [
      "Property dedicated permanently for Islamic religious, pious, or charitable purposes",
      "Active management committee / registered Mutawalli approved by Tamil Nadu Waqf Board",
      "Payment of statutory annual Waqf Board contribution assessment"
    ],
    "prerequisitesTa": [
      "மத மற்றும் தர்ம நோக்கங்களுக்காக அர்ப்பணிக்கப்பட்ட சொத்து",
      "வக்ஃபு வாரியத்தால் அங்கீகரிக்கப்பட்ட முத்தவல்லி / நிர்வாகக் குழு",
      "ஆண்டு வக்ஃபு வாரிய பங்களிப்புச் செலுத்துதல்"
    ],
    "notesEn": "Statutory registration under Section 36 of Waqf Act 1995 protects Auqaf properties from encroachment and enables government grants, interest-free loans, and legal protection.",
    "notesTa": "வக்ஃபு சட்டம் 1995-ன் படி சொத்துக்களைப் பாதுகாக்கவும், அரசின் புனரமைப்பு மானியங்கள் பெறவும் உதவுகிறது.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Tamil Nadu Waqf Board Portal (tnwaqfboard.tn.gov.in)",
    "officialPortalUrl": "https://tnwaqfboard.tn.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "NAT-2001",
    "category": "identity_national",
    "department": "Unique Identification Authority of India (UIDAI)",
    "departmentTa": "இந்திய தனித்துவ அடையாள ஆணையம் (UIDAI)",
    "nameEn": "Aadhaar Online Address Update (Supporting Document / HoF Based)",
    "nameTa": "ஆதார் முகவரி திருத்தம் / புதுப்பித்தல் (Aadhaar Online Address Update)",
    "descriptionEn": "Online request for updating residential address in Aadhaar via myAadhaar portal using standard Proof of Address (PoA) document or Head of Family (HoF) based validation.",
    "descriptionTa": "செல்லுபடியாகும் முகவரி ஆதாரம் அல்லது குடும்பத் தலைவர் (HoF) ஒப்புதல் மூலம் ஆதாரில் உள்ள முகவரியை இணையவழியில் புதுப்பிக்கும் சேவை.",
    "eligibilityEn": "Any Aadhaar card holder whose mobile number is registered with Aadhaar seeking address update.",
    "eligibilityTa": "ஆதாரில் மொபைல் எண் இணைக்கப்பட்டுள்ள அனைவரும்.",
    "requiredDocuments": [
      "Valid Proof of Address (PoA) in applicant name (Passport / Voter ID / Ration Card / Electricity Bill / Bank Passbook / Post Office Passbook / Water Bill / Gas Connection Bill / Registered Rent Agreement / Municipal Tax Receipt / UIDAI Standard Certificate)"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரர் பெயரிலான செல்லுபடியாகும் முகவரி ஆதாரம் (பாஸ்போர்ட் / வாக்காளர் அட்டை / ரேஷன் கார்டு / மின் கட்டண ரசீது / வங்கி பாஸ்புக் / வாடகை ஒப்பந்தம் / சொத்துவரி ரசீது / UIDAI படிவம்)"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [
      {
        "condition": "If updating address without individual PoA document via Head of Family (HoF) method",
        "conditionTa": "சுய முகவரி ஆவணம் இன்றி குடும்பத் தலைவர் (HoF) ஒப்புதல் மூலம் முகவரி மாற்றினால்",
        "requirement": "Proof of Relationship (PoR) document (Ration Card / Birth Certificate / Marriage Certificate / Passport) AND HoF Aadhaar with HoF OTP consent",
        "requirementTa": "உறவுமுறை சான்று (ரேஷன் கார்டு / பிறப்புச் சான்றிதழ் / திருமணச் சான்றிதழ் / பாஸ்போர்ட்) மற்றும் குடும்பத் தலைவரின் ஆதார் & OTP ஒப்புதல்"
      }
    ],
    "prerequisites": [
      "12-digit Aadhaar Number of the applicant",
      "Active mobile number linked with Aadhaar to receive UIDAI 6-digit OTP for portal authentication",
      "Payment of official UIDAI online update fee (₹50) via UPI / Net Banking / Debit Card"
    ],
    "prerequisitesTa": [
      "12 இலக்க ஆதார் எண்",
      "ஆதாரில் பதிவு செய்யப்பட்ட செயல்பாட்டில் உள்ள மொபைல் எண் (UIDAI OTP பெற)",
      "அரசு UIDAI கட்டணம் ₹50 இணையவழியில் செலுத்துதல்"
    ],
    "notesEn": "UIDAI processes address updates within 3 to 15 working days. Updated e-Aadhaar can be downloaded immediately upon approval. No biometrics required for online address update.",
    "notesTa": "UIDAI சரிபார்ப்புக்குப் பின் 3 முதல் 15 நாட்களுக்குள் புதுப்பிக்கப்பட்ட இ-ஆதார் தயாராகும். இணையவழி முகவரி மாற்றத்திற்கு விரல்ரேகை பதிவு தேவையில்லை.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "UIDAI myAadhaar Portal (myaadhaar.uidai.gov.in)",
    "officialPortalUrl": "https://myaadhaar.uidai.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "NAT-2002",
    "category": "identity_national",
    "department": "Income Tax Department / NSDL / UTIITSL",
    "departmentTa": "வருமான வரித்துறை / NSDL / UTIITSL",
    "nameEn": "PAN Card – New Application (Form 49A)",
    "nameTa": "புதிய பான் கார்டு விண்ணப்பம் (New PAN Card – Form 49A)",
    "descriptionEn": "Online application for allotment of new 10-digit alphanumeric Permanent Account Number (PAN) and issuance of laminated physical plastic PAN card by Income Tax Department.",
    "descriptionTa": "வருமான வரி கணக்கு தாக்கல் மற்றும் நிதி பரிவர்த்தனைகளுக்காக புதிய பான் கார்டு பெற விண்ணப்பிக்கும் சேவை.",
    "eligibilityEn": "Indian citizens, minors, students, or businesses requiring a Permanent Account Number.",
    "eligibilityTa": "பான் கார்டு இல்லாத அனைத்து இந்திய குடிமக்கள் மற்றும் மாணவர்கள்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card (acts as Proof of Identity, Proof of Address, and Proof of Date of Birth)",
      "Recent Colour Passport Size Photograph (white background)",
      "Applicant Signature (black ink on plain white paper)"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை (அடையாளம், முகவரி மற்றும் பிறந்த தேதி ஆதாரம்)",
      "சமீபத்திய வண்ண பாஸ்போர்ட் அளவு புகைப்படம் (வெள்ளை பின்னணி)",
      "வெள்ளைத்தாளில் கருப்பு மையினால் இடப்பட்ட கையொப்பம்"
    ],
    "optionalDocuments": [
      "Voter ID / Driving Licence / Passport / Bank Passbook (if Aadhaar not available for physical paper-based application)"
    ],
    "optionalDocumentsTa": [
      "வாக்காளர் அட்டை / ஓட்டுநர் உரிமம் / பாஸ்போர்ட் (ஆதார் இல்லாத போது)"
    ],
    "conditionalDocuments": [
      {
        "condition": "If applicant is a minor (under 18 years of age)",
        "conditionTa": "விண்ணப்பதாரர் 18 வயதுக்குட்பட்ட மைனர் எனில்",
        "requirement": "Representative Assessee (Father / Mother / Guardian) Aadhaar Card & Signature",
        "requirementTa": "பெற்றோர் அல்லது பாதுகாவலரின் ஆதார் அட்டை & கையொப்பம்"
      }
    ],
    "prerequisites": [
      "Active mobile number linked with Aadhaar for instantaneous Paperless e-KYC OTP processing",
      "Applicant Date of Birth, Father Name, and Mother Name details",
      "Statutory NSDL / UTIITSL Government Fee payment (₹107 for physical card dispatch in India)"
    ],
    "prerequisitesTa": [
      "ஆதாரில் பதிவு செய்யப்பட்ட மொபைல் எண் (e-KYC OTP பெற)",
      "பிறந்த தேதி மற்றும் பெற்றோர் பெயர் விவரங்கள்",
      "அரசு பான் கார்டு கட்டணம் ₹107 செலுத்துதல்"
    ],
    "notesEn": "Instant e-PAN PDF is delivered via email within 2 to 4 hours for paperless e-KYC applications. Physical plastic card is delivered via India Post Speed Post within 7 to 10 days.",
    "notesTa": "இ-பான் (e-PAN) 2-4 மணி நேரத்தில் மின்னஞ்சலில் கிடைக்கும். அசல் பிளாஸ்டிக் அட்டை 7-10 நாட்களில் தபாலில் வீட்டிற்கு வந்து சேரும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Protean NSDL / UTIITSL PAN Portal",
    "officialPortalUrl": "https://www.onlineservices.nsdl.com",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "NAT-2003",
    "category": "identity_national",
    "department": "Income Tax Department / NSDL / UTIITSL",
    "departmentTa": "வருமான வரித்துறை / NSDL / UTIITSL",
    "nameEn": "PAN Card – Correction / Update / Re-issue (Form CSF)",
    "nameTa": "பான் கார்டு திருத்தம் & மறுபதிப்பு (PAN Card Correction & Re-issue)",
    "descriptionEn": "Online request for correction in Name, Father Name, Date of Birth, Photograph, or Signature in existing PAN, or reprint/re-issuance of damaged/lost PAN card.",
    "descriptionTa": "பான் கார்டில் உள்ள பெயர், தந்தை பெயர், பிறந்த தேதி, புகைப்படம் திருத்தம் செய்ய அல்லது தொலைந்துபோன பான் கார்டை மீண்டும் பெற விண்ணப்பிக்கும் சேவை.",
    "eligibilityEn": "Any existing PAN card holder whose details require modification or card replacement.",
    "eligibilityTa": "பான் கார்டில் மாற்றம் செய்ய விரும்பும் அல்லது மறுபதிப்பு பெற விரும்பும் அனைவரும்.",
    "requiredDocuments": [
      "Existing PAN Card Copy (or PAN Allotment Letter / FIR Copy if lost)",
      "Applicant Aadhaar Card",
      "Recent Colour Passport Size Photograph",
      "Applicant Signature"
    ],
    "requiredDocumentsTa": [
      "ஏற்கனவே உள்ள பான் கார்டு நகல் (அல்லது பான் ஒதுக்கீட்டுக் கடிதம்)",
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "பாஸ்போர்ட் அளவு புகைப்படம்",
      "கையொப்பம்"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [
      {
        "condition": "If changing Name or Father Name significantly differing from Aadhaar",
        "conditionTa": "பெயர் அல்லது தந்தை பெயர் மாற்றம் செய்ய",
        "requirement": "Gazette Notification / Marriage Certificate / Passport copy supporting correct name",
        "requirementTa": "அரசிதழ் (Gazette) பதிவு நகல் அல்லது பாஸ்போர்ட் / திருமணச் சான்றிதழ்"
      }
    ],
    "prerequisites": [
      "10-digit Permanent Account Number (PAN)",
      "Active Aadhaar-linked mobile number for instant e-KYC OTP authentication",
      "Payment of statutory PAN correction fee (₹107)"
    ],
    "prerequisitesTa": [
      "10 இலக்க பான் எண்",
      "OTP சரிபார்ப்புக்கு மொபைல் எண்",
      "பான் திருத்தக் கட்டணம் ₹107 செலுத்துதல்"
    ],
    "notesEn": "Retains original PAN number while updating Income Tax database records. Corrected physical card is dispatched via Speed Post.",
    "notesTa": "பான் எண் மாறாது; விவரங்கள் மட்டுமே திருத்தப்பட்டு புதிய அட்டை தபாலில் அனுப்பி வைக்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Protean NSDL / UTIITSL PAN Portal",
    "officialPortalUrl": "https://www.onlineservices.nsdl.com",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "NAT-2004",
    "category": "identity_national",
    "department": "Election Commission of India (ECI)",
    "departmentTa": "இந்திய தேர்தல் ஆணையம் (ECI)",
    "nameEn": "Voter ID – New Voter Registration (Form 6)",
    "nameTa": "புதிய வாக்காளர் அட்டை விண்ணப்பம் (New Voter ID – Form 6)",
    "descriptionEn": "Online submission of Form 6 for inclusion of name in the electoral roll and issuance of new official Election Photo Identity Card (EPIC) with secure QR code.",
    "descriptionTa": "18 வயது பூர்த்தியடைந்தவர்கள் புதிய வாக்காளர் அடையாள அட்டை பெற தேர்தல் ஆணையத்தின் படிவம் 6 மூலம் இணையவழியில் விண்ணப்பிக்கும் சேவை.",
    "eligibilityEn": "Indian citizens aged 18+ (or turning 18 on qualifying dates) residing in the assembly constituency.",
    "eligibilityTa": "18 வயது பூர்த்தியடைந்த இந்தியக் குடிமக்கள்.",
    "requiredDocuments": [
      "Proof of Age / Date of Birth (Birth Certificate / Aadhaar Card / PAN Card / Driving Licence / 10th Mark Sheet / Passport)",
      "Proof of Ordinary Residence (Aadhaar Card / Smart Ration Card / Electricity Bill / Water Bill / Gas Bill / Bank Passbook / Registered Rent Agreement)",
      "Applicant Recent Passport Size Photograph"
    ],
    "requiredDocumentsTa": [
      "வயது / பிறந்த தேதி ஆதாரம் (பிறப்புச் சான்றிதழ் / ஆதார் / 10th மதிப்பெண் சான்றிதழ் / பான் கார்டு)",
      "முகவரி ஆதாரம் (ஆதார் / ரேஷன் கார்டு / மின் கட்டண ரசீது / வங்கி பாஸ்புக் / வாடகை ஒப்பந்தம்)",
      "பாஸ்போர்ட் அளவு வண்ணப் புகைப்படம்"
    ],
    "optionalDocuments": [
      "Family Member Existing EPIC (Voter ID) Number in the same polling booth"
    ],
    "optionalDocumentsTa": [
      "குடும்ப உறுப்பினரின் வாக்காளர் அடையாள அட்டை எண்"
    ],
    "conditionalDocuments": [],
    "prerequisites": [
      "Applicant must have completed 18 years of age (or turning 18 on the qualifying dates: 1 Jan, 1 Apr, 1 Jul, 1 Oct)",
      "Must be an Indian citizen and ordinary resident of the applied assembly constituency",
      "Active mobile number for verification OTP and EPIC digital download SMS"
    ],
    "prerequisitesTa": [
      "18 வயது பூர்த்தியடைந்த இந்தியக் குடிமகன்",
      "சம்பந்தப்பட்ட சட்டமன்ற தொகுதிக்குட்பட்ட பகுதியில் வசிப்பவர்",
      "OTP சரிபார்ப்புக்கு மொபைல் எண்"
    ],
    "notesEn": "Free statutory service. Following BLO physical verification, official EPIC Voter ID is dispatched free of cost to the applicant address and e-EPIC PDF is available for instant download.",
    "notesTa": "வாக்காளர் பதிவு முற்றிலும் இலவச சேவை. வாக்குச்சாவடி நிலை அலுவலர் (BLO) சரிபார்ப்புக்குப் பின் புதிய வண்ண வாக்காளர் அட்டை இலவசமாக வீட்டிற்கு தபாலில் வரும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Election Commission of India Voters Portal (voters.eci.gov.in)",
    "officialPortalUrl": "https://voters.eci.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "NAT-2005",
    "category": "identity_national",
    "department": "Election Commission of India (ECI)",
    "departmentTa": "இந்திய தேர்தல் ஆணையம் (ECI)",
    "nameEn": "Voter ID – Correction / Shifting / Replacement (Form 8)",
    "nameTa": "வாக்காளர் அட்டை திருத்தம் / முகவரி மாற்றம் (Voter ID Correction – Form 8)",
    "descriptionEn": "Online submission of Form 8 for shifting of residence within or outside constituency, correction of entries (Name, Age, DOB, Photo, Relative Name), replacement of damaged EPIC, or marking of disability.",
    "descriptionTa": "வாக்காளர் அட்டையில் முகவரி மாற்றம், பெயர், பிறந்த தேதி, புகைப்படம் திருத்தம் செய்ய அல்லது புதிய அட்டை பெற படிவம் 8 மூலம் விண்ணப்பிக்கும் சேவை.",
    "eligibilityEn": "Registered voters seeking changes in their existing electoral roll entry or replacement EPIC.",
    "eligibilityTa": "வாக்காளர் பட்டியலில் உள்ள விவரங்களைத் திருத்த விரும்பும் வாக்காளர்கள்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card / ID Proof",
      "Recent Colour Passport Size Photograph"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை / அடையாள அட்டை",
      "பாஸ்போர்ட் அளவு வண்ணப் புகைப்படம்"
    ],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [
      {
        "condition": "If applying for Shifting of Residence (சட்டமன்ற தொகுதிக்குள் அல்லது தொகுதி மாறி முகவரி மாற்றம்)",
        "conditionTa": "முகவரி மாற்றம் செய்ய விண்ணப்பித்தால்",
        "requirement": "Proof of Ordinary Residence at New Address (Aadhaar Card / Ration Card / EB Bill / Water Bill / Bank Passbook)",
        "requirementTa": "புதிய முகவரிக்கான ஆதாரம் (ஆதார் / ரேஷன் கார்டு / மின் கட்டணம் / வங்கி பாஸ்புக்)"
      },
      {
        "condition": "If applying for Correction of Name, Photo, Age, Gender, or Relative Name",
        "conditionTa": "பெயர், புகைப்படம், பிறந்த தேதி அல்லது உறவினர் பெயர் திருத்தம் எனில்",
        "requirement": "Supporting Proof Document matching the corrected detail (10th TC / Birth Certificate / Aadhaar)",
        "requirementTa": "திருத்தம் செய்யப்பட வேண்டிய விவரத்திற்கான சரியான ஆவண ஆதாரம்"
      }
    ],
    "prerequisites": [
      "Existing 10-character EPIC (Voter ID) Number",
      "Active mobile number to receive OTP and tracking link"
    ],
    "prerequisitesTa": [
      "வாக்காளர் அடையாள அட்டை எண் (EPIC Number)",
      "OTP பெற மொபைல் எண்"
    ],
    "notesEn": "Updated e-EPIC PDF can be downloaded immediately upon ERO approval and physical replacement smart card is dispatched via Speed Post by Election Commission.",
    "notesTa": "தேர்தல் அலுவலர் ஒப்புதலுக்குப் பின் திருத்தப்பட்ட இ-வாக்காளர் அட்டையை உடனே பதிவிறக்கம் செய்யலாம். புதிய அட்டை தபாலிலும் வரும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Election Commission of India Voters Portal (voters.eci.gov.in)",
    "officialPortalUrl": "https://voters.eci.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "NAT-2006",
    "category": "identity_national",
    "department": "Ministry of External Affairs (Passport Seva)",
    "departmentTa": "வெளியுறவு அமைச்சகம் (பாஸ்போர்ட் சேவா)",
    "nameEn": "Indian Passport – Fresh Application & Renewal Appointment Booking",
    "nameTa": "இந்திய பாஸ்போர்ட் விண்ணப்பம் & அப்பாய்ண்ட்மெண்ட் முன்பதிவு (Indian Passport)",
    "descriptionEn": "Online registration, documentation preparation, government fee payment, and appointment slot booking at Passport Seva Kendra (PSK / POPSK) for fresh passport issuance or re-issue of expiring passport.",
    "descriptionTa": "புதிய இந்திய பாஸ்போர்ட் பெற அல்லது காலாவதியான பாஸ்போர்ட்டை புதுப்பிக்க ஆன்லைனில் விண்ணப்பித்து பாஸ்போர்ட் சேவா கேந்திரா (PSK) அலுவலக டோக்கன் முன்பதிவு செய்யும் சேவை.",
    "eligibilityEn": "Indian citizens of all ages seeking a fresh passport or renewing an expiring passport.",
    "eligibilityTa": "பாஸ்போர்ட் தேவைப்படும் அனைத்து இந்திய குடிமக்களும்.",
    "requiredDocuments": [
      "Applicant Aadhaar Card",
      "Proof of Date of Birth (Birth Certificate / School Transfer Certificate / 10th Mark Sheet / PAN Card)",
      "Proof of Present Address (Aadhaar Card / Smart Ration Card / Bank Passbook with photo / Electricity Bill / Gas Bill)"
    ],
    "requiredDocumentsTa": [
      "விண்ணப்பதாரரின் ஆதார் அட்டை",
      "பிறந்த தேதி ஆதாரம் (பிறப்புச் சான்றிதழ் / பள்ளி TC / 10th மதிப்பெண் சான்றிதழ் / பான் கார்டு)",
      "முகவரி ஆதாரம் (ஆதார் / ரேஷன் கார்டு / வங்கி பாஸ்புக் / மின் கட்டண ரசீது)"
    ],
    "optionalDocuments": [
      "Spouse Passport Copy (for adding spouse name in passport)",
      "Old Expired / Expiring Passport (for renewal / re-issue applications)"
    ],
    "optionalDocumentsTa": [
      "துணையின் பாஸ்போர்ட் நகல்",
      "பழைய பாஸ்போர்ட் அசல் மற்றும் நகல் (புதுப்பித்தல் எனில்)"
    ],
    "conditionalDocuments": [
      {
        "condition": "For Non-ECR (Emigration Check Not Required) Status",
        "conditionTa": "Non-ECR தகுதி பெற",
        "requirement": "10th Standard / Matriculation or Higher Educational Degree / Diploma Pass Certificate",
        "requirementTa": "10-ஆம் வகுப்பு அல்லது அதற்கு மேற்பட்ட கல்வித் தகுதிச் சான்றிதழ்"
      },
      {
        "condition": "For Minor Applicants (under 18 years)",
        "conditionTa": "18 வயதுக்குட்பட்ட மைனர் விண்ணப்பதாரர்கள் எனில்",
        "requirement": "Parents Passports (Original + Copy) & Annexure ‘D’ Declaration signed by both parents",
        "requirementTa": "பெற்றோரின் பாஸ்போர்ட் நகல் மற்றும் பெற்றோரின் கூட்டு உறுதிமொழிப் படிவம் (Annexure D)"
      }
    ],
    "prerequisites": [
      "Payment of statutory MEA Passport Application Fee online (₹1,500 for normal 36-page adult booklet / ₹1,000 for minors)",
      "Mandatory physical appearance at designated Passport Seva Kendra (PSK / POPSK) with all original documents for biometric capture and photograph",
      "Active mobile number and email ID for appointment schedule alerts and Police Verification updates"
    ],
    "prerequisitesTa": [
      "மத்திய அரசு பாஸ்போர்ட் கட்டணம் (பெரியவர்களுக்கு ₹1,500 / குழந்தைகளுக்கு ₹1,000) இணையவழியில் செலுத்துதல்",
      "முன்பதிவு செய்த நாளில் அசல் ஆவணங்களுடன் பாஸ்போர்ட் சேவா கேந்திரா (PSK) அலுவலகத்தில் நேரில் ஆஜராகுதல்",
      "தகவல்கள் பெற மொபைல் எண் மற்றும் மின்னஞ்சல்"
    ],
    "notesEn": "Following PSK biometric capture and local police verification, Passport is dispatched securely via India Post Speed Post.",
    "notesTa": "PSK நேரடி சரிபார்ப்பு மற்றும் காவல்துறை விசாரணை முடிவடைந்த பின் பாஸ்போர்ட் ஸ்பீடு போஸ்ட் மூலம் வீட்டிற்கு அனுப்பி வைக்கப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "Passport Seva Portal, MEA (passportindia.gov.in)",
    "officialPortalUrl": "https://www.passportindia.gov.in",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "NAT-2007",
    "category": "identity_national",
    "department": "National Health Authority / CMCHIS TN",
    "departmentTa": "தேசிய சுகாதார ஆணையம் / முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டுத் திட்டம்",
    "nameEn": "PMJAY / CMCHIS Government Health Insurance Smart Card Download",
    "nameTa": "முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டு அட்டை (CMCHIS / PMJAY Card Download)",
    "descriptionEn": "Instant search, eligibility check, and digital download of Ayushman Bharat PMJAY / Chief Minister Comprehensive Health Insurance Scheme (CMCHIS) health cards with QR code for cashless medical hospitalizations.",
    "descriptionTa": "ஆண்டுக்கு ₹5 லட்சம் வரை கட்டணமில்லா மருத்துவ சிகிச்சை பெற உதவும் முதலமைச்சரின் விரிவான மருத்துவக் காப்பீட்டு அட்டை (CMCHIS) மற்றும் ஆயுஷ்மான் பாரத் கார்டை பதிவிறக்கம் செய்யும் சேவை.",
    "eligibilityEn": "Enrolled families and eligible beneficiaries under CMCHIS / PMJAY socio-economic criteria.",
    "eligibilityTa": "முதலமைச்சரின் மருத்துவக் காப்பீட்டு திட்டத்தில் தகுதியுடைய அனைத்து குடும்பங்களும்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [
      {
        "condition": "If applying for new CMCHIS beneficiary card enrollment at District Collectorate",
        "conditionTa": "புதிய மருத்துவக் காப்பீட்டு அட்டைக்கு விண்ணப்பித்தால்",
        "requirement": "Smart Ration Card, Aadhaar Cards of all family members, and Village Administrative Officer (VAO) Income Certificate (annual income <= ₹1,20,000)",
        "requirementTa": "ஸ்மார்ட் ரேஷன் கார்டு, குடும்ப உறுப்பினர்களின் ஆதார் அட்டைகள் மற்றும் வருமானச் சான்றிதழ் (ஆண்டு வருமானம் ₹1,20,000-க்குள்)"
      }
    ],
    "prerequisites": [
      "Beneficiary 12-digit Aadhaar Number OR Smart Ration Card Number OR 14-digit PMJAY / CMCHIS Policy URN Number",
      "Active mobile number for OTP authentication"
    ],
    "prerequisitesTa": [
      "ஆதார் எண் அல்லது ஸ்மார்ட் ரேஷன் கார்டு எண் அல்லது CMCHIS பாலிசி URN எண்",
      "OTP சரிபார்ப்புக்கு மொபைல் எண்"
    ],
    "notesEn": "Provides cashless treatment coverage up to ₹5 Lakhs per year per family in authorized government and empanelled private super-speciality hospitals. Digitally verified QR card is available for instant download. Zero upload required for existing beneficiaries.",
    "notesTa": "அங்கீகரிக்கப்பட்ட அரசு மற்றும் தனியார் மருத்துவமனைகளில் ஆண்டுக்கு ₹5 லட்சம் வரை இலவச சிகிச்சை பெறலாம். ஏற்கனவே உள்ள பயனாளிகளுக்கு ஆவணப் பதிவேற்றம் எதுவும் தேவையில்லை.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "CMCHIS Portal (cmchistn.com) / PMJAY (beneficiary.nha.gov.in)",
    "officialPortalUrl": "https://www.cmchistn.com",
    "lastVerified": "2026-09-06"
  },
  {
    "id": "NAT-2008",
    "category": "identity_national",
    "department": "Unique Identification Authority of India (UIDAI)",
    "departmentTa": "இந்திய தனித்துவ அடையாள ஆணையம் (UIDAI)",
    "nameEn": "Order Aadhaar PVC Card (Official UIDAI Weatherproof Smart Card)",
    "nameTa": "ஆதார் PVC கார்டு ஆர்டர் செய்தல் (Order Aadhaar PVC Card)",
    "descriptionEn": "Online order of official tamper-proof, pocket-sized UIDAI Aadhaar PVC card with secure QR code, hologram, microtext, and ghost image, delivered by Speed Post directly to registered Aadhaar address.",
    "descriptionTa": "பாதுகாப்பான QR குறியீடு, ஹோலோகிராம் மற்றும் வாட்டர்மூர்க்குடன் கூடிய அதிகாரப்பூர்வ UIDAI ஆதார் PVC ஸ்மார்ட் கார்டை ஸ்பீடு போஸ்ட் மூலம் வீட்டிற்கே வரவழைக்கும் சேவை.",
    "eligibilityEn": "Any Aadhaar holder with valid Aadhaar Number, Enrolment ID (EID), or Virtual ID (VID).",
    "eligibilityTa": "ஆதார் எண் வைத்துள்ள அனைத்து இந்திய குடிமக்களும்.",
    "requiredDocuments": [],
    "requiredDocumentsTa": [],
    "optionalDocuments": [],
    "optionalDocumentsTa": [],
    "conditionalDocuments": [],
    "prerequisites": [
      "12-digit Aadhaar Number OR 28-digit Enrolment ID (EID) OR 16-digit Virtual ID (VID)",
      "Any mobile number to receive OTP for authentication (Aadhaar-linked mobile is NOT mandatory; non-registered mobile numbers can also receive OTP for placing order)",
      "Payment of official UIDAI printing & Speed Post delivery fee of ₹50 online"
    ],
    "prerequisitesTa": [
      "12 இலக்க ஆதார் எண் அல்லது 28 இலக்க என்ரோல்மென்ட் எண் (EID) அல்லது 16 இலக்க விர்ச்சுவல் ஐடி (VID)",
      "OTP பெற ஏதேனும் ஒரு மொபைல் எண் (ஆதாரில் இணைக்கப்படாத மொபைல் எண்ணையும் பயன்படுத்தலாம்)",
      "அரசு அச்சு மற்றும் ஸ்பீடு போஸ்ட் கட்டணம் ₹50 இணையவழியில் செலுத்துதல்"
    ],
    "notesEn": "No address proof or photo upload required. Card is printed with existing official UIDAI database details and dispatched via India Post Speed Post directly to the existing registered Aadhaar address within 5 to 10 working days.",
    "notesTa": "ஆவணப் பதிவேற்றம் தேவையில்லை. ஆதாரில் உள்ள முகவரிக்கு இந்திய அஞ்சல் துறை ஸ்பீடு போஸ்ட் மூலம் 5-10 நாட்களில் நேரடியாக டெலிவரி செய்யப்படும்.",
    "variableRequirements": false,
    "serviceType": "e-Sevai Assistance",
    "officialSource": "UIDAI myAadhaar Portal (myaadhaar.uidai.gov.in)",
    "officialPortalUrl": "https://myaadhaar.uidai.gov.in",
    "lastVerified": "2026-09-06"
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
  if (clean.includes('பாஸ்போர்ட்') || clean.includes('passport')) return GOVERNMENT_SERVICES.find(s => s.id === 'NAT-2006') || null;
  if (clean.includes('பான்') || clean.includes('pan card')) return GOVERNMENT_SERVICES.find(s => s.id === 'NAT-2002') || null;
  if (clean.includes('வாக்காளர்') || clean.includes('voter')) return GOVERNMENT_SERVICES.find(s => s.id === 'NAT-2004') || null;
  if (clean.includes('வேலைவாய்ப்பு') || clean.includes('employment')) return GOVERNMENT_SERVICES.find(s => s.id === 'EMP-1201') || null;
  if (clean.includes('பட்டா') || clean.includes('patta')) return GOVERNMENT_SERVICES.find(s => s.id === 'LND-302') || null;
  if (clean.includes('வில்லங்கம்') || clean.includes('encumbrance') || clean.includes('ec')) return GOVERNMENT_SERVICES.find(s => s.id === 'REG-701') || null;
  if (clean.includes('tneb') || clean.includes('மின் இணைப்பு') || clean.includes('electricity')) return GOVERNMENT_SERVICES.find(s => s.id === 'TNEB-502') || null;
  if (clean.includes('pvc') || clean.includes('ஆதார் கார்டு')) return GOVERNMENT_SERVICES.find(s => s.id === 'NAT-2008') || null;
  if (clean.includes('ஆதார்') || clean.includes('aadhaar')) return GOVERNMENT_SERVICES.find(s => s.id === 'NAT-2001') || null;

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
      ...(service.requiredDocumentsTa || []),
      ...(service.optionalDocuments || []),
      ...(service.optionalDocumentsTa || []),
      ...(service.prerequisites || []),
      ...(service.prerequisitesTa || []),
      ...(service.conditionalDocuments || []).map(c => typeof c === 'string' ? c : (c.condition + ' ' + (c.conditionTa || '') + ' ' + (c.requirement || '') + ' ' + (c.requirementTa || ''))),
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
      ? ['ஆதார் அட்டை', 'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு', 'முகவரிச் சான்று', 'பாஸ்போர்ட் அளவு புகைப்படம்']
      : ['Aadhaar Card', 'Family Card / Smart Card', 'Address Proof', 'Passport Photo'];
  }

  const service = findGovernmentService(serviceIdentifier);
  if (service) {
    if (lang === 'ta' && Array.isArray(service.requiredDocumentsTa) && service.requiredDocumentsTa.length > 0) {
      return service.requiredDocumentsTa;
    }
    if (Array.isArray(service.requiredDocuments) && service.requiredDocuments.length > 0) {
      return service.requiredDocuments;
    }
    // Explicit empty array for services requiring zero uploaded documents
    if (Array.isArray(service.requiredDocuments) && service.requiredDocuments.length === 0) {
      return [];
    }
  }

  // Fallback
  return lang === 'ta'
    ? ['ஆதார் அட்டை', 'குடும்ப அட்டை / ஸ்மார்ட் ரேஷன் கார்டு', 'முகவரிச் சான்று', 'பாஸ்போர்ட் அளவு புகைப்படம்']
    : ['Aadhaar Card', 'Family Card / Smart Card', 'Address Proof', 'Passport Photo'];
};

// Helper: Get optional documents array
export const getOptionalDocumentsList = (serviceIdentifier, lang = 'ta') => {
  if (!serviceIdentifier) return [];
  const service = findGovernmentService(serviceIdentifier);
  if (!service) return [];
  if (lang === 'ta' && Array.isArray(service.optionalDocumentsTa)) {
    return service.optionalDocumentsTa;
  }
  return service.optionalDocuments || [];
};

// Helper: Get conditional documents array
export const getConditionalDocumentsList = (serviceIdentifier) => {
  if (!serviceIdentifier) return [];
  const service = findGovernmentService(serviceIdentifier);
  if (!service) return [];
  return service.conditionalDocuments || [];
};

// Helper: Get prerequisites array
export const getPrerequisitesList = (serviceIdentifier, lang = 'ta') => {
  if (!serviceIdentifier) return [];
  const service = findGovernmentService(serviceIdentifier);
  if (!service) return [];
  if (lang === 'ta' && Array.isArray(service.prerequisitesTa)) {
    return service.prerequisitesTa;
  }
  return service.prerequisites || [];
};
