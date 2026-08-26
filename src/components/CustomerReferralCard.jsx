import React, { useState, useMemo } from 'react';
import { Share2, Copy, CheckCircle2, Gift } from 'lucide-react';
import { saveReferralCloud } from '../utils/dataService';

function generateCode(name) {
  const base = name.trim().toUpperCase().replace(/\s+/g, '').slice(0, 4) || 'AKE';
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${base}${rand}`;
}

export default function CustomerReferralCard({ customerName = '' }) {
  const [name, setName] = useState(customerName);
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    if (!name.trim()) return;
    const c = generateCode(name);
    saveReferralCloud(c, { name: name.trim(), code: c, referrals: 0, createdAt: new Date().toISOString() });
    setCode(c);
    setGenerated(true);
  };

  const shareText = `🙏 வணக்கம்!\n\nAkEsevai Digital Service Centre, Palani-ல் Aadhaar, Income Certificate, Voter Card, Passport உள்ளிட்ட அனைத்து அரசு சேவைகளும் ஒரே இடத்தில்!\n\n🎁 என் referral code: *${code}*\n\n📞 93423 18844\n🔗 https://akesevai.in`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShare = () => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

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
      <div style={{ background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', padding: '18px 24px' }}>
        <div style={{ color: '#fde68a', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>REFERRAL PROGRAM</div>
        <div style={{ color: 'white', fontSize: '19px', fontWeight: 800, fontFamily: 'Manrope, sans-serif', marginTop: '2px' }}>
          🎁 நண்பர்களை அழையுங்கள்!
        </div>
        <div style={{ color: '#fde68a', fontSize: '12px', marginTop: '3px' }}>
          உங்கள் unique code share பண்ணி AkEsevai-ஐ பரவலாக்குங்கள்.
        </div>
      </div>

      <div style={{ padding: '22px 24px' }}>
        {!generated ? (
          <>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '14px 16px', marginBottom: '18px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Gift size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '12px', color: '#92400e', lineHeight: 1.6 }}>
                உங்கள் பெயரில் ஒரு <strong>unique referral code</strong> உருவாக்கி அதை WhatsApp-ல் share பண்ணுங்கள். நண்பர்களுக்கு AkEsevai-ஐ அறிமுகப்படுத்துங்கள்!
              </div>
            </div>
            <label htmlFor="referral-customer-name" style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
              👤 உங்கள் பெயர்:
            </label>
            <input
              id="referral-customer-name"
              name="customer_name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="உங்கள் முழு பெயர் உள்ளிடவும்"
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box', marginBottom: '14px' }}
            />
            <button
              onClick={handleGenerate}
              disabled={!name.trim()}
              style={{
                width: '100%', padding: '13px', background: name.trim() ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' : '#e2e8f0',
                color: name.trim() ? 'white' : '#94a3b8', border: 'none', borderRadius: '10px',
                fontSize: '13px', fontWeight: 800, cursor: name.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              <Gift size={16} /> Referral Code உருவாக்கவும்
            </button>
          </>
        ) : (
          <>
            {/* Generated code display */}
            <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', border: '2px solid #f59e0b', borderRadius: '14px', padding: '20px', textAlign: 'center', marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>உங்கள் Unique Referral Code</div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#78350f', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.1em' }}>{code}</div>
              <div style={{ fontSize: '11px', color: '#92400e', marginTop: '6px' }}>இந்த code-ஐ நண்பர்களுக்கு share பண்ணுங்கள்!</div>
            </div>

            {/* Message preview */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', fontSize: '12px', color: '#374151', lineHeight: 1.7, marginBottom: '14px', whiteSpace: 'pre-line' }}>
              {shareText}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={handleCopy}
                style={{
                  padding: '11px', background: copied ? '#16a34a' : '#f1f5f9', color: copied ? 'white' : '#374151',
                  border: `1.5px solid ${copied ? '#86efac' : '#e2e8f0'}`,
                  borderRadius: '10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s'
                }}
              >
                {copied ? <><CheckCircle2 size={14} /> Copied!</> : <><Copy size={14} /> Text Copy</>}
              </button>
              <button
                onClick={handleShare}
                style={{
                  padding: '11px', background: '#25D366', color: 'white', border: 'none',
                  borderRadius: '10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: '0 4px 12px rgba(37,211,102,0.35)'
                }}
              >
                <Share2 size={14} /> WhatsApp Share
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
