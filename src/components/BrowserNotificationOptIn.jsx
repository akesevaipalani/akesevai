import React, { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle2 } from 'lucide-react';

export default function BrowserNotificationOptIn() {
  const [permission, setPermission] = useState(() => {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });
  const [justGranted, setJustGranted] = useState(false);

  const handleRequest = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      setJustGranted(true);
      // Send a welcome notification immediately
      new Notification('AkEsevai 🔔', {
        body: 'வணக்கம்! உங்கள் சான்றிதழ் தயாரானதும் இங்கே தெரிவிப்போம்.',
        icon: '/logo.png',
        badge: '/logo.png',
      });
      setTimeout(() => setJustGranted(false), 5000);
    }
  };

  if (permission === 'unsupported') return null;
  if (permission === 'denied') return null;

  if (permission === 'granted') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '1.5px solid #86efac',
        borderRadius: '14px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginTop: '16px'
      }}>
        <CheckCircle2 size={20} color="#16a34a" />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#15803d' }}>
            🔔 அறிவிப்புகள் இயக்கப்பட்டுள்ளன!
          </div>
          <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>
            சான்றிதழ் தயாரானதும் உங்கள் browser-ல் உடனே தெரிவிக்கப்படும்.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
      border: '1.5px solid #fdba74',
      borderRadius: '14px',
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
      marginTop: '16px'
    }}>
      <Bell size={20} color="#ea580c" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: '#c2410c' }}>
          🔔 சான்றிதழ் Ready ஆனதும் அறிவிப்பு வேண்டுமா?
        </div>
        <div style={{ fontSize: '11px', color: '#9a3412', marginTop: '2px' }}>
          Browser notification enable பண்ணினால் — AkEsevai நேரடியாகத் தெரிவிக்கும்!
        </div>
      </div>
      <button
        onClick={handleRequest}
        style={{
          background: '#ea580c',
          color: 'white',
          border: 'none',
          borderRadius: '9px',
          padding: '9px 18px',
          fontSize: '12px',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(234,88,12,0.35)'
        }}
      >
        <Bell size={14} /> Enable Notification
      </button>
    </div>
  );
}
