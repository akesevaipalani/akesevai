import React, { useState, useEffect, useRef } from 'react';
import { Camera, ChevronLeft, ChevronRight, MapPin, Building } from 'lucide-react';

const OFFICE_PHOTOS = [
  {
    id: 1,
    src: '/office1.jpg',
    title: '🏢 வாடிக்கையாளர் காத்திருப்பு அரங்கம்',
    subtitle: 'Customer Lounge & Reception Desk',
    location: 'மில் ரோடு, சண்முகபுரம், பழனி',
    desk: 'AkEsevai Reception & Lounge'
  },
  {
    id: 2,
    src: '/office2.jpg',
    title: '🖥️ நவீன கணினி & சேவை கவுண்டர்கள்',
    subtitle: 'High-Speed Digital Workstation Counters',
    location: 'சண்முகபுரம், பழனி - 624601',
    desk: 'AkEsevai Digital Workstation'
  },
  {
    id: 3,
    src: '/office3.jpg',
    title: '👨‍💻 முதன்மை ஆபரேட்டர் சேவை மையம்',
    subtitle: 'Main Operator Counter Desk',
    location: 'சண்முகபுரம், பழனி',
    desk: 'AK e-Sevai Main Desk'
  }
];

export default function AkEsevaiOfficePhotoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isAutoPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % OFFICE_PHOTOS.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying]);

  const goTo = (idx) => {
    setCurrentIndex(idx);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % OFFICE_PHOTOS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + OFFICE_PHOTOS.length) % OFFICE_PHOTOS.length);
  };

  const current = OFFICE_PHOTOS[currentIndex];

  return (
    <div
      className="real-office-gallery-container home-centre-slider-wrapper office-photo-slider-container"
      id="real-office-gallery-section"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      style={{
        position: 'relative',
        width: '100%',
        margin: '22px 0 20px',
        borderRadius: '22px',
        padding: '3px',
        background: 'linear-gradient(135deg, #0052cc 0%, #16a34a 50%, #fbbf24 100%)',
        boxShadow: '0 16px 44px rgba(0, 82, 204, 0.24)',
        overflow: 'hidden'
      }}
    >
      <style>{`
        .office-gallery-stage {
          position: relative;
          width: 100%;
          border-radius: 19px;
          overflow: hidden;
          background: #070a12;
          aspect-ratio: 16 / 9;
          max-height: 520px;
          min-height: 200px;
        }

        .office-gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          transition: transform 0.4s ease-out;
        }

        .gallery-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(15, 23, 42, 0.8);
          border: 1.5px solid rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 35;
          pointer-events: auto;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
        }

        .gallery-nav-arrow:hover {
          background: #0052cc;
          border-color: #ffffff;
          transform: translateY(-50%) scale(1.14);
        }

        .gallery-nav-arrow.prev {
          left: 14px;
        }

        .gallery-nav-arrow.next {
          right: 14px;
        }

        .gallery-top-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 18;
          pointer-events: none;
          background: linear-gradient(to bottom, rgba(2, 44, 122, 0.92) 0%, rgba(2, 44, 122, 0.45) 70%, transparent 100%);
          padding: 14px 18px 26px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .gallery-bottom-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 18;
          pointer-events: none;
          background: linear-gradient(to top, rgba(2, 12, 30, 0.96) 0%, rgba(2, 12, 30, 0.65) 65%, transparent 100%);
          padding: 28px 18px 14px;
          color: #ffffff;
        }

        .gallery-dot-btn {
          height: 8px;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          padding: 0;
          pointer-events: auto;
          transition: all 0.3s ease;
        }

        @media (max-width: 640px) {
          .office-gallery-stage {
            aspect-ratio: 16 / 10;
            min-height: 195px;
          }
          .gallery-nav-arrow {
            width: 36px;
            height: 36px;
          }
          .gallery-nav-arrow.prev {
            left: 8px;
          }
          .gallery-nav-arrow.next {
            right: 8px;
          }
          .gallery-top-bar {
            padding: 10px 12px 20px;
          }
          .gallery-bottom-bar {
            padding: 22px 12px 10px;
          }
        }

        @media (max-width: 380px) {
          .office-gallery-stage {
            aspect-ratio: 16 / 10.5;
            min-height: 185px;
          }
        }
      `}</style>

      <div className="office-gallery-stage" id="home-centre-photo-stage">
        {/* TOP BADGE BAR */}
        <div className="gallery-top-bar">
          {/* REAL OFFICE GALLERY BADGE */}
          <span
            id="real-office-gallery-badge"
            style={{
              background: '#fbbf24',
              color: '#022c7a',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '10.5px',
              fontWeight: 900,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              letterSpacing: '0.4px',
              boxShadow: '0 2px 8px rgba(251, 191, 36, 0.45)',
              pointerEvents: 'auto'
            }}
          >
            <Camera size={13} /> REAL OFFICE GALLERY
          </span>

          {/* DESK / LOCATION BADGE */}
          <span
            id="gallery-top-desk-tag"
            style={{
              background: 'rgba(255, 255, 255, 0.18)',
              color: '#86efac',
              padding: '4px 11px',
              borderRadius: '12px',
              fontSize: '10.5px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backdropFilter: 'blur(6px)',
              pointerEvents: 'auto'
            }}
          >
            <Building size={12} /> {current.desk}
          </span>
        </div>

        {/* HIGH DEFINITION REAL OFFICE IMAGE */}
        <img
          id="home-centre-hero-image"
          key={current.id}
          src={current.src}
          alt={`AkEsevai Gallery - ${current.title}`}
          className="office-gallery-img home-centre-hero-img"
        />

        {/* PREV NAVIGATION ARROW */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Office Photo"
          className="gallery-nav-arrow prev home-centre-slider-btn"
          id="gallery-prev-btn"
          title="Previous Photo"
        >
          <ChevronLeft size={22} />
        </button>

        {/* NEXT NAVIGATION ARROW */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Office Photo"
          className="gallery-nav-arrow next home-centre-slider-btn"
          id="gallery-next-btn"
          title="Next Photo"
        >
          <ChevronRight size={22} />
        </button>

        {/* BOTTOM INFO & METADATA OVERLAY */}
        <div className="gallery-bottom-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap', pointerEvents: 'auto' }}>
            {/* CAROUSEL IMAGE COUNTER (e.g. 1/3, 2/3, 3/3) */}
            <span
              id="gallery-image-counter"
              style={{
                background: '#16a34a',
                color: '#ffffff',
                padding: '3px 9px',
                borderRadius: '8px',
                fontSize: '10.5px',
                fontWeight: 900,
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.4)'
              }}
            >
              {currentIndex + 1} / {OFFICE_PHOTOS.length}
            </span>

            {/* LOCATION & DESK TAG */}
            <span
              id="gallery-desk-label"
              style={{
                color: '#fde047',
                fontSize: '11px',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <MapPin size={11} /> {current.location} • <strong id="gallery-desk-name" style={{ color: '#ffffff' }}>{current.desk}</strong>
            </span>
          </div>

          {/* IMAGE TITLE */}
          <div
            id="gallery-image-title"
            style={{
              fontSize: '15.5px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.3,
              textShadow: '0 2px 6px rgba(0,0,0,0.6)',
              pointerEvents: 'auto'
            }}
          >
            {current.title}
          </div>

          {/* IMAGE SUBTITLE */}
          <div
            id="gallery-image-subtitle"
            style={{
              fontSize: '12px',
              color: '#cbd5e1',
              fontWeight: 600,
              marginTop: '2px',
              pointerEvents: 'auto'
            }}
          >
            {current.subtitle}
          </div>
        </div>

        {/* BOTTOM RIGHT CAROUSEL DOT INDICATORS */}
        <div
          id="gallery-carousel-indicators"
          style={{
            position: 'absolute',
            bottom: '14px',
            right: '16px',
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
            zIndex: 35,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            padding: '4px 10px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            pointerEvents: 'auto'
          }}
        >
          {OFFICE_PHOTOS.map((photo, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Go to photo ${idx + 1}`}
                className="gallery-dot-btn home-centre-dot"
                style={{
                  width: isActive ? '24px' : '7px',
                  background: isActive
                    ? 'linear-gradient(90deg, #fbbf24 0%, #4ade80 100%)'
                    : 'rgba(255, 255, 255, 0.4)'
                }}
              />
            );
          })}
        </div>

        {/* PROGRESS TIMER BAR */}
        {isAutoPlaying && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'rgba(255, 255, 255, 0.2)',
              zIndex: 28
            }}
          >
            <div
              key={currentIndex}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #16a34a 0%, #38bdf8 50%, #fbbf24 100%)',
                animation: 'timerBarFill 5s linear forwards'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
