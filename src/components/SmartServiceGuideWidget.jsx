import React, { useState } from 'react';
import { Search, BookOpen, CheckCircle2, MessageCircle, ArrowRight, ShieldCheck, Sparkles, FileText } from 'lucide-react';

const serviceGuideData = [
  {
    id: 'income',
    title: 'வருமானச் சான்றிதழ் (Income Certificate)',
    fee: '₹60',
    time: '3 முதல் 7 நாட்கள்',
    dept: 'வருவாய்த் துறை (Revenue Dept)',
    docs: ['ஆதார் கார்டு', 'குடும்ப அட்டை (Ration Card)', 'சம்பளச் சான்று / வருமானச் சுயஉறுதிமொழி படிவம்', 'பாஸ்போர்ட் சைஸ் போட்டோ'],
    note: 'மாணவர் கல்வி உதவித்தொகை மற்றும் பள்ளி சேர்க்கைக்கு மிக முக்கியம்.'
  },
  {
    id: 'community',
    title: 'சாதிச் சான்றிதழ் (Community Certificate)',
    fee: '₹60',
    time: '5 முதல் 10 நாட்கள்',
    dept: 'வருவாய்த் துறை (Revenue Dept)',
    docs: ['ஆதார் கார்டு', 'குடும்ப அட்டை', 'பெற்றோர் / உடன்பிறந்தோர் சாதிச் சான்று', 'பள்ளி மாற்றுச் சான்றிதழ் (TC)'],
    note: 'BC/MBC/SC/ST பிரிவினருக்கு அரசு வேலை & பள்ளி/கல்லூரி சேர்க்கைக்குத் தேவை.'
  },
  {
    id: 'nativity',
    title: 'இருப்பிடச் சான்றிதழ் (Nativity / Residence Cert)',
    fee: '₹60',
    time: '3 முதல் 5 நாட்கள்',
    dept: 'வருவாய்த் துறை (Revenue Dept)',
    docs: ['ஆதார் கார்டு', 'குடும்ப அட்டை', '5 ஆண்டுகள் இருப்பிடச் சான்று (மின் ரசீது / வாக்காளர் அட்டை)', 'பாஸ்போர்ட் போட்டோ'],
    note: 'தமிழ்நாடு அரசு வேலை மற்றும் உள்ளூர் ஒதுக்கீடுகளுக்குப் பயன்படும்.'
  },
  {
    id: 'firstgrad',
    title: 'முதல் பட்டதாரி சான்றிதழ் (First Graduate Cert)',
    fee: '₹60',
    time: '7 முதல் 12 நாட்கள்',
    dept: 'வருவாய்த் துறை (Revenue Dept)',
    docs: ['ஆதார் கார்டு', 'குடும்ப அட்டை', 'பட்டப்படிப்பு சேர்க்கைக் கடிதம்', 'குடும்பத்தில் வேறு யாரும் பட்டதாரி இல்லை என்ற உறுதிமொழி'],
    note: 'கல்லூரி படிப்புக் கட்டணக் கழிவு பெற உதவும்.'
  },
  {
    id: 'smartcard',
    title: 'ஸ்மார்ட் குடும்ப அட்டை (New Smart Ration Card)',
    fee: '₹100',
    time: '15 முதல் 30 நாட்கள்',
    dept: 'உணவுப் பொருள் வழங்கல் துறை',
    docs: ['அனைத்து குடும்ப உறுப்பினர்களின் ஆதார்', 'திருமணச் சான்றிதழ் / பெற்றோர் அட்டையிலிருந்து பெயர் நீக்கிய சான்று', 'வாடகை ஒப்பந்தம் / கேஸ் ரசீது', 'குடும்பத் தலைவர் போட்டோ'],
    note: 'புதிய குடும்பங்களுக்கு அத்தியாவசிய ரேஷன் பொருட்கள் பெற உதவும்.'
  },
  {
    id: 'passport',
    title: 'புதிய பாஸ்போர்ட் (New Indian Passport)',
    fee: '₹1500 + சேவை கட்டணம்',
    time: '10 முதல் 15 நாட்கள்',
    dept: 'பாஸ்போர்ட் சேவா கேந்திரா',
    docs: ['ஆதார் கார்டு', 'பிறப்புச் சான்றிதழ் / 10வது மார்க்ஷீட் (Non-ICR)', 'வங்கி பாஸ்புக் / முகவரிச் சான்று', 'பாஸ்போர்ட் போட்டோ'],
    note: 'வெளிநாட்டுப் பயணம் மற்றும் விசா விண்ணப்பங்களுக்கு.'
  }
];

export default function SmartServiceGuideWidget() {
  const [selectedService, setSelectedService] = useState(serviceGuideData[0]);
  const [phone, setPhone] = useState('');
  const [sentMsg, setSentMsg] = useState('');

  const handleSendChecklistToWhatsapp = (e) => {
    e.preventDefault();
    const targetPhone = phone.trim() || '9342318844';
    const text = encodeURIComponent(
      `📋 *AkEsevai ஆவணங்கள் பட்டியல்*\n\n` +
      `சேவை: *${selectedService.title}*\n` +
      `அரசு கட்டணம்: *${selectedService.fee}*\n` +
      `எதிர்பார்க்கும் நேரம்: *${selectedService.time}*\n\n` +
      `📌 *தேவைப்படும் அசல் ஆவணங்கள்:*\n` +
      selectedService.docs.map((d, i) => `${i + 1}. ${d}`).join('\n') +
      `\n\n💡 *குறிப்பு:* ${selectedService.note}\n\n` +
      `AkEsevai மையம், பழனி • தொடர்புக்கு: 9342318844`
    );

    window.open(`https://wa.me/91${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
    setSentMsg('✅ ஆவணப் பட்டியல் WhatsApp-க்கு அனுப்பப்பட்டது!');
    setTimeout(() => setSentMsg(''), 3500);
  };

  return (
    <div className="smart-guide-card-container">
      <div className="guide-header">
        <span className="guide-kicker">
          <BookOpen size={15} /> SMART SERVICE GUIDE • சேவை ஆவண வழிகாட்டி
        </span>
        <h3 className="guide-title">
          சேவைகளுக்கான <span>ஆவணப் பட்டியல் & கட்டண விபரம்</span>
        </h3>
        <p className="guide-sub">
          எந்த சேவைக்கு என்னென்ன அசல் ஆவணங்கள் தேவைப்படும் என்பதைத் தெரிந்துகொண்டு 1-கிளிக்கில் WhatsApp-ல் ஆவணப் பட்டியலைப் பெறலாம்.
        </p>
      </div>

      <div className="guide-body-grid">
        {/* LEFT SERVICE SELECTOR */}
        <div className="guide-left-list">
          <label className="guide-label">சேவையைத் தேர்ந்தெடுக்கவும்:</label>
          <div className="service-buttons-stack">
            {serviceGuideData.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedService(item)}
                className={`guide-service-btn ${selectedService.id === item.id ? 'active-guide-btn' : ''}`}
              >
                <FileText size={16} />
                <span>{item.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT DETAILS DISPLAY & WHATSAPP DISPATCH */}
        <div className="guide-right-display">
          <div className="guide-details-card">
            <h4 className="detail-service-title">{selectedService.title}</h4>
            <div className="detail-meta-row">
              <span className="meta-badge fee">💰 கட்டணம்: {selectedService.fee}</span>
              <span className="meta-badge time">⏱️ காலம்: {selectedService.time}</span>
              <span className="meta-badge dept">🏛️ {selectedService.dept}</span>
            </div>

            <h5 className="docs-head-title">📋 தேவைப்படும் அசல் ஆவணங்கள்:</h5>
            <ul className="docs-bullet-list">
              {selectedService.docs.map((doc, index) => (
                <li key={index}>
                  <CheckCircle2 size={15} color="#16a34a" /> <span>{doc}</span>
                </li>
              ))}
            </ul>

            <div className="guide-note-box">
              💡 <strong>முக்கியக் குறிப்பு:</strong> {selectedService.note}
            </div>

            {/* 1-CLICK WHATSAPP CHECKLIST DISPATCH FORM */}
            <form onSubmit={handleSendChecklistToWhatsapp} className="whatsapp-dispatch-form">
              <label className="wa-dispatch-label">
                📲 இந்த ஆவணப் பட்டியலை உங்கள் WhatsApp-க்கு அனுப்ப:
              </label>
              <div className="wa-input-group">
                <input
                  type="tel"
                  placeholder="10 இலக்க மொபைல் எண்..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="wa-phone-input"
                />
                <button type="submit" className="wa-send-btn">
                  <MessageCircle size={16} /> WhatsApp-ல் பெற
                </button>
              </div>
              {sentMsg && <small className="wa-sent-msg">{sentMsg}</small>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
