import React from 'react';
import { ShieldCheck, Heart, CheckCircle2, Sparkles, X, ArrowRight } from 'lucide-react';

export default function CustomerLogoutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="logout-modal-backdrop" onClick={onClose}>
      <div className="logout-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="logout-modal-icon-wrap">
          <ShieldCheck size={38} color="#16a34a" />
          <span className="logout-heart-badge">
            <Heart size={16} fill="#ef4444" color="#ef4444" />
          </span>
        </div>

        <span className="logout-kicker">
          <Sparkles size={13} /> SAFE LOGOUT • பாதுகாப்பான வெளியேற்றம்
        </span>

        <h3 className="logout-title">
          நன்றி! <span>AkEsevai</span> மையத்தைப் பயன்படுத்தியதற்கு மிக்க நன்றி!
        </h3>

        <p className="logout-desc">
          உங்கள் ஆவணங்கள் மற்றும் விண்ணப்ப விவரங்கள் <strong>100% பாதுகாப்பாகச் சேமிக்கப்பட்டுள்ளன.</strong> உங்கள் மொபைல் எண்ணைப் பயன்படுத்தி எப்போது வேண்டுமானாலும் மீண்டும் உள்நுழையலாம்.
        </p>

        <div className="logout-features-strip">
          <span><CheckCircle2 size={14} color="#16a34a" /> தகவல்கள் சேமிக்கப்பட்டன</span>
          <span><CheckCircle2 size={14} color="#16a34a" /> பாதுகாப்பான அமர்வு</span>
        </div>

        <button className="logout-close-btn" onClick={onClose}>
          மீண்டும் வருக! • Done <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
