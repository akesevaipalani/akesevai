import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Camera, AlertTriangle, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import SpaLink from '../components/SpaLink';

export const pageMeta = {
  id: 'passport-photo-services',
  title: 'Passport Size Photo Maker Online & Photo Sheet Layout Guide | AK E-SEVAI'
};

export default function PassportPhotoServicesPage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const photoTemplates = [
    {
      title: isTa ? 'இந்திய பாஸ்போர்ட் / பொது அளவு (3.5 × 4.5 cm / 35 × 45 mm)' : 'Indian Standard / Application Photo (3.5 × 4.5 cm)',
      desc: isTa
        ? 'கல்லூரி சேர்க்கை, இ-சேவை விண்ணப்பங்கள் மற்றும் பல தேர்வுப் படிவங்களுக்குப் பரவலாகப் பயன்படுத்தப்படும் அளவு. 4×6 ஷீட்டில் 8 நகல்கள் வரை அடுக்கலாம்.'
        : 'Commonly used for Tamil Nadu academic portals, e-Sevai applications, and general photo prints — exports clean single copies or printable A4/4×6 sheets.',
      to: '/tools/passport-size-photo',
      cta: isTa ? 'பாஸ்போர்ட் போட்டோ கருவி' : 'Open Passport Photo Tool'
    },
    {
      title: isTa ? 'பின்புல நிற மாற்றம் (Background Corner Cleanup)' : 'Solid Background Replacement (White / Light Blue)',
      desc: isTa
        ? 'ஒரே நிற சுவருக்கு முன் எடுத்த புகைப்படத்தின் பின்புலத்தை சுத்தமான வெள்ளை அல்லது வெளிர் நீல நிறத்திற்கு பிரவுசரில் மாற்றும் கருவி.'
        : 'Edge-connected corner color replacement suited for portraits captured in front of clean plain walls.',
      to: '/tools/photo-background-change',
      cta: isTa ? 'பின்புலம் மாற்ற' : 'Change Background'
    },
    {
      title: isTa ? '4×6 & A4 பிரிண்ட் ஷீட் மேக்கர்' : 'Multi-Photo Printable Sheet Layout (4×6 & A4)',
      desc: isTa
        ? 'வீட்டிலிருந்தே 4×6 போட்டோ பேப்பர் அல்லது A4 ஷீட்டில் பல பாஸ்போர்ட் போட்டோக்களை ஒரே படமாக அமைத்துப் பிரிண்ட் எடுக்கலாம்.'
        : 'Arrange crisp printable 4×6 or A4 photo sheets cleanly inside our Passport Size Photo Maker so you can print anywhere across Tamil Nadu or walk into our Palani counter.',
      to: '/tools/passport-size-photo',
      cta: isTa ? 'போட்டோ ஷீட் உருவாக்கு' : 'Create Photo Sheet'
    },
    {
      title: isTa ? 'அரசுத் தேர்வு போட்டோ & கையொப்ப ரீசைசர்' : 'Govt Exam Photo & Signature Dimension Resizer',
      desc: isTa
        ? 'TNPSC, SSC, UPSC, RRB மற்றும் வங்கித் தேர்வு விண்ணப்பங்களுக்கு ஏற்ற பரிந்துரைக்கப்பட்ட பிக்சல் மற்றும் KB வரம்புகளில் புகைப்படத்தை மாற்றவும்.'
        : 'Format portraits to configurable exam presets (TNPSC, SSC, UPSC, RRB, Banking) with strict KB target validation before uploading.',
      to: '/tools/govt-exam-photo-tool',
      cta: isTa ? 'தேர்வு போட்டோ கருவி' : 'Open Exam Photo Tool'
    }
  ];

  const faqs = [
    {
      q: isTa ? 'இந்த பாஸ்போர்ட் போட்டோ கருவி Passport Seva / விசா விதிகளுக்குப் போதுமானதா?' : 'Does this online photo tool guarantee Passport Seva or foreign Visa approval?',
      a: isTa
        ? 'இல்லை — இந்தக் கருவி பட அளவு மற்றும் ஷீட் அமைப்பை மட்டுமே உருவாக்குகிறது. பாஸ்போர்ட் சேவா மற்றும் தூதரக விசாக்களுக்கு முக விகிதம், வெளிச்சம், கண்ணாடி அணியாமை, வெள்ளை/மாட் பின்புலம் போன்ற கடுமையான ICAO விதிகள் உள்ளன; விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ வழிகாட்டியைச் சரிபார்க்கவும்.'
        : 'No tool alone guarantees approval. Official Passport Seva and foreign embassies enforce strict ICAO lighting, head-height coverage, neutral expression, and matte paper/no-shadow rules. Always verify official Passport Seva or embassy rules before final submission.'
    },
    {
      q: isTa ? 'பழனியில் உடனடி பாஸ்போர்ட் போட்டோ பிரிண்ட் எடுக்க முடியுமா?' : 'Can I get physical instant passport photo prints?',
      a: isTa
        ? 'பழனி, மில் ரோடு (624601) நேரடி மையத்தில் உடனடி போட்டோ பிரிண்ட் பெறலாம். தமிழ்நாட்டின் பிற நகரப் பயனர்கள் ஆன்லைனில் 4×6 / A4 ஷீட் உருவாக்கி உங்கள் அருகிலுள்ள ஸ்டுடியோ அல்லது பிரிண்டரில் அச்சிடலாம்.'
        : 'Walk-in glossy prints are available exclusively at our Palani centre (Mill Rd, 624601). Users across other Tamil Nadu cities can download 4×6 or A4 ready layouts online for local printing anywhere.'
    }
  ];

  return (
    <div className="inner-page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px 60px' }}>
      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SpaLink to="/" navigate={navigate} scrollToTop style={{ color: '#0052cc', textDecoration: 'none', fontWeight: 700 }}>
          {isTa ? 'முகப்பு' : 'Home'}
        </SpaLink>
        <span>/</span>
        <SpaLink to="/photo-tools" navigate={navigate} scrollToTop style={{ color: '#0052cc', textDecoration: 'none', fontWeight: 700 }}>
          {isTa ? 'புகைப்படக் கருவிகள்' : 'Photo Tools'}
        </SpaLink>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>
          {isTa ? 'பாஸ்போர்ட் போட்டோ வழிகாட்டி' : 'Passport Photo Services'}
        </span>
      </nav>

      <header style={{ background: 'linear-gradient(135deg, #4338ca 0%, #2563eb 65%, #0052cc 100%)', borderRadius: '24px', padding: '36px 28px', color: 'white', marginBottom: '28px', boxShadow: '0 14px 34px rgba(37,99,235,0.2)' }}>
        <span style={{ background: '#22c55e', color: '#064e3b', fontSize: '11.5px', fontWeight: 900, padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '12px' }}>
          📸 {isTa ? 'ஆன்லைன் பாஸ்போர்ட் போட்டோ & 4×6 ஷீட்' : 'Online Passport Size Photo & 4×6 Print Sheet Tools'}
        </span>
        <h1 style={{ fontSize: '30px', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.3 }}>
          {isTa
            ? 'இலவச பாஸ்போர்ட் சைஸ் போட்டோ மேக்கர், 4×6 ஷீட் & பின்புல மாற்றக் கருவிகள்'
            : 'Free Passport Size Photo Maker, Printable 4×6 / A4 Sheets & Online Guides'}
        </h1>
        <p style={{ fontSize: '15.5px', opacity: 0.95, margin: '0 0 20px', maxWidth: '860px', lineHeight: 1.65 }}>
          {isTa
            ? 'இந்திய விண்ணப்ப அளவு (3.5×4.5 cm), 4×6 பிரிண்ட் ஷீட், பின்புல நிற மாற்றம் மற்றும் பெயர்-தேதி சேர்க்கை ஆகியவற்றை உங்கள் பிரவுசரிலேயே பாதுகாப்பாகத் தயார் செய்யுங்கள்.'
            : 'Crop to standard 3.5×4.5 cm application size, arrange 4×6 or A4 print sheets, add white background fills on clean portraits, or format photos for college/government portals across Tamil Nadu.'}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <SpaLink to="/tools/passport-size-photo" navigate={navigate} scrollToTop style={{ background: 'white', color: '#1e3a8a', padding: '12px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Camera size={16} /> {isTa ? 'பாஸ்போர்ட் போட்டோ உருவாக்கு' : 'Create Passport Photo'}
          </SpaLink>
          <a href="https://wa.me/919342318844?text=Hello%20AK%20E-SEVAI%2C%20I%20need%20help%20formatting%20a%20passport%20photo." target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,0.16)', color: 'white', border: '1px solid rgba(255,255,255,0.35)', padding: '12px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={15} /> WhatsApp Print / Support
          </a>
        </div>
      </header>

      {/* Passport / Visa Official Disclaimer */}
      <div style={{ background: '#fff7ed', border: '1px solid #fdba74', borderRadius: '12px', padding: '16px 18px', marginBottom: '28px', fontSize: '13.5px', color: '#9a3412', lineHeight: 1.55, display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>{isTa ? 'பாஸ்போர்ட் & விசா விதிமுறை எச்சரிக்கை (Passport & Visa Rules Disclaimer): ' : 'Official Passport & Embassy Rules Disclaimer: '}</strong>
          {isTa
            ? 'இந்தப் பக்கத்தில் உள்ள பிரவுசர் கருவிகள் அளவு மற்றும் பிரிண்ட் ஷீட் தயாரிக்க உதவுகின்றன; ஆனால் Passport Seva மற்றும் வெளிநாட்டுத் தூதரகங்கள் (US/UK/Schengen/UAE) சமீபத்திய புகைப்படத் தேதி, நிழலற்ற வெளிச்சம், முக விகிதம் மற்றும் கடுமையான விதிகளைப் பின்பற்ற வேண்டும். விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ பாஸ்போர்ட்/விசா வழிகாட்டலைக் கட்டாயம் சரிபார்க்கவும்.'
            : 'While our online crop and sheet tools prepare accurate digital layouts, official Indian Passport Seva offices and foreign embassies (US, UK, Schengen, UAE, Singapore) enforce strict photo recency, zero-shadow lighting, neutral expression, eyewear, and exact head-size rules. Always check current official Passport Seva / embassy specifications before submitting.'}
        </div>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
          {isTa ? 'பாஸ்போர்ட் போட்டோ & பிரிண்ட் கருவிகள்' : 'Included Passport & Portrait Formatting Tools'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {photoTemplates.map((item, idx) => (
            <div key={idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>{item.title}</h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.55, margin: '0 0 18px' }}>{item.desc}</p>
              </div>
              <SpaLink to={item.to} navigate={navigate} scrollToTop style={{ textAlign: 'center', background: '#2563eb', color: 'white', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                {item.cta}
              </SpaLink>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '21px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Frequently Asked Questions'}
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

      <section style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0052cc', textTransform: 'uppercase' }}>
            📍 {isTa ? 'நேரடி பிரிண்டிங் மையம் (பழனி மட்டும்)' : 'Walk-In Photo Studio & Printing (Palani Only)'}
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '4px 0 6px' }}>AK E-SEVAI Palani</h3>
          <p style={{ fontSize: '13.5px', color: '#475569', margin: 0 }}>Mill Road, Sanmugapuram, Anna Nagar, Palani, Tamil Nadu 624601 | +91 93423 18844</p>
        </div>
        <a href={siteConfig.mapUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#0052cc', color: 'white', padding: '10px 18px', borderRadius: '10px', fontSize: '13.5px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={16} /> Google Maps
        </a>
      </section>
    </div>
  );
}
