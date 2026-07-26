import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Phone } from 'lucide-react';

export default function HeroBannerSlider({ navigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      leftTitle: 'பிறப்பு முதல்',
      leftHighlight: 'இறப்பு வரை',
      leftSub: 'ஆன்லைன் சம்பந்தப்பட்ட அனைத்து வேலைகளும் செய்து தரப்படும்',
      rightBadge: 'பழனி & திண்டுக்கல் மாவட்ட',
      rightTitle: 'பொது இ-சேவை மையம்',
      rightSub: 'உரிமையாளர்கள் நலச்சங்கம் • AkEsevai டிஜிட்டல் மையம்',
      badgeColor: '#e11d48'
    },
    {
      id: 2,
      leftTitle: '⚡ ஆதாரில் மொபைல் எண் & Mail ID ⚡',
      leftHighlight: 'இணைக்க மற்றும் மாற்ற',
      leftSub: 'ஆதாரில் முகவரி மாற்றம் செய்ய உடனடியாக அணுகவும்',
      rightBadge: 'அரசு ஆதார் சேவை மையம்',
      rightTitle: 'ஆதார் திருத்த சேவைகள்',
      rightSub: 'உங்கள் அருகில் உள்ள ஆதார் சேவை மையத்தை அணுகவும்',
      badgeColor: '#16a34a'
    },
    {
      id: 3,
      leftTitle: '✨ பொதுமக்களுக்கு சேவையாற்ற ✨',
      leftHighlight: 'என்றும் பெருமிதம் கொள்கிறோம்',
      leftSub: 'வருமானச் சான்று • சாதிச் சான்று • இருப்பிடச் சான்று • குடும்ப அட்டை',
      rightBadge: 'அனைத்து அரசு சான்றிதழ்கள்',
      rightTitle: 'AkEsevai Digital Centre',
      rightSub: 'பழனி | விளம்பர தொடர்புக்கு: 93423 18844',
      badgeColor: '#2563eb'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div className="banner-slider-wrapper">
      <div className="banner-slider-card">
        {/* NAV PREV BUTTON */}
        <button
          className="slider-nav-btn prev"
          onClick={handlePrev}
          aria-label="Previous Slide"
        >
          <ChevronLeft size={22} />
        </button>

        {/* SLIDE CONTENT CONTAINER */}
        <div className="banner-slide-content">
          {/* LEFT CONTENT BLOCK */}
          <div className="slide-left-block">
            <div className="slide-title-primary">
              {slide.leftTitle}
            </div>
            <div className="slide-title-gold">
              {slide.leftHighlight}
            </div>
            <div className="slide-sub-pill" style={{ borderColor: slide.badgeColor }}>
              <span className="dot-pulse" /> {slide.leftSub}
            </div>
          </div>

          {/* CURVED WAVE DIVIDER */}
          <div className="slide-wave-divider">
            <svg viewBox="0 0 100 200" preserveAspectRatio="none">
              <path d="M 0 0 C 60 50, 60 150, 0 200 L 100 200 L 100 0 Z" fill="rgba(15, 23, 42, 0.4)" />
              <path d="M 0 0 C 50 60, 50 140, 0 200" fill="none" stroke="#f59e0b" strokeWidth="4" />
            </svg>
          </div>

          {/* RIGHT CONTENT BLOCK */}
          <div className="slide-right-block">
            <div className="slide-emblem-badge">
              <div className="emblem-circle">
                <img src="/logo.png" alt="AkEsevai Crest" className="emblem-img" />
              </div>
            </div>
            <div className="right-district-tag">
              {slide.rightBadge}
            </div>
            <h2 className="right-main-heading">
              {slide.rightTitle}
            </h2>
            <div className="right-assoc-text">
              {slide.rightSub}
            </div>
          </div>
        </div>

        {/* NAV NEXT BUTTON */}
        <button
          className="slider-nav-btn next"
          onClick={handleNext}
          aria-label="Next Slide"
        >
          <ChevronRight size={22} />
        </button>

        {/* DOTS PAGINATION */}
        <div className="slider-pagination-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`dot-pill ${idx === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
