import React, { useState } from 'react';
import { Send, CheckCircle2, MessageCircle, FileText, User } from 'lucide-react';
import { saveApplicationRecord } from '../utils/statusStore';

const QUICK_SERVICES = [
  'வருமானச் சான்றிதழ் (Income Cert)',
  'சாதிச் சான்றிதழ் (Community Cert)',
  'இருப்பிடச் சான்றிதழ் (Nativity Cert)',
  'முதல் பட்டதாரி சான்றிதழ் (First Graduate)',
  'ஆதார் முகவரி / மொபைல் மாற்றம்',
  'ஸ்மார்ட் ரேஷன் கார்டு',
  'பாஸ்போர்ட் அப்பாயிண்ட்மெண்ட்',
  'PAN கார்டு புதியது / திருத்தம்'
];

export default function SmartQuickApplicationHub({ notify, navigate }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(QUICK_SERVICES[0]);
  const [aadhaar, setAadhaar] = useState('');
  const [submittedAck, setSubmittedAck] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, '').length !== 10) {
      if (typeof notify === 'function') notify('⚠️ பெயர் மற்றும் 10 இலக்கச் சரியான மொபைல் எண்ணை உள்ளிடவும்.');
      return;
    }

    const ackNo = `TN-AK-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRecord = {
      id: ackNo,
      applicantName: name.trim(),
      phone: phone.trim(),
      aadhaarNo: aadhaar || 'XXXX XXXX 9842',
      service,
      fee: '₹60',
      currentStage: 2,
      statusLabel: 'ஆவணங்கள் பெறப்பட்டு பரிசீலனையில் (Documents Received)',
      remarks: `AkEsevai இணையதளம் வழியாக நேரடி விண்ணப்பப் பதிவு பெறப்பட்டது.`
    };

    saveApplicationRecord(newRecord);
    setSubmittedAck(newRecord);
    if (typeof notify === 'function') notify('🎉 விண்ணப்பம் பதிவு செய்யப்பட்டது! Admin விரைவில் தொடர்புகொள்வார்.');
  };

  const handleWhatsAppAlert = () => {
    if (!submittedAck) return;
    const msg = encodeURIComponent(
      `🏛️ *AkEsevai ஆன்லைன் விண்ணப்பப் பதிவு*\n\n` +
      `ஒப்புதல் எண்: *${submittedAck.id}*\n` +
      `பெயர்: *${submittedAck.applicantName}*\n` +
      `மொபைல்: *${submittedAck.phone}*\n` +
      `சேவை: *${submittedAck.service}*\n\n` +
      `வணக்கம்! எனது விண்ணப்பப் பதிவு பெறப்பட்டுள்ளது. அடுத்தகட்ட உதவி தேவை.`
    );
    window.open(`https://wa.me/919342318844?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #022c7a 0%, #1e3a8a 100%)',
      borderRadius: '20px',
      padding: '28px',
      color: 'white',
      marginTop: '28px',
      boxShadow: '0 12px 40px rgba(2, 44, 122, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
        <span style={{ background: '#4ade80', color: '#052e16', fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          ⚡ 1-CLICK EXPRESS REGISTRATION
        </span>
      </div>

      <h2 style={{ font: '800 22px Manrope', color: 'white', margin: '4px 0 6px' }}>
        உடனடி 1-கிளிக் இ-சேவை விண்ணப்பப் பதிவு 📝
      </h2>
      <p style={{ color: '#bfdbfe', fontSize: '12.5px', margin: '0 0 20px', maxWidth: '600px', lineHeight: 1.5 }}>
        நேரில் வர அவசியமில்லை! உங்கள் தகவல்களை உள்ளிடுங்கள் — உடனே ஒப்புதல் எண் (Acknowledgement ID) வழங்கப்படும்.
      </p>

      {submittedAck ? (
        <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
          <CheckCircle2 size={48} color="#4ade80" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '12px', color: '#86efac', fontWeight: 800 }}>விண்ணப்பப் பதிவு பெறப்பட்டது!</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#fef08a', fontFamily: 'Manrope', margin: '6px 0' }}>{submittedAck.id}</div>
          <div style={{ fontSize: '13px', color: '#e0f2fe', marginBottom: '18px' }}>
            விண்ணப்பதாரர்: <strong>{submittedAck.applicantName}</strong> | சேவை: <strong>{submittedAck.service}</strong>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleWhatsAppAlert}
              style={{ background: '#25D366', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(37,211,102,0.4)' }}
            >
              <MessageCircle size={17} /> WhatsApp-ல் அட்மினுக்கு அனுப்புக
            </button>
            <button
              onClick={() => setSubmittedAck(null)}
              style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '12px 20px', borderRadius: '10px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
            >
              புதிய விண்ணப்பம் செய்ய
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label htmlFor="quick-hub-applicant-name" style={{ fontSize: '11px', fontWeight: 700, color: '#93c5fd', display: 'block', marginBottom: '4px' }}>👤 விண்ணப்பதாரர் பெயர் *</label>
              <input
                id="quick-hub-applicant-name"
                name="applicant_name"
                autoComplete="name"
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="எ.கா: முருகன் K."
                style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label htmlFor="quick-hub-applicant-phone" style={{ fontSize: '11px', fontWeight: 700, color: '#93c5fd', display: 'block', marginBottom: '4px' }}>📞 கைபேசி எண் *</label>
              <input
                id="quick-hub-applicant-phone"
                name="applicant_phone"
                autoComplete="tel"
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit Mobile Number"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label htmlFor="quick-hub-service-select" style={{ fontSize: '11px', fontWeight: 700, color: '#93c5fd', display: 'block', marginBottom: '4px' }}>📋 சேவைத் தேர்வு *</label>
              <select
                id="quick-hub-service-select"
                name="service_selection"
                value={service}
                onChange={e => setService(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '10px', background: '#1e3a8a', color: 'white', fontSize: '13px', outline: 'none', cursor: 'pointer', boxSizing: 'border-box' }}
              >
                {QUICK_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '14px',
              background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)',
              color: '#052e16',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(74,222,128,0.35)',
              marginTop: '6px'
            }}
          >
            <Send size={16} /> உடனடி ஒப்புதல் எண் பெறுக (Generate Acknowledgement)
          </button>
        </form>
      )}
    </div>
  );
}
