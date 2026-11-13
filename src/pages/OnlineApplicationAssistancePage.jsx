import React, { useState } from 'react';
import {
  AlertTriangle, Phone, MapPin, Camera, ChevronDown, ChevronUp, Clock
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import SpaLink from '../components/SpaLink';

export const pageMeta = {
  id: 'online-application-assistance',
  title: 'Online Application Assistance | TNPSC, SSC, RRB, College Admissions | AK E-SEVAI'
};

export default function OnlineApplicationAssistancePage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const examCategories = [
    {
      title: isTa ? 'தமிழ்நாடு அரசுப் பணியாளர் தேர்வாணையம் (TNPSC)' : 'TNPSC Exams (Group 1, 2, 4 & VAO)',
      badge: 'Group 1, 2, 2A, 4 & VAO',
      desc: isTa
        ? 'TNPSC OTR (One Time Registration) மற்றும் தேர்வு விண்ணப்பங்களுக்குத் தேவையான புகைப்படம்/கையொப்ப அளவீடு மற்றும் ஆன்லைன் விண்ணப்ப உதவி.'
        : 'Guidance for TNPSC One Time Registration (OTR), exam form assistance, and preparing compliant photo/signature files as listed in the active notification.',
      photoReq: isTa ? 'பொதுவான மாதிரி: 350 × 450 px (≤50 KB) • கையொப்பம் ≤20 KB (அறிவிப்பை சரிபார்க்கவும்)' : 'Typical reference: 350×450 px (≤50 KB), Signature ≤20 KB (verify active notice)',
      toolPath: '/tools/tnpsc-photo-resizer'
    },
    {
      title: isTa ? 'மத்திய அரசுப் பணியாளர் தேர்வாணையம் (SSC)' : 'Staff Selection Commission (SSC)',
      badge: 'CGL, CHSL, MTS, GD',
      desc: isTa
        ? 'SSC புதிய இணையதள OTR பதிவு, ஆவணங்கள் மற்றும் கையொப்ப அளவு தயாரிப்பதற்கான வழிகாட்டல் மற்றும் விண்ணப்ப உதவி.'
        : 'Assistance for SSC OTR registration, signature image sizing, and application verification for CGL, CHSL, MTS, and GD.',
      photoReq: isTa ? 'பொதுவான மாதிரி: 200 × 230 px • கையொப்பம் ≤20 KB (அறிவிப்பை சரிபார்க்கவும்)' : 'Typical reference: 200×230 px, Signature ≤20 KB (check official notice)',
      toolPath: '/tools/ssc-photo-resizer'
    },
    {
      title: isTa ? 'ரயில்வே தேர்வு வாரியம் (RRB & RRC)' : 'Railway Recruitment Board (RRB / RRC)',
      badge: 'ALP, NTPC, Group D, Technician',
      desc: isTa
        ? 'ரயில்வே ALP, டெக்னீசியன், NTPC மற்றும் குரூப்-டி தேர்வுகளுக்கான ஆன்லைன் விண்ணப்ப உதவி மற்றும் புகைப்படத் தயாரிப்பு.'
        : 'Application filling support and photo/signature sizing for Railway ALP, Technician, NTPC, and Group D recruitments.',
      photoReq: isTa ? 'பொதுவான மாதிரி: 35 × 45 mm • அறிவிப்பு KB வரம்பை சரிபார்க்கவும்' : 'Typical reference: 35×45 mm — verify CEN notice KB rules before upload',
      toolPath: '/tools/rrb-photo-resizer'
    },
    {
      title: isTa ? 'தமிழ்நாடு சீருடைப் பணியாளர் தேர்வு (TNUSRB)' : 'Police & Uniformed Services (TNUSRB)',
      badge: 'SI & Police Constable',
      desc: isTa
        ? 'காவலர் (Police Constable), சிறைக் காவலர், தீயணைப்பாளர் மற்றும் Sub-Inspector தேர்வுகளுக்கான விண்ணப்ப உதவி.'
        : 'Support for Tamil Nadu Police Constable, Jail Warden, Fireman, and Sub-Inspector online applications.',
      photoReq: isTa ? 'படம் & கையொப்ப அளவுகளுக்கு Govt Exam கருவியைப் பயன்படுத்தவும்' : 'Prepare resized photo & signature cleanly in browser before uploading',
      toolPath: '/tools/govt-exam-photo-tool'
    },
    {
      title: isTa ? 'ஆசிரியர் & தகுதித் தேர்வுகள் (TRB / TET / CTET)' : 'Teaching Exams (TRB, TNTET, CTET)',
      badge: 'TNTET, PG TRB, CTET',
      desc: isTa
        ? 'தமிழ்நாடு ஆசிரியர் தகுதித் தேர்வு (TNTET), TRB, மற்றும் CTET விண்ணப்பப் பதிவு மற்றும் சான்றிதழ் PDF தயாரிப்பு.'
        : 'Registration assistance and PDF certificate merging for TNTET, TRB, and CTET applicants across Tamil Nadu.',
      photoReq: isTa ? 'அறிவிப்பில் குறிப்பிட்டுள்ள KB வரம்பிற்கு ஏற்ப புகைப்படம்/PDF தயாரிக்க' : 'Verify brochure limits & compress images or PDFs locally',
      toolPath: '/tools/signature-resize'
    },
    {
      title: isTa ? 'கல்லூரி சேர்க்கை & கல்வி உதவித்தொகை (TNEA / NEET / NSP)' : 'College Admissions & Scholarships',
      badge: 'TNEA, TNGASA, Scholarships',
      desc: isTa
        ? 'பொறியியல் கலந்தாய்வு (TNEA), கலை/அறிவியல் (TNGASA), பாலிடெக்னிக் மற்றும் கல்வி உதவித்தொகை ஆன்லைன் விண்ணப்ப உதவி.'
        : 'Document scanning formatting and online application guidance for TNEA engineering counselling, TNGASA admissions, and scholarship portals.',
      photoReq: isTa ? 'மார்க்ஷீட் & சான்றிதழ்களை PDF-ஆக மாற்ற JPG to PDF பயன்படுத்தவும்' : 'Convert certificate photos to clean A4 PDFs using JPG to PDF',
      toolPath: '/tools/jpg-to-pdf'
    }
  ];

  const faqs = [
    {
      q: isTa ? 'ஆன்லைன் தேர்வு விண்ணப்பத்திற்கு என்னென்ன விவரங்கள் தேவை?' : 'What documents are usually needed for exam application support?',
      a: isTa
        ? 'பொதுவாக 10th/12th/டிகிரி மதிப்பெண் பட்டியல்கள், ஆதார் அட்டை, சாதிச் சான்றிதழ் (தேவையெனில்), தெளிவான புகைப்படம் மற்றும் வெள்ளை தாளில் கையொப்பம் ஆகியவை தேவைப்படும். சரியான தகுதி விதிகளுக்கு எப்போதும் அதிகாரப்பூர்வ தேர்வு அறிவிப்பைப் படிக்கவும்.'
        : 'Usually educational marksheets (10th/12th/Degree), Aadhaar card, applicable reservation certificates, recent photo, and white-paper signature are needed. Always verify eligibility rules directly against the official exam notification.'
    },
    {
      q: isTa ? 'புகைப்படம் மற்றும் கையொப்பத்தை இலவசமாக ஆன்லைனில் மாற்ற முடியுமா?' : 'Can I prepare exam photos and signatures online for free across Tamil Nadu?',
      a: isTa
        ? 'ஆம்! தமிழ்நாட்டின் எந்த ஊரில் இருந்தாலும் எங்கள் /government-exam-tools மற்றும் /photo-tools பக்கங்களில் 100% இலவசமாகவும் சர்வருக்குப் பதிவேற்றாமலும் பிரவுசரிலேயே படங்களைச் சுருக்கி அளவிடலாம்.'
        : 'Yes. Applicants anywhere in Tamil Nadu can use our browser-based tools on /government-exam-tools cleanly without server uploads.'
    },
    {
      q: isTa ? 'AK E-SEVAI அரசு நிறுவனமா அல்லது தனியார் உதவி மையமா?' : 'Is AK E-SEVAI an official government recruitment board?',
      a: isTa
        ? 'இல்லை. AK E-SEVAI என்பது தனியார் டிஜிட்டல் சேவை & ஆன்லைன் விண்ணப்ப உதவி மையம் மட்டுமே. நாங்கள் எந்தத் தேர்வு வாரியத்துடனும் அதிகாரப்பூர்வமாக இணைக்கப்படவில்லை; படிவங்களைச் சரியாகச் சமர்ப்பிக்கவும் ஆவணங்களைத் தயார் செய்யவும் மட்டுமே உதவுகிறோம்.'
        : 'No. AK E-SEVAI is a private digital service centre offering application assistance and free browser formatting tools. We are not affiliated with TNPSC, SSC, RRB, or any government commission.'
    }
  ];

  return (
    <div className="inner-page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px 60px' }}>
      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SpaLink to="/" navigate={navigate} scrollToTop style={{ color: '#0052cc', textDecoration: 'none', fontWeight: 700 }}>{isTa ? 'முகப்பு' : 'Home'}</SpaLink>
        <span>/</span>
        <SpaLink to="/esevai-services" navigate={navigate} scrollToTop style={{ color: '#0052cc', textDecoration: 'none', fontWeight: 700 }}>{isTa ? 'ஆன்லைன் சேவைகள்' : 'e-Sevai Services'}</SpaLink>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{isTa ? 'தேர்வு விண்ணப்ப உதவி' : 'Online Application Assistance'}</span>
      </nav>

      <header style={{ background: 'linear-gradient(135deg, #065f46 0%, #059669 60%, #10b981 100%)', borderRadius: '24px', padding: '36px 28px', color: 'white', marginBottom: '32px' }}>
        <span style={{ background: '#fef08a', color: '#854d0e', fontSize: '11.5px', fontWeight: 900, padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '12px' }}>
          {isTa ? '⚡ தமிழ்நாடு ஆன்லைன் விண்ணப்ப உதவி & தேர்வு கருவிகள்' : '⚡ Tamil Nadu Online Application Support & Exam Tools'}
        </span>
        <h1 style={{ fontSize: '29px', fontWeight: 900, margin: '0 0 12px', lineHeight: 1.3 }}>
          {isTa ? 'அரசுத் தேர்வுகள் & கல்லூரி சேர்க்கை ஆன்லைன் விண்ணப்ப உதவி' : 'Government Exam, Scholarship & College Application Assistance'}
        </h1>
        <p style={{ fontSize: '15px', opacity: 0.95, margin: '0 0 20px', maxWidth: '840px', lineHeight: 1.6 }}>
          {isTa
            ? 'TNPSC, SSC, ரயில்வே (RRB), காவலர் தேர்வு, TRB, கல்லூரி சேர்க்கை மற்றும் கல்வி உதவித்தொகை விண்ணப்பங்களுக்குப் பிழையில்லாத ஆவண தயாரிப்பு & வழிகாட்டல். பழனியில் நேரடி மையம்; தமிழ்நாடு முழுவதும் ஆன்லைன் கருவிகள்.'
            : 'Practical application form support and browser-based document preparation tools for TNPSC, SSC, RRB, Police, Teaching, and College Admissions across Tamil Nadu.'}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <SpaLink to="/government-exam-tools" navigate={navigate} scrollToTop style={{ background: '#fef08a', color: '#854d0e', padding: '11px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={16} /> {isTa ? 'தேர்வு போட்டோ கருவிகள்' : 'Exam Photo Tools Hub'}
          </SpaLink>
          <a href="https://wa.me/919342318844?text=Hello%20AK%20E-SEVAI%2C%20I%20need%20online%20application%20assistance." target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.35)', padding: '11px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13.5px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={15} /> WhatsApp (+91 93423 18844)
          </a>
        </div>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '18px' }}>
          {isTa ? 'ஆதரிக்கப்படும் தேர்வு & கல்வி விண்ணப்ப பிரிவுகள்' : 'Exam & Admission Categories Supported'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {examCategories.map((item, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '12px', display: 'inline-block', marginBottom: '10px' }}>{item.badge}</span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>{item.title}</h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.55, margin: '0 0 12px' }}>{item.desc}</p>
                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#334155', marginBottom: '14px' }}>
                  <strong>📐 {isTa ? 'குறிப்பு: ' : 'Sizing Tip: '}</strong>{item.photoReq}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <SpaLink to={item.toolPath} navigate={navigate} scrollToTop style={{ flex: 1, textAlign: 'center', background: '#059669', color: 'white', padding: '9px 10px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none' }}>
                  {isTa ? 'படத்தைத் தயார் செய்' : 'Open Resizer Tool'}
                </SpaLink>
                <SpaLink to="/token-generator" navigate={navigate} scrollToTop style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '9px 12px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none' }}>
                  <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />{isTa ? 'டோக்கன்' : 'Book Token'}
                </SpaLink>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: '#fffbeb', borderRadius: '18px', padding: '24px', marginBottom: '36px', border: '1px solid #fde68a' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#92400e', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={20} color="#b45309" /> {isTa ? 'விண்ணப்பப் பிழைகளைத் தவிர்க்க 4 முக்கிய சரிபார்ப்புகள்' : '4 Essential Checks Before Submitting Online Forms'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', fontSize: '13.5px', color: '#78350f', lineHeight: 1.55 }}>
          <div><strong>1. {isTa ? 'பெயர் & பிறந்த தேதி:' : '10th Marksheet Match:'}</strong> {isTa ? 'மதிப்பெண் சான்றிதழில் உள்ளவாறு பெயர், இனிஷியல் மற்றும் பிறந்த தேதி சரியாக உள்ளதா என உறுதிப்படுத்தவும்.' : 'Verify spelling, initials, and DOB strictly match SSLC records.'}</div>
          <div><strong>2. {isTa ? 'சமீபத்திய புகைப்படம்:' : 'Current Brochure Rules:'}</strong> {isTa ? 'தேர்வு அறிவிப்பில் குறிப்பிட்டுள்ள பின்னணி, தேதி முத்திரை மற்றும் KB வரம்புகளைச் சரிபார்க்கவும்.' : 'Check photo backdrop, name/date strip, and KB limits against active official notice.'}</div>
          <div><strong>3. {isTa ? 'தெளிவான கையொப்பம்:' : 'Clear Signature:'}</strong> {isTa ? 'வெள்ளை காகிதத்தில் தெளிவான கையொப்பத்தைப் படமெடுத்து 20 KB-க்குள் சுருக்குங்கள்.' : 'Capture signature cleanly on plain white paper and validate KB size.'}</div>
          <div><strong>4. {isTa ? 'சான்றிதழ் எண்கள்:' : 'Certificate Accuracy:'}</strong> {isTa ? 'சாதி / வருமான / கல்விச் சான்றிதழ் எண்கள் மற்றும் வெளியிட்ட தேதி பிழையின்றி உள்ளிடவும்.' : 'Double check certificate serial numbers and issue dates prior to final lock.'}</div>
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
                {openFaq === idx ? <ChevronUp size={18} color="#059669" /> : <ChevronDown size={18} color="#64748b" />}
              </button>
              {openFaq === idx && <div style={{ padding: '0 18px 15px', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '18px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
            📍 {isTa ? 'நேரடி மையம் (பழனி மட்டும்)' : 'Walk-In Desk (Palani Centre Only)'}
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '4px 0 6px' }}>AK E-SEVAI Palani</h3>
          <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 4px' }}>Mill Road, Sanmugapuram, Anna Nagar, Palani, Tamil Nadu 624601</p>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Online guidance available statewide • 📞 +91 93423 18844 | akesevaipalani@gmail.com</p>
        </div>
        <a href={siteConfig.mapUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#059669', color: 'white', padding: '10px 18px', borderRadius: '10px', fontSize: '13.5px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={16} /> Google Maps
        </a>
      </section>
    </div>
  );
}
