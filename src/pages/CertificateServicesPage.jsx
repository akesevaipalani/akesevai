import React, { useState } from 'react';
import {
  FileText, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, ArrowRight,
  ShieldCheck, Phone, MapPin, Clock, Calendar, AlertCircle, FileCheck,
  Building2, Award, UserCheck, HeartHandshake, Stamp, Sparkles
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const pageMeta = {
  id: 'certificate-services',
  title: 'Tamil Nadu e-Sevai Certificate Application Assistance | AK E-SEVAI Palani'
};

export default function CertificateServicesPage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const certificateList = [
    {
      title: isTa ? 'வருமானச் சான்றிதழ் (Income Certificate)' : 'Income Certificate Assistance',
      code: 'REV-101',
      desc: isTa
        ? 'பள்ளி/கல்லூரி கல்வி உதவித்தொகை (Scholarships), அரசு நலத்திட்டங்கள், மற்றும் கல்விக் கட்டணச் சலுகை பெறுவதற்கு தேவையான அதிகாரப்பூர்வ வட்டாட்சியர் வருமானச் சான்றிதழ் விண்ணப்ப உதவி.'
        : 'Official Tahsildar Income Certificate application support for school/college scholarships, tuition fee concessions, and government welfare schemes.',
      docs: isTa
        ? ['ஆதார் அட்டை (Aadhaar Card)', 'ஸ்மார்ட் ரேஷன் கார்டு (Ration Card)', 'சம்பளச் சான்று அல்லது சுய தொழில் வருமான உறுதிமொழி', 'பாஸ்போர்ட் சைஸ் புகைப்படம்', 'குடும்ப அட்டைதாரர் விவரங்கள்']
        : ['Aadhaar Card', 'Smart Ration Card', 'Salary Slip or Income Declaration', 'Passport Size Photo', 'Bank Passbook'],
      time: isTa ? '3 முதல் 7 வேலை நாட்கள்' : '3 to 7 Working Days'
    },
    {
      title: isTa ? 'சாதிச் சான்றிதழ் (Community Certificate)' : 'Community Certificate Assistance',
      code: 'REV-102',
      desc: isTa
        ? 'BC, MBC, SC, ST, DNC மற்றும் பிற பிரிவினருக்கான நிரந்தர சாதிச் சான்றிதழ். பள்ளி/கல்லூரி சேர்க்கை மற்றும் அரசுப் பணி இடஒதுக்கீட்டிற்கு மிக அவசியமானது.'
        : 'Permanent Community Certificate for BC, MBC, SC, ST, and DNC categories, essential for educational reservations and government job recruitment.',
      docs: isTa
        ? ['விண்ணப்பதாரர் ஆதார் அட்டை', 'பெற்றோரின் சாதிச் சான்றிதழ் (தந்தை/தாய்)', 'பள்ளி மாற்றுச் சான்றிதழ் (TC) அல்லது மார்க்ஷீட்', 'ஸ்மார்ட் ரேஷன் கார்டு', 'புகைப்படம்']
        : ['Applicant Aadhaar Card', "Father/Mother's Community Certificate", 'School TC or Marksheet', 'Smart Ration Card', 'Passport Photo'],
      time: isTa ? '5 முதல் 10 வேலை நாட்கள்' : '5 to 10 Working Days'
    },
    {
      title: isTa ? 'இருப்பிடச் சான்றிதழ் (Nativity & Residence Certificate)' : 'Nativity & Residence Certificate',
      code: 'REV-103',
      desc: isTa
        ? 'தமிழ்நாட்டில் வசித்து வருவதை உறுதி செய்யும் வட்டாட்சியர் இருப்பிடச் சான்றிதழ். மத்திய/மாநில அரசு வேலைகள் மற்றும் நீட் (NEET), TNEA சேர்க்கைக்கு தேவை.'
        : 'Official Tahsildar Nativity / Residence Certificate required for Tamil Nadu quota in medical (NEET), engineering (TNEA), and government recruitments.',
      docs: isTa
        ? ['ஆதார் அட்டை', 'ரேஷன் கார்டு', '5 ஆண்டு அல்லது 10 ஆண்டு இருப்பிட ஆதார ஆவணங்கள் (EB பில், கேஸ் பில், வாக்காளர் அட்டை)', 'பள்ளிப் படிப்பு சான்றிதழ்', 'புகைப்படம்']
        : ['Aadhaar Card', 'Ration Card', '5/10 Year Residence Proof (EB Bill, Voter ID)', 'School Study Certificate', 'Passport Photo'],
      time: isTa ? '5 முதல் 7 வேலை நாட்கள்' : '5 to 7 Working Days'
    },
    {
      title: isTa ? 'முதல் பட்டதாரி சான்றிதழ் (First Graduate Certificate)' : 'First Graduate Certificate',
      code: 'REV-104',
      desc: isTa
        ? 'குடும்பத்தில் முதல் தலைமுறை பட்டதாரிக்கு தமிழ்நாடு அரசால் வழங்கப்படும் கல்லூரி கல்விக் கட்டண முழு விலக்கு (Tuition Fee Concession) பெறுவதற்கான சான்றிதழ்.'
        : 'Tuition fee concession certificate for candidates who are the first person in their family to pursue graduation in Tamil Nadu colleges.',
      docs: isTa
        ? ['விண்ணப்பதாரர் மார்க்ஷீட் & TC', 'பெற்றோர் & உடன் பிறந்தோரின் கல்வித் தகுதி உறுதிமொழி', 'குடும்ப உறுப்பினர்களின் மாற்றுச் சான்றிதழ்கள்', 'ஸ்மார்ட் ரேஷன் கார்டு', 'வருமானச் சான்றிதழ்']
        : ['Applicant Marksheet & TC', 'No-Graduate Self Declaration by Parents', 'Siblings Transfer Certificates', 'Smart Ration Card', 'Income Certificate'],
      time: isTa ? '7 முதல் 12 வேலை நாட்கள்' : '7 to 12 Working Days'
    },
    {
      title: isTa ? 'வாரிசுச் சான்றிதழ் (Legal Heir Certificate)' : 'Legal Heir Certificate Assistance',
      code: 'REV-105',
      desc: isTa
        ? 'மறைந்த நபரின் சட்டப்பூர்வ வாரிசுகளை உறுதி செய்யும் வட்டாட்சியர் சான்றிதழ். சொத்து பரிமாற்றம், வங்கி டெபாசிட் கிளைம் மற்றும் கருணை அடிப்படையிலான பணிக்கு தேவை.'
        : 'Official Tahsildar Legal Heirship Certificate for property succession, bank claims, provident fund settlements, and compassionate employment.',
      docs: isTa
        ? ['மறைந்த நபரின் இறப்புச் சான்றிதழ் (Death Certificate)', 'அனைத்து வாரிசுகளின் ஆதார் அட்டைகள்', 'திருமணச் சான்றிதழ் / ரேஷன் கார்டு', 'பள்ளி மாற்றுச் சான்றிதழ் (வயது ஆதாரம்)', 'குடும்ப மரபு வழி அறிக்கை']
        : ['Original Death Certificate of Deceased', 'Aadhaar of All Legal Heirs', 'Marriage Certificate / Ration Card', 'School TC for Age Proof', 'Family Tree Declaration'],
      time: isTa ? '10 முதல் 15 வேலை நாட்கள்' : '10 to 15 Working Days'
    },
    {
      title: isTa ? 'இருப்பிடம் & சாதி திருத்தங்கள் / பிற சான்றிதழ்கள்' : 'Other Revenue & Welfare Certificates',
      code: 'REV-106',
      desc: isTa
        ? 'ஆதரவற்ற விதவை சான்றிதழ் (Destitute Widow), கலப்புத் திருமண சான்றிதழ் (Inter-caste Marriage), விவசாயி சான்றிதழ், சிறு/குறு விவசாயி சான்றிதழ் (Small Farmer).'
        : 'Destitute Widow Certificate, Inter-caste Marriage Certificate, Agriculturalist Certificate, and Small/Marginal Farmer Certificates.',
      docs: isTa
        ? ['ஆதார் அட்டை & குடும்ப அட்டை', 'பொருத்தமான ஆதாரச் சான்றிதழ்கள்', 'கிராம நிர்வாக அலுவலர் (VAO) பரிந்துரை அறிக்கை', 'புகைப்படம்']
        : ['Aadhaar & Smart Ration Card', 'Relevant Evidence Documents', 'VAO Verification Report', 'Passport Photo'],
      time: isTa ? '7 முதல் 14 வேலை நாட்கள்' : '7 to 14 Working Days'
    }
  ];

  const faqs = [
    {
      q: isTa ? 'இ-சேவை சான்றிதழ்களுக்கு என்னென்ன ஆவணங்கள் கொண்டு வர வேண்டும்?' : 'What documents are commonly required for e-Sevai certificates?',
      a: isTa
        ? 'பொதுவாக விண்ணப்பதாரரின் ஆதார் அட்டை, குடும்ப அட்டை (Smart Ration Card), பாஸ்போர்ட் சைஸ் புகைப்படம், மற்றும் சம்பந்தப்பட்ட சான்றிதழுக்கான குறிப்பிட்ட ஆதாரங்கள் (எ.கா: TC, இறப்புச் சான்றிதழ், வருமான ஆதாரம்) தேவைப்படும். அசல் ஆவணங்களை எடுத்துவந்தால் இங்கேயே ஸ்கேன் செய்து தரப்படும்.'
        : 'Common documents include the applicant’s Aadhaar card, Smart Ration card, passport size photograph, and specific supporting documents (such as School TC, Death Certificate, or Salary Slip depending on the certificate type).'
    },
    {
      q: isTa ? 'சான்றிதழ் விண்ணப்பித்த பிறகு அதன் நிலையை (Status) எவ்வாறு தெரிந்து கொள்வது?' : 'How can I track my certificate application status?',
      a: isTa
        ? 'விண்ணப்பித்தவுடன் உங்கள் செல்போனுக்கு வரும் TN-XXX எண்ணை எங்கள் தளத்தின் "Status Track" பக்கத்தில் (www.akesevai.com/status-track) உள்ளிட்டோ அல்லது எங்கள் வாட்ஸ்அப் (93423 18844) மூலமாகவோ உடனுக்குடன் அறிந்துகொள்ளலாம்.'
        : 'You can check your live application status anytime using your TN application number on our status tracker page (www.akesevai.com/status-track) or via WhatsApp.'
    },
    {
      q: isTa ? 'சான்றிதழ் ஒப்புதல் பெற எவ்வளவு காலம் ஆகும்?' : 'How long does government processing usually take?',
      a: isTa
        ? 'வருமானம் மற்றும் இருப்பிடச் சான்றிதழ்கள் பொதுவாக 3 முதல் 7 வேலை நாட்களுக்குள்ளும், சாதி மற்றும் வாரிசுச் சான்றிதழ்கள் கிராம நிர்வாக அலுவலர் (VAO), வருவாய் ஆய்வாளர் (RI), மற்றும் வட்டாட்சியர் (Tahsildar) நேரடி விசாரணைக்குப் பிறகு 7 முதல் 15 வேலை நாட்களுக்குள்ளும் ஒப்புதல் அளிக்கப்படும்.'
        : 'Income and Nativity certificates typically take 3 to 7 working days, while Community and Legal Heir certificates take 7 to 15 working days following field verification by VAO, RI, and Tahsildar.'
    },
    {
      q: isTa ? 'டிஜிட்டல் கையொப்பமிட்ட சான்றிதழை பிரிண்ட் அவுட் எடுத்துக் கொள்ளலாமா?' : 'Can I get my digitally signed certificate printed in color?',
      a: isTa
        ? 'ஆம்! வட்டாட்சியரின் QR Code மற்றும் டிஜிட்டல் கையொப்பத்துடன் ஒப்புதல் அளிக்கப்பட்ட சான்றிதழை எங்கள் மையத்தில் உயர்தர கலர் பிரிண்ட் எடுத்து, லேமினேஷன் செய்து உடனே பெற்றுக்கொள்ளலாம்.'
        : 'Yes! Once approved with the official digital signature and QR verification code, we provide crisp laser color prints and lamination at our Palani centre.'
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
          {isTa ? 'அரசு சான்றிதழ் சேவைகள்' : 'Certificate Assistance'}
        </span>
      </nav>

      {/* 2. HERO HEADER */}
      <header
        style={{
          background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 60%, #1e40af 100%)',
          borderRadius: '24px',
          padding: '40px 28px',
          color: 'white',
          marginBottom: '36px',
          boxShadow: '0 12px 32px rgba(2,44,122,0.18)'
        }}
      >
        <span style={{ background: '#22c55e', color: '#064e3b', fontSize: '11.5px', fontWeight: 900, padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '14px' }}>
          {isTa ? '🏛️ தமிழ்நாடு அரசு இ-சேவை அதிகாரப்பூர்வ விண்ணப்ப உதவி' : '🏛️ Official Tamil Nadu e-Sevai Certificate Assistance'}
        </span>
        <h1 style={{ fontSize: '30px', fontWeight: 900, margin: '0 0 14px', lineHeight: 1.3 }}>
          {isTa ? 'தமிழ்நாடு அரசு சான்றிதழ்கள் விண்ணப்ப உதவி மையம்' : 'Tamil Nadu Government Certificate Application Services'}
        </h1>
        <p style={{ fontSize: '15.5px', opacity: 0.95, margin: '0 0 24px', maxWidth: '820px', lineHeight: 1.6 }}>
          {isTa
            ? 'வருமானச் சான்றிதழ், சாதிச் சான்றிதழ், இருப்பிடச் சான்றிதழ், முதல் பட்டதாரி, மற்றும் வாரிசுச் சான்றிதழ்களுக்கு பிழையின்றி சரியான ஆவணங்களுடன் விண்ணப்பிக்க AK E-SEVAI மையம் உதவுகிறது. பழனியில் நேரிலும், தமிழ்நாடு முழுவதும் வாட்ஸ்அப் மூலமும் ஆலோசனை பெறலாம்.'
            : 'Reliable application guidance for Tamil Nadu Revenue certificates: Income, Community, Nativity, First Graduate, and Legal Heirship. Accurate document verification and status tracking support.'}
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('token-generator')}
            style={{
              background: '#22c55e',
              color: '#064e3b',
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
            <Clock size={16} /> {isTa ? 'டோக்கன் முன்பதிவு செய்க' : 'Book Online Token'}
          </button>
          <a
            href="https://wa.me/919342318844?text=வணக்கம்,%20எனக்கு%20அரசு%20சான்றிதழ்%20விண்ணப்பம்%20பற்றிய%20விவரங்கள்%20தேவை."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '12px 22px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Phone size={16} /> {isTa ? 'வாட்ஸ்அப் உதவி (+91 93423 18844)' : 'WhatsApp Help (+91 93423 18844)'}
          </a>
        </div>
      </header>

      {/* 3. CERTIFICATE LIST GRID */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          {isTa ? 'வழங்கப்படும் முக்கிய சான்றிதழ் சேவைகள் & தேவையான ஆவணங்கள்' : 'Major Certificates & Mandatory Documents Checklist'}
        </h2>
        <p style={{ fontSize: '14.5px', color: '#64748b', marginBottom: '24px' }}>
          {isTa
            ? 'ஒவ்வொரு சான்றிதழுக்கும் தேவையான ஆவணங்களை முன்கூட்டியே தயார் செய்து கொண்டு வருவதன் மூலம் விண்ணப்ப நிராகரிப்பை முற்றிலும் தவிர்க்கலாம்.'
            : 'Review the mandatory document checklist for each certificate to ensure flawless submission without rejection.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {certificateList.map((item, idx) => (
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, background: '#eff6ff', color: '#0052cc', padding: '4px 10px', borderRadius: '12px' }}>
                    {item.code}
                  </span>
                  <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> {item.time}
                  </span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px', lineHeight: 1.4 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.55, margin: '0 0 16px' }}>
                  {item.desc}
                </p>

                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                  <strong style={{ fontSize: '12px', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    📋 {isTa ? 'தேவையான ஆவணங்கள்:' : 'Required Documents:'}
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#475569', lineHeight: 1.5 }}>
                    {item.docs.map((doc, dIdx) => (
                      <li key={dIdx} style={{ marginBottom: '3px' }}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  onClick={() => navigate('token-generator')}
                  style={{
                    flex: 1,
                    background: '#0052cc',
                    color: 'white',
                    border: 'none',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isTa ? 'விண்ணப்பிக்க வருக' : 'Apply at Centre'}
                </button>
                <button
                  onClick={() => navigate('status-track')}
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
                  {isTa ? 'நிலை அறிக' : 'Track Status'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. STEP-BY-STEP PROCESS */}
      <section style={{ background: '#f8fafc', borderRadius: '20px', padding: '32px 24px', marginBottom: '48px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', textAlign: 'center', margin: '0 0 24px' }}>
          {isTa ? 'இ-சேவை சான்றிதழ் விண்ணப்பிக்கும் 4 எளிய படிகள்' : '4 Simple Steps to Get Your e-Sevai Certificate'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
          <div style={{ background: 'white', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0052cc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '12px' }}>1</span>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{isTa ? 'ஆவணங்கள் சரிபார்ப்பு' : 'Document Verification'}</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{isTa ? 'அசல் ஆவணங்களை எடுத்து வந்து எங்கள் மையத்தில் நேரடியாக பிழையின்றி சரிபார்க்கவும்.' : 'Bring original proofs for scanning and verification at our centre.'}</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0052cc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '12px' }}>2</span>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{isTa ? 'CAN & ஆன்லைன் பதிவு' : 'CAN & Portal Filing'}</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{isTa ? 'டிஜிட்டல் போர்ட்டலில் CAN எண் மற்றும் விண்ணப்ப படிவத்தை உடனடியாக சமர்ப்பித்தல்.' : 'Instant CAN registration and online application submission on TNeGA portal.'}</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0052cc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '12px' }}>3</span>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{isTa ? 'அரசு அதிகாரிகள் கள ஆய்வு' : 'Field Inspection'}</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{isTa ? 'VAO & RI அவர்களின் பரிந்துரை அறிக்கை வட்டாட்சியருக்கு அனுப்பி வைக்கப்படும்.' : 'Direct inspection and reporting by Village Administrative Officer (VAO) & RI.'}</p>
          </div>
          <div style={{ background: 'white', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#22c55e', color: '#064e3b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', marginBottom: '12px' }}>4</span>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px', color: '#0f172a' }}>{isTa ? 'டிஜிட்டல் சான்றிதழ் பிரிண்ட்' : 'Digital Certificate Print'}</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{isTa ? 'ஒப்புதல் பெற்ற சான்றிதழை QR குறியீட்டுடன் உடனே கலர் பிரிண்ட் & லேமினேஷன் செய்து பெறுங்கள்.' : 'Download and print your QR-verified digitally signed certificate.'}</p>
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
                {openFaq === idx ? <ChevronUp size={18} color="#0052cc" /> : <ChevronDown size={18} color="#64748b" />}
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
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#0052cc', textTransform: 'uppercase' }}>
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
            href={siteConfig.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#0052cc',
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
            <MapPin size={16} /> {isTa ? 'வரைபடம் காண்க' : 'Google Maps'}
          </a>
        </div>
      </section>
    </div>
  );
}
