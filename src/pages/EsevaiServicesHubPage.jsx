import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Phone, Clock, ShieldCheck, Globe } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import SpaLink from '../components/SpaLink';

export const pageMeta = {
  id: 'esevai-services',
  title: 'Tamil Nadu Online e-Sevai Services & Document Preparation Hub | AK E-SEVAI'
};

export default function EsevaiServicesHubPage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const serviceCategories = [
    {
      badge: isTa ? 'வருவாய்த்துறை சான்றிதழ்கள்' : 'Revenue Certificates',
      title: isTa ? 'வருமானம், சாதி, இருப்பிடம் & முதல் பட்டதாரி' : 'Income, Community, Nativity & First Graduate',
      desc: isTa
        ? 'கல்வி, வேலைவாய்ப்பு மற்றும் நலத்திட்டங்களுக்குத் தேவையான TNeGA வருவாய்த்துறை சான்றிதழ் ஆவணங்களைச் சரியான அளவில் தயார் செய்யவும் விண்ணப்பிக்கவும் வழிகாட்டல்.'
        : 'Step-by-step checklists and client-side document formatting help before submitting Revenue certificate requests on tnesevai.tn.gov.in.',
      primaryTo: '/certificate-services',
      primaryLabel: isTa ? 'சான்றிதழ் வழிகாட்டி' : 'Certificate Guide',
      secondaryTo: '/tools/pdf-merge',
      secondaryLabel: isTa ? 'PDF இணைப்பு கருவி' : 'Merge Docs PDF'
    },
    {
      badge: isTa ? 'நிலம் & குடும்ப அட்டை' : 'Land & Citizen Records',
      title: isTa ? 'பட்டா, சிட்டா, வில்லங்கம் (EC) & ஸ்மார்ட் கார்டு' : 'Patta Chitta, EC (TNREGINET) & Smart Ration Card',
      desc: isTa
        ? 'நில அளவீடு மற்றும் குடும்ப அட்டை (TNPDS) திருத்தங்களுக்குத் தேவையான அதிகாரப்பூர்வ போர்டல் இணைப்புகள் மற்றும் ஆவண அளவு தயாரிப்பு.'
        : 'Official portal orientation for Tamil Nadu land records, EC viewing guidance, Smart Ration Card updates, and TNEB billing links.',
      primaryTo: '/tn-govt-services-guide',
      primaryLabel: isTa ? 'அரசு சேவைகள் வழிகாட்டி' : 'TN Govt Services Guide',
      secondaryTo: '/tools/document-size-checker',
      secondaryLabel: isTa ? 'ஆவண அளவு சோதனை' : 'Document Checker'
    },
    {
      badge: isTa ? 'தேர்வு விண்ணப்ப உதவி' : 'Exam Applications',
      title: isTa ? 'TNPSC, SSC, RRB, UPSC ஆன்லைன் விண்ணப்ப உதவி' : 'TNPSC, SSC, RRB & Central Exam File Preparation',
      desc: isTa
        ? 'OTR பதிவு, புகைப்படம் மற்றும் கையொப்ப அளவீடுகள், 100 KB / 200 KB PDF சான்றிதழ் தயாரிப்பு மற்றும் கடைசி நேர பிழைத் தவிர்ப்பு.'
        : 'Guidance for Tamil Nadu and Central competitive examination portal registrations with exact pixel and KB compliance tools.',
      primaryTo: '/online-application-assistance',
      primaryLabel: isTa ? 'விண்ணப்ப உதவி பக்கம்' : 'Application Support',
      secondaryTo: '/government-exam-tools',
      secondaryLabel: isTa ? 'தேர்வு போட்டோ கருவிகள்' : 'Exam Photo Hub'
    },
    {
      badge: isTa ? 'இலவச ஆவணக் கருவிகள்' : 'Browser Utilities',
      title: isTa ? 'PDF இணைப்பு, பிரித்தல், சுருக்குதல் & போட்டோ அளவீடு' : 'PDF Merge, Split, Compress & Photo KB Tools',
      desc: isTa
        ? 'தனிப்பட்ட ஆவணங்களை எந்த சர்வருக்கும் அனுப்பாமல் உங்கள் மொபைல்/கணினி பிரவுசரிலேயே 100% பாதுகாப்பாகத் தயார் செய்யும் 31 கருவிகள்.'
        : '31 client-side browser utilities processing JPEG, PNG, and PDF files strictly in local device memory without uploading copies.',
      primaryTo: '/photo-tools',
      primaryLabel: isTa ? '31 இலவச கருவிகள்' : 'All 31 Tools',
      secondaryTo: '/pdf-tools',
      secondaryLabel: isTa ? 'PDF கருவிகள் தொகுப்பு' : 'PDF Tools Hub'
    }
  ];

  const faqs = [
    {
      q: isTa ? 'AK E-SEVAI என்பது தமிழ்நாடு அரசு இணையதளமா?' : 'Is AK E-SEVAI an official Tamil Nadu government portal?',
      a: isTa
        ? 'இல்லை. AK E-SEVAI என்பது தனியார் டிஜிட்டல் சேவை & ஆவண உதவி மையம் ஆகும். அதிகாரப்பூர்வ விண்ணப்பங்கள் தமிழ்நாடு அரசின் tnesevai.tn.gov.in, eservices.tn.gov.in, tnpds.gov.in போன்ற தளங்களில் மட்டுமே செயல்படுத்தப்படுகின்றன.'
        : 'No. AK E-SEVAI is an independent digital service and document preparation centre. Official statutory submissions and approvals take place exclusively on government portals such as tnesevai.tn.gov.in.'
    },
    {
      q: isTa ? 'சென்னை, மதுரை, கோவை போன்ற பிற மாவட்டங்களில் இருந்து இந்தச் சேவையைப் பெற முடியுமா?' : 'Can residents from Chennai, Madurai, Coimbatore, and other Tamil Nadu districts use AK E-SEVAI?',
      a: isTa
        ? 'ஆம்! எங்கள் இலவச பிரவுசர் புகைப்படம்/PDF கருவிகள் மற்றும் ஆன்லைன் வாட்ஸ்அப் வழிகாட்டல் தமிழ்நாடு முழுவதும் கிடைக்கிறது. நேரடி ஜெராக்ஸ், பிரிண்டிங் மற்றும் நேரில் சேவை மையம் பழனி, மில் ரோடு (624601) முகவரியில் மட்டுமே உள்ளது.'
        : 'Yes. All 31 browser-based photo/PDF tools and WhatsApp guidance (+91 93423 18844) are accessible across every district in Tamil Nadu, while our physical walk-in counter operates solely at Mill Road, Palani 624601.'
    },
    {
      q: isTa ? 'ஆவணங்களை இ-சேவைக்குத் தயார் செய்ய எங்கள் கோப்புகள் எங்கு சேமிக்கப்படுகின்றன?' : 'Where are my scanned documents processed when I use your online tools?',
      a: isTa
        ? 'எங்கள் புகைப்படம் மற்றும் PDF கருவிகள் அனைத்தும் உங்கள் பிரவுசர் (Client-Side Browser) உள்ளேயே இயங்குகின்றன. உங்கள் ஆதார் அல்லது சான்றிதழ் நகல்கள் எந்த சர்வருக்கும் பதிவேற்றப்படுவதில்லை.'
        : 'All online photo resizing, compression, and PDF utilities execute directly in your own web browser using HTML5 Canvas, pdf-lib, and PDF.js — your documents are never uploaded to external servers.'
    }
  ];

  return (
    <div className="inner-page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px 60px' }}>
      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SpaLink to="/" navigate={navigate} scrollToTop style={{ color: '#0052cc', textDecoration: 'none', fontWeight: 700 }}>
          {isTa ? 'முகப்பு' : 'Home'}
        </SpaLink>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>
          {isTa ? 'தமிழ்நாடு இ-சேவை சேவைகள்' : 'Tamil Nadu Online e-Sevai Services'}
        </span>
      </nav>

      <header style={{ background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 65%, #1d4ed8 100%)', borderRadius: '24px', padding: '36px 28px', color: 'white', marginBottom: '30px', boxShadow: '0 14px 34px rgba(2,44,122,0.18)' }}>
        <span style={{ background: '#22c55e', color: '#064e3b', fontSize: '11.5px', fontWeight: 900, padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '12px' }}>
          {isTa ? '🏛️ தமிழ்நாடு முழுவதும் ஆன்லைன் இ-சேவை & ஆவண உதவி' : '🏛️ Statewide Online e-Sevai Guidance & Tools Hub'}
        </span>
        <h1 style={{ fontSize: '30px', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.3 }}>
          {isTa
            ? 'தமிழ்நாடு இ-சேவை வழிகாட்டி & ஆன்லைன் ஆவணத் தயாரிப்பு மையம்'
            : 'Tamil Nadu Online e-Sevai Guidance, Certificate Checklists & Free Document Tools'}
        </h1>
        <p style={{ fontSize: '15.5px', opacity: 0.96, margin: '0 0 22px', maxWidth: '860px', lineHeight: 1.65 }}>
          {isTa
            ? 'வருமானம், சாதி, இருப்பிடம், பட்டா/சிட்டா, குடும்ப அட்டை மற்றும் போட்டித் தேர்வு விண்ணப்பங்களுக்குத் தேவையான ஆவண வழிகாட்டல்களையும், பாதுகாப்பான பிரவுசர் கருவிகளையும் தமிழ்நாடு முழுவதும் உள்ள பயனர்கள் எங்கிருந்தும் இலவசமாகப் பயன்படுத்தலாம்.'
            : 'Prepare error-free Aadhaar, certificate, land record, and exam files cleanly for Tamil Nadu government portals from anywhere in Tamil Nadu. Free browser tools statewide + remote WhatsApp guidance; physical walk-in centre operates strictly in Palani.'}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <SpaLink to="/certificate-services" navigate={navigate} scrollToTop style={{ background: '#22c55e', color: '#064e3b', padding: '12px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '14px', textDecoration: 'none' }}>
            📜 {isTa ? 'சான்றிதழ் வழிகாட்டிகள்' : 'Certificate Checklists'}
          </SpaLink>
          <SpaLink to="/tamil-nadu-district-esevai-guides" navigate={navigate} scrollToTop style={{ background: 'white', color: '#022c7a', padding: '12px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Globe size={16} /> {isTa ? '16 நகர வழிகாட்டி' : '16-City District Guides'}
          </SpaLink>
          <a href="https://wa.me/919342318844?text=Hello%20AK%20E-SEVAI%2C%20I%20need%20online%20e-Sevai%20document%20guidance." target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,0.16)', color: 'white', border: '1px solid rgba(255,255,255,0.35)', padding: '12px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={15} /> WhatsApp +91 93423 18844
          </a>
        </div>
      </header>

      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px 18px', marginBottom: '28px', fontSize: '13px', color: '#334155', lineHeight: 1.55, display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <ShieldCheck size={20} color="#0052cc" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>{isTa ? 'வெளிப்படைத்தன்மை & சேவை எல்லை: ' : 'Independent Guidance & Geographic Scope: '}</strong>
          {isTa
            ? 'AK E-SEVAI அரசு நிறுவனம் அல்ல; நாங்கள் சுயாதீனமான ஆவணத் தயாரிப்பு & டிஜிட்டல் உதவி வழங்குகிறோம். பழனி (மில் ரோடு, 624601) தவிர பிற ஊர்களில் நேரடி கிளைகள் இல்லை — பிற தமிழ்நாடு நகரங்களுக்கு பிரவுசர் கருவிகள் & ஆன்லைன் வாட்ஸ்அப் வழிகாட்டல் மட்டுமே.'
            : 'AK E-SEVAI is an independent digital service provider, not a government body. Our sole physical centre is in Palani (624601); all other Tamil Nadu districts are supported through zero-upload online tools and remote WhatsApp guidance.'}
        </div>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
          {isTa ? 'முக்கிய ஆன்லைன் சேவைப் பிரிவுகள்' : 'Core Online e-Sevai & Document Service Hubs'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {serviceCategories.map((cat, idx) => (
            <div key={idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#eff6ff', color: '#0052cc', padding: '4px 10px', borderRadius: '12px', display: 'inline-block', marginBottom: '10px' }}>
                  {cat.badge}
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>{cat.title}</h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.55, margin: '0 0 18px' }}>{cat.desc}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <SpaLink to={cat.primaryTo} navigate={navigate} scrollToTop style={{ flex: 1, textAlign: 'center', background: '#0052cc', color: 'white', padding: '9px 10px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none' }}>
                  {cat.primaryLabel}
                </SpaLink>
                <SpaLink to={cat.secondaryTo} navigate={navigate} scrollToTop style={{ flex: 1, textAlign: 'center', background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '9px 10px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none' }}>
                  {cat.secondaryLabel}
                </SpaLink>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px' }}>
          🔗 {isTa ? 'பிற சேவை & பிராந்திய பக்கங்கள்' : 'Explore Connected Service & Regional Hubs'}
        </h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <SpaLink to="/online-document-services" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Online Document Services</SpaLink>
          <SpaLink to="/passport-photo-services" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Passport Photo Sheet Guide</SpaLink>
          <SpaLink to="/chennai-online-esevai-assistance" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Chennai Guide</SpaLink>
          <SpaLink to="/coimbatore-online-esevai-assistance" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Coimbatore Guide</SpaLink>
          <SpaLink to="/madurai-online-esevai-assistance" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Madurai Guide</SpaLink>
          <SpaLink to="/trichy-online-esevai-assistance" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Trichy Guide</SpaLink>
          <SpaLink to="/salem-online-esevai-assistance" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Salem Guide</SpaLink>
        </div>
      </section>

      <section style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '21px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)' : 'Frequently Asked Questions'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white', overflow: 'hidden' }}>
              <button type="button" onClick={() => setOpenFaq(openFaq === idx ? null : idx)} style={{ width: '100%', padding: '15px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} color="#0052cc" /> : <ChevronDown size={18} color="#64748b" />}
              </button>
              {openFaq === idx && <div style={{ padding: '0 18px 15px', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0052cc', textTransform: 'uppercase' }}>
            📍 {isTa ? 'நேரடி சேவை மையம் (பழனி மட்டும்)' : 'Walk-In Physical Service Centre (Palani Only)'}
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '4px 0 6px' }}>AK E-SEVAI Palani</h3>
          <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 4px' }}>Mill Road, Sanmugapuram, Anna Nagar, Palani, Tamil Nadu 624601</p>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Mon – Sat: 10:00 AM – 8:00 PM | +91 93423 18844 | akesevaipalani@gmail.com</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <SpaLink to="/token-generator" navigate={navigate} scrollToTop style={{ background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', padding: '10px 16px', borderRadius: '10px', fontSize: '13.5px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} /> {isTa ? 'பழனி டோக்கன்' : 'Palani Token'}
          </SpaLink>
          <a href={siteConfig.mapUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#0052cc', color: 'white', padding: '10px 18px', borderRadius: '10px', fontSize: '13.5px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={16} /> Google Maps
          </a>
        </div>
      </section>
    </div>
  );
}
