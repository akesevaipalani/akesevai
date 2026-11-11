import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, MapPin, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { CITY_DEDICATED_GUIDES } from '../data/regionalCitiesData';
import { getToolBySlugOrId } from '../data/photoToolsData';
import { siteConfig } from '../config/siteConfig';
import SpaLink from '../components/SpaLink';
import NotFoundPage from './NotFoundPage';

export default function CityOnlineGuidePage({ citySlug, navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const guide = CITY_DEDICATED_GUIDES[citySlug];
  if (!guide) {
    return <NotFoundPage navigate={navigate} lang={lang} requestedPath={`/${citySlug || ''}`} />;
  }

  const tools = (guide.recommendedTools || [])
    .map((id) => getToolBySlugOrId(id))
    .filter(Boolean);

  const otherCities = Object.values(CITY_DEDICATED_GUIDES).filter(
    (c) => c.routeId !== guide.routeId
  );

  return (
    <div className="inner-page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px 60px' }}>
      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SpaLink to="/" navigate={navigate} scrollToTop style={{ color: '#0052cc', textDecoration: 'none', fontWeight: 700 }}>
          {isTa ? 'முகப்பு' : 'Home'}
        </SpaLink>
        <span>/</span>
        <SpaLink to="/tamil-nadu-district-esevai-guides" navigate={navigate} scrollToTop style={{ color: '#0052cc', textDecoration: 'none', fontWeight: 700 }}>
          {isTa ? 'தமிழ்நாடு மாவட்ட வழிகாட்டி' : 'Tamil Nadu 16-City Guide'}
        </SpaLink>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>
          {isTa ? guide.cityTa : guide.cityEn}
        </span>
      </nav>

      <header style={{ background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 65%, #1d4ed8 100%)', borderRadius: '24px', padding: '36px 28px', color: 'white', marginBottom: '28px', boxShadow: '0 14px 34px rgba(2,44,122,0.18)' }}>
        <span style={{ background: '#22c55e', color: '#064e3b', fontSize: '11.5px', fontWeight: 900, padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '12px' }}>
          {isTa ? guide.badgeTa : guide.badgeEn}
        </span>
        <h1 style={{ fontSize: '29px', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.3 }}>
          {isTa ? guide.heroTitleTa : guide.heroTitleEn}
        </h1>
        <p style={{ fontSize: '15.5px', opacity: 0.95, margin: '0 0 20px', maxWidth: '880px', lineHeight: 1.65 }}>
          {isTa ? guide.heroSubTa : guide.heroSubEn}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <SpaLink to="/photo-tools" navigate={navigate} scrollToTop style={{ background: 'white', color: '#022c7a', padding: '11px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}>
            🛠️ {isTa ? 'இலவச ஆவணக் கருவிகள்' : 'Open Browser Tools'}
          </SpaLink>
          <a href={`https://wa.me/919342318844?text=Hello%20AK%20E-SEVAI%2C%20I%20am%20visiting%20from%20${encodeURIComponent(guide.cityEn)}%20and%20need%20online%20guidance.`} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,0.16)', color: 'white', border: '1px solid rgba(255,255,255,0.35)', padding: '11px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={15} /> {isTa ? 'ஆன்லைன் வாட்ஸ்அப் உதவி' : 'Remote WhatsApp Guidance'}
          </a>
        </div>
      </header>

      <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px 18px', marginBottom: '28px', fontSize: '13px', color: '#334155', lineHeight: 1.55, display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <ShieldCheck size={20} color="#0052cc" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>{isTa ? 'சேவை வெளிப்படைத்தன்மை (Transparency Notice): ' : 'Location & Online Service Disclosure: '}</strong>
          {isTa
            ? `AK E-SEVAI-க்கு ${guide.cityTa} நகரில் நேரடி கிளை இல்லை — எங்கள் ஒரே நேரடி மையம் பழனி (மில் ரோடு, 624601)-ல் உள்ளது. ${guide.cityTa} பயனர்கள் அனைத்து 31 இலவச பிரவுசர் கருவிகளையும் வாட்ஸ்அப் ஆவண வழிகாட்டலையும் ஆன்லைனில் பெறலாம்.`
            : `AK E-SEVAI has no physical branch in ${guide.cityEn}. Our sole physical centre is located in Palani (624601). ${guide.cityEn} residents are served exclusively via free browser-based photo/PDF tools and remote WhatsApp support.`}
        </div>
      </div>

      {/* Regional Specific Nuances */}
      <section style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '21px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          {isTa ? `${guide.cityTa} பகுதி பயனர்களுக்கான முக்கியத் தேவைகள்` : `Key Online Document Needs in ${guide.cityEn}`}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
          {guide.localNuances.map((item, idx) => (
            <div key={idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
                {isTa ? item.titleTa : item.titleEn}
              </h3>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {isTa ? item.bodyTa : item.bodyEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Browser Tools */}
      <section style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '21px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          {isTa ? `${guide.cityTa} பயனர்களுக்கான பரிந்துரைக்கப்படும் இலவசக் கருவிகள்` : `Recommended Browser Tools for ${guide.cityEn}`}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {tools.map((tool) => (
            <SpaLink
              key={tool.id}
              to={tool.path}
              navigate={navigate}
              scrollToTop
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '18px',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, background: '#eff6ff', color: '#0052cc', padding: '4px 10px', borderRadius: '12px', display: 'inline-block', marginBottom: '10px' }}>
                  {isTa ? (tool.badgeTa || tool.badge) : tool.badge}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                  {isTa ? (tool.titleTa || tool.title) : tool.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 12px', lineHeight: 1.5 }}>
                  {isTa ? (tool.shortDescTa || tool.shortDesc) : tool.shortDesc}
                </p>
              </div>
              <span style={{ color: '#0052cc', fontSize: '13px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {isTa ? 'தொடங்குக' : 'Open Tool'} <ArrowRight size={14} />
              </span>
            </SpaLink>
          ))}
        </div>
      </section>

      {/* Verified Official Portals */}
      <section style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px' }}>
          🏛️ {isTa ? `${guide.cityTa} & தமிழ்நாடு அதிகாரப்பூர்வ அரசு இணைப்புகள்` : `Verified Official ${guide.cityEn} & Tamil Nadu Portals`}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
          {guide.officialPortals.map((portal, idx) => (
            <a key={idx} href={portal.url} target="_blank" rel="noopener noreferrer" style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px 14px', color: '#0052cc', textDecoration: 'none', fontSize: '13px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <span>{portal.label}</span>
              <ExternalLink size={14} style={{ flexShrink: 0 }} />
            </a>
          ))}
        </div>
      </section>

      {/* City FAQs */}
      <section style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '21px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Frequently Asked Questions'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {guide.faqs.map((faq, idx) => (
            <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white', overflow: 'hidden' }}>
              <button type="button" onClick={() => setOpenFaq(openFaq === idx ? null : idx)} style={{ width: '100%', padding: '15px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                <span>{isTa && faq.qTa ? faq.qTa : faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} color="#0052cc" /> : <ChevronDown size={18} color="#64748b" />}
              </button>
              {openFaq === idx && (
                <div style={{ padding: '0 18px 15px', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
                  {isTa && faq.aTa ? faq.aTa : faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Cross-links to other TN city guides */}
      <section style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
          🔗 {isTa ? 'பிற தமிழ்நாடு நகர வழிகாட்டிகள்' : 'Other Tamil Nadu City & District Guides'}
        </h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {otherCities.map((c) => (
            <SpaLink key={c.routeId} to={`/${c.routeId}`} navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
              {isTa ? c.cityTa : c.cityEn}
            </SpaLink>
          ))}
          <SpaLink to="/tamil-nadu-district-esevai-guides" navigate={navigate} scrollToTop style={{ background: '#0052cc', color: 'white', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
            {isTa ? 'அனைத்து 16 நகரங்கள்' : 'All 16 Cities Guide'}
          </SpaLink>
        </div>
      </section>

      <section style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#0052cc', textTransform: 'uppercase' }}>
            📍 {isTa ? 'நேரடி சேவை மையம் (பழனி மட்டும்)' : 'Walk-In Service Centre (Palani Only)'}
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
