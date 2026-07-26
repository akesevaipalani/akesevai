import React, { useState, useEffect } from 'react';
import { Download, Smartphone, CheckCircle, X, Sparkles } from 'lucide-react';

export default function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (window.matchMedia?.('(display-mode: standalone)')?.matches || window.navigator?.standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('📱 உங்கள் உலாவியில் "Add to Home Screen" அல்லது "Install App" தேர்வு செய்து AkeSevai செயலியை மொபைலில் நிறுவிக் கொள்ளலாம்.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (dismissed || isInstalled) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 100%)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '16px',
      margin: '16px 0',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      gap: '14px',
      boxShadow: '0 10px 25px rgba(2, 44, 122, 0.25)',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Smartphone size={24} color="#fbbf24" />
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} /> AKESEVAI MOBILE APP
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700 }}>
            AkeSevai செயலியை உங்கள் மொபைலில் நிறுவிக் கொள்ளுங்கள்!
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            வேகமான டோக்கன் பதிவு & சான்றிதழ் நிலையை உடனுக்குடன் அறிய உதவும்.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={handleInstallClick}
          style={{
            background: '#fbbf24',
            color: '#022c7a',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 16px',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)'
          }}
        >
          <Download size={16} /> App நிறுவுக (Install App)
        </button>
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            opacity: 0.7,
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
