import React, { useState } from 'react';
import {
  Keyboard, FileText, FileSignature, Award, MessageCircle, Phone, MapPin,
  CheckCircle2, HelpCircle, ChevronDown, ChevronUp, ArrowRight, ShieldCheck,
  Sparkles, AlignLeft, Send, Check
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const pageMeta = { id: 'typing-services', title: 'Palani Tamil & English Typing Services' };

export default function TypingServicesPage({ navigate, lang = 'ta' }) {
  const isTa = lang === 'ta';
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const services = [
    {
      icon: Keyboard,
      title: isTa ? 'தமிழ் தட்டச்சு (Tamil Typing)' : 'Professional Tamil Typing',
      desc: isTa
        ? 'யூனிகோட் (Unicode) மற்றும் பாமினி (Bamini) விசைப்பலகை முறைகளில் பிழையற்ற தமிழ் தட்டச்சு. அரசு மனுக்கள், விண்ணப்பக் கடிதங்கள், விளம்பர வாசகங்கள் மற்றும் ஒப்பந்தங்கள்.'
        : 'Error-free Tamil typing in standard Unicode and Bamini formats for government petitions, legal letters, community requests, and official correspondence.',
      badge: isTa ? 'Unicode & Bamini' : 'Unicode & Bamini'
    },
    {
      icon: FileText,
      title: isTa ? 'ஆங்கில தட்டச்சு (English Typing)' : 'Fast English Typing',
      desc: isTa
        ? 'துல்லியமான வேகத்துடன் கூடிய ஆங்கில தட்டச்சு. வணிகக் கடிதங்கள், விண்ணப்ப படிவங்கள், பள்ளி/கல்லூரி திட்ட அறிக்கைகள் மற்றும் மனுக்கள்.'
        : 'High-speed professional English typing for business proposals, formal applications, official appeals, and academic assignments.',
      badge: isTa ? 'துல்லியமான அலைன்மென்ட்' : 'Precise Layout'
    },
    {
      icon: FileSignature,
      title: isTa ? 'அரசு மனு & விண்ணப்ப வரைவு' : 'Govt Petition & Letter Drafting',
      desc: isTa
        ? 'மாவட்ட ஆட்சியர், வட்டாட்சியர், காவல் துறை, நகராட்சி மற்றும் மின்சார வாரியத்திற்கான பொது மக்கள் மனுக்கள் மற்றும் புகார் கடிதங்களை சரியான அரசு நடைமுறை வடிவில் தட்டச்சு செய்யும் சேவை.'
        : 'Drafting and typing formal Tamil/English petitions for District Collectorate, Tahsildar office, Police complaints, EB, and Municipality grievances.',
      badge: isTa ? 'சட்டபூர்வ வடிவம்' : 'Official Format'
    },
    {
      icon: Award,
      title: isTa ? 'பயோடேட்டா & ரெஸ்யூம் தயாரிப்பு (Resume & Biodata)' : 'Resume & Professional Biodata',
      desc: isTa
        ? 'வேலைவாய்ப்புகளுக்கான நவீன தொழில்முறை ரெஸ்யூம் (Resume / CV) மற்றும் திருமண பயோடேட்டா தயாரிப்பு மற்றும் பிரிண்டிங்.'
        : 'Custom crafted modern resumes for private/IT jobs, fresher CVs, and traditional bilingual matrimonial biodatas formatted to perfection.',
      badge: isTa ? 'வேலைவாய்ப்பு வடிவம்' : 'Modern Formats'
    },
    {
      icon: AlignLeft,
      title: isTa ? 'ப்ராஜெக்ட் அறிக்கை தட்டச்சு (Project Reports)' : 'College Project & Dissertation Typing',
      desc: isTa
        ? 'கல்லூரி மாணவர்கள், ஆராய்ச்சி மாணவர்களுக்கான ப்ராஜெக்ட் ரிப்போர்ட், அட்டவணைகள் மற்றும் குறிப்புகள் தட்டச்சு செய்யப்பட்டு பைண்டிங் செய்யத் தயாராகத் தரப்படும்.'
        : 'Comprehensive typing, table formatting, and styling for arts, science, and engineering college dissertations and seminar papers.',
      badge: isTa ? 'மாணவர் சலுகை' : 'Student Ready'
    },
    {
      icon: Send,
      title: isTa ? 'வாட்ஸ்அப் வழி தட்டச்சு சேவை' : 'WhatsApp Draft Submission',
      desc: isTa
        ? 'உங்கள் கைப்பட எழுதிய கடிதம் அல்லது குறிப்புகளை வாட்ஸ்அப்பில் புகைப்படம் எடுத்து அனுப்பினால், தட்டச்சு செய்து PDF-ஆக அனுப்பி வைப்போம்.'
        : 'Send a clear photo of your handwritten draft or voice notes via WhatsApp (+91 93423 18844); we will type, proofread, and send you the PDF.',
      badge: isTa ? 'உடனடி PDF' : 'Online PDF Delivery'
    }
  ];

  const faqs = [
    {
      q: isTa ? 'கைப்பட எழுதிய மனுவை கொண்டு வந்தால் தட்டச்சு செய்து தருவீர்களா?' : 'Can I bring a handwritten draft for typing?',
      a: isTa
        ? 'ஆம்! நீங்கள் கைப்பட எழுதிய கடிதம் அல்லது மனுவை நேரில் கொண்டு வரலாம் அல்லது வாட்ஸ்அப்பில் தெளிவாக போட்டோ எடுத்து அனுப்பலாம். நாங்கள் அதை சரியான வாக்கிய அமைப்புடன் தட்டச்சு செய்து தருகிறோம்.'
        : 'Yes! You can bring your handwritten draft in person to our Mill Road centre, or send a clear photo via WhatsApp to +91 93423 18844. We type and format it cleanly.'
    },
    {
      q: isTa ? 'தட்டச்சு செய்த ஆவணத்தை வாட்ஸ்அப் அல்லது இமெயிலில் PDF-ஆக பெற முடியுமா?' : 'Can I receive the typed document as a PDF or Word file?',
      a: isTa
        ? 'கண்டிப்பாக. தட்டச்சு முடிந்ததும் உங்கள் ஆவணம் சரிபார்க்கப்பட்டு, உடனடியாக வாட்ஸ்அப்பில் PDF கோப்பாகவும் தேவைப்பட்டால் அச்சிடப்பட்ட நகலாகவும் வழங்கப்படும்.'
        : 'Yes, after proofreading, we share the finalized PDF directly to your WhatsApp or email, and provide printed copies on demand.'
    },
    {
      q: isTa ? 'தமிழ் தட்டச்சு யூனிகோட் முறையில் இருக்குமா?' : 'Is Tamil typing done in Unicode so I can copy-paste online?',
      a: isTa
        ? 'ஆம்! நாங்கள் நவீன தமிழ் யூனிகோட் முறையைப் பயன்படுத்துகிறோம். இதனால் நீங்கள் அரசு இணையதளங்கள், வாட்ஸ்அப் மற்றும் இமெயில்களில் எளிதாக நகலெடுத்துப் பயன்படுத்தலாம்.'
        : 'Yes! We use standard Tamil Unicode font systems so your text is universally readable and can be directly copy-pasted into government online portals and emails.'
    },
    {
      q: isTa ? 'தட்டச்சு செய்த பிறகு பிரிண்ட் மற்றும் பைண்டிங் செய்து தரப்படுமா?' : 'Can I get printing and spiral binding done immediately after typing?',
      a: isTa
        ? 'ஆம்! தட்டச்சு, பிரிண்டிங், ஜெராக்ஸ், ஸ்பைரல் பைண்டிங் மற்றும் லேமினேஷன் ஆகிய அனைத்து சேவைகளும் ஒரே இடத்தில் உடனுக்குடன் செய்து தரப்படும்.'
        : 'Yes! We offer end-to-end document services: typing, printing, photocopying, spiral binding, and lamination under one roof in Palani.'
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
          {isTa ? 'தமிழ் & ஆங்கில டைப்பிங்' : 'Tamil & English Typing'}
        </span>
      </nav>

      {/* 2. HERO HEADER BANNER */}
      <section style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #0052cc 60%, #0d9488 100%)',
        borderRadius: '24px',
        padding: '36px 28px',
        color: 'white',
        boxShadow: '0 12px 36px rgba(0,82,204,0.18)',
        marginBottom: '36px'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '30px', fontSize: '12px', fontWeight: 800, marginBottom: '14px', backdropFilter: 'blur(6px)' }}>
          <Sparkles size={15} color="#fbbf24" />
          <span>{isTa ? 'பழனி தொழில்முறை தட்டச்சு மையம்' : 'Palani Professional Typing Centre'}</span>
        </div>

        <h1 style={{ font: '800 clamp(24px, 4vw, 36px)/1.25 Manrope, sans-serif', margin: '0 0 14px', color: 'white' }}>
          {isTa
            ? 'பழனி தமிழ் & ஆங்கில டைப்பிங் மற்றும் அரசு மனு வரைவு சேவைகள்'
            : 'Professional Tamil & English Typing Services in Palani'}
        </h1>

        <p style={{ fontSize: '15px', lineHeight: 1.6, maxWidth: '820px', margin: '0 0 24px', color: '#e0f2fe' }}>
          {isTa
            ? 'அரசுத் துறை மனுக்கள், வட்டாட்சியர் விண்ணப்பங்கள், அதிகாரப்பூர்வ கடிதங்கள், வேலைவாய்ப்பு ரெஸ்யூம் (Resume) மற்றும் கல்லூரி ப்ராஜெக்ட் தட்டச்சு சேவைகளை துல்லியமான தமிழ் (யூனிகோட் / பாமினி) மற்றும் ஆங்கிலத்தில் உடனுக்குடன் செய்து தருகிறோம்.'
            : 'Get fast, accurate, and properly formatted Tamil & English document typing in Palani. We specialize in government grievance petitions, Tahsildar requests, legal drafts, professional resumes, and student project documents.'}
        </p>

        {/* CTA ACTION BUTTONS */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a
            href="https://wa.me/919342318844?text=வணக்கம்%20AK%20E-SEVAI,%20டைப்பிங்%20(Typing)%20சேவைக்காக%20தொடர்பு%20கொள்கிறேன்."
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
            <MessageCircle size={18} /> {isTa ? 'வாட்ஸ்அப்பில் மனு அனுப்ப' : 'Send Draft on WhatsApp'}
          </a>

          <a
            href="tel:9342318844"
            style={{
              background: 'white',
              color: '#1e3a8a',
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
            <Phone size={18} color="#1e3a8a" /> {isTa ? 'அழைக்க: 93423 18844' : 'Call: 93423 18844'}
          </a>
        </div>
      </section>

      {/* 3. SERVICES GRID */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span className="section-kicker">{isTa ? 'தட்டச்சு சேவைகள்' : 'TYPING & DRAFTING SERVICES'}</span>
          <h2 style={{ font: '800 24px Manrope, sans-serif', color: '#0f172a', margin: '8px 0 6px' }}>
            {isTa ? 'AK E-SEVAI மையத்தில் வழங்கப்படும் தட்டச்சு வகைகள்' : 'Complete Document Typing Solutions in Palani'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '640px', margin: '0 auto' }}>
            {isTa
              ? 'பிழையற்ற எழுத்து நடை, சரியான அரசு கடித வடிவம் மற்றும் விரைவான சேவை.'
              : 'Serving Palani residents, advocates, students, and businesses with professional typography.'}
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
                    <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0052cc' }}>
                      <Icon size={24} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#0d9488', background: '#f0fdfa', padding: '4px 10px', borderRadius: '20px', border: '1px solid #99f6e4' }}>
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
          {isTa ? 'எங்கள் தட்டச்சு சேவையின் சிறப்பம்சங்கள்' : 'Key Advantages of Our Palani Typing Centre'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#0f172a', fontSize: '14px', display: 'block' }}>{isTa ? 'பிழையற்ற தட்டச்சு & திருத்தம்' : 'Proofread & Spell Checked'}</strong>
              <small style={{ color: '#64748b', fontSize: '12.5px' }}>{isTa ? 'முழுமையான பிழைதிருத்தம் செய்யப்பட்டு அச்சிடப்படும்' : 'Thorough Tamil and English spell verification'}</small>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#0f172a', fontSize: '14px', display: 'block' }}>{isTa ? 'நவீன யூனிகோட் தமிழ் முறை' : 'Universal Unicode Tamil Fonts'}</strong>
              <small style={{ color: '#64748b', fontSize: '12.5px' }}>{isTa ? 'எல்லா கணினி மற்றும் போனிலும் தெரியும் தமிழ் எழுத்துக்கள்' : 'Standard cross-platform font compatibility'}</small>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ color: '#0f172a', fontSize: '14px', display: 'block' }}>{isTa ? 'அரசு நடைமுறை அறிவு' : 'Government Formats Expertise'}</strong>
              <small style={{ color: '#64748b', fontSize: '12.5px' }}>{isTa ? 'மனுக்களுக்கான சரியான தலைப்பு மற்றும் அமைப்பு' : 'Structured format for petitions & official appeals'}</small>
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
          🔗 {isTa ? 'தொடர்புடைய ஆவண சேவைகள்:' : 'Explore Related Document Services:'}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={() => navigate('xerox-printing')}
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            🖨️ {isTa ? 'ஜெராக்ஸ் & கலர் பிரிண்டிங்' : 'Xerox & Colour Printing'} <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate('spiral-binding')}
            style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            📚 {isTa ? 'ஸ்பைரல் பைண்டிங் & லேமினேஷன்' : 'Spiral Binding & Lamination'} <ArrowRight size={14} />
          </button>
          <button
            onClick={() => navigate('services')}
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            🏛️ {isTa ? 'அனைத்து இ-சேவை சான்றிதழ்கள்' : 'All e-Sevai Services'} <ArrowRight size={14} />
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
