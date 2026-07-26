import React from 'react';
import { Sparkles, ShieldCheck, Zap, Headphones, ArrowRight, Heart, PartyPopper, CheckCircle2, Lock, Smile } from 'lucide-react';

export default function FirstTimeLoginModal({ isOpen, customerName, isFirstTime = true, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="logout-modal-backdrop" onClick={onClose}>
      <div className="logout-modal-card welcome-first-login-card" onClick={(e) => e.stopPropagation()} style={{ borderColor: isFirstTime ? '#f59e0b' : '#16a34a', boxShadow: isFirstTime ? '0 30px 70px rgba(245, 158, 11, 0.25)' : '0 30px 70px rgba(22, 163, 74, 0.25)' }}>
        
        {/* ICON CONTAINER */}
        <div className="first-login-icon-circle" style={{ background: isFirstTime ? '#fef3c7' : '#dcfce7' }}>
          {isFirstTime ? <PartyPopper size={38} color="#d97706" /> : <ShieldCheck size={38} color="#16a34a" />}
          <span className="sparkle-float-badge">
            <Sparkles size={16} fill="#fbbf24" color="#d97706" />
          </span>
        </div>

        {/* KICKER BADGE */}
        <span className="logout-kicker" style={{ background: isFirstTime ? '#fef3c7' : '#dcfce7', color: isFirstTime ? '#b45309' : '#15803d', borderColor: isFirstTime ? '#fde68a' : '#86efac' }}>
          {isFirstTime ? '🎉 நல்வரவு • WELCOME TO AK ESEVAI FAMILY' : '🛡️ மீண்டும் வருக • WELCOME BACK'}
        </span>

        {/* MAIN DYNAMIC TITLE */}
        <h3 className="logout-title" style={{ fontSize: '22px' }}>
          வணக்கம் <span>{customerName || 'வாடிக்கையாளரே'}</span>!<br />
          {isFirstTime ? 'AkEsevai டிஜிட்டல் குடும்பத்திற்கு அன்புடன் வரவேற்கிறோம்!' : 'உங்களை மீண்டும் காண்பதில் மிக்க மகிழ்ச்சி!'}
        </h3>

        {/* DYNAMIC VIBE MESSAGE BOX */}
        <div style={{ background: isFirstTime ? '#fffbeb' : '#f0fdf4', border: `1.5px solid ${isFirstTime ? '#fde68a' : '#86efac'}`, borderRadius: '12px', padding: '14px', margin: '14px 0', textAlign: 'left' }}>
          <strong style={{ fontSize: '13px', color: isFirstTime ? '#b45309' : '#15803d', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            {isFirstTime ? <Sparkles size={15} /> : <Lock size={15} />}
            {isFirstTime ? '✨ புதிய தொடக்கம் & சேவை உறுதிமொழி:' : '🔒 100% பாதுகாப்பு & தரவு தயார்:'}
          </strong>
          <p style={{ fontSize: '12.5px', color: '#1e293b', margin: 0, lineHeight: 1.55, fontWeight: 600 }}>
            {isFirstTime
              ? 'இனி உங்களின் அரசு சான்றிதழ்கள், ஆதார், பான் கார்டு மற்றும் குடும்ப அட்டை விண்ணப்பங்கள் அனைத்தும் ஒரே இடத்தில் மிகத் துல்லியமாகவும், 100% சுலபமாகவும் முடிவடையும்!'
              : 'உங்கள் முன்-பதிவு செய்த விண்ணப்பங்கள் மற்றும் பதிவேற்றிய ஆவணங்கள் அனைத்தும் AkEsevai சிஸ்டத்தில் 100% பாதுகாப்பாகச் சேமிக்கப்பட்டுள்ளன.'}
          </p>
        </div>

        {/* 3 FEATURE PROMISES */}
        <div className="first-login-promises-grid">
          <div className="promise-pill" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}>
            <Zap size={14} color="#0284c7" />
            <span>விரைவான சேவை</span>
          </div>
          <div className="promise-pill" style={{ background: '#dcfce7', color: '#15803d', borderColor: '#bbf7d0' }}>
            <ShieldCheck size={14} color="#16a34a" />
            <span>100% பாதுகாப்பு</span>
          </div>
          <div className="promise-pill" style={{ background: '#fef3c7', color: '#b45309', borderColor: '#fde68a' }}>
            <Headphones size={14} color="#d97706" />
            <span>24x7 வாட்ஸ்அப்</span>
          </div>
        </div>

        {/* CTA BUTTON */}
        <button className="logout-close-btn" onClick={onClose} style={{ background: 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)', marginTop: '6px' }}>
          {isFirstTime ? '🚀 சேவைகளைத் தொடங்குக / Start Exploring' : '✨ போர்ட்டலுக்குச் செல்க / Proceed to Portal'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
