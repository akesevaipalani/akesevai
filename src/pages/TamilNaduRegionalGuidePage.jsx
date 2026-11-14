import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Globe, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { TAMIL_NADU_16_CITIES } from '../data/regionalCitiesData';
import { siteConfig } from '../config/siteConfig';
import SpaLink from '../components/SpaLink';

export const pageMeta = {
  id: 'tamil-nadu-district-esevai-guides',
  title: 'Tamil Nadu 16-City Online e-Sevai Portals & Free Document Tools | AK E-SEVAI'
};

export default function TamilNaduRegionalGuidePage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: isTa ? 'பழனி தவிர மற்ற 15 நகரங்களிலும் AK E-SEVAI-க்கு நேரடி கிளைகள் உள்ளனவா?' : 'Does AK E-SEVAI operate physical walk-in branches in all 16 cities?',
      a: isTa
        ? 'இல்லை. AK E-SEVAI-ன் ஒரே நேரடி சேவை மையம் திண்டுக்கல் மாவட்டம் பழனி (மில் ரோடு, சண்முகபுரம், அண்ணா நகர், 624601) முகவரியில் மட்டுமே செயல்படுகிறது. சென்னை, மதுரை, கோவை, திருச்சி, சேலம் உள்ளிட்ட தமிழ்நாட்டின் பிற அனைத்து நகரங்களுக்கும் எங்கள் 31 இலவச பிரவுசர் கருவிகள் மற்றும் வாட்ஸ்அப் ஆன்லைன் வழிகாட்டல் மட்டுமே கிடைக்கும்.'
        : 'No. AK E-SEVAI operates its sole physical walk-in centre in Palani (Mill Road, Anna Nagar, Dindigul District 624601). All other cities in Tamil Nadu receive free client-side photo/PDF tools and remote WhatsApp document guidance.'
    },
    {
      q: isTa ? 'மாவட்ட வாரியான அதிகாரப்பூர்வ e-District மற்றும் அரசு இணைப்புகள் உண்மையானவையா?' : 'Are the district portal links verified official government URLs?',
      a: isTa
        ? 'ஆம். கீழே உள்ள அனைத்து மாவட்ட இணைப்புகளும் தமிழ்நாடு அரசின் அதிகாரப்பூர்வ .nic.in மற்றும் .gov.in இணையதளங்களாகும். விண்ணப்பச் சமர்ப்பிப்பிற்கு முன் எப்போதும் அதிகாரப்பூர்வ போர்ட்டலில் சரிபார்க்கவும்.'
        : 'Yes. Every district card links directly to verified official National Informatics Centre (.nic.in) or Tamil Nadu government (.gov.in) domains.'
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
          {isTa ? 'இ-சேவை சேவைகள்' : 'e-Sevai Services'}
        </SpaLink>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>
          {isTa ? 'தமிழ்நாடு 16 நகர வழிகாட்டி' : 'Tamil Nadu 16-City Regional Guide'}
        </span>
      </nav>

      <header style={{ background: 'linear-gradient(135deg, #022c7a 0%, #0369a1 60%, #0052cc 100%)', borderRadius: '24px', padding: '36px 28px', color: 'white', marginBottom: '28px', boxShadow: '0 14px 34px rgba(2,44,122,0.18)' }}>
        <span style={{ background: '#22c55e', color: '#064e3b', fontSize: '11.5px', fontWeight: 900, padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '12px' }}>
          <Globe size={13} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
          {isTa ? 'தமிழ்நாடு முழுவதும் 16 நகர ஆன்லைன் வழிகாட்டி' : 'Tamil Nadu 16-City Online District Guide'}
        </span>
        <h1 style={{ fontSize: '30px', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.3 }}>
          {isTa
            ? 'தமிழ்நாடு மாவட்ட & நகர வாரியான ஆன்லைன் இ-சேவை இணைப்புகள் & இலவச ஆவணக் கருவிகள்'
            : 'Tamil Nadu Statewide 16-City Official Portals, Photo Tools & Online Guidance'}
        </h1>
        <p style={{ fontSize: '15.5px', opacity: 0.96, margin: '0 0 20px', maxWidth: '880px', lineHeight: 1.65 }}>
          {isTa
            ? 'சென்னை முதல் கன்னியாகுமரி வரை 16 முக்கிய தமிழ்நாடு நகரங்களுக்கான அதிகாரப்பூர்வ .nic.in மாவட்ட போர்ட்டல்கள், TNeGA ஆவணத் தயாரிப்புக் கருவிகள் மற்றும் தேர்வுப் பட ரீசைசர்களை ஒரே இடத்தில் அணுகுங்கள்.'
            : 'Direct verified official .nic.in district directories alongside browser-based photo compression, passport sheets, and PDF tools accessible across 16 major cities in Tamil Nadu.'}
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <SpaLink to="/chennai-online-esevai-assistance" navigate={navigate} scrollToTop style={{ background: 'white', color: '#022c7a', padding: '9px 15px', borderRadius: '8px', fontWeight: 800, fontSize: '13px', textDecoration: 'none' }}>Chennai Guide</SpaLink>
          <SpaLink to="/coimbatore-online-esevai-assistance" navigate={navigate} scrollToTop style={{ background: 'white', color: '#022c7a', padding: '9px 15px', borderRadius: '8px', fontWeight: 800, fontSize: '13px', textDecoration: 'none' }}>Coimbatore Guide</SpaLink>
          <SpaLink to="/madurai-online-esevai-assistance" navigate={navigate} scrollToTop style={{ background: 'white', color: '#022c7a', padding: '9px 15px', borderRadius: '8px', fontWeight: 800, fontSize: '13px', textDecoration: 'none' }}>Madurai Guide</SpaLink>
          <SpaLink to="/trichy-online-esevai-assistance" navigate={navigate} scrollToTop style={{ background: 'white', color: '#022c7a', padding: '9px 15px', borderRadius: '8px', fontWeight: 800, fontSize: '13px', textDecoration: 'none' }}>Trichy Guide</SpaLink>
          <SpaLink to="/salem-online-esevai-assistance" navigate={navigate} scrollToTop style={{ background: 'white', color: '#022c7a', padding: '9px 15px', borderRadius: '8px', fontWeight: 800, fontSize: '13px', textDecoration: 'none' }}>Salem Guide</SpaLink>
        </div>
      </header>

      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '15px 18px', marginBottom: '28px', fontSize: '13.5px', color: '#334155', lineHeight: 1.55, display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <ShieldCheck size={20} color="#0052cc" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>{isTa ? 'நேரடி மையம் & ஆன்லைன் சேவை விபரம்: ' : 'Palani Walk-In vs. Statewide Online Disclosure: '}</strong>
          {isTa
            ? 'AK E-SEVAI-ன் நேரடி சேவை மையம் பழனியில் (Mill Rd, 624601) மட்டுமே செயல்படுகிறது. பிற நகரப் பயனர்களுக்கு எங்கள் பிரவுசர் கருவிகள் & வாட்ஸ்அப் வழிகாட்டல் மட்டுமே கிடைக்கும்; நாங்கள் எந்தவொரு போலி கிளைகளையும் உரிமை கோருவதில்லை.'
            : 'AK E-SEVAI maintains one physical centre in Palani (Mill Rd, 624601) and serves all other Tamil Nadu districts exclusively online through zero-upload client tools and remote WhatsApp support.'}
        </div>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
          {isTa ? 'தமிழ்நாட்டின் 16 நகர & மாவட்ட வழிகாட்டி அட்டவணை' : '16 Tamil Nadu Cities — Official Portals & Document Tool Focus'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
          {TAMIL_NADU_16_CITIES.map((city) => (
            <div key={city.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {isTa ? city.nameTa : city.nameEn}
                  </h3>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: city.id === 'palani' ? '#dcfce7' : '#eff6ff', color: city.id === 'palani' ? '#166534' : '#0052cc', padding: '3px 9px', borderRadius: '12px', whiteSpace: 'nowrap' }}>
                    {city.id === 'palani' ? (isTa ? 'நேரடி மையம்' : 'Walk-In HQ') : (isTa ? 'ஆன்லைன்' : 'Online')}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.55, margin: '0 0 14px' }}>
                  {isTa ? city.keyFocusTa : city.keyFocusEn}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <a href={city.portalUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0052cc', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  🏛️ {city.portalDomain} <ExternalLink size={12} />
                </a>
                {city.extraPortalUrl && (
                  <a href={city.extraPortalUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0369a1', fontSize: '12px', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    🔗 {city.extraPortalLabel} <ExternalLink size={12} />
                  </a>
                )}
                {city.dedicatedSlug ? (
                  <SpaLink to={city.dedicatedSlug} navigate={navigate} scrollToTop style={{ background: '#0052cc', color: 'white', padding: '8px 12px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', marginTop: '4px' }}>
                    {city.id === 'palani' ? (isTa ? 'பழனி முகவரி & தொடர்பு' : 'Palani Contact & Map') : (isTa ? 'விரிவான நகர வழிகாட்டி' : 'Open City Guide')}
                  </SpaLink>
                ) : (
                  <SpaLink to="/photo-tools" navigate={navigate} scrollToTop style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none', textAlign: 'center', marginTop: '4px' }}>
                    {isTa ? 'இலவச கருவிகளைப் பயன்படுத்து' : 'Open Document Tools'}
                  </SpaLink>
                )}
              </div>
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

      <section style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0052cc', textTransform: 'uppercase' }}>
            📍 {isTa ? 'ஒரே நேரடி சேவை மையம் (பழனி, திண்டுக்கல்)' : 'Sole Physical Centre (Palani, Dindigul District)'}
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '4px 0 6px' }}>AK E-SEVAI Palani</h3>
          <p style={{ fontSize: '13.5px', color: '#475569', margin: 0 }}>Mill Road, Sanmugapuram, Anna Nagar, Palani, Tamil Nadu 624601 | +91 93423 18844</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a href="https://wa.me/919342318844?text=Hello%20AK%20E-SEVAI%2C%20I%20need%20online%20guidance." target="_blank" rel="noopener noreferrer" style={{ background: '#16a34a', color: 'white', padding: '10px 16px', borderRadius: '10px', fontSize: '13.5px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={15} /> WhatsApp
          </a>
          <a href={siteConfig.mapUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#0052cc', color: 'white', padding: '10px 18px', borderRadius: '10px', fontSize: '13.5px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={16} /> Google Maps
          </a>
        </div>
      </section>
    </div>
  );
}
