import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, ShieldCheck, ArrowRight, MapPin } from 'lucide-react';
import { PHOTO_TOOLS_CATALOG } from '../data/photoToolsData';
import { siteConfig } from '../config/siteConfig';
import SpaLink from '../components/SpaLink';

export const pageMeta = {
  id: 'pdf-tools',
  title: 'Free Online PDF Tools India — Merge, Split, Compress & PDF to JPG | AK E-SEVAI'
};

export default function PdfToolsHubPage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const pdfTools = PHOTO_TOOLS_CATALOG.filter(
    (t) => t.category === 'pdf' || t.id === 'document-size-checker'
  );

  const faqs = [
    {
      q: isTa ? 'PDF இணைப்பு மற்றும் சுருக்கம் உங்கள் சர்வரில் நடைபெறுமா?' : 'Are uploaded PDFs stored or processed on external servers?',
      a: isTa
        ? 'இல்லை. pdf-lib மற்றும் Mozilla PDF.js ஆகியவை உங்கள் பிரவுசர் மெமரி உள்ளேயே இயங்குகின்றன. ஆதார், பட்டா, மார்க்ஷீட் போன்ற ஆவணங்கள் எந்த சர்வருக்கும் அனுப்பப்படுவதில்லை.'
        : 'No. Every PDF tool runs locally inside your browser using pdf-lib and PDF.js. Sensitive documents such as Aadhaar, Patta, or marksheets stay on your device.'
    },
    {
      q: isTa ? 'PDF Compress பயன்படுத்தும்போது கோப்பு அளவு குறையாவிட்டால் என்ன ஆகும்?' : 'What happens if PDF compression cannot reduce an already optimized file?',
      a: isTa
        ? 'எங்கள் கருவி அசல் கோப்பு அளவையும் புதிய அளவையும் ஒப்பிட்டுப் பார்க்கும். அசல் கோப்பை விடப் புதியது சிறியதாக இல்லாவிட்டால் தேவையற்ற பெரிய கோப்பை உருவாக்காமல் உண்மையான தகவலைக் காண்பிக்கும்.'
        : 'Our tool compares the input byte count against the generated output. If a PDF is already heavily compressed and cannot shrink further, the tool preserves your smaller original file cleanly and notifies you honestly.'
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
          {isTa ? 'PDF கருவிகள்' : 'Online PDF Tools'}
        </span>
      </nav>

      <header style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 65%, #0052cc 100%)', borderRadius: '24px', padding: '36px 28px', color: 'white', marginBottom: '28px', boxShadow: '0 14px 34px rgba(15,23,42,0.2)' }}>
        <span style={{ background: '#38bdf8', color: '#082f49', fontSize: '11.5px', fontWeight: 900, padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '12px' }}>
          📄 {isTa ? '100% பிரவுசர் பாதுகாப்பு PDF கருவிகள்' : '100% Client-Side Privacy PDF Suite'}
        </span>
        <h1 style={{ fontSize: '30px', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.3 }}>
          {isTa
            ? 'இலவச ஆன்லைன் PDF கருவிகள் — Merge, Split, Rotate, Extract, Compress & PDF to JPG'
            : 'Free Online PDF Tools — Merge, Split, Rotate, Extract Pages, Compress & PDF to JPG'}
        </h1>
        <p style={{ fontSize: '15.5px', opacity: 0.95, margin: '0 0 20px', maxWidth: '860px', lineHeight: 1.65 }}>
          {isTa
            ? 'இ-சேவை, கல்லூரி சேர்க்கை மற்றும் அரசுத் தேர்வுப் பதிவேற்றங்களுக்காக பல PDF ஆவணங்களை இணைக்கவும், தேவையான பக்கங்களை மட்டும் பிரிக்கவும், பக்கங்களைச் சுழற்றவும் (Rotate) அல்லது 200 KB / 500 KB அளவுக்குத் தயாரிக்கவும்.'
            : 'Built for Tamil Nadu e-Sevai, TNEA college uploads, and TNPSC/SSC PDF attachments. Merge multi-page PDFs, split page ranges, rotate sideways scans, render PDF pages to JPG, and compare compression savings locally in your browser.'}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <SpaLink to="/tools/pdf-merge" navigate={navigate} scrollToTop style={{ background: '#22c55e', color: '#064e3b', padding: '12px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '14px', textDecoration: 'none' }}>
            📑 {isTa ? 'PDF Merge தொடங்குக' : 'Open PDF Merge'}
          </SpaLink>
          <SpaLink to="/tools/pdf-compress" navigate={navigate} scrollToTop style={{ background: 'white', color: '#0f172a', padding: '12px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '14px', textDecoration: 'none' }}>
            📉 {isTa ? 'PDF சுருக்க (Compress)' : 'Open PDF Compress'}
          </SpaLink>
        </div>
      </header>

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px 18px', marginBottom: '28px', fontSize: '13.5px', color: '#166534', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <ShieldCheck size={20} style={{ flexShrink: 0 }} />
        <span>
          {isTa
            ? 'உங்கள் PDF ஆவணங்கள் சர்வருக்குப் பதிவேற்றப்படுவதில்லை. தமிழ்நாடு முழுவதும் உள்ள மாணவர்கள் & விண்ணப்பதாரர்கள் இலவசமாகப் பயன்படுத்தலாம்.'
            : 'Zero Server Upload: All PDF inspection, rendering, merging, splitting, and compression happen inside your browser memory.'}
        </span>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
          {isTa ? 'அனைத்து PDF & ஆவணக் கருவிகள்' : 'Available PDF & Document Preparation Tools'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '18px' }}>
          {pdfTools.map((tool) => (
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
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '10px', background: '#eff6ff', color: '#0052cc' }}>
                    <FileText size={20} />
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, background: '#eff6ff', color: '#0052cc', padding: '4px 10px', borderRadius: '12px' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#0052cc', fontWeight: 700, fontSize: '13px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><FileText size={14} /> Free Tool</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>{isTa ? 'தொடங்குக' : 'Open'} <ArrowRight size={14} /></span>
              </div>
            </SpaLink>
          ))}
        </div>
      </section>

      <section style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 12px', color: '#0f172a' }}>
          🔗 {isTa ? 'தொடர்புடைய பக்கங்கள்' : 'Related Guides & Hubs'}
        </h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <SpaLink to="/esevai-services" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>e-Sevai Services Hub</SpaLink>
          <SpaLink to="/government-exam-tools" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Exam Photo Tools Hub</SpaLink>
          <SpaLink to="/certificate-services" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Certificate Checklists</SpaLink>
          <SpaLink to="/online-document-services" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Online Document Services</SpaLink>
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
            📍 {isTa ? 'நேரடி பிரிண்டிங் & சேவை மையம் (பழனி மட்டும்)' : 'Walk-In Printing & Scanning Centre (Palani Only)'}
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
