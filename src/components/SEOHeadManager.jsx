import { useEffect } from 'react';
import { PHOTO_TOOLS_CATALOG, getToolBySlugOrId } from '../data/photoToolsData';

const BASE_URL = 'https://www.akesevai.com';

const PAGE_SEO_MAP = {
  home: {
    title: 'AkEsevai Palani | Best e-Sevai Centre in Palani | Aadhaar, PAN, Income & Community Certificate',
    description: 'Top #1 Official AkEsevai Digital Service Centre in Palani (பழனி இ-சேவை மையம்). Fast online applications for Aadhaar Card, PAN Card, Income Certificate, Community Certificate, Smart Ration Card, Patta Chitta & Token Booking. Visit opposite Palani Bus Stand or www.akesevai.com. Call 93423 18844.',
    keywords: 'best esevai maiyam in palani, esevai maiyam in palani, palani esevai maiyam, aadhaar card service in palani, pan card apply palani, income certificate apply palani, community certificate apply palani, smart ration card palani, akesevai palani, www.akesevai.com',
    canonical: 'https://www.akesevai.com/'
  },
  services: {
    title: 'All e-Sevai Services in Palani | Aadhaar, PAN, Certificates, Ration Card, Patta Chitta | AkEsevai',
    description: 'Explore 30+ Government e-Sevai services at AkEsevai Palani. Apply online for Income, Community, Nativity, First Graduate, Legal Heir certificates, Smart Ration Card, Voter ID & Patta Chitta.',
    keywords: 'palani esevai services, income certificate palani, community certificate palani, nativity certificate palani, first graduate certificate palani, patta chitta palani, ration card apply palani',
    canonical: 'https://www.akesevai.com/services'
  },
  'photo-tools': {
    title: 'Free Online Photo & Document Tools – AK e-Sevai Palani',
    description: '100% Free & private photo and document tools by AK e-Sevai: Passport photo maker, photo compressor (20KB, 50KB, 100KB), resizer, cropper, JPG to PDF, PNG to JPG converter.',
    keywords: 'photo tools, document tools, passport photo maker online, photo compressor, jpg to pdf, akesevai photo tools, புகைப்படம் & ஆவணக் கருவிகள், free online photo tools',
    canonical: 'https://www.akesevai.com/photo-tools'
  },
  'status-track': {
    title: 'Track e-Sevai Application Status Palani | AkEsevai Live Status Tracker (TN-AK-2026)',
    description: 'Check live status of your Tamil Nadu e-Sevai application (TN-AK-2026), certificate approvals, and Government processing stage at AkEsevai Palani.',
    keywords: 'esevai status track palani, akesevai status check, tn esevai application status palani, certificate status palani',
    canonical: 'https://www.akesevai.com/status-track'
  },
  'token-generator': {
    title: 'Online Token Generator Palani | Live Counter Queue Slot Booking | AkEsevai',
    description: 'Book live queue token online for AkEsevai Digital Centre Palani. Skip the line and get instant token slip on your mobile.',
    keywords: 'esevai token generator palani, akesevai live token, palani esevai queue booking, token booking palani',
    canonical: 'https://www.akesevai.com/token-generator'
  },
  notifications: {
    title: 'Latest Tamil Nadu Govt Notifications & Exam Updates | AkEsevai Palani',
    description: 'Get real-time updates on TNPSC, TNUSRB, SSC, Railway exams, welfare schemes, college admissions, and government job application deadlines.',
    keywords: 'tamil nadu govt exam updates, tnpsc notifications, esevai notifications palani, govt scheme updates',
    canonical: 'https://www.akesevai.com/notifications'
  },
  about: {
    title: 'About AkEsevai Palani | Trusted e-Sevai & Digital Citizen Services',
    description: 'Learn about AkEsevai Palani digital service center mission, history, authentic certification assistance, and customer support standards in Palani.',
    keywords: 'about akesevai palani, esevai centre info, palani citizen services',
    canonical: 'https://www.akesevai.com/about'
  },
  contact: {
    title: 'Contact AkEsevai Digital Centre Palani | Bus Stand Opposite & Mill Road | Phone 93423 18844',
    description: 'Location, phone number, WhatsApp contact and Google Maps address of AkEsevai Digital Service Centre opposite Palani Bus Stand. Call 93423 18844.',
    keywords: 'akesevai palani phone number, esevai maiyam near palani bus stand, akesevai contact palani, palani esevai address',
    canonical: 'https://www.akesevai.com/contact'
  }
};

export default function SEOHeadManager({ activeTab = 'home', currentToolId = '' }) {
  useEffect(() => {
    // 1. Determine SEO Data
    let seoData = null;
    let toolData = null;

    // Check if it is a tool route (e.g. 'tools/passport-size-photo' or 'tools:passport-size-photo')
    const toolIdentifier = currentToolId || (activeTab.startsWith('tools/') ? activeTab.replace('tools/', '') : null);
    
    if (toolIdentifier) {
      toolData = getToolBySlugOrId(toolIdentifier);
    }

    if (toolData) {
      seoData = {
        title: toolData.title,
        description: toolData.description,
        keywords: toolData.keywords,
        canonical: `${BASE_URL}${toolData.path}`
      };
    } else {
      seoData = PAGE_SEO_MAP[activeTab] || PAGE_SEO_MAP.home;
    }

    // 2. Update Document Title
    document.title = seoData.title;

    // 3. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = seoData.description;

    // 4. Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = seoData.keywords;

    // 5. Update Canonical Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = seoData.canonical || `${BASE_URL}/${activeTab === 'home' ? '' : activeTab}`;

    // 6. Update Open Graph Tags
    const setOgTag = (property, content) => {
      let og = document.querySelector(`meta[property="${property}"]`);
      if (!og) {
        og = document.createElement('meta');
        og.setAttribute('property', property);
        document.head.appendChild(og);
      }
      og.content = content;
    };

    setOgTag('og:title', seoData.title);
    setOgTag('og:description', seoData.description);
    setOgTag('og:url', canonicalTag.href);
    setOgTag('og:type', toolData ? 'article' : 'website');
    setOgTag('og:site_name', 'AK e-Sevai');
    setOgTag('og:image', `${BASE_URL}/logo.png`);

    // 7. Update Twitter Card Tags
    const setTwitterTag = (name, content) => {
      let tw = document.querySelector(`meta[name="${name}"]`);
      if (!tw) {
        tw = document.createElement('meta');
        tw.name = name;
        document.head.appendChild(tw);
      }
      tw.content = content;
    };

    setTwitterTag('twitter:card', 'summary_large_image');
    setTwitterTag('twitter:title', seoData.title);
    setTwitterTag('twitter:description', seoData.description);
    setTwitterTag('twitter:image', `${BASE_URL}/logo.png`);

    // 8. Inject Dynamic JSON-LD Structured Data Schema
    let jsonLdScript = document.getElementById('akesevai-jsonld-schema');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'akesevai-jsonld-schema';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }

    let schemaObject = {};

    if (toolData) {
      // Structured Data for Tool Application
      const faqEntities = (toolData.faqs || []).map((faq) => ({
        '@type': 'Question',
        'name': faq.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.a
        }
      }));

      const howToSteps = (toolData.howTo || []).map((step) => ({
        '@type': 'HowToStep',
        'position': step.step,
        'name': step.title,
        'text': step.text
      }));

      schemaObject = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            '@id': `${BASE_URL}${toolData.path}#app`,
            'name': toolData.title.split('|')[0].trim(),
            'url': `${BASE_URL}${toolData.path}`,
            'applicationCategory': 'UtilitiesApplication',
            'operatingSystem': 'All (Web, Android, iOS, Windows, macOS)',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'INR'
            },
            'description': toolData.description,
            'browserRequirements': 'Requires HTML5 Canvas support'
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${BASE_URL}${toolData.path}#breadcrumb`,
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': BASE_URL
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Photo & Document Tools',
                'item': `${BASE_URL}/photo-tools`
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': toolData.title.split('|')[0].trim(),
                'item': `${BASE_URL}${toolData.path}`
              }
            ]
          },
          ...(faqEntities.length > 0
            ? [
                {
                  '@type': 'FAQPage',
                  '@id': `${BASE_URL}${toolData.path}#faq`,
                  'mainEntity': faqEntities
                }
              ]
            : []),
          ...(howToSteps.length > 0
            ? [
                {
                  '@type': 'HowTo',
                  '@id': `${BASE_URL}${toolData.path}#howto`,
                  'name': `How to use ${toolData.title.split('|')[0].trim()}`,
                  'description': toolData.description,
                  'step': howToSteps
                }
              ]
            : [])
        ]
      };
    } else {
      // General AK e-Sevai LocalBusiness / GovernmentOffice Schema
      schemaObject = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'LocalBusiness',
            '@id': `${BASE_URL}/#organization`,
            'name': 'AK e-Sevai Palani',
            'alternateName': 'AkEsevai Digital Service Centre',
            'url': BASE_URL,
            'logo': `${BASE_URL}/logo.png`,
            'telephone': '+919342318844',
            'priceRange': '₹',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': 'Opposite Bus Stand, Mill Road',
              'addressLocality': 'Palani',
              'addressRegion': 'Tamil Nadu',
              'postalCode': '624601',
              'addressCountry': 'IN'
            },
            'geo': {
              '@type': 'GeoCoordinates',
              'latitude': '10.4500',
              'longitude': '77.5167'
            },
            'openingHoursSpecification': {
              '@type': 'OpeningHoursSpecification',
              'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              'opens': '10:00',
              'closes': '20:00'
            }
          }
        ]
      };
    }

    jsonLdScript.textContent = JSON.stringify(schemaObject);
  }, [activeTab, currentToolId]);

  return null;
}
