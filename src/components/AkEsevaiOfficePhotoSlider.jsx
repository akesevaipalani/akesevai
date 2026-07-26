import React, { useState, useEffect } from 'react';
import { Camera, ChevronLeft, ChevronRight, MapPin, Building } from 'lucide-react';

const OFFICE_PHOTOS = [
  {
    src: '/office1.jpg',
    title: '🏢 வாடிக்கையாளர் காத்திருப்பு அரங்கம்',
    subtitle: 'Customer Lounge & Reception',
    location: 'மில் ரோடு, சண்முகபுரம், பழனி'
  },
  {
    src: '/office2.jpg',
    title: '🖥️ நவீன கணினி & சேவை கவுண்டர்கள்',
    subtitle: 'Modern Workstation Counters',
    location: 'AkEsevai Digital Hub, Palani'
  },
  {
    src: '/office3.jpg',
    title: '👨‍💻 முதன்மை ஆபரேட்டர் சேவை மையம்',
    subtitle: 'Main Operator Counter Desk',
    location: 'AkEsevai Main Desk'
  }
];

export default function AkEsevaiOfficePhotoSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % OFFICE_PHOTOS.length);
        setFade(true);
      }, 250);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goTo = (idx) => {
    setFade(false);
    setTimeout(() => { setCurrentIndex(idx); setFade(true); }, 200);
  };

  const handleNext = () => goTo((currentIndex + 1) % OFFICE_PHOTOS.length);
  const handlePrev = () => goTo((currentIndex - 1 + OFFICE_PHOTOS.length) % OFFICE_PHOTOS.length);

  const current = OFFICE_PHOTOS[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(2,44,122,0.28)',
        position: 'relative',
        background: '#000',
        width: '100%',
      }}
    >
      {/* Top Label Bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        zIndex: 3,
        background: 'linear-gradient(to bottom, rgba(2,44,122,0.92) 0%, transparent 100%)',
        padding: '14px 18px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <span style={{
          background: '#fbbf24',
          color: '#022c7a',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '10px',
          fontWeight: 900,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          letterSpacing: '0.4px'
        }}>
          <Camera size={12} /> REAL OFFICE GALLERY
        </span>
        <span style={{
          background: 'rgba(255,255,255,0.15)',
          color: '#86efac',
          padding: '4px 10px',
          borderRadius: '10px',
          fontSize: '10px',
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          backdropFilter: 'blur(6px)'
        }}>
          <Building size={11} /> பழனி சண்முகபுரம்
        </span>
      </div>

      {/* LANDSCAPE PHOTO — 16:9 aspect ratio */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
        <img
          src={current.src}
          alt={current.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
            opacity: fade ? 1 : 0,
            transform: fade ? 'scale(1)' : 'scale(1.03)',
            transition: 'opacity 0.4s ease, transform 0.5s ease',
            filter: 'brightness(0.88)'
          }}
        />

        {/* Bottom info overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(2,12,30,0.96) 0%, rgba(2,12,30,0.5) 60%, transparent 100%)',
          padding: '28px 18px 16px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              background: '#16a34a', color: 'white',
              padding: '2px 8px', borderRadius: '8px',
              fontSize: '9px', fontWeight: 900
            }}>
              {currentIndex + 1} / {OFFICE_PHOTOS.length}
            </span>
            <span style={{ color: '#fbbf24', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={10} /> {current.location}
            </span>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', lineHeight: 1.3 }}>{current.title}</div>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginTop: '2px' }}>{current.subtitle}</div>
        </div>

        {/* Prev Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous"
          style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(2,44,122,0.75)',
            border: '1.5px solid rgba(255,255,255,0.25)',
            borderRadius: '50%',
            width: 38, height: 38,
            color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            transition: 'transform 0.2s ease',
            zIndex: 4
          }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next Arrow */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next"
          style={{
            position: 'absolute', right: '12px', top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(2,44,122,0.75)',
            border: '1.5px solid rgba(255,255,255,0.25)',
            borderRadius: '50%',
            width: 38, height: 38,
            color: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            transition: 'transform 0.2s ease',
            zIndex: 4
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot indicators */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 0',
        background: 'linear-gradient(135deg, #022c7a 0%, #0f172a 100%)'
      }}>
        {OFFICE_PHOTOS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Go to photo ${idx + 1}`}
            style={{
              width: idx === currentIndex ? '28px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: idx === currentIndex ? '#fbbf24' : 'rgba(255,255,255,0.3)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0
            }}
          />
        ))}
      </div>
    </div>
  );
}
