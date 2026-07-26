import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Megaphone, Sparkles, Phone, MessageCircle, ArrowRight, ShieldCheck, MapPin, Star, ExternalLink, Tag } from 'lucide-react';

const MOCK_SPONSORED_ADS = [
  {
    id: 1,
    badge: '⭐ GOLD SPONSOR',
    badgeBg: '#fef3c7',
    badgeColor: '#b45309',
    title: '🏛️ ஸ்ரீ பாலமுருகன் பிரிண்டிங் & ஜெராக்ஸ் (Balamurugan Prints)',
    tagline: 'அனைத்து டிஜிட்டல் பிரிண்டிங், கலர் ஜெராக்ஸ், லேமினேஷன் மற்றும் விசிட்டிங் கார்டு வசதி!',
    offer: '🎁 AkEsevai வாடிக்கையாளர்களுக்கு 10% தள்ளுபடி!',
    address: 'பழனி பஸ் ஸ்டாண்ட் எதிரில், பழனி - 624601',
    phone: '9842198421',
    whatsapp: '919842198421',
    gradient: 'linear-gradient(135deg, #022c7a 0%, #1e1b4b 100%)'
  },
  {
    id: 2,
    badge: '🔥 PREMIUM AD',
    badgeBg: '#dcfce7',
    badgeColor: '#15803d',
    title: '🚗 ஸ்ரீ விநாயகர் ட்ராவல்ஸ் & கார் வாடகை (Vinayagar Travels)',
    tagline: 'பழனி முருகன் கோவில், கொடைக்கானல், மதுரை & கோவை 24x7 சொகுசு கார் சேவை!',
    offer: '🚕 நியாயமான கட்டணம் & 100% பாதுகாப்பான பயணம்!',
    address: 'மில் ரோடு, சண்முகபுரம், பழனி',
    phone: '9443294432',
    whatsapp: '919443294432',
    gradient: 'linear-gradient(135deg, #15803d 0%, #064e3b 100%)'
  }
];

export default function PremiumHomeAdShowcase({ navigate }) {
  const [adList, setAdList] = useState(() => {
    try {
      const stored = localStorage.getItem('akesevai-sponsored-ads');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return MOCK_SPONSORED_ADS;
  });

  const [activeAdIndex, setActiveAdIndex] = useState(0);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [adCategory, setAdCategory] = useState('கடைகள் & வர்த்தகம் (Retail & Store)');

  // Refresh ads from storage
  const refreshAds = () => {
    try {
      const stored = localStorage.getItem('akesevai-sponsored-ads');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAdList(parsed);
          return;
        }
      }
    } catch (e) {}
    setAdList(MOCK_SPONSORED_ADS);
  };

  useEffect(() => {
    refreshAds();
    window.addEventListener('storage', refreshAds);
    return () => window.removeEventListener('storage', refreshAds);
  }, []);

  // Auto rotate ad banner every 6 seconds
  useEffect(() => {
    if (adList.length === 0) return;
    const timer = setInterval(() => {
      setActiveAdIndex((prev) => (prev + 1) % adList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [adList]);

  const activeAd = adList[activeAdIndex % adList.length] || MOCK_SPONSORED_ADS[0];

  const handleSendAdEnquiry = (e) => {
    e.preventDefault();
    if (!businessName.trim() || !contactPhone.trim()) return;

    const message = `📢 *AkEsevai - New Business Advertisement Enquiry*
    
🏢 *Business Name:* ${businessName}
📱 *Contact Phone:* ${contactPhone}
🏷️ *Category:* ${adCategory}

I want to feature my business advertisement banner on the AkEsevai Home Page. Please share details and pricing options.`;

    const waUrl = `https://wa.me/919342318844?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setShowEnquiryModal(false);
    setBusinessName('');
    setContactPhone('');
  };

  return (
    <div className="premium-ad-showcase-wrapper" style={{ margin: '24px 0' }}>
      <div style={{
        background: activeAd.gradient,
        borderRadius: '20px',
        padding: '24px',
        color: 'white',
        boxShadow: '0 12px 35px rgba(2, 44, 122, 0.25)',
        position: 'relative',
        overflow: 'hidden',
        border: '1.5px solid rgba(255, 255, 255, 0.15)',
        transition: 'background 0.8s ease'
      }}>
        {/* Background Overlay Circle */}
        <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', pointerEvents: 'none' }} />

        {/* Top Kicker Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: '#fbbf24',
              color: '#022c7a',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 900,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              letterSpacing: '0.5px'
            }}>
              <Megaphone size={14} /> SPONSORED ADVERTISEMENTS • சிறப்பு விளம்பரம்
            </span>

            <span style={{
              background: activeAd.badgeBg,
              color: activeAd.badgeColor,
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: 900
            }}>
              {activeAd.badge}
            </span>
          </div>

          {/* Ad Controls Dots */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {adList.map((ad, idx) => (
              <button
                key={ad.id || idx}
                type="button"
                onClick={() => setActiveAdIndex(idx)}
                style={{
                  width: idx === activeAdIndex ? 24 : 8,
                  height: 8,
                  borderRadius: '4px',
                  background: idx === activeAdIndex ? '#fbbf24' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                aria-label={`Go to Ad ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CUSTOM UPLOADED AD IMAGE DISPLAY IF PRESENT */}
        {activeAd.image && (
          <div style={{ marginTop: '14px', borderRadius: '14px', overflow: 'hidden', border: '1.5px solid rgba(255,255,255,0.2)' }}>
            <img
              src={activeAd.image}
              alt={activeAd.title}
              style={{
                width: '100%',
                height: activeAd.bannerSize === 'large' ? '280px' : activeAd.bannerSize === 'compact' ? '140px' : '200px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </div>
        )}

        {/* Main Ad Content Body */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'white', margin: '0 0 6px', lineHeight: 1.3 }}>
              {activeAd.title}
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: 1.6, margin: '0 0 10px', fontWeight: 600 }}>
              {activeAd.tagline}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.4)', padding: '5px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 800 }}>
                {activeAd.offer}
              </span>
              <span style={{ color: '#94a3b8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <MapPin size={14} color="#38bdf8" /> {activeAd.address}
              </span>
            </div>
          </div>

          {/* Ad Call Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a
              href={`tel:${activeAd.phone}`}
              style={{
                background: '#fbbf24',
                color: '#022c7a',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 900,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(251, 191, 36, 0.4)'
              }}
            >
              <Phone size={16} /> 📞 அழைத்திடுக (Call)
            </a>

            <a
              href={`https://wa.me/${activeAd.whatsapp}?text=Hello,%20I%20saw%20your%20ad%20on%20AkEsevai%20Portal.`}
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#25D366',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 900,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)'
              }}
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>

        {/* Footer Banner CTA: "இங்கே உங்கள் விளம்பரம் செய்ய" */}
        <div style={{
          marginTop: '20px',
          paddingTop: '14px',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#fbbf24" />
            <span style={{ fontSize: '12px', color: '#e2e8f0', fontWeight: 700 }}>
              உங்கள் கடை அல்லது தொழில் விளம்பரத்தை இந்த தளத்தில் காட்சிப்படுத்த விரும்புவோர் தொடர்புகொள்ளவும்!
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowEnquiryModal(true)}
            style={{
              background: '#ffffff',
              color: '#022c7a',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(255, 255, 255, 0.3)'
            }}
          >
            📢 இங்கே விளம்பரம் செய்ய / Book Ad Space <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* AD ENQUIRY MODAL - RENDERED DIRECTLY ON DOCUMENT.BODY VIA PORTAL */}
      {showEnquiryModal && createPortal(
        <div
          onClick={() => setShowEnquiryModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 999999999,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            padding: '16px',
            boxSizing: 'border-box'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px 28px',
              maxWidth: '480px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '3px solid #022c7a',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              boxSizing: 'border-box',
              margin: 'auto'
            }}
          >
            {/* Header with Close Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#022c7a', fontWeight: 900, fontSize: '18px' }}>
                <Megaphone size={22} color="#16a34a" /> 📢 விளம்பர முன்பதிவு
              </div>
              <button
                type="button"
                onClick={() => setShowEnquiryModal(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: 34,
                  height: 34,
                  cursor: 'pointer',
                  fontWeight: 900,
                  fontSize: '16px',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', padding: '12px 16px', marginBottom: '18px' }}>
              <strong style={{ fontSize: '14px', color: '#15803d', display: 'block', marginBottom: '4px' }}>
                🌟 AkEsevai தளத்தில் உங்கள் விளம்பரம் காட்சிப்படுத்த!
              </strong>
              <p style={{ fontSize: '12px', color: '#166534', margin: 0, lineHeight: 1.5 }}>
                பழனி பகுதி வாடிக்கையாளர்கள் தினமும் பார்வையிடும் இந்த தளத்தில் உங்களின் கடை, தொழில் அல்லது சேவை விளம்பரங்களைக் காட்சிப்படுத்தலாம்.
              </p>
            </div>

            <form onSubmit={handleSendAdEnquiry}>
              {/* Field 1: Business Name */}
              <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '6px', display: 'block' }}>
                  🏢 வணிகம் / கடை பெயர் (Business Name) *
                </div>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="எ.கா: ஸ்ரீ பாலமுருகன் டெக்ஸ்டைல்ஸ்"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '48px',
                    padding: '0 14px',
                    borderRadius: '12px',
                    border: '2px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 700,
                    outline: 'none',
                    background: '#f8fafc',
                    boxSizing: 'border-box',
                    color: '#0f172a'
                  }}
                />
              </div>

              {/* Field 2: Contact Phone */}
              <div style={{ marginBottom: '16px', textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '6px', display: 'block' }}>
                  📱 தொடர்பு மொபைல் எண் (Contact Mobile) *
                </div>
                <input
                  type="tel"
                  required
                  maxLength="10"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="10-digit mobile number (எ.கா: 9842198421)"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '48px',
                    padding: '0 14px',
                    borderRadius: '12px',
                    border: '2px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 700,
                    outline: 'none',
                    background: '#f8fafc',
                    boxSizing: 'border-box',
                    color: '#0f172a'
                  }}
                />
              </div>

              {/* Field 3: Category */}
              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '6px', display: 'block' }}>
                  🏷️ வணிக வகை (Business Category)
                </div>
                <select
                  value={adCategory}
                  onChange={(e) => setAdCategory(e.target.value)}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '48px',
                    padding: '0 14px',
                    borderRadius: '12px',
                    border: '2px solid #cbd5e1',
                    fontSize: '14px',
                    fontWeight: 700,
                    outline: 'none',
                    background: '#f8fafc',
                    boxSizing: 'border-box',
                    color: '#0f172a'
                  }}
                >
                  <option>கடைகள் & வர்த்தகம் (Retail & Store)</option>
                  <option>டிராவல்ஸ் & வாகன வாடகை (Travels & Rent)</option>
                  <option>கல்வி & பயிற்சி மையங்கள் (Education & Coaching)</option>
                  <option>ரியல் எஸ்டேட் & கட்டிடம் (Real Estate & Construction)</option>
                  <option>மருத்துவமனைகள் & கிளினிக் (Healthcare & Hospital)</option>
                  <option>மற்ற சேவைகள் (Other Services)</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    height: '50px',
                    width: '100%',
                    fontWeight: 900,
                    fontSize: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)'
                  }}
                >
                  <MessageCircle size={18} /> 💬 WhatsApp மூலம் விளம்பரம் பதிவு செய்ய
                </button>

                <a
                  href="tel:9342318844"
                  style={{
                    background: '#f1f5f9',
                    color: '#022c7a',
                    border: '2px solid #cbd5e1',
                    borderRadius: '14px',
                    height: '46px',
                    width: '100%',
                    fontWeight: 800,
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '8px',
                    boxSizing: 'border-box'
                  }}
                >
                  <Phone size={16} /> 📞 நேரடி போன் அழைப்பு (93423 18844)
                </a>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
