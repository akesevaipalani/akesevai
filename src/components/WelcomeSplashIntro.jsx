import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Store, MapPin, ArrowRight, CheckCircle2, Award } from 'lucide-react';

export default function WelcomeSplashIntro() {
  const [showSplash, setShowSplash] = useState(true);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [steppingInside, setSteppingInside] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 50);

    // 1. Open 3D glass doors at 0.6 seconds
    const timerOpenDoors = setTimeout(() => {
      setDoorsOpen(true);
    }, 600);

    // 2. Step inside shop interior at 1.4 seconds
    const timerStepInside = setTimeout(() => {
      setSteppingInside(true);
    }, 1400);

    // 3. Fade out splash screen at 3.2 seconds
    const timerFadeOut = setTimeout(() => {
      setFadeOut(true);
    }, 3200);

    // 4. Complete splash transition at 3.8 seconds
    const timerUnmount = setTimeout(() => {
      setShowSplash(false);
    }, 3800);

    return () => {
      clearInterval(interval);
      clearTimeout(timerOpenDoors);
      clearTimeout(timerStepInside);
      clearTimeout(timerFadeOut);
      clearTimeout(timerUnmount);
    };
  }, []);

  const handleSkip = () => {
    setDoorsOpen(true);
    setSteppingInside(true);
    setFadeOut(true);
    setTimeout(() => setShowSplash(false), 400);
  };

  if (!showSplash) return null;

  return (
    <div className={`shop-welcome-overlay ${fadeOut ? 'shop-fade-out' : ''}`}>
      <div className={`shop-building-viewport ${steppingInside ? 'camera-step-inside' : ''}`}>
        
        {/* SHOP SIGNBOARD */}
        <div className="shop-front-signboard">
          <div className="shop-sign-content">
            <span className="shop-badge"><Store size={14} /> AKESEVAI DIGITAL SERVICE CENTRE</span>
            <h1 className="shop-sign-title">
              Ak <span className="gold-text">e-Sevai</span> Centre
            </h1>
            <p className="shop-sign-location">
              <MapPin size={12} /> Mill Road, Sanmugapuram, Palani - 624601
            </p>
          </div>
        </div>

        {/* 3D STOREFRONT & GLASS DOORS */}
        <div className="shop-doorframe-3d">
          
          {/* STORE INTERIOR REVEALED BEHIND DOORS */}
          <div className="shop-interior-room">
            <div className="interior-ambient-light" />
            
            <div className="shop-interior-card">
              <div className="interior-welcome-badge">
                <Sparkles size={16} color="#f59e0b" />
                <span>WELCOME CUSTOMER</span>
              </div>
              <h2 className="interior-greeting-title">
                🌸 AkEsevai சேவை மையத்திற்கு அன்புடன் வரவேற்கிறோம்! 🌸
              </h2>
              <p className="interior-subtitle">
                உங்கள் சான்றிதழ்கள், ஆதார் & ஆன்லைன் சேவைகள் உடனுக்குடன் பெறத் தயார்!
              </p>

              <div className="interior-feature-chips">
                <span><CheckCircle2 size={13} color="#22c55e" /> ஆதார் சேவைகள்</span>
                <span><CheckCircle2 size={13} color="#22c55e" /> பட்டா & வருமான சான்றிதழ்</span>
                <span><CheckCircle2 size={13} color="#22c55e" /> போட்டோ பிரிண்டிங்</span>
                <span><Award size={13} color="#3b82f6" /> 100% நம்பகமானது</span>
              </div>

              <div className="shop-progress-wrap">
                <div className="shop-progress-bar">
                  <div className="shop-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <small className="shop-loading-note">
                  <ShieldCheck size={13} /> கடை கதவுகள் திறக்கப்படுகிறது... ({progress}%)
                </small>
              </div>
            </div>
          </div>

          {/* LEFT 3D GLASS DOOR */}
          <div className={`glass-door door-left ${doorsOpen ? 'doors-open-left' : ''}`}>
            <div className="door-glass-pane">
              <div className="door-reflection" />
              <div className="door-handle handle-left" />
              <div className="door-sticker">
                <span>WELCOME</span>
                <strong>வருக!</strong>
              </div>
            </div>
          </div>

          {/* RIGHT 3D GLASS DOOR */}
          <div className={`glass-door door-right ${doorsOpen ? 'doors-open-right' : ''}`}>
            <div className="door-glass-pane">
              <div className="door-reflection" />
              <div className="door-handle handle-right" />
              <div className="door-sticker">
                <span>ENTRANCE</span>
                <strong>திறந்துள்ளது</strong>
              </div>
            </div>
          </div>

        </div>

        {/* CLICK TO ENTER IMMEDIATELY */}
        <button className="enter-shop-btn" onClick={handleSkip}>
          <span>🚪 கடைக்கு உள் செல்லவும் (Enter Shop)</span> <ArrowRight size={15} />
        </button>

      </div>
    </div>
  );
}

