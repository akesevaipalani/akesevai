import React, { useMemo } from 'react';
import { Star, Zap, ArrowRight } from 'lucide-react';

const SERVICE_OF_DAY = [
  { tamil: 'வருமானச் சான்றிதழ்', english: 'Income Certificate', emoji: '📋', color: '#3b82f6', bg: '#eff6ff', desc: 'கல்வி உதவித்தொகை மற்றும் அரசு திட்டங்களுக்கு அவசியமானது.', fee: '₹60', days: '3-7 நாட்கள்' },
  { tamil: 'சாதிச் சான்றிதழ்', english: 'Community Certificate', emoji: '🏛️', color: '#16a34a', bg: '#f0fdf4', desc: 'கல்லூரி சேர்க்கை மற்றும் அரசு வேலைவாய்ப்புகளுக்குத் தேவை.', fee: '₹60', days: '3-5 நாட்கள்' },
  { tamil: 'ஆதார் மொபைல் மாற்றம்', english: 'Aadhaar Mobile Update', emoji: '📱', color: '#7c3aed', bg: '#faf5ff', desc: 'ஆதார் அட்டையில் மொபைல் எண்ணை விரைவாக இணைக்கலாம்.', fee: '₹50', days: '2-5 நாட்கள்' },
  { tamil: 'புதிய வாக்காளர் அட்டை', english: 'New Voter Card', emoji: '🗳️', color: '#dc2626', bg: '#fef2f2', desc: 'புதிய வாக்காளர் பதிவு மற்றும் திருத்தங்களுக்கு உதவுகிறோம்.', fee: '₹0 (Free)', days: '7-14 நாட்கள்' },
  { tamil: 'TNPSC விண்ணப்பம்', english: 'TNPSC Application', emoji: '📝', color: '#d97706', bg: '#fffbeb', desc: 'TNPSC தேர்வு விண்ணப்பம் தவறின்றி பூர்த்தி செய்ய உதவுகிறோம்.', fee: '₹100+', days: '1-2 நாட்கள்' },
  { tamil: 'e-SHRAM CARD', english: 'e-Shram Card', emoji: '🪪', color: '#0052cc', bg: '#eff6ff', desc: 'அசங்கடித் தொழிலாளர்களுக்கான அரசு அடையாள அட்டை.', fee: '₹50', days: '1 நாள்' },
  { tamil: 'புதிய குடும்ப அட்டை', english: 'New Smart Card', emoji: '👨‍👩‍👧‍👦', color: '#15803d', bg: '#f0fdf4', desc: 'புதிய ரேஷன் அட்டை மற்றும் திருத்தங்களுக்கு விண்ணப்பிக்கலாம்.', fee: '₹100', days: '5-10 நாட்கள்' },
];

export default function ServiceOfTheDayBanner({ navigate }) {
  const [customService, setCustomService] = React.useState(null);

  React.useEffect(() => {
    const readCustom = () => {
      try {
        const saved = localStorage.getItem('akesevai-service-of-day');
        if (saved) setCustomService(JSON.parse(saved));
        else setCustomService(null);
      } catch (e) {}
    };
    readCustom();
    window.addEventListener('storage', readCustom);
    return () => window.removeEventListener('storage', readCustom);
  }, []);

  // Pick service based on day of year, or use admin custom override if present
  const todayService = useMemo(() => {
    if (customService && customService.tamil) return customService;
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return SERVICE_OF_DAY[dayOfYear % SERVICE_OF_DAY.length];
  }, [customService]);

  const today = new Date().toLocaleDateString('ta-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="sod-banner-card" style={{
      background: `linear-gradient(135deg, ${todayService.color}15 0%, ${todayService.color}08 100%)`,
      border: `1.5px solid ${todayService.color}30`,
      borderRadius: '18px',
      padding: '22px 28px',
      marginTop: '28px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative circle */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: `${todayService.color}15`, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
        {/* Left: label + service info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Big emoji */}
          <div style={{ width: 60, height: 60, background: todayService.bg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: 0, border: `1.5px solid ${todayService.color}30` }}>
            {todayService.emoji}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <span style={{ background: todayService.color, color: 'white', fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Star size={9} fill="white" /> இன்றைய சிறப்பு சேவை
              </span>
              <span className="sod-date" style={{ fontSize: '10px', fontWeight: 600 }}>{today}</span>
            </div>
            <div className="sod-title" style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Manrope, sans-serif', lineHeight: 1.1 }}>
              {todayService.tamil}
            </div>
            <div className="sod-subtitle" style={{ fontSize: '12px', color: todayService.color, fontWeight: 800, marginTop: '2px' }}>{todayService.english}</div>
            <div className="sod-desc" style={{ fontSize: '12px', marginTop: '5px', maxWidth: '380px', lineHeight: 1.5 }}>{todayService.desc}</div>
          </div>
        </div>

        {/* Right: fee + days + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="sod-stat-box" style={{ background: 'white', border: `1px solid ${todayService.color}25`, borderRadius: '10px', padding: '8px 14px', textAlign: 'center' }}>
              <div className="sod-stat-lbl" style={{ fontSize: '11px', fontWeight: 700 }}>கட்டணம்</div>
              <div className="sod-stat-val" style={{ fontSize: '16px', fontWeight: 900, color: todayService.color, fontFamily: 'Manrope' }}>{todayService.fee}</div>
            </div>
            <div className="sod-stat-box" style={{ background: 'white', border: `1px solid ${todayService.color}25`, borderRadius: '10px', padding: '8px 14px', textAlign: 'center' }}>
              <div className="sod-stat-lbl" style={{ fontSize: '11px', fontWeight: 700 }}>காலம்</div>
              <div className="sod-stat-days" style={{ fontSize: '14px', fontWeight: 800, fontFamily: 'Manrope' }}>{todayService.days}</div>
            </div>
          </div>
          <button
            onClick={() => typeof navigate === 'function' && navigate('customer')}
            style={{
              background: todayService.color,
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 20px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: `0 6px 16px ${todayService.color}35`,
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Zap size={14} /> இப்போதே விண்ணப்பிக்க <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
