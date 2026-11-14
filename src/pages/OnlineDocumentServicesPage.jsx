import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileCheck2, MapPin, Phone } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import SpaLink from '../components/SpaLink';

export const pageMeta = {
  id: 'online-document-services',
  title: 'Online Document Preparation, Scanning Guides & Utility Hub | AK E-SEVAI'
};

export default function OnlineDocumentServicesPage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const workflows = [
    {
      title: isTa ? 'ஆவண அளவு & பிக்சல் சோதனை (Pre-Upload Check)' : 'Pre-Upload File Size, DPI & Dimension Verification',
      desc: isTa
        ? 'அரசு மற்றும் கல்லூரி போர்ட்டல்களில் பதிவேற்றுவதற்கு முன் உங்கள் JPG/PNG/PDF கோப்புகளின் சரியான KB அளவு, பக்க எண்ணிக்கை மற்றும் பிக்சல்களைப் பரிசோதிக்கவும்.'
        : 'Inspect JPG/PNG pixel widths/heights and PDF page counts + file weights before submitting any form online.',
      to: '/tools/document-size-checker',
      cta: isTa ? 'ஆவண சோதனை கருவி' : 'Open Document Checker'
    },
    {
      title: isTa ? 'பல சான்றிதழ்களை 100 KB / 200 KB PDF & படமாக மாற்றுதல்' : 'Compress Scans cleanly to 50 KB / 100 KB / 200 KB',
      desc: isTa
        ? 'ஆதார், மார்க்ஷீட், வங்கிப் பாஸ்புக் மற்றும் வருமானச் சான்றுகளைத் தெளிவு குறையாமல் போர்டல் வரம்புக்குள் சுருக்கி இணைக்கவும்.'
        : 'Compress ID scans under 50 KB, 100 KB, or 200 KB targets, merge pages into single PDFs, or split oversized files locally.',
      to: '/tools/photo-compress-200kb',
      cta: isTa ? '200 KB சுருக்கக் கருவி' : 'Compress Under 200 KB'
    },
    {
      title: isTa ? 'ஸ்கேன், ஜெராக்ஸ், தட்டச்சு & ஸ்பைரல் பைண்டிங் (பழனி நேரடி சேவை)' : 'Physical Printing, Typing & Spiral Binding (Palani Walk-In Desk)',
      desc: isTa
        ? 'பழனி மற்றும் சுற்றுவட்டாரப் பயனர்கள் மில் ரோடு மையத்தில் நேரடியாகக் கலர் பிரிண்ட், ஆங்கில/தமிழ் தட்டச்சு, லேமினேஷன் & பைண்டிங் பெறலாம்.'
        : 'Need physical prints, legal typing, colour Xerox, spiral binding, or lamination? Visit our Palani counter on Mill Road.',
      to: '/xerox-printing',
      cta: isTa ? 'ஜெராக்ஸ் & பிரிண்டிங் விபரம்' : 'View Printing Services'
    }
  ];

  const faqs = [
    {
      q: isTa ? 'பழனி தவிர பிற தமிழ்நாடு ஊர்களில் உள்ளவர்களுக்கு என்னென்ன சேவைகள் ஆன்லைனில் கிடைக்கும்?' : 'What services are available online across Tamil Nadu outside Palani?',
      a: isTa
        ? 'தமிழ்நாடு முழுவதும் உள்ள அனைவரும் எங்கள் 31 பிரவுசர் புகைப்படம் & PDF கருவிகள், சான்றிதழ் ஆவண வழிகாட்டிகள், மாவட்ட இ-சேவை இணைப்புகள் மற்றும் வாட்ஸ்அப் (+91 93423 18844) வழிகாட்டலை ஆன்லைனில் பெறலாம். நேரடி பிரிண்டிங்/பைண்டிங் பழனி மையத்தில் மட்டுமே வழங்கப்படுகிறது.'
        : 'Users everywhere in Tamil Nadu can freely use all 31 browser-based photo/PDF tools, certificate checklists, district portal guides, and remote WhatsApp support (+91 93423 18844). Physical Xerox, binding, and counter printing operate solely in Palani.'
    },
    {
      q: isTa ? 'எங்கள் ஆவணங்களை 500 KB-க்குக் கீழ் கொண்டுவர எந்தக் கருவிகள் உதவும்?' : 'Which tools help keep PDF and image submissions compact cleanly?',
      a: isTa
        ? 'புகைப்படங்களுக்கு Photo Compressor (20 KB / 50 KB / 100 KB / 200 KB) கருவிகளையும், PDF கோப்புகளுக்கு PDF Split, PDF Extract Pages மற்றும் PDF Compress கருவிகளையும் பயன்படுத்தலாம்.'
        : 'Use our Photo Compressors (20 KB / 50 KB / 100 KB / 200 KB) for scans and our PDF Split, PDF Extract Pages, or PDF Compress tools to keep document PDFs crisp and compact.'
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
          {isTa ? 'ஆன்லைன் ஆவணத் தயாரிப்பு சேவைகள்' : 'Online Document Services'}
        </span>
      </nav>

      <header style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 55%, #0052cc 100%)', borderRadius: '24px', padding: '36px 28px', color: 'white', marginBottom: '28px', boxShadow: '0 14px 34px rgba(15,23,42,0.18)' }}>
        <span style={{ background: '#38bdf8', color: '#082f49', fontSize: '11.5px', fontWeight: 900, padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '12px' }}>
          📂 {isTa ? 'தமிழ்நாடு ஆன்லைன் ஆவணத் தயாரிப்பு & வழிகாட்டல்' : 'Tamil Nadu Online Document Prep & Scanning Guidance'}
        </span>
        <h1 style={{ fontSize: '30px', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.3 }}>
          {isTa
            ? 'ஆன்லைன் ஆவணத் தயாரிப்பு, PDF/JPG அளவீடு & டிஜிட்டல் சேவை மையம்'
            : 'Online Document Preparation, File Verification & Digital Services Hub'}
        </h1>
        <p style={{ fontSize: '15.5px', opacity: 0.95, margin: '0 0 20px', maxWidth: '860px', lineHeight: 1.65 }}>
          {isTa
            ? 'தமிழ்நாடு முழுவதும் உள்ள மாணவர்கள், வேலை தேடுவோர் மற்றும் குடிமக்கள் தங்கள் ஆவணங்களைப் பதிவேற்றுவதற்குத் தயார் செய்ய உதவும் இலவச ஆன்லைன் கருவிகள் + பழனியில் நேரடி ஜெராக்ஸ், தட்டச்சு & பைண்டிங் சேவைகள்.'
            : 'Prepare crisp document scans, verify pixel & PDF sizes safely in your browser anywhere across Tamil Nadu, or combine our Palani walk-in printing, typing, and binding counter.'}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <SpaLink to="/photo-tools" navigate={navigate} scrollToTop style={{ background: '#22c55e', color: '#064e3b', padding: '12px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <FileCheck2 size={16} /> {isTa ? 'அனைத்து இலவசக் கருவிகள்' : 'Browse All 31 Tools'}
          </SpaLink>
          <a href="https://wa.me/919342318844?text=Hello%20AK%20E-SEVAI%2C%20I%20need%20online%20document%20assistance." target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,0.16)', color: 'white', border: '1px solid rgba(255,255,255,0.35)', padding: '12px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={15} /> WhatsApp +91 93423 18844
          </a>
        </div>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
          {isTa ? 'ஆவணத் தயாரிப்பு வழிமுறைகள்' : 'Document Preparation & Verification Workflows'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {workflows.map((wf, idx) => (
            <div key={idx} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>{wf.title}</h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.55, margin: '0 0 18px' }}>{wf.desc}</p>
              </div>
              <SpaLink to={wf.to} navigate={navigate} scrollToTop style={{ textAlign: 'center', background: '#0052cc', color: 'white', padding: '10px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
                {wf.cta}
              </SpaLink>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', marginBottom: '36px' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 12px', color: '#0f172a' }}>
          🔗 {isTa ? 'தொடர்புடைய சேவைப் பக்கங்கள்' : 'Related Service Pages'}
        </h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <SpaLink to="/pdf-tools" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>PDF Tools Hub</SpaLink>
          <SpaLink to="/typing-services" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Tamil & English Typing (Palani)</SpaLink>
          <SpaLink to="/spiral-binding" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Spiral Binding & Lamination (Palani)</SpaLink>
          <SpaLink to="/tamil-nadu-district-esevai-guides" navigate={navigate} scrollToTop style={{ background: 'white', border: '1px solid #cbd5e1', color: '#0052cc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Tamil Nadu 16-City Guide</SpaLink>
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
            📍 {isTa ? 'நேரடி சேவை மையம் (பழனி மட்டும்)' : 'Physical Walk-In Counter (Palani Only)'}
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
