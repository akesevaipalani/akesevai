import React, { useState } from 'react';
import {
  ChevronDown, ChevronUp, Clock, Phone, MapPin
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import SpaLink from '../components/SpaLink';

export const pageMeta = {
  id: 'certificate-services',
  title: 'Tamil Nadu e-Sevai Certificate Application Assistance | AK E-SEVAI'
};

export default function CertificateServicesPage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const certificateList = [
    {
      title: isTa ? 'வருமானச் சான்றிதழ் (Income Certificate)' : 'Income Certificate Guidance',
      tag: isTa ? 'வருவாய்த்துறை' : 'Revenue Dept.',
      desc: isTa
        ? 'கல்வி உதவித்தொகை (Scholarships) மற்றும் நலத்திட்டங்களுக்கு வட்டாட்சியர் வருமானச் சான்றிதழ் விண்ணப்பிக்க தேவையான ஆவணத் தயாரிப்பு மற்றும் ஆன்லைன் விண்ணப்ப உதவி.'
        : 'Application guidance and document preparation support for Income Certificate submissions on the official Tamil Nadu e-District / TNeGA portal.',
      docs: isTa
        ? ['ஆதார் அட்டை (Aadhaar Card)', 'குடும்ப அட்டை (Smart Ration Card)', 'வருமான ஆதாரம் / சுய உறுதிமொழி (தேவைக்கேற்ப)', 'பாஸ்போர்ட் சைஸ் புகைப்படம்']
        : ['Applicant Aadhaar Card', 'Smart Ration Card / Address Proof', 'Income Proof / Self Declaration (as applicable)', 'Passport Size Photo']
    },
    {
      title: isTa ? 'சாதிச் சான்றிதழ் (Community Certificate)' : 'Community Certificate Guidance',
      tag: isTa ? 'வருவாய்த்துறை' : 'Revenue Dept.',
      desc: isTa
        ? 'கல்வி மற்றும் வேலைவாய்ப்புத் தேவைகளுக்காக சாதிச் சான்றிதழ் விண்ணப்பிக்க ஆவணங்களைச் சரியான அளவில் தயார் செய்தல் மற்றும் விண்ணப்ப உதவி.'
        : 'Document scanning guidance and online filing support for Community Certificate applications through official Tamil Nadu e-Sevai channels.',
      docs: isTa
        ? ['விண்ணப்பதாரர் ஆதார் அட்டை', 'பெற்றோர் / உடன் பிறந்தோர் சாதிச் சான்றிதழ் (உள்ளவாறு)', 'பள்ளி மாற்றுச் சான்றிதழ் (TC) / மதிப்பெண் பட்டியல்', 'குடும்ப அட்டை & புகைப்படம்']
        : ['Applicant Aadhaar Card', 'Parent/Sibling Community Certificate (if available)', 'School Transfer Certificate (TC) / Marksheet', 'Smart Ration Card & Photo']
    },
    {
      title: isTa ? 'இருப்பிட / பிறப்பிடச் சான்றிதழ் (Nativity Certificate)' : 'Nativity & Residence Certificate',
      tag: isTa ? 'வருவாய்த்துறை' : 'Revenue Dept.',
      desc: isTa
        ? 'கல்லூரி சேர்க்கை மற்றும் பணி விண்ணப்பங்களுக்காக தமிழ்நாடு இருப்பிட / பிறப்பிடச் சான்றிதழ் விண்ணப்பிக்கத் தேவையான ஆவண வழிகாட்டல்.'
        : 'Guidance for preparing address, schooling, and identity documents needed when applying for Nativity or Residence certificates online.',
      docs: isTa
        ? ['ஆதார் அட்டை & குடும்ப அட்டை', 'நீண்டகால முகவரி/இருப்பிட ஆதாரங்கள் (அதிகாரப்பூர்வ போர்டல் விதிகளின்படி)', 'பள்ளிப் படிப்பு / பிறப்புச் சான்றிதழ்', 'புகைப்படம்']
        : ['Aadhaar Card & Ration Card', 'Residence Proofs as listed on official TNeGA guidelines', 'Birth Certificate / School Study Record', 'Passport Photo']
    },
    {
      title: isTa ? 'முதல் பட்டதாரி சான்றிதழ் (First Graduate Certificate)' : 'First Graduate Certificate Guidance',
      tag: isTa ? 'கல்விச் சலுகை' : 'Education Assistance',
      desc: isTa
        ? 'குடும்பத்தில் முதல் பட்டதாரி சலுகைக்குத் தேவையான ஆவணங்கள் மற்றும் உறுதிமொழிப் படிவங்களைச் சரியாகச் சமர்ப்பிக்க உதவும் வழிகாட்டல்.'
        : 'Step-by-step guidance for organizing family education proofs and self-declarations for First Graduate certificate applications.',
      docs: isTa
        ? ['விண்ணப்பதாரர் மார்க்ஷீட் & TC', 'குடும்ப உறுப்பினர்களின் கல்வி விவரங்கள் / உறுதிமொழி', 'குடும்ப அட்டை & ஆதார்', 'புகைப்படம்']
        : ['Applicant Marksheet & TC', 'Family Members Education Proofs & Self-Declaration', 'Smart Ration Card & Aadhaar', 'Passport Photo']
    },
    {
      title: isTa ? 'சட்டப்பூர்வ வாரிசுச் சான்றிதழ் (Legal Heir Certificate)' : 'Legal Heir Certificate Guidance',
      tag: isTa ? 'வருவாய்த்துறை' : 'Revenue Dept.',
      desc: isTa
        ? 'இறப்புச் சான்றிதழ் மற்றும் குடும்ப வாரிசுகளின் ஆதாரங்களைத் தெளிவான PDF-ஆகத் தயார் செய்து விண்ணப்பிக்க உதவும் சேவை.'
        : 'Guidance on compiling original death certificate, heir identity proofs, and supporting documents cleanly in PDF format before applying.',
      docs: isTa
        ? ['இறப்புச் சான்றிதழ் (Death Certificate)', 'அனைத்து வாரிசுகளின் ஆதார் அட்டைகள்', 'திருமணச் சான்றிதழ் / குடும்ப அட்டை', 'பிறப்பு / வயது ஆதாரங்கள்']
        : ['Official Death Certificate', 'Aadhaar Cards of Listed Legal Heirs', 'Marriage Certificate / Ration Card', 'Age / Relationship Proofs']
    },
    {
      title: isTa ? 'பிற வருவாய் & நலத்திட்ட சான்றிதழ்கள்' : 'Other Revenue & Welfare Certificates',
      tag: isTa ? 'குடிமக்கள் சேவை' : 'Citizen Services',
      desc: isTa
        ? 'ஆதரவற்ற விதவை, சிறு/குறு விவசாயி, கலப்புத் திருமணச் சான்றிதழ் போன்ற அரசு போர்டல் விண்ணப்பங்களுக்கான ஆவண அளவீடு & வழிகாட்டல்.'
        : 'Support with document formatting and application filing for Destitute Widow, Small/Marginal Farmer, and Inter-caste Marriage certificates.',
      docs: isTa
        ? ['ஆதார் & குடும்ப அட்டை', 'சம்பந்தப்பட்ட துறை ஆதாரச் சான்றிதழ்கள்', 'உறுதிமொழிப் படிவம் & புகைப்படம்']
        : ['Aadhaar & Smart Ration Card', 'Relevant Supporting Certificates', 'Required Declarations & Photo']
    }
  ];

  const faqs = [
    {
      q: isTa ? 'இ-சேவை சான்றிதழ்களுக்கு என்னென்ன ஆவணங்கள் தேவைப்படும்?' : 'What documents are commonly needed for e-Sevai certificates?',
      a: isTa
        ? 'பொதுவாக ஆதார் அட்டை, குடும்ப அட்டை, புகைப்படம், மற்றும் சான்றிதழ் வகைக்கேற்ப கூடுதல் ஆதாரங்கள் தேவைப்படும். துல்லியமான தற்போதைய பட்டியலை அதிகாரப்பூர்வ tnesevai.tn.gov.in இணையதளத்திலும் சரிபார்க்கலாம்.'
        : 'Typically Aadhaar card, Smart Ration card, photograph, and certificate-specific supporting documents are required. Always confirm the exact active checklist on the official TNeGA portal (tnesevai.tn.gov.in).'
    },
    {
      q: isTa ? 'விண்ணப்பத்தின் நிலையை (Status) எவ்வாறு சரிபார்ப்பது?' : 'How do I check the status of my application?',
      a: isTa
        ? 'தமிழ்நாடு அரசின் அதிகாரப்பூர்வ tnesevai.tn.gov.in தளத்தில் உங்கள் அரசு விண்ணப்ப எண்ணை (TN-XXX) உள்ளிட்டு நேரடியாக நிலையைச் சரிபார்க்கலாம். AK E-SEVAI மூலம் பதிவு செய்த வாடிக்கையாளர்கள் எங்கள் Status Track பக்கத்திலும் (/status-track) நிலையைப் பார்க்கலாம்.'
        : 'Official government application statuses can be checked directly on tnesevai.tn.gov.in. If your request was registered through AK E-SEVAI, you can also check your service desk tracking status on our /status-track page.'
    },
    {
      q: isTa ? 'அரசு சான்றிதழ் ஒப்புதல் பெற எவ்வளவு காலம் & கட்டணம் ஆகும்?' : 'What are the official processing times and government fees?',
      a: isTa
        ? 'அதிகாரப்பூர்வ அரசு கட்டணம் மற்றும் ஒப்புதல் கால அளவு ஒவ்வொரு சான்றிதழ் வகைக்கும் துறை விதிகளுக்கும் (VAO/RI/Tahsildar ஆய்வு) ஏற்ப மாறுபடும். நாங்கள் ஆவணத் தயாரிப்பு மற்றும் விண்ணப்ப உதவியை மட்டுமே வழங்குகிறோம்; சான்றிதழ் ஒப்புதல் முழுமையாக வருவாய்த்துறை அதிகாரிகளின் முடிவுக்கு உட்பட்டது.'
        : 'Official government fees and processing times vary by certificate type and departmental field verification (VAO/RI/Tahsildar). AK E-SEVAI provides document preparation and filing assistance; approval is solely governed by official government authorities.'
    },
    {
      q: isTa ? 'பழனி அல்லாத பிற ஊர்களில் உள்ளவர்களும் ஆலோசனை பெற முடியுமா?' : 'Is support available across Tamil Nadu outside Palani?',
      a: isTa
        ? 'ஆம்! எங்கள் இலவச பிரவுசர் புகைப்படம்/PDF கருவிகள் மற்றும் வாட்ஸ்அப் ஆவண ஆலோசனை தமிழ்நாடு முழுவதும் கிடைக்கிறது. நேரடி பிரிண்டிங் மற்றும் நேரில் சேவை மையம் பழனி, மில் ரோடு முகவரியில் மட்டுமே செயல்படுகிறது.'
        : 'Yes. Our free browser photo/PDF tools and WhatsApp guidance (+91 93423 18844) are accessible across Tamil Nadu, while our only physical walk-in centre operates on Mill Road, Palani.'
    }
  ];

  return (
    <div className="inner-page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px 60px' }}>
      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SpaLink to="/" navigate={navigate} scrollToTop style={{ color: '#0052cc', textDecoration: 'none', fontWeight: 700 }}>
          {isTa ? 'முகப்பு' : 'Home'}
        </SpaLink>
        <span>/</span>
        <SpaLink to="/esevai-services" navigate={navigate} scrollToTop style={{ color: '#0052cc', textDecoration: 'none', fontWeight: 700 }}>
          {isTa ? 'தமிழ்நாடு இ-சேவை சேவைகள்' : 'TN e-Sevai Services'}
        </SpaLink>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>
          {isTa ? 'அரசு சான்றிதழ் வழிகாட்டி' : 'Certificate Guidance'}
        </span>
      </nav>

      <header style={{ background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 60%, #1e40af 100%)', borderRadius: '24px', padding: '36px 28px', color: 'white', marginBottom: '32px', boxShadow: '0 12px 32px rgba(2,44,122,0.18)' }}>
        <span style={{ background: '#22c55e', color: '#064e3b', fontSize: '11.5px', fontWeight: 900, padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '12px' }}>
          {isTa ? '🏛️ தமிழ்நாடு குடிமக்கள் சான்றிதழ் வழிகாட்டி' : '🏛️ Tamil Nadu e-Sevai Certificate Guidance'}
        </span>
        <h1 style={{ fontSize: '29px', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.3 }}>
          {isTa ? 'வருமானம், சாதி, இருப்பிடம் & அரசு சான்றிதழ்கள் விண்ணப்ப உதவி' : 'Tamil Nadu Revenue & Education Certificate Application Assistance'}
        </h1>
        <p style={{ fontSize: '15px', opacity: 0.95, margin: '0 0 20px', maxWidth: '840px', lineHeight: 1.6 }}>
          {isTa
            ? 'வருமானம், சாதி, இருப்பிடம், முதல் பட்டதாரி மற்றும் வாரிசுச் சான்றிதழ்களுக்குத் தேவையான ஆவணச் சரிபார்ப்பு, புகைப்பட/PDF அளவீடு மற்றும் ஆன்லைன் விண்ணப்ப உதவி. தமிழ்நாடு முழுவதும் ஆன்லைன் கருவிகள் & வாட்ஸ்அப் வழிகாட்டல்; பழனியில் நேரடி மையம்.'
            : 'Independent application guidance and document preparation for Tamil Nadu certificates. Use our free browser photo/PDF tools statewide across Tamil Nadu or visit our physical centre in Palani.'}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <SpaLink to="/tools/document-size-checker" navigate={navigate} scrollToTop style={{ background: '#22c55e', color: '#064e3b', padding: '11px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            📄 {isTa ? 'ஆவண அளவு சரிபார்க்க' : 'Check Document Size'}
          </SpaLink>
          <a href="https://wa.me/919342318844?text=Hello%20AK%20E-SEVAI%2C%20I%20need%20certificate%20application%20guidance." target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,0.16)', color: 'white', border: '1px solid rgba(255,255,255,0.35)', padding: '11px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={15} /> {isTa ? 'வாட்ஸ்அப் ஆலோசனை (+91 93423 18844)' : 'WhatsApp Guidance (+91 93423 18844)'}
          </a>
          <SpaLink to="/token-generator" navigate={navigate} scrollToTop style={{ background: 'white', color: '#022c7a', padding: '11px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} /> {isTa ? 'பழனி மைய டோக்கன்' : 'Palani Centre Token'}
          </SpaLink>
        </div>
      </header>

      {/* Distinction Notice */}
      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px 18px', marginBottom: '28px', fontSize: '13px', color: '#334155', lineHeight: 1.55 }}>
        <strong>ℹ️ {isTa ? 'முக்கியத் தகவல் (Disclaimer): ' : 'Important Distinction: '}</strong>
        {isTa
          ? 'AK E-SEVAI என்பது ஒரு தனியார் டிஜிட்டல் சேவை & ஆவண உதவி மையம் ஆகும் (அரசுத் துறை அல்ல). அதிகாரப்பூர்வ சான்றிதழ் ஒப்புதல், கட்டணங்கள் மற்றும் கால அளவுகள் தமிழ்நாடு அரசின் tnesevai.tn.gov.in மற்றும் வருவாய்த்துறை விதிகளுக்கு உட்பட்டவை.'
          : 'AK E-SEVAI is an independent digital service and assistance centre, not a government department. Official approvals, statutory fees, and timelines are determined solely by Tamil Nadu Revenue authorities via tnesevai.tn.gov.in.'}
      </div>

      {/* Checklist Cards */}
      <section style={{ marginBottom: '42px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
          {isTa ? 'முக்கிய சான்றிதழ்கள் & பொதுவான ஆவண சரிபார்ப்பு' : 'Certificate Categories & Document Preparation Checklist'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {certificateList.map((item, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#eff6ff', color: '#0052cc', padding: '4px 10px', borderRadius: '12px', display: 'inline-block', marginBottom: '10px' }}>
                  {item.tag}
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>{item.title}</h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.55, margin: '0 0 14px' }}>{item.desc}</p>
                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', marginBottom: '14px' }}>
                  <strong style={{ fontSize: '12px', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    📋 {isTa ? 'பொதுவாக தேவைப்படும் ஆவணங்கள்:' : 'Commonly Required Documents:'}
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#475569', lineHeight: 1.5 }}>
                    {item.docs.map((doc, dIdx) => <li key={dIdx}>{doc}</li>)}
                  </ul>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <SpaLink to="/tools/pdf-merge" navigate={navigate} scrollToTop style={{ flex: 1, textAlign: 'center', background: '#0052cc', color: 'white', padding: '9px 10px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none' }}>
                  {isTa ? 'ஆவண PDF இணை' : 'Merge PDF Docs'}
                </SpaLink>
                <SpaLink to="/tools/photo-compress-100kb" navigate={navigate} scrollToTop style={{ flex: 1, textAlign: 'center', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '9px 10px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none' }}>
                  {isTa ? '100 KB சுருக்கு' : 'Compress 100 KB'}
                </SpaLink>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Related Guides */}
      <section style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 12px', color: '#0f172a' }}>
          🔗 {isTa ? 'தொடர்புடைய பக்கங்கள் & கருவிகள்' : 'Related Guides & Tools'}
        </h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <SpaLink to="/tn-govt-services-guide" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Patta Chitta, Ration Card & EC Guide</SpaLink>
          <SpaLink to="/online-application-assistance" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Exam Application Support</SpaLink>
          <SpaLink to="/tamil-nadu-district-esevai-guides" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Tamil Nadu 16-City Online Guide</SpaLink>
          <SpaLink to="/status-track" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>AK E-SEVAI Status Tracker</SpaLink>
        </div>
      </section>

      {/* FAQs */}
      <section style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '21px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)' : 'Frequently Asked Questions'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white', overflow: 'hidden' }}>
              <button type="button" onClick={() => toggleFaq(idx)} style={{ width: '100%', padding: '15px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} color="#0052cc" /> : <ChevronDown size={18} color="#64748b" />}
              </button>
              {openFaq === idx && <div style={{ padding: '0 18px 15px', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Honest Palani Physical Location */}
      <section style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0052cc', textTransform: 'uppercase' }}>
            📍 {isTa ? 'நேரடி சேவை மையம் (பழனி மட்டும்)' : 'Walk-In Service Centre (Palani Only)'}
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '4px 0 6px' }}>AK E-SEVAI Palani</h3>
          <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 4px' }}>Mill Road, Sanmugapuram, Anna Nagar, Palani, Tamil Nadu 624601</p>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Mon – Sat: 10:00 AM – 8:00 PM | +91 93423 18844 | akesevaipalani@gmail.com</p>
        </div>
        <a href={siteConfig.mapUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#0052cc', color: 'white', padding: '10px 18px', borderRadius: '10px', fontSize: '13.5px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={16} /> Google Maps
        </a>
      </section>
    </div>
  );
}
