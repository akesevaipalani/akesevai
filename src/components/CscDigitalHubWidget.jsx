import React, { useState, useEffect } from 'react';
import { Landmark, Users, Clock, QrCode, Smartphone, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Zap, Building2, Eye, X, Copy, Check } from 'lucide-react';
import { subscribeLiveQueue } from '../utils/dataService';
import { getOperationalStatus } from '../config/businessHours';

export default function CscDigitalHubWidget({ navigate }) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const [queueStatus, setQueueStatus] = useState(() => {
    const op = getOperationalStatus('ta');
    return {
      queueCount: '0 நபர்கள் (In Queue)',
      waitTime: '~ 0 நிமிடங்கள்',
      statusText: op.statusText,
      upiId: 'alakesh.kumar7@okhdfcbank'
    };
  });

  useEffect(() => {
    const unsubscribe = subscribeLiveQueue((cloudStatus) => {
      if (cloudStatus && Object.keys(cloudStatus).length > 0) {
        setQueueStatus(prev => ({ ...prev, ...cloudStatus }));
      }
    });
    return () => unsubscribe();
  }, []);

  const upiId = queueStatus.upiId || 'alakesh.kumar7@okhdfcbank';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(`upi://pay?pa=${upiId}&pn=AkEsevai%20Centre&am=50&cu=INR`)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="csc-hub-card-container">
      {/* HEADER SECTION */}
      <div className="csc-hub-header">
        <div className="csc-badge-pill">
          <Building2 size={15} /> DIGITAL INDIA • CSC & TNeGA DIGITAL HUB
        </div>
        <h3 className="csc-hub-title">
          டிஜிட்டல் இ-சேவை <span>மற்றும் CSC ஸ்மார்ட் மையம்</span>
        </h3>
        <p className="csc-hub-sub">
          நவீனத் தொழில்நுட்பத்துடன் இயங்கும் AkEsevai டிஜிட்டல் மையத்தின் நேரலை வசதிகள் மற்றும் பொதுமக்கள் சேவைகள்.
        </p>
      </div>

      {/* 3 HIGH-TECH CSC METRIC CARDS */}
      <div className="csc-metrics-grid">
        {/* CARD 1: LIVE QUEUE & TIME CLOCK (ADMIN CONTROLLABLE) */}
        <div className="csc-metric-card glow-border-blue">
          <div className="metric-header-row">
            <span className="live-status-dot" />
            <small>நேரலை மையம் கண்காணிப்பு / LIVE COUNTER</small>
          </div>
          <h4 className="metric-main-title">{queueStatus.statusText}</h4>
          <div className="live-clock-box">
            <div>
              <small>வரிசையில் உள்ளவர்கள்:</small>
              <strong>{queueStatus.queueCount}</strong>
            </div>
            <div>
              <small>காத்திருக்கும் நேரம்:</small>
              <strong style={{ color: '#16a34a' }}>{queueStatus.waitTime}</strong>
            </div>
          </div>
          <p className="metric-note">நேரில் வந்து காத்திருப்பதைத் தவிர்க்க இப்போதே டோக்கன் பதிவு செய்யுங்கள்.</p>
        </div>

        {/* CARD 2: WHATSAPP SELF-SERVICE */}
        <div className="csc-metric-card glow-border-green">
          <div className="metric-header-row">
            <Smartphone size={16} color="#25D366" />
            <small>வாட்ஸ்அப் சுய-சேவை / WHATSAPP BOT</small>
          </div>
          <h4 className="metric-main-title">WhatsApp 24x7 இ-சேவை</h4>
          <div className="whatsapp-cmd-list">
            <span className="cmd-chip">📲 <strong>"DOCS"</strong> -&gt; ஆவணம் அனுப்ப</span>
            <span className="cmd-chip">🎫 <strong>"TOKEN"</strong> -&gt; டோக்கன் பெற</span>
            <span className="cmd-chip">🔍 <strong>"STATUS"</strong> -&gt; சான்றிதழ் நிலை</span>
          </div>
          <a
            href="https://wa.me/919342318844?text=TOKEN"
            target="_blank"
            rel="noopener noreferrer"
            className="csc-wa-link-btn"
          >
            WhatsApp-ல் மெசேஜ் அனுப்ப (9342318844) <ArrowRight size={14} />
          </a>
        </div>

        {/* CARD 3: REAL SCAN & PAY QR CODE CARD */}
        <div className="csc-metric-card glow-border-gold">
          <div className="metric-header-row">
            <QrCode size={16} color="#d97706" />
            <small>தொடுதல் இல்லா கட்டணம் / NO-TOUCH PAY</small>
          </div>
          <h4 className="metric-main-title">UPI & Instant Scan QR</h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', border: '1px solid #fde68a', padding: '8px', borderRadius: '10px', margin: '6px 0 10px' }}>
            <img src={qrUrl} alt="AkEsevai Pay QR" style={{ width: '65px', height: '65px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setShowQrModal(true)} />
            <div>
              <strong style={{ display: 'block', fontSize: '12px', color: '#0f172a' }}>GPay / PhonePe / Paytm</strong>
              <small style={{ display: 'block', fontSize: '10px', color: '#16a34a', fontWeight: 700 }}>Scan QR to Pay ₹50</small>
              <button
                onClick={() => setShowQrModal(true)}
                style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#b45309', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, cursor: 'pointer', marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <Eye size={12} /> QR பெரியதாகக் காண
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f1f5f9', padding: '6px 10px', borderRadius: '6px' }}>
            <small style={{ fontSize: '10px', color: '#334155', fontWeight: 700 }}>{upiId}</small>
            <button onClick={handleCopyUpi} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#022c7a' }}>
              {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* CSC KEY SERVICES MATRIX */}
      <div className="csc-services-matrix">
        <h4 className="matrix-title">🌐 மையத்தில் கிடைக்கும் முதன்மை டிஜிட்டல் சேவைகள்:</h4>
        <div className="matrix-grid">
          <div className="matrix-item">
            <CheckCircle2 size={16} color="#16a34a" />
            <span>TNeGA அரசு சான்றிதழ்கள் ( வருமானம், சாதி, இருப்பிடம்)</span>
          </div>
          <div className="matrix-item">
            <CheckCircle2 size={16} color="#16a34a" />
            <span>ஆதார் முகவரி & பயோமெட்ரிக் புதுப்பித்தல்</span>
          </div>
          <div className="matrix-item">
            <CheckCircle2 size={16} color="#16a34a" />
            <span>ஸ்மார்ட் ரேஷன் கார்டு அச்சிடுதல் & பெயர் திருத்தம்</span>
          </div>
          <div className="matrix-item">
            <CheckCircle2 size={16} color="#16a34a" />
            <span>PM-Kisan & ஆயுஷ்மான் பாரத் மருத்துவ அட்டை</span>
          </div>
          <div className="matrix-item">
            <CheckCircle2 size={16} color="#16a34a" />
            <span>பாஸ்போர்ட் அப்பாயிண்ட்மெண்ட் & உடனடி e-PAN</span>
          </div>
          <div className="matrix-item">
            <CheckCircle2 size={16} color="#16a34a" />
            <span>TNPSC, காவலர் & போட்டித் தேர்வு விண்ணப்பங்கள்</span>
          </div>
        </div>
      </div>

      {/* QR MODAL POPUP DISPLAY */}
      {showQrModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'grid', placeItems: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '18px', padding: '28px', maxWidth: '360px', width: '100%', textAlign: 'center', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <button onClick={() => setShowQrModal(false)} style={{ position: 'absolute', top: '14px', right: '14px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
              <X size={18} />
            </button>

            <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>
              GPay / PhonePe / Paytm SCAN & PAY
            </span>

            <h3 style={{ font: '800 20px Manrope', color: '#022c7a', margin: '14px 0 6px' }}>AkEsevai Centre Pay</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px' }}>உங்கள் மொபைல் UPI ஆப் மூலம் ஸ்கேன் செய்து ₹50 செலுத்தவும்.</p>

            <img src={qrUrl} alt="UPI QR Code" style={{ width: '220px', height: '220px', border: '3px solid #0052cc', borderRadius: '12px', padding: '6px', background: 'white' }} />

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px', marginTop: '16px', fontSize: '12px' }}>
              <small style={{ color: '#64748b', display: 'block' }}>Target UPI ID:</small>
              <strong style={{ color: '#0f172a' }}>{upiId}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
