import React, { useEffect, useState } from 'react';
import { adminFullBodyData, customerFullBodyData, shopStreetBgData } from '../assets/characterData';
import { makeImageTransparent } from '../utils/transparentImage';

export default function FirstTimeLoginModal({ isOpen, customerName, onClose }) {
  const [adminImgSrc, setAdminImgSrc] = useState(adminFullBodyData);
  const [customerImgSrc, setCustomerImgSrc] = useState(customerFullBodyData);

  useEffect(() => {
    if (!isOpen) return;

    // Process transparent cutouts of 3D Pixar figures in Canvas
    makeImageTransparent(adminFullBodyData).then(setAdminImgSrc);
    makeImageTransparent(customerFullBodyData).then(setCustomerImgSrc);

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([100, 50, 100]); } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        background: '#030712',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      {/* Top Action Buttons: ✕ Close & தொடரவும் / Continue */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); if (typeof onClose === 'function') onClose(); }}
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          ✕ Close
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); if (typeof onClose === 'function') onClose(); }}
          style={{
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '20px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          தொடரவும் / Continue ➔
        </button>
      </div>
      {/* 1. 3D PALANI E-SEVAI SHOP STREET BACKGROUND */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${shopStreetBgData})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        filter: 'brightness(0.95) contrast(1.1)',
        transform: 'scale(1.02)'
      }} />

      {/* 2. AMBIENT CINEMATIC OVERLAY */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center 60%, transparent 45%, rgba(3, 7, 18, 0.7) 100%)',
        pointerEvents: 'none',
        zIndex: 2
      }} />

      {/* 3. ROAD PAVEMENT ANIMATION STAGE (POSITIONED FIRMLY ON THE GROUND ROAD) */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '1200px',
        height: '100vh',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: '25px'
      }}>

        {/* LEFT: 3D PIXAR ADMIN OFFICER WALKING ON THE ROAD */}
        <div
          className="esevai-pixar-officer-walk"
          style={{
            position: 'absolute',
            left: 'calc(50% - 190px)',
            bottom: '25px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 12
          }}
        >
          <img
            src={adminImgSrc}
            alt="3D Admin Officer"
            style={{
              height: '420px',
              maxHeight: '52vh',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.85))',
              border: 'none',
              background: 'transparent'
            }}
          />
          <div className="esevai-pixar-shadow" />
        </div>

        {/* CENTER: 3D HANDSHAKE & GOLD CERTIFICATE PASS (🤝 & 📜) */}
        <div style={{
          position: 'absolute',
          left: '50%',
          bottom: '220px',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30,
          pointerEvents: 'none'
        }}>
          {/* 3D Handshake Aura Gesture */}
          <div
            className="esevai-handshake-badge"
            style={{
              fontSize: '52px',
              filter: 'drop-shadow(0 0 25px #fbbf24) drop-shadow(0 10px 20px rgba(0,0,0,0.9))',
              transformOrigin: 'center center'
            }}
          >
            🤝
          </div>

          {/* 3D Gold Certificate Transfer */}
          <div
            className="esevai-cert-pass-handover"
            style={{
              marginTop: '10px',
              fontSize: '58px',
              filter: 'drop-shadow(0 0 35px #fde047) drop-shadow(0 15px 30px rgba(0,0,0,0.9))'
            }}
          >
            📜
          </div>
        </div>

        {/* RIGHT: 3D PIXAR CUSTOMER WALKING ALONG THE ROAD */}
        <div
          className="esevai-pixar-customer-walk"
          style={{
            position: 'absolute',
            right: 'calc(50% - 190px)',
            bottom: '25px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 12
          }}
        >
          <img
            src={customerImgSrc}
            alt="3D Customer"
            style={{
              height: '420px',
              maxHeight: '52vh',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.85))',
              border: 'none',
              background: 'transparent'
            }}
          />
          <div className="esevai-pixar-shadow" />
        </div>

      </div>
    </div>
  );
}
