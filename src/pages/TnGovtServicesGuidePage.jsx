import React, { useState } from 'react';
import {
  FileText, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, ArrowRight,
  ShieldCheck, Phone, MapPin, Clock, ExternalLink, Sparkles, BookOpen,
  Landmark, Home, Users, Layers, Stamp
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const pageMeta = {
  id: 'tn-govt-services-guide',
  title: 'Tamil Nadu Government Citizen Services Guide | e-Sevai, Patta Chitta, Ration Card | AK E-SEVAI Palani'
};

export default function TnGovtServicesGuidePage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const servicesGuide = [
    {
      title: isTa ? 'பட்டா / சிட்டா & நில ஆவணங்கள் (Patta Chitta & FMB)' : 'Patta Chitta & Land Records (Anywhere/Anytime)',
      dept: isTa ? 'வருவாய்த்துறை & நில அளவை' : 'Revenue & Land Survey Department',
      desc: isTa
        ? 'நில உரிமைக்கான பட்டா, சிட்டா, நகர நில அளவை ஆவணங்கள் (TSLR), மற்றும் புல வரைபடம் (FMB) ஆகியவற்றை ஆன்லைனில் சரிபார்த்து பதிவிறக்கம் செய்தல் மற்றும் பட்டா பெயர் மாற்ற விண்ணப்ப உதவி.'
        : 'Online verification, instant download, and name transfer application support for Tamil Nadu rural and urban land records (Patta, Chitta, TSLR, and FMB sketches).',
      steps: isTa
        ? ['மாவட்டம், வட்டம், கிராமம் மற்றும் சர்வே எண் / உட்பிரிவு எண் தேர்வு செய்தல்', 'அங்கீகரிக்கப்பட்ட டிஜிட்டல் கையொப்பமிட்ட பட்டா சிட்டா பதிவிறக்கம்', 'கிரயப் பத்திரம் அடிப்படையில் உட்பிரிவு உள்ள/இல்லாத பட்டா பெயர் மாற்றம் சமர்ப்பித்தல்']
        : ['Select District, Taluk, Village, and Survey/Subdivision number', 'Download digitally signed official Patta/Chitta copy', 'Apply for subdivision or non-subdivision Patta transfer based on registered sale deed'],
      portal: 'eservices.tn.gov.in',
      officialUrl: 'https://eservices.tn.gov.in/eservicesnew/land/chitta.html'
    },
    {
      title: isTa ? 'ஸ்மார்ட் குடும்ப அட்டை சேவைகள் (TN PDS Smart Ration Card)' : 'Smart Ration Card Services (TN PDS)',
      dept: isTa ? 'உணவு & நுகர்வோர் பாதுகாப்புத் துறை' : 'Civil Supplies & Consumer Protection',
      desc: isTa
        ? 'புதிய மின்னணு குடும்ப அட்டை விண்ணப்பம், குடும்ப உறுப்பினர் சேர்த்தல் / நீக்கல், முகவரி மாற்றம், குடும்பத் தலைவர் மாற்றம், மற்றும் மொபைல் எண் புதுப்பித்தல்.'
        : 'New Smart Family Card application, member addition/deletion, address modification, family head change, and mobile number linkage.',
      steps: isTa
        ? ['ஆதார் எண் மற்றும் பதிவு செய்யப்பட்ட செல்போன் OTP சரிபார்ப்பு', 'பிறப்புச் சான்றிதழ் அல்லது திருமணச் சான்றிதழ் ஆவணப் பதிவேற்றம்', 'வட்ட வழங்கல் அலுவலர் (TSO) ஒப்புதலுக்குப் பிறகு புதிய அட்டை அச்சிடுதல்']
        : ['Aadhaar number and OTP verification of family members', 'Upload birth certificate (for child addition) or marriage registration / surrender certificate', 'Approval by Taluk Supply Officer (TSO) and PVC card printing'],
      portal: 'tnpds.gov.in',
      officialUrl: 'https://www.tnpds.gov.in'
    },
    {
      title: isTa ? 'வில்லங்கச் சான்றிதழ் (Encumbrance Certificate - EC)' : 'Encumbrance Certificate (EC Online)',
      dept: isTa ? 'பதிவுத் துறை (TN Inspector General of Registration)' : 'Registration Department (TNREGINET)',
      desc: isTa
        ? 'சொத்து வாங்குவதற்கு முன் அதன் முந்தைய பரிவர்த்தனைகள், அடமானங்கள் மற்றும் வில்லங்கங்களை சரிபார்க்க உதவும் 1975 முதல் இன்று வரையிலான அதிகாரப்பூர்வ வில்லங்கச் சான்று.'
        : 'Official Encumbrance Certificate (EC) from 1975 to current date to verify property ownership history, registered sales, and encumbrances before purchase.',
      steps: isTa
        ? ['மண்டலம், மாவட்டம், சார்-பதிவாளர் அலுவலகம் (SRO) தேர்வு', 'கிராமம், சர்வே எண் மற்றும் கால வரம்பு (Period) உள்ளீடு', 'அங்கீகரிக்கப்பட்ட க்யூஆர் குறியீட்டுடன் கூடிய EC நகல் பதிவிறக்கம்']
        : ['Select Registration Zone, District, and Sub-Registrar Office (SRO)', 'Enter Village, Survey Number, and period required', 'Download QR-verified digital Encumbrance Certificate'],
      portal: 'tnreginet.gov.in',
      officialUrl: 'https://tnreginet.gov.in'
    },
    {
      title: isTa ? 'இ-சேவை CAN எண் பதிவு (Citizen Access Number)' : 'e-Sevai CAN Number Registration',
      dept: isTa ? 'தமிழ்நாடு மின்னாளுமை முகமை (TNeGA)' : 'Tamil Nadu e-Governance Agency',
      desc: isTa
        ? 'வருமானம், சாதி, இருப்பிடம் உள்ளிட்ட அனைத்து அரசு வருவாய்த்துறை சான்றிதழ்களுக்கும் விண்ணப்பிக்க குடிமக்களுக்கு கட்டாயமாக தேவைப்படும் 13 இலக்க தனித்துவ அடையாள எண்.'
        : 'Mandatory 13-digit unique Citizen Access Number required to apply for all revenue, social welfare, and education certificates on the Tamil Nadu e-District portal.',
      steps: isTa
        ? ['விண்ணப்பதாரர் ஆதார் எண் மற்றும் தனிநபர் விவரங்கள் பதிவு', 'குடும்ப அட்டை எண், தற்போதைய முகவரி மற்றும் மொபைல் எண் உள்ளீடு', 'ஆதார் OTP உறுதிப்படுத்தலுக்குப் பிறகு உடனடி CAN எண் உருவாக்கம்']
        : ['Enter applicant Aadhaar details and demographic data', 'Link Smart Ration card, current residential address, and mobile number', 'Instant 13-digit CAN generation after Aadhaar OTP verification'],
      portal: 'tnesevai.tn.gov.in',
      officialUrl: 'https://www.tnesevai.tn.gov.in'
    },
    {
      title: isTa ? 'மகளிர் & சமூக நலத்திட்டங்கள் (Social Welfare Schemes)' : 'Women & Social Welfare Schemes Assistance',
      dept: isTa ? 'சமூக நலம் & மகளிர் உரிமைத் துறை' : 'Social Welfare & Women Rights Department',
      desc: isTa
        ? 'கலைஞர் மகளிர் உரிமைத் திட்டம், புதுமைப் பெண், தமிழ்ப் புதல்வன், மூவலூர் ராமாமிர்தம் திருமண உதவி மற்றும் முதியோர் உதவித்தொகை (OAP) விண்ணப்ப வழிகாட்டல்.'
        : 'Application guidance for Pudhumai Penn, Tamil Pudhalvan, Moovalur Ramamirtham Ammaiyar Marriage assistance, and Old Age Pensions (OAP).',
      steps: isTa
        ? ['தகுதி வரம்பு மற்றும் வங்கி கணக்கு பாஸ்புக் சரிபார்ப்பு', 'அரசுப் பள்ளி படிப்புச் சான்றிதழ் (6th to 12th) மற்றும் TC இணைத்தல்', 'நேரடி வங்கி பரிமாற்றத்திற்கான (DBT) ஆதார் இணைப்பு உறுதிப்படுத்துதல்']
        : ['Eligibility screening and active bank account passbook verification', 'Attach government school study proofs (6th to 12th standard)', 'Ensure Aadhaar-seeded bank account for Direct Benefit Transfer (DBT)'],
      portal: 'tnesevai.tn.gov.in',
      officialUrl: 'https://www.tnesevai.tn.gov.in'
    },
    {
      title: isTa ? 'மின் இணைப்பு பெயர் மாற்றம் (TNEB Name Transfer)' : 'TNEB Electricity Name Transfer',
      dept: isTa ? 'தமிழ்நாடு மின் உற்பத்தி & பகிர்மானக் கழகம்' : 'TANGEDCO (TNEB)',
      desc: isTa
        ? 'வீடு, வணிக வளாகம் அல்லது விவசாய நிலங்களின் மின் இணைப்பை புதிய உரிமையாளரின் பெயருக்கு ஆன்லைனில் முறைப்படி பெயர் மாற்றம் செய்யும் உதவி.'
        : 'Online service connection name transfer for residential, commercial, and agricultural properties to the new registered owner.',
      steps: isTa
        ? ['மின் நுகர்வோர் எண் (Consumer Number) விவரம் சரிபார்த்தல்', 'புதிய கிரயப் பத்திரம், தற்போதைய சொத்து வரி ரசீது மற்றும் ஆதார் அட்டை இணைத்தல்', 'TANGEDCO உதவி செயற்பொறியாளர் (AE) ஒப்புதலுக்குப் பிறகு பெயர் மாற்றம் பெறுதல்']
        : ['Verify existing electricity consumer number and tariff', 'Upload registered sale deed copy, latest property tax receipt, and Aadhaar', 'Approval and name update by local TANGEDCO Assistant Engineer'],
      portal: 'tnebnet.org',
      officialUrl: 'https://www.tnebnet.org'
    }
  ];

  const faqs = [
    {
      q: isTa ? 'CAN எண் என்றால் என்ன? அதை எங்கு பெறலாம்?' : 'What is a CAN Number and how do I get one?',
      a: isTa
        ? 'CAN (Citizen Access Number) என்பது தமிழ்நாடு மின்னாளுமை முகமை (TNeGA) வழங்கும் 13 இலக்க குடிமக்கள் அடையாள எண் ஆகும். வருமானம், சாதி, இருப்பிடம் போன்ற எந்த ஒரு அரசு சான்றிதழுக்கும் விண்ணப்பிக்க இந்த எண் கட்டாயம். உங்கள் ஆதார் அட்டை மற்றும் குடும்ப அட்டையுடன் எங்கள் AK E-SEVAI மையத்திற்கு வந்தால் 2 நிமிடத்தில் CAN எண் பதிவு செய்து தரப்படும்.'
        : 'CAN (Citizen Access Number) is a 13-digit citizen identification number issued by TNeGA. It is mandatory for applying for any revenue certificate in Tamil Nadu. Bring your Aadhaar and Ration Card to AK E-SEVAI Palani for instant registration within 2 minutes.'
    },
    {
      q: isTa ? 'பட்டா பெயர் மாற்றத்திற்கு (Patta Transfer) என்னென்ன ஆவணங்கள் தேவை?' : 'What documents are required for online Patta Transfer?',
      a: isTa
        ? 'சார்பதிவாளர் அலுவலகத்தில் பதிவு செய்யப்பட்ட அசல் கிரயப் பத்திரம் (Sale Deed), முந்தைய பட்டா நகல், வில்லங்க சான்றிதழ் (EC), ஆதார் அட்டை, மற்றும் தற்போதைய சொத்து வரி ரசீது தேவைப்படும்.'
        : 'Registered sale deed copy, previous patta document, encumbrance certificate (EC), applicant Aadhaar card, and the latest property tax receipt.'
    },
    {
      q: isTa ? 'ரேஷன் கார்டில் புதிய குழந்தையை சேர்க்க என்ன செய்ய வேண்டும்?' : 'How do I add a newborn child to my Smart Ration Card?',
      a: isTa
        ? 'குழந்தையின் நகராட்சி/பேரூராட்சி பிறப்புச் சான்றிதழ் (Birth Certificate), குழந்தையின் ஆதார் அட்டை (இருந்தால்), மற்றும் பெற்றோரின் குடும்ப அட்டை நகல் ஆகியவற்றை எடுத்துவந்தால் TN PDS போர்ட்டலில் உடனடியாக விண்ணப்பித்து 15 நாட்களில் ஒப்புதல் பெறலாம்.'
        : 'Bring the child’s official Birth Certificate, child’s Aadhaar card (if available), and parent’s Smart Ration Card. We apply directly on the TN PDS portal.'
    },
    {
      q: isTa ? 'அரசு சேவைகளுக்கான அதிகாரப்பூர்வ கட்டணம் எவ்வளவு?' : 'What are the government portal charges?',
      a: isTa
        ? 'பெரும்பாலான தமிழ்நாடு இ-சேவை சான்றிதழ்களுக்கான அரசு நிர்ணயித்த விண்ணப்பக் கட்டணம் ரூ.60 மட்டுமே. எங்கள் மையத்தில் அரசு கட்டணம் மற்றும் எளிய சேவை கட்டணத்துடன் வெளிப்படையான ரசீது வழங்கப்படுகிறது.'
        : 'Standard government fee for revenue certificates is ₹60. All transactions at AK E-SEVAI are issued with official computerised payment receipts.'
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
          {isTa ? 'குடிமக்கள் சேவைகள் வழிகாட்டி' : 'Citizen Services Guide'}
        </span>
      </nav>

      {/* 2. HERO HEADER */}
      <header
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)',
          borderRadius: '24px',
          padding: '40px 28px',
          color: 'white',
          marginBottom: '36px',
          boxShadow: '0 12px 32px rgba(37,99,235,0.18)'
        }}
      >
        <span style={{ background: '#fef08a', color: '#854d0e', fontSize: '11.5px', fontWeight: 900, padding: '6px 14px', borderRadius: '20px', textTransform: 'uppercase', display: 'inline-block', marginBottom: '14px' }}>
          {isTa ? '🏛️ தமிழ்நாடு அரசு குடிமக்கள் சேவைகள் வழிகாட்டி' : '🏛️ Tamil Nadu Citizen Services Guide'}
        </span>
        <h1 style={{ fontSize: '30px', fontWeight: 900, margin: '0 0 14px', lineHeight: 1.3 }}>
          {isTa ? 'இ-சேவை, பட்டா சிட்டா, ரேஷன் அட்டை & அரசு சேவைகள் வழிகாட்டி' : 'Tamil Nadu e-Sevai, Patta Chitta & Citizen Services Guide'}
        </h1>
        <p style={{ fontSize: '15.5px', opacity: 0.95, margin: '0 0 24px', maxWidth: '820px', lineHeight: 1.6 }}>
          {isTa
            ? 'வருவாய்த்துறை, உணவுப்பொருள் வழங்கல், பதிவுத்துறை மற்றும் மின்சார வாரியத்தின் ஆன்லைன் குடிமக்கள் சேவைகளுக்கு எவ்வாறு விண்ணப்பிப்பது, தேவையான ஆவணங்கள் என்ன, மற்றும் அரசு இணையதளங்களை எவ்வாறு பயன்படுத்துவது என்பதற்கான முழுமையான கையேடு.'
            : 'Authoritative citizen guidance for Patta Chitta land records, Smart Ration card updates, Encumbrance Certificates (EC), CAN number registration, and women welfare assistance.'}
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
            <Clock size={16} /> {isTa ? 'டோக்கன் முன்பதிவு செய்க' : 'Book Centre Token'}
          </button>
          <a
            href="https://wa.me/919342318844?text=வணக்கம்,%20எனக்கு%20அரசு%20சேவைகள்%20பற்றிய%20ஆலோசனை%20தேவை."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'rgba(255,255,255,0.18)',
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
            <Phone size={16} /> {isTa ? 'வாட்ஸ்அப் ஆலோசனை (+91 93423 18844)' : 'WhatsApp Consultation'}
          </a>
        </div>
      </header>

      {/* 3. CITIZEN SERVICES GUIDE GRID */}
      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          {isTa ? 'அரசு சேவைகள், ஆவணங்கள் & விண்ணப்பிக்கும் முறைகள்' : 'Citizen Services, Mandatory Documents & Procedure'}
        </h2>
        <p style={{ fontSize: '14.5px', color: '#64748b', marginBottom: '24px' }}>
          {isTa
            ? 'அதிகாரப்பூர்வ தமிழ்நாடு அரசு போர்ட்டல்களின்படி சேவைகளுக்கான தகுதி, ஆவணங்கள் மற்றும் வழிமுறைகள் கீழே தரப்பட்டுள்ளன.'
            : 'Clear step-by-step instructions for obtaining revenue, land, and civil supplies documents.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '22px' }}>
          {servicesGuide.map((item, idx) => (
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
                <span style={{ fontSize: '11px', fontWeight: 800, background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: '12px', display: 'inline-block', marginBottom: '10px' }}>
                  {item.dept}
                </span>
                <h3 style={{ fontSize: '17.5px', fontWeight: 800, color: '#0f172a', margin: '0 0 10px', lineHeight: 1.4 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.55, margin: '0 0 16px' }}>
                  {item.desc}
                </p>

                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', marginBottom: '16px', borderLeft: '4px solid #2563eb' }}>
                  <strong style={{ fontSize: '12px', color: '#1e3a8a', display: 'block', marginBottom: '6px' }}>
                    📝 {isTa ? 'செயல்முறை படிகள்:' : 'Process Steps:'}
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: '#334155', lineHeight: 1.5 }}>
                    {item.steps.map((step, sIdx) => (
                      <li key={sIdx} style={{ marginBottom: '4px' }}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  onClick={() => navigate('token-generator')}
                  style={{
                    flex: 1,
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isTa ? 'மையத்தில் சேவை பெறுக' : 'Apply at Centre'}
                </button>
                <a
                  href={item.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{item.portal}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FAQS ACCORDION */}
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
                {openFaq === idx ? <ChevronUp size={18} color="#2563eb" /> : <ChevronDown size={18} color="#64748b" />}
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

      {/* 5. PHYSICAL PALANI CENTRE LOCATION CARD */}
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
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
            📍 {isTa ? 'நேரடி சேவை மையம்' : 'Physical Digital Centre'}
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
              background: '#2563eb',
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
