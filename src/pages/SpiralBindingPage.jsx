import React, { useState } from 'react';
import {
  BookOpen, Shield, Layers, FileCheck, MessageCircle, Phone, MapPin,
  CheckCircle2, HelpCircle, ChevronDown, ChevronUp, ArrowRight, ShieldCheck,
  Sparkles, FileText, Check
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const pageMeta = { id: 'spiral-binding', title: 'Palani Spiral Binding & Lamination Centre' };

export default function SpiralBindingPage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const services = [
    {
      icon: BookOpen,
      title: isTa ? 'ஸ்பைரல் பைண்டிங் (Spiral Binding)' : 'High-Quality Spiral Binding',
      desc: isTa
        ? 'கல்லூரி ப்ராஜெக்ட், பள்ளி கையேடுகள் மற்றும் அலுவலக அறிக்கைகளுக்கு நீடித்த ஸ்பைரல் கம்பி மற்றும் முன்பக்க டிரான்ஸ்பரண்ட் OHP ஷீட்டுடன் நேர்த்தியான பைண்டிங்.'
        : 'Durable plastic coil spiral binding with transparent OHP front cover and heavy-duty back board for academic projects, manuals, and records.',
      badge: isTa ? 'A4 & A3 அளவுகள்' : 'A4 & Project Sizes'
    },
    {
      icon: Shield,
      title: isTa ? 'ஹாட் பவுச் லேமினேஷன் (Document Lamination)' : 'Thermal Pouch Lamination',
      desc: isTa
        ? 'மார்க்ஷீட், பட்டா, ஆதார் அட்டை மற்றும் முக்கிய சான்றிதழ்களை ஈரம், தூசி மற்றும் கிழிசலிலிருந்து பாதுகாக்க 125/250 மைக்ரான் உயர்தர லேமினேஷன்.'
        : 'Crystal clear 125 & 250-micron thermal hot lamination for 10th/12th marksheets, degree certificates, Aadhaar cards, and land title deeds.',
      badge: isTa ? '125 & 250 மைக்ரான்' : '125 & 250 Micron'
    },
    {
      icon: Layers,
      title: isTa ? 'கல்லூரி ப்ராஜெக்ட் பைண்டிங் (College Projects)' : 'College Dissertation Binding',
      desc: isTa
        ? 'பொறியியல் (Engineering), கலை & அறிவியல் (Arts & Science), பாலிடெக்னிக் மாணவர்களுக்கான ப்ராஜெக்ட் தாள்கள் வரிசைப்படுத்தி உடனடி பைண்டிங் செய்து தரப்படும்.'
        : 'Fast-track final year project book binding with front title transparency for engineering, polytechnic, and arts college submissions.',
      badge: isTa ? 'மாணவர் சிறப்பு விலை' : 'Student Friendly'
    },
    {
      icon: FileCheck,
      title: isTa ? 'அடையாள அட்டை லேமினேஷன் (ID Card Lamination)' : 'ID Card & Pocket Lamination',
      desc: isTa
        ? 'ஸ்மார்ட் கார்டு, வாக்காளர் அட்டை, ஓட்டுநர் உரிமம் மற்றும் பாக்கெட் அளவிலான ஆவணங்களுக்கு உறுதியான வாட்டர்ப்ரூப் லேமினேஷன்.'
        : 'Pocket-sized waterproof edge-sealed lamination for voter IDs, smart ration cards, driver licenses, and membership passes.',
      badge: isTa ? 'வாட்டர்ப்ரூப் பாதுகாப்பு' : 'Waterproof Seal'
    }
  ];

  const faqs = [
    {
      q: isTa ? 'ப்ராஜெக்ட் கொடுத்தால் எவ்வளவு நேரத்தில் ஸ்பைரல் பைண்டிங் செய்து தரப்படும்?' : 'How long does spiral binding take for college projects?',
      a: isTa
        ? 'உங்கள் தாள்களைக் கொண்டு வந்தால், 10 முதல் 15 நிமிடங்களில் உயர்தர ஸ்பைரல் பைண்டிங் முன்பக்க டிரான்ஸ்பரண்ட் ஷீட்டுடன் உடனடியாகச் செய்து தரப்படும்.'
        : 'Standard spiral binding takes just 10 to 15 minutes while you wait. We assemble your pages with front transparency and durable back cover.'
    },
    {
      q: isTa ? 'அசல் சான்றிதழ்களுக்கு லேமினேஷன் செய்வது பாதுகாப்பானதா?' : 'Is thermal pouch lamination safe for original certificates?',
      a: isTa
        ? 'ஆம்! நாங்கள் கட்டுப்படுத்தப்பட்ட மிதமான வெப்பநிலையில் பிரீமியம் லேமினேஷன் பவுச்சுகளைப் பயன்படுத்துகிறோம், இதனால் எழுத்துக்கள் மற்றும் சான்றிதழ்கள் எந்த சேதமும் இல்லாமல் நீண்ட காலம் பாதுகாப்பாக இருக்கும்.'
        : 'Yes, we use calibrated temperature laminators and premium optical pouches to ensure bubble-free, safe protection for long-term document preservation.'
    },
    {
      q: isTa ? 'எங்களிடம் பிரிண்ட் செய்யப்பட்ட தாள்களை மட்டும் கொண்டு வந்து பைண்டிங் செய்யலாமா?' : 'Can I bring my own pre-printed sheets for spiral binding?',
      a: isTa
        ? 'கண்டிப்பாக! நீங்கள் வேறு இடங்களில் பிரிண்ட் செய்த தாள்களையும் கொண்டு வந்து எங்கள் மையத்தில் ஸ்பைரல் பைண்டிங் அல்லது லேமினேஷன் மட்டும் செய்துகொள்ளலாம்.'
        : 'Yes! You can bring your own printed sheets from home or college, and we will perform professional spiral binding or lamination for you.'
    },
    {
      q: isTa ? 'பழனி பஸ் ஸ்டாண்டிலிருந்து உங்கள் கடைக்கு எப்படி வருவது?' : 'How to reach your centre from Palani Bus Stand?',
      a: isTa
        ? 'பழனி பஸ் ஸ்டாண்ட் எதிரில் உள்ள மில் ரோட்டில் (Mill Road, Sanmugapuram, Anna Nagar) எங்கள் AK E-SEVAI மையம் அமைந்துள்ளது.'
        : 'We are located on Mill Road (Sanmugapuram, Anna Nagar), easily reachable within a few minutes from Palani Bus Stand.'
    }
  ];

  return (
    <div className="inner-page-shell" style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 16px 60px' }}>
      {/* 1. BREADCRUMB */}
      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', color: '#0052cc', cursor: 'pointer', padding: 0, fontWeight: 700 }}>
          {isTa ? 'முகப்பு' : 'Home'}
        </button>
        <span>/</span>
        <button onClick={() => navigate('services')} style={{ background: 'none', border: 'none', color: '#0052cc', cursor: 'pointer', padding: 0, fontWeight: 700 }}>
          {isTa ? 'சேவைகள்' : 'Services'}
        </button>
        <span>/</span>
        <span style={{ color: '#0f172a', fontWeight: 800 }}>
          {isTa ? 'ஸ்பைரல் பைண்டிங் & லேமினேஷன்' : 'Spiral Binding & Lamination'}
        </span>
      </nav>

      {/* 2. HERO HEADER BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 60%, #0284c7 100%)',
        borderRadius: '24px',
        padding: '36px 28px',
        color: 'white',
        boxShadow: '0 12px 36px rgba(67,56,202,0.2)',
        marginBottom: '36px'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '30px', fontSize: '12px', fontWeight: 800, marginBottom: '14px', backdropFilter: 'blur(6px)' }}>
          <Sparkles size={15} color="#fbbf24" />
          <span>{isTa ? 'பழனி ஆவணப் பாதுகாப்பு & பைண்டிங் மையம்' : 'Palani Document Binding & Lamination Desk'}</span>
        </div>

        <h1 style={{ font: '800 clamp(24px, 4vw, 36px)/1.25 Manrope, sans-serif', margin: '0 0 14px', color: 'white' }}>
          {isTa
            ? 'பழனி ஸ்பைரல் பைண்டிங், கல்லூரி ப்ராஜெக்ட் & லேமினேஷன் சேவைகள்'
            : 'Spiral Binding, College Project Binding & Lamination in Palani'}
        </h1>

        <p style={{ fontSize: '15px', lineHeight: 1.6, maxWidth: '820px', margin: '0 0 24px', color: '#e0e7ff' }}>
          {isTa
            ? 'பழனி AK E-SEVAI மையத்தில் கல்லூரி ப்ராஜெக்ட் தாள்கள், கையேடுகளுக்கு உறுதியான ஸ்பைரல் பைண்டிங் மற்றும் மார்க்ஷீட், சான்றிதழ்களுக்கு 125/250 மைக்ரான் தெளிவான ஹாட் பவுச் லேமினேஷன் உடனுக்குடன் செய்து தரப்படுகிறது.'
            : 'Protect and present your valuable academic and official records with high-precision plastic coil spiral binding, front OHP transparencies, and waterproof 125/250 micron hot pouch lamination at AK E-SEVAI, Mill Road, Palani.'}
        </p>

        {/* CTA ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="https://wa.me/919342318844?text=வணக்கம்%20AK%20E-SEVAI,%20ஸ்பைரல்%20பைண்டிங்%20/%20லேமினேஷன்%20சேவைக்காக%20தொடர்பு%20கொள்கிறேன்."
            target="_blank"
            rel="noreferrer"
            style={{
              background: '#25D366',
              color: 'white',
              padding: '12px 22px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13.5px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(37,211,102,0.4)'
            }}
          >
            <MessageCircle size={18} /> {isTa ? 'வாட்ஸ்அப்பில் விசாரிக்க' : 'Enquire on WhatsApp'}
          </a>

          <a
            href="tel:9342318844"
            style={{
              background: 'white',
              color: '#1e1b4b',
              padding: '12px 22px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13.5px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(255,255,255,0.2)'
            }}
          >
            <Phone size={18} color="#4338ca" /> {isTa ? 'அழைக்க: 93423 18844' : 'Call: 93423 18844'}
          </a>
        </div>
      </section>

      {/* 3. SERVICES GRID */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="section-kicker">{isTa ? 'பைண்டிங் & லேமினேஷன்' : 'BINDING & LAMINATION RANGE'}</span>
          <h2 style={{ font: '800 24px Manrope, sans-serif', color: '#0f172a', margin: '8px 0 6px' }}>
            {isTa ? 'எங்கள் மையத்தின் ஆவணப் பாதுகாப்பு சேவைகள்' : 'Document Finishing & Protective Services in Palani'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '640px', margin: '0 auto' }}>
            {isTa
              ? 'சான்றிதழ்கள், நில ஆவணங்கள் மற்றும் மாணவ ப்ராஜெக்ட்டுகளுக்கான முழுமையான பினிஷிங் வசதிகள்.'
              : 'End-to-end protective laminations and sleek spiral bindings for school, college, and office records.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px' }}>
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'white',
                  borderRadius: '18px',
                  padding: '24px',
                  border: '1.5px solid #e2e8f0',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca' }}>
                      <Icon size={24} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#4338ca', background: '#eef2ff', padding: '4px 10px', borderRadius: '20px', border: '1px solid #c7d2fe' }}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 style={{ font: '800 18px Manrope, sans-serif', color: '#0f172a', margin: '0 0 8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '13.5px', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WORKFLOW & WHY CHOOSE US */}
      <section style={{
        background: '#f8fafc',
        borderRadius: '20px',
        padding: '30px 24px',
        border: '1px solid #e2e8f0',
        marginBottom: '40px'
      }}>
        <h2 style={{ font: '800 20px Manrope, sans-serif', color: '#0f172a', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={22} color="#16a34a" />
          {isTa ? 'ஏன் AK E-SEVAI லேமினேஷன் & பைண்டிங் தேர்வு செய்ய வேண்டும்?' : 'Why Choose AK E-SEVAI for Lamination & Binding?'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#0f172a', fontSize: '14px', display: 'block' }}>{isTa ? '10–15 நிமிடத்தில் உடனடி சேவை' : '10–15 Min Fast Delivery'}</strong>
              <small style={{ color: '#64748b', fontSize: '12.5px' }}>{isTa ? 'காத்திருக்காமல் உடனடியாக பைண்டிங் பெற்றுக்கொள்ளலாம்' : 'Instant on-the-spot binding while you wait'}</small>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#0f172a', fontSize: '14px', display: 'block' }}>{isTa ? 'பிரீமியம் OHP & பவுச் தரம்' : 'High Clarity Optical Pouches'}</strong>
              <small style={{ color: '#64748b', fontSize: '12.5px' }}>{isTa ? 'குமிழ்கள் இல்லாத நீடித்த லேமினேஷன்' : 'Zero bubble hot sealing with protected edges'}</small>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#0f172a', fontSize: '14px', display: 'block' }}>{isTa ? 'பிரிண்ட் + பைண்டிங் இரண்டும் ஒரே இடத்தில்' : 'All Under One Roof'}</strong>
              <small style={{ color: '#64748b', fontSize: '12.5px' }}>{isTa ? 'பிரிண்டிங் எடுத்து உடனே பைண்டிங் செய்துகொள்ளலாம்' : 'Print your document and bind it immediately'}</small>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RELATED INTERNAL SERVICE LINKS */}
      <section style={{
        background: 'white',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        marginBottom: '40px'
      }}>
        <h3 style={{ font: '800 16px Manrope, sans-serif', color: '#0f172a', margin: '0 0 14px' }}>
          🔗 {isTa ? 'தொடர்புடைய சேவைகள்:' : 'Explore Related Services:'}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={() => navigate('xerox-printing')}
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            🖨️ {isTa ? 'ஜெராக்ஸ் & கலர் பிரிண்டிங்' : 'Xerox & Colour Printing'} <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate('typing-services')}
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            ⌨️ {isTa ? 'தமிழ் & ஆங்கில டைப்பிங்' : 'Tamil & English Typing'} <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate('tools/passport-size-photo')}
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            📷 {isTa ? 'பாஸ்போர்ட் போட்டோ' : 'Passport Photo Studio'} <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ font: '800 22px Manrope, sans-serif', color: '#0f172a', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={22} color="#0052cc" />
          {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)' : 'Frequently Asked Questions (FAQs)'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
              }}
            >
              <button
                onClick={() => toggleFaq(idx)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  font: '700 15px Manrope, sans-serif',
                  color: '#0f172a',
                  gap: '12px'
                }}
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} color="#0052cc" /> : <ChevronDown size={18} color="#64748b" />}
              </button>
              {openFaq === idx && (
                <div style={{ padding: '0 20px 16px', color: '#475569', fontSize: '14px', lineHeight: 1.6, borderTop: '1px solid #f1f5f9' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. CONTACT & LOCATION STRIP */}
      <section style={{
        background: '#f8fafc',
        borderRadius: '20px',
        padding: '24px',
        border: '2px solid #4338ca',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4338ca', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase' }}>
            <MapPin size={16} /> {isTa ? 'மையத்தின் முகவரி & நேரம்' : 'Centre Address & Timings'}
          </div>
          <strong style={{ color: '#0f172a', fontSize: '15px', display: 'block', marginTop: '4px' }}>
            AK E-SEVAI, Mill Rd, Sanmugapuram, Anna Nagar, Palani, Tamil Nadu 624601
          </strong>
          <small style={{ color: '#64748b', fontSize: '13px' }}>
            ⏰ {isTa ? 'திங்கள் – சனி: காலை 10:00 – இரவு 8:00 (ஞாயிறு விடுமுறை)' : 'Monday – Saturday: 10:00 AM – 8:00 PM (Sunday Closed)'}
          </small>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <a
            href="tel:9342318844"
            style={{
              background: '#4338ca',
              color: 'white',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Phone size={15} /> 93423 18844
          </a>
          <button
            onClick={() => navigate('contact')}
            style={{
              background: 'white',
              color: '#4338ca',
              border: '1.5px solid #4338ca',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {isTa ? 'வரைபடம் & வழிகாட்டுதல்' : 'Map & Directions'}
          </button>
        </div>
      </section>
    </div>
  );
}
