import React, { useState } from 'react';
import {
  ChevronDown, ChevronUp, Clock, Phone, ExternalLink, MapPin
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import SpaLink from '../components/SpaLink';

export const pageMeta = {
  id: 'tn-govt-services-guide',
  title: 'Tamil Nadu Government Citizen Services Guide | Patta Chitta, Ration Card, EC | AK E-SEVAI'
};

export default function TnGovtServicesGuidePage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const servicesGuide = [
    {
      title: isTa ? 'பட்டா / சிட்டா & நில ஆவணங்கள் (Patta Chitta & FMB)' : 'Patta Chitta & Land Records Online Guide',
      dept: isTa ? 'வருவாய்த்துறை & நில அளவை' : 'Revenue & Survey Department',
      desc: isTa
        ? 'நில உரிமைக்கான பட்டா, சிட்டா, TSLR மற்றும் புல வரைபடம் (FMB) ஆன்லைனில் சரிபார்த்தல் மற்றும் பட்டா பெயர் மாற்ற விண்ணப்ப வழிகாட்டல்.'
        : 'Practical guide for checking Patta, Chitta, TSLR, and FMB sketches online via the official Tamil Nadu Revenue portal and preparing documents for transfer.',
      steps: isTa
        ? ['மாவட்டம், வட்டம், கிராமம் மற்றும் சர்வே எண் / உட்பிரிவு எண் தேர்வு செய்தல்', 'அதிகாரப்பூர்வ போர்ட்டலில் பட்டா/சிட்டா நகல் சரிபார்த்தல்', 'பட்டா பெயர் மாற்றத்திற்கான கிரயப் பத்திரம் & EC PDF தயாரித்தல்']
        : ['Select District, Taluk, Village, and Survey/Subdivision number', 'Verify official Patta/Chitta view via eservices.tn.gov.in', 'Prepare Sale Deed & EC scans cleanly as PDF before submitting transfer request'],
      portal: 'eservices.tn.gov.in',
      officialUrl: 'https://eservices.tn.gov.in/eservicesnew/home.html'
    },
    {
      title: isTa ? 'ஸ்மார்ட் குடும்ப அட்டை சேவைகள் (TN PDS Smart Ration Card)' : 'Smart Ration Card Services (TN PDS)',
      dept: isTa ? 'உணவுப்பொருள் வழங்கல் துறை' : 'Civil Supplies Department',
      desc: isTa
        ? 'புதிய மின்னணு குடும்ப அட்டை விண்ணப்பம், உறுப்பினர் சேர்த்தல்/நீக்கல், முகவரி மாற்றம் மற்றும் மொபைல் எண் இணைப்பு வழிகாட்டல்.'
        : 'Guide for Smart Family Card requests including member addition/removal, address correction, and mobile linkage on the official TNPDS portal.',
      steps: isTa
        ? ['பதிவு செய்யப்பட்ட செல்போன் OTP சரிபார்ப்பு', 'பிறப்பு / திருமணச் சான்றிதழ் / முகவரி ஆதாரத்தை சுருக்கிய JPG/PDF-ஆக இணைத்தல்', 'துறை அலுவலரின் ஒப்புதல் நிலையை tnpds.gov.in தளத்தில் கண்காணித்தல்']
        : ['Verify via registered mobile OTP on official TNPDS portal', 'Upload resized JPG/PDF supporting proof (Birth/Marriage/Address)', 'Track official status directly on tnpds.gov.in'],
      portal: 'tnpds.gov.in',
      officialUrl: 'https://www.tnpds.gov.in/'
    },
    {
      title: isTa ? 'வில்லங்கச் சான்றிதழ் (Encumbrance Certificate - EC)' : 'Encumbrance Certificate (EC Online)',
      dept: isTa ? 'பதிவுத்துறை (TNREGINET)' : 'Registration Department (TNREGINET)',
      desc: isTa
        ? 'சொத்தின் பரிவர்த்தனை வரலாற்றைச் சரிபார்க்க உதவும் வில்லங்கச் சான்று (EC) ஆன்லைனில் பார்ப்பதற்கான வழிகாட்டல்.'
        : 'Guidance for searching and downloading online Encumbrance Certificate records through the official Tamil Nadu Registration Department portal.',
      steps: isTa
        ? ['மண்டலம், மாவட்டம் மற்றும் சார்-பதிவாளர் அலுவலகம் (SRO) தேர்வு', 'கிராமம், சர்வே எண் மற்றும் கால வரம்பு (Period) உள்ளீடு', 'அதிகாரப்பூர்வ போர்ட்டலிலிருந்து EC நகல் சரிபார்த்தல்']
        : ['Select Zone, District, and Sub-Registrar Office (SRO)', 'Enter Village, Survey Number, and desired date period', 'Download / verify digital EC record directly from tnreginet.gov.in'],
      portal: 'tnreginet.gov.in',
      officialUrl: 'https://tnreginet.gov.in/'
    },
    {
      title: isTa ? 'இ-சேவை CAN எண் பதிவு (Citizen Access Number)' : 'e-Sevai CAN Number Guidance',
      dept: isTa ? 'தமிழ்நாடு மின்னாளுமை முகமை (TNeGA)' : 'TNeGA Citizen Access Number',
      desc: isTa
        ? 'தமிழ்நாடு இ-சேவை சான்றிதழ்களுக்கு விண்ணப்பிக்கப் பயன்படும் Citizen Access Number (CAN) பதிவு செய்வதற்கான பொது வழிகாட்டி.'
        : 'Overview of the Citizen Access Number (CAN) profile required on the Tamil Nadu e-Sevai portal for revenue and welfare certificate applications.',
      steps: isTa
        ? ['விண்ணப்பதாரர் ஆதார் விவரங்கள் & குடும்ப அட்டை விவரங்களைச் சரிபார்த்தல்', 'தற்போதைய முகவரி & மொபைல் எண் உறுதிப்படுத்துதல்', 'OTP சரிபார்ப்புக்குப் பிறகு உருவாக்கப்படும் CAN எண்ணை பாதுகாப்பாக வைத்திருத்தல்']
        : ['Prepare Aadhaar, Smart Ration Card, and active mobile number', 'Register demographic profile on tnesevai.tn.gov.in/Citizen/', 'Save your generated CAN number for future certificate filings'],
      portal: 'tnesevai.tn.gov.in',
      officialUrl: 'https://tnesevai.tn.gov.in/Citizen/'
    },
    {
      title: isTa ? 'நலத்திட்டங்கள் & கல்வி உதவித்தொகை வழிகாட்டி' : 'Welfare & Scholarship Application Guidance',
      dept: isTa ? 'மாநில & மத்திய நலத்திட்டங்கள்' : 'Citizen Welfare Portals',
      desc: isTa
        ? 'கல்வி உதவித்தொகை (Scholarships), சமூக நல உதவித்தொகை போன்ற திட்டங்களுக்குத் தேவையான சான்றிதழ்கள் & PDF தயாரிப்பதற்கான வழிகாட்டல்.'
        : 'Document preparation guidance (Income, Community, Bank Passbook scans, PDF compression) for state welfare and scholarship applications.',
      steps: isTa
        ? ['அரசுப் போர்ட்டலில் வெளியிடப்பட்டுள்ள தற்போதைய தகுதி விதிகளைப் படித்தல்', 'சான்றிதழ்கள் மற்றும் வங்கிப் பாஸ்புக் நகல்களை சரியான KB அளவிற்குத் தயாரித்தல்', 'வங்கி கணக்கு ஆதார் இணைப்பை (DBT) சரிபார்த்தல்']
        : ['Verify official eligibility rules directly on the respective government scheme notice', 'Resize and merge required certificates cleanly in browser', 'Ensure bank account is active and seeded if required by portal rules'],
      portal: 'tnesevai.tn.gov.in',
      officialUrl: 'https://www.tnesevai.tn.gov.in/'
    },
    {
      title: isTa ? 'மின் இணைப்பு சேவைகள் (TNEB / TANGEDCO Online Guide)' : 'TANGEDCO / TNEB Online Services Guide',
      dept: isTa ? 'தமிழ்நாடு மின் பகிர்மானக் கழகம்' : 'TANGEDCO',
      desc: isTa
        ? 'புதிய மின் இணைப்பு, பெயர் மாற்றம் மற்றும் ஆன்லைன் மின் கட்டணம் செலுத்துவதற்குத் தேவையான ஆவணத் தயாரிப்பு வழிகாட்டி.'
        : 'Checklist and preparation steps for TANGEDCO service connection requests, name transfer filings, and document uploads.',
      steps: isTa
        ? ['மின் நுகர்வோர் எண் (Consumer Number) மற்றும் மண்டல விவரங்களை உறுதிப்படுத்துதல்', 'உரிமை பத்திரம், சொத்து வரி ரசீது மற்றும் அடையாள அட்டைகளைப் பதிவேற்றத்திற்கு PDF ஆக்குதல்', 'அதிகாரப்பூர்வ போர்ட்டலில் விண்ணப்ப நிலையைச் சரிபார்த்தல்']
        : ['Verify existing consumer service number and circle', 'Prepare ownership proof, tax receipt, and ID docs under required portal KB limit', 'Track request through official TANGEDCO portal'],
      portal: 'tnebnet.org',
      officialUrl: 'https://www.tnebnet.org/'
    }
  ];

  const faqs = [
    {
      q: isTa ? 'CAN எண் என்றால் என்ன? அதைப் பெற என்ன ஆவணங்கள் தேவை?' : 'What is a CAN Number and what documents are needed?',
      a: isTa
        ? 'CAN (Citizen Access Number) என்பது TNeGA இ-சேவை தளத்தில் சான்றிதழ்கள் விண்ணப்பிக்கப் பயன்படும் குடிமக்கள் பதிவு எண் ஆகும். இதைப் பதிவு செய்ய ஆதார் அட்டை, குடும்ப அட்டை மற்றும் செயல்படும் மொபைல் எண் பொதுவாகத் தேவை.'
        : 'A Citizen Access Number (CAN) is a unique profile identifier on the TNeGA e-Sevai portal used across Tamil Nadu revenue certificate submissions. Typically Aadhaar, Ration card details, and an active mobile number are required.'
    },
    {
      q: isTa ? 'அரசு சேவைகளுக்கான கட்டணங்கள் மற்றும் கால அளவுகள் எங்கு பார்க்கலாம்?' : 'Where can I check official government fees and timelines?',
      a: isTa
        ? 'ஒவ்வொரு சான்றிதழ் மற்றும் சேவைக்குமான அதிகாரப்பூர்வ கட்டணம் மற்றும் கால அளவு சம்பந்தப்பட்ட தமிழ்நாடு அரசுத் துறை போர்ட்டல்களில் (tnesevai.tn.gov.in, tnpds.gov.in, tnreginet.gov.in) வெளியிடப்படும் விதிகளுக்கு உட்பட்டது. விண்ணப்பிக்கும் முன் நேரடியாக போர்ட்டலில் சரிபார்க்கவும்.'
        : 'Official fees, processing rules, and statutory timelines are set by the respective Tamil Nadu government departments on tnesevai.tn.gov.in, tnpds.gov.in, and tnreginet.gov.in and may vary by service.'
    },
    {
      q: isTa ? 'எங்கள் ஊரிலிருந்தே இந்த வழிகாட்டி & கருவிகளைப் பயன்படுத்த முடியுமா?' : 'Can I use these tools and guides from Chennai, Coimbatore, Madurai, or anywhere in Tamil Nadu?',
      a: isTa
        ? 'ஆம்! PDF இணைப்பு, சுருக்கம் மற்றும் போட்டோ ரீசைஸ் கருவிகள் இணையதளம் வழியாக தமிழ்நாடு முழுவதும் இலவசமாகக் கிடைக்கின்றன. வாட்ஸ்அப் மூலம் ஆன்லைன் ஆலோசனையும் பெறலாம். நேரடி நேரில் மையம் பழனியில் மட்டுமே உள்ளது.'
        : 'Yes. All PDF and photo preparation tools and online WhatsApp guidance serve residents across Tamil Nadu, while physical walk-in counter services are offered exclusively at our Palani centre.'
    }
  ];

  return (
    <div className="inner-page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px 60px' }}>
      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SpaLink to="/" navigate={navigate} scrollToTop style={{ color: '#0052cc', textDecoration: 'none', fontWeight: 700 }}>{isTa ? 'முகப்பு' : 'Home'}</SpaLink>
        <span>/</span>
        <SpaLink to="/esevai-services" navigate={navigate} scrollToTop style={{ color: '#0052cc', textDecoration: 'none', fontWeight: 700 }}>{isTa ? 'தமிழ்நாடு இ-சேவை' : 'TN e-Sevai'}</SpaLink>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{isTa ? 'குடிமக்கள் சேவைகள் வழிகாட்டி' : 'Citizen Services Guide'}</span>
      </nav>

      <header style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)', borderRadius: '24px', padding: '36px 28px', color: 'white', marginBottom: '32px' }}>
        <span style={{ background: '#fef08a', color: '#854d0e', fontSize: '11.5px', fontWeight: 900, padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '12px' }}>
          {isTa ? '🏛️ தமிழ்நாடு குடிமக்கள் சேவைகள் & போர்டல் வழிகாட்டி' : '🏛️ Tamil Nadu Citizen Portals & Online Guide'}
        </span>
        <h1 style={{ fontSize: '29px', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.3 }}>
          {isTa ? 'பட்டா சிட்டா, ஸ்மார்ட் ரேஷன் கார்டு, EC & இ-சேவை வழிகாட்டி' : 'Patta Chitta, Smart Ration Card, EC & e-Sevai Citizen Guide'}
        </h1>
        <p style={{ fontSize: '15px', opacity: 0.95, margin: '0 0 20px', maxWidth: '840px', lineHeight: 1.6 }}>
          {isTa
            ? 'அதிகாரப்பூர்வ தமிழ்நாடு அரசு இணையதளங்களைப் பயன்படுத்துவதற்கான எளிய படிகள், ஆவணங்களைச் சரியான PDF / JPG அளவிற்கு மாற்றும் இலவச பிரவுசர் கருவிகள் மற்றும் ஆன்லைன் வழிகாட்டல்.'
            : 'Clear step-by-step reference for official Tamil Nadu citizen portals paired with browser-based PDF and photo preparation tools.'}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <SpaLink to="/pdf-tools" navigate={navigate} scrollToTop style={{ background: '#22c55e', color: '#064e3b', padding: '11px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}>
            📄 {isTa ? 'PDF கருவிகள் (Merge / Compress)' : 'PDF Preparation Tools'}
          </SpaLink>
          <SpaLink to="/tamil-nadu-district-esevai-guides" navigate={navigate} scrollToTop style={{ background: 'white', color: '#1e3a8a', padding: '11px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}>
            🗺️ {isTa ? 'தமிழ்நாடு 16 நகரங்கள் வழிகாட்டி' : '16-City Statewide Guide'}
          </SpaLink>
        </div>
      </header>

      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px 18px', marginBottom: '28px', fontSize: '13px', color: '#334155', lineHeight: 1.55 }}>
        <strong>ℹ️ {isTa ? 'அதிகாரப்பூர்வ இணைப்புகள் & உதவி வேறுபாடு: ' : 'Official Portals vs AK E-SEVAI: '}</strong>
        {isTa
          ? 'கீழே கொடுக்கப்பட்டுள்ள வெளிப்புற இணைப்புகள் சம்பந்தப்பட்ட தமிழ்நாடு அரசுத் துறைகளின் அதிகாரப்பூர்வ தளங்களுக்குச் செல்லும். AK E-SEVAI தனியார் ஆவண தயாரிப்பு மற்றும் ஆன்லைன் விண்ணப்ப உதவியை மட்டுமே வழங்குகிறது.'
          : 'External portal buttons link to the respective Tamil Nadu Government department websites. AK E-SEVAI is an independent private assistance and document tool provider.'}
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
          {isTa ? 'முக்கிய குடிமக்கள் சேவைகள் & படிநிலைகள்' : 'Citizen Service Workflows & Official Portals'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '20px' }}>
          {servicesGuide.map((item, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '12px', display: 'inline-block', marginBottom: '10px' }}>{item.dept}</span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>{item.title}</h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.55, margin: '0 0 14px' }}>{item.desc}</p>
                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', marginBottom: '14px', borderLeft: '4px solid #2563eb' }}>
                  <strong style={{ fontSize: '12px', color: '#1e3a8a', display: 'block', marginBottom: '6px' }}>📝 {isTa ? 'வழிகாட்டல் படிகள்:' : 'Preparation Steps:'}</strong>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#334155', lineHeight: 1.5 }}>
                    {item.steps.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                  </ul>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <SpaLink to="/tools/pdf-compress" navigate={navigate} scrollToTop style={{ flex: 1, textAlign: 'center', background: '#2563eb', color: 'white', padding: '9px 10px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none' }}>
                  {isTa ? 'PDF அளவை சுருக்கு' : 'Prepare PDF'}
                </SpaLink>
                <a href={item.officialUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '9px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {item.portal} <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '21px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)' : 'Frequently Asked Questions'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white', overflow: 'hidden' }}>
              <button type="button" onClick={() => toggleFaq(idx)} style={{ width: '100%', padding: '15px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} color="#2563eb" /> : <ChevronDown size={18} color="#64748b" />}
              </button>
              {openFaq === idx && <div style={{ padding: '0 18px 15px', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
            📍 {isTa ? 'நேரடி மையம் (பழனி) & ஆன்லைன் உதவி (தமிழ்நாடு)' : 'Palani Walk-In Centre & Statewide Online Guidance'}
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '4px 0 6px' }}>AK E-SEVAI — Palani</h3>
          <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 4px' }}>Mill Road, Sanmugapuram, Anna Nagar, Palani, Tamil Nadu 624601</p>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>📞 +91 93423 18844 | akesevaipalani@gmail.com</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <SpaLink to="/token-generator" navigate={navigate} scrollToTop style={{ background: '#2563eb', color: 'white', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} /> {isTa ? 'டோக்கன் பதிவு' : 'Book Token'}
          </SpaLink>
          <a href={siteConfig.mapUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={15} /> Google Maps
          </a>
        </div>
      </section>
    </div>
  );
}
