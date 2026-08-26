import React, { useState } from 'react';
import { MessageCircle, ChevronRight, Send } from 'lucide-react';

const serviceCatalogWA = [
  'வருமானச்சான்று (Income Certificate)',
  'சாதிச்சான்று (Community Certificate)',
  'பிறப்பிடச்சான்று (Nativity Certificate)',
  'இருப்பிடச்சான்று (Residence Certificate)',
  'முதல் பட்டதாரி சான்றிதழ் (First Graduate)',
  'வாரிசு சான்றிதழ் (Legal Heir)',
  'ஆதார் மொபைல் எண் மாற்றம்',
  'ஆதார் முகவரி மாற்றம்',
  'புதிய குடும்ப அட்டை / Smart Card',
  'பான்கார்டு / PAN Card',
  'பாஸ்போர்ட் (Passport)',
  'புதிய வாக்காளர் அட்டை (Voter Card)',
  'வேலைவாய்ப்பு பதிவு (Employment)',
  'e-SHRAM CARD',
  'முதியோர் / விதவை ஓய்வூதியம் (Pension)',
  'TNPSC விண்ணப்பம்',
  'EPFO Claim',
  'கல்விக்கடன் (Education Loan)',
  'வேறு சேவை (Other Service)',
];

export default function WhatsAppQuickFormWidget() {
  const [selectedService, setSelectedService] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!selectedService || !name.trim() || phone.trim().length < 10) return;
    const msg = encodeURIComponent(
      `🙏 *வணக்கம் AkEsevai*,\n\nநான் ${name} (📞 ${phone}).\n\nதேவையான சேவை: *${selectedService}*\n\nஆவண பட்டியல் மற்றும் நேரடி உதவி தேவை. தயவுசெய்து தொடர்புகொள்ளவும்.\n\n_AkEsevai இணையதளம் மூலம் அனுப்பப்பட்டது._`
    );
    window.open(`https://wa.me/919342318844?text=${msg}`, '_blank', 'noopener,noreferrer');
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div style={{
      background: 'white',
      border: '1.5px solid #d1fae5',
      borderRadius: '18px',
      padding: '28px 28px 24px',
      marginTop: '28px',
      boxShadow: '0 8px 32px rgba(21,128,61,0.08)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Green top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #25D366, #16a34a)', borderRadius: '18px 18px 0 0' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <div style={{ width: 40, height: 40, background: '#dcfce7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MessageCircle size={20} color="#16a34a" />
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.07em' }}>WHATSAPP QUICK HELP</div>
          <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', fontFamily: 'Manrope, sans-serif' }}>ஆவண பட்டியல் WhatsApp-ல் பெறுக 📋</div>
        </div>
      </div>
      <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '20px', lineHeight: 1.6 }}>
        உங்கள் சேவையைத் தேர்ந்தெடுத்து பெயர் மற்றும் எண் கொடுங்கள் — நேரடியாக AkEsevai admin-க்கு WhatsApp message போகும்!
      </p>

      <div style={{ display: 'grid', gap: '14px' }}>
        <div>
          <label htmlFor="wa-widget-service-select" style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
            📋 உங்கள் தேவையான சேவை தேர்ந்தெடுக்கவும்
          </label>
          <select
            id="wa-widget-service-select"
            name="wa_service"
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #d1fae5', borderRadius: '10px', fontSize: '13px', fontWeight: 600, color: '#0f172a', background: '#f0fdf4', outline: 'none', cursor: 'pointer' }}
          >
            <option value="">-- சேவையைத் தேர்ந்தெடுங்கள் --</option>
            {serviceCatalogWA.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label htmlFor="wa-widget-user-name" style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>👤 உங்கள் பெயர்</label>
            <input
              id="wa-widget-user-name"
              name="user_name"
              autoComplete="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="உங்கள் முழு பெயர்"
              style={{ width: '100%', padding: '10px 13px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label htmlFor="wa-widget-user-phone" style={{ fontSize: '11px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>📞 கைபேசி எண்</label>
            <input
              id="wa-widget-user-phone"
              name="user_phone"
              autoComplete="tel"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10 இலக்க எண்"
              style={{ width: '100%', padding: '10px 13px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!selectedService || !name.trim() || phone.trim().length < 10}
          style={{
            width: '100%',
            padding: '14px',
            background: sent ? '#16a34a' : 'linear-gradient(135deg, #25D366 0%, #16a34a 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 800,
            cursor: (!selectedService || !name.trim() || phone.trim().length < 10) ? 'not-allowed' : 'pointer',
            opacity: (!selectedService || !name.trim() || phone.trim().length < 10) ? 0.55 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: '0 6px 18px rgba(37,211,102,0.3)'
          }}
        >
          {sent ? '✅ WhatsApp திறக்கப்பட்டது! Admin தொடர்பு கொள்வார்.' : <><Send size={16} /> WhatsApp-ல் ஆவண பட்டியல் கேளுங்கள்</>}
        </button>
        <p style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', margin: 0 }}>
          🔒 உங்கள் தகவல்கள் பாதுகாப்பாக உள்ளன • AkEsevai மட்டுமே பார்க்கும்
        </p>
      </div>
    </div>
  );
}
