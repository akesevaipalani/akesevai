import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Landmark } from 'lucide-react';

export default function WelcomeSplashIntro() {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth progress bar fill
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 60);

    // Trigger fade-out after 2.2 seconds
    const timer1 = setTimeout(() => {
      setFadeOut(true);
    }, 2200);

    // Remove splash overlay after fade animation completes
    const timer2 = setTimeout(() => {
      setShowSplash(false);
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!showSplash) return null;

  return (
    <div className={`welcome-splash-overlay ${fadeOut ? 'splash-fade-out' : ''}`}>
      <div className="splash-card">
        {/* GLOWING AMBIENT BACKGROUND ORBS */}
        <div className="splash-orb orb-1" />
        <div className="splash-orb orb-2" />

        <div className="splash-logo-container">
          <img src="/logo.png" alt="AkEsevai Logo" className="splash-logo-img" />
          <div className="splash-pulse-ring" />
        </div>

        <div className="splash-text-group">
          <span className="splash-kicker">
            <Sparkles size={14} /> WELCOME TO
          </span>
          <h1 className="splash-brand-title">
            Ak <span className="green-accent">e-Sevai</span> Centre
          </h1>
          <p className="splash-tamil-tagline">
            உங்கள் நம்பிக்கைக்குரிய இ-சேவை மையம் • பழனி
          </p>
        </div>

        {/* PROGRESS BAR & LOADER */}
        <div className="splash-loader-wrap">
          <div className="splash-progress-track">
            <div className="splash-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <small className="splash-loading-text">
            <ShieldCheck size={13} /> டிஜிட்டல் சேவைகள் தயாராகிறது... {progress}%
          </small>
        </div>
      </div>
    </div>
  );
}
