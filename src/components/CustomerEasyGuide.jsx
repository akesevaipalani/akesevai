import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  HelpCircle, X, PhoneCall, MessageCircle, FileText, Clock,
  ChevronRight, CheckCircle2, Ticket, Search, MapPin, Star,
  ArrowRight, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';

// Customer FAQ items in Tamil + English
const EASY_GUIDE_STEPS = [
  {
    emoji: '📋',
    title: 'என்ன சேவை வேண்டும்?',
    subtitle: 'Which service do you need?',
    color: '#0052cc',
    bg: '#eff6ff',
    border: '#bfdbfe',
    steps: [
      { icon: '🪪', text: 'ஆதார் மொபைல் / முகவரி மாற்றம் — வலது பக்கம் "சேவைகள்" கிளிக் செய்யுங்கள்' },
      { icon: '📄', text: 'வருமானம் / சாதி / இருப்பிடம் சான்று — "சேவைகள்" பக்கத்தில் தேடுங்கள்' },
      { icon: '🏠', text: 'குடும்ப அட்டை / ரேஷன் கார்டு — "சேவைகள்" → Smart Card தேர்வு' },
      { icon: '🗳️', text: 'வாக்காளர் அட்டை / திருத்தம் — "சேவைகள்" → Identity Documents' },
    ]
  },
  {
    emoji: '📁',
    title: 'என்ன ஆவணம் கொண்டு வர வேண்டும்?',
    subtitle: 'What documents to bring?',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    steps: [
      { icon: '✅', text: 'எல்லா சேவைக்கும்: ஆதார் அட்டை (Original + Xerox) கட்டாயம்' },
      { icon: '✅', text: 'குடும்ப அட்டை (Smart Card) — Xerox கொண்டு வாருங்கள்' },
      { icon: '✅', text: 'பாஸ்போர்ட் போட்டோ — 2 copies வையுங்கள்' },
      { icon: '✅', text: 'மொபைல் எண் — ஆதாரில் registered number பக்கத்தில் வையுங்கள்' },
    ]
  },
  {
    emoji: '🎫',
    title: 'டோக்கன் சீட்டு எப்படி பெறுவது?',
    subtitle: 'How to get token slip?',
    color: '#d97706',
    bg: '#fffbeb',
    border: '#fde68a',
    steps: [
      { icon: '1️⃣', text: '"டோக்கன் சீட்டு" menu-ல் கிளிக் செய்யுங்கள்' },
      { icon: '2️⃣', text: 'உங்கள் பெயர், மொபைல் எண், சேவை தேர்வு செய்யுங்கள்' },
      { icon: '3️⃣', text: 'GPay மூலம் ₹50 செலுத்தி Confirm செய்யுங்கள்' },
      { icon: '4️⃣', text: 'டோக்கன் சீட்டு WhatsApp-ல் வரும் — Print எடுத்து வாருங்கள்' },
    ]
  },
  {
    emoji: '📍',
    title: 'எங்கள் நிலை எப்படி கண்டறிவது?',
    subtitle: 'How to track application status?',
    color: '#7c3aed',
    bg: '#f5f3ff',
    border: '#c4b5fd',
    steps: [
      { icon: '🔍', text: '"நிலை கண்டறிய" menu-ல் கிளிக் செய்யுங்கள்' },
      { icon: '📱', text: 'உங்கள் Application ID அல்லது மொபைல் எண் உள்ளிடுங்கள்' },
      { icon: '✅', text: 'உங்கள் விண்ணப்பத்தின் தற்போதைய நிலை தெரியும்' },
      { icon: '💬', text: 'சந்தேகமிருந்தால் WhatsApp-ல் எங்களை தொடர்பு கொள்ளுங்கள்' },
    ]
  },
];

const QUICK_FAQS = [
  {
    q: '⏰ மையம் எத்தனை மணிக்கு திறக்கும்?',
    a: 'திங்கள் முதல் சனி வரை காலை 9:00 மணி முதல் மாலை 7:00 மணி வரை திறந்திருக்கும்.'
  },
  {
    q: '💰 கட்டணம் எவ்வளவு?',
    a: 'டோக்கன் சீட்டுக்கு ₹50 மட்டுமே. சேவை கட்டணம் சேவையைப் பொறுத்து மாறுபடும். முன்கூட்டியே விசாரிக்கலாம்: 93423 18844.'
  },
  {
    q: '📸 போட்டோ கொண்டு வர வேண்டுமா?',
    a: 'ஆம், 2 பாஸ்போர்ட் size போட்டோ கொண்டு வாருங்கள். இங்கேயே photo எடுத்துத் தரவும் ஏற்பாடு உள்ளது.'
  },
  {
    q: '📞 முன்கூட்டியே appointment வேண்டுமா?',
    a: 'Appointment கட்டாயமில்லை. ஆனால் டோக்கன் சீட்டு வாங்கி வந்தால் நீண்ட காத்திருப்பை தவிர்க்கலாம்.'
  },
  {
    q: '📄 Xerox இங்கே எடுக்கலாமா?',
    a: 'ஆம்! Xerox, Scan, Print, Lamination — எல்லா சேவைகளும் இங்கே கிடைக்கும்.'
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '10px',
      marginBottom: '8px',
      overflow: 'hidden',
      transition: 'all 0.2s ease'
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          background: open ? '#f8fafc' : 'white',
          border: 'none',
          padding: '12px 14px',
          textAlign: 'left',
          fontSize: '13px',
          fontWeight: 700,
          color: '#0f172a',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'Manrope, sans-serif'
        }}
      >
        <span>{q}</span>
        {open ? <ChevronUp size={16} color="#0052cc" /> : <ChevronDown size={16} color="#64748b" />}
      </button>
      {open && (
        <div style={{
          padding: '10px 14px 14px',
          background: '#f8fafc',
          fontSize: '12.5px',
          color: '#334155',
          lineHeight: 1.6,
          borderTop: '1px solid #e2e8f0',
          fontFamily: 'Manrope, sans-serif'
        }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function CustomerEasyGuide({ navigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [tab, setTab] = useState('guide'); // 'guide' | 'faq'
  const [pulse, setPulse] = useState(true);

  // Stop pulsing after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const modal = isOpen && createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99990,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0',
        backdropFilter: 'blur(4px)'
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '24px 24px 0 0',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.25)',
          fontFamily: 'Manrope, sans-serif',
          animation: 'slideUpSheet 0.35s cubic-bezier(0.32, 0.72, 0, 1)'
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 100%)',
          padding: '20px 20px 16px',
          borderRadius: '24px 24px 0 0',
          position: 'sticky',
          top: 0,
          zIndex: 2
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#93c5fd', fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '2px' }}>
                🙏 வணக்கம் • CUSTOMER HELP
              </div>
              <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 900, margin: 0 }}>
                உங்களுக்கு எப்படி உதவலாம்?
              </h2>
              <p style={{ color: '#bfdbfe', fontSize: '11px', margin: '3px 0 0', fontWeight: 600 }}>
                How can we help you today?
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                flexShrink: 0
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px' }}>
            <a
              href="tel:9342318844"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '12px',
                padding: '10px',
                color: 'white',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 800
              }}
            >
              <PhoneCall size={16} /> 📞 Call: 93423 18844
            </a>
            <a
              href="https://wa.me/919342318844?text=🙏 வணக்கம் AkEsevai, எனக்கு சேவை தேவை."
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#25D366',
                border: 'none',
                borderRadius: '12px',
                padding: '10px',
                color: 'white',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 800
              }}
            >
              <MessageCircle size={16} /> 💬 WhatsApp
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
          <button
            onClick={() => setTab('guide')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 800,
              color: tab === 'guide' ? '#0052cc' : '#64748b',
              borderBottom: tab === 'guide' ? '2.5px solid #0052cc' : '2.5px solid transparent',
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif',
              marginBottom: '-2px'
            }}
          >
            📖 எளிய வழிகாட்டி
          </button>
          <button
            onClick={() => setTab('faq')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 800,
              color: tab === 'faq' ? '#0052cc' : '#64748b',
              borderBottom: tab === 'faq' ? '2.5px solid #0052cc' : '2.5px solid transparent',
              cursor: 'pointer',
              fontFamily: 'Manrope, sans-serif',
              marginBottom: '-2px'
            }}
          >
            ❓ கேள்வி பதில்
          </button>
        </div>

        <div style={{ padding: '16px' }}>
          {tab === 'guide' && (
            <>
              {/* Step selector */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {EASY_GUIDE_STEPS.map((step, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      border: activeStep === i ? `2px solid ${step.color}` : '1.5px solid #e2e8f0',
                      background: activeStep === i ? step.bg : 'white',
                      color: activeStep === i ? step.color : '#64748b',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontFamily: 'Manrope, sans-serif',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {step.emoji} {step.title.slice(0, 16)}...
                  </button>
                ))}
              </div>

              {/* Active step details */}
              {(() => {
                const step = EASY_GUIDE_STEPS[activeStep];
                return (
                  <div style={{
                    background: step.bg,
                    border: `1.5px solid ${step.border}`,
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '14px'
                  }}>
                    <h3 style={{ color: step.color, fontSize: '16px', fontWeight: 900, margin: '0 0 4px' }}>
                      {step.emoji} {step.title}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '11px', margin: '0 0 12px', fontWeight: 600 }}>
                      {step.subtitle}
                    </p>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {step.steps.map((s, i) => (
                        <div
                          key={i}
                          style={{
                            background: 'white',
                            border: `1px solid ${step.border}`,
                            borderRadius: '10px',
                            padding: '10px 12px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            fontSize: '12.5px',
                            color: '#1e293b',
                            fontWeight: 600,
                            lineHeight: 1.5
                          }}
                        >
                          <span style={{ fontSize: '16px', flexShrink: 0 }}>{s.icon}</span>
                          <span>{s.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Quick navigation buttons */}
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', marginBottom: '8px' }}>
                  ⚡ நேரடியாக செல்ல / Quick Go:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { emoji: '🎫', label: 'டோக்கன் சீட்டு', sub: 'Token Slip', page: 'token-generator', color: '#d97706', bg: '#fffbeb' },
                    { emoji: '📍', label: 'நிலை கண்டறிய', sub: 'Track Status', page: 'status-track', color: '#7c3aed', bg: '#f5f3ff' },
                    { emoji: '📋', label: 'சேவைகள்', sub: 'All Services', page: 'services', color: '#0052cc', bg: '#eff6ff' },
                    { emoji: '📞', label: 'தொடர்பு கொள்ள', sub: 'Contact Us', page: 'contact', color: '#16a34a', bg: '#f0fdf4' },
                  ].map(btn => (
                    <button
                      key={btn.page}
                      onClick={() => { setIsOpen(false); navigate(btn.page); }}
                      style={{
                        background: btn.bg,
                        border: `1.5px solid`,
                        borderColor: btn.bg,
                        borderRadius: '12px',
                        padding: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'Manrope, sans-serif',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{btn.emoji}</span>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: btn.color }}>{btn.label}</span>
                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{btn.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Office hours */}
              <div style={{
                background: '#f0fdf4',
                border: '1.5px solid #bbf7d0',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Clock size={20} color="#16a34a" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d' }}>
                    🟢 மையம் திறந்திருக்கும் நேரம்
                  </div>
                  <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600, marginTop: '2px' }}>
                    திங்கள் – சனி: காலை 9:00 – மாலை 7:00 | 📞 93423 18844
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'faq' && (
            <div>
              <p style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, marginBottom: '12px' }}>
                🙋 அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ):
              </p>
              {QUICK_FAQS.map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}

              {/* Still need help */}
              <div style={{
                background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 100%)',
                borderRadius: '14px',
                padding: '16px',
                textAlign: 'center',
                marginTop: '12px'
              }}>
                <p style={{ color: '#bfdbfe', fontSize: '12px', fontWeight: 700, margin: '0 0 10px' }}>
                  இன்னும் சந்தேகமா? நேரடியாக பேசுங்கள்!
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <a
                    href="tel:9342318844"
                    style={{
                      background: 'white',
                      color: '#022c7a',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <PhoneCall size={14} /> அழையுங்கள்
                  </a>
                  <a
                    href="https://wa.me/919342318844"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: '#25D366',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom safe area */}
        <div style={{ height: '16px' }} />
      </div>

      <style>{`
        @keyframes slideUpSheet {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );

  return (
    <>
      {modal}

      {/* Floating Help Button */}
      <button
        id="customer-help-guide-btn"
        onClick={() => setIsOpen(true)}
        title="உதவி தேவையா? Customer Help Guide"
        style={{
          position: 'fixed',
          bottom: '90px',
          left: '16px',
          zIndex: 9998,
          background: pulse
            ? 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)'
            : 'linear-gradient(135deg, #0052cc 0%, #022c7a 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '10px 16px',
          fontSize: '12px',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          boxShadow: pulse
            ? '0 4px 20px rgba(22, 163, 74, 0.5), 0 0 0 6px rgba(22,163,74,0.15)'
            : '0 4px 16px rgba(0, 82, 204, 0.35)',
          fontFamily: 'Manrope, sans-serif',
          transition: 'all 0.3s ease',
          animation: pulse ? 'pulseHelp 1.5s ease-in-out infinite' : 'none'
        }}
      >
        <HelpCircle size={16} />
        <span>உதவி / Help</span>
      </button>

      <style>{`
        @keyframes pulseHelp {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 20px rgba(22, 163, 74, 0.5), 0 0 0 6px rgba(22,163,74,0.15); }
          50% { transform: scale(1.06); box-shadow: 0 6px 28px rgba(22, 163, 74, 0.6), 0 0 0 10px rgba(22,163,74,0.08); }
        }
      `}</style>
    </>
  );
}
