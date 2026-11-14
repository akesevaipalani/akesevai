// src/data/regionalCitiesData.js
// Verified District Official Portals & Authentic Statewide / Regional Online Service Content
// IMPORTANT: AK E-SEVAI physical walk-in counter operates ONLY in Palani (Mill Road, 624601).
// All other cities receive browser-based tools & remote WhatsApp/online assistance ONLY.

export const TAMIL_NADU_16_CITIES = [
  {
    id: 'chennai',
    nameEn: 'Chennai',
    nameTa: 'சென்னை',
    portalUrl: 'https://chennai.nic.in/',
    portalDomain: 'chennai.nic.in',
    extraPortalUrl: 'https://chennaicorporation.gov.in/gcc/online-services/',
    extraPortalLabel: 'Greater Chennai Corp',
    dedicatedSlug: '/chennai-online-esevai-assistance',
    keyFocusEn: 'GCC Birth/Death & Property portals, Egmore/Mylapore revenue docs, RRB Chennai & IT job PDF compression.',
    keyFocusTa: 'பெருநகர சென்னை மாநகராட்சி பிறப்பு/இறப்பு சான்று, வருவாய்த்துறை & RRB சென்னை தேர்வு ஆவணங்கள்.'
  },
  {
    id: 'coimbatore',
    nameEn: 'Coimbatore',
    nameTa: 'கோயம்புத்தூர்',
    portalUrl: 'https://coimbatore.nic.in/',
    portalDomain: 'coimbatore.nic.in',
    dedicatedSlug: '/coimbatore-online-esevai-assistance',
    keyFocusEn: 'Engineering/college TNEA admissions, Pollachi/Mettupalayam revenue certs & industrial worker exam photos.',
    keyFocusTa: 'கல்லூரி TNEA சேர்க்கை PDF, பொள்ளாச்சி/கோவை சான்றிதழ்கள் & தேர்வு புகைப்பட சுருக்கம்.'
  },
  {
    id: 'madurai',
    nameEn: 'Madurai',
    nameTa: 'மதுரை',
    portalUrl: 'https://madurai.nic.in/',
    portalDomain: 'madurai.nic.in',
    dedicatedSlug: '/madurai-online-esevai-assistance',
    keyFocusEn: 'TNPSC/TNUSRB aspirant photo/signature resizing, Melur/Thirumangalam Patta/EC PDFs & university admissions.',
    keyFocusTa: 'மதுரை TNPSC/TNUSRB தேர்வு போட்டோ, மேலூர்/திருமங்கலம் பட்டா/EC ஆவண PDF தயாரிப்பு.'
  },
  {
    id: 'tiruchirappalli',
    nameEn: 'Tiruchirappalli (Trichy)',
    nameTa: 'திருச்சிராப்பள்ளி (திருச்சி)',
    portalUrl: 'https://tiruchirappalli.nic.in/',
    portalDomain: 'tiruchirappalli.nic.in',
    dedicatedSlug: '/trichy-online-esevai-assistance',
    keyFocusEn: 'Academic & RRB exam resizers, Srirangam/Manapparai/Musiri delta revenue docs & scholarship PDFs.',
    keyFocusTa: 'திருச்சி கல்வி & ரயில்வே தேர்வு பட அளவீடு, ஸ்ரீரங்கம்/மணப்பாறை பட்டா மற்றும் கல்வி உதவித்தொகை PDF.'
  },
  {
    id: 'salem',
    nameEn: 'Salem',
    nameTa: 'சேலம்',
    portalUrl: 'https://salem.nic.in/',
    portalDomain: 'salem.nic.in',
    dedicatedSlug: '/salem-online-esevai-assistance',
    keyFocusEn: 'Mettur/Attur/Edappadi citizen certificate checklists, TNEB/TNPDS scan reduction & govt job forms.',
    keyFocusTa: 'சேலம், மேட்டூர், ஆத்தூர் குடிமக்கள் சான்றிதழ், TNEB/TNPDS PDF சுருக்கம் & தேர்வு விண்ணப்ப உதவி.'
  },
  {
    id: 'tirunelveli',
    nameEn: 'Tirunelveli',
    nameTa: 'திருநெல்வேலி',
    portalUrl: 'https://tirunelveli.nic.in/',
    portalDomain: 'tirunelveli.nic.in',
    keyFocusEn: 'TNPSC/Police photo resizing, Ambasamudram/Nanguneri revenue document PDF merge & smart card scans.',
    keyFocusTa: 'திருநெல்வேலி தேர்வு போட்டோ அளவீடு, வருவாய் ஆவண PDF இணைப்பு & ரேஷன் அட்டை உதவி.'
  },
  {
    id: 'erode',
    nameEn: 'Erode',
    nameTa: 'ஈரோடு',
    portalUrl: 'https://erode.nic.in/',
    portalDomain: 'erode.nic.in',
    keyFocusEn: 'Bhavani/Perundurai/Gobichettipalayam agricultural, income & MSME online document formatting tools.',
    keyFocusTa: 'பவானி, பெருந்துறை, கோபிசெட்டிபாளையம் வருவாய்/விவசாயி சான்றிதழ் & ஆன்லைன் ஆவணக் கருவிகள்.'
  },
  {
    id: 'dindigul',
    nameEn: 'Dindigul',
    nameTa: 'திண்டுக்கல்',
    portalUrl: 'https://dindigul.nic.in/',
    portalDomain: 'dindigul.nic.in',
    keyFocusEn: 'Home district covering Palani & Oddanchatram — online tools + direct walk-in printing at Mill Rd, Palani.',
    keyFocusTa: 'பழனி & ஒட்டன்சத்திரம் உள்ளடக்கிய சொந்த மாவட்டம் — ஆன்லைன் கருவிகள் + பழனியில் நேரடி மையம்.'
  },
  {
    id: 'thanjavur',
    nameEn: 'Thanjavur',
    nameTa: 'தஞ்சாவூர்',
    portalUrl: 'https://thanjavur.nic.in/',
    portalDomain: 'thanjavur.nic.in',
    keyFocusEn: 'Kumbakonam/Pattukkottai college admission PDFs, Small Farmer / Patta scans & scholarship docs.',
    keyFocusTa: 'கும்பகோணம்/பட்டுக்கோட்டை கல்லூரி PDF, சிறு விவசாயி/பட்டா ஆவணங்கள் & கல்வி உதவித்தொகை உதவி.'
  },
  {
    id: 'vellore',
    nameEn: 'Vellore',
    nameTa: 'வேலூர்',
    portalUrl: 'https://vellore.nic.in/',
    portalDomain: 'vellore.nic.in',
    keyFocusEn: 'Katpadi/Gudiyatham university admissions, medical/central exam photo sizing & PDF compression tools.',
    keyFocusTa: 'காட்பாடி/குடியாத்தம் பல்கலைக்கழக சேர்க்கை, மருத்துவ/மத்திய தேர்வு போட்டோ & PDF சுருக்கம்.'
  },
  {
    id: 'tiruppur',
    nameEn: 'Tiruppur',
    nameTa: 'திருப்பூர்',
    portalUrl: 'https://tiruppur.nic.in/',
    portalDomain: 'tiruppur.nic.in',
    keyFocusEn: 'Avinashi/Dharapuram/Udumalpet resident certificate checklists & textile workforce digital PDF tools.',
    keyFocusTa: 'அவிநாசி, தாராபுரம், உடுமலைப்பேட்டை குடிமக்கள் சான்றிதழ் & டிஜிட்டல் PDF தயாரிப்பு.'
  },
  {
    id: 'kanyakumari',
    nameEn: 'Kanyakumari (Nagercoil)',
    nameTa: 'கன்னியாகுமரி (நாகர்கோவில்)',
    portalUrl: 'https://kanniyakumari.nic.in/',
    portalDomain: 'kanniyakumari.nic.in',
    keyFocusEn: 'High-literacy student scholarship PDF merges, passport/visa 35x45mm & 2x2in sheet layout tools.',
    keyFocusTa: 'நாகர்கோவில் மாணவர் கல்வி உதவித்தொகை PDF இணைப்பு, பாஸ்போர்ட் போட்டோ ஷீட் கருவிகள்.'
  },
  {
    id: 'thoothukudi',
    nameEn: 'Thoothukudi',
    nameTa: 'தூத்துக்குடி',
    portalUrl: 'https://thoothukudi.nic.in/',
    portalDomain: 'thoothukudi.nic.in',
    keyFocusEn: 'Kovilpatti/Tiruchendur marine/port job applications, passport photo layout & 20–50KB compressor.',
    keyFocusTa: 'கோவில்பட்டி/திருச்செந்தூர் துறைமுக & அரசுத் தேர்வு விண்ணப்பப் பட சுருக்கக் கருவிகள்.'
  },
  {
    id: 'karur',
    nameEn: 'Karur',
    nameTa: 'கரூர்',
    portalUrl: 'https://karur.nic.in/',
    portalDomain: 'karur.nic.in',
    keyFocusEn: 'Kulithalai/Aravakurichi revenue certificate preparation, Patta EC PDF merge & exam signature resizing.',
    keyFocusTa: 'குளித்தலை/அரவக்குறிச்சி வருவாய் சான்றிதழ், பட்டா EC PDF இணைப்பு & கையொப்ப அளவீடு.'
  },
  {
    id: 'namakkal',
    nameEn: 'Namakkal',
    nameTa: 'நாமக்கல்',
    portalUrl: 'https://namakkal.nic.in/',
    portalDomain: 'namakkal.nic.in',
    keyFocusEn: 'Tiruchengode/Rasipuram NEET/TNEA coaching student document PDF merging & exam photo compressor.',
    keyFocusTa: 'திருச்செங்கோடு/ராசிபுரம் NEET & TNEA மாணவர் ஆவண PDF தயாரிப்பு & தேர்வு போட்டோ கருவிகள்.'
  },
  {
    id: 'palani',
    nameEn: 'Palani (Walk-In & Online Hub)',
    nameTa: 'பழனி (நேரடி & ஆன்லைன் தலைமை மையம்)',
    portalUrl: 'https://dindigul.nic.in/',
    portalDomain: 'dindigul.nic.in',
    dedicatedSlug: '/contact',
    keyFocusEn: 'Physical AK E-SEVAI centre at Mill Rd, Palani (624601): walk-in e-Sevai, Xerox, Typing, Binding & Lamination.',
    keyFocusTa: 'பழனி மில் ரோடு நேரடி சேவை மையம்: நேரடி இ-சேவை, ஜெராக்ஸ், தட்டச்சு, ஸ்பைரல் பைண்டிங் & லேமினேஷன்.'
  }
];

export const CITY_DEDICATED_GUIDES = {
  'chennai-online-esevai-assistance': {
    routeId: 'chennai-online-esevai-assistance',
    cityEn: 'Chennai',
    cityTa: 'சென்னை',
    canonical: 'https://www.akesevai.com/chennai-online-esevai-assistance',
    title: 'Chennai Online e-Sevai Guidance, Photo & PDF Tools | AK E-SEVAI',
    titleTa: 'சென்னை ஆன்லைன் இ-சேவை வழிகாட்டி & PDF/போட்டோ கருவிகள் | AK E-SEVAI',
    description: 'Free browser-based photo compression, passport photo sheets, PDF merge/split tools and online e-Sevai/GCC portal guidance for Chennai residents. Online support only; physical centre in Palani.',
    descriptionTa: 'சென்னை வாசிகளுக்கான பெருநகர சென்னை மாநகராட்சி (GCC), TNeGA இ-சேவை வழிகாட்டி, RRB சென்னை தேர்வு போட்டோ கருவிகள் மற்றும் இலவச PDF கருவிகள். (ஆன்லைன் உதவி மட்டுமே).',
    keywords: 'chennai e sevai online services, chennai photo compressor, chennai pdf merge online, rrb chennai photo resize, greater chennai corporation esevai guide',
    badgeEn: 'Chennai Online Resource & Tools',
    badgeTa: 'சென்னை ஆன்லைன் வழிகாட்டி & கருவிகள்',
    heroTitleEn: 'Online e-Sevai Guidance, RRB Chennai Photo Tools & PDF Utilities for Chennai',
    heroTitleTa: 'சென்னைக்கான ஆன்லைன் இ-சேவை வழிகாட்டி, GCC/TNeGA இணைப்புகள் & இலவச ஆவணக் கருவிகள்',
    heroSubEn: 'Prepared specifically for Chennai urban residents dealing with Greater Chennai Corporation civic records, Revenue Taluk certificates, and Railway/Central Govt job uploads. All browser tools work locally with zero server upload; physical walk-in centre operates in Palani only.',
    heroSubTa: 'பெருநகர சென்னை மாநகராட்சி (GCC) பிறப்பு/இறப்பு சான்றுகள், சென்னை மாவட்ட வருவாய் வட்டங்கள் மற்றும் RRB/SSC தேர்வுப் பதிவேற்றங்களுக்கு உதவும் வகையில் தொகுக்கப்பட்டுள்ளது. AK E-SEVAI-ன் நேரடி மையம் பழனியில் மட்டுமே உள்ளது; சென்னை பயனர்களுக்கு 100% ஆன்லைன் கருவிகள் & வாட்ஸ்அப் வழிகாட்டல் வழங்கப்படுகிறது.',
    officialPortals: [
      { label: 'Chennai District Administration (chennai.nic.in)', url: 'https://chennai.nic.in/' },
      { label: 'Greater Chennai Corporation Online Services', url: 'https://chennaicorporation.gov.in/gcc/online-services/' },
      { label: 'RRB Chennai Official Portal', url: 'https://rrb.indianrailways.gov.in/chennai' },
      { label: 'Tamil Nadu e-Sevai Portal (tnesevai.tn.gov.in)', url: 'https://www.tnesevai.tn.gov.in/' }
    ],
    localNuances: [
      {
        titleEn: 'Urban Birth/Death vs Revenue Certificates',
        titleTa: 'மாநகராட்சி சான்றுகள் vs வருவாய் சான்றிதழ்கள்',
        bodyEn: 'Within Greater Chennai Corporation limits, municipal birth and death certificates are handled through GCC Civic Services (chennaicorporation.gov.in), whereas Income, Community, and Nativity certificates follow the TNeGA e-Sevai portal across Egmore, Mylapore, Guindy, Velachery, and Madhavaram taluks.',
        bodyTa: 'சென்னை மாநகராட்சி எல்லைக்குள் பிறப்பு & இறப்புச் சான்றிதழ்கள் GCC இணையதளத்திலும், வருமானம்/சாதி/இருப்பிடச் சான்றிதழ்கள் TNeGA இ-சேவை போர்ட்டலிலும் கையாளப்படுகின்றன.'
      },
      {
        titleEn: 'RRB Chennai & SSC Upload Preparation',
        titleTa: 'RRB சென்னை & மத்திய தேர்வுப் படத் தயாரிப்பு',
        bodyEn: 'For Railway Recruitment Board Chennai zone and SSC applications, upload clean resized photos and signatures matching the active notification KB range directly from your phone browser.',
        bodyTa: 'RRB சென்னை மண்டலம் மற்றும் SSC விண்ணப்பங்களுக்கு அறிவிப்பில் குறிப்பிட்டுள்ள KB அளவில் போட்டோ & கையொப்பத்தை உங்கள் மொபைல் பிரவுசரிலேயே தயார் செய்யலாம்.'
      }
    ],
    recommendedTools: ['rrb-photo-resizer', 'pdf-merge', 'pdf-compress', 'photo-compress-50kb', 'document-size-checker'],
    faqs: [
      {
        q: 'Does AK E-SEVAI have a physical walk-in branch in Chennai?',
        qTa: 'சென்னையில் AK E-SEVAI-க்கு நேரடி கிளை உள்ளதா?',
        a: 'No. AK E-SEVAI operates its only physical centre in Palani (Mill Road, 624601). Chennai residents can freely use all 31 browser-based photo/PDF tools online and reach +91 93423 18844 on WhatsApp for remote document guidance.',
        aTa: 'இல்லை. AK E-SEVAI-ன் நேரடி சேவை மையம் பழனியில் (மில் ரோடு, 624601) மட்டுமே உள்ளது. சென்னை பயனர்கள் எங்கள் 31 இலவச பிரவுசர் கருவிகளையும் வாட்ஸ்அப் ஆன்லைன் வழிகாட்டலையும் எங்கிருந்தும் பயன்படுத்தலாம்.'
      },
      {
        q: 'Which portal handles Chennai city birth certificates vs income certificates?',
        qTa: 'சென்னை பிறப்புச் சான்றிதழ் மற்றும் வருமானச் சான்றிதழ் எந்தெந்த தளங்களில் கிடைக்கும்?',
        a: 'Birth and death records within corporation wards are accessed via Greater Chennai Corporation Online Services (chennaicorporation.gov.in/gcc/online-services/), while Revenue certificates use tnesevai.tn.gov.in.',
        aTa: 'மாநகராட்சி எல்லைக்குட்பட்ட பிறப்பு/இறப்பு பதிவுகள் GCC இணையதளத்திலும், வருமானம்/சாதி சான்றிதழ்கள் tnesevai.tn.gov.in தளத்திலும் கிடைக்கும்.'
      }
    ]
  },
  'coimbatore-online-esevai-assistance': {
    routeId: 'coimbatore-online-esevai-assistance',
    cityEn: 'Coimbatore',
    cityTa: 'கோயம்புத்தூர்',
    canonical: 'https://www.akesevai.com/coimbatore-online-esevai-assistance',
    title: 'Coimbatore Online Photo Tools, PDF Merge & e-Sevai Guide | AK E-SEVAI',
    titleTa: 'கோயம்புத்தூர் ஆன்லைன் போட்டோ, PDF கருவிகள் & இ-சேவை வழிகாட்டி | AK E-SEVAI',
    description: 'Free photo compressor, college PDF tools and online e-Sevai certificate guidance for Coimbatore, Pollachi and Mettupalayam applicants. Remote online tools only; physical centre in Palani.',
    descriptionTa: 'கோவை, பொள்ளாச்சி, மேட்டுப்பாளையம் மாணவர்கள் & தொழில் ஊழியர்களுக்கான இலவச போட்டோ கம்ப்ரஸர், கல்லூரி சேர்க்கை PDF கருவிகள் & இ-சேவை வழிகாட்டி. (ஆன்லைன் உதவி மட்டுமே).',
    keywords: 'coimbatore online application services, coimbatore photo compressor, coimbatore e sevai online guide, pollachi tnpsc photo resize',
    badgeEn: 'Coimbatore Online Resource & Tools',
    badgeTa: 'கோவை ஆன்லைன் வழிகாட்டி & கருவிகள்',
    heroTitleEn: 'Photo Compression, Academic PDF Tools & Online e-Sevai Guide for Coimbatore',
    heroTitleTa: 'கோயம்புத்தூர் மாணவர்கள் & குடிமக்களுக்கான ஆன்லைன் போட்டோ/PDF கருவிகள் & இ-சேவை வழிகாட்டி',
    heroSubEn: 'Built for engineering/college students across Coimbatore, Peelamedu, Pollachi, and Mettupalayam preparing TNEA, scholarship, and employment files locally in browser. AK E-SEVAI operates online support remotely across Tamil Nadu; our physical desk is located in Palani only.',
    heroSubTa: 'கோயம்புத்தூர், பொள்ளாச்சி மற்றும் மேட்டுப்பாளையம் பகுதி பொறியியல்/கலைக் கல்லூரி மாணவர்கள் TNEA, கல்வி உதவித்தொகை மற்றும் வேலைவாய்ப்பு ஆவணங்களைப் பிரவுசரிலேயே எளிதாகத் தயார் செய்ய உதவுகிறது. (நேரடி மையம் பழனியில் மட்டுமே; கோவைக்கு ஆன்லைன் சேவைகள் மட்டுமே).',
    officialPortals: [
      { label: 'Coimbatore District Administration (coimbatore.nic.in)', url: 'https://coimbatore.nic.in/' },
      { label: 'Tamil Nadu e-Sevai Portal (tnesevai.tn.gov.in)', url: 'https://www.tnesevai.tn.gov.in/' },
      { label: 'Revenue Land Records (eservices.tn.gov.in)', url: 'https://eservices.tn.gov.in/eservicesnew/home.html' },
      { label: 'TNREGINET EC Portal', url: 'https://tnreginet.gov.in/' }
    ],
    localNuances: [
      {
        titleEn: 'TNEA, Engineering & Scholarship Multi-Certificate PDFs',
        titleTa: 'கல்லூரி சேர்க்கை & உதவித்தொகை PDF தயாரிப்பு',
        bodyEn: 'Coimbatore’s dense student population frequently needs First Graduate, Income, and Community certificates merged with marksheets under strict KB thresholds before uploading to counselling and scholarship portals.',
        bodyTa: 'கோவை கல்லூரி மாணவர்கள் TNEA கலந்தாய்வு மற்றும் உதவித்தொகை தளங்களில் முதல் பட்டதாரி, வருமானம், சாதிச் சான்றிதழ்களை ஒரே PDF-ஆக மாற்றி பதிவேற்ற PDF Merge மற்றும் Compress கருவிகள் உதவுகின்றன.'
      },
      {
        titleEn: 'Industrial & MSME Applicant Fast Formatting',
        titleTa: 'தொழில் & பணி விண்ணப்ப ஆவண அளவீடு',
        bodyEn: 'Compress Aadhaar, bank passbook, and PAN scans cleanly under 100 KB or 200 KB in browser memory without sending personal ID copies to third-party upload servers.',
        bodyTa: 'தனியார் மற்றும் அரசு விண்ணப்பங்களுக்கு ஆதார் மற்றும் வங்கிப் பாஸ்புக் நகல்களை சர்வருக்கு அனுப்பாமல் பிரவுசரிலேயே 100 KB / 200 KB அளவிற்கு மாற்றலாம்.'
      }
    ],
    recommendedTools: ['jpg-to-pdf', 'pdf-merge', 'photo-compress-100kb', 'photo-compress-200kb', 'tnpsc-photo-resizer'],
    faqs: [
      {
        q: 'Is AK E-SEVAI located inside Coimbatore city?',
        qTa: 'கோயம்புத்தூர் நகரில் AK E-SEVAI-க்கு கிளை அலுவலகம் உள்ளதா?',
        a: 'No. Our sole walk-in physical office is on Mill Road, Palani (Tamil Nadu 624601). All Coimbatore users have free 24/7 online access to our browser photo/PDF suite and remote WhatsApp assistance.',
        aTa: 'இல்லை. எங்கள் நேரடி அலுவலகம் பழனியில் (மில் ரோடு, 624601) மட்டுமே உள்ளது. கோவை பயனர்கள் ஆன்லைன் கருவிகள் மற்றும் வாட்ஸ்அப் வழிகாட்டலை எந்த நேரத்திலும் பயன்படுத்தலாம்.'
      },
      {
        q: 'Can college students in Coimbatore compress marksheet PDFs privately?',
        qTa: 'கோவை மாணவர்கள் மார்க்ஷீட் PDF-களை சர்வருக்கு அனுப்பாமல் சுருக்க முடியுமா?',
        a: 'Yes. Both Photo Compressor 100KB/200KB and PDF Compressor process files inside your own browser RAM with zero server transmission.',
        aTa: 'ஆம்! அனைத்து பட மற்றும் PDF சுருக்கங்களும் உங்கள் பிரவுசர் மெமரியிலேயே பாதுகாப்பாக நடைபெறும்.'
      }
    ]
  },
  'madurai-online-esevai-assistance': {
    routeId: 'madurai-online-esevai-assistance',
    cityEn: 'Madurai',
    cityTa: 'மதுரை',
    canonical: 'https://www.akesevai.com/madurai-online-esevai-assistance',
    title: 'Madurai Online Exam Photo Tools, PDF Utilities & e-Sevai Guide | AK E-SEVAI',
    titleTa: 'மதுரை TNPSC/காவலர் தேர்வு போட்டோ & ஆன்லைன் இ-சேவை வழிகாட்டி | AK E-SEVAI',
    description: 'TNPSC/TNUSRB photo resizers, Patta/EC PDF merge tools and online e-Sevai guidance for Madurai, Melur & Thirumangalam residents. Remote online service only; physical centre in Palani.',
    descriptionTa: 'மதுரை, மேலூர், திருமங்கலம் பகுதி அரசுத் தேர்வு மாணவர்களுக்கான TNPSC/TNUSRB போட்டோ & கையொப்பக் கருவிகள், பட்டா/EC PDF இணைப்பு & இ-சேவை வழிகாட்டி. (ஆன்லைன் உதவி மட்டுமே).',
    keywords: 'madurai online e sevai assistance, madurai tnpsc photo resize, madurai pdf merge online, tnusrb photo resize madurai',
    badgeEn: 'Madurai Online Resource & Tools',
    badgeTa: 'மதுரை ஆன்லைன் வழிகாட்டி & கருவிகள்',
    heroTitleEn: 'TNPSC / Police Exam Photo Tools & Online e-Sevai Guide for Madurai',
    heroTitleTa: 'மதுரைக்கான TNPSC / காவலர் தேர்வுப் படக் கருவிகள் & ஆன்லைன் இ-சேவை வழிகாட்டி',
    heroSubEn: 'Designed for Southern Tamil Nadu aspirants across Madurai, Melur, Thirumangalam, and Usilampatti preparing competitive exam images and property/revenue PDFs online. AK E-SEVAI does not have a Madurai physical branch; our sole walk-in centre operates in Palani.',
    heroSubTa: 'மதுரை, மேலூர், திருமங்கலம் மற்றும் உசிலம்பட்டி பகுதி போட்டித் தேர்வு மாணவர்கள் மற்றும் குடிமக்களுக்கான இலவச ஆன்லைன் போட்டோ/PDF கருவிகள். (மதுரையில் எங்களுக்கு நேரடி கிளை இல்லை; பழனியில் மட்டுமே நேரடி மையம் உள்ளது; மதுரைக்கு ஆன்லைன் சேவை மட்டுமே).',
    officialPortals: [
      { label: 'Madurai District Administration (madurai.nic.in)', url: 'https://madurai.nic.in/' },
      { label: 'Tamil Nadu Public Service Commission (tnpsc.gov.in)', url: 'https://www.tnpsc.gov.in/' },
      { label: 'Tamil Nadu e-Sevai Portal (tnesevai.tn.gov.in)', url: 'https://www.tnesevai.tn.gov.in/' },
      { label: 'Land Records Portal (eservices.tn.gov.in)', url: 'https://eservices.tn.gov.in/eservicesnew/home.html' }
    ],
    localNuances: [
      {
        titleEn: 'High Volume TNPSC & TNUSRB Coaching Aspirants',
        titleTa: 'TNPSC & சீருடைப் பணியாளர் தேர்வுப் பட அளவீடு',
        bodyEn: 'Madurai candidates applying for Group 4, Group 2, SI, and Constable vacancies can verify pixel dimensions & KB limits with our Document Checker and create 350×450 or signature images cleanly before OTR submission.',
        bodyTa: 'மதுரை பகுதி தேர்வு மாணவர்கள் குரூப் 4, குரூப் 2 மற்றும் காவலர் தேர்வுகளுக்கான புகைப்படம் & கையொப்ப அளவுகளை OTR பதிவேற்றத்திற்கு முன் எளிதாக சரிசெய்யலாம்.'
      },
      {
        titleEn: 'Legal & Property Document Formatting (EC / Sale Deed PDFs)',
        titleTa: 'வில்லங்க சான்று & பத்திர PDF இணைப்பு',
        bodyEn: 'Merge multiple scanned pages of Patta, Chitta, or Encumbrance Records cleanly in browser or rotate upside-down scans permanently with PDF Rotate.',
        bodyTa: 'பட்டா, சிட்டா மற்றும் வில்லங்க சான்றிதழ் (EC) பக்கங்களை ஒன்றாக இணைக்கவும், சாய்வான பக்கங்களை PDF Rotate மூலம் நேராக்கவும் உதவுகிறது.'
      }
    ],
    recommendedTools: ['tnpsc-photo-resizer', 'signature-resize', 'dimension-checker', 'pdf-rotate', 'pdf-merge'],
    faqs: [
      {
        q: 'Do you have a physical shop or office in Madurai?',
        qTa: 'மதுரையில் AK E-SEVAI கடை உள்ளதா?',
        a: 'No. Our physical centre is strictly in Palani (Mill Road, 624601). Residents of Madurai can use our online photo/PDF tools anytime and contact +91 93423 18844 on WhatsApp for remote guidance.',
        aTa: 'இல்லை. எங்கள் நேரடி மையம் பழனியில் (மில் ரோடு, 624601) மட்டுமே உள்ளது. மதுரையில் இருப்பவர்கள் எங்கள் ஆன்லைன் கருவிகள் மற்றும் வாட்ஸ்அப் வழிகாட்டலைப் பயன்படுத்தலாம்.'
      },
      {
        q: 'Can I rotate sideways scanned land PDF documents here?',
        qTa: 'சாய்வாக ஸ்கேன் செய்யப்பட்ட பட்டா/EC PDF பக்கங்களை நேராக்க முடியுமா?',
        a: 'Yes. Use PDF Rotate (/tools/pdf-rotate) locally in your browser to rotate single or multiple pages cleanly by 90°, 180°, or 270°.',
        aTa: 'ஆம்! PDF Rotate (/tools/pdf-rotate) கருவி மூலம் 90°, 180° அல்லது 270° கோணத்தில் நிரந்தரமாகச் சுழற்றலாம்.'
      }
    ]
  },
  'trichy-online-esevai-assistance': {
    routeId: 'trichy-online-esevai-assistance',
    cityEn: 'Tiruchirappalli (Trichy)',
    cityTa: 'திருச்சிராப்பள்ளி (திருச்சி)',
    canonical: 'https://www.akesevai.com/trichy-online-esevai-assistance',
    title: 'Trichy Passport Photo Maker, PDF Tools & e-Sevai Guide | AK E-SEVAI',
    titleTa: 'திருச்சி பாஸ்போர்ட் போட்டோ மேக்கர், PDF & இ-சேவை வழிகாட்டி | AK E-SEVAI',
    description: 'Passport photo 35x45mm maker, Railway RRB / academic exam photo tools & online e-Sevai guidance for Tiruchirappalli, Srirangam & Manapparai applicants. Online service only; physical centre in Palani.',
    descriptionTa: 'திருச்சி, ஸ்ரீரங்கம், மணப்பாறை பகுதி மாணவர்கள் & குடிமக்களுக்கான பாஸ்போர்ட் போட்டோ மேக்கர், ரயில்வே (RRB) தேர்வுப் படக் கருவி மற்றும் இ-சேவை வழிகாட்டி. (ஆன்லைன் சேவை மட்டுமே).',
    keywords: 'trichy passport photo maker, tiruchirappalli e sevai online guide, trichy pdf split merge, trichy rrb exam photo resize',
    badgeEn: 'Trichy Online Resource & Tools',
    badgeTa: 'திருச்சி ஆன்லைன் வழிகாட்டி & கருவிகள்',
    heroTitleEn: 'Passport Photo Layouts, RRB Exam Tools & Online e-Sevai Guide for Trichy',
    heroTitleTa: 'திருச்சிக்கான பாஸ்போர்ட் போட்டோ, RRB தேர்வுக் கருவிகள் & ஆன்லைன் இ-சேவை வழிகாட்டி',
    heroSubEn: 'Serving students, railway exam applicants, and citizens across Tiruchirappalli, Srirangam, Manapparai, and Musiri with fast client-side photo sheets and PDF utilities. Walk-in services exist at Palani only; online assistance and browser tools serve Trichy statewide.',
    heroSubTa: 'திருச்சி, ஸ்ரீரங்கம், மணப்பாறை மற்றும் முசிறி பகுதி மாணவர்கள் மற்றும் ரயில்வே தேர்வு விண்ணப்பதாரர்களுக்கு 100% பிரவுசரிலேயே பாஸ்போர்ட் போட்டோ மற்றும் PDF ஆவணங்களைத் தயார் செய்ய உதவுகிறது. (நேரடி மையம் பழனியில் மட்டுமே).',
    officialPortals: [
      { label: 'Tiruchirappalli District Portal (tiruchirappalli.nic.in)', url: 'https://tiruchirappalli.nic.in/' },
      { label: 'Tamil Nadu e-Sevai Portal (tnesevai.tn.gov.in)', url: 'https://www.tnesevai.tn.gov.in/' },
      { label: 'TNPDS Smart Ration Portal (tnpds.gov.in)', url: 'https://www.tnpds.gov.in/' },
      { label: 'Revenue Land Records (eservices.tn.gov.in)', url: 'https://eservices.tn.gov.in/eservicesnew/home.html' }
    ],
    localNuances: [
      {
        titleEn: 'Railway Recruitment (Golden Rock / RRB) & Higher Education',
        titleTa: 'ரயில்வே (RRB) & உயர்கல்வி விண்ணப்பப் படங்கள்',
        bodyEn: 'Prepare white-background 3.5×4.5 cm photos and multi-page certificate PDFs for Railway technical postings and Trichy university/college admissions in seconds.',
        bodyTa: 'ரயில்வே தொழில்நுட்பப் பணிகள் மற்றும் திருச்சி கல்லூரி சேர்க்கைகளுக்குத் தேவையான பாஸ்போர்ட் படங்கள் மற்றும் சான்றிதழ் PDF-களை நொடியில் தயார் செய்யலாம்.'
      },
      {
        titleEn: 'Delta Agricultural & Certificate PDF Splitting',
        titleTa: 'டெல்டா விவசாய & வருவாய் ஆவண PDF பிரிப்பு',
        bodyEn: 'Need only pages 2–3 from a bundled revenue record? Use PDF Split or PDF Extract to isolate needed pages without transmitting files to any server.',
        bodyTa: 'பல பக்கங்கள் கொண்ட பட்டா/ஆவணத் தொகுப்பிலிருந்து குறிப்பிட்ட பக்கங்களை மட்டும் PDF Split / Extract மூலம் பிரவுசரிலேயே தனியாக எடுக்கலாம்.'
      }
    ],
    recommendedTools: ['passport-size-photo', 'rrb-photo-resizer', 'pdf-split', 'pdf-extract', 'photo-compress-50kb'],
    faqs: [
      {
        q: 'Can I walk into an AK E-SEVAI branch in Trichy?',
        qTa: 'திருச்சியில் AK E-SEVAI நேரடி கிளை உள்ளதா?',
        a: 'No physical branch exists in Trichy. Our walk-in centre is exclusively in Palani (624601), while all online browser tools and remote WhatsApp support (+91 93423 18844) are available for Trichy applicants.',
        aTa: 'இல்லை. பழனியில் (624601) மட்டுமே நேரடி மையம் உள்ளது. திருச்சி வாசிகளுக்கு ஆன்லைன் கருவிகள் மற்றும் வாட்ஸ்அப் வழிகாட்டல் வழங்கப்படுகிறது.'
      },
      {
        q: 'How can I make a 4x6 printable sheet of passport photos online in Trichy?',
        qTa: 'திருச்சியிலிருந்து 4x6 பாஸ்போர்ட் போட்டோ ஷீட் உருவாக்குவது எப்படி?',
        a: 'Open /tools/passport-size-photo, upload your photo, choose "4x6 Sheet (8)", and download the ready-to-print sheet locally.',
        aTa: '/tools/passport-size-photo பக்கத்திற்குச் சென்று "4x6 Sheet (8)" தேர்ந்தெடுத்து உடனடியாகப் பதிவிறக்கலாம்.'
      }
    ]
  },
  'salem-online-esevai-assistance': {
    routeId: 'salem-online-esevai-assistance',
    cityEn: 'Salem',
    cityTa: 'சேலம்',
    canonical: 'https://www.akesevai.com/salem-online-esevai-assistance',
    title: 'Salem Photo Compressor, TNPSC Resizer & Online e-Sevai Guide | AK E-SEVAI',
    titleTa: 'சேலம் போட்டோ கம்ப்ரஸர், TNPSC ரீசைசர் & இ-சேவை வழிகாட்டி | AK E-SEVAI',
    description: '20KB/50KB/100KB photo compressor, TNPSC/SSC resizers & online e-Sevai/TNEB document guide for Salem, Mettur & Attur applicants. Remote online tools only; walk-in centre in Palani.',
    descriptionTa: 'சேலம், மேட்டூர், ஆத்தூர் மற்றும் எடப்பாடி பகுதி விண்ணப்பதாரர்களுக்கான 20KB/50KB போட்டோ கம்ப்ரஸர், TNPSC ரீசைசர் & TNEB/இ-சேவை வழிகாட்டி. (ஆன்லைன் உதவி மட்டுமே).',
    keywords: 'salem photo compressor, salem e sevai online services, mettur tnpsc photo resize, salem compress image 50kb',
    badgeEn: 'Salem Online Resource & Tools',
    badgeTa: 'சேலம் ஆன்லைன் வழிகாட்டி & கருவிகள்',
    heroTitleEn: 'Photo Compression, TNPSC Resizers & Citizen Portal Guide for Salem',
    heroTitleTa: 'சேலத்திற்கான போட்டோ கம்ப்ரஸர், TNPSC தேர்வு ரீசைசர் & ஆன்லைன் இ-சேவை வழிகாட்டி',
    heroSubEn: 'Helping exam candidates and citizens across Salem, Mettur, Attur, Edappadi, and Sankari shrink heavy mobile photos to portal KB limits without losing clarity. Physical AK E-SEVAI centre exists at Palani only; online tools & WhatsApp assistance serve Salem remotely.',
    heroSubTa: 'சேலம், மேட்டூர், ஆத்தூர், எடப்பாடி பகுதி தேர்வர்கள் மற்றும் குடிமக்கள் பெரிய மொபைல் படங்களைத் தேர்வு & அரசு போர்ட்டல் KB அளவுகளுக்குச் சுருக்க உதவுகிறது. (நேரடி மையம் பழனியில் மட்டுமே; சேலத்திற்கு ஆன்லைன் கருவிகள் & வழிகாட்டல் மட்டுமே).',
    officialPortals: [
      { label: 'Salem District Administration (salem.nic.in)', url: 'https://salem.nic.in/' },
      { label: 'Tamil Nadu e-Sevai Portal (tnesevai.tn.gov.in)', url: 'https://www.tnesevai.tn.gov.in/' },
      { label: 'TANGEDCO / TNEB Online Services', url: 'https://www.tnebnet.org/' },
      { label: 'TNPDS Smart Card Portal (tnpds.gov.in)', url: 'https://www.tnpds.gov.in/' }
    ],
    localNuances: [
      {
        titleEn: 'Compressing High-Megapixel Phone Camera Photos to ≤50 KB',
        titleTa: 'மொபைல் கேமரா படங்களை ≤50 KB-க்குள் சுருக்குதல்',
        bodyEn: 'Modern phone photos often weigh 3–6 MB. Use Compress Photo 50KB or Photo Compressor 100KB cleanly in your browser to hit application limits without sending ID documents over external networks.',
        bodyTa: '3–6 MB அளவுள்ள மொபைல் புகைப்படங்களை 50 KB அல்லது 100 KB-க்குள் தெளிவு குறையாமல் பிரவுசரிலேயே சுருக்கலாம்.'
      },
      {
        titleEn: 'TNEB Name Transfer & Rural Revenue Scans',
        titleTa: 'மின் இணைப்பு பெயர் மாற்றம் & வருவாய் ஆவண PDF',
        bodyEn: 'Prepare property tax receipts, registered deeds, and ID cards for TANGEDCO / rural taluk submissions cleanly with PDF Compress and PDF Merge.',
        bodyTa: 'TANGEDCO பெயர் மாற்றம் மற்றும் தாலுகா விண்ணப்பங்களுக்கு சொத்து வரி ரசீது & பத்திர நகல்களை PDF Compress / Merge மூலம் தயார் செய்யலாம்.'
      }
    ],
    recommendedTools: ['photo-compress-50kb', 'photo-compress-20kb', 'tnpsc-photo-resizer', 'ssc-photo-resizer', 'pdf-compress'],
    faqs: [
      {
        q: 'Is there an AK E-SEVAI branch inside Salem?',
        qTa: 'சேலத்தில் AK E-SEVAI-ன் நேரடி மையம் உள்ளதா?',
        a: 'No. Our only physical centre is located in Palani (624601). Applicants in Salem can use all browser-based tools online freely and get remote guidance on +91 93423 18844.',
        aTa: 'இல்லை. எங்கள் நேரடி சேவை மையம் பழனியில் (624601) மட்டுமே உள்ளது. சேலம் வாசிகள் அனைத்து ஆன்லைன் கருவிகளையும் வாட்ஸ்அப் வழிகாட்டலையும் தாராளமாகப் பயன்படுத்தலாம்.'
      },
      {
        q: 'Can I check if my compressed signature stays under 20 KB?',
        qTa: 'சுருக்கிய கையொப்பம் 20 KB-க்குள் உள்ளதா என எப்படி சரிபார்ப்பது?',
        a: 'Signature Resize displays exact output file size immediately before downloading, and Document Size Checker inspects exact KB and pixel metrics.',
        aTa: 'Signature Resize கருவியே பதிவிறக்கும் முன் சரியான KB அளவைக் காட்டும்; Document Size Checker மூலமும் உறுதிசெய்யலாம்.'
      }
    ]
  }
};
