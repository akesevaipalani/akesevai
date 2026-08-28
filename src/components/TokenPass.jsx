import React, { useState, useEffect, useRef } from 'react';
import { Ticket, Printer, MessageCircle, Sparkles, CheckCircle2, ShieldCheck, QrCode, ArrowRight, Smartphone, Copy, ExternalLink, Award, FileText, Check, Download, Trash2, Clock3, AlertCircle, RefreshCw, X } from 'lucide-react';
import { saveApplicationRecord } from '../utils/statusStore';
import { requestTokenBookingCloud, checkDuplicateUtrCloud, subscribeTokens, deleteTokenBookingCloud, fetchTokensByPhoneCloud, subscribeLiveQueue } from '../utils/dataService';
import { printElement } from '../utils/printHelper';
import { APPOINTMENT_TIME_SLOTS } from '../config/businessHours';

export default function TokenPass({ defaultToken = null, onTokenSaved, onTokenDeleted, initialName = '', initialPhone = '' }) {
  const [time, setTime] = useState(new Date());
  const [formData, setFormData] = useState({
    name: initialName,
    phone: initialPhone,
    service: 'Government Certificates (வருமானம், சாதி, இருப்பிடம்)',
    date: new Date().toISOString().split('T')[0],
    slot: APPOINTMENT_TIME_SLOTS[0] || '10:00 AM - 11:00 AM'
  });

  const [generatedToken, setGeneratedToken] = useState(defaultToken);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [activeUpiId, setActiveUpiId] = useState('alakesh.kumar7-1@okicici');

  useEffect(() => {
    const unsubQueue = subscribeLiveQueue((cloudStatus) => {
      if (cloudStatus && cloudStatus.upiId) {
        setActiveUpiId(cloudStatus.upiId);
      }
    });
    return () => {
      if (typeof unsubQueue === 'function') unsubQueue();
    };
  }, []);

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
      const todayStr = new Date().toISOString().split('T')[0];
      const isToday = defaultToken.date === todayStr;
      const isVerified = (defaultToken.paymentStatus === 'VERIFIED' || String(defaultToken.status || '').includes('VERIFIED')) && Boolean(defaultToken.tokenNo);

      if (isToday && isVerified) {
        setGeneratedToken((prev) => {
          if (!prev && !defaultToken) return prev;
          if (prev && defaultToken && (prev.id === defaultToken.id || prev.tokenNo === defaultToken.tokenNo) && prev.paymentStatus === defaultToken.paymentStatus) {
            return prev;
          }
          return defaultToken;
        });
      } else {
        setGeneratedToken(null);
      }
    }
  }, [defaultToken]);

  const syncedKeyRef = useRef('');
  const dismissedTokenIdRef = useRef('');

  // Auto-restore today's token status (Pending / Verified / Rejected) on page refresh or phone entry
  useEffect(() => {
    const rawPhone = formData.phone || initialPhone || '';
    const cleanPhone = String(rawPhone).replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) return;
    if (generatedToken) return;

    const todayStr = new Date().toISOString().split('T')[0];

    const restoreActiveToken = async () => {
      try {
        const matchingTokens = await fetchTokensByPhoneCloud(cleanPhone, todayStr);
        if (Array.isArray(matchingTokens) && matchingTokens.length > 0) {
          // Sort by latest action timestamp (updatedAt or createdAt) descending
          matchingTokens.sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt || 0) -
              new Date(a.updatedAt || a.createdAt || 0)
          );

          const found = matchingTokens[0];
          const foundKey = String(found.id || found.utr || found.tokenNo || '');

          if (dismissedTokenIdRef.current && dismissedTokenIdRef.current === foundKey) {
            return;
          }

          setGeneratedToken(found);
          if (found.tokenNo && found.paymentStatus === 'VERIFIED' && typeof onTokenSaved === 'function') {
            onTokenSaved(found);
          }
        }
      } catch (err) {
        console.warn('Token auto-restore lookup notice:', err);
      }
    };

    restoreActiveToken();
  }, [formData.phone, initialPhone, generatedToken]);

  // Real-time synchronization: if current token is pending, listen for Admin Verification
  useEffect(() => {
    if (!generatedToken || (generatedToken.tokenNo && generatedToken.paymentStatus === 'VERIFIED')) return;

    const targetId = generatedToken.id || generatedToken.tokenNo;
    const targetUtr = generatedToken.utr;
    const targetPhone = String(generatedToken.phone || formData.phone || initialPhone || '').replace(/\D/g, '').slice(-10);

    const syncFoundToken = (found) => {
      if (!found) return;
      const isComplete = Boolean(found.tokenNo || found.paymentStatus === 'VERIFIED' || found.paymentStatus === 'REJECTED');
      if (isComplete) {
        setGeneratedToken(prev => {
          if (prev && prev.tokenNo === found.tokenNo && prev.paymentStatus === found.paymentStatus && prev.status === found.status) {
            return prev;
          }
          return found;
        });

        const syncKey = `${found.id || ''}_${found.tokenNo || ''}_${found.paymentStatus || ''}`;
        if (syncedKeyRef.current !== syncKey) {
          syncedKeyRef.current = syncKey;
          if (found.tokenNo && found.paymentStatus === 'VERIFIED' && typeof onTokenSaved === 'function') {
            setTimeout(() => {
              try { onTokenSaved(found); } catch (e) {}
            }, 0);
          }
        }
      }
    };

    const handleDataChanged = async () => {
      try {
        const raw = localStorage.getItem('akesevai-token-bookings');
        if (raw) {
          const list = JSON.parse(raw);
          const found = list.find(t => (t.id && t.id === targetId) || (t.utr && targetUtr && t.utr === targetUtr));
          if (found && (found.tokenNo || found.paymentStatus === 'VERIFIED' || found.paymentStatus === 'REJECTED')) {
            syncFoundToken(found);
            return;
          }
        }
        if (targetPhone) {
          const cloudTokens = await fetchTokensByPhoneCloud(targetPhone);
          if (Array.isArray(cloudTokens)) {
            const found = cloudTokens.find(t => (t.id && t.id === targetId) || (t.utr && targetUtr && t.utr === targetUtr));
            if (found) syncFoundToken(found);
          }
        }
      } catch (e) {}
    };

    const intervalTimer = setInterval(handleDataChanged, 2000);
    window.addEventListener('akesevai-data-changed', handleDataChanged);
    window.addEventListener('storage', handleDataChanged);

    return () => {
      clearInterval(intervalTimer);
      window.removeEventListener('akesevai-data-changed', handleDataChanged);
      window.removeEventListener('storage', handleDataChanged);
    };
  }, [generatedToken?.id, generatedToken?.utr]);

  const handleDeleteToken = async () => {
    const targetTokenNo = generatedToken?.tokenNo || generatedToken?.id;
    if (!targetTokenNo) return;
    const confirmDelete = window.confirm(
      `⚠️ உங்கள் டோக்கன் சீட்டை (${targetTokenNo}) நிச்சயமாக ரத்து செய்து நீக்க விரும்புகிறீர்களா?\n\n(Are you sure you want to cancel and delete your active token slip ${targetTokenNo}?)`
    );
    if (!confirmDelete) return;

    if (typeof onTokenDeleted === 'function') {
      try {
        onTokenDeleted(targetTokenNo);
      } catch (err) {}
    } else {
      try {
        await deleteTokenBookingCloud(targetTokenNo, generatedToken.phone || formData.phone);
      } catch (err) {}
    }

    dismissedTokenIdRef.current = String(targetTokenNo || '');
    setGeneratedToken(null);
    alert(`🗑️ டோக்கன் பதிவு வெற்றிகரமாக ரத்து செய்யப்பட்டது. (Token cancelled & deleted)`);
  };

  const timeString = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateString = time.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  // Step 1: Validate Form & Open Payment Modal
  const handleInitiateTokenPayment = (e) => {
    if (e) e.preventDefault();

    if (!formData.name.trim()) {
      alert('⚠️ தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்!');
      return;
    }
    const cleanPhone = String(formData.phone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      alert('⚠️ தயவுசெய்து 10 இலக்கச் சரியான மொபைல் எண்ணை உள்ளிடவும்!');
      return;
    }

    setPaymentError('');
    setShowPaymentModal(true);
  };

  // Step 2: Customer Submits UTR for Verification (Status: PENDING_VERIFICATION)
  const handleConfirmPaymentAndGenerate = async () => {
    setPaymentError('');
    const cleanUtr = String(utrNumber || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (!cleanUtr) {
      setPaymentError('⚠️ தயவுசெய்து உங்கள் UPI UTR / பரிவர்த்தனை எண்ணை உள்ளிடவும்.');
      return;
    }

    if (cleanUtr.length < 6) {
      setPaymentError('⚠️ சரியான 12-இலக்க UPI UTR எண்ணை உள்ளிடவும்.');
      return;
    }

    setPaymentLoading(true);

    // 1. Anti-Duplicate UTR Check
    try {
      const isDuplicate = await checkDuplicateUtrCloud(cleanUtr);
      if (isDuplicate) {
        setPaymentError(`⚠️ இந்த UTR எண் (${cleanUtr}) ஏற்கனவே பயன்படுத்தப்பட்டுள்ளது! ஒருமுறை பயன்படுத்திய UTR-ஐ மீண்டும் பயன்படுத்த முடியாது. (Duplicate UTR).`);
        setPaymentLoading(false);
        return;
      }
    } catch (e) {
      console.warn('UTR duplicate check error:', e);
    }

    const cleanPhone = String(formData.phone || '').replace(/\D/g, '');
    const issuedAt = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const issuedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    // Build Token Payment Request (No Token Number yet!)
    const tokenRequest = {
      customerName: formData.name.trim(),
      phone: cleanPhone,
      service: formData.service,
      date: formData.date,
      slot: formData.slot,
      amount: 50,
      paymentStatus: 'PENDING_VERIFICATION',
      status: 'PAYMENT PENDING',
      utr: cleanUtr,
      issuedAt,
      issuedDate
    };

    try {
      const savedToken = await requestTokenBookingCloud(tokenRequest);
      setGeneratedToken(savedToken || tokenRequest);
      setShowPaymentModal(false);
      setPaymentLoading(false);
      setUtrNumber('');
      // Gating: onTokenSaved is NOT called for PENDING_VERIFICATION.
      // onTokenSaved is only called by the real-time sync listener once the token is strictly VERIFIED with a valid backend tokenNo.
    } catch (err) {
      setPaymentError(`❌ பிழை: ${err.message || 'கட்டணத்தை சமர்ப்பிக்க முடியவில்லை'}`);
      setPaymentLoading(false);
    }
  };

  const sendWhatsAppMessages = (tok) => {
    if (!tok) return;

    const customerMsg = `🧾 *AkEsevai - OFFICIAL DIGITAL TOKEN SLIP*
    
━━━━━━━━━━━━━━━━━━━━━
🎫 *TOKEN NO:* *${tok.tokenNo || 'VERIFICATION PENDING'}*
👤 *APPLICANT:* ${tok.customerName}
📱 *MOBILE:* +91 ${tok.phone}
🛠️ *SERVICE:* ${tok.service}
📅 *VISIT DATE:* ${tok.date}
⏰ *TIME SLOT:* ${tok.slot}
━━━━━━━━━━━━━━━━━━━━━
✅ *STATUS:* ${tok.paymentStatus}
🕐 *ISSUED AT:* ${tok.issuedAt || ''} on ${tok.issuedDate || tok.date}

📍 *LOCATION & COUNTER DESK:*
AkEsevai Digital Service Centre
Mill Road, Sanmugapuram, Palani - 624601
📞 Operator Desk: 93423 18844

நன்றி / Thank you! 🙏`;

    const customerPhone = String(tok.phone || '').replace(/\D/g, '').slice(-10);
    const customerWAUrl = `https://wa.me/91${customerPhone}?text=${encodeURIComponent(customerMsg)}`;
    window.open(customerWAUrl, '_blank', 'noopener,noreferrer');
  };

  const currentToken = (generatedToken && generatedToken.token) ? generatedToken.token : generatedToken;
  const isVerified = Boolean(
    currentToken &&
    (currentToken.paymentStatus === 'VERIFIED' || String(currentToken.paymentStatus || '').includes('PAID') || String(currentToken.status || '').includes('VERIFIED')) &&
    currentToken.tokenNo
  );
  const isRejected = Boolean(
    currentToken &&
    (currentToken.paymentStatus === 'REJECTED' || String(currentToken.status || '').includes('REJECTED'))
  );
  const isPending = Boolean(
    currentToken &&
    !isVerified &&
    !isRejected &&
    (currentToken.paymentStatus === 'PENDING_VERIFICATION' || String(currentToken.status || '').includes('PENDING') || currentToken.utr)
  );

  return (
    <div className="token-generator-wrapper">
      <div className="clock-banner-card">
        <div className="clock-live-pill">
          <span className="live-pulse-dot" /> LIVE TOKEN SERVER
        </div>
        <div className="digital-clock-display">{timeString}</div>
        <div className="current-date-display">{dateString}</div>
        <p className="clock-subtext">AkEsevai Digital Service Centre • Palani Appointment & Queue Management (10:00 AM – 8:00 PM)</p>
      </div>

      <div className="token-layout-grid">
        {/* TOKEN BOOKING FORM */}
        <div className="token-form-card">
          <div className="card-badge-header">
            <Ticket size={18} /> OFFICIAL TOKEN GENERATOR
          </div>
          <h3>முன்னுரிமை டோக்கன் பதிவு / Book Priority Token</h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 16px' }}>
            ₹50 கட்டணம் செலுத்தி UTR எண்ணைப் பதிவிடவும். சரிபார்க்கப்பட்டதும் முன்னுரிமை டோக்கன் சீட்டு வழங்கப்படும்.
          </p>

          <form onSubmit={handleInitiateTokenPayment} className="token-form">
            <label htmlFor="token-input-name">
              Full Name / பெயர் *
              <input
                id="token-input-name"
                name="applicant_name"
                autoComplete="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="எ.கா: கந்தசாமி K."
              />
            </label>

            <label htmlFor="token-input-phone">
              Mobile Number / மொபைல் எண் *
              <input
                id="token-input-phone"
                name="applicant_phone"
                autoComplete="tel"
                type="tel"
                required
                maxLength="10"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="10-digit mobile number"
              />
            </label>

            <label htmlFor="token-select-service">
              Service Required / சேவை
              <select
                id="token-select-service"
                name="token_service"
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
              <label htmlFor="token-input-date">
                Visit Date / நாள்
                <input
                  id="token-input-date"
                  name="token_date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </label>

              <label htmlFor="token-select-slot">
                Time Slot / நேரம் (10 AM - 8 PM)
                <select
                  id="token-select-slot"
                  name="token_slot"
                  value={formData.slot}
                  onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                >
                  {APPOINTMENT_TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </label>
            </div>

            <button
              id="token-submit-pay-btn"
              type="submit"
              className="button button-primary"
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
                color: 'white',
                padding: '14px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(22,163,74,0.4)',
                marginTop: '14px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={18} /> 🎫 டோக்கன் கட்டணம் செலுத்துக (₹50)
            </button>
          </form>
        </div>

        {/* TOKEN SLIP DISPLAY / PENDING / REJECTED VIEW */}
        <div className="token-display-card">
          {/* CASE 1: VERIFIED TOKEN SLIP WITH QR CODE */}
          {isVerified && (
            <div id="token-verified-pass-card" className="official-pass-card" style={{
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
                justifyContent: 'space-between',
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
                  <strong style={{ fontSize: '24px', fontWeight: 900, display: 'block', lineHeight: 1 }}>{currentToken.tokenNo}</strong>
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
                    <strong className="token-val-name" style={{ display: 'block', fontSize: '16px', color: '#0f172a', fontWeight: 900 }}>{currentToken.customerName}</strong>
                  </div>
                  <div>
                    <span className="token-lbl" style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>MOBILE / மொபைல்</span>
                    <strong className="token-val-phone" style={{ display: 'block', fontSize: '14px', color: '#0f172a', fontWeight: 800 }}>+91 {currentToken.phone}</strong>
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
                    <strong className="token-service-val" style={{ display: 'block', fontSize: '13px', color: '#022c7a', fontWeight: 800 }}>{currentToken.service}</strong>
                  </div>
                  <div>
                    <span className="token-lbl" style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>VISIT DATE & TIME / நேரம்</span>
                    <strong className="token-datetime-val" style={{ display: 'block', fontSize: '13px', color: '#d97706', fontWeight: 800 }}>{currentToken.date} ({currentToken.slot})</strong>
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
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <small className="token-lbl" style={{ fontSize: '10px', color: '#166534', fontWeight: 800, display: 'block' }}>TOKEN STATUS (டோக்கன் நிலை)</small>
                    <strong className="token-status-val" style={{ fontSize: '13.5px', color: '#15803d', fontWeight: 900 }}>
                      ✅ VERIFIED (₹50 PAID) • UTR: {currentToken.utr || 'CONFIRMED'}
                    </strong>
                  </div>
                  <span style={{ background: '#16a34a', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
                    ACTIVE
                  </span>
                </div>

                {/* SCANNABLE QR CODE FOR COUNTER */}
                <div className="token-qr-box" style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`AkEsevai Token: ${currentToken.tokenNo}\nApplicant: ${currentToken.customerName}\nService: ${currentToken.service}\nStatus: VERIFIED\nUTR: ${currentToken.utr}`)}`}
                    alt="Scannable Token QR Pass"
                    style={{ width: '130px', height: '130px', display: 'block', margin: '0 auto' }}
                  />
                  <small className="token-qr-subtext" style={{ display: 'block', fontSize: '10px', color: '#64748b', fontWeight: 800, marginTop: '6px' }}>
                    SCAN AT COUNTER FOR EXPRESS CHECK-IN
                  </small>
                </div>
              </div>

              {/* ACTION BUTTONS FOOTER */}
              <div data-no-print="true" style={{
                background: '#f1f5f9',
                padding: '14px 20px',
                display: 'flex',
                gap: '10px',
                justifyContent: 'space-between',
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
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Printer size={15} /> பிரிண்ட் / PDF
                </button>

                <button
                  type="button"
                  onClick={() => sendWhatsAppMessages(currentToken)}
                  style={{
                    flex: 1,
                    minWidth: '140px',
                    background: '#25D366',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <MessageCircle size={15} /> WhatsApp ரசீது
                </button>

                <button
                  type="button"
                  onClick={handleDeleteToken}
                  style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: '1px solid #fca5a5',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={15} /> ரத்து செய்
                </button>
              </div>
            </div>
          )}

          {/* CASE 2: PAYMENT PENDING VERIFICATION (NO TOKEN NUMBER GENERATED YET) */}
          {isPending && (
            <div id="token-pending-card" style={{
              background: '#fffbeb',
              border: '2px solid #f59e0b',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(245,158,11,0.15)'
            }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
                <Clock3 size={28} />
              </div>
              <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 900, letterSpacing: '0.5px' }}>
                PAYMENT SUBMITTED • AWAITING VERIFICATION
              </span>
              <h3 style={{ margin: '10px 0 6px', fontSize: '18px', color: '#92400e', fontWeight: 900 }}>
                ⏳ கட்டணம் சரிபார்ப்பில் உள்ளது
              </h3>
              <p style={{ fontSize: '13px', color: '#78350f', lineHeight: 1.5, margin: '0 0 16px' }}>
                உங்கள் ₹50 கட்டண விவரம் (UTR: <strong>{currentToken.utr}</strong>) சமர்ப்பிக்கப்பட்டுள்ளது. AkEsevai நிர்வாகி சரிபார்த்தவுடன் உங்கள் அதிகாரப்பூர்வ டோக்கன் எண் தானாக இங்கு தோன்றும்.
              </p>

              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #fde68a', padding: '14px', textAlign: 'left', marginBottom: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12.5px' }}>
                  <div><span style={{ color: '#64748b' }}>பெயர்:</span> <strong>{currentToken.customerName}</strong></div>
                  <div><span style={{ color: '#64748b' }}>மொபைல்:</span> <strong>+91 {currentToken.phone}</strong></div>
                  <div><span style={{ color: '#64748b' }}>சேவை:</span> <strong>{currentToken.service}</strong></div>
                  <div><span style={{ color: '#64748b' }}>தேதி & நேரம்:</span> <strong>{currentToken.date} ({currentToken.slot})</strong></div>
                  <div><span style={{ color: '#64748b' }}>தொகை:</span> <strong style={{ color: '#16a34a' }}>₹50.00</strong></div>
                  <div><span style={{ color: '#64748b' }}>UTR No:</span> <strong style={{ color: '#022c7a' }}>{currentToken.utr}</strong></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const targetPhone = String(generatedToken?.phone || formData.phone || initialPhone || '').replace(/\D/g, '').slice(-10);
                      const phoneTokens = targetPhone ? await fetchTokensByPhoneCloud(targetPhone) : [];
                      const targetId = generatedToken?.id || generatedToken?.tokenNo;
                      const targetUtr = generatedToken?.utr;
                      if (Array.isArray(phoneTokens)) {
                        const found = phoneTokens.find(t => (t.id && t.id === targetId) || (t.utr && targetUtr && t.utr === targetUtr));
                        if (found) {
                          setGeneratedToken(found);
                          if (found.tokenNo && found.paymentStatus === 'VERIFIED' && typeof onTokenSaved === 'function') {
                            onTokenSaved(found);
                          }
                        }
                      }
                    } catch (e) {}
                    window.dispatchEvent(new Event('akesevai-data-changed'));
                  }}
                  style={{
                    background: '#022c7a',
                    color: 'white',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={14} /> நிலையைச் சரிபார்க்க (Refresh Status)
                </button>
                <button
                  type="button"
                  onClick={handleDeleteToken}
                  style={{
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: '1px solid #fca5a5',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  பதிவை ரத்து செய் (Cancel Request)
                </button>
              </div>
            </div>
          )}

          {/* CASE 3: PAYMENT REJECTED VIEW */}
          {isRejected && (
            <div id="token-rejected-card" style={{
              background: '#fef2f2',
              border: '2px solid #f87171',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(220,38,38,0.15)'
            }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
                <AlertCircle size={28} />
              </div>
              <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 900, letterSpacing: '0.5px' }}>
                PAYMENT REJECTED
              </span>
              <h3 style={{ margin: '10px 0 6px', fontSize: '18px', color: '#991b1b', fontWeight: 900 }}>
                ❌ கட்டணம் நிராகரிக்கப்பட்டது
              </h3>
              <p style={{ fontSize: '13px', color: '#7f1d1d', lineHeight: 1.5, margin: '0 0 16px' }}>
                காரணம்: <strong>{currentToken.rejectionReason || 'தவறான UTR அல்லது கட்டணம் பெறப்படவில்லை.'}</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  dismissedTokenIdRef.current = String(currentToken?.id || currentToken?.utr || 'dismissed');
                  setGeneratedToken(null);
                  setShowPaymentModal(true);
                }}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🔄 சரியான UTR உடன் மீண்டும் முயற்சிக்கவும்
              </button>
            </div>
          )}

          {/* CASE 4: EMPTY / INITIAL STATE */}
          {!generatedToken && (
            <div className="token-preview-placeholder" style={{
              background: '#f8fafc',
              border: '2px dashed #cbd5e1',
              borderRadius: '16px',
              padding: '48px 20px',
              textAlign: 'center'
            }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#e0f2fe', color: '#0052cc', display: 'grid', placeItems: 'center', margin: '0 auto 14px' }}>
                <Ticket size={28} />
              </div>
              <h4 style={{ margin: '0 0 6px', fontSize: '16px', color: '#0f172a' }}>டோக்கன் சீட்டு தயார் நிலை</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                இடதுபுற படிவத்தில் உங்கள் விவரங்களை உள்ளிட்டு ₹50 கட்டணம் செலுத்துங்கள்.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECURE PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="token-modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'grid',
          placeItems: 'center',
          zIndex: 99999,
          padding: '16px'
        }}>
          <div className="token-modal-card" style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            animation: 'modalSlideUp 0.25s ease'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #022c7a 0%, #001a4d 100%)',
              color: 'white',
              padding: '18px 22px',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24', letterSpacing: '0.5px' }}>
                  🔒 SECURE PRIORITY PAYMENT GATEWAY
                </span>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: '14px' }}
                >
                  <X size={16} />
                </button>
              </div>
              <h3 style={{ margin: '6px 0 0', fontSize: '18px', fontWeight: 900, color: 'white' }}>
                முன்னுரிமை டோக்கன் கட்டணம் (Token Fee)
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#bfdbfe' }}>
                ₹50 செலுத்திய பின் UTR எண்ணைப் பதிவிடவும்.
              </p>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px' }}>
              {/* Summary Box */}
              <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>விண்ணப்பதாரர்:</span>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>{formData.name} (+91 {formData.phone})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>சேவை & நேரம்:</span>
                  <span style={{ fontSize: '12px', color: '#0f172a', fontWeight: 700 }}>{formData.date} ({formData.slot})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #cbd5e1' }}>
                  <strong style={{ fontSize: '13px', color: '#022c7a' }}>செலுத்த வேண்டிய தொகை:</strong>
                  <strong style={{ fontSize: '20px', color: '#16a34a', fontWeight: 900 }}>₹50.00</strong>
                </div>
              </div>

              {/* QR Code and UPI ID */}
              <div style={{ textAlign: 'center', background: '#f0fdf4', border: '1.5px dashed #86efac', borderRadius: '14px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ width: '120px', height: '120px', margin: '0 auto 8px', background: '#ffffff', padding: '6px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=${activeUpiId}&pn=AkEsevai%20Palani&am=50&cu=INR&tn=AkEsevai%20Token%20Fee`)}`}
                    alt="UPI QR Code"
                    style={{ width: '100%', height: '100%', display: 'block' }}
                  />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  📱 GPay / PhonePe / Paytm மூலம் ₹50 ஸ்கேன் செய்யவும்
                </span>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', padding: '4px 10px', borderRadius: '6px' }}>
                  <code style={{ color: '#166534', fontSize: '12px', fontWeight: 800 }}>
                    {activeUpiId}
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activeUpiId);
                      setCopiedUpi(true);
                      setTimeout(() => setCopiedUpi(false), 2000);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803d', display: 'flex', alignItems: 'center' }}
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              {/* UTR / Reference Input */}
              <div style={{ marginBottom: '14px' }}>
                <label htmlFor="token-modal-utr-input" style={{ fontSize: '11px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  UPI TRANSACTION ID / 12-DIGIT UTR NO *
                </label>
                <input
                  id="token-modal-utr-input"
                  name="utr_number"
                  autoComplete="off"
                  type="text"
                  required
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  placeholder="எ.கா: 402839482910 (12-digit UTR)"
                  style={{ width: '100%', padding: '10px 12px', border: paymentError ? '2px solid #ef4444' : '1.5px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {paymentError && (
                <div id="token-modal-error" style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
                  {paymentError}
                </div>
              )}

              {/* Confirm Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                <button
                  id="token-modal-cancel-btn"
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '12px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}
                >
                  ரத்து (Cancel)
                </button>
                <button
                  id="token-modal-submit-btn"
                  type="button"
                  disabled={paymentLoading}
                  onClick={handleConfirmPaymentAndGenerate}
                  style={{
                    background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '13px',
                    fontWeight: 900,
                    cursor: paymentLoading ? 'wait' : 'pointer',
                    boxShadow: '0 4px 14px rgba(22,163,74,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {paymentLoading ? '⏳ சரிபார்க்கிறது...' : '✅ UTR சமர்ப்பிக்க (Submit for Verification)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
