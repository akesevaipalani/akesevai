import { useEffect } from 'react';

const PAGE_SEO_MAP = {
  home: {
    title: 'AkEsevai Palani | Best e-Sevai Centre in Palani | Aadhaar, PAN, Income & Community Certificate',
    description: 'Top #1 Official AkEsevai Digital Service Centre in Palani (பழனி இ-சேவை மையம்). Fast online applications for Aadhaar Card, PAN Card, Income Certificate, Community Certificate, Smart Ration Card, Patta Chitta & Token Booking. Visit opposite Palani Bus Stand or www.akesevai.com. Call 93423 18844.',
    keywords: 'best esevai maiyam in palani, esevai maiyam in palani, palani esevai maiyam, aadhaar card service in palani, pan card apply palani, income certificate apply palani, community certificate apply palani, smart ration card palani, akesevai palani, www.akesevai.com'
  },
  services: {
    title: 'All e-Sevai Services in Palani | Aadhaar, PAN, Certificates, Ration Card, Patta Chitta | AkEsevai',
    description: 'Explore 30+ Government e-Sevai services at AkEsevai Palani. Apply online for Income, Community, Nativity, First Graduate, Legal Heir certificates, Smart Ration Card, Voter ID & Patta Chitta.',
    keywords: 'palani esevai services, income certificate palani, community certificate palani, nativity certificate palani, first graduate certificate palani, patta chitta palani, ration card apply palani'
  },
  status: {
    title: 'Track e-Sevai Application Status Palani | AkEsevai Live Status Tracker (TN-AK-2026)',
    description: 'Check live status of your Tamil Nadu e-Sevai application (TN-AK-2026), certificate approvals, and Government processing stage at AkEsevai Palani.',
    keywords: 'esevai status track palani, akesevai status check, tn esevai application status palani, certificate status palani'
  },
  token: {
    title: 'Online Token Generator Palani | Live Counter Queue Slot Booking | AkEsevai',
    description: 'Book live queue token online for AkEsevai Digital Centre Palani. Skip the line and get instant token slip on your mobile.',
    keywords: 'esevai token generator palani, akesevai live token, palani esevai queue booking, token booking palani'
  },
  contact: {
    title: 'Contact AkEsevai Digital Centre Palani | Bus Stand Opposite & Mill Road | Phone 93423 18844',
    description: 'Location, phone number, WhatsApp contact and Google Maps address of AkEsevai Digital Service Centre opposite Palani Bus Stand. Call 93423 18844.',
    keywords: 'akesevai palani phone number, esevai maiyam near palani bus stand, akesevai contact palani, palani esevai address'
  }
};

export default function SEOHeadManager({ activeTab = 'home' }) {
  useEffect(() => {
    const seoData = PAGE_SEO_MAP[activeTab] || PAGE_SEO_MAP.home;

    // 1. Update Document Title
    document.title = seoData.title;

    // 2. Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = seoData.description;

    // 3. Update Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = seoData.keywords;

    // 4. Update Open Graph Title & Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = seoData.title;

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = seoData.description;
  }, [activeTab]);

  return null;
}
