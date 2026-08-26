import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Phone, Clock, MessageCircle, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

// AkEsevai Palani Mill Road Coordinates
const AKESEVAI_LAT = 10.4503;
const AKESEVAI_LNG = 77.5186;

export default function GoogleMapEmbed() {
  const [userDistance, setUserDistance] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Haversine formula to compute distance in Km between user GPS and AkEsevai
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1); // Return distance in km with 1 decimal
  };

  const handleDetectUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('உங்கள் உலாவியில் GPS இருப்பிட அனுமதி வசதி இல்லை.');
      return;
    }

    setLoadingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;
        const dist = calculateDistance(uLat, uLng, AKESEVAI_LAT, AKESEVAI_LNG);
        setUserDistance({
          km: dist,
          userLat: uLat,
          userLng: uLng
        });
        setLoadingLocation(false);
      },
      (err) => {
        setLoadingLocation(false);
        setLocationError('இருப்பிடத்தை அறிய முடியவில்லை. GPS அனுமதியை இயக்கவும்.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div style={{
      background: 'white',
      border: '2px solid #0052cc',
      borderRadius: '20px',
      overflow: 'hidden',
      marginTop: '28px',
      boxShadow: '0 10px 30px rgba(0,82,204,0.08)'
    }}>
      {/* HEADER STRIP */}
      <div style={{
        padding: '18px 24px',
        background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        flexWrap: 'wrap'
      }}>
        <div>
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fbbf24',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <MapPin size={14} /> LIVE GPS LOCATION • பழனி மையம்
          </span>
          <h3 style={{ font: '800 20px Manrope', margin: '6px 0 2px', color: 'white' }}>
            📍 AkEsevai மையத்தின் <span>துல்லியமான இடம் (Google Map Location)</span>
          </h3>
          <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>
            AK Esevai, Mill Rd, Sanmugapuram, Anna Nagar, Palani, Tamil Nadu 624601
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleDetectUserLocation}
            disabled={loadingLocation}
            style={{
              background: '#fbbf24',
              color: '#022c7a',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 16px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
            }}
          >
            <Compass size={16} />
            {loadingLocation ? 'GPS கணக்கிடப்படுகிறது...' : '🎯 என் தற்போதைய தொலைவு அறிதல்'}
          </button>

          <a
            href={
              userDistance
                ? `https://www.google.com/maps/dir/?api=1&origin=${userDistance.userLat},${userDistance.userLng}&destination=AK+Esevai%2C+Mill+Rd%2C+Sanmugapuram%2C+Anna+Nagar%2C+Palani%2C+Tamil+Nadu+624601`
                : `https://www.google.com/maps/search/?api=1&query=AK+Esevai%2C+Mill+Rd%2C+Sanmugapuram%2C+Anna+Nagar%2C+Palani%2C+Tamil+Nadu+624601`
            }
            target="_blank"
            rel="noreferrer"
            style={{
              background: '#4ade80',
              color: '#14532d',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(74,222,128,0.3)'
            }}
          >
            <Navigation size={16} /> வழி பெறுக (Get Route Directions)
          </a>
        </div>
      </div>

      {/* USER LIVE DISTANCE BADGE BANNER */}
      {userDistance && (
        <div style={{
          background: '#f0fdf4',
          borderBottom: '1px solid #bbf7d0',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#14532d', fontWeight: 800, fontSize: '13px' }}>
            <CheckCircle2 size={18} color="#16a34a" />
            <span>
              நீங்கள் AkEsevai மையத்திலிருந்து சுமார் <strong>{userDistance.km} km</strong> தொலைவில் உள்ளீர்கள்!
            </span>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${userDistance.userLat},${userDistance.userLng}&destination=AK+Esevai%2C+Mill+Rd%2C+Sanmugapuram%2C+Anna+Nagar%2C+Palani%2C+Tamil+Nadu+624601`}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#15803d',
              textDecoration: 'underline'
            }}
          >
            நேரடி வழியைப் பார்க்க (Open Live Route) ➔
          </a>
        </div>
      )}

      {locationError && (
        <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 24px', fontSize: '12px', fontWeight: 700 }}>
          ⚠️ {locationError}
        </div>
      )}

      {/* MAP EMBED WITH ACCURATE AKESEVAI PALANI PIN MARKER */}
      <div style={{ position: 'relative', height: '360px', background: '#f1f5f9' }}>
        <iframe
          title="AkEsevai Location Map"
          src="https://maps.google.com/maps?q=AK+Esevai%2C+Mill+Rd%2C+Sanmugapuram%2C+Anna+Nagar%2C+Palani%2C+Tamil+Nadu+624601&t=&z=17&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="360"
          style={{ border: 0, display: 'block' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        
        {/* OVERLAY BADGE ON MAP */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '2px solid #0052cc',
          borderRadius: '14px',
          padding: '10px 14px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          maxWidth: '280px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#0052cc', textTransform: 'uppercase' }}>
            📌 Marked Centre Location
          </div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
            AK Esevai Digital Service Centre
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            Mill Rd, Sanmugapuram, Anna Nagar, Palani, Tamil Nadu 624601
          </div>
        </div>
      </div>

      {/* BOTTOM INFO & WHATSAPP CONTACT STRIP */}
      <div style={{ padding: '16px 24px', background: '#f8fafc', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '13px', color: '#374151' }}>
            <span style={{ fontWeight: 800 }}>📞 அழைப்பு:</span>{' '}
            <a href="tel:9342318844" style={{ color: '#0052cc', fontWeight: 800, textDecoration: 'none' }}>93423 18844</a>
          </div>
          <div style={{ fontSize: '13px', color: '#374151' }}>
            <span style={{ fontWeight: 800 }}>⏰ நேரம்:</span>{' '}
            <span style={{ color: '#374151', fontWeight: 700 }}>திங்கள் - சனி (10:00 AM – 8:00 PM)</span>
          </div>
          <div style={{ fontSize: '13px', color: '#374151' }}>
            <span style={{ fontWeight: 800 }}>🚌 லேண்ட்மார்க்:</span>{' '}
            <span style={{ color: '#374151', fontWeight: 700 }}>பழனி பஸ் ஸ்டாண்டிலிருந்து 500m</span>
          </div>
        </div>

        <a
          href="https://wa.me/919342318844?text=வணக்கம்%20AkEsevai,%20உங்கள்%20மையத்தின்%20இருப்பிட%20வழிகாட்டுதல்%20தேவை."
          target="_blank"
          rel="noreferrer"
          style={{
            background: '#25D366',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '12px',
            fontWeight: 800,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 3px 10px rgba(37,211,102,0.3)'
          }}
        >
          <MessageCircle size={15} /> 💬 WhatsApp வழிகாட்டுதல்
        </a>
      </div>
    </div>
  );
}
