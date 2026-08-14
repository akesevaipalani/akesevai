import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const OFFICE_PHOTOS = [
  { id: 1, src: '/office1.jpg', anim: 'kenBurnsZoom' },
  { id: 2, src: '/office2.jpg', anim: 'panRightZoom' },
  { id: 3, src: '/office3.jpg', anim: 'gentleScale' }
];

export default function AkEsevaiOfficePhotoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slideKey, setSlideKey] = useState(0);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % OFFICE_PHOTOS.length);
    setSlideKey((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + OFFICE_PHOTOS.length) % OFFICE_PHOTOS.length);
    setSlideKey((prev) => prev + 1);
  };

  const goTo = (idx) => {
    setCurrentIndex(idx);
    setSlideKey((prev) => prev + 1);
  };

  const current = OFFICE_PHOTOS[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      style={{
        position: 'relative',
        width: '100%',
        margin: '24px 0',
        borderRadius: '24px',
        padding: '3px',
        background: 'linear-gradient(135deg, #0052cc 0%, #16a34a 50%, #fbbf24 100%)',
        boxShadow: '0 20px 50px rgba(0, 82, 204, 0.25)',
        overflow: 'hidden'
      }}
    >
      <style>{`
        @keyframes kenBurnsZoom {
          0% { opacity: 0; transform: scale(1.15); }
          15% { opacity: 1; }
          100% { opacity: 1; transform: scale(1.0); }
        }

        @keyframes panRightZoom {
          0% { opacity: 0; transform: scale(1.12) translateX(-20px); }
          15% { opacity: 1; }
          100% { opacity: 1; transform: scale(1.0) translateX(0); }
        }

        @keyframes gentleScale {
          0% { opacity: 0; transform: scale(0.95); }
          15% { opacity: 1; }
          100% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes timerBarFill {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        .clean-slider-btn {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          opacity: 0.7;
        }
        .clean-slider-btn:hover {
          opacity: 1;
          background: rgba(0, 82, 204, 0.9) !important;
          color: white !important;
          transform: translateY(-50%) scale(1.15) !important;
          boxShadow: 0 8px 20px rgba(0, 82, 204, 0.5) !important;
        }

        .dot-indicator {
          transition: all 0.3s ease;
        }
        .dot-indicator:hover {
          transform: scale(1.3);
        }
      `}</style>

      <div
        style={{
          position: 'relative',
          borderRadius: '22px',
          overflow: 'hidden',
          background: '#070a12',
          aspectRatio: '16/9',
          maxHeight: '480px'
        }}
      >
        {/* CLEAN HIGH DEFINITION IMAGE WITH DYNAMIC CSS ANIMATIONS */}
        <img
          key={slideKey}
          src={current.src}
          alt={`AkEsevai Office Slide ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            animation: `${current.anim} 4s cubic-bezier(0.25, 1, 0.5, 1) forwards`
          }}
        />

        {/* LEFT NAV ARROW BUTTON */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Photo"
          className="clean-slider-btn"
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            width: 44,
            height: 44,
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            zIndex: 20
          }}
        >
          <ChevronLeft size={24} />
        </button>

        {/* RIGHT NAV ARROW BUTTON */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Photo"
          className="clean-slider-btn"
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            width: 44,
            height: 44,
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            zIndex: 20
          }}
        >
          <ChevronRight size={24} />
        </button>

        {/* CLEAN DOT INDICATORS AT BOTTOM CENTER */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            zIndex: 20,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            padding: '6px 14px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {OFFICE_PHOTOS.map((photo, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="dot-indicator"
                style={{
                  width: isActive ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: isActive
                    ? 'linear-gradient(90deg, #4ade80 0%, #3b82f6 100%)'
                    : 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
            );
          })}
        </div>

        {/* AUTO SLIDE PROGRESS BAR */}
        {isAutoPlaying && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.2)', zIndex: 25 }}>
            <div
              key={slideKey}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #16a34a 0%, #3b82f6 50%, #fbbf24 100%)',
                animation: 'timerBarFill 4s linear forwards'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
