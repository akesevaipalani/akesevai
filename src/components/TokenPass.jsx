import React, { useState, useEffect } from 'react';
import { Ticket, Printer, MessageCircle, Sparkles, CheckCircle2, ShieldCheck, QrCode, ArrowRight, Smartphone, Copy, ExternalLink, Award, FileText, Check, Download } from 'lucide-react';
import { saveApplicationRecord } from '../utils/statusStore';
import { saveTokenBookingCloud } from '../utils/firebaseService';
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

  // Direct Instant Token Booking Handler
  const handleGenerateToken = (e) => {
    if (e) e.preventDefault();

    if (!formData.name.trim()) {
      alert('⚠️ தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்!');
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      alert('⚠️ தயவுசெய்து 10 இலக்கச் சரியான மொபைல் எண்ணை உள்ளிடவும்!');
      return;
    }

    const tokenNum = getNextSequentialTokenNo();
    const appId = `TN-AK-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const issuedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const issuedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const newTok = {
      tokenNo: tokenNum,
      customerName: formData.name.trim(),
      phone: cleanPhone,
      service: formData.service,
      date: formData.date,
      slot: formData.slot,
      amount: 60,
      paymentStatus: '✅ டோக்கன் உறுதி செய்யப்பட்டது (Confirmed)',
      issuedAt,
      issuedDate,
      status: 'Token Active'
    };

    // Save locally
    saveApplicationRecord({
      id: appId,
      tokenId: tokenNum,
      applicantName: formData.name.trim(),
      phone: cleanPhone,
      service: formData.service,
      fee: '₹60',
      currentStage: 2,
      statusLabel: 'டோக்கன் பதிவு செய்யப்பட்டு அனுமதி தயார் நிலையில் உள்ளது',
      remarks: `டோக்கன் எண் ${tokenNum} (${formData.date} - ${formData.slot}) வெற்றிகரமாக உருவாக்கப்பட்டது.`
    });

    // Save to Firebase Cloud Firestore
    saveTokenBookingCloud(newTok);

    setGeneratedToken(newTok);

    if (typeof onTokenSaved === 'function') {
      onTokenSaved(newTok);
    }
  };

  // Send Direct WhatsApp Slip Notification
  const sendWhatsAppMessages = (tok) => {
    if (!tok) return;

    const customerMsg = `🧾 *AkEsevai - OFFICIAL DIGITAL TOKEN SLIP*
    
━━━━━━━━━━━━━━━━━━━━━
🎫 *TOKEN NO:* *${tok.tokenNo}*
👤 *APPLICANT:* ${tok.customerName}
📱 *MOBILE:* +91 ${tok.phone}
🛠️ *SERVICE:* ${tok.service}
📅 *VISIT DATE:* ${tok.date}
⏰ *TIME SLOT:* ${tok.slot}
━━━━━━━━━━━━━━━━━━━━━
✅ *STATUS:* ${tok.paymentStatus}
🕐 *ISSUED AT:* ${tok.issuedAt} on ${tok.issuedDate}

📍 *LOCATION & COUNTER DESK:*
AkEsevai Digital Service Centre
Mill Road, Sanmugapuram, Palani - 624601
📞 Operator Desk: 93423 18844

நன்றி / Thank you! 🙏`;

    const customerPhone = tok.phone.replace(/\D/g, '').slice(-10);
    const customerWAUrl = `https://wa.me/91${customerPhone}?text=${encodeURIComponent(customerMsg)}`;
    window.open(customerWAUrl, '_blank', 'noopener,noreferrer');
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
        {/* TOKEN BOOKING FORM */}
        <div className="token-form-card">
          <div className="card-badge-header">
            <Ticket size={18} /> OFFICIAL TOKEN GENERATOR
          </div>
          <h3>டோக்கன் பெற / Book Appointment Token</h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 16px' }}>
            விவரங்களை உள்ளிட்டு உடனுக்குடன் டோக்கன் சீட்டு பெறலாம்.
          </p>

          <form onSubmit={handleGenerateToken} className="token-form">
            <label>
              Full Name / பெயர் *
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="எ.கா: கந்தசாமி K."
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
                background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 100%)',
                color: 'white',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,82,204,0.4)',
                marginTop: '14px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={18} /> 🎫 டோக்கன் சீட்டு பெறுக (Get Token Slip)
            </button>
          </form>
        </div>

        {/* 100% ULTRA PROFESSIONAL INSTANT TOKEN SLIP DISPLAY */}
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
                    <Award size={14} /> OFFICIAL E-SEVAI APPOINTMENT PASS
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
                  <strong style={{ fontSize: '24px', fontWeight: 900, display: 'block', lineHeight: 1 }}>{generatedToken.tokenNo}</strong>
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
                    <span className="token-lbl" style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>APPLICANT NAME / பெயர்</span>
                    <strong className="token-val-name" style={{ display: 'block', fontSize: '16px', color: '#0f172a', fontWeight: 900 }}>{generatedToken.customerName}</strong>
                  </div>
                  <div>
                    <span className="token-lbl" style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>MOBILE / மொபைல்</span>
                    <strong className="token-val-phone" style={{ display: 'block', fontSize: '14px', color: '#0f172a', fontWeight: 800 }}>+91 {generatedToken.phone}</strong>
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
                    <span className="token-lbl" style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>SERVICE / சேவை</span>
                    <strong className="token-service-val" style={{ display: 'block', fontSize: '13px', color: '#022c7a', fontWeight: 800 }}>{generatedToken.service}</strong>
                  </div>
                  <div>
                    <span className="token-lbl" style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>VISIT DATE & TIME / நேரம்</span>
                    <strong className="token-datetime-val" style={{ display: 'block', fontSize: '13px', color: '#d97706', fontWeight: 800 }}>{generatedToken.date} ({generatedToken.slot})</strong>
                  </div>
                </div>

                {/* STATUS BADGE */}
                <div className="token-status-box" style={{
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
                    <small className="token-lbl" style={{ fontSize: '10px', color: '#166534', fontWeight: 800, display: 'block' }}>TOKEN STATUS (டோக்கன் நிலை)</small>
                    <strong className="token-status-val" style={{ fontSize: '13.5px', color: '#15803d', fontWeight: 900 }}>{generatedToken.paymentStatus}</strong>
                  </div>
                  <span style={{ background: '#16a34a', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
                    ACTIVE
                  </span>
                </div>

                {/* SCANNABLE QR CODE FOR COUNTER */}
                <div className="token-qr-box" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`AkEsevai Token: ${generatedToken.tokenNo}\nApplicant: ${generatedToken.customerName}\nService: ${generatedToken.service}\nStatus: ${generatedToken.paymentStatus}`)}`}
                    alt="Scannable Token QR Pass"
                    style={{ width: '130px', height: '130px', display: 'block', margin: '0 auto' }}
                  />
                  <small className="token-qr-subtext" style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 800, marginTop: '6px' }}>
                    SCAN AT COUNTER FOR EXPRESS CHECK-IN
                  </small>
                </div>
              </div>

              {/* ACTION BUTTONS FOOTER — data-no-print hides these buttons when printing PDF */}
              <div data-no-print="true" style={{
                background: '#f1f5f9',
                padding: '14px 20px',
                display: 'flex',
                gap: '10px',
                justify: 'space-between',
                flexWrap: 'wrap'
              }}>
                <button
                  type="button"
                  onClick={() => printElement('token-print-area')}
                  style={{
                    flex: 1,
                    minWidth: '140px',
                    background: '#022c7a',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(2, 44, 122, 0.3)'
                  }}
                >
                  <Download size={16} /> 🖨️ PDF / பதிவிறக்குக (Download PDF)
                </button>

                <button
                  type="button"
                  onClick={() => sendWhatsAppMessages(generatedToken)}
                  style={{
                    flex: 1,
                    minWidth: '140px',
                    background: '#25D366',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
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
                  <MessageCircle size={16} /> 📲 WhatsApp-ல் அனுப்ப (Send WA)
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-pass-placeholder" style={{ background: '#ffffff', border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '40px 20px', textAlign: 'center' }}>
              <Ticket size={52} color="#022c7a" style={{ margin: '0 auto 12px', opacity: 0.8 }} />
              <h4 style={{ color: '#022c7a', font: '800 16px Manrope' }}>உங்களின் டோக்கன் சீட்டு இங்கு தோன்றும்</h4>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, maxWidth: '320px', margin: '8px auto 0' }}>
                இடதுபுற படிவத்தில் விவரங்களை நிரப்பி <strong>"🎫 டோக்கன் சீட்டு பெறுக"</strong> பொத்தானைக் கிளிக் செய்தவுடன் டோக்கன் உடனடியாக உருவாக்கப்படும்.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
