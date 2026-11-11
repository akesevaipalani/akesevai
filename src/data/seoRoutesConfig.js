// src/data/seoRoutesConfig.js
// Isomorphic SEO, Redirect, Robots, Canonical & JSON-LD configuration shared by React (SEOHeadManager) and Express (server.js)

import { PHOTO_TOOLS_CATALOG, SEARCH_INTENT_TOOL_ALIASES } from './photoToolsData.js';
import { CITY_DEDICATED_GUIDES } from './regionalCitiesData.js';

export const BASE_URL = 'https://www.akesevai.com';
export const DEFAULT_OG_IMAGE = `${BASE_URL}/logo.png`;

export const PALANI_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Mill Rd, Sanmugapuram, Anna Nagar',
  addressLocality: 'Palani',
  addressRegion: 'Tamil Nadu',
  postalCode: '624601',
  addressCountry: 'IN'
};

export const ORGANIZATION_NODE = {
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'AK E-SEVAI',
  legalName: 'AK E-SEVAI Digital Service Centre',
  alternateName: ['AK E-SEVAI Palani', 'AkEsevai', 'அக் இ-சேவை'],
  url: `${BASE_URL}/`,
  logo: DEFAULT_OG_IMAGE,
  telephone: '+919342318844',
  email: 'akesevaipalani@gmail.com',
  address: PALANI_ADDRESS,
  areaServed: {
    '@type': 'State',
    name: 'Tamil Nadu',
    sameAs: 'https://en.wikipedia.org/wiki/Tamil_Nadu'
  }
};

export const PALANI_LOCAL_BUSINESS_NODE = {
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${BASE_URL}/#palani-centre`,
  name: 'AK E-SEVAI Digital Service Centre Palani',
  alternateName: 'பழனி அக் இ-சேவை டிஜிட்டல் மையம்',
  url: `${BASE_URL}/`,
  logo: DEFAULT_OG_IMAGE,
  image: DEFAULT_OG_IMAGE,
  description:
    'AK E-SEVAI physical walk-in centre in Palani (Mill Rd, 624601) offering Xerox, Colour Printing, Tamil/English Typing, Spiral Binding, Lamination, and e-Sevai document assistance.',
  telephone: '+919342318844',
  email: 'akesevaipalani@gmail.com',
  priceRange: '₹',
  parentOrganization: { '@id': `${BASE_URL}/#organization` },
  address: PALANI_ADDRESS,
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 10.4503,
    longitude: 77.5186
  },
  hasMap:
    'https://www.google.com/maps/search/?api=1&query=AK+Esevai%2C+Mill+Rd%2C+Sanmugapuram%2C+Anna+Nagar%2C+Palani%2C+Tamil+Nadu+624601',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '20:00'
    }
  ]
};

const CITY_PAGE_SEO = Object.fromEntries(
  Object.values(CITY_DEDICATED_GUIDES).map((guide) => [
    guide.routeId,
    {
      title: guide.title,
      description: guide.description,
      keywords: guide.keywords,
      canonical: guide.canonical,
      schemaType: 'city-online-service',
      cityName: guide.cityEn,
      breadcrumbLabel: `${guide.cityEn} Online Guide`,
      faqs: guide.faqs
    }
  ])
);

export const PAGE_SEO_MAP = {
  home: {
    title: 'AK E-SEVAI Tamil Nadu | Free Photo, PDF Tools & Online e-Sevai Guidance',
    description:
      'AK E-SEVAI offers free browser-based photo compression, passport size photo maker, PDF merge/split/compress tools and online e-Sevai guidance across Tamil Nadu. Walk-in centre in Palani.',
    keywords:
      'AK E-SEVAI, Tamil Nadu e-Sevai online services, photo compressor, passport photo maker online, pdf merge online, tnpsc photo resize, akesevai palani, esevai maiyam',
    canonical: `${BASE_URL}/`,
    schemaType: 'palani-home'
  },
  services: {
    title: 'e-Sevai Services Directory | Revenue Certificates, Ration Card, Patta Chitta | AK E-SEVAI',
    description:
      'Explore Tamil Nadu e-Sevai document guidance and application support for Income, Community, Nativity, First Graduate, Legal Heir certificates, Smart Ration Card & Patta Chitta.',
    keywords:
      'tamil nadu esevai services, income certificate guidance, community certificate apply online, nativity certificate, first graduate certificate, patta chitta, ration card update, palani esevai',
    canonical: `${BASE_URL}/services`,
    schemaType: 'palani-local'
  },
  'esevai-services': {
    title: 'Tamil Nadu Online e-Sevai Services & Document Preparation Hub | AK E-SEVAI',
    description:
      'Statewide Tamil Nadu online e-Sevai certificate checklists, TNeGA portal orientation, land record guidance and free browser PDF/photo utilities. Physical centre in Palani.',
    keywords:
      'tamil nadu online esevai services, tnesevai guide, online certificate preparation tamil nadu, free document tools tamil nadu',
    canonical: `${BASE_URL}/esevai-services`,
    schemaType: 'statewide-service',
    breadcrumbLabel: 'Tamil Nadu e-Sevai Services'
  },
  'photo-tools': {
    title: '31 Free Online Photo & PDF Tools (20KB, 50KB, 100KB, Passport, PDF Merge) | AK E-SEVAI',
    description:
      '100% Free browser-based photo and PDF tools: Passport photo sheet maker, 20KB/50KB/100KB/200KB photo compressor, TNPSC/SSC/RRB resizers, PDF merge, split, rotate, extract & compress.',
    keywords:
      'photo tools, pdf tools, passport photo maker online, photo compressor, jpg to pdf, pdf merge online, pdf split, pdf compress, tnpsc photo resizer, free online document tools',
    canonical: `${BASE_URL}/photo-tools`,
    schemaType: 'statewide-service',
    breadcrumbLabel: 'Photo & Document Tools'
  },
  'pdf-tools': {
    title: 'Free Online PDF Tools India — Merge, Split, Rotate, Compress & PDF to JPG | AK E-SEVAI',
    description:
      'Private client-side PDF tools for Tamil Nadu e-Sevai, TNEA admissions & job applications. Merge PDFs, split ranges, rotate pages, extract certificates, compress PDFs & convert PDF to JPG.',
    keywords:
      'pdf merge online, pdf split online, pdf rotate online, pdf extract pages, pdf compressor, pdf to jpg, jpg to pdf, free pdf tools tamil nadu',
    canonical: `${BASE_URL}/pdf-tools`,
    schemaType: 'statewide-service',
    breadcrumbLabel: 'Online PDF Tools'
  },
  'government-exam-tools': {
    title: 'TNPSC, SSC, RRB & UPSC Photo and Signature Resizer Tools | AK E-SEVAI',
    description:
      'Prepare TNPSC, SSC, Railway RRB, UPSC and Banking exam photographs and signatures cleanly to portal KB and pixel limits directly inside your browser.',
    keywords:
      'tnpsc photo resizer, ssc photo resizer, rrb photo resizer, exam photo compressor 50kb, signature resize 20kb, upsc photo tool tamil nadu',
    canonical: `${BASE_URL}/government-exam-tools`,
    schemaType: 'statewide-service',
    breadcrumbLabel: 'Government Exam Photo Tools'
  },
  'passport-photo-services': {
    title: 'Passport Size Photo Maker Online & 4x6 Print Sheet Guide | AK E-SEVAI',
    description:
      'Create 3.5x4.5 cm Indian application passport photos, printable 4x6 & A4 multi-photo sheets, and plain white/light blue backdrops directly in your browser.',
    keywords:
      'passport size photo maker, 35x45mm photo maker, 4x6 passport photo sheet online, passport photo background white, passport photo guide',
    canonical: `${BASE_URL}/passport-photo-services`,
    schemaType: 'statewide-service',
    breadcrumbLabel: 'Passport Photo Services'
  },
  'online-document-services': {
    title: 'Online Document Preparation, File Checker & Printing Guide | AK E-SEVAI',
    description:
      'Verify PDF/JPG file weights and pixel dimensions before portal submission, compress scans under 100KB/200KB across Tamil Nadu, or visit Palani for physical printing and binding.',
    keywords:
      'online document services tamil nadu, document size checker, compress scan 200kb, online application preparation, xerox typing binding palani',
    canonical: `${BASE_URL}/online-document-services`,
    schemaType: 'statewide-service',
    breadcrumbLabel: 'Online Document Services'
  },
  'tamil-nadu-district-esevai-guides': {
    title: 'Tamil Nadu 16-City Online e-Sevai Portals & Free Document Tools | AK E-SEVAI',
    description:
      'Verified .nic.in district portal directories and free browser photo/PDF tools covering 16 Tamil Nadu cities including Chennai, Coimbatore, Madurai, Trichy, Salem, Tirunelveli & Palani.',
    keywords:
      'tamil nadu district esevai guides, chennai coimbatore madurai trichy salem esevai portal links, tamil nadu online application tools',
    canonical: `${BASE_URL}/tamil-nadu-district-esevai-guides`,
    schemaType: 'statewide-service',
    breadcrumbLabel: 'Tamil Nadu 16-City Guide'
  },
  'certificate-services': {
    title: 'Tamil Nadu e-Sevai Certificate Application Assistance | Income, Community, Nativity | AK E-SEVAI',
    description:
      'Document checklists and application guidance for Income, Community, Nativity, First Graduate, and Legal Heir certificates across Tamil Nadu.',
    keywords:
      'certificate services tamil nadu, income certificate apply online, community certificate checklist, nativity certificate tamil nadu, first graduate certificate, legal heir certificate',
    canonical: `${BASE_URL}/certificate-services`,
    schemaType: 'statewide-service',
    breadcrumbLabel: 'Certificate Guidance'
  },
  'online-application-assistance': {
    title: 'Government Exam & College Online Application Assistance | TNPSC, SSC, RRB, TNEA | AK E-SEVAI',
    description:
      'Application checklist guidance, document formatting tools and remote WhatsApp support for TNPSC, SSC, Railway RRB, Police, and college counselling portals across Tamil Nadu.',
    keywords:
      'online application assistance tamil nadu, tnpsc application help, ssc online form assistance, rrb exam file preparation, tnea admission pdf guide',
    canonical: `${BASE_URL}/online-application-assistance`,
    schemaType: 'statewide-service',
    breadcrumbLabel: 'Application Assistance'
  },
  'tn-govt-services-guide': {
    title: 'Tamil Nadu Citizen Services Guide | Patta Chitta, Smart Ration Card, EC | AK E-SEVAI',
    description:
      'Citizen guidance for Patta Chitta land records, TN PDS Smart Ration card requests, Encumbrance Certificate (EC), TNeGA CAN number & verified official portals.',
    keywords:
      'tamil nadu govt services guide, patta chitta online, smart ration card online, encumbrance certificate ec online, can number tnega',
    canonical: `${BASE_URL}/tn-govt-services-guide`,
    schemaType: 'statewide-service',
    breadcrumbLabel: 'TN Govt Services Guide'
  },
  'status-track': {
    title: 'Track Application & Token Status | AK E-SEVAI Service Desk Tracker',
    description:
      'Check the progress status of applications and tokens registered through the AK E-SEVAI digital assistance desk.',
    keywords: 'akesevai status track, akesevai application status check, token status tracker',
    canonical: `${BASE_URL}/status-track`,
    schemaType: 'palani-local'
  },
  'token-generator': {
    title: 'Online Token Generator Palani | Live Counter Queue Slot Booking | AK E-SEVAI',
    description:
      'Book a walk-in service counter queue token online for AK E-SEVAI Digital Centre on Mill Road, Palani.',
    keywords: 'esevai token generator palani, akesevai live token, palani esevai queue booking',
    canonical: `${BASE_URL}/token-generator`,
    schemaType: 'palani-local'
  },
  notifications: {
    title: 'Latest Tamil Nadu Govt Job & Exam Notifications | AK E-SEVAI',
    description:
      'Check active recruitment notifications for TNPSC, TNUSRB, SSC, Railway RRB, UPSC and Tamil Nadu government exams with verified official links.',
    keywords: 'tamil nadu govt job notifications, tnpsc exam updates, ssc rrb notifications tamil nadu',
    canonical: `${BASE_URL}/notifications`,
    schemaType: 'statewide-service',
    breadcrumbLabel: 'Exam Notifications'
  },
  about: {
    title: 'About AK E-SEVAI | Palani Digital Service Centre & Tamil Nadu Online Tools',
    description:
      'Learn about AK E-SEVAI — our walk-in digital service centre in Palani and free client-side document tools serving citizens across Tamil Nadu.',
    keywords: 'about akesevai, akesevai palani, digital service centre tamil nadu',
    canonical: `${BASE_URL}/about`,
    schemaType: 'palani-local'
  },
  contact: {
    title: 'Contact AK E-SEVAI Digital Centre Palani | Mill Road | +91 93423 18844',
    description:
      'Office address, WhatsApp number, email and Google Maps location of AK E-SEVAI Digital Service Centre at Mill Road, Palani 624601. Remote WhatsApp support statewide.',
    keywords: 'akesevai contact, akesevai palani phone number, akesevai whatsapp number, palani mill road esevai',
    canonical: `${BASE_URL}/contact`,
    schemaType: 'palani-local'
  },
  'xerox-printing': {
    title: 'Xerox, Colour Printing & Document Scanning in Palani | AK E-SEVAI',
    description:
      'Walk-in B/W Xerox, laser colour printing, A4/Legal copies and scanning at AK E-SEVAI Palani (Mill Road, 624601). Send files via WhatsApp before walking in.',
    keywords: 'palani xerox, xerox shop in palani, colour printing palani, whatsapp print palani',
    canonical: `${BASE_URL}/xerox-printing`,
    schemaType: 'palani-local'
  },
  'typing-services': {
    title: 'Tamil & English Document Typing Centre in Palani | AK E-SEVAI',
    description:
      'Walk-in Tamil (Unicode/Bamini) and English typing in Palani for petitions, resumes, applications, and project documentation at AK E-SEVAI.',
    keywords: 'palani typing centre, tamil typing palani, english typing palani, resume typing palani',
    canonical: `${BASE_URL}/typing-services`,
    schemaType: 'palani-local'
  },
  'spiral-binding': {
    title: 'Spiral Binding & Certificate Lamination in Palani | AK E-SEVAI',
    description:
      'Walk-in coil spiral binding and document lamination for college project reports, marksheets, and certificates in Palani at AK E-SEVAI.',
    keywords: 'palani spiral binding, project binding palani, certificate lamination palani',
    canonical: `${BASE_URL}/spiral-binding`,
    schemaType: 'palani-local'
  },
  ...CITY_PAGE_SEO
};

export const PRIVATE_NOINDEX_ROUTES = {
  admin: { title: 'Admin Desk | AK E-SEVAI' },
  forms: { title: 'Forms Library | AK E-SEVAI' },
  software: { title: 'Utility Software | AK E-SEVAI' },
  customer: { title: 'Customer Portal | AK E-SEVAI' },
  weblink: { title: 'Official Govt Websites Directory | AK E-SEVAI' },
  'photo-maker': { title: 'Photo Studio Helper | AK E-SEVAI' },
  'whatsapp-poster': { title: 'WhatsApp Poster Studio | AK E-SEVAI' }
};

// Canonical HTTP 301 redirect map (lowercase normalized paths without trailing slash)
export const SEO_REDIRECTS_MAP = {
  '/tools': '/photo-tools',
  '/esevai': '/esevai-services',
  '/online-services': '/services',
  '/palani-esevai-centre': '/about',
  '/useful-links': '/weblink',
  '/important-links': '/weblink',
  '/tools/image-resizer': '/tools/photo-resizer',
  '/tools/signature-resizer': '/tools/signature-resize',
  ...Object.fromEntries(
    Object.entries(SEARCH_INTENT_TOOL_ALIASES).map(([aliasSlug, info]) => [
      `/tools/${aliasSlug}`,
      `/tools/${info.parentId}`
    ])
  )
};

export const VALID_PAGE_IDS = [
  ...Object.keys(PAGE_SEO_MAP),
  ...Object.keys(PRIVATE_NOINDEX_ROUTES),
  'not-found'
];

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function safeJsonLdStringify(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

export function normalizePathname(rawPathname = '/') {
  const clean = String(rawPathname || '/').split('?')[0].split('#')[0].trim().toLowerCase();
  if (!clean || clean === '/') return '/';
  return clean.replace(/\/+$/, '') || '/';
}

export function resolveQueryRedirect(queryObj = {}) {
  const rawTool = typeof queryObj.tool === 'string' ? queryObj.tool.trim().toLowerCase() : '';
  const rawPage = typeof queryObj.page === 'string' ? queryObj.page.trim().toLowerCase() : '';

  if (rawTool) {
    const candidatePath = `/tools/${rawTool.replace(/^\/+/, '').replace(/^tools\//, '').replace(/\/$/, '')}`;
    if (SEO_REDIRECTS_MAP[candidatePath]) return SEO_REDIRECTS_MAP[candidatePath];
    const directTool = PHOTO_TOOLS_CATALOG.find((t) => t.path === candidatePath || t.id === rawTool);
    if (directTool) return directTool.path;
  }

  if (rawPage) {
    if (rawPage === 'tools' || rawPage === 'photo-tools') return '/photo-tools';
    const candidate = `/${rawPage.replace(/^\/+/, '').replace(/\/$/, '')}`;
    if (SEO_REDIRECTS_MAP[candidate]) return SEO_REDIRECTS_MAP[candidate];
    const id = candidate.slice(1);
    if (PAGE_SEO_MAP[id]) return id === 'home' ? '/' : candidate;
  }

  return null;
}

function buildToolSchema(toolData) {
  const cleanName = toolData.title.split('|')[0].split('–')[0].trim();
  const fullUrl = `${BASE_URL}${toolData.path}`;
  const faqEntities = (toolData.faqs || []).map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.a
    }
  }));

  const howToSteps = (toolData.howTo || []).map((step) => ({
    '@type': 'HowToStep',
    position: step.step,
    name: step.title,
    text: step.text
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['SoftwareApplication', 'WebApplication'],
        '@id': `${fullUrl}#app`,
        name: cleanName,
        url: fullUrl,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All (Web, Android, iOS, Windows, macOS)',
        browserRequirements: 'Requires HTML5 Canvas and JavaScript',
        provider: { '@id': `${BASE_URL}/#organization` },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR'
        },
        description: toolData.description
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${fullUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Photo & PDF Tools', item: `${BASE_URL}/photo-tools` },
          { '@type': 'ListItem', position: 3, name: cleanName, item: fullUrl }
        ]
      },
      ...(faqEntities.length > 0
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${fullUrl}#faq`,
              mainEntity: faqEntities
            }
          ]
        : []),
      ...(howToSteps.length > 0
        ? [
            {
              '@type': 'HowTo',
              '@id': `${fullUrl}#howto`,
              name: `How to use ${cleanName}`,
              description: toolData.description,
              step: howToSteps
            }
          ]
        : [])
    ]
  };
}

function buildPageSchema(pageId, seoMeta) {
  const canonical = seoMeta.canonical || `${BASE_URL}/${pageId === 'home' ? '' : pageId}`;
  const cleanTitle = seoMeta.title.split('|')[0].trim();

  if (seoMeta.schemaType === 'palani-home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          name: 'AK E-SEVAI',
          alternateName: ['AK E-SEVAI Tamil Nadu', 'AK E-SEVAI Palani', 'www.akesevai.com'],
          url: `${BASE_URL}/`
        },
        ORGANIZATION_NODE,
        PALANI_LOCAL_BUSINESS_NODE
      ]
    };
  }

  if (seoMeta.schemaType === 'palani-local') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        ORGANIZATION_NODE,
        PALANI_LOCAL_BUSINESS_NODE,
        {
          '@type': 'BreadcrumbList',
          '@id': `${canonical}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: cleanTitle, item: canonical }
          ]
        }
      ]
    };
  }

  // Statewide or City Online Service Page (never fabricates a local branch address outside Palani)
  const areaServedNode = seoMeta.cityName
    ? { '@type': 'City', name: seoMeta.cityName, containedInPlace: { '@type': 'State', name: 'Tamil Nadu' } }
    : { '@type': 'State', name: 'Tamil Nadu' };

  const faqEntities = (seoMeta.faqs || []).map((faq) => ({
    '@type': 'Question',
    name: faq.q,
    acceptedAnswer: { '@type': 'Answer', text: faq.a }
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      ORGANIZATION_NODE,
      {
        '@type': 'Service',
        '@id': `${canonical}#service`,
        name: cleanTitle,
        serviceType: 'Online Document Tools & e-Sevai Application Guidance',
        url: canonical,
        description: seoMeta.description,
        provider: { '@id': `${BASE_URL}/#organization` },
        areaServed: areaServedNode
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
          {
            '@type': 'ListItem',
            position: 2,
            name: seoMeta.breadcrumbLabel || cleanTitle,
            item: canonical
          }
        ]
      },
      ...(faqEntities.length > 0
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${canonical}#faq`,
              mainEntity: faqEntities
            }
          ]
        : [])
    ]
  };
}

export function resolveRouteSeo(rawPathname = '/') {
  const normalized = normalizePathname(rawPathname);

  // 1. Exact 301 redirect alias?
  if (SEO_REDIRECTS_MAP[normalized]) {
    return {
      status: 301,
      redirectTo: SEO_REDIRECTS_MAP[normalized],
      noindex: true,
      pageId: 'redirect',
      seo: null,
      jsonLd: null
    };
  }

  // 2. Canonical Tool Route? (/tools/<id>)
  if (normalized.startsWith('/tools/')) {
    const slug = normalized.slice('/tools/'.length);
    const tool = PHOTO_TOOLS_CATALOG.find((t) => t.id === slug || t.path === normalized);
    if (!tool) {
      return {
        status: 404,
        redirectTo: null,
        noindex: true,
        pageId: 'not-found',
        seo: {
          title: 'Tool Not Found (404) | AK E-SEVAI',
          description: 'The requested document or photo tool page could not be found on AK E-SEVAI.',
          keywords: 'ak esevai 404',
          canonical: `${BASE_URL}${normalized}`
        },
        jsonLd: null
      };
    }

    return {
      status: 200,
      redirectTo: null,
      noindex: false,
      pageId: `tools/${tool.id}`,
      tool,
      seo: {
        title: tool.title,
        description: tool.description,
        keywords: tool.keywords,
        canonical: `${BASE_URL}${tool.path}`,
        ogType: 'website'
      },
      jsonLd: buildToolSchema(tool)
    };
  }

  // 3. Home or Named Public Page?
  const pageId = normalized === '/' ? 'home' : normalized.slice(1);
  if (PAGE_SEO_MAP[pageId]) {
    const seoMeta = PAGE_SEO_MAP[pageId];
    return {
      status: 200,
      redirectTo: null,
      noindex: false,
      pageId,
      seo: {
        title: seoMeta.title,
        description: seoMeta.description,
        keywords: seoMeta.keywords,
        canonical: seoMeta.canonical,
        ogType: 'website'
      },
      jsonLd: buildPageSchema(pageId, seoMeta)
    };
  }

  // 4. Private / Auxiliary Noindex Route?
  if (PRIVATE_NOINDEX_ROUTES[pageId]) {
    return {
      status: 200,
      redirectTo: null,
      noindex: true,
      pageId,
      seo: {
        title: PRIVATE_NOINDEX_ROUTES[pageId].title,
        description: 'AK E-SEVAI workspace and directory route.',
        keywords: 'ak esevai',
        canonical: `${BASE_URL}/${pageId}`,
        ogType: 'website'
      },
      jsonLd: null
    };
  }

  // 5. Real 404 Not Found for any unrecognized path
  return {
    status: 404,
    redirectTo: null,
    noindex: true,
    pageId: 'not-found',
    seo: {
      title: 'Page Not Found (404) | AK E-SEVAI',
      description: 'The requested page could not be found on AK E-SEVAI.',
      keywords: 'ak esevai 404',
      canonical: `${BASE_URL}${normalized}`
    },
    jsonLd: null
  };
}
