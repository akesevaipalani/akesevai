import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ChevronRight } from 'lucide-react';

// Document requirements keyed by service
const SERVICE_DOCS = {
  'வருமானச் சான்றிதழ் (Income Certificate)': ['ஆதார் அட்டை', 'குடும்ப அட்டை (Smart Card)', 'சம்பளச் சான்று / வங்கி பாஸ்புக்', 'பாஸ்போர்ட் புகைப்படம்'],
  'சாதிச் சான்றிதழ் (Community Certificate)': ['ஆதார் அட்டை', 'குடும்ப அட்டை (Smart Card)', 'பள்ளி TC / பெற்றோர் சாதிச் சான்று', 'பாஸ்போர்ட் புகைப்படம்'],
  'இருப்பிடச் சான்றிதழ் (Nativity Certificate)': ['ஆதார் அட்டை', 'குடும்ப அட்டை (Smart Card)', 'முகவரி சான்று (EB Bill / Voter ID)', 'பாஸ்போர்ட் புகைப்படம்'],
  'ஆதார் மொபைல் மாற்றம்': ['ஆதார் அட்டை அசல்', 'இணைக்க வேண்டிய மொபைல் எண்'],
  'புதிய குடும்ப அட்டை (Smart Card)': ['அனைத்து குடும்ப உறுப்பினர் ஆதார்', 'முகவரி சான்று', 'பாஸ்போர்ட் புகைப்படம்'],
  'பாஸ்போர்ட் (Passport)': ['ஆதார் அட்டை', 'பிறப்புச் சான்று', 'முகவரி சான்று', 'பாஸ்போர்ட் புகைப்படம்'],
  'புதிய வாக்காளர் அட்டை (Voter Card)': ['ஆதார் அட்டை', 'வயது சான்று', 'முகவரி சான்று', 'பாஸ்போர்ட் புகைப்படம்'],
  'முதல் பட்டதாரி சான்றிதழ் (First Graduate)': ['ஆதார் அட்டை', 'குடும்ப அட்டை (Smart Card)', 'பட்டப்படிப்பு சான்றிதழ்', 'சகோதர கல்வி அறிக்கை'],
  'வேலைவாய்ப்பு பதிவு (Employment)': ['ஆதார் அட்டை', 'கல்விச் சான்றிதழ்கள்', 'சாதிச் சான்று (if applicable)', 'பாஸ்போர்ட் புகைப்படம்'],
  'e-SHRAM CARD': ['ஆதார் அட்டை', 'வங்கி பாஸ்புக்', 'மொபைல் எண்'],
  'முதியோர் / விதவை ஓய்வூதியம் (Pension)': ['ஆதார் அட்டை', 'குடும்ப அட்டை (Smart Card)', 'வங்கி பாஸ்புக்', 'வயது சான்று'],
  'PAN CARD': ['ஆதார் அட்டை', 'பிறப்புச் சான்று', 'பாஸ்போர்ட் புகைப்படம்'],
};

const ALL_DOCS = [
  'ஆதார் அட்டை', 'ஆதார் அட்டை அசல்', 'குடும்ப அட்டை (Smart Card)',
  'சம்பளச் சான்று / வங்கி பாஸ்புக்', 'வங்கி பாஸ்புக்', 'பாஸ்போர்ட் புகைப்படம்',
  'முகவரி சான்று (EB Bill / Voter ID)', 'முகவரி சான்று', 'வயது சான்று',
  'பள்ளி TC / பெற்றோர் சாதிச் சான்று', 'சாதிச் சான்று (if applicable)',
  'கல்விச் சான்றிதழ்கள்', 'பட்டப்படிப்பு சான்றிதழ்', 'சகோதர கல்வி அறிக்கை',
  'வங்கி பாஸ்புக்', 'பிறப்புச் சான்று', 'மொபைல் எண்',
  'இணைக்க வேண்டிய மொபைல் எண்', 'அனைத்து குடும்ப உறுப்பினர் ஆதார்',
];

export default function DocumentReadinessScore({ navigate }) {
  const [selectedService, setSelectedService] = useState('');
  const [checkedDocs, setCheckedDocs] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const requiredDocs = selectedService ? (SERVICE_DOCS[selectedService] || []) : [];

  const toggleDoc = (doc) => {
    setCheckedDocs(prev => ({ ...prev, [doc]: !prev[doc] }));
  };

  const readyCount = requiredDocs.filter(d => checkedDocs[d]).length;
  const totalCount = requiredDocs.length;
  const scorePercent = totalCount > 0 ? Math.round((readyCount / totalCount) * 100) : 0;
  const missingDocs = requiredDocs.filter(d => !checkedDocs[d]);

  const scoreColor = scorePercent === 100 ? '#16a34a' : scorePercent >= 60 ? '#d97706' : '#dc2626';
  const scoreLabel = scorePercent === 100 ? '🎉 முற்றிலும் தயார்!' : scorePercent >= 60 ? '⚠️ கிட்டத்தட்ட தயார்' : '❌ சில ஆவணங்கள் குறைவு';

  return (
    <div style={{
      background: 'white',
      border: '1.5px solid #e2e8f0',
      borderRadius: '18px',
      overflow: 'hidden',
      marginTop: '28px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.06)'
    }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0052cc 0%, #1d4ed8 100%)', padding: '18px 24px' }}>
        <div style={{ color: '#bfdbfe', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>SMART TOOL</div>
        <div style={{ color: 'white', fontSize: '19px', fontWeight: 800, fontFamily: 'Manrope, sans-serif', marginTop: '2px' }}>
          📂 உங்கள் ஆவண தயார்நிலை சோதனை
        </div>
        <div style={{ color: '#bfdbfe', fontSize: '12px', marginTop: '3px' }}>
          சேவையைத் தேர்ந்தெடுத்து, உங்களிடம் உள்ள ஆவணங்களை தெரிவு செய்யுங்கள் — உடனே score தெரியும்!
        </div>
      </div>

      <div style={{ padding: '22px 24px' }}>
        {/* Service selector */}
        <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
          1️⃣ சேவையைத் தேர்ந்தெடுங்கள்:
        </label>
        <select
          value={selectedService}
          onChange={e => { setSelectedService(e.target.value); setCheckedDocs({}); setSubmitted(false); }}
          style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#0f172a', background: '#f8fafc', outline: 'none', marginBottom: '20px', cursor: 'pointer' }}
        >
          <option value="">-- சேவையைத் தேர்ந்தெடுங்கள் --</option>
          {Object.keys(SERVICE_DOCS).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {selectedService && (
          <>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '10px' }}>
              2️⃣ உங்களிடம் உள்ள ஆவணங்களை ✅ தெரிவு செய்யுங்கள்:
            </label>
            <div style={{ display: 'grid', gap: '8px', marginBottom: '20px' }}>
              {requiredDocs.map(doc => (
                <label key={doc} onClick={() => toggleDoc(doc)} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
                  background: checkedDocs[doc] ? '#f0fdf4' : '#f8fafc',
                  border: `1.5px solid ${checkedDocs[doc] ? '#86efac' : '#e2e8f0'}`,
                  borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s ease'
                }}>
                  {checkedDocs[doc]
                    ? <CheckCircle2 size={20} color="#16a34a" />
                    : <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #cbd5e1' }} />
                  }
                  <span style={{ fontSize: '13px', fontWeight: 600, color: checkedDocs[doc] ? '#15803d' : '#374151' }}>{doc}</span>
                </label>
              ))}
            </div>

            {/* Score bar */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151' }}>உங்கள் தயார்நிலை:</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: scoreColor, fontFamily: 'Manrope' }}>{scorePercent}%</span>
              </div>
              <div style={{ background: '#e2e8f0', borderRadius: '8px', height: '12px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{
                  height: '100%',
                  width: `${scorePercent}%`,
                  background: scoreColor,
                  borderRadius: '8px',
                  transition: 'width 0.6s ease'
                }} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: scoreColor }}>{scoreLabel}</div>

              {missingDocs.length > 0 && (
                <div style={{ marginTop: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626', marginBottom: '6px' }}>❌ இந்த ஆவணங்கள் இன்னும் வேண்டும்:</div>
                  {missingDocs.map(doc => (
                    <div key={doc} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#b91c1c', marginTop: '4px' }}>
                      <XCircle size={13} /> {doc}
                    </div>
                  ))}
                </div>
              )}

              {scorePercent === 100 && (
                <button
                  onClick={() => typeof navigate === 'function' && navigate('customer')}
                  style={{ marginTop: '14px', width: '100%', padding: '12px', background: 'linear-gradient(135deg, #16a34a 0%, #022c7a 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  🎉 எல்லாம் தயார்! இப்போதே விண்ணப்பிக்க <ChevronRight size={16} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
