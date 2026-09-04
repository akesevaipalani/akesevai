import React, { useState } from 'react';
import {
  Printer, Copy, FileText, Image, MessageCircle, Phone, MapPin,
  Clock, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, ArrowRight,
  ShieldCheck, Sparkles, Layers, FileCheck, Share2, Download
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const pageMeta = { id: 'xerox-printing', title: 'Palani Xerox & Colour Printing Centre' };

export default function XeroxPrintingPage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const services = [
    {
      icon: Copy,
      title: isTa ? 'கருப்பு-வெள்ளை ஜெராக்ஸ் (B/W Xerox)' : 'High-Speed B/W Xerox',
      desc: isTa
        ? 'A4 மற்றும் Legal அளவுகளில் தெளிவான சிங்கிள் / டபுள் சைட் ஜெராக்ஸ். கல்லூரி நோட்ஸ், அலுவலக ஆவணங்கள் மற்றும் பள்ளி அசைன்மென்ட்டுகளுக்கு மொத்த ஜெராக்ஸ் வசதி.'
        : 'Crystal clear single & double-sided A4 and Legal photocopying with high-speed digital copiers for study materials, certificates, and legal files.',
      badge: isTa ? 'A4 & Legal அளவு' : 'A4 & Legal Sizes'
    },
    {
      icon: Printer,
      title: isTa ? 'உயர்தர கலர் பிரிண்டிங் (Colour Printout)' : 'High-Resolution Colour Printing',
      desc: isTa
        ? 'ப்ராஜெக்ட் ரிப்போர்ட், புகைப்பட ஆவணங்கள், விண்ணப்ப படிவங்கள் மற்றும் அட்டவணைகளுக்கு மிகத் துல்லியமான லேசர் கலர் பிரிண்டிங்.'
        : 'Vibrant laser & inkjet colour printing for college project reports, certificates, photo documents, charts, and presentation slides.',
      badge: isTa ? 'லேசர் & இங்க்ஜெட்' : 'Laser & Inkjet'
    },
    {
      icon: FileCheck,
      title: isTa ? 'ஆவண ஸ்கேனிங் (Document Scanning)' : 'HD Document Scanning',
      desc: isTa
        ? 'அரசுத் தேர்வுகள் மற்றும் ஆன்லைன் விண்ணப்பங்களுக்காக மார்க்ஷீட், பட்டா, ஆதார் ஆவணங்களை உயர்தர PDF / JPG வடிவத்தில் ஸ்கேன் செய்து வாட்ஸ்அப் அல்லது இமெயிலுக்கு உடனே அனுப்பும் வசதி.'
        : 'High-DPI optical scanning of marksheets, land records, certificates, and ID cards exported as searchable PDFs or JPGs with instant WhatsApp/email delivery.',
      badge: isTa ? 'PDF & JPG டெலிவரி' : 'PDF & JPG Delivery'
    },
    {
      icon: Layers,
      title: isTa ? 'மொத்த பிரதிகள் (Bulk Copying)' : 'Bulk Project & Office Printing',
      desc: isTa
        ? 'பள்ளிகள், கல்லூரிகள், நிறுவனங்கள் மற்றும் தொழில் முனைவோருக்கான மொத்த நகல்கள் மற்றும் கையேடுகள் அச்சிடும் சேவை.'
        : 'Cost-effective bulk document replication, question paper batches, office training manuals, and conference handbooks.',
      badge: isTa ? 'குறைந்த கட்டணம்' : 'Volume Economy'
    },
    {
      icon: MessageCircle,
      title: isTa ? 'வாட்ஸ்அப் பிரிண்ட் வசதி (WhatsApp Document Print)' : 'WhatsApp Direct Print Service',
      desc: isTa
        ? 'வீட்டிலிருந்தே உங்கள் PDF அல்லது படங்களை வாட்ஸ்அப்பில் அனுப்பி நேரில் வரும்போது உடனடியாக பிரிண்ட் அவுட் பெற்றுக்கொள்ளலாம்.'
        : 'Send your PDF or document via WhatsApp in advance (+91 93423 18844) and pick up your finished printouts without waiting in line.',
      badge: isTa ? 'நேரம் மிச்சம்' : 'Zero Wait Time'
    },
    {
      icon: Image,
      title: isTa ? 'போட்டோ & பாஸ்போர்ட் பிரிண்டிங்' : 'Photo & Certificate Printing',
      desc: isTa
        ? 'க்ளாஸி போட்டோ பேப்பரில் உடனடி பாஸ்போர்ட் சைஸ் போட்டோ மற்றும் சான்றிதழ் பிரிண்டிங்.'
        : 'Instant passport photo printing on glossy photo paper and framed document certificate reprints.',
      badge: isTa ? 'ஸ்டுடியோ தரம்' : 'Glossy Finish'
    }
  ];

  const faqs = [
    {
      q: isTa ? 'வாட்ஸ்அப்பில் ஆவணங்களை அனுப்பி பிரிண்ட் அவுட் பெற முடியுமா?' : 'Can I send documents via WhatsApp for printing in Palani?',
      a: isTa
        ? 'ஆம்! உங்கள் PDF அல்லது ஆவணங்களை +91 93423 18844 என்ற எண்ணிற்கு வாட்ஸ்அப்பில் அனுப்பிவிட்டு, கடைக்கு வரும்போது உடனே பிரிண்ட் அவுட்களை பெற்றுக்கொள்ளலாம்.'
        : 'Yes! Send your PDF files or images to our WhatsApp number +91 93423 18844 with your printing instructions. Your prints will be ready for pickup when you arrive.'
    },
    {
      q: isTa ? 'என்னென்ன காகித அளவுகள் மற்றும் தரங்கள் கிடைக்கின்றன?' : 'What paper sizes and qualities are available?',
      a: isTa
        ? 'நாங்கள் 75 GSM மற்றும் 80 GSM பிரீமியம் வெள்ளைத் தாள்கள், A4 மற்றும் Legal அளவுகள், மற்றும் 180–220 GSM க்ளாஸி போட்டோ தாள்களைப் பயன்படுத்துகிறோம்.'
        : 'We stock 75 GSM & 80 GSM premium executive paper in A4 and Legal sizes, along with 180–220 GSM high-gloss photo media for professional presentation.'
    },
    {
      q: isTa ? 'ஸ்கேன் செய்த ஆவணங்களை இமெயில் அல்லது பென்டிரைவில் பெறலாமா?' : 'Can I get scanned files saved to USB or sent to my email?',
      a: isTa
        ? 'கண்டிப்பாக. ஸ்கேன் செய்யப்பட்ட கோப்புகளை உங்கள் வாட்ஸ்அப், இமெயில் அல்லது USB பென்டிரைவில் உடனடி உயர்தர PDF / JPG கோப்பாகப் பெற்றுக்கொள்ளலாம்.'
        : 'Yes, scanned high-resolution files can be immediately transferred to your WhatsApp, emailed to your address, or copied to your USB flash drive.'
    },
    {
      q: isTa ? 'ஜெராக்ஸ் மற்றும் பிரிண்டிங் எடுத்த ஆவணங்களுக்கு ஸ்பைரல் பைண்டிங் செய்யப்படுமா?' : 'Do you offer spiral binding and lamination for printed documents?',
      a: isTa
        ? 'ஆம்! பிரிண்ட் செய்யப்பட்ட ப்ராஜெக்ட் தாள்களுக்கு ஸ்பைரல் பைண்டிங் மற்றும் மார்க்ஷீட், சான்றிதழ்களுக்கு தரமான ஹாட் லேமினேஷன் அதே இடத்தில் செய்து தரப்படும்.'
        : 'Yes! We provide immediate spiral binding with clear protective sheets for projects and durable hot pouch lamination for all certificates.'
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
          {isTa ? 'ஜெராக்ஸ் & கலர் பிரிண்டிங்' : 'Xerox & Printing'}
        </span>
      </nav>

      {/* 2. HERO HEADER BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 60%, #16a34a 100%)',
        borderRadius: '24px',
        padding: '36px 28px',
        color: 'white',
        boxShadow: '0 12px 36px rgba(0,82,204,0.18)',
        marginBottom: '36px'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '30px', fontSize: '12px', fontWeight: 800, marginBottom: '14px', backdropFilter: 'blur(6px)' }}>
          <Sparkles size={15} color="#fbbf24" />
          <span>{isTa ? 'பழனி டிஜிட்டல் ஜெராக்ஸ் & பிரிண்டிங் மையம்' : 'Palani Digital Xerox & Printing Centre'}</span>
        </div>

        <h1 style={{ font: '800 clamp(24px, 4vw, 36px)/1.25 Manrope, sans-serif', margin: '0 0 14px', color: 'white' }}>
          {isTa
            ? 'பழனி அதிவேக ஜெராக்ஸ், கலர் பிரிண்டிங் & ஸ்கேனிங் சேவைகள்'
            : 'Xerox, Colour Printing & Document Scanning in Palani'}
        </h1>

        <p style={{ fontSize: '15px', lineHeight: 1.6, maxWidth: '820px', margin: '0 0 24px', color: '#e0f2fe' }}>
          {isTa
            ? 'பழனி பஸ் ஸ்டாண்ட் அருகில் (மில் ரோடு) அமைந்துள்ள AK E-SEVAI மையத்தில் தெளிவான கருப்பு-வெள்ளை ஜெராக்ஸ், லேசர் கலர் பிரிண்ட் அவுட், HD ஆவண ஸ்கேனிங் மற்றும் மொத்த நகல் சேவைகளை மிகக் குறைந்த கட்டணத்தில் விரைவாகப் பெறுங்கள்.'
            : 'Get high-speed digital Black & White Xerox, vivid Laser Colour Printouts, HD Document Scanning, and bulk college project copying at AK E-SEVAI, Mill Road, Palani (near Palani Bus Stand). Fast service with direct WhatsApp printing support.'}
        </p>

        {/* CTA ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="https://wa.me/919342318844?text=வணக்கம்%20AK%20E-SEVAI,%20பிரிண்ட்%20அவுட்%20/%20ஜெராக்ஸ்%20சேவைக்காக%20தொடர்பு%20கொள்கிறேன்."
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
            <MessageCircle size={18} /> {isTa ? 'வாட்ஸ்அப்பில் அனுப்ப (WhatsApp Print)' : 'Send to WhatsApp Print'}
          </a>

          <a
            href="tel:9342318844"
            style={{
              background: 'white',
              color: '#022c7a',
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
            <Phone size={18} color="#022c7a" /> {isTa ? 'அழைக்க: 93423 18844' : 'Call: 93423 18844'}
          </a>
        </div>
      </section>

      {/* 3. SERVICES GRID */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="section-kicker">{isTa ? 'எங்கள் அச்சிடும் சேவைகள்' : 'PRINT & COPY CAPABILITIES'}</span>
          <h2 style={{ font: '800 24px Manrope, sans-serif', color: '#0f172a', margin: '8px 0 6px' }}>
            {isTa ? 'AK E-SEVAI மையத்தின் சிறப்பு அச்சிடும் வசதிகள்' : 'Complete Printing & Reprographic Services in Palani'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '640px', margin: '0 auto' }}>
            {isTa
              ? 'பள்ளி, கல்லூரி மாணவர்கள், வழக்கறிஞர்கள் மற்றும் பொதுமக்களுக்கு தேவையான அனைத்து நகல் சேவைகளும் ஒரே இடத்தில்.'
              : 'Serving students, advocates, businesses, and citizens across Palani with professional printing equipment.'}
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
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052cc' }}>
                      <Icon size={24} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', background: '#f0fdf4', padding: '4px 10px', borderRadius: '20px', border: '1px solid #bbf7d0' }}>
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
          {isTa ? 'ஏன் பழனியில் AK E-SEVAI அச்சிடும் சேவையை தேர்வு செய்ய வேண்டும்?' : 'Why Choose AK E-SEVAI for Xerox & Printing in Palani?'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#0f172a', fontSize: '14px', display: 'block' }}>{isTa ? 'துல்லியமான அச்சுத் தெளிவு' : 'Crisp Text & Line Clarity'}</strong>
              <small style={{ color: '#64748b', fontSize: '12.5px' }}>{isTa ? 'மங்காத, உயர்தர லேசர் அச்சுத் தரம்' : 'High optical contrast without faded lines'}</small>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#0f172a', fontSize: '14px', display: 'block' }}>{isTa ? 'பஸ் ஸ்டாண்ட் அருகில்' : 'Near Palani Bus Stand'}</strong>
              <small style={{ color: '#64748b', fontSize: '12.5px' }}>{isTa ? 'மில் ரோட்டில் எளிதாக அணுகக்கூடிய இடம்' : 'Convenient walk from Bus Stand & Mill Road'}</small>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#0f172a', fontSize: '14px', display: 'block' }}>{isTa ? 'அனைத்து சேவைகளும் ஒரே இடத்தில்' : 'Complete All-in-One Centre'}</strong>
              <small style={{ color: '#64748b', fontSize: '12.5px' }}>{isTa ? 'பிரிண்டிங் + ஸ்பைரல் பைண்டிங் + லேமினேஷன்' : 'Printing, typing, spiral binding & lamination under one roof'}</small>
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
          🔗 {isTa ? 'தொடர்புடைய ஆவண & அச்சிடும் சேவைகள்:' : 'Explore Related Document & Online Services:'}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={() => navigate('typing-services')}
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            ⌨️ {isTa ? 'தமிழ் & ஆங்கில டைப்பிங்' : 'Tamil & English Typing'} <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate('spiral-binding')}
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            📚 {isTa ? 'ஸ்பைரல் பைண்டிங் & லேமினேஷன்' : 'Spiral Binding & Lamination'} <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate('tools/passport-size-photo')}
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            📷 {isTa ? 'பாஸ்போர்ட் போட்டோ மேக்கர்' : 'Passport Photo Maker'} <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate('tools/image-to-pdf')}
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            📄 {isTa ? 'படங்களை PDF-ஆக மாற்ற' : 'Image to PDF Tool'} <ArrowRight size={14} />
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
        border: '2px solid #0052cc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0052cc', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase' }}>
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
              background: '#0052cc',
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
              color: '#0052cc',
              border: '1.5px solid #0052cc',
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
