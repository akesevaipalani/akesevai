import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, ShieldAlert, MapPin } from 'lucide-react';
import { PHOTO_TOOLS_CATALOG } from '../data/photoToolsData';
import { siteConfig } from '../config/siteConfig';
import SpaLink from '../components/SpaLink';

export const pageMeta = {
  id: 'government-exam-tools',
  title: 'TNPSC, SSC, RRB & UPSC Photo and Signature Resizer Tools | AK E-SEVAI'
};

export default function GovtExamToolsHubPage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const examTools = PHOTO_TOOLS_CATALOG.filter(
    (t) => t.category === 'passport' || ['signature-resize', 'photo-compress-20kb', 'photo-compress-50kb', 'photo-compress-100kb', 'document-size-checker'].includes(t.id)
  );

  const faqs = [
    {
      q: isTa ? 'TNPSC, SSC, RRB தேர்வுகளின் அளவு விதிகளை எப்படி உறுதி செய்வது?' : 'How should I confirm active TNPSC, SSC, or RRB photo specifications?',
      a: isTa
        ? 'ஒவ்வொரு தேர்வு அறிவிப்பிலும் (Official Notification PDF) புகைப்படப் பிக்சல், KB அளவு மற்றும் தேதி/பெயர் அச்சிடல் விதிகள் புதுப்பிக்கப்படும். விண்ணப்பத்தைச் சமர்ப்பிக்கும் முன் அதிகாரப்பூர்வ அறிவிப்பை அவசியம் சரிபார்க்கவும்.'
        : 'Exam commissions periodically update pixel dimensions, white/light background instructions, and permissible KB ranges in each official recruitment notification. Always confirm against the active notification PDF before final upload.'
    },
    {
      q: isTa ? 'புகைப்படம் மற்றும் கையொப்பம் சரியாக 20 KB – 50 KB-க்குள் இருக்குமா?' : 'Do the resizers keep files strictly below the selected KB cap?',
      a: isTa
        ? 'ஆம். எங்கள் கருவி துல்லியமான தரச் சுருக்கத்தின் (Iterative JPEG Compression) மூலம் குறிப்பிட்ட KB வரம்புக்குள் கோப்பைக் கொண்டுவர முயற்சிக்கும்; முடியாத சூழலில் தெளிவான எச்சரிக்கையைக் காண்பிக்கும்.'
        : 'Yes. The client-side compressor uses iterative JPEG quality sizing paired with your target pixel preset to meet your selected KB cap cleanly without generating corrupt blank canvases.'
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
          {isTa ? 'அனைத்து கருவிகள்' : 'All Tools'}
        </SpaLink>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>
          {isTa ? 'அரசுத் தேர்வு போட்டோ கருவிகள்' : 'Government Exam Photo Tools'}
        </span>
      </nav>

      <header style={{ background: 'linear-gradient(135deg, #064e3b 0%, #047857 55%, #0052cc 100%)', borderRadius: '24px', padding: '36px 28px', color: 'white', marginBottom: '28px', boxShadow: '0 14px 34px rgba(4,120,87,0.2)' }}>
        <span style={{ background: '#fde047', color: '#422006', fontSize: '11.5px', fontWeight: 900, padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '12px' }}>
          🎓 {isTa ? 'தமிழ்நாடு & மத்திய அரசுத் தேர்வுப் பதிவேற்ற கருவிகள்' : 'TNPSC, SSC, RRB & UPSC Exam File Tools'}
        </span>
        <h1 style={{ fontSize: '30px', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.3 }}>
          {isTa
            ? 'TNPSC, SSC, RRB & UPSC தேர்வு போட்டோ, கையொப்பம் & KB அளவீட்டுக் கருவிகள்'
            : 'TNPSC, SSC, Railway (RRB) & UPSC Exam Photo, Signature & KB Resizer Tools'}
        </h1>
        <p style={{ fontSize: '15.5px', opacity: 0.95, margin: '0 0 20px', maxWidth: '860px', lineHeight: 1.65 }}>
          {isTa
            ? 'அரசுத் தேர்வுப் படிவங்களில் புகைப்படம் மற்றும் கையொப்பம் அளவு பிழையால் நிராகரிக்கப்படுவதைத் தவிர்க்க உதவும் பிரவுசர் கருவிகள். தமிழ்நாடு முழுவதும் உள்ள தேர்வுதாரர்கள் இலவசமாகப் பயன்படுத்தலாம்.'
            : 'Resize candidate photos and signatures to exam dimensions and KB limits directly in your browser. Supports TNPSC OTR, SSC presets, Railway RRB guidelines, and custom KB/pixel controls across Tamil Nadu.'}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <SpaLink to="/tools/tnpsc-photo-resizer" navigate={navigate} scrollToTop style={{ background: 'white', color: '#064e3b', padding: '11px 18px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}>
            🏛️ TNPSC Resizer
          </SpaLink>
          <SpaLink to="/tools/ssc-photo-resizer" navigate={navigate} scrollToTop style={{ background: '#fef08a', color: '#422006', padding: '11px 18px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}>
            📋 SSC Resizer
          </SpaLink>
          <SpaLink to="/tools/rrb-photo-resizer" navigate={navigate} scrollToTop style={{ background: 'rgba(255,255,255,0.16)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '11px 18px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}>
            🚆 RRB Railway Resizer
          </SpaLink>
        </div>
      </header>

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '14px 18px', marginBottom: '28px', fontSize: '13px', color: '#92400e', lineHeight: 1.55, display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>{isTa ? 'அறிவிப்பு சரிபார்ப்பு (Notification Check): ' : 'Verify Official Notification PDF: '}</strong>
          {isTa
            ? 'ஒவ்வொரு தேர்விற்கும் அதிகாரப்பூர்வ அறிவிப்பில் (TNPSC/SSC/RRB/UPSC Notification) குறிப்பிடப்பட்டுள்ள மிகச் சரியான பிக்சல், KB மற்றும் தேதி/பெயர் விதிகளைச் சரிபார்த்த பிறகே விண்ணப்பத்தைப் பதிவேற்றவும்.'
            : 'Portal specifications vary between recruitment cycles. Always verify final pixel dimensions, background colour, and KB range in your active exam notification before final submission.'}
        </div>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
          {isTa ? 'தேர்வு போட்டோ & கையொப்பக் கருவிகள்' : 'Exam Photo, Signature & Compression Tools'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '18px' }}>
          {examTools.map((tool) => (
            <SpaLink
              key={tool.id}
              to={tool.path}
              navigate={navigate}
              scrollToTop
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '20px' }}>🎓</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '12px' }}>
                    {isTa ? (tool.badgeTa || tool.badge) : tool.badge}
                  </span>
                </div>
                <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
                  {isTa ? (tool.titleTa || tool.title) : tool.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, margin: '0 0 14px' }}>
                  {isTa ? (tool.shortDescTa || tool.shortDesc) : tool.shortDesc}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#047857', fontWeight: 700, fontSize: '13px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <span>Browser Preset</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{isTa ? 'பயன்படுத்த' : 'Open'} <ArrowRight size={14} /></span>
              </div>
            </SpaLink>
          ))}
        </div>
      </section>

      <section style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 12px', color: '#0f172a' }}>
          🔗 {isTa ? 'அடுத்த கட்ட உதவி & வழிகாட்டிகள்' : 'Next Steps & Connected Guides'}
        </h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <SpaLink to="/online-application-assistance" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Online Exam Application Guidance</SpaLink>
          <SpaLink to="/notifications" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Latest Govt Exam Notifications</SpaLink>
          <SpaLink to="/pdf-tools" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>PDF Merge & Compress Hub</SpaLink>
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
