import React, { useState } from 'react';
import { MessageCircle, Phone, Ticket, X, Sparkles } from 'lucide-react';

export default function FloatingQuickActions({ navigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    const text = encodeURIComponent('🙏 *வணக்கம் AkEsevai*, சேவை விவரங்கள் மற்றும் டோக்கன் முன்பதிவு குறித்து அறிய தொடர்பு கொள்கிறேன்.');
    window.open(`https://wa.me/919342318844?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="floating-actions-container">
      {isOpen && (
        <div className="floating-buttons-group">
          {/* WHATSAPP ACTION BUTTON */}
          <button
            onClick={handleWhatsApp}
            className="floating-btn whatsapp-btn"
            title="Chat on WhatsApp (93423 18844)"
          >
            <MessageCircle size={20} />
            <span className="floating-btn-text">WhatsApp உதவி</span>
          </button>

          {/* CALL ACTION BUTTON */}
          <a
            href="tel:9342318844"
            className="floating-btn call-btn"
            title="Call Support (93423 18844)"
          >
            <Phone size={18} />
            <span className="floating-btn-text">93423 18844</span>
          </a>

          {/* INSTANT TOKEN BUTTON */}
          <button
            onClick={() => {
              if (typeof navigate === 'function') navigate('token-generator');
            }}
            className="floating-btn token-btn"
            title="Book Token Pass"
          >
            <Ticket size={18} />
            <span className="floating-btn-text">டோக்கன் பெற</span>
          </button>
        </div>
      )}

      {/* TOGGLE EXPAND / CLOSE BUTTON */}
      <button
        className="floating-main-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Quick Actions"
      >
        {isOpen ? <X size={20} /> : <Sparkles size={20} />}
      </button>
    </div>
  );
}
