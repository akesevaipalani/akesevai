import React, { useState } from 'react';
import {
  Briefcase, GraduationCap, CheckCircle2, AlertTriangle, Phone, MapPin,
  Clock, Calendar, FileText, ArrowRight, Camera, HelpCircle, ChevronDown,
  ChevronUp, ShieldCheck, Download, ExternalLink, Sparkles
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const pageMeta = {
  id: 'online-application-assistance',
  title: 'Government Exam & College Online Application Assistance | AK E-SEVAI Palani'
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
        ? 'TNPSC OTR (One Time Registration) புதிய பதிவு, புதுப்பித்தல், மற்றும் Group 1, Group 2, Group 4, VAO தேர்வுகளுக்கு பெயர் மற்றும் பிறந்த தேதி முத்திரையிடப்பட்ட புகைப்படத்துடன் பிழையின்றி விண்ணப்பிக்கும் முழுமையான உதவி.'
        : 'TNPSC One Time Registration (OTR), renewal, and application filing for Group 1, 2, 4, and VAO with mandated name & date stamped photographs.',
      photoReq: isTa ? 'புகைப்படம்: 350 × 450 px (20–50 KB) பெயர் & தேதியுடன் | கையொப்பம்: 200 × 100 px (10–20 KB)' : 'Photo: 350x450 px (20-50 KB) with Name & Date | Signature: 200x100 px (10-20 KB)',
      toolId: 'passport-size-photo'
    },
    {
      title: isTa ? 'மத்திய அரசுப் பணியாளர் தேர்வாணையம் (SSC)' : 'Staff Selection Commission (SSC)',
      badge: 'CGL, CHSL, MTS, GD',
      desc: isTa
        ? 'SSC புதிய இணையதளத்தில் OTR பதிவு, லைவ் போட்டோ கேமரா அப்லோடு வழிகாட்டல், CGL, CHSL, MTS, CPO மற்றும் Constable GD தேர்வுகளுக்கான விண்ணப்ப உதவி.'
        : 'SSC portal OTR setup, live webcam photo capture assistance, and online application filing for CGL, CHSL, MTS, and GD Constable.',
      photoReq: isTa ? 'புகைப்படம்: 200 × 230 px (20–50 KB) | கையொப்பம்: 140 × 60 px (10–20 KB)' : 'Photo: 200x230 px (20-50 KB) | Signature: 140x60 px (10-20 KB)',
      toolId: 'signature-resize'
    },
    {
      title: isTa ? 'ரயில்வே தேர்வு வாரியம் (RRB & RRC)' : 'Railway Recruitment Board (RRB / RRC)',
      badge: 'ALP, NTPC, Group D, Technician',
      desc: isTa
        ? 'ரயில்வே அசிஸ்டெண்ட் லோகோ பைலட் (ALP), டெக்னீசியன், NTPC மற்றும் குரூப்-டி பணிகளுக்கான ஆன்லைன் விண்ணப்பம் மற்றும் ஆவணங்கள் பதிவேற்றம்.'
        : 'Railway Assistant Loco Pilot (ALP), Technician, NTPC, and Group D application registration and document compliance.',
      photoReq: isTa ? 'புகைப்படம்: 35 × 45 mm (30–70 KB) வெள்ளை பின்னணி | கையொப்பம்: 30–70 KB' : 'Photo: 35x45 mm (30-70 KB) Plain White Background | Signature: 30-70 KB',
      toolId: 'photo-compress-50kb'
    },
    {
      title: isTa ? 'தமிழ்நாடு சீருடைப் பணியாளர் தேர்வாணையம் (TNUSRB)' : 'Uniformed Services (TNUSRB Police & SI)',
      badge: 'Sub-Inspector & Police Constable',
      desc: isTa
        ? 'இரண்டாம் நிலை காவலர் (Police Constable), சிறைக் காவலர், தீயணைப்பாளர் மற்றும் காவல் உதவி ஆய்வாளர் (Sub-Inspector) தேர்வுகளுக்கான விண்ணப்பம்.'
        : 'Tamil Nadu Police Sub-Inspector (SI), Grade II Police Constable, Jail Warden, and Fireman online application assistance.',
      photoReq: isTa ? 'புகைப்படம்: 20–50 KB | கையொப்பம்: 10–20 KB' : 'Photo: 20-50 KB | Signature: 10-20 KB',
      toolId: 'signature-resize'
    },
    {
      title: isTa ? 'ஆசிரியர் தேர்வு வாரியம் & தகுதித் தேர்வுகள் (TRB / TET / CTET)' : 'Teaching Exams (TRB, TNTET, CTET)',
      badge: 'TNTET, PG TRB, CTET',
      desc: isTa
        ? 'தமிழ்நாடு ஆசிரியர் தகுதித் தேர்வு (TNTET), முதுகலை ஆசிரியர் (PG TRB), மற்றும் மத்திய ஆசிரியர் தகுதித் தேர்வு (CTET) விண்ணப்பப் பதிவு.'
        : 'Tamil Nadu Teacher Eligibility Test (TNTET), PG TRB recruitment, and Central Teacher Eligibility Test (CTET) registration.',
      photoReq: isTa ? 'புகைப்படம்: 20–50 KB | கையொப்பம்: 10–20 KB' : 'Photo: 20-50 KB | Signature: 10-20 KB',
      toolId: 'passport-size-photo'
    },
    {
      title: isTa ? 'கல்லூரி சேர்க்கை & நுழைவுத் தேர்வுகள் (TNEA / NEET / CUET)' : 'College Admissions (TNEA, NEET, Arts & Science)',
      badge: 'TNEA Engineering, NEET, Arts',
      desc: isTa
        ? 'அண்ணா பல்கலைக்கழக பொறியியல் கலந்தாய்வு (TNEA), கலை மற்றும் அறிவியல் கல்லூரிகள் (TNGASA), பாலிடெக்னிக் மற்றும் நீட் (NEET) மருத்துவ விண்ணப்பங்கள்.'
        : 'Online counselling registrations for Anna University TNEA Engineering, Government Arts & Science (TNGASA), Polytechnic, and NEET UG.',
      photoReq: isTa ? 'மார்க்ஷீட், சாதி & முதல் பட்டதாரி சான்றிதழ்கள் PDF (200–500 KB)' : 'Certificates & Marksheets in PDF (200-500 KB)',
      toolId: 'jpg-to-pdf'
    }
  ];

  const faqs = [
    {
      q: isTa ? 'அரசுத் தேர்வு விண்ணப்பங்களுக்கு என்னென்ன ஆவணங்கள் கொண்டு வர வேண்டும்?' : 'What documents are required for government exam applications?',
      a: isTa
        ? '10th, 12th, மற்றும் டிகிரி மார்க்ஷீட்கள், ஆதார் அட்டை, சாதிச் சான்றிதழ், பாஸ்போர்ட் சைஸ் புகைப்படம், கையொப்பம், மற்றும் கட்டணம் செலுத்துவதற்கான UPI/வங்கி விவரங்கள் தேவைப்படும்.'
        : '10th, 12th marksheets, Degree/Diploma certificates, Aadhaar card, Community certificate, passport size photo, clear signature on white paper, and UPI/ATM card for fee payment.'
    },
    {
      q: isTa ? 'புகைப்படத்தில் பெயர் மற்றும் தேதி (Name & Date Stamp) கட்டாயமா?' : 'Is a Name & Date stamp required on exam photos?',
      a: isTa
        ? 'ஆம்! TNPSC மற்றும் பல அரசுப் பணிகளுக்கு விண்ணப்ப தேதிக்கு அண்மையில் எடுக்கப்பட்ட புகைப்படத்தின் கீழ் விண்ணப்பதாரரின் பெயர் மற்றும் புகைப்படம் எடுத்த தேதி அச்சிடப்பட்டிருக்க வேண்டும். எங்கள் தளத்தில் உள்ள இலவச போட்டோ மேக்கர் கருவி மூலம் இதை 1 நிமிடத்தில் செய்து கொள்ளலாம்.'
        : 'Yes, examinations like TNPSC strictly require the applicant’s name and photograph capture date stamped at the bottom. You can generate this instantly using our free Passport Photo Tool.'
    },
    {
      q: isTa ? 'விண்ணப்பக் கட்டணத்தை (Exam Fee) மையத்திலேயே செலுத்தலாமா?' : 'Can examination fees be paid at the centre?',
      a: isTa
        ? 'கண்டிப்பாக! நெட் பேங்கிங், டெபிட் கார்டு, கிரெடிட் கார்டு அல்லது கூகுள் பே / ஃபோன்பே (UPI) மூலம் பாதுகாப்பாக அரசு போர்ட்டலில் கட்டணம் செலுத்தி உடனடி ரசீது வழங்கப்படும்.'
        : 'Yes! We securely pay the government fee online through Net Banking, Debit Card, or UPI and print the official transaction confirmation slip immediately.'
    },
    {
      q: isTa ? 'விண்ணப்பித்த படிவத்தின் பிரிண்ட் அவுட் (Application PDF) உடனே கிடைக்குமா?' : 'Will I get an instant printed copy of the submitted application?',
      a: isTa
        ? 'ஆம், விண்ணப்பம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டவுடன் முழுமையான விண்ணப்ப படிவத்தை (Application Form & Fee Receipt) லேசர் கலர் அல்லது கருப்பு-வெள்ளையில் உடனே அச்சிட்டு வழங்குவோம்.'
        : 'Yes, as soon as the application is successfully confirmed, we provide crisp physical printouts of the application form and fee payment receipt.'
    }
  ];

  return (
    <div className="inner-page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px 60px' }}>
      {/* 1. BREADCRUMB */}
      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', color: '#0052cc', cursor: 'pointer', padding: 0 }}>
          {isTa ? 'முகப்பு' : 'Home'}
        </button>
        <span>/</span>
        <button onClick={() => navigate('services')} style={{ background: 'none', border: 'none', color: '#0052cc', cursor: 'pointer', padding: 0 }}>
          {isTa ? 'சேவைகள்' : 'Services'}
        </button>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 600 }}>
          {isTa ? 'ஆன்லைன் விண்ணப்ப உதவி' : 'Online Application Assistance'}
        </span>
      </nav>

      {/* 2. HERO HEADER */}
      <header
        style={{
          background: 'linear-gradient(135deg, #065f46 0%, #059669 60%, #10b981 100%)',
          borderRadius: '24px',
          padding: '40px 28px',
          color: 'white',
          marginBottom: '36px',
          boxShadow: '0 12px 32px rgba(6,95,70,0.18)'
        }}
      >
        <span style={{ background: '#fef08a', color: '#854d0e', fontSize: '11.5px', fontWeight: 900, padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '14px' }}>
          {isTa ? '⚡ TNPSC, SSC, ரயில்வே & கல்லூரி சேர்க்கை விண்ணப்ப உதவி' : '⚡ Complete Government Exam & Admission Support'}
        </span>
        <h1 style={{ fontSize: '30px', fontWeight: 900, margin: '0 0 14px', lineHeight: 1.3 }}>
          {isTa ? 'அரசுத் தேர்வுகள் & கல்லூரி சேர்க்கை ஆன்லைன் விண்ணப்ப மையம்' : 'Government Competitive Exam & College Application Assistance'}
        </h1>
        <p style={{ fontSize: '15.5px', opacity: 0.95, margin: '0 0 24px', maxWidth: '820px', lineHeight: 1.6 }}>
          {isTa
            ? 'அரசுப் பணி தேர்வுகள் மற்றும் கல்லூரி கலந்தாய்வுகளுக்கு கடைசி நேர அவசரமின்றி, சரியான புகைப்பட அளவு மற்றும் ஆவணங்களுடன் பிழையின்றி விண்ணப்பிக்க பழனி AK E-SEVAI மையம் முழு வழிகாட்டலை வழங்குகிறது.'
            : 'End-to-end assistance for TNPSC, SSC, Railway RRB, Police, Teaching, and College Admission portals. Guaranteed compliance with mandatory photo, signature, and certificate upload standards.'}
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('notifications')}
            style={{
              background: '#fef08a',
              color: '#854d0e',
              border: 'none',
              padding: '12px 22px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Calendar size={16} /> {isTa ? 'நேரலை அரசு அறிவிப்புகள்' : 'View Live Exam Deadlines'}
          </button>
          <button
            onClick={() => navigate('photo-tools')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.4)',
              padding: '12px 22px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Camera size={16} /> {isTa ? 'இலவச போட்டோ & சைன் ரீசைசர்' : 'Photo & Sign Resizer'}
          </button>
        </div>
      </header>

      {/* 3. EXAM CATEGORIES GRID */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          {isTa ? 'முக்கிய அரசுத் தேர்வுகள் & ஆன்லைன் விண்ணப்ப வழிகாட்டல்' : 'Major Competitive Exam Portals & Upload Specifications'}
        </h2>
        <p style={{ fontSize: '14.5px', color: '#64748b', marginBottom: '24px' }}>
          {isTa
            ? 'அரசு போர்ட்டல்களில் தவறான புகைப்பட அளவு அல்லது கையொப்பம் காரணமாக விண்ணப்பங்கள் நிராகரிக்கப்படுவதை தவிர்க்க அதிகாரப்பூர்வ அளவீடுகளைப் பின்பற்றுங்கள்.'
            : 'Avoid portal rejections by adhering to the official upload dimensions and file size constraints listed below.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {examCategories.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: '12px', display: 'inline-block', marginBottom: '10px' }}>
                  {item.badge}
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px', lineHeight: 1.4 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.55, margin: '0 0 16px' }}>
                  {item.desc}
                </p>

                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', borderLeft: '4px solid #059669', marginBottom: '16px' }}>
                  <strong style={{ fontSize: '12px', color: '#065f46', display: 'block', marginBottom: '4px' }}>
                    📸 {isTa ? 'அதிகாரப்பூர்வ அப்லோடு அளவுகள்:' : 'Prescribed Upload Standards:'}
                  </strong>
                  <span style={{ fontSize: '12px', color: '#334155', lineHeight: 1.45, display: 'block' }}>
                    {item.photoReq}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => navigate(`tools/${item.toolId}`)}
                  style={{
                    flex: 1,
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Camera size={14} /> {isTa ? 'போட்டோ தயார் செய்' : 'Prepare Photo'}
                </button>
                <button
                  onClick={() => navigate('token-generator')}
                  style={{
                    background: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {isTa ? 'மையத்தில் விண்ணப்பி' : 'Apply at Centre'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. APPLICATION ERROR PREVENTION CHECKLIST */}
      <section style={{ background: '#fffbeb', borderRadius: '20px', padding: '30px 24px', marginBottom: '48px', border: '1px solid #fef3c7' }}>
        <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#92400e', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={22} color="#b45309" />
          {isTa ? 'விண்ணப்ப நிராகரிப்பைத் தவிர்க்க 5 பொன்னான விதிகள்' : '5 Golden Rules to Prevent Exam Application Rejection'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '13.5px', color: '#78350f', lineHeight: 1.55 }}>
          <div>
            <strong>1. {isTa ? 'பெயர் & பிறந்த தேதி ஒற்றுமை:' : 'Matching Name & DOB:'}</strong> {isTa ? '10th மார்க்ஷீட்டில் உள்ளவாறு பெயர், இனிஷியல் மற்றும் பிறந்த தேதி துல்லியமாக இருக்க வேண்டும்.' : 'Ensure name, initials, and DOB match exactly with 10th marksheet.'}
          </div>
          <div>
            <strong>2. {isTa ? 'சமீபத்திய புகைப்படம்:' : 'Recent Photograph:'}</strong> {isTa ? 'தொப்பி, கூலிங் கிளாஸ் அணியாத, வெள்ளை பின்னணியில் எடுக்கப்பட்ட 3 மாதத்திற்குட்பட்ட புகைப்படம்.' : 'Plain white background photo taken within the last 3 months without caps or tinted glasses.'}
          </div>
          <div>
            <strong>3. {isTa ? 'தெளிவான கையொப்பம்:' : 'Clear Signature:'}</strong> {isTa ? 'வெள்ளை தாளில் நீலம் அல்லது கருப்பு மையினால் தெளிவாக கையொப்பமிட்டு ஸ்கேன் செய்யப்பட வேண்டும்.' : 'Sign clearly in dark blue/black ink on unruled white paper.'}
          </div>
          <div>
            <strong>4. {isTa ? 'இடஒதுக்கீடு சான்றிதழ் எண்:' : 'Reservation Certificate Number:'}</strong> {isTa ? 'சாதி மற்றும் வருமானச் சான்றிதழ்களின் வட்டாட்சியர் எண் மற்றும் வழங்கப்பட்ட தேதி சரியாக இருக்க வேண்டும்.' : 'Verify community and revenue certificate numbers, issuing dates, and issuing authority.'}
          </div>
        </div>
      </section>

      {/* 5. FAQS ACCORDION */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
          {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)' : 'Frequently Asked Questions'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                background: 'white',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => toggleFaq(idx)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#0f172a'
                }}
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} color="#059669" /> : <ChevronDown size={18} color="#64748b" />}
              </button>
              {openFaq === idx && (
                <div style={{ padding: '0 20px 16px', fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. PHYSICAL PALANI CENTRE LOCATION CARD */}
      <section
        style={{
          background: 'white',
          border: '1px solid #cbd5e1',
          borderRadius: '20px',
          padding: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
            📍 {isTa ? 'நேரடி சேவை மையம்' : 'Physical Service Centre'}
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '6px 0 8px' }}>
            AK E-SEVAI Palani (பழனி இ-சேவை மையம்)
          </h3>
          <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 6px', maxWidth: '520px' }}>
            Mill Road, Sanmugapuram, Anna Nagar, Palani - 624601 (பழனி பஸ் ஸ்டாண்ட் அருகில்).
          </p>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            ⏰ {isTa ? 'திங்கள் முதல் சனி: காலை 10:00 - இரவு 8:00 வரை' : 'Mon - Sat: 10:00 AM - 8:00 PM'} | 📞 +91 93423 18844
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <a
            href="https://wa.me/919342318844?text=வணக்கம்,%20எனக்கு%20அரசுத்%20தேர்வு%20விண்ணப்பம்%20பற்றிய%20உதவி%20தேவை."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#059669',
              color: 'white',
              padding: '11px 18px',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Phone size={16} /> {isTa ? 'வாட்ஸ்அப் உதவி' : 'WhatsApp Support'}
          </a>
        </div>
      </section>
    </div>
  );
}
