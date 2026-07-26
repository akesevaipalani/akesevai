import React, { useState, useEffect } from 'react';
import { Ticket, Printer, MessageCircle, Sparkles, CheckCircle2, ShieldCheck, QrCode, ArrowRight, Smartphone, Copy, ExternalLink, Award, FileText, Check, Lock, Download } from 'lucide-react';
import { saveApplicationRecord } from '../utils/statusStore';
import { printElement } from '../utils/printHelper';

export default function TokenPass({ defaultToken = null, onTokenSaved, initialName = '', initialPhone = '' }) {
  const [time, setTime] = useState(new Date());
  const [formData, setFormData] = useState({
    name: initialName,
    phone: initialPhone,
    service: 'Government Certificates (வருமானம், சாதி, இருப்பிடம்)',
    date: new Date().toISOString().split('T')[0],
    slot: '10:30 AM - 11:00 AM'
  });

  const [generatedToken, setGeneratedToken] = useState(defaultToken);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // GPay Payment Settlement Gate States
  const [isPendingGPay, setIsPendingGPay] = useState(false);
  const [gpayUtrInput, setGpayUtrInput] = useState('');
  const [isSettling, setIsSettling] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (initialName || initialPhone) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || initialName,
        phone: prev.phone || initialPhone
      }));
    }
  }, [initialName, initialPhone]);

  useEffect(() => {
    if (defaultToken) {
      setGeneratedToken(defaultToken);
    }
  }, [defaultToken]);

  const timeString = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateString = time.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('alakesh.kumar7@okhdfcbank');
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 3000);
  };

  // Continuous sequential token numbers (TOK-101, TOK-102, TOK-103...)
  const getNextSequentialTokenNo = () => {
    let maxId = 100;

    const storedLast = parseInt(localStorage.getItem('akesevai-last-token-id') || '100', 10);
    if (!isNaN(storedLast) && storedLast > maxId) {
      maxId = storedLast;
    }

    try {
      const bookings = JSON.parse(localStorage.getItem('akesevai-token-bookings') || '[]');
      bookings.forEach((t) => {
        if (t && t.tokenNo) {
          const num = parseInt(t.tokenNo.replace(/\D/g, ''), 10);
          if (!isNaN(num) && num > maxId) maxId = num;
        }
      });
    } catch (e) {}

    try {
      const apps = Object.values(JSON.parse(localStorage.getItem('akesevai-application-records') || '{}'));
      apps.forEach((a) => {
        if (a && a.tokenId) {
          const num = parseInt(a.tokenId.replace(/\D/g, ''), 10);
          if (!isNaN(num) && num > maxId) maxId = num;
        }
      });
    } catch (e) {}

    const nextId = maxId + 1;
    localStorage.setItem('akesevai-last-token-id', nextId.toString());
    return `TOK-${nextId}`;
  };

  // STEP 1: Proceed to GPay Payment Verification Gate
  const handleStartGPayPayment = (e) => {
    if (e) e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('⚠️ தயவுசெய்து உங்கள் பெயர் மற்றும் 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்!');
      return;
    }

    setIsPendingGPay(true);

    // Launch GPay / UPI Intent link on mobile
    const upiUrl = `upi://pay?pa=alakesh.kumar7@okhdfcbank&pn=AkEsevai%20Centre&am=50&cu=INR&tn=Token%20Booking%20${formData.name.trim()}`;
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      window.location.href = upiUrl;
    }
  };

  // STEP 2: Confirm GPay Payment Settlement & Generate Token Pass Slip ONLY AFTER Settle
  const handleConfirmGPaySettled = () => {
    setIsSettling(true);

    setTimeout(() => {
      const tokenNum = getNextSequentialTokenNo();
      const appId = `TN-AK-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const issuedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      const issuedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const finalUtr = gpayUtrInput.trim() || `GPAY-AK-${Math.floor(100000000000 + Math.random() * 900000000000)}`;

      const newTok = {
        tokenNo: tokenNum,
        customerName: formData.name.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        date: formData.date,
        slot: formData.slot,
        amount: 50,
        isPaid: true,
        transactionUtr: finalUtr,
        paymentMethod: 'Online UPI (GPay/PhonePe)',
        paymentStatus: '✅ ₹50 Paid Online (GPay Settled & Verified)',
        issuedAt,
        issuedDate,
        status: 'Token Active'
      };

      // Save to central statusStore
      saveApplicationRecord({
        id: appId,
        tokenId: tokenNum,
        applicantName: formData.name.trim(),
        phone: formData.phone.trim(),
        service: formData.service,
        fee: '₹50 (GPay Paid Online)',
        currentStage: 2,
        statusLabel: 'டோக்கன் பதிவு செய்யப்பட்டு மைய அனுமதி தயார் நிலையில் உள்ளது',
        remarks: `டோக்கன் எண் ${tokenNum} (${formData.date} - ${formData.slot}) ₹50 GPay ஆன்லைன் கட்டணம் செலுத்தப்பட்டு வெற்றிகரமாக ஒதுக்கப்பட்டது.`
      });

      setGeneratedToken(newTok);
      setIsPendingGPay(false);
      setIsSettling(false);

      // Push to Central API server for immediate cross-device sync
      try {
        fetch('/api/store', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'token', data: newTok })
        }).catch(() => {});
      } catch (e) {}

      if (typeof onTokenSaved === 'function') {
        onTokenSaved(newTok);
      }

      // Automatically Dispatch Professional WhatsApp PDF Slip
      setTimeout(() => {
        sendWhatsAppMessages(newTok);
      }, 1000);
    }, 800);
  };

  // STEP 3: Professional WhatsApp & Digital PDF Dispatch
  const sendWhatsAppMessages = (tok) => {
    const ADMIN_NUMBER = '919342318844';

    const customerMsg = `🧾 *AkEsevai - OFFICIAL DIGITAL TOKEN PASS (PDF RECEIPT)*
    
━━━━━━━━━━━━━━━━━━━━━
🎫 *TOKEN NO:* *${tok.tokenNo}*
👤 *APPLICANT:* ${tok.customerName}
📱 *MOBILE:* +91 ${tok.phone}
🛠️ *SERVICE:* ${tok.service}
📅 *VISIT DATE:* ${tok.date}
⏰ *TIME SLOT:* ${tok.slot}
━━━━━━━━━━━━━━━━━━━━━
💳 *PAYMENT SETTLEMENT STATUS:*
✅ *STATUS:* ${tok.paymentStatus}
💰 *FEE PAID:* ₹50.00 Online (GPay Settled)
🔖 *UPI UTR REF:* ${tok.transactionUtr}
🕐 *ISSUED AT:* ${tok.issuedAt} on ${tok.issuedDate}

📍 *LOCATION & COUNTER DESK:*
AkEsevai Digital Service Centre
Mill Road, Sanmugapuram, Palani - 624601
📞 Operator Desk: 93423 18844

📄 *DIGITAL VERIFICATION QR & PASS:*
Your appointment token pass is confirmed. Please present this PDF receipt at the counter.

நன்றி / Thank you! 🙏`;

    const adminMsg = `🔔 *GPay Amount Settled & New Token Pass Issued*

🎫 *Token No:* ${tok.tokenNo}
👤 *Applicant:* ${tok.customerName}
📱 *Mobile:* +91 ${tok.phone}
🛠️ *Service:* ${tok.service}
📅 *Date:* ${tok.date} (${tok.slot})
💰 *Settlement:* ${tok.paymentStatus}
🔖 *Ref UTR:* ${tok.transactionUtr}`;

    const customerPhone = tok.phone.replace(/\D/g, '').slice(-10);
    const customerWAUrl = `https://wa.me/91${customerPhone}?text=${encodeURIComponent(customerMsg)}`;
    const adminWAUrl = `https://wa.me/${ADMIN_NUMBER}?text=${encodeURIComponent(adminMsg)}`;

    window.open(customerWAUrl, '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      window.open(adminWAUrl, '_blank', 'noopener,noreferrer');
    }, 800);
  };

  return (
    <div className="token-generator-wrapper">
      {/* DIGITAL CLOCK & HEADER BANNER */}
      <div className="clock-banner-card">
        <div className="clock-live-pill">
          <span className="live-pulse-dot" /> LIVE TOKEN SERVER
        </div>
        <div className="digital-clock-display">{timeString}</div>
        <div className="current-date-display">{dateString}</div>
        <p className="clock-subtext">AkEsevai Digital Service Centre • Palani Appointment & Queue Management</p>
      </div>

      <div className="token-layout-grid">
        {/* TOKEN BOOKING FORM & GPAY SETTLEMENT GATE */}
        <div className="token-form-card">
          <div className="card-badge-header">
            <Ticket size={18} /> OFFICIAL TOKEN GENERATOR
          </div>
          <h3>டோக்கன் பெற / Book Appointment Token</h3>
          <p style={{ color: '#16a34a', fontWeight: 700 }}>GPay / PhonePe ₹50 கட்டணம் செலுத்தி உறுதி செய்த பின் தொடர் டோக்கன் சீட்டு பெறலாம்.</p>

          {!isPendingGPay ? (
            <form onSubmit={handleStartGPayPayment} className="token-form">
              <label>
                Full Name / பெயர் *
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </label>

              <label>
                Mobile Number / மொபைல் எண் *
                <input
                  type="tel"
                  required
                  maxLength="10"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                />
              </label>

              <label>
                Service Required / சேவை
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                >
                  <option>Government Certificates (வருமானம், சாதி, இருப்பிடம்)</option>
                  <option>Aadhaar Card Updates (ஆதார் திருத்தம்)</option>
                  <option>Smart Card Services (குடும்ப அட்டை)</option>
                  <option>Welfare Board Schemes (நலவாரியம்)</option>
                  <option>Passport / PAN Card Application</option>
                  <option>TNPSC / Exam Application Support</option>
                  <option>General Printing & Lamination</option>
                </select>
              </label>

              <div className="form-row-2">
                <label>
                  Visit Date / நாள்
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </label>

                <label>
                  Time Slot / நேரம்
                  <select
                    value={formData.slot}
                    onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                  >
                    <option>10:00 AM - 10:30 AM</option>
                    <option>10:30 AM - 11:00 AM</option>
                    <option>11:00 AM - 11:30 AM</option>
                    <option>11:30 AM - 12:00 PM</option>
                    <option>12:00 PM - 12:30 PM</option>
                    <option>02:00 PM - 02:30 PM</option>
                    <option>02:30 PM - 03:00 PM</option>
                    <option>03:00 PM - 03:30 PM</option>
                    <option>04:00 PM - 04:30 PM</option>
                    <option>04:30 PM - 05:00 PM</option>
                  </select>
                </label>
              </div>

              <button
                type="submit"
                className="button button-primary"
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)',
                  color: 'white',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(22,163,74,0.4)',
                  marginTop: '14px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '8px'
                }}
              >
                <Sparkles size={18} /> 💳 GPay கட்டணம் செலுத்தத் தொடரவும் (Proceed to GPay)
              </button>
            </form>
          ) : (
            /* GPAY SETTLEMENT VERIFICATION GATE STEP */
            <div style={{ background: '#f0fdf4', border: '2px solid #16a34a', padding: '20px', borderRadius: '16px', marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 900, fontSize: '16px', marginBottom: '10px' }}>
                <Lock size={20} color="#16a34a" /> 💳 GPay கட்டணச் சரிபார்ப்பு மையம் (Settlement Verification)
              </div>
              <p style={{ fontSize: '13px', color: '#166534', margin: '0 0 14px', lineHeight: 1.5, fontWeight: 700 }}>
                GPay / PhonePe செயலியில் ₹50 செலுத்திய பின்னரே உங்கள் அதிகாரப்பூர்வ டோக்கன் சீட்டு (Token Pass Slip) உருவாக்கப்படும்.
              </p>

              {/* QR CODE DISPLAY */}
              <div style={{ background: '#ffffff', border: '1.5px dashed #16a34a', padding: '14px', borderRadius: '12px', textAlign: 'center', marginBottom: '14px' }}>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=alakesh.kumar7@okhdfcbank&pn=AkEsevai%20Centre&am=50&cu=INR"
                  alt="₹50 UPI Payment QR Code"
                  style={{ width: '140px', height: '140px', display: 'block', margin: '0 auto' }}
                />
                <strong style={{ display: 'block', fontSize: '12px', color: '#15803d', fontWeight: 900, marginTop: '6px' }}>
                  SCAN & PAY ₹50 WITH ANY UPI APP
                </strong>
              </div>

              {/* UPI ID COPY BOX */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px', borderRadius: '8px', marginBottom: '14px' }}>
                <small style={{ fontSize: '11px', color: '#1e40af', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  GPay / PhonePe UPI ID: <span style={{ fontSize: '13px', fontWeight: 900, color: '#1d4ed8' }}>alakesh.kumar7@okhdfcbank</span>
                </small>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  style={{
                    background: copiedUpi ? '#16a34a' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {copiedUpi ? '✓ UPI ID Copy செய்யப்பட்டது!' : '📋 Copy UPI ID'}
                </button>
              </div>

              {/* UTR Input Optional */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#1f2937', marginBottom: '4px', display: 'block' }}>
                  GPay Transaction UTR / Ref No (விருப்பப்பட்டால்):
                </label>
                <input
                  type="text"
                  value={gpayUtrInput}
                  onChange={(e) => setGpayUtrInput(e.target.value)}
                  placeholder="எ.கா: 420819203810"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: 700, boxSizing: 'border-box' }}
                />
              </div>

              {/* CONFIRM SETTLEMENT BUTTON */}
              <button
                type="button"
                onClick={handleConfirmGPaySettled}
                disabled={isSettling}
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px',
                  width: '100%',
                  fontSize: '15px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)'
                }}
              >
                <CheckCircle2 size={18} /> {isSettling ? '⏳ சரிபார்க்கப்படுகிறது...' : '✅ GPay பணம் செலுத்திவிட்டேன் (Confirm Settlement & Get Token)'}
              </button>

              <button
                type="button"
                onClick={() => setIsPendingGPay(false)}
                style={{ background: 'transparent', color: '#64748b', border: 'none', width: '100%', marginTop: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                ← விவரங்களை மாற்ற / Edit Details
              </button>
            </div>
          )}
        </div>

        {/* 100% ULTRA PROFESSIONAL TOKEN SLIP DISPLAY PASS */}
        <div className="token-display-card">
          {generatedToken ? (
            <div id="token-print-area" className="official-pass-card" style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '2.5px solid #022c7a',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* TOP BRAND HEADER STRIP */}
              <div style={{
                background: 'linear-gradient(135deg, #022c7a 0%, #001a4d 100%)',
                color: 'white',
                padding: '18px 20px',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '11px', fontWeight: 800 }}>
                    <Award size={14} /> OFFICIAL E-SEVAI APPOINTMENT PASS (PDF RECEIPT)
                  </div>
                  <h3 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: 900, color: 'white' }}>
                    AkEsevai Digital Service Centre
                  </h3>
                  <small style={{ opacity: 0.85, fontSize: '11px' }}>Mill Road, Sanmugapuram, Palani - 624601 • 📞 93423 18844</small>
                </div>

                <div style={{
                  background: '#fbbf24',
                  color: '#022c7a',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(251,191,36,0.4)'
                }}>
                  <small style={{ display: 'block', fontSize: '9px', fontWeight: 900, letterSpacing: '0.5px' }}>TOKEN NO</small>
                  <strong style={{ fontSize: '22px', fontWeight: 900, display: 'block', lineHeight: 1 }}>{generatedToken.tokenNo}</strong>
                </div>
              </div>

              {/* WATERMARK EMBLEM */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(-20deg)',
                fontSize: '48px',
                fontWeight: 900,
                color: 'rgba(2, 44, 122, 0.04)',
                pointerEvents: 'none',
                whiteSpace: 'nowrap'
              }}>
                AkEsevai OFFICIAL
              </div>

              {/* SLIP DETAILS BODY */}
              <div style={{ padding: '20px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                  paddingBottom: '14px',
                  borderBottom: '1px dashed #cbd5e1'
                }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>APPLICANT NAME / பெயர்</span>
                    <strong style={{ display: 'block', fontSize: '15px', color: '#0f172a', fontWeight: 900 }}>{generatedToken.customerName}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>MOBILE / மொபைல்</span>
                    <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', fontWeight: 800 }}>+91 {generatedToken.phone}</strong>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '14px',
                  padding: '14px 0',
                  borderBottom: '1px dashed #cbd5e1'
                }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>SERVICE / சேவை</span>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#022c7a', fontWeight: 800 }}>{generatedToken.service}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>VISIT DATE & TIME / நேரம்</span>
                    <strong style={{ display: 'block', fontSize: '13px', color: '#d97706', fontWeight: 800 }}>{generatedToken.date} ({generatedToken.slot})</strong>
                  </div>
                </div>

                {/* PAYMENT STATUS BADGE */}
                <div style={{
                  background: '#f0fdf4',
                  border: '1.5px solid #86efac',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  margin: '14px 0',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <small style={{ fontSize: '10px', color: '#166534', fontWeight: 800, display: 'block' }}>PAYMENT STATUS (GPay ஆன்லைன் செலுத்தப்பட்டது)</small>
                    <strong style={{ fontSize: '13px', color: '#15803d', fontWeight: 900 }}>{generatedToken.paymentStatus}</strong>
                  </div>
                  <span style={{ background: '#16a34a', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
                    ₹50 SETTLED
                  </span>
                </div>

                {/* SCANNABLE QR CODE FOR COUNTER */}
                <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`AkEsevai Token: ${generatedToken.tokenNo}\nApplicant: ${generatedToken.customerName}\nService: ${generatedToken.service}\nStatus: ${generatedToken.paymentStatus}`)}`}
                    alt="Scannable Token QR Pass"
                    style={{ width: '130px', height: '130px', display: 'block', margin: '0 auto' }}
                  />
                  <small style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 800, marginTop: '6px' }}>
                    SCAN AT COUNTER FOR EXPRESS CHECK-IN
                  </small>
                </div>
              </div>

              {/* ACTION BUTTONS FOOTER — data-no-print hides these buttons when printing */}
              <div data-no-print="true" style={{
                background: '#f1f5f9',
                padding: '14px 20px',
                display: 'flex',
                gap: '10px',
                justify: 'space-between'
              }}>
                <button
                  type="button"
                  onClick={() => printElement('token-print-area')}
                  style={{
                    flex: 1,
                    background: '#ffffff',
                    color: '#022c7a',
                    border: '1.5px solid #022c7a',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={16} /> 📄 பதிவிறக்கு (Print / PDF)
                </button>

                <button
                  type="button"
                  onClick={() => sendWhatsAppMessages(generatedToken)}
                  style={{
                    flex: 1,
                    background: '#25D366',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)'
                  }}
                >
                  <MessageCircle size={16} /> 💬 WhatsApp PDF Pass
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-pass-placeholder" style={{ background: '#ffffff', border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '40px 20px', textAlign: 'center' }}>
              <Ticket size={52} color="#022c7a" style={{ margin: '0 auto 12px', opacity: 0.8 }} />
              <h4 style={{ color: '#022c7a', font: '800 16px Manrope' }}>உங்களின் டோக்கன் சீட்டு இங்கு தோன்றும்</h4>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, maxWidth: '320px', margin: '8px auto 0' }}>
                இடதுபுற படிவத்தில் விவரங்களை நிரப்பி <strong>GPay தொகையைச் செலுத்தி உறுதி செய்த பின் (Settlement Completed)</strong> உங்களின் அதிகாரப்பூர்வ PDF டோக்கன் சீட்டு உருவாக்கப்படும்.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
