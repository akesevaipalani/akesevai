import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ExternalLink, Megaphone, ArrowRight } from 'lucide-react';
import { subscribeSponsoredAds } from '../utils/dataService';

export default function AdvertisementBannerSection({ lang = 'ta', navigate }) {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isTa = lang === 'ta';
  const autoSlideTimerRef = useRef(null);

  useEffect(() => {
    const unsub = subscribeSponsoredAds((rawAds) => {
      if (Array.isArray(rawAds)) {
        const activeAds = rawAds.filter((a) => a && a.isActive !== false && a.status !== 'inactive' && a.status !== 'paused');
        setAds(activeAds);
        if (activeAds.length > 0 && currentIndex >= activeAds.length) {
          setCurrentIndex(0);
        }
      } else {
        setAds([]);
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [currentIndex]);

  // 5-second Auto-slide logic with pause on hover
  useEffect(() => {
    if (ads.length <= 1 || isPaused) {
      if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
      return;
    }

    autoSlideTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => {
      if (autoSlideTimerRef.current) clearInterval(autoSlideTimerRef.current);
    };
  }, [ads.length, isPaused]);

  // If no advertisements are active, hide the entire section (Zero space consumption)
  if (!ads || ads.length === 0) {
    return null;
  }

  const currentAd = ads[currentIndex] || ads[0];

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const handleAdClick = () => {
    if (currentAd?.targetUrl) {
      if (currentAd.targetUrl.startsWith('http://') || currentAd.targetUrl.startsWith('https://')) {
        window.open(currentAd.targetUrl, '_blank', 'noopener,noreferrer');
      } else if (currentAd.targetUrl.startsWith('wa.me') || currentAd.targetUrl.includes('whatsapp')) {
        window.open(`https://${currentAd.targetUrl.replace(/^https?:\/\//, '')}`, '_blank');
      } else if (navigate) {
        navigate(currentAd.targetUrl.replace(/^\//, ''));
      }
    }
  };

  return (
    <section 
      className="ad-banner-section page-width"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      aria-label="Sponsored Advertisements and Special Announcements"
    >
      <div className="ad-banner-card-wrapper">
        {/* TOP TAG STRIP */}
        <div className="ad-banner-header-strip">
          <span className="ad-banner-badge">
            <Megaphone size={13} className="ad-badge-icon" />
            {currentAd.badge || (isTa ? 'சிறப்பு அறிவிப்பு & விளம்பரம்' : 'Special Notice & Updates')}
          </span>
          {ads.length > 1 && (
            <span className="ad-banner-counter">
              {currentIndex + 1} / {ads.length}
            </span>
          )}
        </div>

        {/* MAIN BANNER VIEWPORT */}
        <div 
          className={`ad-banner-viewport ${currentAd.targetUrl ? 'ad-clickable' : ''}`}
          onClick={handleAdClick}
          title={currentAd.targetUrl ? (isTa ? 'விவரங்களுக்கு கிளிக் செய்யவும்' : 'Click to view details') : ''}
        >
          {/* BLURRED BACKGROUND AMBIENT GLOW (Prevents distortion on any image ratio) */}
          <div 
            className="ad-banner-ambient-bg"
            style={{ backgroundImage: `url(${currentAd.imageUrl || currentAd.image})` }}
          />

          {/* MAIN RESPONSIVE IMAGE CONTAINER (Preserves Original Aspect Ratio Without Distortion) */}
          <div className="ad-banner-image-box">
            <img 
              src={currentAd.imageUrl || currentAd.image} 
              alt={currentAd.title || 'Advertisement Banner'} 
              className="ad-banner-img-element"
              loading="lazy"
              crossOrigin="anonymous"
            />
          </div>

          {/* TEXT OVERLAY (Shown if title/subtitle provided) */}
          {(currentAd.title || currentAd.subtitle) && (
            <div className="ad-banner-text-overlay">
              {currentAd.title && <h3 className="ad-banner-title">{currentAd.title}</h3>}
              {currentAd.subtitle && <p className="ad-banner-subtitle">{currentAd.subtitle}</p>}
              {currentAd.targetUrl && (
                <div className="ad-banner-action-pill">
                  <span>{isTa ? 'மேலும் அறிய (View Details)' : 'Learn More'}</span>
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          )}

          {/* PREVIOUS / NEXT CONTROLS (Only if multiple ads exist) */}
          {ads.length > 1 && (
            <>
              <button 
                type="button"
                className="ad-carousel-btn ad-btn-prev" 
                onClick={handlePrev}
                aria-label="Previous Advertisement"
              >
                <ChevronLeft size={20} />
              </button>

              <button 
                type="button"
                className="ad-carousel-btn ad-btn-next" 
                onClick={handleNext}
                aria-label="Next Advertisement"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* DOTS PAGINATION (Only if multiple ads exist) */}
        {ads.length > 1 && (
          <div className="ad-carousel-dots-container">
            {ads.map((ad, idx) => (
              <button
                key={ad.id || idx}
                type="button"
                className={`ad-carousel-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                aria-label={`Go to advertisement slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
